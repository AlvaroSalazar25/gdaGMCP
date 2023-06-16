<?php

namespace Controllers;

use Exception;
use MVC\Router;
use Model\Errors;
use Model\Seccion;
use Classes\JsonWT;
use Model\SeccionUser;
use Model\SeccionUnidad;

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
    }

    public static function permisosUser(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $permiso = new SeccionUser($_POST);
                $permiso->verSeccion = filter_var($permiso->verSeccion, FILTER_VALIDATE_BOOLEAN);
                $seccion = Seccion::find($permiso->idSeccion);
                $respuesta = Seccion::updatePermisosPadreUser($seccion->idPadre, $seccion->id, $permiso->idUser, $permiso->verSeccion);
                if ($respuesta != true) {
                    $resolve = ['error' => 'No se pudo guardar los Permisos'];
                    echo json_encode($resolve);
                    return;
                }
                if ($_POST['heredar'] == 'false' && $permiso->verSeccion == true) {
                    $permiso->guardarPermiso('idUser', $permiso->idUser);
                    $resolve = ['exito' => 'Permisos Guardados con éxito'];
                    echo json_encode($resolve);
                    return;
                }
                // para los permisos heredados de esta carpeta hacia abajo (hijos)
                $carpetas = Seccion::getCarpetasHijos(intval($permiso->idSeccion));
                array_push($carpetas, $permiso->idSeccion);
                if (!empty($carpetas)) {
                    foreach ($carpetas as $carpeta) {
                        if ($permiso->verSeccion == false && $_POST['heredar'] == 'false') {
                            $permiso->verSeccion = false;
                        }
                        $permiso->idSeccion = $carpeta;
                        $permiso->guardarPermiso('idUser', $permiso->idUser);
                    }
                }
                $resolve = ['exito' => 'Permisos Guardados y Heredados con éxito'];
                echo json_encode($resolve);
            } catch (Exception $e) {
                $resolve = ['error' => 'No se pudo guardar los Permisos'];
                echo json_encode($resolve);
            }
        }
    }

    public static function permisosUnidad(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $permiso = new SeccionUnidad($_POST);
                $permiso->verSeccion = filter_var($permiso->verSeccion, FILTER_VALIDATE_BOOLEAN);
                $permiso->guardarPermiso('idUnidad', $permiso->idUnidad);
                if ($_POST['heredar'] == 'false') {
                    $resolve = ['exito' => 'Permisos Guardados con éxito'];
                    echo json_encode($resolve);
                    return;
                }
                $carpetas = Seccion::getCarpetasHijos(intval($permiso->idSeccion)); // para los permisos heredados de esta carpeta hacia abajo (hijos)
                $seccion = Seccion::find($permiso->idSeccion);
                $hola = Seccion::updatePermisosPadreUnidad($seccion->idPadre, $seccion->id, $permiso->idUnidad, $permiso->verSeccion);
                if (!empty($carpetas)) {
                    foreach ($carpetas as $carpeta) {
                        $permiso->idSeccion = $carpeta;
                        $permiso->guardarPermiso('idUnidad', $permiso->idUnidad);
                    }
                }
                $resolve = ['exito' => 'Permisos Guardados y Heredados con éxito'];
                echo json_encode($resolve);
            } catch (Exception $e) {
                $resolve = ['error' => 'No se pudo guardar los Permisos'];
                echo json_encode($resolve);
            }
        }
    }
}
