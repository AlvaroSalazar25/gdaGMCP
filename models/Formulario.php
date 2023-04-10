<?php

namespace Model;

class Formulario extends ActiveRecord
{
    protected static $tabla = 'formulario';
    protected static $columnasDB = ['id', 'nombre', 'keywords', 'campos','version', 'archivo'];

    public $id;
    public $nombre;
    public $keywords;
    public $campos;
    public $version;
    public $archivo;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->keywords = $args['keywords'] ?? '';
        $this->campos = $args['campos'] ?? '';
        $this->version = $args['version'] ?? 1;
        $this->archivo = $args['archivo'] ?? '';
    }

    public function validar(){
        if(!$this->nombre){
            self::$alertas['error'][] = 'El nombre del formulario es obligatorio';
        }   
        if(!$this->campos){
            self::$alertas['error'][] = 'Los campos del formulario son obligatorios';
        } 
        if(!$this->version){
            self::$alertas['error'][] = 'La versión del archivo es obligatorio';
        }            
        if(!$this->archivo){
            self::$alertas['error'][] = 'Los tipos de archivo permitidos son obligatorios';
        } 
             
        return self::$alertas;
    }
}