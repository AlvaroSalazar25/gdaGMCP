<?php


namespace Model;

class Seccion extends ActiveRecord
{
    protected static $tabla = 'seccion';
    protected static $columnasDB = ['id', 'idPadre', 'seccion', 'descripcion', 'color','path'];

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

        $nombre = Seccion::whereUnidad('seccion',$this->seccion,'idPadre',$this->idPadre);
        if($nombre){
            if($this->id != $nombre->id){
                self::$alertas['error'][] = 'La carpeta ya existe';
            }
        }
        return self::$alertas;

        list($r, $g, $b) = sscanf($this->color, "#%02x%02x%02x");
        if ($r > 220 && $g > 220 && $b > 220 ) {
            self::$alertas['error'][] = 'Elija un color más oscuro';
        }
        return self::$alertas;
    }

    public function getPath(){
        $idPadre = intval($this->idPadre);
        $carpetaArchivos = '../public/archivos';
        $pathBase = "/".str_replace(" ","_",$this->seccion);
        while ($idPadre != 0) {
            $secPadre = Seccion::where('id',$idPadre);
            $nombreCarpeta = str_replace(" ","_",$secPadre->seccion);
            $pathBase = "/".$nombreCarpeta.$pathBase;
            $idPadre = $secPadre->idPadre;
        }
        $carpeta = $carpetaArchivos.$pathBase;
        if(!mkdir($carpeta,0777,true)){
            mkdir($carpeta,0777,true);
        }
        return $pathBase;
    }


}
