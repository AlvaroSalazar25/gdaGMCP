<?php

namespace Controllers;
use Model\Curl;

class CurlController
{
    // public static function login()
    // {
    //     // $ch = curl_init();
    //     // curl_setopt($ch,CURLOPT_URL,'https://pokeapi.co/api/v2/pokemon');
    //     // curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);

    //     // $response = json_decode(curl_exec($ch));

    //     // if(curl_errno($ch)){
    //     //     echo curl_error($ch);
    //     // }
    //     // $ch = curl_init();
    //     // $datos = [
    //     //     'id' => '551',
    //     //     'name' => 'alvaro',
    //     //     'job' => 'trotard'
    //     // ];
    //     // $data = http_build_query($datos);
    //     // curl_setopt($ch, CURLOPT_URL, 'https://reqres.in/api/users');
    //     // //curl_setopt($ch, CURLOPT_POST, true);
    //     // curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        
    //     // curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    //     // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    //     // $response = json_decode(curl_exec($ch));
    //     // if (curl_errno($ch)) {
    //     //     echo curl_error($ch);
    //     // } else{
    //     //     debuguear($response);
    //     // }
    //     // curl_close($ch);

    //     $curl = new Curl('https://reqres.in/api/users');
    //     $array = [
    //         'name' => 'Alvaro',
    //         'job' => 'correr'
    //     ];
    //     $response = $curl->init()->setOption()->setOption(CURLOPT_POST, true)->buildQuery($array)->setOption(CURLOPT_RETURNTRANSFER, true)->execute();
    //     debuguear($response);
    // }
}
