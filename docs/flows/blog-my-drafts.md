# Mis Borradores

**Category:** Blog
**Access:** Todos los roles (cada usuario ve sus propios borradores)
**URL:** `/blog/drafts`

## What This Does

Cada usuario puede ver el estado de sus publicaciones que aún no están publicadas: borradores pendientes de revisión, borradores rechazados con la nota del revisor, y borradores guardados que aún no han sido enviados.

## Step-by-Step Walkthrough

### 1. Abrir mis borradores
El usuario navega a `/blog/drafts`. Se muestra una lista de todas sus publicaciones con estado "draft" o "rejected", ordenadas por fecha de última modificación.

### 2. Ver el estado de cada borrador
Cada ítem de la lista muestra:
- Título de la publicación
- Estado actual: "Pendiente de revisión" o "Rechazado"
- Fecha de envío o de rechazo
- Para publicaciones rechazadas: la nota del revisor explicando el motivo

### 3. Editar y reenviar un borrador rechazado
Si una publicación fue rechazada, el usuario puede hacer clic en "Editar" para modificarla según la nota del revisor. Al guardar los cambios, la publicación vuelve a estado "draft" y regresa a la cola de revisión.

### 4. Eliminar un borrador
El usuario puede eliminar un borrador que ya no desea publicar haciendo clic en eliminar. Se ejecuta `deletePost`.

## Important Notes

- Los borradores pendientes no son visibles para otros usuarios hasta ser aprobados.
- La nota de rechazo es visible únicamente para el autor del borrador.
- Los admins y docentes también tienen borradores si guardaron una publicación sin publicar, aunque normalmente publican directamente.

## What Can Go Wrong

### Sin borradores
**Disparador:** El usuario no ha creado ninguna publicación o todas han sido ya publicadas.
**Corrección:** Estado vacío con mensaje informativo y enlace para crear una nueva publicación.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query myDrafts`, `mutation updatePost`, `mutation deletePost`

**Frontend Component:** `apps/web/src/features/blog/pages/my-drafts-page.tsx`

**Database Entities:** `Post` (filtrado por `authorId` del usuario autenticado y `status != published`)
</details>
