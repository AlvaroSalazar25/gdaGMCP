
  window.addEventListener('DOMContentLoaded', event => {
      // Toggle the side navigation
      const sidebarToggle = document.body.querySelector('#sidebarToggle');
      if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});
document.addEventListener('click', e => {
    let botones = document.querySelectorAll('.opciones')
    botones.forEach(boton =>{
        boton.classList.remove('activar')
    })
    if(e.target.classList.contains('opciones')){
        const activo = e.target;
        activo.classList.add('activar')
        console.log(e.target);
    }
})
