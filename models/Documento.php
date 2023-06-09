<?php

namespace Model;

use Exception;
use Model\Formulario;


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
        $recorteNSeccion = strtoupper(substr($seccion->seccion, 0, 4));
        $cantidad = Documento::countPadre($this->idFormulario);
        $contador = intval($cantidad['contador']) + 1;
        $refDoc = $recorteNSeccion . "-" . $this->idFormulario . "-" . str_pad($contador, 9, 0, STR_PAD_LEFT);
        return $refDoc;
    }

    public function updateCodigo()
    {
        $idSec = $this->idSeccion;
        $seccion = Seccion::where('id', $idSec);
        $new = strtoupper(substr($seccion->seccion,0,4));
        $old = explode('-',$this->codigo);
        $changed = $new."-".$old[1]."-".$old[2];
        return $changed;
    }

    public static function obtenerAllDocs($respuesta)
    {
        $sql = "";
        $allDocs = "";
        if (!empty($respuesta)) {
            foreach ($respuesta as $index => $resp) {
                if ($index != count($respuesta) - 1) {$sql .= "'$resp',";} else {$sql .= "'$resp'";}
            }
            $consulta = "SELECT d.id,d.idSeccion,d.idUser,d.idFormulario,s.seccion,d.alias,d.codigo,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at,f.nombre as formulario,u.nombre as responsable FROM documento d  INNER JOIN formulario f ON f.id = d.idFormulario INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion WHERE d.idSeccion IN ($sql) ORDER BY d.codigo ASC";
            $allDocs = Documento::consultaPlana($consulta);
        } else {
            $consulta = "SELECT d.id,d.idSeccion,d.idUser,d.idFormulario,s.seccion,d.alias,d.codigo,d.data,d.keywords,d.path,d.status,d.created_at,d.updated_at,f.nombre as formulario,u.nombre as responsable FROM documento d  INNER JOIN formulario f ON f.id = d.idFormulario INNER JOIN user u ON u.id = d.idUser INNER JOIN seccion s ON s.id = d.idSeccion ORDER BY d.codigo ASC";
            $allDocs = Documento::consultaPlana($consulta);
        }

        return $allDocs;
    }

    public static function updateCodDoc($id)
    {
        $documentos = Documento::whereTodos('idSeccion', $id);
        foreach ($documentos as $doc) {
            $doc->codigo = $doc->updateCodigo();
            $resultado = $doc->guardar();
        }
        return true;
    }

    public static function updatePathDoc($documentos)
    {
        $carpetaArchivos = '../public/archivos';
        foreach ($documentos as $documento) {
            $seccion = Seccion::where('id',$documento->idPadre);
            if($seccion->status == 0){
                $doc = new Documento($documento);
                $pathEdited = Documento::editNameDoc($doc);
                $old = $carpetaArchivos.$pathEdited;
                $new = $carpetaArchivos.$doc->getPath();
                $doc->path = $doc->getPath();
                $doc->codigo = $doc->updateCodigo();
                $doc->guardar();
                rename($old,$new);
            }
        }
        return true;
    }


    public static function editNameDoc($doc){
        $oldPath = $doc->path;
        $arrayOldPath = explode('/',$oldPath);
        $lastOldPath = end($arrayOldPath);
        $doc->path = $doc->getPath();
        $partes = explode('/',$doc->path);
        end($partes); // Coloca el puntero interno al último elemento del array
        $ultimoElemento = key($partes); // Obtiene la clave del último elemento
        $partes[$ultimoElemento] = $lastOldPath; // Cambia el valor del último elemento
        return implode("/",$partes); // Devuelve el array modificado
    }

    public function deleteDoc()
    {
        $carpetaArchivos = '../public/archivos/';
        $resultado = unlink($carpetaArchivos.$this->path);
        return $resultado;
    }
}
