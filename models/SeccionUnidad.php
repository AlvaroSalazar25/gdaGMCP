<?php


namespace Model;

use Exception;
use Model\Seccion;
use Model\ActiveRecord;

class SeccionUnidad extends ActiveRecord
{
    protected static $tabla = 'seccion_unidad';
    protected static $columnasDB = ['id', 'idUnidad','idPadre','idSeccion','verSeccion','permisos'];

    public $id;
    public $idUnidad;
    public $idPadre;
    public $idSeccion;
    public $verSeccion;
    public $permisos;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idUnidad = $args['idUnidad'] ?? '';
        $this->idPadre = $args['idPadre'] ?? '';
        $this->idSeccion = $args['idSeccion'] ?? '';
        $this->verSeccion = $args['verSeccion'] ?? 0;
        $this->permisos = $args['permisos'] ?? '[{"id":2,"status":false,"nombre":"Crear_Carpeta","type":"carpeta","descripcion":"Permiso para crear carpetas"},{"id":3,"status":false,"nombre":"Editar_Carpeta","type":"carpeta","descripcion":"Permiso para Editar,Mover,Eliminar la carpeta"},{"id":4,"status":false,"nombre":"Ver_Documento","type":"documento","descripcion":"Permiso para visualizar el documento"},{"id":5,"status":false,"nombre":"Crear_Documento","type":"documento","descripcion":"Permiso para Crear un documento"},{"id":6,"status":false,"nombre":"Editar_Documento","type":"documento","descripcion":"Permiso para Editar la metadata del documento"},{"id":7,"status":false,"nombre":"Mover_Documentos","type":"documento","descripcion":"Permiso para mover de carpeta los documentos"},{"id":8,"status":false,"nombre":"Eliminar_Documento","type":"documento","descripcion":"Permiso para Eliminar el documento"}]';;
    }
    
    public function validar(){
        if(!$this->idUnidad){
            self::$alertas['error'][] = 'El id de la Unidad es obligatorio';
        }   
        if(!$this->idSeccion){
            self::$alertas['error'][] = 'El id de la Sección es obligatorio';
        }   
        return self::$alertas;
    }
    public static function getCarpetasHijosUnidad($idPadre, $idUnidad)
    {
        $GLOBALS['hijos'] = [];
        $hijos = getHijosUnidad($idPadre,$idUnidad); // obtener hijos de carpeta padre
        return $hijos;
    }

    public static function obtenerSecRamaUnidad($respuesta,$idUnidad)
    {
        $sql = "";
        $moverHijos = "";
        if (!empty($respuesta)) {
            foreach ($respuesta as $index => $resp) {
                if ($index != count($respuesta) - 1) {
                    $sql .= "'$resp',";
                } else {
                    $sql .= "'$resp'";
                }
            }
            $consulta = "SELECT su.*,u.unidad,s.seccion,s.path FROM seccion_unidad su INNER JOIN seccion s ON s.id = su.idSeccion INNER JOIN unidad u ON u.id = su.idUnidad WHERE su.idUnidad = $idUnidad AND su.idSeccion NOT IN ($sql)";
            $moverHijos = SeccionUnidad::consultaPlana($consulta);
        } else {
            $moverHijos = [];
        }
        return json_encode($moverHijos);
    }

    public static function getPathLink($idPadre, $idSeccion,$idUnidad)
    {
        $idPadre = intval($idPadre);
        // $pathBase = "/".htmlspecialchars(str_replace(" ","_",$this->seccion));
        $arrPath = [];
        $seccion = Seccion::find($idSeccion);
        $pathCarpeta = ['seccion' => $seccion->seccion, 'id' => $idSeccion];
        $pathBase2 = ['seccion' => 'Base', 'id'=>0];
        array_unshift($arrPath,$pathCarpeta);
        while ($idPadre != 0) {
            $consulta = "SELECT su.idSeccion,s.seccion,su.idPadre FROM seccion_unidad su INNER JOIN seccion s ON s.id = su.idSeccion WHERE su.idUnidad = $idUnidad AND su.idSeccion = $idPadre AND su.verSeccion = '1'";
            $seccion = SeccionUnidad::consultaPlana($consulta);
            $seccion = array_shift($seccion);
            $pathBase = ['seccion' => $seccion['seccion'], 'id' => $seccion['idSeccion']];
            array_unshift($arrPath,$pathBase);
            $idPadre = $seccion['idPadre'];
        }
        array_unshift($arrPath,$pathBase2);
        return $arrPath;
    }

    public static function updatePermisosPadreUnidad($idPadre, $idSeccion, $idUnidad, $verSeccion, $accion)
    {
        try {
            SeccionUnidad::initTransaction();
            $cont = 0;
            $permisoCarpetasHijas = SeccionUnidad::whereCamposTodos('idUnidad', $idUnidad, 'idPadre', $idPadre);
            foreach ($permisoCarpetasHijas as $carpetaHijas) {
                if ($carpetaHijas->verSeccion == true && $carpetaHijas->idSeccion != $idSeccion) {
                    $cont++;
                }
            }
            if ($verSeccion == true) {
                $cont++;
            }
            $idCarpetas = [];
            while ($idPadre != 0) {
                $secPadre = Seccion::where('id', $idPadre);
                if (!$secPadre) {
                    throw new Exception(json_encode([
                        'error' => 'No se encuentra la carpeta para actualizar los permisos de la Unidad',
                        'carpeta' => 'idCarpeta =>'.$idPadre
                    ]));
                }
                array_push($idCarpetas, $secPadre->id);
                $idPadre = $secPadre->idPadre;
            }
            foreach ($idCarpetas as $idCarpeta) {
                $permiso = new SeccionUnidad();
                $permiso->idUnidad = $idUnidad;
                $seccion = Seccion::find($idCarpeta);
                if (!$seccion) {
                    throw new Exception(json_encode([
                        'error' => 'No se encuentran los hijos de la carpeta para actualizar permisos de la Unidad',
                        'carpeta' => 'idCarpeta => '. $idCarpeta
                    ]));
                }
                $permiso->idSeccion = $seccion->id;
                $permiso->idPadre = $seccion->idPadre;
                switch ($accion) {
                    case 0:
                        $permiso->verSeccion = $verSeccion;
                        break;
                    case 1:
                        $permiso->verSeccion = ($cont == 0) ? false : true;
                        break;
                    default:
                        $permiso->verSeccion = false;
                        break;
                }
                try {
                    SeccionUnidad::initTransaction();
                    $cantidad = SeccionUnidad::cantidadPermisos('idSeccion', $permiso->idSeccion, 'idUnidad', $permiso->idUnidad);
                    if (!empty($cantidad)) {
                        $permiso->actualizarPermiso('idSeccion', $permiso->idSeccion);
                    } else {
                        $permiso->crear();
                    }
                    SeccionUnidad::endTransaction();
                } catch (Exception $e) {
                    SeccionUnidad::rollback();
                    throw new Exception(json_encode([
                        'error' => 'No se pudieron guardar los permisos de la Unidad por problemas en el árbol de carpetas',
                        'permisos' => $permiso
                    ]));
                }
            }
            SeccionUnidad::endTransaction();
        } catch (Exception $e) {
            SeccionUnidad::rollback();
            SeccionUnidad::generarError($e->getMessage());
        }
    }
    
}