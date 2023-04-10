<?php 
//define('NOMBRE_CARPETA','/gdagmcp');
require_once __DIR__ . '/../includes/app.php';

use MVC\Router;
use Controllers\UserController;
use Controllers\ErrorController;
use Controllers\LoginController;
use Controllers\UnidadController;
use Controllers\SeccionController;
use Controllers\DocumentosController;
use Controllers\FormularioController;

$router = new Router();

// rutas para el login
$router->get($_ENV['NOMBRE_CARPETA'].'/',[LoginController::class,'login']); 
$router->post($_ENV['NOMBRE_CARPETA'].'/',[LoginController::class,'login']);
$router->get($_ENV['NOMBRE_CARPETA'].'/logout',[LoginController::class,'logout']); 
$router->get($_ENV['NOMBRE_CARPETA'].'/olvide',[LoginController::class,'olvide']);
$router->post($_ENV['NOMBRE_CARPETA'].'/olvide',[LoginController::class,'olvide']);
$router->get($_ENV['NOMBRE_CARPETA'].'/recuperar',[LoginController::class,'recuperar']);
$router->post($_ENV['NOMBRE_CARPETA'].'/recuperar',[LoginController::class,'recuperar']);

// rutas para User
$router->get($_ENV['NOMBRE_CARPETA'].'/admin',[UserController::class,'admin']); 
$router->get($_ENV['NOMBRE_CARPETA'].'/editor',[UserController::class,'editor']); 


$router->post($_ENV['NOMBRE_CARPETA'].'/user/create',[UserController::class,'crear']);
$router->post($_ENV['NOMBRE_CARPETA'].'/user/update',[UserController::class,'actualizar']);
$router->post($_ENV['NOMBRE_CARPETA'].'/user/delete',[UserController::class,'delete']);
$router->post($_ENV['NOMBRE_CARPETA'].'/user/datos',[UserController::class,'datos']);
$router->post($_ENV['NOMBRE_CARPETA'].'/user/buscar',[UserController::class,'buscar']);
$router->post($_ENV['NOMBRE_CARPETA'].'/user/estado',[UserController::class,'estado']);
$router->get($_ENV['NOMBRE_CARPETA'].'/user/ver',[UserController::class,'ver']);
$router->get($_ENV['NOMBRE_CARPETA'].'/user/seccion',[UserController::class,'buscarSeccion']);
$router->post($_ENV['NOMBRE_CARPETA'].'/user/permisos/save',[UserController::class,'saveSeccionUsers']);

//rutas para unidades
$router->get($_ENV['NOMBRE_CARPETA'].'/unidad',[UnidadController::class,'index']);
$router->post($_ENV['NOMBRE_CARPETA'].'/unidad/actualizar',[UnidadController::class,'actualizar']);
$router->post($_ENV['NOMBRE_CARPETA'].'/unidad/create',[UnidadController::class,'create']);
$router->post($_ENV['NOMBRE_CARPETA'].'/unidad/datos',[UnidadController::class,'datos']);
$router->post($_ENV['NOMBRE_CARPETA'].'/unidad/delete',[UnidadController::class,'delete']);

//rutas para seccion
$router->get($_ENV['NOMBRE_CARPETA'].'/seccion',[SeccionController::class,'index']);
$router->post($_ENV['NOMBRE_CARPETA'].'/seccion/create',[SeccionController::class,'create']);
$router->post($_ENV['NOMBRE_CARPETA'].'/seccion/update',[SeccionController::class,'update']);
$router->post($_ENV['NOMBRE_CARPETA'].'/seccion/datos',[SeccionController::class,'datos']);
$router->post($_ENV['NOMBRE_CARPETA'].'/seccion/delete',[SeccionController::class,'delete']);

//rutas para formularios
$router->get($_ENV['NOMBRE_CARPETA'].'/formulario',[FormularioController::class,'index']);
$router->post($_ENV['NOMBRE_CARPETA'].'/formulario/datos',[FormularioController::class,'datos']);
$router->post($_ENV['NOMBRE_CARPETA'].'/formulario/create',[FormularioController::class,'create']);
$router->post($_ENV['NOMBRE_CARPETA'].'/formulario/update',[FormularioController::class,'update']);
$router->post($_ENV['NOMBRE_CARPETA'].'/formulario/delete',[FormularioController::class,'delete']);
$router->post($_ENV['NOMBRE_CARPETA'].'/seccion/formulario/agregar',[FormularioController::class,'agregar']);


$router->get($_ENV['NOMBRE_CARPETA'].'/documentos',[DocumentosController::class,'index']);
$router->post($_ENV['NOMBRE_CARPETA'].'/documentos/datos',[DocumentosController::class,'datos']);
$router->post($_ENV['NOMBRE_CARPETA'].'/documentos/create',[DocumentosController::class,'create']);

$router->get($_ENV['NOMBRE_CARPETA'].'/errores',[ErrorController::class,'index']);
$router->post($_ENV['NOMBRE_CARPETA'].'/errores/datos',[ErrorController::class,'datos']);

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();