<div class="container-fluid">
  <div class="row">
    <div class="col-sm-6 login-section-wrapper" style="padding:68px 100px !important">
      <div class="brand-wrapper">
        <img src="<?php echo $_ENV['URL_BASE']; ?>/public/build/img/logo_gad_municipal_pastaza2.png" alt="logo" class="logo">
      </div>
      <div class="login-wrapper my-auto">
        <h1 class="login-title mb-5" style="text-align:left;">Inicia Sesión</h1>
        <form >
          <div id="alertas">
            <?php
            include_once __DIR__ . "/../templates/alertasUser.php";
            ?>
            <?php
            $alerta = $_GET['r'] ?? null;
            if ( $alerta && $alerta == 1) :
            ?>
              <div class="alerta exito ?> " style="width:100%">
                <?php echo 'Contraseña guardada correctamente'; ?>
              </div>
            <?php endif ?>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" name="email" id="email" class="form-control" placeholder="email@example.com">
          </div>
          <div class="form-group mb-4">
            <label for="password">Contraseña:</label>
            <input type="password" name="password" id="password" class="form-control" placeholder="Ingrese la contraseña">
          </div>
          <div class="form-group" id="contenedorBtnLogin">
          <buttom id="login" class="btn btn-block login-btn" onclick="iniciarSesion()">Iniciar Sesión</buttom>
          </div>

        </form>
        <a href="<?php echo $_ENV['URL_BASE']; ?>/olvide" class="forgot-password-link">Olvidé la contraseña?</a>
      </div>
    </div>
    <div class="col-sm-6 px-0 d-none d-sm-block">
      <img src="<?php echo $_ENV['URL_BASE']; ?>/public/build/img/login_imagen.jpg" alt="login image" class="login-img">
    </div>
  </div>
</div>

<?php
$script = '
    <script src="' . $_ENV['URL_BASE'] . '/build/js/auth/login.js"></script>
    ';
?>