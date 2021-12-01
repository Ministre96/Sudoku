<?php
    try {
        $db = new PDO("pgsql:host=localhost;port=5433;dbname=js2119@cours.endor.be;user=js2119;password=rochau43mifloi");
    } catch (PDOException $e){
        echo "Pas de connection";
        die($e -> getMessage());
    }
