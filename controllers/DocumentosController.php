<?php

namespace Controllers;

use DOTNET;
use Exception;
use Model\User;
use MVC\Router;
use Model\Errors;
use Model\Unidad;
use Model\Seccion;
use Classes\JsonWT;
use Model\Documento;
use Model\Formulario;
use Model\SeccionUser;
use Model\ActiveRecord;
use Model\HistorialDoc;
use Model\SeccionUnidad;

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
                    $consulta = "SELECT d.id,u.nombre as responsable,s.seccion,f.nombre as formulario,d.codigo,d.alias,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario  WHERE d.idSeccion = $id ORDER BY d.created_at DESC";
                    $docs = Documento::consultaPlana($consulta);
                    echo json_encode($docs);
                    return;
                    break;
                case 'documento':
                    $id = $_POST['id'];
                    $consulta = "SELECT d.id,u.nombre as responsable,d.idSeccion as idSeccion,s.seccion,f.nombre as formulario,d.codigo,d.alias,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario  WHERE d.id = $id ORDER BY d.created_at DESC";
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
                case 'historial':
                    $id = $_POST['idSeccion'];
                    $consultaPadre = "SELECT hd.*,u.nombre,s.seccion as nombreSeccion FROM historial_documento hd LEFT JOIN user u ON u.id = hd.idUser LEFT JOIN seccion s ON s.id = hd.idSeccion LEFT JOIN documento d ON d.id = hd.idDocumento WHERE hd.idPadre = $id ORDER BY hd.created_at DESC";
                    $historialPadre = HistorialDoc::consultaPlana($consultaPadre);
                    $consulta = "SELECT hd.*,u.nombre,s.seccion as nombreSeccion FROM historial_documento hd LEFT JOIN user u ON u.id = hd.idUser LEFT JOIN seccion s ON s.id = hd.idSeccion LEFT JOIN documento d ON d.id = hd.idDocumento WHERE hd.idSeccion = $id ORDER BY hd.created_at DESC";
                    $historial = HistorialDoc::consultaPlana($consulta);
                    $mergedArray = array_merge($historial, $historialPadre);
                    $sorted = ordenarPorCreatedAt($mergedArray);
                    echo json_encode($sorted);
                    break;
                case 'historialByDoc':
                    $id = $_POST['idDoc'];
                    $consulta = "SELECT hd.*,u.nombre,s.seccion as nombreSeccion FROM historial_documento hd LEFT JOIN user u ON u.id = hd.idUser LEFT JOIN seccion s ON s.id = hd.idSeccion LEFT JOIN documento d ON d.id = hd.idDocumento WHERE hd.idDocumento = $id ORDER BY hd.created_at DESC";
                    $historial = HistorialDoc::consultaPlana($consulta);
                    echo json_encode($historial);
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
            try {
                Documento::initTransaction();
                $archivo = new Documento($_POST);
                $seccion = Seccion::where('id', $archivo->idSeccion);
                if (intval($_SESSION['idRol']) == 1) {
                    $permisosUser = 'Permiso total';
                } else {
                    $permisosUser = SeccionUser::whereCampos('idUser', $_SESSION['id'], 'idSeccion', $seccion->id);
                }
                if ($seccion->status != 0) {
                    $resolve = ['alertas' => ['error' => array('Carpeta en movimiento, Espere...')]];
                    echo json_encode($resolve);
                    return;
                }
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
                    throw new Exception('Error al guardar el archivo, problema en la información o en las columnas de la BD');
                }
                setHistorialDoc($_SESSION['id'], $_SESSION['nombre'], $seccion->idPadre, $seccion->id, $seccion->seccion, $resultado['id'], $archivo->codigo, 'create', json_encode(['new' => $archivo, 'old' => null]), json_encode($permisosUser));
                $carpetaArchivo = '../public/archivos';
                if (!is_dir($carpetaArchivo . $seccion->path)) {
                    throw new Exception('No existe la carpeta en el servidor, revisar si la carpeta existe dentro de la carpeta public/archivo en la raíz de la aplicación');
                }
                move_uploaded_file($_FILES['path']['tmp_name'], $carpetaArchivo . $archivo->path);
                Documento::endTransaction();
                $resolve = ['exito' => 'Archivo Guardado Correctamente'];
                echo json_encode($resolve);
                return;
            } catch (Exception $e) {
                Documento::rollback();
                Documento::generarError($e->getMessage());
                $resolve = ['error' => 'Error al guardar el archivo, Intente más tarde'];
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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                Documento::initTransaction();
                $documento = Documento::find($_POST['id']);
                $oldDoc = json_encode($documento);
                $documento->sincronizar($_POST);
                $seccion = Seccion::where('id', $documento->idSeccion);
                if ($seccion->status != 0) {
                    $resolve = ['alertas' => ['error' => array('Carpeta en movimiento, Espere...')]];
                    echo json_encode($resolve);
                    return;
                }
                // Temas de Historial
                if (intval($_SESSION['idRol']) == 1) {
                    $permisosUser = 'Permiso total';
                } else {
                    $permisosUser = SeccionUser::whereCampos('idUser', $_SESSION['id'], 'idSeccion', $seccion->id);
                    if (empty($permisosUser)) {
                        $user = User::find($_SESSION['id']);
                        $permisosUser = SeccionUnidad::whereCampos('idUnidad', $user->idUnidad, 'idSeccion', $seccion->id);
                    }
                }
                $alertas = $documento->validar();
                if (!empty($alertas)) {
                    $resolve = ['alertas' => $alertas];
                    echo json_encode($resolve);
                    return;
                }
                $resultado = $documento->guardar();
                if ($resultado != true) {
                    throw new Exception('Error al actualizar la metadata del documento, problemas con la información o con las columnas en la BD');
                }
                setHistorialDoc($_SESSION['id'], $_SESSION['nombre'], $seccion->idPadre, $seccion->id, $seccion->seccion, $documento->id, $documento->codigo, 'update', json_encode(['new' => $documento, 'old' => json_decode($oldDoc)]), json_encode($permisosUser));
                Documento::endTransaction();
                $resolve = [
                    'padre' => $documento->idSeccion,
                    'exito' => 'Metadata actualizada Correctamente'
                ];
                echo json_encode($resolve);
                return;
            } catch (Exception $e) {
                Documento::rollback();
                Documento::generarError($e->getMessage());
                $resolve = ['error' => 'Error al actualizar el archivo, Intente más tarde...'];
                echo json_encode($resolve);
                return;
            }
        }
    }

    public static function mover(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }

        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                Documento::initTransaction();
                $id = $_POST['idSeccionNueva'];
                $seccionAnterior = Seccion::find($_POST['idSeccionAnterior']);
                $seccionNueva = Seccion::find($id);
                if ($seccionAnterior->status == 1 || $seccionNueva->status == 1) {
                    $resolve = ['alertas' => ['error' => array('Carpeta en movimiento, Espere...')]];
                    echo json_encode($resolve);
                    return;
                }
                $idDocs = json_decode($_POST['documentos']);
                foreach ($idDocs as $idDoc) {
                    $documento = Documento::find($idDoc);
                    $seccion = Seccion::find($documento->idSeccion);

                    if (intval($_SESSION['idRol']) == 1) {
                        $permisosUser = 'Permiso total';
                    } else {
                        $permisosUser = SeccionUser::whereCampos('idUser', $_SESSION['id'], 'idSeccion', $seccion->id);
                        if (empty($permisosUser)) {
                            $user = User::find($_SESSION['id']);
                            $permisosUser = SeccionUnidad::whereCampos('idUnidad', $user->idUnidad, 'idSeccion', $seccion->id);
                        }
                    }
                    $oldDoc = json_encode($documento);
                    $documento->idSeccion = $id;
                    $oldPath = $documento->path;
                    $documento->guardar();
                    $documento->path = $documento->getPath();
                    $resultado = $documento->guardar();
                    if ($resultado != true) {
                        throw new Exception('Error al mover el archivo en el servidor, problemas al guardar el path del documento en la BD');
                    }
                    $carpetaArchivos = '../public/archivos';
                    if (!is_dir($carpetaArchivos . $oldPath)) {
                        throw new Exception('Error al mover el archivo en el servidor, problemas con el path del documento, no se encuentra la carpeta en el servidor');
                    }
                    rename($carpetaArchivos . $oldPath, $carpetaArchivos . $documento->path);
                    setHistorialDoc($_SESSION['id'], $_SESSION['nombre'], $seccion->idPadre, $seccion->id, $seccion->seccion, $documento->id, $documento->codigo, 'update(Mover)', json_encode(['new' => $documento, 'old' => json_decode($oldDoc)]), json_encode($permisosUser));
                }
                $respuesta = (count($idDocs) > 1) ? 'Documentos Movidos Correctamente' : 'Documento Movido Correctamente';
                $resolve = [
                    'padre' => $id,
                    'exito' => $respuesta
                ];
                echo json_encode($resolve);
                return;
            } catch (Exception $e) {
                Documento::rollback();
                Documento::generarError($e->getMessage());
                $resolve = ['error' => 'Error al mover el archivo, Intente más tarde...'];
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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                Documento::initTransaction();

                $alertas = [];
                $documento = Documento::find($_POST['id']);
                $seccion = Seccion::find($documento->idSeccion);
                if (!$documento) {
                    throw new Exception('No se encuentra el documento en el servidor => idDoc:'.$_POST['id']);
                }
                if (!$seccion) {
                    throw new Exception('No se encuentra la carpeta en el servidor => idCarpeta:'.$documento->idSeccion);
                }
                if (intval($_SESSION['idRol']) == 1) {
                    $permisosUser = 'Permiso total';
                } else {
                    $permisosUser = SeccionUser::whereCampos('idUser', $_SESSION['id'], 'idSeccion', $seccion->id);
                    if (empty($permisosUser)) {
                        $user = User::find($_SESSION['id']);
                        $permisosUser = SeccionUnidad::whereCampos('idUnidad', $user->idUnidad, 'idSeccion', $seccion->id);
                    }
                }
                $padre = $documento->idSeccion;
                $documento->deleteDoc();
                $resultado = $documento->eliminar();
                if ($resultado != true) {
                    $resolve = ['error' => 'No se pudo eliminar el documento'];
                    echo json_encode($resolve);
                    return;
                }
                setHistorialDoc($_SESSION['id'], $_SESSION['nombre'], $seccion->idPadre, $seccion->id, $seccion->seccion, $documento->id, $documento->codigo, 'delete', json_encode(['new' => $documento, 'old' => null]), json_encode($permisosUser));
                Documento::endTransaction();
                SeccionUser::endTransaction();
                SeccionUnidad::endTransaction();
                $resolve = [
                    'padre' => $padre,
                    'exito' => 'Documento Eliminado Correctamente'
                ];
                echo json_encode($resolve);
                return;
            } catch (Exception $e) {
                Documento::rollback();
                SeccionUser::rollback();
                SeccionUnidad::rollback();
                Documento::generarError($e->getMessage());
                $resolve = ['error' => 'No se pudo Eliminar el Documento'];
                echo json_encode($resolve);
                return;
            }
        }
    }
}
