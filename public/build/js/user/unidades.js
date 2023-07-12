const URL_BASE="http://localhost/gdagmcp",token=JSON.parse(localStorage.getItem("token"));let unidades,secciones,roles,permisosDefault=[{id:"1",nombre:"Leer",status:"false"},{id:"2",nombre:"Escribir",status:"false"}];async function iniciarApp(){unidades=await traerUnidades(),dibujarUnidades(unidades)}function alertas(){const e=document.querySelectorAll(".alert"),a=document.getElementById("alertas"),t=document.querySelector("#alertaTipo");e&&setTimeout(()=>{e.forEach((function(e){e.remove(),a&&(a.innerHTML=""),t&&(t.innerHTML="")}))},3e3)}function traerUnidades(){return new Promise((e,a)=>{let t=[];$.ajax({data:{tipo:"unidadSeccion"},url:URL_BASE+"/unidad/datos",type:"POST",headers:{token:token},dataType:"json"}).done(a=>{a.exit&&Swal.fire({icon:"warning",title:a.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==a.length&&e(t),$.each(a,(i,n)=>{t.push(n),a.length==i+1&&e(t)})}).fail(e=>{a(e)})})}function traerUsers(e){return new Promise((a,t)=>{let i=[];$.ajax({data:{tipo:"usersUnidad",id:e},url:URL_BASE+"/unidad/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==e.length&&a(i),$.each(e,(t,n)=>{i.push(n),e.length==t+1&&a(i)})}).fail(e=>{t(e)})})}async function dibujarUnidadesUpdate(){dibujarUnidades(await traerUnidades())}function dibujarUnidades(e){var a="";a+="<section>",a+='<div class="mb-3">',a+='<div class="d-flex justify-content-end">',a+='<a class=" btn btn-primary " onclick="agregarUnidad()"><i class="fa-solid fa-plus fa-2x"></i> <span class="span-boton">Unidad</span></a>',a+="</div>",a+="</div>",a+="</section>",a+='<table class="table" style="min-width:900px" id="tablaUnidades">',a+='<thead class="table-dark">',a+='<tr class="" style="text-transform:uppercase">',a+="<th>N°</th>",a+='<th class="">Unidad</th>',a+='<th class="">Jefe</th>',a+='<th class="col-2">Carpetas</th>',a+='<th class="col-2">Permisos</th>',a+='<th class="col-2">Acciones</th>',a+="</tr>",a+="</thead>",a+='<tbody class="contenido" id="contenido">',e.forEach((e,t)=>{var i=[];a+='<tr class="">',a+="<td>"+(parseInt(t)+1)+"</td>",a+="<td>"+e.unidad+"</td>",a+="<td>"+e.jefe+"</td>";const n=JSON.parse(e.seccion);a+="<td>",0==n.length?a+='<p class="text-danger" style="font-size:13px;margin-right:10px">Sin Carpetas</p>':(a+='<ul class="ultimoNo" style="height:44px;margin-bottom:0px;">',n.forEach((e,t)=>{a+='<li  style="font-size:14px;margin-bottom:10px">'+e.seccion+"</li>";JSON.parse(e.permisos)}),a+="</ul>"),a+="</td>",a+="<td>";var s=0;0==i.length?a+='<p class="text-danger" style="font-size:13px">Sin Permisos</p>':(i.forEach(t=>{a+='<div class="dropend" style="margin-bottom:5px">',a+='<button class="btn btn-secondary dropdown-toggle" id="dropdownMenu'+e.id+s+'" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Ver Permisos</button>',a+='<div class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenu'+e.id+s+'">',t.forEach(e=>{1==e.status?(a+='<p  class="dropdown-item"><i class="fa-solid fa-check text-success" style="margin-right:8px"></i>'+e.nombre+"</p>",a+='<div class="ultimoNo "></div>'):(a+='<p  class="dropdown-item"><i class="fa-solid fa-xmark text-danger" style="margin-right:8px"></i>'+e.nombre+"</p>",a+='<div class="ultimoNo "></div>')}),a+=" </div>",a+="</div>",s++}),a+="</td>"),a+="<td>",a+='<div class="acciones-user">',a+='<a class="btn btn-warning botonAccionesUnidad" id="'+e.id+'"  onclick="agregarUnidad(2,'+e.id+')"><i class="fa-solid fa-pen-to-square marginIcon"></i>Editar</a>',a+='<a class="btn btn-danger botonAccionesUnidad" onclick="eliminarUnidad('+e.id+')"><i class="fa-solid fa-trash marginIcon"></i>Eliminar</a>',a+="</div>",a+="</td>",a+="</tr>"}),a+="</tbody>",a+="</table>",document.getElementById("dibujar-js").innerHTML=a,$("#tablaUnidades").DataTable({language:{url:URL_BASE+"/public/build/js/varios/DataTable_es_es.json"}})}async function agregarUnidad(e=1,a){var t;2==e&&(t=await traerUsers(a),console.log("usuaiors",t));var i="",n=await traerUnidades();if("2"==e)var s=n.find(e=>e.id==a),r=s.unidad,d=s.jefe;r||d||(r="",d=""),i+='<div class="contenedor-crearUsuario bg-light ">',i+="2"==e?'<h3 class="text-black mt-2 mb-4">Edite los datos de '+r+"</h3>":'<h3 class="text-black mt-2 mb-4">Ingrese los datos de la nueva Unidad</h3>',i+="<form>",i+='<div class="mb-3">',i+='<label for="exampleFormControlInput1" class="form-label"><strong>Nombre:</strong></label>',i+='<input type="text" class="form-control" id="unidad" name="unidad" value="'+r+'" placeholder="Ingrese nombre de la unidad" aria-label="Username" aria-describedby="basic-addon1">',i+="</div>",i+='<div class="mb-3">',i+='<label for="exampleFormControlInput1" class="form-label"><strong>Jefe:</strong></label>',i+='<input type="text" class="form-control" id="jefe" name="jefe" value="'+d+'" placeholder="Ingrese nombre de Jefe" aria-label="Username" aria-describedby="basic-addon1">',i+="</div>",2==e&&(i+='<label for="exampleFormControlInput1" class="form-label"><strong>Usuarios:</strong></label>',i+='<div class="bg-white py-3 px-2" style="border-radius:8px;border:1px solid #e0e4e7">',i+='<ul style="list-style-type:none;">',t.forEach(e=>{i+='<li><i class="fa-solid fa-user" style="margin-right:5px"></i>'+e.nombre+"</li>"}),i+="</ul>",i+="</div>"),i+='<div class="w-100 mt-2" id="alertas">',i+="</div>",i+='<div class="my-5 d-flex justify-content-center align-items-center">',i+='<a class="btn btn-success px-5 py-2" id="botonCrear" style="font-size:15px" onclick="guardarUnidad('+e+","+a+')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>',i+="</div>",i+='<div class=" d-flex justify-content-start align-items-center">',i+='<a class="btn btn-outline-danger px-3 py-1" id="botonCrear" style="font-size:15px" onclick="dibujarUnidadesUpdate()"><i class="fa-solid fa-arrow-left"></i> <span style="margin-left:8px">Atrás</span></a>',i+="</div>",i+="</form>",i+="</div>",document.getElementById("dibujar-js").innerHTML=i}async function guardarUnidad(e,a){let t=document.getElementById("unidad").value,i=document.getElementById("jefe").value,n=[];secciones.forEach(e=>{let a=document.getElementById(e.id);1==a.checked&&n.push({id:a.id,seccion:a.name})});let s=[];var r=[];if(n.forEach(e=>{let a=document.getElementById("contenedor"+e.id),t=[];var i=0;for(let n=0;n<a.children.length;n++)if(1==a.children[n].checked)null!=a.children[n].value&&t.push({id:a.children[n].value,nombre:a.children[n].name,status:"true"});else if(null!=a.children[n].value){if(2==++i){let a="No se a seleccionado permisos para la sección de "+e.seccion;r.push(a)}t.push({id:a.children[n].value,nombre:a.children[n].name,status:"false"})}s.push({idSeccion:e,idPermisos:t})}),0!=r.length){let e="";return e+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',r.forEach(a=>{e+='<li class="text-danger"  >',e+=a,e+="</li>"}),e+="</ul>",document.getElementById("alertas").innerHTML=e,void alertas()}{const n=new FormData;let o;"2"==e&&n.append("id",a),n.append("unidad",t),n.append("jefe",i),console.log("errir",r),n.append("permisos",JSON.stringify(s)),console.log([...n]),o="2"==e?URL_BASE+"/unidad/actualizar":URL_BASE+"/unidad/create";const l=await fetch(o,{method:"POST",headers:{token:token},body:n}),c=await l.json();var d="";console.log(c),c.exito?Swal.fire({position:"top-end",icon:"success",title:c.exito,showConfirmButton:!1,timer:1500}).then(()=>{dibujarUnidadesUpdate()}):c.error?Swal.fire({icon:"error",title:"ERROR",text:c.error}).then(()=>{agregarUnidad()}):c.exit?Swal.fire({icon:"warning",title:c.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):(d+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',c.alertas.error.forEach(e=>{d+='<li class="text-danger"  >',d+=e,d+="</li>"}),d+="</ul>",document.getElementById("alertas").innerHTML=d),alertas()}}async function eliminarUnidad(e){const a=unidades.find(a=>a.id==e);console.log(a),Swal.fire({title:"ELIMINAR",text:`Eliminar de forma permamente a ${a.unidad}?`,icon:"warning",showCancelButton:!0,confirmButtonText:"Eliminar",confirmButtonColor:"#dc3545"}).then(a=>{a.isConfirmed&&$.ajax({data:{id:e},url:URL_BASE+"/unidad/delete",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exito?Swal.fire({position:"top-end",icon:"success",title:e.exito,showConfirmButton:!1,timer:1500}).then(()=>{dibujarUnidadesUpdate()}):e.error?Swal.fire({icon:"error",title:"ERROR",text:e.error}).then(()=>{dibujarUnidadesUpdate()}):e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"})}).fail(e=>{console.log(e)})})}document.addEventListener("DOMContentLoaded",iniciarApp()),document.addEventListener("click",(function(e){if(e.target.classList.contains("secciones")){let a=e.target;console.log("contenedor"+a.id);let t=document.getElementById("contenedor"+a.id);if(1==a.checked)t.classList.toggle("visiblePermiso");else{t.classList.toggle("visiblePermiso");for(let e=0;e<t.children.length;e++)t.children[e].checked=!1}}}));