<?php

namespace Model;

class Errors extends ActiveRecord
{
    protected static $tabla = 'errors';
    protected static $columnasDB = ['id', 'tabla_error', 'controller_error','function_error', 'data', 'error'];

    public $id;
    public $tabla_error;
    public $controller_error;
    public $function_error;
    public $data;
    public $error;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->tabla_error = $args['tabla_error'] ?? '';
        $this->controller_error = $args['controller_error'] ?? '';
        $this->function_error = $args['function_error'] ?? '';
        $this->error = $args['error'] ?? '';
        $this->data = $args['data'] ?? '';
    }

}