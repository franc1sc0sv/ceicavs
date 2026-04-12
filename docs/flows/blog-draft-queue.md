# Cola de Revisión de Borradores

**Category:** Blog
**Access:** Administrador, Docente
**URL:** `/blog/queue`

## What This Does

Administradores y docentes revisan las publicaciones enviadas por estudiantes que están esperando aprobación. Pueden aprobar una publicación para que aparezca en el feed, o rechazarla con una nota explicativa que se le notifica al estudiante.

## Step-by-Step Walkthrough

### 1. Abrir la cola de revisión
El usuario navega a `/blog/queue`. Se muestra una lista de publicaciones con estado "borrador" (draft) enviadas por estudiantes, ordenadas de más antiguas a más recientes para incentivar la revisión de las más esperadas.

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
El revisor hace clic en "Rechazar". Se abre un campo de texto para ingresar el motivo del rechazo (nota de rechazo). Al confirmar, se ejecuta `reviewDraft` con `status: "rejected"` y la nota. La publicación desaparece de la cola y el estudiante puede ver el motivo en `/blog/drafts`.

## Important Notes

- Solo admin y docentes tienen acceso a `/blog/queue`.
- Una publicación rechazada puede ser editada por el estudiante y reenviada para revisión.
- La nota de rechazo es visible para el estudiante en su vista de borradores; debe ser constructiva y clara.
- Si la cola está vacía, se muestra un mensaje indicando que no hay borradores pendientes.

## What Can Go Wrong

### Sin borradores pendientes
**Disparador:** Ningún estudiante ha enviado publicaciones para revisión.
**Corrección:** Estado vacío con mensaje informativo. No se requiere acción.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query draftQueue`, `mutation reviewDraft(input: ReviewDraftInput!)`

**Frontend Component:** `apps/web/src/features/blog/pages/draft-queue-page.tsx`

**Database Entities:** `Post` (campos `status`, `rejectionNote`)

**CASL Permission:** `Action.UPDATE` + `Subject.POST` con restricción de revisión a admin y teacher
</details>
