<?php


namespace Model;

class SeccionUnidad extends ActiveRecord
{
    protected static $tabla = 'seccion_unidad';
    protected static $columnasDB = ['id', 'idUnidad','idPadre','idSeccion','verSeccion','permisos'];

    public $id;
    public $idUnidad;
    public $idPadre;
    public $idSeccion;
    public $verSeccion;
    public $permisos;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idUnidad = $args['idUnidad'] ?? '';
        $this->idPadre = $args['idPadre'] ?? '';
        $this->idSeccion = $args['idSeccion'] ?? '';
        $this->verSeccion = $args['verSeccion'] ?? 0;
        $this->permisos = $args['permisos'] ?? '[{"id":2,"status":false,"nombre":"Crear_Carpeta","type":"carpeta","descripcion":"Permiso para crear carpetas"},{"id":3,"status":false,"nombre":"Editar_Carpeta","type":"carpeta","descripcion":"Permiso para Editar,Mover,Eliminar la carpeta"},{"id":4,"status":false,"nombre":"Ver_Documento","type":"documento","descripcion":"Permiso para visualizar el documento"},{"id":5,"status":false,"nombre":"Crear_Documento","type":"documento","descripcion":"Permiso para Crear un documento"},{"id":6,"status":false,"nombre":"Editar_Documento","type":"documento","descripcion":"Permiso para Editar la metadata del documento"},{"id":7,"status":false,"nombre":"Mover_Documentos","type":"documento","descripcion":"Permiso para mover de carpeta los documentos"},{"id":8,"status":false,"nombre":"Eliminar_Documento","type":"documento","descripcion":"Permiso para Eliminar el documento"}]';;
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