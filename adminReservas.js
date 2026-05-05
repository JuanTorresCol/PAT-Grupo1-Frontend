import { comprobarAdmin, obtenerToken } from "./auth.js";

const API_BASE = "http://localhost:8080";

const estadoGlobal = {
    reservasOriginales: [],
    reservasFiltradas: [],
    paginaActual: 1,
    reservasPorPagina: 6
};

document.addEventListener("DOMContentLoaded", async () => {
    const esAdmin = comprobarAdmin();

    if (!esAdmin) {
        alert("No tienes permisos de administrador");
        window.location.href = "login.html";
        return;
    }

    const token = obtenerToken();

    if (!token) {
        alert("No has iniciado sesión");
        window.location.href = "login.html";
        return;
    }

    inicializarEventos();
    await cargarReservas(token);
});

function inicializarEventos() {
    const inputBusqueda = document.querySelector(".reservas-filtros input");
    const botonBuscar = document.querySelector(".buscar-btn");
    const botonAnterior = document.getElementById("btn-anterior");
    const botonSiguiente = document.getElementById("btn-siguiente");

    if (botonBuscar) {
        botonBuscar.addEventListener("click", aplicarBusqueda);
    }

    if (inputBusqueda) {
        inputBusqueda.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                aplicarBusqueda();
            }
        });

        inputBusqueda.addEventListener("input", () => {
            if (inputBusqueda.value.trim() === "") {
                limpiarBusqueda();
            }
        });
    }

    if (botonAnterior) {
        botonAnterior.addEventListener("click", () => {
            if (estadoGlobal.paginaActual > 1) {
                estadoGlobal.paginaActual--;
                renderizarTabla();
            }
        });
    }

    if (botonSiguiente) {
        botonSiguiente.addEventListener("click", () => {
            const totalPaginas = obtenerTotalPaginas();
            if (estadoGlobal.paginaActual < totalPaginas) {
                estadoGlobal.paginaActual++;
                renderizarTabla();
            }
        });
    }
}

async function cargarReservas(token) {
    try {
        const response = await fetch(`${API_BASE}/pistaPadel/admin/reservations`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert("No autorizado. Inicia sesión de nuevo.");
                window.location.href = "login.html";
                return;
            }

            throw new Error(`Error al cargar reservas: ${response.status}`);
        }

        const reservas = await response.json();

        if (!Array.isArray(reservas)) {
            throw new Error("La respuesta del servidor no es una lista de reservas");
        }

        estadoGlobal.reservasOriginales = reservas.map((reserva) => normalizarReserva(reserva));
        estadoGlobal.reservasFiltradas = [...estadoGlobal.reservasOriginales];
        estadoGlobal.paginaActual = 1;

        renderizarTabla();

    } catch (error) {
        console.error("Error cargando reservas:", error);
        mostrarFilaMensaje("No se han podido cargar las reservas.");
    }
}

function normalizarReserva(reserva) {
    return {
        id: obtenerIdReserva(reserva),
        usuario: obtenerEmailUsuario(reserva),
        nombreUsuario: obtenerNombreUsuario(reserva),
        nombrePista: obtenerNombrePista(reserva),
        fecha: reserva.date,
        horaInicio: reserva.startTime,
        horaFin: reserva.endTime,
        duracion: reserva.durationMins,
        estado: reserva.estado,
        reservaOriginal: reserva
    };
}

function obtenerIdReserva(reserva) {
    if (reserva.id !== undefined && reserva.id !== null) {
        return String(reserva.id);
    }

    if (reserva.idReserva !== undefined && reserva.idReserva !== null) {
        return String(reserva.idReserva);
    }

    return "";
}

function obtenerNombreUsuario(reserva) {
    if (reserva.username && reserva.username.nombre) {
        return reserva.username.nombre;
    }

    if (reserva.username && reserva.username.name) {
        return reserva.username.name;
    }

    if (reserva.username && reserva.username.email) {
        return reserva.username.email;
    }

    return "Usuario";
}

function obtenerEmailUsuario(reserva) {
    if (reserva.username && reserva.username.email) {
        return reserva.username.email;
    }

    return "";
}

function obtenerNombrePista(reserva) {
    if (reserva.pista && reserva.pista.nombre) {
        return reserva.pista.nombre;
    }

    return "Pista no disponible";
}

function aplicarBusqueda() {
    const inputBusqueda = document.querySelector(".reservas-filtros input");
    const valor = inputBusqueda.value.trim().toLowerCase();

    if (!valor) {
        limpiarBusqueda();
        return;
    }

    estadoGlobal.reservasFiltradas = estadoGlobal.reservasOriginales.filter((reserva) => {
        return (
            String(reserva.id).toLowerCase().includes(valor) ||
            reserva.usuario.toLowerCase().includes(valor) ||
            reserva.nombreUsuario.toLowerCase().includes(valor) ||
            reserva.nombrePista.toLowerCase().includes(valor)

        );
    });

    estadoGlobal.paginaActual = 1;
    renderizarTabla();
}

function limpiarBusqueda() {
    estadoGlobal.reservasFiltradas = [...estadoGlobal.reservasOriginales];
    estadoGlobal.paginaActual = 1;
    renderizarTabla();
}

function renderizarTabla() {
    const tbody = document.getElementById("tabla-reservas");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (estadoGlobal.reservasFiltradas.length === 0) {
        mostrarFilaMensaje("No se han encontrado reservas.");
        actualizarPaginacion();
        return;
    }

    const inicio = (estadoGlobal.paginaActual - 1) * estadoGlobal.reservasPorPagina;
    const fin = inicio + estadoGlobal.reservasPorPagina;
    const reservasPagina = estadoGlobal.reservasFiltradas.slice(inicio, fin);

    reservasPagina.forEach((reserva) => {
        const fila = document.createElement("tr");
        fila.style.cursor = "pointer";

        fila.addEventListener("click", () => {
            localStorage.setItem("reservaSeleccionada", JSON.stringify(reserva.reservaOriginal));
            window.location.href = `viewReserva.html?id=${encodeURIComponent(reserva.id)}&origen=admin`;
        });

        fila.innerHTML = `
            <td><strong>#${escapeHTML(reserva.id)}</strong></td>
            <td>
                <strong>${escapeHTML(reserva.nombreUsuario)}</strong><br>
                <span>${escapeHTML(reserva.usuario)}</span>
            </td>
            <td>${escapeHTML(reserva.nombrePista)}</td>
            <td>${formatearFecha(reserva.fecha)}</td>
            <td>${formatearHora(reserva.horaInicio)} - ${formatearHora(reserva.horaFin)}</td>
            <td>${escapeHTML(reserva.duracion)} min</td>
            <td>
                <span class="gestion-pistas-estado ${obtenerClaseEstado(reserva.estado)}">
                    ${formatearEstado(reserva.estado)}
                </span>
            </td>
        `;

        tbody.appendChild(fila);
    });

    actualizarPaginacion();
}

function mostrarFilaMensaje(mensaje) {
    const tbody = document.getElementById("tabla-reservas");
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 20px;">
                ${escapeHTML(mensaje)}
            </td>
        </tr>
    `;
}

function actualizarPaginacion() {
    const spanPagina = document.getElementById("pagina-actual");
    const botonAnterior = document.getElementById("btn-anterior");
    const botonSiguiente = document.getElementById("btn-siguiente");

    const totalPaginas = obtenerTotalPaginas();

    if (spanPagina) {
        spanPagina.textContent = String(estadoGlobal.paginaActual);
    }

    if (botonAnterior) {
        botonAnterior.disabled = estadoGlobal.paginaActual === 1;
    }

    if (botonSiguiente) {
        botonSiguiente.disabled = estadoGlobal.paginaActual >= totalPaginas;
    }
}

function obtenerTotalPaginas() {
    return Math.max(1, Math.ceil(estadoGlobal.reservasFiltradas.length / estadoGlobal.reservasPorPagina));
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

function formatearEstado(estado) {
    if (estado === "CONFIRMADA") return "Confirmada";
    if (estado === "CANCELADA") return "Cancelada";
    if (estado === "PASADA") return "Pasada";
    return estado;
}

function obtenerClaseEstado(estado) {
    if (estado === "CONFIRMADA") return "confirmada";
    if (estado === "CANCELADA") return "cancelada";
    if (estado === "PASADA") return "pasada";
    return "";
}

function escapeHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}