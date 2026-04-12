# Herramienta: Convertidor Word a PDF

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/word-pdf-converter`

## What This Does

El usuario sube un archivo Word (.docx) y lo convierte a PDF. El archivo resultante se puede descargar directamente desde la plataforma.

## Step-by-Step Walkthrough

### 1. Subir el archivo
El usuario arrastra un archivo `.docx` al área de carga o hace clic para abrir el explorador de archivos. El archivo se sube al endpoint REST `POST /tools/file-convert`.

### 2. Esperar la conversión
Aparece un indicador de progreso mientras el servidor convierte el documento. El proceso es generalmente rápido (1-5 segundos para documentos pequeños).

### 3. Descargar el PDF
Una vez completada la conversión, aparece un enlace de descarga. El usuario hace clic para descargar el archivo PDF resultante.

## Important Notes

- Formatos aceptados: `.docx` (Word 2007 y posterior).
- El archivo convertido no se almacena permanentemente en el servidor; el enlace de descarga puede expirar.
- Las imágenes y el formato del documento se conservan en la medida de lo posible durante la conversión.

## What Can Go Wrong

### Formato de archivo no compatible
**Disparador:** El usuario sube un archivo que no es `.docx` (ej. `.doc` antiguo, `.odt`).
**Corrección:** Se muestra un error indicando los formatos aceptados.

### Archivo demasiado grande
**Disparador:** El documento supera el límite de tamaño del servidor.
**Corrección:** Se muestra un mensaje indicando el tamaño máximo permitido.

---
<details>
<summary>Technical Details</summary>

**REST Endpoint:** `POST /tools/file-convert`

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente word-pdf-converter)

**Database Entities:** Ninguna (conversión sin persistencia)
</details>
