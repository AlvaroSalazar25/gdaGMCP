<?php


namespace Model;

class User extends ActiveRecord
{
    protected static $tabla = 'user';
    protected static $columnasDB = ['id', 'idRol', 'idEstado', 'idUnidad', 'nombre', 'cedula', 'celular', 'email', 'password', 'confirmado', 'token'];

    public $id;
    public $idRol;
    public $idEstado;
    public $idUnidad;
    public $nombre;
    public $cedula;
    public $celular;
    public $email;
    public $password;
    public $confirmado;
    public $token;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->cedula = $args['cedula'] ?? '';
        $this->celular = $args['celular'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->confirmado = $args['confirmado'] ?? '0';
        $this->token = $args['token'] ?? '';
        $this->idRol = $args['idRol'] ?? '';
        $this->idEstado = $args['idEstado'] ?? '1';
        $this->idUnidad = $args['idUnidad'] ?? '';
    }

    public function validarPassCedula()
    {
        if (!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre es Obligatorio';
        }
        if (!$this->cedula) {
            self::$alertas['error'][] = 'La Cédula es Obligatoria';
        }
        if (strlen($this->cedula) < 10) {
            self::$alertas['error'][] = 'La Cédula debe tener un mínimo de 10 dígitos';
        }
        if (!$this->celular) {
            self::$alertas['error'][] = 'El Celular es Obligatorio';
        }
        if (strlen($this->celular) < 10) {
            self::$alertas['error'][] = 'El Celular debe tener un mínimo de 11 dígitos';
        }
        if (!$this->email) {
            self::$alertas['error'][] = 'El Email es Obligatorio';
        }
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            self::$alertas['error'][] = 'Tiene que proporcionar un Email válido';
        }
        if (!$this->idRol) {
            self::$alertas['error'][] = 'El Rol es Obligatorio';
        }
        if (!$this->idUnidad) {
            self::$alertas['error'][] = 'La Unidad es Obligatorio';
        }
        if (!$this->password) {
            self::$alertas['error'][] = 'La Contraseña es Obligatoria';
        }
        return self::$alertas;
    }

    public function validarPass()
    {
        if (!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre es Obligatorio';
        }
        if (!$this->cedula) {
            self::$alertas['error'][] = 'La Cédula es Obligatoria';
        }
        if (strlen($this->cedula) < 10) {
            self::$alertas['error'][] = 'La Cédula debe tener un mínimo de 10 dígitos';
        }
        if (!$this->celular) {
            self::$alertas['error'][] = 'El Celular es Obligatorio';
        }
        if (strlen($this->celular) < 10) {
            self::$alertas['error'][] = 'El Celular debe tener un mínimo de 11 dígitos';
        }
        if (!$this->email) {
            self::$alertas['error'][] = 'El Email es Obligatorio';
        }
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            self::$alertas['error'][] = 'Tiene que proporcionar un Email válido';
        }
        if (!$this->idRol) {
            self::$alertas['error'][] = 'El Rol es Obligatorio';
        }
        if (!$this->idUnidad) {
            self::$alertas['error'][] = 'La Unidad es Obligatorio';
        }
        if (!$this->password) {
            self::$alertas['error'][] = 'La Rontraseña es Obligatoria';
        }
        $regex = '/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/';
        if (!preg_match($regex, $this->password)) {
            self::$alertas['error'][] = 'La Contraseña debe tener entre 8 y 16 caracteres, al menos un dígito y al menos una mayúscula.';
        }
        return self::$alertas;
    }

    public function validarUpdate()
    {
        if (!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre es Obligatorio';
        }
        if (!$this->cedula) {
            self::$alertas['error'][] = 'La Cédula es Obligatoria';
        }
        if (strlen($this->cedula) < 10) {
            self::$alertas['error'][] = 'La Cédula debe tener un mínimo de 10 dígitos';
        }
        if (!$this->celular) {
            self::$alertas['error'][] = 'El Celular es Obligatorio';
        }
        if (strlen($this->celular) < 10) {
            self::$alertas['error'][] = 'El Celular debe tener un mínimo de 11 dígitos';
        }
        if (!$this->email) {
            self::$alertas['error'][] = 'El Email es Obligatorio';
        }
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            self::$alertas['error'][] = 'Tiene que proporcionar un Email válido';
        }
        if (!$this->idRol) {
            self::$alertas['error'][] = 'El Rol es Obligatorio';
        }
        if (!$this->idUnidad) {
            self::$alertas['error'][] = 'La Unidad es Obligatorio';
        }
        return self::$alertas;
    }

    public function hashPassword()
    {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    public function comprobarPassword()
    {
        $regex = '/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/';
        if (!preg_match($regex, $this->password)) {
            self::$alertas['error'][] = 'La Contraseña debe tener entre 8 y 16 caracteres, al menos un dígito y al menos una mayúscula.';
        }
        return self::$alertas;
    }
    public function validarPassword()
    {
        if (!$this->password) {
            self::$alertas['error'][] = 'La Contraseña es Obligatoria';
        }
        return self::$alertas;
    }
    public function validarEmail()
    {
        if (!$this->email) {
            self::$alertas['error'][] = 'El Email es Obligatorio';
        }
        return self::$alertas;
    }

    // Funcion para crear un token aleatorio
    public function crearToken()
    {
        $this->token = uniqid();
    }
    public function verificarPassword($password)
    {
        $resultado = password_verify($password, $this->password);
        if (!$resultado) {
            return false;
        } else {
            return true;
        }
    }
    public function validarCI($strCedula)
    {
        if($strCedula){
            $suma = 0;
        $strOriginal = $strCedula;
        $intProvincia = substr($strCedula, 0, 2);
        $intTercero = $strCedula[2];
        $intUltimo = $strCedula[9];
        if (!settype($strCedula, "float")) return FALSE;
        if ((int) $intProvincia < 1 || (int) $intProvincia > 24) return FALSE;
        if ((int) $intTercero > 6) return FALSE;
        for ($indice = 0; $indice < 9; $indice++) {
            switch ($indice) {
                case 0:
                case 2:
                case 4:
                case 6:
                case 8:
                    $arrProducto[$indice] = $strOriginal[$indice] * 2;
                    if ($arrProducto[$indice] >= 10) $arrProducto[$indice] -= 9;
                    break;
                case 1:
                case 3:
                case 5:
                case 7:
                    $arrProducto[$indice] = $strOriginal[$indice] * 1;
                    if ($arrProducto[$indice] >= 10) $arrProducto[$indice] -= 9;
                    break;
            }
        }
        foreach ($arrProducto as $indice => $producto) $suma += $producto;
        $residuo = $suma % 10;
        $intVerificador = $residuo == 0 ? 0 : 10 - $residuo;
        return ($intVerificador == $intUltimo ? TRUE : FALSE);
        } else{
            return FALSE;
        }
    }

    public function validarCelular($celular)
    {
        if($celular && $celular[0] == 0 && $celular[1] == 9){
            return true;
        } else{
            return false;
        }
    }
}
