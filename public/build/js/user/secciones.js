const URL_BASE="http://localhost/gdagmcp",token=JSON.parse(localStorage.getItem("token"));let unidades,secciones,roles,permisosDefault=[{id:"1",nombre:"Leer",status:"false"},{id:"2",nombre:"Escribir",status:"false"}];async function iniciarApp(){secciones=await traerSecciones(),console.log("secciones",secciones),dibujarSecciones(),$("#tablaSecciones").DataTable()}function alertas(){const e=document.querySelectorAll(".alert"),t=document.getElementById("alertas"),a=document.querySelector("#alertaTipo");e&&setTimeout(()=>{e.forEach((function(e){e.remove(),t&&(t.innerHTML=""),a&&(a.innerHTML="")}))},3e3)}function traerSecciones(){return new Promise((e,t)=>{let a=[];$.ajax({data:{tipo:"seccion"},url:URL_BASE+"/seccion/datos",type:"POST",headers:{token:token},dataType:"json"}).done(t=>{t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==t.length&&e(a),$.each(t,(o,i)=>{a.push(i),t.length==o+1&&e(a)})}).fail(e=>{t(e)})})}function traerFormularios(){return new Promise((e,t)=>{let a=[];$.ajax({data:{tipo:"formularios"},url:URL_BASE+"/seccion/datos",type:"POST",headers:{token:token},dataType:"json"}).done(t=>{t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),console.log("asdfhhhj",t.length),0==t.length&&e(a),$.each(t,(o,i)=>{a.push(i),t.length==o+1&&e(a)})}).fail(e=>{t(e)})})}async function dibujarSecciones(){var e="";let t=await traerSecciones();console.log("seccionesactualizadas",t);let a=await traerFormularios();e+='<h1 class="text-black mb-3"><strong>Administrar Secciones</strong></h1>',e+="<section>",e+='<div class="mb-3">',e+='<div class="d-flex justify-content-end">',e+='<a class=" btn btn-primary " onclick="agregarSeccion(1)"><i class="fa-solid fa-plus fa-2x"></i> <span class="span-boton">Agregar Sección</span></a>',e+="</div>",e+="</div>",e+="</section>",e+='<table class="table" style="min-width:900px" id="tablaSecciones">',e+='<thead class="table-dark">',e+='<tr class="" style="text-transform:uppercase">',e+="<th>N°</th>",e+='<th class="">Sección</th>',e+='<th class="">Formulario</th>',e+='<th class="col-2">Acciones</th>',e+="</tr>",e+="</thead>",e+='<tbody class="contenido" id="contenido">',t.forEach((t,o)=>{e+='<tr class="">',e+="<td>"+(parseInt(o)+1)+"</td>",e+="<td>"+t.seccion+"</td>",null!=t.idFormulario&&1!=t.idFormulario?e+="<td>"+t.nombreFormulario+"</td>":(e+="<td>",e+='<buttom class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalAddFormulario'+t.id+'"><i class="fa-solid fa-plus" style="margin-right:5px"></i> Formulario</buttom>',e+="</td>"),e+="<td>",e+='<div class="acciones-user">',e+='<a class="btn btn-warning botonAccionesSeccion" style="margin-right:5px" id="'+t.id+'"  onclick="agregarSeccion(2,'+t.id+')"><i class="fa-solid fa-pen-to-square marginIcon"></i>Editar</a>',e+='<a class="btn btn-danger botonAccionesSeccion" onclick="eliminarSeccion('+t.id+')"><i class="fa-solid fa-trash marginIcon"></i>Eliminar</a>',e+="</div>",e+="</td>",e+="</tr>",e+='<div class="modal fade" id="exampleModalAddFormulario'+t.id+'" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">',e+='<div class="modal-dialog modal-dialog-centered">',e+=' <div class="modal-content">',e+=' <div class="modal-header">',e+=' <h5 class="modal-title" id="exampleModalLabel">Agregar Formulario para '+t.seccion+"</h5>",e+=' <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>',e+=" </div>",e+=' <div class="modal-body">',e+=' <select class="form-select w-100" id="formularioSelected'+t.id+'">',e+=' <option value="" selected disabled> -- Seleccione un formulario -- </option>',a.forEach((t,a)=>{e+=' <option value="'+t.id+'">'+t.nombre+"</option>"}),e+=" </select>",e+=" </div>",e+=' <div class="w-100" id="alertas'+t.id+'">',e+=" </div>",e+=' <div class="modal-footer">',e+='<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>',e+=' <button type="button" onclick="guardarFormulario('+t.id+')" class="btn btn-success" id="btnSaveForm'+t.id+'">Guardar Formulario</button>',e+=" </div>",e+=" </div>",e+="</div>",e+="</div>"}),e+="</tbody>",e+="</table>",document.getElementById("dibujar-js").innerHTML=e,$("#tablaSecciones").DataTable()}async function guardarFormulario(e){let t=document.getElementById("formularioSelected"+e).value;var a="";if(""==t)document.getElementById("alertas"+e).classList.remove("apagar"),document.getElementById("btnSaveForm"+e).classList.add("apagar"),document.getElementById("formularioSelected"+e).classList.add("errorInput"),a+='<div class="d-flex justify-content-center align-items-center bg-danger mt-1 py-2 mx-3 text-white" style="font-size:14px;border:1px solid red;border-radius:5px">Debe seleccionar un Formulario</div>',document.getElementById("alertas"+e).innerHTML=a,setTimeout(()=>{document.getElementById("btnSaveForm"+e).classList.remove("apagar"),document.getElementById("formularioSelected"+e).classList.remove("errorInput"),document.getElementById("alertas"+e).classList.add("apagar")},2e3);else{botonesGuardar("btnSaveForm"+e,"px-0","py-0"),$("#exampleModalAddFormulario"+e).modal("hide");const t=new FormData,o=document.getElementById("formularioSelected"+e).value;t.append("idFormulario",o),t.append("idSeccion",e),console.log([...t]);let i=URL_BASE+"/seccion/formulario/agregar";const n=await fetch(i,{method:"POST",headers:{token:token},body:t}),r=await n.json();console.log(r),r.exito?Swal.fire({position:"top-end",icon:"success",title:r.exito,showConfirmButton:!1,timer:1500}).then(()=>{dibujarSecciones(),$("#tablaSecciones").DataTable()}):r.error?Swal.fire({icon:"error",title:"ERROR",text:r.error}).then(()=>{dibujarSecciones(),$("#tablaSecciones").DataTable()}):r.exit?Swal.fire({icon:"warning",title:r.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):(a+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',r.alertas.error.forEach(e=>{a+='<li class="text-danger"  >',a+=e,a+="</li>"}),a+="</ul>",document.getElementById("alertas").innerHTML=a),alertas()}}function botonesGuardar(e,t="px-2",a="py-3"){document.getElementById(e).innerHTML="";let o="";o+='<buttom type="buttom" class="btn d-flex '+t+" "+a+' cursito justify-content-center align-items-center" style="background-color:#198754" disabled>',o+='<span class="spinner-border spinner-border-sm" style="width: 1.8rem; height: 1.8rem;color:white" role="status" aria-hidden="true"></span>',o+='<span style="margin-left:15px;font-size:14px;color:white">Cargando...</span>',o+="</button>",document.getElementById(e).innerHTML=o}async function agregarSeccion(e=1,t){var a="";let o,i,n,r=await traerSecciones(),s=await traerFormularios();"2"==e&&(o=r.find(e=>e.id==t),n=o.seccion,i=o.nombreFormulario),o&&i||(n="",i=""),a+='<h1 class="text-black mb-3"><strong>Administrar Sección</strong></h1>',a+='<div class="contenedor-crearUsuario bg-light ">',a+="2"==e?'<h3 class="text-black mt-2 mb-4">Edite los datos de '+n+"</h3>":'<h3 class="text-black mt-2 mb-4">Ingrese los datos de la nueva Sección</h3>',a+="<form>",a+='<div class="mb-3">',a+='<label for="exampleFormControlInput1" class="form-label"><strong>Seccion:</strong></label>',a+='<input type="text" class="form-control" id="seccion" name="seccion" value="'+n+'" placeholder="Ingrese nombre de la Sección" aria-label="Username" aria-describedby="basic-addon1">',a+="</div>",a+='<div class="mb-3">',a+='<label for="exampleFormControlInput1" class="form-label"><strong>Seleccione un formulario:</strong></label>',a+='<select class="form-select" style="height:30px" id="formulario" name="formulario" >',a+='<option value="" id="" name="" selected disabled> -- Seleccione una opción -- </option>',console.log("asdfasdf",s),s.forEach(e=>{e.nombre==i?a+='<option value="'+e.id+'" selected >'+e.nombre+"</option>":a+='<option value="'+e.id+'" >'+e.nombre+"</option>"}),a+="</select>",a+="</div>",a+='<div id="passwordHelp" class="form-text">*El Formulario no es un campo obligatorio para crear la sección.</div>',a+='<div class="dibujar-formulario">',a+="</div>",a+='<div class="w-100 mt-2" id="alertas">',a+="</div>",a+='<div class="my-5 d-flex justify-content-center align-items-center">',a+='<a class="btn btn-success px-5 py-2" id="botonCrear" style="font-size:15px" onclick="saveSeccion('+e+","+t+')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>',a+="</div>",a+='<div class=" d-flex justify-content-start align-items-center">',a+='<a class="btn btn-outline-danger px-3 py-1" id="botonCrear" style="font-size:15px" onclick="dibujarSecciones()"><i class="fa-solid fa-arrow-left"></i> <span style="margin-left:8px">Atrás</span></a>',a+="</div>",a+="</form>",a+="</div>",document.getElementById("dibujar-js").innerHTML=a}async function saveSeccion(e=1,t){console.log("tipo",e),console.log("id",t);var a="";const o=document.getElementById("seccion").value,i=document.getElementById("formulario").value;console.log("seccion",o),console.log("idFormulario",i);const n=new FormData;let r;"2"==e&&n.append("id",t),n.append("seccion",o),""!=i?n.append("idFormulario",i):n.append("idFormulario","1"),console.log([...n]),r="1"==e?URL_BASE+"/seccion/create":URL_BASE+"/seccion/update";const s=await fetch(r,{method:"POST",headers:{token:token},body:n}),l=await s.json();l.exito?Swal.fire({position:"top-end",icon:"success",title:l.exito,showConfirmButton:!1,timer:1500}).then(()=>{dibujarSecciones(),$("#tablaSecciones").DataTable()}):l.error?Swal.fire({icon:"error",title:"ERROR",text:l.error}).then(()=>{dibujarSecciones(),$("#tablaSecciones").DataTable()}):l.exit?Swal.fire({icon:"warning",title:l.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):(a+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',l.alertas.error.forEach(e=>{a+='<li class="text-danger"  >',a+=e,a+="</li>"}),a+="</ul>",document.getElementById("alertas").innerHTML=a),alertas()}async function eliminarSeccion(e){const t=(await traerSecciones()).find(t=>t.id==e);console.log(t),Swal.fire({title:"ELIMINAR",text:`La Sección ${t.seccion} se eliminará de forma permanente`,icon:"warning",showCancelButton:!0,confirmButtonText:"Eliminar",confirmButtonColor:"#dc3545"}).then(t=>{t.isConfirmed&&$.ajax({data:{id:e},url:URL_BASE+"/seccion/delete",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exito?Swal.fire({position:"top-end",icon:"success",title:e.exito,showConfirmButton:!1,timer:1500}).then(()=>{dibujarSecciones(),$("#tablaSecciones").DataTable()}):e.error?Swal.fire({icon:"error",title:"ERROR",text:e.error}).then(()=>{dibujarSecciones(),$("#tablaSecciones").DataTable()}):e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"})}).fail(e=>{console.log(e)})})}document.addEventListener("DOMContentLoaded",iniciarApp());