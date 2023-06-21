<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Model\Seccion;
use Classes\JsonWT;

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

    public static function permisosByCarpeta(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (!is_numeric($_GET['id'])) {
                header('Location:' . $_ENV['URL_BASE'] . '/permisos');
                return;
            };
            $carpeta = Seccion::find(intval($_GET['id']));
            if(!$carpeta){
                header('Location:' . $_ENV['URL_BASE'] . '/permisos');
                return;
            }
            $router->render('user/permisosCarpeta', [
                'alertas' => $alertas,
                'carpeta'=> $carpeta,
            ]);
        }
    }
}
