<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GDA GMCP</title>
    <link rel="stylesheet" href="<?php echo $_ENV['URL_BASE']; ?>/build/css/app.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;700;900&display=swap" rel="stylesheet">
    <link href="<?php echo $_ENV['URL_BASE']; ?>/public/build/css/base/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    <link rel="preconnect" href="<?php echo $_ENV['URL_BASE']; ?>/public/build/css/base/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
    <link rel="stylesheet" href="<?php echo $_ENV['URL_BASE']; ?>/build/css/base/jquery.dataTables.min.css">

</head>

<body class="sb-sidenav-toggled">

    <?php echo $contenido; ?>

    <?php echo $script ?? ''; ?>
<script src="<?php echo $_ENV['URL_BASE']; ?>/public/build/js/varios/jquery.dataTables.min.js" crossorigin="anonymous"></script>
    <script src="<?php echo $_ENV['URL_BASE']; ?>/public/build/js/varios/sweetalert2@11.js"></script>
    <script src="<?php echo $_ENV['URL_BASE']; ?>/public/build/js/varios/popper.min.js" crossorigin="anonymous"></script>
    <script src="<?php echo $_ENV['URL_BASE']; ?>/public/build/js/varios/bootstrap.min.js" crossorigin="anonymous"></script>
    <!-- <script  src="<?php echo $_ENV['URL_BASE']; ?>/public/build/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script> -->
    <script async src="<?php echo $_ENV['URL_BASE']; ?>/public/build/js/varios/all.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="<?php echo $_ENV['URL_BASE']; ?>/public/build/js/app.js" crossorigin="anonymous"></script>
</body>

</html>