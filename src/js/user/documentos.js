const URL_BASE = "http://localhost/gdagmcp";
const token = JSON.parse(localStorage.getItem("token"));
let unidades;
let secciones;
let roles;

document.addEventListener("DOMContentLoaded", iniciarApp());

async function iniciarApp() {
    secciones = await traerSecciones();
    dibujarDocumentos();
}

function alertas() {
    const alertas = document.querySelectorAll(".alert");
    const contenedorAlertas = document.getElementById("alertas");
    const alertaTipo = document.querySelector("#alertaTipo");
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
            });
        }, 3000);
    }
}

function traerSecciones() {
    return new Promise((resolve, reject) => {
        let secciones = [];
        $.ajax({
            data: {
                tipo: "seccion",
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + "/documentos/datos",
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
                    resolve(secciones);
                }
                $.each(response, (index, seccion) => {
                    secciones.push(seccion);
                    if (response.length == index + 1) {
                        resolve(secciones);
                    }
                });
            })
            .fail((err) => {
                reject(err);
            });
    });
}

function traerUltimosDocs() {
    return new Promise((resolve, reject) => {
        let documentos = [];
        $.ajax({
            data: {
                tipo: "5docs",
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + "/documentos/datos",
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
                    resolve(documentos);
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

function traerSeccionesFormulario() {
    return new Promise((resolve, reject) => {
        let secciones = [];
        $.ajax({
            data: {
                tipo: "formularios",
            },
            //url: ENV.URL_BASE + '/user/datos',
            url: URL_BASE + "/documentos/datos",
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
                    resolve(secciones);
                }
                $.each(response, (index, seccion) => {
                    secciones.push(seccion);
                    if (response.length == index + 1) {
                        resolve(secciones);
                    }
                });
            })
            .fail((err) => {
                reject(err);
            });
    });
}

async function dibujarDocumentos() {
    var html = "";
    let seccionesActualizadas = await traerSecciones();
    let ultimos = await traerUltimosDocs();
    document.getElementById("dibujar-tabla").innerHTML = "";

    html +=
        '<h1 class="text-black mb-3"><strong>Administrar Documentos</strong></h1>';
    html += '<div class="mb-3">';
    html += '<div class="d-flex justify-content-end">';
    html +=
        '<a class=" btn btn-primary " onclick="agregarDocumento(1)"><i class="fa-solid fa-plus fa-2x"></i> <span class="span-boton">Agregar Documento</span></a>';
    html += "</div>";
    html += "</div>";
    html += '<div class="contenedor-crearUsuario bg-light ">';
    html +=
        '<h3 class="text-black mt-2 mb-4">Seleccione la Sección para buscar los documentos</h3>';
    html +=
        '<select class="form-select selectDocumentos" name="seccion" id="seccion" onchange="elegirSeccion()">';
    html += '<option value="" selected disabled> -- Seleccione una Sección -- </option>';
    seccionesActualizadas.forEach((seccion) => {
        //console.log("seccion", seccion);
        html +=
            '<option value="' + seccion.id + '">' + seccion.seccion + "</option>";
    });
    html += '</select">';
    html += '</div">';

    document.getElementById("dibujar-js").innerHTML = html;

    var html2 = "";
    html2 += '<h3 class="mb-3 mt-5 text-black">Archivos agregados recientemente</h3>'
    html2 += '<table class="table" style="min-width:1000px" id="tablaDocsUltimo">';
    html2 += '<thead class="table-dark">';
    html2 += '<tr class="" style="text-transform:uppercase">';
    html2 += "<th>N°</th>";
    html2 += '<th class="">Seccion</th>';
    html2 += '<th class="">Formulario</th>';
    html2 += '<th class="">Responsable</th>';
    html2 += '<th class="">Datos</th>';
    html2 += '<th class="">Fecha</th>';
    html2 += '<th class="">Estado</th>';
    html2 += '<th class="">Archivo</th>';
    // html2 += '<th class="col-1">Acciones</th>';
    html2 += "</tr>";
    html2 += "</thead>";
    html2 += '<tbody class="contenido" id="contenido">';
    ultimos.forEach((documento,index) => {
            html2 += "<tr>"
            html2 += "<td>" + (parseInt(index) + 1) + "</td>"
            html2 += "<td>" + documento.seccion + "</td>"
            html2 += "<td>" + documento.formulario + "</td>"
            html2 += "<td>" + documento.responsable + "</td>"
            html2 += '<td><buttom class="btn btn-secondary" style="margin-left:12px" data-bs-toggle="modal" data-bs-target="#exampleModalVer' + documento.id + '">Ver</buttom></td>'; // hacer este boton modal
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
        html2 += "</tbody>";
        html2 += "</table>";

    html2 += '</tbody>';

    document.getElementById("dibujar-tabla").innerHTML = html2;
    $("#tablaDocsUltimo").DataTable({
        language: {
            url: URL_BASE+'/public/build/js/varios/DataTable_es_es.json'
          }
    });

}

async function agregarDocumento() {
    let secciones = await traerSecciones();
    var html = "";
    let tipo = 1;
    document.getElementById("dibujar-tabla").innerHTML = "";

    html += '<h1 class="text-black mb-3"><strong>Administrar Documentos</strong></h1>';
    html += '<div class="mb-3">';
    html += '<div class="d-flex justify-content-end">';
    html += '<a class=" btn btn-outline-danger " onclick="dibujarDocumentos(1)"><i class="fa-solid fa-arrow-left fa-2x"></i> <span class="span-boton">Regresar</span></a>';
    html += "</div>";
    html += "</div>";
    html += '<div class="contenedor-crearUsuario bg-light ">';
    if (tipo == "2") {
        html += '<h3 class="text-black mt-2 mb-4">Edite los datos de ' + +"</h3>";
    } else {
        html +=
            '<h3 class="text-black mt-2 mb-4">Elija la Sección para ingresar el nuevo documento</h3>';
    }
    html += '<div class="mb-3">';
    html +=
        '<label for="exampleFormControlInput1" class="form-label"><strong>Seccion:</strong></label>';
    html +=
        '<select class="form-select w-100" style="height:30px" id="seccion" onchange="elegirSeccionAgregar()">';
    html +=
        ' <option value="" selected disabled> -- Seleccione una sección -- </option>';
    secciones.forEach((seccion) => {
        html +=
            ' <option value="' + seccion.id + '">' + seccion.seccion + "</option>";
    });
    html += "</select>";
    html += "</div>";
    html += "</div>";
    html += "</div>";

    document.getElementById("dibujar-js").innerHTML = html;
}

async function elegirSeccionAgregar() {
    let tipo = "1";
    let id = "1";
    var html = "";
    let seccion = document.getElementById("seccion").value;
    //console.log('seccion', seccion);
    let documentosSeccion = await traerSeccionesFormulario(seccion);
    // console.log('todos los docs',documentosSeccion);
    let filtrado = documentosSeccion.find((form) => form.id == seccion);
    //console.log('si tiene debe darme',filtrado);
    //console.log(filtrado.idFormulario);
    if (filtrado.idFormulario == "1") {
        document.getElementById("dibujar-tabla").innerHTML = "";
        html +=
            '<div class="alert bg-danger px-5 py-2 mt-3 w-100" style="border-radius:5px;border:1px solid red">';
        html += '<div class="d-flex justify-content-center align-items-center">';
        html += '<h4 class="text-white">No Existe Formulario adjunto</h4>';
        html += "</div>";
        html += "</div>";
        document.getElementById("dibujar-tabla").innerHTML = html;
    } else {
        document.getElementById("dibujar-tabla").innerHTML = "";
        html += '<div class="contenedor-crearUsuario bg-light ">';
        if (tipo == 2) {
            html +=
                '<h3 class="text-black mt-2 mb-4">Edite los datos del documento</h3>';
            html +=
                ' <input type="hidden" id="idUser" name="id" value="" placeholder="" required>';
        } else {
            html +=
                '<h3 class="text-black mt-2 mb-4">Ingrese los datos del documento</h3>';
        }
        html += "<form>";
        let campos = JSON.parse(filtrado.campos);
        let keywords = JSON.parse(filtrado.keywords);
        let archivo = JSON.parse(filtrado.archivo);
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
                html +=
                    '<textarea class="w-100 form-control datos" name="' + input + '" rows="5"></textarea>';
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
        html += '<a class="btn btn-success px-5 py-2" id="botonCrear" style="font-size:15px" onclick="saveArchivo(' + filtrado.idFormulario + "," + seccion + ')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>';
        html += "</div>";
        html += "</form>";
        document.getElementById("dibujar-tabla").innerHTML = html;
    }
}

async function saveArchivo(idFormulario = 1, seccion = 1) {
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
                claves = valorInput ;
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
        datos.append('idSeccion', seccion);
        datos.append('idFormulario', idFormulario);
        datos.append('keywords', JSON.stringify(claves))
        datos.append('path', documento);
        datos.append('data', JSON.stringify(info));
        console.log([...datos]);

        let url = URL_BASE + '/documentos/create';
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
                dibujarDocumentos();
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

async function elegirSeccion() {
    var html = "";
    let seccion = document.getElementById("seccion").value;
    //console.log("seccion", seccion);
    let documentosSeccion = await traerDocs(seccion);
    if (documentosSeccion == 0) {
        document.getElementById("dibujar-tabla").innerHTML = "";
        html += '<div class="alert bg-danger px-5 py-2 mt-3 w-100" style="border-radius:5px;border:1px solid red">';
        html += '<div class="d-flex justify-content-center align-items-center">';
        html += '<h4 class="text-white">No Existen Documentos</h4>';
        html += "</div>";
        html += "</div>";
        document.getElementById("dibujar-tabla").innerHTML = html;
    } else {
        html += '<table class="table" style="min-width:1100px" id="tablaDocs">';
        html += '<thead class="table-dark">';
        html += '<tr class="" style="text-transform:uppercase">';
        html += "<th>N°</th>";
        html += '<th class="">Seccion</th>';
        html += '<th class="">Formulario</th>';
        html += '<th class="">Responsable</th>';
        html += '<th class="">Datos</th>';
        html += '<th class="">Fecha</th>';
        html += '<th class="">Estado</th>';
        html += '<th class="">Archivo</th>';
        // html += '<th class="col-1">Acciones</th>';
        html += "</tr>";
        html += "</thead>";
        html += '<tbody class="contenido" id="contenido">';
        documentosSeccion.forEach((documento, index) => {
            html += "<tr>"
            html += "<td>" + (parseInt(index) + 1) + "</td>"
            html += "<td>" + documento.seccion + "</td>"
            html += "<td>" + documento.formulario + "</td>"
            html += "<td>" + documento.responsable + "</td>"
            html += '<td><buttom class="btn btn-secondary" style="margin-left:12px" data-bs-toggle="modal" data-bs-target="#exampleModalVer' + documento.id + '">Ver</buttom></td>'; // hacer este boton modal
            html += '<td>' + documento.created_at.split(" ")[0] + '</td>'
            html += '<td>'
            if (documento.status == 0) {
                html += '<span class="badge badge-pill bg-danger" style="margin-left:15px"><i class="fa-solid fa-circle-exclamation fa-lg"></i></span>'
            } else {
                html += '<span class="badge badge-pill bg-success" style="margin-left:15px"><i class="fa-solid fa-circle-check fa-lg"></i></span>'
            }
            html += '</td>'
            html += '<td>'
            const urlA = "'" + documento.path + "'";
            const nombreA = "'" + documento.codigo + "'"
            html += '<buttom title="Ver Documento" class="btn btn-outline-primary" style="margin-right:5px" onclick="abrirPdf(' + urlA + "," + nombreA + ')"><i class="fa-solid fa-file-pdf fa-2x"></i></buttom>';
            html += '<buttom title="Descargar Documento" class="btn btn-primary"><i class="fa-solid fa-file-pdf fa-2x"></i></buttom>';
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

            let claves = JSON.parse(documento.keywords)
            let datos = JSON.parse(documento.data)
            html += "<p><strong>KEYWORDS</strong></p>";
            html += "<p>" + claves.keywords + "</p>";
            console.log('datos', datos);
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
        html += "</tbody>";
        html += "</table>";

        document.getElementById("dibujar-tabla").innerHTML = html;
        $("#tablaDocs").DataTable({
            language: {
                url: URL_BASE+'/public/build/js/varios/DataTable_es_es.json'
              }
        });
    }
}

function abrirPdf(path, nombre) {
    window.open(URL_BASE + path, nombre, "width=620,height=400,fullscreen=yes,scrollbars=NO")
    parent.opener = top;
    opener.close();
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
            url: URL_BASE + "/documentos/datos",
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
                    console.log(response);
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
