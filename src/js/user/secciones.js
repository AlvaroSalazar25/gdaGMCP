const URL_BASE = 'http://localhost/gdagmcp';
const token = JSON.parse(localStorage.getItem('token'))
let unidades;
let secciones;
let roles;
let permisosDefault = [{
    "id": "1",
    "nombre": "Leer",
    "status": "false"
}, {
    "id": "2",
    "nombre": "Escribir",
    "status": "false"
}]

document.addEventListener('DOMContentLoaded', iniciarApp())

async function iniciarApp() {
    secciones = await traerHijos(0);
    console.log('secciones', secciones);
    dibujarHijos(0, secciones)
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

function traerSecciones() {
    return new Promise((resolve, reject) => {
        let secciones = []
        $.ajax({
            data: {
                "tipo": 'seccion'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/seccion/datos',
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
// funcion se utiliza en secciones para cargar el formulario que esta utiliza
function traerFormularios() {
    return new Promise((resolve, reject) => {
        let formularios = []
        $.ajax({
            data: {
                "tipo": 'formularios'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/seccion/datos',
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
                resolve(formularios)
            }
            $.each(response, (index, formulario) => {
                formularios.push(formulario);
                if (response.length == index + 1) {
                    resolve(formularios)
                }
            })
        }).fail((err) => {
            reject(err);
        });
    })
}

function traerHijos(id = 0) {
    return new Promise((resolve, reject) => {
        let hijos = []
        $.ajax({
            data: {
                "id": id,
                "tipo": 'hijos'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/seccion/datos',
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
                resolve(hijos)
            }
            $.each(response, (index, hijo) => {
                hijos.push(hijo);
                if (response.length == index + 1) {
                    resolve(hijos)
                }
            })
        }).fail((err) => {
            reject(err);
        });
    })
}

async function dibujarSecciones() {
    var html = '';
    let seccionesActualizadas = await traerSecciones();
    html += '<h1 class="text-black mb-3"><strong>Administrar Secciones</strong></h1>'
    html += '<section>'
    html += '<div class="mb-3">'
    html += '<div class="d-flex justify-content-end">'
    html += '<a class=" btn btn-primary " onclick="agregarSeccion(0)"><i class="fa-solid fa-plus fa-2x"></i> <span class="span-boton">Agregar Sección</span></a>'
    html += '</div>'
    html += '</div>'
    html += '</section>'
    console.log(seccionesActualizadas);
    html += '<div class="mt-4 d-flex" style="flex-wrap:wrap">'
    seccionesActualizadas.forEach(seccion => {
        if (seccion.idPadre == 0) {
            html += '<div class="p-3 ">'
            html += '<a class="btn btn-outline-dark" style="border:1px solid" onclick="entrarSeccion(' + seccion.id + ')">'
            html += '<div class="row justify-content-center align-items-center hoverCarpeta widthCarpeta">'
            html += '<div>'
            html += '<i class="fa-regular fa-folder-open" style="font-size:40px"></i>'
            html += '<p class="botonCarpeta">' + seccion.seccion + '</p>'
            html += '</div>'
            html += '</div>'
            html += '</a>'
            html += '</div>'
        }
    })
    html += '</div>'
    document.getElementById('dibujar-js').innerHTML = html;
}

async function dibujarAtras(padre){
    let seccionesActualizadas = await traerSecciones();
    let seccionActual = seccionesActualizadas.find(sec => sec.id == padre);
    let seccionesAnterior = seccionesActualizadas.filter(sec => sec.idPadre == seccionActual.idPadre);
    dibujarHijos(seccionActual.idPadre, seccionesAnterior)
}

async function dibujarHijos(padre , hijos) {
    console.log('padre',padre);
    console.log('hijo',hijos);
    var html = "";
    let seccionesActualizadas = await traerSecciones();
    let formularios = await traerFormularios();
    let seccionActual = seccionesActualizadas.find(sec => sec.id == padre);
    console.log('seccionActual',seccionActual);
    if (seccionActual == undefined) {
        html += '<h1 class="text-black mb-3"><strong>Administrar Secciones</strong></h1>'
        html += '<div class="mt-5 mb-3 d-flex justify-content-between">'
        html += '<div class="d-flex justify-content-end">'
        html += '<a class=" btn btn-outline-danger noVisible" onclick="dibujarAtras('+padre+')"><i class="fa-solid fa-arrow-left-long fa-2x"></i> <span class="span-boton">Atrás</span></a>'
        html += '</div>'
    } else {
        html += '<div class="d-flex justify-content-center">'
        html += '<h1 class="text-black mb-3"><strong>Sección ' + seccionActual.seccion + '</strong></h1>'

        html += '<button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" style="margin-left:5px;width:30px;height:30px;border-radius:15px">'
        html += '<i class="fa-solid fa-ellipsis-vertical fa-xl "></i>'
        html += '</button>'

        html += '<ul class="dropdown-menu dropdown-menu-dark">'
        html += ' <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalEditar' + seccionActual.id + '">'
        html += '<i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>'
        html +='Editar</a></li>'
        html += ' <li class="puntero"><a class="dropdown-item" onclick="deleteSeccion('+seccionActual.id+')">'
        html +='<i class="fa-solid fa-trash" style="margin-right:7px"></i>'
        html +='Eliminar</a></li>'
        html += ' </ul>'

        html += '</div>'
        html += '<h3 class="text-black mb-3">' + seccionActual.descripcion + '</h3>'
        html += '<div class="mt-5 mb-3 d-flex justify-content-between">'
        html += '<div class="d-flex justify-content-end">'
        html += '<a class=" btn btn-outline-danger" onclick="dibujarAtras('+padre+')"><i class="fa-solid fa-arrow-left-long fa-2x"></i> <span class="span-boton">Atrás</span></a>'
        html += '</div>'
    }
  
    html += '<div class="d-flex justify-content-end">'
    html += '<a class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal' + padre + '" id="' + padre + '"><i class="fa-solid fa-plus fa-2x"></i> <span class="span-boton">Agregar Sección</span></a>'
    html += '</div>'
    html += '</div>'

    html += '<section class="contenedor-crearUsuario bg-light my-4">'
    if(seccionActual != undefined && seccionActual.idFormulario != '1'){
        html += '<p style="font-size:12px"><strong>Formulario: </strong>'+ (seccionActual.nombreFormulario[0].toUpperCase()+seccionActual.nombreFormulario.substring(1)) +'</p>'
    }
    html += '<div class=" d-flex justify-content-center" style="flex-wrap:wrap">'
    if (hijos.length == 0) {
        html += '<div class="alert bg-danger px-5 py-2 mt-3 w-100" style="border-radius:5px;border:1px solid red">';
        html += '<div class="d-flex justify-content-center align-items-center">';
        html += '<h4 class="text-white">No Existen Archivos</h4>';
        html += "</div>";
        html += "</div>";
    } else {
        hijos.forEach(hijo => {
            html += '<div class="p-3 padreCarpeta ">'
            html += '<div class="botonesCarpeta row justify-content-center align-items-center">'
            html += '<button type="button" style="border:none" class="btn btn-outline-secondary dropdown-toggle py-2 px-3" data-bs-toggle="dropdown" aria-expanded="false">'
            html += '<i class="fa-solid fa-ellipsis-vertical fa-xl "></i>'
            html += '</button>'
            html += '<ul class="dropdown-menu dropdown-menu-dark">'
            html += ' <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal' + hijo.id + '">'
            html += '<i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>'
            html +='Editar</a></li>'
            html += ' <li class="puntero"><a class="dropdown-item" onclick="deleteSeccion('+ hijo.id +')">'
            html +='<i class="fa-solid fa-trash" style="margin-right:7px"></i>'
            html +='Eliminar</a></li>'
            html += ' </ul>'
            html += '</div>'

            html += '<a class="btn btn-outline-dark " style="border:1px solid" onclick="entrarSeccion(' + hijo.id + ')">'
            html += '<div class="row justify-content-center align-items-center hoverCarpeta widthCarpeta">'
            html += '<div>'
            html += '<i class="fa-regular fa-folder-open" style="font-size:40px"></i>'
            html += '<p class="botonCarpeta">' + (hijo.seccion[0].toUpperCase()+hijo.seccion.substring(1)) + '</p>'
            html += '</div>'
            html += '</div>'
            html += '</a>'
            html += '</div>'
            // ----------------------------------- modal para editar por cada hijo ----------------------------------
            html += '<div class="modal fade" id="exampleModal' + hijo.id + '" tabindex="-1" aria-labelledby="exampleModalLabel' + hijo.id + '" aria-hidden="true">'
            html += '<div class="modal-dialog">'
            html += '<div class="modal-content">'
            html += '  <div class="modal-header bg-black">'
            html += '   <h5 class="modal-title text-white">Editar Sección</h5>'
            html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
            html += '  </div>'
            html += '  <div class="modal-body">'
            html += '<h3 class="text-black mt-2 mb-4">Edite la sección ' + hijo.seccion + '</h3>'

            html += '<form >'
            html += '<div class="mb-3">'
            html += '<label  class="form-label"><strong>Nombre de la Seccion:</strong></label>'
            html += '<input type="text" class="form-control" id="seccion' + hijo.id + '" value="' + hijo.seccion + '">'
            html += '</div>'

            html += '<div class="mb-3">'
            html += '<label class="form-label"><strong>Formulario de la Seccion:</strong></label>'
            html += '<select class="form-select" id="formulario' + hijo.id + '" style="height:30px">'
            html += '<option value="" selected disabled> -- Seleccione una opcion -- </option>'
            
            formularios.forEach( formulario =>{
                if(hijo.idFormulario == formulario.id){
                    html += '<option value="'+formulario.id+'" selected>'+formulario.nombre+'</option>'
                } else {
                    html += '<option value="'+formulario.id+'">'+formulario.nombre+'</option>'
                }
            })
            html += '</select>'
            html += '</div>'

            html += '<div class="mb-3">'
            html += '<label for="exampleFormControlInput1" class="form-label"><strong>Descripcion de la Seccion:</strong></label>'
            if (hijo.descripcion == "") {
                html += '<textarea class="form-control" rows="5" id="descripcion' + hijo.id + '" placeholder="Esta Sección no tiene descripción"></textarea>'
            } else {
                html += '<textarea class="form-control" rows="5" id="descripcion' + hijo.id + '" >' + hijo.descripcion + '</textarea>'
            }
            html += '</div>'

            html += '<div class="w-100 mt-2" id="alertas">'
            html += '</div>'

            html += '</form>'
            html += '</div>'
            html += '<div class="modal-footer">'
            html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>'
            html += '<a class="btn btn-success" id="botonCrear" onclick="updateSeccion(' + padre + ',' + hijo.id + ',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
            html += '</div>'
            html += '</div>'
            html += '</div>'
            html += '</div>'
        })
    }
    html += '</div>'
    html += '</section>'
    // ----------------------------------- modal para CREAR nuevos hijos ------------------------------------------------
    html += '<div class="modal fade" id="exampleModal' + padre + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'
    html += '<div class="modal-dialog">'
    html += '<div class="modal-content">'
    html += '  <div class="modal-header bg-black">'
    if (seccionActual == undefined) {
        html += '   <h5 class="modal-title text-white">Agregar Sección</h5>'
    } else {
        html += '   <h5 class="modal-title text-white">Agregar Sección en ' + seccionActual.seccion + '</h5>'
    }
    html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
    html += '  </div>'
    html += '  <div class="modal-body">'
    html += '<h3 class="text-black mt-2 mb-4">Ingrese los datos de la nueva Sección</h3>'

    html += '<div class="mb-3">'
    html += '<label  class="form-label"><strong>Nombre de la Seccion:</strong></label>'
    html += '<input type="text" class="form-control" id="seccion" name="seccion" placeholder="Ingrese nombre">'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label  class="form-label"><strong>Formulario de la Seccion:</strong></label>'
    html += '<select class="form-select" id="formulario" name="formulario" style="height:30px">'
    html += '<option value="" selected disabled> -- Seleccione una opcion -- </option>'
    formularios.forEach( formulario =>{
        html += '<option value="'+formulario.id+'">'+formulario.nombre+'</option>'
    })
    html += '</select>'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label  class="form-label"><strong>Descripcion de la Seccion:</strong></label>'
    html += '<textarea class="form-control" rows="5" id="descripcion" placeholder="Ingrese descripción"></textarea>'
    html += '</div>'

    html += '<div class="w-100 mt-2" id="alertas">'
    html += '</div>'

    html += '</div>'
    html += '<div class="modal-footer">'
    html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>'
    if (seccionActual == undefined) {
        html += '<a class="btn btn-success" id="botonCrear" onclick="createSeccion(0,)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'

    } else {
        html += '<a class="btn btn-success" id="botonCrear" onclick="createSeccion(' + padre + ')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
    }
    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'

    /// --------------------------------------     Modal para editar la seccion actual --------------------------------------
    if(seccionActual !== undefined){
    html += '<div class="modal fade" id="exampleModalEditar' + padre + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'
    html += '<div class="modal-dialog">'
    html += '<div class="modal-content">'
    html += '  <div class="modal-header bg-black">'
    html += '   <h5 class="modal-title text-white">Editar Sección</h5>'
    
    html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
    html += '  </div>'
    html += '  <div class="modal-body">'
    html += '<h3 class="text-black mt-2 mb-4">Editar datos de la Sección ' + seccionActual.seccion + '</h3>'

    html += '<form>'
    html += '<div class="mb-3">'
    html += '<label  class="form-label"><strong>Nombre de la Seccion:</strong></label>'
    html += '<input type="text" class="form-control" id="seccion'+seccionActual.id+'" placeholder="Ingrese nombre" value="'+seccionActual.seccion +'">'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label  class="form-label"><strong>Formulario de la Seccion:</strong></label>'
    html += '<select class="form-select" id="formulario'+seccionActual.id+'" style="height:30px">'
    html += '<option value="" selected disabled> -- Seleccione una opcion -- </option>'
    formularios.forEach( formulario =>{
        if( formulario.id == seccionActual.idFormulario ){
            html += '<option value="'+formulario.id+'" selected>'+formulario.nombre+'</option>'
        } else{
            html += '<option value="'+formulario.id+'">'+formulario.nombre+'</option>'
        }
    })
    html += '</select>'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label  class="form-label"><strong>Descripcion de la Seccion:</strong></label>'
    if(seccionActual.descripcion != ""){
        html += '<textarea class="form-control" rows="5" id="descripcion'+seccionActual.id+'" >'+seccionActual.descripcion+'</textarea>'
    } else{
        html += '<textarea class="form-control" rows="5" id="descripcion'+seccionActual.id+'" placeholder="Esta Seccion no tiene descripcion" ></textarea>'
    }
    html += '</div>'

    html += '<div class="w-100 mt-2" id="alertas">'
    html += '</div>'

    html += '</form>'
    html += '</div>'
    html += '<div class="modal-footer">'
    html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>'
    html += '<a class="btn btn-success" id="botonCrear" onclick="updateSeccion('+seccionActual.id+','+seccionActual.id+',1)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
    
    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'
    }
    document.getElementById('dibujar-js').innerHTML = html;
}

async function entrarSeccion(id) {
    let hijos = await traerHijos(id)
    dibujarHijos(id, hijos)
}

async function guardarFormulario(id) {
    let formulario = document.getElementById('formularioSelected' + id).value
    var html = "";
    if (formulario == "") {
        document.getElementById('alertas' + id).classList.remove('apagar')
        document.getElementById('btnSaveForm' + id).classList.add('apagar')
        document.getElementById('formularioSelected' + id).classList.add('errorInput')
        html += '<div class="d-flex justify-content-center align-items-center bg-danger mt-1 py-2 mx-3 text-white" style="font-size:14px;border:1px solid red;border-radius:5px">Debe seleccionar un Formulario</div>'
        document.getElementById("alertas" + id).innerHTML = html;
        setTimeout(() => {
            document.getElementById('btnSaveForm' + id).classList.remove('apagar')
            document.getElementById('formularioSelected' + id).classList.remove('errorInput')
            document.getElementById('alertas' + id).classList.add('apagar')
        }, 2000);
    } else {
        const btnSave = 'btnSaveForm' + id
        botonesGuardar(btnSave, 'px-0', 'py-0')
        $('#exampleModalAddFormulario' + id).modal('hide')
        const datos = new FormData()
        const idFormulario = document.getElementById('formularioSelected' + id).value

        datos.append('idFormulario', idFormulario);
        datos.append('idSeccion', id);
        console.log([...datos]);
        let url = URL_BASE + '/seccion/formulario/agregar';
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'token': token
            },
            body: datos
        });
        //  respuesta de la peticion de arriba, me arroja true o false 
        const response = await request.json();
        console.log(response);
        if (response.exito) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.exito,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                dibujarSecciones();
                $('#tablaSecciones').DataTable();
            })
        } else if (response.error) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.error
            }).then(() => {
                dibujarSecciones();
                $('#tablaSecciones').DataTable();

            })
        } else if (response.exit) {
            Swal.fire({
                icon: 'warning',
                title: response.exit,
                showConfirmButton: false,
                text: 'Sesión expirada, vuelva a iniciar sesión',
                timer: 3000
            }).then(() => {
                window.location.href = URL_BASE + "/?r=8";
            })
        } else {
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
}

function botonesGuardar(boton, largo = "px-2", ancho = "py-3") {
    document.getElementById(boton).innerHTML = ""
    let html = "";
    html += '<buttom type="buttom" class="btn d-flex ' + largo + ' ' + ancho + ' cursito justify-content-center align-items-center" style="background-color:#198754" disabled>'
    html += '<span class="spinner-border spinner-border-sm" style="width: 1.8rem; height: 1.8rem;color:white" role="status" aria-hidden="true"></span>'
    html += '<span style="margin-left:15px;font-size:14px;color:white">Cargando...</span>'
    html += '</button>'
    document.getElementById(boton).innerHTML = html;
}

async function createSeccion(padre = 0) {
    var html = "";
    const hijos = await traerHijos(padre);
    const seccion = document.getElementById('seccion').value
    const descripcion = document.getElementById('descripcion').value
    const formulario = document.getElementById('formulario').value
    console.log('formulario',formulario);
    const datos = new FormData()
    datos.append('idPadre', padre);
    if(formulario == ""){
        datos.append('idFormulario', 1);
    } else{
        datos.append('idFormulario', formulario);

    }
    datos.append('seccion', seccion);
    datos.append('descripcion', descripcion);

    console.log([...datos]);
    let url = URL_BASE + '/seccion/create';
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            'token': token
        },
        body: datos
    });
    //  respuesta de la peticion de arriba, me arroja true o false 
    const response = await request.json();
    if (response.exito) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.exito,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            $('#exampleModal' + padre).modal('hide')
            dibujarHijos(padre, response.hijos)
        })
    } else if (response.error) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: response.error
        }).then(() => {
            $('#exampleModal' + padre).modal('hide')
            dibujarHijos(padre, hijos)
        })
    } else if (response.exit) {
        Swal.fire({
            icon: 'warning',
            title: response.exit,
            showConfirmButton: false,
            text: 'Sesión expirada, vuelva a iniciar sesión',
            timer: 3000
        }).then(() => {
            window.location.href = URL_BASE + "/?r=8";
        })
    } else {
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

async function updateSeccion(padre , hijo, tipo) {
    var html = "";
    const seccion = document.getElementById('seccion'+hijo).value
    const descripcion = document.getElementById('descripcion'+hijo).value
    const formulario = document.getElementById('formulario'+hijo).value

    const datos = new FormData()
    datos.append('hijo', hijo);
    datos.append('padre', padre);
    if(formulario != ""){
        datos.append('idFormulario', formulario);
    }
    datos.append('seccion', seccion);
    datos.append('descripcion', descripcion);
    if(tipo == 1){
        datos.append('tipo', 'updatePadre');
    } else{
        datos.append('tipo', 'updateHijo');
    }
    console.log([...datos]);
    let url = URL_BASE + '/seccion/update';
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            'token': token
        },
        body: datos
    });
    //  respuesta de la peticion de arriba, me arroja true o false 
    const response = await request.json();
    if (response.exito) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.exito,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            $('#exampleModal' + hijo).modal('hide')
            $('#exampleModalEditar' + hijo).modal('hide')
            dibujarHijos(padre, response.hijos)
        })
    } else if (response.error) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: response.error
        }).then(() => {
            $('#exampleModal' + hijo).modal('hide')
            $('#exampleModalEditar' + hijo).modal('hide')
            dibujarHijos(padre, response.hijos)

        })
    } else if (response.exit) {
        Swal.fire({
            icon: 'warning',
            title: response.exit,
            showConfirmButton: false,
            text: 'Sesión expirada, vuelva a iniciar sesión',
            timer: 3000
        }).then(() => {
            window.location.href = URL_BASE + "/?r=8";
        })
    } else {
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

async function deleteSeccion(hijo) {
    const secciones = await traerSecciones();
    const seccionEliminar = secciones.find(sec => sec.id == hijo)
    Swal.fire({
        title: 'ELIMINAR',
        text: `Estas seguro de Eliminar de forma permamente a ${seccionEliminar.seccion}?`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        confirmButtonColor: '#dc3545',
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            $.ajax({
                data: {
                    "id": hijo
                },
                url: URL_BASE + '/seccion/delete',
                type: 'POST',
                headers: {
                    'token': token
                },
                dataType: 'json'
            }).done((response) => {
                if (response.exito) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: response.exito,
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        dibujarHijos(response.padre, response.hijos)
                    })
                } else if (response.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ERROR',
                        text: response.error
                    }).then(() => {
                        dibujarHijos(response.padre, response.hijos)
                    })
                } else if (response.exit) {
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
            }).fail((err) => {
                console.log(err);
            });
        }
    })
}