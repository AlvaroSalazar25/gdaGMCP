<?php

namespace Controllers;

use Model\User;
use MVC\Router;
use Model\Roles;
use Model\Errors;
use Model\Unidad;
use Model\Seccion;
use Classes\JsonWT;
use Model\SeccionUser;
use Model\SeccionUnidad;

define('token', $_SESSION['token'] ?? '');

if (!isset($_SESSION)) {
    session_start();
};
class UserController
{

    public static function admin(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/admin', [
                'alertas' => $alertas,
            ]);
        }
    }

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

    public static function editor(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/editor', [
                'alertas' => $alertas,
            ]);
        }
    }

    public static function crear(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $user = new User($_POST);
            //arreglar lo de los errores de las alertas para que salgan todas en una sola, segun veo asi solo va asalir un error cuando se manda vacio
            if (isset($_POST['passwordCedula'])) {
                if ($_POST['passwordCedula'] == 0) {
                    $alertas = $user->validarPass();
                } else if ($_POST['passwordCedula'] == 1) {
                    $alertas = $user->validarPassCedula();
                }
            }
            if ($_POST['apellido'] == "") {
                User::setAlerta('error', 'El Apellido es obligatorio');
            }
            if ($user->validarCI($user->cedula) == false) {
                User::setAlerta('error', 'La cédula no es válida');
            }
            if ($user->validarCelular($user->celular) == false) {
                User::setAlerta('error', 'El celular no es válido');
            }
            $alertas = User::getAlertas();
            if (empty($alertas)) {
                $user->hashPassword();
                $resultado = $user->guardar();
                $idUser = $resultado['id'];
                if ($idUser) {
                    $resolve = [
                        'exito' => 'Usuario creado CORRECTAMENTE'
                    ];
                    echo json_encode($resolve);
                    return;
                } else {
                    $resolve = [
                        'error' => 'Ocurrió un ERROR al guardar el usuario'
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

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/crear', [
                'alertas' => $alertas,
            ]);
        }
    }

    public static function actualizar(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $user = User::find($_POST['id']);
            $user->sincronizar($_POST);
            $alertas = $user->validarUpdate();
            if ($_POST['apellido'] == "") {
                User::setAlerta('error', 'El Apellido es obligatorio');
            }
            $alertas = User::getAlertas();
            if (empty($alertas)) {
                $resultado = $user->guardar();
                if ($resultado == true) {
                    $resolve = [
                        'exito' => 'Usuario ACTUALIZADO correctamente'
                    ];
                    echo json_encode($resolve);
                    return;
                } else {
                    $resolve = [
                        'error' => 'Ocurrió un ERROR al guardar el usuario'
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
            $user = User::find($_POST['id']);
            if ($user) {
                $seccionEliminar = SeccionUser::eliminarTodos('idUser', $user->id);
                if ($seccionEliminar == true) {
                    $resultado = $user->eliminar();
                    if ($resultado == true) {
                        $resolve = [
                            'exito' => 'Usuario eliminado correctamente'
                        ];
                        echo json_encode($resolve);
                        return;
                    } else {
                        $resolve = [
                            'error' => 'Ocurrió un problema al eliminar al usuario'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                } else {
                    $resultado = $user->eliminar();
                    $resolve = [
                        'exito' => 'Usuario eliminado correctamente'
                    ];
                    echo json_encode($resolve);
                    return;
                }
            } else {
                $resolve = [
                    'error' => 'Error, el usuario no existe'
                ];
                echo json_encode($resolve);
                return;
            }
        }
    }

    public static function ver(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $consulta = "SELECT u.id,u.idUnidad,u.nombre,u.cedula,u.celular,u.email,u.password,r.rol,un.unidad,e.estado FROM user u INNER JOIN roles r ON r.id = u.idRol INNER JOIN unidad un ON un.id = u.idUnidad INNER JOIN estado e ON e.id = u.idEstado";
            $todos = User::consultaPlana($consulta);
            $userseccion = [];
            foreach ($todos as $user) {
                if (isset($user['password'])) {
                    unset($user['password']);
                }
                $dato = $user['idUnidad'];
                $consulta = "SELECT p.id,p.permiso FROM seccion_unidad su INNER JOIN unidad u ON u.id = su.idUnidad INNER JOIN seccion p ON p.id = su.idseccion  WHERE  su.idUnidad = '{$dato}'";
                $seccion = SeccionUnidad::consultaPlana($consulta);
                $user['seccion'] = json_encode($seccion);
                array_push($userseccion, $user);
            }
            echo json_encode($userseccion);
        }
    }

    public static function buscar()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $dato = $_POST["dato"];
            $resolve = ['error' => 'No se encontró ningún usuario'];
            switch ($_POST["tipo"]) {
                case 'buscarNombre':
                    $consulta = "SELECT u.id,u.nombre,u.cedula,u.celular,u.email,r.rol,un.unidad,e.estado FROM user u INNER JOIN roles r ON r.id = u.idRol INNER JOIN unidad un ON un.id = u.idUnidad INNER JOIN estado e ON e.id = u.idEstado WHERE u.nombre LIKE '%{$dato}%'";
                    $todos =  User::consultaPlana($consulta);
                    if (empty($todos)) {
                        echo json_encode($resolve);
                        return;
                    } else {
                        echo json_encode($todos);
                        return;
                    }
                    break;
                case 'buscarRol':
                    $consulta = "SELECT u.id,u.nombre,u.cedula,u.celular,u.email,r.id as idRol,r.rol,un.id as idUnidad,un.unidad,e.estado FROM user u INNER JOIN roles r ON r.id = u.idRol INNER JOIN unidad un ON un.id = u.idUnidad INNER JOIN estado e ON e.id = u.idEstado WHERE r.id = '{$dato}'";
                    $todos = User::consultaPlana($consulta);
                    if (empty($todos)) {
                        echo json_encode($resolve);
                        return;
                    } else {
                        echo json_encode($todos);
                        return;
                    }
                    break;
                case 'buscarUnidad':
                    $consulta = "SELECT u.id,u.nombre,u.cedula,u.celular,u.email,r.id as idRol,r.rol,un.id as idUnidad,un.unidad,e.estado FROM user u INNER JOIN roles r ON r.id = u.idRol INNER JOIN unidad un ON un.id = u.idUnidad INNER JOIN estado e ON e.id = u.idEstado WHERE un.id = '{$dato}'";
                    $todos = User::consultaPlana($consulta);
                    if (empty($todos)) {
                        echo json_encode($resolve);
                        return;
                    } else {
                        echo json_encode($todos);
                        return;
                    }
                    break;
                case 'buscarEstado':
                    $consulta = "SELECT u.id,u.nombre,u.cedula,u.celular,u.email,r.id as idRol,r.rol,un.id as idUnidad,un.unidad,e.id as idEstado,e.estado FROM user u INNER JOIN roles r ON r.id = u.idRol INNER JOIN unidad un ON un.id = u.idUnidad INNER JOIN estado e ON e.id = u.idEstado WHERE e.id = '{$dato}'";
                    $todos = User::consultaPlana($consulta);
                    if (empty($todos)) {
                        echo json_encode($resolve);
                        return;
                    } else {
                        echo json_encode((object) $todos);
                        return;
                    }
                    break;
                default:
                    $resolve = [
                        'error' => 'Ocurrió un error al buscar los datos'
                    ];
                    echo json_encode($resolve);
                    return;
                    break;
            }
        }
    }

    public static function estado(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $user = User::where('id', $id);
            if ($user->idEstado == 1) {
                if ($user->idRol == 1) {
                    $resolve = ['error' => 'No se puede desabilitar a los administradores'];
                    echo json_encode($resolve);
                    return;
                }
                $user->idEstado = 2;
                $resultado = $user->guardar();
                if ($resultado) {
                    $resolve = ['inactivo' => 'Usuario desabilitado'];
                    echo json_encode($resolve);
                } else {
                    $resolve = ['error' => 'No se pudo desabilidar al usuario'];
                    echo json_encode($resolve);
                    return;
                }
            } else if ($user->idEstado == 2) {
                $user->idEstado = 1;
                $resultado = $user->guardar();
                if ($resultado) {
                    $resolve = ['activo' => 'Usuario activado'];
                    echo json_encode($resolve);
                } else {
                    $resolve = ['error' => 'No se pudo activar al usuario'];
                    echo json_encode($resolve);
                    return;
                }
            } else {
                $resolve = ['error' => 'Ocurrió un ERROR con los estados del usuario'];
                echo json_encode($resolve);
            }
        }
    }

    public static function datos()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            switch ($_POST['tipo']) {
                case 'usuarios':
                    $consulta = "SELECT u.id,u.nombre,u.cedula,u.celular,u.email,r.rol,un.unidad,u.estado,u.created_at,u.updated_at FROM user u INNER JOIN roles r ON r.id = u.idRol INNER JOIN unidad un ON un.id = u.idUnidad  ORDER BY u.id ASC";
                    $todos = User::consultaPlana($consulta);
                    echo json_encode($todos);
                    break;
                case 'usuario':
                    $id = $_POST['id'];
                    $consulta = "SELECT u.id,u.nombre,u.cedula,u.celular,u.email,r.rol,un.unidad,u.estado,u.created_at,u.updated_at FROM user u INNER JOIN roles r ON r.id = u.idRol INNER JOIN unidad un ON un.id = u.idUnidad WHERE u.id = $id";
                    $user = User::consultaPlana($consulta);
                    echo json_encode(array_shift($user));
                    break;
                case 'permisosUserCarpeta':
                    $idUser = $_POST['idUser'];
                    $idSeccion = $_POST['idSeccion'];
                    $consulta = "SELECT su.*,u.nombre,s.seccion FROM seccion_user su INNER JOIN user u on u.id = su.idUser INNER JOIN seccion s ON s.id = su.idSeccion WHERE su.idUser = $idUser and su.idSeccion = $idSeccion";
                    $todos = User::consultaPlana($consulta);
                    echo json_encode($todos);
                    break;
                case 'unidades':
                    $unidades = Unidad::all();
                    echo json_encode($unidades);
                    break;
                case 'roles':
                    $roles = Roles::all();
                    echo json_encode($roles);
                    break;
                case 'seccion':
                    $seccion = Seccion::all();
                    echo json_encode($seccion);
                    break;
                default:
                    $resolve = [
                        'error' => 'No existe consulta de ese tipo'
                    ];
                    echo json_encode($resolve);
                    return;
                    break;
            }
        }
    }

    public static function buscarSeccion(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {

            $consulta = "SELECT u.* FROM user u INNER JOIN roles r ON r.id = u.idRol INNER JOIN unidad un ON un.id = u.idUnidad";
            $todos = User::consultaPlana($consulta);
            $usuarios = [];
            foreach ($todos as $user) {
                if (isset($user['password'])) {
                    unset($user['password']);
                }
                $id = $user['id'];
                $idUnidad = $user['idUnidad'];
                $consulta = "SELECT su.idUser,su.idSeccion,su.permisos,s.id,s.seccion FROM seccion_user su INNER JOIN user u ON u.id = su.idUser INNER JOIN seccion s ON s.id = su.idseccion  WHERE  su.idUser = '{$id}'";
                $seccion = SeccionUser::consultaPlana($consulta);
                $user['seccion'] = json_encode($seccion);
                if (empty($seccion)) {
                    $consulta = "SELECT su.idUnidad,u.unidad,su.idSeccion,su.permisos,s.id,s.seccion FROM seccion_unidad su INNER JOIN unidad u ON u.id = su.idUnidad INNER JOIN seccion s ON s.id = su.idseccion  WHERE  su.idUnidad = '{$idUnidad}'";
                    $seccion = SeccionUnidad::consultaPlana($consulta);
                    $user['seccion'] = json_encode($seccion);
                    $consulta = "SELECT un.unidad FROM user us INNER JOIN unidad un ON un.id = us.idUnidad WHERE us.id = '{$id}'";
                    $seccionNombre = User::consultaSeccion($consulta);
                    $user['permisosWhere'] =  $seccionNombre;
                }
                array_push($usuarios, $user);
            };
            echo json_encode($usuarios);
        }
    }

    public static function saveSeccionUsers()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $user = User::find($id);
            if ($user) {
                $idUser = $user->id;
                $cont = [];
                $seccionesNuevas = json_decode($_POST['permisos']);
                $seccionesActuales = SeccionUser::whereTodos('idUser', $idUser);
                //dd($seccionesNuevas);
                $idSeccionesNuevas = [];
                foreach ($seccionesNuevas as $seccionNueva) {
                    $idSeccion = $seccionNueva->idSeccion->value;
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
                        if ($sec->idSeccion->value == $arr) {
                            array_push($arrSecCrear, $sec);
                        }
                    }
                }

                foreach ($arrSecCrear as $crear) {
                    $permisoUser = [
                        'idUser' => $idUser,
                        'idSeccion' => $crear->idSeccion->value,
                        'permisos' =>  json_encode($crear->idPermisos)
                    ];
                    $permisoCreado = new SeccionUser($permisoUser);
                    $resultado = $permisoCreado->guardar();
                    array_push($cont, $resultado['resultado']);
                }
                /* ==================================================================
                                Funcion para MODIFICAR secciones con permisos actuales
                        =====================================================================*/
                foreach ($arrayModificar as $key => $arrUpdate) {
                    foreach ($seccionesNuevas as $seccionNuevaActualizar) {
                        if ($seccionNuevaActualizar->idSeccion->value == $arrUpdate) {
                            $idSeccion = $seccionNuevaActualizar->idSeccion->value;
                            $permisos = json_encode($seccionNuevaActualizar->idPermisos);
                            $resultado = SeccionUser::actualizarSeccion('permisos', $permisos, 'idUser', $idUser, 'idSeccion', $idSeccion);
                            array_push($cont, $resultado);
                        }
                    }
                }
                /* ==============================================================
                                Funcion para ELIMINAR secciones con permisos actuales
                        =================================================================*/
                $seccionesEliminar = [];
                foreach ($arrayEliminar as $key => $arr) {
                    $consulta = "SELECT * from seccion_user WHERE idUser = '$idUser' AND idSeccion = '$arr'";
                    $permi = SeccionUser::consultarSQL($consulta);
                    array_push($seccionesEliminar, array_shift($permi));
                }

                foreach ($seccionesEliminar as $arrDelete) {
                    $resultado = SeccionUser::eliminarTodos('id', $arrDelete->id);
                    array_push($cont, $resultado);
                }
                /* ==============================================================
                                Validar que todas las trasacciones esten en TRUE 
                        =================================================================*/
                $filtroAllPass = array_diff($cont, ['true' => true]);
                if (empty($filtroAllPass)) {
                    $resolve = [
                        'exito' => 'Usuario actualizado con permisos correctamente'
                    ];
                    echo json_encode($resolve);
                    return;
                } else {
                    /* ==========================================================================
                                Método para eliminar los cambios y se mantienen los de la BD
                        ================================================================================*/
                    $errores = [];
                    $seccionesActualizadas = SeccionUser::whereTodos('idUser', $idUser);
                    foreach ($seccionesActualizadas as $secUpdateDelete) {
                        $resultado = SeccionUser::eliminarTodos('id', $secUpdateDelete->id);
                        array_push($errores, $resultado);
                    }
                    foreach ($seccionesActuales as $secUpdateDeleted) {
                        $permisoUser = [
                            'idUser' => $idUser,
                            'idSeccion' => $secUpdateDeleted->idSeccion,
                            'permisos' =>  $secUpdateDeleted->permisos
                        ];
                        $permisoCreado = new SeccionUser($permisoUser);
                        $resultado = $permisoCreado->guardar();
                        array_push($errores, $resultado['resultado']);
                    }
                    $filtroAllError = array_diff($errores, ['true' => true]);
                    if (empty($filtroAllError)) {
                        $resolve = [
                            'error' => 'No se pudo actualizar los permisos del usuario'
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
                        $errorUserUpdate = [
                            'idUser' =>  $idUser,
                            'nombreUser' => $user->nombre,
                            'seccionUser' => $todasSecciones
                        ];
                        $errorGenerado = [
                            'tabla_error' => SeccionUser::getTabla(),
                            'controller_error' => $datosErrors['class'],
                            'function_error' => $datosErrors['function'],
                            'error' =>  json_encode($errorUserUpdate)
                        ];
                        $errorSave = new Errors($errorGenerado);
                        $errorSave->guardar();

                        $resolve = [
                            'error' => 'No se pudo actualizar los permisos del usuario'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                }
            } else {
                $resolve = [
                    'error' => 'El usuario no existe'
                ];
                echo json_encode($resolve);
                return;
            }
        }
    }
}
