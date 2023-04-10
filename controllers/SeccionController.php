<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Model\Unidad;
use Model\Seccion;
use Classes\JsonWT;
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
                        $consulta = "SELECT s.id,s.seccion,s.idFormulario,f.nombre as nombreFormulario from seccion s LEFT OUTER JOIN formulario f on f.id = s.idFormulario";
                        $seccionFormularios = Seccion::consultaPlana($consulta);
                        echo json_encode($seccionFormularios);
                        break;
                        case 'formularios':
                            $formularios = Formulario::all();
                            array_shift($formularios);
                            echo json_encode($formularios);
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
                        $resolve = [
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
                $id = $_POST['id'];
                $seccion = Seccion::find($id);
                if($seccion){
                    $seccion->sincronizar($_POST);
                    $alertas = $seccion->validar();

                    if (empty($alertas)) {
                        $resultado = $seccion->guardar();
                        //dd($resultado);
                        if ($resultado == true) {
                            $resolve = [
                                'exito' => 'Sección actualizada correctamente'
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

                
            }
        } else if ($validar['status'] == false) {
            $resolve = [
                'exit' => $validar['error']
            ];
            echo json_encode($resolve);
            return;
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
                    $seccionUnidad = SeccionUnidad::eliminarTodos('idSeccion',$seccion->id);
                    if($seccionUnidad != true){
                        $resolve = [
                            'error' => 'No se pudo eliminar las Unidades asociadas a la Sección'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                    $seccionUser = SeccionUser::eliminarTodos('idSeccion',$seccion->id);
                    if($seccionUser != true){
                        $resolve = [
                            'error' => 'No se pudo eliminar los Usuarios asociadas a la Sección'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                    $resultado = $seccion->eliminar();
                    if ($resultado == true) {
                            $resolve = [
                                'exito' => 'Sección eliminada correctamente'
                            ];
                            echo json_encode($resolve);
                            return;
                        } else {
                            $resolve = [
                                'error' => 'Ocurrió un problema al Eliminar la Sección'
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
