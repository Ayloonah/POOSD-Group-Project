<?php
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
    else
	{
        $inData = getRequestInfo();
        $firstName = $inData["firstName"];
        $lastName = $inData["lastName"];
        $phone = $inData["phone"];
        $email = $inData["email"];
        $contactID = $inData["contactID"];
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName= ?, LastName=?, Phone=?, Email=? WHERE ID = ?");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $contactID);
		$stmt->execute();
        if ($stmt->affected_rows > 0)
		{
    		returnWithInfo("Contact Updated!"); // success
		}
		else
		{
    		returnWithError("Contact Could Not Be Updated");
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
