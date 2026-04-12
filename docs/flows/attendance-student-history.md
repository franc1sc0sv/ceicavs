# Historial de Asistencia Individual del Estudiante

**Category:** Asistencia
**Access:** Administrador, Docente, Estudiante (propio historial)
**URL:** `/attendance/:id`

## What This Does

Permite ver el historial detallado de asistencia de un estudiante específico: registro día a día con el estado de cada sesión y estadísticas de resumen (total de presentes, ausentes, tardanzas, justificadas y porcentaje general de asistencia).

## Step-by-Step Walkthrough

### 1. Abrir el reporte del grupo
El usuario navega a `/attendance/:id` y ve la tabla de reporte con todos los estudiantes.

### 2. Seleccionar un estudiante
El usuario hace clic en la fila del estudiante de interés. Se expande una sección de historial detallado o se navega a una vista de historial individual.

### 3. Ver el resumen estadístico
La vista muestra tarjetas con el conteo de cada estado:
- Total de sesiones registradas
- Días presentes
- Días ausentes
- Tardanzas
- Justificados
- Porcentaje de asistencia

### 4. Ver el historial día a día
Una tabla o línea de tiempo muestra cada fecha de registro con su estado correspondiente, ordenadas de más reciente a más antigua.

## Important Notes

- Los estudiantes solo pueden ver su propio historial; no tienen acceso al historial de otros estudiantes.
- Los docentes y administradores pueden ver el historial de cualquier estudiante en cualquier grupo.
- El historial muestra únicamente los días en que se registró asistencia para ese grupo.

## What Can Go Wrong

### Historial vacío
**Disparador:** El estudiante no tiene registros de asistencia en el grupo o período seleccionado.
**Corrección:** El docente debe registrar asistencia para el grupo. El historial se actualiza automáticamente.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query studentHistory`, `query studentSummary`

**Frontend Component:** `apps/web/src/features/attendance/pages/attendance-detail-page.tsx`

**Database Entities:** `AttendanceRecord`, `User`
</details>
