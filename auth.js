const TOKEN_KEY = "token";

export function obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function decodificarToken(token) {
    try {
        const partes = token.split(".");

        if (partes.length !== 3) {
            return null;
        }

        const payloadBase64 = partes[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const payloadJson = decodeURIComponent(
            atob(payloadBase64)
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(payloadJson);
    } catch (error) {
        console.error("No se pudo decodificar el token:", error);
        return null;
    }
}

function tokenCaducado(payload) {
    if (!payload || !payload.exp) {
        return true;
    }

    const ahoraEnSegundos = Math.floor(Date.now() / 1000);
    return payload.exp < ahoraEnSegundos;
}

function extraerRoles(payload) {
    if (!payload) {
        return [];
    }

    if (typeof payload.role === "string") {
        return [payload.role];
    }

    if (Array.isArray(payload.roles)) {
        return payload.roles;
    }

    if (Array.isArray(payload.authorities)) {
        return payload.authorities.map(r => r.replace("ROLE_", ""));
    }

    return [];
}

function tieneRol(rolBuscado) {
    const token = obtenerToken();

    if (!token) {
        return false;
    }

    const payload = decodificarToken(token);

    if (!payload) {
        return false;
    }

    if (tokenCaducado(payload)) {
        localStorage.removeItem(TOKEN_KEY);
        return false;
    }

    const roles = extraerRoles(payload);
    return roles.includes(rolBuscado);
}

export function comprobarAdmin() {
    return tieneRol("ADMIN");
}

export function comprobarUsuario() {
    return tieneRol("USER") || tieneRol("ADMIN");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("usuario");
}