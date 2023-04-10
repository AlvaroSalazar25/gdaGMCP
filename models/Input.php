<?php

namespace Model;

class Input extends ActiveRecord
{
    protected static $tabla = 'input';
    protected static $columnasDB = ['id','nombre','tipo','minlength','size','placeholder'];

    public $id;
    public $nombre;
    public $tipo;
    public $minlength;
    public $size;
    public $placeholder;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->tipo = $args['tipo'] ?? '';
        $this->minlength = $args['minlength'] ?? 5;
        $this->size = $args['size'] ?? '';
        $this->placeholder = $args['placeholder'] ?? '';
    }

    public function validarText(){
        if(!$this->nombre){
            self::$alertas['error'][] = 'El nombre del Input es obligatorio';
        }         
        if(strlen($this->minlength) < 5){
            self::$alertas['error'][] = 'El texto debe ser mayor a 5 palabras';
        } 
        if(!$this->size){
            self::$alertas['error'][] = 'El tamaño del input es obligatorio es obligatorio';
        }   
        return self::$alertas;
    }

    public function validarDate(){
        if(!$this->nombre){
            self::$alertas['error'][] = 'El nombre del Input es obligatorio';
        }   
        return self::$alertas;
    }
}