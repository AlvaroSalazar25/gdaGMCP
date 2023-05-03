<?php


namespace Model;

use Exception;

class Seccion extends ActiveRecord
{
    protected static $tabla = 'seccion';
    protected static $columnasDB = ['id', 'idPadre', 'seccion', 'descripcion', 'color', 'path'];

    public $id;
    public $idPadre;
    public $seccion;
    public $descripcion;
    public $color;
    public $path;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idPadre = $args['idPadre'] ?? '';
        $this->seccion = $args['seccion'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->color = $args['color'] ?? '';
        $this->path = $args['path'] ?? '';
    }

    public function validar()
    {
        if (!$this->seccion) {
            self::$alertas['error'][] = 'El Nombre de la Sección es Obligatorio';
        }

        $texto = preg_match('([^A-Za-z0-9 ])', $this->seccion);
        if($texto > 0){
            self::$alertas['error'][] = 'El Nombre de la Sección no debe contener caracteres especiales';
        }

        $nombre = Seccion::whereUnidad('seccion', $this->seccion, 'idPadre', $this->idPadre);
        if ($nombre) {
            if ($this->id != $nombre->id) {
                self::$alertas['error'][] = 'La carpeta ya existe';
            }
        }

        list($r, $g, $b) = sscanf($this->color, "#%02x%02x%02x");
        if ($r > 220 && $g > 220 && $b > 220) {
            self::$alertas['error'][] = 'Elija un color más oscuro';
        }
        return self::$alertas;
    }

    public static function obtenerSecRama($respuesta){
        $sql = "";
        $moverHijos = "";
        foreach ($respuesta as $index => $resp) {
            if ($index != count($respuesta) - 1) {
                $sql .= "'$resp',";
            } else {
                $sql .= "'$resp'";
            }
        }
        if (!empty($respuesta)) {
            $consulta = "SELECT * FROM seccion s WHERE s.id NOT IN ($sql)";
            $moverHijos = Seccion::consultaPlana($consulta);
        } else {
            $moverHijos =  Seccion::all();
        }
        return json_encode($moverHijos);
    }

    public function getPath()
    {
        $idPadre = intval($this->idPadre);
        // $pathBase = "/".htmlspecialchars(str_replace(" ","_",$this->seccion));
        $pathBase = "/" . str_replace(" ", "_", $this->seccion);
        
        while ($idPadre != 0) {
            $secPadre = Seccion::where('id', $idPadre);
            $nombreCarpeta = str_replace(" ", "_", $secPadre->seccion);
            $pathBase = "/" . $nombreCarpeta . $pathBase;
            $idPadre = $secPadre->idPadre;
        }
        return $pathBase;
    }

    public function renameDir($oldPath){
        $carpetaArchivos = '../public/archivos';
        $old = $carpetaArchivos.$oldPath;
        $new = $carpetaArchivos.$this->path;
        $resolve = rename($old, $new);
        return $resolve;
    }
    
    public function crearCarpeta(){
        $carpetaArchivos = '../public/archivos';
        $carpeta = $carpetaArchivos.$this->path;
        if( !mkdir($carpeta, 0777, true)){
            mkdir($carpeta, 0777, true);
            return true;
        } 
        return false;
    }

    public static function updatePathHijos($hijos){
        foreach ($hijos as $hijo){
            $seccion = Seccion::where('id', $hijo);
            if($seccion){
                $seccion->path = $seccion->getPath();
                $seccion->guardar();
            } else{
                throw new Exception('No se encuentran los hijos');
            }
        }
        return true;

    }

}
