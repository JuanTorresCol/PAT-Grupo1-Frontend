import { comprobarAdmin, obtenerToken } from "./auth.js";

const API_BASE = "http://localhost:8080";

const estadoGlobal = {
    usuariosOriginales: [],
    usuariosFiltrados: [],
    paginaActual: 1,
    usuariosPorPagina: 6
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
    await cargarUsuarios(token);
});

function inicializarEventos() {
    const inputBusqueda = document.querySelector(".reservas-filtros input");
    const botonBuscar = document.querySelector(".buscar-btn");
    const botonAnterior = document.querySelector(".btn-anterior");
    const botonSiguiente = document.querySelector(".btn-siguiente");

    if (botonBuscar) {
        botonBuscar.addEventListener("click", (e) => {
            e.preventDefault();
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

async function cargarUsuarios(token) {

    
    try {
        const response = await fetch(`${API_BASE}/pistaPadel/users`, {
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
            throw new Error(`Error al cargar usuarios: ${response.status}`);
        }

        const usuarios = await response.json();

        

        if (!Array.isArray(usuarios)) {
            throw new Error("La respuesta del servidor no es una lista de usuarios");
        }

        estadoGlobal.usuariosOriginales = usuarios.map((user) => normalizarUsuario(user));
        estadoGlobal.usuariosFiltrados = [...estadoGlobal.usuariosOriginales];
        estadoGlobal.paginaActual = 1;

        renderizarTabla();

    } catch (error) {
        console.error("Error cargando usuarios:", error);
        mostrarFilaMensaje("No se han podido cargar los usuarios.");
    }
}

function normalizarUsuario(user) {
    return {
        id: obtenerIdUsuario(user),
        nombre: obtenerNombreUsuario(user),
        email: obtenerEmailUsuario(user),
        telefono: obtenerTelefonoUsuario(user),
        fechaRegistro: user.createdAt || user.fechaRegistro || "",
        rol: user.rol || user.role || "Usuario",
        activo: user.activo !== undefined ? user.activo : true,
        usuarioOriginal: user
    };
}

function obtenerIdUsuario(user) {
    if (user.idUsuario !== undefined && user.idUsuario !== null) return String(user.idUsuario);
    return "";
}

function obtenerNombreUsuario(user) {
    return user.nombre || user.name || "Usuario";
}

function obtenerEmailUsuario(user) {
    return user.email || "";
}

function obtenerTelefonoUsuario(user) {
    return user.telefono || user.phone || "No disponible";
}

function aplicarBusqueda() {
    const inputBusqueda = document.querySelector(".reservas-filtros input");
    const valor = inputBusqueda.value.trim().toLowerCase();

    if (!valor) {
        limpiarBusqueda();
        return;
    }

    estadoGlobal.usuariosFiltrados = estadoGlobal.usuariosOriginales.filter((user) => {
        return (
            user.nombre.toLowerCase().includes(valor) ||
            user.email.toLowerCase().includes(valor) ||
            user.telefono.toLowerCase().includes(valor)
        );
    });

    estadoGlobal.paginaActual = 1;
    renderizarTabla();
}

function limpiarBusqueda() {
    estadoGlobal.usuariosFiltrados = [...estadoGlobal.usuariosOriginales];
    estadoGlobal.paginaActual = 1;
    renderizarTabla();
}

function renderizarTabla() {
    const tbody = document.querySelector(".reservas-tabla tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (estadoGlobal.usuariosFiltrados.length === 0) {
        mostrarFilaMensaje("No se han encontrado usuarios.");
        actualizarPaginacion();
        return;
    }

    const inicio = (estadoGlobal.paginaActual - 1) * estadoGlobal.usuariosPorPagina;
    const fin = inicio + estadoGlobal.usuariosPorPagina;
    const usuariosPagina = estadoGlobal.usuariosFiltrados.slice(inicio, fin);

    usuariosPagina.forEach((user) => {
        const fila = document.createElement("tr");
        fila.classList.add("clickable-row");
        fila.style.cursor = "pointer";

        fila.addEventListener("click", () => {
            //guardamos el id para verlo en la página de perfil/detalle
            window.location.href = `perfil.html?id=${user.id}&origen=admin`;
        });

        //iniciales para el profile pic
        const iniciales = user.nombre.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

        fila.innerHTML = `
            <td>
              <div class="user-info-cell">
                <div class="user-avatar">${escapeHTML(iniciales)}</div>
                <div class="user-details">
                  <strong>${escapeHTML(user.nombre)}</strong>
                  <small>${escapeHTML(user.email)}</small>
                </div>
              </div>
            </td>
            <td>${escapeHTML(user.telefono)}</td>
            <td>${formatearFecha(user.fechaRegistro)}</td>
            <td>${escapeHTML(user.rol)}</td>
            <td>
                <span class="estado ${user.activo ? 'activo' : 'inactivo'}">
                    ${user.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
        `;

        tbody.appendChild(fila);
    });

    actualizarPaginacion();
}

function mostrarFilaMensaje(mensaje) {
    const tbody = document.querySelector(".reservas-tabla tbody");
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 20px;">
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
        botonAnterior.disabled = (estadoGlobal.paginaActual === 1);
    }

    if (botonSiguiente) {
        botonSiguiente.disabled = (estadoGlobal.paginaActual >= totalPaginas);
    }
}

function obtenerTotalPaginas() {
    return Math.max(1, Math.ceil(estadoGlobal.usuariosFiltrados.length / estadoGlobal.usuariosPorPagina));
}

function formatearFecha(fecha) {
    if (!fecha) return "";

    //para quedarme solo con la fecha si viene hora incluida (la t es de time)
    const fechaLimpia = fecha.includes("T") ? fecha.split("T")[0] : fecha;

    const partes = fechaLimpia.split("-");
    if (partes.length !== 3) return fecha;

    //devuelve dd/mm/yyyy
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function escapeHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}