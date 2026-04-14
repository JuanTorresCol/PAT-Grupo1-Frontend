// document.addEventListener("DOMContentLoaded", () => {
//   const pistas = {
//         1: {
//             id: 1,
//             nombre: "Pista 1",
//             ubicacion: "Zona Norte",
//             tipo: "Exterior",
//             precio: "25,00 €",
//             descripcion: "Pista exterior con paredes de cristal, ideal para partidas durante todo el año.",
//             estado: "Activa",
//             imagen: "assets/img/pistaPadel5.webp"
//         },

//         2: {
//             id: 2,
//             nombre: "Pista 2",
//             ubicacion: "Zona Norte",
//             tipo: "Exterior",
//             precio: "25,00 €",
//             descripcion: "Pista exterior ubicada en la zona norte, perfecta para juego recreativo y entrenamiento.",
//             estado: "Activa",
//             imagen: "assets/img/pistaPadel3.webp"
//         },

//         3: {
//             id: 3,
//             nombre: "Pista 3",
//             ubicacion: "Zona Sur",
//             tipo: "Interior",
//             precio: "30,00 €",
//             descripcion: "Pista interior en la zona sur, diseñada para ofrecer comodidad y juego continuo.",
//             estado: "Activa",
//             imagen: "assets/img/pistaPadel1.webp"
//         },

//         4: {
//             id: 4,
//             nombre: "Pista 4",
//             ubicacion: "Zona Sur",
//             tipo: "Interior",
//             precio: "30,00 €",
//             descripcion: "Pista interior ubicada en la zona sur, ideal para jugar en cualquier época del año.",
//             estado: "Activa",
//             imagen: "assets/img/pistaPadel2.webp"
//         },

//         5: {
//             id: 5,
//             nombre: "Pista 5",
//             ubicacion: "Zona Centro",
//             tipo: "Exterior",
//             precio: "25,00 €",
//             descripcion: "Pista exterior en la zona centro, perfecta para partidos dinámicos y entrenamiento.",
//             estado: "Activa",
//             imagen: "assets/img/pistaPadel5.webp"
//         },

//         6: {
//             id: 6,
//             nombre: "Pista 6",
//             ubicacion: "Zona Centro",
//             tipo: "Exterior",
//             precio: "25,00 €",
//             descripcion: "Pista exterior en zona centro actualmente fuera de disponibilidad para reservas.",
//             estado: "Inactiva",
//             imagen: "assets/img/pistaPadel6.webp"
//         },

//         7: {
//             id: 7,
//             nombre: "Pista 7",
//             ubicacion: "Zona Este",
//             tipo: "Exterior",
//             precio: "28,00 €",
//             descripcion: "Pista exterior situada en la zona este, con buen espacio y condiciones óptimas de juego.",
//             estado: "Activa",
//             imagen: "assets/img/pistaPadel1.webp"
//         },

//         8: {
//             id: 8,
//             nombre: "Pista 8",
//             ubicacion: "Zona Oeste",
//             tipo: "Interior",
//             precio: "27,00 €",
//             descripcion: "Pista interior en la zona oeste, temporalmente desactivada del sistema de reservas.",
//             estado: "Inactiva",
//             imagen: "assets/img/pistaPadel2.webp"
//         }
//     };

//   const params = new URLSearchParams(window.location.search);
//   const id = params.get("id");

//   if (!id || !pistas[id]) {
//     alert("Pista no encontrada");
//     return;
//   }

//   const pista = pistas[id];

//   const breadcrumb = document.getElementById("breadcrumb-pista");
//   const tituloDetalle = document.getElementById("titulo-detalle");

//   const imgPista = document.getElementById("img-pista");
//   const infoNombre = document.getElementById("info-nombre");
//   const infoUbicacion = document.getElementById("info-ubicacion");
//   const infoTipo = document.getElementById("info-tipo");
//   const infoPrecio = document.getElementById("info-precio");

//   const inputNombre = document.getElementById("nombre");
//   const inputUbicacion = document.getElementById("ubicacion");
//   const inputTipo = document.getElementById("tipo");
//   const inputPrecio = document.getElementById("precio");
//   const inputDescripcion = document.getElementById("descripcion");
//   const selectEstado = document.getElementById("estado");

//   const badgeSuperior = document.getElementById("badge-estado-superior");
//   const badgeLateral = document.getElementById("badge-estado-lateral");

//   breadcrumb.textContent = `Panel / Pistas / ${pista.nombre}`;
//   tituloDetalle.textContent = `Detalle de ${pista.nombre}`;

//   imgPista.src = pista.imagen;
//   imgPista.alt = pista.nombre;

//   infoNombre.textContent = pista.nombre;
//   infoUbicacion.textContent = pista.ubicacion;
//   infoTipo.textContent = pista.tipo;
//   infoPrecio.textContent = pista.precio;

//   inputNombre.value = pista.nombre;
//   inputUbicacion.value = pista.ubicacion;
//   inputTipo.value = pista.tipo;
//   inputPrecio.value = pista.precio;
//   inputDescripcion.value = pista.descripcion;
//   selectEstado.value = pista.estado;

//   badgeSuperior.textContent = pista.estado;
//   badgeLateral.textContent = pista.estado;

//   // limpiar clases anteriores
//   badgeSuperior.classList.remove("detalle-pista-estado-activa", "detalle-pista-estado-inactiva");
//   badgeLateral.classList.remove("detalle-pista-estado-activa", "detalle-pista-estado-inactiva");

//   if (pista.estado === "Activa") {
//     badgeSuperior.classList.add("detalle-pista-estado-activa");
//     badgeLateral.classList.add("detalle-pista-estado-activa");
//   } else {
//     badgeSuperior.classList.add("detalle-pista-estado-inactiva");
//     badgeLateral.classList.add("detalle-pista-estado-inactiva");
//   }
  
// });