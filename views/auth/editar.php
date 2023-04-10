<section class="gradient-form row justify-content-center align-items-center" style="background-color: rgba(28,28,28,.5);min-height:750px">
  <div class="container py-5"  >
    <div class="row d-flex justify-content-center align-items-center h-100" >
      <div class="col-sm-10 col-lg-8  margen" >
        <div class="card rounded-3 text-black" style="--bs-card-border-width: 0px;border-radius:8px">
          <div class="row g-0 justify-content-center">
            <div class="col-lg-6">
              <div class="card-body p-md-5 mx-md-4">

                <div class="text-center mt-3">
                  <img loading="lazy" src="./adminImagenes/<?php echo $imagenes->imagenLogo ?> " style="width: 185px;" alt="logo">
                  <h4 class="mt-3 mb-5 pb-1">Editar Administración</h4>
                </div>

                <form class="my-3" method="POST" action="<?php echo $_ENV['URL_BASE'];?>/edit" enctype="multipart/form-data">
                  <p style="font-size:12px">Edite las imágenes de la administración </p>
                  <div id="padre">
                  <?php
                  include_once __DIR__ . "/../templates/alertas.php"
                  ?>
                  </div>
                  <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example22"><strong>Imagen Logo:</strong></label>
                    <input type="hidden" id="imagenLogo" name="imagenLogoAnt" value="<?php echo $imagenes->imagenLogo ?>" />
                    <input type="file" id="imagenLogo" name="imagenLogo" class="form-control"/>
                  </div> 
                  <!-- <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example22">Imagen Actual:</label>
                    <a class="btn btn-warning" href="">Ver Imagen</a>
                    <img loading="lazy" class="imagen" src="../imagenes/426e2987da94511b73dbcf31b14a6ed8.jpg" alt="Imagen Servicio">
                  </div> -->
                  <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example22"><strong>Imagen Página:</strong></label>
                    <input type="hidden" id="imagenLogo" name="imagenPagAnt" value="<?php echo $imagenes->imagenPagina ?>" />
                    <input type="file" id="imagenPagina" name="imagenPagina" class="form-control"/>
                  </div> 

                  <div class="text-center pt-1 mb-5 pb-1" style="font-size:11px">
                    <input type="submit" value="Guardar" class="btn btn-primary fa-lg gradient-custom-2 py-4 px-5">
                  </div>

                  <div class="d-flex pb-4">
                    <a href="<?php echo $_ENV['URL_BASE'];?>/admin" class="btn btn-outline-danger">Regresar</a>
                  </div>

                </form>

              </div>
            </div>
            <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
              <img class="w-100 h-100" src="./adminImagenes/<?php echo $imagenes->imagenPagina ?>" style="border-radius:0 5px 5px 0" alt="Imagen Página">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>