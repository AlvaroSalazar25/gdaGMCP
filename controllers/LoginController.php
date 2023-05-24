<?php

namespace Controllers;

use Model\User;
use MVC\Router;
use Classes\Email;
use Classes\JsonWT;

class LoginController
{

    public static function login(Router $router)
    {
        $alertas = [];
        $auth = new User;
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('auth/login', [
                'alertas' => $alertas,
                'admin' => $auth
            ]);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new User($_POST);
            $alertas = $auth->validarEmail();
            if (empty($alertas)) {
                $alertas = $auth->validarPassword();
            }
            if (empty($alertas)) {
                $user = User::where('email', $auth->email);
                if ($user) {
                    if ($user->verificarPassword($auth->password) == true) {
                        //dd('adfad');
                        $jwt = new JsonWT($user->id, $user->email);
                        $resolve = $jwt->createJwt();
                        $user->token = $resolve['jwt'];
                        $user->guardar();
                        $consulta = "SELECT r.rol FROM user u INNER JOIN roles r ON r.id = u.idRol INNER JOIN unidad un ON un.id = u.idUnidad  WHERE u.id = '{$user->id}'";
                        $respuesta =  User::consultaPlana($consulta);
                        $rolUser = (object) array_shift( $respuesta);
                        if (!isset($_SESSION)) {
                            session_start();
                        }
                        $_SESSION['id'] = $user->id;
                        $_SESSION['nombre'] = $user->nombre;
                        $_SESSION['email'] = $user->email;
                        $_SESSION['login'] = true;
                        $_SESSION['idRol'] = $user->idRol;
                        $_SESSION['rol'] = $rolUser->rol;
                        $_SESSION['token'] = $user->token;
                        
                        //dd($_SESSION);
                        switch ($_SESSION['idRol']) {
                            case 1:
                                $resolve = [
                                    'exito' => '/admin',
                                    'token' => $_SESSION['token']
                                ];
                                echo json_encode($resolve);
                                break;
                            case 2:
                                $resolve = [
                                    'exito' => '/editor',
                                    'token' => $_SESSION['token']
                                ];
                                echo json_encode($resolve);
                                break;
                            default:
                                $resolve = [
                                    'exito' => '/'
                                ];
                                echo json_encode($resolve);
                                break;
                        }
                    } else {
                        $resolve = [
                            'error' => 'Contraseña incorrecta, vuelva a intentarlo'
                        ];
                        echo json_encode($resolve);
                        return;
                    }
                } else {
                    $resolve = [
                        'error' => 'Usuario no encontrado'
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


    public static function olvide(Router $router)
    {

        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new User($_POST);
            $alertas = $auth->validarEmail();
            if (empty($alertas)) {
                $usuario = User::where('email', $auth->email);

                if ($usuario && $usuario->confirmado == 0) {
                    $usuario->crearToken();
                    $usuario->guardar();
                    //Enviar email con token e instrucciones
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();
                    User::setAlerta('exito', 'Instrucciones enviadas con éxito al correo electrónico');
                } else {
                    User::setAlerta('error', 'El usuario no existe ');
                }
            } else {
                $alertas = User::getAlertas();
            }
        }
        $alertas = User::getAlertas();
        $router->render('auth/olvide', [
            'alertas' => $alertas,
        ]);
    }

    public static function recuperar(Router $router)
    {
        $alertas = [];
        $error = false;
        $token = s($_GET['token']);

        //Buscar al usuario
        $user = User::where('token', $token);
        if (empty($user)) {
            User::setAlerta('error', 'Token no válido');
            $error = true;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            //leer el nuevo password
            $newPassword = new User($_POST);
            $alertas = $newPassword->comprobarPassword();
            if (empty($alertas)) {
                $user->password = null;
                $user->password = $newPassword->password;
                $user->hashPassword();
                $user->token = null;
                $resultado = $user->guardar();
                if ($resultado) {
                    $alertas = User::getAlertas();
                    header('Location:' . $_ENV['URL_BASE'] . '/?r=1');
                }
            }
        }

        $alertas = User::getAlertas();
        $router->render('auth/recuperar', [
            'alertas' =>  $alertas,
            'error' =>  $error
        ]);
    }
    
    public static function logout(Router $router)
    {
        session_destroy();
        $_SESSION = [];
        $alertas = [];
        $router->render('auth/login', [
            'alertas' =>  $alertas
        ]);
    }
}
