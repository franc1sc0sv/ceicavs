# Herramienta: Generador de Códigos QR

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/qr-code-generator`

## What This Does

El usuario ingresa un texto o URL y genera un código QR que puede descargar como imagen PNG. Útil para compartir enlaces, información de contacto o contenido educativo de forma rápida.

## Step-by-Step Walkthrough

### 1. Ingresar el contenido
El usuario escribe el texto o URL que desea codificar en el campo de entrada.

### 2. Generar el código QR
Al escribir (generación en tiempo real) o al hacer clic en "Generar", aparece el código QR en pantalla generado con la librería de QR del lado del cliente.

### 3. Descargar el código QR
El usuario hace clic en "Descargar" para guardar el código QR como imagen PNG.

## Important Notes

- La generación del código QR es completamente local (en el navegador), sin necesidad de conexión al servidor.
- El tamaño y el color del código QR pueden ser configurables según la implementación.
- Textos muy largos generan códigos QR más complejos que pueden ser difíciles de escanear.

## What Can Go Wrong

### El código QR no es legible por el escáner
Puede ocurrir si el texto ingresado es demasiado largo o el tamaño del código QR generado es muy pequeño. Usar un texto más corto (idealmente una URL) o imprimir el código en tamaño más grande.

### El botón "Descargar" no funciona
Algunos navegadores bloquean descargas de canvas generadas dinámicamente. Si el botón no responde, hacer clic derecho sobre el código QR y seleccionar "Guardar imagen como".

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** Ninguna (generación local con librería QR)

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente qr-code-generator)

**Database Entities:** Ninguna
</details>
