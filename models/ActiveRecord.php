<?php

namespace Model;

use Exception;

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
    // Busca un registro por su id
    public static function where($columna, $valor)
    {
        $query = "SELECT * FROM " . static::$tabla  . " WHERE  ${columna} = '${valor}'";
        $resultado = self::consultarSQL($query);
        return array_shift($resultado);
    }

    public static function whereUnidad($columna, $valor, $columna2, $valor2)
    {
        $query = "SELECT * FROM " . static::$tabla  . " WHERE  $columna = '$valor' AND $columna2 = '$valor2'";
        $resultado = self::consultarSQL($query);
        return array_shift($resultado);
    }
    public static function whereTodos($columna, $valor)
    {
        $query = "SELECT * FROM " . static::$tabla  . " WHERE  ${columna} = '${valor}'";
        $resultado = self::consultarSQL($query);
        return $resultado;
    }

    public static function wherePlano($columna, $valor)
    {
        $query = "SELECT * FROM " . static::$tabla  . " WHERE  ${columna} = '${valor}'";
        $resultado = self::consultarSQL($query);
        return  $resultado;
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
    public  function saveDoc()
    {

        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        try {
            self::$db->begin_transaction();
            $atributos = $this->sanitizarAtributos();
            $idSeccion = intval($atributos['idSeccion']);
            $seccion = Seccion::where('id', $idSeccion);
            $recorteNSeccion = strtoupper(substr($seccion->seccion, 0, 3));
            $idDoc = Documento::selectMax('id');
            $refDoc = $recorteNSeccion . "-" . $atributos['idFormulario'] . "-" . str_pad($idDoc, 9, 0, STR_PAD_LEFT);
            $path = explode("/", $_FILES['path']['type']);
            $archivo = new Documento($atributos);
            $archivo->codigo = $refDoc;

            $carpetaArchivos = '../public/archivos/';
            if (!is_dir($carpetaArchivos)) {
                mkdir($carpetaArchivos);
            }
            setlocale(LC_ALL,"spanish");
            $year = strftime('%Y');
            $mes = strftime('%B');
            //dd($seccion->seccion);
            $yearArchivo = $carpetaArchivos . $year . "/";
            $mesArchivo = $yearArchivo . $mes . "/";
            $seccionArchivo = $mesArchivo.strtolower($seccion->seccion). "/";
            if (!is_dir($yearArchivo)) {
                mkdir($yearArchivo);
            }
            if (!is_dir($mesArchivo)) {
                mkdir($mesArchivo);
            }
            if(!is_dir($seccionArchivo)){
                mkdir($seccionArchivo);
            }
            move_uploaded_file($_FILES['path']['tmp_name'], $seccionArchivo . $refDoc . "." . $path['1']);
            $archivo->path = explode("..",$seccionArchivo . $refDoc . "." . $path['1'])[1];
            $rep = $archivo->guardar();
            $resultado = self::$db->commit();
            dd($resultado);
        } catch (Exception $e) {
            $resultado = self::$db->rollBack();

            return ['error' => 'Documento No se pudo Guardar'];
        }
    }

    public function crearSeccionEmptyForm()
    {
        // Sanitizar los datos
        $atributos = $this->sanitizarAtributos();
        $query = "INSERT INTO " . static::$tabla . " ( seccion ) VALUES ('" . $atributos['seccion'] . "')";
        $resultado = self::$db->query($query);
        return [
            'resultado' =>  $resultado,
            'id' => self::$db->insert_id
        ];
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

    public static function actualizarSeccion($dato, $dato1, $columna1, $valor1, $columna2, $valor2)
    {
        $query = "UPDATE " . static::$tabla  . " SET $dato = '$dato1'  WHERE  $columna1 = '$valor1' AND $columna2 = '$valor2'";
        //dd($query);
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
        //dd($query);
        $resultado = self::$db->query($query);
        return $resultado;
    }

    public static function eliminarTodos($columna, $valor)
    {
        $query = "DELETE FROM "  . static::$tabla . " WHERE ${columna} = " . self::$db->escape_string($valor);
        $resultado = self::$db->query($query);
        //dd($query);
        return $resultado;
    }
}
