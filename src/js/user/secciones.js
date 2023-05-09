
const URL_BASE = 'http://localhost/gdagmcp';
const CARPETA_BASE = '/base';
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
    await dibujarPadreAndCarpetas(0)
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
                console.log('secciones', secciones);
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
            url: URL_BASE + '/documento/datos',
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

function traerFormulario(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            data: {
                "tipo": 'formulario',
                "id": id
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/documento/datos',
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
            resolve(response)
        }).fail((err) => {
            reject(err);
        });
    })
}

function traerDocs(id) {
    return new Promise((resolve, reject) => {
        let documentos = [];
        $.ajax({
            data: {
                id: id,
                tipo: "documentos",
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + "/carpeta/datos",
            type: "POST",
            headers: {
                token: token,
            },
            dataType: "json",
        })
            .done((response) => {
                if (response.exit) {
                    Swal.fire({
                        icon: "warning",
                        title: response.exit,
                        showConfirmButton: false,
                        text: "Sesión expirada, vuelva a iniciar sesión",
                        timer: 3000,
                    }).then(() => {
                        window.location.href = URL_BASE + "/?r=8";
                    });
                }
                if (response.length == 0) {
                    resolve(0);
                }
                $.each(response, (index, doc) => {
                    documentos.push(doc);
                    if (response.length == index + 1) {
                        resolve(documentos);
                    }
                });
            })
            .fail((err) => {
                reject(err);
            });
    });
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

function moverCarpeta(id) {
    return new Promise((resolve, reject) => {
        let hijos = []
        $.ajax({
            data: {
                "id": id,
                "tipo": 'updateCarpetas'
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

async function dibujarAtras(padre) {
    let seccionesActualizadas = await traerSecciones();
    let seccionActual = seccionesActualizadas.find(sec => sec.id == padre);
    dibujarPadreAndCarpetas(seccionActual.idPadre)
}

function hexToRgb(hex) {
    const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (normal) {
        return (normal.slice(1).map(e => parseInt(e, 16)))
    };
    const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (shorthand) {
        return (shorthand.slice(1).map(e => 0x11 * parseInt(e, 16)));
    }
    return (0);
}

function buscarCarpeta(seccionActual) {
    document.getElementById('divBtnBuscar').innerHTML = "";
    console.log('seecionActual', seccionActual);
    var html = "";
    html += '<div class=" d-flex  justify-content-end" >'
    html += '<input style="width:193.5px;height:32.3px" class="form-control" id="buscarFocus" type="text" placeholder="Ingrese nombre de carpeta" onKeyUp="escucharCarpeta(this.value,' + (seccionActual != undefined ? seccionActual : 0) + ')">';
    html += '</div>'
    document.getElementById('divBtnBuscar').innerHTML = html;
    document.getElementById('buscarFocus').focus();
}

escucharCarpeta = (value, id) => {
    $.ajax({
        data: { "tipo": "buscarCarpetas", "value": value, "id": id },
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
        console.log(response);
        dibujarHijosPadre(id, response);
    }).fail((err) => {
        console.log(err);
    });
}

async function dibujarPadreAndCarpetas(padre) {
    await dibujarPadre(padre);
    await dibujarHijosPadre(padre);

}

async function dibujarPath(path) {
    if (path != 'base') {
        $.ajax({
            data: { "tipo": "buscarPath", "value": path.replace("_", " ") },
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
            response.forEach(path => {
                dibujarPadreAndCarpetas(path.id);
            })
        }).fail((err) => {
            console.log(err);
        });
    } else {
        dibujarPadreAndCarpetas(0);
    }

}

async function dibujarPadre(padre) {
    var html = "";
    let seccionesActualizadas = await traerSecciones();
    let seccionActual = seccionesActualizadas.find(sec => sec.id == padre);
    html += '<div class="d-flex justify-content-center padreAtras">'
    html += '<div class="d-flex justify-content-center hijoAtras">'
    html += '<a class=" btn btn-outline-danger ' + (seccionActual == undefined ? 'noVisible' : '') + ' " onclick="dibujarAtras(' + padre + ')"><i class="fa-solid fa-arrow-left-long fa-2x"></i> <span class="span-boton">Atrás</span></a>'
    html += '</div>'
    if (seccionActual == undefined) {
        html += '<h1 class="text-black mb-3"><strong>Administrar Carpetas</strong></h1>'
    } else {
        html += '<div class="d-flex flex-column justify-content-center">'
        html += '<div class="d-flex justify-content-center">'
        html += '<h1 class="text-black mb-3"><i class="fa-solid fa-folder-open fa-xl" style="margin-right:7px;color:' + seccionActual.color + '"></i><strong>' + (seccionActual.seccion[0].toUpperCase() + seccionActual.seccion.substring(1)) + '</strong></h1>'
        html += '<button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" style="margin-left:5px;margin-top:4px;width:25px;height:30px;border-radius:15px">'
        html += '<i class="fa-solid fa-ellipsis-vertical fa-xl "></i>'
        html += '</button>'
        html += '<ul class="dropdown-menu dropdown-menu-dark">'
        html += ' <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalEditar' + seccionActual.id + '"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>'
        html += '<li class="puntero"><a class="dropdown-item" onclick="deleteSeccion(' + seccionActual.id + ')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>'
        html += '</ul>'
        html += '</div>'
        if (seccionActual.descripcion.length > 0) {
            html += '<h3 class="text-black mt-3 mb-4">' + (seccionActual.descripcion[0].toUpperCase() + seccionActual.descripcion.substring(1)) + '</h3>'
        } else {
            html += '<h3 class="text-black mt-3 mb-4">' + seccionActual.descripcion + '</h3>'
        }
        html += '</div>'
    }
    /*=============================================================================================================//
                                                Botones Buscar y Crear Hijos
    //==============================================================================================================*/
    html += '</div>' // del primer div
    html += '<div class="d-flex justify-content-end mt-2">'
    html += '<div style="margin-right:5px" id="divBtnBuscar">'
    html += '<a class="btn btn-outline-primary" onclick="buscarCarpeta(' + (seccionActual != undefined ? seccionActual.id : 0) + ')"><i class="fa-solid fa-magnifying-glass fa-2x"></i><span class="span-boton">Carpeta</span></a>'
    html += '</div>'
    html += '<div>'
    html += '<a class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal' + padre + '" id="' + padre + '"><i class="fa-solid fa-plus fa-2x"></i><span class="span-boton">Carpeta</span></a>'
    html += '</div>'
    html += '</div>';
    html += '<div class="w-100 mt-2">';
    if (seccionActual != undefined) {
        let paths = (CARPETA_BASE + seccionActual.path).split('/')
        let removes = paths.shift();
        paths.forEach(path => {
            var nombre = path.replace('_', ' ');
            html += '<a class="puntero" style="text-decoration: none !important;" onclick="dibujarPath(\'' + nombre + '\')"><strong>' + (nombre[0].toUpperCase() + nombre.substring(1)) + '</strong></a> / ' + " " + '';
        })

    }
    html += '</div>';

    /*=============================================================================================================//
                                                Contenedor hijos
    //==============================================================================================================*/
    html += '<div class="contenedor-carpetas mt-3 mb-5" id="contenedorCarpetas" >'



    html += '</div>'
    /*=============================================================================================================//
                                                modal para CREAR nuevos hijos
    //==============================================================================================================*/

    html += '<div class="modal fade" id="exampleModal' + padre + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'
    html += '<div class="modal-dialog">'
    html += '<div class="modal-content">'
    html += '  <div class="modal-header bg-black">'
    if (seccionActual == undefined) {
        html += '   <h5 class="modal-title text-white">Crear Carpeta</h5>'
    } else {
        html += '   <h5 class="modal-title text-white">Agregar Carpeta en ' + seccionActual.seccion + '</h5>'
    }
    html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
    html += '  </div>'
    html += '  <div class="modal-body">'
    html += '<h3 class="text-black mt-2 mb-4">Ingresar datos de la Carpeta</h3>'

    html += '<div class="mb-3">'
    html += '<label  class="form-label"><strong>Nombre:</strong></label>'
    html += '<input type="text" class="form-control" id="seccion" name="seccion" placeholder="Ingrese nombre">'
    html += '</div>'

    html += '<div class="mb-2">'
    html += '<label  class="form-label"><strong>Descripción:</strong></label>'
    html += '<textarea class="form-control" rows="5" id="descripcion" placeholder="Ingrese descripción"></textarea>'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label  class="form-label"><strong>Color:</strong></label>'
    html += '<input type="color" class="form-control w-25" id="color" name="color">'
    html += '</div>'

    html += '<div class="w-100 mt-2" id="alertas">'
    html += '</div>'

    html += '</div>'
    html += '<div class="modal-footer">'
    html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>'
    if (seccionActual == undefined) {
        html += '<a class="btn btn-success" id="botonCrear" onclick="createSeccion(0)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'

    } else {
        html += '<a class="btn btn-success" id="botonCrear" onclick="createSeccion(' + padre + ')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
    }
    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'

    /*=============================================================================================================//
                                                Modal para EDITAR el padre
    //==============================================================================================================*/
    if (seccionActual !== undefined) {
        html += '<div class="modal fade" id="exampleModalEditar' + seccionActual.id + '" tabindex="-1" aria-labelledby="exampleModalLabel' + seccionActual.id + '" aria-hidden="true">'
        html += '<div class="modal-dialog">'
        html += '<div class="modal-content">'
        html += '  <div class="modal-header bg-black">'
        html += '   <h5 class="modal-title text-white">Editar</h5>'
        html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
        html += '  </div>'
        html += '  <div class="modal-body" style="min-height:350px">'
        html += '<h3 class="text-black mt-2 mb-4">Edite <strong>' + seccionActual.seccion + '</strong></h3>'

        html += '<div class="mb-4 d-flex justify-content-between">'

        html += '<div class="d-flex flex-column" style="width:70%">'
        html += '<label  class="form-label"><strong>Nombre:</strong></label>'
        html += '<input type="text" class="form-control" id="seccion' + seccionActual.id + '" value="' + seccionActual.seccion + '">'
        html += '</div>'

        html += '<div class="d-flex flex-column" style="width:28%">'
        html += '<label class="form-label"><strong>Color:</strong></label>'
        html += '<input type="color" class="form-control  puntero" id="color' + seccionActual.id + '" value="' + seccionActual.color + '">'
        html += '</div>'

        html += '</div>'

        html += '<div class="mb-4">'
        html += '<label for="exampleFormControlInput1" class="form-label"><strong>Descripción:</strong></label>'
        if (seccionActual.descripcion == "") {
            html += '<textarea class="form-control" rows="6" id="descripcion' + seccionActual.id + '" placeholder="Esta Sección no tiene descripción"></textarea>'
        } else {
            html += '<textarea class="form-control" rows="6" id="descripcion' + seccionActual.id + '" >' + seccionActual.descripcion + '</textarea>'
        }
        html += '</div>'

        html += '<div class="mb-4">'
        html += '<div class="w-100">'
        html += '<label class="form-label"><strong>Mover Carpeta:</strong></label>'
        html += '</div>'

        html += '<div style="height:30px">'
        html += '<select style="width:100%;height:100% !important" id="select' + seccionActual.id + '" class="js-example-basic-single" >'
        const base = {
            id: '0',
            idPadre: '0',
            seccion: 'CARPETA BASE',
            descripcion: '',
            color: '#000000',
            path: '/base',
        }
        let carpetas = JSON.parse(seccionActual.carpetas);
        carpetas.unshift(base);
        carpetas.forEach(seccion => {
            if (seccion.id != seccionActual.id) {
                html += '<optgroup label="' + seccion.seccion + '">'
                html += '<option value="' + seccion.id + '" ' + (seccion.id == seccionActual.idPadre ? 'selected' : '') + '><strong><i class="fa-solid fa-folder-open"></i></strong>' + seccion.path + '</option>'
                html += '</optgroup>'
            }
        })
        html += '</select>'
        html += '</div>' /// fin del contenedor del select

        html += '<div class="w-100 mt-4" id="alertas' + seccionActual.id + '">'
        html += '</div>'

        html += '</div>'
        html += '</div>'
        html += '<div class="modal-footer">'
        html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>'
        html += '<a class="btn btn-success" id="botonCrear" onclick="updateSeccion(' + padre + ',' + seccionActual.id + ',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
        html += '</div>'
        html += '</div>'
        html += '</div>'
        html += '</div>'
    }
    document.getElementById('dibujar-js').innerHTML = html;
    document.getElementById("dibujar-tabla").innerHTML = "";
    waitResponse('#contenedorCarpetas');
    if (padre > 0) {
        await dibujarDocs(padre);
    }
    $("#select" + padre).select2({
        dropdownParent: $("#exampleModalEditar" + padre)
    });

}

async function dibujarHijosPadre(padre, response = []) {
    let hijos = "";
    if (response.length > 0) {
        hijos = response;
    } else {
        hijos = await traerHijos(padre);
    }
    var html = "";
    if (hijos.length === 0) {
        html += '<div class="alert  px-5 py-2 mt-3 w-100 ">';
        html += '<div class="d-flex justify-content-center align-items-center">';
        html += '<h4 class="" style="color:red">No Existen Carpetas</h4>';
        html += "</div>";
        html += "</div>";
    } else {
        html += '<div class="d-flex justify-content-center " style="flex-wrap:wrap">'
        hijos.forEach(hijo => {
            html += '<div class="p-3 padreCarpeta">'
            html += '<a class="btn hoverCarpeta" style="border:1px solid #e2e4e6" onclick="dibujarPadreAndCarpetas(' + hijo.id + ')">'
            html += '<div class="row justify-content-center align-items-center  widthCarpeta ">'
            html += '<div class="">'
            html += '<i class="fa-regular fa-folder-open" style="font-size:40px;margin-bottom:10px;color:' + hijo.color + '"></i>'
            html += '<div style="margin-bottom:-7px">'
            html += '<p style="font-weight:bold">' + (hijo.seccion[0].toUpperCase() + hijo.seccion.substring(1)) + '</p>'
            html += '</div>'
            html += '</div>'
            html += '</div>'
            html += '</a>'
            html += '<div class="d-flex justify-content-center align-items-center elip">'
            html += '<buttom class="btn btn-outline-secondary botonesCarpeta btn-hover dropdown-toggle py-2 px-3"  style="border:none" data-bs-toggle="dropdown" aria-expanded="false" type="buttom">'
            html += '<i class="fa-solid fa-ellipsis-vertical fa-xl elip" ></i>'
            html += '</buttom>'
            html += '<ul class="dropdown-menu dropdown-menu-dark">'
            html += '<li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal' + hijo.id + '"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>'
            html += '<li class="puntero"><a class="dropdown-item" onclick="deleteSeccion(' + hijo.id + ')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>'
            html += ' </ul>'
            html += '</div>' // div de la elipsis
            html += '</div>' // div de la carpeta
            /*=============================================================================================================//
                                                        Modal para cada hijo
            //==============================================================================================================*/
            html += '<div class="modal fade" id="exampleModal' + hijo.id + '" tabindex="-1" aria-labelledby="exampleModalLabel' + hijo.id + '" aria-hidden="true">'
            html += '<div class="modal-dialog">'
            html += '<div class="modal-content">'
            html += '  <div class="modal-header bg-black">'
            html += '   <h5 class="modal-title text-white">Editar</h5>'
            html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
            html += '  </div>'
            html += '  <div class="modal-body" style="min-height:350px">'
            html += '<h3 class="text-black mt-2 mb-4">Edite <strong>' + hijo.seccion + '</strong></h3>'

            html += '<div class="mb-4 d-flex justify-content-between">'

            html += '<div class="d-flex flex-column" style="width:70%">'
            html += '<label  class="form-label"><strong>Nombre:</strong></label>'
            html += '<input type="text" class="form-control" id="seccion' + hijo.id + '" value="' + hijo.seccion + '">'
            html += '</div>'

            html += '<div class="d-flex flex-column" style="width:28%">'
            html += '<label class="form-label"><strong>Color:</strong></label>'
            html += '<input type="color" class="form-control  puntero" id="color' + hijo.id + '" value="' + hijo.color + '">'
            html += '</div>'

            html += '</div>'

            html += '<div class="mb-4">'
            html += '<label for="exampleFormControlInput1" class="form-label"><strong>Descripción:</strong></label>'
            if (hijo.descripcion == "") {
                html += '<textarea class="form-control" rows="6" id="descripcion' + hijo.id + '" placeholder="Esta Sección no tiene descripción"></textarea>'
            } else {
                html += '<textarea class="form-control" rows="6" id="descripcion' + hijo.id + '" >' + hijo.descripcion + '</textarea>'
            }
            html += '</div>'

            html += '<div class="mb-4">'
            html += '<div class="w-100">'
            html += '<label class="form-label"><strong>Mover Carpeta:</strong></label>'
            html += '</div>'

            html += '<div style="height:30px">'
            html += '<select style="width:100%;height:100% !important" id="select' + hijo.id + '" class="js-example-basic-single" >'
            const base = {
                id: '0',
                idPadre: '0',
                seccion: 'CARPETA BASE',
                descripcion: '',
                color: '#000000',
                path: '/base',
            }
            let carpetas = JSON.parse(hijo.carpetas);
            console.log('carpetas para mover', carpetas);
            carpetas.unshift(base);
            carpetas.forEach(seccion => {
                if (seccion.id != hijo.id) {
                    html += '<optgroup label="' + seccion.seccion + '">'
                    html += '<option value="' + seccion.id + '" ' + (seccion.id == padre ? 'selected' : '') + '><strong><i class="fa-solid fa-folder-open"></i></strong>' + seccion.path + '</option>'
                    html += '</optgroup>'
                }
            })
            html += '</select>'
            html += '</div>' /// fin del contenedor del select

            html += '<div class="w-100 mt-4" id="alertas' + hijo.id + '">'
            html += '</div>'

            html += '</div>'
            html += '</div>'
            html += '<div class="modal-footer">'
            html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>'
            html += '<a class="btn btn-success" id="botonCrear" onclick="updateSeccion(' + padre + ',' + hijo.id + ',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
            html += '</div>'
            html += '</div>'
            html += '</div>'
            html += '</div>'
        })
        html += '</div>'
    }
    document.getElementById("contenedorCarpetas").innerHTML = html;
    hijos.forEach(seccion => {
        $("#select" + seccion.id).select2({
            dropdownParent: $("#exampleModal" + seccion.id)
        });
    })
}

async function dibujarDocs(padre, docs = []) {
    let seccionesActualizadas = await traerSecciones();
    let seccionActual = seccionesActualizadas.find(sec => sec.id == padre);
    let documentos;
    if (docs.length == 0) {
        documentos = await traerDocs(padre);
    } else {
        documentos = docs
    }
    var html = "";
    html += '<div class="accordion" id="accordionExample">'
    html += '<div class="accordion-item ">'
    html += '<h2 class="accordion-header" id="headingOne">'
    html += '<button class="accordion-button ' + (documentos.length > 0 ? '' : 'collapsed') + ' contenedor-carpetas" type="button"  style="height:55px" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"><div class="d-flex w-100 justify-content-center"><h4 style="color:black">Documentos de<strong>' + ' ' + seccionActual.seccion + '</strong></h4></div></button>'
    html += ' </h2>'
    html += '<div id="collapseOne" class="accordion-collapse collapse ' + (documentos.length > 0 ? 'show' : '') + '" data-bs-parent="#accordionExample">'
    html += ' <div class="accordion-body px-0">'
    //--------------------------------------------------------------------------------------------------
    html += '<div class="d-flex mb-3 justify-content-end ">'
    html += '<a title="Ver todos los Documentos" class="btn btn-primary" style="margin-right:5px" id="mostrarDocs"  onclick="mostrarDocsPro(' + padre + ')"><i class="fa-regular fa-eye fa-2x"></i></a>'
    html += '<a class="btn btn-warning"  onclick="agregarDocumento(' + padre + ')"><i class="fa-solid fa-plus fa-2x"></i><span class="span-boton">Documento</span></a>'
    html += "</div>";

    html += '<table class="table" style="min-width:1000px" id="tablaDocsUltimo">';
    html += '<thead class="table-dark">';
    html += '<tr class="" style="text-transform:uppercase">';
    html += "<th>N°</th>";
    html += '<th class="">Nombre</th>';
    html += '<th class="">Carpeta</th>';
    html += '<th class="">Form</th>';
    html += '<th class="">Datos</th>';
    html += '<th class="">Responsable</th>';
    html += '<th class="">Fecha</th>';
    // html += '<th class="">Estado</th>';
    html += '<th class="">Acciones</th>';
    // html += '<th class="col-1">Acciones</th>';
    html += "</tr>";
    html += "</thead>";
    html += '<tbody class="contenido" id="contenido">';
    if (documentos.length > 0) {
        documentos.forEach((documento, index) => {
            console.log('documento', documento);
            html += "<tr>"
            html += "<td>" + (parseInt(index) + 1) + "</td>"
            if (documento.alias == "") {
                html += "<td>" + documento.codigo + "</td>"
            } else {
                html += "<td>" + documento.alias + "</td>"
            }
            html += "<td>" + documento.seccion+"</td>"
            html += "<td>" + documento.formulario + "</td>"
            html += '<td><buttom class="btn btn-secondary" style="margin-left:12px" data-bs-toggle="modal" data-bs-target="#exampleModalVer' + documento.id + '">Ver</buttom></td>'; // hacer este boton modal
            html += "<td>" + documento.responsable + "</td>"
            html += '<td class="col-2"><div class="row"><p>' + documento.created_at.split(" ")[0] + '</p><p>' + documento.created_at.split(" ")[1] + '</p></div></td>'
            // html += '<td>'
            // if (documento.status == 0) {
            //     html += '<span class="badge badge-pill bg-danger" style="margin-left:15px"><i class="fa-solid fa-circle-exclamation fa-lg"></i></span>'
            // } else {
            //     html += '<span class="badge badge-pill bg-success" style="margin-left:15px"><i class="fa-solid fa-circle-check fa-lg"></i></span>'
            // }
            // html += '</td>'
            html += '<td class="col-2">'
            const urlA = "'" + documento.path + "'";
            const nombreA = "'" + documento.codigo + "'"
            html += '<buttom title="Ver Documento" class="btn btn-outline-primary" style="margin-right:5px;height:30px;width:32px" onclick="abrirPdf(' + urlA + "," + nombreA + ')"><i class="fa-solid fa-file-pdf fa-2x"></i></buttom>';
            html += '<buttom title="Descargar Documento" class="btn btn-primary" style="margin-right:5px;height:30px;width:32px"><i class="fa-solid fa-file-pdf fa-2x"></i></buttom>';
            html += '<buttom title="Editar" class="btn btn-warning" style="margin-right:5px;height:30px;width:32px"><i class="fa-solid fa-pen-to-square fa-2x"></i></i></buttom>';
            html += '<buttom title="Eliminar" class="btn btn-outline-danger" style=";height:30px;width:32px"><i class="fa-solid fa-trash fa-2x"></i></buttom>';
            html += "</td>";
            // html += "<td>";
            // html += '<buttom class="btn btn-warning" style="margin-right:5px"><i class="fa-regular fa-pen-to-square fa-2x"></i></buttom>';
            // html +='<buttom class="btn btn-danger"><i class="fa-solid fa-trash-can fa-2x"></i></buttom>';
            // html += "</td>";
            html += "</tr>";

            // <!---------------------------------------------      Modal ---------------------------------->
            html += '<div class="modal fade" id="exampleModalVer' + documento.id + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">';
            html += ' <div class="modal-dialog modal-dialog-centered">';
            html += ' <div class="modal-content">';
            html += ' <div class="modal-header bg-black ">';
            html += ' <h5 class="modal-title text-white" id="exampleModalLabel">Metadatos del Documento <strong>' + documento.codigo + '</strong></h5>';
            html += '<button type="button" class="btn text-white" style="font-size:13px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
            html += ' </div>';
            html += '  <div class="modal-body">';
            let datos = JSON.parse(documento.data)
            html += "<p><strong>KEYWORDS</strong></p>";
            html += "<p>" + documento.keywords + "</p>";
            datos.forEach(dato => {
                html += "<p><strong>" + dato.nombre.toUpperCase() + "</strong></p>";
                html += "<p>" + dato.valor + "</p>";
            })
            html += "  </div>";
            html += ' <div class="modal-footer">';
            html +=
                ' <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>';
            html += "  </div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
        });
    }
    html += "</tbody>";
    html += "</table>";
    html += '</tbody>';

    //--------------------------------------------------------------------------------------------------
    html += ' </div>'
    html += ' </div>'
    html += '</div>'
    html += '</div>'
    document.getElementById("dibujar-tabla").innerHTML = html;
    if (docs.length !== 0) {
        document.getElementById('mostrarDocs').classList.add('disabledButtom')
    }
    $("#tablaDocsUltimo").DataTable();
}

async function waitResponse(contenedor, altura = '129.5px') {
    var html = "";
    html += '<div class="d-flex justify-content-center align-items-center w-100" style="width:100% !important;height:' + altura + '">'
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
    console.log('adfads',document.querySelector(contenedor));
    contenedor.insertBefore(html, contenedor)
}

async function mostrarDocsPro(padre) {
    $.ajax({
        data: { "tipo": "allDocs", "id": padre },
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
        waitResponse('.dataTables_info', '50px');
        setTimeout(() => {
            if (response.length == 0) {
                var html = "";
                html += '<div class="alert  px-5 py-2 mt-3 w-100 ">';
                html += '<div class="d-flex justify-content-center align-items-center">';
                html += '<h4 class="" style="color:red">No Existen Documentos</h4>';
                html += "</div>";
                html += "</div>";
                document.querySelector('.dataTables_empty').innerHTML = html;
            } else {
                dibujarDocs(padre, response);
            }
        }, 105000);
    }).fail((err) => {
        console.log(err);
    });
}

async function agregarDocumento(padre) {
    let secciones = await traerSecciones();
    let formularios = await traerFormularios();
    console.log('formularios', formularios);
    let seccionActual = secciones.find(sec => sec.id == padre);
    var html = "";
    let tipo = 1;
    document.getElementById("dibujar-tabla").innerHTML = "";
    html += '<h1 class="text-black mb-3"><strong>Agregar Documentos en ' + seccionActual.seccion + '</strong></h1>';
    html += '<div class="mb-3">';
    html += '<div class="d-flex justify-content-start">';
    html += '<a class=" btn btn-outline-danger " onclick="dibujarPadreAndCarpetas(' + padre + ')"><i class="fa-solid fa-arrow-left fa-2x"></i> <span class="span-boton">Regresar</span></a>';
    html += '</div>';
    html += '</div>';
    html += '<div class="contenedor-crearUsuario bg-light contenedor-carpetas px-3">';
    if (tipo == "2") {
        html += '<h3 class="text-black mt-2 mb-4">Edite los datos de ' + +"</h3>";
    } else {
        html +=
            '<h3 class="text-black mt-2 mb-4">Elija un Formulario para agregar el documento</h3>';
    }
    html += '<div class="mb-3">';
    html +=
        '<label for="exampleFormControlInput1" class="form-label"><strong>Formulario:</strong></label>';
    html +=
        '<select class="form-select w-100" style="height:30px" id="seccion" onchange="elegirSeccionAgregar(this.value,' + padre + ')">';
    html +=
        ' <option value="" selected disabled> -- Seleccione un formulario -- </option>';
    formularios.forEach((formulario) => {
        html +=
            ' <option value="' + formulario.id + '">' + formulario.nombre + "</option>";
    });
    html += "</select>";
    html += "</div>";
    html += "</div>";

    html += "</div>";

    document.getElementById("dibujar-js").innerHTML = html;
}

async function elegirSeccionAgregar(id, padre) {
    console.log('id', id);
    let tipo = "1";
    var html = "";
    let formulario = await traerFormulario(id)
    console.log('formulario escogido');
    html += '<div class="contenedor-crearUsuario bg-light px-3">';
    if (tipo == 2) {
        html += '<h3 class="text-black mt-2 mb-4">Edite los datos del documento</h3>';
        html += ' <input type="hidden" id="idUser" name="id" value="" placeholder="" required>';
    } else {
        html += '<h3 class="text-black mt-2 mb-4">Ingrese los datos del documento</h3>';
    }

    let campos = JSON.parse(formulario.campos);
    let keywords = JSON.parse(formulario.keywords);
    let archivo = JSON.parse(formulario.archivo);
    let tipoArchivos = archivo.map((tipo) => {
        return "." + tipo;
    });
    html += '<div class="row">';
    html += '<div class="mb-3 w-100" id="' + keywords.input + '" >';
    html += '<label class="form-label"><strong>Ingrese ' + keywords.input + ':</strong></label>';
    html += '<input type="' + keywords.type + '" class="form-control datos"  name="' + keywords.input + '" value="" placeholder="Agregue palabras clave del documento">';
    html += "</div>";

    campos.forEach((campo) => {
        const { input, type } = campo;
        html += '<div class="mb-3 w-100" id="' + input + '">';
        html += '<label class="form-label"><strong>Ingrese ' + input[0].toUpperCase() + input.substring(1) + ":</strong></label>";
        if (type == "text") {
            html += '<textarea class="w-100 form-control datos" name="' + input + '" rows="5"></textarea>';
        } else {
            html += ' <input type="' + type + '" class="form-control datos"  name="' + input + '">';
        }
        html += "</div>";
    });
    html += "</div>";

    html += '<div class="mb-3 w-100" id="archivo">';
    html += '<label class="form-label"><strong>Cargar el archivo:</strong></label>';
    html += ' <input type="file" class="form-control datos" name="archivo" accept="' + tipoArchivos + '">';
    html += "</div>";
    html += '<div class="w-100 mt-2" id="alertas">'
    html += '</div>'
    html += '<div class="my-5 d-flex justify-content-center align-items-center">';
    html += '<a class="btn btn-success px-5 py-2" id="botonCrear" style="font-size:15px" onclick="saveArchivo(' + formulario.id + "," + padre + ')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>';
    html += "</div>";
    document.getElementById("dibujar-tabla").innerHTML = html;
}

async function saveArchivo(idFormulario, padre) {
    var html = "";
    const inputs = document.querySelectorAll(".datos");
    const nombres = Array.apply(null, inputs);
    //ya tengo un array con los inputs, debo hacer la validacion  para agregar el rojo y el texto
    //console.log(nombres);
    const info = [];
    let claves, documento;
    nombres.forEach((nombre) => {
        let nombreInput = nombre.name
        let valorInput = nombre.value
        if (nombre.value == "") {
            nombre.classList.add("errorInput");
            const div = document.createElement("div");
            div.id = "divAlerta" + nombreInput;
            div.textContent = "El campo " + nombreInput + " es OBLIGATORIO";
            div.style.color = "red";
            let padre = document.getElementById(nombreInput)
            let hijo = document.getElementById('divAlerta' + nombreInput)
            if (!hijo) {
                padre.appendChild(div);
            }
        } else {
            nombre.classList.remove("errorInput");
            const alerta = document.getElementById("divAlerta" + nombreInput)
            if (alerta) {
                alerta.innerHTML = "";
            }

            if (nombreInput == 'keywords') {
                claves = valorInput;
                console.log('claves', claves);
            } else if (nombreInput == 'archivo') {
                documento = nombre.files[0];
            } else {
                info.push({
                    'nombre': nombreInput,
                    'valor': valorInput
                })
            }
        }
    });
    if (info.length == nombres.length - 2) {
        const datos = new FormData()
        datos.append('idSeccion', padre);
        datos.append('idFormulario', idFormulario);
        datos.append('keywords', claves)
        datos.append('path', documento);
        datos.append('data', JSON.stringify(info));
        console.log([...datos]);

        let url = URL_BASE + '/documento/create';
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
                dibujarPadreAndCarpetas(padre);
            })
        } else if (response.error) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.error
            })
        } else if (response.archivo) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.archivo
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
    const seccion = document.getElementById('seccion').value
    const descripcion = document.getElementById('descripcion').value
    const color = document.getElementById('color').value
    let colorRGB = hexToRgb(color)
    const datos = new FormData()
    datos.append('idPadre', padre);
    datos.append('seccion', seccion);
    datos.append('descripcion', descripcion);
    datos.append('color', color);
    console.log([...datos]);
    let url = URL_BASE + '/carpeta/create';
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
            dibujarPadreAndCarpetas(padre);
        })
    } else if (response.error) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: response.error
        }).then(() => {
            $('#exampleModal' + padre).modal('hide')
            dibujarPadreAndCarpetas(padre);
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

async function updateSeccion(padre, hijo, tipo) {
    var html = "";
    const seccion = document.getElementById('seccion' + hijo).value
    const descripcion = document.getElementById('descripcion' + hijo).value
    const color = document.getElementById('color' + hijo).value
    const idPadre = document.getElementById('select' + hijo).value;

    const datos = new FormData()
    datos.append('hijo', hijo);
    datos.append('padre', padre);
    datos.append('seccion', seccion);
    datos.append('descripcion', descripcion);
    datos.append('color', color);
    if (padre != idPadre) {
        datos.append('idPadre', idPadre);
    }
    if (tipo == 1) {
        datos.append('tipo', 'updatePadre');
    } else {
        datos.append('tipo', 'updateHijo');
    }
    console.log([...datos]);
    let url = URL_BASE + '/carpeta/update';
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
            dibujarPadreAndCarpetas(padre);
        })
    } else if (response.error) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: response.error
        }).then(() => {
            $('#exampleModal' + hijo).modal('hide')
            $('#exampleModalEditar' + hijo).modal('hide')
            dibujarPadreAndCarpetas(padre);
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
        console.log('alertas', response);
        html += '<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >'
        response.alertas.error.forEach(alerta => {
            html += '<li class="text-danger"  >'
            html += alerta
            html += '</li>'
        })
        html += '</ul>'
        document.getElementById('alertas' + hijo).innerHTML = html;
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
                url: URL_BASE + '/carpeta/delete',
                type: 'POST',
                headers: {
                    'token': token
                },
                dataType: 'json'
            }).done((response) => {
                console.log('response Eliminar', response);
                if (response.exito) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: response.exito,
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        dibujarPadreAndCarpetas(seccionEliminar.idPadre)
                    })
                } else if (response.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ERROR',
                        html: '<strong>' + response.carpeta + '</strong> ' + response.error
                    }).then(() => {
                        dibujarPadreAndCarpetas(seccionEliminar.idPadre)

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

function abrirPdf(path, nombre) {
    let carpeta = '/public/archivos';
    window.open(URL_BASE + carpeta + path, nombre, "width=620,height=400,fullscreen=yes,scrollbars=NO")
    parent.opener = top;
    opener.close();
}