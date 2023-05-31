<?php


namespace Model;

class SeccionUser extends ActiveRecord
{
    protected static $tabla = 'seccion_user';
    protected static $columnasDB = ['id', 'idUser','idSeccion','verSeccion','permisos'];

    public $id;
    public $idUser;
    public $idSeccion;
    public $verSeccion;
    public $permisos;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idUser = $args['idUser'] ?? '';
        $this->idSeccion = $args['idSeccion'] ?? '';
        $this->verSeccion = $args['verSeccion'] ?? 0;
        $this->permisos = $args['permisos'] ?? '';
    }
    
    public function validar(){
        if(!$this->idUser){
            self::$alertas['error'][] = 'El id del User es obligatorio';
        }   
        if(!$this->idSeccion){
            self::$alertas['error'][] = 'El id del Permiso es obligatorio';
        }           
        return self::$alertas;
    }
}