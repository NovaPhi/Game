# Historias de Usuario — Z Attack

---

## Historia de Usuario #1 — Página web incluya la historia del juego, mecánicas y controles

**Como:** Usuario
**Quiero:** que mi página web incluya la historia del juego, las mecánicas del juego, y los controles para poder jugar
**Para poder:** entender el juego y tener una mejor experiencia

**Validación:**

- Escribir historia del juego.
- Escribir mecánicas del juego.
- Escribir controles.
- Comprobar que salen en la web

**Prioridad:** 3
**Estimación:** 5h

---

## Historia de Usuario #2 — Acceso a estadísticas de los usuarios para análisis

**Como:** Administrador
**Quiero:** tener acceso a las estadísticas de los usuarios
**Para poder:** tomar decisiones de cómo interactuar con dichos usuarios

**Validación:**

- Crear tablas que guardan las estadísticas de los usuarios
- Comprobar que las tablas guarden la información
- Dar acceso de las estadísticas al administrador
- Comprobar que el administrador tenga acceso a las estadísticas

**Prioridad:** 2
**Estimación:** 7h

---

## Historia de Usuario #3 — Implementar el videojuego en una página web

**Como:** Usuario
**Quiero:** que el videojuego se implemente en una página web y no en un programa por separado
**Para poder:** jugar desde un navegador web

**Validación:**

- Crear página web
- Comprobar el funcionamiento de la página web
- Crear videojuego
- Comprobar el funcionamiento del videojuego
- Crear base de datos
- Comprobar el funcionamiento de la base de datos
- Crear API
- Comprobar el funcionamiento del API
- Probar el videojuego dentro de la página web con todos los componentes adicionales funcionando

**Prioridad:** 1
**Estimación:** 45h

---

## Historia de Usuario #4 — Almacenar información de los usuarios en relación a estadísticas del videojuego

**Como:** Usuario
**Quiero:** almacenar la información de cada usuario como veces jugada, poderes, cartas obtenidas y highscore
**Para poder:** que los usuarios puedan ver sus estadísticas

**Validación:**

- Crear tabla en base de datos
- Conectar la tabla al HTML con el API
- Comprobar que la información se guarda
- Comprobar que la información es visible

**Prioridad:** 3

---

## Historia de Usuario #5 — Guardar información de cómo cuándo y en donde se conecta un usuario

**Como:** Administrador
**Quiero:** guardar información en relación de cuando y donde se conecta un usuario
**Para poder:** administrar de forma más eficiente a los usuarios

**Validación:**

- Crear tabla en base de datos
- Conectar la tabla al HTML con el API
- Comprobar que la información se guarda
- Comprobar que la información es visible

**Prioridad:** 3

---

## Historia de Usuario #6 — Mostrar estadísticas de los usuarios en un formato visual interactivo

**Como:** Administrador
**Quiero:** mostrar las estadísticas del jugador en formato de visualizaciones interactivas
**Para poder:** tomar decisiones acerca del juego y su comportamiento

**Validación:**

- Conseguir la información de la tabla en la base de datos
- Formatear la información de forma interactiva
- Comprobar que el formateo se muestre correctamente

**Prioridad:** 3

---

## Historia de Usuario #7 — Interfaz que conecta la base de datos con la página web y el juego

**Como:** Desarrollador
**Quiero:** crear una interfaz que conecta la base de datos con la página web y el juego
**Para poder:** acceder la información de la base de datos

**Validación:**

- Crear vínculo base de datos a página web
- Crear vínculo base de datos a videojuego
- Comprobar que los vínculos están activos
- Comprobar que tanto el videojuego como la página web puedan leer y escribir datos en la base de datos

**Prioridad:** 1

---

## Historia de Usuario #8 — Guardar información en distintas tablas

**Como:** Administrador
**Quiero:** guardar información en varias tablas de forma estructurada
**Para poder:** extraer información de la forma más eficiente posible

**Validación:**

- Crear tablas
- Definir correctamente tablas
- Estructurar tablas
- Validación de datos de cada tabla

**Prioridad:** 1

---

## Historia de Usuario #9 — Login con contraseña

**Como:** Administrador
**Quiero:** que los usuarios necesiten hacer un login con contraseña
**Para poder:** controlar qué usuarios accedieron al juego, cuáles son sus "perfiles de juego" y poder controlarlos si están permitidos o no.

**Validación:**

- Crear sistema de autenticación con usuario y contraseña
- Verificar credenciales al iniciar sesión
- Implementar lista blanca de usuarios permitidos
- Implementar lista negra de usuarios bloqueados
- Mostrar mensaje de acceso denegado si el usuario está bloqueado

**Prioridad:** 1

---

## Historia de Usuario #10 — Historia inmersiva

**Como:** Usuario
**Quiero:** una historia inmersiva dentro del juego
**Para poder:** mejorar mi experiencia y sentirme más involucrado con el juego

**Validación:**

- Escribir historia inmersiva
- Implementarla dentro de la página web
- Comprobar que es visible y comprensible

**Prioridad:** 3

---

## Historia de Usuario #11 — Jugabilidad e interacción con cartas

**Como:** Usuario
**Quiero:** poder jugar con cartas e interactuar con ellas
**Para poder:** mejorar mi experiencia y disfrutar del aspecto TCG del juego

**Validación:**

- Implementar un sistema de cartas TCG dentro del juego
- Permitir al usuario seleccionar e interactuar con las cartas
- Mostrar información básica de cada carta (nombre, efectos, etc.)
- Comprobar que sea comprensible para el usuario

**Prioridad:** 1

---

## Historia de Usuario #12 — Distintas experiencias de juego

**Como:** Usuario
**Quiero:** tener distintas experiencias de juego en cada "run"
**Para poder:** disfrutar del aspecto Roguelike del juego y que cada experiencia sea distinta

**Validación:**

- Implementar randomización en las cartas y obstáculos
- Generar variaciones en cada partida (orden de cartas, enemigos u obstáculos)
- Incluir suficientes elementos aleatorios para fomentar la rejugabilidad
- Comprobar que cada "run" ofrezca una experiencia distinta al jugador

**Prioridad:** 1

---

## Historia de Usuario #13 — Base de datos bien estructurada

**Como:** Administrador de base de datos
**Quiero:** que la base de datos esté bien estructurada, sin redundancia y con separación entre tablas
**Para poder:** entender de mejor manera la información y que no haya confusiones o datos repetidos

**Validación:**

- Crear separación dentro de las tablas de la base de datos
- Implementar consistencia en la base de datos
- Evitar la redundancia en la base de datos

**Prioridad:** 2

---

## Historia de Usuario #14 — Acceso a tablas reales

**Como:** Administrador de base de datos
**Quiero:** que los usuarios no tengan acceso directo a las tablas reales de la base de datos
**Para poder:** proteger la información y evitar modificaciones o consultas no autorizadas

**Validación:**

- Restringir el acceso directo de usuarios a las tablas principales
- Implementar permisos o roles para controlar el acceso a la base de datos
- Permitir únicamente interacciones controladas mediante el sistema o la aplicación
- Comprobar que los usuarios no puedan consultar ni modificar directamente las tablas reales

**Prioridad:** 2

---

## Historia de Usuario #15 — Link a página web

**Como:** Usuario
**Quiero:** poder acceder a la página web a través de un link, no solo local
**Para poder:** jugar en cualquier momento donde sea que esté.

**Validación:**

- Publicar la página web en un servicio de hosting
- Generar un link para los usuarios
- Comprobar que el link abre correctamente la página web
- Verificar que el juego funciona correctamente al acceder desde el link

**Prioridad:** 3

---

## Historia de Usuario #16 — Guardado de estadísticas

**Como:** Usuario
**Quiero:** poder tener un avatar y que se guarden mis estadísticas (daño, HP, HS, etc.)
**Para poder:** tener un registro de mi progreso en el juego y poder acceder cuando quiera a ellos

**Validación:**

- Implementar sistema de avatar para cada usuario
- Implementar guardado de estadísticas en la base de datos por usuario
- Comprobar que las estadísticas se guardan de forma correcta
- Verificar que son visibles de alguna forma para el usuario junto a su avatar

**Prioridad:** 2

---

## Historia de Usuario #17 — Tutorial de introducción al juego

**Como:** Administrador
**Quiero:** un tutorial de introducción para jugadores nuevos y usuarios comunes
**Para poder:** aprender a jugar y tener una experiencia inmersiva desde el inicio.

**Validación:**

- Diseñar e implementar un tutorial guiado al iniciar el juego por primera vez
- Comprobar que el tutorial explique los controles y mecánicas básicas del juego
- Verificar que el tutorial sea omitible para jugadores que no lo necesiten
- Confirmar que el tutorial se muestre solo a jugadores nuevos o bajo petición

**Prioridad:** 1

---

## Historia de Usuario #18 — Tutorial especializado — mecánicas de cartas y ambiente

**Como:** Administrador
**Quiero:** un tutorial especializado que explique cómo interactúan las cartas y el ambiente entre sí
**Para poder:** comprender por completo las mecánicas del sistema de cartas y ambiente.

**Validación:**

- Diseñar un tutorial enfocado en las interacciones carta-ambiente
- Comprobar que se expliquen todas las mecánicas de cartas
- Verificar que este tutorial esté disponible después de completar el tutorial de inicio
- Confirmar que el usuario pueda releerlo o repetirlo desde el menú

**Prioridad:** 2

---

## Historia de Usuario #19 — Juego Roguelite y TCG

**Como:** Usuario
**Quiero:** un juego que combine los géneros de Roguelite y TCG y sus respectivas mecánicas
**Para poder:** tener una experiencia de juego variada, diferente y rejugable con progresión aleatoria y estrategia de cartas.

**Validación:**

- Implementar generación aleatoria de niveles y elementos de roguelite
- Integrar un sistema de cartas coleccionables que afecten el gameplay, elemento TCG
- Comprobar que cada partida ofrezca una experiencia distinta al usuario
- Verificar que las cartas influyan en las mecánicas y decisiones del juego

**Prioridad:** 1

---

## Historia de Usuario #20 — Llaves de optimización en tablas de la base de datos

**Como:** Administrador de base de datos
**Quiero:** que todas las tablas de la base de datos tengan llaves de optimización, incluyendo índices además de llaves primarias y foráneas
**Para poder:** optimizar la recuperación de información y mejorar el rendimiento de consultas

**Validación:**

- Agregar índices apropiados a los campos más consultados en cada tabla
- Comprobar que las consultas frecuentes usen los índices definidos
- Verificar que el tiempo de respuesta de las consultas mejore con los índices
- Documentar las llaves y índices definidos por tabla

**Prioridad:** 3

---

## Historia de Usuario #21 — Base de datos con más de dos tablas que respete modelo SQL

**Como:** Administrador de base de datos
**Quiero:** que la base de datos cuente con más de dos tablas para respetar un modelo SQL
**Para poder:** organizar la información de manera más estructurada, escalable y segura

**Validación:**

- Diseñar un modelo relacional con al menos tres tablas
- Comprobar que las tablas estén relacionadas correctamente mediante llaves foráneas
- Documentar el diagrama entidad-relación del modelo

**Prioridad:** 1

---

## Historia de Usuario #22 — Separación de información

**Como:** Administrador de base de datos
**Quiero:** que exista cierta información que se almacena en la base de datos y otra que solo existe en el tiempo de ejecución del juego
**Para poder:** optimizar el uso de la base de datos almacenando solo cierta información específica.

**Validación:**

- Identificar y documentar los datos que deben persistir en la base de datos
- Identificar y documentar los datos que solo deben existir en memoria durante la partida
- Verificar que los datos persistentes se guarden correctamente al finalizar una sesión

**Prioridad:** 2

---

## Historia de Usuario #23 — Privacidad de información de usuarios

**Como:** Administrador de seguridad
**Quiero:** que la información de los usuarios sea lo más privada posible
**Para poder:** proteger los datos personales de los jugadores.

**Validación:**

- Encriptar los datos sensibles almacenados en la base de datos
- Restringir el acceso a la información solo a quien esté autorizado
- Comprobar que ningún usuario pueda acceder a la información de otro

**Prioridad:** 1

---

## Historia de Usuario #24 — Cinemáticas

**Como:** Usuario
**Quiero:** que el juego tenga cinemáticas
**Para poder:** experimentar una historia de juego más inmersiva.

**Validación:**

- Implementar al menos una cinemática de introducción al juego
- Comprobar que las cinemáticas se reproduzcan en los momentos narrativos clave
- Verificar que el usuario pueda omitir las cinemáticas si lo desea

**Prioridad:** 3

---

## Historia de Usuario #25 — Resultado del juego

**Como:** Usuario
**Quiero:** que cada partida tenga una conclusión derivada de las acciones tomadas y los eventos ocurridos
**Para poder:** obtener distintos resultados en cada partida, ganar o perder.

**Validación:**

- Implementar una barra de vida para el jugador que al agotarse determine el final de la partida.
- Implementar la exitosa destrucción de la base enemiga como condición para ganar un stage.
- Implementar pantalla de Game Over que despliegue el puntaje final y las recompensas obtenidas, así como la opción de iniciar una nueva partida o regresar al menú principal si la barra de vida del jugador llega a 0.
- Verificar que al ganar un stage se avance al siguiente o a la pantalla de selección de cartas en caso de haber terminado un assault.

**Prioridad:** 1

---

## Historia de Usuario #26 — Reinicio del progreso y conservación de elementos

**Como:** Usuario
**Quiero:** que conforme progrese en una partida, mi personaje se vaya volviendo más fuerte y que al perder o terminar la partida, se restablezca todo ese progreso exceptuando ciertas recompensas obtenidas que sí se puedan conservar
**Para poder:** subir de nivel y desarrollar a mis personajes a pesar de que el progreso entre partidas se reinicie a 0.

**Validación:**

- Definir elementos que se conservarán al terminar una partida.
- Descartar progreso obtenido durante la partida al terminarla.
- Implementar la mejora de personajes usando las recompensas obtenidas.
- Verificar que en cada partida el progreso se reinicie en 0.

**Prioridad:** 1

---

## Historia de Usuario #27 — Jugabilidad intuitiva

**Como:** Usuario
**Quiero:** que la jugabilidad sea entendible e intuitiva
**Para poder:** aprender a jugar fácilmente sin necesidad de ayuda externa.

**Validación:**

- Implementar controles claros y consistentes dentro del juego
- Asegurar que las mecánicas principales sean fáciles de comprender
- Comprobar mediante pruebas que nuevos usuarios entienden cómo jugar sin dificultad

**Prioridad:** 3

---

## Historia de Usuario #28 — Diseño visual claro

**Como:** Usuario
**Quiero:** que la interfaz tenga una paleta de colores clara y consistente
**Para poder:** entender mejor la información sin sobrecarga visual.

**Validación:**

- Definir una paleta de colores coherente para todo el juego
- Evitar saturación de elementos en pantalla
- Mantener consistencia visual en todos los componentes del frontend

**Prioridad:** 3
