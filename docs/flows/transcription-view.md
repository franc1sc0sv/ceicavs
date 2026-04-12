# Ver Transcripción y Generar Resumen con IA

**Category:** Transcripción con IA
**Access:** Administrador, Docente
**URL:** `/transcription/:id`

## What This Does

El usuario ve la transcripción completa de una grabación, puede reproducir el audio, editar la transcripción manualmente si hay errores, y generar un resumen automático con puntos clave y elementos de acción usando Gemini.

## Step-by-Step Walkthrough

### 1. Abrir el detalle de la grabación
El usuario navega a `/transcription/:id`. La página carga mediante la query `recording` y muestra la información completa de la grabación.

### 2. Reproducir el audio
La página incluye un reproductor de audio con los controles estándar: reproducir/pausar, barra de progreso y control de volumen. El audio se carga desde la URL de Cloudinary almacenada en `Recording.audioUrl`.

### 3. Ver la transcripción
La transcripción aparece en un área de texto o como bloques de texto segmentados con marcas de tiempo (si los segmentos están disponibles). El usuario puede leer el texto transcrito completo.

### 4. Editar la transcripción (opcional)
Si hay errores en la transcripción automática, el usuario puede hacer clic en "Editar transcripción" para corregirla manualmente. Al guardar, se ejecuta `updateTranscription`.

### 5. Generar el resumen con IA
El usuario hace clic en "Generar resumen". Se abre un campo para ingresar un prompt personalizado (ej. "Resume en 5 puntos clave esta clase de matemáticas"). Al confirmar, se ejecuta `generateSummary` usando la API de Gemini.

### 6. Ver el resumen generado
El resumen aparece con:
- Texto de resumen general
- Puntos clave (key takeaways)
- Elementos de acción (action items)

El usuario puede regenerar el resumen con un prompt diferente.

## Important Notes

- El resumen requiere que la transcripción esté completada primero.
- La generación del resumen puede tardar 5-30 segundos dependiendo de la longitud del texto.
- Los resúmenes se guardan en la base de datos y están disponibles en visitas futuras.
- El usuario puede personalizar el prompt de resumen que se usa por defecto en `/transcription` (configuración global).

## What Can Go Wrong

### Transcripción aún en progreso
**Disparador:** El usuario intenta generar resumen antes de que la transcripción esté completa.
**Corrección:** El botón de "Generar resumen" está deshabilitado hasta que el estado sea "completed".

### Error en la generación del resumen
**Disparador:** La API de Gemini falla o el texto es demasiado largo.
**Corrección:** Se muestra un mensaje de error con opción de reintentar.

### Grabación eliminada de Cloudinary
**Disparador:** El archivo de audio fue eliminado externamente de Cloudinary.
**Corrección:** El reproductor muestra un error. La transcripción y el resumen siguen disponibles en la base de datos.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query recording(id: ID!)`, `mutation updateTranscription`, `mutation generateSummary`, `mutation updateSummaryPrompt`

**Frontend Component:** `apps/web/src/features/transcription/pages/recording-detail-page.tsx`

**Database Entities:** `Recording`, `Transcription`

**External Services:** Cloudinary (reproducción de audio), Gemini (generación de resumen)

**CASL Permission:** `Action.CREATE` + `Subject.RECORDING` (admin y teacher)
</details>
