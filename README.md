# PAT-Grupo1
Projecto final de Programación de Aplicaciones Telemáticas, Grupo 1
## PRIMERA ENTREGA
### Descripción
Esta parte del proyecto consiste en el desarrollo del frontend de una aplicación web para la gestión de reservas de pistas de pádel. La aplicación, llamada AtilanoPadel, es una web orientada a la reserva de pistas de pádel. Permite a los usuarios consultar disponibilidad, reservar horarios y gestionar sus sesiones. En esta primera entrega se ha implementado una web completamente estática, centrada en la estructura visual de la aplicación y en la navegación entre las diferentes páginas. El objetivo de esta fase es construir la interfaz de usuario y la estructura base del proyecto, de manera que en entregas posteriores se pueda integrar con el backend y utilizar los endpoints de la API.

Actualmente:
- La estructura principal de la web está implementada.
- Se han creado las páginas HTML necesarias para la navegación de la aplicación.
- Se han definido los estilos CSS para la presentación de la interfaz.
- La navegación entre páginas funciona correctamente.

### Despliegue

La web está publicada utilizando GitHub Pages, lo que permite acceder a ella mediante una URL pública.
https://juantorrescol.github.io/PAT-Grupo1-Frontend/home.html


### Roles del sistema

El sistema distingue entre dos tipos de perfil:

**Usuario (USER)**  
Puede consultar las pistas disponibles y realizar reservas.

Funcionalidades:
- Registro de nuevos usuarios
- Inicio de sesión
- Visualización de pistas disponibles
- Consulta de información de las pistas
- Reserva de pistas


**Administrador (ADMIN)**  
Dispone de un panel de administración desde el cual puede gestionar pistas, reservas y usuarios.

Funcionalidades:
- Gestión de pistas
- Creación de nuevas pistas
- Visualización de información de pistas
- Gestión de reservas
- Gestión de usuarios

### Estructura del repositorio

El repositorio contiene los siguientes elementos principales:

- [home.html](./home.html) – Página principal de la aplicación desde la que se puede navegar al resto de secciones de la web.
- [login.html](./login.html) – Página de inicio de sesión para los usuarios registrados.
- [registro.html](./registro.html) – Página que permite a nuevos usuarios crear una cuenta en la aplicación.
- [perfil.html](./perfil.html) – Página donde el usuario puede consultar la información de su perfil.
- [pistas.html](./pistas.html) – Página que muestra el listado de pistas disponibles para reservar.
- [reservaCancelada.html](./reservaCancelada.html) – Página de confirmación tras cancelar una reserva.
- [reservaConfirmada.html](./reservaConfirmada.html) – Página de confirmación tras cancelar una reserva.
- [admin.html](./admin.html) – Página principal del panel de administración.
- [adminReservas.html](./adminReservas.html) – Página del panel de administración para la gestión de reservas.
- [adminUsuarios.html](./adminUsuarios.html) – Página del panel de administración para la gestión de usuarios.
- [adminPistas.html](./adminPistas.html) – Página del panel de administración para la gestión de pistas.
- [pistaEliminada.html](./pistaEliminada.html) – Página de confirmación tras eliminar una pista.
- [adminnewPista.html](./adminnewPista.html) – Página que permite al administrador crear una nueva pista.
- [adminviewPista.html](./adminviewPista.html) – Página donde el administrador puede visualizar el detalle de una pista.
- [css/](./css) – Carpeta que contiene los archivos de estilos CSS utilizados en la aplicación.
- [assets/](./assets) – Carpeta que contiene los recursos visuales de la página, como imágenes e iconos.
- [README.md](./README.md) – Documento descriptivo de la práctica y del funcionamiento del proyecto.


### Notas adicionales

- Con el objetivo de facilitar la futura integración con el backend, se han incluido dos archivos JavaScript adicionales que estarán encargados de gestionar parte de la comunicación de la api que actualmente se encuentran comentados, pues se integrarán en la siguiente entrega.

- En el despliegue actual de GitHub Pages no es posible acceder a las pantallas de administración mediante los botones de la interfaz, ya que el acceso dependerá en futuras versiones del rol del admin en el backend.

- Algunas páginas que podrían esperarse en la aplicación no aparecen como archivos HTML independientes dentro del repositorio. Esto se debe a que parte de la interfaz está pensada para modificarse dinámicamente y por tanto para la siguiente emntrega ciertos contenidos y opciones de la interfaz se adaptarán automáticamente en función del rol del usuario autenticado.

- Para poder visualizar las páginas correspondientes al panel de administración en esta fase del proyecto, es necesario acceder directamente a ellas mediante la URL correspondiente. https://juantorrescol.github.io/PAT-Grupo1-Frontend/admin.html
