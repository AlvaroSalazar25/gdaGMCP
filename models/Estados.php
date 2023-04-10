<?php

namespace Model;

class Estados extends ActiveRecord
{
    protected static $tabla = 'estado';
    protected static $columnasDB = ['id', 'estado'];

    public $id;
    public $estado;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->estado = $args['estado'] ?? '';
    }
}