	<?php
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");  
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
    else
	{
        $inData = getRequestInfo();
		if (!$inData) 
		{
    	returnWithError("Invalid JSON input");
    	exit();
		}

		if (!isset($inData["contactID"])) 
		{
   		 	returnWithError("Missing contactID");
    		exit();
		}
        $contactID = $inData["contactID"];
		$stmt = $conn->prepare("DELETE from Contacts where ID=?");
		if (!$stmt)
		{
    		returnWithError("Statement prepare failed: " . $conn->error);
    		exit();
		}
		$stmt->bind_param("i", $contactID);
		$stmt->execute();
		if (!$stmt->execute()) 
		{
    		returnWithError("Execute failed: " . $stmt->error);
    		exit();
		}
        if ($stmt->affected_rows > 0)
		{
    		returnWithInfo("Contact Deleted!"); // success
		}
		else
		{
    		returnWithError("No contact found or nothing deleted");
		}
        $stmt->close();
        $conn->close();
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
	
