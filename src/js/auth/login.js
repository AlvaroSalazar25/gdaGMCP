//import {environment as ENV} from '/app.js';
const URL_BASE = 'http://localhost/gdagmcp';
const user = {
    email: '',
    password: '',
}
document.addEventListener('DOMContentLoaded', inicarApp());

function inicarApp() {
    alertas();

}

function alertas() {
    const alertas = document.querySelectorAll('.alerta')
    const padre = document.querySelector('#padre')
    const alertaTipo = document.querySelector('#alertaTipo')
    if (alertas) {
        setTimeout(() => {
            alertas.forEach(function (alerta) {
                alerta.remove();
                if (padre) {
                    padre.innerHTML = "";
                }
                if (alertaTipo) {
                    alertaTipo.innerHTML = "";
                }
            })
        },3000);
    }
}

async function iniciarSesion() {
    let {
        email,
        password,
    } = user

    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
   
    const datos = new FormData()
    datos.append('email', email)
    datos.append('password', password)

    console.log([...datos]);
    let url = URL_BASE + '/';

    const request = await fetch(url, {
        method: 'POST',
        body: datos
    });
    //  respuesta de la peticion de arriba, me arroja true o false 
    const response = await request.json();
    var html = ""
    console.log(response)
    if (response.exito) {
        html += '<button class="btn w-100 d-flex justify-content-center align-items-center" style="height:58px;background-color:#3a6632" type="button" disabled>'
        html +=' <span class="spinner-border spinner-border-sm" style="width: 3rem; height: 3rem;color:white" role="status" aria-hidden="true"></span>'
        html +='<span style="margin-left:15px;font-size:20px;color:white">Cargando...</span>'
        html +='</button>'
        document.getElementById('contenedorBtnLogin').innerHTML = html;
        setTimeout(() => {
        localStorage.setItem('token', JSON.stringify(response.token));
        window.location.href = URL_BASE + response.exito;
        }, 500);
    
    } else if (response.error) {
        html += '<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >'
        html += '<li class="text-danger"  >'
        html += response.error
        html += '</li>'
        html += '</ul>'
        document.getElementById('alertas').innerHTML = html;

    } else{
        html += '<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >'
        response.alertas.error.forEach(alerta => {
            html += '<li class="text-danger"  >'
            html += alerta
            html += '</li>'
        })
        html += '</ul>'
        document.getElementById('alertas').innerHTML = html;
    }
    alertas();

}

