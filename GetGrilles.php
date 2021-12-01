<?php
    try {
        $db = new PDO("pgsql:host=localhost;port=5433;dbname=js2119@cours.endor.be;user=js2119;password=rochau43mifloi");
        if ($db){
            echo "Connect to the database successfully!";
        }
    } catch (PDOException $e){
        echo "No connection";
        die($e -> getMessage());
    }
    $gid = $_POST["gid"];

    $sql = 'SELECT grille FROM grilles WHERE gid = $gid';
    $result = $db -> query($sql);
    $result->execute();

    if ($result){
        // envoyer la réponse dans le js sous forme de JSON
        echo json_encode($result);
    } else {
        echo "No grilles here";
    }
