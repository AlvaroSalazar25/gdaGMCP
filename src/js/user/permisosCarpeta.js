const URL_BASE = 'http://localhost/gdagmcp';
const token = JSON.parse(localStorage.getItem('token'))
const CARPETA_BASE = '/base';

let secciones;
let roles;
let permisosDefault = [
    {
        "id": 1,
        "status": false,
        "nombre": "Ver_Carpeta",
        "descripcion": "Permiso para visualizar la carpeta",
    },
    {
        "id": 2,
        "status": false,
        "nombre": "Crear_Carpeta",
        "descripcion": "Permiso para crear carpetas",
    },
    {
        "id": 3,
        "status": false,
        "nombre": "Editar_Carpeta",
        "descripcion": "Permiso para Editar,Mover,Eliminar la carpeta",
    },
    {
        "id": 4,
        "status": false,
        "nombre": "Ver_Documento",
        "descripcion": "Permiso para visualizar el documento",
    },
    {
        "id": 5,
        "status": false,
        "nombre": "Crear_Documento",
        "descripcion": "Permiso para Crear un documento",
    },
    {
        "id": 6,
        "nombre": "Editar_Documento",
        "status": false,
        "descripcion": "Permiso para Editar la metadata del documento",
    },
    {
        "id": 7,
        "status": false,
        "nombre": "Mover_Documentos",
        "descripcion": "Permiso para mover de carpeta los documentos",
    },
    {
        "id": 8,
        "status": false,
        "nombre": "Eliminar_Documento",
        "descripcion": "Permiso para Eliminar el documento",
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

async function dibujarCarpeta(id) {
    var html = "";
    document.getElementById('contenedor-titulo').innerHTML = "";
    let seccionActual = await traerSeccion(id);
    html += '<div class="d-flex justify-content-center padreAtras">'
    html += '<div class="d-flex justify-content-center hijoAtras">'
    html += '<a class=" btn btn-outline-danger ' + (seccionActual == undefined ? 'noVisible' : '') + ' " onclick="dibujarAtras()"><i class="fa-solid fa-arrow-left-long fa-2x"></i> <span class="span-boton">Atrás</span></a>'
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
        html += '<h3 class="text-black mt-3 mb-4">Lista de usuarios permitidos para interactuar con la carpeta seleccionada</h3>'
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
    html += '<a class="btn btn-success" id="botonCrear" onclick="updateSeccion(' + padre + ',' + seccionActual.id + ',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
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
    html += '<table class="table" style="min-width:900px" id="tablaUsuarios">'
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
        html += '<td>' + (parseInt(index) + 1) + '</p></td>'
        html += '<td class="col"><i class="fa-solid ' + (dato.idUser != '-' ? 'fa-user' : 'fa-building') + '" style="margin-right:10px"></i>' + dato.nombre + '</p></td>'

        html += '<td class="col">' + dato.rol + '</p></td>'
        html += '<td class="col">' + dato.unidad + '</p></td>'
        if (dato.estado != '-') {
            html += '<td class="col"><buttom type="buttom" disabled class="botonDisabled btn btn-rounded ' + estado + '"  style="">' + (dato.estado == '1' ? 'Activo' : 'Inactivo') + '</buttom></p></td>'
        } else {
            html += '<td class="col">' + dato.estado + '</p></td>'
        }
        html += '<td class="col">' + dato.jefe + '</p></td>'
        html += '<td class="col">' + dato.usuarios + '</p></td>'
        html += '<td class="col">'
        html += '<div class="d-flex">'
        let tipoDato = (dato.idUnidad != '-' ? 1 : 0);
        let valorDato = (dato.idUnidad != '-' ? dato.idUnidad : dato.idUser)
        html += `<a class="btn btn-primary  botonPermiso" id="${tipo}" onclick="crearModalEditar('${carpeta}','${valorDato}',${tipoDato})" style="margin:0px 5px">Permisos</a>`
        html += '<div>'
        html += '</td>'
        html += '</tr>'
    });
    html += '</tbody>'
    html += '</table>'
    document.getElementById(contenedor.toString()).classList.add('mt-5')
    document.getElementById(contenedor.toString()).innerHTML = html;
    $('#tablaUsuarios').DataTable();
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
    window.location.href = URL_BASE+"/permisos"; 
}


function traerPermisosUser(carpeta, usuario) {
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

async function crearModalEditar(carpeta, dato, tipo) {
    console.log('dato', dato);
    let permisosUser = [], permisosUnidad = [];
    if (tipo == 0) {
        dato = await findUserById(dato);
        permisosUser = await traerPermisosUser(carpeta, dato.id);
    }
    if (tipo == 1) {
        dato = await findUnidadById(dato);
        permisosUnidad = await traerPermisosUnidad(carpeta, dato.id);
    }
    dato = mutarDato(dato)
    console.log('datooo', dato);

    let iconos = ['fa-solid fa-eye', 'fa-solid fa-plus', 'fa-solid fa-edit', 'fa-solid fa-eye', 'fa-solid fa-plus', 'fa-solid fa-edit', 'fa-solid fa-folder-tree', 'fa-solid fa-trash']
    /*=============================================================================================================//
                                                Modal de permisos carpeta y documentos
    //==============================================================================================================*/
    var html = "";
    html += '<div class="modal fade" id="exampleModalPermisosUser" tabindex="-1" aria-labelledby="exampleModalPermisosUser" aria-hidden="true">'
    html += '<div class="modal-dialog">'
    html += '<div class="modal-content">'
    html += '<div class="modal-header bg-black">'
    html += '<h5 class="modal-title text-white">Permisos</h5>'
    html += '<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>';
    html += '</div>'
    html += '<div class="modal-body">'
    html += '<h3 class="text-black"><strong>' + dato.nombre.toUpperCase() + '</strong></h3>';

    html += '<h5 class="text-black mt-4 mb-1">Permisos de Carpeta <i class="fa-solid fa-folder-open fa-lg" style="margin-left:5px"></i></h5>';
    html += '<div class="unido_alerta">'

    html += '<div class="mb-2" style="border:1px solid #bcbcbc;border-radius:5px">'
    html += '<div class="row p-3">'
    permisosDefault.forEach((permiso, index) => {
        if (permiso.id < 4) {
            if (permiso.id == 1) {
                html += '<div  class="d-flex justify-content-between w-100">'
                html += '<div class="d-flex ' + (permiso.id != 1 ? 'apagar' : '') + '" >'
                html += '<div  style="width:160px" >'
                html += `<i class="${iconos[index]} fa-xl" style="margin-right:5px"></i>`
                html += '<label>' + permiso.nombre.replaceAll("_", " ") + '</label>'
                html += '</div>'
                html += '<input class="form-check-input permiso" id="' + permiso.id + '" type="checkbox">'
                html += '</div>'

                html += '<div class="d-flex" >'
                html += '<div  style="width:160px" >'
                html += `<i class="fa-solid fa-right-left fa-xl" style="margin-right:5px"></i>`
                html += '<label>Heredar Permisos</label>'
                html += '</div>'
                html += '<input class="form-check-input" id="heredar" type="checkbox">'
                html += '</div>'
                html += '</div>'
            } else {
                html += '<div class="d-flex ' + (permiso.id != 1 ? 'apagar' : '') + '" >'
                html += '<div  style="width:160px" >'
                html += `<i class="${iconos[index]} fa-xl" style="margin-right:5px"></i>`
                html += '<label>' + permiso.nombre.replaceAll("_", " ") + '</label>'
                html += '</div>'
                html += '<input class="form-check-input permiso" id="' + permiso.id + '" type="checkbox">'
                html += '</div>'
            }
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
        if (permiso.id >= 4) {
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
    html += `<button type="button" class="btn btn-success" onclick="${tipo == 0 ? 'savePermisosUser' : 'savePermisosUnidad'}(${carpeta},${dato.id})"><i class="fa-solid fa-floppy-disk" style="margin-right:3px"></i>Guardar</button>`
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
                console.log('permisi', permiso.id);
                permiso.parentNode.classList.add('apagar');
                if (permiso.id == 4) {
                    permiso.parentNode.classList.remove('apagar');
                }
            } else if (e.target.checked == true) {
                if (permiso.id != 1 && permiso.id < 4) {
                    permiso.parentNode.classList.toggle('apagar');
                    permiso.checked = false;
                }
            }
        } else if (e.target.id == 4 && e.target.classList.contains('permiso')) {
            if (permiso.id != 4 && permiso.id > 4) {
                permiso.parentNode.classList.toggle('apagar');
                permiso.checked = false;
            }
        }
    })

})

async function savePermisosUser(carpeta, usuario) {
    let heredar = document.getElementById('heredar').checked
    let permisos = document.querySelectorAll('.permiso')
    permisos = Array.apply(null, permisos);

    let idPermisos = permisos
        .filter(permiso => permiso.checked)
        .map(permiso => permiso.id);


    let verSeccion = null;
    let permisosArray = permisosDefault
        .filter(permiso => {
            if (permiso.id === 1) {
                verSeccion = idPermisos.includes(permiso.id.toString()) ? true : false; // Actualizar el status del objeto con permiso.id igual a 1
                return false; // Excluir el objeto con permiso.id igual a 1 del array permisosArray
            }
            return true; // Incluir los demás objetos en el array permisosArray
        })
        .map(permiso => ({
            ...permiso,
            status: idPermisos.includes(permiso.id.toString()) ? true : permiso.status
        }));

    console.log('permisoId', verSeccion);
    console.log('permisos Array', permisosArray);

        const datos = new FormData()
        datos.append('idSeccion', carpeta);
        datos.append('verSeccion', verSeccion);
        datos.append('heredar', heredar);
        datos.append('idUser', usuario);
        datos.append('permisos', JSON.stringify(permisosArray));
        console.log([...datos]);

        let url = URL_BASE + '/permisos';
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
            })
        } else if (response.error) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.error
            }).then(() => {
                dibujarCarpeta(carpeta)
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

