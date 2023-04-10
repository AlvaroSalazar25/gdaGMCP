<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Model\Unidad;
use Model\Seccion;
use Classes\JsonWT;
use DOTNET;
use Model\ActiveRecord;
use Model\Documento;
use Model\Formulario;
use Model\SeccionUser;
use Model\SeccionUnidad;


define('token', $_SERVER['HTTP_TOKEN'] ?? '');
class DocumentosController
{
    public static function index(Router $router)
    {
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/documentos', [
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
                    case 'documentos':
                        $id = $_POST['id'];
                        $consulta = "SELECT d.id,u.nombre as responsable,s.seccion,f.nombre as formulario,d.codigo,d.data,d.keywords,d.path,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario  WHERE d.idSeccion = $id";
                        $docs = Documento::consultaPlana($consulta);
                        echo json_encode($docs);
                        return;
                        break;
                    case 'seccion':
                        $consulta = "SELECT s.id,s.seccion,s.idFormulario,f.nombre as nombreFormulario from seccion s INNER JOIN formulario f on f.id = s.idFormulario";
                        $secciones = Documento::consultaPlana($consulta);
                        echo json_encode($secciones);
                        return;
                        break;
                    case 'formularios':
                        $consulta = "SELECT s.id,s.seccion as nombreSeccion,s.idFormulario,f.nombre,f.keywords,f.campos,f.version,f.archivo from seccion s INNER JOIN formulario f on f.id = s.idFormulario";
                        $formularios = Formulario::consultaPlana($consulta);
                        echo json_encode($formularios);
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
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $validar = JsonWT::validateJwt(token);
            if ($validar['status'] == true) {
                if (!isset($_SESSION)) {
                    session_start();
                }
                $archivo = new Documento($_POST);
                $archivo->idUser = $_SESSION['id'];
                $alertas = $archivo->validar();
                if(empty($alertas)){
                    if(!$_FILES['path']){
                        dd('hola');
                        $resolve = [
                            'error' => 'Ocurrió un problema al cargar el archivo'
                        ];
                        echo json_encode($resolve);
                        return;
                    } else{
                        $resultado = $archivo->saveDoc();
                    }
                }

                
                if (empty($alertas)) {
                    $respuesta = $archivo->guardar();
                    dd($respuesta);
                    if ($respuesta['resultado'] == true) {
                        $resolve = [
                            'exito' => 'Archivo guardado correctamente'
                        ];
                        echo json_encode($respuesta);
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
}
