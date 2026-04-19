import { comprobarAdmin } from "./auth.js";

const TOKEN_KEY = "token";

async function login(email, password) {
    const response = await fetch("http://localhost:8080/pistaPadel/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const respuestaTexto = await response.text();

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${respuestaTexto}`);
    }

    const token = respuestaTexto.trim();
    localStorage.setItem(TOKEN_KEY, token);

    return token;
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
    const inputCorreo = document.getElementById("correo");
    const inputPassword = document.getElementById("password");
    const checkboxVerPassword = document.getElementById("verPassword");

    checkboxVerPassword.addEventListener("change", () => {
        inputPassword.type = checkboxVerPassword.checked ? "text" : "password";
    });

    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = inputCorreo.value.trim();
        const password = inputPassword.value; // sin trim

        if (!email || !password) {
            alert("Introduce email y contraseña");
            return;
        }

        try {
            await login(email, password);

            const esAdmin = comprobarAdmin();

            alert("Inicio de sesión correcto");

            if (esAdmin) {
                window.location.href = "adminPistas.html";
            } else {
                window.location.href = "pistas.html";
            }

        } catch (error) {
            console.error("Error real en login:", error);

            if (error.message.includes("401") || error.message.includes("404")) {
                alert("Correo o contraseña incorrectos");
            } else {
                alert("No se pudo iniciar sesión. Mira la consola para ver el error real.");
            }
        }
    });
});