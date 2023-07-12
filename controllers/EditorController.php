<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Model\Seccion;
use Classes\JsonWT;
use Exception;
use Model\Historial;
use Model\SeccionUnidad;
use Model\SeccionUser;
use Model\User;

define('token', $_SESSION['token'] ?? '');
if (!isset($_SESSION)) {
    session_start();
};
class EditorController
{
    public static function index(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/errores', [
                'alertas' => $alertas,
            ]);
        }
    }

    public static function carpetaByPermisos(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (!is_numeric($_GET['id'])) {
                header('Location:' . $_ENV['URL_BASE'] . '/editor/carpeta?id=0');
                return;
            }; // aqui arreglar la vista de las secciones, esta cambiado el nombre d ela funcion en el index
            if ($_GET['id'] != 0) {
                $user = User::find($_SESSION['id']);
                $carpetas = SeccionUser::whereCamposCarpetas('idUser', $_SESSION['id'], 'idSeccion', intval($_GET['id']), 'verSeccion', 1);
                if (empty($carpetas)) {
                    $carpetas = SeccionUnidad::whereCamposCarpetas('idUnidad', $user->idUnidad, 'idSeccion', intval($_GET['id']), 'verSeccion', 1);
                    if (empty($carpetas)) {
                        header('Location:' . $_ENV['URL_BASE'] . '/editor/carpeta?id=0&a=1');
                        return;
                    }
                }
            }

            $router->render('user/editor', [
                'alertas' => $alertas,
            ]);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            switch ($_POST['tipo']) {
                case 'seccionByUserPermisos':
                    $idUser = $_SESSION['id'];
                    $idSeccion = $_POST['id'];
                    $user = User::find($idUser);
                    $consulta = "SELECT  su.*,u.nombre,s.seccion,s.descripcion,s.color,s.path FROM seccion_user su INNER JOIN seccion s ON s.id = su.idSeccion INNER JOIN user u ON u.id = su.idUser WHERE su.idUser = $idUser AND su.idPadre = $idSeccion AND su.verSeccion = '1'";
                    $secciones = SeccionUser::consultaPlana($consulta);
                    $seccionesArr = [];
                    if (!empty($secciones)) {
                        foreach ($secciones as $seccion) {
                            $respuesta = SeccionUser::getCarpetasHijosEditor($seccion['id'], $idUser);
                            $seccion['carpetas'] = SeccionUser::obtenerSecRamaEditor($respuesta, $idUser);
                            $seccion['pathLink'] = json_encode(SeccionUser::getPathLink($seccion['idPadre'], $seccion['idSeccion'], $seccion['idUser']));
                            array_push($seccionesArr, $seccion);
                        }
                        echo json_encode($seccionesArr);
                    } else {
                        $consulta = "SELECT  su.*,u.unidad,s.seccion,s.descripcion,s.color,s.path FROM seccion_unidad su INNER JOIN seccion s ON s.id = su.idSeccion INNER JOIN unidad u ON u.id = su.idUnidad WHERE su.idUnidad = $user->idUnidad AND su.idPadre = $idSeccion AND su.verSeccion = '1'";
                        $secciones = SeccionUnidad::consultaPlana($consulta);
                        foreach ($secciones as $seccion) {
                            $respuesta = SeccionUnidad::getCarpetasHijosUnidad($seccion['id'], $user->idUnidad);
                            $seccion['carpetas'] = SeccionUnidad::obtenerSecRamaUnidad($respuesta, $user->idUnidad);
                            $seccion['pathLink'] = json_encode(SeccionUnidad::getPathLink($seccion['idPadre'], $seccion['idSeccion'], $seccion['idUnidad']));
                            array_push($seccionesArr, $seccion);
                        }
                        echo json_encode($seccionesArr);
                    }
                    break;
                case 'padreByUserPermisos':
                    $idUser = $_SESSION['id'];
                    $idPadre = $_POST['id'];
                    $user = User::find($idUser);
                    $consulta = "SELECT  su.*,u.nombre,s.seccion,s.descripcion,s.color,s.path FROM seccion_user su INNER JOIN seccion s ON s.id = su.idSeccion INNER JOIN user u ON u.id = su.idUser WHERE su.idUser = $idUser AND su.idSeccion = $idPadre AND su.verSeccion = '1'";
                    $seccion = SeccionUser::consultaPlana($consulta);
                    if (!empty($seccion)) {
                        $seccion = array_shift($seccion);
                        $respuesta = SeccionUser::getCarpetasHijosEditor($seccion['idSeccion'], $idUser);
                        array_push($respuesta, $idPadre);
                        $carpetas = SeccionUser::obtenerSecRamaEditor($respuesta, $idUser);
                        $seccion['pathLink'] = json_encode(SeccionUser::getPathLink($seccion['idPadre'], $seccion['idSeccion'], $seccion['idUser']));
                        $seccion['carpetas'] = $carpetas;
                        $seccion = $seccion;
                    } else {
                        $consulta = "SELECT  su.*,u.unidad,s.seccion,s.descripcion,s.color,s.path FROM seccion_unidad su INNER JOIN seccion s ON s.id = su.idSeccion INNER JOIN unidad u ON u.id = su.idUnidad WHERE su.idUnidad = $user->idUnidad AND su.idSeccion = $idPadre AND su.verSeccion = '1'";
                        $seccion = SeccionUnidad::consultaPlana($consulta);
                        if (!empty($seccion)) {
                            $seccion = array_shift($seccion);
                            $respuesta = SeccionUnidad::getCarpetasHijosUnidad($seccion['idSeccion'], $user->idUnidad);
                            array_push($respuesta, $idPadre);
                            $carpetas = SeccionUnidad::obtenerSecRamaUnidad($respuesta, $user->idUnidad);
                            $seccion['pathLink'] = json_encode(SeccionUnidad::getPathLink($seccion['idPadre'], $seccion['idSeccion'], $seccion['idUnidad']));
                            $seccion['carpetas'] = $carpetas;
                            $seccion = $seccion;
                        }
                    }
                    echo json_encode($seccion);
                    break;
                default:
                    break;
            }
        }
    }

    public static function datos(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $alertas = [];
            switch ($_POST['tipo']) {
                case 'buscarCarpetas':
                    $idPadre = $_POST['id'];
                    $value = $_POST['value'];
                    $consulta = "SELECT su.*,s.seccion,s.descripcion,s.path,s.color FROM seccion_user su INNER JOIN seccion s ON s.id = su.idSeccion WHERE su.idPadre = $idPadre AND s.seccion like '%$value%'";
                    $secciones = SeccionUser::consultaPlana($consulta);
                    $carpetas = [];
                    foreach ($secciones as $seccion) {
                        $respuesta = SeccionUser::getCarpetasHijosEditor(intval($seccion['id']), $_SESSION['id']);
                        $seccion['carpetas'] = SeccionUser::obtenerSecRamaEditor($respuesta, $_SESSION['id']);
                        array_push($carpetas, $seccion);
                    }
                    echo json_encode($carpetas);
                    break;

                    $resolve = ['error' => 'No existe búsqueda de ese tipo'];
                    echo json_encode($resolve);
                    break;
            }
        }
    }

    public static function crearCarpeta(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $seccion = new Seccion($_POST);
                $seccion->path = $seccion->getPath(); //crear el path 
                $alertas = $seccion->validar();
                if (!empty($alertas)) {
                    $resolve = ['alertas' => $alertas];
                    echo json_encode($resolve);
                    return;
                }
                $resultadoCarpeta = $seccion->guardar();
                if ($resultadoCarpeta['resultado'] != true) {
                    $resolve = ['error' => 'No se pudo crear la carpeta'];
                    echo json_encode($resolve);
                    return;
                }
                $seccion->crearCarpeta();
                $seccionActual = SeccionUser::whereCamposCarpetas('idUser', $_SESSION['id'], 'idSeccion', $seccion->idPadre, 'verSeccion', 1);
                if (!empty($seccionActual)) {
                    $seccionActual = array_shift($seccionActual);
                    unset($seccionActual->id);
                    $seccionActual = (array) $seccionActual;
                    $permisos = new SeccionUser($seccionActual);
                    $permisos->idUser = $_SESSION['id'];
                    $permisos->idSeccion = $resultadoCarpeta['id'];
                    $permisos->idPadre = $seccionActual['idSeccion'];
                    $resultado = $permisos->guardarPermiso('idUser', $permisos->idUser);
                } else {
                    $user = User::find($_SESSION['id']);
                    $seccionActual = SeccionUnidad::whereCamposCarpetas('idUnidad', $user->idUnidad, 'idSeccion', $seccion->idPadre, 'verSeccion', 1);
                    $seccionActual = array_shift($seccionActual);
                    unset($seccionActual->id);
                    $seccionActual = (array) $seccionActual;
                    $permisos = new SeccionUnidad($seccionActual);
                    $permisos->idUnidad = $user->idUnidad;
                    $permisos->idSeccion = $resultadoCarpeta['id'];
                    $permisos->idPadre = $seccionActual['idSeccion'];
                    $resultado = $permisos->guardarPermiso('idUnidad', $permisos->idUnidad);
                }
                if ($resultado != true) {
                    $resolve = ['error' => 'No se pudo crear la carpeta y permisos'];
                    echo json_encode($resolve);
                    return;
                }
                setHistorialCarpeta($_SESSION['id'], $seccion->idPadre, $resultadoCarpeta['id'], 'create', json_encode($seccion),json_encode($permisos));
                $resolve = ['exito' => 'Carpeta Creada con éxito'];
                echo json_encode($resolve);
                return;
            } catch (Exception $e) {
                $resolve = ['error' => 'No se pudo crear la Carpeta'];
                echo json_encode($resolve);
            }
        }
    }
}
