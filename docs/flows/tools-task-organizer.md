# Herramienta: Organizador de Tareas

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/task-organizer`

## What This Does

Lista de tareas sincronizada con la base de datos. El usuario agrega tareas, las marca como completadas y puede reordenarlas arrastrando. Las tareas se persisten por usuario en la nube.

## Step-by-Step Walkthrough

### 1. Ver las tareas existentes
Al abrir `/tools/task-organizer`, se cargan las tareas guardadas del usuario mediante la query `taskItems`. Las tareas completadas se muestran con tachado o en sección separada.

### 2. Agregar una tarea nueva
El usuario escribe el texto de la tarea en el campo de entrada y presiona Enter o hace clic en el botón "+". Se ejecuta `createTaskItem` y la nueva tarea aparece en la lista.

### 3. Marcar una tarea como completada
Al hacer clic en el checkbox junto a una tarea, se alterna su estado (completada/pendiente) mediante `updateTaskItem`. La tarea muestra visualmente su estado con tachado o cambio de color.

### 4. Reordenar tareas
El usuario puede arrastrar y soltar las tareas para reordenarlas. Al soltar, se ejecuta `reorderTaskItems` para persistir el nuevo orden.

### 5. Eliminar una tarea
Al hacer clic en el ícono de papelera junto a una tarea, se ejecuta `deleteTaskItem` y la tarea desaparece de la lista (eliminación lógica).

## Important Notes

- Las tareas son privadas de cada usuario; no son compartidas.
- El orden se persiste en la base de datos mediante el campo `order` de `TaskItem`.
- Las tareas completadas pueden mantenerse en la lista para referencia o eliminarse manualmente.

## What Can Go Wrong

### La tarea no se guarda al presionar Enter
Verificar que el campo de texto no esté vacío. Tareas en blanco no se crean. El sistema previene la creación de tareas sin contenido.

### El reordenamiento por arrastre no funciona
En dispositivos táctiles el arrastre puede no responder. Intentar en un dispositivo de escritorio con mouse para reorganizar las tareas.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query taskItems`, `mutation createTaskItem`, `mutation updateTaskItem`, `mutation deleteTaskItem`, `mutation reorderTaskItems`

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente task-organizer)

**Database Entities:** `TaskItem`
</details>
