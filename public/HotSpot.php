<?php
// CORS Headers - allow all origins and necessary HTTP methods/headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');


// PostgreSQL Connection using PDO
$dsn = "pgsql:host=dpg-cv2klr9u0jms7394gqd0-a.frankfurt-postgres.render.com;dbname=fttc;port=5432";
$username = "fttc_user";
$password = "QLD0vqa4J3EcSHDDFf2IgAjRbU7RMIMo";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database Connection Error: " . $e->getMessage()]);
    exit();
}

// Only respond to GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get query parameters from URL
    $type = isset($_GET['type']) ? $_GET['type'] : '';
    $status = isset($_GET['status']) ? $_GET['status'] : '';

    try {
        if ($type === 'Poles') {
            // Query for Poles
            $sql = "SELECT pk, name, type, pole_use, ST_AsText(geom) as geom FROM sales.poles";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll();
        } elseif ($type === 'Connections') {
            // If a status is provided, validate and filter connections by that status.
            if (!empty($status)) {
                // Whitelist allowed status values to prevent SQL injection
                $allowed_status = ['active', 'dormant', 'ina'];
                if (!in_array(strtolower($status), $allowed_status)) {
                    echo json_encode(["error" => "Invalid status parameter. Allowed values: active, dormant, ina."]);
                    exit();
                }
                $sql = "SELECT pk, pole_name, frogfoot_free, active, dormant, ina, ST_AsText(geom) as geom 
                        FROM sales.connections022025 
                        WHERE " . $status . " = true";
            } else {
                $sql = "SELECT pk, pole_name, frogfoot_free, active, dormant, ina, ST_AsText(geom) as geom 
                        FROM sales.connections022025";
            }
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll();
        } else {
            echo json_encode(["error" => "Invalid type parameter. Use 'Poles' or 'Connections'."]);
            exit();
        }

        echo json_encode($data);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error fetching data: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Invalid request method. Only GET is allowed."]);
}
?>
