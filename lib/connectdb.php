<?php
include('config.php');
// enter your credentials in config.php.example, then remove '.example' from the filename

// connect with the MySQL database
$db = new PDO('mysql:host=localhost;dbname=blocktoss;charset=utf8', $db_username, $db_password);