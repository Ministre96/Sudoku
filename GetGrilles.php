<?php
    try {
        $db = new PDO("pgsql:host=localhost;port=5433;dbname=js2119;user=js2119;password=rochau43mifloi");
        if ($db){

            $sql = "SELECT * FROM grilles";
            $result = $db -> prepare($sql);
            $result->execute();

            if ($result){
                // envoyer la réponse dans le js sous forme de JSON
                echo (json_encode($result));
            } else {
                echo "No grilles here";
            }
        }
    } catch (PDOException $e){
        echo "No connection";
        die($e -> getMessage());
    }

