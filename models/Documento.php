<?php

namespace Model;

class Documento extends ActiveRecord
{
    protected static $tabla = 'documento';
    protected static $columnasDB = ['id','idUser', 'idSeccion', 'idFormulario','codigo', 'data','keywords', 'path'];

    public $id;
    public $idUser;
    public $idSeccion;
    public $idFormulario;
    public $codigo;
    public $data;
    public $keywords;
    public $path;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idUser = $args['idUser'] ?? '';
        $this->idSeccion = $args['idSeccion'] ?? '';
        $this->idFormulario = $args['idFormulario'] ?? '';
        $this->codigo = $args['codigo'] ?? '';
        $this->data = $args['data'] ?? '';
        $this->keywords = $args['keywords'] ?? '';
        $this->path = $args['path'] ?? '';
    }

    public function validar(){

         
        if(!$this->data){
            self::$alertas['error'][] = 'Faltan campos por completar';
        } 
        if(!$this->keywords){
            self::$alertas['error'][] = 'Las palabras clave son obligatorias';
        }    
        return self::$alertas;
    }
}