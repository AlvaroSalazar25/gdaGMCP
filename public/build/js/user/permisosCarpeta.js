const URL_BASE="http://localhost/gdagmcp",token=JSON.parse(localStorage.getItem("token")),CARPETA_BASE="/base";let secciones,roles,permisosDefault=[{id:1,status:!1,nombre:"Ver_Carpeta",type:"carpeta",descripcion:"Permiso para ver carpetas"},{id:2,status:!1,nombre:"Crear_Carpeta",type:"carpeta",descripcion:"Permiso para crear carpetas"},{id:3,status:!1,nombre:"Editar_Carpeta",type:"carpeta",descripcion:"Permiso para Editar,Mover,Eliminar la carpeta"},{id:4,status:!1,nombre:"Ver_Documento",type:"documento",descripcion:"Permiso para visualizar el documento"},{id:5,status:!1,nombre:"Crear_Documento",type:"documento",descripcion:"Permiso para Crear un documento"},{id:6,status:!1,nombre:"Editar_Documento",type:"documento",descripcion:"Permiso para Editar la metadata del documento"},{id:7,status:!1,nombre:"Mover_Documentos",type:"documento",descripcion:"Permiso para mover de carpeta los documentos"},{id:8,status:!1,nombre:"Eliminar_Documento",type:"documento",descripcion:"Permiso para Eliminar el documento"}];async function iniciarApp(){const e=window.location.search;dibujarCarpeta(new URLSearchParams(e).get("id"))}function alertas(){const e=document.querySelectorAll(".alert"),a=document.getElementById("alertas"),t=document.querySelector("#alertaTipo");e&&setTimeout(()=>{e.forEach((function(e){e.remove(),a&&(a.innerHTML=""),t&&(t.innerHTML="")}))},3e3)}function traerSeccion(e){return new Promise((a,t)=>{$.ajax({data:{tipo:"findCarpeta",id:e},url:URL_BASE+"/carpeta/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),a(e)}).fail(e=>{t(e)})})}async function dibujarCarpeta(e){var a="";document.getElementById("contenedor-titulo").innerHTML="";let t=await traerSeccion(e);if(a+='<div class="d-flex justify-content-center padreAtras">',a+='<div class="d-flex justify-content-center hijoAtras">',a+='<a class=" btn btn-outline-danger '+(null==t?"noVisible":"")+' " onclick="dibujarAtras()"><i class="fa-solid fa-arrow-left-long fa-2x"></i> <span class="span-boton">Atrás</span></a>',a+="</div>",null==t?a+='<h1 class="text-black mb-3"><strong>Administrar Carpetas</strong></h1>':(a+='<div class="d-flex flex-column justify-content-center">',a+='<div class="d-flex justify-content-center">',a+='<h1 class="text-black mb-3"><i class="fa-solid fa-folder-open fa-xl" style="margin-right:7px;color:'+t.color+'"></i><strong>'+(t.seccion[0].toUpperCase()+t.seccion.substring(1))+"</strong></h1>",a+='<button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" style="margin-left:5px;margin-top:4px;width:25px;height:30px;border-radius:15px">',a+='<i class="fa-solid fa-ellipsis-vertical fa-xl "></i>',a+="</button>",a+='<ul class="dropdown-menu dropdown-menu-dark">',a+=' <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalEditar'+t.id+'"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>',a+='<li class="puntero"><a class="dropdown-item" onclick="deleteSeccion('+t.id+')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>',a+="</ul>",a+="</div>",a+='<h3 class="text-black mt-3 mb-4">Lista de usuarios permitidos para interactuar con la carpeta seleccionada</h3>',a+="</div>"),a+="</div>",a+='<div class="w-100 mt-2">',null!=t){let e=("/base"+t.path).split("/");e.shift();e.forEach(e=>{var t=e.replaceAll("_"," ");console.log("nombre",t),a+='<a class="" style="text-decoration:none!important;color:#969798"><strong>'+(t[0].toUpperCase()+t.substring(1))+"</strong></a> /  "})}a+="</div>",a+='<div class="contenedor-carpetas mt-3 mb-5 py-3 px-4" style="min-width:900px" id="contenedorCarpetas" >',a+="</div>",a+='<div class="modal fade" id="exampleModalEditar'+t.id+'" tabindex="-1" aria-labelledby="exampleModalLabel'+t.id+'" aria-hidden="true">',a+='<div class="modal-dialog">',a+='<div class="modal-content">',a+='  <div class="modal-header bg-black">',a+='   <h5 class="modal-title text-white">Editar</h5>',a+='<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>',a+="  </div>",a+='  <div class="modal-body" style="min-height:350px">',a+='<h3 class="text-black mt-2 mb-4">Edite <strong>'+t.seccion+"</strong></h3>",a+='<div class="mb-4 d-flex justify-content-between">',a+='<div class="d-flex flex-column" style="width:70%">',a+='<label  class="form-label"><strong>Nombre:</strong></label>',a+='<input type="text" class="form-control" id="seccion'+t.id+'" value="'+t.seccion+'">',a+="</div>",a+='<div class="d-flex flex-column" style="width:28%">',a+='<label class="form-label"><strong>Color:</strong></label>',a+='<input type="color" class="form-control  puntero" id="color'+t.id+'" value="'+t.color+'">',a+="</div>",a+="</div>",a+='<div class="mb-4">',a+='<label for="exampleFormControlInput1" class="form-label"><strong>Descripción:</strong></label>',""==t.descripcion?a+='<textarea class="form-control" rows="6" id="descripcion'+t.id+'" placeholder="Esta Sección no tiene descripción"></textarea>':a+='<textarea class="form-control" rows="6" id="descripcion'+t.id+'" >'+t.descripcion+"</textarea>",a+="</div>",a+='<div class="mb-4">',a+='<div class="w-100">',a+='<label class="form-label"><strong>Mover Carpeta:</strong></label>',a+="</div>",a+='<div style="height:30px">',a+='<select style="width:100%;height:100% !important" id="select'+t.id+'" class="js-example-basic-single" >';let i=JSON.parse(t.carpetas);i.unshift({id:"0",idPadre:"0",seccion:"CARPETA BASE",descripcion:"",color:"#000000",path:"/base"}),i.forEach(e=>{e.id!=t.id&&(a+='<optgroup label="'+e.seccion+'">',a+='<option value="'+e.id+'" '+(e.id==t.idPadre?"selected":"")+'><strong><i class="fa-solid fa-folder-open"></i></strong>'+e.path+"</option>",a+="</optgroup>")}),a+="</select>",a+="</div>",a+='<div class="w-100 mt-4" id="alertas'+t.id+'">',a+="</div>",a+="</div>",a+="</div>",a+='<div class="modal-footer">',a+='<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>',a+='<a class="btn btn-success" id="botonCrear" onclick="updateSeccion('+padre+","+t.id+',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>',a+="</div>",a+="</div>",a+="</div>",a+="</div>",document.getElementById("dibujar-js").innerHTML=a,document.getElementById("dibujar-tabla").innerHTML="",waitResponse("#contenedorCarpetas"),$("#select"+e).select2({dropdownParent:$("#exampleModalEditar"+e)}),await dibujarUsers("contenedorCarpetas",e)}async function waitResponse(e,a="129.5px",t=1){var i="";1==t?(i+='<div class="d-flex justify-content-center align-items-center w-100" style="width:100% !important;height:'+a+'" width:100% !important;height:50px" id="contenedorWait">',i+=' <div class="spinner-grow" role="status">',i+='<span class="visually-hidden">Loading...</span>',i+="</div>",i+=' <div class="spinner-grow" role="status">',i+='<span class="visually-hidden">Loading...</span>',i+="</div>",i+=' <div class="spinner-grow" role="status">',i+='<span class="visually-hidden">Loading...</span>',i+="</div>",i+="</div>"):(e.innerHTML="",i+='<td colspan="8" valign="top">',i+='<div class="d-flex justify-content-center align-items-center w-100" style="width:100% !important;height:'+a+'" id="contenedorWait">',i+=' <div class="spinner-grow" role="status">',i+='<span class="visually-hidden">Loading...</span>',i+="</div>",i+=' <div class="spinner-grow" role="status">',i+='<span class="visually-hidden">Loading...</span>',i+="</div>",i+=' <div class="spinner-grow" role="status">',i+='<span class="visually-hidden">Loading...</span>',i+="</div>",i+="</div>",i+="</td>"),document.querySelector(e).innerHTML=i}async function dibujarUsers(e,a,t=1,i=[]){0==i.length&&(i=await traerUsers());let s=combinarArrays(i,await traerUnidades());var o="";o+="<h4><strong>Usuarios</strong></h4>",o+='<table class="table" style="min-width:900px" id="tablaUsuarios">',o+='<thead class="table-dark">',o+='<tr class="" style="text-transform:uppercase">',o+="<th >N°</th>",o+="<th>Nombre</th>",o+="<th>Rol</th>",o+="<th>Unidad</th>",o+="<th>Estado</th>",o+="<th>Jefe</th>",o+="<th>Usuarios</th>",o+='<th class="col-1">Acciones</th>',o+="</tr>",o+="</thead>",o+='<tbody class="contenido" id="contenido">',s.forEach((e,i)=>{let s="1"==e.estado?"btn-outline-success":"btn-outline-danger";o+='<tr class="">',o+="<td>"+(parseInt(i)+1)+"</p></td>",o+='<td class="col"><i class="fa-solid '+("-"!=e.idUser?"fa-user":"fa-building")+'" style="margin-right:10px"></i>'+e.nombre+"</p></td>",o+='<td class="col">'+e.rol+"</p></td>",o+='<td class="col">'+e.unidad+"</p></td>","-"!=e.estado?o+='<td class="col"><buttom type="buttom" disabled class="botonDisabled btn btn-rounded '+s+'"  style="">'+("1"==e.estado?"Activo":"Inactivo")+"</buttom></p></td>":o+='<td class="col">'+e.estado+"</p></td>",o+='<td class="col">'+e.jefe+"</p></td>",o+='<td class="col">'+e.usuarios+"</p></td>",o+='<td class="col">',o+='<div class="d-flex">';let d="-"!=e.idUnidad?1:0,r="-"!=e.idUnidad?e.idUnidad:e.idUser;o+=`<a class="btn btn-primary  botonPermiso" id="${t}" onclick="modalPermiso('${a}','${r}',${d})" style="margin:0px 5px">Permisos</a>`,o+="<div>",o+="</td>",o+="</tr>"}),o+="</tbody>",o+="</table>",document.getElementById(e.toString()).classList.add("mt-5"),document.getElementById(e.toString()).innerHTML=o,$("#tablaUsuarios").DataTable()}function traerUsers(){return new Promise((e,a)=>{let t=[];$.ajax({data:{tipo:"usuarios"},url:URL_BASE+"/user/datos",type:"POST",headers:{token:token},dataType:"json"}).done(a=>{a.exit&&Swal.fire({icon:"warning",title:a.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==a.length&&e(t),$.each(a,(i,s)=>{t.push(s),a.length==i+1&&e(t)})}).fail(e=>{a(e)})})}function traerUnidades(){return new Promise((e,a)=>{let t=[];$.ajax({data:{tipo:"unidadSeccion"},url:URL_BASE+"/unidad/datos",type:"POST",headers:{token:token},dataType:"json"}).done(a=>{a.exit&&Swal.fire({icon:"warning",title:a.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==a.length&&e(t),$.each(a,(i,s)=>{t.push(s),a.length==i+1&&e(t)})}).fail(e=>{a(e)})})}function combinarArrays(e,a){for(var t=[],i=0;i<e.length;i++){var s=e[i],o={numero:i+1,nombre:s.nombre,rol:s.rol,unidad:s.unidad,estado:s.estado,jefe:"-",usuarios:"-",acciones:s.acciones,idUser:s.id,idUnidad:"-"};t.push(o)}for(i=0;i<a.length;i++){var d=a[i];o={numero:i+e.length+1,nombre:d.unidad,rol:"-",unidad:"-",estado:"-",jefe:d.jefe,usuarios:d.usuarios,acciones:"-",idUnidad:d.id,idUser:"-"};t.push(o)}return t}function mutarDato(e){return{nombre:void 0!==e.nombre?e.nombre:void 0!==e.unidad?e.unidad:"",rol:void 0!==e.rol?e.rol:"",unidad:void 0!==e.unidad?e.unidad:"",estado:void 0!==e.estado?e.estado:"",jefe:void 0!==e.jefe?e.jefe:"",usuarios:void 0!==e.usuarios?e.usuarios:"",id:e.id}}async function dibujarAtras(){window.location.href=URL_BASE+"/permisos"}function traerPermisosUser(e,a){return new Promise((t,i)=>{$.ajax({data:{tipo:"permisosUserCarpeta",idUser:a,idSeccion:e},url:URL_BASE+"/user/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),t(e)}).fail(e=>{i(e)})})}function traerPermisosUnidad(e,a){return new Promise((t,i)=>{$.ajax({data:{tipo:"permisosUnidadCarpeta",idUnidad:a,idSeccion:e},url:URL_BASE+"/unidad/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),t(e)}).fail(e=>{i(e)})})}function findUserById(e){return new Promise((a,t)=>{$.ajax({data:{id:e,tipo:"usuario"},url:URL_BASE+"/user/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),a(e)}).fail(e=>{t(e)})})}function findUnidadById(e){return new Promise((a,t)=>{$.ajax({data:{id:e,tipo:"unidad"},url:URL_BASE+"/unidad/datos",type:"POST",headers:{token:token},dataType:"json"}).done(e=>{e.exit&&Swal.fire({icon:"warning",title:e.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),a(e)}).fail(e=>{t(e)})})}async function modalPermiso(e,a,t){let i;if(0==t){i=await traerPermisosUser(e,a);let t=await findUserById(a);console.log("usereeee",t),0==i.length&&(i=await traerPermisosUnidad(e,t.idUnidad))}else 1==t&&(i=await traerPermisosUnidad(e,a));0==i.length?crearModalAgregarPermisos(e,a,t):crearModalEditarPermisos(e,a,t)}async function crearModalAgregarPermisos(e,a,t){0==t&&(a=await findUserById(a)),1==t&&(a=await findUnidadById(a)),a=mutarDato(a);let i=["fa-solid fa-eye","fa-solid fa-plus","fa-solid fa-edit","fa-solid fa-eye","fa-solid fa-plus","fa-solid fa-edit","fa-solid fa-folder-tree","fa-solid fa-trash"];var s="";s+='<div class="modal fade" id="exampleModalPermisosUser" tabindex="-1" aria-labelledby="exampleModalPermisosUser" aria-hidden="true">',s+='<div class="modal-dialog">',s+='<div class="modal-content">',s+='<div class="modal-header bg-black">',s+='<h5 class="modal-title text-white">Agregar Permisos</h5>',s+='<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>',s+="</div>",s+='<div class="modal-body">',s+='<h3 class="text-black"><strong>'+a.nombre.toUpperCase()+"</strong></h3>",s+='<h5 class="text-black mt-4 mb-1">Permisos de Carpeta <i class="fa-solid fa-folder-open fa-lg" style="margin-left:5px"></i></h5>',s+='<div class="unido_alerta">',s+='<div class="mb-2" style="border:1px solid #bcbcbc;border-radius:5px">',s+='<div class="row p-3">',permisosDefault.forEach((e,a)=>{"carpeta"==e.type&&(1==e.id?(s+='<div  class="d-flex justify-content-between w-100">',s+='<div class="d-flex '+(1!=e.id?"apagar":"")+'" >',s+='<div  style="width:160px" >',s+=`<i class="${i[a]} fa-xl" style="margin-right:5px"></i>`,s+="<label>"+e.nombre.replaceAll("_"," ")+"</label>",s+="</div>",s+='<input class="form-check-input permiso" id="'+e.id+'" type="checkbox">',s+="</div>",s+='<div class="d-flex" >',s+='<div  style="width:160px" >',s+='<i class="fa-solid fa-right-left fa-xl" style="margin-right:5px"></i>',s+="<label>Heredar Permisos</label>",s+="</div>",s+='<input class="form-check-input" id="heredar" type="checkbox">',s+="</div>",s+="</div>"):(s+='<div class="d-flex '+(1!=e.id?"apagar":"")+'" >',s+='<div  style="width:160px" >',s+=`<i class="${i[a]} fa-xl" style="margin-right:5px"></i>`,s+="<label>"+e.nombre.replaceAll("_"," ")+"</label>",s+="</div>",s+='<input class="form-check-input permiso" id="'+e.id+'" type="checkbox">',s+="</div>"))}),s+="</div>",s+="</div>",s+="</div>",s+='<h5 class="text-black mt-4 mb-1">Permisos de Documento<i class="fa-solid fa-file-pdf fa-lg" style="margin-left:5px"></i></h5>',s+='<div class="unido_alerta">',s+='<div class="mb-2" style="border:1px solid #bcbcbc;border-radius:5px">',s+='<div class="row p-3">',permisosDefault.forEach((e,a)=>{"documento"==e.type&&(s+='<div class="d-flex '+(4!=e.id?"apagar":"")+'">',s+='<div  style="width:160px">',s+=`<i class="${i[a]} fa-xl" style="margin-right:5px"></i>`,s+="<label>"+e.nombre.replaceAll("_"," ")+"</label>",s+="</div>",s+='<input class="form-check-input permiso" id="'+e.id+'"  type="checkbox">',s+="</div>")}),s+="</div>",s+="</div>",s+="</div>",s+='<div class="w-100"  id="alertasPermisosUser">',s+="</div>",s+="</div>",s+='<div class="modal-footer mt-2 d-flex justify-content-end">',s+='<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>',s+=`<button type="button" class="btn btn-success" onclick="savePermisos(${e},${a.id},${t})"><i class="fa-solid fa-floppy-disk" style="margin-right:3px"></i>Guardar</button>`,s+="</div>",s+="</div>",document.getElementById("modales").innerHTML=s,$("#selectMover").select2({dropdownParent:$("#exampleModalPermisosUser")}),$("#exampleModalPermisosUser").modal("show")}async function crearModalEditarPermisos(e,a,t){let i,s=!1;0==t&&(a=await findUserById(a),i=await traerPermisosUser(e,a.id),0==i.length&&(s=!0,i=await traerPermisosUnidad(e,a.idUnidad))),1==t&&(a=await findUnidadById(a),i=await traerPermisosUnidad(e,a.id)),a=mutarDato(a),console.log("dato",a),console.log("datoUserPermiso",s);let o=JSON.parse(i[0].permisos);console.log("tipo == 0 es usuario, 1 es unidad",t),console.log("permiso de usuario",o);let d=["fa-solid fa-eye","fa-solid fa-plus","fa-solid fa-edit","fa-solid fa-eye","fa-solid fa-plus","fa-solid fa-edit","fa-solid fa-folder-tree","fa-solid fa-trash"];var r="";r+='<div class="modal fade" id="exampleModalPermisosUser" tabindex="-1" aria-labelledby="exampleModalPermisosUser" aria-hidden="true">',r+='<div class="modal-dialog">',r+='<div class="modal-content">',r+='<div class="modal-header bg-black">',r+='<h5 class="modal-title text-white">Editar Permisos</h5>',r+='<button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>',r+="</div>",r+='<div class="modal-body">',r+='<h3 class="text-black"><strong>'+a.nombre.toUpperCase()+"</strong></h3>",r+='<h5 class="text-black mt-4 mb-1">Permisos de Carpeta <i class="fa-solid fa-folder-open fa-lg" style="margin-left:5px"></i></h5>',r+='<div class="unido_alerta">',r+='<div class="mb-2" style="border:1px solid #bcbcbc;border-radius:5px">',r+='<div class="row p-3">',o.forEach((e,a)=>{"carpeta"==e.type&&(1==e.id?(r+='<div  class="d-flex justify-content-between w-100">',r+='<div class="d-flex " >',r+='<div  style="width:160px" >',r+=`<i class="${d[a]} fa-xl" style="margin-right:5px"></i>`,r+="<label>"+e.nombre.replaceAll("_"," ")+"</label>",r+="</div>",r+='<input class="form-check-input permiso" id="'+e.id+'" type="checkbox"'+(1==e.status?"checked":"")+">",r+="</div>",r+='<div class="d-flex" >',r+='<div  style="width:160px" >',r+='<i class="fa-solid fa-right-left fa-xl" style="margin-right:5px"></i>',r+="<label>Heredar Permisos</label>",r+="</div>",r+='<input class="form-check-input" id="heredar" type="checkbox">',r+="</div>",r+="</div>"):(r+='<div class="d-flex" >',r+='<div  style="width:160px" >',r+=`<i class="${d[a]} fa-xl" style="margin-right:5px"></i>`,r+="<label>"+e.nombre.replaceAll("_"," ")+"</label>",r+="</div>",r+='<input class="form-check-input permiso" id="'+e.id+'" type="checkbox" '+(1==e.status?"checked":"")+">",r+="</div>"))}),r+="</div>",r+="</div>",r+="</div>",r+='<h5 class="text-black mt-4 mb-1">Permisos de Documento<i class="fa-solid fa-file-pdf fa-lg" style="margin-left:5px"></i></h5>',r+='<div class="unido_alerta">',r+='<div class="mb-2" style="border:1px solid #bcbcbc;border-radius:5px">',r+='<div class="row p-3">',o.forEach((e,a)=>{"documento"==e.type&&(r+='<div class="d-flex ">',r+='<div  style="width:160px">',r+=`<i class="${d[a]} fa-xl" style="margin-right:5px"></i>`,r+="<label>"+e.nombre.replaceAll("_"," ")+"</label>",r+="</div>",r+='<input class="form-check-input permiso" id="'+e.id+'"  type="checkbox" '+(1==e.status?"checked":"")+">",r+="</div>")}),r+="</div>",r+="</div>",r+="</div>",r+='<div class="w-100"  id="alertasPermisosUser">',r+="</div>",r+="</div>",r+='<div class="modal-footer mt-2 d-flex justify-content-between">',1==s?r+=`<div id="passwordHelp" class="form-text">* Permisos Heredados de la Unidad <strong>${a.unidad}</strong></div>`:(r+="<div>",r+="</div>"),r+="<div>",r+='<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>',r+=`<button type="button" class="btn btn-success" style="margin-left:5px" onclick="savePermisos(${e},${a.id},${t})"><i class="fa-solid fa-floppy-disk" style="margin-right:3px"></i>Guardar</button>`,r+="</div>",r+="</div>",r+="</div>",document.getElementById("modales").innerHTML=r,$("#selectMover").select2({dropdownParent:$("#exampleModalPermisosUser")}),$("#exampleModalPermisosUser").modal("show")}document.addEventListener("DOMContentLoaded",iniciarApp());let cont=0;async function savePermisos(e,a,t){console.log("tipo",t);let i=document.getElementById("heredar").checked,s=document.querySelectorAll(".permiso");s=Array.apply(null,s);let o=0;var d="";let r=s.filter(e=>e.checked).map(e=>e.id),l=null,n=permisosDefault.filter(e=>(1===e.id&&(l=!!r.includes(e.id.toString())),!0)).map(e=>({...e,status:!!r.includes(e.id.toString())||e.status}));if(0==l&&s.forEach(e=>{e.id>3&&1==e.checked&&o++}),0!=o)return d+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',d+='<li class="text-danger">',d+="Ver Carpeta debe activarse para dar permisos a los Documentos",d+="</li>",document.getElementById("alertasPermisosUser").innerHTML=d,void alertas();const c=new FormData;let p;c.append("idSeccion",e),c.append("verSeccion",l),c.append("heredar",i),0==t?c.append("idUser",a):1==t&&c.append("idUnidad",a),c.append("permisos",JSON.stringify(n)),console.log([...c]),0==t?p=URL_BASE+"/permisos/user":1==t&&(p=URL_BASE+"/permisos/unidad");const m=await fetch(p,{method:"POST",headers:{token:token},body:c}),u=await m.json();console.log(u),u.exito?Swal.fire({position:"top-end",icon:"success",title:u.exito,showConfirmButton:!1,timer:1500}).then(()=>{dibujarCarpeta(e),$("#exampleModalPermisosUser").modal("hide")}):u.error?Swal.fire({icon:"error",title:"ERROR",text:u.error}).then(()=>{dibujarCarpeta(e),$("#exampleModalPermisosUser").modal("hide")}):u.exit?Swal.fire({icon:"warning",title:u.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}):(d+='<ul class="alert bg-white px-5 mt-3" style="border-radius:5px;border:1px solid red"  style="width:100%" >',u.alertas.error.forEach(e=>{d+='<li class="text-danger"  >',d+=e,d+="</li>"}),d+="</ul>",document.getElementById("alertas").innerHTML=d),alertas()}document.addEventListener("click",(function(e){document.querySelectorAll(".permiso").forEach(a=>{1==e.target.id&&e.target.classList.contains("permiso")?(a.parentNode.parentNode.parentNode.classList.remove("alertaPermiso"),cont=0,0==e.target.checked&&1!=a.id?(a.checked=!1,a.parentNode.classList.add("apagar"),4==a.id&&a.parentNode.classList.remove("apagar")):1==e.target.checked&&1!=a.id&&a.id<4&&(a.parentNode.classList.remove("apagar"),a.checked=!1)):4==e.target.id&&e.target.classList.contains("permiso")&&(0==e.target.checked?4!=a.id&&a.id>4&&(a.parentNode.classList.add("apagar"),a.checked=!1):1==e.target.checked&&4!=a.id&&a.id>4&&(a.parentNode.classList.remove("apagar"),a.checked=!1))})}));