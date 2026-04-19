import { comprobarAdmin, obtenerToken } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!comprobarAdmin()) {
        alert("No tienes permisos de administrador");
        window.location.href = "login.html";
        return;
    }

    const botonGuardar = document.getElementById("guardarPista");

    const inputNombre = document.getElementById("nombre");
    const inputUbicacion = document.getElementById("ubicacion");
    const inputPrecio = document.getElementById("precio");
    const inputDescripcion = document.getElementById("descripcion");
    const inputFichero = document.getElementById("fichero");
    const radiosEstado = document.querySelectorAll('input[name="estado"]');

    // Elementos del preview
    const previewNombre = document.getElementById("previewNombre");
    const previewUbicacion = document.getElementById("previewUbicacion");
    const previewPrecio = document.getElementById("previewPrecio");
    const previewEstadoTexto = document.getElementById("previewEstadoTexto");
    const previewEstadoBadge = document.getElementById("previewEstadoBadge");

    function obtenerEstadoSeleccionado() {
        const estadoSeleccionado = document.querySelector('input[name="estado"]:checked');
        return estadoSeleccionado ? estadoSeleccionado.value : "ACTIVA";
    }

    function formatearPrecio(valorTexto) {
        if (!valorTexto || valorTexto.trim() === "") {
            return "0,00€";
        }

        const numero = parseFloat(valorTexto.replace(",", ".").replace("€", "").trim());

        if (isNaN(numero)) {
            return "0,00€";
        }

        return `${numero.toFixed(2).replace(".", ",")}€`;
    }

    function actualizarBadgeEstado(estado) {
        const esActiva = estado === "ACTIVA";

        previewEstadoTexto.textContent = esActiva ? "Activa" : "Inactiva";
        previewEstadoBadge.textContent = esActiva ? "Activa" : "Inactiva";

        previewEstadoBadge.classList.remove("detalle-pista-estado-activa", "detalle-pista-estado-inactiva");

        if (esActiva) {
            previewEstadoBadge.classList.add("detalle-pista-estado-activa");
        } else {
            previewEstadoBadge.classList.add("detalle-pista-estado-inactiva");
        }
    }

    function actualizarPreview() {
        const nombre = inputNombre.value.trim();
        const ubicacion = inputUbicacion.value.trim();
        const precioTexto = inputPrecio.value.trim();
        const estado = obtenerEstadoSeleccionado();

        previewNombre.textContent = nombre || "Sin nombre";
        previewUbicacion.textContent = ubicacion || "Sin ubicación";
        previewPrecio.textContent = formatearPrecio(precioTexto);

        actualizarBadgeEstado(estado);
    }

    inputNombre.addEventListener("input", actualizarPreview);
    inputUbicacion.addEventListener("input", actualizarPreview);
    inputPrecio.addEventListener("input", actualizarPreview);
    inputDescripcion.addEventListener("input", actualizarPreview);

    radiosEstado.forEach(radio => {
        radio.addEventListener("change", actualizarPreview);
    });

    actualizarPreview();

    botonGuardar.addEventListener("click", async (event) => {
        event.preventDefault();

        const token = obtenerToken();

        if (!token) {
            alert("No has iniciado sesión");
            window.location.href = "login.html";
            return;
        }

        const nombre = inputNombre.value.trim();
        const ubicacion = inputUbicacion.value.trim();
        const precioTexto = inputPrecio.value.trim();
        const descripcion = inputDescripcion.value.trim();
        const estado = obtenerEstadoSeleccionado();

        const precio = parseFloat(precioTexto.replace(",", ".").replace("€", "").trim());

        if (!nombre || !ubicacion || !precioTexto || isNaN(precio)) {
            alert("Completa correctamente los campos obligatorios");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("ubicacion", ubicacion);
        formData.append("precioHora", precio);
        formData.append("descripcion", descripcion);
        formData.append("activa", estado === "ACTIVA");

        try {
            const response = await fetch("http://localhost:8080/pistaPadel/courts", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            let data = null;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                switch (response.status) {
                    case 400:
                        alert(data?.message || data || "Datos inválidos");
                        break;
                    case 401:
                        alert("No has iniciado sesión o la sesión ha caducado");
                        break;
                    case 403:
                        alert("No tienes permisos de administrador");
                        break;
                    case 409:
                        alert(data?.message || data || "Ya existe una pista con esos datos");
                        break;
                    default:
                        alert(data?.message || data || `Error HTTP ${response.status}`);
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