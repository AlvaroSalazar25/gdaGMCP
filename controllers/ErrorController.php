<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Classes\JsonWT;

define('token', $_SESSION['token'] ?? '');
if (!isset($_SESSION)) {
    session_start();
};
class ErrorController
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

    public static function datos(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
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
    }
}
