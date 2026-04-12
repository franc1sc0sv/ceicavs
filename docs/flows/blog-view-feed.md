# Ver Feed del Blog Escolar

**Category:** Blog
**Access:** Administrador, Docente, Estudiante
**URL:** `/blog`

## What This Does

Todos los usuarios autenticados pueden explorar el feed de publicaciones del blog escolar. Las publicaciones se muestran como tarjetas con título, extracto, imagen (si tiene), categoría, autor y fecha. Se pueden filtrar por categoría y paginar para ver más contenido.

## Step-by-Step Walkthrough

### 1. Abrir el feed del blog
El usuario navega a `/blog` desde el menú lateral. Se carga una cuadrícula de tarjetas de publicaciones. Las publicaciones mostradas son únicamente las que tienen estado "publicado".

### 2. Explorar las publicaciones
Cada tarjeta de publicación muestra:
- Imagen destacada (si existe)
- Categoría (chip de color)
- Título del artículo
- Extracto o resumen
- Nombre del autor y fecha de publicación
- Indicador de reacciones y comentarios

### 3. Filtrar por categoría
En la parte superior del feed, hay chips de categorías. Al hacer clic en uno (ej. "Eventos", "Noticias"), el feed se filtra para mostrar únicamente publicaciones de esa categoría. Al hacer clic en "Todos", se muestran todas las publicaciones.

### 4. Paginar el contenido
Si hay más publicaciones de las que caben en la vista, se carga más contenido al hacer clic en "Cargar más" o al desplazarse hacia abajo (scroll infinito o paginación).

## Important Notes

- Los borradores y publicaciones rechazadas no son visibles en el feed público; solo las publicaciones con estado "publicado" aparecen.
- Los estudiantes que crean publicaciones las envían como borradores; estas van a la cola de revisión y solo aparecen en el feed al ser aprobadas por un admin o docente.
- Las publicaciones sin categoría aparecen en el feed pero no tienen chip de categoría.

## What Can Go Wrong

### Feed vacío
**Disparador:** No hay publicaciones con estado "publicado" en la plataforma.
**Corrección:** Un admin o docente debe crear y publicar al menos una publicación para que el feed muestre contenido.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query blogFeed(filters: BlogFeedFiltersInput, pagination: PaginationInput)`, `query categories`

**Frontend Component:** `apps/web/src/features/blog/BlogPage.tsx`

**Database Entities:** `Post`, `Category`, `Reaction`, `Comment`
</details>
