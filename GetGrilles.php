<?php
    try {
        $db = new PDO("pgsql:host=localhost;port=5433;dbname=js2119;user=js2119;password=rochau43mifloi");
        if ($db){
            $sql1 = "SELECT * FROM grilles";
            $result1 = $db->query($sql1, PDO::FETCH_ASSOC);

            $i=1;
            echo "{";
            foreach ($result1 as $row){
                echo "\"". $row['gid'] ."\" : ";
                echo json_encode($row);
                if ($i < 11) {
                    echo ",";
                }
                $i++;
            }
            echo "}";
        }
    } catch (PDOException $e){
        echo "No connection";
        die($e -> getMessage());
    }

