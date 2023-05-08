
<?php include __DIR__ . "/../templates/alertasUser.php" ?>

<section class="mt-3">
    <div class="dibujar" id="dibujar-js">
        </div>
        <div class="dibujar  mt-4 mb-5" id="dibujar-tabla">
        </div>
    </section>

   <div id="modales">

   </div>

<?php
$script = '
<script src="build/js/user/secciones.js"    ></script>
' ?>
<?php
//Assign all Page Specific variables
$contenido = ob_get_contents();
ob_end_clean();
include __DIR__ . "/plantilla.php";
?>