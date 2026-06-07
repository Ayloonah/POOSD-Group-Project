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
        if (!isset($inData["userID"]))
		{
   		 returnWithError("Missing userID");
    		exit();
		}

		$userID = $inData["userID"];

		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=?");

		if (!$stmt)
		{
    		returnWithError("Statement prepare failed: " . $conn->error);
    		exit();
		}

		$stmt->bind_param("i", $userID);
        if (!$stmt->execute())
  		{
    		returnWithError("Execute failed: " . $stmt->error);
    		exit();
  		}
         $result = $stmt->get_result();
		if (!$result)
 		{
    		returnWithError("Getting result failed: " . $stmt->error);
    		exit();
  		}	
		$results = "";

         while($row = $result->fetch_assoc())
            {
                if ($results != "")
                    {
                        $results .= ",";
                    }
                    $results .= '{"ID":"' . $row["ID"] . '",';
                    $results .= '"FirstName":"' . $row["FirstName"] . '",';
                    $results .= '"LastName":"' . $row["LastName"] . '",';
                    $results .= '"Phone":"' . $row["Phone"] . '",';
                    $results .= '"Email":"' . $row["Email"] . '"}';
            }
			 $stmt->close();
			$conn->close();
            if($results == "")
                {
                    returnWithError("Contact Not Found!");
                    exit();
                }
            else
                {
                    returnWithInfo($results);
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
    	$retValue = '{"results":[],"error":"' . $err . '"}';
    	sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($results)
	{
		$retValue = '{"results":[' . $results . '],"error":""}';
		sendResultInfoAsJson($retValue);
	}
?>
