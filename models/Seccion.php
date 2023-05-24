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
        if ($texto > 0) {
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

    public static function obtenerSecRama($respuesta)
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
            $consulta = "SELECT s.id,s.idPadre,s.seccion,s.path FROM seccion s WHERE s.id NOT IN ($sql)";
            $moverHijos = Seccion::consultaPlana($consulta);
        } else {
            $consulta = "SELECT s.id,s.idPadre,s.seccion,s.path FROM seccion s";
            $moverHijos = Seccion::consultaPlana($consulta);
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

    public function renameDir($oldPath)
    {
        $carpetaArchivos = '../public/archivos';
        $old = $carpetaArchivos.$oldPath;
        $new = $carpetaArchivos.$this->path;
        $resolve = rename($old, $new);
        return $resolve;
    }

    public function move_to($oldPath)
    {
        $carpetaArchivos = '../public/archivos';
        $old = $carpetaArchivos . $oldPath;
        $new = $carpetaArchivos . $this->path;
        $res = copy($old, $new);
        if ($res == true) {unlink($old);}
    }

    public function crearCarpeta()
    {
        $carpetaArchivos = '../public/archivos';
        $carpeta = $carpetaArchivos . $this->path;
        if (!mkdir($carpeta, 0777, true)) {
            mkdir($carpeta, 0777, true);
            return true;
        } else {
            return new Exception('No se pudo crear la carpeta');
        }
    }

    public static function updatePathHijos($hijos)
    {
        foreach ($hijos as $hijo) {
            $seccion = Seccion::where('id', $hijo);
            if ($seccion) {
                $seccion->path = $seccion->getPath();
                $seccion->guardar();
            } else {
                throw new Exception('No se encuentran los hijos');
            }
        }
        return true;
    }

    public static function getIdFolderPath($idPadre,$idSeccion)
    {
        $idCarpetas = [];
        array_push($idCarpetas, $idSeccion,0);
        while ($idPadre != 0) {
            $secPadre = Seccion::where('id', $idPadre);
            array_push($idCarpetas, $secPadre->id);
            $idPadre = $secPadre->idPadre;
        }
        $sql = "";
        foreach ($idCarpetas as $index => $idCarpeta) {
            if ($index != count($idCarpetas) - 1) { $sql .=  "'$idCarpeta',"; } else{$sql .=  "'$idCarpeta'";}
        }
        return $sql;
    }

    public static function getCarpetasHijos($id)
    {
        $GLOBALS['hijos'] = [];
        $hijos = getHijos($id); // obtener hijos de carpeta padre
        return $hijos;
    }

    public static function getCarpetasHijosDatos($id,$dato){
        $GLOBALS['hijos'] = [];
        $hijos = getHijosDatos($id,$dato); // obtener hijos de carpeta padre
        return $hijos;
    }

    public static function getCarpetasHijosAllData($id){
        $hijos = getHijosAllData($id); // obtener hijos de carpeta padre
        return $hijos;
    }
}
