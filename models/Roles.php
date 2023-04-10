<?php


namespace Model;

class Roles extends ActiveRecord
{
    protected static $tabla = 'roles';
    protected static $columnasDB = ['id', 'rol'];

    public $id;
    public $rol;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->rol = $args['rol'] ?? '';
    }
}