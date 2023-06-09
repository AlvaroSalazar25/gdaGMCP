<?php

namespace Controllers;

use Exception;
use MVC\Router;
use Model\Errors;
use Model\Seccion;
use Classes\JsonWT;
use Model\SeccionUser;

define('token', $_SESSION['token'] ?? '');
if (!isset($_SESSION)) {
    session_start();
};
class PermisoController
{
    public static function permisos(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/permisos', [
                'alertas' => $alertas,
            ]);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $permiso = new SeccionUser($_POST);
                $permiso->verSeccion = filter_var($permiso->verSeccion, FILTER_VALIDATE_BOOLEAN);
                $permiso->guardarPermiso();
                if ($_POST['heredar'] == 'false') {
                    $resolve = ['exito' => 'Permisos Guardados con éxito'];
                    echo json_encode($resolve);
                    return;
                }
                $carpetas = Seccion::getCarpetasHijos(intval($permiso->idSeccion)); // para los permisos heredados de esta carpeta hacia abajo (hijos)
                $seccion = Seccion::find($permiso->idSeccion);
                $hola = Seccion::updatePermisosPadre($seccion->idPadre, $seccion->id,$permiso->idUser,$permiso->verSeccion);
                dd($hola);
                if (!empty($carpetas)) {
                    foreach ($carpetas as $carpeta) {
                        $permiso->idSeccion = $carpeta;
                        $permiso->guardarPermiso();
                    }
                }
                $resolve = ['exito' => 'Permisos Guardados y heredados con éxito'];
                echo json_encode($resolve);
            } catch (Exception $e) {
                $resolve = ['error' => 'No se pudo guardar los Permisos'];
                echo json_encode($resolve);
            }
        }
    }
}



