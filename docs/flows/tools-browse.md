# Explorar Herramientas Educativas

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools`

## What This Does

Los usuarios exploran el catálogo de herramientas educativas organizadas por categorías. Pueden marcar herramientas como favoritas para acceso rápido y navegar directamente a cada herramienta.

## Step-by-Step Walkthrough

### 1. Abrir el catálogo de herramientas
El usuario navega a `/tools`. Se muestra una cuadrícula de tarjetas de herramientas, cada una con ícono, nombre, descripción breve y un botón de favorito (estrella).

### 2. Explorar las categorías
Las herramientas están agrupadas por categorías (Productividad, Utilidades, IA, etc.). El usuario puede filtrar por categoría para ver solo herramientas de un tipo específico.

### 3. Marcar una herramienta como favorita
Al hacer clic en el ícono de estrella de una tarjeta, la herramienta se agrega o se quita de los favoritos del usuario. La estrella se llena (★) si es favorito o se muestra vacía (☆) si no lo es. Los favoritos aparecen destacados o en una sección separada al inicio del catálogo.

### 4. Abrir una herramienta
Al hacer clic en la tarjeta (o en el botón "Abrir"), el usuario navega a `/tools/:toolId` donde puede usar la herramienta.

## Important Notes

- Los favoritos son por usuario; cada usuario tiene su propia lista de herramientas favoritas.
- El catálogo de herramientas es el mismo para todos los roles.
- Las herramientas eliminadas (soft delete) no aparecen en el catálogo.

## Available Tools

| Herramienta | Slug | Descripción |
|-------------|------|-------------|
| Temporizador | `countdown-timer` | Cuenta regresiva configurable |
| Organizador de tareas | `task-organizer` | Lista de tareas con orden arrastrable |
| Simplificador de texto | `text-simplifier` | IA para simplificar textos complejos |
| Convertidor Word/PDF | `word-pdf-converter` | Convierte documentos de Word a PDF |
| Conversor de imágenes | `image-format-converter` | Convierte entre formatos de imagen |
| Descargador de YouTube | `youtube-downloader` | Descarga videos/audio de YouTube |
| Compresor de imágenes | `image-compressor` | Reduce el tamaño de imágenes |
| Generador de QR | `qr-code-generator` | Genera códigos QR |
| OCR (imagen a texto) | `screenshot-to-text` | Extrae texto de imágenes |
| Notas rápidas | `quick-notes` | Bloc de notas sincronizado |
| Calculadora científica | `scientific-calculator` | Calculadora avanzada |
| Generador de contraseñas | `password-generator` | Genera contraseñas seguras |
| Ruleta | `roulette` | Ruleta con ítems personalizados |
| Selector de estudiante | `random-student-picker` | Elige un estudiante al azar del grupo |

## What Can Go Wrong

### El catálogo aparece vacío
Ocurre si la base de datos no tiene herramientas sembradas. El administrador debe ejecutar el seed de la base de datos (`prisma db seed`) para poblar las herramientas. Si el catálogo aún no carga, verificar que la API esté activa.

### El favorito no se guarda
Si la sesión expiró o hay un problema de red, al hacer clic en la estrella puede aparecer un toast de error. Recargar la página e intentar nuevamente.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** `query tools`, `mutation toggleFavorite`

**Frontend Component:** `apps/web/src/features/tools/ToolsPage.tsx`

**Database Entities:** `Tool`, `ToolCategory`, `Favorite`
</details>
