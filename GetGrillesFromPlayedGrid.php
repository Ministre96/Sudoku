<?php
    try {
        $db = new PDO("pgsql:host=localhost;port=5433;dbname=js2119;user=js2119;password=rochau43mifloi");
        if ($db){
            $id = $_POST["id"];
            // select imbriqué qui retourne direct un chiffre random dans les grilles non faites de l'user
            $result = $db->prepare("SELECT gid FROM grilles WHERE gid NOT IN (SELECT gid FROM playedgrid WHERE pid=?) ORDER BY random() LIMIT 1");
            $result ->execute([$id]);

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