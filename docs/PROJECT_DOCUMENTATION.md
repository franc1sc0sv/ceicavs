# CEICAVS — Documentación Completa del Proyecto

## Índice

1. [Descripción General del Proyecto](#descripcion-general)
2. [Stack Tecnológico](#stack-tecnologico)
3. [Roles de Usuario](#roles-de-usuario)
4. [Flujos por Módulo](#flujos-por-modulo)
   - [Autenticación](#autenticacion)
   - [Panel de Control](#panel-de-control)
   - [Personas](#personas)
   - [Asistencia](#asistencia)
   - [Blog](#blog)
   - [Herramientas Educativas](#herramientas-educativas)
   - [Transcripción con IA](#transcripcion-con-ia)
5. [Integraciones Externas](#integraciones-externas)
6. [Permisos por Rol](#permisos-por-rol)
7. [Capacidades y Limitaciones](#capacidades-y-limitaciones)
8. [Glosario](#glosario)

---

## Descripción General

CEICAVS es una plataforma de gestión escolar para el Centro Escolar CEICAVS. Centraliza en una sola aplicación web todas las necesidades administrativas y pedagógicas: control de asistencia, comunicación interna a través del blog, herramientas educativas digitales y transcripción de audio con inteligencia artificial.

La plataforma está diseñada para tres tipos de usuarios: **administradores** (gestión completa), **docentes** (gestión pedagógica) y **estudiantes** (participación y consulta). La interfaz es completamente en español.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 19, Vite, Tailwind CSS v4, shadcn/ui |
| Routing | React Router v7 (data mode con `createBrowserRouter`) |
| Estado del servidor | Apollo Client 4, GraphQL |
| Autorización frontend | CASL + componente `<Can>` |
| i18n | react-i18next (español por defecto) |
| Backend | NestJS 10, Apollo Server, CQRS |
| Autenticación | Passport JWT (access + refresh tokens) |
| Autorización backend | CASL guards + handlers |
| Base de datos | PostgreSQL 17, Prisma 7, Kysely |
| Almacenamiento | Cloudinary |
| IA — Transcripción | Groq Whisper |
| IA — Resúmenes | Google Gemini |
| Monorepo | Turborepo + pnpm workspaces |
| Despliegue | Vercel (frontend) + Render (backend) |

---

## Roles de Usuario

| Rol | Email de prueba | Capacidades principales |
|-----|----------------|------------------------|
| **Administrador** | `admin@ceicavs.edu` | Todo: CRUD usuarios, grupos, asistencia, blog, herramientas, transcripciones |
| **Docente** | `teacher@ceicavs.edu` | Grupos, asistencia, blog (con revisión), herramientas, transcripciones |
| **Estudiante** | `student@ceicavs.edu` | Ver asistencia propia, blog (con aprobación previa), herramientas |

Guías detalladas por rol:
- [Guía del Administrador](roles/admin.md)
- [Guía del Docente](roles/teacher.md)
- [Guía del Estudiante](roles/student.md)

---

## Flujos por Módulo

### Autenticación

#### Iniciar sesión
Todos los usuarios acceden a la plataforma mediante el formulario de login en `/login`. Ingresan correo institucional y contraseña. El sistema devuelve tokens JWT almacenados en `localStorage`.

**Roles:** Todos | **URL:** `/login`

Ver: [Flujo de inicio de sesión](flows/auth-login.md)

---

### Panel de Control

El dashboard en `/dashboard` muestra contenido diferente según el rol:

#### Panel del Administrador
Estadísticas globales: usuarios por rol, estado del blog, asistencia general, actividad reciente y accesos rápidos.

**Roles:** Admin | **URL:** `/dashboard`

Ver: [Panel del Administrador](flows/dashboard-admin.md)

#### Panel del Docente
Estadísticas de grupos: asistencia de sus grupos, actividad reciente, accesos rápidos.

**Roles:** Docente | **URL:** `/dashboard`

Ver: [Panel del Docente](flows/dashboard-teacher.md)

#### Panel del Estudiante
Asistencia personal: gráfica de asistencia propia, estadísticas resumen, actividad reciente.

**Roles:** Estudiante | **URL:** `/dashboard`

Ver: [Panel del Estudiante](flows/dashboard-student.md)

---

### Personas

#### Gestión de usuarios (solo admin)
Tabla de todos los usuarios con búsqueda, filtros por rol, creación, edición, eliminación individual y en masa.

**Roles:** Admin | **URL:** `/people`

Ver: [Gestión de Usuarios](flows/people-manage-users.md)

#### Importar usuarios desde CSV (solo admin)
Carga masiva de usuarios mediante archivo CSV con columnas: nombre, correo, contraseña, rol.

**Roles:** Admin | **URL:** `/people`

Ver: [Importar CSV](flows/people-csv-import.md)

#### Gestión de grupos
Cuadrícula de grupos con creación, edición, eliminación y gestión de miembros (agregar/remover).

**Roles:** Admin, Docente | **URL:** `/people` → pestaña Grupos

Ver: [Gestión de Grupos](flows/people-manage-groups.md)

---

### Asistencia

#### Ver grupos de asistencia
Cuadrícula de tarjetas de grupos disponibles. Admins y docentes ven todos; estudiantes solo los suyos.

**Roles:** Todos | **URL:** `/attendance`

Ver: [Ver Grupos de Asistencia](flows/attendance-view-groups.md)

#### Tomar asistencia
Abrir el roster de un grupo, marcar estado de cada estudiante (presente/ausente/tardanza/justificado) y guardar.

**Roles:** Admin, Docente | **URL:** `/attendance/:id`

Ver: [Tomar Asistencia](flows/attendance-take.md)

#### Ver reporte de asistencia
En la pestaña **Reportes** del detalle de grupo: tabla de estadísticas por estudiante con selector de período (Diario / Semanal / Mensual) y navegación de fechas con flechas. Muestra tasa de asistencia con barra de progreso codificada por color, y conteos de Presente / Ausente / Tardanza / Justificado.

**Roles:** Todos (estudiantes solo ven su fila) | **URL:** `/attendance/:id` → pestaña Reportes

Ver: [Ver Reporte](flows/attendance-view-report.md)

#### Exportar reporte
Exportar datos de asistencia del grupo en formato CSV o PDF.

**Roles:** Admin, Docente | **URL:** `/attendance/:id`

Ver: [Exportar Asistencia](flows/attendance-export.md)

#### Historial individual de estudiante
Historial detallado de asistencia de un estudiante específico con estadísticas resumen.

**Roles:** Todos (estudiantes solo ven el propio) | **URL:** `/attendance/:id`

Ver: [Historial de Estudiante](flows/attendance-student-history.md)

---

### Blog

#### Ver feed del blog
Cuadrícula de publicaciones publicadas con filtro por categoría y paginación.

**Roles:** Todos | **URL:** `/blog`

Ver: [Ver Feed](flows/blog-view-feed.md)

#### Ver publicación
Detalle completo: contenido, reacciones con emojis, sección de comentarios con hilos.

**Roles:** Todos | **URL:** `/blog/:id`

Ver: [Ver Publicación](flows/blog-view-post.md)

#### Crear publicación
Formulario con título, extracto, contenido, categoría e imágenes. Admin/Docente publican directamente; Estudiantes envían para revisión.

**Roles:** Todos | **URL:** `/blog/new`

Ver: [Crear Publicación](flows/blog-create-post.md)

#### Cola de revisión de borradores
Lista de publicaciones enviadas por estudiantes pendientes de aprobación. El revisor aprueba (publica) o rechaza (con nota).

**Roles:** Admin, Docente | **URL:** `/blog/queue`

Ver: [Cola de Revisión](flows/blog-draft-queue.md)

#### Gestión de categorías
CRUD de categorías que organizan las publicaciones del blog.

**Roles:** Admin, Docente | **URL:** `/blog/categories`

Ver: [Gestión de Categorías](flows/blog-categories.md)

#### Mis borradores
Lista de publicaciones propias con estado draft o rejected, con opción de editar y reenviar.

**Roles:** Todos | **URL:** `/blog/drafts`

Ver: [Mis Borradores](flows/blog-my-drafts.md)

---

### Herramientas Educativas

#### Catálogo de herramientas
Cuadrícula con 13 herramientas organizadas por categoría. El usuario puede marcar favoritas.

**Roles:** Todos | **URL:** `/tools`

Ver: [Explorar Herramientas](flows/tools-browse.md)

#### Herramientas disponibles

| Herramienta | URL | Tipo |
|-------------|-----|------|
| Temporizador | `/tools/countdown-timer` | Local |
| Organizador de tareas | `/tools/task-organizer` | GraphQL (sincronizado) |
| Convertidor Word/PDF | `/tools/word-pdf-converter` | REST API |
| Convertidor de imágenes | `/tools/image-format-converter` | Local/REST |
| Descargador de YouTube | `/tools/youtube-downloader` | REST API |
| Compresor de imágenes | `/tools/image-compressor` | Local/REST |
| Generador de QR | `/tools/qr-code-generator` | Local |
| Imagen a texto (OCR) | `/tools/screenshot-to-text` | IA (OCR) |
| Notas rápidas | `/tools/quick-notes` | GraphQL (sincronizado) |
| Calculadora científica | `/tools/scientific-calculator` | Local |
| Generador de contraseñas | `/tools/password-generator` | Local |
| Ruleta | `/tools/roulette` | Local |
| Selector de estudiante | `/tools/random-student-picker` | GraphQL (grupos) |

Ver flujos individuales en la carpeta `flows/tools-*.md`.

---

### Transcripción con IA

#### Lista de grabaciones
Tarjetas de grabaciones del usuario con estado de transcripción y opciones de gestión.

**Roles:** Admin, Docente | **URL:** `/transcription`

Ver: [Lista de Grabaciones](flows/transcription-list.md)

#### Subir audio para transcripción
Carga de archivo de audio (MP3, WAV, M4A). Transcripción automática con Groq Whisper.

**Roles:** Admin, Docente | **URL:** `/transcription/new`

Ver: [Subir Audio](flows/transcription-record.md)

#### Ver transcripción y generar resumen
Reproductor de audio, transcripción completa editable, generación de resumen con Gemini (puntos clave + elementos de acción).

**Roles:** Admin, Docente | **URL:** `/transcription/:id`

Ver: [Ver Transcripción](flows/transcription-view.md)

---

## Integraciones Externas

| Servicio | Propósito | Flujo relacionado |
|----------|-----------|-------------------|
| **Cloudinary** | Almacenamiento de archivos de audio y publicId para gestión | Transcripción |
| **Groq Whisper** | Transcripción de audio a texto con alta precisión | `/transcription/new` |
| **Google Gemini** | Generación de resúmenes, puntos clave y elementos de acción | `/transcription/:id` |
| **yt-dlp / YouTube Data API** | Metadatos y descarga de videos de YouTube | `/tools/youtube-downloader` |

---

## Permisos por Rol

| Función | Admin | Docente | Estudiante |
|---------|:-----:|:-------:|:----------:|
| Ver dashboard personalizado | ✓ | ✓ | ✓ |
| Estadísticas globales | ✓ | — | — |
| CRUD de usuarios | ✓ | — | — |
| Importar usuarios CSV | ✓ | — | — |
| CRUD de grupos | ✓ | ✓ | — |
| Gestión de miembros de grupo | ✓ | ✓ | — |
| Tomar asistencia | ✓ | ✓ | — |
| Ver asistencia de otros | ✓ | ✓ | — |
| Ver propia asistencia | ✓ | ✓ | ✓ |
| Exportar asistencia | ✓ | ✓ | — |
| Publicar en blog directamente | ✓ | ✓ | — |
| Enviar publicación para revisión | ✓ | ✓ | ✓ |
| Revisar borradores del blog | ✓ | ✓ | — |
| Gestionar categorías del blog | ✓ | ✓ | — |
| Usar herramientas educativas | ✓ | ✓ | ✓ |
| Subir y transcribir audio | ✓ | ✓ | — |
| Ver transcripciones propias | ✓ | ✓ | — |

---

## Capacidades y Limitaciones

### Capacidades

- **Multi-rol:** Un solo sistema con experiencias diferenciadas por rol.
- **Autorización granular:** CASL garantiza que cada acción sea verificada tanto en el frontend (UI) como en el backend (handler), sin posibilidad de bypass.
- **Transcripción con IA:** Integración completa con Groq Whisper + Gemini para convertir audio a texto y generar resúmenes estructurados.
- **Blog con flujo de aprobación:** Los estudiantes pueden contribuir contenido que pasa por revisión editorial antes de publicarse.
- **Herramientas sin instalación:** 13 herramientas educativas accesibles desde el navegador sin instalar nada.
- **Soft delete:** Los registros eliminados se marcan con `deletedAt` pero no se borran de la base de datos, permitiendo auditoría y recuperación manual.
- **Tipado extremo:** Desde el schema GraphQL hasta los componentes React, todos los tipos son generados automáticamente por codegen, eliminando discrepancias.

### Limitaciones

- **Sin recuperación de contraseñas:** No hay flujo de "olvidé mi contraseña"; el administrador debe resetear contraseñas manualmente.
- **Sin notificaciones en tiempo real:** No hay WebSockets; el estado de transcripción requiere recargar la página o polling para actualizarse.
- **Transcripción limitada a admin/docente:** Los estudiantes no tienen acceso a esta función aunque pudiera ser útil para notas de clase.
- **Sin soporte offline:** La aplicación requiere conexión a internet para todas las funciones excepto las herramientas locales.
- **Idioma único:** La plataforma está en español; no hay selector de idioma para otros idiomas.
- **Sin app móvil nativa:** Es una PWA-compatible (responsive) pero no hay aplicación nativa para iOS/Android.
- **Tamaño de archivo de audio no documentado:** No hay límite explícito documentado en la UI para el tamaño máximo de archivos de audio.

---

## Glosario

| Término | Definición |
|---------|------------|
| **Asistencia** | Registro del estado de presencia de los estudiantes en una sesión de clase |
| **Borrador** | Publicación de blog con estado `draft` pendiente de aprobación |
| **CASL** | Librería de autorización que define qué acciones puede realizar cada rol |
| **CQRS** | Command Query Responsibility Segregation — patrón de separación de lecturas y escrituras |
| **Cloudinary** | Servicio de almacenamiento en la nube para archivos multimedia |
| **Codegen** | Proceso de generación automática de tipos TypeScript a partir del schema GraphQL |
| **Gemini** | Modelo de IA de Google usado para generar resúmenes de transcripciones |
| **Grupo** | Conjunto de estudiantes usado como unidad para el registro de asistencia |
| **Groq Whisper** | Servicio de IA para transcripción de audio a texto |
| **Roster** | Lista de estudiantes de un grupo usada para tomar asistencia |
| **Soft delete** | Eliminación lógica: el registro se marca con `deletedAt` pero no se borra físicamente |
| **Transcripción** | Conversión de audio a texto mediante IA |
| **JWT** | JSON Web Token — formato del token de autenticación |
| **Subject** | Entidad sobre la que se verifica un permiso CASL (USER, GROUP, POST, etc.) |
| **Action** | Operación que se verifica en CASL (CREATE, READ, UPDATE, DELETE) |
