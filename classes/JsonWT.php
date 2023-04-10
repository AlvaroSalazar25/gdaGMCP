<?php

namespace Classes;

use Model\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use UnexpectedValueException;

class JsonWT
{

    public $id;
    public $email;

    public function __construct($id, $email)
    {
        $this->id = $id;
        $this->email = $email;
    }

    public function createJwt()
    {
        $secretKey  = $_ENV['SECRET_KEY'];
        $time = time();
        $token = [
            'iat' => $time,
            'exp' => $time + (60 * 600000000), //ojo cambiar a 5 el 2do 60
            'data' => [
                'id' => $this->id,
                'email' => $this->email
            ]
        ];
        $jwt = JWT::encode($token, $secretKey, "HS512");
        $resolve =  [
            'jwt' => $jwt,
            'exp' =>  $time + (60 * 5)
        ];
        return $resolve;
    }

    public static function validateJwt($token)
    {
        $secretKey = $_ENV['SECRET_KEY'];
        $user = User::where('token',$token);
        $time = time();
        if(!empty($user)){
            try{
                $decoded = JWT::decode($token, new Key($secretKey,"HS512"));
                if($user->id == $decoded->data->id){
                    if($time < $decoded->exp){
                        $resolve =  [
                            'status' =>  true,
                            'error' => 'Token válido y vigente',
                        ];
                        return $resolve;
                    } else{
                        $resolve =  [
                            'status' =>  false,
                            'error' => 'Token expirado',
                        ];
                        return $resolve;
                    }
                } else{
                    $resolve =  [
                        'status' =>  false,
                        'error' => 'Token no válido',
                    ];
                    return $resolve;   
                }

            } catch (UnexpectedValueException $e) {
                $resolve =  [
                    'status' =>  false,
                    'error' => $e->getMessage(),
                ];
                return $resolve;   
            }   
        } else{
            $resolve =  [
                'status' =>  false,
                'error' => 'Token no encontrado',
            ];
            return $resolve;
        }
    }
}
