<?php
// Simple PHP script to save products.json
// Place this file in your website root directory

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON data from request
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data || !isset($data['products'])) {
            throw new Exception('Invalid data format');
        }
        
        // Ensure the assets/data directory exists
        $dataDir = 'assets/data';
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
        
        // Save to products.json
        $filePath = $dataDir . '/products.json';
        $result = file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
        
        if ($result === false) {
            throw new Exception('Failed to write file');
        }
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Products saved successfully',
            'count' => count($data['products']),
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>
