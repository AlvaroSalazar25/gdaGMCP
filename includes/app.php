<?php 

require __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable('../env','.env');
$dotenv->safeLoad();
require 'funciones.php';
require 'database.php';
// require  './src/lib/vendor/autoload.php';

// Conectarnos a la base de datos
use Model\ActiveRecord;
use Model\Documento;
use Model\Seccion;

ActiveRecord::setDB($db);
Seccion::setDB($db);
Documento::setDB($db);