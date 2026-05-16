import { logout, obtenerToken, comprobarAdmin } from "./auth.js";

const API_BASE = "http://localhost:8080";


document.addEventListener("DOMContentLoaded", () => {
    cargarNavegacion();

    
});


export async function cargarNavegacion() {
    const token = obtenerToken();
    const esAdmin = comprobarAdmin();
    const menuNav = document.getElementById("menuNav");

    if (!token) {
        menuNav.innerHTML = `
            <a class="menu-item" href="home.html">INICIO</a>
            <a class="menu-item" href="pistas.html">PISTAS</a>
            <a class="menu-item" href="login.html">LOGIN</a>
        `;
    }else{
        if (esAdmin){
            menuNav.innerHTML = ` `;

        }else{
            menuNav.innerHTML = `
                        <a class="menu-item" href="home.html">INICIO</a>
                        <a class="menu-item" href="pistas.html">PISTAS</a>
                        <a class="menu-item" href="reservas.html">RESERVAS</a>
                        <a class="menu-item" href="perfil.html">PERFIL</a>
                    `;
        }
    }
}