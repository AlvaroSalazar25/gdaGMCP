<section class="mt-3">
    <div class="dibujar" id="dibujar-js">


<div class="d-flex justify-content-center padreAtras">
    <div class="d-flex justify-content-center hijoAtras">
        <a class=" btn btn-outline-danger" onclick=""><i class="fa-solid fa-arrow-left-long fa-2x"></i> <span class="span-boton">Atrás</span></a>
    </div>
<h1 class="text-black mb-3"><strong>Administrar Carpetas</strong></h1>
<div class="d-flex flex-column justify-content-center">
<div class="d-flex justify-content-center">
<h1 class="text-black mb-3"><i class="fa-solid fa-folder-open fa-xl" style="margin-right:7px;"></i><strong>nombre de la carpeta</strong></h1>
<button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" style="margin-left:5px;margin-top:4px;width:25px;height:30px;border-radius:15px">
<i class="fa-solid fa-ellipsis-vertical fa-xl "></i>
</button>
<ul class="dropdown-menu dropdown-menu-dark">
 <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalEditar' + seccionActual.id + '"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>
<li class="puntero"><a class="dropdown-item" onclick="deleteSeccion(' + seccionActual.id + ')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>
</ul>
</div>
    <h3 class="text-black mt-3 mb-4">descripcion</h3>
    <h3 class="text-black mt-3 mb-4">descripcion</h3>
</div>    
    <!--============================================================================================================//
                                                Botones Buscar y Crear Hijos
    //==============================================================================================================-->
</div> 
<div class="d-flex justify-content-end mt-2">
    <div style="margin-right:5px" id="divBtnBuscar">
<a class="btn btn-outline-primary" onclick=""><i class="fa-solid fa-magnifying-glass fa-2x"></i><span class="span-boton">Carpeta</span></a>
</div>
<div>
    <a class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal' + padre + '" id="' + padre + '"><i class="fa-solid fa-plus fa-2x"></i><span class="span-boton">Carpeta</span></a>
</div>
</div>
<div class="w-100 mt-2">
    <a class="puntero" style="text-decoration: none !important;" onclick=""><strong>path</strong></a>
</div>

    <!--=============================================================================================================//
                                                Contenedor hijos
    //============================================================================================================== -->
    <div class="contenedor-carpetas mt-3 mb-5" id="contenedorCarpetas" >



    </div>
    <!--=============================================================================================================//
                                                modal para CREAR nuevos hijos
    //============================================================================================================== -->
<div class="modal fade" id="exampleModal' + padre + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'<div class="modal-dialog">
    <div class="modal-content">  
    <div class="modal-header bg-black">
   <h5 class="modal-title text-white">Crear Carpeta</h5>
   <h5 class="modal-title text-white">Agregar Carpeta en</h5>
    <button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>
  </div>
   <div class="modal-body">'<h3 class="text-black mt-2 mb-4">Ingresar datos de la Carpeta</h3>
<div class="mb-3">
    <label  class="form-label"><strong>Nombre:</strong></label>
    <input type="text" class="form-control" id="seccion" name="seccion" placeholder="Ingrese nombre">
</div>
<div class="mb-2">
    <label  class="form-label"><strong>Descripción:</strong></label>
    <textarea class="form-control" rows="5" id="descripcion" placeholder="Ingrese descripción"></textarea>
</div>
<div class="mb-3">
    <label  class="form-label"><strong>Color:</strong></label>
    <input type="color" class="form-control w-25" id="color" name="color">
</div>
<div class="w-100 mt-2" id="alertas">

</div>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
<a class="btn btn-success" id="botonCrear" onclick="createSeccion(0)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>
<a class="btn btn-success" id="botonCrear" onclick="createSeccion(' + padre + ')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>
</div>
</div>
</div>
</div>

    <!-- =============================================================================================================//
                                                Modal para EDITAR el padre
    //============================================================================================================== -->
<div class="modal fade" id="exampleModalEditar' + seccionActual.id + '" tabindex="-1" aria-labelledby="exampleModalLabel' + seccionActual.id + '" aria-hidden="true">
<div class="modal-dialog">
<div class="modal-content">
  <div class="modal-header bg-black">
   <h5 class="modal-title text-white">Editar</h5>
<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>
  </div>
  <div class="modal-body" style="min-height:350px">
<h3 class="text-black mt-2 mb-4">Edite <strong>Nombre</strong></h3>

<div class="mb-4 d-flex justify-content-between">

<div class="d-flex flex-column" style="width:70%">
<label  class="form-label"><strong>Nombre:</strong></label>
<input type="text" class="form-control" id="seccion' + seccionActual.id + '" value="' + seccionActual.seccion + '">
</div>
<div class="d-flex flex-column" style="width:28%">
<label class="form-label"><strong>Color:</strong></label>
<input type="color" class="form-control  puntero" id="color' + seccionActual.id + '" value="' + seccionActual.color + '">
</div>

</div>

<div class="mb-4">
<label for="exampleFormControlInput1" class="form-label"><strong>Descripción:</strong></label>
    <textarea class="form-control" rows="6" id="descripcion' + seccionActual.id + '" placeholder="Esta Sección no tiene descripción"></textarea>
    <textarea class="form-control" rows="6" id="descripcion' + seccionActual.id + '" >' + seccionActual.descripcion + '</textarea>
</div>
<div class="mb-4">
<div class="w-100">
<label class="form-label"><strong>Mover Carpeta:</strong></label>
</div>

<div style="height:30px">
<select style="width:100%;height:100% !important" id="select' + seccionActual.id + '" class="js-example-basic-single" >
        <optgroup label="' + seccion.seccion + '">
        <option value=""><strong><i class="fa-solid fa-folder-open"></i></strong>path</option>
        </optgroup>
</select>
</div> 

<div class="w-100 mt-4" id="alertas' + seccionActual.id + '">
</div>

</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
<a class="btn btn-success" id="botonCrear" onclick="updateSeccion(' + padre + ',' + seccionActual.id + ',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>
</div>
</div>
</div>
</div>


</div>
</section>

<?php
$script = '
<script src="build/js/user/secciones.js"></script>
' ?>
<?php
//Assign all Page Specific variables
$contenido = ob_get_contents();
ob_end_clean();
include __DIR__ . "/plantilla.php";
?>