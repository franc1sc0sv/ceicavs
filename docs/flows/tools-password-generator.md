# Herramienta: Generador de Contraseñas

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/password-generator`

## What This Does

Genera contraseñas seguras y aleatorias con opciones de configuración: longitud, inclusión de mayúsculas, minúsculas, números y caracteres especiales. Útil para crear contraseñas temporales para nuevos usuarios.

## Step-by-Step Walkthrough

### 1. Configurar la contraseña
El usuario ajusta los parámetros:
- **Longitud:** slider para seleccionar el número de caracteres (ej. 8-32)
- **Mayúsculas:** incluir letras A-Z
- **Minúsculas:** incluir letras a-z
- **Números:** incluir dígitos 0-9
- **Símbolos:** incluir caracteres especiales (!@#$%...)

### 2. Generar la contraseña
Al hacer clic en "Generar" (o automáticamente al cambiar los parámetros), aparece una nueva contraseña aleatoria en el campo de resultado.

### 3. Copiar la contraseña
El usuario hace clic en el botón "Copiar" para llevar la contraseña al portapapeles.

### 4. Regenerar
Al hacer clic en "Generar" nuevamente, se crea una nueva contraseña con los mismos parámetros.

## Important Notes

- La generación es completamente local usando la API `crypto.getRandomValues()` del navegador para aleatoriedad criptográfica.
- La contraseña no se almacena en ningún lado; el usuario debe copiarla inmediatamente.
- Se muestra un indicador visual de fortaleza de la contraseña generada.

## What Can Go Wrong

### No se puede copiar la contraseña
El navegador puede denegar acceso al portapapeles si la página no tiene foco. Hacer clic en la contraseña generada y seleccionarla manualmente con Ctrl+A / Cmd+A, luego copiar.

### El botón "Generar" no produce resultado
Si todos los tipos de caracteres están desactivados (mayúsculas, minúsculas, números y símbolos en OFF al mismo tiempo), no es posible generar una contraseña. Activar al menos una categoría.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** Ninguna (generación local)

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente password-generator)

**Database Entities:** Ninguna
</details>
