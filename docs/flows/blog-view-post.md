# Ver Detalle de una Publicación

**Category:** Blog
**Access:** Administrador, Docente, Estudiante
**URL:** `/blog/:id`

## What This Does

El usuario abre el detalle completo de una publicación: lee el contenido íntegro, reacciona con emojis, lee los comentarios existentes, y puede agregar sus propios comentarios o respuestas a otros.

## Step-by-Step Walkthrough

### 1. Abrir una publicación
Desde el feed en `/blog`, el usuario hace clic en la tarjeta de una publicación. Es redirigido a `/blog/:id` donde se muestra el artículo completo.

### 2. Leer el contenido completo
La vista de detalle muestra:
- Imagen destacada (si existe) a tamaño completo
- Título del artículo
- Nombre del autor con avatar y fecha de publicación
- Categoría de la publicación
- Contenido enriquecido (texto, imágenes embebidas, etc.)

### 3. Reaccionar con emojis
Debajo del contenido, hay una barra de reacciones con emojis (👍, ❤️, 😂, 😮, etc.). El usuario hace clic en un emoji para registrar su reacción mediante la mutación `toggleReaction`. La cuenta de reacciones se actualiza visualmente de forma inmediata.

### 4. Leer los comentarios
Debajo de las reacciones, aparece la sección de comentarios con los comentarios existentes mostrados en formato hilo (comentarios principales y sus respuestas anidadas).

### 5. Agregar un comentario
El usuario escribe su comentario en el campo de texto al final de la sección de comentarios y hace clic en "Comentar". Se ejecuta la mutación `addComment` y el nuevo comentario aparece en el hilo.

### 6. Responder a un comentario
Al hacer clic en "Responder" bajo un comentario, aparece un campo de respuesta anidado. El usuario escribe su respuesta y la envía con `addComment` usando el `parentId` del comentario original.

## Important Notes

- Todos los usuarios autenticados pueden reaccionar y comentar en publicaciones publicadas.
- Un usuario puede cambiar su reacción haciendo clic en un emoji diferente o en el mismo para quitarla (toggle).
- Los comentarios no tienen aprobación previa; aparecen de inmediato al publicarse.
- Los comentarios pueden eliminarse por el propio autor o por un admin/teacher.

## What Can Go Wrong

### Publicación no encontrada
**Disparador:** La URL apunta a una publicación eliminada o que nunca existió.
**Corrección:** Se muestra una página de error 404. El usuario puede regresar al feed.

### Error al enviar comentario
**Disparador:** Problema de red o campo de comentario vacío.
**Corrección:** El botón de comentar está deshabilitado para texto vacío. Si hay error de red, se muestra un toast de error con opción de reintentar.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query post(id: ID!)`, `query comments(postId: ID!)`, `mutation addComment`, `mutation toggleReaction`

**Frontend Component:** `apps/web/src/features/blog/pages/post-detail-page.tsx`

**Database Entities:** `Post`, `Comment`, `Reaction`
</details>
