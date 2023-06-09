
<div class="d-flex" id="wrapper">
    <!-- Sidebar-->
    <div class="border-end bg-white" id="sidebar-wrapper">
        <div class="sidebar-heading border-bottom bg-light"><a href=""><img class="imagenLogo" src="<?php echo $_ENV['URL_BASE']; ?>/public/build/img/logo_gad_municipal_pastaza2.png" alt="Imagen GMCP"></a></div>
        <div class="list-group list-group-flush" style="font-size:15px">
            <a class="list-group-item list-group-item-action list-group-item-light p-3 opciones" href="<?php echo $_ENV['URL_BASE']; ?>/admin"><i class="fa-solid fa-user" style="margin-right: 12px;"></i><span>Usuarios</span></a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3 opciones" href="<?php echo $_ENV['URL_BASE']; ?>/unidad"><i class="fa-regular fa-building" style="margin-right: 12px;"></i><span>Unidades</span></a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3 opciones" href="<?php echo $_ENV['URL_BASE']; ?>/permisos"><i class="fa-solid fa-check-to-slot" style="margin-right: 12px;"></i><span>Permisos</span></a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3 opciones" href="<?php echo $_ENV['URL_BASE']; ?>/formulario"><i class="fa-solid fa-list-ol" style="margin-right: 12px;"></i><span>Formularios</span></a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3 opciones" href="<?php echo $_ENV['URL_BASE']; ?>/carpeta"><i class="fa-regular fa-folder-open" style="margin-right: 12px;"></i><span>Carpetas</span></a>
            <a class="list-group-item list-group-item-action list-group-item-light p-3 opciones" href="<?php echo $_ENV['URL_BASE']; ?>/error"><i class="fa-solid fa-circle-exclamation" style="margin-right: 12px;"></i><span>Errores</span></a>

        </div>
    </div>
    <!-- Page content wrapper-->
    <div id="page-content-wrapper">
        <!-- Top navigation-->
        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div class="container-fluid">
                <button class="btn btn-primary" id="sidebarToggle"><i class="fa-solid fa-bars-staggered" style="font-size:13px"></i></button>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
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
        <!-- Page content-->
        <div class="container-fluid px-5 py-3">
            <?php echo $contenido; ?>
        </div>
    </div>
</div>