import { obtenerToken } from "./auth.js";

const API_BASE = "http://localhost:8080";

const estadoGlobal = {
    pistasOriginales: [],
    pistasFiltradas: [],
    disponibilidadPorPista: {}
};

document.addEventListener("DOMContentLoaded", async () => {
    const token = obtenerToken();

    if (!token) {
        alert("No has iniciado sesión");
        window.location.href = "login.html";
        return;
    }

    configurarBuscador();
    establecerFechaMinimaHoy();

    await cargarPistas(token);
});

function configurarBuscador() {
    const botonBuscar = document.querySelector(".buscar-btn");

    if (!botonBuscar) return;

    botonBuscar.addEventListener("click", async () => {
        const token = obtenerToken();

        if (!token) {
            alert("No has iniciado sesión");
            window.location.href = "login.html";
            return;
        }

        await buscarDisponibilidad(token);
    });
}

function establecerFechaMinimaHoy() {
    const inputFecha = document.getElementById("fecha");
    if (!inputFecha) return;

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");

    inputFecha.min = `${yyyy}-${mm}-${dd}`;
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

        renderizarTabla(estadoGlobal.pistasFiltradas);
    } catch (error) {
        console.error("Error cargando pistas:", error);
        alert("No se pudieron cargar las pistas.");
    }
}

async function buscarDisponibilidad(token) {
    const inputFecha = document.getElementById("fecha");
    const selectHora = document.getElementById("hora");

    const fecha = inputFecha?.value?.trim();
    const horaSeleccionada = selectHora?.value?.trim();

    if (!fecha) {
        alert("Debes seleccionar una fecha para buscar.");
        return;
    }

    try {
        const url = new URL(`${API_BASE}/pistaPadel/availability`);
        url.searchParams.append("date", fecha);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 400) {
                const mensaje = await leerMensajeError(response);
                throw new Error(mensaje || "Fecha no válida");
            }

            if (response.status === 401 || response.status === 403) {
                alert("No autorizado. Inicia sesión de nuevo.");
                window.location.href = "login.html";
                return;
            }

            if (response.status === 404) {
                const mensaje = await leerMensajeError(response);
                throw new Error(mensaje || "No se encontraron pistas");
            }

            throw new Error(`Error al buscar disponibilidad: ${response.status}`);
        }

        const disponibilidad = await response.json();
        estadoGlobal.disponibilidadPorPista = disponibilidad;

        const indiceHora = convertirHoraAIndice(horaSeleccionada);

        const resultado = estadoGlobal.pistasOriginales.filter((pista) => {
            if (!pista.activa) return false;

            const franjas = disponibilidad[String(pista.id)] ?? disponibilidad[pista.id];

            if (!Array.isArray(franjas)) {
                return false;
            }

            // Si no se selecciona hora, mostramos todas las pistas que tengan
            // al menos una franja disponible ese día.
            if (indiceHora === null) {
                return franjas.some((ocupada) => ocupada === false);
            }

            // En tu backend false = disponible, true = ocupada
            return franjas[indiceHora] === false;
        });

        estadoGlobal.pistasFiltradas = resultado;
        renderizarTabla(resultado, indiceHora);

        if (resultado.length === 0) {
            alert("No hay pistas disponibles con los filtros seleccionados.");
        }
    } catch (error) {
        console.error("Error buscando disponibilidad:", error);
        alert(error.message || "No se pudo realizar la búsqueda.");
    }
}

async function leerMensajeError(response) {
    try {
        const data = await response.json();
        return data.message || data.error || data.descripcion || "";
    } catch {
        try {
            return await response.text();
        } catch {
            return "";
        }
    }
}

function normalizarPista(pista, index) {
    return {
        id: pista.idPista ?? pista.id ?? index + 1,
        nombre: pista.nombre ?? `Pista ${index + 1}`,
        ubicacion: pista.ubicacion ?? "Ubicación no disponible",
        precioHora: pista.precioHora ?? pista.precio ?? 0,
        activa: obtenerEstadoActivo(pista),
        imagen: obtenerImagenAleatoria()
    };
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

function convertirHoraAIndice(hora) {
    if (!hora || hora.toLowerCase() === "cualquier hora") {
        return null;
    }

    const horasBase = 8;
    const [horaTexto, minutosTexto] = hora.split(":");
    const horaNumero = Number(horaTexto);
    const minutosNumero = Number(minutosTexto);

    if (Number.isNaN(horaNumero) || Number.isNaN(minutosNumero)) {
        return null;
    }

    const diferenciaHoras = horaNumero - horasBase;

    if (diferenciaHoras < 0) {
        return null;
    }

    // 28 slots de 30 min desde las 08:00 hasta las 21:30
    // 08:00 -> 0
    // 08:30 -> 1
    // 09:00 -> 2
    // ...
    return diferenciaHoras * 2 + (minutosNumero >= 30 ? 1 : 0);
}

function renderizarTabla(listaPistas = [], indiceHora = null) {
    const contenedor = document.getElementById("pistas-grid");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (listaPistas.length === 0) {
        contenedor.innerHTML = `
            <p class="sin-resultados">
                No hay pistas para mostrar.
            </p>
        `;
        return;
    }

    listaPistas.forEach((pista) => {
        if (pista.activa === false) {
            return;
        }

        const disponibilidad = estadoGlobal.disponibilidadPorPista[String(pista.id)] ?? estadoGlobal.disponibilidadPorPista[pista.id];
        const disponible = calcularDisponibilidadVisual(disponibilidad, indiceHora);

        const card = document.createElement("article");
        card.className = "pista-card";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <div class="pista-badge ${disponible ? "badge-disponible" : "badge-no-disponible"}">
                ${disponible ? "Disponible" : "No disponible"}
            </div>
            <img src="${pista.imagen}" alt="Imagen de ${escapeHTML(pista.nombre)}">
            <div class="pista-body">
                <h2>${escapeHTML(pista.nombre)}</h2>
                <p class="pista-club">${escapeHTML(pista.ubicacion)}</p>
                <p class="pista-precio"><strong>${formatearPrecio(pista.precioHora)}</strong> / hora</p>
                <a href="viewPista.html?nombre=${encodeURIComponent(pista.nombre)}" class="pista-btn">
                    Ver horarios
                </a>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

function calcularDisponibilidadVisual(disponibilidad, indiceHora) {
    if (!Array.isArray(disponibilidad)) {
        return true;
    }

    if (indiceHora === null) {
        return disponibilidad.some((ocupada) => ocupada === false);
    }

    return disponibilidad[indiceHora] === false;
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