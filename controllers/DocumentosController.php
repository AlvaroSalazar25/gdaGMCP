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

define('token', $_SESSION['token'] ?? '');
class DocumentosController
{
    public static function index(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/documentos', [
                'alertas' => $alertas,
            ]);
        }
    }

    public static function visualizar(Router $router)
    {        
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $router->render('user/documentos', [
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
                case 'documentos':
                    $id = $_POST['id'];
                    $consulta = "SELECT d.id,u.nombre as responsable,s.seccion,f.nombre as formulario,d.codigo,d.alias,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario  WHERE d.idSeccion = $id";
                    $docs = Documento::consultaPlana($consulta);
                    echo json_encode($docs);
                    return;
                    break;
                case 'documento':
                    $id = $_POST['id'];
                    $consulta = "SELECT d.id,u.nombre as responsable,s.seccion,f.nombre as formulario,d.codigo,d.alias,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario  WHERE d.id = $id";
                    $doc = Documento::consultaPlana($consulta);
                    echo json_encode($doc);
                    return;
                    break;
                case 'seccion':
                    $seccion = Seccion::all();
                    echo json_encode($seccion);
                    return;
                    break;
                case 'formulario':
                    $formulario = Formulario::find($_POST['id']);
                    echo json_encode($formulario);
                    return;
                    break;
                case 'formularios':
                    $formularios = Formulario::all();
                    echo json_encode($formularios);
                    return;
                    break;
                case '5docs':
                    $consulta = "SELECT d.id,u.nombre as responsable,s.seccion,f.nombre as formulario,d.codigo,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario ORDER BY created_at DESC limit 5";
                    $docs = Documento::consultaPlana($consulta);
                    echo json_encode($docs);
                    return;
                    break;
                default:
                    $resolve = ['error' => 'No existe busqueda de ese tipo'];
                    echo json_encode($resolve);
                    return;
                    break;
            }
        }
    }

    public static function create(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!isset($_SESSION)) {
                session_start();
            }
            // try{
            $archivo = new Documento($_POST);
            $alertas = $archivo->validar();
            if (!empty($alertas)) {
                $resolve = ['alertas' => $alertas];
                echo json_encode($resolve);
                return;
            }
            if (!$_FILES) {
                $resolve = ['archivo' => 'Falta agregar el archivo'];
                echo json_encode($resolve);
                return;
            }
            $archivo->codigo = $archivo->getCodigo();
            $archivo->idUser = $_SESSION['id'];
            $archivo->path = $archivo->getPath();
            $resultado = $archivo->guardar();
            if ($resultado != true) {
                $resolve = ['error' => 'Error al guardar el archivo'];
                echo json_encode($resolve);
                return;
            }
            $carpetaArchivo = '../public/archivos/';
            $path = explode("/", $_FILES['path']['type']);
            move_uploaded_file($_FILES['path']['tmp_name'], $carpetaArchivo . $archivo->path);
            $resolve = ['exito' => 'Archivo Guardado Correctamente'];
            echo json_encode($resolve);
            return;
        }
    }

    public static function update()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $documento = Documento::find($_POST['id']);
            $documento->sincronizar($_POST);
            $alertas = $documento->validar();
            if (!empty($alertas)) {
                $resolve = ['alertas' => $alertas];
                echo json_encode($resolve);
                return;
            }
            $resultado = $documento->guardar();
            if ($resultado != true) {
                $resolve = ['error' => 'Error al actualizar la metadata del documento'];
                echo json_encode($resolve);
                return;
            }
            $resolve = [
                'padre' => $documento->idSeccion,
                'exito' => 'Metadata actualizada Correctamente'
            ];
            echo json_encode($resolve);
            return;
        }
    }

    public static function delete()
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $alertas = [];
            $documento = Documento::find($_POST['id']);
            if (!$documento) {
                $resolve = ['error' => 'Documento no existe o no se encuentra'];
                echo json_encode($resolve);
                return;
            }
            $padre = $documento->idSeccion;
            $documento->deleteDoc();
            $resultado = $documento->eliminar();
            if($resultado != true){
                $resolve = ['error' => 'No se pudo eliminar el documento'];
                echo json_encode($resolve);
                return;  
            }
            $resolve = [
                'padre' => $padre,
                'exito' => 'Documento Eliminado Correctamente'
            ];
            echo json_encode($resolve);
            return;
        }
    }
}
