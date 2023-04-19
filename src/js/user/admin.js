const URL_BASE = 'http://localhost/gdagmcp';
let usuarios;
let unidades;
let secciones;
let usuariosSeccion;
let roles;
const user = {
    nombre: '',
    apellido: '',
    cedula: '',
    celular: '',
    email: '',
    password: '',
    idUnidad: '',
    idRol: '',
}
let permisosDefault = [{
    "id": "1",
    "nombre": "Leer",
    "status": "false"
}, {
    "id": "2",
    "nombre": "Escribir",
    "status": "false"
}]

const token = JSON.parse(localStorage.getItem('token'))
document.addEventListener('DOMContentLoaded', iniciarApp())
async function iniciarApp() {
    usuarios = await ver();
    usuariosSeccion = await buscarSeccion();
    secciones = await traerSeccion();
    unidades = await traerUnidades();
    roles = await traerRoles();
    dibujarUsuarios(usuarios, "dibujar-js", 1)
    crearModales(); 
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

async function traerUser(tipo) {
    let usuariosBuscar = JSON.parse(localStorage.getItem('buscarUser'));
    let usuariosActualizados = await ver();
    let users = []
    if (usuariosBuscar && usuariosBuscar.length >= 0) {
        usuariosBuscar.forEach(userBuscar => {
            let buscar = usuariosActualizados.find(usuario => usuario.id === userBuscar.id)
            if (buscar != undefined) {
                users.push(buscar)
            }
        })
        localStorage.setItem('buscarUser', JSON.stringify(users));
    }

    if (tipo == '1') {
        dibujarUsuarios(usuariosActualizados, 'dibujar-js', 1)
    } else if (tipo == '2') {
        console.log('debe entrar aqui por el tipo 2');
        const user = JSON.parse(localStorage.getItem('buscarUser'));
        console.log('user del local antes de dibujar, debo estar solo yo', user);
        dibujarUsuarios(user, 'tablaBuscar', 2);
    }
}

function ver() {
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
            if(response.length == 0){
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

function verUsuarios() {
    dibujarUsuarios(usuarios, "dibujar-js", 1)
}

function traerUnidades() {
    return new Promise((resolve, reject) => {
        let unidades = []
        $.ajax({
            data: {
                "tipo": 'unidades'
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

function traerSeccion() {
    return new Promise((resolve, reject) => {
        let secciones = []
        $.ajax({
            data: {
                "tipo": 'seccion'
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

function traerRoles() {
    return new Promise((resolve, reject) => {
        let roles = []
        $.ajax({
            data: {
                "tipo": 'roles'
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
            if(response.length == 0){
                resolve(roles)
            }
            $.each(response, (index, rol) => {
                roles.push(rol);
                if (response.length == index + 1) {
                    resolve(roles)
                }
            })
        }).fail((err) => {
            reject(err);
        });
    })
}

function dibujarUsuarios(usuarios, contenedor, tipo = 1) {
    console.log('usuarios del dibujar', usuarios);
    var html = '';
    html += '<table class="table" style="min-width:900px" id="tablaUsuarios">'
    html += '<thead class="table-dark">'
    html += '<tr class="" style="text-transform:uppercase">'
    html += '<th>N°</th>'
    html += '<th>Nombre</th>'
    html += '<th>Email</th>'
    html += '<th>rol</th>'
    html += '<th>Unidad</th>'
    html += '<th>Estado</th>'
    html += '<th>Acciones</th>'
    html += '</tr>'
    html += '</thead>'
    html += '<tbody class="contenido" id="contenido">'
    usuarios.forEach((usuario, index) => {
        let estado = usuario.estado == 'activo' ? 'btn-outline-success' : 'btn-outline-danger'
        //console.log(usuario);
        html += '<tr class="">'
        html += '<td>' + (parseInt(index) + 1) + '</p></td>'
        html += '<td class="col-2">' + usuario.nombre + '</p></td>'
        html += '<td class="col-3">' + usuario.email + '</p></td>'
        html += '<td class="col-1">' + usuario.rol + '</p></td>'
        html += '<td class="col-2">' + usuario.unidad + '</p></td>'
        html += '<td class="col-1"><a class=" btn btn-rounded ' + estado + '" onclick="estado(' + usuario.id + ',' + tipo + ')"  >' + usuario.estado + '</a></p></td>'
        html += '<td class="col-2">'
        html += '<div class="acciones-user">'
        html += '<a class="btn btn-primary  botonPermiso" id="' + tipo + '" data-bs-toggle="modal" data-bs-target="#exampleModalPermisos' + usuario.id + '">Permisos</a>'
        html += '<a class="btn btn-warning " id="' + tipo + '" onclick="crearUsuario(' + 2 + ',' + usuario.id + ')" style="margin:0px 5px 0px 5px"><i class="fa-regular fa-pen-to-square fa-2x"></i></a>'
        html += '<a class="btn btn-danger " onclick="eliminarUsuario(' + usuario.id + ')"><i class="fa-solid fa-trash fa-2x"></i></a>'
        html += '</div>'
        html += '</td>'
        html += '</tr>'
    });
    html += '</tbody>'
    html += '</table>'

    document.getElementById(contenedor.toString()).innerHTML = html;
    $('#tablaUsuarios').DataTable();
}

async function crearModales(tipo = 1) {
    let usuariosActualizados = await buscarSeccion();
    var html = ''
    usuariosActualizados.forEach(usuario => {
        let seccionUser = JSON.parse(usuario.seccion);
        console.log('permiso de cada user',seccionUser);
        html += '<div class="modal fade" id="exampleModalPermisos' + usuario.id + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'
        html += '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">'
        html += ' <div class="modal-content">'
        html += ' <div class="modal-header">'
        html += ' <h5 class="modal-title" id="exampleModalLabel">EDITAR PERMISOS DE <strong>' + usuario.nombre.toUpperCase() + '</strong></h5>'
        html += '  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'
        html += ' </div>'
        html += ' <div class="modal-body">'
        secciones.forEach(seccion => {
            let filtrar = seccionUser.find(sec => sec.id == seccion.id)
            html += '<div class="d-flex justify-content-between" style="font-size:17px" >'
            if (filtrar != undefined) {
                let permisos = JSON.parse(filtrar.permisos);
                html += '<div>'
                html += '<input class="secciones" type="checkbox" checked id="' + seccion.id + usuario.id + '" name="' + seccion.seccion + '" value="' + seccion.id + '">'
                html += ' <label for="' + seccion.seccion + '">' + seccion.seccion + '</label>'
                html += '</div>'
                html += '<div class="d-flex col-6 justify-content-center" id="contenedor' + seccion.id + usuario.id + '" style="font-size:13px">'
                permisos.forEach(permiso => { //reviar aqui el tema de los checks cuando estan activos o no
                    if (permiso.status == 'true') {
                        //console.log('permiso', permiso);
                        html += '<input style="margin-right:5px" type="checkbox" checked id="permiso' + permiso.id + '" name="' + permiso.nombre + '" value="' + permiso.id + '">'
                        html += ' <label style="margin-right:10px ">' + permiso.nombre + '</label>'
                    } else {
                        //console.log('permiso', permiso);
                        html += '<input style="margin-right:5px" type="checkbox" id="permiso' + permiso.id + '" name="' + permiso.nombre + '" value="' + permiso.id + '">'
                        html += ' <label style="margin-right:10px ">' + permiso.nombre + '</label>'
                    }
                })
                html += '</div>'
            } else {
                html += '<div>'
                html += '<input class="secciones" type="checkbox" id="' + seccion.id + usuario.id + '" name="' + seccion.seccion + '" value="' + seccion.id + '">'
                html += ' <label for="' + seccion.seccion + '">' + seccion.seccion + '</label>'
                html += '</div>'
                html += '<div class="d-flex col-6 justify-content-center visiblePermiso" id="contenedor' + seccion.id + usuario.id + '" style="font-size:13px">'
                permisosDefault.forEach(permisoD => {
                    html += '<input style="margin-right:5px" type="checkbox"  id="permiso' + permisoD.id + '" name="' + permisoD.nombre + '" value="' + permisoD.id + '">'
                    html += ' <label style="margin-right:10px" >' + permisoD.nombre + '</label>'
                })
                html += '</div>'
            }
            html += '</div>'
        })
        html += ' </div>'
        html += '<div class="mx-3" id="alertaError' + usuario.id + '">'
        html += '</div>'
        html += '<div class="modal-footer ">'
        html += '<div class="d-flex justify-content-between w-100">'
        if(usuario.permisosWhere){
            html += '<div class="form-text" id="seccionHelp">* Este usuario tiene los permisos de <strong>'+ usuario.permisosWhere +'</strong></div>'
        } else{
            html += '<div class="form-text" id="seccionHelp"><strong>* Permisos personalizados</strong></div>'

        }
        html += '<div>'
        html += ' <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'
        html += ' <button type="button" class="btn btn-success" onclick="guardarPermisos(' + usuario.id + ',' + tipo + ')">Guardar cambios</button>'
        html += '</div>'
        html += '</div>'
        html += '</div>'
        html += '</div>'
        html += ' </div>'
        html += '</div>'
        html += ' </div>'
        html += '</div>'
        document.getElementById("modales").innerHTML = html;
    })
}

document.addEventListener('click', function (e) {
    var seccionUser = [];
    if (e.target.classList.contains('secciones')) {
        let seccion = e.target;
        let contenedor = document.getElementById('contenedor' + seccion.id)
        console.log(contenedor);
        if (seccion.checked == true) {
            contenedor.classList.toggle('visiblePermiso')
            seccionUser.push(seccion.value);
        } else {
            contenedor.classList.toggle('visiblePermiso')
            for (let i = 0; i < contenedor.children.length; i++) {
                contenedor.children[i].checked = false
            }
        }
    }
})

async function guardarPermisos(id, tipo = 1) {
    let permisos;
    let btnPermiso = document.querySelector('.botonPermiso').id
    let seccionChecked = [];
    secciones.forEach(seccion => {
        let seccionPermiso = document.getElementById(seccion.id + id)
        if (seccionPermiso.checked == true) {
            seccionChecked.push({
                'id': seccionPermiso.id,
                'value': seccionPermiso.value,
                'seccion': seccionPermiso.name
            });
        }
    })
    console.log('deben estar las secciones del usuario', seccionChecked);

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
    console.log(error);
    if (error.length != 0) {
        let htmlError = ""
        htmlError += '<ul class="alert bg-white px-5" style="border-radius:5px;border:1px solid red"  style="width:100%" >'
        error.forEach(alerta => {
            htmlError += '<li class="text-danger"  >'
            htmlError += alerta
            htmlError += '</li>'
        })
        htmlError += '</ul>'
        console.log(document.getElementById('alertaError'));
        document.getElementById('alertaError' + id).innerHTML = htmlError;
        alertas();
        return;
    } else {
        $('#exampleModalPermisos' + id).modal('hide')
        console.log('a ver', unidadSeccionPermisos);
        const datos = new FormData()
        datos.append('id', id)
        datos.append('permisos', JSON.stringify(unidadSeccionPermisos))
        //datos.append('permisos', JSON.stringify(valuePermisos));
        console.log([...datos]);

        let url = URL_BASE + '/user/permisos/save';
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'token': token
            },
            body: datos
        });
        //  respuesta de la peticion de arriba, me arroja true o false 
        const response = await request.json();
        var html = ""
        console.log(response);

        if (response.exito) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.exito,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                traerUser(btnPermiso)
                document.getElementById('modales').innerHTML = "";
                crearModales();
            })
        } else if (response.error) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.error
            }).then(() => {
                traerUser(btnPermiso);
                document.getElementById('modales').innerHTML = "";
                crearModales();
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
let datos = {
    nombre: '',
    apellido: '',
    cedula: '',
    celular: '',
    email: '',
    unidad: '',
    rol: '',
}

function crearUsuario(tipo = 1, id) {
    console.log('tipoooooo', tipo);
    if (tipo == 2) {
        var user = usuariosSeccion.find(usuar => usuar.id == id);
        console.log(user);
        var nombre = user.nombre.split(' ')[0];
        var apellido = user.nombre.split(' ')[1]
        var cedula = user.cedula
        var email = user.email
        var celular = user.celular
        var unidadUser = user.idUnidad
        console.log(unidadUser);
        var rolUser = user.idRol
    }
    if (!nombre && !apellido && !cedula && !email && !celular && !unidadUser && !rolUser) {
        nombre = '';
        apellido = '';
        cedula = '';
        email = '';
        celular = '';
        unidadUser = '';
        rolUser = '';
    }

    var html = '';
    html += '<div class="contenedor-crearUsuario bg-light ">'
    if (tipo == 2) {
        html += '<h3 class="text-black mt-2 mb-4">Editar datos de ' + nombre + " " + apellido + '</h3>'
        html += ' <input type="hidden" id="idUser" name="id" value="' + user.id + '" placeholder="" required>'

    } else {
        html += '<h3 class="text-black mt-2 mb-4">Ingrese los datos del nuevo usuario</h3>'
    }
    html += '<form>'
    html += '<div class="d-flex justify-content-between">'
    html += '<div class="mb-3 col-md-6" style="padding-right:5px">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Nombre:</strong></label>'
    html += ' <input type="text" class="form-control" id="nombre" name="nombre" value="' + nombre + '" placeholder="" required>'
    html += '</div>'

    html += '<div class="mb-3 col-md-6" style="padding-left:5px">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Apellido:</strong></label>'
    html += '<input type="text" class="form-control" id="apellido" name="apellido" value="' + apellido + '" placeholder="" required>'
    html += '</div>'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Cédula:</strong></label>'
    html += '<input type="number" class="form-control" id="cedula" name="cedula" value="' + cedula + '" placeholder="1600XXXXXX" aria-label="Username" aria-describedby="basic-addon1">'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Celular:</strong></label>'
    html += '<input type="number" class="form-control" id="celular" value="' + celular + '" name="celular" placeholder="098XXXXXXX" aria-label="Username" aria-describedby="basic-addon1">'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Email:</strong></label>'
    html += '<div class="input-group mb-3">'
    html += '<span class="input-group-text" id="basic-addon1">@</span>'
    html += '<input type="text" class="form-control" placeholder="" value="' + email + '" id="email" name="email">'
    html += '</div>'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Unidad:</strong></label>'
    html += '<select class="form-select" name="unidad" id="unidad">'
    html += '<option  value="" selected disabled> --  Seleccione una opción --</option>'
    unidades.forEach(unidad => {
        if (unidad.id == unidadUser) {
            html += '<option value="' + unidad.id + '" selected>' + unidad.unidad + ' ' + '(' + unidad.jefe + ')</option>'
        } else {
            html += '<option value="' + unidad.id + '">' + unidad.unidad + ' ' + '(' + unidad.jefe + ')</option>'
        }
    })
    html += '</select>'
    html += '</div>'

    html += '<div class="mb-3">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Rol:</strong></label>'
    html += '<select class="form-select" name="rol" id="rol">'
    html += '<option value="" selected disabled> --  Seleccione una opción --</option>'
    roles.forEach(rol => {
        if (rol.id == rolUser) {
            html += '<option value="' + rol.id + '" selected>' + rol.rol + '</option>'
        } else {
            html += '<option value="' + rol.id + '">' + rol.rol + '</option>'
        }
    })
    html += '</select>'
    html += '</div>'

    if (tipo == 1) {
        html += '<div class="d-flex ">'
        html += '<div class="mb-1 col-md-10" style="padding-right:5px">'
        html += '<label for="exampleFormControlInput1" class="form-label"><strong>Contraseña:</strong></label>'
        html += '<input type="password" id="password" name="password" class="form-control noallow" placeholder="" disabled>'
        html += '</div>'
        html += '<div class="mb-1 col d-flex justify-content-start align-items-end" >'
        html += '<buttom type="buttom" class="btn btn-warning w-100" id="btnBlock" onclick="llenarPass()">Cambiar contraseña</buttom>'
        html += '</div>'
        html += '</div>'
        html += '<div id="passwordHelp" class="form-text">Si deja en blanco la contraseña será la cédula del nuevo usuario.</div>'
    }
    html += '<div class="w-100 mt-2" id="alertas">'
    html += '</div>'

    html += '<div class="my-5 d-flex justify-content-center align-items-center">'
    html += '<a class="btn btn-success px-5 py-2" id="botonCrear" style="font-size:15px" onclick="guardarDatos(' + tipo + ')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'

    html += '</div>'
    html += '</div>'
    html += '</form>'

    document.getElementById("dibujar-js").innerHTML = html;
}

async function eliminarUsuario(id) {
    const usuario = usuarios.find(user => user.id == id)
    Swal.fire({
        title: 'ELIMINAR',
        text: `Eliminar de forma permamente a ${usuario.nombre}?`,
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
                url: URL_BASE + '/user/delete',
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
                        window.location.href = URL_BASE + "/admin";
                    })
                } else if (response.error) {
                    Swal.fire('ERROR', 'error', response.error)
                    crearUsuario();
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

function llenarPass() {
    const botonBlock = document.getElementById('btnBlock')
    botonBlock.addEventListener('click', liberarBoton())
}

function liberarBoton() {
    const password = document.getElementById('password')
    if (password.disabled == true) {
        password.disabled = false;
        password.classList.remove('noallow')
    } else {
        password.disabled = true
        password.classList.add('noallow')
    }
}

async function guardarDatos(tipo) {
    let {
        nombre,
        apellido,
        cedula,
        celular,
        email,
        password,
        idUnidad,
        idRol
    } = user

    nombre = document.getElementById('nombre').value;
    apellido = document.getElementById('apellido').value;
    cedula = document.getElementById('cedula').value;
    celular = document.getElementById('celular').value;
    email = document.getElementById('email').value;
    if (tipo == 1) {
        password = document.getElementById('password').value
        if (document.getElementById('password').disabled == true) {
            password = document.getElementById('cedula').value;
        }
    }
    idUnidad = document.getElementById('unidad').value;
    idRol = document.getElementById('rol').value;
    let nombreCompleto;
    if (apellido.length > 0) {
        nombreCompleto = nombre + " " + apellido
    } else {
        nombreCompleto = nombre
    }
    const datos = new FormData()
    if (tipo == 2) {
        let id = document.getElementById('idUser').value
        datos.append('id', id)
    }
    datos.append('nombre', nombreCompleto)
    datos.append('apellido', apellido)
    datos.append('cedula', cedula)
    datos.append('celular', celular)
    datos.append('email', email)
    if (tipo == 1) {
        if (cedula == password) {
            datos.append('passwordCedula', 1)
        } else {
            datos.append('passwordCedula', 0)
        }
        datos.append('password', password)
    }
    datos.append('idUnidad', idUnidad)
    datos.append('idRol', idRol)

    //console.log([...datos]);
    let url;
    if (tipo == 1) {
        url = URL_BASE + '/user/create';
    } else if (tipo == 2) {
        url = URL_BASE + '/user/update';
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
    var html = ""
    //console.log(response)
    if (response.exito) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.exito,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = URL_BASE + "/admin";
        })
    } else if (response.error) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: response.error
        }).then(() => {
            crearUsuario();
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

function estado(id, tipo = 1) {
    $.ajax({
        data: {
            "id": id,
        },
        //url: ENV.URL_BASE + '/user/datos',
        url: URL_BASE + '/user/estado',
        type: 'POST',
        headers: {
            'token': token
        },
        dataType: 'json'
    }).done((response) => {
        if (response.activo) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.activo,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                console.log('activo');
                console.log('tipo', tipo);
                traerUser(tipo);
            })
        } else if (response.inactivo) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: response.inactivo,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                console.log('activo');
                console.log('tipo', tipo);
                traerUser(tipo);
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
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.error
            }).then(() => {
                traerUser(tipo);
            })
        }
    }).fail((err) => {
        console.log(err);
    });
}

function buscarUsuario() {
    var html = '';
    html += '<div class="contenedor-crearUsuario bg-light mb-4">'
    html += '<h3 class="text-black">Ingrese los datos para buscar al usuario</h3>'

    html += '<div class="mb-3">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Buscar por:</strong></label>'
    html += '<select class="form-select selectDocumentos" name="tipo" id="tipo" onchange="elegirTipo()">'
    html += '<option value="" selected disabled> --  Seleccione una opción -- </option>'
    html += '<option value="1">Nombre</option>'
    html += '<option value="2">Rol</option>'
    html += '<option value="3">Unidad</option>'
    html += '</select>'

    html += '</div>'
    html += '<div id="elegir">'
    html += '</div>'
    html += '</div>'
    html += '<div id="tablaBuscar">'
    html += '</div>'
    html += '</div>'

    document.getElementById("dibujar-js").innerHTML = html;
}

function elegirTipo() {
    let tipo = document.getElementById('tipo').value
    var html = "";
    if (tipo) {
        switch (tipo) {
            case '1':
                html += '<div class="mb-3">'
                html += '<label for="exampleFormControlInput1" class="form-label"><strong>Ingrese el nombre:</strong></label>'
                html += '<input type="text" class="form-control buscar" placeholder="" aria-label="Username" aria-describedby="basic-addon1" onKeyUp="escucharNombre(this.value)">'
                html += '</div>'
                document.getElementById("elegir").innerHTML = html;
                document.getElementById("tablaBuscar").innerHTML = '';
                break;
            case '2':
                html += '<div class="mb-3">'
                html += '<label for="exampleFormControlInput1" class="form-label"><strong>Buscar por rol:</strong></label>'
                html += '<select class="form-select" name="rol" id="rol" onchange="escucharRol()">'
                html += '<option value="" selected disabled> --  Seleccione una opción --</option>'
                roles.forEach(rol => {
                    //console.log(rol);
                    html += '<option value="' + rol.id + '">' + rol.rol + '</option>'
                })
                html += '</select>'
                html += '</div>'
                document.getElementById("elegir").innerHTML = html;
                document.getElementById("tablaBuscar").innerHTML = '';
                break;

            case '3':
                html += '<div class="mb-3">'
                html += '<label for="exampleFormControlInput1" class="form-label"><strong>Buscar por Unidad:</strong></label>'
                html += '<select class="form-select" name="unidad" id="unidad" onchange="escucharUnidad()">'
                html += '<option value="" selected disabled> --  Seleccione una opción --</option>'
                unidades.forEach(unidad => {
                    //console.log(unidad);
                    html += '<option value="' + unidad.id + '">' + unidad.unidad + '</option>'
                })
                html += '</select>'
                html += '</div>'
                document.getElementById("elegir").innerHTML = html;
                document.getElementById("tablaBuscar").innerHTML = '';
                break;
            default:
                break;
        }
    }
}

escucharNombre = (value) => {
    $.ajax({
        data: {
            "tipo": 'buscarNombre',
            "dato": value
        },
        url: URL_BASE + '/user/buscar',
        type: 'POST',
        headers: {
            'token': token
        },
        dataType: 'json'
    }).done((response) => {
        var html = "";

        if (value.length == 0) {
            //console.log('si entra');
            document.getElementById("tablaBuscar").innerHTML = '';
            return;
        }
        //console.log('lenght', response);
        if (response.error) {
            html += "<div class='w-100 d-flex justify-content-center align-items-center' style='height:200px'> <div class='bg-danger d-flex justify-content-center align-items-center w-100' style='border-radius:5px;height:40px'><h4 class='card-title text-white' style='text-transform: uppercase'>No existen coincidencias</h4></div></div>"
            document.getElementById("tablaBuscar").innerHTML = html;
            return;
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
        localStorage.setItem('buscarUser', JSON.stringify(response));
        dibujarUsuarios(response, 'tablaBuscar', 2)

    }).fail((err) => {
        console.log(err);
    });
}

escucharRol = () => {
    let value = document.getElementById('rol').value
    $.ajax({
        data: {
            "tipo": 'buscarRol',
            "dato": value
        },
        url: URL_BASE + '/user/buscar',
        type: 'POST',
        headers: {
            'token': token
        },
        dataType: 'json'
    }).done((response) => {
        var html = "";

        if (response.error) {
            html += "<div class='w-100 d-flex justify-content-center align-items-center' style='height:200px'> <div class='bg-danger d-flex justify-content-center align-items-center w-100' style='border-radius:5px;height:40px'><h4 class='card-title text-white' style='text-transform: uppercase'>No existen coincidencias</h4></div></div>"
            document.getElementById("tablaBuscar").innerHTML = html;
            return;
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
        localStorage.setItem('buscarUser', JSON.stringify(response));
        dibujarUsuarios(response, 'tablaBuscar', 2)


    }).fail((err) => {
        console.log(err);
    });

}

escucharUnidad = () => {
    let value = document.getElementById('unidad').value
    $.ajax({
        data: {
            "tipo": 'buscarUnidad',
            "dato": value
        },
        url: URL_BASE + '/user/buscar',
        type: 'POST',
        headers: {
            'token': token
        },
        dataType: 'json'
    }).done((response) => {
        var html = "";

        if (response.error) {
            html += "<div class='w-100 d-flex justify-content-center align-items-center' style='height:200px'> <div class='bg-danger d-flex justify-content-center align-items-center w-100' style='border-radius:5px;height:40px'><h4 class='card-title text-white' style='text-transform: uppercase'>No existen coincidencias</h4></div></div>"
            document.getElementById("tablaBuscar").innerHTML = html;
            return;
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
        localStorage.setItem('buscarUser', JSON.stringify(response));
        dibujarUsuarios(response, 'tablaBuscar', 2)


    }).fail((err) => {
        console.log(err);
    });

}

function buscarSeccion() {
    return new Promise((resolve, reject) => {
        let secciones = []
        $.ajax({
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/user/seccion',
            type: 'GET',
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