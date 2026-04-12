# Gestión de Categorías del Blog

**Category:** Blog
**Access:** Administrador, Docente
**URL:** `/blog/categories`

## What This Does

Administradores y docentes crean y administran las categorías que se usan para organizar las publicaciones del blog escolar. Las categorías aparecen como chips filtrables en el feed.

## Step-by-Step Walkthrough

### 1. Abrir la página de categorías
El usuario navega a `/blog/categories`. Se muestra una lista de todas las categorías existentes con opciones para editar y eliminar cada una.

### 2. Crear una nueva categoría
El usuario hace clic en "Agregar categoría". Se muestra un campo de texto o un dialog para ingresar el nombre de la categoría. Al guardar, se ejecuta `createCategory` y la nueva categoría aparece en la lista.

### 3. Editar una categoría
Al hacer clic en el ícono de edición junto a una categoría, el nombre se vuelve editable o se abre un dialog. El usuario cambia el nombre y guarda con `updateCategory`.

### 4. Eliminar una categoría
Al hacer clic en eliminar, se muestra un diálogo de confirmación. Al confirmar, se ejecuta `deleteCategory`. Las publicaciones que pertenecían a esa categoría pierden su categoría asignada.

## Important Notes

- Las categorías son globales para toda la plataforma; no son por usuario ni por grupo.
- Solo admin y docentes pueden gestionar categorías.
- Eliminar una categoría no elimina las publicaciones asociadas; estas simplemente quedan sin categoría.
- El nombre de categoría debe ser único.

## What Can Go Wrong

### Nombre de categoría duplicado
**Disparador:** Intentar crear una categoría con un nombre que ya existe.
**Corrección:** Se muestra un error indicando que el nombre ya está en uso.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query categories`, `mutation createCategory`, `mutation updateCategory`, `mutation deleteCategory`

**Frontend Component:** `apps/web/src/features/blog/pages/category-management-page.tsx`

**Database Entities:** `Category`

**CASL Permission:** `Action.CREATE` + `Subject.CATEGORY` (admin y teacher)
</details>
