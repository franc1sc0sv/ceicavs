# Herramienta: Simplificador de Texto con IA

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/text-simplifier`

## What This Does

El usuario pega o escribe un texto complejo y la IA lo reescribe en un lenguaje más simple y accesible. Útil para adaptar contenido educativo a diferentes niveles de comprensión.

## Step-by-Step Walkthrough

### 1. Ingresar el texto a simplificar
El usuario navega a `/tools/text-simplifier` y escribe o pega el texto en el área de entrada.

### 2. Iniciar la simplificación
Al hacer clic en "Simplificar", la plataforma envía el texto a la API de IA (servicio frontend de IA). Aparece un indicador de carga mientras se procesa.

### 3. Ver el resultado
El texto simplificado aparece en el área de resultado. El usuario puede copiar el texto al portapapeles con el botón "Copiar".

### 4. Iterar (opcional)
Si el resultado no es satisfactorio, el usuario puede modificar el texto de entrada y volver a simplificar.

## Important Notes

- Esta herramienta usa IA del lado del frontend; requiere conexión a internet y acceso al servicio de IA.
- No hay persistencia del resultado; al recargar la página, el texto se borra.
- El texto simplificado puede ser editado manualmente por el usuario antes de copiarlo.
- Hay un límite de caracteres en el texto de entrada (varía según la configuración del servicio de IA).

## What Can Go Wrong

### Error del servicio de IA
**Disparador:** El servicio de IA no está disponible o hay un error de cuota.
**Corrección:** Se muestra un mensaje de error. El usuario puede reintentar más tarde.

### Texto demasiado largo
**Disparador:** El texto supera el límite de caracteres del servicio.
**Corrección:** El campo de entrada muestra un contador de caracteres y bloquea la simplificación si se supera el límite.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** Ninguna (IA del lado del cliente / REST)

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente text-simplifier)

**External Service:** API de IA para simplificación de texto (frontend AI)

**Database Entities:** Ninguna
</details>
