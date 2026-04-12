# Herramienta: Imagen a Texto (OCR)

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/screenshot-to-text`

## What This Does

El usuario sube una imagen que contiene texto (captura de pantalla, foto de documento, etc.) y la plataforma extrae el texto usando reconocimiento óptico de caracteres (OCR). Útil para digitalizar documentos físicos o extraer texto de imágenes.

## Step-by-Step Walkthrough

### 1. Subir la imagen
El usuario arrastra una imagen al área de carga o la selecciona desde el explorador de archivos. Formatos compatibles: PNG, JPG, WebP.

### 2. Procesar con OCR
Al subir la imagen, la plataforma la procesa con el motor de OCR. Aparece un indicador de progreso durante el procesamiento.

### 3. Ver el texto extraído
El texto reconocido aparece en un área de texto editable. El usuario puede copiarlo al portapapeles o editarlo antes de usarlo.

## Important Notes

- La precisión del OCR depende de la calidad y claridad de la imagen. Imágenes borrosas o con texto pequeño pueden tener menor precisión.
- El OCR soporta principalmente texto en español e inglés. Otros idiomas pueden tener menor precisión.
- No hay persistencia del resultado; al recargar la página, el texto se borra.

## What Can Go Wrong

### Imagen sin texto legible
**Disparador:** La imagen no contiene texto o el texto está muy distorsionado.
**Corrección:** El OCR devuelve texto vacío o con errores. Intentar con una imagen de mejor calidad o mayor resolución.

---
<details>
<summary>Technical Details</summary>

**Technology:** OCR del lado del cliente (Tesseract.js u similar) o API de OCR externa

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente screenshot-to-text)

**Database Entities:** Ninguna
</details>
