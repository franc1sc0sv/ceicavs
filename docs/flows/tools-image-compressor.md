# Herramienta: Compresor de Imágenes

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/image-compressor`

## What This Does

El usuario sube una imagen y la plataforma la comprime para reducir su tamaño de archivo, manteniendo una calidad visual aceptable. Útil para optimizar imágenes antes de subirlas al blog o compartirlas.

## Step-by-Step Walkthrough

### 1. Subir la imagen
El usuario arrastra una imagen al área de carga o la selecciona desde el explorador de archivos. Se muestran el tamaño original y una vista previa de la imagen.

### 2. Ajustar la calidad (opcional)
El usuario puede mover un slider para ajustar el nivel de compresión (calidad 1-100). Un valor menor da un archivo más pequeño pero puede reducir la calidad visual.

### 3. Comprimir y descargar
Al hacer clic en "Comprimir", la imagen se procesa. Se muestra el tamaño del archivo resultante y el porcentaje de reducción. El usuario descarga la imagen comprimida.

## Important Notes

- Los formatos soportados incluyen JPG y PNG. Las imágenes PNG sin transparencia pueden convertirse a JPG para mayor compresión.
- La compresión puede realizarse en el navegador (usando canvas) o en el servidor.
- La imagen original no se modifica ni se almacena en el servidor.

## What Can Go Wrong

### La imagen no comprime significativamente
Imágenes ya comprimidas (como JPGs con baja calidad original) pueden no reducir mucho su tamaño. Intentar bajar más el nivel de calidad en el control deslizante.

### Formato no soportado
Solo se aceptan JPG y PNG. Si se intenta subir un formato diferente (como BMP o TIFF), la herramienta mostrará un error indicando los formatos válidos.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations / REST:** Procesamiento local con canvas API o `POST /tools/file-convert`

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente image-compressor)

**Database Entities:** Ninguna
</details>
