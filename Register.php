<?php
    try {
        $db = new PDO("pgsql:host=localhost;port=5433;dbname=js2119;user=js2119;password=rochau43mifloi");
        if ($db){
            $name = $_POST["name"];
            $password = $_POST["password"];

            if ($name != ""){
                $result = $db->prepare("INSERT INTO players(name, pass) VALUES(?, ?)");
                $result->execute([$name, $password]);
                $id = $db -> lastInsertId();
                echo $id;
            } else {
                echo "0";
            }
        }
    } catch (PDOException $e){
        echo "No connection";
        die($e -> getMessage());
    }