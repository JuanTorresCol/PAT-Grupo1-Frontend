import { obtenerToken } from "./auth.js";

const API_BASE = "http://localhost:8080";

/*
  AJUSTA ESTAS DOS RUTAS si en tu backend están expuestas con otra URL exacta.
  Aquí las dejo separadas para que solo tengas que tocar esto.
*/
const ENDPOINT_DETALLE = `${API_BASE}/pistaPadel/courts`;
const ENDPOINT_DISPONIBILIDAD = `${API_BASE}/pistaPadel/availability`;

const HORA_INICIO = 8;   // 08:00
const HORA_FIN = 22;     // 22:00
const MINUTOS_TRAMO = 30;

const estado = {
  nombrePista: null,
  pista: null,
  disponibilidad: [],
  duracionMinutos: 30,
  precioHora: 0,
  slotInicioSeleccionado: null
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = obtenerToken();

    if (!token) {
      alert("No has iniciado sesión");
      window.location.href = "login.html";
      return;
    }

    const nombrePista = obtenerNombrePistaDesdeURL();

    if (!nombrePista) {
      alert("No se ha indicado la pista");
      window.location.href = "pistas.html";
      return;
    }

    estado.nombrePista = nombrePista;

    inicializarFechaPorDefecto();
    registrarEventosBase();

    await cargarDetallePista(token);
    actualizarPreciosDuracion();
    actualizarResumen();

    await cargarDisponibilidad(token);
  } catch (error) {
    console.error(error);
    alert(error.message || "Ha ocurrido un error al cargar la pista");
  }
});

function obtenerNombrePistaDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("nombre");
}

function inicializarFechaPorDefecto() {
  const inputFecha = document.getElementById("fecha");
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const fechaHoy = `${yyyy}-${mm}-${dd}`;

  inputFecha.value = fechaHoy;
  inputFecha.min = fechaHoy;
}

function registrarEventosBase() {
  const inputFecha = document.getElementById("fecha");
  const durationButtons = document.querySelectorAll(".duration");
  const botonConfirmar = document.getElementById("botonConfirmar");

  inputFecha.addEventListener("change", async () => {
    const token = obtenerToken();

    if (!token) {
      alert("No has iniciado sesión");
      window.location.href = "login.html";
      return;
    }

    estado.slotInicioSeleccionado = null;
    actualizarResumen();
    await cargarDisponibilidad(token);
  });

  durationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      durationButtons.forEach((btn) => btn.classList.remove("active-duration"));
      button.classList.add("active-duration");

      estado.duracionMinutos = Number(button.dataset.minutes);

      /*
        Si al cambiar duración la selección actual deja de ser válida,
        la quitamos. Si sigue siendo válida, la mantenemos.
      */
      if (
        estado.slotInicioSeleccionado !== null &&
        !esSeleccionValida(estado.slotInicioSeleccionado, estado.duracionMinutos)
      ) {
        estado.slotInicioSeleccionado = null;
      }

      renderizarGrid();
      actualizarResumen();
    });
  });

  botonConfirmar.addEventListener("click", (event) => {
    if (estado.slotInicioSeleccionado === null) {
      event.preventDefault();
      alert("Selecciona una hora de inicio antes de confirmar la reserva");
      return;
    }

    const params = new URLSearchParams({
      nombre: estado.nombrePista,
      fecha: document.getElementById("fecha").value,
      inicio: convertirIndiceATextoHora(estado.slotInicioSeleccionado),
      duracion: String(estado.duracionMinutos)
    });

    botonConfirmar.href = `reservaConfirmada.html?${params.toString()}`;
  });
}

async function cargarDetallePista(token) {
  const url = new URL(ENDPOINT_DETALLE);
  url.searchParams.append("nombre", estado.nombrePista);

  const response = await fetch(
        `${API_BASE}/pistaPadel/courts/${encodeURIComponent(estado.nombrePista)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Pista no encontrada");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("No autorizado. Inicia sesión de nuevo.");
    }
    throw new Error(`Error al cargar detalle de pista: ${response.status}`);
  }

  const pista = await response.json();
  estado.pista = pista;
  estado.precioHora = Number(pista.precioHora) || 0;
  console.log(estado.pista);

  pintarDetallePista(pista);
}

function pintarDetallePista(pista) {
  document.getElementById("info-nombre").textContent = pista.nombre || "";
  document.getElementById("info-ubicacion").textContent = pista.ubicacion || "";
  document.getElementById("info-precio").textContent = formatearPrecio(pista.precioHora);

  document.getElementById("resumenPista").textContent = pista.nombre || "";

  actualizarPreciosDuracion();
  actualizarResumen();
}

async function cargarDisponibilidad(token) {
  const fecha = document.getElementById("fecha").value;

  if (!fecha) {
    return;
  }

  const url = new URL(ENDPOINT_DISPONIBILIDAD);
  url.searchParams.append("date", fecha);
  url.searchParams.append("nombre", estado.nombrePista);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("No puedes buscar reservas de días pasados");
    }
    if (response.status === 404) {
      throw new Error("No existen pistas con ese nombre");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("No autorizado. Inicia sesión de nuevo.");
    }
    throw new Error(`Error al cargar disponibilidad: ${response.status}`);
  }

  const disponibilidad = [];
  for(let i = HORA_INICIO; i < HORA_FIN*2-7; i += 1) {
    disponibilidad.push(true);
  }

  if (!Array.isArray(disponibilidad)) {
    throw new Error("La disponibilidad recibida no tiene un formato válido");
  }

  estado.disponibilidad = disponibilidad;
  estado.slotInicioSeleccionado = null;

  renderizarGrid();
  actualizarResumen();
}

function renderizarGrid() {
  const timeGrid = document.getElementById("timeGrid");
  timeGrid.innerHTML = "";

  for (let i = 0; i < estado.disponibilidad.length; i += 1) {
    const disponible = estado.disponibilidad[i];
    const button = document.createElement("button");

    button.type = "button";
    button.className = "slot";
    button.textContent = convertirIndiceATextoHora(i);
    button.dataset.index = String(i);

    if (!disponible) {
      button.classList.add("occupied-slot");
      button.disabled = true;
    } else {
      button.classList.add("available-slot");

      if (!puedeEmpezarReservaEn(i, estado.duracionMinutos)) {
        button.classList.add("invalid-start-slot");
      }

      if (estado.slotInicioSeleccionado !== null) {
        const totalSlots = estado.duracionMinutos / MINUTOS_TRAMO;
        const inicio = estado.slotInicioSeleccionado;
        const finExclusivo = inicio + totalSlots;

        if (i === inicio) {
          button.classList.add("selected-slot");
        } else if (i > inicio && i < finExclusivo) {
          button.classList.add("selected-range");
        }
      }

      button.addEventListener("click", () => manejarClickSlot(i));
    }

    timeGrid.appendChild(button);
  }

  actualizarCajaSeleccion();
}

function manejarClickSlot(indice) {
  if (!puedeEmpezarReservaEn(indice, estado.duracionMinutos)) {
    alert("No puedes iniciar una reserva aquí con la duración seleccionada");
    return;
  }

  estado.slotInicioSeleccionado = indice;
  renderizarGrid();
  actualizarResumen();
}

function puedeEmpezarReservaEn(indiceInicio, duracionMinutos) {
  const slotsNecesarios = duracionMinutos / MINUTOS_TRAMO;

  if (indiceInicio < 0) {
    return false;
  }

  if (indiceInicio + slotsNecesarios > estado.disponibilidad.length) {
    return false;
  }

  for (let i = indiceInicio; i < indiceInicio + slotsNecesarios; i += 1) {
    if (!estado.disponibilidad[i]) {
      return false;
    }
  }

  return true;
}

function esSeleccionValida(indiceInicio, duracionMinutos) {
  return puedeEmpezarReservaEn(indiceInicio, duracionMinutos);
}

function actualizarCajaSeleccion() {
  const selectionText = document.getElementById("selectionText");
  const selectedHours = document.getElementById("selectedHours");
  const noteText = document.getElementById("noteText");

  selectedHours.innerHTML = "";

  if (estado.slotInicioSeleccionado === null) {
    selectionText.innerHTML = "<strong>Tu selección:</strong> todavía no has elegido una hora de inicio";
    noteText.textContent = `Selecciona una hora disponible para una reserva de ${estado.duracionMinutos} minutos.`;
    return;
  }

  const inicioTexto = convertirIndiceATextoHora(estado.slotInicioSeleccionado);
  const finTexto = calcularHoraFinTexto(estado.slotInicioSeleccionado, estado.duracionMinutos);

  selectionText.innerHTML = `<strong>Tu selección:</strong> inicio ${inicioTexto} · duración ${estado.duracionMinutos} min · fin ${finTexto}`;

  const slotsNecesarios = estado.duracionMinutos / MINUTOS_TRAMO;

  for (let i = 0; i < slotsNecesarios; i += 1) {
    const span = document.createElement("span");
    span.textContent = convertirIndiceATextoHora(estado.slotInicioSeleccionado + i);
    selectedHours.appendChild(span);
  }

  const spanFin = document.createElement("span");
  spanFin.textContent = `→ ${finTexto}`;
  selectedHours.appendChild(spanFin);

  noteText.textContent = "Las franjas ocupadas no se pueden seleccionar.";
}

function actualizarPreciosDuracion() {
  document.getElementById("precio30").textContent = formatearPrecio(calcularPrecio(30));
  document.getElementById("precio60").textContent = formatearPrecio(calcularPrecio(60));
  document.getElementById("precio90").textContent = formatearPrecio(calcularPrecio(90));
  document.getElementById("precio120").textContent = formatearPrecio(calcularPrecio(120));
}

function actualizarResumen() {
  const fecha = document.getElementById("fecha").value;

  document.getElementById("resumenFecha").textContent = fecha
    ? formatearFechaLarga(fecha)
    : "-";

  document.getElementById("resumenDuracion").textContent = `${estado.duracionMinutos} minutos`;
  document.getElementById("resumenPrecio").textContent = formatearPrecio(calcularPrecio(estado.duracionMinutos));

  if (estado.slotInicioSeleccionado === null) {
    document.getElementById("resumenInicio").textContent = "-";
    document.getElementById("resumenFin").textContent = "-";
    actualizarCajaSeleccion();
    return;
  }

  document.getElementById("resumenInicio").textContent =
    convertirIndiceATextoHora(estado.slotInicioSeleccionado);

  document.getElementById("resumenFin").textContent =
    calcularHoraFinTexto(estado.slotInicioSeleccionado, estado.duracionMinutos);

  actualizarCajaSeleccion();
}

function calcularPrecio(duracionMinutos) {
  return (estado.precioHora * duracionMinutos) / 60;
}

function convertirIndiceATextoHora(indice) {
  const minutosTotales = (HORA_INICIO * 60) + (indice * MINUTOS_TRAMO);
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

function calcularHoraFinTexto(indiceInicio, duracionMinutos) {
  const minutosInicio = (HORA_INICIO * 60) + (indiceInicio * MINUTOS_TRAMO);
  const minutosFin = minutosInicio + duracionMinutos;

  const horas = Math.floor(minutosFin / 60);
  const minutos = minutosFin % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

function formatearPrecio(precio) {
  const numero = Number(precio) || 0;
  return `${numero.toFixed(2).replace(".", ",")} €`;
}

function formatearFechaLarga(fechaISO) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  return fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}