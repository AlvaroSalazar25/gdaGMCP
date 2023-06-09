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

function traerErrores() {
    return new Promise((resolve, reject) => {
        let errores = []
        $.ajax({
            data: {
                "tipo": 'errores'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/error/datos',
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
            if (response.length == 0) {
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

async function dibujarErrores() {
    var html = ""
    let erroresActualizados = await traerErrores();
    html += '<h1 class="text-black mb-4"><strong>Administrar Errores</strong></h1>'
    html += '<table class="table" style="min-width:900px" id="tablaError">'
    html += '<thead class="table-dark">'
    html += '<tr class="" style="text-transform:uppercase">'
    html += '<th>N°</th>'
    html += '<th class="">Table</th>'
    html += '<th class="">Controller</th>'
    html += '<th class="">Function</th>'
    html += '<th class="">Data</th>'
    html += '<th class="">Error</th>'
    html += '<th class="">Fecha</th>'
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
        html += '<td>' + error.function_error + '()</td>'
        html += '<td><buttom class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalError' + error.id + '"><i class="fa-solid fa-eye fa-xl"></></buttom></td>'
        html += '<td class="col-4">' + error.error + '</td>'
        html += '<td>' + error.created_at.split(" ")[0] + '</td>'
        html += '<td> Status</td>'
        html += '</tr>'
        
        //----------------------------------------------   Modal --------------------------------------->
        html += '<div class="modal fade" id="exampleModalError' + error.id + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'
        html += ' <div class="modal-dialog">'
        html += ' <div class="modal-content">'
        html += ' <div class="modal-header bg-black">'
        html += ' <h4 class="modal-title text-white" id="exampleModalLabel">Datos ingresados</h4>'
        html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
        html += ' </div>'
        html += ' <div class="modal-body">'
        // let data = JSON.parse(error.data)
        // let datosForm = JSON.parse(data.data);
        // if(data.user){
        //     html += ' <div class="d-flex w-100">'
        //     html += ' <p style="font-size:14px"><strong>Usuario: </strong>'+' '+ data.user +'</p>'
        //     html += ' </div>'
        // }
        
        // datosForm.forEach((datos,index)=>{
        //     html += ' <div class=" w-100 text-justify">'
        //     html += ' <p class="text-justify" style="font-size:14px"><strong>'+ (datos.nombre[0].toUpperCase() + datos.nombre.substring(1)) +': </strong></p>'
        //     html += ' <p style="font-size:14px;text-align:justify">'+ datos.valor +'</p>'
        //     html += ' </div>'
        // });
        html += ' </div>'
        html += '<div class="modal-footer">'
        html += ' <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>'
        html += '</div>'
        html += '</div>'
        html += ' </div>'
        html += '</div>'
    })
    html += '</tbody>'
    html += '</table>'

    document.getElementById('dibujar-js').innerHTML = html;
    $('#tablaError').DataTable();
}