<?php

    header("Content-Type: application/json");
    
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
        exit();
	}
    $inData = getRequestInfo();

    $userID = $inData["userID"];
    $search = "%" . $inData["search"] . "%";

    $stmt = $conn->prepare(
        "SELECT ID, FirstName, LastName, Phone, Email, DateCreated
        FROM Contacts
        WHERE UserID = ?
        AND (
            FirstName LIKE ?
            OR LastName LIKE ?
            OR Phone LIKE ?
            OR Email LIKE ?
        )"
    );

    $stmt->bind_param(
        "issss",
        $userID,
        $search,
        $search,
        $search,
        $search
    );
    
    if ($stmt->execute())
    {
        $contacts = [];
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $contacts[] = [
                "id" => $row["ID"],
                "firstName" => $row["FirstName"],
                "lastName" => $row["LastName"],
                "phone" => $row["Phone"],
                "email" => $row["Email"],
                "dateCreated" => $row["DateCreated"]
            ];
        }

        returnWithInfo($contacts);
    } else {
        returnWithError("Search failed");
    }

    $stmt->close();
    $conn->close();

    function getRequestInfo() {
		return json_decode(
            file_get_contents('php://input'),
            true
        );
	}

	function sendResultInfoAsJson($obj) {
        echo json_encode($obj);
    }
	
	function returnWithError($err) {
		sendResultInfoAsJson([
            "results" => [],
            "error" => $err
        ]);
	}
	
	function returnWithInfo($contacts) {
		sendResultInfoAsJson([
            "results" => $contacts,
            "error" => ""
        ]);
	}

?>