<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Model\Unidad;
use Model\Seccion;
use Classes\JsonWT;
use Model\Documento;
use Model\Formulario;
use Model\SeccionUser;
use Model\SeccionUnidad;

define('token', $_SERVER['HTTP_TOKEN'] ?? '');
class SeccionController
{
    public static function index(Router $router)
    {
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/secciones', [
                'alertas' => $alertas,
            ]);
        }
    }

    public static function datos(Router $router)
    {
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $validar = JsonWT::validateJwt(token);
            if ($validar['status'] == true) {
                switch ($_POST['tipo']) {
                    case 'seccion':
                        //$roles = seccionRoles::consultaPlana($consulta);
                        $consulta = "SELECT s.id,s.seccion,s.descripcion,s.idFormulario,s.idPadre,f.nombre as nombreFormulario from seccion s LEFT OUTER JOIN formulario f on f.id = s.idFormulario";
                        $seccionFormularios = Seccion::consultaPlana($consulta);
                        echo json_encode($seccionFormularios);
                        break;
                    case 'formularios':
                        $formularios = Formulario::all();
                        array_shift($formularios);
                        echo json_encode($formularios);
                        break;
                    case 'hijos':
                        $id = $_POST['id'];
                        $consulta = "SELECT s.* from seccion s WHERE s.idPadre = $id";
                        $hijos = Seccion::consultaPlana($consulta);
                        echo json_encode($hijos);
                        break;
                    case 'documentos':
                        $id = $_POST['id'];
                        $consulta = "SELECT d.id,u.nombre as responsable,s.seccion,f.nombre as formulario,d.codigo,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario  WHERE d.idSeccion =  $id";
                        $documentos = Seccion::consultaPlana($consulta);
                        echo json_encode($documentos);
                        break;

                    default:
                        $resolve = [
                            'error' => 'No existe búsqueda de ese tipo'
                        ];
                        echo json_encode($resolve);
                        return;
                        break;
                }
            } else if ($validar['status'] == false) {
                $resolve = [
                    'exit' => $validar['error']
                ];
                echo json_encode($resolve);
                return;
            }
        }
    }

    public static function create(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] == true) {
            $alertas = [];
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {

                $seccion = new Seccion($_POST);
                $alertas = $seccion->validar();
                if (empty($alertas)) {
                    $resultado = $seccion->guardar();
                    if ($resultado['resultado'] == true) {
                        $hijos = Seccion::whereTodos('idPadre', $_POST['idPadre']);
                        $resolve = [
                            'hijos' => $hijos,
                            'exito' => 'Sección agredada correctamente'
                        ];
                        echo json_encode($resolve);
                        return;
                    } else {
                        $resolve = [
                            'error' => 'Ocurrió un problema al guardar la Sección'
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
        } else if ($validar['status'] == false) {
            $resolve = [
                'exit' => $validar['error']
            ];
            echo json_encode($resolve);
            return;
        }
    }

    public static function update(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] == true) {
            $alertas = [];
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                switch ($_POST['tipo']) {
                    case 'updatePadre':
                        $id = $_POST['padre'];
                        $seccion = Seccion::find($id);
                        $padre = $seccion->id;
                        if ($seccion) {
                            $seccion->sincronizar($_POST);
                            $alertas = $seccion->validar();
                            if (empty($alertas)) {
                                $resultado = $seccion->guardar();
                                if ($resultado == true) {
                                    $hijos = Seccion::whereTodos('idPadre', $padre);
                                    $resolve = [
                                        'hijos' => $hijos,
                                        'exito' => 'Sección actualizada correctamente'
                                    ];
                                    echo json_encode($resolve);
                                    return;
                                } else {
                                    $hijos = Seccion::whereTodos('idPadre', $padre);
                                    $resolve = [
                                        'hijos' => $hijos,
                                        'error' => 'Ocurrió un problema al guardar la Sección'
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
                        } else {
                            $resolve = [
                                'error' => 'La Sección no Existe'
                            ];
                            echo json_encode($resolve);
                            return;
                        }
                        break;
                    case 'updateHijo':
                        $id = $_POST['hijo'];
                        $seccion = Seccion::find($id);
                        $padre = $seccion->idPadre;
                        if ($seccion) {
                            $seccion->sincronizar($_POST);
                            $alertas = $seccion->validar();
                            if (empty($alertas)) {
                                $resultado = $seccion->guardar();
                                if ($resultado == true) {
                                    $hijos = Seccion::whereTodos('idPadre', $padre);
                                    $resolve = [
                                        'hijos' => $hijos,
                                        'exito' => 'Sección actualizada correctamente'
                                    ];
                                    echo json_encode($resolve);
                                    return;
                                } else {
                                    $hijos = Seccion::whereTodos('idPadre', $padre);
                                    $resolve = [
                                        'hijos' => $hijos,
                                        'error' => 'Ocurrió un problema al guardar la Sección'
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
                        } else {
                            $resolve = [
                                'error' => 'La Sección no Existe'
                            ];
                            echo json_encode($resolve);
                            return;
                        }
                        break;
                    default:
                        $resolve = [
                            'error' => 'No existe búsqueda de ese tipo'
                        ];
                        echo json_encode($resolve);
                        return;
                        break;
                }
            } else if ($validar['status'] == false) {
                $resolve = [
                    'exit' => $validar['error']
                ];
                echo json_encode($resolve);
                return;
            }
        }
    }

    public static function delete()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] == true) {
            $alertas = [];
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $seccion = Seccion::find($_POST['id']);
                $padre = $seccion->idPadre;
                if ($seccion) {
                    $seccionUnidad = SeccionUnidad::eliminarTodos('idSeccion', $seccion->id);
                    if ($seccionUnidad != true) {
                        $resolve = [
                            'error' => 'No se pudo eliminar las Unidades asociadas a la Sección'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                    $seccionUser = SeccionUser::eliminarTodos('idSeccion', $seccion->id);
                    if ($seccionUser != true) {
                        $resolve = [
                            'error' => 'No se pudo eliminar los Usuarios asociadas a la Sección'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                    $docSeccion = Documento::eliminarTodos('idSeccion', $seccion->id);
                    if ($docSeccion == true) {
                        $resultado = $seccion->eliminar();
                        if ($resultado == true) {
                            $hijos = Seccion::whereTodos('idPadre', $padre);
                            $resolve = [
                                'padre' => $padre,
                                'hijos' => $hijos,
                                'exito' => 'Sección eliminada correctamente'
                            ];
                            echo json_encode($resolve);
                            return;
                        } else {
                            $hijos = Seccion::whereTodos('idPadre', $padre);
                            $resolve = [
                                'padre' => $padre,
                                'hijos' => $hijos,
                                'error' => 'Ocurrió un problema al Eliminar la Sección'
                            ];
                            echo json_encode($resolve);
                            return;
                        }
                    } else {
                        $datosError = debug_backtrace();
                        $datosErrors = array_shift($datosError);
                        $errorUnidadUpdate = [
                            'idSeccion' =>  $seccion->id,
                            'nombreSeccion' => $seccion->seccion,
                            'padreSeccion' => $seccion->idPadre
                        ];
                        $errorGenerado = [
                            'tabla_error' => Seccion::getTabla(),
                            'controller_error' => $datosErrors['class'],
                            'function_error' => $datosErrors['function'],
                            'error' =>  json_encode($errorUnidadUpdate)
                        ];
                        $errorSave = new Errors($errorGenerado);
                        $errorSave->guardar();

                        $resolve = [
                            'error' => 'Ocurrió un problema al Eliminar los documentos de la sección'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                } else {
                    $resolve = [
                        'error' => 'Sección no existe o no se encuentra'
                    ];
                    echo json_encode($resolve);
                    return;
                }
            }
        } else if ($validar['status'] == false) {
            $resolve = [
                'exit' => $validar['error']
            ];
            echo json_encode($resolve);
            return;
        }
    }
}
