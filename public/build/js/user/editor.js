const URL_BASE="http://localhost/gdagmcp",token=JSON.parse(localStorage.getItem("token")),CARPETA_BASE="/base";async function iniciarApp(){const e=window.location.search;var t=new URLSearchParams(e).get("id");dibujarCarpeta(t)}function alertas(){const e=document.querySelectorAll(".alert"),t=document.getElementById("alertas"),n=document.querySelector("#alertaTipo");e&&setTimeout(()=>{e.forEach((function(e){e.remove(),t&&(t.innerHTML=""),n&&(n.innerHTML="")}))},3e3)}document.addEventListener("DOMContentLoaded",iniciarApp());