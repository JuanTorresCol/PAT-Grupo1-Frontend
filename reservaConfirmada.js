document.addEventListener("DOMContentLoaded", async () => {
  const infoNum = document.getElementById("numReserva");
  const infoFecha = document.getElementById("fechaReserva");
  const infoHora = document.getElementById("horaReserva");
  const infoPista = document.getElementById("pistaReserva");
  const infoPrecio = document.getElementById("precioReserva");
    
  function pintarPistaEnPantalla(pista) {
    const reserva = JSON.parse(localStorage.getItem("reservaPendiente"));
    console.log(reserva);
      infoNum.textContent = reserva.idPista;
      infoFecha.textContent = formatearFecha(reserva.fecha);
      infoHora.textContent = formatearHora(reserva.hora, reserva.duracion);
      infoPista.textContent = reserva.nombrePista;
      infoPrecio.textContent = formatearPrecio(reserva.precio);
  }

  function formatearHora(hora, duracion) {
    return `${hora} (${duracion})`;
  }

  function formatearFecha(fecha) {
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    return new Date(fecha).toLocaleDateString("es-ES", opciones);
  }

  function formatearPrecio(precio) {
    if (precio === null || precio === undefined || precio === "") return "";
    const numero = Number(precio);
    if (Number.isNaN(numero)) return precio;
    return `${numero.toFixed(2).replace(".", ",")} €`;
  }

  pintarPistaEnPantalla();
  
});

