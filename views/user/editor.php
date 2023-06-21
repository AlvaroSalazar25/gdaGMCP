<nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div class="container-fluid">
            <div class="sidebar-heading border-bottom bg-light"><a href=""><img style="height:50px" class="imagenLogo" src="<?php echo $_ENV['URL_BASE']; ?>/public/build/img/logo_gad_municipal_pastaza2.png" alt="Imagen GMCP"></a></div>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
                        <li class="nav-item dropdown" style="margin-right:10px">
                            <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div class="d-flex flex-row">
                                    <div class="d-flex flex-column" style="margin-right: 10px;">
                                        <strong style="text-transform:uppercase"><?php echo $_SESSION['nombre'] ?></strong>
                                        <span class="text-end"><?php echo $_SESSION['rol'] ?></span>
                                    </div>
                                    <i class="fa-solid fa-user" style="font-size:25px"></i>
                                </div>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#!">Action</a>
                                <a class="dropdown-item" href="#!">Another action</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="<?php echo $_ENV['URL_BASE'] ?>/logout">Cerrar Sesión</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    <div class="dibujar my-4" id="dibujar-botones">

    </div>
    <div class="dibujar" id="dibujar-js">

    </div>
    <div class="dibujar mt-4" id="dibujar-tabla">

    </div>


<?php include __DIR__ . "/../templates/alertasUser.php" ?>
<div id="modales">

</div>

<?php

$script = '
<script src="build/js/user/editor.js"></script>
' ?>
