<?php

namespace Model;

use Exception;
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

class Documento extends ActiveRecord
{
    protected static $tabla = 'documento';
    protected static $columnasDB = ['id','idUser', 'idSeccion', 'idFormulario','idPadre','codigo', 'data','keywords', 'path','status'];

    public $id;
    public $idUser;
    public $idSeccion;
    public $idFormulario;
    public $idPadre;
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
        $this->idPadre = $args['idPadre'] ?? '';
        $this->codigo = $args['codigo'] ?? '';
        $this->data = $args['data'] ?? '';
        $this->keywords = $args['keywords'] ?? '';
        $this->path = $args['path'] ?? '';
        $this->status = $args['status'] ?? false;
    }

    public function validar(){         
        if(!$this->data){
            self::$alertas['error'][] = 'Faltan campos por completar';
        }           
        if(!$this->keywords){
            self::$alertas['error'][] = 'Las palabras claves son obligatorias';
        }   
        return self::$alertas;
    }

    public  function saveDoc()
    {
        try {
            self::$db->begin_transaction();
            $atributos = $this->atributos();
            $idSeccion = intval($atributos['idSeccion']);
            $seccion = Seccion::where('id', $idSeccion);
            $recorteNSeccion = strtoupper(substr($seccion->seccion, 0, 3));
            $idDoc = Documento::selectMax('id');
            $refDoc = $recorteNSeccion . "-" . $atributos['idFormulario'] . "-" . str_pad($idDoc, 9, 0, STR_PAD_LEFT);
            $path = explode("/", $_FILES['path']['type']);
            $archivo = new Documento($atributos);
            $archivo->codigo = $refDoc;
            $carpetaArchivos = '../public/archivos/';
            if (!is_dir($carpetaArchivos)) {
                mkdir($carpetaArchivos);
            }
            setlocale(LC_ALL,"spanish");
            $year = strftime('%Y');
            $mes = strftime('%B');
            //dd($seccion->seccion);
            $yearArchivo = $carpetaArchivos . $year . "/";
            $mesArchivo = $yearArchivo . $mes . "/";
            $seccionArchivo = $mesArchivo.strtolower($seccion->seccion). "/";
            if (!is_dir($yearArchivo)) {
                mkdir($yearArchivo);
            }
            if (!is_dir($mesArchivo)) {
                mkdir($mesArchivo);
            }
            if(!is_dir($seccionArchivo)){
                mkdir($seccionArchivo);
            }
            move_uploaded_file($_FILES['path']['tmp_name'], $seccionArchivo . $refDoc . "." . $path['1']);
            $archivo->path = explode("..",$seccionArchivo . $refDoc . "." . $path['1'])[1];
            $resp = $archivo->guardar();
            $resolve = self::$db->commit();
            return $resp;
        } catch (Exception $e) {
            self::$db->rollBack();       
            return $e->getMessage();
        
        }
    }
}