<?php
  $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");  
  $inData = getRequestInfo();
  $firstName = $inData["firstName"];
  $lastName = $inData["lastName"];
  $phone = $inData["phone"];
  $email = $inData["email"];
  $userID = $inData["userID"];
  function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
    function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
    else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName, Phone, Email, UserId) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}
  ?>
