import { comprobarAdmin, logout, obtenerToken } from "./auth.js";
import { cargarNavegacion } from "./home.js";

const API_BASE = "http://localhost:8080";

const TEXTO_NO_DISPONIBLE = "No disponible";

document.addEventListener("DOMContentLoaded", () => {
    cargarNavegacion();
    cargarPerfil();
    const esAdmin = comprobarAdmin();

    const guardarBtn = document.getElementById("guardarBtn");
    const cancelarBtn = document.getElementById("cancelarBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (esAdmin){
        logoutBtn.remove();
        guardarBtn.addEventListener("click", guardarCambiosAdmin);
    }else{
        guardarBtn.addEventListener("click", guardarCambios);
    }
    
    cancelarBtn.addEventListener("click", cancelar);

    if (logoutBtn) {        
    logoutBtn.addEventListener("click", cerrarSesion);
    }

});

async function cerrarSesion() {
    logout();
}

async function cancelar(){
    const token = obtenerToken();
    const esAdmin = comprobarAdmin();

    if (!token) {
        redirigirALogin("No has iniciado sesión");
        return;
    }else{
        if (esAdmin) {
                window.location.href = "adminUsuarios.html";
            } else {
                window.location.href = "pistas.html";
            }
    }
}

function obtenerIdDeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function cargarPerfil() {
    const token = obtenerToken();
    console.log("URL completa:", window.location.href);
    console.log("Params:", window.location.search);
    console.log("ID:", obtenerIdDeURL());

    if (!token) {
        redirigirALogin("No has iniciado sesión");
        return;
    }

    const id = obtenerIdDeURL();
    const esAdmin = comprobarAdmin();


    try {
        let userInfo;

        if (esAdmin && id) {
            
            userInfo = await obtenerUsuarioPorId(id, token);
        } else {
            userInfo = await obtenerPerfilUsuario(token);
        }

        pintarResumenPerfil(userInfo);
        pintarDetallesPerfil(userInfo);
        

    } catch (error) {
        console.error("Error cargando perfil:", error);
        redirigirALogin("Error al obtener información del usuario");
    }
}

async function obtenerUsuarioPorId(id, token) {
    const response = await fetch(`${API_BASE}/pistaPadel/users/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("No autorizado");
        }
        if (response.status === 403) {
            throw new Error("No tienes permisos de administrador");
        }
        if (response.status === 404) {
            throw new Error("Usuario no encontrado");
        }

        throw new Error(`Error HTTP ${response.status}`);
    }

    return await response.json();

}


async function guardarCambiosAdmin(event) {
    event.preventDefault();
    const token = obtenerToken();
    const esAdmin = comprobarAdmin();

    if (!token) {
        redirigirALogin("No has iniciado sesión");
        return;
    }

    const id = obtenerIdDeURL(); 

    if (!id && esAdmin) {
        alert("Falta el ID del usuario a modificar");
        return;
    }

    let activo;

    if (esAdmin) {
        activo = document.getElementById("estadoSelect").value;
    } else {
        activo = true;
    }

    const userPatchRequest = {
        email: document.getElementById("emailUsuarioForm").value,
        nombre: document.getElementById("nombreUsuario").value,
        apellidos: document.getElementById("apellidosUsuario").value,
        telefono: document.getElementById("telefonoUsuarioForm").value,
        active: activo
    };

    try {

        const url = esAdmin
            ? `${API_BASE}/pistaPadel/users/${id}`
            : `${API_BASE}/pistaPadel/users/me`; // opcional si lo tienes

        const responsePatch = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userPatchRequest)
        });

        if (!responsePatch.ok) {
            if (responsePatch.status === 401) {
                redirigirALogin("Sesión caducada o no válida");
                return;
            }

            if (responsePatch.status === 403) {
                alert("No tienes permisos para modificar este usuario");
                return;
            }

            if (responsePatch.status === 409) {
                alert("Email ya en uso");
                return;
            }

            throw new Error(`Error HTTP ${responsePatch.status}`);
        }

        alert("Perfil actualizado correctamente");

        if (esAdmin) {
            window.location.href = "adminUsuarios.html";
        } else {
            window.location.href = "perfil.html";
        }

    } catch (error) {
        console.error("Error al guardar cambios:", error);
        alert("No se pudieron guardar los cambios");
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
    const esAdmin = comprobarAdmin();

    if (!token) {
        redirigirALogin("No has iniciado sesión");
        return;
    }

    let activo;

    if (esAdmin){
        activo = document.getElementById("estadoSelect").value;
    }else{
        activo = true;
    }
    const userPatchRequest = { //objeto JS, hay que convertirlo a json
        email: document.getElementById("emailUsuarioForm").value,
        nombre: document.getElementById("nombreUsuario").value,
        apellidos: document.getElementById("apellidosUsuario").value,
        telefono: document.getElementById("telefonoUsuarioForm").value,
        active: activo
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

        if (esAdmin) {
                window.location.href = "adminUsuarios.html";
        } else {
                window.location.href = "perfil.html";
        }

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