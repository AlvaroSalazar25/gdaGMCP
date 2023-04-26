<?php

function dd($variable): string
{
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html): string
{
    $s = htmlspecialchars($html);
    return $s;
}

function validarCI($strCedula): bool
{
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
}

function rmDir_rf($carpeta)
{
    foreach (glob($carpeta . "/*") as $archivos_carpeta) {
        if (is_dir($archivos_carpeta)) {
            rmDir_rf($archivos_carpeta);
        } else {
            unlink($archivos_carpeta);
        }
    }
    rmdir($carpeta);
}
