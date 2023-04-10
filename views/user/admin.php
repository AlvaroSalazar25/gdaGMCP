

<h1 class="text-black"><strong>Administrar Usuarios</strong></h1>
<section>
    <div class="contenedor-acciones bg-light">
        <div class="barra-acciones">
        <div class=" contenedor-boton">
                <a class="cboton btn btn-warning w-100" onclick="verUsuarios()"><i class="fa-solid fa-users fa-2x"></i> <span class="span-boton">Ver usuarios</span></a>
            </div>
            <div class="contenedor-boton">
                <a class="cboton btn btn-success w-100" id="crear" onclick="crearUsuario()"><i class="fa-solid fa-user-plus fa-2x"></i> <span class="span-boton">Crear usuarios</span></a>
            </div>
            <div class=" contenedor-boton">
                <a class="cboton btn btn-primary w-100" onclick="buscarUsuario()"><i class="fa-solid fa-magnifying-glass fa-2x"></i> <span class="span-boton">Buscar usuarios</span></a>
            </div>
        </div>
    </div>
</section>
<?php include __DIR__ . "/../templates/alertasUser.php" ?> 

<section class="mt-3">
    <div class="dibujar" id="dibujar-js">
        
        </div>
    </section>

   <div id="modales">

   </div> 
   
<?php 

$script = '
<script src="build/js/user/admin.js"></script>
' ?> 
<?php
//Assign all Page Specific variables
$contenido = ob_get_contents();
ob_end_clean();
include __DIR__ . "/plantilla.php";
?>