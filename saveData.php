<?php
// saveData.php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (isset($data['command'])) {
        if ($data['command'] === 'clearArray') {
            // Befehl zum Leeren des Arrays und Löschen der JSON-Datei
            $filePath = 'data.json';
            if (file_exists($filePath)) {
                unlink($filePath); // Lösche die JSON-Datei
            }
            echo json_encode(['status' => 'success', 'message' => 'Daten gelöscht']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Unbekannter Befehl']);
        }
    } elseif (isset($data['data']) && is_array($data['data'])) {
        // Füge neue Daten hinzu, wie zuvor
        $filePath = 'data.json';
        if (file_exists($filePath)) {
            $existingData = json_decode(file_get_contents($filePath), true);
            if (!is_array($existingData)) {
                $existingData = [];
            }
        } else {
            $existingData = [];
        }
        foreach ($data['data'] as $newItem) {
            if (!in_array($newItem, $existingData)) {
                $existingData[] = $newItem;
            }
        }
        $jsonData = json_encode($existingData, JSON_PRETTY_PRINT);
        file_put_contents($filePath, $jsonData);
        echo json_encode(['status' => 'success', 'message' => 'Daten gespeichert']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ungültige Daten']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Ungültige Anforderungsmethode']);
}
?>
