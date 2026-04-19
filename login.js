import { comprobarAdmin } from "./auth";

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

    if (!response.ok) {
        throw new Error("Credenciales incorrectas");
    }

    const token = await response.text();
    localStorage.setItem("token", token.trim());

    return token;
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
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
        const password = inputPassword.value.trim();

        if (!email || !password) {
            alert("Introduce email y contraseña");
            return;
        }

        try {
            await login(email, password);
            alert("Inicio de sesión correcto");
            if(comprobarAdmin()){
                window.location.href = "admin.html";
            }else{window.location.href = "pistas.html";}
        } catch (error) {
            console.error("Error en login:", error);
            alert("Correo o contraseña incorrectos");
        }
    });
});