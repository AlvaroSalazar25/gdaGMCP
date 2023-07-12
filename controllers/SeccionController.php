<?php

namespace Controllers;

use MVC\Router;
use Model\Errors;
use Model\Unidad;
use Model\Seccion;
use Classes\JsonWT;
use Exception;
use Model\Documento;
use Model\Formulario;
use Model\Historial;
use Model\HistorialCarpeta;
use Model\SeccionUser;
use Model\SeccionUnidad;

define('token', $_SESSION['token'] ?? '');
if (!isset($_SESSION)) {
    session_start();
};
class SeccionController
{
    public static function index(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $router->render('user/carpetas', [
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
            if (!$carpeta) {
                header('Location:' . $_ENV['URL_BASE'] . '/permisos');
                return;
            }
            $router->render('user/permisosCarpeta', [
                'alertas' => $alertas,
                'carpeta' => $carpeta,
            ]);
        }
    }

    public static function carpetaById(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (!is_numeric($_GET['id'])) {
                header('Location:' . $_ENV['URL_BASE'] . '/carpeta?id=0');
                return;
            }; // aqui arreglar la vista de las secciones, esta cambiado el nombre d ela funcion en el index
            if ($_GET['id'] != 0) {
                $carpetas = Seccion::where('id', intval($_GET['id']));
                if (empty($carpetas)) {
                    header('Location:' . $_ENV['URL_BASE'] . '/carpeta?id=0&a=1');
                    return;
                }
            }
            $router->render('user/carpetas', [
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
            $alertas = [];
            switch ($_POST['tipo']) {
                case 'seccion':
                    $secciones = Seccion::all();
                    foreach ($secciones as $seccion) {
                        $respuesta = Seccion::getCarpetasHijos($seccion->id);
                        $seccion->carpetas = Seccion::obtenerSecRama($respuesta);
                        $seccion->pathLink = json_encode($seccion->getPathLink());
                    }
                    echo json_encode($secciones);
                    break;
                case 'seccionByIdPadre':
                    $id = $_POST['id'];
                    $hijos = Seccion::getCarpetasHijosAllData($id);
                    echo json_encode($hijos);
                    break;
                case 'formularios':
                    $formularios = Formulario::all();
                    array_shift($formularios);
                    echo json_encode($formularios);
                    break;
                case 'findCarpeta':
                    $id = $_POST['id'];
                    if ($id != 0) {
                        $carpeta = Seccion::where('id', $id);
                        $respuesta = Seccion::getCarpetasHijos($carpeta->id);
                        $carpeta->carpetas = Seccion::obtenerSecRama($respuesta);
                        $carpeta->pathLink = json_encode($carpeta->getPathLink());
                    } else {
                        $carpeta = FALSE;
                    }
                    echo json_encode($carpeta);
                    break;
                case 'hijos':
                    $id = $_POST['id'];
                    $hijos = Seccion::whereTodos('idPadre', $id);
                    foreach ($hijos as $hijo) {
                        $respuesta = Seccion::getCarpetasHijos($hijo->id);
                        $hijo->carpetas = Seccion::obtenerSecRama($respuesta);
                    }
                    echo json_encode($hijos);
                    break;
                case 'documentos':
                    $id = $_POST['id'];
                    $consulta = "SELECT d.id,u.nombre as responsable,s.seccion,f.nombre as formulario,d.alias,d.codigo,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at from documento d INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion  INNER JOIN formulario f ON f.id = d.idFormulario  WHERE d.idSeccion =  $id ORDER BY d.created_at DESC";
                    $documentos = Seccion::consultaPlana($consulta);
                    echo json_encode($documentos);
                    break;
                case 'buscarCarpetas':
                    $id = $_POST['id'];
                    $value = $_POST['value'];
                    $consulta = "SELECT * FROM seccion s WHERE s.idPadre = $id AND s.seccion like '%$value%'";
                    $secciones = Seccion::consultaPlana($consulta);
                    $carpetas = [];
                    foreach ($secciones as $seccion) {
                        $respuesta = Seccion::getCarpetasHijos(intval($seccion['id']));
                        $seccion['carpetas'] = Seccion::obtenerSecRama($respuesta);
                        array_push($carpetas, $seccion);
                    }
                    echo json_encode($carpetas);
                    break;
                case 'allDocs':
                    $id = $_POST['id'];
                    $respuesta = Seccion::getCarpetasHijos(intval($id));
                    array_push($respuesta, $id);
                    $documentos = Documento::obtenerAllDocs($respuesta);
                    echo json_encode($documentos);
                    break;
                case 'buscarPath':
                    $seccion = Seccion::where('id', intval($_POST['id']));
                    $seccion->pathLink = json_encode($seccion->getPathLink());
                    $respuesta = Seccion::getCarpetasHijos(intval($seccion->id));
                    $seccion->carpetas = Seccion::obtenerSecRama($respuesta);
                    echo json_encode($seccion);
                    break;
                case 'updateCarpetas':
                    $id = $_POST['id'];
                    $respuesta = Seccion::getCarpetasHijos(intval($id));
                    foreach ($respuesta as $resp) {
                        $resp->carpetas = Seccion::obtenerSecRama($respuesta);
                    }
                    echo json_encode($respuesta);
                    break;
                case 'historial':
                    $id = $_POST['idSeccion'];
                    $consultaPadre = "SELECT hs.*,u.nombre,s.seccion as nombreSeccion FROM historial_seccion hs LEFT JOIN user u ON u.id = hs.idUser LEFT JOIN seccion s ON s.id = hs.idSeccion WHERE hs.idPadre = $id ORDER BY hs.created_at DESC";
                    $historialPadre = HistorialCarpeta::consultaPlana($consultaPadre);
                    $consulta = "SELECT hs.*,u.nombre,s.seccion as nombreSeccion FROM historial_seccion hs LEFT JOIN user u ON u.id = hs.idUser LEFT JOIN seccion s ON s.id = hs.idSeccion WHERE hs.idSeccion = $id ORDER BY hs.created_at DESC";
                    $historial = HistorialCarpeta::consultaPlana($consulta);
                    $mergedArray = array_merge($historial, $historialPadre);
                    $sorted = ordenarPorCreatedAt($mergedArray);
                    echo json_encode($sorted);
                    break;
                default:
                    $resolve = ['error' => 'No existe búsqueda de ese tipo'];
                    echo json_encode($resolve);
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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                Seccion::initTransaction();
                $alertas = [];
                $seccion = new Seccion($_POST);
                $seccion->seccion = strtolower($seccion->seccion);
                $alertas = $seccion->validar();
                $padreSeccion = Seccion::where('id', $_POST['idPadre']);
                if ($padreSeccion && $padreSeccion->status != 0) {
                    $resolve = ['alertas' => ['error' => array('Carpeta en movimiento, Espere...')]];
                    echo json_encode($resolve);
                    return;
                }
                if (!empty($alertas)) {
                    $resolve = ['alertas' => $alertas];
                    echo json_encode($resolve);
                    return;
                }
                $seccion->path = $seccion->getPath(); //crear el path 
                $resultado = $seccion->guardar(); // metodo para guardar
                if ($resultado['resultado'] != true) {
                    throw new Exception('No se pudo guardar la carpeta, problemas con la información agregada o con las columnas en la BD');
                }
                $seccion->crearCarpeta();
                $seccion = Seccion::find($resultado['id']);
                setHistorialCarpeta($_SESSION['id'], $_SESSION['nombre'], $seccion->idPadre, $seccion->id, $seccion->seccion, 'create', json_encode(['new' => $seccion, 'old' => '']), 'Permiso total');
                $hijos = Seccion::wherePlano('idPadre', $_POST['idPadre']);
                // Mostrar las consultas SQL en espera
                Seccion::endTransaction();
                $resolve = [
                    'hijos' => $hijos,
                    'exito' => 'Carpeta creada correctamente'
                ];
                echo json_encode($resolve);
                return;
            } catch (Exception $e) {
                Seccion::rollback();
                Seccion::generarError($e->getMessage());
                return ['error' => 'No se pudo crear la carpeta, Intete más tarde...'];
            }
        }
    }

    public static function update(Router $router)
    {
        $validar = JsonWT::validateJwt(token);
        if ($validar['status'] != true) {
            header('Location:' . $_ENV['URL_BASE'] . '/?r=8');
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $alertas = [];
            $id = $_POST['hijo'];
            try {
                Seccion::initTransaction(); // arreglar la transaccion
                $seccion = Seccion::find($id);
                $oldSec = json_encode($seccion);
                if (!$seccion) {
                    $resolve = ['error' => 'La Carpeta no Existe'];
                    echo json_encode($resolve);
                    return;
                }
                if ($seccion->status != 0) {
                    $resolve = ['alertas' => ['error' => array('Carpeta en movimiento, Espere...')]];
                    echo json_encode($resolve);
                    return;
                }
                $oldPath = $seccion->path; //guadar el path anterior para renombrar/mover carpeta
                $seccion->sincronizar($_POST);
                $alertas = $seccion->validar();
                if (!empty($alertas)) {
                    $resolve = ['alertas' => $alertas];
                    echo json_encode($resolve);
                    return;
                }
                $seccion->path = $seccion->getPath(); //crear elnuevo path path a partir de los datos actualizados de la carpeta
                $seccion->guardar();
                //$seccion->move_to($oldPath); // cambiar la direccion fisica del padre con el nuevo path
                if (isset($_POST['seccion'])) {
                    //Documento::updateCodDoc($seccion->id);
                    $seccion->renameDir($oldPath); // cambiar la direccion fisica del padre con el nuevo path
                    $respuesta = Seccion::getCarpetasHijos(intval($id));
                    array_push($respuesta, $id);
                    Seccion::updateStatus($respuesta);
                    $documentos = Documento::obtenerAllDocs($respuesta);
                    Documento::updatePathDoc($documentos);
                    Seccion::updateStatus($respuesta);
                }
                $resultado = $seccion->guardar(); // guardar la carpeta con el path nuevo
                if (isset($_POST['idPadre'])) {
                    setHistorialCarpeta($_SESSION['id'], $_SESSION['nombre'], $seccion->idPadre, $seccion->id, $seccion->seccion, 'update(Mover)', json_encode(['new' => $seccion, 'old' => json_decode($oldSec)]), '');
                } else {
                    setHistorialCarpeta($_SESSION['id'], $_SESSION['nombre'], $seccion->idPadre, $seccion->id, $seccion->seccion, 'update',  json_encode(['new' => $seccion, 'old' => json_decode($oldSec)]), '');
                }
                if ($resultado != true) {
                    $hijos = Seccion::wherePlano('idPadre', $seccion->idPadre);
                    $resolve = [
                        'hijos' => $hijos,
                        'error' => 'Ocurrió un problema al guardar la Carpeta'
                    ];
                    echo json_encode($resolve);
                    return;
                }
                $carpetas = Seccion::getCarpetasHijos(intval($seccion->id)); //obtener carpetas hijos del padre
                Seccion::updatePathHijos($carpetas); // cambiar el path de los hijos en caso de tener
                $hijos = Seccion::wherePlano('idPadre', $seccion->idPadre);
                Seccion::endTransaction();
                $resolve = [
                    'padre' => $seccion->idPadre,
                    'hijos' => $hijos,
                    'exito' => 'Carpeta actualizada correctamente'
                ];
                echo json_encode($resolve);
                return;
            } catch (Exception $e) {
                $seccion->status = 0;
                Seccion::rollback();
                Seccion::generarError($e->getMessage());
                // Lanzar la excepción original
                $resolve = ['error' => 'No se pudo actualizar la carpeta, Intente más tarde...'];
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
                Seccion::initTransaction();
                SeccionUnidad::initTransaction();
                SeccionUser::initTransaction();
                Documento::initTransaction();
                $alertas = [];
                $seccion = Seccion::find($_POST['id']);
                if (!$seccion) {
                    $resolve = ['error' => 'Carpeta no existe o no se encuentra'];
                    echo json_encode($resolve);
                    return;
                }
                if ($seccion->status != 0) {
                    $resolve = ['error' => 'en movimiento, Espere...', 'carpeta' => ucfirst($seccion->seccion)];
                    echo json_encode($resolve);
                    return;
                }
                $carpetas = Seccion::whereTodos('idPadre', $seccion->id);
                if (count($carpetas) != 0) {
                    $resolve = [
                        'error' => 'contiene más Carpetas, Únicamente se pueden Elimnar Carpetas que no contengan más Carpetas',
                        'carpeta' => ucfirst($seccion->seccion)
                    ];
                    echo json_encode($resolve);
                    return;
                }
                SeccionUnidad::eliminarTodos('idSeccion', $seccion->id);
                SeccionUser::eliminarTodos('idSeccion', $seccion->id);
                Documento::eliminarTodos('idSeccion', $seccion->id);

                if (!is_dir('../public/archivos' . $seccion->path)) {
                    throw new Exception(json_encode(['error','Falla en el path de la carpeta']));
                }

                rmDir_rf('../public/archivos' . $seccion->path);

                $padre = $seccion->idPadre;
                $seccionHistorial = $seccion;
                $resultado = $seccion->eliminar();
                if ($resultado != true) {
                    throw new Exception(json_encode(['error','No se pudo eliminar la carpeta']));
                }
                Seccion::endTransaction();
                SeccionUnidad::endTransaction();
                SeccionUser::endTransaction();
                Documento::endTransaction();
                setHistorialCarpeta($_SESSION['id'], $_SESSION['nombre'], $seccionHistorial->idPadre, $seccionHistorial->id, $seccionHistorial->seccion, 'delete', json_encode($seccionHistorial), 'Permiso total');
                $hijos = Seccion::wherePlano('idPadre', $padre);
                $resolve = [
                    'padre' => $padre,
                    'hijos' => $hijos,
                    'exito' => 'Carpeta eliminada correctamente'
                ];
                echo json_encode($resolve);
                return;
            } catch (Exception $e) {
                Seccion::rollback();
                SeccionUnidad::rollback();
                SeccionUser::rollback();
                Documento::rollback();
                Seccion::generarError($e->getMessage());
                $resolve = ['error' => 'No se pudo Eliminar la Carpeta'];
                echo json_encode($resolve);
                return;
            }
        }
    }
}
