<section class="mt-3">
    <div id="contenedor-titulo">

    </div>
    <div class="dibujar" id="dibujar-js">
    </div>
    <div class="dibujar  mt-4 mb-5" id="dibujar-tabla">

    </div>
</section>

<div id="modales">

</div>
<?php include __DIR__ . "/../templates/alertasUser.php" ?>

<?php
$script = '
<script src="' . $_ENV['URL_BASE'] . '/build/js/user/permisosCarpeta.js"></script>
' ?>
<?php
//Assign all Page Specific variables
$contenido = ob_get_contents();
ob_end_clean();
include __DIR__ . "/plantilla.php";
?>