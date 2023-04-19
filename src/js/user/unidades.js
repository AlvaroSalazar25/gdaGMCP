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
    unidades = await traerUnidades();
    secciones = await traerSecciones();
    console.log('asdfasdf', unidades);
    dibujarUnidades(unidades)
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
            if(response.length == 0){
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

function traerSecciones() {
    return new Promise((resolve, reject) => {
        let secciones = []
        $.ajax({
            data: {
                "tipo": 'seccion'
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

async function dibujarUnidadesUpdate() {
    let unid = await traerUnidades();
    dibujarUnidades(unid)
}

function dibujarUnidades(unidadesActualizadas) {
    var html = '';
    html += '<section>'
    html += '<div class="mb-3">'
    html += '<div class="d-flex justify-content-end">'
    html += '<a class=" btn btn-primary " onclick="agregarUnidad()"><i class="fa-solid fa-plus fa-2x"></i> <span class="span-boton">Agregar Unidad</span></a>'
    html += '</div>'
    html += '</div>'
    html += '</section>'
    html += '<table class="table" style="min-width:900px" id="tablaUnidades">'
    html += '<thead class="table-dark">'
    html += '<tr class="" style="text-transform:uppercase">'
    html += '<th>N°</th>'
    html += '<th class="">Unidad</th>'
    html += '<th class="">Jefe</th>'
    html += '<th class="col-2">Sección</th>'
    html += '<th class="col-2">Permisos</th>'
    html += '<th class="col-2">Acciones</th>'
    html += '</tr>'
    html += '</thead>'
    html += '<tbody class="contenido" id="contenido">'
    unidadesActualizadas.forEach((unidad, index) => {
        var permisoU = [];
        html += '<tr class="">'
        html += '<td>' + (parseInt(index) + 1) + '</td>'
        html += '<td>' + unidad.unidad + '</td>'
        html += '<td>' + unidad.jefe + '</td>'
        const secciones = JSON.parse(unidad.seccion)
        //console.log('secciones', secciones);
        html += '<td>'
        if (secciones.length == 0) {
            html += '<p class="text-danger" style="font-size:13px;margin-right:10px">Sin secciones</p>'
        } else {
            html += '<ul class="ultimoNo" style="height:44px;margin-bottom:0px;">'
            secciones.forEach((seccion, index) => {
                html += '<li  style="font-size:14px;margin-bottom:10px">' + seccion.seccion + '</li>'
                const permisos = JSON.parse(seccion.permisos)
                permisoU.push(permisos);
            })
            html += '</ul>'
        }
        html += '</td>'

        html += '<td>'
        var contador = 0;
        if (permisoU.length == 0) {
            html += '<p class="text-danger" style="font-size:13px">Sin Permisos</p>'
        } else {
            permisoU.forEach(permiso => {
                html += '<div class="dropend" style="margin-bottom:5px">'
                html += '<button class="btn btn-secondary dropdown-toggle" id="dropdownMenu' + unidad.id + contador + '" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Ver Permisos</button>'
                html += '<div class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenu' + unidad.id + contador + '">'
                permiso.forEach(permi => {
                    if (permi.status == 'true') {
                        html += '<p  class="dropdown-item"><i class="fa-solid fa-check text-success" style="margin-right:8px"></i>' + permi.nombre + '</p>'
                        html += '<div class="ultimoNo "></div>'
                    } else {
                        html += '<p  class="dropdown-item"><i class="fa-solid fa-xmark text-danger" style="margin-right:8px"></i>' + permi.nombre + '</p>'
                        html += '<div class="ultimoNo "></div>'
                    }
                })
                html += ' </div>'
                html += '</div>'
                contador++;
            })
            html += '</td>'
        }
        html += '<td>'
        html += '<div class="acciones-user">'
        html += '<a class="btn btn-warning botonAccionesUnidad" id="' + unidad.id + '"  onclick="agregarUnidad(2,' + unidad.id + ')"><i class="fa-solid fa-pen-to-square marginIcon"></i>Editar</a>'
        html += '<a class="btn btn-danger botonAccionesUnidad" onclick="eliminarUnidad(' + unidad.id + ')"><i class="fa-solid fa-trash marginIcon"></i>Eliminar</a>'
        html += '</div>'
        html += '</td>'
    })
    html += '</tbody>';
    html += '</table>'

    document.getElementById('dibujar-js').innerHTML = html;
    $('#tablaUnidades').DataTable();
}

async function agregarUnidad(tipo = 1, id) {
    var html = '';
    var unidadesActualizadas = await traerUnidades();
    if (tipo == '2') {
        var unidad = unidadesActualizadas.find(unid => unid.id == id);
        var seccionesUnidad = JSON.parse(unidad.seccion);
        var nombre = unidad.unidad
        var jefe = unidad.jefe
    }
    if (!nombre && !jefe) {
        nombre = "";
        jefe = "";
    }
    html += '<div class="contenedor-crearUsuario bg-light ">'
    if (tipo == '2') {
        html += '<h3 class="text-black mt-2 mb-4">Edite los datos de ' + nombre + '</h3>'
    } else {
        html += '<h3 class="text-black mt-2 mb-4">Ingrese los datos de la nueva Unidad</h3>'
    }
    html += '<form>'
    html += '<div class="mb-3">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Nombre:</strong></label>'
    html += '<input type="text" class="form-control" id="unidad" name="unidad" value="' + nombre + '" placeholder="Ingrese nombre de la unidad" aria-label="Username" aria-describedby="basic-addon1">'
    html += '</div>'
    html += '<div class="mb-3">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Jefe:</strong></label>'
    html += '<input type="text" class="form-control" id="jefe" name="jefe" value="' + jefe + '" placeholder="Ingrese nombre de Jefe" aria-label="Username" aria-describedby="basic-addon1">'
    html += '</div>'
    html += '<h4 class="text-black mt-4 mb-4">Permisos de Unidad</h4>'
    //let unidad = unidades.find( unidad => unidad.id == id)
    html += '<div class="bg-white py-3 px-2" style="border-radius:8px;border:1px solid #e0e4e7">'
    if (tipo == '2') {
        secciones.forEach(seccion => {
            let seccionUnidad = seccionesUnidad.find(section => section.idSeccion == seccion.id)
            if (seccionUnidad != undefined) {
                html += '<div class="d-flex" style="font-size:15px;margin-bottom:5px" >'
                html += '<div class="d-flex" style="width:200px;justify-content:start;align-items:center">'
                //console.log('seccion_id', seccion.id);
                html += '<input class="secciones" type="checkbox" checked id="' + seccion.id + '" name="' + seccion.seccion + '" value="' + seccion.id + '">'
                html += ' <label style="margin-left:5px">' + seccion.seccion + '</label>'
                html += '</div>'
                html += '<div class="d-flex justify-content-center" id="contenedor' + seccion.id + '" style="font-size:13px;border:1px solid #ced4da;padding:5px 0px 5px 10px">'
                permisosDefault.forEach(permisoD => {
                    let permisosUnidad = JSON.parse(seccionUnidad.permisos)
                    let permisoUnidad = permisosUnidad.find(permi => permi.id == permisoD.id)
                    if (permisoUnidad != undefined) {
                        if (permisoUnidad.status == 'true') {
                            html += '<input style="margin-right:5px" type="checkbox" checked  id="permiso' + permisoD.id + '" name="' + permisoD.nombre + '" value="' + permisoD.id + '">'
                            html += ' <label style="margin-right:10px" >' + permisoD.nombre + '</label>'
                        } else {
                            html += '<input style="margin-right:5px" type="checkbox"   id="permiso' + permisoD.id + '" name="' + permisoD.nombre + '" value="' + permisoD.id + '">'
                            html += ' <label style="margin-right:10px" >' + permisoD.nombre + '</label>'
                        }
                    } else {
                        html += '<input style="margin-right:5px" type="checkbox"  id="permiso' + permisoD.id + '" name="' + permisoD.nombre + '" value="' + permisoD.id + '">'
                        html += ' <label style="margin-right:10px" >' + permisoD.nombre + '</label>'
                    }
                })
                html += '</div>'
                html += '</div>'
            } else {
                html += '<div class="d-flex" style="font-size:15px;margin-bottom:5px" >'
                html += '<div class="d-flex" style="width:200px;justify-content:start;align-items:center">'
                html += '<input class="secciones" type="checkbox" id="' + seccion.id + '" name="' + seccion.seccion + '" value="' + seccion.id + '">'
                html += ' <label style="margin-left:5px">' + seccion.seccion + '</label>'
                html += '</div>'
                html += '<div class="d-flex justify-content-center visiblePermiso" id="contenedor' + seccion.id + '" style="font-size:13px;border:1px solid #ced4da;padding:5px 0px 5px 10px">'
                permisosDefault.forEach(permisoD => {
                    html += '<input style="margin-right:5px" type="checkbox"  id="permiso' + permisoD.id + '" name="' + permisoD.nombre + '" value="' + permisoD.id + '">'
                    html += ' <label style="margin-right:10px" >' + permisoD.nombre + '</label>'
                })
                html += '</div>'
                html += '</div>'
            }
        })
    } else {
        secciones.forEach(seccion => {
            html += '<div class="d-flex" style="font-size:15px;margin-bottom:5px" >'
            html += '<div class="d-flex" style="width:200px;justify-content:start;align-items:center">'
            html += '<input class="secciones" type="checkbox" id="' + seccion.id + '" name="' + seccion.seccion + '" value="' + seccion.id + '">'
            html += ' <label style="margin-left:5px">' + seccion.seccion + '</label>'
            html += '</div>'
            html += '<div class="d-flex justify-content-center visiblePermiso" id="contenedor' + seccion.id + '" style="font-size:13px;border:1px solid #ced4da;padding:5px 0px 5px 10px">'
            permisosDefault.forEach(permisoD => {
                html += '<input style="margin-right:5px" type="checkbox"  id="permiso' + permisoD.id + '" name="' + permisoD.nombre + '" value="' + permisoD.id + '">'
                html += ' <label style="margin-right:10px" >' + permisoD.nombre + '</label>'
            })
            html += '</div>'
            html += '</div>'
        })
    }
    html += '</div>'
    html += '<div class="w-100 mt-2" id="alertas">'
    html += '</div>'
    html += '<div class="my-5 d-flex justify-content-center align-items-center">'
    html += '<a class="btn btn-success px-5 py-2" id="botonCrear" style="font-size:15px" onclick="guardarUnidad(' + tipo + ',' + id + ')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
    html += '</div>'
    html += '<div class=" d-flex justify-content-start align-items-center">'
    html += '<a class="btn btn-outline-danger px-3 py-1" id="botonCrear" style="font-size:15px" onclick="dibujarUnidadesUpdate()"><i class="fa-solid fa-arrow-left"></i> <span style="margin-left:8px">Atrás</span></a>'
    html += '</div>'
    html += '</form>'
    html += '</div>'

    document.getElementById("dibujar-js").innerHTML = html;
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('secciones')) {
        let seccion = e.target;
        console.log('contenedor' + seccion.id);
        let contenedor = document.getElementById('contenedor' + seccion.id)
        // console.log(contenedor);
        if (seccion.checked == true) {
            contenedor.classList.toggle('visiblePermiso')
        } else {
            contenedor.classList.toggle('visiblePermiso')
            for (let i = 0; i < contenedor.children.length; i++) {
                contenedor.children[i].checked = false
            }
        }
    }
})

async function guardarUnidad(tipo, id) {
    //onsole.log('tipo del guardar',tipo);
    //console.log('id del guardar',id);
    let unidad = document.getElementById('unidad').value
    let jefe = document.getElementById('jefe').value
    let seccionChecked = []
    secciones.forEach(seccion => {
        let seccionPermiso = document.getElementById(seccion.id)
        if (seccionPermiso.checked == true) {
            seccionChecked.push({
                'id': seccionPermiso.id,
                'seccion': seccionPermiso.name
            });
        }
    })
    let unidadSeccionPermisos = []
    var error = [];
    seccionChecked.forEach(seccionChecked => {
        let contenedorPermisos = document.getElementById('contenedor' + seccionChecked.id);
        let seccionPermisos = [];
        var cont = 0;
        for (let i = 0; i < contenedorPermisos.children.length; i++) {
            if (contenedorPermisos.children[i].checked == true) {
                if (contenedorPermisos.children[i].value != undefined) {
                    seccionPermisos.push({
                        "id": contenedorPermisos.children[i].value,
                        "nombre": contenedorPermisos.children[i].name,
                        "status": "true"
                    });
                }
            } else {
                if (contenedorPermisos.children[i].value != undefined) {
                    cont++;
                    if (cont == 2) {
                        let problema = "No se a seleccionado permisos para la sección de " + seccionChecked.seccion;
                        error.push(problema);
                    }
                    seccionPermisos.push({
                        "id": contenedorPermisos.children[i].value,
                        "nombre": contenedorPermisos.children[i].name,
                        "status": "false"
                    });
                }
            }
        }
        unidadSeccionPermisos.push({
            'idSeccion': seccionChecked,
            'idPermisos': seccionPermisos
        })
    })

    if (error.length != 0) {
        let htmlError = ""
        htmlError += '<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >'
        error.forEach(alerta => {
            htmlError += '<li class="text-danger"  >'
            htmlError += alerta
            htmlError += '</li>'
        })
        htmlError += '</ul>'
        document.getElementById('alertas').innerHTML = htmlError;
        alertas();
        return;
    } else {
        const datos = new FormData()
        if (tipo == '2') {
            datos.append('id', id)
        }
        datos.append('unidad', unidad)
        datos.append('jefe', jefe)
        console.log('errir', error);
        datos.append('permisos', JSON.stringify(unidadSeccionPermisos))
        //datos.append('permisos', JSON.stringify(valuePermisos));
        console.log([...datos]);

        let url;
        if (tipo == '2') {
            url = URL_BASE + '/unidad/actualizar';
        } else {
            url = URL_BASE + '/unidad/create';
        }
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'token': token
            },
            body: datos
        });

        const response = await request.json();
        var html = ""

        console.log(response)
        if (response.exito) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.exito,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                dibujarUnidadesUpdate()
            })
        } else if (response.error) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.error
            }).then(() => {
                agregarUnidad();
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

async function eliminarUnidad(id) {
    const unidadEliminar = unidades.find(unid => unid.id == id)
    console.log(unidadEliminar);

    Swal.fire({
        title: 'ELIMINAR',
        text: `Eliminar de forma permamente a ${unidadEliminar.unidad}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        confirmButtonColor: '#dc3545',
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            $.ajax({
                data: {
                    "id": id
                },
                url: URL_BASE + '/unidad/delete',
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
                        dibujarUnidadesUpdate();
                    })
                } else if (response.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ERROR',
                        text: response.error
                    }).then(() => {
                        dibujarUnidadesUpdate();
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