<?php


namespace Model;

use Exception;
use Model\Seccion;
use Model\ActiveRecord;

class SeccionUser extends ActiveRecord
{
    protected static $tabla = 'seccion_user';
    protected static $columnasDB = ['id', 'idUser','idPadre','idSeccion','verSeccion','permisos'];

    public $id;
    public $idUser;
    public $idPadre;
    public $idSeccion;
    public $verSeccion;
    public $permisos;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idUser = $args['idUser'] ?? '';
        $this->idPadre = $args['idPadre'] ?? '';
        $this->idSeccion = $args['idSeccion'] ?? '';
        $this->verSeccion = $args['verSeccion'] ?? 0;
        $this->permisos = $args['permisos'] ?? '[{"id":2,"status":false,"nombre":"Crear_Carpeta","type":"carpeta","descripcion":"Permiso para crear carpetas"},{"id":3,"status":false,"nombre":"Editar_Carpeta","type":"carpeta","descripcion":"Permiso para Editar,Mover,Eliminar la carpeta"},{"id":4,"status":true,"nombre":"Ver_Documentos","type":"documento","descripcion":"Permiso para visualizar el documento"},{"id":5,"status":false,"nombre":"Mover_Documentos","type":"documento","descripcion":"Permiso para mover de carpeta los documentos"},{"id":6,"status":false,"nombre":"Crear_Documento","type":"documento","descripcion":"Permiso para Crear un documento"},{"id":7,"status":false,"nombre":"Editar_Documento","type":"documento","descripcion":"Permiso para Editar la metadata del documento"},{"id":8,"status":false,"nombre":"Eliminar_Documento","type":"documento","descripcion":"Permiso para Eliminar el documento"},{"id":9,"status":false,"nombre":"Descargar_Documento","type":"documento","descripcion":"Permiso para Descargar los documentos"}]';
    }
    
    public function validar(){
        if(!$this->idUser){
            self::$alertas['error'][] = 'El id del User es obligatorio';
        }   
        if(!$this->idSeccion){
            self::$alertas['error'][] = 'El id del Permiso es obligatorio';
        }           
        return self::$alertas;
    }

    public static function getCarpetasHijosEditor($idPadre, $idUser)
    {
        $GLOBALS['hijos'] = [];
        $hijos = getHijosEditor($idPadre,$idUser); // obtener hijos de carpeta padre
        return $hijos;
    }

    public static function obtenerSecRamaEditor($respuesta,$idUser)
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
            $consulta = "SELECT su.*,u.nombre,s.seccion,s.path FROM seccion_user su INNER JOIN seccion s ON s.id = su.idSeccion INNER JOIN user u ON u.id = su.idUser WHERE su.idUser = $idUser AND su.idSeccion NOT IN ($sql)";
            $moverHijos = SeccionUser::consultaPlana($consulta);
        } else {
            $moverHijos = [];
        }
        return json_encode($moverHijos);
    }

    public static function getIdFolderPath($idPadre, $idSeccion)
    {
        $idCarpetas = [];
        array_push($idCarpetas, $idSeccion, 0);
        while ($idPadre != 0) {
            $secPadre = SeccionUser::where('idSeccion', $idPadre);
            array_push($idCarpetas, $secPadre->id);
            $idPadre = $secPadre->idPadre;
        }
        $sql = "";
        foreach ($idCarpetas as $index => $idCarpeta) {
            if ($index != count($idCarpetas) - 1) {
                $sql .=  "'$idCarpeta',";
            } else {
                $sql .=  "'$idCarpeta'";
            }
            // $sql .= ($index != count($idCarpetas) - 1) ? "'$idCarpeta'," : "'$idCarpeta'";
        }
        return $sql;
    }

    public static function getPathLink($idPadre, $idSeccion,$idUser)
    {
        $idPadre = intval($idPadre);
        // $pathBase = "/".htmlspecialchars(str_replace(" ","_",$this->seccion));
        $arrPath = [];
        $seccion = Seccion::find($idSeccion);
        $pathCarpeta = ['seccion' => $seccion->seccion, 'id' => $idSeccion];
        $pathBase2 = ['seccion' => 'Base', 'id'=>0];
        array_unshift($arrPath,$pathCarpeta);
        while ($idPadre != 0) {
            $consulta = "SELECT su.idSeccion,s.seccion,su.idPadre FROM seccion_user su INNER JOIN seccion s ON s.id = su.idSeccion WHERE su.idUser = $idUser AND su.idSeccion = $idPadre AND su.verSeccion = '1'";
            $seccion = SeccionUser::consultaPlana($consulta);
            $seccion = array_shift($seccion);
            $pathBase = ['seccion' => $seccion['seccion'], 'id' => $seccion['idSeccion']];
            array_unshift($arrPath,$pathBase);
            $idPadre = $seccion['idPadre'];
        }
        array_unshift($arrPath,$pathBase2);
        return $arrPath;
    }


    public static function updatePermisosPadreUser($idPadre, $idSeccion, $idUser, $verSeccion, $accion)
    {
        try {
            SeccionUser::initTransaction();
            $cont = 0;
            $permisoCarpetasHijas = SeccionUser::whereCamposTodos('idUser', $idUser, 'idPadre', $idPadre);
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
                        'error' => 'No se encuentra la carpeta Padre para actualizar los permisos del Usuario',
                        'carpeta' => 'idCarpeta => ' . $idPadre
                    ]));
                }
                array_push($idCarpetas, $secPadre->id);
                $idPadre = $secPadre->idPadre;
            }
            foreach ($idCarpetas as $idCarpeta) {
                $permiso = new SeccionUser();
                $permiso->idUser = $idUser;
                $seccion = Seccion::find($idCarpeta);
                if (!$seccion) {
                    throw new Exception(json_encode([
                        'error' => 'No se encontró la carpeta para crear los permisos',
                        'carpeta' =>  'idCarpeta => ' . $idCarpeta
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
                    SeccionUser::initTransaction();
                    $cantidad = SeccionUser::cantidadPermisos('idSeccion', $permiso->idSeccion, 'idUser', $permiso->idUser);
                    if (!empty($cantidad)) {
                        $permiso->actualizarPermiso('idSeccion', $permiso->idSeccion);
                    } else {
                        $permiso->crear();
                    }
                    SeccionUser::endTransaction();
                } catch (Exception $e) {
                    SeccionUser::rollback();
                    throw new Exception(json_encode([
                        'error' => 'No se pudieron guardar los permisos del Usuario por problemas en el árbol de carpetas',
                        'permisos' => $permiso
                    ]));
                }
            }
            SeccionUser::endTransaction();
        } catch (Exception $e) {
            SeccionUser::rollback();
            SeccionUser::generarError($e->getMessage());
        }
    }



}
