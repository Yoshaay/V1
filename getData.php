<?php
// getData.php

// Lese die Daten aus der JSON-Datei
$jsonData = file_get_contents('data.json');

// Gebe die Daten als JSON zurück
header('Content-Type: application/json');
echo $jsonData;
?>
