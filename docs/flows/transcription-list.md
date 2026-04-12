# Lista de Grabaciones y Transcripciones

**Category:** Transcripción con IA
**Access:** Administrador, Docente
**URL:** `/transcription`

## What This Does

Administradores y docentes ven todas sus grabaciones de audio con sus estados de transcripción. Pueden organizar grabaciones en carpetas y acceder al detalle de cada grabación para ver la transcripción y el resumen generado por IA.

## Step-by-Step Walkthrough

### 1. Abrir la lista de grabaciones
El usuario navega a `/transcription`. Se carga una lista de tarjetas, una por grabación, mostrando nombre, duración, fecha y estado de transcripción.

### 2. Ver el estado de transcripción de cada grabación
Cada tarjeta muestra el estado de transcripción con un ícono o badge:
- **Sin transcribir:** No se ha procesado el audio
- **Procesando:** La transcripción está en progreso
- **Completado:** La transcripción está disponible

### 3. Organizar en carpetas (si aplica)
Si la plataforma soporta carpetas, el usuario puede crear carpetas (`Folder`) y mover grabaciones entre ellas para organizarlas por clase, fecha o tema.

### 4. Acceder al detalle de una grabación
Al hacer clic en una tarjeta, el usuario navega a `/transcription/:id` para ver la transcripción completa y el resumen.

### 5. Eliminar una grabación
Al seleccionar eliminar, se ejecuta `deleteRecording`. Esto elimina también el archivo de audio de Cloudinary.

## Important Notes

- Solo los roles **administrador** y **docente** tienen acceso a la sección de transcripción.
- Cada usuario solo ve sus propias grabaciones; no hay grabaciones compartidas.
- El procesamiento de transcripción usa Groq Whisper y puede tardar algunos segundos o minutos dependiendo de la duración del audio.

## What Can Go Wrong

### Sin grabaciones
**Disparador:** El usuario no ha subido ninguna grabación.
**Corrección:** Estado vacío con enlace directo a `/transcription/new` para subir la primera grabación.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query recordings`, `mutation deleteRecording`

**Frontend Component:** `apps/web/src/features/transcription/pages/recordings-list-page.tsx`

**Database Entities:** `Recording`, `Transcription`, `Folder`

**CASL Permission:** `Action.CREATE` + `Subject.RECORDING` (admin y teacher)

**External Services:** Cloudinary (almacenamiento de audio)
</details>
