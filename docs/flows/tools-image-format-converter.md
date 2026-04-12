# Herramienta: Convertidor de Formato de Imágenes

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/image-format-converter`

## What This Does

El usuario sube una imagen en un formato y la convierte a otro (JPG, PNG, WebP, etc.). La imagen convertida se puede descargar directamente.

## Step-by-Step Walkthrough

### 1. Subir la imagen
El usuario arrastra una imagen al área de carga o hace clic para seleccionarla desde el explorador de archivos.

### 2. Seleccionar el formato de salida
El usuario elige el formato de destino entre las opciones disponibles: JPG, PNG, WebP, GIF, etc.

### 3. Convertir y descargar
Al hacer clic en "Convertir", la imagen se procesa. Una vez lista, aparece la opción de descargar el archivo convertido.

## Important Notes

- La conversión se realiza del lado del cliente (en el navegador) o del servidor según la implementación.
- La calidad de la imagen puede configurarse para formatos con compresión (JPG, WebP).
- Las imágenes muy grandes pueden tardar más en procesarse.

## What Can Go Wrong

### La imagen convertida pierde la transparencia
Al convertir de PNG (con fondo transparente) a JPG, el fondo transparente se vuelve blanco. Usar WebP como formato de destino si se necesita preservar la transparencia.

### El archivo generado no descarga automáticamente
Algunos navegadores bloquean descargas automáticas. Si el botón "Descargar" no responde, hacer clic derecho sobre la imagen previa y seleccionar "Guardar imagen como".

---
<details>
<summary>Technical Details</summary>

**REST Endpoint:** `POST /tools/file-convert` (si se hace en servidor) o procesamiento local con canvas API

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente image-format-converter)

**Database Entities:** Ninguna
</details>
