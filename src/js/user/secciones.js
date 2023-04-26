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

function traerDocs(id) {
    return new Promise((resolve, reject) => {
        let documentos = [];
        $.ajax({
            data: {
                id: id,
                tipo: "documentos",
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + "/seccion/datos",
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

async function dibujarAtras(padre) {
    let seccionesActualizadas = await traerSecciones();
    let seccionActual = seccionesActualizadas.find(sec => sec.id == padre);
    let seccionesAnterior = seccionesActualizadas.filter(sec => sec.idPadre == seccionActual.idPadre);
    dibujarHijos(seccionActual.idPadre, seccionesAnterior)
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

function colorCarpetas(carpeta) {
    var html = ""
    html += '<div class="p-3 padreCarpeta">'
    html += '<div class="">'
    html += '<a class="btn hoverCarpeta" style="border:1px solid #e2e4e6" onclick="entrarSeccion(' + carpeta.id + ')">'
    html += '<div class="row justify-content-center align-items-center  widthCarpeta ">'
    html += '<div class="">'
    html += '<i class="fa-regular fa-folder-open" style="font-size:40px;margin-bottom:10px;color:' + carpeta.color + '"></i>'
    html += '<div style="margin-bottom:-7px"><p style="font-weight:bold">' + (carpeta.seccion[0].toUpperCase() + carpeta.seccion.substring(1)) + '</p></div>'
    html += '</div>'

    html += '</div>'
    html += '</a>'

    html += '<div class="d-flex justify-content-center align-items-center elip">'

    html += '<buttom class="btn btn-outline-secondary botonesCarpeta btn-hover dropdown-toggle py-2 px-3"  style="border:none" data-bs-toggle="dropdown" aria-expanded="false" type="buttom">'
    html += '<i class="fa-solid fa-ellipsis-vertical fa-xl elip" ></i>'
    html += '</buttom>'

    html += '<ul class="dropdown-menu dropdown-menu-dark">'
    html += '<li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal' + carpeta.id + '"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>'
    html += '<li class="puntero"><a class="dropdown-item" onclick="deleteSeccion(' + carpeta.id + ')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>'
    html += ' </ul>'
    html += '</div>' // fin dropdown
    html += '</div>' // div de la carpeta
    return html;
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
        console.log(response);
        document.getElementById('contenedorCarpetas').innerHTML = " ";
        let html = dibujarCarpetas(response, id);
        document.getElementById('contenedorCarpetas').innerHTML = html;
    }).fail((err) => {
        console.log(err);
    });
}

async function dibujarHijos(padre, hijos) {
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
        html += '<h1 class="text-black mb-3"><i class="fa-solid fa-folder-open fa-xl" style="margin-right:7px;color:' + seccionActual.color + '"></i><strong>' + seccionActual.seccion + '</strong></h1>'
        html += '<button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" style="margin-left:5px;margin-top:4px;width:25px;height:30px;border-radius:15px">'
        html += '<i class="fa-solid fa-ellipsis-vertical fa-xl "></i>'
        html += '</button>'
        html += '<ul class="dropdown-menu dropdown-menu-dark">'
        html += ' <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalEditar' + seccionActual.id + '"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>'
        html += '<li class="puntero"><a class="dropdown-item" onclick="deleteSeccion(' + seccionActual.id + ')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>'
        html += '</ul>'
        html += '</div>'
        html += '<h3 class="text-black mt-3 mb-4">' + seccionActual.descripcion + '</h3>'
        html += '</div>'
    }
    html += '</div>' // del primer div

    html += '<div class="d-flex justify-content-end mt-2">'
    html += '<div style="margin-right:5px" id="divBtnBuscar">'
    html += '<a class="btn btn-outline-primary" onclick="buscarCarpeta(' + (seccionActual != undefined ? seccionActual.id : 0) + ')"><i class="fa-solid fa-magnifying-glass fa-2x"></i><span class="span-boton">Carpeta</span></a>'
    html += '</div>'
    html += '<div>'
    html += '<a class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal' + padre + '" id="' + padre + '"><i class="fa-solid fa-plus fa-2x"></i><span class="span-boton">Carpeta</span></a>'
    html += '</div>'
    html += '</div>';

    html += '<div class="contenedor-carpetas my-4">'
    html += dibujarCarpetas(hijos, padre, JSON.stringify(seccionesActualizadas));
    html += '</div>'


    // ----------------------------------- modal para CREAR nuevos hijos ------------------------------------------------
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

    /// --------------------------------------     Modal para editar la seccion actual --------------------------------------
    if (seccionActual !== undefined) {
        html += '<div class="modal fade" id="exampleModalEditar' + seccionActual.id + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'
        html += '<div class="modal-dialog">'
        html += '<div class="modal-content">'
        html += '  <div class="modal-header bg-black">'
        html += '   <h5 class="modal-title text-white">Editar Carpeta</h5>'

        html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
        html += '  </div>'
        html += '  <div class="modal-body">'
        html += '<h3 class="text-black mt-2 mb-4">Editar datos de Carpeta <strong>' + seccionActual.seccion + '</strong></h3>'

        html += '<div class="mb-3">'
        html += '<label  class="form-label"><strong>Nombre:</strong></label>'
        html += '<input type="text" class="form-control" id="seccion' + seccionActual.id + '" placeholder="Ingrese nombre" value="' + seccionActual.seccion + '">'
        html += '</div>'

        html += '<div class="mb-3">'
        html += '<label  class="form-label"><strong>Descripción:</strong></label>'
        if (seccionActual.descripcion != "") {
            html += '<textarea class="form-control" rows="5" id="descripcion' + seccionActual.id + '" >' + seccionActual.descripcion + '</textarea>'
        } else {
            html += '<textarea class="form-control" rows="5" id="descripcion' + seccionActual.id + '" placeholder="Esta Seccion no tiene descripcion" ></textarea>'
        }
        html += '</div>'

        html += '<div class="mb-3">'
        html += '<label  class="form-label"><strong>Color:</strong></label>'
        html += '<input type="color" class="form-control w-25 puntero" id="color' + seccionActual.id + '" value="' + seccionActual.color + '">'
        html += '</div>'

        html += '<div class="w-100 mt-2" id="alertas' + seccionActual.id + '">'
        html += '</div>'

        html += '</div>'
        html += '<div class="modal-footer">'
        html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>'
        html += '<a class="btn btn-success" id="botonCrear" onclick="updateSeccion(' + seccionActual.id + ',' + seccionActual.id + ',1)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'

        html += '</div>'
        html += '</div>'
        html += '</div>'
        html += '</div>'
    }
    console.log('seccionActual', seccionActual);
    document.getElementById('dibujar-js').innerHTML = html;
    document.getElementById("dibujar-tabla").innerHTML = "";
    if (padre > 0) {
        await dibujarDocs(padre, seccionActual.seccion);
    }
    hijos.forEach(seccion => {
        console.log('seccion', seccion.id);
        $("#select" + seccion.id).select2({
            dropdownParent: $("#exampleModal" + seccion.id)
        });
    })
}

function dibujarCarpetas(hijos, padre, secciones) {
    let seccionesActualizadas = JSON.parse(secciones)
    var html = "";

    if (hijos.length === 0) {
        html = "";
        html += '<section class=""  id="contenedorCarpetas">'
        html += '<div class=" d-flex justify-content-center" style="flex-wrap:wrap">'
        html += '<div class="alert  px-5 py-2 mt-3 w-100 ">';
        html += '<div class="d-flex justify-content-center align-items-center">';
        html += '<h4 class="" style="color:red">No Existen Carpetas</h4>';
        html += "</div>";
        html += "</div>";
        html += '</div>'
        html += '</section>'
    } else {
        html = ""
        html += '<section id="contenedorCarpetas">'
        html += '<div class=" d-flex justify-content-center" style="flex-wrap:wrap">'
        hijos.forEach(hijo => {
            console.log('hijo', hijo);
            html += colorCarpetas(hijo)
            html += '</div>'
            // ----------------------------------- modal para editar por cada hijo ----------------------------------
            html += '<div class="modal fade" id="exampleModal' + hijo.id + '" tabindex="-1" aria-labelledby="exampleModalLabel' + hijo.id + '" aria-hidden="true">'
            html += '<div class="modal-dialog">'
            html += '<div class="modal-content">'
            html += '  <div class="modal-header bg-black">'
            html += '   <h5 class="modal-title text-white">Editar</h5>'
            html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
            html += '  </div>'
            html += '  <div class="modal-body">'
            html += '<h3 class="text-black mt-2 mb-4">Edite la carpeta <strong>' + hijo.seccion + '</strong></h3>'

            html += '<div class="mb-3">'
            html += '<label  class="form-label"><strong>Nombre:</strong></label>'
            html += '<input type="text" class="form-control" id="seccion' + hijo.id + '" value="' + hijo.seccion + '">'
            html += '</div>'

            html += '<div class="mb-3">'
            html += '<label for="exampleFormControlInput1" class="form-label"><strong>Descripción:</strong></label>'
            if (hijo.descripcion == "") {
                html += '<textarea class="form-control" rows="5" id="descripcion' + hijo.id + '" placeholder="Esta Sección no tiene descripción"></textarea>'
            } else {
                html += '<textarea class="form-control" rows="5" id="descripcion' + hijo.id + '" >' + hijo.descripcion + '</textarea>'
            }
            html += '</div>'

            html += '<div class="mb-3">'
            html += '<label class="form-label"><strong>Color:</strong></label>'
            html += '<input type="color" class="form-control w-50 puntero" id="color' + hijo.id + '" value="' + hijo.color + '">'
            html += '</div>'

            html += '<div class="mb-3">'
            html += '<div class="w-100">'
            html += '<label class="form-label"><strong>Mover Carpeta:</strong></label>'
            html += '</div>'

            html += '<div class="mb-3">'
            html += '<select style="width:50%" id="select' + hijo.id + '" class="js-example-basic-single" >'
            console.log('sec', seccionesActualizadas);
            seccionesActualizadas.forEach(seccion => {
                html += '<optgroup label="' + seccion.seccion + '"></optgroup>'
                html += '<option value="' + seccion.id + '">' + seccion.path + '</option>'
                html += '</optgroup>'
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
        html += '</section>'
    }
    return html;
}

async function dibujarDocs(id, nombreCarpeta) {
    let documentos = await traerDocs(id)
    var html2 = "";
    html2 += '<h3 class="mb-3 mt-5 text-black">Documentos de     <strong>' + nombreCarpeta + '</strong></h3>'
    html2 += '<div class="d-flex mb-3 justify-content-end ">'
    html2 += '<a class="btn btn-warning" style="margin-right:3px" data-bs-toggle="modal" data-bs-target="#exampleModal' + id + '" id="' + id + '"><i class="fa-solid fa-plus fa-2x"></i></i> <span class="span-boton">Documento</span></a>'
    html2 += "</div>";

    html2 += '<table class="table" style="min-width:1000px" id="tablaDocsUltimo">';
    html2 += '<thead class="table-dark">';
    html2 += '<tr class="" style="text-transform:uppercase">';
    html2 += "<th>N°</th>";
    html2 += '<th class="">Alias</th>';
    html2 += '<th class="">Formulario</th>';
    html2 += '<th class="">Datos</th>';
    html2 += '<th class="">Responsable</th>';
    html2 += '<th class="">Fecha</th>';
    html2 += '<th class="">Estado</th>';
    html2 += '<th class="">Archivo</th>';
    // html2 += '<th class="col-1">Acciones</th>';
    html2 += "</tr>";
    html2 += "</thead>";
    html2 += '<tbody class="contenido" id="contenido">';
    if (documentos.length > 0) {
        documentos.forEach((documento, index) => {
            html2 += "<tr>"
            html2 += "<td>" + (parseInt(index) + 1) + "</td>"
            html2 += "<td>" + documento.alias + "</td>"
            html2 += "<td>" + documento.formulario + "</td>"
            html2 += '<td><buttom class="btn btn-secondary" style="margin-left:12px" data-bs-toggle="modal" data-bs-target="#exampleModalVer' + documento.id + '">Ver</buttom></td>'; // hacer este boton modal
            html2 += "<td>" + documento.responsable + "</td>"
            html2 += '<td>' + documento.created_at.split(" ")[0] + '</td>'
            html2 += '<td>'
            if (documento.status == 0) {
                html2 += '<span class="badge badge-pill bg-danger" style="margin-left:15px"><i class="fa-solid fa-circle-exclamation fa-lg"></i></span>'
            } else {
                html2 += '<span class="badge badge-pill bg-success" style="margin-left:15px"><i class="fa-solid fa-circle-check fa-lg"></i></span>'
            }
            html2 += '</td>'
            html2 += '<td>'
            const urlA = "'" + documento.path + "'";
            const nombreA = "'" + documento.codigo + "'"
            html2 += '<buttom title="Ver Documento" class="btn btn-outline-primary" style="margin-right:5px" onclick="abrirPdf(' + urlA + "," + nombreA + ')"><i class="fa-solid fa-file-pdf fa-2x"></i></buttom>';
            html2 += '<buttom title="Descargar Documento" class="btn btn-primary"><i class="fa-solid fa-file-pdf fa-2x"></i></buttom>';
            html2 += "</td>";
            // html2 += "<td>";
            // html2 += '<buttom class="btn btn-warning" style="margin-right:5px"><i class="fa-regular fa-pen-to-square fa-2x"></i></buttom>';
            // html2 +='<buttom class="btn btn-danger"><i class="fa-solid fa-trash-can fa-2x"></i></buttom>';
            // html2 += "</td>";
            html2 += "</tr>";

            // <!---------------------------------------------      Modal ---------------------------------->
            html2 += '<div class="modal fade" id="exampleModalVer' + documento.id + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">';
            html2 += ' <div class="modal-dialog modal-dialog-centered">';
            html2 += ' <div class="modal-content">';
            html2 += ' <div class="modal-header bg-black ">';
            html2 += ' <h5 class="modal-title text-white" id="exampleModalLabel">Metadatos del Documento <strong>' + documento.codigo + '</strong></h5>';
            html2 += '<button type="button" class="btn text-white" style="font-size:13px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
            html2 += ' </div>';
            html2 += '  <div class="modal-body">';

            let claves = documento.keywords
            let datos = JSON.parse(documento.data)
            html2 += "<p><strong>KEYWORDS</strong></p>";
            html2 += "<p>" + claves + "</p>";
            datos.forEach(dato => {
                html2 += "<p><strong>" + dato.nombre.toUpperCase() + "</strong></p>";
                html2 += "<p>" + dato.valor + "</p>";
            })
            html2 += "  </div>";
            html2 += ' <div class="modal-footer">';
            html2 +=
                ' <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>';
            html2 += "  </div>";
            html2 += "</div>";
            html2 += "</div>";
            html2 += "</div>";
        });
    }
    html2 += "</tbody>";
    html2 += "</table>";

    html2 += '</tbody>';
    document.getElementById("dibujar-tabla").innerHTML = html2;
    $("#tablaDocsUltimo").DataTable();
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

async function updateSeccion(padre, hijo, tipo) {
    var html = "";
    const seccion = document.getElementById('seccion' + hijo).value
    const descripcion = document.getElementById('descripcion' + hijo).value
    const color = document.getElementById('color' + hijo).value

    const datos = new FormData()
    datos.append('hijo', hijo);
    datos.append('padre', padre);
    datos.append('seccion', seccion);
    datos.append('descripcion', descripcion);
    datos.append('color', color);
    if (tipo == 1) {
        datos.append('tipo', 'updatePadre');
    } else {
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
                url: URL_BASE + '/seccion/delete',
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
                        dibujarHijos(response.padre, response.hijos)
                    })
                } else if (response.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ERROR',
                        html: '<strong>'+response.carpeta+'</strong> '+ response.error
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