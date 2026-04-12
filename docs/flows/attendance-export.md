# Exportar Reporte de Asistencia

**Category:** Asistencia
**Access:** Administrador, Docente
**URL:** `/attendance/:id`

## What This Does

El docente o administrador exporta el reporte de asistencia de un grupo en formato CSV o PDF para su uso externo (reportes institucionales, comunicados a padres de familia, etc.).

## Step-by-Step Walkthrough

### 1. Abrir la página de detalle del grupo
El usuario navega a `/attendance/:id` y visualiza el reporte de asistencia con el período deseado ya seleccionado.

### 2. Abrir el diálogo de exportación
El usuario hace clic en el botón "Exportar" (con ícono de descarga). Se abre un diálogo con las opciones de formato.

### 3. Seleccionar formato y confirmar
El usuario elige entre:
- **CSV:** Archivo de hoja de cálculo, compatible con Excel y Google Sheets
- **PDF:** Documento formateado listo para imprimir

Al confirmar, se ejecuta la mutación `exportAttendance` que crea un trabajo de exportación en el servidor.

### 4. Descargar el archivo
Una vez procesado el trabajo de exportación, se proporciona un enlace de descarga o el archivo se descarga automáticamente.

## Important Notes

- La exportación incluye únicamente los datos del período actualmente seleccionado en el reporte.
- Los archivos CSV incluyen todas las columnas: nombre, presentes, ausentes, tardanzas, justificados y porcentaje.
- Los PDFs incluyen el nombre del grupo, el período del reporte y la tabla de asistencia formateada.
- Esta función está restringida a administradores y docentes; los estudiantes no pueden exportar reportes.

## What Can Go Wrong

### Sin datos en el período
**Disparador:** Intentar exportar cuando no hay registros de asistencia en el período seleccionado.
**Corrección:** Seleccionar un período con datos o registrar asistencia primero.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `mutation exportAttendance(input: ExportAttendanceInput!)`, `query exportStatus`

**Frontend Component:** `apps/web/src/features/attendance/pages/attendance-detail-page.tsx`

**Database Entities:** `AttendanceRecord`, `Group`

**CASL Permission:** `Action.READ` + `Subject.ATTENDANCE_RECORD` con restricción de exportación a admin y teacher
</details>
