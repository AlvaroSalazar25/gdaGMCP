<?php


namespace Model;

use Exception;
use Model\SeccionUnidad;

class Seccion extends ActiveRecord
{
    protected static $tabla = 'seccion';
    protected static $columnasDB = ['id', 'idPadre', 'seccion', 'descripcion', 'color', 'path', 'status'];

    public $id;
    public $idPadre;
    public $seccion;
    public $descripcion;
    public $color;
    public $path;
    public $status;
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
        $this->status = $args['status'] ?? '';
    }

    public function validar()
    {
        if (!$this->seccion) {
            self::$alertas['error'][] = 'El Nombre de la Sección es Obligatorio';
        }
        if (strlen($this->seccion) > 60) {
            self::$alertas['error'][] = 'El Nombre de la Sección es demasiado largo';
        }

        $texto = preg_match('([^A-Za-z0-9 ])', $this->seccion);
        if ($texto > 0) {
            self::$alertas['error'][] = 'El Nombre de la Sección no debe contener caracteres especiales';
        }

        $nombre = Seccion::whereCampos('seccion', strtolower($this->seccion), 'idPadre', intval($this->idPadre));
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
        $pathBase = "/" . str_replace(" ", "_", $this->seccion);

        while ($idPadre != 0) {
            $secPadre = Seccion::where('id', $idPadre);
            if (!$secPadre) {
                throw new Exception(json_encode([
                    'error' => 'No se encontró los hijos para generar el path de la carpeta',
                    'carpeta' => $this
                ]));
            }
            $nombreCarpeta = str_replace(" ", "_", $secPadre->seccion);
            $pathBase = "/" . $nombreCarpeta . $pathBase;
            $idPadre = $secPadre->idPadre;
        }
        return $pathBase;
    }

    public function getPathLink()
    {
        $idPadre = intval($this->idPadre);
        // $pathBase = "/".htmlspecialchars(str_replace(" ","_",$this->seccion));
        $arrPath = [];
        $pathCarpeta = ['seccion' => $this->seccion, 'id' => $this->id];
        $pathBase2 = ['seccion' => 'Base', 'id' => 0];
        array_unshift($arrPath, $pathCarpeta);
        while ($idPadre != 0) {
            $secPadre = Seccion::where('id', $idPadre);
            if (!$secPadre) {
                throw new Exception(json_encode([
                    'error' => 'No se encontró la carpeta padre',
                    'carpeta' => $this
                ]));
            }
            $pathBase = ['seccion' => $secPadre->seccion, 'id' => $secPadre->id];
            array_unshift($arrPath, $pathBase);
            $idPadre = $secPadre->idPadre;
        }
        array_unshift($arrPath, $pathBase2);
        return $arrPath;
    }

    public function renameDir($oldPath)
    {
        $carpetaArchivos = '../public/archivos';
        if (is_dir($carpetaArchivos . $oldPath)) {
            rename($carpetaArchivos . $oldPath, $carpetaArchivos . $this->path);
        } else {
            throw new Exception(json_encode([
                'error' => 'No se encuentra el directorio en el servidor para mover la carpeta',
                'carpeta' => $this
            ]));
        }
    }

    public function move_to($oldPath)
    {
        $carpetaArchivos = '../public/archivos';
        $old = $carpetaArchivos . $oldPath;
        $new = $carpetaArchivos . $this->path;
        $res = copy($old, $new);
        if ($res == true) {
            unlink($old);
        }
    }

    public function crearCarpeta()
    {
        $carpetaArchivos = '../public/archivos';
        $carpeta = $carpetaArchivos . $this->path;
        if (is_dir($carpeta)) {
            throw new Exception(json_encode([
                'error' => 'No se pudo crear la carpeta en el servidor porque ya existe',
                'carpeta' => $this
            ]));
        }

        if (mkdir($carpeta, 0777, true)) {
            return true; // Carpeta creada exitosamente
        } else {
            throw new Exception(json_encode([
                'error' => 'No se pudo crear la carpeta en el servidor, problemas con el path',
                'carpeta' => $this
            ]));
        }
    }

    public static function updatePathHijos($hijos)
    {
        try {
            Seccion::initTransaction();
            foreach ($hijos as $hijo) {
                $seccion = Seccion::where('id', $hijo);
                if (!$seccion) {
                    throw new Exception(json_encode([
                        'error' => 'No se encuentran los hijos de la carpeta para actualizar el path',
                        'carpeta' => 'idCarpeta => ' . $hijo
                    ]));
                }
                $seccion->path = $seccion->getPath();
                $seccion->guardar();
                Seccion::endTransaction();
            }
        } catch (Exception $e) {
            Seccion::rollback();
            Seccion::generarError($e->getMessage());
        }
    }

    public static function updateStatus($hijos)
    {
        try {
            Seccion::initTransaction();
            foreach ($hijos as $hijo) {
                $seccion = Seccion::where('id', $hijo);
                if (!$seccion) {
                    throw new Exception(json_encode([
                        'error' => 'No se encuentran los hijos de la carpeta para actualizar el estado',
                        'carpeta' => 'idCarpeta => ' . $hijo
                    ]));
                }
                $seccion->status = ($seccion->status == 0) ? 1 : 0;
                $seccion->guardar();
            }
            Seccion::endTransaction();
        } catch (Exception $e) {
            Seccion::rollback();
            Seccion::generarError($e->getMessage());
        }
    }
    
    public static function getIdFolderPath($idPadre, $idSeccion)
    {
        $idCarpetas = [];
        array_push($idCarpetas, $idSeccion, 0);
        while ($idPadre != 0) {
            $secPadre = Seccion::where('id', $idPadre);
            if (!$secPadre) {
                throw new Exception(json_encode([
                    'error' => 'No se encuentra los hijos de la carpeta para obtener el path',
                    'carpeta' => 'idCarpeta => ' . $idSeccion
                ]));
            }
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

    public static function getCarpetasHijos($id)
    {
        $GLOBALS['hijos'] = [];
        $hijos = getHijos($id); // obtener hijos de carpeta padre
        return $hijos;
    }

    public static function getCarpetasHijosDatos($id, $dato)
    {
        $GLOBALS['hijos'] = [];
        $hijos = getHijosDatos($id, $dato); // obtener hijos de carpeta padre
        return $hijos;
    }

    public static function getCarpetasHijosAllData($id)
    {
        $hijos = getHijosAllData($id); // obtener hijos de carpeta padre
        return $hijos;
    }
}
