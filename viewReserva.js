import { obtenerToken } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const API_BASE = "http://localhost:8080";

  const breadcrumb = document.getElementById("breadcrumb-reserva");
  const tituloDetalle = document.getElementById("titulo-detalle");

  const infoId = document.getElementById("info-id");
  const infoUsuario = document.getElementById("info-usuario");
  const infoEmail = document.getElementById("info-email");
  const infoPista = document.getElementById("info-pista");
  const infoUbicacion = document.getElementById("info-ubicacion");
  const infoFecha = document.getElementById("info-fecha");
  const infoHora = document.getElementById("info-hora");
  const infoDuracion = document.getElementById("info-duracion");
  const infoCreada = document.getElementById("info-creada");
  const badgeEstadoLateral = document.getElementById("badge-estado-lateral");

  const inputFecha = document.getElementById("fecha");
  const inputHora = document.getElementById("hora");
  const inputDuracion = document.getElementById("duracion");
  const resumenCambio = document.getElementById("resumenCambio");

  const btnEliminar = document.querySelector(".danger-btn");
  const btnCancelar = document.querySelector(".secondary-btn");
  const btnGuardar = document.querySelector(".primary-btn");

  let reservaOriginal = null;
  let reservaIdURL = null;

  function obtenerIdDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function obtenerOrigenDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("origen");
  }

  function volverAListado() {
    const origen = obtenerOrigenDesdeURL();

    if (origen === "admin") {
      window.location.href = "adminReservas.html";
    } else {
      window.location.href = "reservas.html";
    }
  }

  function ocultarMenuSiAdmin() {
    const origen = obtenerOrigenDesdeURL();
    const menu = document.getElementById("menu-principal");

    if (origen === "admin" && menu) {
      menu.style.display = "none";
    }
  }

  function formatearFecha(fecha) {
    if (!fecha) return "";
    const partes = fecha.split("-");
    if (partes.length !== 3) return fecha;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function formatearHora(hora) {
    if (!hora) return "";
    return String(hora).substring(0, 5);
  }

  function formatearFechaHora(fechaHora) {
    if (!fechaHora) return "";

    const fecha = new Date(fechaHora);

    if (Number.isNaN(fecha.getTime())) {
      return fechaHora;
    }

    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const year = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, "0");
    const minuto = String(fecha.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${year} ${hora}:${minuto}`;
  }

  function textoEstadoDesdeReserva(reserva) {
    if (reserva.estado === "CONFIRMADA") return "Confirmada";
    if (reserva.estado === "CANCELADA") return "Cancelada";
    if (reserva.estado === "PASADA") return "Pasada";
    return reserva.estado || "";
  }

  function claseEstadoDesdeReserva(reserva) {
    if (reserva.estado === "CONFIRMADA") return "confirmada";
    if (reserva.estado === "CANCELADA") return "cancelada";
    if (reserva.estado === "PASADA") return "pasada";
    return "";
  }

  function obtenerNombreUsuario(reserva) {
    if (reserva.username && reserva.username.nombre) return reserva.username.nombre;
    if (reserva.username && reserva.username.name) return reserva.username.name;
    if (reserva.username && reserva.username.email) return reserva.username.email;
    return "Usuario";
  }

  function obtenerEmailUsuario(reserva) {
    if (reserva.username && reserva.username.email) return reserva.username.email;
    return "";
  }

  function pintarReservaEnPantalla(reserva) {
    const id = reserva.id || reserva.idReserva;
    const estadoTexto = textoEstadoDesdeReserva(reserva);
    const estadoClase = claseEstadoDesdeReserva(reserva);

    tituloDetalle.textContent = `Detalle de reserva #${id}`;
    breadcrumb.textContent = `Panel / Reservas / #${id}`;

    infoId.textContent = `#${id}`;
    infoUsuario.textContent = obtenerNombreUsuario(reserva);
    infoEmail.textContent = obtenerEmailUsuario(reserva);
    infoPista.textContent = reserva.pista ? reserva.pista.nombre : "Pista no disponible";
    infoUbicacion.textContent = reserva.pista ? reserva.pista.ubicacion : "";
    infoFecha.textContent = formatearFecha(reserva.date);
    infoHora.textContent = `${formatearHora(reserva.startTime)} - ${formatearHora(reserva.endTime)}`;
    infoDuracion.textContent = `${reserva.durationMins} minutos`;
    infoCreada.textContent = formatearFechaHora(reserva.createdAt);

    badgeEstadoLateral.textContent = estadoTexto;
    badgeEstadoLateral.className = `estado ${estadoClase}`;

    inputFecha.value = reserva.date || "";
    inputHora.value = formatearHora(reserva.startTime);
    inputDuracion.value = reserva.durationMins || "";

    if (reserva.estado === "CONFIRMADA") {
      btnEliminar.style.display = "";
      btnGuardar.style.display = "";
      inputFecha.disabled = false;
      inputHora.disabled = false;
      inputDuracion.disabled = false;
    }


    actualizarVistaPrevia();
  }

  function actualizarVistaPrevia() {
    if (!reservaOriginal) return;

    const fecha = inputFecha.value || reservaOriginal.date;
    const hora = inputHora.value || formatearHora(reservaOriginal.startTime);
    const duracion = inputDuracion.value || reservaOriginal.durationMins;

    resumenCambio.textContent = `${formatearFecha(fecha)} · ${hora} · ${duracion} minutos`;
  }

  async function cargarReserva() {
    const token = obtenerToken();

    if (!token) {
      alert("No has iniciado sesión");
      window.location.href = "login.html";
      return;
    }

    reservaIdURL = obtenerIdDesdeURL();

    if (!reservaIdURL) {
      alert("No se ha indicado el ID de la reserva en la URL");
      volverAListado();
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/pistaPadel/reservations/${encodeURIComponent(reservaIdURL)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo cargar la reserva");
      }

      const reserva = await response.json();
      reservaOriginal = reserva;

      pintarReservaEnPantalla(reserva);

    } catch (error) {
      console.error(error);
      alert("Error al cargar la reserva");
      volverAListado();
    }
  }

  function construirPayloadPatch() {
    return {
      date: inputFecha.value,
      startTime: inputHora.value,
      durationMins: Number(inputDuracion.value)
    };
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
        `${API_BASE}/pistaPadel/reservations/${encodeURIComponent(reservaIdURL)}`,
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
        if (response.status === 400) {
          alert("Los datos introducidos no son válidos");
          return;
        }

        if (response.status === 409) {
          alert("No se puede modificar la reserva. Puede que el horario esté ocupado o la reserva no sea modificable.");
          return;
        }

        if (response.status === 401 || response.status === 403) {
          alert("No tienes permiso para modificar esta reserva");
          return;
        }

        throw new Error("No se pudo actualizar la reserva");
      }

      volverAListado();

    } catch (error) {
      console.error(error);
      alert("Error al guardar los cambios");
    }
  }

  async function eliminarReserva() {
    const token = obtenerToken();

    if (!token) {
      alert("No has iniciado sesión");
      window.location.href = "login.html";
      return;
    }

    const confirmacion = confirm("¿Seguro que quieres cancelar esta reserva?");
    if (!confirmacion) return;

    try {
      const response = await fetch(
        `${API_BASE}/pistaPadel/reservations/${encodeURIComponent(reservaIdURL)}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          alert("No se puede cancelar esta reserva");
          return;
        }

        if (response.status === 401 || response.status === 403) {
          alert("No tienes permiso para cancelar esta reserva");
          return;
        }

        throw new Error("No se pudo cancelar la reserva");
      }

      const reservaCancelada = await response.json();

      localStorage.setItem("reservaCancelada", JSON.stringify(reservaCancelada));
      console.log("Reserva cancelada:", reservaCancelada);

      if (obtenerOrigenDesdeURL() === "admin") {
        window.location.href = "reservaCancelada.html?origen=admin";
      } else {
        window.location.href = "reservaCancelada.html";
      }

    } catch (error) {
      console.error(error);
      alert("Error al cancelar la reserva");
    }
  }

  inputFecha.addEventListener("input", actualizarVistaPrevia);
  inputHora.addEventListener("change", actualizarVistaPrevia);
  inputDuracion.addEventListener("change", actualizarVistaPrevia);

  btnGuardar.addEventListener("click", guardarCambios);
  btnEliminar.addEventListener("click", eliminarReserva);
  btnCancelar.addEventListener("click", volverAListado);

  ocultarMenuSiAdmin();
  cargarReserva();
});