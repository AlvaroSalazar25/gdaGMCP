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
        $this->permisos = $args['permisos'] ?? '[{"id":1,"status":false,"nombre":"Ver_Carpeta","type":"carpeta","descripcion":"Permiso para ver carpetas"},{"id":2,"status":false,"nombre":"Crear_Carpeta","type":"carpeta","descripcion":"Permiso para crear carpetas"},{"id":3,"status":false,"nombre":"Editar_Carpeta","type":"carpeta","descripcion":"Permiso para Editar,Mover,Eliminar la carpeta"},{"id":4,"status":false,"nombre":"Ver_Documento","type":"documento","descripcion":"Permiso para visualizar el documento"},{"id":5,"status":false,"nombre":"Crear_Documento","type":"documento","descripcion":"Permiso para Crear un documento"},{"id":6,"status":false,"nombre":"Editar_Documento","type":"documento","descripcion":"Permiso para Editar la metadata del documento"},{"id":7,"status":false,"nombre":"Mover_Documentos","type":"documento","descripcion":"Permiso para mover de carpeta los documentos"},{"id":8,"status":false,"nombre":"Eliminar_Documento","type":"documento","descripcion":"Permiso para Eliminar el documento"}]';
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