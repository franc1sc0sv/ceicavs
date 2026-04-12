# Guía del Docente

El docente tiene acceso a la mayoría de las funciones de CEICAVS, con excepción de la gestión de usuarios (crear/editar/eliminar usuarios es exclusivo del administrador). El docente puede gestionar grupos, registrar asistencia, administrar el blog, usar herramientas y trabajar con transcripciones de audio.

## Panel de Control

Al iniciar sesión, el docente ve el **Panel de Control del Docente** en `/dashboard` con información relevante para sus grupos:

- Estadísticas de asistencia de sus grupos
- Gráficas de tendencia de asistencia por grupo
- Actividad reciente (borradores pendientes, asistencia registrada)
- Accesos rápidos a las secciones más utilizadas

Ver: [Panel de Control del Docente](../flows/dashboard-teacher.md)

## Personas (`/people`)

El docente puede ver la lista de usuarios pero **no puede crearlos, editarlos ni eliminarlos**. Esa función es exclusiva del administrador.

### Grupos (docente puede crear y gestionar)

El docente tiene control total sobre los grupos:
- Ver todos los grupos de la plataforma
- **Crear nuevos grupos** con nombre y descripción
- **Editar grupos existentes**
- **Eliminar grupos** (con confirmación)
- **Ver miembros** de cada grupo
- **Agregar y remover miembros** de grupos

Ver: [Gestión de Grupos](../flows/people-manage-groups.md)

## Asistencia (`/attendance`)

El docente tiene acceso completo a la funcionalidad de asistencia.

### Ver grupos
El docente ve todos los grupos de la plataforma. Ver: [Ver Grupos de Asistencia](../flows/attendance-view-groups.md)

### Tomar asistencia
Función principal del docente. En `/attendance/:id`, abre el roster y registra la asistencia de cada estudiante. Ver: [Tomar Asistencia](../flows/attendance-take.md)

### Ver reportes
Visualiza reportes de asistencia por período para cualquier grupo. Ver: [Ver Reporte de Asistencia](../flows/attendance-view-report.md)

### Exportar reportes
Exporta datos de asistencia en CSV o PDF. Ver: [Exportar Asistencia](../flows/attendance-export.md)

### Historial de estudiantes
Puede ver el historial detallado de asistencia de cualquier estudiante en sus grupos. Ver: [Historial de Estudiante](../flows/attendance-student-history.md)

## Blog (`/blog`)

### Explorar el feed
El docente navega por todas las publicaciones publicadas y puede filtrar por categoría. Ver: [Ver Feed del Blog](../flows/blog-view-feed.md)

### Leer y reaccionar
Puede leer publicaciones completas, reaccionar con emojis y dejar comentarios. Ver: [Ver Publicación](../flows/blog-view-post.md)

### Crear publicaciones
El docente publica directamente sin pasar por revisión. Sus publicaciones son visibles de inmediato. Ver: [Crear Publicación](../flows/blog-create-post.md)

### Revisar borradores de estudiantes
El docente accede a `/blog/queue` para aprobar o rechazar las publicaciones enviadas por estudiantes. Esta es una responsabilidad compartida con el administrador. Ver: [Cola de Revisión](../flows/blog-draft-queue.md)

### Gestionar categorías
El docente puede crear, editar y eliminar categorías del blog. Ver: [Gestión de Categorías](../flows/blog-categories.md)

### Mis borradores
Si guardó publicaciones sin publicar, las encuentra en `/blog/drafts`. Ver: [Mis Borradores](../flows/blog-my-drafts.md)

## Herramientas (`/tools`)

El docente tiene acceso al mismo catálogo de herramientas que el administrador. Ver: [Explorar Herramientas](../flows/tools-browse.md)

Las herramientas más útiles para el docente incluyen:
- [Selector de Estudiante](../flows/tools-random-student-picker.md) — Para seleccionar participantes al azar en clase
- [Ruleta](../flows/tools-roulette.md) — Para sorteos y dinámicas grupales
- [Temporizador](../flows/tools-countdown-timer.md) — Para controlar tiempos de exámenes
- [Organizador de Tareas](../flows/tools-task-organizer.md) — Para gestionar pendientes personales
- [Simplificador de Texto](../flows/tools-text-simplifier.md) — Para adaptar material educativo

## Transcripción con IA (`/transcription`)

El docente tiene acceso completo a la sección de transcripción, igual que el administrador:

### Ver grabaciones
Lista de todas sus propias grabaciones en `/transcription`. Ver: [Lista de Grabaciones](../flows/transcription-list.md)

### Subir audio
Sube archivos de audio (clases, conferencias, notas de voz) en `/transcription/new`. La transcripción se genera automáticamente con Groq Whisper. Ver: [Subir Audio](../flows/transcription-record.md)

### Ver transcripción y generar resumen
En `/transcription/:id`, reproduce el audio, lee la transcripción y genera resúmenes con puntos clave y elementos de acción usando Gemini. Ver: [Ver Transcripción](../flows/transcription-view.md)

## Lo Que el Docente NO Puede Hacer

| Acción | Razón |
|--------|-------|
| Crear, editar o eliminar usuarios | Exclusivo del administrador |
| Importar usuarios desde CSV | Exclusivo del administrador |
| Ver estadísticas globales de la plataforma | Solo disponibles en el panel del administrador |
| Ver grabaciones de otros docentes | Las transcripciones son privadas por usuario |
