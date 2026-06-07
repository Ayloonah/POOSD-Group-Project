<?php
  $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");  
  $inData = getRequestInfo();
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
	function returnWithInfo($msg)
  {
    $retValue = '{"message":"' . $msg . '","error":""}';
    sendResultInfoAsJson($retValue);
  }
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
		exit();
	} 
	if(!$inData)
	{
		returnWithError("Invalid JSON input");
		exit();
	}
	
	if (!isset($inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["userID"]))
  	{
    	returnWithError("Missing required field");
    	exit();
  	}	
	 $firstName = $inData["firstName"];
 	 $lastName = $inData["lastName"];
 	 $phone = $inData["phone"];
  	 $email = $inData["email"];
 	 $userID = $inData["userID"];
	$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName, Phone, Email, UserId) VALUES(?,?,?,?,?)");
	if (!$stmt)
  	{
   	 	returnWithError("Statement prepare failed: " . $conn->error);
    	exit();
  	}
	$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userID);
	 if (!$stmt->execute())
  	{
    	returnWithError("Execute failed: " . $stmt->error);
    	exit();
  	}
  
		$stmt->close();
		$conn->close();
		returnWithInfo("Contact Added!");
  ?>
