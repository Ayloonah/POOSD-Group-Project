<?php

	header("Content-Type: application/json");

	$inData = getRequestInfo();

	if( empty($inData["firstName"]) || empty($inData["lastName"]) || empty($inData["login"]) || empty($inData["password"]) )
	{
		returnWithError("Please fill in all fields.");
		exit();
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
		exit();
	}

	$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
	$stmt->bind_param("s", $inData["login"]);
	$stmt->execute();
	$result = $stmt->get_result();

	if( $result->fetch_assoc() )
	{
		returnWithError("Username already exists.");
		$stmt->close();
		$conn->close();
		exit();
	}

	$stmt->close();

	$hashedPassword = password_hash($inData["password"], PASSWORD_DEFAULT);

	$stmt = $conn->prepare("INSERT INTO Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
	$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $hashedPassword);

	if( $stmt->execute() )
	{
		returnWithError("");
	}
	else
	{
		returnWithError("Registration failed. Please try again.");
	}

	$stmt->close();
	$conn->close();

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		echo json_encode($obj);
	}

	function returnWithError( $err )
	{
		$retValue = array("error" => $err);
		sendResultInfoAsJson( $retValue );
	}

?>
