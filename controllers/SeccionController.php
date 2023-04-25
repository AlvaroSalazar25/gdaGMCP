<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Model\Unidad;
use Model\Seccion;
use Classes\JsonWT;
use Exception;
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
                        $seccion = Seccion::all();  
                        echo json_encode($seccion);
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
                        case 'buscarCarpetas':
                            $id = $_POST['id'];
                            $value = $_POST['value'];
                            $consulta = "SELECT * FROM seccion s WHERE s.idPadre = $id AND s.seccion like '%$value%'";
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
                    $seccion->path = $seccion->getPath(); //metodo para generar path de carpeta
                    $resultado = $seccion->guardar(); // metodo para guardar
                    if ($resultado['resultado'] == true) {
                        $hijos = Seccion::whereTodos('idPadre', $_POST['idPadre']);
                        $resolve = [
                            'hijos' => $hijos,
                            'exito' => 'Carpeta creada correctamente'
                        ];
                        echo json_encode($resolve);
                        return;
                    } else {
                        $resolve = [
                            'error' => 'Ocurrió un problema al crear la Carpeta'
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
                if ($seccion) {
                    $padre = $seccion->idPadre;
                    try{
                        $seccionUnidad = SeccionUnidad::eliminarTodos('idSeccion', $seccion->id);
                        $seccionUser = SeccionUser::eliminarTodos('idSeccion', $seccion->id);
                        $docSeccion = Documento::eliminarTodos('idSeccion', $seccion->id);
                        $deletedCarpetas = rmDir_rf('../public/archivos'.$seccion->path);
                        $resultado = $seccion->eliminar();
                        if($resultado == true){
                            $hijos = Seccion::whereTodos('idPadre', $padre);
                            $resolve = [
                                'padre' => $padre,
                                'hijos' => $hijos,
                                'exito' => 'Carpeta eliminada correctamente'
                            ];
                            echo json_encode($resolve);
                            return;
                        }
                    } catch(Exception $e){
                        Seccion::generarError($e->getMessage());
                        return ['error' => 'No se pudo eliminar la carpeta'];
                    }
                } else {
                    $resolve = [
                        'error' => 'Carpeta no existe o no se encuentra'
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
