<?php
namespace Model;
class Curl {

    protected  $curl;
    protected  $option;
    protected  $handler;
    protected  $response;

    public function __construct($url,$option = null)
    {
        $this->url = $url;
        $this->option = is_null($option) ? CURLOPT_URL : $option;
    }

    public function init(){
        $this->handler = curl_init();
        return $this;
    }
    
    public function setOption($option = null, $value = null){
        curl_setopt($this->handler, is_null($option) ? $this->option : $option, is_null($value) ? $this->url : $value);
        return $this;
    }

    public function execute(){
        return json_decode(curl_exec($this->handler));
    }
    public function buildQuery($array){
        curl_setopt($this->handler, CURLOPT_POSTFIELDS, http_build_query($array));
        return $this;
    }
    public function decode(){
        $this->response = json_decode($this->execute(),true);
    }
    public function close(){
        curl_close($this->handler);
        return $this;
    }
    public function fetch(){
        return json_decode(json_encode($this->response));
    }
}