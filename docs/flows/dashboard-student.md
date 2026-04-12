# Panel de Control del Estudiante

**Category:** Panel de Control
**Access:** Estudiante
**URL:** `/dashboard`

## What This Does

El estudiante accede a su panel personalizado donde puede ver su historial de asistencia personal con gráficas de tendencia, estadísticas resumen y la actividad reciente de la plataforma relevante para él.

## Step-by-Step Walkthrough

### 1. Vista general del panel del estudiante
Al ingresar a `/dashboard`, el estudiante ve:
- Su propia gráfica de asistencia a lo largo del tiempo
- Estadísticas de resumen: total de sesiones, días presentes, ausentes, tardanzas y justificados
- Porcentaje general de asistencia
- Actividad reciente del blog y del sistema

### 2. Gráfica de asistencia personal
Una gráfica de línea o barras muestra la asistencia del estudiante semana por semana o mes por mes. Permite identificar períodos con muchas ausencias.

### 3. Actividad reciente
El feed muestra publicaciones nuevas en el blog, notificaciones del sistema y otros eventos relevantes para el estudiante.

## Important Notes

- El estudiante solo ve sus propios datos de asistencia; no puede ver los datos de otros compañeros.
- No hay acceso a estadísticas globales de la plataforma.
- El panel no incluye accesos rápidos a "tomar asistencia" ni "transcripciones" ya que el estudiante no tiene esos permisos.

## What Can Go Wrong

### No aparece historial de asistencia
El estudiante no ha sido añadido a ningún grupo o el docente aún no ha registrado asistencia. El panel muestra el gráfico vacío con el mensaje "Sin registros de asistencia todavía." El administrador debe asignar al estudiante a un grupo.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query studentDashboard`, `query recentActivity`

**Frontend Component:** `apps/web/src/features/dashboard/DashboardPage.tsx`

**Database Entities:** `AttendanceRecord`, `Activity`
</details>
