<?php


namespace Model;

class SeccionUnidad extends ActiveRecord
{
    protected static $tabla = 'seccion_unidad';
    protected static $columnasDB = ['id', 'idUnidad','idSeccion','verSeccion','permisos'];

    public $id;
    public $idUnidad;
    public $idSeccion;
    public $verSeccion;
    public $permisos;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idUnidad = $args['idUnidad'] ?? '';
        $this->idSeccion = $args['idSeccion'] ?? '';
        $this->verSeccion = $args['verSeccion'] ?? 0;
        $this->permisos = $args['permisos'] ?? '';
    }
    
    public function validar(){
        if(!$this->idUnidad){
            self::$alertas['error'][] = 'El id de la Unidad es obligatorio';
        }   
        if(!$this->idSeccion){
            self::$alertas['error'][] = 'El id de la Sección es obligatorio';
        }   
        return self::$alertas;
    }
}