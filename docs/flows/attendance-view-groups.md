# Ver Grupos de Asistencia

**Category:** Asistencia
**Access:** Administrador, Docente, Estudiante
**URL:** `/attendance`

## What This Does

El usuario abre la sección de asistencia y ve todos los grupos relevantes para su rol. Los administradores y docentes ven todos los grupos de la plataforma. Los estudiantes ven únicamente los grupos en los que están inscritos.

## Step-by-Step Walkthrough

### 1. Navegar a la sección de asistencia
El usuario accede a `/attendance` desde el menú lateral. Se carga una cuadrícula de tarjetas de grupos.

### 2. Ver las tarjetas de grupos
Cada tarjeta muestra:
- Nombre del grupo
- Número de miembros
- Información del último registro de asistencia (fecha)
- Botón para acceder al detalle del grupo

### 3. Seleccionar un grupo
Al hacer clic en una tarjeta, el usuario es redirigido a `/attendance/:id` para ver el detalle de asistencia de ese grupo.

## Important Notes

- Los estudiantes solo ven los grupos en los que están inscritos. Si no pertenecen a ningún grupo, verán un estado vacío.
- Los docentes y administradores ven todos los grupos existentes en la plataforma.
- Los grupos aparecen ordenados por nombre o por actividad reciente.
- Si no existen grupos creados, se muestra un mensaje invitando al administrador a crear el primer grupo desde `/people`.

## What Can Go Wrong

### Sin grupos disponibles
**Disparador:** No se han creado grupos en la plataforma o el estudiante no está inscrito en ninguno.
**Corrección:** El administrador o docente debe crear grupos en `/people` y agregar los miembros correspondientes.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query attendanceGroups`

**Frontend Component:** `apps/web/src/features/attendance/AttendancePage.tsx`

**Database Entities:** `Group`, `GroupMembership`
</details>
