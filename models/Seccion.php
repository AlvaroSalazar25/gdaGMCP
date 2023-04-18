<?php


namespace Model;

class Seccion extends ActiveRecord
{
    protected static $tabla = 'seccion';
    protected static $columnasDB = ['id','seccion','descripcion','idFormulario','idPadre'];

    public $id;
    public $seccion;
    public $descripcion;
    public $idFormulario;
    public $idPadre;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->seccion = $args['seccion'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->idFormulario = $args['idFormulario'] ?? '';
        $this->idPadre = $args['idPadre'] ?? '';
    }

    public function validar()
    {
        if (!$this->seccion) {
            self::$alertas['error'][] = 'El Nombre de la Sección es Obligatorio';
        }
        return self::$alertas;
    }
}