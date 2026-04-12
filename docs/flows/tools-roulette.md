# Herramienta: Ruleta

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/roulette`

## What This Does

Ruleta interactiva con ítems personalizados. El usuario agrega los ítems que desea incluir, gira la ruleta y obtiene un ganador al azar. Ideal para dinámicas de clase, sorteos o asignaciones aleatorias.

## Step-by-Step Walkthrough

### 1. Agregar ítems a la ruleta
El usuario escribe cada ítem en el campo de entrada y presiona Enter o el botón "+" para agregarlo. Cada ítem aparece como un sector de la ruleta con colores diferenciados.

### 2. Gestionar ítems
El usuario puede eliminar un ítem haciendo clic en la "x" junto a él. Los sectores de la ruleta se actualizan automáticamente.

### 3. Girar la ruleta
Al hacer clic en "Girar" (o en el botón central de la ruleta), esta comienza a girar con una animación. La velocidad disminuye gradualmente hasta detenerse en un ítem aleatorio.

### 4. Ver el resultado
El ítem ganador se destaca visualmente con un indicador o modal mostrando el resultado.

### 5. Volver a girar
El usuario puede girar la ruleta nuevamente sin cambiar los ítems.

## Important Notes

- La ruleta no persiste los ítems; al recargar la página, se borran.
- La aleatoriedad usa `Math.random()` del navegador.
- Pueden agregarse hasta 20-30 ítems sin que la ruleta se vea muy apretada.

## What Can Go Wrong

### La ruleta solo tiene un ítem
Si se agrega un solo ítem, la ruleta gira pero siempre selecciona el mismo. Agregar al menos dos ítems para que la selección sea aleatoria.

### Los ítems desaparecen al recargar
El estado de la ruleta es local (no se guarda en la API). Al refrescar la página, hay que volver a ingresar los ítems. Para uso repetitivo, anotar la lista de ítems externamente.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** Ninguna (herramienta local)

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente roulette)

**Database Entities:** Ninguna
</details>
