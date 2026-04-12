# Gestión de Grupos (Administrador y Docente)

**Category:** Personas
**Access:** Administrador, Docente
**URL:** `/people` → pestaña Grupos

## What This Does

Los administradores y docentes crean grupos escolares, agregan y remueven miembros, y pueden editar o eliminar grupos existentes. Los grupos son la unidad base para el registro de asistencia.

## Step-by-Step Walkthrough

### 1. Navegar a la pestaña de Grupos
En `/people`, el usuario hace clic en la pestaña "Grupos". Se muestra una cuadrícula de tarjetas, una por grupo, mostrando el nombre del grupo, su descripción y la cantidad de miembros.

### 2. Crear un nuevo grupo
El usuario hace clic en "+ Agregar grupo". Se abre un panel lateral con el formulario de creación:
- **Nombre:** nombre descriptivo del grupo (ej. "4to Grado C")
- **Descripción:** información adicional (ej. "Grupo de cuarto grado")

Al hacer clic en "Guardar", se ejecuta la mutación `createGroup` y el nuevo grupo aparece en la cuadrícula.

### 3. Ver detalle de un grupo y sus miembros
Al hacer clic en una tarjeta de grupo, se abre un sheet con el listado completo de miembros del grupo. Cada miembro muestra nombre, correo y rol.

### 4. Agregar un miembro al grupo
Dentro del sheet de detalle del grupo, el usuario hace clic en "Agregar miembro". Se muestra un buscador de usuarios para seleccionar quién agregar. Al confirmar, se ejecuta `addMemberToGroup`.

### 5. Remover un miembro del grupo
En la lista de miembros, cada fila tiene un botón de eliminación. Al hacer clic, se ejecuta `removeMemberFromGroup` y el usuario desaparece de la lista.

### 6. Editar un grupo
Al hacer clic en el ícono de edición de una tarjeta de grupo (o desde el menú de acciones), se abre el sheet de edición con el nombre y descripción prellenados. El usuario modifica y guarda con `updateGroup`.

### 7. Eliminar un grupo
Al seleccionar "Eliminar" en el menú de acciones de la tarjeta, se muestra un diálogo de confirmación. Al confirmar, se ejecuta `deleteGroup` (eliminación lógica).

## Important Notes

- Los grupos no pueden eliminarse si tienen registros de asistencia asociados sin resolver primero esos registros.
- Un usuario puede pertenecer a múltiples grupos simultáneamente.
- Solo admins y docentes pueden crear/editar/eliminar grupos; los estudiantes solo ven los grupos en los que están inscritos.
- Los grupos eliminados (soft delete) no aparecen en la cuadrícula ni en las listas de asistencia.

## What Can Go Wrong

### Nombre de grupo duplicado
**Disparador:** Intentar crear un grupo con el mismo nombre que uno ya existente.
**Corrección:** Mostrar un error indicando que el nombre ya está en uso. Usar un nombre diferente o agregar un identificador (año, turno, etc.).

### Sin usuarios disponibles para agregar
**Disparador:** Todos los usuarios del sistema ya son miembros del grupo o no hay usuarios creados.
**Corrección:** Crear usuarios primero desde la pestaña "Usuarios", luego regresar a agregar miembros.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query groups`, `query group`, `mutation createGroup`, `mutation updateGroup`, `mutation deleteGroup`, `mutation addMemberToGroup`, `mutation removeMemberFromGroup`

**Frontend Component:** `apps/web/src/features/people/PeoplePage.tsx` (pestaña Grupos)

**Database Entities:** `Group`, `GroupMembership`

**CASL Permission:** `Action.CREATE` + `Subject.GROUP` (admin y teacher)
</details>
