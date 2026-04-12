# Herramienta: Descargador de YouTube

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/youtube-downloader`

## What This Does

El usuario ingresa una URL de YouTube, obtiene la información del video (título, miniatura, duración, formatos disponibles) y puede descargar el video o solo el audio en el formato seleccionado.

## Step-by-Step Walkthrough

### 1. Ingresar la URL de YouTube
El usuario pega la URL del video de YouTube en el campo de entrada (ej. `https://www.youtube.com/watch?v=...`).

### 2. Obtener información del video
Al hacer clic en "Obtener información" (o al pegar la URL), la plataforma consulta el endpoint `GET /tools/youtube-info` y muestra:
- Miniatura del video
- Título
- Duración
- Canal
- Formatos disponibles (calidades de video: 360p, 720p, 1080p; y opción de solo audio MP3)

### 3. Seleccionar formato y descargar
El usuario selecciona el formato deseado y hace clic en "Descargar". La plataforma inicia la descarga mediante `POST /tools/youtube-download`.

## Important Notes

- La descarga de videos de YouTube puede estar sujeta a los términos de servicio de YouTube y derechos de autor.
- Esta herramienta es útil principalmente para contenido educativo libre de derechos.
- La velocidad de descarga depende del tamaño del video y la conexión del servidor.
- Videos muy largos (más de 2 horas) pueden tardar varios minutos en procesarse.

## What Can Go Wrong

### URL no válida
**Disparador:** La URL ingresada no es de YouTube o el video no existe.
**Corrección:** Se muestra un error indicando que la URL no es válida.

### Video privado o restringido
**Disparador:** El video es privado, está bloqueado en la región del servidor, o fue eliminado.
**Corrección:** Se muestra un mensaje de error explicando por qué no se puede acceder al video.

---
<details>
<summary>Technical Details</summary>

**REST Endpoints:** `GET /tools/youtube-info?url=...`, `POST /tools/youtube-download`

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente youtube-downloader)

**Database Entities:** Ninguna
</details>
