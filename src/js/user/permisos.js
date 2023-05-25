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
    const contenedor = document.getElementById('dibujar-tabla');
    contenedor.classList.add('contenedor-carpetas-permiso','p-5','mt-4')
    const arbol = dibujarArbolCarpetas(carpetas, contenedor);
    contenedor.append(arbol);
    $(".moverC").hover(function(){
        $(this).css("border-bottom", "2px solid #98c1fe");
        }, function(){
            $(this).css("border-bottom", "");

      });
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
            if (response.length == 0) {
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

function dibujarArbolCarpetas(carpeta, contenedor) {
    let nombre = carpeta.nombre[0].toUpperCase() + carpeta.nombre.substring(1)
    const ul = document.createElement('ul');
    ul.style="list-style-type:none;"
    const li = document.createElement('li');
    li.id = 'li' + carpeta.id
    if (carpeta.hijos.length == 0) {
        li.innerHTML = `
        <div class="d-flex align-items-center mt-1 mb-2" style="font-size:15px">
        <div id="carpeta${carpeta.id}">
        <a class="moverC" style="text-decoration:none" href="${URL_BASE}/permisos/carpeta?id=${carpeta.id}">
        <i class="fa-solid fa-folder-open fa-lg" style="margin-right:7px;color:${carpeta.color}"></i>
        <span style="color:#212529"><strong>${nombre}</strong></span>
        </a>
        </div>
        </div>
      `;
    } else {
        let botonChevron
        if (carpeta.id == 0) {
            botonChevron = '<i class="fa-solid fa-chevron-up  fa-lg"></i>'
        } else {
            botonChevron = '<i class="fa-solid fa-chevron-down  fa-lg"></i>'
        }
        li.innerHTML = `
        <div class="d-flex align-items-center mt-1 mb-2" style="font-size:15px">
        <div id="carpeta${carpeta.id}">
        <a class="moverC"  style="text-decoration:none" href="${URL_BASE}/permisos/carpeta?id=${carpeta.id}">
        <i class="fa-solid fa-folder-open fa-lg" style="margin-right:7px;color:${carpeta.color}"></i>
        <span style="color:#212529"><strong>${nombre}</strong></span>
        </a>
          <button class="btn btn-link" type="button" id="boton${carpeta.id}" data-bs-toggle="collapse" data-bs-target="#collapse-${carpeta.id}" style="margin-left:12px" >
          ${botonChevron}
          </button>
        </div>
        </div>
      `;
    }
    ul.appendChild(li);

    if (carpeta.hijos.length > 0) {
        const hijosContainer = document.createElement('div');
        hijosContainer.id = `collapse-${carpeta.id}`;
        if (carpeta.id == 0) {
            hijosContainer.classList.add('show');
        } else {
            hijosContainer.classList.add('collapse');
        }

        const hijosUl = document.createElement('ul');
        hijosUl.classList.add('list-group', 'ms-3', 'mb-3');

        carpeta.hijos.forEach(hijo => {
            const hijoLi = dibujarArbolCarpetas(hijo);
            hijosUl.appendChild(hijoLi);
        });

        hijosContainer.appendChild(hijosUl);
        li.appendChild(hijosContainer);
        // Agregar el controlador de eventos para cambiar el ícono del botón
        const boton = li.querySelector('#boton' + carpeta.id);
        const divSelected = li.querySelector('#carpeta' + carpeta.id);

        boton.addEventListener('click', () => {
            if (boton.childNodes[1].classList.contains('fa-chevron-down')) {
                divSelected.classList.add('contenedor-carpetas-permiso','px-3')
                let newChild = document.createElement('i')
                newChild.classList.add('fa-solid', 'fa-chevron-up', 'fa-xl');
                boton.replaceChild(newChild,boton.childNodes[1]);
            } else if (boton.childNodes[1].classList.contains('fa-chevron-up')) {
                divSelected.classList.remove('contenedor-carpetas-permiso','px-3')

                let newChild = document.createElement('i')
                newChild.classList.add('fa-solid', 'fa-chevron-down', 'fa-xl');
                boton.replaceChild(newChild,boton.childNodes[1]);
                }
        });

    }
    return ul;
}



function generarCarpetas(id, secs) {
    let seccion = secs.find(sec => sec.id == id);
    if (seccion == undefined) {
        var carpeta = { 'nombre': 'BASE', 'id': '0','color': '#212529', 'hijos': [] };
    } else {
        var carpeta = { 'nombre': seccion.seccion, 'id': seccion.id,'color': seccion.color, 'hijos': [] }
    }
    let carpetas = secs.filter(sec => sec.idPadre == id);
    carpetas.forEach(folder => {
        let hijo = generarCarpetas(folder.id, secs)
        carpeta.hijos.push(hijo);

    })
    return carpeta
}

