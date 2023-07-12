const URL_BASE = 'http://localhost/gdagmcp';
const token = JSON.parse(localStorage.getItem('token'))
const CARPETA_BASE = '/base';

let secciones;
let roles;

document.addEventListener('DOMContentLoaded', iniciarApp())

async function iniciarApp() {
    await dibujarTitulo();
    await waitResponse('#contenedor-carpetas')
    let secs = await traerSecciones();
    let carpetas = generarCarpetas(0, secs)
    const contenedor = document.getElementById('contenedor-carpetas');
    const arbol = dibujarArbolCarpetas(carpetas);
    contenedor.append(arbol);
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

async function dibujarTitulo() {
    var html = ""
    html += '<h1 class="text-black"><strong>Administrar Permisos</strong></h1>'
    html += ' <h3 class="text-black mt-3 mb-4">Seleccione una carpeta para elegir los permisos</h3>'
    document.getElementById('contenedor-titulo').innerHTML = html;
    const divCarpetas = document.createElement('div')
    divCarpetas.id = 'contenedor-carpetas'
    divCarpetas.classList.add('contenedor-carpetas', 'mt-4', 'py-5', 'px-3')
    const contenedor = document.getElementById('dibujar-js');
    contenedor.appendChild(divCarpetas)

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
            document.getElementById('contenedor-carpetas').innerHTML = "";

        }).fail((err) => {
            reject(err);
        });
    })
}

function dibujarArbolCarpetas(carpeta) {
    let nombre = carpeta.nombre[0].toUpperCase() + carpeta.nombre.substring(1);
    const ul = document.createElement('ul');
    ul.style = "list-style-type:none;";
    
    if (carpeta.id != '0') {
      const li = document.createElement('li');
      li.id = 'li' + carpeta.id;
  
      if (carpeta.hijos.length == 0) {
        li.innerHTML = `
          <div class="d-flex align-items-center mt-1 mb-2" style="font-size:15px">
            <div id="carpeta${carpeta.id}" class="${carpeta.id == '0' ? 'contenedor-carpetas-permiso px-3' : ''}">
              <a class="moverC" style="text-decoration:none ;cursor:pointer" href="${URL_BASE}/permisos/carpeta?id=${carpeta.id}">
                <i class="fa-solid fa-folder-open fa-lg" style="margin-right:7px;color:${carpeta.color}"></i>
                <span style="color:#212529"><strong>${nombre}</strong></span>
              </a>
            </div>
          </div>
        `;
      } else {
        let botonChevron = '<i class="fa-solid fa-chevron-down fa-lg"></i>';
        li.innerHTML = `
          <div class="d-flex align-items-center mt-1 mb-2" style="font-size:15px">
            <div id="carpeta${carpeta.id}" class="${carpeta.id == '0' ? 'contenedor-carpetas-permiso px-3' : ''}">
              <a class="moverC" style="text-decoration:none ;cursor:pointer" href="${URL_BASE}/permisos/carpeta?id=${carpeta.id}">
                <i class="fa-solid fa-folder-open fa-lg" style="margin-right:7px;color:${carpeta.color}"></i>
                <span style="color:#212529"><strong>${nombre}</strong></span>
              </a> 
              <button class="btn btn-link" type="button" id="boton${carpeta.id}" data-bs-toggle="collapse" data-bs-target="#collapse-${carpeta.id}" style="margin-left:12px">
                ${botonChevron}
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
  
        const boton = li.querySelector('#boton' + carpeta.id);
        const divSelected = li.querySelector('#carpeta' + carpeta.id);
  
        boton.addEventListener('click', () => {
          if (boton.childNodes[1].classList.contains('fa-chevron-down')) {
            divSelected.classList.add('contenedor-carpetas-permiso', 'px-3');
            let newChild = document.createElement('i');
            newChild.classList.add('fa-solid', 'fa-chevron-up', 'fa-xl');
            boton.replaceChild(newChild, boton.childNodes[1]);
          } else if (boton.childNodes[1].classList.contains('fa-chevron-up')) {
            divSelected.classList.remove('contenedor-carpetas-permiso', 'px-3');
            let newChild = document.createElement('i');
            newChild.classList.add('fa-solid', 'fa-chevron-down', 'fa-xl');
            boton.replaceChild(newChild, boton.childNodes[1]);
          }
        });
      }
    } else {
      // Si carpeta.id == 0, no se dibuja nada
      carpeta.hijos.forEach(hijo => {
        const hijoLi = dibujarArbolCarpetas(hijo);
        ul.appendChild(hijoLi);
      });
    }
  
    return ul;
  }
  
function generarCarpetas(id, secs) {
    let seccion = secs.find(sec => sec.id == id);
    if (seccion == undefined) {
        var carpeta = { 'nombre': 'BASE', 'id': '0', 'color': '#212529', 'hijos': [] };
    } else {
        var carpeta = { 'nombre': seccion.seccion, 'id': seccion.id, 'color': seccion.color, 'hijos': [] }
    }
    let carpetas = secs.filter(sec => sec.idPadre == id);
    carpetas.forEach(folder => {
        let hijo = generarCarpetas(folder.id, secs)
        carpeta.hijos.push(hijo);

    })
    return carpeta
}

async function waitResponse(contenedor, altura = '129.5px', tipo = 1) {
    var html = "";
    if (tipo == 1) {
        html += '<div class="d-flex justify-content-center align-items-center w-100" style="width:100% !important;height:' + altura + '" width:100% !important;height:50px" id="contenedorWait">'
        html += ' <div class="spinner-grow" role="status">'
        html += '<span class="visually-hidden">Loading...</span>'
        html += '</div>'
        html += ' <div class="spinner-grow" role="status">'
        html += '<span class="visually-hidden">Loading...</span>'
        html += '</div>'
        html += ' <div class="spinner-grow" role="status">'
        html += '<span class="visually-hidden">Loading...</span>'
        html += '</div>'
        html += '</div>'
    } else {
        contenedor.innerHTML = ""
        html += '<td colspan="8" valign="top">'
        html += '<div class="d-flex justify-content-center align-items-center w-100" style="width:100% !important;height:' + altura + '" id="contenedorWait">'
        html += ' <div class="spinner-grow" role="status">'
        html += '<span class="visually-hidden">Loading...</span>'
        html += '</div>'
        html += ' <div class="spinner-grow" role="status">'
        html += '<span class="visually-hidden">Loading...</span>'
        html += '</div>'
        html += ' <div class="spinner-grow" role="status">'
        html += '<span class="visually-hidden">Loading...</span>'
        html += '</div>'
        html += '</div>'
        html += '</td>'
    }
    document.querySelector(contenedor).innerHTML = html;
}



