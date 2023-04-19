const URL_BASE = 'http://localhost/gdagmcp';
const token = JSON.parse(localStorage.getItem('token'))
let errores;

document.addEventListener('DOMContentLoaded', iniciarApp())

async function iniciarApp() {
    errores = await traerErrores()
    console.log(errores);
    dibujarErrores()
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

function traerErrores(){
    return new Promise((resolve, reject) => {
        let errores = []
        $.ajax({
            data: {
                "tipo": 'errores'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/errores/datos',
            type: 'POST',
            headers: {
                'token': token
            },
            dataType: 'json'
        }).done((response) => {
            if (response.exit) {
                Swal.fire({
                    icon: 'warning',
                    title: response.exit,
                    showConfirmButton: false,
                    text: 'Sesión expirada, vuelva a iniciar sesión',
                    timer: 3000
                }).then(() => {
                    window.location.href = URL_BASE + "/?r=8";
                })
            }
            if(response.length == 0){
                resolve(errores)
            }
            $.each(response, (index, error) => {
                errores.push(error);
                if (response.length == index + 1) {
                    resolve(errores)
                }
            })
        }).fail((err) => {
            reject(err);
        });
    })
}

async function  dibujarErrores(){
    var html = ""
    let erroresActualizados = await traerErrores();
    html += '<h1 class="text-black mb-4"><strong>Administrar Errores</strong></h1>'
    html += '<table class="table" style="min-width:900px" id="tablaError">'
    html += '<thead class="table-dark">'
    html += '<tr class="" style="text-transform:uppercase">'
    html += '<th>N°</th>'
    html += '<th class="">Tabla Error</th>'
    html += '<th class="">Controlador Error</th>'
    html += '<th class="">Función Error</th>'
    html += '<th class="">Error</th>'
    html += '<th class="">Fecha Error</th>'
    html += '<th class="">Status</th>'
    html += '</tr>'
    html += '</thead>'
    html += '<tbody class="contenido" id="contenido">'
    erroresActualizados.forEach((error, index) => {
        console.log('error', error);
        html += '<tr>'
        html += '<td>' + (parseInt(index) + 1) + '</td>'
        html += '<td>' + error.tabla_error + '</td>'
        html += '<td>' + error.controller_error + '</td>'
        html += '<td>' + error.function_error + '</td>'
        html += '<td>' + error.error + '</td>'
        html += '<td>' + error.created_at.split(" ")[0] + '</td>'
        html += '<td> Status</td>'
        html += '</tr>'

    })
    html += '</tbody>'
    html += '</table>'

    document.getElementById('dibujar-js').innerHTML = html;
    $('#tablaError').DataTable();
}