<?php
$host = 'localhost';
$dbname = 'educonect'; // Nombre de tu base de datos
$username = 'root';    // Usuario por defecto en MAMP/XAMPP
$password = 'root';    // Contraseña (en MAMP suele ser 'root', en XAMPP vacía '')

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // Configurar el modo de error de PDO para excepciones
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión a la base de datos: " . $e->getMessage());
}
?>