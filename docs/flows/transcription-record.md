# Subir Audio para Transcripción

**Category:** Transcripción con IA
**Access:** Administrador, Docente
**URL:** `/transcription/new`

## What This Does

El usuario sube un archivo de audio o graba directamente desde el navegador para obtener una transcripción automática usando Groq Whisper. El audio se almacena en Cloudinary y la transcripción se procesa de forma asíncrona.

## Step-by-Step Walkthrough

### 1. Abrir la pantalla de nueva grabación
El usuario navega a `/transcription/new`. Verá la interfaz de carga/grabación de audio.

### 2. Subir un archivo de audio existente
El usuario hace clic en "Subir archivo" o arrastra el archivo de audio al área de carga. Formatos compatibles: MP3, WAV, M4A, OGG. El archivo se sube a Cloudinary.

### 3. Asignar nombre a la grabación
El usuario ingresa un nombre descriptivo para la grabación (ej. "Clase de matemáticas - 12 de abril"). Si no se ingresa nombre, se usa el nombre del archivo.

### 4. Iniciar la transcripción
Al confirmar la carga, se ejecuta la mutación `createRecording` que registra la grabación en la base de datos. La transcripción comienza automáticamente en el servidor usando Groq Whisper. El estado inicial es "processing".

### 5. Ver el progreso
El usuario es redirigido a `/transcription/:id` o a la lista de grabaciones donde puede ver el estado de procesamiento. Cuando la transcripción completa, el estado cambia a "completed".

## Important Notes

- Solo admin y docentes pueden subir grabaciones.
- El tamaño máximo del archivo de audio depende de los límites de Cloudinary configurados.
- La transcripción puede tardar de 10 segundos a varios minutos dependiendo de la duración del audio.
- El audio queda almacenado en Cloudinary; no se almacena localmente en el servidor.
- Se puede grabar directamente desde el micrófono del navegador si la interfaz lo soporta.

## What Can Go Wrong

### Formato de audio no compatible
**Disparador:** El archivo subido no es un formato de audio reconocido.
**Corrección:** Se muestra un error indicando los formatos compatibles (MP3, WAV, M4A, OGG).

### Error al subir a Cloudinary
**Disparador:** Falla de conexión o límite de almacenamiento alcanzado.
**Corrección:** Se muestra un mensaje de error. El usuario puede reintentar la subida.

### Error en la transcripción
**Disparador:** Groq Whisper no puede procesar el audio (ruido excesivo, silencio total, idioma no soportado).
**Corrección:** El estado de transcripción muestra "error". El usuario puede ver el mensaje de error en el detalle de la grabación.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `mutation createRecording(input: CreateRecordingInput!)`

**Frontend Component:** `apps/web/src/features/transcription/TranscriptionPage.tsx`

**Database Entities:** `Recording`, `Transcription`

**External Services:** Cloudinary (almacenamiento de audio), Groq Whisper (transcripción de audio a texto)

**CASL Permission:** `Action.CREATE` + `Subject.RECORDING` (admin y teacher)
</details>
