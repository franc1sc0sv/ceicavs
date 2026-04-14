# Mis Borradores

**Category:** Blog
**Access:** Todos los roles (cada usuario ve sus propios borradores)
**URL:** `/blog/drafts`

## What This Does

Cada usuario puede ver y gestionar todas sus publicaciones no publicadas desde dos pestañas: "Borradores" (trabajo en progreso y rechazados) y "En Revisión" (publicaciones enviadas esperando aprobación del docente).

## Step-by-Step Walkthrough

### 1. Abrir mis borradores
El usuario navega a `/blog/drafts`. Se muestran dos pestañas: **Borradores** y **En Revisión**. La pestaña activa por defecto es "Borradores".

### 2. Pestaña "Borradores" (draft + rejected)
Muestra publicaciones con estado `draft` o `rejected`, ordenadas por fecha de última modificación. Cada ítem muestra:
- Título de la publicación
- Estado: "Borrador" o "Rechazado"
- Fecha de último guardado o de rechazo
- Para publicaciones rechazadas: la nota del revisor con el motivo
- Botón "Editar" para modificar el contenido

### 3. Pestaña "En Revisión" (pending)
Muestra publicaciones con estado `pending` que ya fueron enviadas y están esperando aprobación. La pestaña tiene una insignia ámbar con el conteo de publicaciones pendientes. Cada ítem muestra:
- Título de la publicación
- Ícono de reloj indicando que está en espera
- Fecha de envío
- Sin botón "Editar" — no se puede modificar una publicación ya enviada

### 4. Editar y reenviar un borrador rechazado
Si una publicación fue rechazada, el usuario puede hacer clic en "Editar" para modificarla según la nota del revisor. Al guardar los cambios, la publicación vuelve a estado `draft`. Al hacer clic en "Enviar para revisión", regresa a estado `pending` y aparece de nuevo en la cola del docente.

### 5. Eliminar un borrador
El usuario puede eliminar una publicación con estado `draft` o `rejected` haciendo clic en eliminar. Se ejecuta `deletePost`. Las publicaciones `pending` no pueden eliminarse mientras están en revisión.

## Important Notes

- La pestaña "En Revisión" muestra una insignia ámbar con el conteo cuando hay publicaciones `pending`.
- Los borradores `draft` sin enviar nunca aparecen en la cola de revisión del docente.
- La nota de rechazo es visible únicamente para el autor; no es pública.
- Los admins y docentes también ven esta página si guardaron publicaciones como borrador, aunque normalmente publican directamente.

## What Can Go Wrong

### Sin borradores
**Disparador:** El usuario no ha creado ninguna publicación o todas han sido publicadas.
**Corrección:** Estado vacío con mensaje informativo y enlace para crear una nueva publicación.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query myDrafts`, `mutation updatePost`, `mutation deletePost`

**Frontend Component:** `apps/web/src/features/blog/pages/my-drafts-page.tsx`

**Database Entities:** `Post` (filtrado por `authorId` del usuario autenticado y `status IN (draft, rejected, pending)`)

**Tab logic:**
- "Borradores" tab → `status IN (draft, rejected)` — editable, botón Editar disponible
- "En Revisión" tab → `status = pending` — solo lectura, insignia ámbar con conteo
</details>
