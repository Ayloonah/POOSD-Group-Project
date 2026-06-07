<?php
    	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    	if ($conn->connect_error) 
		{
			returnWithError( $conn->connect_error );
			exit();
		} 
    
        $inData = getRequestInfo();
		 if (!$inData)
    	{
        	returnWithError("Invalid JSON input");
        	exit();
    	}
		if (!isset($inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["contactID"]))
    	{
        	returnWithError("Missing required field");
        	exit();
    	}
        $firstName = $inData["firstName"];
        $lastName = $inData["lastName"];
        $phone = $inData["phone"];
        $email = $inData["email"];
        $contactID = $inData["contactID"];
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName= ?, LastName=?, Phone=?, Email=? WHERE ID = ?");
		  if (!$stmt)
    	{
        	returnWithError("Statement prepare failed: " . $conn->error);
        	exit();
    	}
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $contactID);
		if (!$stmt->execute())
    	{
        	returnWithError("Execute failed: " . $stmt->error);
        	exit();
	    }
        if ($stmt->affected_rows > 0)
		{
			$stmt->close();
			$conn->close();
    		returnWithInfo("Contact Updated!"); // success
			exit();
		}
		else
		{
			$stmt->close();
			$conn->close();
    		returnWithError("Contact Could Not Be Updated");
			exit();
		}
   	 function getRequestInfo()
		{
			return json_decode(
            	file_get_contents('php://input'),
            	true
       	 	);
		}

	function sendResultInfoAsJson($obj)
	{
        header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = 
            '{"error":"' .$err .'"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($msg)
	{
		$retValue = 
            '{"message":"' .$msg . '","error":""}';
		sendResultInfoAsJson($retValue);
	}
?>
