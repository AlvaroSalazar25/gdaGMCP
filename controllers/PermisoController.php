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
            try { // aqui arreglar el tema del try catch y el historial de los permisos
                SeccionUser::initTransaction();
                $permiso = new SeccionUser($_POST);
                $permiso->verSeccion = filter_var($permiso->verSeccion, FILTER_VALIDATE_BOOLEAN);
                $seccion = Seccion::find($permiso->idSeccion);
                $permiso->idPadre = $seccion->idPadre;
                SeccionUser::updatePermisosPadreUser($seccion->idPadre, $seccion->id, $permiso->idUser, $permiso->verSeccion, $_POST['accion']);
                if ($_POST['heredar'] == 'false' && $permiso->verSeccion == true) {
                    try {
                        SeccionUser::initTransaction();
                        $cantidad = SeccionUser::cantidadPermisos('idSeccion', $permiso->idSeccion, 'idUser', $permiso->idUser);
                        if (!empty($cantidad)) {
                            $permiso->actualizarPermiso('idSeccion', $permiso->idSeccion);
                        } else {
                            $permiso->crear();
                        }
                        SeccionUser::endTransaction();
                    } catch (Exception $e) {
                        SeccionUser::rollback();
                        throw new Exception('No se pudieron guardar los permisos de la Unidad por problemas en el árbol de carpetas');
                    }
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
                        $seccion = Seccion::find($permiso->idSeccion);
                        $permiso->idPadre = $seccion->idPadre;
                        try {
                            SeccionUser::initTransaction();
                            $cantidad = SeccionUser::cantidadPermisos('idSeccion', $permiso->idSeccion, 'idUser', $permiso->idUser);
                            if (!empty($cantidad)) {
                                $permiso->actualizarPermiso('idSeccion', $permiso->idSeccion);
                            } else {
                                $permiso->crear();
                            }
                            SeccionUser::endTransaction();
                        } catch (Exception $e) {
                            SeccionUser::rollback();
                            throw new Exception('No se pudieron guardar los permisos de la Unidad por problemas en el árbol de carpetas');
                        }
                    }
                }
                SeccionUser::endTransaction();
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
                SeccionUnidad::initTransaction();
                $permiso = new SeccionUnidad($_POST);
                $permiso->verSeccion = filter_var($permiso->verSeccion, FILTER_VALIDATE_BOOLEAN);
                $seccion = Seccion::find($permiso->idSeccion);
                $permiso->idPadre = $seccion->idPadre;
                $respuesta = SeccionUnidad::updatePermisosPadreUnidad($seccion->idPadre, $seccion->id, $permiso->idUnidad, $permiso->verSeccion, $_POST['accion']);
                if ($respuesta != true) {
                    $resolve = ['error' => 'No se pudo guardar los Permisos'];
                    echo json_encode($resolve);
                    return;
                }
                if ($_POST['heredar'] == 'false' && $permiso->verSeccion == true) {
                    try {
                        SeccionUnidad::initTransaction();
                        $cantidad = SeccionUnidad::cantidadPermisos('idSeccion', $permiso->idSeccion, 'idUnidad', $permiso->idUnidad);
                        if (!empty($cantidad)) {
                            $permiso->actualizarPermiso('idSeccion', $permiso->idSeccion);
                        } else {
                            $permiso->crear();
                        }
                        SeccionUnidad::endTransaction();
                    } catch (Exception $e) {
                        SeccionUnidad::rollback();
                        throw new Exception('No se pudieron guardar los permisos de la Unidad por problemas en el árbol de carpetas');
                    }
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
                        $seccion = Seccion::find($permiso->idSeccion);
                        $permiso->idPadre = $seccion->idPadre;
                        try {
                            SeccionUnidad::initTransaction();
                            $cantidad = SeccionUnidad::cantidadPermisos('idSeccion', $permiso->idSeccion, 'idUnidad', $permiso->idUnidad);
                            if (!empty($cantidad)) {
                                $permiso->actualizarPermiso('idSeccion', $permiso->idSeccion);
                            } else {
                                $permiso->crear();
                            }
                            SeccionUnidad::endTransaction();
                        } catch (Exception $e) {
                            SeccionUnidad::rollback();
                            throw new Exception('No se pudieron guardar los permisos de la Unidad por problemas en el árbol de carpetas');
                        }
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

    public static function permisosHeredar(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $permisos = SeccionUser::eliminarTodos('idUser', $_POST['idUser']);
                if ($permisos != true) {
                    $resolve = ['error' => 'No se pudo guardar los Permisos heredados'];
                    echo json_encode($resolve);
                    return;
                }

                $resolve = ['exito' => 'Permisos Heredados con éxito'];
                echo json_encode($resolve);
            } catch (Exception $e) {
                $resolve = ['error' => 'No se pudo guardar los Permisos'];
                echo json_encode($resolve);
            }
        }
    }
}
