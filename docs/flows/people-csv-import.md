# Importar Usuarios desde CSV

**Category:** Personas
**Access:** Administrador
**URL:** `/people`

## What This Does

El administrador puede importar múltiples usuarios de una sola vez cargando un archivo CSV con los datos de cada usuario. Es útil al inicio del ciclo escolar para cargar el listado completo de estudiantes o docentes.

## Step-by-Step Walkthrough

### 1. Abrir el diálogo de importación CSV
Desde la pestaña "Usuarios" en `/people`, el administrador hace clic en el botón de importación CSV (ícono de archivo o botón "Importar CSV"). Se abre un sheet o diálogo con el área de carga de archivos.

### 2. Seleccionar o arrastrar el archivo CSV
El área de carga acepta archivos `.csv`. El administrador puede hacer clic para abrir el explorador de archivos o arrastrar directamente el archivo al área designada.

El formato esperado del CSV es:
```
nombre,correo,contraseña,rol
Juan Pérez,juan@ceicavs.edu,Temp1234!,student
María García,maria@ceicavs.edu,Temp1234!,teacher
```

### 3. Confirmación y resultado de la importación
Tras seleccionar el archivo, la plataforma procesa el CSV mediante la mutación `importUsers`. Si hay errores en algunas filas (correo duplicado, campos faltantes), se muestra un reporte indicando qué filas se importaron correctamente y cuáles fallaron.

## Important Notes

- Solo el administrador puede importar usuarios en masa.
- Los correos electrónicos duplicados son ignorados y se reportan como errores.
- Las contraseñas se hashean automáticamente durante la importación.
- El archivo CSV debe usar codificación UTF-8 para compatibilidad con caracteres especiales (tildes, ñ).
- El tamaño máximo del archivo CSV no está documentado, pero se recomienda no superar 1000 filas por importación.

## What Can Go Wrong

### Formato de CSV incorrecto
**Disparador:** El archivo no tiene las columnas esperadas o usa un separador diferente.
**Corrección:** Verificar que el archivo use comas como separador y que las columnas sean: `nombre`, `correo`, `contraseña`, `rol`.

### Correos duplicados en la plataforma
**Disparador:** Algunos correos del CSV ya existen en la base de datos.
**Corrección:** El sistema importa las filas válidas e informa cuáles fueron omitidas. El administrador puede descargar un reporte de errores.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `mutation importUsers(input: ImportUsersInput!)`

**Frontend Component:** `apps/web/src/features/people/PeoplePage.tsx` (CSV import sheet)

**Database Entities:** `User`

**CASL Permission:** `Action.CREATE` + `Subject.USER` (solo admin)
</details>
