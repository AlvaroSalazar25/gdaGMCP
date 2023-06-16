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
        $old = $carpetaArchivos . $oldPath;
        $new = $carpetaArchivos . $this->path;
        $resolve = rename($old, $new);
        return $resolve;
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

    public static function updateStatus($hijos)
    {
        foreach ($hijos as $hijo) {
            $seccion = Seccion::where('id', $hijo);
            if ($seccion) {
                $seccion->status = ($seccion->status == 0) ? 1 : 0;
                $seccion->guardar();
            } else {
                throw new Exception('error');
            }
        }
        return true;
    }

    public static function updatePermisosPadreUser($idPadre, $idSeccion, $idUser, $verSeccion)
    {
        try {
            $cont = 0;
            $carpetasHijas = [];
            $carpetasHijasPadre = Seccion::whereTodos('idPadre', $idPadre);
            foreach ($carpetasHijasPadre as $carpeta) {
                array_push($carpetasHijas, $carpeta->id);
            };
            
            foreach ($carpetasHijas as $carpeta) {
                $permisoCarpetasHijas = SeccionUser::whereCampos('idUser', $idUser, 'idSeccion', $carpeta);
                if ($permisoCarpetasHijas) {
                    $cont++;
                }
            };

            $idCarpetas = [];
            while ($idPadre != 0) {
                $secPadre = Seccion::where('id', $idPadre);
                array_push($idCarpetas, $secPadre->id);
                $idPadre = $secPadre->idPadre;
            };

            foreach ($idCarpetas as $idCarpeta) {
                $permiso = new SeccionUser();
                $permiso->idUser = $idUser;
                $permiso->idSeccion = $idCarpeta;
                if ($cont == 0) {
                    $permiso->verSeccion = false;
                } else{
                    $permiso->verSeccion = filter_var($permiso->verSeccion, FILTER_VALIDATE_BOOLEAN);
                    $permiso->verSeccion = $verSeccion;
                }
                $permiso->guardarPermiso('idUser', $permiso->idUser);
            }
            return true;
        } catch (Exception $e) {
            dd($e->getMessage());
            return false;
        }
    }

    public static function updatePermisosPadreUnidad($idPadre, $idSeccion, $idUnidad, $verSeccion)
    {
        $idCarpetas = [];

        while ($idPadre != 0) {
            $secPadre = Seccion::where('id', $idPadre);
            array_push($idCarpetas, $secPadre->id);
            $idPadre = $secPadre->idPadre;
        }
        array_push($idCarpetas, $idSeccion);
        foreach ($idCarpetas as $idCarpeta) {
            $permiso = SeccionUnidad::whereCampos('idUnidad', $idUnidad, 'idSeccion', $idCarpeta);
            $permiso->verSeccion = filter_var($permiso->verSeccion, FILTER_VALIDATE_BOOLEAN);
            $permiso->verSeccion = $verSeccion;
            // $sql .= ($index != count($idCarpetas) - 1) ? "'$idCarpeta'," : "'$idCarpeta'";
        }
        return;
    }

    public static function getIdFolderPath($idPadre, $idSeccion)
    {
        $idCarpetas = [];
        array_push($idCarpetas, $idSeccion, 0);
        while ($idPadre != 0) {
            $secPadre = Seccion::where('id', $idPadre);
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
