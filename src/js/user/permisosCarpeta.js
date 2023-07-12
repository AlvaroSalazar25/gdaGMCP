const URL_BASE = 'http://localhost/gdagmcp';
const token = JSON.parse(localStorage.getItem('token'))
const CARPETA_BASE = '/base';

let secciones;
let roles;
let permisosDefault = [
    {
        "id": 2,
        "status": false,
        "nombre": "Crear_Carpeta",
        "type": "carpeta",
        "descripcion": "Permiso para crear carpetas",
    },
    {
        "id": 3,
        "status": false,
        "nombre": "Editar_Carpeta",
        "type": "carpeta",
        "descripcion": "Permiso para Editar,Mover,Eliminar la carpeta",
    },
    {
        "id": 4,
        "status": false,
        "nombre": "Ver_Documentos",
        "type": "documento",
        "descripcion": "Permiso para visualizar el documento",
    },
    {
        "id": 5,
        "status": false,
        "nombre": "Mover_Documentos",
        "type": "documento",
        "descripcion": "Permiso para mover de carpeta los documentos",
    },
    {
        "id": 6,
        "status": false,
        "nombre": "Crear_Documento",
        "type": "documento",
        "descripcion": "Permiso para Crear un documento",
    },
    {
        "id": 7,
        "status": false,
        "nombre": "Editar_Documento",
        "type": "documento",
        "descripcion": "Permiso para Editar la metadata del documento",
    },
    {
        "id": 8,
        "status": false,
        "nombre": "Eliminar_Documento",
        "type": "documento",
        "descripcion": "Permiso para Eliminar el documento",
    },
    {
        "id": 9,
        "status": false,
        "nombre": "Descargar_Documento",
        "type": "documento",
        "descripcion": "Permiso para Descargar los documentos",
    },
]
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

function traerSeccion(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            data: {
                "tipo": 'findCarpeta',
                "id": id
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
            resolve(response)

        }).fail((err) => {
            reject(err);
        });
    })
}

function traerHistorial(id) {
    return new Promise((resolve, reject) => {
        let datos = [];
        $.ajax({
            data: {
                "idSeccion": id,
                "tipo": "historial",
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
                    resolve(datos);
                }
                $.each(response, (index, dato) => {
                    datos.push(dato);
                    if (response.length == index + 1) {
                        resolve(datos);
                    }
                });
            })
            .fail((err) => {
                reject(err);
            });
    });
}

async function dibujarCarpeta(id) {
    var html = "";
    document.getElementById('contenedor-titulo').innerHTML = "";
    let seccionActual = await traerSeccion(id);
    let historial = await traerHistorial(id);

    html += '<div class="d-flex justify-content-center padreAtras">'
    html += '<div class="d-flex justify-content-center hijoAtras">'
    html += '<a class=" btn btn-outline-danger ' + (seccionActual == undefined ? 'noVisible' : '') + ' " onclick="dibujarAtras()"><i class="fa-solid fa-arrow-left-long fa-2x"></i> <span class="span-boton">Atrás</span></a>'
    html += '</div>'
    if (seccionActual == undefined) {
        html += '<h1 class="text-black mb-3"><strong>Administrar Carpetas</strong></h1>'
    } else {
        html += '<div class="d-flex flex-column justify-content-center">'
        html += '<div class="d-flex justify-content-center align-items-center">'
        html += '<i class="fa-solid fa-folder-open fa-xl" style="margin-right:7px;font-size:35px;color:' + seccionActual.color + '"></i>'
        html += '<div class="d-flex justify-content-center align-items-center">'
        html += '<h1 class="text-black m-0 p-0"><strong>' + (seccionActual.seccion[0].toUpperCase() + seccionActual.seccion.substring(1)) + '</strong></h1>'
        html += '</div>'
        html += '<div class="d-flex justify-content-center align-items-center mb-2" style="margin-left:5px">'
        html += '<button type="button" class="btn btn-outline-secondary dropdown-toggle py-0" data-bs-toggle="dropdown" style="width:25px;height:30px;border:none">'
        html += '<i class="fa-solid fa-ellipsis-vertical" style="font-size:25px"></i>'
        html += '</button>'

        html += '<ul class="dropdown-menu dropdown-menu-dark">'
        html += ' <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalEditar' + seccionActual.id + '"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>'
        html += ' <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalInfo' + seccionActual.id + '"><i class="fa-solid fa-circle-info" style="margin-right:7px"></i>Información</a></li>'
        html += '<li class="puntero"><a class="dropdown-item" onclick="deleteSeccion(' + seccionActual.id + ')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>'
        html += '</ul>'
        html += '</div>'
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

    html += '<div class="w-100 mt-2">';
    if (seccionActual != undefined) {
        let paths = (CARPETA_BASE + seccionActual.path).split('/')
        let removes = paths.shift();
        paths.forEach(path => {
            var nombre = path.replaceAll('_', ' ');
            console.log('nombre', nombre);
            html += `<a class="" style="text-decoration:none!important;color:#969798"><strong>` + (nombre[0].toUpperCase() + nombre.substring(1)) + '</strong></a> / ' + " " + '';
        })
    }
    html += '</div>';

    /*=============================================================================================================//
                                                Contenedor hijos
    //==============================================================================================================*/
    html += '<div class="contenedor-carpetas mt-3 mb-5 py-3 px-4" style="min-width:900px" id="contenedorCarpetas" >'



    html += '</div>'


    /*=============================================================================================================//
                                                Modal para EDITAR el padre
    //==============================================================================================================*/
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
    html += '<a class="btn btn-success" id="botonCrear" onclick="updateSeccion(' + seccionActual.idPadre + ',' + seccionActual.id + ',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'

    html += '<div class="w-100 mt-2" id="alertas">'
    html += '</div>'

    html += '</div>'
    html += '<div class="modal-footer">'
    html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>'
    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'

    /*=============================================================================================================//
                                                modal para Mostrar Informacion de carpeta
            //==============================================================================================================*/

    html += '<div class="modal fade" id="exampleModalInfo' + seccionActual.id + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >'
    html += '<div class="modal-dialog modal-lg" style="min-width:800px !important" >'
    html += '<div class="modal-content">'
    html += '  <div class="modal-header bg-black">'
    html += '   <h5 class="modal-title text-white">Información de Carpeta</h5>'
    html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
    html += '  </div>'
    html += '  <div class="modal-body">'
    if (seccionActual == false) {
        html += '   <h5 class="modal-title text-white">Modificaciones</h5>'
    } else {
        html += '<div class="d-flex justify-content-between">'
        html += '<div style="width:160px"></div>'
        html += '<h3 class="text-black mt-2 mb-4"> <i class="fa-solid fa-folder-open" style="color:' + seccionActual.color + '"></i> ' + (seccionActual.seccion[0].toUpperCase() + seccionActual.seccion.substring(1)) + '</h3>'
        html += '<div><button type="button" class="btn btn-warning" style="font-size:13.4px" onclick="historialDocs(' + seccionActual.id + ')"><i class="fa-solid fa-rotate-right fa-flip-horizontal" style="margin-right:5px"></i>Historial Documentos</button></div>'
        html += '</div>'
    }

    html += '<div id="historialDoc">'
    html += '<table class="table table-hover align-middle" id="tablaHistorialCarpeta">'
    html += '<thead class="table-secondary ">'
    html += '<tr style="text-transform:uppercase">'
    html += '<th >#</th>'
    html += '<th >Usuario</th>'
    html += '<th >Acción</th>'
    html += '<th style="width:170px">Carpeta</th>'
    html += '<th >Fecha</th>'
    html += '<th  >Detalle</th>'
    html += '</tr>'

    html += '</thead>'
    html += '<tbody class="contenido" id="contenido">'
    historial.forEach((dato, index) => {
        var carpeta = dato.nombreSeccion != null ? dato.nombreSeccion : dato.seccion;
        html += `<tr title="${carpeta[0].toUpperCase() + carpeta.substring(1)}">`
        html += `<td >${index + 1}</td>`
        html += `<td style="min-width:112px"> ${dato.nombre != null ? dato.nombre : dato.user}</td>`
        html += `<td class="${dato.accion == 'create' ? 'text-success' : dato.accion == 'delete' ? 'text-danger' : 'text-primary'}"> ${dato.accion[0].toUpperCase() + dato.accion.substring(1)}</td>`
        html += `<td >${carpeta[0].toUpperCase() + carpeta.substring(1)}</td>`
        html += `<td style="min-width:172px"> ${dato.created_at}</td>`
        html += '<td ">';
        html += '<div class="d-flex justify-content-center dropend">'
        html += '<button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"  style="border-radius:15px;border:0px">'
        html += '<i class="fa-solid fa-ellipsis-vertical fa-2x"></i>'
        html += '</button>'
        html += ' <div class="dropdown-menu dropdown-menu-dark p-4" style="min-width:400px" >'
        html += '<div class="d-flex" style="font-size:13px">';
        html += '<div class="d-flex w-100 justify-content-center" style="font-size:13px"><i class="fa-solid fa-folder-open" style="margin-right:5px"></i> <strong>' + (carpeta[0].toUpperCase() + carpeta.substring(1)) + '</strong>';
        html += '</div>';
        html += '</div>';
        html += '<div class="row" style="font-size:13px">';
        var data = JSON.parse(dato.data);

        for (var key in data.new) {
            html += '<div style="display:block;height:auto;">';
            html += '<div style="min-width:100px"><strong>' + (key[0].toUpperCase() + key.substring(1)) + ':</strong></div>'
            html += '<div > <span class="text-info">New </span> => ' + (data.new[key] != null ? data.new[key] : 'null') + '</div>';
            html += '<div > <span class="text-warning">Old </span> => ' + (data.old[key] != null ? data.old[key] : 'null') + '</div>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';
        html += '</td>';
        html += '</tr>';
    })
    html += '</tbody>'
    html += '</table>'
    html += '</div>'

    html += '<div class="w-100 mt-2" id="alertas">'
    html += '</div>'

    html += '</div>'
    html += '<div class="modal-footer">'
    html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>'
    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'



    document.getElementById('dibujar-js').innerHTML = html;
    document.getElementById("dibujar-tabla").innerHTML = "";
    waitResponse('#contenedorCarpetas');
    $("#select" + id).select2({
        dropdownParent: $("#exampleModalEditar" + id)
    });
    $("#tablaHistorialCarpeta").DataTable({
        columnDefs: [
            {
                targets: [5], // Índice de la columna "Detalle" (empezando desde 0)
                searchable: false // La columna "Detalle" no será incluida en la búsqueda
            }
        ],
        language: {
            url: URL_BASE + '/public/build/js/varios/DataTable_es_es.json'
        }
    });
    await dibujarUsers('contenedorCarpetas', id);
    // await dibujarUnidades('contenedorUnidades', id);
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

async function dibujarUsers(contenedor, carpeta, tipo = 1, usuarios = []) {
    if (usuarios.length == 0) {
        usuarios = await traerUsers();
    }
    let unidades = await traerUnidades();
    // Combinar los arrays
    let combinedArray = combinarArrays(usuarios, unidades);
    var html = '';
    html += '<h4><strong>Usuarios</strong></h4>'
    html += '<table class="table" style="min-width:900px" id="tablaUsuariosPermisos">'
    html += '<thead class="table-dark">'
    html += '<tr class="" style="text-transform:uppercase">'
    html += '<th >N°</th>'
    html += '<th>Nombre</th>'
    html += '<th>Rol</th>'
    html += '<th>Unidad</th>'
    html += '<th>Estado</th>'
    html += '<th>Jefe</th>'
    html += '<th>Usuarios</th>'
    html += '<th class="col-1">Acciones</th>'
    html += '</tr>'
    html += '</thead>'
    html += '<tbody class="contenido" id="contenido">'
    combinedArray.forEach((dato, index) => {
        let estado = dato.estado == '1' ? 'btn-outline-success' : 'btn-outline-danger'
        //console.log(dato);
        html += '<tr class="">'
        html += '<td>' + (parseInt(index) + 1) + '</td>'
        html += `<td class="col">`
        html += '<div class="d-flex justify-content-between">'
        html += '<div class="" style="min-width:180px">'
        html +=`<i class="fa-solid ${dato.idUser != "-" ? "fa-user" : "fa-building"}" style="margin-right:6px"></i>`
        html += `<span>${dato.nombre}</span>`
        html += '</div>'
        if (dato.idUser != "-") {
        html += '<div class="d-flex justify-content-start w-100" >'
            html += '<button type="button" class="btn btn-outline-secondary" style="border-radius:15px;border:0px" onclick="dibujarHistorialUser('+carpeta+','+dato.idUser+')">'
            html += '<i class="fa-solid fa-ellipsis-vertical fa-xl"></i>'
            html += '</button>'
        html += '</div>'

        }
        html += '</div>'
        html += '</div>'
        html += '</td>'
        html += '<td class="col">' + dato.rol + '</td>'
        html += '<td class="col">' + dato.unidad + '</td>'
        if (dato.estado != '-') {
            html += '<td class="col"><buttom type="buttom" disabled class="botonDisabled btn btn-rounded ' + estado + '"  style="">' + (dato.estado == '1' ? 'Activo' : 'Inactivo') + '</buttom></td>'
        } else {
            html += '<td class="col">' + dato.estado + '</td>'
        }
        html += '<td class="col">' + dato.jefe + '</td>'
        html += '<td class="col">' + dato.usuarios + '</td>'
        html += '<td class="col">'
        html += '<div class="d-flex">'
        let tipoDato = (dato.idUnidad != '-' ? 1 : 0);
        let valorDato = (dato.idUnidad != '-' ? dato.idUnidad : dato.idUser)
        html += `<a class="btn btn-primary  botonPermiso" id="${tipo}" onclick="modalPermiso('${carpeta}','${valorDato}',${tipoDato})" style="margin:0px 5px">Permisos</a>`
        html += '<div>'
        html += '</td>'
        html += '</tr>'
    });
    html += '</tbody>'
    html += '</table>'
    document.getElementById(contenedor.toString()).classList.add('mt-5')
    document.getElementById(contenedor.toString()).innerHTML = html;
    $('#tablaUsuariosPermisos').DataTable({
        language: {
            url: URL_BASE + '/public/build/js/varios/DataTable_es_es.json'
        }
    });
}

async function dibujarHistorialUser(carpeta,id){
    let dato = await findUserById(id);
    let permisosUser ;
    permisosUser = await traerPermisosUser(carpeta,dato.id);
    if(permisosUser.length == 0){
        permisosUser = await traerPermisosUnidad(carpeta,dato.idUnidad);
        //seguir aqui para terminar el historial
    }
    console.log('permisos User',permisosUser);

}

async function dibujarModalHistorialDoc(id) {
    var html = "";
    let documento = await traerDocumento(id);
    let historial = await traerHistorialDoc(id);
    /* ================================================================================================================
            Modal Historial del documento
    ==================================================================================================================*/
    html += '<div class="modal fade" id="exampleModalHistorialByDoc' + documento.id + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">';
    html += ' <div class="modal-dialog modal-lg">';
    html += ' <div class="modal-content">';
    html += ' <div class="modal-header bg-black ">';
    html += ' <h5 class="modal-title text-white" id="exampleModalLabel">Historial Documento <strong>' + documento.codigo + '</strong></h5>';
    html += '<button type="button" class="btn text-white" style="font-size:13px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
    html += ' </div>';
    html += '  <div class="modal-body">';
    html += '<h3 class="text-black mt-2 mb-4"> <i class="fa-solid fa-file-pdf" "></i> ' + (documento.alias != "" ? documento.alias : documento.codigo) + '</h3>'
    html += '<div id="historialDoc">'
    html += '<table class="table table-hover align-middle" id="tablaHistorialByDoc">'
    html += '<thead class="table-secondary ">'
    html += '<tr style="text-transform:uppercase">'
    html += '<th >#</th>'
    html += '<th >Usuario</th>'
    html += '<th >Acción</th>'
    html += '<th style="width:170px">Carpeta</th>'
    html += '<th >Fecha</th>'
    html += '<th  >Detalle</th>'
    html += '</tr>'

    html += '</thead>'
    html += '<tbody class="contenido" id="contenido">'
    historial.forEach((dato, index) => {
        console.log('dato', dato);
        var carpeta = dato.nombreSeccion != null ? dato.nombreSeccion : dato.seccion;
        html += `<tr title="${carpeta[0].toUpperCase() + carpeta.substring(1)}">`
        html += `<td >${index + 1}</td>`
        html += `<td style="min-width:112px"> ${dato.nombre != null ? dato.nombre : dato.user}</td>`
        html += `<td class="${dato.accion == 'create' ? 'text-success' : dato.accion == 'delete' ? 'text-danger' : 'text-primary'}"> ${dato.accion[0].toUpperCase() + dato.accion.substring(1)}</td>`
        html += `<td >${carpeta[0].toUpperCase() + carpeta.substring(1)}</td>`
        html += `<td style="min-width:172px"> ${dato.created_at}</td>`
        html += '<td ">';
        html += '<div class="d-flex justify-content-center dropend">'
        html += '<button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"  style="border-radius:15px;border:0px">'
        html += '<i class="fa-solid fa-ellipsis-vertical fa-2x"></i>'
        html += '</button>'
        html += ' <div class="dropdown-menu dropdown-menu-dark p-4" style="min-width:400px" >'
        html += '<div class="d-flex" style="font-size:13px">';
        html += '<div class="d-flex w-100 justify-content-center" style="font-size:13px"><i class="fa-solid fa-file-pdf" style="margin-right:5px"></i> <strong>' + dato.documento + '</strong>';
        html += '</div>';
        html += '</div>';
        html += '<div class="row" style="font-size:13px">';
        var data = JSON.parse(dato.data);
        for (var key in data.new) {
            html += '<div style="display:block;height:auto;">';
            html += '<div style="min-width:100px"><strong>' + (key[0].toUpperCase() + key.substring(1)) + ':</strong></div>'
            if (key != 'data') {
                html += '<div > <span class="text-info">New </span> => ' + (data.new[key] != null ? data.new[key] : 'null') + '</div>';
                if (data.old != null) {
                    html += '<div > <span class="text-warning">Old </span> => ' + (data.old[key] != null ? data.old[key] : 'null') + '</div>';
                }
            } else {
                var dataDoc = JSON.parse(data.new.data);
                html += '<div style="display:block;height:auto;">';
                if (data.old !== null) {
                    for (let i = 0; i < dataDoc.length; i++) {
                        var dataDocOld = JSON.parse(data.old.data);
                        html += '<div> <span class="text-info">New => </span>' + (dataDoc[i].nombre != null ? dataDoc[i].nombre : 'null') + '  => ' + (dataDoc[i].valor != null ? dataDoc[i].valor : 'null') + '</div>';
                        html += '<div> <span class="text-warning">Old =></span> ' + (dataDocOld[i].nombre != null ? dataDocOld[i].nombre : 'null') + ' => ' + (dataDocOld[i].valor != null ? dataDocOld[i].valor : 'null') + '</div>';
                    }
                } else {
                    for (let i = 0; i < dataDoc.length; i++) {
                        html += '<div> <span class="text-info">New => </span>' + (dataDoc[i].nombre != null ? dataDoc[i].nombre : 'null') + '  => ' + (dataDoc[i].valor != null ? dataDoc[i].valor : 'null') + '</div>';
                    }
                }
                html += '</div>';
            }
            html += '</div>';
        }
        html += '</div>';

        html += '</div>';
        html += '</td>';
        html += '</tr>';

    })
    html += '</tbody>'
    html += '</table>'
    html += '</div>'
    html += '<div>';

    html += '</div>';
    html += ' <div class="modal-footer mt-3">';
    html += ' <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>';
    html += "  </div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    document.getElementById("modales").innerHTML = html;
    $("#tablaHistorialByDoc").DataTable({
        columnDefs: [
            {
                targets: [5], // Índice de la columna "Detalle" (empezando desde 0)
                searchable: false // La columna "Detalle" no será incluida en la búsqueda
            }
        ],
        language: {
            url: URL_BASE + '/public/build/js/varios/DataTable_es_es.json'
        }
    });
    $('#exampleModalHistorialByDoc' + documento.id).modal('show');
}

async function historialDocs(id) {
    var html = "";
    await waitResponse('#historialDoc', '374.5px', 2);
    let historial = await traerHistorialDocCarpeta(id);
    html += '<h3 class="text-black mt-2 mb-4"><strong>HISTORIAL DOCUMENTOS</strong></h3>'
    html += '<table class="table table-hover align-middle" id="tablaHistorialDocs">'
    html += '<thead class="table-secondary">'
    html += '<tr style="text-transform:uppercase">'
    html += '<th >#</th>'
    html += '<th >Usuario</th>'
    html += '<th >Acción</th>'
    html += '<th style="width:170px">Documento</th>'
    html += '<th >Fecha</th>'
    html += '<th  >Detalle</th>'
    html += '</tr>'
    html += '</thead>'
    html += '<tbody class="contenido" id="contenido">'
    historial.forEach((dato, index) => {
        console.log('dato', dato);
        var carpeta = dato.nombreSeccion != null ? dato.nombreSeccion : dato.seccion;
        html += `<tr title="${carpeta[0].toUpperCase() + carpeta.substring(1)}">`
        html += `<td >${index + 1}</td>`
        html += `<td style="min-width:112px"> ${dato.nombre != null ? dato.nombre : dato.user}</td>`
        html += `<td class="${dato.accion == 'create' ? 'text-success' : dato.accion == 'delete' ? 'text-danger' : 'text-primary'}"> ${dato.accion[0].toUpperCase() + dato.accion.substring(1)}</td>`
        html += `<td >${dato.documento}</td>`
        html += `<td style="min-width:172px"> ${dato.created_at}</td>`
        html += '<td ">';
        html += '<div class="d-flex justify-content-center dropend">'
        html += '<button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"  style="border-radius:15px;border:0px">'
        html += '<i class="fa-solid fa-ellipsis-vertical fa-2x"></i>'
        html += '</button>'
        html += ' <div class="dropdown-menu dropdown-menu-dark p-4" style="min-width:400px" >'
        html += '<div class="d-flex" style="font-size:13px">';
        html += '<div class="d-flex w-100 justify-content-center" style="font-size:13px"><i class="fa-solid fa-file-pdf" style="margin-right:5px"></i> <strong>' + dato.documento + '</strong>';
        html += '</div>';
        html += '</div>';
        html += '<div class="row" style="font-size:13px">';
        var data = JSON.parse(dato.data);
        for (var key in data.new) {
            html += '<div style="display:block;height:auto;">';
            html += '<div style="min-width:100px"><strong>' + (key[0].toUpperCase() + key.substring(1)) + ':</strong></div>'
            if (key != 'data') {
                html += '<div > <span class="text-info">New </span> => ' + (data.new[key] != null ? data.new[key] : 'null') + '</div>';
                if (data.old != null) {
                    html += '<div > <span class="text-warning">Old </span> => ' + (data.old[key] != null ? data.old[key] : 'null') + '</div>';
                }
            } else {
                var dataDoc = JSON.parse(data.new.data);
                html += '<div style="display:block;height:auto;">';
                if (data.old !== null) {
                    for (let i = 0; i < dataDoc.length; i++) {
                        var dataDocOld = JSON.parse(data.old.data);
                        html += '<div> <span class="text-info">New => </span>' + (dataDoc[i].nombre != null ? dataDoc[i].nombre : 'null') + '  => ' + (dataDoc[i].valor != null ? dataDoc[i].valor : 'null') + '</div>';
                        html += '<div> <span class="text-warning">Old =></span> ' + (dataDocOld[i].nombre != null ? dataDocOld[i].nombre : 'null') + ' => ' + (dataDocOld[i].valor != null ? dataDocOld[i].valor : 'null') + '</div>';
                    }
                } else {
                    for (let i = 0; i < dataDoc.length; i++) {
                        html += '<div> <span class="text-info">New => </span>' + (dataDoc[i].nombre != null ? dataDoc[i].nombre : 'null') + '  => ' + (dataDoc[i].valor != null ? dataDoc[i].valor : 'null') + '</div>';
                    }
                }
                html += '</div>';
            }
            html += '</div>';
        }
        html += '</div>';

        html += '</div>';
        html += '</td>';
        html += '</tr>';

    })
    html += '</tbody>'
    html += '</table>'
    document.getElementById('historialDoc').innerHTML = html;
    $("#tablaHistorialDocs").DataTable({
        columnDefs: [
            {
                targets: [5], // Índice de la columna "Detalle" (empezando desde 0)
                searchable: false // La columna "Detalle" no será incluida en la búsqueda
            }
        ],
        language: {
            url: URL_BASE + '/public/build/js/varios/DataTable_es_es.json'
        }
    });

}
function traerHistorialDocCarpeta(id) {
    return new Promise((resolve, reject) => {
        let datos = [];
        $.ajax({
            data: {
                "idSeccion": id,
                "tipo": "historial",
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + "/documento/datos",
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
                    resolve(datos);
                }
                $.each(response, (index, dato) => {
                    datos.push(dato);
                    if (response.length == index + 1) {
                        resolve(datos);
                    }
                });
            })
            .fail((err) => {
                reject(err);
            });
    });
}

function traerHistorialDoc(id) {
    return new Promise((resolve, reject) => {
        let datos = [];
        $.ajax({
            data: {
                "idDoc": id,
                "tipo": "historialByDoc",
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + "/documento/datos",
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
                    resolve(datos);
                }
                $.each(response, (index, dato) => {
                    datos.push(dato);
                    if (response.length == index + 1) {
                        resolve(datos);
                    }
                });
            })
            .fail((err) => {
                reject(err);
            });
    });
}


function traerUsers() {
    return new Promise((resolve, reject) => {
        let usuarios = []
        $.ajax({
            data: {
                "tipo": 'usuarios'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/user/datos',
            type: 'POST',
            headers: {
                'token': token
            },
            dataType: 'json'
        }).done((response) => {
            //console.log(response);
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
                resolve(usuarios)
            }
            $.each(response, (index, usuario) => {
                usuarios.push(usuario);
                if (response.length == index + 1) {
                    resolve(usuarios)
                }
            })
        }).fail((err) => {
            reject(err);
        });
    })
}

function traerUnidades() {
    return new Promise((resolve, reject) => {
        let unidades = []
        $.ajax({
            data: {
                "tipo": 'unidadSeccion'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/unidad/datos',
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
                resolve(unidades)
            }
            $.each(response, (index, unidad) => {
                unidades.push(unidad);
                if (response.length == index + 1) {
                    resolve(unidades)
                }
            })
        }).fail((err) => {
            reject(err);
        });
    })
}

function combinarArrays(usuarios, unidades) {
    var combinedArray = [];
    // Combinar elementos del array 1
    for (var i = 0; i < usuarios.length; i++) {
        var item1 = usuarios[i];
        var combinedItem = {
            numero: i + 1,
            nombre: item1.nombre,
            rol: item1.rol,
            unidad: item1.unidad,
            estado: item1.estado,
            jefe: '-',
            usuarios: '-',
            acciones: item1.acciones,
            idUser: item1.id,
            idUnidad: '-',

        };
        combinedArray.push(combinedItem);
    }

    // Combinar elementos del array 2
    for (var i = 0; i < unidades.length; i++) {
        var item2 = unidades[i];
        var combinedItem = {
            numero: i + usuarios.length + 1,
            nombre: item2.unidad,
            rol: '-',
            unidad: '-',
            estado: '-',
            jefe: item2.jefe,
            usuarios: item2.usuarios,
            acciones: '-',
            idUnidad: item2.id,
            idUser: '-',
        };
        combinedArray.push(combinedItem);
    }
    return combinedArray
}

function mutarDato(item) {
    var combinedItem = {
        nombre: item.nombre !== undefined ? item.nombre : item.unidad !== undefined ? item.unidad : '',
        rol: item.rol !== undefined ? item.rol : '',
        unidad: item.unidad !== undefined ? item.unidad : '',
        estado: item.estado !== undefined ? item.estado : '',
        jefe: item.jefe !== undefined ? item.jefe : '',
        usuarios: item.usuarios !== undefined ? item.usuarios : '',
        id: item.id,
    };
    return combinedItem;
}

async function dibujarAtras() {
    window.location.href = URL_BASE + "/permisos";
}

function traerPermisosUser(carpeta, usuario) {
    let permisos = []
    return new Promise((resolve, reject) => {
        $.ajax({
            data: {
                "tipo": 'permisosUserCarpeta',
                "idUser": usuario,
                "idSeccion": carpeta
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/user/datos',
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

function traerPermisosUnidad(carpeta, unidad) {
    return new Promise((resolve, reject) => {
        $.ajax({
            data: {
                "tipo": 'permisosUnidadCarpeta',
                "idUnidad": unidad,
                "idSeccion": carpeta
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/unidad/datos',
            type: 'POST',
            headers: {
                'token': token
            },
            dataType: 'json'
        }).done((response) => {
            //console.log(response);
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

function findUserById(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            data: {
                "id": id,
                "tipo": 'usuario'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/user/datos',
            type: 'POST',
            headers: {
                'token': token
            },
            dataType: 'json'
        }).done((response) => {
            //console.log(response);
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

function findUnidadById(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            data: {
                "id": id,
                "tipo": 'unidad'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/unidad/datos',
            type: 'POST',
            headers: {
                'token': token
            },
            dataType: 'json'
        }).done((response) => {
            //console.log(response);
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

async function modalPermiso(carpeta, dato, tipo) {
    let permisos;
    if (tipo == 0) {
        permisos = await traerPermisosUser(carpeta, dato);
        let user = await findUserById(dato);
        if (permisos.length == 0) {
            permisos = await traerPermisosUnidad(carpeta, user.idUnidad);
        }
    } else if (tipo == 1) {
        permisos = await traerPermisosUnidad(carpeta, dato);
    }

    if (permisos.length == 0) {
        crearModalAgregarPermisos(carpeta, dato, tipo);
    } else {
        crearModalEditarPermisos(carpeta, dato, tipo)
    }
}

async function crearModalAgregarPermisos(carpeta, dato, tipo,) {
    if (tipo == 0) {
        dato = await findUserById(dato);
    }
    if (tipo == 1) {
        dato = await findUnidadById(dato);
    }

    dato = mutarDato(dato)
    let iconos = ['fa-solid fa-plus', 'fa-solid fa-edit', 'fa-solid fa-eye', 'fa-solid fa-folder-tree', 'fa-solid fa-plus', 'fa-solid fa-edit', 'fa-solid fa-trash', 'fa-solid fa-download']
    /*=============================================================================================================//
                                                Modal de permisos carpeta y documentos
    //==============================================================================================================*/
    var html = "";
    html += '<div class="modal fade" id="exampleModalPermisosUser" tabindex="-1" aria-labelledby="exampleModalPermisosUser" aria-hidden="true">'
    html += '<div class="modal-dialog">'
    html += '<div class="modal-content">'
    html += '<div class="modal-header bg-black">'
    html += '<h5 class="modal-title text-white">Agregar Permisos</h5>'
    html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
    html += '</div>'
    html += '<div class="modal-body">'
    html += '<h3 class="text-black"><strong>' + dato.nombre.toUpperCase() + '</strong></h3>';

    html += '<h5 class="text-black mt-4 mb-1">Permisos de Carpeta <i class="fa-solid fa-folder-open fa-lg" style="margin-left:5px"></i></h5>';
    html += '<div class="unido_alerta">'

    html += '<div class="mb-2" style="border:1px solid #bcbcbc;border-radius:5px">'
    html += '<div class="row p-3">'

    html += '<div  class="d-flex justify-content-between w-100">'
    html += '<div class="d-flex " >'
    html += '<div  style="width:160px" >'
    html += `<i class="fa-solid fa-eye fa-xl" style="margin-right:5px"></i>`
    html += '<label>Ver Carpeta</label>'
    html += '</div>'
    html += '<input class="form-check-input permiso" id="1" type="checkbox">'
    html += '</div>'

    html += '<div class="d-flex" >'
    html += '<div  style="width:160px" >'
    html += `<i class="fa-solid fa-right-left fa-xl" style="margin-right:5px"></i>`
    html += '<label>Heredar Permisos</label>'
    html += '</div>'
    html += '<input class="form-check-input" id="heredar" type="checkbox">'
    html += '</div>'
    html += '</div>'

    permisosDefault.forEach((permiso, index) => {
        if (permiso.type == "carpeta") {
            html += '<div class="d-flex ' + (permiso.id != 1 ? 'apagar' : '') + '" >'
            html += '<div  style="width:160px" >'
            html += `<i class="${iconos[index]} fa-xl" style="margin-right:5px"></i>`
            html += '<label>' + permiso.nombre.replaceAll("_", " ") + '</label>'
            html += '</div>'
            html += '<input class="form-check-input permiso" id="' + permiso.id + '" type="checkbox">'
            html += '</div>'
        }
    })
    html += '</div>'
    html += '</div>'
    html += '</div>'

    html += '<h5 class="text-black mt-4 mb-1">Permisos de Documento<i class="fa-solid fa-file-pdf fa-lg" style="margin-left:5px"></i></h5>';
    html += '<div class="unido_alerta">'
    html += '<div class="mb-2" style="border:1px solid #bcbcbc;border-radius:5px">'

    html += '<div class="row p-3">'
    permisosDefault.forEach((permiso, index) => {
        if (permiso.type == "documento") {
            html += '<div class="d-flex ' + (permiso.id != 4 ? 'apagar' : '') + '">'
            html += '<div  style="width:160px">'
            html += `<i class="${iconos[index]} fa-xl" style="margin-right:5px"></i>`
            html += '<label>' + permiso.nombre.replaceAll("_", " ") + '</label>'
            html += '</div>'
            html += '<input class="form-check-input permiso" id="' + permiso.id + '"  type="checkbox">'
            html += '</div>'
        }
    })
    html += '</div>'
    html += '</div>'
    html += '</div>'

    html += '<div class="w-100"  id="alertasPermisosUser">'
    html += '</div>'
    html += '</div>'
    html += '<div class="modal-footer mt-2 d-flex justify-content-end">';
    html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>';
    html += `<button type="button" class="btn btn-success" onclick="savePermisos(${carpeta},${dato.id},${tipo},0)"><i class="fa-solid fa-floppy-disk" style="margin-right:3px"></i>Guardar</button>`
    html += '</div>';
    html += '</div>'
    document.getElementById('modales').innerHTML = html;
    $("#selectMover").select2({
        dropdownParent: $("#exampleModalPermisosUser")
    });
    $('#exampleModalPermisosUser').modal('show');
}

async function crearModalEditarPermisos(carpeta, dato, tipo) {
    let permisos;
    let datoUserPermiso = false;
    let accion = 1;
    if (tipo == 0) {
        dato = await findUserById(dato);
        permisos = await traerPermisosUser(carpeta, dato.id);
        if (permisos.length == 0) {
            datoUserPermiso = true;
            permisos = await traerPermisosUnidad(carpeta, dato.idUnidad);
            accion = 0;
        }
    }
    if (tipo == 1) {
        dato = await findUnidadById(dato);
        permisos = await traerPermisosUnidad(carpeta, dato.id);
    }
    dato = mutarDato(dato)
    let permisosUN = JSON.parse(permisos[0].permisos);
    console.log('permisos', permisos);
    let iconos = ['fa-solid fa-plus', 'fa-solid fa-edit', 'fa-solid fa-eye', 'fa-solid fa-folder-tree', 'fa-solid fa-plus', 'fa-solid fa-edit', 'fa-solid fa-trash', 'fa-solid fa-download']
    /*=============================================================================================================//
                                                Modal de permisos carpeta y documentos
    //==============================================================================================================*/
    var html = "";
    html += '<div class="modal fade" id="exampleModalPermisosUser" tabindex="-1" aria-labelledby="exampleModalPermisosUser" aria-hidden="true">'
    html += '<div class="modal-dialog">'
    html += '<div class="modal-content">'
    html += '<div class="modal-header bg-black">'
    html += '<h5 class="modal-title text-white">Editar Permisos</h5>'
    html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
    html += '</div>'
    html += '<div class="modal-body">'
    html += '<h3 class="text-black"><strong>' + dato.nombre.toUpperCase() + '</strong></h3>';

    html += '<h5 class="text-black mt-4 mb-1">Permisos de Carpeta <i class="fa-solid fa-folder-open fa-lg" style="margin-left:5px"></i></h5>';
    html += '<div class="unido_alerta">'

    // ============================================================================
    html += '<div class="mb-2" style="border:1px solid #bcbcbc;border-radius:5px">'
    html += '<div class="row p-3">'

    html += '<div  class="d-flex justify-content-between w-100">'
    html += '<div class="d-flex " >'
    html += '<div  style="width:160px" >'
    html += `<i class="fa-solid fa-eye fa-xl" style="margin-right:5px"></i>`
    html += '<label>Ver Carpeta</label>'
    html += '</div>'
    html += '<input class="form-check-input permiso" id="1" type="checkbox"' + (permisos[0].verSeccion == true ? 'checked' : '') + '>'
    html += '</div>'

    html += '<div class="d-flex" >'
    html += '<div  style="width:160px" >'
    html += `<i class="fa-solid fa-right-left fa-xl" style="margin-right:5px"></i>`
    html += '<label>Heredar Permisos</label>'
    html += '</div>'
    html += '<input class="form-check-input" id="heredar" type="checkbox">'
    html += '</div>'
    html += '</div>'
    permisosUN.forEach((permiso, index) => {
        if (permiso.type == "carpeta") {
            html += '<div class="d-flex" >'
            html += '<div  style="width:160px" >'
            html += `<i class="${iconos[index]} fa-xl" style="margin-right:5px"></i>`
            html += '<label>' + permiso.nombre.replaceAll("_", " ") + '</label>'
            html += '</div>'
            html += '<input class="form-check-input permiso" id="' + permiso.id + '" type="checkbox" ' + (permiso.status == true ? 'checked' : '') + '>'
            html += '</div>'
        }
    })
    html += '</div>'
    html += '</div>'
    html += '</div>'

    html += '<h5 class="text-black mt-4 mb-1">Permisos de Documento<i class="fa-solid fa-file-pdf fa-lg" style="margin-left:5px"></i></h5>';
    html += '<div class="unido_alerta">'
    html += '<div class="mb-2" style="border:1px solid #bcbcbc;border-radius:5px">'

    html += '<div class="row p-3">'
    permisosUN.forEach((permiso, index) => {

        if (permiso.type == "documento") {
            html += '<div class="d-flex ">'
            html += '<div  style="width:160px">'
            html += `<i class="${iconos[index]} fa-xl" style="margin-right:5px"></i>`
            html += '<label>' + permiso.nombre.replaceAll("_", " ") + '</label>'
            html += '</div>'
            html += '<input class="form-check-input permiso" id="' + permiso.id + '"  type="checkbox" ' + (permiso.status == true ? 'checked' : '') + '>'
            html += '</div>'
        }
    })
    html += '</div>'
    html += '</div>'
    html += '</div>'

    html += '<div class="w-100"  id="alertasPermisosUser">'
    html += '</div>'
    html += '</div>'
    html += '<div class="modal-footer mt-2 d-flex justify-content-between">';
    if (datoUserPermiso == true) {
        html += `<div class="form-text">* Permisos Heredados de la Unidad <strong>${dato.unidad}</strong></div>`
    } else {

        html += '<div>'
        console.log('datooo', dato);
        html += `<button type="button" class="btn btn-primary" onclick="heredarUnidad(${dato.id},${carpeta})">Heredar de <strong>Unidad</strong></button>`
        html += '</div>'
    }
    html += '<div>'
    html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>';
    html += `<button type="button" class="btn btn-success" style="margin-left:5px" onclick="savePermisos(${carpeta},${dato.id},${tipo},${accion})"><i class="fa-solid fa-floppy-disk" style="margin-right:3px"></i>Guardar</button>`
    html += '</div>'
    html += '</div>';
    html += '</div>'
    document.getElementById('modales').innerHTML = html;
    $("#selectMover").select2({
        dropdownParent: $("#exampleModalPermisosUser")
    });
    $('#exampleModalPermisosUser').modal('show');
}

let cont = 0;
document.addEventListener('click', function (e) {
    let permisos = document.querySelectorAll('.permiso')
    permisos.forEach(permiso => {
        if (e.target.id == 1 && e.target.classList.contains('permiso')) {
            permiso.parentNode.parentNode.parentNode.classList.remove('alertaPermiso');
            cont = 0;
            if (e.target.checked == false && permiso.id != 1) {
                permiso.checked = false;
                permiso.parentNode.classList.add('apagar');
                if (permiso.id == 4) {
                    permiso.parentNode.classList.remove('apagar');
                }
            } else if (e.target.checked == true) {
                if (permiso.id != 1 && permiso.id < 4) {
                    permiso.parentNode.classList.remove('apagar');
                    permiso.checked = false;
                }
            }
        } else if (e.target.id == 4 && e.target.classList.contains('permiso')) {
            if (e.target.checked == false) {
                if (permiso.id != 4 && permiso.id > 4) {
                    permiso.parentNode.classList.add('apagar');
                    permiso.checked = false;
                }
            } else if (e.target.checked == true) {
                if (permiso.id != 4 && permiso.id > 4) {
                    permiso.parentNode.classList.remove('apagar');
                    permiso.checked = false;
                }
            }
        }
    })
})

async function heredarUnidad(id, padre) {
    $.ajax({
        data: {
            "idUser": id,
        },
        //url: ENV.URL_BASE + '/user/datos',
        url: URL_BASE + '/permisos/heredar',
        type: 'POST',
        headers: {
            'token': token
        },
        dataType: 'json'
    }).done((response) => {
        console.log(response);
        if (response.exito) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.exito,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                $('#exampleModalPermisosUser').modal('hide')
                dibujarCarpeta(padre);
            })
        } else if (response.error) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.error
            }).then(() => {
                $('#exampleModalPermisosUser').modal('hide')
                dibujarCarpeta(padre);
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
    })
}

async function savePermisos(carpeta, dato, tipo, accion) {
    console.log('tipo', tipo);
    let heredar = document.getElementById('heredar').checked
    let permisos = document.querySelectorAll('.permiso')
    permisos = Array.apply(null, permisos);
    let cont = 0;
    var html = "";

    let idPermisos = permisos
        .filter(permiso => permiso.checked)
        .map(permiso => permiso.id);

    let verSeccion = document.querySelector("input[id='1']").checked;
    console.log('verSeccion', verSeccion);
    let permisosArray = permisosDefault
        .filter(permiso => {
            if (permiso.id === 1) {
                return false;
            }
            return true;
        })
        .map(permiso => ({
            ...permiso,
            status: idPermisos.includes(permiso.id.toString()) ? true : permiso.status
        }));

    if (verSeccion == false) {
        permisos.forEach(permiso => {
            if (permiso.id > 3 && permiso.checked == true) {
                cont++
            }
        })
    }

    if (cont != 0) {
        html += '<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >'
        html += '<li class="text-danger">'
        html += 'Ver Carpeta debe activarse para dar permisos a los Documentos'
        html += '</li>'
        document.getElementById('alertasPermisosUser').innerHTML = html;
        alertas()
        return;
    }
    const datos = new FormData()
    datos.append('idSeccion', carpeta);
    datos.append('verSeccion', verSeccion);
    datos.append('heredar', heredar);
    datos.append('accion', accion);
    if (tipo == 0) {
        datos.append('idUser', dato);
    } else if (tipo == 1) {
        datos.append('idUnidad', dato);
    }
    datos.append('permisos', JSON.stringify(permisosArray));
    console.log([...datos]);
    let url;
    if (tipo == 0) {
        url = URL_BASE + '/permisos/user';
    } else if (tipo == 1) {
        url = URL_BASE + '/permisos/unidad';
    }
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
            dibujarCarpeta(carpeta)
            $('#exampleModalPermisosUser').modal('hide');
        })
    } else if (response.error) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: response.error
        }).then(() => {
            dibujarCarpeta(carpeta)
            $('#exampleModalPermisosUser').modal('hide');
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
    tipo == 1 ? datos.append('tipo', 1) : datos.append('tipo', 2);
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
            dibujarCarpeta(hijo);
        })
    } else if (response.error) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: response.error
        }).then(() => {
            $('#exampleModal' + hijo).modal('hide')
            $('#exampleModalEditar' + hijo).modal('hide')
            dibujarCarpeta(hijo);
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
    const seccionEliminar = await traerSeccion(hijo)
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
                        window.location.href = URL_BASE + "/permisos";
                    })
                } else if (response.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ERROR',
                        html: '<strong>' + response.carpeta + '</strong> ' + response.error
                    }).then(() => {
                        dibujarCarpeta(seccionEliminar.id)

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

function userPermisosHistorial(carpeta, usuario) {
    return new Promise((resolve, reject) => {
        $.ajax({
            data: {
                "tipo": 'userPermisosHistorial',
                "idUser": usuario,
                "idSeccion": carpeta
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/user/datos',
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

function unidadPermisosHistorial(carpeta, unidad) {
    return new Promise((resolve, reject) => {
        $.ajax({
            data: {
                "tipo": 'unidadPermisosHistorial',
                "idUnidad": unidad,
                "idSeccion": carpeta
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/unidad/datos',
            type: 'POST',
            headers: {
                'token': token
            },
            dataType: 'json'
        }).done((response) => {
            //console.log(response);
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
