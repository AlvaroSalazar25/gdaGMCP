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
use Exception;

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
                        $consulta = "SELECT d.id,u.nombre as responsable,s.seccion,f.nombre as formulario,d.codigo,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario  WHERE d.idSeccion = $id";
                        $docs = Documento::consultaPlana($consulta);
                        echo json_encode($docs);
                        return;
                        break;
                    case 'seccion':
                        $consulta = "SELECT s.id,s.seccion,s.idFormulario,s.idPadre,f.nombre as nombreFormulario from seccion s INNER JOIN formulario f on f.id = s.idFormulario";
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
                    case '5docs':
                        $consulta = "SELECT d.id,u.nombre as responsable,s.seccion,f.nombre as formulario,d.codigo,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario ORDER BY created_at DESC limit 5";
                        $docs = Documento::consultaPlana($consulta);
                        echo json_encode($docs);
                        return;
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
                if (empty($alertas)) {
                    if (!$_FILES) {
                        $resolve = [
                            'archivo' => 'Falta agregar el archivo'
                        ];
                        echo json_encode($resolve);
                        return;
                    } else {
                        $resultado = $archivo->saveDoc();
                        if ($resultado['resultado'] == true) {
                            $resolve = [
                                'exito' => 'Archivo Guardado Correctamente'
                            ];
                            echo json_encode($resolve);
                            return;
                        } else {
                            $resolve = [
                                'error' => 'Error al guardar el archivo'
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
    }
}
