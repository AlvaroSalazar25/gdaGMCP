const URL_BASE = 'http://localhost/gdagmcp';
const token = JSON.parse(localStorage.getItem('token'))
let unidades;
let secciones;
let roles;
let formulario;
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
    console.log('hola');
    formulario = await traerFormularios();
    console.log('formuarios',formulario);
    dibujarFormulario();
    $('#tablaFormularios').DataTable({
        language: {
            url: URL_BASE+'/public/build/js/varios/DataTable_es_es.json'
          }
    });
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

// funcion que carga las secciones para saber que formulario esta activo
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

function traerFormularios() {
    return new Promise((resolve, reject) => {
        let formularios = []
        $.ajax({
            data: {
                "tipo": 'formularios'
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + '/formulario/datos',
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

async function dibujarFormulario(id, tipo = 1) {
    var html = '';
    let formulariosActualizados = await traerFormularios();
    console.log(formulariosActualizados);
    html += '<h1 class="text-black mb-3"><strong>Administrar Formularios</strong></h1>'
    html += '<section>'
    html += '<div class="mb-3">'
    html += '<div class="d-flex justify-content-end">'
    html += '<a class=" btn btn-secondary" style="margin-right:5px" onclick="agregarFormulario(1)"><i class="fa-solid fa-plus fa-2x"></i> <span class="span-boton">Formulario</span></a>'
    html += '</div>'
    html += '</div>'
    html += '</section>'
    html += '<table class="table" style="min-width:900px" id="tablaFormularios">'
    html += '<thead class="table-dark">'
    html += '<tr class="" style="text-transform:uppercase">'
    html += '<th>N°</th>'
    html += '<th class="">Formulario</th>'
    html += '<th class="">Versión</th>'
    html += '<th class="">Campos</th>'
    html += '<th class="col-2">Acciones</th>'
    html += '</tr>'
    html += '</thead>'
    html += '<tbody class="contenido" id="contenido">'
    formulariosActualizados.forEach((formulario, index) => {
        html += '<tr class="">'
        html += '<td>' + (parseInt(index) + 1) + '</td>'
        if (formulario.idSeccion != null) {
            html += '<td>' + formulario.nombre + '<span class="badge rounded-pill bg-success" style="margin-left:10px">Activo</span></td>'
        } else {
            html += '<td>' + formulario.nombre + '</td>'
        }
        html += '<td>'
        html += '<div class="puntero" title="Actualizado última vez : ' + formulario.updated_at + '">' + formulario.version + '</div>'
        html += '</td>'
        html += '<td>'
        html += '<buttom class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalForm' + formulario.id + '">Ver campos</buttom>'
        html += '</td>'
        html += '<td>'
        html += '<div class="acciones-user">'
        html += '<a class="btn btn-warning botonAccionesSeccion" style="margin-right:5px" id="' + formulario.id + '"  onclick="agregarFormulario(2,' + formulario.id + ')"><i class="fa-solid fa-pen-to-square marginIcon"></i>Editar</a>'
        html += '<a class="btn btn-danger botonAccionesSeccion" onclick="eliminarFormulario(' + formulario.id + ')"><i class="fa-solid fa-trash marginIcon"></i>Eliminar</a>'
        html += '</div>'
        html += '</td>'

        //    Modal
        html += '<div class="modal fade" id="exampleModalForm' + formulario.id + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'
        html += '<div class="modal-dialog modal-dialog-centered">'
        html += '<div class="modal-content">'
        html += '<div class="modal-header">'
        html += '<h5 class="modal-title" id="exampleModalLabel">Campos de Formulario ' + formulario.nombre.toUpperCase() + '</h5>'
        html += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'
        html += '</div>'
        html += '<div class="modal-body">'
        const campos = JSON.parse(formulario.campos)
        const keywords = JSON.parse(formulario.keywords)
        html += '<div class=" w-100 mb-3">'
        html += '<label class="form-label"><strong>' + keywords.input + '</strong></label>'
        html += '<div class="input-group ">'
        html += '<span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-a"></i></span>'
        html += '<input type="' + keywords.type + '" class="form-control cursito" placeholder="Ingrese el valor para ' + keywords.input + '" disabled>'
        html += '</div>'
        html += '</div>'
        html += '<div class="w-100 mb-3">'
        campos.forEach(campo => {
            html += '<div class="row">'
            html += '<label class="form-label"><strong>' + campo.input + '</strong></label>'
            html += '<div class="input-group ">'
            if (campo.type == 'text') {
                html += '<span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-pen"></i></span>'
            } else {
                html += '<span class="input-group-text" id="basic-addon1"><i class="fa-regular fa-calendar"></i></span>'
            }
            html += '<input type="' + campo.type + '" class="form-control cursito" placeholder="Ingrese el valor para ' + campo.input + '" disabled>'
            html += '</div>'
            html += '</div>'
        });
        html += '</div>'

        html += '<div class=" mb-3">'
        html += '<label class="form-label"><strong>Archivo</strong></label>'
        html += '<div class="input-group">'
        html += '<input type="file" class="form-control cursito"  disabled>'
        html += '</div>'
        html += '</div>'

        html += '<div class="modal-footer">'
        html += '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>'
        html += '</div>'
        html += '</div>'
        html += '</div>'
        html += '</div>'
    })
    html += '</tbody>'
    html += '</table>'
    document.getElementById("dibujar-js").innerHTML = html;
    $('#tablaFormularios').DataTable({
        language: {
            url: URL_BASE+'/public/build/js/varios/DataTable_es_es.json'
          }
    });
}

async function agregarFormulario(tipo = 1, id) {
    var html = '';
    let formulariosActualizados = await traerFormularios();
    if (tipo == '2') {
        var formulario = formulariosActualizados.find(form => form.id == id);
        console.log('oppp', formulario);
    }
    let nombre = ""
    if (!formulario) {
        nombre = "";
    } else {
        nombre = formulario.nombre;
    }
    html += '<h1 class="text-black mb-3"><strong>Administrar Formularios</strong></h1>'
    html += '<div class="contenedor-crearUsuario bg-light ">'
    if (tipo == '2') {
        html += '<h3 class="text-black mt-2 mb-4">Edite los datos del formulario <strong>' + nombre + '</strong></h3>'
    } else {
        html += '<h3 class="text-black mt-2 mb-4">Ingrese los datos del nuevo Formulario</h3>'
    }
    html += '<div class="mb-3">'
    html += '<label class="form-label"><strong>Nombre de Formulario:</strong></label>'
    html += '<input type="text" class="form-control" id="nombreFormulario" name="nombreFormulario" value="' + nombre + '" placeholder="Ingrese nombre del formulario" aria-label="Username" aria-describedby="basic-addon1">'
    html += '</div>'

    html += '<div class="accordion mb-3" id="accordionExample1">'
    html += '<div class="accordion-item">'
    html += '<h2 class="accordion-header" id="headingOne">'
    html += '<button class="accordion-button collapsed"  type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne1" aria-expanded="false" aria-controls="collapseOne">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Keywords</strong></label>'
    html += '</button>'
    html += '</h2>'
    html += '<div id="collapseOne1" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample1" style="">'
    html += ' <div class="accordion-body">'

    html += '<label class="form-label"><strong>Campo para ingresar palabras clave</strong></label>'
    html += '<div class="mb-3" style="border-radius:5px;">'
    html += '<div class="d-flex w-100 justify-content-center">'
    html += '<input type="text" class="form-control cursito" style="margin-right:5px" name="keywords" disabled placeholder="* Campo Obligatorio">'
    html += '<select class="form-select cursito mr-1" name="keywords" >'
    html += '<option value="text" selected disabled>text</option>'
    html += '</select>'
    html += '</div>'
    html += '</div>'

    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'

    html += '<div class="accordion" id="accordionExample">'
    html += '<div class="accordion-item">'
    html += '<h2 class="accordion-header" id="headingOne">'
    html += '<button class="accordion-button collapsed" id="errorArchivo" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Archivo</strong></label>'
    html += '</button>'
    html += '</h2>'
    html += '<div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">'
    html += ' <div class="accordion-body" id="errorArchivoBody">'

    html += '<div class="mb-3">'
    html += '<label for="exampleFormControlInput1" class="form-label "><strong>Archivo:</strong></label>'
    html += '<input class="form-control cursito disabled" type="file" name="archivo" id="archivo">'
    html += '</div>'

    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Seleccione los tipos de archivos que se pueden subir:</strong></label>'
    html += '<div class="mb-3 row">'
    let tipos = ['PDF', 'DOC', 'ODF', 'XLSX', 'PNG', 'JPEG']
    if (tipo == '2') {
        let tiposForm = JSON.parse(formulario.archivo);
        let tiposFormU = tiposForm.map(tipoForm => {
            return tipoForm.toUpperCase();
        })

        tipos.forEach(tipo => {
            html += '<div class="d-flex justify-content-start align-items-center" >' //div d elos inputs
            html += '<label style="width:50px"  class="form-label">' + tipo + ':</label>'
            let filtrado = tiposFormU.find(elemento => elemento == tipo)
            console.log('filtro', filtrado);
            if (filtrado != undefined) {
                html += '<input class="checks" checked type="checkbox" value="' + tipo.toLowerCase() + '">'
            } else {
                html += '<input class="checks" type="checkbox" value="' + tipo.toLowerCase() + '">'
            }
            html += '</div>' // div de los inputs
        })
    } else {
        tipos.forEach(tipo => {
            html += '<div class="d-flex justify-content-start align-items-center" >' //div d elos inputs
            html += '<label style="width:50px"  class="form-label">' + tipo + ':</label>'
            if (tipo == 'PDF' || tipo == 'DOC') {
                html += '<input class="checks" type="checkbox" checked value="' + tipo.toLowerCase() + '">'
            } else {
                html += '<input class="checks" type="checkbox" value="' + tipo.toLowerCase() + '">'
            }
            html += '</div>' // div de los inputs
        })
    }
    html += '</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'

    html += '<div class="mb-3 mt-3">'
    html += '<label for="exampleFormControlInput1" class="form-label"><strong>Campos Personalizados:</strong></label>'
    html += '<div class="bg-white" id="emptyInputs"  style="min-height:150px;border:1px solid #dde1e6;border-radius:5px">'

    html += '<div class="w-100 mb-3 mt-4" id="dinamicCampo">'
    let total = 1;
    if (tipo == '2') {
        let campos = JSON.parse(formulario.campos)
        campos.forEach(campo => {
            html += '<div class=" divCrear">'
            html += '<div class="d-flex justify-content-center align-items-center" style="font-size:13px"><p>' + total + '</p></div>'
            html += '<input class="form-control impt" type="text" id="nombresInputs" value="' + campo.input + '" placeholder="Ingrese nombre de campo">'
            html += '<select class="form-select sltd" id="selectInputs">'
            html += '<option value="" selected disabled> -- Seleccione el tipo de campo -- </option>'
            if (campo.type == 'text') {
                html += '<option value="text" selected>Text</option>'
                html += '<option value="date">Date</option>'
            } else {
                html += '<option value="text">Text</option>'
                html += '<option value="date" selected>Date</option>'
            }
            html += '</select> '
            html += '<button class="btn btn-danger" onclick="eliminar(this)"><i class="fa-solid fa-trash-can"></i></button>'
            total++;
            html += '</div>'
        })
    }
    html += '</div>'

    html += '<div class="d-flex justify-content-center align-items-center btnAltura mb-3"  id="botonAltura">'
    html += '<buttom style="font-size:15px" class="btn btn-rounded btn-primary" id="agregar" onclick="agregarCampo(' + 2 + ',' + total + ')"><i class="fa-solid fa-plus" style="margin-right:5px;"></i>Agregar campo</buttom>'
    html += '</div>'

    html += '</div>'

    html += '</div>'
    html += '</div>'

    html += '<div class="dibujar-formulario">'
    html += '</div>'

    html += '<div class="w-100 mt-2" id="alertas">'
    html += '</div>'
    html += '<div class="my-5 d-flex justify-content-center align-items-center" id="botonCrear">'
    html += '<a class="btn btn-success py-3 px-4 d-flex justify-content-center align-items-center" style="font-size:15px" onclick="guardarInputs(' + tipo + ',' + id + ')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>'
    html += '</div>'

    html += '<div class=" d-flex justify-content-start align-items-center">'
    html += '<a class="btn btn-outline-danger px-3 py-1" id="botonCrear" style="font-size:15px" onclick="dibujarFormulario()"><i class="fa-solid fa-arrow-left"></i> <span style="margin-left:8px">Atrás</span></a>'
    html += '</div>'

    html += '</div>'

    document.getElementById("dibujar-js").innerHTML = html;
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
                $('#tablaSecciones').DataTable({
                    language: {
                        url: URL_BASE+'/public/build/js/varios/DataTable_es_es.json'
                      }
                });
            })
        } else if (response.error) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.error
            }).then(() => {
                dibujarSecciones();
                $('#tablaSecciones').DataTable({
                    language: {
                        url: URL_BASE+'/public/build/js/varios/DataTable_es_es.json'
                      }
                });

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

async function eliminarFormulario(id) {
    let formulariosActualizados = await traerFormularios();
    const formularioEliminar = formulariosActualizados.find(form => form.id == id)
    console.log(formularioEliminar);

    Swal.fire({
        title: 'ELIMINAR',
        text: `El Formulario ${formularioEliminar.nombre} se eliminará de forma permanente`,
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
                url: URL_BASE + '/formulario/delete',
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
                        dibujarFormulario()
                    })
                } else if (response.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'ERROR',
                        text: response.error
                    }).then(() => {
                        dibujarFormulario()
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

function agregarCampo(tipo, totales) {
    document.getElementById('emptyInputs').classList.remove('errorInput')
    let total;
    if (tipo == '1') {
        total = 1;
    } else {
        total = totales
    }
    const contenedor = document.querySelector('#dinamicCampo');
    let cont = 0;
    var html = "";
    let divCrear = document.createElement('div');
    html += '<div class="d-flex justify-content-center align-items-center" style="font-size:13px"><p>' + total + '</p></div>'
    html += '<input class="form-control impt" type="text" id="nombresInputs" placeholder="Ingrese nombre de campo">'
    html += '<select class="form-select sltd" id="selectInputs">'
    html += '<option value="" selected disabled> -- Seleccione el tipo de campo -- </option>'
    html += '<option value="text">Text</option>'
    html += '<option value="date">Date</option>'
    html += '</select> '
    html += '<button class="btn btn-danger" onclick="eliminar(this)"><i class="fa-solid fa-trash-can"></i></button>'
    divCrear.innerHTML = html
    divCrear.classList.add('divCrear')
    contenedor.appendChild(divCrear);
    cont++
    if (cont < 2) {
        document.getElementById('botonAltura').classList.remove('btnAltura')
    } else {
        document.getElementById('botonAltura').classList.add('btnAltura')

    }
    actualizarContador();
}

eliminar = (e) => {
    console.log(e.parentNode);
    const contenedor = document.querySelector('#dinamicCampo');
    const divPadre = e.parentNode;
    contenedor.removeChild(divPadre);
    actualizarContador();
};

const actualizarContador = () => {
    const contenedor = document.querySelector('#dinamicCampo');
    let divs = contenedor.children;
    total = 1;
    for (let i = 0; i < divs.length; i++) {
        divs[i].children[0].innerHTML = total++ + '-';
    } //end for
};

async function guardarInputs(tipo, id) {
    let type = []
    let cont = 0
    let checksArchivo = document.querySelectorAll('.checks')
    checksArchivo.forEach(checkArchivo => {
        if (checkArchivo.checked == true) {
            if (checkArchivo.value == 'doc') {
                type.push(checkArchivo.value)
                type.push('docs')
            } else {
                type.push(checkArchivo.value)
            }
        }
    })
    console.log('numdetipos', type.length);
    console.log('tipos de archivos', type);
    if (type.length == 0) {
        document.getElementById('errorArchivo').classList.add('errorAccordeon')
        document.getElementById('errorArchivoBody').classList.add('errorInput')
        cont++
    } else {
        document.getElementById('errorArchivo').classList.remove('errorAccordeon')
        document.getElementById('errorArchivoBody').classList.remove('errorInput')
    }
    let nombreFormulario = document.getElementById('nombreFormulario').value.trim()
    let inputsCreate = document.getElementById('dinamicCampo')
    //console.log('0asdfasdf', inputsCreate.children.length);
    if (nombreFormulario.length == 0) {
        document.getElementById('nombreFormulario').classList.add('errorInput')
        cont++
    } else {
        document.getElementById('nombreFormulario').classList.remove('errorInput')
    }
    if (inputsCreate.children.length == 0) {
        document.getElementById('emptyInputs').classList.add('errorInput')
        cont++
    } else {
        document.getElementById('emptyInputs').classList.remove('errorInput')
    }
    let arrayInputs = [];
    let totalesInputs = document.querySelectorAll('.impt')
    totalesInputs.forEach(element => {
        if (element.value == "") {
            cont++
            element.classList.add('errorInput')
        } else {
            element.classList.remove('errorInput')
            arrayInputs.push(element.value)
        }
    });

    let arraySelect = [];
    let totalesSelect = document.querySelectorAll('.sltd')
    totalesSelect.forEach(element => {
        if (element.value == "") {
            cont++
            element.classList.add('errorInput')
        } else {
            element.classList.remove('errorInput')
            arraySelect.push(element.value)
        }
    });
    let campos = []
    for (let i = 0; i < arrayInputs.length; i++) {
        campos.push({
            'input': arrayInputs[i],
            'type': arraySelect[i]
        })
    }
    if (cont > 0) {
        document.getElementById('alertas').classList.remove('apagar')
        let html = ""
        html += '<div class="d-flex justify-content-center align-items-center bg-danger mt-5 py-2 text-white" style="font-size:15px;border:1px solid red;border-radius:5px">No pueden ir campos vacíos</div>'
        document.getElementById("alertas").innerHTML = html;
        setTimeout(() => {
            document.getElementById('botonCrear').classList.remove('apagar')
            document.getElementById('alertas').classList.add('apagar')
        }, 2000);
        document.getElementById('botonCrear').classList.add('apagar')

    } else {
        botonesGuardar('botonCrear', 'px-3', 'py-2')
        const datos = new FormData()
        if (tipo == '2') {
            datos.append('id', id);
        }
        datos.append('nombre', nombreFormulario);
        datos.append('keywords', JSON.stringify({
            'input': 'keywords',
            'type': 'text'
        }));
        datos.append('archivo', JSON.stringify(type));
        datos.append('campos', JSON.stringify(campos))
        console.log([...datos]);

        let url;
        if (tipo == '1') {
            url = URL_BASE + '/formulario/create';
        } else {
            url = URL_BASE + '/formulario/update';
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
                dibujarFormulario();

            })
        } else if (response.error) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: response.error
            }).then(() => {
                dibujarFormulario();
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