<?php
    try {
        $db = new PDO("pgsql:host=localhost;port=5433;dbname=js2119;user=js2119;password=rochau43mifloi");
        if ($db){
            $sql = "SELECT * FROM grilles";
            $result = $db->query($sql, PDO::FETCH_ASSOC);

            $i=1;
            echo "[";
            foreach ($result as $row){
                echo json_encode($row);
                if ($i < 11) {
                    echo ",";
                }
                $i++;
            }
            echo"]";
        }
    } catch (PDOException $e){
        echo "No connection";
        die($e -> getMessage());
    }

