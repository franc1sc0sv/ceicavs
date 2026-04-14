# Guía del Estudiante

El estudiante tiene acceso a las funciones de consulta y participación de CEICAVS. No puede gestionar usuarios ni grupos, no toma asistencia, y no tiene acceso a transcripciones de audio. Sus publicaciones en el blog requieren aprobación antes de ser visibles para todos.

## Panel de Control

Al iniciar sesión, el estudiante ve el **Panel de Control del Estudiante** en `/dashboard` con su información personal:

- Gráfica de su propia asistencia a lo largo del tiempo
- Estadísticas personales: presentes, ausentes, tardanzas, justificados
- Porcentaje general de asistencia
- Actividad reciente de la plataforma relevante para el estudiante

Ver: [Panel de Control del Estudiante](../flows/dashboard-student.md)

## Asistencia (`/attendance`)

El estudiante puede **consultar** su asistencia pero no puede registrarla.

### Ver grupos inscritos
En `/attendance`, el estudiante ve únicamente los grupos en los que está inscrito. Si no pertenece a ningún grupo, verá un estado vacío. Ver: [Ver Grupos de Asistencia](../flows/attendance-view-groups.md)

### Ver reporte de asistencia propio
Al entrar a un grupo en `/attendance/:id` y abrir la pestaña **Reportes**, el estudiante puede ver el reporte de asistencia con el selector de período (Diario / Semanal / Mensual), pero **solo verá su propia fila**; no tiene acceso a los datos de asistencia de otros compañeros. Ver: [Ver Reporte de Asistencia](../flows/attendance-view-report.md)

### Ver su historial individual
El estudiante puede hacer clic en su propia fila del reporte para ver el historial detallado de su asistencia: estado de cada sesión registrada y estadísticas de resumen. Ver: [Historial de Asistencia](../flows/attendance-student-history.md)

## Blog (`/blog`)

El estudiante puede leer, reaccionar y comentar libremente. Cuando crea una publicación, esta va a una cola de revisión antes de aparecer en el feed.

### Explorar el feed
El estudiante navega por todas las publicaciones publicadas y puede filtrar por categoría. Ver: [Ver Feed del Blog](../flows/blog-view-feed.md)

### Leer publicaciones y participar
Puede leer artículos completos, reaccionar con emojis (👍, ❤️, 😂, etc.) y dejar comentarios o respuestas. Ver: [Ver Publicación](../flows/blog-view-post.md)

### Crear y enviar publicaciones para revisión
El estudiante puede crear publicaciones propias en `/blog/new`. Al hacer clic en "Enviar para revisión", la publicación queda en estado "borrador" y va a la cola de revisión del administrador/docente. No aparece en el feed público hasta ser aprobada.

Ver: [Crear Publicación](../flows/blog-create-post.md)

### Ver el estado de sus publicaciones
En `/blog/drafts`, el estudiante puede ver todas sus publicaciones pendientes de revisión o rechazadas, junto con la nota de rechazo si aplica. Puede editar publicaciones rechazadas y reenviarlas.

Ver: [Mis Borradores](../flows/blog-my-drafts.md)

## Herramientas (`/tools`)

El estudiante tiene acceso al mismo catálogo de herramientas que los demás roles. Ver: [Explorar Herramientas](../flows/tools-browse.md)

Las herramientas más relevantes para el estudiante:
- [Temporizador](../flows/tools-countdown-timer.md) — Para gestionar tiempos de estudio
- [Organizador de Tareas](../flows/tools-task-organizer.md) — Para organizar tareas y trabajos
- [Calculadora Científica](../flows/tools-scientific-calculator.md) — Para cálculos matemáticos
- [Generador de QR](../flows/tools-qr-code-generator.md) — Para compartir información
- [Notas Rápidas](../flows/tools-quick-notes.md) — Para apuntes rápidos en clase
- [Imagen a Texto (OCR)](../flows/tools-screenshot-to-text.md) — Para digitalizar apuntes escritos a mano

## Lo Que el Estudiante NO Puede Hacer

| Acción | Razón |
|--------|-------|
| Acceder a `/people` | Sin permisos para gestionar usuarios o grupos |
| Crear, editar o eliminar usuarios/grupos | Exclusivo de admin y docente |
| Tomar asistencia | Solo admin y docente pueden registrar asistencia |
| Ver asistencia de otros estudiantes | Los datos son privados por usuario |
| Exportar reportes de asistencia | Exclusivo de admin y docente |
| Aprobar o rechazar borradores | Exclusivo de admin y docente |
| Acceder a `/transcription` | Exclusivo de admin y docente |
| Publicar directamente en el blog | Sus publicaciones requieren aprobación previa |
| Ver estadísticas globales | Solo disponible en el panel del administrador |
