# Cola de Revisión

**Category:** Blog
**Access:** Administrador, Docente
**URL:** `/blog/queue`

## What This Does

Administradores y docentes revisan las publicaciones enviadas por estudiantes que están esperando aprobación (estado `pending`). Pueden aprobar una publicación para que aparezca en el feed, o rechazarla con una nota explicativa que queda visible para el estudiante.

## Step-by-Step Walkthrough

### 1. Abrir la cola de revisión
El usuario navega a `/blog/queue`. Se muestra una lista de publicaciones con estado `pending` enviadas por estudiantes, ordenadas de más antiguas a más recientes para incentivar la revisión de las más esperadas.

### 2. Revisar el contenido de una publicación
Cada ítem de la cola muestra:
- Título de la publicación
- Autor (estudiante que la envió)
- Fecha de envío
- Extracto del contenido
- Botón "Ver completo" para leer el artículo íntegro antes de decidir

### 3. Aprobar una publicación
El revisor hace clic en "Aprobar" en la publicación deseada. Se ejecuta la mutación `reviewDraft` con `status: "published"`. La publicación desaparece de la cola y aparece en el feed del blog.

### 4. Rechazar una publicación
El revisor hace clic en "Rechazar". Se abre un campo de texto para ingresar el motivo del rechazo (nota de rechazo). Al confirmar, se ejecuta `reviewDraft` con `status: "rejected"` y la nota. La publicación desaparece de la cola y el estudiante puede ver el motivo en `/blog/drafts` (pestaña "Borradores").

## Important Notes

- Solo admin y docentes tienen acceso a `/blog/queue`.
- La cola solo muestra publicaciones con estado `pending` — los borradores guardados (`draft`) no aparecen aquí.
- Una publicación rechazada puede ser editada por el estudiante y reenviada para revisión, volviendo a estado `pending`.
- La nota de rechazo es visible únicamente para el autor del borrador; debe ser constructiva y clara.
- Si la cola está vacía, se muestra un mensaje indicando que no hay publicaciones pendientes de revisión.
- Intentar revisar una publicación que no está en estado `pending` devuelve un error de validación.

## What Can Go Wrong

### Sin publicaciones pendientes
**Disparador:** Ningún estudiante ha enviado publicaciones para revisión.
**Corrección:** Estado vacío con mensaje informativo. No se requiere acción.

### Publicación ya revisada
**Disparador:** Otro revisor aprobó o rechazó la publicación mientras se leía.
**Corrección:** La mutación falla con error de validación; la publicación desaparece de la cola al recargar.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query draftQueue`, `mutation reviewDraft(input: ReviewDraftInput!)`

**Frontend Component:** `apps/web/src/features/blog/pages/draft-queue-page.tsx`

**Database Entities:** `Post` (campos `status`, `rejectionNote`)

**Status filter:** Solo se retornan posts con `status = "pending"` — borradores sin enviar no aparecen en la cola.

**CASL Permission:** `Action.UPDATE` + `Subject.POST` con restricción de revisión a admin y teacher
</details>
