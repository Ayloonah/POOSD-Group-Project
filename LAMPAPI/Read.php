<?php
  $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");  
  if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		 $inData = getRequestInfo();
         $searchResults = "";
         $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=? AND (FirstName LIKE ? OR LastName LIKE ?)");
         $search = "%" . $inData["search"] . "%";
         $stmt->bind_param("iss", $inData["userID"], $search, $search);
         $stmt->execute();
         $result = $stmt->get_result();
         while($row = $result->fetch_assoc())
            {
                if ($searchResults != "")
                    {
                        $searchResults .= ",";
                    }
                    $searchResults .= '{"ID":"' . $row["ID"] . '",';
                    $searchResults .= '"FirstName":"' . $row["FirstName"] . '",';
                    $searchResults .= '"LastName":"' . $row["LastName"] . '",';
                    $searchResults .= '"Phone":"' . $row["Phone"] . '",';
                    $searchResults .= '"Email":"' . $row["Email"] . '"}';
            }
            if($searchResults == "")
                {
                    returnWithError("Contact Not Found!");
                    exit();
                }
            else
                {
                    returnWithInfo($searchResults);
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
	
	function returnWithInfo($searchResults)
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson($retValue);
	}
?>
