import { obtenerToken } from "./auth.js";

const API_BASE = "http://localhost:8080";

const TEXTO_NO_DISPONIBLE = "No disponible";

document.addEventListener("DOMContentLoaded", () => {
    cargarPerfil();

    const guardarBtn = document.getElementById("guardarBtn");
    guardarBtn.addEventListener("click", guardarCambios);

    // const logoutBtn = document.getElementById("logoutBtn");
    // logoutBtn.addEventListener("click", cerrarSesion);
});

async function cargarPerfil() {
    const token = obtenerToken();

    if (!token) {
        redirigirALogin("No has iniciado sesión");
        return;
    }

    try {
        const userInfo = await obtenerPerfilUsuario(token);

        pintarResumenPerfil(userInfo);
        pintarDetallesPerfil(userInfo);

    } catch (error) {
        console.error("Error cargando perfil:", error);
        redirigirALogin("Error al obtener información del usuario");
    }
}

async function obtenerPerfilUsuario(token) {
    const response = await fetch(`${API_BASE}/pistaPadel/auth/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    return await response.json();
}

async function guardarCambios(event) {
    event.preventDefault(); //que no se vaya directamente al link asociado al bton, se fuerza ava script

    const token = obtenerToken();

    if (!token) {
        redirigirALogin("No has iniciado sesión");
        return;
    }

    const userPatchRequest = { //objeto JS, hay que convertirlo a json
        email: document.getElementById("emailUsuarioForm").value,
        nombre: document.getElementById("nombreUsuario").value,
        apellidos: document.getElementById("apellidosUsuario").value,
        telefono: document.getElementById("telefonoUsuarioForm").value,
        active: document.getElementById("estadoSelect").value === "true"
    };

    try {
        const responsePatch = await fetch(`${API_BASE}/pistaPadel/auth/me`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userPatchRequest) //se convierte el objeto a JSON para enviarlo al backend
        });

        if (!responsePatch.ok) {
            if (responsePatch.status === 401) { //unauthorized
                redirigirALogin("Sesión caducada o no válida");
                return;
            }

            if (responsePatch.status === 409) { //conflict
                alert("No se pudo actualizar el perfil. Puede que el email ya esté en uso.");
                return;
            }

            throw new Error(`Error HTTP ${responsePatch.status}`);
            alert("No se pudo actualizar el perfil");
        }

        alert("Perfil actualizado correctamente");
        window.location.href = "home.html";

    } catch (error) {
        console.error("Error al guardar cambios:", error);
        alert("No se pudieron guardar los cambios");
    }
}



function redirigirALogin(mensaje) {
    alert(mensaje);
    window.location.href = "login.html";
}


function obtenerIniciales(nombre, apellidos) {
    const inicialNombre = nombre ? nombre.charAt(0).toUpperCase() : "";
    const inicialApellido = apellidos ? apellidos.charAt(0).toUpperCase() : "";

    return inicialNombre + inicialApellido || "--";
}

function pintarResumenPerfil(userInfo) {
    const nombre = userInfo.nombre || "";
    const apellidos = userInfo.apellidos || "";
    const rol = userInfo.rol || "USER";

    const nombreCompleto = `${nombre} ${apellidos}`.trim() || "Usuario";

    setText("inicialesUsuario", obtenerIniciales(nombre, apellidos));
    setText("nombreCompletoUsuario", nombreCompleto);
    setText("estadoUsuario", userInfo.activo ? "Activo" : "Inactivo");
    setText("emailUsuario", userInfo.email || TEXTO_NO_DISPONIBLE);
    setText("telefonoUsuario", userInfo.telefono || TEXTO_NO_DISPONIBLE);
    setText("fechaRegistroUsuario", formatearFecha(userInfo.fechaRegistro));
    setText("tipoUsuario", rol === "ADMIN" ? "Administrador" : "Usuario");
}


function pintarDetallesPerfil(userInfo) {
    setValue("nombreUsuario", userInfo.nombre || "");
    setValue("apellidosUsuario", userInfo.apellidos || "");
    setValue("emailUsuarioForm", userInfo.email || "");
    setValue("telefonoUsuarioForm", userInfo.telefono || "");
    setValue("estadoSelect", userInfo.activo ? "true" : "false");
}

function formatearFecha(fecha) {
    if (!fecha) {
        return TEXTO_NO_DISPONIBLE;
    }

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
        return TEXTO_NO_DISPONIBLE;
    }

    return fechaConvertida.toLocaleDateString("es-ES");
}


function setText(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
    }
}

function setValue(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.value = valor;
    }
}