<?php

    header("Content-Type: application/json");

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
        exit();
	}

    if (!isset($inData["action"]))
    {
        returnWithError("Missing action");
        exit();
    }

    if ($inData["action"] == "login")
    {
        login($conn, $inData);
    } 
    else if ($inData["action"] == "register")
    {
        register($conn, $inData);
    }
    else
    {
        returnWithError("Invalid action");
    }
    
    $conn->close();

    function login($conn, $inData)
    {
        $stmt = $conn->prepare(
            "SELECT ID, FirstName, LastName, Password
            FROM Users
            WHERE Login=?"
        );

        $stmt->bind_param("s", $inData["login"]);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc())
        {
            if (password_verify($inData["password"], $row["Password"]))
            {
                returnWithInfo(
                    $row["FirstName"],
                    $row["LastName"],
                    $row["ID"]
                );
            }
            else
            {
                returnWithError("Invalid login or password");
            }
        }
        else
        {
            returnWithError("Invalid login or password");
        }

        $stmt->close();
    }

    function register($conn, $inData)
    {
        $checkStmt = $conn->prepare(
            "SELECT ID FROM Users WHERE Login=?"
        );

        $checkStmt->bind_param("s", $inData["login"]);
        $checkStmt->execute();

        $checkResult = $checkStmt->get_result();

        if ($checkResult->fetch_assoc())
        {
            returnWithError("Login already exists");
            $checkStmt->close();
            return;
        }

        $checkStmt->close();

        $hashedPassword = password_hash(
            $inData["password"], 
            PASSWORD_DEFAULT
        );

        $stmt = $conn->prepare(
            "INSERT INTO Users
            (FirstName, LastName, Login, Password)
            VALUES (?, ?, ?, ?)"
        );

        $stmt->bind_param(
            "ssss",
            $inData["firstName"],
            $inData["lastName"],
            $inData["login"],
            $hashedPassword
        );

        if ($stmt->execute())
        {
            returnWithInfo(
                $inData["firstName"],
                $inData["lastName"],
                $conn->insert_id
            );
        }
        else
        {
            returnWithError("Registration failed");
        }

        $stmt->close();
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
	
	function returnWithInfo($firstName, $lastName, $id)
	{
		$retValue = 
            '{"id":' .
            $id . 
            ',"firstName":"' .
            $firstName . 
            '","lastName":"' . 
            $lastName . 
            '","error":""}';
		sendResultInfoAsJson($retValue);
	}
	
?>
