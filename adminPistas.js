import { comprobarAdmin, obtenerToken } from "./auth.js";

const API_BASE = "http://localhost:8080";

const estadoGlobal = {
    pistasOriginales: [],
    pistasFiltradas: [],
    paginaActual: 1,
    pistasPorPagina: 5
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

    inicializarEventos(token);
    await cargarPistas(token);
});

function inicializarEventos(token) {
    const inputBusqueda = document.querySelector(".reservas-filtros input");
    const botonBuscar = document.querySelector(".buscar-btn");
    const botonAnterior = document.getElementById("btn-anterior");
    const botonSiguiente = document.getElementById("btn-siguiente");

    if (botonBuscar) {
        botonBuscar.addEventListener("click", () => {
            aplicarBusqueda();
        });
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

async function cargarPistas(token, filtro = null) {
    try {
        const url = new URL(`${API_BASE}/pistaPadel/courts`);

        if (filtro !== null) {
            url.searchParams.append("filtro", filtro);
        }

        const response = await fetch(url.toString(), {
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

            throw new Error(`Error al cargar pistas: ${response.status}`);
        }

        const pistas = await response.json();

        if (!Array.isArray(pistas)) {
            throw new Error("La respuesta del servidor no es una lista de pistas");
        }

        estadoGlobal.pistasOriginales = pistas.map((pista, index) => normalizarPista(pista, index));
        estadoGlobal.pistasFiltradas = [...estadoGlobal.pistasOriginales];
        estadoGlobal.paginaActual = 1;

        renderizarTabla();
    } catch (error) {
        console.error("Error cargando pistas:", error);
        mostrarFilaMensaje("No se han podido cargar las pistas.");
    }
}

function normalizarPista(pista, index) {
    return {
        id: obtenerIdPista(pista, index),
        nombre: pista.nombre ?? `Pista ${index + 1}`,
        ubicacion: pista.ubicacion ?? "Ubicación no disponible",
        precioHora: pista.precioHora ?? 0,
        activa: obtenerEstadoActivo(pista),
        imagen: obtenerImagenAleatoria()
    };
}

function obtenerIdPista(pista, index) {
    if (pista.id !== undefined && pista.id !== null) {
        return String(pista.id);
    }

    const match = String(pista.nombre ?? "").match(/\d+/);
    if (match) {
        return match[0];
    }

    return String(index + 1);
}

function obtenerEstadoActivo(pista) {
    if (typeof pista.activa === "boolean") {
        return pista.activa;
    }

    if (typeof pista.estado === "string") {
        return pista.estado.toLowerCase() === "activa";
    }

    if (typeof pista.estado === "boolean") {
        return pista.estado;
    }

    return true;
}

function obtenerImagenAleatoria() {
    const numero = Math.floor(Math.random() * 6) + 1;
    return `assets/img/pistaPadel${numero}.webp`;
}

function aplicarBusqueda() {
    const inputBusqueda = document.querySelector(".reservas-filtros input");
    const valor = inputBusqueda?.value.trim().toLowerCase() ?? "";

    if (!valor) {
        limpiarBusqueda();
        return;
    }

    estadoGlobal.pistasFiltradas = estadoGlobal.pistasOriginales.filter((pista) => {
        return (
            String(pista.id).toLowerCase().includes(valor) ||
            pista.nombre.toLowerCase().includes(valor)
        );
    });

    estadoGlobal.paginaActual = 1;
    renderizarTabla();
}

function limpiarBusqueda() {
    estadoGlobal.pistasFiltradas = [...estadoGlobal.pistasOriginales];
    estadoGlobal.paginaActual = 1;
    renderizarTabla();
}

function renderizarTabla() {
    const tbody = document.getElementById("tabla-pistas");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (estadoGlobal.pistasFiltradas.length === 0) {
        mostrarFilaMensaje("No se han encontrado pistas.");
        actualizarPaginacion();
        return;
    }

    const inicio = (estadoGlobal.paginaActual - 1) * estadoGlobal.pistasPorPagina;
    const fin = inicio + estadoGlobal.pistasPorPagina;
    const pistasPagina = estadoGlobal.pistasFiltradas.slice(inicio, fin);

    pistasPagina.forEach((pista) => {
        const fila = document.createElement("tr");
        fila.style.cursor = "pointer";

        fila.addEventListener("click", () => {
            window.location.href = `adminviewPista.html?nombre=${encodeURIComponent(pista.nombre)}`;
        });

        fila.innerHTML = `
            <td class="gestion-pistas-info">
                <img src="${pista.imagen}" alt="${escapeHTML(pista.nombre)}" class="gestion-pistas-img">
                <div class="gestion-pistas-texto">
                    <strong>${escapeHTML(pista.nombre)}</strong>
                    <span class="gestion-pistas-badge">#${escapeHTML(pista.id)}</span>
                </div>
            </td>
            <td>${escapeHTML(pista.ubicacion)}</td>
            <td>${formatearPrecio(pista.precioHora)}</td>
            <td>
                <span class="gestion-pistas-estado ${pista.activa ? "gestion-pistas-activa" : "gestion-pistas-inactiva"}">
                    ${pista.activa ? "Activa" : "Inactiva"}
                </span>
            </td>
        `;
        console.log(pista.precioHora);
        tbody.appendChild(fila);
    });

    actualizarPaginacion();
}

function mostrarFilaMensaje(mensaje) {
    const tbody = document.getElementById("tabla-pistas");
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="4" style="text-align: center; padding: 20px;">
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
    return Math.max(1, Math.ceil(estadoGlobal.pistasFiltradas.length / estadoGlobal.pistasPorPagina));
}

function formatearPrecio(precio) {
    return `${Number(precio).toFixed(2).replace(".", ",")} €`;
}

function escapeHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}