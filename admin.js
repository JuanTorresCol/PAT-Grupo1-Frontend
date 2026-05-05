document.addEventListener("DOMContentLoaded", () => {
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "home.html";
    });
  }
});