import { comprobarAdmin, obtenerToken } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const infoNombre = document.getElementById("info-nombre");
  const infoUbicacion = document.getElementById("info-ubicacion");
  const infoPrecio = document.getElementById("info-precio");
  const infoTitulo = document.getElementById("info-nombre-titulo");
    
  function pintarPistaEnPantalla() {
      infoNombre.textContent = localStorage.getItem("nombrePista");
      infoUbicacion.textContent = localStorage.getItem("ubicacion");
      infoTitulo.textContent = localStorage.getItem("nombrePista");
  }

  function formatearPrecio(precio) {
    if (precio === null || precio === undefined || precio === "") return "";
    const numero = Number(precio);
    if (Number.isNaN(numero)) return precio;
    return `${numero.toFixed(2).replace(".", ",")} €`;
  }

  pintarPistaEnPantalla();
  
});

