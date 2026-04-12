# Ver Reporte de Asistencia del Grupo

**Category:** Asistencia
**Access:** Administrador, Docente, Estudiante
**URL:** `/attendance/:id`

## What This Does

El usuario ve un reporte tabular del historial de asistencia de un grupo durante un período seleccionado. El reporte muestra, por estudiante, el conteo de presencias, ausencias, tardanzas y justificadas, además del porcentaje de asistencia.

## Step-by-Step Walkthrough

### 1. Abrir el detalle del grupo
El usuario navega a `/attendance/:id` haciendo clic en una tarjeta de grupo desde `/attendance`.

### 2. Seleccionar el período del reporte
En la página de detalle, hay un selector de período (semanal, mensual o rango personalizado). Al cambiar el período, la tabla se recarga con los datos correspondientes mediante la query `attendanceReport`.

### 3. Ver la tabla de reporte
La tabla muestra una fila por estudiante con las siguientes columnas:
- Nombre del estudiante
- Presentes (conteo)
- Ausentes (conteo)
- Tardanzas (conteo)
- Justificados (conteo)
- Porcentaje de asistencia

Los estudiantes con porcentaje de asistencia bajo pueden aparecer destacados visualmente para llamar la atención del docente.

### 4. Ver el detalle individual
Al hacer clic en la fila de un estudiante, se expande o navega al historial detallado de ese estudiante (ver flujo `attendance-student-history`).

## Important Notes

- Los estudiantes solo ven su propia fila en el reporte; no pueden ver los datos de compañeros.
- El reporte consolida únicamente los días en que se registró asistencia; los días sin registro no se cuentan.
- El período predeterminado es el mes actual.

## What Can Go Wrong

### Sin datos en el período seleccionado
**Disparador:** No se han registrado asistencias en el período seleccionado.
**Corrección:** La tabla muestra un estado vacío. El docente puede cambiar el período o registrar asistencia primero.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query attendanceReport(groupId: ID!, startDate: String!, endDate: String!)`

**Frontend Component:** `apps/web/src/features/attendance/pages/attendance-detail-page.tsx`

**Database Entities:** `AttendanceRecord`
</details>
