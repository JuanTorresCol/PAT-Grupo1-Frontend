document.addEventListener("DOMContentLoaded", async () => {
  const infoNum = document.getElementById("numReserva");
  const infoFecha = document.getElementById("fechaReserva");
  const infoHora = document.getElementById("horaReserva");
  const infoPista = document.getElementById("pistaReserva");
  const btnVolverListado = document.getElementById("volver-listado-reservas");
  const menuPrincipal = document.getElementById("menu-principal");

  const params = new URLSearchParams(window.location.search);
  const origen = params.get("origen");

  if (origen === "admin" && menuPrincipal) {
    menuPrincipal.style.display = "none";
  }

  if (origen === "admin" && btnVolverListado) {
    btnVolverListado.href = "adminReservas.html";
    btnVolverListado.textContent = "Volver a gestión de reservas";
  }

  function pintarPistaEnPantalla() {
    const reserva = JSON.parse(localStorage.getItem("reservaCancelada"));
    console.log(reserva);

    if (!reserva) {
      alert("No se han encontrado los datos de la reserva cancelada");
      window.location.href = origen === "admin" ? "adminReservas.html" : "reservas.html";
      return;
    }

    infoNum.textContent = "#" + (reserva.id || reserva.idReserva);
    infoFecha.textContent = formatearFecha(reserva.date);
    infoHora.textContent = formatearHora(
      reserva.startTime.substring(0, 5),
      `${reserva.durationMins} minutos`
    );
    infoPista.textContent = reserva.pista.nombre;
  }

  function formatearHora(hora, duracion) {
    return `${hora} (${duracion})`;
  }

  function formatearFecha(fecha) {
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    return new Date(fecha).toLocaleDateString("es-ES", opciones);
  }

  pintarPistaEnPantalla();
});