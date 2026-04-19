import { comprobarAdmin, obtenerToken } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const esAdmin = comprobarAdmin();
  if (!esAdmin) {
        alert("No tienes permisos de administrador");
        window.location.href = "login.html";
        return;
    }

  const API_BASE = "http://localhost:8080";

  const breadcrumb = document.getElementById("breadcrumb-pista");
  const tituloDetalle = document.getElementById("titulo-detalle");

  const infoNombre = document.getElementById("info-nombre");
  const infoUbicacion = document.getElementById("info-ubicacion");
  const infoPrecio = document.getElementById("info-precio");
  const badgeEstadoSuperior = document.getElementById("badge-estado-superior");
  const badgeEstadoLateral = document.getElementById("badge-estado-lateral");

  const inputNombre = document.getElementById("nombre");
  const inputUbicacion = document.getElementById("ubicacion");
  const inputPrecio = document.getElementById("precio");
  const inputDescripcion = document.getElementById("descripcion");
  const selectEstado = document.getElementById("estado");

  const btnEliminar = document.querySelector(".danger-btn");
  const btnCancelar = document.querySelector(".secondary-btn");
  const btnGuardar = document.querySelector(".primary-btn");

  let pistaOriginal = null;
  let nombrePistaURL = null;

  function obtenerNombreDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("nombre");
  }

  function formatearPrecio(precio) {
    if (precio === null || precio === undefined || precio === "") return "";
    const numero = Number(precio);
    if (Number.isNaN(numero)) return precio;
    return `${numero.toFixed(2).replace(".", ",")} €`;
  }

  function parsearPrecio(valor) {
    if (!valor || !valor.trim()) return null;

    const limpio = valor
      .replace("€", "")
      .replace(/\s/g, "")
      .replace(",", ".");

    const numero = parseFloat(limpio);
    return Number.isNaN(numero) ? null : numero;
  }

  function textoEstadoDesdePista(pista) {
    if (typeof pista.activa === "boolean") {
      return pista.activa ? "Activa" : "Inactiva";
    }

    if (typeof pista.estado === "string") {
      return pista.estado.toLowerCase().includes("inactiva")
        ? "Inactiva"
        : "Activa";
    }

    return "Activa";
  }

  function pintarPistaEnPantalla(pista) {
    const estadoTexto = textoEstadoDesdePista(pista);

    // Título superior
    tituloDetalle.textContent = pista.nombre || "Detalle de pista";
    breadcrumb.textContent = `Panel / Pistas / ${pista.nombre || "Pista"}`;

    // Columna izquierda
    infoNombre.textContent = pista.nombre || "";
    infoUbicacion.textContent = pista.ubicacion || "";
    infoPrecio.textContent = formatearPrecio(pista.precio);
    badgeEstadoSuperior.textContent = estadoTexto;
    badgeEstadoLateral.textContent = estadoTexto;

    // Columna derecha
    inputNombre.value = pista.nombre || "";
    inputUbicacion.value = pista.ubicacion || "";
    inputPrecio.value = pista.precio !== undefined && pista.precio !== null
      ? formatearPrecio(pista.precio)
      : "";
    inputDescripcion.value = pista.descripcion || "";
    selectEstado.value = estadoTexto;
  }

  function actualizarVistaPrevia() {
    const nombre = inputNombre.value.trim() || pistaOriginal?.nombre || "";
    const ubicacion = inputUbicacion.value.trim() || pistaOriginal?.ubicacion || "";
    const precio = inputPrecio.value.trim()
      ? formatearPrecio(parsearPrecio(inputPrecio.value.trim()) ?? inputPrecio.value.trim())
      : formatearPrecio(pistaOriginal?.precio);
    const estado = selectEstado.value || textoEstadoDesdePista(pistaOriginal);

    tituloDetalle.textContent = nombre || "Detalle de pista";
    breadcrumb.textContent = `Panel / Pistas / ${nombre || "Pista"}`;

    infoNombre.textContent = nombre;
    infoUbicacion.textContent = ubicacion;
    infoPrecio.textContent = precio;
    badgeEstadoSuperior.textContent = estado;
    badgeEstadoLateral.textContent = estado;
  }

  async function cargarPista() {
    const token = obtenerToken();

    if (!token) {
      alert("No has iniciado sesión");
      window.location.href = "login.html";
      return;
    }

    nombrePistaURL = obtenerNombreDesdeURL();

    if (!nombrePistaURL) {
      alert("No se ha indicado el nombre de la pista en la URL");
      window.location.href = "adminPistas.html";
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/pistaPadel/courts/${encodeURIComponent(nombrePistaURL)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo cargar la pista");
      }

      const pista = await response.json();
      pistaOriginal = pista;

      pintarPistaEnPantalla(pista);
    } catch (error) {
      console.error(error);
      alert("Error al cargar la pista");
      window.location.href = "adminPistas.html";
    }
  }

  function construirPayloadPatch() {
    const payload = {};

    const nombre = inputNombre.value.trim();
    const ubicacion = inputUbicacion.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const precio = parsearPrecio(inputPrecio.value.trim());
    const estado = selectEstado.value;

    if (nombre !== "") payload.nombre = nombre;
    if (ubicacion !== "") payload.ubicacion = ubicacion;
    if (precio !== null) payload.precio = precio;

    payload.activa = estado === "Activa";

    return payload;
  }

  async function guardarCambios() {
    const token = obtenerToken();

    if (!token) {
      alert("No has iniciado sesión");
      window.location.href = "login.html";
      return;
    }

    const payload = construirPayloadPatch();

    try {
      const response = await fetch(
        `${API_BASE}/pistaPadel/courts/${encodeURIComponent(nombrePistaURL)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "No se pudo actualizar la pista");
      }

      window.location.href = "adminPistas.html";
    } catch (error) {
      console.error(error);
      alert("Error al guardar los cambios");
    }
  }

  async function eliminarPista() {
    const token = obtenerToken();

    if (!token) {
      alert("No has iniciado sesión");
      window.location.href = "login.html";
      return;
    }

    const confirmacion = confirm("¿Seguro que quieres eliminar esta pista?");
    if (!confirmacion) return;

    try {
      const response = await fetch(
        `${API_BASE}/pistaPadel/courts/${encodeURIComponent(nombrePistaURL)}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "No se pudo eliminar la pista");
      }
      localStorage.setItem("nombrePista", pistaOriginal.nombre);
      localStorage.setItem("ubicacion", pistaOriginal.ubicacion);

      window.location.href = "pistaEliminada.html";
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la pista");
    }
  }

  inputNombre.addEventListener("input", actualizarVistaPrevia);
  inputUbicacion.addEventListener("input", actualizarVistaPrevia);
  inputPrecio.addEventListener("input", actualizarVistaPrevia);
  inputDescripcion.addEventListener("input", actualizarVistaPrevia);
  selectEstado.addEventListener("change", actualizarVistaPrevia);

  btnGuardar.addEventListener("click", guardarCambios);
  btnEliminar.addEventListener("click", eliminarPista);
  btnCancelar.addEventListener("click", () => {
    window.location.href = "adminPistas.html";
  });
  cargarPista();
});