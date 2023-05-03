const URL_BASE="http://localhost/gdagmcp",CARPETA_BASE="/base",token=JSON.parse(localStorage.getItem("token"));let unidades,secciones,roles,permisosDefault=[{id:"1",nombre:"Leer",status:"false"},{id:"2",nombre:"Escribir",status:"false"}];async function iniciarApp(){await dibujarPadreAndCarpetas(0)}function alertas(){const e=document.querySelectorAll(".alert"),a=document.getElementById("alertas"),t=document.querySelector("#alertaTipo");e&&setTimeout(()=>{e.forEach((function(e){e.remove(),a&&(a.innerHTML=""),t&&(t.innerHTML="")}))},3e3)}function traerSecciones(){return new Promise((e,a)=>{let t=[];$.ajax({data:{tipo:"seccion"},url:URL_BASE+"/seccion/datos",type:"POST",headers:{token:token},dataType:"json"}).done(a=>{a.exit&&Swal.fire({icon:"warning",title:a.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==a.length&&(console.log("secciones",t),e(t)),$.each(a,(i,s)=>{t.push(s),a.length==i+1&&e(t)})}).fail(e=>{a(e)})})}function traerFormularios(){return new Promise((e,a)=>{let t=[];$.ajax({data:{tipo:"formularios"},url:URL_BASE+"/seccion/datos",type:"POST",headers:{token:token},dataType:"json"}).done(a=>{a.exit&&Swal.fire({icon:"warning",title:a.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==a.length&&e(t),$.each(a,(i,s)=>{t.push(s),a.length==i+1&&e(t)})}).fail(e=>{a(e)})})}function traerDocs(e){return new Promise((a,t)=>{let i=[];$.ajax({data:{id:e,tipo:"documentos"},url:URL_BASE+"/seccion/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==e.length&&a(0),$.each(e,(t,s)=>{i.push(s),e.length==t+1&&a(i)})}).fail(e=>{t(e)})})}function traerHijos(e=0){return new Promise((a,t)=>{let i=[];$.ajax({data:{id:e,tipo:"hijos"},url:URL_BASE+"/seccion/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==e.length&&a(i),$.each(e,(t,s)=>{i.push(s),e.length==t+1&&a(i)})}).fail(e=>{t(e)})})}function moverCarpeta(e){return new Promise((a,t)=>{let i=[];$.ajax({data:{id:e,tipo:"updateCarpetas"},url:URL_BASE+"/seccion/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==e.length&&a(i),$.each(e,(t,s)=>{i.push(s),e.length==t+1&&a(i)})}).fail(e=>{t(e)})})}async function dibujarAtras(e){dibujarPadreAndCarpetas((await traerSecciones()).find(a=>a.id==e).idPadre)}function hexToRgb(e){const a=e.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);if(a)return a.slice(1).map(e=>parseInt(e,16));const t=e.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);return t?t.slice(1).map(e=>17*parseInt(e,16)):0}function buscarCarpeta(e){document.getElementById("divBtnBuscar").innerHTML="",console.log("seecionActual",e);var a="";a+='<div class=" d-flex  justify-content-end" >',a+='<input style="width:193.5px;height:32.3px" class="form-control" id="buscarFocus" type="text" placeholder="Ingrese nombre de carpeta" onKeyUp="escucharCarpeta(this.value,'+(null!=e?e:0)+')">',a+="</div>",document.getElementById("divBtnBuscar").innerHTML=a,document.getElementById("buscarFocus").focus()}async function dibujarPadreAndCarpetas(e){await dibujarPadre(e),await dibujarHijosPadre(e)}async function dibujarPath(e){"base"!=e?$.ajax({data:{tipo:"buscarPath",value:e.replace("_"," ")},url:URL_BASE+"/seccion/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),e.forEach(e=>{dibujarPadreAndCarpetas(e.id)})}).fail(e=>{console.log(e)}):dibujarPadreAndCarpetas(0)}async function dibujarPadre(e){var a="";let t=(await traerSecciones()).find(a=>a.id==e);if(a+='<div class="d-flex justify-content-center padreAtras">',a+='<div class="d-flex justify-content-center hijoAtras">',a+='<a class=" btn btn-outline-danger '+(null==t?"noVisible":"")+' " onclick="dibujarAtras('+e+')"><i class="fa-solid fa-arrow-left-long fa-2x"></i> <span class="span-boton">Atrás</span></a>',a+="</div>",null==t?a+='<h1 class="text-black mb-3"><strong>Administrar Carpetas</strong></h1>':(a+='<div class="d-flex flex-column justify-content-center">',a+='<div class="d-flex justify-content-center">',a+='<h1 class="text-black mb-3"><i class="fa-solid fa-folder-open fa-xl" style="margin-right:7px;color:'+t.color+'"></i><strong>'+(t.seccion[0].toUpperCase()+t.seccion.substring(1))+"</strong></h1>",a+='<button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" style="margin-left:5px;margin-top:4px;width:25px;height:30px;border-radius:15px">',a+='<i class="fa-solid fa-ellipsis-vertical fa-xl "></i>',a+="</button>",a+='<ul class="dropdown-menu dropdown-menu-dark">',a+=' <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalEditar'+t.id+'"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>',a+='<li class="puntero"><a class="dropdown-item" onclick="deleteSeccion('+t.id+')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>',a+="</ul>",a+="</div>",t.descripcion.length>0?a+='<h3 class="text-black mt-3 mb-4">'+(t.descripcion[0].toUpperCase()+t.descripcion.substring(1))+"</h3>":a+='<h3 class="text-black mt-3 mb-4">'+t.descripcion+"</h3>",a+="</div>"),a+="</div>",a+='<div class="d-flex justify-content-end mt-2">',a+='<div style="margin-right:5px" id="divBtnBuscar">',a+='<a class="btn btn-outline-primary" onclick="buscarCarpeta('+(null!=t?t.id:0)+')"><i class="fa-solid fa-magnifying-glass fa-2x"></i><span class="span-boton">Carpeta</span></a>',a+="</div>",a+="<div>",a+='<a class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal'+e+'" id="'+e+'"><i class="fa-solid fa-plus fa-2x"></i><span class="span-boton">Carpeta</span></a>',a+="</div>",a+="</div>",a+='<div class="w-100 mt-2">',null!=t){let e=("/base"+t.path).split("/");e.shift();e.forEach(e=>{var t=e.replace("_"," ");a+='<a class="puntero" style="text-decoration: none !important;" onclick="dibujarPath(\''+t+"')\"><strong>"+(t[0].toUpperCase()+t.substring(1))+"</strong></a> /  "})}if(a+="</div>",a+='<div class="contenedor-carpetas my-4" id="contenedorCarpetas" >',a+='<div class="d-flex justify-content-center align-items-center" style="height:129.5px">',a+=' <div class="spinner-grow" role="status">',a+='<span class="visually-hidden">Loading...</span>',a+="</div>",a+=' <div class="spinner-grow" role="status">',a+='<span class="visually-hidden">Loading...</span>',a+="</div>",a+=' <div class="spinner-grow" role="status">',a+='<span class="visually-hidden">Loading...</span>',a+="</div>",a+="</div>",a+="</div>",a+='<div class="modal fade" id="exampleModal'+e+'" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">',a+='<div class="modal-dialog">',a+='<div class="modal-content">',a+='  <div class="modal-header bg-black">',a+=null==t?'   <h5 class="modal-title text-white">Crear Carpeta</h5>':'   <h5 class="modal-title text-white">Agregar Carpeta en '+t.seccion+"</h5>",a+='<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>',a+="  </div>",a+='  <div class="modal-body">',a+='<h3 class="text-black mt-2 mb-4">Ingresar datos de la Carpeta</h3>',a+='<div class="mb-3">',a+='<label  class="form-label"><strong>Nombre:</strong></label>',a+='<input type="text" class="form-control" id="seccion" name="seccion" placeholder="Ingrese nombre">',a+="</div>",a+='<div class="mb-2">',a+='<label  class="form-label"><strong>Descripción:</strong></label>',a+='<textarea class="form-control" rows="5" id="descripcion" placeholder="Ingrese descripción"></textarea>',a+="</div>",a+='<div class="mb-3">',a+='<label  class="form-label"><strong>Color:</strong></label>',a+='<input type="color" class="form-control w-25" id="color" name="color">',a+="</div>",a+='<div class="w-100 mt-2" id="alertas">',a+="</div>",a+="</div>",a+='<div class="modal-footer">',a+='<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>',a+=null==t?'<a class="btn btn-success" id="botonCrear" onclick="createSeccion(0)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>':'<a class="btn btn-success" id="botonCrear" onclick="createSeccion('+e+')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>',a+="</div>",a+="</div>",a+="</div>",a+="</div>",void 0!==t){a+='<div class="modal fade" id="exampleModalEditar'+t.id+'" tabindex="-1" aria-labelledby="exampleModalLabel'+t.id+'" aria-hidden="true">',a+='<div class="modal-dialog">',a+='<div class="modal-content">',a+='  <div class="modal-header bg-black">',a+='   <h5 class="modal-title text-white">Editar</h5>',a+='<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>',a+="  </div>",a+='  <div class="modal-body" style="min-height:350px">',a+='<h3 class="text-black mt-2 mb-4">Edite <strong>'+t.seccion+"</strong></h3>",a+='<div class="mb-4 d-flex justify-content-between">',a+='<div class="d-flex flex-column" style="width:70%">',a+='<label  class="form-label"><strong>Nombre:</strong></label>',a+='<input type="text" class="form-control" id="seccion'+t.id+'" value="'+t.seccion+'">',a+="</div>",a+='<div class="d-flex flex-column" style="width:28%">',a+='<label class="form-label"><strong>Color:</strong></label>',a+='<input type="color" class="form-control  puntero" id="color'+t.id+'" value="'+t.color+'">',a+="</div>",a+="</div>",a+='<div class="mb-4">',a+='<label for="exampleFormControlInput1" class="form-label"><strong>Descripción:</strong></label>',""==t.descripcion?a+='<textarea class="form-control" rows="6" id="descripcion'+t.id+'" placeholder="Esta Sección no tiene descripción"></textarea>':a+='<textarea class="form-control" rows="6" id="descripcion'+t.id+'" >'+t.descripcion+"</textarea>",a+="</div>",a+='<div class="mb-4">',a+='<div class="w-100">',a+='<label class="form-label"><strong>Mover Carpeta:</strong></label>',a+="</div>",a+='<div style="height:30px">',a+='<select style="width:100%;height:100% !important" id="select'+t.id+'" class="js-example-basic-single" >';const i={id:"0",idPadre:"0",seccion:"CARPETA BASE",descripcion:"",color:"#000000",path:"/base"};let s=JSON.parse(t.carpetas);s.unshift(i),s.forEach(e=>{e.id!=t.id&&(a+='<optgroup label="'+e.seccion+'">',a+='<option value="'+e.id+'" '+(e.id==t.idPadre?"selected":"")+'><strong><i class="fa-solid fa-folder-open"></i></strong>'+e.path+"</option>",a+="</optgroup>")}),a+="</select>",a+="</div>",a+='<div class="w-100 mt-4" id="alertas'+t.id+'">',a+="</div>",a+="</div>",a+="</div>",a+='<div class="modal-footer">',a+='<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>',a+='<a class="btn btn-success" id="botonCrear" onclick="updateSeccion('+e+","+t.id+',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>',a+="</div>",a+="</div>",a+="</div>",a+="</div>"}document.getElementById("dibujar-js").innerHTML=a,document.getElementById("dibujar-tabla").innerHTML="",e>0&&await dibujarDocs(e,t.seccion),$("#select"+e).select2({dropdownParent:$("#exampleModalEditar"+e)})}async function dibujarHijosPadre(e,a=0){let t="";t=a||await traerHijos(e);var i="";0===t.length?(i+='<div class="alert  px-5 py-2 mt-3 w-100 ">',i+='<div class="d-flex justify-content-center align-items-center">',i+='<h4 class="" style="color:red">No Existen Carpetas</h4>',i+="</div>",i+="</div>"):(i+='<div class="d-flex justify-content-center " style="flex-wrap:wrap">',t.forEach(a=>{i+='<div class="p-3 padreCarpeta">',i+='<a class="btn hoverCarpeta" style="border:1px solid #e2e4e6" onclick="dibujarPadreAndCarpetas('+a.id+')">',i+='<div class="row justify-content-center align-items-center  widthCarpeta ">',i+='<div class="">',i+='<i class="fa-regular fa-folder-open" style="font-size:40px;margin-bottom:10px;color:'+a.color+'"></i>',i+='<div style="margin-bottom:-7px">',i+='<p style="font-weight:bold">'+(a.seccion[0].toUpperCase()+a.seccion.substring(1))+"</p>",i+="</div>",i+="</div>",i+="</div>",i+="</a>",i+='<div class="d-flex justify-content-center align-items-center elip">',i+='<buttom class="btn btn-outline-secondary botonesCarpeta btn-hover dropdown-toggle py-2 px-3"  style="border:none" data-bs-toggle="dropdown" aria-expanded="false" type="buttom">',i+='<i class="fa-solid fa-ellipsis-vertical fa-xl elip" ></i>',i+="</buttom>",i+='<ul class="dropdown-menu dropdown-menu-dark">',i+='<li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal'+a.id+'"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>',i+='<li class="puntero"><a class="dropdown-item" onclick="deleteSeccion('+a.id+')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>',i+=" </ul>",i+="</div>",i+="</div>",i+='<div class="modal fade" id="exampleModal'+a.id+'" tabindex="-1" aria-labelledby="exampleModalLabel'+a.id+'" aria-hidden="true">',i+='<div class="modal-dialog">',i+='<div class="modal-content">',i+='  <div class="modal-header bg-black">',i+='   <h5 class="modal-title text-white">Editar</h5>',i+='<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>',i+="  </div>",i+='  <div class="modal-body" style="min-height:350px">',i+='<h3 class="text-black mt-2 mb-4">Edite <strong>'+a.seccion+"</strong></h3>",i+='<div class="mb-4 d-flex justify-content-between">',i+='<div class="d-flex flex-column" style="width:70%">',i+='<label  class="form-label"><strong>Nombre:</strong></label>',i+='<input type="text" class="form-control" id="seccion'+a.id+'" value="'+a.seccion+'">',i+="</div>",i+='<div class="d-flex flex-column" style="width:28%">',i+='<label class="form-label"><strong>Color:</strong></label>',i+='<input type="color" class="form-control  puntero" id="color'+a.id+'" value="'+a.color+'">',i+="</div>",i+="</div>",i+='<div class="mb-4">',i+='<label for="exampleFormControlInput1" class="form-label"><strong>Descripción:</strong></label>',""==a.descripcion?i+='<textarea class="form-control" rows="6" id="descripcion'+a.id+'" placeholder="Esta Sección no tiene descripción"></textarea>':i+='<textarea class="form-control" rows="6" id="descripcion'+a.id+'" >'+a.descripcion+"</textarea>",i+="</div>",i+='<div class="mb-4">',i+='<div class="w-100">',i+='<label class="form-label"><strong>Mover Carpeta:</strong></label>',i+="</div>",i+='<div style="height:30px">',i+='<select style="width:100%;height:100% !important" id="select'+a.id+'" class="js-example-basic-single" >';let t=JSON.parse(a.carpetas);t.unshift({id:"0",idPadre:"0",seccion:"CARPETA BASE",descripcion:"",color:"#000000",path:"/base"}),t.forEach(t=>{t.id!=a.id&&(i+='<optgroup label="'+t.seccion+'">',i+='<option value="'+t.id+'" '+(t.id==e?"selected":"")+'><strong><i class="fa-solid fa-folder-open"></i></strong>'+t.path+"</option>",i+="</optgroup>")}),i+="</select>",i+="</div>",i+='<div class="w-100 mt-4" id="alertas'+a.id+'">',i+="</div>",i+="</div>",i+="</div>",i+='<div class="modal-footer">',i+='<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>',i+='<a class="btn btn-success" id="botonCrear" onclick="updateSeccion('+e+","+a.id+',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>',i+="</div>",i+="</div>",i+="</div>",i+="</div>"}),i+="</div>"),document.getElementById("contenedorCarpetas").innerHTML=i,t.forEach(e=>{$("#select"+e.id).select2({dropdownParent:$("#exampleModal"+e.id)})})}async function dibujarDocs(e,a){let t=await traerDocs(e);var i="";i+='<h3 class="mb-3 mt-5 text-black">Documentos de     <strong>'+a+"</strong></h3>",i+='<div class="d-flex mb-3 justify-content-end ">',i+='<a class="btn btn-warning" style="margin-right:3px" data-bs-toggle="modal" data-bs-target="#exampleModal'+e+'" id="'+e+'"><i class="fa-solid fa-plus fa-2x"></i></i> <span class="span-boton">Documento</span></a>',i+="</div>",i+='<table class="table" style="min-width:1000px" id="tablaDocsUltimo">',i+='<thead class="table-dark">',i+='<tr class="" style="text-transform:uppercase">',i+="<th>N°</th>",i+='<th class="">Alias</th>',i+='<th class="">Formulario</th>',i+='<th class="">Datos</th>',i+='<th class="">Responsable</th>',i+='<th class="">Fecha</th>',i+='<th class="">Estado</th>',i+='<th class="">Archivo</th>',i+="</tr>",i+="</thead>",i+='<tbody class="contenido" id="contenido">',t.length>0&&t.forEach((e,a)=>{i+="<tr>",i+="<td>"+(parseInt(a)+1)+"</td>",i+="<td>"+e.alias+"</td>",i+="<td>"+e.formulario+"</td>",i+='<td><buttom class="btn btn-secondary" style="margin-left:12px" data-bs-toggle="modal" data-bs-target="#exampleModalVer'+e.id+'">Ver</buttom></td>',i+="<td>"+e.responsable+"</td>",i+="<td>"+e.created_at.split(" ")[0]+"</td>",i+="<td>",0==e.status?i+='<span class="badge badge-pill bg-danger" style="margin-left:15px"><i class="fa-solid fa-circle-exclamation fa-lg"></i></span>':i+='<span class="badge badge-pill bg-success" style="margin-left:15px"><i class="fa-solid fa-circle-check fa-lg"></i></span>',i+="</td>",i+="<td>";const t="'"+e.path+"'",s="'"+e.codigo+"'";i+='<buttom title="Ver Documento" class="btn btn-outline-primary" style="margin-right:5px" onclick="abrirPdf('+t+","+s+')"><i class="fa-solid fa-file-pdf fa-2x"></i></buttom>',i+='<buttom title="Descargar Documento" class="btn btn-primary"><i class="fa-solid fa-file-pdf fa-2x"></i></buttom>',i+="</td>",i+="</tr>",i+='<div class="modal fade" id="exampleModalVer'+e.id+'" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">',i+=' <div class="modal-dialog modal-dialog-centered">',i+=' <div class="modal-content">',i+=' <div class="modal-header bg-black ">',i+=' <h5 class="modal-title text-white" id="exampleModalLabel">Metadatos del Documento <strong>'+e.codigo+"</strong></h5>",i+='<button type="button" class="btn text-white" style="font-size:13px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>',i+=" </div>",i+='  <div class="modal-body">';let o=e.keywords,l=JSON.parse(e.data);i+="<p><strong>KEYWORDS</strong></p>",i+="<p>"+o+"</p>",l.forEach(e=>{i+="<p><strong>"+e.nombre.toUpperCase()+"</strong></p>",i+="<p>"+e.valor+"</p>"}),i+="  </div>",i+=' <div class="modal-footer">',i+=' <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>',i+="  </div>",i+="</div>",i+="</div>",i+="</div>"}),i+="</tbody>",i+="</table>",i+="</tbody>",document.getElementById("dibujar-tabla").innerHTML=i,$("#tablaDocsUltimo").DataTable()}async function guardarFormulario(e){let a=document.getElementById("formularioSelected"+e).value;var t="";if(""==a)document.getElementById("alertas"+e).classList.remove("apagar"),document.getElementById("btnSaveForm"+e).classList.add("apagar"),document.getElementById("formularioSelected"+e).classList.add("errorInput"),t+='<div class="d-flex justify-content-center align-items-center bg-danger mt-1 py-2 mx-3 text-white" style="font-size:14px;border:1px solid red;border-radius:5px">Debe seleccionar un Formulario</div>',document.getElementById("alertas"+e).innerHTML=t,setTimeout(()=>{document.getElementById("btnSaveForm"+e).classList.remove("apagar"),document.getElementById("formularioSelected"+e).classList.remove("errorInput"),document.getElementById("alertas"+e).classList.add("apagar")},2e3);else{botonesGuardar("btnSaveForm"+e,"px-0","py-0"),$("#exampleModalAddFormulario"+e).modal("hide");const a=new FormData,i=document.getElementById("formularioSelected"+e).value;a.append("idFormulario",i),a.append("idSeccion",e),console.log([...a]);let s=URL_BASE+"/seccion/formulario/agregar";const o=await fetch(s,{method:"POST",headers:{token:token},body:a}),l=await o.json();l.exito?Swal.fire({position:"top-end",icon:"success",title:l.exito,showConfirmButton:!1,timer:1500}).then(()=>{dibujarSecciones(),$("#tablaSecciones").DataTable()}):l.error?Swal.fire({icon:"error",title:"ERROR",text:l.error}).then(()=>{dibujarSecciones(),$("#tablaSecciones").DataTable()}):l.exit?Swal.fire({icon:"warning",title:l.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):(t+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',l.alertas.error.forEach(e=>{t+='<li class="text-danger"  >',t+=e,t+="</li>"}),t+="</ul>",document.getElementById("alertas").innerHTML=t),alertas()}}function botonesGuardar(e,a="px-2",t="py-3"){document.getElementById(e).innerHTML="";let i="";i+='<buttom type="buttom" class="btn d-flex '+a+" "+t+' cursito justify-content-center align-items-center" style="background-color:#198754" disabled>',i+='<span class="spinner-border spinner-border-sm" style="width: 1.8rem; height: 1.8rem;color:white" role="status" aria-hidden="true"></span>',i+='<span style="margin-left:15px;font-size:14px;color:white">Cargando...</span>',i+="</button>",document.getElementById(e).innerHTML=i}async function createSeccion(e=0){var a="";const t=document.getElementById("seccion").value,i=document.getElementById("descripcion").value,s=document.getElementById("color").value;hexToRgb(s);const o=new FormData;o.append("idPadre",e),o.append("seccion",t),o.append("descripcion",i),o.append("color",s),console.log([...o]);const l=await fetch("http://localhost/gdagmcp/seccion/create",{method:"POST",headers:{token:token},body:o}),n=await l.json();n.exito?Swal.fire({position:"top-end",icon:"success",title:n.exito,showConfirmButton:!1,timer:1500}).then(()=>{$("#exampleModal"+e).modal("hide"),dibujarPadreAndCarpetas(e)}):n.error?Swal.fire({icon:"error",title:"ERROR",text:n.error}).then(()=>{$("#exampleModal"+e).modal("hide"),dibujarPadreAndCarpetas(e)}):n.exit?Swal.fire({icon:"warning",title:n.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):(a+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',n.alertas.error.forEach(e=>{a+='<li class="text-danger"  >',a+=e,a+="</li>"}),a+="</ul>",document.getElementById("alertas").innerHTML=a),alertas()}async function updateSeccion(e,a,t){var i="";const s=document.getElementById("seccion"+a).value,o=document.getElementById("descripcion"+a).value,l=document.getElementById("color"+a).value,n=document.getElementById("select"+a).value,r=new FormData;r.append("hijo",a),r.append("padre",e),r.append("seccion",s),r.append("descripcion",o),r.append("color",l),e!=n&&r.append("idPadre",n),1==t?r.append("tipo","updatePadre"):r.append("tipo","updateHijo"),console.log([...r]);const d=await fetch("http://localhost/gdagmcp/seccion/update",{method:"POST",headers:{token:token},body:r}),c=await d.json();c.exito?Swal.fire({position:"top-end",icon:"success",title:c.exito,showConfirmButton:!1,timer:1500}).then(()=>{$("#exampleModal"+a).modal("hide"),$("#exampleModalEditar"+a).modal("hide"),dibujarPadreAndCarpetas(e)}):c.error?Swal.fire({icon:"error",title:"ERROR",text:c.error}).then(()=>{$("#exampleModal"+a).modal("hide"),$("#exampleModalEditar"+a).modal("hide"),dibujarPadreAndCarpetas(e)}):c.exit?Swal.fire({icon:"warning",title:c.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):(console.log("alertas",c),i+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',c.alertas.error.forEach(e=>{i+='<li class="text-danger"  >',i+=e,i+="</li>"}),i+="</ul>",document.getElementById("alertas"+a).innerHTML=i),alertas()}async function deleteSeccion(e){const a=(await traerSecciones()).find(a=>a.id==e);Swal.fire({title:"ELIMINAR",text:`Estas seguro de Eliminar de forma permamente a ${a.seccion}?`,icon:"error",showCancelButton:!0,confirmButtonText:"Eliminar",confirmButtonColor:"#dc3545"}).then(t=>{t.isConfirmed&&$.ajax({data:{id:e},url:URL_BASE+"/seccion/delete",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{console.log("response Eliminar",e),e.exito?Swal.fire({position:"top-end",icon:"success",title:e.exito,showConfirmButton:!1,timer:1500}).then(()=>{dibujarPadreAndCarpetas(a.idPadre)}):e.error?Swal.fire({icon:"error",title:"ERROR",html:"<strong>"+e.carpeta+"</strong> "+e.error}).then(()=>{dibujarPadreAndCarpetas(a.idPadre)}):e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"})}).fail(e=>{console.log(e)})})}document.addEventListener("DOMContentLoaded",iniciarApp()),escucharCarpeta=(e,a)=>{$.ajax({data:{tipo:"buscarCarpetas",value:e,id:a},url:URL_BASE+"/seccion/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),console.log(e),dibujarHijosPadre(a,e)}).fail(e=>{console.log(e)})};