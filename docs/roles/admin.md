# Guía del Administrador

El administrador tiene acceso completo a todas las funciones de CEICAVS. Es el único rol que puede gestionar usuarios, y tiene acceso a todas las capacidades de docentes y estudiantes.

## Panel de Control

Al iniciar sesión, el administrador ve el **Panel de Control del Administrador** en `/dashboard` con estadísticas globales de la plataforma:

- Conteo de usuarios por rol (administradores, docentes, estudiantes)
- Estado de publicaciones del blog (publicadas, borradores, rechazadas)
- Total de grupos activos
- Gráfica de asistencia de toda la plataforma (últimos 30 días)
- Feed de actividad reciente de todos los usuarios
- Accesos rápidos a Personas, Asistencia y Blog

Ver: [Panel de Control del Administrador](../flows/dashboard-admin.md)

## Gestión de Personas (`/people`)

La sección de Personas es de acceso exclusivo al administrador (para usuarios) y compartido con docentes (para grupos).

### Usuarios (solo admin)

El administrador puede:
- Ver todos los usuarios en una tabla con búsqueda y filtros por rol
- Crear nuevos usuarios con nombre, correo, contraseña y rol
- Editar cualquier usuario (cambiar nombre, correo o rol)
- Eliminar usuarios individualmente (soft delete)
- Eliminar múltiples usuarios en masa (bulk delete)
- Importar usuarios desde un archivo CSV

Ver: [Gestión de Usuarios](../flows/people-manage-users.md) | [Importar CSV](../flows/people-csv-import.md)

### Grupos (admin y docente)

El administrador puede:
- Ver todos los grupos en una cuadrícula de tarjetas
- Crear nuevos grupos (nombre + descripción)
- Editar grupos existentes
- Eliminar grupos
- Ver los miembros de cada grupo
- Agregar y remover miembros de grupos

Ver: [Gestión de Grupos](../flows/people-manage-groups.md)

## Asistencia (`/attendance`)

### Ver grupos de asistencia
El administrador ve todos los grupos de la plataforma en `/attendance`. Ver: [Ver Grupos de Asistencia](../flows/attendance-view-groups.md)

### Tomar asistencia
El administrador puede registrar asistencia para cualquier grupo. En `/attendance/:id`, abre el roster, marca el estado de cada estudiante (presente, ausente, tardanza, justificado) y guarda. Ver: [Tomar Asistencia](../flows/attendance-take.md)

### Ver reportes de asistencia
En `/attendance/:id`, el administrador abre la pestaña **Reportes**, selecciona un período (Diario / Semanal / Mensual) y navega entre fechas para ver la tabla con estadísticas por estudiante. Ver: [Ver Reporte de Asistencia](../flows/attendance-view-report.md)

### Exportar reportes
El administrador puede exportar reportes de asistencia en CSV o PDF. Ver: [Exportar Asistencia](../flows/attendance-export.md)

### Historial individual de estudiante
Desde el reporte, puede hacer clic en cualquier estudiante para ver su historial detallado. Ver: [Historial de Estudiante](../flows/attendance-student-history.md)

## Blog (`/blog`)

### Explorar el feed
El administrador ve todas las publicaciones publicadas. Puede filtrar por categoría. Ver: [Ver Feed del Blog](../flows/blog-view-feed.md)

### Ver publicaciones
Puede leer cualquier publicación, reaccionar con emojis y dejar comentarios. Ver: [Ver Publicación](../flows/blog-view-post.md)

### Crear publicaciones
El administrador publica artículos directamente (sin pasar por revisión). Las publicaciones son visibles de inmediato en el feed. Ver: [Crear Publicación](../flows/blog-create-post.md)

### Revisar borradores
El administrador accede a `/blog/queue` para aprobar o rechazar borradores enviados por estudiantes. Ver: [Cola de Revisión](../flows/blog-draft-queue.md)

### Gestionar categorías
Solo administradores y docentes pueden crear, editar y eliminar categorías en `/blog/categories`. Ver: [Gestión de Categorías](../flows/blog-categories.md)

### Mis borradores
Si el administrador guardó publicaciones sin publicar, las encuentra en `/blog/drafts`. Ver: [Mis Borradores](../flows/blog-my-drafts.md)

## Herramientas (`/tools`)

El administrador tiene acceso a todas las herramientas del catálogo. Ver: [Explorar Herramientas](../flows/tools-browse.md)

Herramientas disponibles:
- [Temporizador](../flows/tools-countdown-timer.md)
- [Organizador de Tareas](../flows/tools-task-organizer.md)
- [Convertidor Word/PDF](../flows/tools-word-pdf-converter.md)
- [Convertidor de Imágenes](../flows/tools-image-format-converter.md)
- [Descargador de YouTube](../flows/tools-youtube-downloader.md)
- [Compresor de Imágenes](../flows/tools-image-compressor.md)
- [Generador de QR](../flows/tools-qr-code-generator.md)
- [Imagen a Texto (OCR)](../flows/tools-screenshot-to-text.md)
- [Notas Rápidas](../flows/tools-quick-notes.md)
- [Calculadora Científica](../flows/tools-scientific-calculator.md)
- [Generador de Contraseñas](../flows/tools-password-generator.md)
- [Ruleta](../flows/tools-roulette.md)
- [Selector de Estudiante](../flows/tools-random-student-picker.md)

## Transcripción con IA (`/transcription`)

El administrador tiene acceso completo a la sección de transcripción:

### Ver grabaciones
Lista de todas sus grabaciones en `/transcription`. Ver: [Lista de Grabaciones](../flows/transcription-list.md)

### Subir audio
Sube archivos de audio en `/transcription/new` para obtener transcripción automática con Groq Whisper. Ver: [Subir Audio](../flows/transcription-record.md)

### Ver transcripción y resumen
En `/transcription/:id`, reproduce el audio, lee la transcripción y genera resúmenes con IA (Gemini). Ver: [Ver Transcripción](../flows/transcription-view.md)

## Permisos Exclusivos del Administrador

| Acción | Ruta | Descripción |
|--------|------|-------------|
| Crear/editar/eliminar usuarios | `/people` | CRUD completo de usuarios |
| Importar usuarios CSV | `/people` | Carga masiva de usuarios |
| Ver estadísticas globales | `/dashboard` | Panel con datos de toda la plataforma |
| Eliminar publicaciones de otros | `/blog` | Control editorial completo |
