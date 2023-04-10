<div class="container-fluid">
  <div class="row">
    <div class="col-sm-6 login-section-wrapper" style="padding:68px 100px !important">
      <div class="brand-wrapper">
        <img src="<?php echo $_ENV['URL_BASE']; ?>/public/build/img/logo_gad_municipal_pastaza2.png" alt="logo" class="logo">
      </div>
      <div class="login-wrapper my-auto">
        <h1 class="login-title mb-5" style="text-align:left;font-size:25px">Recuperar Contraseña</h1>
        <form method="POST">
          <div id="padre">
            <?php
            include_once __DIR__ . "/../templates/alertas.php"
            ?>
          </div>
          <div class="form-group mb-5">
            <label for="email">Email:</label>
            <input type="email" name="email" id="email" class="form-control" placeholder="email@example.com">
          </div>
          <input type="submit" id="login" class="btn btn-block login-btn" value="Enviar Instrucciones">
        </form>
        <a href="<?php echo $_ENV['URL_BASE']; ?>/login" class="forgot-password-link">¿Tienes Cuenta?, Inicia Sesión</a>
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