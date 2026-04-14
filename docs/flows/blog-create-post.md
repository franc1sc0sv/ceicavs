# Crear una Publicación en el Blog

**Category:** Blog
**Access:** Administrador, Docente, Estudiante
**URL:** `/blog/new`

## What This Does

Cualquier usuario autenticado puede crear una publicación en el blog escolar. Los administradores y docentes publican directamente; los estudiantes envían sus publicaciones para revisión (estado `pending`) antes de que aparezcan en el feed.

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

### 3. Guardar como borrador
Cualquier usuario puede hacer clic en "Guardar borrador". La publicación se guarda con estado `draft` y es visible únicamente para el autor en `/blog/drafts` (pestaña "Borradores"). No aparece en el feed ni en la cola de revisión.

### 4. Publicar o enviar para revisión
- **Admin/Docente:** El botón dice "Publicar". Al hacer clic, la publicación queda con estado `published` y aparece de inmediato en el feed.
- **Estudiante:** El botón dice "Enviar para revisión". La publicación pasa a estado `pending` y aparece en la cola de revisión del docente (`/blog/queue`). El estudiante la ve en `/blog/drafts` bajo la pestaña "En Revisión". No aparece en el feed hasta ser aprobada.

## Important Notes

- El extracto es el texto que se muestra en la tarjeta del feed; si se deja vacío, el sistema usa los primeros 150 caracteres del contenido.
- Las imágenes se suben a Cloudinary y sus URLs se almacenan en `PostImage`.
- Una vez publicada por admin/docente, la publicación puede editarse desde `/blog/:id/edit`.
- Los borradores guardados (`draft`) no van a la cola de revisión — solo los enviados explícitamente (`pending`).
- Los estudiantes pueden ver el estado de sus publicaciones en `/blog/drafts`.

## What Can Go Wrong

### Formulario incompleto
**Disparador:** El usuario intenta publicar o enviar sin título o extracto.
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
- Admin/Teacher + "Publicar" → `status: "published"` directo
- Student + "Enviar para revisión" → `status: "pending"`, aparece en `draftQueue`
- Any user + "Guardar borrador" → `status: "draft"`, solo visible para el autor

**CASL Permission:** `Action.CREATE` + `Subject.POST`; `Action.SUBMIT` para el flujo de revisión de estudiantes
</details>
