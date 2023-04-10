const URL_BASE="http://localhost/gdagmcp";let usuarios,unidades,secciones,usuariosSeccion,roles;const user={nombre:"",apellido:"",cedula:"",celular:"",email:"",password:"",idUnidad:"",idRol:""};let permisosDefault=[{id:"1",nombre:"Leer",status:"false"},{id:"2",nombre:"Escribir",status:"false"}];const token=JSON.parse(localStorage.getItem("token"));async function iniciarApp(){usuarios=await ver(),usuariosSeccion=await buscarSeccion(),secciones=await traerSeccion(),unidades=await traerUnidades(),roles=await traerRoles(),dibujarUsuarios(usuarios,"dibujar-js",1),crearModales()}function alertas(){const e=document.querySelectorAll(".alert"),t=document.getElementById("alertas"),a=document.querySelector("#alertaTipo");e&&setTimeout(()=>{e.forEach((function(e){e.remove(),t&&(t.innerHTML=""),a&&(a.innerHTML="")}))},3e3)}async function traerUser(e){let t=JSON.parse(localStorage.getItem("buscarUser")),a=await ver(),o=[];if(t&&t.length>=0&&(t.forEach(e=>{let t=a.find(t=>t.id===e.id);null!=t&&o.push(t)}),localStorage.setItem("buscarUser",JSON.stringify(o))),"1"==e)dibujarUsuarios(a,"dibujar-js",1);else if("2"==e){console.log("debe entrar aqui por el tipo 2");const e=JSON.parse(localStorage.getItem("buscarUser"));console.log("user del local antes de dibujar, debo estar solo yo",e),dibujarUsuarios(e,"tablaBuscar",2)}}function ver(){return new Promise((e,t)=>{let a=[];$.ajax({data:{tipo:"usuarios"},url:URL_BASE+"/user/datos",type:"POST",headers:{token:token},dataType:"json"}).done(t=>{t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==t.length&&e(a),$.each(t,(o,i)=>{a.push(i),t.length==o+1&&e(a)})}).fail(e=>{t(e)})})}function verUsuarios(){dibujarUsuarios(usuarios,"dibujar-js",1)}function traerUnidades(){return new Promise((e,t)=>{let a=[];$.ajax({data:{tipo:"unidades"},url:URL_BASE+"/user/datos",type:"POST",headers:{token:token},dataType:"json"}).done(t=>{t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==t.length&&e(a),$.each(t,(o,i)=>{a.push(i),t.length==o+1&&e(a)})}).fail(e=>{t(e)})})}function traerSeccion(){return new Promise((e,t)=>{let a=[];$.ajax({data:{tipo:"seccion"},url:URL_BASE+"/user/datos",type:"POST",headers:{token:token},dataType:"json"}).done(t=>{t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==t.length&&e(a),$.each(t,(o,i)=>{a.push(i),t.length==o+1&&e(a)})}).fail(e=>{t(e)})})}function traerRoles(){return new Promise((e,t)=>{let a=[];$.ajax({data:{tipo:"roles"},url:URL_BASE+"/user/datos",type:"POST",headers:{token:token},dataType:"json"}).done(t=>{t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==t.length&&e(a),$.each(t,(o,i)=>{a.push(i),t.length==o+1&&e(a)})}).fail(e=>{t(e)})})}function dibujarUsuarios(e,t,a=1){console.log("usuarios del dibujar",e);var o="";o+='<table class="table" style="min-width:900px" id="tablaUsuarios">',o+='<thead class="table-dark">',o+='<tr class="" style="text-transform:uppercase">',o+="<th>N°</th>",o+="<th>Nombre</th>",o+="<th>Email</th>",o+="<th>rol</th>",o+="<th>Unidad</th>",o+="<th>Estado</th>",o+="<th>Acciones</th>",o+="</tr>",o+="</thead>",o+='<tbody class="contenido" id="contenido">',e.forEach((e,t)=>{let i="activo"==e.estado?"btn-outline-success":"btn-outline-danger";o+='<tr class="">',o+="<td>"+(parseInt(t)+1)+"</p></td>",o+='<td class="col-2">'+e.nombre+"</p></td>",o+='<td class="col-3">'+e.email+"</p></td>",o+='<td class="col-1">'+e.rol+"</p></td>",o+='<td class="col-2">'+e.unidad+"</p></td>",o+='<td class="col-1"><a class=" btn btn-rounded '+i+'" onclick="estado('+e.id+","+a+')"  >'+e.estado+"</a></p></td>",o+='<td class="col-2">',o+='<div class="acciones-user">',o+='<a class="btn btn-primary  botonPermiso" id="'+a+'" data-bs-toggle="modal" data-bs-target="#exampleModalPermisos'+e.id+'">Permisos</a>',o+='<a class="btn btn-warning " id="'+a+'" onclick="crearUsuario(2,'+e.id+')" style="margin:0px 5px 0px 5px"><i class="fa-regular fa-pen-to-square fa-2x"></i></a>',o+='<a class="btn btn-danger " onclick="eliminarUsuario('+e.id+')"><i class="fa-solid fa-trash fa-2x"></i></a>',o+="</div>",o+="</td>",o+="</tr>"}),o+="</tbody>",o+="</table>",document.getElementById(t.toString()).innerHTML=o,$("#tablaUsuarios").DataTable()}async function crearModales(e=1){let t=await buscarSeccion();var a="";t.forEach(t=>{let o=JSON.parse(t.seccion);console.log("permiso de cada user",o),a+='<div class="modal fade" id="exampleModalPermisos'+t.id+'" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">',a+='<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">',a+=' <div class="modal-content">',a+=' <div class="modal-header">',a+=' <h5 class="modal-title" id="exampleModalLabel">EDITAR PERMISOS DE <strong>'+t.nombre.toUpperCase()+"</strong></h5>",a+='  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>',a+=" </div>",a+=' <div class="modal-body">',secciones.forEach(e=>{let i=o.find(t=>t.id==e.id);if(a+='<div class="d-flex justify-content-between" style="font-size:17px" >',null!=i){let o=JSON.parse(i.permisos);a+="<div>",a+='<input class="secciones" type="checkbox" checked id="'+e.id+t.id+'" name="'+e.seccion+'" value="'+e.id+'">',a+=' <label for="'+e.seccion+'">'+e.seccion+"</label>",a+="</div>",a+='<div class="d-flex col-6 justify-content-center" id="contenedor'+e.id+t.id+'" style="font-size:13px">',o.forEach(e=>{"true"==e.status?(a+='<input style="margin-right:5px" type="checkbox" checked id="permiso'+e.id+'" name="'+e.nombre+'" value="'+e.id+'">',a+=' <label style="margin-right:10px ">'+e.nombre+"</label>"):(a+='<input style="margin-right:5px" type="checkbox" id="permiso'+e.id+'" name="'+e.nombre+'" value="'+e.id+'">',a+=' <label style="margin-right:10px ">'+e.nombre+"</label>")}),a+="</div>"}else a+="<div>",a+='<input class="secciones" type="checkbox" id="'+e.id+t.id+'" name="'+e.seccion+'" value="'+e.id+'">',a+=' <label for="'+e.seccion+'">'+e.seccion+"</label>",a+="</div>",a+='<div class="d-flex col-6 justify-content-center visiblePermiso" id="contenedor'+e.id+t.id+'" style="font-size:13px">',permisosDefault.forEach(e=>{a+='<input style="margin-right:5px" type="checkbox"  id="permiso'+e.id+'" name="'+e.nombre+'" value="'+e.id+'">',a+=' <label style="margin-right:10px" >'+e.nombre+"</label>"}),a+="</div>";a+="</div>"}),a+=" </div>",a+='<div class="mx-3" id="alertaError'+t.id+'">',a+="</div>",a+='<div class="modal-footer ">',a+='<div class="d-flex justify-content-between w-100">',t.permisosWhere?a+='<div class="form-text" id="seccionHelp">* Este usuario tiene los permisos de <strong>'+t.permisosWhere+"</strong></div>":a+='<div class="form-text" id="seccionHelp"><strong>* Permisos personalizados</strong></div>',a+="<div>",a+=' <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>',a+=' <button type="button" class="btn btn-success" onclick="guardarPermisos('+t.id+","+e+')">Guardar cambios</button>',a+="</div>",a+="</div>",a+="</div>",a+="</div>",a+=" </div>",a+="</div>",a+=" </div>",a+="</div>",document.getElementById("modales").innerHTML=a})}async function guardarPermisos(e,t=1){let a=document.querySelector(".botonPermiso").id,o=[];secciones.forEach(t=>{let a=document.getElementById(t.id+e);1==a.checked&&o.push({id:a.id,value:a.value,seccion:a.name})}),console.log("deben estar las secciones del usuario",o);let i=[];var n=[];if(o.forEach(e=>{let t=document.getElementById("contenedor"+e.id),a=[];var o=0;for(let i=0;i<t.children.length;i++)if(1==t.children[i].checked)null!=t.children[i].value&&a.push({id:t.children[i].value,nombre:t.children[i].name,status:"true"});else if(null!=t.children[i].value){if(2==++o){let t="No se a seleccionado permisos para la sección de "+e.seccion;n.push(t)}a.push({id:t.children[i].value,nombre:t.children[i].name,status:"false"})}i.push({idSeccion:e,idPermisos:a})}),console.log(n),0!=n.length){let t="";return t+='<ul class="alert bg-white px-5" style="border-radius:5px;border:1px solid red"  style="width:100%" >',n.forEach(e=>{t+='<li class="text-danger"  >',t+=e,t+="</li>"}),t+="</ul>",console.log(document.getElementById("alertaError")),document.getElementById("alertaError"+e).innerHTML=t,void alertas()}{$("#exampleModalPermisos"+e).modal("hide"),console.log("a ver",i);const t=new FormData;t.append("id",e),t.append("permisos",JSON.stringify(i)),console.log([...t]);let o=URL_BASE+"/user/permisos/save";const n=await fetch(o,{method:"POST",headers:{token:token},body:t}),r=await n.json();var l="";console.log(r),r.exito?Swal.fire({position:"top-end",icon:"success",title:r.exito,showConfirmButton:!1,timer:1500}).then(()=>{traerUser(a),document.getElementById("modales").innerHTML="",crearModales()}):r.error?Swal.fire({icon:"error",title:"ERROR",text:r.error}).then(()=>{traerUser(a),document.getElementById("modales").innerHTML="",crearModales()}):r.exit?Swal.fire({icon:"warning",title:r.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):(l+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',r.alertas.error.forEach(e=>{l+='<li class="text-danger"  >',l+=e,l+="</li>"}),l+="</ul>",document.getElementById("alertas").innerHTML=l),alertas()}}document.addEventListener("DOMContentLoaded",iniciarApp()),document.addEventListener("click",(function(e){if(e.target.classList.contains("secciones")){let t=e.target,a=document.getElementById("contenedor"+t.id);if(console.log(a),1==t.checked)a.classList.toggle("visiblePermiso"),[].push(t.value);else{a.classList.toggle("visiblePermiso");for(let e=0;e<a.children.length;e++)a.children[e].checked=!1}}}));let datos={nombre:"",apellido:"",cedula:"",celular:"",email:"",unidad:"",rol:""};function crearUsuario(e=1,t){if(console.log("tipoooooo",e),2==e){var a=usuariosSeccion.find(e=>e.id==t);console.log(a);var o=a.nombre.split(" ")[0],i=a.nombre.split(" ")[1],n=a.cedula,l=a.email,r=a.celular,s=a.idUnidad;console.log(s);var d=a.idRol}o||i||n||l||r||s||d||(o="",i="",n="",l="",r="",s="",d="");var c="";c+='<div class="contenedor-crearUsuario bg-light ">',2==e?(c+='<h3 class="text-black mt-2 mb-4">Editar datos de '+o+" "+i+"</h3>",c+=' <input type="hidden" id="idUser" name="id" value="'+a.id+'" placeholder="" required>'):c+='<h3 class="text-black mt-2 mb-4">Ingrese los datos del nuevo usuario</h3>',c+="<form>",c+='<div class="d-flex justify-content-between">',c+='<div class="mb-3 col-md-6" style="padding-right:5px">',c+='<label for="exampleFormControlInput1" class="form-label"><strong>Nombre:</strong></label>',c+=' <input type="text" class="form-control" id="nombre" name="nombre" value="'+o+'" placeholder="" required>',c+="</div>",c+='<div class="mb-3 col-md-6" style="padding-left:5px">',c+='<label for="exampleFormControlInput1" class="form-label"><strong>Apellido:</strong></label>',c+='<input type="text" class="form-control" id="apellido" name="apellido" value="'+i+'" placeholder="" required>',c+="</div>",c+="</div>",c+='<div class="mb-3">',c+='<label for="exampleFormControlInput1" class="form-label"><strong>Cédula:</strong></label>',c+='<input type="number" class="form-control" id="cedula" name="cedula" value="'+n+'" placeholder="1600XXXXXX" aria-label="Username" aria-describedby="basic-addon1">',c+="</div>",c+='<div class="mb-3">',c+='<label for="exampleFormControlInput1" class="form-label"><strong>Celular:</strong></label>',c+='<input type="number" class="form-control" id="celular" value="'+r+'" name="celular" placeholder="098XXXXXXX" aria-label="Username" aria-describedby="basic-addon1">',c+="</div>",c+='<div class="mb-3">',c+='<label for="exampleFormControlInput1" class="form-label"><strong>Email:</strong></label>',c+='<div class="input-group mb-3">',c+='<span class="input-group-text" id="basic-addon1">@</span>',c+='<input type="text" class="form-control" placeholder="" value="'+l+'" id="email" name="email">',c+="</div>",c+="</div>",c+='<div class="mb-3">',c+='<label for="exampleFormControlInput1" class="form-label"><strong>Unidad:</strong></label>',c+='<select class="form-select" name="unidad" id="unidad">',c+='<option  value="" selected disabled> --  Seleccione una opción --</option>',unidades.forEach(e=>{e.id==s?c+='<option value="'+e.id+'" selected>'+e.unidad+" ("+e.jefe+")</option>":c+='<option value="'+e.id+'">'+e.unidad+" ("+e.jefe+")</option>"}),c+="</select>",c+="</div>",c+='<div class="mb-3">',c+='<label for="exampleFormControlInput1" class="form-label"><strong>Rol:</strong></label>',c+='<select class="form-select" name="rol" id="rol">',c+='<option value="" selected disabled> --  Seleccione una opción --</option>',roles.forEach(e=>{e.id==d?c+='<option value="'+e.id+'" selected>'+e.rol+"</option>":c+='<option value="'+e.id+'">'+e.rol+"</option>"}),c+="</select>",c+="</div>",1==e&&(c+='<div class="d-flex ">',c+='<div class="mb-1 col-md-10" style="padding-right:5px">',c+='<label for="exampleFormControlInput1" class="form-label"><strong>Contraseña:</strong></label>',c+='<input type="password" id="password" name="password" class="form-control noallow" placeholder="" disabled>',c+="</div>",c+='<div class="mb-1 col d-flex justify-content-start align-items-end" >',c+='<buttom type="buttom" class="btn btn-warning w-100" id="btnBlock" onclick="llenarPass()">Cambiar contraseña</buttom>',c+="</div>",c+="</div>",c+='<div id="passwordHelp" class="form-text">Si deja en blanco la contraseña será la cédula del nuevo usuario.</div>'),c+='<div class="w-100 mt-2" id="alertas">',c+="</div>",c+='<div class="my-5 d-flex justify-content-center align-items-center">',c+='<a class="btn btn-success px-5 py-2" id="botonCrear" style="font-size:15px" onclick="guardarDatos('+e+')"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>',c+="</div>",c+="</div>",c+="</form>",document.getElementById("dibujar-js").innerHTML=c}async function eliminarUsuario(e){const t=usuarios.find(t=>t.id==e);Swal.fire({title:"ELIMINAR",text:`Eliminar de forma permamente a ${t.nombre}?`,icon:"warning",showCancelButton:!0,confirmButtonText:"Eliminar",confirmButtonColor:"#dc3545"}).then(t=>{t.isConfirmed&&$.ajax({data:{id:e},url:URL_BASE+"/user/delete",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exito?Swal.fire({position:"top-end",icon:"success",title:e.exito,showConfirmButton:!1,timer:1500}).then(()=>{window.location.href=URL_BASE+"/admin"}):e.error?(Swal.fire("ERROR","error",e.error),crearUsuario()):e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"})}).fail(e=>{console.log(e)})})}function llenarPass(){document.getElementById("btnBlock").addEventListener("click",liberarBoton())}function liberarBoton(){const e=document.getElementById("password");1==e.disabled?(e.disabled=!1,e.classList.remove("noallow")):(e.disabled=!0,e.classList.add("noallow"))}async function guardarDatos(e){let t,{nombre:a,apellido:o,cedula:i,celular:n,email:l,password:r,idUnidad:s,idRol:d}=user;a=document.getElementById("nombre").value,o=document.getElementById("apellido").value,i=document.getElementById("cedula").value,n=document.getElementById("celular").value,l=document.getElementById("email").value,1==e&&(r=document.getElementById("password").value,1==document.getElementById("password").disabled&&(r=document.getElementById("cedula").value)),s=document.getElementById("unidad").value,d=document.getElementById("rol").value,t=o.length>0?a+" "+o:a;const c=new FormData;if(2==e){let e=document.getElementById("idUser").value;c.append("id",e)}let u;c.append("nombre",t),c.append("apellido",o),c.append("cedula",i),c.append("celular",n),c.append("email",l),1==e&&(i==r?c.append("passwordCedula",1):c.append("passwordCedula",0),c.append("password",r)),c.append("idUnidad",s),c.append("idRol",d),1==e?u=URL_BASE+"/user/create":2==e&&(u=URL_BASE+"/user/update");const m=await fetch(u,{method:"POST",headers:{token:token},body:c}),p=await m.json();var b="";p.exito?Swal.fire({position:"top-end",icon:"success",title:p.exito,showConfirmButton:!1,timer:1500}).then(()=>{window.location.href=URL_BASE+"/admin"}):p.error?Swal.fire({icon:"error",title:"ERROR",text:p.error}).then(()=>{crearUsuario()}):p.exit?Swal.fire({icon:"warning",title:p.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):(b+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',p.alertas.error.forEach(e=>{b+='<li class="text-danger"  >',b+=e,b+="</li>"}),b+="</ul>",document.getElementById("alertas").innerHTML=b),alertas()}function estado(e,t=1){$.ajax({data:{id:e},url:URL_BASE+"/user/estado",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.activo?Swal.fire({position:"top-end",icon:"success",title:e.activo,showConfirmButton:!1,timer:1500}).then(()=>{console.log("activo"),console.log("tipo",t),traerUser(t)}):e.inactivo?Swal.fire({position:"top-end",icon:"error",title:e.inactivo,showConfirmButton:!1,timer:1500}).then(()=>{console.log("activo"),console.log("tipo",t),traerUser(t)}):e.exit?Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):Swal.fire({icon:"error",title:"ERROR",text:e.error}).then(()=>{traerUser(t)})}).fail(e=>{console.log(e)})}function buscarUsuario(){document.getElementById("dibujar-js").innerHTML='<div class="contenedor-crearUsuario bg-light mb-4"><h3 class="text-black">Ingrese los datos para buscar al usuario</h3><div class="mb-3"><label for="exampleFormControlInput1" class="form-label"><strong>Buscar por:</strong></label><select class="form-select selectDocumentos" name="tipo" id="tipo" onchange="elegirTipo()"><option value="" selected disabled> --  Seleccione una opción -- </option><option value="1">Nombre</option><option value="2">Rol</option><option value="3">Unidad</option></select></div><div id="elegir"></div></div><div id="tablaBuscar"></div></div>'}function elegirTipo(){let e=document.getElementById("tipo").value;var t="";if(e)switch(e){case"1":t+='<div class="mb-3">',t+='<label for="exampleFormControlInput1" class="form-label"><strong>Ingrese el nombre:</strong></label>',t+='<input type="text" class="form-control buscar" placeholder="" aria-label="Username" aria-describedby="basic-addon1" onKeyUp="escucharNombre(this.value)">',t+="</div>",document.getElementById("elegir").innerHTML=t,document.getElementById("tablaBuscar").innerHTML="";break;case"2":t+='<div class="mb-3">',t+='<label for="exampleFormControlInput1" class="form-label"><strong>Buscar por rol:</strong></label>',t+='<select class="form-select" name="rol" id="rol" onchange="escucharRol()">',t+='<option value="" selected disabled> --  Seleccione una opción --</option>',roles.forEach(e=>{t+='<option value="'+e.id+'">'+e.rol+"</option>"}),t+="</select>",t+="</div>",document.getElementById("elegir").innerHTML=t,document.getElementById("tablaBuscar").innerHTML="";break;case"3":t+='<div class="mb-3">',t+='<label for="exampleFormControlInput1" class="form-label"><strong>Buscar por Unidad:</strong></label>',t+='<select class="form-select" name="unidad" id="unidad" onchange="escucharUnidad()">',t+='<option value="" selected disabled> --  Seleccione una opción --</option>',unidades.forEach(e=>{t+='<option value="'+e.id+'">'+e.unidad+"</option>"}),t+="</select>",t+="</div>",document.getElementById("elegir").innerHTML=t,document.getElementById("tablaBuscar").innerHTML=""}}function buscarSeccion(){return new Promise((e,t)=>{let a=[];$.ajax({url:URL_BASE+"/user/seccion",type:"GET",headers:{token:token},dataType:"json"}).done(t=>{t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),$.each(t,(o,i)=>{a.push(i),t.length==o+1&&e(a)})}).fail(e=>{t(e)})})}escucharNombre=e=>{$.ajax({data:{tipo:"buscarNombre",dato:e},url:URL_BASE+"/user/buscar",type:"POST",headers:{token:token},dataType:"json"}).done(t=>{var a="";if(0!=e.length){if(t.error)return a+="<div class='w-100 d-flex justify-content-center align-items-center' style='height:200px'> <div class='bg-danger d-flex justify-content-center align-items-center w-100' style='border-radius:5px;height:40px'><h4 class='card-title text-white' style='text-transform: uppercase'>No existen coincidencias</h4></div></div>",void(document.getElementById("tablaBuscar").innerHTML=a);t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),localStorage.setItem("buscarUser",JSON.stringify(t)),dibujarUsuarios(t,"tablaBuscar",2)}else document.getElementById("tablaBuscar").innerHTML=""}).fail(e=>{console.log(e)})},escucharRol=()=>{let e=document.getElementById("rol").value;$.ajax({data:{tipo:"buscarRol",dato:e},url:URL_BASE+"/user/buscar",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{var t="";if(e.error)return t+="<div class='w-100 d-flex justify-content-center align-items-center' style='height:200px'> <div class='bg-danger d-flex justify-content-center align-items-center w-100' style='border-radius:5px;height:40px'><h4 class='card-title text-white' style='text-transform: uppercase'>No existen coincidencias</h4></div></div>",void(document.getElementById("tablaBuscar").innerHTML=t);e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),localStorage.setItem("buscarUser",JSON.stringify(e)),dibujarUsuarios(e,"tablaBuscar",2)}).fail(e=>{console.log(e)})},escucharUnidad=()=>{let e=document.getElementById("unidad").value;$.ajax({data:{tipo:"buscarUnidad",dato:e},url:URL_BASE+"/user/buscar",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{var t="";if(e.error)return t+="<div class='w-100 d-flex justify-content-center align-items-center' style='height:200px'> <div class='bg-danger d-flex justify-content-center align-items-center w-100' style='border-radius:5px;height:40px'><h4 class='card-title text-white' style='text-transform: uppercase'>No existen coincidencias</h4></div></div>",void(document.getElementById("tablaBuscar").innerHTML=t);e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),localStorage.setItem("buscarUser",JSON.stringify(e)),dibujarUsuarios(e,"tablaBuscar",2)}).fail(e=>{console.log(e)})};