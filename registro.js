import { obtenerToken } from "./auth.js";

const API_BASE = "http://localhost:8080";

const TOKEN_KEY = "token";

document.addEventListener("DOMContentLoaded", () => {
    const crearCuentaBtn = document.getElementById("guardarBtn");
    crearCuentaBtn.addEventListener("click", crearCuenta);

    const checkboxVerPassword = document.getElementById("verPassword");
    const inputPassword = document.getElementById("password");
    const inputPasswordRpt = document.getElementById("passwordRepeated");

    checkboxVerPassword.addEventListener("change", () => {
        inputPassword.type = checkboxVerPassword.checked ? "text" : "password";
        inputPasswordRpt.type = checkboxVerPassword.checked ? "text" : "password";
    });



});



async function crearCuenta(event) {
    event.preventDefault();

    const userRequest = validarDatos();

    if (!userRequest) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/pistaPadel/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userRequest)
        });

        const respuestaTexto = await response.text();
        

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${respuestaTexto}`);
        }

        const token = respuestaTexto.trim();
        localStorage.setItem(TOKEN_KEY, token);

        alert("Cuenta creada correctamente");
        window.location.href = "home.html";

    } catch (error) {
        console.error("Error real en registro:", error);
        alert("No se pudo crear la cuenta. Mira la consola para ver el error real.");
    }
}

function validarDatos() {
    const userRequest = {
        email: document.getElementById("correo").value.trim(),
        password: document.getElementById("password").value,
        passwordRepeated: document.getElementById("passwordRepeated").value,
        nombre: document.getElementById("nombre").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        telefono: document.getElementById("telefono").value.trim()
    };

    if (!userRequest.email || !userRequest.password || !userRequest.passwordRepeated || !userRequest.nombre || !userRequest.apellidos) {
        alert("Por favor, completa todos los campos obligatorios");
        return null;
    }

    if (userRequest.password !== userRequest.passwordRepeated) {
        alert("Las contraseñas no coinciden");
        return null;
    }

    return userRequest;
}