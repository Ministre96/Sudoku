<?php
    try {
        $db = new PDO("pgsql:host=localhost;port=5433;dbname=js2119;user=js2119;password=rochau43mifloi");
        if ($db){
            $idGrille = $_POST["idGrille"];
            $idPlayer = $_POST["idPlayer"];

            if ($idGrille != 0 && $idPlayer != 0){
                $result = $db->prepare("INSERT INTO playedgrid(pid, gid) VALUES(?, ?)");
                $result->execute([$idPlayer, $idGrille]);
                echo "0";
            } else {
                echo "1";
            }
        }
    } catch (PDOException $e){
        echo "No connection";
        die($e -> getMessage());
    }