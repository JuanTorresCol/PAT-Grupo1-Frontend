# PAT-Grupo1
Proyecto final de Programación de Aplicaciones Telemáticas, Grupo 1 

(Juan Torres Colomina, Carlota Agüera García, Elisa Lapastora Aracil, María Bartolomé Gamero y Rosario Ruiz-Cabrero Martinez de Albornoz)

## SEGUNDA ENTREGA
### Descripción
Esta segunda entrega del proyecto consiste en el desarrollo completo y funcional de la aplicación web AtilanoPadel, integrando el frontend desarrollado en la primera entrega con un backend implementado mediante API REST.

La aplicación permite la gestión integral de reservas de pistas de pádel, diferenciando funcionalidades según el rol del usuario autenticado. En esta fase se ha implementado toda la lógica dinámica utilizando JavaScript y comunicación asíncrona con el backend, permitiendo una experiencia completamente interactiva y conectada con base de datos.

A diferencia de la primera entrega, centrada únicamente en el diseño estático de la interfaz, en esta versión:

- La aplicación ya interactúa con el backend.
- Los datos se obtienen dinámicamente desde la base de datos.
- El sistema de autenticación y roles está completamente operativo.
- Las reservas funcionan en tiempo real.
- El panel de administración dispone de operaciones CRUD completas.
- La navegación cambia dinámicamente según el rol del usuario.


#### Usuarios de prueba

Para facilitar las pruebas de la aplicación se han creado dos usuarios por defecto:

**Usuario estándar (USER)**
- Email: `user@padel.com`
- Contraseña: `1234`

**Administrador (ADMIN)**
- Email: `admin@padel.com`
- Contraseña: `1234`

### Roles del sistema

El sistema distingue entre dos tipos de perfil:

**Usuario (USER)**  
Puede consultar las pistas disponibles, gestionar sus reservas y administrar su perfil dentro de la plataforma.

Funcionalidades:
- Registro de nuevos usuarios
- Inicio de sesión
- Cierre de sesión
- Persistencia de sesión autenticada
- Visualización de pistas disponibles
- Consulta de información detallada de las pistas
- Consulta de horarios disponibles
- Reserva de pistas
- Confirmación de reservas
- Visualización de reservas realizadas
- Cancelación de reservas
- Gestión y consulta del perfil de usuario


**Administrador (ADMIN)**  
Dispone de un panel de administración desde el cual puede gestionar pistas, reservas y usuarios del sistema.

Funcionalidades:
- Gestión de pistas
    - Visualización de todas las pistas
    - Creación de nuevas pistas
    - Modificación de pistas existentes
    - Eliminación de pistas
    - Gestión del estado de disponibilidad de las pistas
    - Visualización detallada de información de pistas
- Gestión de reservas
    - Visualización de todas las reservas del sistema
    - Búsqueda de reservas
    - Modificación de reservas
    - Cancelación de reservas
    - Supervisión de disponibilidad de pistas
- Gestión de usuarios
    - Visualización de usuarios registrados
    - Consulta de información detallada de usuarios
    - Modificación del estado de usuarios
- Gestión de roles y permisos
    - Administración general
    - Acceso restringido mediante control de roles
    - Navegación adaptada automáticamente según permisos


### Comunicación con backend

La aplicación frontend consume una API REST desarrollada en Spring Boot. La comunicación entre frontend y backend se realiza mediante peticiones HTTP asíncronas utilizando JavaScript.

La API se encarga de:
- Gestión de autenticación
- Gestión de usuarios
- Gestión de reservas
- Gestión de pistas
- Persistencia en base de datos

El repositorio donde se encuentra el backend es el siguiente:[Repositorio Backend PAT-Grupo1]( https://github.com/JuanTorresCol/PAT-Grupo1.git)


### Despliegue

La web está publicada utilizando GitHub Pages, lo que permite acceder a ella mediante una URL pública.
https://juantorrescol.github.io/PAT-Grupo1-Frontend/home.html


### Estructura del repositorio

El repositorio contiene los siguientes elementos principales:

- [home.html](./home.html) – Página principal de la aplicación desde la que se puede navegar al resto de secciones de la web.
- [home.js](./home.js) – Archivo JavaScript encargado de gestionar la lógica dinámica de la página principal.
- [login.html](./login.html) – Página de inicio de sesión para los usuarios registrados.
- [login.js](./login.js) – Archivo JavaScript encargado de gestionar el inicio de sesión y la autenticación del usuario.
- [registro.html](./registro.html) – Página que permite a nuevos usuarios crear una cuenta en la aplicación.
- [registro.js](./registro.js) – Archivo JavaScript encargado de gestionar el registro de nuevos usuarios.
- [perfil.html](./perfil.html) – Página donde el usuario puede consultar y modificar la información de su perfil.
- [perfil.js](./perfil.js) – Archivo JavaScript encargado de cargar, mostrar y actualizar los datos del perfil del usuario.
- [pistas.html](./pistas.html) – Página que muestra el listado de pistas disponibles para reservar.
- [pistas.js](./pistas.js) – Archivo JavaScript encargado de cargar dinámicamente las pistas desde el backend.
- [viewPista.html](./viewPista.html) – Página para consultar el detalle de una pista y acceder a sus horarios disponibles.
- [viewPista.js](./viewPista.js) – Archivo JavaScript encargado de mostrar la información detallada de una pista concreta.
- [detallePista.js](./detallePista.js) – Archivo JavaScript encargado de gestionar la selección de horarios, duración y disponibilidad de una pista.
- [reservas.html](./reservas.html) – Página donde el usuario puede consultar sus reservas realizadas.
- [reservas.js](./reservas.js) – Archivo JavaScript encargado de cargar y mostrar las reservas asociadas al usuario autenticado.
- [viewReserva.html](./viewReserva.html) – Página donde se muestra el detalle de una reserva concreta.
- [viewReserva.js](./viewReserva.js) – Archivo JavaScript encargado de cargar y gestionar la información detallada de una reserva.
- [reservaCancelada.html](./reservaCancelada.html) – Página de confirmación tras cancelar una reserva.
- [reservaCancelada.js](./reservaCancelada.js) – Archivo JavaScript encargado de mostrar los datos de la reserva cancelada.
- [reservaConfirmada.html](./reservaConfirmada.html) – Página de confirmación tras realizar una reserva.
- [reservaConfirmada.js](./reservaConfirmada.js) – Archivo JavaScript encargado de mostrar los datos de la reserva confirmada.
- [admin.html](./admin.html) – Página principal del panel de administración.
- [admin.js](./admin.js) – Archivo JavaScript encargado de gestionar la lógica principal del panel de administración.
- [adminReservas.html](./adminReservas.html) – Página del panel de administración para la gestión de reservas.
- [adminReservas.js](./adminReservas.js) – Archivo JavaScript encargado de cargar, buscar, modificar y gestionar las reservas.
- [adminUsuarios.html](./adminUsuarios.html) – Página del panel de administración para la gestión de usuarios.
- [adminUsuarios.js](./adminUsuarios.js) – Archivo JavaScript encargado de cargar, buscar y gestionar los usuarios registrados.
- [adminPistas.html](./adminPistas.html) – Página del panel de administración para la gestión de pistas.
- [adminPistas.js](./adminPistas.js) – Archivo JavaScript encargado de cargar, buscar, modificar y gestionar las pistas del sistema.
- [adminnewPista.html](./adminnewPista.html) – Página que permite al administrador crear una nueva pista.
- [newPista.js](./newPista.js) – Archivo JavaScript encargado de gestionar la creación de nuevas pistas.
- [adminviewPista.html](./adminviewPista.html) – Página donde el admin puede visualizar y modificar el detalle de una pista.
- [adminViewPista.js](./adminViewPista.js) – Archivo JavaScript encargado de cargar, editar y eliminar la información de una pista.
- [pistaEliminada.html](./pistaEliminada.html) – Página de confirmación tras eliminar una pista.
- [pistaEliminada.js](./pistaEliminada.js) – Archivo JavaScript encargado de mostrar la confirmación de eliminación de una pista.
- [auth.js](./auth.js) – Archivo JavaScript encargado de gestionar la autenticación, sesión, roles y control de acceso en la aplicación.
- [css/](./css) – Carpeta que contiene los archivos de estilos CSS utilizados en la aplicación.
- [assets/](./assets) – Carpeta que contiene los recursos visuales de la página, como imágenes e iconos.
- [README.md](./README.md) – Documento descriptivo de la práctica y del funcionamiento del proyecto.
- [ManualUsuario.pdf](./ManualUsuario.pdf) – Documento con capturas para la navegación por la web.



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
