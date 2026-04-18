import { comprobarAdmin, obtenerToken } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const esAdmin = comprobarAdmin();

    const botonNuevaPista = document.getElementById("btnNuevaPista");
    const botonGestionPistas = document.getElementById("btnGestionPistas");
    const botonesVerDetalles = document.querySelectorAll(".btn-ver-detalles");

    if (!esAdmin) {
        if (botonNuevaPista) botonNuevaPista.style.display = "none";
        if (botonGestionPistas) botonGestionPistas.style.display = "none";

        botonesVerDetalles.forEach(boton => {
            boton.style.display = "none";
        });

        return;
    }

    const token = obtenerToken();

    if (!token) {
        alert("No has iniciado sesión");
        window.location.href = "login.html";
        return;
    }

    if (botonNuevaPista) {
        botonNuevaPista.style.display = "inline-block";
        botonNuevaPista.addEventListener("click", () => {
            window.location.href = "adminNewPista.html";
        });
    }

    if (botonGestionPistas) {
        botonGestionPistas.style.display = "inline-block";
        botonGestionPistas.addEventListener("click", () => {
            window.location.href = "adminPistas.html";
        });
    }

    botonesVerDetalles.forEach(boton => {
        boton.style.display = "inline-block";

        boton.addEventListener("click", (event) => {
            event.stopPropagation();

            const idPista = boton.dataset.id;

            if (!idPista) {
                alert("No se ha encontrado el ID de la pista");
                return;
            }

            window.location.href = `adminviewPista.html?id=${idPista}`;
        });
    });
});