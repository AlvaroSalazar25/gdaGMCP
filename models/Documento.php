<?php

namespace Model;

use Exception;


class Documento extends ActiveRecord
{
    protected static $tabla = 'documento';
    protected static $columnasDB = ['id', 'idUser', 'idSeccion', 'idFormulario', 'alias', 'codigo', 'data', 'keywords', 'path', 'status'];

    public $id;
    public $idUser;
    public $idSeccion;
    public $idFormulario;
    public $alias;
    public $codigo;
    public $data;
    public $keywords;
    public $path;
    public $status;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idUser = $args['idUser'] ?? '';
        $this->idSeccion = $args['idSeccion'] ?? '';
        $this->idFormulario = $args['idFormulario'] ?? '';
        $this->alias = $args['alias'] ?? '';
        $this->codigo = $args['codigo'] ?? '';
        $this->data = $args['data'] ?? '';
        $this->keywords = $args['keywords'] ?? '';
        $this->path = $args['path'] ?? '';
        $this->status = $args['status'] ?? false;
    }

    public function validar()
    {
        if (!$this->data) {
            self::$alertas['error'][] = 'Faltan campos por completar';
        }
        if (!$this->keywords) {
            self::$alertas['error'][] = 'Las palabras claves son obligatorias';
        }
        return self::$alertas;
    }

    // public function saveDoc()
    // {
    //     try {
    //         $archivo = new Documento($this->atributos());

    //         if (!intval($archivo->idSeccion)) {
    //             return false;
    //         } else {
    //             $idSeccion =  $archivo->idSeccion;
    //         };
    //         $seccion = Seccion::where('id', $idSeccion);
    //         $recorteNSeccion = strtoupper(substr($seccion->seccion, 0, 3));
    //         $idDoc = Documento::selectMax('id');
    //         $refDoc = $recorteNSeccion . "-" . $archivo->idFormulario . "-" . str_pad($idDoc, 9, 0, STR_PAD_LEFT);
    //         $path = explode("/", $_FILES['path']['type']);
    //         $archivo->codigo = $refDoc;

    //         $carpetaArchivos = '../public/archivos/';
    //         if (!is_dir($carpetaArchivos)) {
    //             mkdir($carpetaArchivos);
    //         }
    //         setlocale(LC_ALL, "spanish");
    //         $year = strftime('%Y');
    //         $mes = strftime('%B');
    //         $yearArchivo = $carpetaArchivos . $year . "/";
    //         $mesArchivo = $yearArchivo . $mes . "/";
    //         $seccionArchivo = $mesArchivo . strtolower($seccion->seccion) . "/";
    //         if (!is_dir($yearArchivo)) {
    //             mkdir($yearArchivo);
    //         }
    //         if (!is_dir($mesArchivo)) {
    //             mkdir($mesArchivo);
    //         }
    //         if (!is_dir($seccionArchivo)) {
    //             mkdir($seccionArchivo);
    //         }
    //         move_uploaded_file($_FILES['path']['tmp_name'], $seccionArchivo . $refDoc . "." . $path['1']);
    //         $archivo->path = explode("..", $seccionArchivo . $refDoc . "." . $path['1'])[1];

    //         $resp = $archivo->guardar();
    //         return $resp;
    //     } catch (Exception $e) {
    //         Documento::generarError($e->getMessage());
    //         return ['error' => 'No se pudo guardar el documento'];
    //     }
    // }

    public function getPath()
    {
        $idPadre = intval($this->idSeccion);
        // $pathBase = "/".htmlspecialchars(str_replace(" ","_",$this->seccion));
        if ($_FILES) {
            $path = explode("/", $_FILES['path']['type']);
            $pathBase = "/" . str_replace(" ", "_", $this->codigo) . "." . $path['1'];
        } else {
            $path = explode('.', $this->path);
            $pathBase = "/" . str_replace(" ", "_", $this->codigo) . "." . $path['1'];
        }
        while ($idPadre != 0) {
            $secPadre = Seccion::where('id', $idPadre);
            $nombreCarpeta = str_replace(" ", "_", $secPadre->seccion);
            $pathBase = "/" . $nombreCarpeta . $pathBase;
            $idPadre = $secPadre->idPadre;
        }
        return $pathBase;
    }

    public function getCodigo()
    {
        $idSec = $this->idSeccion;
        $seccion = Seccion::where('id', $idSec);
        $recorteNSeccion = strtoupper(substr($seccion->seccion, 0, 3));
        $idDoc = Documento::countPadre($this->idSeccion);
        $contador = intval($idDoc['contador']) + 1;
        $refDoc = $recorteNSeccion . "-" . $this->idFormulario . "-" . str_pad($contador, 9, 0, STR_PAD_LEFT);
        return $refDoc;
    }

    public static function obtenerAllDocs($respuesta)
    {
        $sql = "";
        $allDocs = "";
        if (!empty($respuesta)) {
            foreach ($respuesta as $index => $resp) {
                if ($index != count($respuesta) - 1) {$sql .= "'$resp',";} else {$sql .= "'$resp'";}
            }
            $consulta = "SELECT d.id,d.idSeccion,s.seccion,d.alias,d.codigo,d.data,d.keywords,d.path,d.status,d.created_at,f.nombre as formulario,u.nombre as responsable FROM documento d  INNER JOIN formulario f ON f.id = d.idFormulario INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion WHERE d.idSeccion IN ($sql) ORDER BY d.codigo ASC";
            $allDocs = Documento::consultaPlana($consulta);
        } else {
            $consulta = "SELECT d.id,d.idSeccion,s.seccion,d.alias,d.codigo,d.data,d.keywords,d.path,d.status,d.created_at,f.nombre as formulario,u.nombre as responsable FROM documento d  INNER JOIN formulario f ON f.id = d.idFormulario INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion ORDER BY d.codigo ASC";
            $allDocs = Documento::consultaPlana($consulta);
        }

        return $allDocs;
    }
    public static function updateCodDoc($id)
    {
        $documentos = Documento::whereTodos('idSeccion', $id);
        self::$db->autocommit(FALSE);
        self::$db->begin_transaction();
        foreach ($documentos as $doc) {
            $doc->codigo = $doc->getCodigo();
            $resultado = $doc->guardar();
            if ($resultado != true) {
                self::$db->rollback();
                return false;
            }
        }
        self::$db->commit();
        return true;
    }

    public static function updatePathDoc($id)
    {
        $carpetaArchivos = '../public/archivos';
        $documentos = Documento::whereTodos('idSeccion', $id);
        self::$db->autocommit(FALSE);
        self::$db->begin_transaction();
        foreach ($documentos as $doc) {
            $doc->path = $doc->getPath();
            $resultado = $doc->guardar();
            if ($resultado != true) {
                self::$db->rollback();
                return false;
            }
        }
        self::$db->commit();
        return true;
    }
}
