<?php


namespace Model;

class Unidad extends ActiveRecord
{
    protected static $tabla = 'unidad';
    protected static $columnasDB = ['id', 'unidad', 'jefe'];

    public $id;
    public $unidad;
    public $jefe;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->unidad = $args['unidad'] ?? '';
        $this->jefe = $args['jefe'] ?? '';
    }

    public function validar()
    {
        if (!$this->unidad) {
            self::$alertas['error'][] = 'El Nombre es Obligatorio';
        }
        if (!$this->jefe) {
            self::$alertas['error'][] = 'El Jefe es Obligatorio';
        }
        return self::$alertas;
    }
}