document.addEventListener("DOMContentLoaded", () => {
    const botonGuardar = document.getElementById("guardarPista");

    botonGuardar.addEventListener("click", async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("No has iniciado sesión");
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
                    "Content-Type": "application/json"
                    
                },
                body: JSON.stringify(pistaNueva)
            });
    });  
});