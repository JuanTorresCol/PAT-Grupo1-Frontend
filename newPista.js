import { comprobarAdmin, obtenerToken } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!comprobarAdmin()) {
        alert("No tienes permisos de administrador");
        window.location.href = "login.html";
        return;
    }

    const botonGuardar = document.getElementById("guardarPista");

    botonGuardar.addEventListener("click", async (event) => {
        event.preventDefault();

        const token = obtenerToken();

        if (!token) {
            alert("No has iniciado sesión");
            window.location.href = "login.html";
            return;
        }

        const nombre = document.getElementById("nombre").value.trim();
        const ubicacion = document.getElementById("ubicacion").value.trim();
        const precioTexto = document.getElementById("precio").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const estadoSeleccionado = document.querySelector('input[name="estado"]:checked');

        const precio = parseFloat(precioTexto.replace(",", "."));

        const pistaNueva = {
            nombre: nombre,
            ubicacion: ubicacion,
            precio: precio,
            descripcion: descripcion,
            estado: estadoSeleccionado ? estadoSeleccionado.value : null
        };

        try {
            const response = await fetch("http://localhost:8080/pistaPadel/courts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(pistaNueva)
            });

            let data = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok) {
                switch (response.status) {
                    case 400:
                        alert(data?.message || "Datos inválidos");
                        break;
                    case 401:
                        alert("No has iniciado sesión o la sesión ha caducado");
                        break;
                    case 403:
                        alert("No tienes permisos de administrador");
                        break;
                    case 409:
                        alert(data?.message || "Ya existe una pista con esos datos");
                        break;
                    default:
                        alert(data?.message || `Error HTTP ${response.status}`);
                }
                return;
            }

            alert("Pista creada correctamente");
            window.location.href = "adminPistas.html";

        } catch (error) {
            console.error("Error de red o del servidor:", error);
            alert("No se pudo conectar con el servidor");
        }
    });
});