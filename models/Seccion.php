<?php


namespace Model;

class Seccion extends ActiveRecord
{
    protected static $tabla = 'seccion';
    protected static $columnasDB = ['id','idPadre','seccion','descripcion','color'];

    public $id;
    public $idPadre;
    public $seccion;
    public $descripcion;
    public $color;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->idPadre = $args['idPadre'] ?? '';
        $this->seccion = $args['seccion'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->color = $args['color'] ?? '';
    }

    public function validar()
    {
        if (!$this->seccion) {
            self::$alertas['error'][] = 'El Nombre de la Sección es Obligatorio';
        }
        return self::$alertas;
    }

}