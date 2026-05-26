	<?php
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");  
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
    else
	{
        $inData = getRequestInfo();
        $contactID = $inData["contactID"];
		$stmt = $conn->prepare("DELETE from Contacts where ID=?");
		$stmt->bind_param("i", $contactID);
		$stmt->execute();
        if ($stmt->affected_rows > 0)
		{
    		returnWithError(""); // success
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
	
