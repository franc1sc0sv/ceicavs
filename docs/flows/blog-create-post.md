# Crear una Publicación en el Blog

**Category:** Blog
**Access:** Administrador, Docente, Estudiante
**URL:** `/blog/new`

## What This Does

Cualquier usuario autenticado puede crear una publicación en el blog escolar. Los administradores y docentes publican directamente; los estudiantes envían sus publicaciones como borradores que requieren aprobación antes de aparecer en el feed.

## Step-by-Step Walkthrough

### 1. Abrir el formulario de creación
El usuario navega a `/blog/new` (mediante el botón "+ Nueva publicación" en el feed del blog o desde el menú). Se muestra el formulario de creación en blanco.

### 2. Completar el formulario
El formulario incluye los siguientes campos:
- **Título:** Título de la publicación (requerido)
- **Extracto:** Resumen breve que aparece en las tarjetas del feed (requerido)
- **Contenido:** Cuerpo completo del artículo con editor de texto enriquecido
- **Categoría:** Selector de categoría existente (opcional)
- **Imágenes:** Selector para subir imágenes adjuntas (opcional)

### 3. Publicar o enviar para revisión
- **Admin/Docente:** El botón dice "Publicar". Al hacer clic, la publicación aparece de inmediato en el feed.
- **Estudiante:** El botón dice "Enviar para revisión". La publicación se guarda como borrador y va a la cola de revisión (`draftQueue`). No aparece en el feed hasta ser aprobada.

## Important Notes

- El extracto es el texto que se muestra en la tarjeta del feed; si se deja vacío, el sistema usa los primeros 150 caracteres del contenido.
- Las imágenes se suben a Cloudinary y sus URLs se almacenan en `PostImage`.
- Una vez publicada por admin/docente, la publicación puede editarse desde `/blog/:id/edit`.
- Los estudiantes pueden ver el estado de sus borradores en `/blog/drafts`.

## What Can Go Wrong

### Formulario incompleto
**Disparador:** El usuario intenta publicar sin título o extracto.
**Corrección:** Se muestran mensajes de validación en los campos requeridos. El formulario no se envía hasta que estén completos.

### Error al subir imagen
**Disparador:** La imagen es demasiado grande o el formato no es compatible.
**Corrección:** Se muestra un mensaje de error indicando el tamaño máximo o los formatos aceptados (JPG, PNG, WebP).

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `mutation createPost(input: CreatePostInput!)`

**Frontend Component:** `apps/web/src/features/blog/pages/create-post-page.tsx`

**Database Entities:** `Post`, `PostImage`, `Category`

**Status logic:**
- Admin/Teacher → `status: "published"` directo
- Student → `status: "draft"`, va a `draftQueue`
</details>
