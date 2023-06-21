const URL_BASE = 'http://localhost/gdagmcp';
const token = JSON.parse(localStorage.getItem('token'))
const CARPETA_BASE = '/base';

document.addEventListener('DOMContentLoaded', iniciarApp())

async function iniciarApp() {
    //Creamos la instancia
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    //Accedemos a los valores
    var id = urlParams.get('id');
    dibujarCarpeta(id)
}

function alertas() {
    const alertas = document.querySelectorAll('.alert')
    const contenedorAlertas = document.getElementById('alertas')
    const alertaTipo = document.querySelector('#alertaTipo')
    if (alertas) {
        setTimeout(() => {
            alertas.forEach(function (alerta) {
                alerta.remove();
                if (contenedorAlertas) {
                    contenedorAlertas.innerHTML = "";
                }
                if (alertaTipo) {
                    alertaTipo.innerHTML = "";
                }
            })
        }, 3000);
    }
}