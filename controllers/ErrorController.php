<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Classes\JsonWT;

define('token', $_SERVER['HTTP_TOKEN'] ?? '');

class ErrorController
{
    public static function index(Router $router)
    {
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/errores', [
                'alertas' => $alertas,
            ]);
        }
    }

    public static function datos(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] == true) {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                switch ($_POST['tipo']) {
                    case 'errores':
                        $errores = Errors::all();
                        echo json_encode($errores);
                        return;
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
        } else if ($validar['status'] == false) {
            $resolve = [
                'exit' => $validar['error']
            ];
            echo json_encode($resolve);
            return;
        }
    }
}