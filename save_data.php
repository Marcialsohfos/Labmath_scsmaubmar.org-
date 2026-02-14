<?php
// save_data.php
$json = file_get_contents('php://input'); // Récupère les données envoyées par l'admin
if($json) {
    file_put_contents('data.json', $json); // Écrase le fichier data.json avec les nouvelles infos
    echo json_encode(["status" => "success"]);
}
?>