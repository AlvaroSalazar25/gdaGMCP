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

define('token', $_SESSION['token'] ?? '');
if (!isset($_SESSION)) {
    session_start();
};
class FormularioController
{
    public static function index(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/formularios', [
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
                case 'formularios':
                    $formularios = Formulario::all();
                    echo json_encode($formularios);
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

    public static function create()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $formulario = new Formulario($_POST);
            $alertas = $formulario->validar();
            $Totalformularios = Formulario::all();
            if (empty($alertas)) {
                $cont = 1;
                foreach ($Totalformularios as $form) {
                    if (strtolower($form->nombre) == strtolower($formulario->nombre)) {
                        $cont++;
                    }
                }
                $formulario->version = $cont;
                $resultado = $formulario->guardar();
                if ($resultado['resultado'] == true) {
                    $resolve = [
                        'exito' => 'Formulario creada con permisos correctamente'
                    ];
                    echo json_encode($resolve);
                    return;
                } else {
                    $resolve = [
                        'error' => 'No se pudo guardar el formulario'
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

    public static function update()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $formulario = Formulario::find($id);
            $formulario->sincronizar($_POST);
            $formulario->version = intval($formulario->version) + 1;
            $resultado = $formulario->guardar();
            if ($resultado == true) {
                $resolve = [
                    'exito' => 'Formulario Actualizado Correctamente'
                ];
                echo json_encode($resolve);
                return;
            } else {
                $resolve = [
                    'error' => 'Ocurrió un error al Actualizar el Formulario'
                ];
                echo json_encode($resolve);
                return;
            }
        }
    }


    public static function agregar()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $seccion = Seccion::find($_POST['idSeccion']);
            if (isset($seccion)) {
                $seccion->sincronizar($_POST);
                $resultado = $seccion->guardar();
                if ($resultado == true) {
                    $resolve = [
                        'exito' => 'Formulario agregado correctamente'
                    ];
                    echo json_encode($resolve);
                    return;
                } else {
                    $resolve = [
                        'error' => 'Ocurrió un error al agregar el formulario'
                    ];
                    echo json_encode($resolve);
                    return;
                }
            } else {
                $resolve = [
                    'error' => 'Sección no existe'
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
            $formulario = Formulario::find($_POST['id']);
            if ($formulario) {
                $resultado = $formulario->eliminar();
                if ($resultado == true) {
                    $resolve = [
                        'exito' => 'Formulario eliminado correctamente'
                    ];
                    echo json_encode($resolve);
                    return;
                } else {
                    $resolve = [
                        'error' => 'Ocurrió un problema al Eliminar el Formulario'
                    ];
                    echo json_encode($resolve);
                    return;
                }
            } else {
                $resolve = [
                    'error' => 'Formulario no existe o no se encuentra'
                ];
                echo json_encode($resolve);
                return;
            }
        }
    }
}
