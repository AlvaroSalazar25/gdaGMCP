const URL_BASE="http://localhost/gdagmcp",token=JSON.parse(localStorage.getItem("token"));let unidades,secciones,roles;async function iniciarApp(){console.log("hola");let e=generarCarpetas(0,await traerSecciones());const t=document.getElementById("dibujar-tabla");t.classList.add("contenedor-carpetas-permiso","p-5","mt-4");const a=dibujarArbolCarpetas(e,t);t.append(a),$(".moverC").hover((function(){$(this).css("border-bottom","2px solid #98c1fe")}),(function(){$(this).css("border-bottom","")}))}function traerSecciones(){return new Promise((e,t)=>{let a=[];$.ajax({data:{tipo:"seccion"},url:URL_BASE+"/carpeta/datos",type:"POST",headers:{token:token},dataType:"json"}).done(t=>{t.exit&&Swal.fire({icon:"warning",title:t.exit,showConfirmButton:!1,text:"Sesión expirada, vuelva a iniciar sesión",timer:3e3}).then(()=>{window.location.href=URL_BASE+"/?r=8"}),0==t.length&&e(a),$.each(t,(o,i)=>{a.push(i),t.length==o+1&&e(a)})}).fail(e=>{t(e)})})}document.addEventListener("DOMContentLoaded",iniciarApp());let permisosDefault=[{id:1,nombre:"Ver_Carpeta",type:"carpeta",descripcion:"Permiso para visualizar la carpeta",status:!1},{id:2,nombre:"Crear_Carpeta",type:"carpeta",descripcion:"Permiso para crear carpetas",status:!1},{id:3,nombre:"Editar_Carpeta",type:"carpeta",descripcion:"Permiso para Editar,Mover,Eliminar la carpeta",status:!1},{id:4,nombre:"Ver_Documento",type:"documento",descripcion:"Permiso para visualizar el documento",status:!1},{id:5,nombre:"Crear_Documento",type:"documento",descripcion:"Permiso para Crear un documento",status:!1},{id:6,nombre:"Editar_Documento",type:"documento",descripcion:"Permiso para Editar la metadata del documento",status:!1},{id:7,nombre:"Mover_Documentos",type:"documento",descripcion:"Permiso para mover de carpeta los documentos",status:!1},{id:8,nombre:"Eliminar_Documento",type:"documento",descripcion:"Permiso para Eliminar el documento",status:!1}];function dibujarArbolCarpetas(e,t){let a=e.nombre[0].toUpperCase()+e.nombre.substring(1);const o=document.createElement("ul");o.style="list-style-type:none;";const i=document.createElement("li");if(i.id="li"+e.id,0==e.hijos.length)i.innerHTML=`\n        <div class="d-flex align-items-center mt-1 mb-2" style="font-size:15px">\n        <div id="carpeta${e.id}">\n        <a class="moverC" style="text-decoration:none" href="${URL_BASE}/permisos/carpeta?id=${e.id}">\n        <i class="fa-solid fa-folder-open fa-lg" style="margin-right:7px;color:${e.color}"></i>\n        <span style="color:#212529"><strong>${a}</strong></span>\n        </a>\n        </div>\n        </div>\n      `;else{let t;t=0==e.id?'<i class="fa-solid fa-chevron-up  fa-lg"></i>':'<i class="fa-solid fa-chevron-down  fa-lg"></i>',i.innerHTML=`\n        <div class="d-flex align-items-center mt-1 mb-2" style="font-size:15px">\n        <div id="carpeta${e.id}">\n        <a class="moverC"  style="text-decoration:none" href="${URL_BASE}/permisos/carpeta?id=${e.id}">\n        <i class="fa-solid fa-folder-open fa-lg" style="margin-right:7px;color:${e.color}"></i>\n        <span style="color:#212529"><strong>${a}</strong></span>\n        </a>\n          <button class="btn btn-link" type="button" id="boton${e.id}" data-bs-toggle="collapse" data-bs-target="#collapse-${e.id}" style="margin-left:12px" >\n          ${t}\n          </button>\n        </div>\n        </div>\n      `}if(o.appendChild(i),e.hijos.length>0){const t=document.createElement("div");t.id="collapse-"+e.id,0==e.id?t.classList.add("show"):t.classList.add("collapse");const a=document.createElement("ul");a.classList.add("list-group","ms-3","mb-3"),e.hijos.forEach(e=>{const t=dibujarArbolCarpetas(e);a.appendChild(t)}),t.appendChild(a),i.appendChild(t);const o=i.querySelector("#boton"+e.id),n=i.querySelector("#carpeta"+e.id);o.addEventListener("click",()=>{if(o.childNodes[1].classList.contains("fa-chevron-down")){n.classList.add("contenedor-carpetas-permiso","px-3");let e=document.createElement("i");e.classList.add("fa-solid","fa-chevron-up","fa-xl"),o.replaceChild(e,o.childNodes[1])}else if(o.childNodes[1].classList.contains("fa-chevron-up")){n.classList.remove("contenedor-carpetas-permiso","px-3");let e=document.createElement("i");e.classList.add("fa-solid","fa-chevron-down","fa-xl"),o.replaceChild(e,o.childNodes[1])}})}return o}function generarCarpetas(e,t){let a=t.find(t=>t.id==e);if(null==a)var o={nombre:"BASE",id:"0",color:"#212529",hijos:[]};else o={nombre:a.seccion,id:a.id,color:a.color,hijos:[]};return t.filter(t=>t.idPadre==e).forEach(e=>{let a=generarCarpetas(e.id,t);o.hijos.push(a)}),o}