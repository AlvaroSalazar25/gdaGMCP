const URL_BASE = 'http://localhost/gdagmcp';
const token = JSON.parse(localStorage.getItem('token'))
let unidades;
let secciones;
let roles;

document.addEventListener('DOMContentLoaded', iniciarApp())

async function iniciarApp() {
    console.log('hola');
    let secs = await traerSecciones();
    let carpetas = generarCarpetas(0, secs)
    let dibujos = dibujarArbolCarpetas(carpetas)
    document.getElementById('dibujar-tabla').appendChild(dibujos);
}

// funcion que carga las secciones 
function traerSecciones() {
    return new Promise((resolve, reject) => {
        let secciones = []
        $.ajax({
            data: {
                "tipo": 'seccion'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/carpeta/datos',
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
                resolve(secciones)
            }
            $.each(response, (index, seccion) => {
                secciones.push(seccion);
                if (response.length == index + 1) {
                    resolve(secciones)
                }
            })
        }).fail((err) => {
            reject(err);
        });
    })
}

let permisosDefault = [
    {
        "id": 1,
        "nombre": "Ver_Carpeta",
        "type": 'carpeta',
        "descripcion": "Permiso para visualizar la carpeta",
        "status": false
    },
    {
        "id": 2,
        "nombre": "Crear_Carpeta",
        "type": 'carpeta',
        "descripcion": "Permiso para crear carpetas",
        "status": false
    },
    {
        "id": 3,
        "nombre": "Editar_Carpeta",
        "type": 'carpeta',
        "descripcion": "Permiso para Editar,Mover,Eliminar la carpeta",
        "status": false
    },
    {
        "id": 4,
        "nombre": "Ver_Documento",
        "type": 'documento',
        "descripcion": "Permiso para visualizar el documento",
        "status": false
    },
    {
        "id": 5,
        "nombre": "Crear_Documento",
        "type": 'documento',
        "descripcion": "Permiso para Crear un documento",
        "status": false
    },
    {
        "id": 6,
        "nombre": "Editar_Documento",
        "type": 'documento',
        "descripcion": "Permiso para Editar la metadata del documento",
        "status": false
    },
    {
        "id": 7,
        "nombre": "Mover_Documentos",
        "type": 'documento',
        "descripcion": "Permiso para mover de carpeta los documentos",
        "status": false
    },
    {
        "id": 8,
        "nombre": "Eliminar_Documento",
        "type": 'documento',
        "descripcion": "Permiso para Eliminar el documento",
        "status": false
    },
]

function dibujarArbolCarpetas(carpeta) {
    // console.log('carpeta datos', carpeta);
    const ul = document.createElement('ul');
    ul.style = "font-size:15px"
    const li = document.createElement('li');
    const contenedorLiChecks = document.createElement('div');
    contenedorLiChecks.classList.add('w-100', 'd-flex', 'justify-content-between')
    const textoLi = document.createElement('p');
    textoLi.textContent = carpeta.nombre
    if (carpeta.id == 0) {
        contenedorLiChecks.classList.add('bg-black')
        textoLi.style = "color:white;font-weight:bold"
    }
    if (carpeta.hijos.length > 0) {
        contenedorLiChecks.style = "border-bottom:1px dashed #707071;background-color:#DEE2E6"
    } else {
        contenedorLiChecks.style = "border-bottom:1px dashed #707071 !important"
    }
    li.appendChild(contenedorLiChecks);

    contenedorLiChecks.appendChild(textoLi);
    const contenedorChecks = document.createElement('div');
    contenedorChecks.classList.add('d-flex')
    var typePermisoCarpeta = document.createElement('div');
    typePermisoCarpeta.style = "padding: 0px 3px;border-right:1px solid;border-left:1px solid;margin-right:5px"
    var typePermisoFolder = document.createElement('div');
    typePermisoFolder.style = "padding: 2px 3px;border-right:1px solid"
    permisosDefault.forEach(permiso => {
        const check = document.createElement('input');
        check.classList.add('form-check-input', `${permiso.nombre}`, `${carpeta.id}`)
        check.style = "margin:5px;border:1px solid #1a1b15"
        check.type = 'checkbox'
        check.id = carpeta.id + "p" + permiso.id;
        if (permiso.type == 'carpeta') {
            typePermisoCarpeta.appendChild(check)
        } else {
            typePermisoFolder.appendChild(check)
        }
    })
    contenedorChecks.appendChild(typePermisoCarpeta);
    contenedorChecks.appendChild(typePermisoFolder);
    contenedorLiChecks.appendChild(contenedorChecks);
    ul.appendChild(li);

    if (carpeta.hijos.length > 0) {
        carpeta.hijos.forEach(hijo => {
            const hijoUl = dibujarArbolCarpetas(hijo);
            li.appendChild(hijoUl);
        });
    }
    return ul;
}


function generarCarpetas(id, secs) {
    let seccion = secs.find(sec => sec.id == id);
    if (seccion == undefined) {
        var carpeta = { 'nombre': 'MARQUE PARA SELECCIONAR TODOS', 'id': '0', 'hijos': [] };
    } else {
        var carpeta = { 'nombre': seccion.seccion, 'id': seccion.id, 'hijos': [] }
    }
    let carpetas = secs.filter(sec => sec.idPadre == id);
    carpetas.forEach(folder => {
        let hijo = generarCarpetas(folder.id, secs)
        carpeta.hijos.push(hijo);

    })
    return carpeta
}

