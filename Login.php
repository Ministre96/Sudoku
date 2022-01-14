<?php
    try {
        $db = new PDO("pgsql:host=localhost;port=5433;dbname=js2119;user=js2119;password=rochau43mifloi");
        if ($db){
            $name = $_POST["name"];
            $password = $_POST["password"];

            $result = $db->prepare("SELECT pid, pass FROM players WHERE name=? LIMIT 1");
            $result->execute([$name]);

            if ($row = $result -> fetch()){
                echo $row[0];
            } else {
                echo "0";
            }
        }
    } catch (PDOException $e){
        echo "No connection";
        die($e -> getMessage());
    }