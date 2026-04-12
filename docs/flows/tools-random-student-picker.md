# Herramienta: Selector Aleatorio de Estudiantes

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/random-student-picker`

## What This Does

Selecciona un estudiante al azar de un grupo de la plataforma. Útil para docentes que quieren hacer preguntas en clase, asignar tareas o seleccionar participantes de forma imparcial.

## Step-by-Step Walkthrough

### 1. Seleccionar el grupo
El usuario elige un grupo de la lista desplegable. Los grupos disponibles son los mismos que en la sección de asistencia (los grupos a los que tiene acceso el usuario).

### 2. Iniciar la selección aleatoria
Al hacer clic en "Elegir estudiante" o "Girar", la herramienta anima los nombres de los estudiantes del grupo y selecciona uno al azar.

### 3. Ver el estudiante seleccionado
El nombre y (si está disponible) el avatar del estudiante seleccionado se muestra prominentemente. Se puede hacer clic en "Elegir otro" para seleccionar un estudiante diferente.

## Important Notes

- Requiere conexión a la API para cargar la lista de miembros del grupo desde la query `attendanceGroups` o `group`.
- Los estudiantes ya seleccionados pueden o no excluirse en selecciones posteriores según la implementación (modo "sin repetición" vs "con reposición").
- Los estudiantes sin nombre registrado se muestran por su correo electrónico.

## What Can Go Wrong

### No aparece ningún grupo en el selector
El usuario no tiene grupos asignados. Para docentes, el administrador debe asignarlos a un grupo desde Personas → Grupos. Para administradores, se debe crear al menos un grupo con miembros.

### El grupo tiene cero estudiantes
Si un grupo existe pero no tiene miembros, la herramienta no puede seleccionar a nadie. El administrador debe agregar estudiantes al grupo desde Personas → Grupos → detalle del grupo.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query groups` o `query attendanceGroups` (para cargar miembros)

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente random-student-picker)

**Database Entities:** `Group`, `GroupMembership`, `User`
</details>
