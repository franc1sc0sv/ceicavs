# Herramienta: Notas Rápidas

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/quick-notes`

## What This Does

Bloc de notas sincronizado en la nube. El usuario puede crear, editar y eliminar notas personales que se guardan automáticamente y están disponibles en cualquier dispositivo.

## Step-by-Step Walkthrough

### 1. Ver las notas existentes
Al abrir `/tools/quick-notes`, se cargan las notas del usuario desde la API mediante la query `notes`. Las notas se muestran como tarjetas en una cuadrícula o lista.

### 2. Crear una nueva nota
El usuario hace clic en "+ Nueva nota" o en un área vacía. Se crea una nota en blanco donde el usuario puede escribir directamente. Al dejar de escribir (o al hacer clic fuera), la nota se guarda automáticamente con `createNote` o `updateNote`.

### 3. Editar una nota existente
Al hacer clic en una nota, el contenido se vuelve editable. Los cambios se guardan automáticamente.

### 4. Eliminar una nota
Al hacer clic en el ícono de papelera de una nota, se muestra una confirmación. Al confirmar, se ejecuta `deleteNote` y la nota desaparece.

## Important Notes

- Las notas son privadas de cada usuario.
- El guardado automático previene la pérdida de datos.
- No hay formato enriquecido en las notas; solo texto plano.
- Las notas eliminadas no son recuperables (o se aplica soft delete según la configuración).

## What Can Go Wrong

### La nota no se guardó
Si se pierde la conexión a la red justo al escribir, el guardado automático puede fallar. Al reconectarse, la nota puede intentar guardarse de nuevo. Si el contenido se pierde, escribirlo nuevamente.

### La nota no aparece al abrir la herramienta
El usuario puede estar viendo la herramienta en modo sin sesión o haberse cambiado de cuenta. Las notas son por usuario; verificar que se está usando la cuenta correcta.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query notes`, `mutation createNote`, `mutation updateNote`, `mutation deleteNote`

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente quick-notes)

**Database Entities:** `Note`
</details>
