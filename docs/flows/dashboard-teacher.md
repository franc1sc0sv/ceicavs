# Panel de Control del Docente

**Category:** Panel de Control
**Access:** Docente
**URL:** `/dashboard`

## What This Does

El docente accede a su panel personalizado con información relevante para su rol: estadísticas de asistencia de sus grupos, actividad reciente y accesos directos a las funciones más usadas (tomar asistencia, blog, herramientas, transcripciones).

## Step-by-Step Walkthrough

### 1. Vista general del panel del docente
Al ingresar a `/dashboard`, el docente ve un conjunto de widgets adaptados a sus necesidades:
- Resumen de asistencia de sus grupos (porcentaje general de presencia)
- Actividad reciente relacionada con sus grupos
- Accesos rápidos a las secciones que utiliza con mayor frecuencia

### 2. Gráficas de asistencia por grupo
El panel muestra gráficas de barras o líneas con el historial de asistencia de los grupos asignados al docente, permitiendo identificar tendencias de asistencia a lo largo del tiempo.

### 3. Actividad reciente
El feed de actividad reciente muestra eventos relevantes: nuevos borradores de estudiantes pendientes de revisión, registros de asistencia recientes, y otros eventos del sistema.

### 4. Acciones rápidas
Botones de acceso directo a:
- Tomar asistencia (primer grupo pendiente)
- Ver cola de borradores del blog
- Ir al catálogo de herramientas
- Nueva transcripción

## Important Notes

- El panel del docente no muestra estadísticas globales de la plataforma (esas son exclusivas del admin).
- Los datos de asistencia corresponden únicamente a los grupos que el docente supervisa.
- La actividad reciente se filtra para mostrar solo eventos relevantes al docente.

## What Can Go Wrong

### No aparecen grupos en el panel
El docente aún no ha sido asignado a ningún grupo. El administrador debe asignarle grupos desde la sección Personas → Grupos. Hasta entonces, las gráficas y estadísticas de asistencia aparecen vacías.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query teacherDashboard`, `query recentActivity`

**Frontend Component:** `apps/web/src/features/dashboard/DashboardPage.tsx`

**Database Entities:** `Group`, `AttendanceRecord`, `Activity`
</details>
