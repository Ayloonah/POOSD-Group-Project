<?php
  $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");  
  if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		 $inData = getRequestInfo();
         $results = "";
         $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=?");
         $stmt->bind_param("i", $inData["userID"]);
         $stmt->execute();
         $result = $stmt->get_result();
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
            if($results == "")
                {
                    returnWithError("Contact Not Found!");
                    exit();
                }
            else
                {
                    returnWithInfo($results);
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
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = 
            '{"id":0,"firstName":"","lastName":"","error":"' .
            $err .
            '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($results)
	{
		$retValue = '{"results":[' . $results . '],"error":""}';
		sendResultInfoAsJson($retValue);
	}
?>
