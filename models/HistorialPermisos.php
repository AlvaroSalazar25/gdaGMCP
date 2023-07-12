<?php

namespace Model;

class HistorialPermisos extends ActiveRecord
{
    protected static $tabla = 'historial_permisos';//aqui arreglar los ids que van a ir en la tabla
    protected static $columnasDB = ['id', 'idUser','user','idSeccion','seccion', 'idAdmin','admin','accion','data'];

    public $id;
    public $idUser;
    public $user;
    public $idSeccion;
    public $seccion;
    public $idAdmin;
    public $admin;
    public $accion;
    public $data;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idUser = $args['idUser'] ?? null;
        $this->user = $args['user'] ?? '';
        $this->idSeccion = $args['idSeccion'] ?? null;
        $this->seccion = $args['seccion'] ?? '';
        $this->idAdmin = $args['idAdmin'] ?? null;
        $this->admin = $args['admin'] ?? '';
        $this->accion = $args['accion'] ?? '';
        $this->data = $args['data'] ?? [];
    }

    public function validar(){
        if(!$this->idUser){
            self::$alertas['error'][] = 'El id del Usuario es obligatorio';
        }  
        if(!$this->user){
            self::$alertas['error'][] = 'El Usuario es obligatorio';
        } 
        if(!$this->idSeccion){
            self::$alertas['error'][] = 'El id de la Carpeta es obligatorio';
        } 
        if(!$this->seccion){
            self::$alertas['error'][] = 'La Carpeta es obligatorio';
        } 
        if(!$this->idAdmin){
            self::$alertas['error'][] = 'El id del Administrador es obligatorio';
        } 
        if(!$this->admin){
            self::$alertas['error'][] = 'El Administrador es obligatorio';
        } 
        if(!$this->accion){
            self::$alertas['error'][] = 'La acción es obligatorio';
        }                         
        return self::$alertas;
    }
}