<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Model\Unidad;
use Model\Seccion;
use Classes\JsonWT;
use Model\SeccionUser;
use Model\SeccionUnidad;
use Model\User;

define('token', $_SESSION['token'] ?? '');
if (!isset($_SESSION)) {
    session_start();
};
class UnidadController
{

    public static function index(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }

        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/unidades', [
                'alertas' => $alertas,
            ]);
        }
    }

    public static function datos(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            switch ($_POST['tipo']) {
                case 'unidadSeccion':
                    //$roles = seccionRoles::consultaPlana($consulta);
                    $unidades = Unidad::all();
                    foreach ($unidades as $unidad) {
                        //$id = $rol['id'];
                        $id = $unidad->id;
                        $consulta = "SELECT su.idUnidad,u.unidad,su.idSeccion,s.seccion,su.permisos from seccion_unidad su inner join seccion s on s.id = su.idSeccion inner join unidad u on u.id = su.idUnidad WHERE su.idUnidad = '{$id}'";
                        $unidadPermi = SeccionUnidad::consultaPlana($consulta);
                        $unidad->seccion = json_encode($unidadPermi);
                        //array_push($rolesPermiso,json_encode($rolesPermi));
                    }
                    echo json_encode($unidades);
                    break;
                case 'unidades':
                    //$roles = seccionRoles::consultaPlana($consulta);
                    $unidades = Unidad::all();
                    echo json_encode($unidades);
                    break;
                case 'unidad':
                    $unidad = Unidad::find($_POST['id']);
                    echo json_encode($unidad);
                    break;
                case 'permisosUnidadCarpeta':
                    $idUnidad = $_POST['idUnidad'];
                    $idSeccion = $_POST['idSeccion'];
                    $consulta = "SELECT su.*,u.unidad,s.seccion FROM seccion_unidad su INNER JOIN unidad u on u.id = su.idUnidad INNER JOIN seccion s ON s.id = su.idSeccion WHERE su.idUnidad = $idUnidad and su.idSeccion = $idSeccion";
                    $permisos = SeccionUnidad::consultaPlana($consulta);
                    echo json_encode($permisos);
                    break;
                case 'usersUnidad':
                    $id = $_POST['id'];
                    $usuarios = User::whereTodos('idUnidad', $id);
                    echo json_encode($usuarios);
                    break;

                default:
                    $resolve = [
                        'error' => 'No existe busqueda de ese tipo'
                    ];
                    echo json_encode($resolve);
                    return;
                    break;
            }
        }
    }

    public static function actualizar()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $unidad = Unidad::find($_POST['id']);
            $unidad->sincronizar($_POST);
            $idUnidad = $unidad->id;
            $resultado = $unidad->guardar();
            if ($resultado == true) {
                $cont = [];
                $seccionesNuevas = json_decode($_POST['permisos']);
                $seccionesActuales = SeccionUnidad::whereTodos('idUnidad', $idUnidad);
                $idSeccionesNuevas = [];

                foreach ($seccionesNuevas as $seccionNueva) {
                    $idSeccion = $seccionNueva->idSeccion->id;
                    array_push($idSeccionesNuevas, $idSeccion);
                }

                $idSeccionesActuales = [];
                foreach ($seccionesActuales as $seccionActual) {
                    array_push($idSeccionesActuales, $seccionActual->idSeccion);
                }
                /* ===================================================================================
                     Métodos para filtrar y dividir los nuevos permisos para agregar, modificar o eliminar
                    ======================================================================================*/
                $arrayAgregar = array_diff($idSeccionesNuevas, $idSeccionesActuales);
                $arrayEliminar = array_diff($idSeccionesActuales, $idSeccionesNuevas);
                $arrayModificar = array_intersect($idSeccionesActuales, $idSeccionesNuevas);
                /* ==============================================================
                    Funcion para AGREGAR secciones con permisos nuevos
                    ==============================================================*/
                $arrSecCrear = [];
                foreach ($arrayAgregar as $key => $arr) {
                    foreach ($seccionesNuevas as $sec) {
                        if ($sec->idSeccion->id == $arr) {
                            array_push($arrSecCrear, $sec);
                        }
                    }
                }

                foreach ($arrSecCrear as $crear) {
                    $permisoUnidad = [
                        'idUnidad' => $idUnidad,
                        'idSeccion' => $crear->idSeccion->id,
                        'permisos' =>  json_encode($crear->idPermisos)
                    ];
                    $permisoCreado = new SeccionUnidad($permisoUnidad);
                    $resultado = $permisoCreado->guardar();
                    array_push($cont, $resultado['resultado']);
                }
                /* ==================================================================
                                Funcion para MODIFICAR secciones con permisos actuales
                        =====================================================================*/
                foreach ($arrayModificar as $key => $arrUpdate) {
                    foreach ($seccionesNuevas as $seccionNuevaActualizar) {
                        if ($seccionNuevaActualizar->idSeccion->id == $arrUpdate) {
                            $idSeccion = $seccionNuevaActualizar->idSeccion->id;
                            $permisos = json_encode($seccionNuevaActualizar->idPermisos);
                            $resultado = SeccionUnidad::actualizarSeccion('permisos', $permisos, 'idUnidad', $idUnidad, 'idSeccion', $idSeccion);
                            array_push($cont, $resultado);
                        }
                    }
                }
                /* ==============================================================
                                Funcion para ELIMINAR secciones con permisos actuales
                        =================================================================*/
                $seccionesEliminar = [];
                foreach ($arrayEliminar as $key => $arr) {
                    $consulta = "SELECT * from seccion_unidad WHERE idUnidad = '$idUnidad' AND idSeccion = '$arr'";
                    $permi = SeccionUnidad::consultarSQL($consulta);
                    array_push($seccionesEliminar, array_shift($permi));
                }

                foreach ($seccionesEliminar as $arrDelete) {
                    $resultado = SeccionUnidad::eliminarTodos('id', $arrDelete->id);
                    array_push($cont, $resultado);
                }
                /* ==============================================================
                                Validar que todas las trasacciones esten en TRUE 
                        =================================================================*/
                $filtroAllPass = array_diff($cont, ['true' => true]);
                if (empty($filtroAllPass)) {
                    $resolve = [
                        'exito' => 'Unidad actualizada con permisos correctamente'
                    ];
                    echo json_encode($resolve);
                    return;
                } else {
                    /* ==========================================================================
                                Método para eliminar los cambios y se mantienen los de la BD
                        ================================================================================*/
                    $errores = [];
                    $seccionesActualizadas = SeccionUnidad::whereTodos('idUnidad', $idUnidad);
                    foreach ($seccionesActualizadas as $secUpdateDelete) {
                        $resultado = SeccionUnidad::eliminarTodos('id', $secUpdateDelete->id);
                        array_push($errores, $resultado);
                    }
                    foreach ($seccionesActuales as $secUpdateDeleted) {
                        $permisoUnidad = [
                            'idUnidad' => $idUnidad,
                            'idSeccion' => $secUpdateDeleted->idSeccion,
                            'permisos' =>  $secUpdateDeleted->permisos
                        ];
                        $permisoCreado = new SeccionUnidad($permisoUnidad);
                        $resultado = $permisoCreado->guardar();
                        array_push($errores, $resultado['resultado']);
                    }
                    $filtroAllError = array_diff($errores, ['true' => true]);
                    if (empty($filtroAllError)) {
                        $resolve = [
                            'error' => 'No se pudo actualizar los permisos de la unidad'
                        ];
                        echo json_encode($resolve);
                        return;
                    } else {
                        /* ==========================================================================
                                    Método para crear un registro del Error si todo falla,
                            ================================================================================*/
                        $todasSecciones = ['seccionesActuales' => json_encode($seccionesActuales), 'seccionesNuevas' => json_encode($seccionesNuevas)];
                        $datosError = debug_backtrace();
                        $datosErrors = array_shift($datosError);
                        $errorUnidadUpdate = [
                            'idUnidad' =>  $idUnidad,
                            'nombreUnidad' => $unidad->unidad,
                            'seccionUnidad' => $todasSecciones
                        ];
                        $errorGenerado = [
                            'tabla_error' => SeccionUnidad::getTabla(),
                            'controller_error' => $datosErrors['class'],
                            'function_error' => $datosErrors['function'],
                            'error' =>  json_encode($errorUnidadUpdate)
                        ];
                        $errorSave = new Errors($errorGenerado);
                        $errorSave->guardar();

                        $resolve = [
                            'error' => 'No se pudo actualizar los permisos de la unidad'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                }
            }
        }
    }

    public static function create()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $unidad = new Unidad($_POST);
            $alertas = $unidad->validar();
            if (empty($alertas)) {
                $resultado = $unidad->guardar();
                if ($resultado['resultado'] == true) {
                    if (isset($_POST['permisos'])) {
                        $id = $resultado['id'];
                        $permisos = json_decode($_POST['permisos']);
                        $cont = 0;
                        foreach ($permisos as $permiso) {

                            $permisoUnidad = [
                                'idUnidad' => $id,
                                'idSeccion' => $permiso->idSeccion->id,
                                'permisos' =>  json_encode($permiso->idPermisos)
                            ];
                            $permisoCreado = new SeccionUnidad($permisoUnidad);
                            $resulta = $permisoCreado->guardar();
                            if ($resulta['resultado'] == true) {
                                $cont++;
                            }
                        }
                        if (count($permisos) == $cont) {
                            $resolve = [
                                'exito' => 'Unidad creada con permisos correctamente'
                            ];
                            echo json_encode($resolve);
                            return;
                        } else {
                            $eliminar = Unidad::eliminarTodos('id', $id);
                            if ($eliminar == true) {
                                $eliminarPermisos = SeccionUnidad::eliminarTodos('id', $id);
                                if ($eliminarPermisos == true) {
                                    $resolve = [
                                        'error' => 'Ocurrió un error al guardar los permisos de la Unidad'
                                    ];
                                    echo json_encode($resolve);
                                    return;
                                } else {
                                    $resolve = [
                                        'error' => 'Algo salió mal al crear y borrar los permisos de la Unidad'
                                    ];
                                    echo json_encode($resolve);
                                    return;
                                }
                            } else {
                                $resolve = [
                                    'error' => 'Algo salió mal'
                                ];
                                echo json_encode($resolve);
                                return;
                            }
                        }
                    } else {
                        $resolve = [
                            'exito' => 'Unidad agregada correctamente'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                } else {
                    $resolve = [
                        'error' => 'No se pudo guardar la Unidad'
                    ];
                    echo json_encode($resolve);
                    return;
                }
            } else {
                $resolve = [
                    'alertas' => $alertas
                ];
                echo json_encode($resolve);
                return;
            }
        }
    }

    public static function delete()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $unidad = Unidad::find($_POST['id']);
            // dd($unidad);
            if ($unidad) {
                $seccionEliminar = SeccionUnidad::eliminarTodos('idUnidad', $unidad->id);
                //dd($seccionEliminar);
                if ($seccionEliminar == true) {
                    $resultado = $unidad->eliminar();
                    if ($resultado == true) {
                        $resolve = [
                            'exito' => 'Unidad eliminada correctamente'
                        ];
                        echo json_encode($resolve);
                        return;
                    } else {
                        $resolve = [
                            'error' => 'Ocurrió un problema al Eliminar la Unidad'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                } else {
                    $resolve = [
                        'error' => 'Ocurrio un problema al Eliminar los permisos de la Unidad'
                    ];
                    echo json_encode($resolve);
                    return;
                }
            }
        }
    }
}
