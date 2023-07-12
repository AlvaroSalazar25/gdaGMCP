<?php

namespace Model;

class HistorialCarpeta extends ActiveRecord
{
    protected static $tabla = 'historial_seccion';
    protected static $columnasDB = ['id', 'idUser','user','idPadre', 'idSeccion','seccion', 'accion','data','permisos'];

    public $id;
    public $idUser;
    public $user;
    public $idPadre;
    public $idSeccion;
    public $seccion;
    public $accion;
    public $data;
    public $permisos;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idUser = $args['idUser'] ?? null;
        $this->user = $args['user'] ?? '';
        $this->idPadre = $args['idPadre'] ?? null;
        $this->idSeccion = $args['idSeccion'] ?? null;
        $this->seccion = $args['seccion'] ?? '';
        $this->accion = $args['accion'] ?? '';
        $this->data = $args['data'] ?? [];
        $this->permisos = $args['permisos'] ?? [];
    }

    public function validar(){
        if(!$this->idUser){
            self::$alertas['error'][] = 'El id del Usuario es obligatorio';
        }  
        if(!$this->user){
            self::$alertas['error'][] = 'El nombre del Usuario es obligatorio';
        }    
        if(!$this->idSeccion){
            self::$alertas['error'][] = 'El id de la Carpeta es obligatorio';
        } 
        if(!$this->seccion){
            self::$alertas['error'][] = 'El nombre de la Carpeta es obligatorio';
        } 
        if(!$this->accion){
            self::$alertas['error'][] = 'La acción es obligatorio';
        }                         
        return self::$alertas;
    }
}