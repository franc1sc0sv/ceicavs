# Tomar Asistencia de un Grupo

**Category:** Asistencia
**Access:** Administrador, Docente
**URL:** `/attendance/:id`

## What This Does

El docente o administrador abre el detalle de un grupo, accede al listado de estudiantes (roster), marca el estado de asistencia de cada uno (presente, ausente, tardanza, justificado), y envía el registro para la fecha actual.

## Step-by-Step Walkthrough

### 1. Abrir la página de detalle del grupo
Desde `/attendance`, el usuario hace clic en la tarjeta del grupo deseado. Es redirigido a `/attendance/:id`, que muestra el nombre del grupo, el número de miembros y el historial de asistencia reciente.

### 2. Abrir el roster de asistencia
El usuario hace clic en el botón "Tomar asistencia" (o "Abrir roster"). Se abre un panel lateral (sheet) con el listado de todos los estudiantes del grupo.

### 3. Marcar el estado de cada estudiante
Para cada estudiante en el roster, el usuario selecciona uno de los cuatro estados:

| Estado | Descripción |
|--------|-------------|
| **Presente** | El estudiante asistió normalmente |
| **Ausente** | El estudiante no asistió |
| **Tardanza** | El estudiante llegó tarde |
| **Justificado** | La ausencia está justificada |

Los botones de estado tienen colores diferenciados para identificación visual rápida: verde (presente), rojo (ausente), amarillo (tardanza), azul (justificado).

### 4. Enviar la asistencia
Al hacer clic en "Guardar asistencia" o "Enviar", se ejecuta la mutación `recordAttendance` con el estado de todos los estudiantes y la fecha actual. El sheet se cierra y la tabla de historial se actualiza.

## Important Notes

- Solo los roles **administrador** y **docente** pueden registrar asistencia. Los estudiantes no tienen acceso a esta acción.
- Si ya se registró asistencia para el día de hoy, el roster muestra los valores existentes y el usuario puede modificarlos (re-envío actualiza el registro).
- La fecha del registro es siempre la fecha actual del servidor, no la del cliente.
- El roster muestra únicamente usuarios activos (no eliminados) del grupo.

## What Can Go Wrong

### Asistencia ya registrada hoy
**Disparador:** El docente intenta tomar asistencia por segunda vez en el mismo día.
**Corrección:** El roster abre con los valores ya guardados. El usuario puede modificarlos y volver a guardar para actualizarlos.

### Error de red al enviar
**Disparador:** La conexión a internet se interrumpe al enviar la asistencia.
**Corrección:** Se muestra un mensaje de error en pantalla. El usuario puede reintentar el envío; los datos del roster se mantienen en el formulario.

### Grupo sin miembros
**Disparador:** Se intenta tomar asistencia de un grupo vacío.
**Corrección:** El roster aparece vacío con un mensaje indicando que no hay estudiantes. Se recomienda agregar miembros primero desde `/people`.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query groupRoster`, `mutation recordAttendance`

**Frontend Component:** `apps/web/src/features/attendance/pages/attendance-detail-page.tsx`

**Database Entities:** `AttendanceRecord`, `AttendanceSubmission`, `GroupMembership`

**CASL Permission:** `Action.CREATE` + `Subject.ATTENDANCE_RECORD` (admin y teacher)
</details>
