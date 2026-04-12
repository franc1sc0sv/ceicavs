# Herramienta: Calculadora Científica

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/scientific-calculator`

## What This Does

Calculadora científica completa con funciones trigonométricas, logarítmicas, potencias y más. Funciona completamente en el navegador sin necesidad de conexión al servidor.

## Step-by-Step Walkthrough

### 1. Abrir la calculadora
El usuario navega a `/tools/scientific-calculator`. Verá el teclado de la calculadora con botones numéricos, operadores básicos y funciones científicas.

### 2. Realizar cálculos
El usuario ingresa números y operaciones haciendo clic en los botones:
- Operaciones básicas: +, -, ×, ÷
- Funciones científicas: sin, cos, tan, log, ln, √, x², xⁿ
- Constantes: π (pi), e (Euler)
- Paréntesis para operaciones complejas

### 3. Ver el resultado
Al hacer clic en "=" o presionar Enter, se calcula y muestra el resultado en la pantalla de la calculadora.

## Important Notes

- La calculadora es completamente local; no usa GraphQL ni REST.
- El historial de cálculos puede estar disponible durante la sesión pero no se persiste.
- Los resultados con muchos decimales se redondean para la visualización.

## What Can Go Wrong

### El resultado muestra "Error" o "NaN"
Ocurre al ingresar expresiones matemáticas inválidas (como dividir entre cero o raíz de un número negativo). Presionar "C" o "AC" para limpiar la pantalla e ingresar una nueva expresión.

### El historial de cálculos desaparece
El historial es local a la sesión del navegador. Al recargar la página o abrir la calculadora en otra pestaña, el historial previo no estará disponible.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** Ninguna (cálculo local)

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente scientific-calculator)

**Database Entities:** Ninguna
</details>
