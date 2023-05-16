<div class="mt-3 mb-4 px-2" id="padre">
    <?php
    $mensaje = $_GET['r'] ?? null;
    $validar = $_GET['c'] ?? null;
    if($validar != null){
        $cifrado = base64_decode($_GET['c']);
    }
    if ($mensaje == 1) {
    ?>
        <div class="alerta exito " style="width:100%;">
            <?php echo "Usuario CREADO correctamente" ?>
        </div>
    <?php } else if ($mensaje == 2) { ?>
        <div class="alerta exito " style="width:100%;">
            <?php echo "Usuario ACTUALIZADO correctamente" ?>
        </div>
    <?php } else if ($mensaje == 3) { ?>
        <div class="alerta bg-danger " style="width:100%;">
            <?php echo "Servicio ELIMINADO correctamente" ?>
        </div>
    <?php } else if ($mensaje == 4) { ?>
        <div class="alerta exito " style="width:100%;">
            <?php echo "Tipo de Servicio CREADO correctamente" ?>
        </div>
    <?php } else if ($mensaje == 5) { ?>
        <div class="alerta exito " style="width:100%;">
            <?php echo "Tipo de Servicio ACTUALIZADO correctamente" ?>
        </div>
    <?php } else if ($mensaje == 6) { ?>
        <div class="alerta bg-danger " style="width:100%;">
            <?php echo "Tipo de Servicio ELIMINADO correctamente" ?>
        </div>
    <?php } else if ($mensaje == 7) { ?>
        <div class="alerta bg-warning " style="width:100%;">
            <?php echo "NO se pudo ELIMINAR el servicio" ?>
        </div>
    <?php } else if ($mensaje == 8) { ?>
        <div class="alerta bg-warning " style="width:100%;">
            <?php echo "Sesión Expirada, Vuelva a iniciar Sesión" ?>
        </div>
    <?php } else if ($mensaje == 9) { ?>
        <div class="alerta bg-warning " style="width:100%;">
            <?php echo $cifrado ?>
        </div>
    <?php } ?>

    <?php
    foreach ($alertas as $key => $mensajes) {
        foreach ($mensajes as $mensaje) {
    ?>
            <div class="row justify-content-center">
                <div class="alertaservi <?php echo $key; ?> ">
                    <?php echo $mensaje; ?>
                </div>
            </div>
    <?php
        }
    }
    ?>
</div>