# Herramienta: Temporizador Cuenta Regresiva

**Category:** Herramientas
**Access:** Administrador, Docente, Estudiante
**URL:** `/tools/countdown-timer`

## What This Does

El usuario configura un tiempo de cuenta regresiva (horas, minutos, segundos), inicia el temporizador, puede pausarlo y reiniciarlo. Útil para gestionar tiempos de examen, actividades cronometradas o descansos.

## Step-by-Step Walkthrough

### 1. Abrir el temporizador
El usuario navega a `/tools/countdown-timer`. Verá la pantalla del temporizador con campos para ingresar horas, minutos y segundos, y los controles de inicio/pausa/reset.

### 2. Configurar el tiempo
El usuario ingresa el tiempo deseado en los campos correspondientes. Por ejemplo: 0 horas, 25 minutos, 0 segundos para una sesión Pomodoro.

### 3. Iniciar la cuenta regresiva
Al hacer clic en el botón de inicio (▶), el temporizador comienza a contar. Los campos de configuración se deshabilitan durante la cuenta regresiva.

### 4. Pausar el temporizador
El usuario puede hacer clic en el botón de pausa (⏸) para detener temporalmente la cuenta sin reiniciarla. El tiempo restante se conserva.

### 5. Reiniciar
Al hacer clic en el botón de reset (↺), el temporizador regresa al tiempo configurado y se detiene.

### 6. Tiempo agotado
Cuando el tiempo llega a cero, el temporizador muestra una alerta visual y/o sonora indicando que el tiempo se acabó.

## Important Notes

- El temporizador es completamente local (no usa GraphQL); funciona sin conexión a internet.
- Al navegar fuera de la página, el temporizador se detiene.
- No hay persistencia del estado; al recargar la página, el temporizador se reinicia.

## What Can Go Wrong

### El temporizador no emite sonido al terminar
El navegador puede bloquear la reproducción automática de audio. Interactuar con la página antes de iniciar el temporizador (hacer clic en cualquier elemento) generalmente resuelve la restricción del navegador.

### El tiempo configurado no persiste al recargar
El estado del temporizador es local y no se guarda en la API. Al recargar la página, se pierde la configuración. Configurar el tiempo de nuevo e iniciar el temporizador.

---
<details>
<summary>Technical Details</summary>

**GraphQL Operations:** Ninguna (herramienta local)

**Frontend Component:** `apps/web/src/features/tools/pages/tool-detail-page.tsx` (componente countdown-timer)

**Database Entities:** Ninguna
</details>
