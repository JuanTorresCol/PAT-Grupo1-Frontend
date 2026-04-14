


document.addEventListener("DOMContentLoaded", () => {
  const filas = document.querySelectorAll("#tabla-pistas tr");
  const filasPorPagina = 6;
  let paginaActual = 1;
  const totalPaginas = Math.ceil(filas.length / filasPorPagina);

  const paginaActualSpan = document.getElementById("pagina-actual");
  const btnAnterior = document.getElementById("btn-anterior");
  const btnSiguiente = document.getElementById("btn-siguiente");

  function mostrarPagina(pagina) {
    const inicio = (pagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;

    filas.forEach((fila, index) => {
      fila.style.display = index >= inicio && index < fin ? "" : "none";
    });

    if (paginaActualSpan) {
      paginaActualSpan.textContent = pagina;
    }

    actualizarBotones();
  }

  function actualizarBotones() {
    if (btnAnterior) {
      btnAnterior.disabled = paginaActual === 1;
      btnAnterior.style.opacity = paginaActual === 1 ? "0.5" : "1";
      btnAnterior.style.cursor = paginaActual === 1 ? "not-allowed" : "pointer";
    }

    if (btnSiguiente) {
      btnSiguiente.disabled = paginaActual === totalPaginas;
      btnSiguiente.style.opacity = paginaActual === totalPaginas ? "0.5" : "1";
      btnSiguiente.style.cursor = paginaActual === totalPaginas ? "not-allowed" : "pointer";
    }
  }

  function siguientePagina() {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      mostrarPagina(paginaActual);
    }
  }

  function anteriorPagina() {
    if (paginaActual > 1) {
      paginaActual--;
      mostrarPagina(paginaActual);
    }
  }

  if (btnAnterior) {
    btnAnterior.addEventListener("click", anteriorPagina);
  }

  if (btnSiguiente) {
    btnSiguiente.addEventListener("click", siguientePagina);
  }

  mostrarPagina(paginaActual);
});