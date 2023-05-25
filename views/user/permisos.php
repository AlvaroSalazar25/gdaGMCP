<h1 class="text-black"><strong>Administrar Permisos</strong></h1>
<h3 class="text-black mt-3 mb-4">Seleccione una carpeta para elegir los permisos</h3>
<section class="mt-3">
    <div class="dibujar" id="dibujar-js">

    </div>
    <div class="dibujar  mt-4 mb-5" id="dibujar-tabla">

    </div>
</section>

<?php include __DIR__ . "/../templates/alertasUser.php" ?>
<div id="modales">

</div>

<?php
$script = '
<script src="'.$_ENV['URL_BASE'].'/build/js/user/permisos.js"></script>
' ?>
<?php
//Assign all Page Specific variables
$contenido = ob_get_contents();
ob_end_clean();
include __DIR__ . "/plantilla.php";
?>