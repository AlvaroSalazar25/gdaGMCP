const URL_BASE="http://localhost/gdagmcp",token=JSON.parse(localStorage.getItem("token"));let unidades,secciones,roles;async function iniciarApp(){console.log("hola");let e=dibujarArbolCarpetas(generarCarpetas(0,await traerSecciones()));document.getElementById("dibujar-tabla").appendChild(e)}function traerSecciones(){return new Promise((e,t)=>{let a=[];$.ajax({data:{tipo:"seccion"},url:URL_BASE+"/carpeta/datos",type:"POST",headers:{token:token},dataType:"json"}).done(t=>{t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==t.length&&e(a),$.each(t,(o,r)=>{a.push(r),t.length==o+1&&e(a)})}).fail(e=>{t(e)})})}document.addEventListener("DOMContentLoaded",iniciarApp());let permisosDefault=[{id:1,nombre:"Ver_Carpeta",type:"carpeta",descripcion:"Permiso para visualizar la carpeta",status:!1},{id:2,nombre:"Crear_Carpeta",type:"carpeta",descripcion:"Permiso para crear carpetas",status:!1},{id:3,nombre:"Editar_Carpeta",type:"carpeta",descripcion:"Permiso para Editar,Mover,Eliminar la carpeta",status:!1},{id:4,nombre:"Ver_Documento",type:"documento",descripcion:"Permiso para visualizar el documento",status:!1},{id:5,nombre:"Crear_Documento",type:"documento",descripcion:"Permiso para Crear un documento",status:!1},{id:6,nombre:"Editar_Documento",type:"documento",descripcion:"Permiso para Editar la metadata del documento",status:!1},{id:7,nombre:"Mover_Documentos",type:"documento",descripcion:"Permiso para mover de carpeta los documentos",status:!1},{id:8,nombre:"Eliminar_Documento",type:"documento",descripcion:"Permiso para Eliminar el documento",status:!1}];function dibujarArbolCarpetas(e){const t=document.createElement("ul");t.style="font-size:15px";const a=document.createElement("li"),o=document.createElement("div");o.classList.add("w-100","d-flex","justify-content-between");const r=document.createElement("p");r.textContent=e.nombre,0==e.id&&(o.classList.add("bg-black"),r.style="color:white;font-weight:bold"),e.hijos.length>0?o.style="border-bottom:1px dashed #707071;background-color:#DEE2E6":o.style="border-bottom:1px dashed #707071 !important",a.appendChild(o),o.appendChild(r);const i=document.createElement("div");i.classList.add("d-flex");var n=document.createElement("div");n.style="padding: 0px 3px;border-right:1px solid;border-left:1px solid;margin-right:5px";var d=document.createElement("div");return d.style="padding: 2px 3px;border-right:1px solid",permisosDefault.forEach(t=>{const a=document.createElement("input");a.classList.add("form-check-input",""+t.nombre,""+e.id),a.style="margin:5px;border:1px solid #1a1b15",a.type="checkbox",a.id=e.id+"p"+t.id,"carpeta"==t.type?n.appendChild(a):d.appendChild(a)}),i.appendChild(n),i.appendChild(d),o.appendChild(i),t.appendChild(a),e.hijos.length>0&&e.hijos.forEach(e=>{const t=dibujarArbolCarpetas(e);a.appendChild(t)}),t}function generarCarpetas(e,t){let a=t.find(t=>t.id==e);if(null==a)var o={nombre:"MARQUE PARA SELECCIONAR TODOS",id:"0",hijos:[]};else o={nombre:a.seccion,id:a.id,hijos:[]};return t.filter(t=>t.idPadre==e).forEach(e=>{let a=generarCarpetas(e.id,t);o.hijos.push(a)}),o}