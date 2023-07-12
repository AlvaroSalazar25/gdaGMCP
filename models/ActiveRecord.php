<?php

namespace Model;

use Exception;
use mysqli;

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

class ActiveRecord
{

        // Base DE DATOS
        protected static $db;
        protected static $tabla = '';
        protected static $columnasDB = [];

        // Alertas y Mensajes
        protected static $alertas = [];

        // Definir la conexión a la BD - includes/database.php
        public static function setDB($database)
        {
                self::$db = $database;
        }
        public static function getTabla()
        {
                return static::$tabla;
        }

        public static function initTransaction()
        {
                self::$db->autocommit(false);
        }

        public static function endTransaction()
        {
                self::$db->commit();
                self::$db->autocommit(true);
        }

        public static function rollback()
        {
                self::$db->rollback();
                self::$db->autocommit(true);
        }

        public static function debug()
        {
                $result = self::$db->query('SHOW ENGINE INNODB STATUS');
                $row = $result->fetch_assoc();
                $info = $row['Status'];
                return $info;
        }

        public static function setAlerta($tipo, $mensaje)
        {
                static::$alertas[$tipo][] = $mensaje;
        }

        // Validación
        public static function getAlertas()
        {
                return static::$alertas;
        }

        public function validar()
        {
                static::$alertas = [];
                return static::$alertas;
        }

        // Consulta SQL para crear un objeto en Memoria
        public static function consultarSQL($query)
        {
                // Consultar la base de datos
                $resultado = self::$db->query($query);
                // Iterar los resultados
                $array = [];
                while ($registro = $resultado->fetch_assoc()) {
                        $array[] = static::crearObjeto($registro);
                }
                // liberar la memoria
                $resultado->free();
                // retornar los resultados
                return $array;
        }



        public static function consultaPlana($query)
        {
                // Consultar la base de datos
                $resultado = self::$db->query($query);
                // Iterar los resultados
                $array = [];
                while ($registro = $resultado->fetch_assoc()) {
                        $array[] = $registro;
                }
                // liberar la memoria
                $resultado->free();
                // retornar los resultados
                return $array;
        }

        // Crea el objeto en memoria que es igual al de la BD
        protected static function crearObjeto($registro)
        {
                $objeto = new static;
                foreach ($registro as $key => $value) {
                        if (property_exists($objeto, $key)) {
                                $objeto->$key = $value;
                        }
                }
                return $objeto;
        }

        // Identificar y unir los atributos de la BD
        public function atributos()
        {
                $atributos = [];
                foreach (static::$columnasDB as $columna) {
                        if ($columna === 'id') continue;
                        $atributos[$columna] = $this->$columna;
                }
                return $atributos;
        }

        // Sanitizar los datos antes de guardarlos en la BD
        public function sanitizarAtributos()
        {
                $atributos = $this->atributos();
                $sanitizado = [];
                foreach ($atributos as $key => $value) {
                        $sanitizado[$key] = self::$db->escape_string($value);
                }
                return $sanitizado;
        }

        // Sincroniza BD con Objetos en memoria
        public function sincronizar($args = [])
        {
                foreach ($args as $key => $value) {
                        if (property_exists($this, $key) && !is_null($value)) {
                                $this->$key = $value;
                        }
                }
        }

        // Registros - CRUD
        public function guardar()
        {
                $resultado = '';
                if (!is_null($this->id)) {
                        // actualizar
                        $resultado = $this->actualizar();
                } else {
                        // Creando un nuevo registro
                        $resultado = $this->crear();
                }
                return $resultado;
        }

 
        public static function cantidadPermisos($campo, $valor,$campo2, $valor2)
        {
                $consulta = "SELECT * FROM " . static::$tabla . " WHERE " . $campo . " = " . $valor . " AND $campo2 = " . $valor2;
                $permisos = self::consultaPlana($consulta);
                return array_shift($permisos);
        }

        // Todos los registros
        public static function all()
        {
                $query = "SELECT * FROM " . static::$tabla;
                $resultado = self::consultarSQL($query);
                return $resultado;
        }

        // Busca un registro por su id
        public static function find($id)
        {
                $query = "SELECT * FROM " . static::$tabla  . " WHERE id = $id";
                $resultado = self::consultarSQL($query);
                return array_shift($resultado);
        }

        // Busca un registro por columna
        public static function where($columna, $valor)
        {
                $query = "SELECT * FROM " . static::$tabla  . " WHERE  $columna = '$valor'";
                $resultado = self::consultarSQL($query);
                return array_shift($resultado);
        }

        public static function whereCampos($columna, $valor, $columna2, $valor2)
        {
                $query = "SELECT * FROM " . static::$tabla  . " WHERE  $columna = '$valor' AND $columna2 = '$valor2'";
                $resultado = self::consultarSQL($query);
                return array_shift($resultado);
        }

        public static function whereCamposTodos($columna, $valor, $columna2, $valor2)
        {
                $query = "SELECT * FROM " . static::$tabla  . " WHERE  $columna = '$valor' AND $columna2 = '$valor2'";
                $resultado = self::consultarSQL($query);
                return $resultado;
        }

        public static function whereTodos($columna, $valor)
        {
                $query = "SELECT * FROM " . static::$tabla  . " WHERE  $columna = '$valor'";
                $resultado = self::consultarSQL($query);
                return $resultado;
        }

        public static function wherePlano($columna, $valor)
        {
                $query = "SELECT * FROM " . static::$tabla  . " WHERE  $columna = '$valor'";
                $resultados = self::consultaPlana($query);
                return  $resultados;
        }

        public static function whereCamposCarpetas($columna, $valor, $columna2, $valor2, $columna3, $valor3)
        {
                $query = "SELECT * FROM " . static::$tabla  . " WHERE  $columna = '$valor' AND $columna2 = '$valor2' AND $columna3 = '$valor3'";
                $resultado = self::consultarSQL($query);
                return $resultado;
        }

        // Obtener Registros con cierta cantidad
        public static function get($limite)
        {
                $query = "SELECT * FROM " . static::$tabla . " LIMIT ${limite}";
                $resultado = self::consultarSQL($query);
                return array_shift($resultado);
        }

        // crea un nuevo registro
        public function crear()
        {
                // Sanitizar los datos
                $atributos = $this->sanitizarAtributos();
                // Insertar en la base de datos
                $query = "INSERT INTO " . static::$tabla . " ( ";
                $query .= join(', ', array_keys($atributos));
                $query .= " ) VALUES ('";
                $query .= join("', '", array_values($atributos));
                $query .= "')";
                // Resultado de la consulta
                $resultado = self::$db->query($query);
                return [
                        'resultado' =>  $resultado,
                        'id' => self::$db->insert_id
                ];
        }

        public static function selectMax($buscar)
        {
                $query = "SELECT MAX($buscar) + 1 FROM " . static::$tabla;
                $resultado = self::consultaPlana($query);
                $valor = array_shift($resultado);
                return array_shift($valor);
        }

        // public static function countPadre($idSeccion)
        // {
        //         $query = "SELECT count(*) as contador FROM " . static::$tabla . " WHERE idSeccion =" . $idSeccion;
        //         $resultado = self::consultaPlana($query);
        //         return array_shift($resultado);
        // }

        public static function countPadre($idFormulario)
        {
                $query = "SELECT count(*) as contador FROM " . static::$tabla . " WHERE idFormulario = " . $idFormulario;
                $resultado = self::consultaPlana($query);
                return array_shift($resultado);
        }

        // Actualizar el registro
        public function actualizar()
        {
                // Sanitizar los datos
                $atributos = $this->sanitizarAtributos();
                // Iterar para ir agregando cada campo de la BD
                $valores = [];
                foreach ($atributos as $key => $value) {
                        $valores[] = "{$key}='{$value}'";
                }
                // Consulta SQL
                $query = "UPDATE " . static::$tabla . " SET ";
                $query .=  join(', ', $valores);
                $query .= " WHERE id = '" . self::$db->escape_string($this->id) . "' ";
                $query .= " LIMIT 1 ";
                // Actualizar BD
                $resultado = self::$db->query($query);
                return $resultado;
        }

        // Actualizar el registro
        public function actualizarPermiso($campo, $valor)
        {
                // Sanitizar los datos
                $atributos = $this->sanitizarAtributos();
                // Iterar para ir agregando cada campo de la BD
                $valores = [];
                foreach ($atributos as $key => $value) {
                        $valores[] = "{$key}='{$value}'";
                }
                // Consulta SQL
                $query = "UPDATE " . static::$tabla . " SET ";
                $query .=  join(', ', $valores);
                $query .= " WHERE " . $campo . " = '" . self::$db->escape_string($valor) . "' AND idSeccion = '" . self::$db->escape_string($this->idSeccion) . "' ";
                // Actualizar BD
                $resultado = self::$db->query($query);
                return $resultado;
        }

        public static function updateDeleteFormulario($valor)
        {
                $query = "UPDATE " . static::$tabla  . " SET idFormulario = '1'  WHERE idFormulario = '$valor'";
                //dd($query);
                $resultado = self::$db->query($query);
                return $resultado;
        }

        public static function consultaSeccion($query)
        {
                // Consultar la base de datos
                $resultado = self::$db->query($query);
                // Iterar los resultados
                $array = [];
                while ($registro = $resultado->fetch_assoc()) {
                        $array[] = $registro['unidad'];
                }
                return array_shift($array);
        }

        // Eliminar un Registro por su ID
        public function eliminar()
        {
                $query = "DELETE FROM "  . static::$tabla . " WHERE id = " . self::$db->escape_string($this->id) . " LIMIT 1";
                $resultado = self::$db->query($query);
                return $resultado;
        }

        public static function eliminarTodos($columna, $valor)
        {
                $query = "DELETE FROM "  . static::$tabla . " WHERE ${columna} = " . self::$db->escape_string($valor);
                $resultado = self::$db->query($query);
                return $resultado;
        }

        public static function generarError($error)
        {
                $datosErrors = debug_backtrace()[1];
                $controller = explode("\\", $datosErrors['class'])[1];
                $data = $datosErrors['object'] ?? [];
                if (!$_SESSION) {
                        session_start();
                }

                $errorGenerado = [
                        'tabla_error' => explode("\\", $datosErrors['class'])[1],
                        'controller_error' => $controller,
                        'function_error' => $datosErrors['function'],
                        'data' => json_encode($data),
                        'error' =>  $error
                ];
                $errorSave = new Errors($errorGenerado);
                $resultado = $errorSave->guardar();
                return $resultado;
        }
}
