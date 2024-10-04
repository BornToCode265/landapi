<?php


header("Access-Control-Allow-Origin: *");

header('Content-Type: *');

header('Access-Control-Allow-Heagers: *');

header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: * ");



require_once("./../conn.php");

$method = $_SERVER['REQUEST_METHOD'];



switch ($method) {
  case 'GET':


    // Read operation (fetch books)
    $data = json_decode(file_get_contents('php://input'), true);
    $full_name = (string) $_GET['email'];
    $password = (string) $GET['password'];

    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :full_name');
    $stmt->bindParam(':full_name', $full_name);

    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);


    echo json_encode($result);

    break;

       default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
  }