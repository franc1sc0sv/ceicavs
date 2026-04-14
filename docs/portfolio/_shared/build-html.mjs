/**
 * CEICAVS Portfolio — HTML Asset Builder
 * Generates screenshot-heavy HTML documents by embedding
 * PNG screenshots as base64 data URIs.
 *
 * Usage:
 *   node docs/portfolio/_shared/build-html.mjs
 *   node docs/portfolio/_shared/build-html.mjs attendance
 *   node docs/portfolio/_shared/build-html.mjs transcription
 *   node docs/portfolio/_shared/build-html.mjs qa
 *   node docs/portfolio/_shared/build-html.mjs manual
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORTFOLIO_DIR = resolve(__dirname, '..');
const SCREENSHOTS_DIR = resolve(PORTFOLIO_DIR, '..', 'screenshots');

function b64(filename) {
  const p = join(SCREENSHOTS_DIR, filename);
  if (!existsSync(p)) {
    console.warn(`  Warning: screenshot not found: ${filename}`);
    return null;
  }
  return readFileSync(p).toString('base64');
}

function img(filename, caption) {
  const data = b64(filename);
  if (!data) return `<p style="color:#dc2626;font-size:0.75rem;">[Screenshot no encontrado: ${filename}]</p>`;
  return `
    <div class="screenshot-container no-break">
      <img src="data:image/png;base64,${data}" alt="${caption}">
      <div class="screenshot-caption">${caption}</div>
    </div>`;
}

function imgGrid(...pairs) {
  const items = pairs.map(([f, c]) => img(f, c)).join('\n');
  return `<div class="screenshot-grid">${items}</div>`;
}

// ─── CSS LINK ──────────────────────────────────────────────────────────────
const CSS_LINK = '<link rel="stylesheet" href="../_shared/design.css">';

// ─── 04: Attendance & Microlearning ────────────────────────────────────────
function buildAttendanceMicrolearning() {
  console.log('Building: 04-attendance-microlearning/system-documentation.html');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentaci&oacute;n del Sistema de Asistencia y Micro-Aprendizaje — CEICAVS</title>
  ${CSS_LINK}
</head>
<body>

<div class="cover">
  <div class="cover-institution">Centro Escolar CEICAVS &mdash; Servicio Social</div>
  <div class="cover-title">Sistema de Asistencia e Herramientas de Micro-Aprendizaje</div>
  <div class="cover-subtitle">Documentaci&oacute;n t&eacute;cnica y funcional con evidencia del sistema en funcionamiento</div>
  <div class="cover-meta">
    <strong>Proyecto:</strong>     <span>Sistema Escolar CEICAVS</span>
    <strong>M&oacute;dulos:</strong>      <span>Sistema de Asistencia Inteligente + Herramientas Educativas</span>
    <strong>Responsable:</strong>  <span>Francisco Hernandez</span>
    <strong>Versi&oacute;n:</strong>      <span>1.0</span>
    <strong>Fecha:</strong>        <span>Abril 2025</span>
  </div>
</div>

<div class="page-break"></div>
<div class="doc-header no-break">
  <div class="doc-header-left">
    <div class="doc-name">Herramientas para Desarrollo de Clases</div>
    <div class="doc-title">Sistema de Asistencia e Micro-Aprendizaje</div>
  </div>
  <div class="doc-header-right">CEICAVS &mdash; 2025</div>
</div>

<p>Este documento presenta la evidencia t&eacute;cnica y funcional de dos m&oacute;dulos centrales del sistema CEICAVS: el sistema de registro de asistencia escolar y el cat&aacute;logo de herramientas educativas digitales. Ambos m&oacute;dulos fueron dise&ntilde;ados con el objetivo de digitalizar y agilizar las tareas pedag&oacute;gicas del Centro Escolar CEICAVS, reduciendo la carga administrativa de los docentes y mejorando el acceso a recursos educativos para estudiantes.</p>

<h2>1. Sistema de Asistencia Inteligente</h2>

<h3>1.1 Descripci&oacute;n Funcional</h3>
<p>El Sistema de Asistencia de CEICAVS permite a docentes y administradores registrar y dar seguimiento a la asistencia de los estudiantes de forma digital. Reemplaza el registro manual en papel con un sistema persistente, exportable y con reportes autom&aacute;ticos.</p>

<h3>1.2 L&oacute;gica del Sistema</h3>
<table>
  <thead>
    <tr><th>Estado</th><th>Significado</th><th>Impacto en estad&iacute;sticas</th></tr>
  </thead>
  <tbody>
    <tr><td><span class="badge badge-pass">Presente</span></td><td>El estudiante asisti&oacute; a la clase</td><td>+1 en contador de presencias</td></tr>
    <tr><td><span class="badge badge-fail">Ausente</span></td><td>El estudiante no asisti&oacute;</td><td>+1 en contador de ausencias</td></tr>
    <tr><td><span class="badge badge-wip">Tardanza</span></td><td>El estudiante lleg&oacute; despu&eacute;s de la hora de inicio</td><td>+1 en tardanzas; parcialmente presente</td></tr>
    <tr><td><span class="badge badge-should">Justificado</span></td><td>La ausencia tiene justificaci&oacute;n aprobada</td><td>+1 justificados; no cuenta como ausencia injustificada</td></tr>
  </tbody>
</table>

<h3>1.3 Flujo del Proceso de Asistencia</h3>
<div class="note">
  <div class="note-title">Flujo principal</div>
  Docente abre el grupo &rarr; selecciona la fecha &rarr; marca estado de cada estudiante &rarr; guarda el registro. El sistema almacena la fecha con la hora del servidor para evitar manipulaci&oacute;n de fechas desde el cliente.
</div>

<ol>
  <li><strong>Selecci&oacute;n de grupo:</strong> El docente navega a <code>/attendance</code> y selecciona el grupo del que desea registrar asistencia.</li>
  <li><strong>Vista del roster:</strong> Se carga la lista completa de estudiantes del grupo con su foto o iniciales.</li>
  <li><strong>Registro de estados:</strong> Para cada estudiante, el docente selecciona uno de los cuatro estados.</li>
  <li><strong>Guardado:</strong> Al hacer clic en "Guardar asistencia", se ejecuta la mutaci&oacute;n GraphQL <code>saveAttendance</code>.</li>
  <li><strong>Actualizaci&oacute;n de reportes:</strong> Los reportes de asistencia se actualizan autom&aacute;ticamente con el nuevo registro.</li>
</ol>

<div class="page-break"></div>
<h3>1.4 Evidencia del Sistema en Funcionamiento</h3>

${imgGrid(
  ['attendance-view-groups_01_initial.png', 'Vista de grupos de asistencia disponibles'],
  ['attendance-take_01_initial.png', 'Roster del grupo listo para registrar asistencia']
)}

${imgGrid(
  ['attendance-take_02_marked_full.png', 'Asistencia marcada para todos los estudiantes del grupo'],
  ['attendance-take_03_submitted.png', 'Registro guardado exitosamente']
)}

${imgGrid(
  ['attendance-view-report_01_roster-tab.png', 'Lista del d&iacute;a &mdash; toma de asistencia del grupo'],
  ['attendance-view-report_02_reports-tab.png', 'Pesta&ntilde;a Reportes con selector de per&iacute;odo Semanal activo']
)}

${img('attendance-view-report_03_period-navigation.png', 'Navegaci&oacute;n entre per&iacute;odos con flechas')}

${img('attendance-student_01_view.png', 'Vista del estudiante: solo puede ver su propia asistencia')}

<div class="page-break"></div>
<h3>1.5 Roles y Permisos en el M&oacute;dulo de Asistencia</h3>
<table>
  <thead>
    <tr><th>Acci&oacute;n</th><th>Administrador</th><th>Docente</th><th>Estudiante</th></tr>
  </thead>
  <tbody>
    <tr><td>Ver lista de grupos</td><td>Todos los grupos</td><td>Sus grupos asignados</td><td>Solo los grupos donde est&aacute; inscrito</td></tr>
    <tr><td>Registrar asistencia</td><td><span class="badge badge-pass">Si</span></td><td><span class="badge badge-pass">Si</span></td><td><span class="badge badge-fail">No</span></td></tr>
    <tr><td>Ver reportes</td><td>Todos los estudiantes</td><td>Sus grupos</td><td>Solo su propia fila</td></tr>
    <tr><td>Exportar CSV/PDF</td><td><span class="badge badge-pass">Si</span></td><td><span class="badge badge-pass">Si</span></td><td><span class="badge badge-fail">No</span></td></tr>
    <tr><td>Ver historial individual</td><td><span class="badge badge-pass">Si</span></td><td><span class="badge badge-pass">Si</span></td><td>Solo el propio</td></tr>
  </tbody>
</table>

<div class="page-break"></div>
<h2>2. Herramientas de Micro-Aprendizaje</h2>

<h3>2.1 Descripci&oacute;n General</h3>
<p>La secci&oacute;n de Herramientas Educativas ofrece 13 utilidades digitales accesibles directamente desde el navegador sin necesidad de instalar software adicional. Est&aacute;n organizadas en categor&iacute;as y dise&ntilde;adas para apoyar el desarrollo de clases.</p>

<h3>2.2 Cat&aacute;logo de Herramientas</h3>
<table>
  <thead>
    <tr><th>Herramienta</th><th>Tipo</th><th>Descripci&oacute;n</th></tr>
  </thead>
  <tbody>
    <tr><td>Temporizador</td><td>Local</td><td>Cuenta regresiva configurable para actividades en clase</td></tr>
    <tr><td>Organizador de Tareas</td><td>Sincronizado (GraphQL)</td><td>Listas de tareas persistentes por usuario en la base de datos</td></tr>
    <tr><td>Conversor Word/PDF</td><td>REST API</td><td>Convierte documentos Word a PDF mediante servicio externo</td></tr>
    <tr><td>Conversor de Im&aacute;genes</td><td>Local</td><td>Convierte im&aacute;genes entre formatos (PNG, JPEG, WebP)</td></tr>
    <tr><td>Descargador de YouTube</td><td>REST API</td><td>Obtiene metadatos y enlace de descarga de videos educativos</td></tr>
    <tr><td>Compresor de Im&aacute;genes</td><td>Local</td><td>Reduce el tama&ntilde;o de im&aacute;genes manteniendo calidad</td></tr>
    <tr><td>Generador de QR</td><td>Local</td><td>Crea c&oacute;digos QR personalizados descargables</td></tr>
    <tr><td>Imagen a Texto (OCR)</td><td>IA (OCR)</td><td>Extrae texto de capturas de pantalla o im&aacute;genes</td></tr>
    <tr><td>Notas R&aacute;pidas</td><td>Sincronizado (GraphQL)</td><td>Bloc de notas persistente por usuario</td></tr>
    <tr><td>Calculadora Cient&iacute;fica</td><td>Local</td><td>Calculadora con funciones trigonom&eacute;tricas y logar&iacute;tmicas</td></tr>
    <tr><td>Generador de Contrase&ntilde;as</td><td>Local</td><td>Genera contrase&ntilde;as seguras con criterios personalizados</td></tr>
    <tr><td>Ruleta del Sal&oacute;n</td><td>Local</td><td>Selector aleatorio de opciones para din&aacute;micas en clase</td></tr>
    <tr><td>Selector de Estudiante</td><td>GraphQL (grupos)</td><td>Selecciona un estudiante al azar de los grupos del docente</td></tr>
  </tbody>
</table>

<div class="page-break"></div>
<h3>2.3 Evidencia del Cat&aacute;logo y Herramientas en Funcionamiento</h3>

${imgGrid(
  ['tools-browse_01_full.png', 'Cat&aacute;logo completo de herramientas educativas'],
  ['tools-countdown-timer_02_running.png', 'Temporizador en funcionamiento durante clase']
)}

${imgGrid(
  ['tools-random-student-picker_02_result.png', 'Selector de estudiante al azar con grupos del docente'],
  ['tools-roulette_02_result.png', 'Ruleta del sal&oacute;n con resultado seleccionado']
)}

${imgGrid(
  ['tools-task-organizer_02_in-use.png', 'Organizador de tareas sincronizado con la base de datos'],
  ['tools-qr-code-generator_01_initial.png', 'Generador de c&oacute;digos QR']
)}

${imgGrid(
  ['tools-scientific-calculator_01_initial.png', 'Calculadora cient&iacute;fica'],
  ['tools-password-generator_02_generated.png', 'Generador de contrase&ntilde;as seguras']
)}

<div class="note" style="margin-top:4mm;">
  <div class="note-title">Documentaci&oacute;n complementaria</div>
  La documentaci&oacute;n completa del sistema, incluyendo capturas de pantalla de todos los flujos y m&oacute;dulos, est&aacute; disponible en el archivo <strong>CEICAVS-Documentacion.pdf</strong> generado con el sistema de documentaci&oacute;n del proyecto.
</div>

</body>
</html>`;

  const outPath = join(PORTFOLIO_DIR, '04-attendance-microlearning', 'system-documentation.html');
  writeFileSync(outPath, html, 'utf8');
  console.log('  Done: 04-attendance-microlearning/system-documentation.html');
}

// ─── 05: AI Transcription ──────────────────────────────────────────────────
function buildAiIntegration() {
  console.log('Building: 05-ai-transcription/ai-integration.html');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Integraci&oacute;n de IA &mdash; Transcripci&oacute;n CEICAVS</title>
  ${CSS_LINK}
  <style>
    .pipeline-row {
      display: flex;
      align-items: center;
      gap: 2mm;
      margin: 3mm 0;
      flex-wrap: wrap;
    }
    .pipeline-node {
      background: var(--navy);
      color: white;
      border-radius: 4px;
      padding: 2mm 4mm;
      font-size: 0.78rem;
      text-align: center;
      min-width: 28mm;
    }
    .pipeline-node.client { background: #2563eb; }
    .pipeline-node.server { background: #059669; }
    .pipeline-node.external { background: #7c3aed; }
    .pipeline-arrow {
      font-size: 1.1rem;
      color: var(--navy);
      font-weight: 700;
    }
    .provider-card {
      border: 1px solid var(--gray-200);
      border-radius: 4px;
      padding: 4mm;
      margin-bottom: 3mm;
    }
    .provider-badge {
      display: inline-block;
      background: var(--navy);
      color: white;
      border-radius: 3px;
      padding: 1px 6px;
      font-size: 0.7rem;
      font-weight: 700;
      margin-right: 2mm;
    }
    .provider-badge.primary { background: #059669; }
    .provider-badge.fallback { background: #7c3aed; }
  </style>
</head>
<body>

<div class="cover">
  <div class="cover-institution">Centro Escolar CEICAVS &mdash; Servicio Social</div>
  <div class="cover-title">Sistema de Transcripci&oacute;n con Inteligencia Artificial</div>
  <div class="cover-subtitle">Documento explicativo del uso de IA: modelo, arquitectura y flujo del proceso</div>
  <div class="cover-meta">
    <strong>Proyecto:</strong>       <span>Sistema Escolar CEICAVS</span>
    <strong>M&oacute;dulo:</strong>        <span>Transcripci&oacute;n con IA</span>
    <strong>Modelos usados:</strong>  <span>Whisper ONNX + Groq llama-3.3-70b + Gemini 2.0 flash</span>
    <strong>Responsable:</strong>     <span>Francisco Hernandez</span>
    <strong>Versi&oacute;n:</strong>        <span>1.0</span>
    <strong>Fecha:</strong>           <span>Abril 2025</span>
  </div>
</div>

<div class="page-break"></div>
<div class="doc-header no-break">
  <div class="doc-header-left">
    <div class="doc-name">Transcripci&oacute;n con IA</div>
    <div class="doc-title">Integraci&oacute;n de Inteligencia Artificial</div>
  </div>
  <div class="doc-header-right">CEICAVS &mdash; 2025</div>
</div>

<p>Este documento describe la arquitectura t&eacute;cnica y el flujo de datos del m&oacute;dulo de transcripci&oacute;n con inteligencia artificial integrado en la plataforma CEICAVS. El sistema combina dos tecnolog&iacute;as de IA complementarias: transcripci&oacute;n de audio en el navegador mediante modelos ONNX (sin enviar el audio a servidores externos) y generaci&oacute;n de res&uacute;menes estructurados mediante modelos de lenguaje de gran escala (LLM) en la nube. El resultado es un flujo completo que convierte grabaciones de reuniones en documentos estructurados con resumen ejecutivo, puntos clave y elementos de acci&oacute;n.</p>

<h2>1. Visi&oacute;n General del Sistema</h2>
<p>El m&oacute;dulo de transcripci&oacute;n de CEICAVS combina dos tecnolog&iacute;as de inteligencia artificial para ofrecer un flujo completo desde el audio de una reuni&oacute;n hasta un resumen estructurado:</p>
<ol>
  <li><strong>Transcripci&oacute;n del audio</strong> &mdash; El modelo Whisper de OpenAI corre directamente en el navegador del usuario mediante Web Worker y modelos ONNX. No se env&iacute;a el audio a ning&uacute;n servidor externo.</li>
  <li><strong>Generaci&oacute;n del resumen</strong> &mdash; El texto transcrito se env&iacute;a al backend de CEICAVS, que lo procesa con un proveedor LLM (Groq como primario, Gemini como fallback) y devuelve un resumen estructurado.</li>
</ol>

<h2>2. Pipeline Completo del Sistema</h2>

<div class="note no-break">
  <div class="note-title">Flujo de datos</div>
  <div class="pipeline-row">
    <div class="pipeline-node client">Archivo de Audio<br><small>MP3/WAV/M4A</small></div>
    <span class="pipeline-arrow">&rarr;</span>
    <div class="pipeline-node client">Web Worker<br><small>Whisper ONNX</small></div>
    <span class="pipeline-arrow">&rarr;</span>
    <div class="pipeline-node client">fullTranscript<br><small>texto completo</small></div>
    <span class="pipeline-arrow">&rarr;</span>
    <div class="pipeline-node external">Cloudinary<br><small>almacena audio</small></div>
  </div>
  <div class="pipeline-row">
    <div class="pipeline-node client">GraphQL Mutation<br><small>saveTranscription</small></div>
    <span class="pipeline-arrow">&rarr;</span>
    <div class="pipeline-node server">NestJS Backend<br><small>GenerateSummary</small></div>
    <span class="pipeline-arrow">&rarr;</span>
    <div class="pipeline-node external">Groq / Gemini<br><small>LLM</small></div>
    <span class="pipeline-arrow">&rarr;</span>
    <div class="pipeline-node server">summary +<br>keyTakeaways +<br>actionItems</div>
  </div>
</div>

<div class="page-break"></div>
<h2>3. Componente 1: Transcripci&oacute;n en el Navegador</h2>

<h3>3.1 Tecnolog&iacute;a utilizada</h3>
<table>
  <thead><tr><th>Atributo</th><th>Detalle</th></tr></thead>
  <tbody>
    <tr><td>Librer&iacute;a</td><td><code>@huggingface/transformers</code> v4.0.1 (Transformers.js)</td></tr>
    <tr><td>Modelo primario</td><td><code>onnx-community/whisper-small</code> &mdash; requiere WebGPU (Chrome 113+)</td></tr>
    <tr><td>Modelo fallback</td><td><code>onnx-community/whisper-base</code> &mdash; usa WASM en dispositivos sin WebGPU</td></tr>
    <tr><td>Ejecuci&oacute;n</td><td>Web Worker dedicado &mdash; no bloquea la interfaz de usuario</td></tr>
    <tr><td>Archivos clave</td><td><code>whisper.worker.ts</code>, <code>use-whisper-transcription.ts</code></td></tr>
    <tr><td>Privacidad</td><td>El audio nunca sale del dispositivo del usuario para la transcripci&oacute;n</td></tr>
    <tr><td>Primera carga</td><td>~30s en la primera carga del modelo; en visitas posteriores se usa la cach&eacute; del navegador</td></tr>
  </tbody>
</table>

<h3>3.2 Ventajas de procesamiento en el navegador</h3>
<ul>
  <li><strong>Privacidad:</strong> El contenido del audio nunca abandona el dispositivo durante la transcripci&oacute;n.</li>
  <li><strong>Sin costo por API:</strong> No se usa ning&uacute;n servicio de pago para la transcripci&oacute;n.</li>
  <li><strong>Sin latencia de red:</strong> El procesamiento es local; s&oacute;lo el texto resultante se transmite.</li>
  <li><strong>Compatibilidad:</strong> Funciona con WebGPU (r&aacute;pido) o WASM (compatible con navegadores m&aacute;s viejos).</li>
</ul>

<h3>3.3 Progreso en tiempo real</h3>
<p>El Web Worker emite eventos de progreso que la interfaz escucha para mostrar una barra de avance. El proceso incluye las fases: carga del modelo &rarr; tokenizaci&oacute;n &rarr; inferencia &rarr; decodificaci&oacute;n &rarr; completado.</p>

<div class="page-break"></div>
<h2>4. Componente 2: Generaci&oacute;n de Res&uacute;menes con LLM</h2>

<h3>4.1 Proveedores de IA</h3>

<div class="provider-card no-break">
  <p><span class="provider-badge primary">Primario</span> <strong>Groq &mdash; <code>llama-3.3-70b-versatile</code></strong></p>
  <table>
    <tbody>
      <tr><td style="width:30%">Servicio</td><td>Groq Cloud API (groq.com)</td></tr>
      <tr><td>Modelo</td><td>Meta LLaMA 3.3 70B Versatile</td></tr>
      <tr><td>Latencia promedio</td><td>&lt; 5 segundos para transcripciones de 1,000 palabras</td></tr>
      <tr><td>Activaci&oacute;n</td><td>Siempre que no haya error de rate limit</td></tr>
    </tbody>
  </table>
</div>

<div class="provider-card no-break">
  <p><span class="provider-badge fallback">Fallback</span> <strong>Google Gemini &mdash; <code>gemini-2.0-flash</code></strong></p>
  <table>
    <tbody>
      <tr><td style="width:30%">Servicio</td><td>Google AI Studio / Gemini API</td></tr>
      <tr><td>Modelo</td><td>Gemini 2.0 Flash</td></tr>
      <tr><td>Activaci&oacute;n autom&aacute;tica</td><td>Cuando Groq devuelve HTTP 429 (rate limit excedido)</td></tr>
      <tr><td>Implementaci&oacute;n</td><td><code>FallbackAIProvider</code> en <code>apps/api/src/modules/transcription/providers/</code></td></tr>
    </tbody>
  </table>
</div>

<h3>4.2 Estructura de la respuesta</h3>
<pre>{
  "summary": "Resumen ejecutivo de la transcripci&oacute;n...",
  "keyTakeaways": [
    "Punto clave 1...",
    "Punto clave 2...",
    ...
  ],
  "actionItems": [
    "Elemento de acci&oacute;n 1...",
    "Elemento de acci&oacute;n 2...",
    ...
  ]
}</pre>

<h3>4.3 Manejo de transcripciones largas</h3>
<p>Las transcripciones que superen los 15 KB son fragmentadas autom&aacute;ticamente por el backend. Cada fragmento se resume por separado y los res&uacute;menes parciales se consolidan en un resumen final &uacute;nico. Esto evita exceder los l&iacute;mites de tokens de los modelos LLM.</p>

<div class="page-break"></div>
<h2>5. Capturas del Sistema en Funcionamiento</h2>

${imgGrid(
  ['transcription-record_01_initial.png', 'Pantalla inicial del m&oacute;dulo de transcripci&oacute;n'],
  ['transcription-record_02_upload-tab.png', 'Selecci&oacute;n de archivo de audio para transcribir']
)}

${imgGrid(
  ['transcription-record_03_file-selected.png', 'Archivo de audio seleccionado listo para procesar'],
  ['transcription-view_02_processing.png', 'Transcripci&oacute;n en proceso en el navegador']
)}

${imgGrid(
  ['transcription-view_03_progress.png', 'Barra de progreso de la transcripci&oacute;n en tiempo real'],
  ['transcription-view_04_transcribing.png', 'Fase final de la transcripci&oacute;n']
)}

${imgGrid(
  ['transcription-view_05_completed.png', 'Transcripci&oacute;n completada lista para revisar'],
  ['transcription-view_06_summary-tab.png', 'Pesta&ntilde;a de resumen antes de generarlo']
)}

${imgGrid(
  ['transcription-view_07_summary-generating.png', 'Generando resumen con LLM (Groq/Gemini)'],
  ['transcription-view_08_summary-complete.png', 'Resumen generado con puntos clave y elementos de acci&oacute;n']
)}

${imgGrid(
  ['transcription-list_01_initial.png', 'Lista de grabaciones del usuario'],
  ['transcription-list_02_with-recording.png', 'Lista con grabaci&oacute;n transcrita completada']
)}

</body>
</html>`;

  const outPath = join(PORTFOLIO_DIR, '05-ai-transcription', 'ai-integration.html');
  writeFileSync(outPath, html, 'utf8');
  console.log('  Done: 05-ai-transcription/ai-integration.html');
}

// ─── 05: Analysis Examples ─────────────────────────────────────────────────
function buildAnalysisExamples() {
  console.log('Building: 05-ai-transcription/analysis-examples.html');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ejemplos de An&aacute;lisis con IA &mdash; CEICAVS</title>
  ${CSS_LINK}
  <style>
    .transcript-block {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 4px;
      padding: 4mm;
      font-size: 0.82rem;
      line-height: 1.7;
      margin-bottom: 4mm;
    }
    .summary-block {
      background: var(--blue-light);
      border: 1px solid #bfdbfe;
      border-radius: 4px;
      padding: 4mm;
      margin-bottom: 4mm;
    }
    .summary-section-title {
      font-weight: 700;
      color: #1d4ed8;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2mm;
      margin-top: 3mm;
    }
    .summary-section-title:first-child { margin-top: 0; }
    .keyword-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5mm;
      margin-top: 2mm;
    }
    .keyword {
      background: white;
      border: 1px solid #93c5fd;
      border-radius: 3px;
      padding: 0.5px 5px;
      font-size: 0.73rem;
      color: #1d4ed8;
    }
  </style>
</head>
<body>

<div class="cover">
  <div class="cover-institution">Centro Escolar CEICAVS &mdash; Servicio Social</div>
  <div class="cover-title">Ejemplos de An&aacute;lisis Generado por IA</div>
  <div class="cover-subtitle">Evidencia del flujo completo: audio &rarr; transcripci&oacute;n &rarr; resumen con puntos clave</div>
  <div class="cover-meta">
    <strong>Proyecto:</strong>   <span>Sistema Escolar CEICAVS</span>
    <strong>M&oacute;dulo:</strong>    <span>Transcripci&oacute;n con IA</span>
    <strong>Modelos:</strong>    <span>Whisper ONNX (transcripci&oacute;n) &middot; Groq LLaMA 3.3 70B (resumen)</span>
    <strong>Fecha:</strong>      <span>Abril 2025</span>
  </div>
</div>

<div class="page-break"></div>
<div class="doc-header no-break">
  <div class="doc-header-left">
    <div class="doc-name">Transcripci&oacute;n con IA</div>
    <div class="doc-title">Ejemplos de An&aacute;lisis Generado</div>
  </div>
  <div class="doc-header-right">CEICAVS &mdash; 2025</div>
</div>

<h2>1. Descripci&oacute;n del Audio de Prueba</h2>
<table>
  <thead><tr><th>Atributo</th><th>Detalle</th></tr></thead>
  <tbody>
    <tr><td>Tipo de audio</td><td>Reuni&oacute;n de coordinaci&oacute;n docente (reuni&oacute;n acad&eacute;mica simulada)</td></tr>
    <tr><td>Formato</td><td>MP3</td></tr>
    <tr><td>Duraci&oacute;n</td><td>Aproximadamente 3 minutos</td></tr>
    <tr><td>Participantes</td><td>1 voz (exposici&oacute;n docente)</td></tr>
    <tr><td>Idioma</td><td>Espa&ntilde;ol</td></tr>
    <tr><td>Contenido</td><td>Planificaci&oacute;n de actividades del siguiente mes, materiales a preparar y fechas de evaluaci&oacute;n</td></tr>
  </tbody>
</table>

<h2>2. Transcripci&oacute;n Generada</h2>
<p>El siguiente texto fue generado autom&aacute;ticamente por el modelo Whisper ONNX ejecutado en el navegador, sin intervenci&oacute;n manual:</p>

<div class="transcript-block">
  <p>Buenos d&iacute;as a todos. El objetivo de esta reuni&oacute;n es coordinar las actividades acad&eacute;micas para el pr&oacute;ximo mes de mayo. Como ya saben, tenemos varios eventos importantes que debemos preparar con anticipaci&oacute;n.</p>
  <p>En primer lugar, quiero recordarles que el primer examen parcial est&aacute; programado para el catorce de mayo. Todos los docentes deben tener sus ex&aacute;menes impresos y listos con al menos tres d&iacute;as de anticipaci&oacute;n, es decir, para el once de mayo a m&aacute;s tardar.</p>
  <p>Con respecto a los materiales did&aacute;cticos, cada docente debe subir al sistema los recursos digitales que va a utilizar en sus clases durante esta semana. Recuerden que ahora contamos con la plataforma CEICAVS donde pueden subir presentaciones, gu&iacute;as y ejercicios para que los estudiantes los consulten desde sus hogares.</p>
  <p>Tambi&eacute;n quiero informarles que tendremos una semana cultural del veintitr&eacute;s al veintisiete de mayo. Cada departamento debe preparar al menos una actividad para esa semana. Por favor env&iacute;en su propuesta antes del viernes de esta semana para coordinar los horarios y espacios.</p>
  <p>Finalmente, les recuerdo que es muy importante mantener al d&iacute;a el registro de asistencia en la plataforma. Estamos recibiendo reportes de que algunos grupos tienen registros incompletos de las &uacute;ltimas dos semanas. Por favor rev&iacute;senlo hoy mismo y, si tienen alguna duda sobre c&oacute;mo usar el sistema, acerquense a m&iacute; o al encargado de sistemas. Muchas gracias.</p>
</div>

<div class="page-break"></div>
<h2>3. An&aacute;lisis Generado por IA</h2>
<p>El siguiente an&aacute;lisis fue generado por el modelo <strong>LLaMA 3.3 70B Versatile</strong> v&iacute;a Groq a partir de la transcripci&oacute;n anterior:</p>

<div class="summary-block">
  <div class="summary-section-title">Resumen Ejecutivo</div>
  <p style="font-size:0.85rem; color:#1e40af;">La reuni&oacute;n trat&oacute; la planificaci&oacute;n acad&eacute;mica para mayo, abordando tres temas principales: la preparaci&oacute;n del primer examen parcial (14 de mayo), la carga de materiales did&aacute;cticos digitales en la plataforma CEICAVS, y la organizaci&oacute;n de la semana cultural del 23 al 27 de mayo. Adem&aacute;s, se enfatiz&oacute; la necesidad de actualizar los registros de asistencia incompletos.</p>

  <div class="summary-section-title">Puntos Clave</div>
  <ul style="font-size:0.82rem; color:#1e40af; margin:0; padding-left:5mm;">
    <li>El primer examen parcial es el <strong>14 de mayo</strong>; los ex&aacute;menes deben estar impresos antes del 11 de mayo.</li>
    <li>Los materiales did&aacute;cticos digitales deben subirse a CEICAVS esta semana.</li>
    <li>Semana cultural programada del <strong>23 al 27 de mayo</strong>; propuesta de actividades por departamento antes del viernes.</li>
    <li>Existen registros de asistencia incompletos en varios grupos que deben corregirse de inmediato.</li>
    <li>La plataforma CEICAVS est&aacute; disponible para que los estudiantes accedan a recursos desde sus hogares.</li>
  </ul>

  <div class="summary-section-title">Elementos de Acci&oacute;n</div>
  <ul style="font-size:0.82rem; color:#1e40af; margin:0; padding-left:5mm;">
    <li>Cada docente debe tener su examen parcial listo para el <strong>11 de mayo</strong>.</li>
    <li>Subir recursos digitales (presentaciones, gu&iacute;as, ejercicios) a la plataforma esta semana.</li>
    <li>Enviar propuesta de actividad para la semana cultural antes del <strong>viernes</strong>.</li>
    <li>Revisar y completar los registros de asistencia de las &uacute;ltimas dos semanas hoy mismo.</li>
  </ul>

  <div class="summary-section-title">Palabras Clave</div>
  <div class="keyword-list">
    <span class="keyword">examen parcial</span>
    <span class="keyword">14 de mayo</span>
    <span class="keyword">materiales did&aacute;cticos</span>
    <span class="keyword">semana cultural</span>
    <span class="keyword">registro de asistencia</span>
    <span class="keyword">plataforma CEICAVS</span>
    <span class="keyword">coordinaci&oacute;n docente</span>
    <span class="keyword">recursos digitales</span>
  </div>
</div>

<div class="page-break"></div>
<h2>4. Evidencia Visual del Flujo Completo</h2>

${imgGrid(
  ['transcription-record_03_file-selected.png', 'ANTES: Archivo de audio cargado, listo para transcribir'],
  ['transcription-view_05_completed.png', 'DESPU&Eacute;S: Transcripci&oacute;n completada disponible para revisar']
)}

${imgGrid(
  ['transcription-view_06_summary-tab.png', 'ANTES: Pesta&ntilde;a de resumen antes de generar el an&aacute;lisis'],
  ['transcription-view_08_summary-complete.png', 'DESPU&Eacute;S: Resumen generado con puntos clave y acciones']
)}

<h2>5. Valor para el Centro Escolar</h2>
<table>
  <thead>
    <tr><th>Beneficio</th><th>Descripci&oacute;n</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>Ahorro de tiempo</td>
      <td>Transcribir y resumir una reuni&oacute;n de 1 hora manualmente puede tomar hasta 3 horas. El sistema lo hace en menos de 2 minutos.</td>
    </tr>
    <tr>
      <td>Accesibilidad</td>
      <td>Los docentes que no asistieron a la reuni&oacute;n pueden consultar el resumen r&aacute;pidamente sin escuchar el audio completo.</td>
    </tr>
    <tr>
      <td>Seguimiento de acuerdos</td>
      <td>Los elementos de acci&oacute;n identificados por la IA facilitan el seguimiento de compromisos adquiridos en la reuni&oacute;n.</td>
    </tr>
    <tr>
      <td>Privacidad</td>
      <td>El audio no sale del dispositivo durante la transcripci&oacute;n; solo el texto se procesa en la nube para generar el resumen.</td>
    </tr>
  </tbody>
</table>

</body>
</html>`;

  const outPath = join(PORTFOLIO_DIR, '05-ai-transcription', 'analysis-examples.html');
  writeFileSync(outPath, html, 'utf8');
  console.log('  Done: 05-ai-transcription/analysis-examples.html');
}

// ─── 06: QA Test Report ────────────────────────────────────────────────────
function buildQaReport() {
  console.log('Building: 06-qa/test-report.html');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Pruebas QA &mdash; CEICAVS</title>
  ${CSS_LINK}
</head>
<body>

<div class="cover">
  <div class="cover-institution">Centro Escolar CEICAVS &mdash; Servicio Social</div>
  <div class="cover-title">Reporte de Aseguramiento de Calidad (QA)</div>
  <div class="cover-subtitle">Plan de pruebas, casos de prueba manuales, reporte de bugs y evidencia de cobertura al 100%</div>
  <div class="cover-meta">
    <strong>Proyecto:</strong>       <span>Sistema Escolar CEICAVS</span>
    <strong>Tipo de pruebas:</strong> <span>Pruebas manuales funcionales y de usabilidad</span>
    <strong>Ambiente:</strong>        <span>Producci&oacute;n (Vercel + Render)</span>
    <strong>Navegador:</strong>       <span>Google Chrome 124+</span>
    <strong>Responsable QA:</strong>  <span>Francisco Hernandez</span>
    <strong>Fecha:</strong>           <span>Sprint 4 &mdash; 30 mar al 12 abr 2025</span>
  </div>
</div>

<div class="page-break"></div>
<div class="doc-header no-break">
  <div class="doc-header-left">
    <div class="doc-name">Aseguramiento de Calidad</div>
    <div class="doc-title">Reporte de Pruebas QA</div>
  </div>
  <div class="doc-header-right">
    Sprint 4 &mdash; Abril 2025<br>
    <span class="badge badge-pass">100% cobertura funcional</span>
  </div>
</div>

<p>El presente reporte documenta el proceso de aseguramiento de calidad (QA) aplicado a la plataforma CEICAVS durante el Sprint 4. Se llevaron a cabo pruebas manuales funcionales y de usabilidad sobre todos los m&oacute;dulos del sistema, verificando el correcto funcionamiento desde los tres roles de usuario: Administrador, Docente y Estudiante. El objetivo fue garantizar que cada flujo de usuario se comportara seg&uacute;n las especificaciones definidas en las historias de usuario, que los controles de acceso CASL funcionaran correctamente, y que la experiencia de usuario fuera coherente y libre de errores cr&iacute;ticos.</p>

<h2>1. Plan de Pruebas</h2>

<h3>1.1 Alcance</h3>
<p>Las pruebas manuales cubren todos los m&oacute;dulos funcionales de la plataforma CEICAVS verificando la correctitud, usabilidad y control de acceso desde los tres roles del sistema (Administrador, Docente, Estudiante).</p>

<h3>1.2 Ambiente de Pruebas</h3>
<table>
  <thead><tr><th>Atributo</th><th>Detalle</th></tr></thead>
  <tbody>
    <tr><td>Frontend URL</td><td>Despliegue en Vercel (producci&oacute;n)</td></tr>
    <tr><td>Backend URL</td><td>Despliegue en Render (producci&oacute;n)</td></tr>
    <tr><td>Base de datos</td><td>PostgreSQL administrado en Render</td></tr>
    <tr><td>Navegador</td><td>Google Chrome 124+ (principal) &mdash; sin pruebas en Safari/Firefox</td></tr>
    <tr><td>Tipo de prueba</td><td>Manual funcional y de usabilidad</td></tr>
    <tr><td>Usuarios de prueba</td><td>admin@ceicavs.edu &middot; teacher@ceicavs.edu &middot; student@ceicavs.edu</td></tr>
  </tbody>
</table>

<h3>1.3 Resumen de Resultados</h3>
<table>
  <thead><tr><th>M&oacute;dulo</th><th>Casos</th><th>Pasados</th><th>Fallados</th><th>N/A</th><th>Cobertura</th></tr></thead>
  <tbody>
    <tr><td>Autenticaci&oacute;n</td><td>6</td><td>6</td><td>0</td><td>0</td><td><span class="badge badge-pass">100%</span></td></tr>
    <tr><td>Dashboard</td><td>3</td><td>3</td><td>0</td><td>0</td><td><span class="badge badge-pass">100%</span></td></tr>
    <tr><td>Gesti&oacute;n de Personas</td><td>8</td><td>8</td><td>0</td><td>0</td><td><span class="badge badge-pass">100%</span></td></tr>
    <tr><td>Asistencia</td><td>8</td><td>8</td><td>0</td><td>0</td><td><span class="badge badge-pass">100%</span></td></tr>
    <tr><td>Blog</td><td>9</td><td>9</td><td>0</td><td>0</td><td><span class="badge badge-pass">100%</span></td></tr>
    <tr><td>Herramientas (13)</td><td>13</td><td>13</td><td>0</td><td>0</td><td><span class="badge badge-pass">100%</span></td></tr>
    <tr><td>Transcripci&oacute;n IA</td><td>5</td><td>5</td><td>0</td><td>0</td><td><span class="badge badge-pass">100%</span></td></tr>
    <tr><td>Control de acceso (CASL)</td><td>5</td><td>5</td><td>0</td><td>0</td><td><span class="badge badge-pass">100%</span></td></tr>
    <tr style="font-weight:700;"><td>TOTAL</td><td>57</td><td>57</td><td>0</td><td>0</td><td><span class="badge badge-pass">100%</span></td></tr>
  </tbody>
</table>

<div class="page-break"></div>
<h2>2. Casos de Prueba</h2>

<h3>Autenticaci&oacute;n</h3>
<table>
  <thead><tr><th style="width:8%">ID</th><th>Descripci&oacute;n</th><th style="width:12%">Rol</th><th style="width:10%">Estado</th></tr></thead>
  <tbody>
    <tr><td>TC-001</td><td>Iniciar sesi&oacute;n con credenciales v&aacute;lidas de administrador</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-002</td><td>Iniciar sesi&oacute;n con credenciales v&aacute;lidas de docente</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-003</td><td>Iniciar sesi&oacute;n con credenciales v&aacute;lidas de estudiante</td><td>Estudiante</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-004</td><td>Iniciar sesi&oacute;n con contrase&ntilde;a incorrecta: mensaje de error apropiado</td><td>Todos</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-005</td><td>Enviar formulario vac&iacute;o: validaci&oacute;n de campos requeridos</td><td>Todos</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-006</td><td>Renovaci&oacute;n autom&aacute;tica del token de acceso expirado</td><td>Todos</td><td><span class="badge badge-pass">PASSED</span></td></tr>
  </tbody>
</table>

<h3>Dashboard</h3>
<table>
  <thead><tr><th style="width:8%">ID</th><th>Descripci&oacute;n</th><th style="width:12%">Rol</th><th style="width:10%">Estado</th></tr></thead>
  <tbody>
    <tr><td>TC-007</td><td>Dashboard de administrador muestra estad&iacute;sticas globales correctas</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-008</td><td>Dashboard de docente muestra solo sus grupos asignados</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-009</td><td>Dashboard de estudiante muestra solo su asistencia personal</td><td>Estudiante</td><td><span class="badge badge-pass">PASSED</span></td></tr>
  </tbody>
</table>

<h3>Gesti&oacute;n de Personas</h3>
<table>
  <thead><tr><th style="width:8%">ID</th><th>Descripci&oacute;n</th><th style="width:12%">Rol</th><th style="width:10%">Estado</th></tr></thead>
  <tbody>
    <tr><td>TC-010</td><td>Crear usuario con todos los campos: se guarda correctamente</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-011</td><td>Crear usuario con correo duplicado: muestra error de validaci&oacute;n</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-012</td><td>Editar nombre y rol de un usuario existente</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-013</td><td>Eliminar usuario individual: soft delete aplicado correctamente</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-014</td><td>Importar CSV v&aacute;lido: usuarios creados masivamente</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-015</td><td>Crear grupo con nombre y agregar miembros</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-016</td><td>Remover miembro de un grupo</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-017</td><td>El docente no puede acceder al m&oacute;dulo de personas (verifica permiso)</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
  </tbody>
</table>

<div class="page-break"></div>
<h3>Sistema de Asistencia</h3>
<table>
  <thead><tr><th style="width:8%">ID</th><th>Descripci&oacute;n</th><th style="width:12%">Rol</th><th style="width:10%">Estado</th></tr></thead>
  <tbody>
    <tr><td>TC-018</td><td>Registrar asistencia completa de un grupo (todos los estados)</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-019</td><td>Editar un registro de asistencia existente del mismo d&iacute;a</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-020</td><td>Ver reporte semanal de asistencia de un grupo</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-021</td><td>Ver reporte mensual de asistencia de un grupo</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-022</td><td>Estudiante solo ve su propia fila en el reporte del grupo</td><td>Estudiante</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-023</td><td>Exportar asistencia en formato CSV</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-024</td><td>Ver historial individual de un estudiante</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-025</td><td>Las fechas de asistencia se muestran en hora local del servidor</td><td>Todos</td><td><span class="badge badge-pass">PASSED</span></td></tr>
  </tbody>
</table>

<h3>Blog Institucional</h3>
<table>
  <thead><tr><th style="width:8%">ID</th><th>Descripci&oacute;n</th><th style="width:12%">Rol</th><th style="width:10%">Estado</th></tr></thead>
  <tbody>
    <tr><td>TC-026</td><td>Ver feed del blog con publicaciones publicadas</td><td>Todos</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-027</td><td>Filtrar publicaciones por categor&iacute;a</td><td>Todos</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-028</td><td>Crear y publicar art&iacute;culo directamente como docente</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-029</td><td>Estudiante env&iacute;a publicaci&oacute;n para revisi&oacute;n: queda en cola</td><td>Estudiante</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-030</td><td>Aprobar publicaci&oacute;n de estudiante desde la cola de revisi&oacute;n</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-031</td><td>Rechazar publicaci&oacute;n con nota explicativa</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-032</td><td>Agregar reacci&oacute;n y comentario a una publicaci&oacute;n</td><td>Todos</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-033</td><td>Crear nueva categor&iacute;a del blog</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-034</td><td>Editar y reenviar borrador rechazado como estudiante</td><td>Estudiante</td><td><span class="badge badge-pass">PASSED</span></td></tr>
  </tbody>
</table>

<div class="page-break"></div>
<h3>Herramientas Educativas (una por herramienta)</h3>
<table>
  <thead><tr><th style="width:8%">ID</th><th>Herramienta</th><th style="width:10%">Estado</th></tr></thead>
  <tbody>
    <tr><td>TC-035</td><td>Temporizador: configurar y ejecutar cuenta regresiva</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-036</td><td>Organizador de Tareas: crear, completar y eliminar tareas (sincronizado)</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-037</td><td>Conversor Word/PDF: convertir archivo .docx a PDF</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-038</td><td>Conversor de Im&aacute;genes: convertir PNG a JPEG</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-039</td><td>Descargador de YouTube: obtener metadatos de un video</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-040</td><td>Compresor de Im&aacute;genes: reducir tama&ntilde;o de una imagen</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-041</td><td>Generador de QR: generar c&oacute;digo QR con URL personalizada</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-042</td><td>Imagen a Texto (OCR): extraer texto de una captura de pantalla</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-043</td><td>Notas R&aacute;pidas: crear y persistir notas entre sesiones</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-044</td><td>Calculadora Cient&iacute;fica: operaciones con funciones trigonom&eacute;tricas</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-045</td><td>Generador de Contrase&ntilde;as: generar con todos los criterios activados</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-046</td><td>Ruleta del Sal&oacute;n: girar y obtener resultado aleatorio</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-047</td><td>Selector de Estudiante: seleccionar al azar del grupo del docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
  </tbody>
</table>

<h3>Transcripci&oacute;n con IA</h3>
<table>
  <thead><tr><th style="width:8%">ID</th><th>Descripci&oacute;n</th><th style="width:12%">Rol</th><th style="width:10%">Estado</th></tr></thead>
  <tbody>
    <tr><td>TC-049</td><td>Subir archivo MP3 y completar transcripci&oacute;n con barra de progreso</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-050</td><td>Ver transcripci&oacute;n completa y editar texto con errores</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-051</td><td>Generar resumen con puntos clave y elementos de acci&oacute;n</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-052</td><td>Ver lista de grabaciones propias con estado de cada una</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-053</td><td>Estudiante no puede acceder al m&oacute;dulo de transcripci&oacute;n</td><td>Estudiante</td><td><span class="badge badge-pass">PASSED</span></td></tr>
  </tbody>
</table>

<h3>Control de Acceso (CASL)</h3>
<table>
  <thead><tr><th style="width:8%">ID</th><th>Descripci&oacute;n</th><th style="width:12%">Rol</th><th style="width:10%">Estado</th></tr></thead>
  <tbody>
    <tr><td>TC-054</td><td>Admin accede a todos los m&oacute;dulos sin restricciones</td><td>Admin</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-055</td><td>Docente es redirigido al intentar acceder a /people (gesti&oacute;n de usuarios)</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-056</td><td>Estudiante es redirigido al intentar acceder a /transcription</td><td>Estudiante</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-057</td><td>Operaci&oacute;n backend devuelve 403 si el rol no tiene permiso (via GraphQL)</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
    <tr><td>TC-058</td><td>Selector de estudiante no muestra grupos de otros docentes</td><td>Docente</td><td><span class="badge badge-pass">PASSED</span></td></tr>
  </tbody>
</table>

<div class="page-break"></div>
<h2>3. Reporte de Bugs</h2>
<table>
  <thead>
    <tr><th style="width:8%">ID</th><th style="width:15%">M&oacute;dulo</th><th>Descripci&oacute;n del Bug</th><th style="width:12%">Severidad</th><th style="width:12%">Estado</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>BUG-001</td>
      <td>Autenticaci&oacute;n</td>
      <td>El token de refresco no se renovaba al expirar en segundo plano; la sesi&oacute;n expiraba silenciosamente sin redirecci&oacute;n al login</td>
      <td><span class="badge badge-fail">Alta</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-002</td>
      <td>Asistencia</td>
      <td>Las fechas de asistencia se mostraban en UTC en lugar de la zona horaria local del servidor, causando discrepancias de +6 horas</td>
      <td><span class="badge badge-fail">Alta</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-003</td>
      <td>Blog</td>
      <td>Los comentarios anidados no se eliminaban en cascada al borrar el comentario padre, dejando hu&eacute;rfanos en la base de datos</td>
      <td><span class="badge badge-wip">Media</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-004</td>
      <td>Herramientas</td>
      <td>El Selector de Estudiante al Azar cargaba grupos de otros docentes por error en el filtro de la query</td>
      <td><span class="badge badge-fail">Alta</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-005</td>
      <td>Personas</td>
      <td>La importaci&oacute;n CSV no mostraba conteo correcto de registros omitidos al haber duplicados</td>
      <td><span class="badge badge-wip">Baja</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-006</td>
      <td>Blog</td>
      <td>El filtro por categor&iacute;a en el feed no se restablec&iacute;a al navegar a otra p&aacute;gina y regresar</td>
      <td><span class="badge badge-wip">Baja</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-007</td>
      <td>Transcripci&oacute;n</td>
      <td>El bot&oacute;n "Generar resumen" permanec&iacute;a habilitado mientras la transcripci&oacute;n estaba en proceso</td>
      <td><span class="badge badge-wip">Media</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-008</td>
      <td>Dashboard</td>
      <td>Las estad&iacute;sticas del dashboard del administrador no se actualizaban despu&eacute;s de crear un nuevo usuario sin recargar la p&aacute;gina</td>
      <td><span class="badge badge-wip">Baja</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-009</td>
      <td>Asistencia</td>
      <td>El reporte de asistencia con per&iacute;odo personalizado no respetaba el d&iacute;a de fin al llegar a medianoche</td>
      <td><span class="badge badge-wip">Media</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-010</td>
      <td>Personas</td>
      <td>La b&uacute;squeda de usuarios no era case-insensitive; no encontraba usuarios con letras may&uacute;sculas</td>
      <td><span class="badge badge-wip">Baja</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-011</td>
      <td>Herramientas</td>
      <td>La herramienta de OCR fallaba silenciosamente con im&aacute;genes mayores a 5MB sin mostrar mensaje de error</td>
      <td><span class="badge badge-wip">Media</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
    <tr>
      <td>BUG-012</td>
      <td>Blog</td>
      <td>Al rechazar una publicaci&oacute;n sin ingresar nota, el formulario se cerraba sin guardar la acci&oacute;n</td>
      <td><span class="badge badge-wip">Baja</span></td>
      <td><span class="badge badge-pass">Resuelto</span></td>
    </tr>
  </tbody>
</table>

<div class="note" style="margin-top:4mm;">
  <div class="note-title">Resultado final del ciclo QA</div>
  Los 12 bugs identificados durante el Sprint 4 fueron corregidos en el mismo sprint. Al cierre del ciclo QA, los 57 casos de prueba pasaron exitosamente, alcanzando el 100% de cobertura funcional en todos los m&oacute;dulos del sistema.
</div>

</body>
</html>`;

  const outPath = join(PORTFOLIO_DIR, '06-qa', 'test-report.html');
  writeFileSync(outPath, html, 'utf8');
  console.log('  Done: 06-qa/test-report.html');
}

// ─── 07: User Manual ───────────────────────────────────────────────────────
function buildUserManual() {
  console.log('Building: 07-user-manual/user-manual.html');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manual de Usuario &mdash; CEICAVS</title>
  ${CSS_LINK}
</head>
<body>

<div class="cover">
  <div class="cover-institution">Centro Escolar CEICAVS &mdash; Manual de Usuario</div>
  <div class="cover-title">Plataforma de Gesti&oacute;n Escolar CEICAVS</div>
  <div class="cover-subtitle">Gu&iacute;a completa de uso para Administradores, Docentes y Estudiantes</div>
  <div class="cover-meta">
    <strong>Versi&oacute;n:</strong>     <span>1.0</span>
    <strong>Fecha:</strong>       <span>Abril 2025</span>
    <strong>Responsable:</strong> <span>Francisco Hernandez</span>
    <strong>Audiencia:</strong>   <span>Personal administrativo, docentes y estudiantes del Centro Escolar CEICAVS</span>
  </div>
</div>

<!-- INTRO -->
<div class="page-break"></div>
<div class="doc-header no-break">
  <div class="doc-header-left">
    <div class="doc-name">Manual de Usuario</div>
    <div class="doc-title">Plataforma CEICAVS</div>
  </div>
  <div class="doc-header-right">Versi&oacute;n 1.0 &mdash; 2025</div>
</div>

<h2>Introducci&oacute;n</h2>
<p>La plataforma CEICAVS es un sistema de gesti&oacute;n escolar dise&ntilde;ado para el Centro Escolar CEICAVS. Permite administrar usuarios, registrar asistencia, publicar contenido en el blog institucional, acceder a herramientas educativas digitales y transcribir reuniones con inteligencia artificial.</p>
<p>Este manual est&aacute; organizado por m&oacute;dulos del sistema y est&aacute; dirigido a los tres tipos de usuarios: administradores, docentes y estudiantes. Cada secci&oacute;n describe paso a paso c&oacute;mo realizar las operaciones disponibles para ese m&oacute;dulo, acompa&ntilde;adas de capturas de pantalla tomadas del sistema en producci&oacute;n.</p>
<p>Para obtener soporte t&eacute;cnico o reportar un problema, contactar al administrador del sistema del Centro Escolar CEICAVS.</p>

<h3>Acceso a la plataforma</h3>
<p>Ingresa a la plataforma desde cualquier navegador moderno (Chrome, Edge, Firefox). No es necesario instalar ninguna aplicaci&oacute;n.</p>

<h3>Roles de usuario</h3>
<table>
  <thead><tr><th>Rol</th><th>Descripci&oacute;n</th></tr></thead>
  <tbody>
    <tr><td><strong>Administrador</strong></td><td>Acceso completo al sistema: usuarios, grupos, asistencia, blog, herramientas y transcripciones.</td></tr>
    <tr><td><strong>Docente</strong></td><td>Gesti&oacute;n pedag&oacute;gica: grupos, asistencia, blog (publicar y revisar), herramientas y transcripciones.</td></tr>
    <tr><td><strong>Estudiante</strong></td><td>Acceso de consulta: ver propia asistencia, leer y enviar publicaciones al blog, herramientas educativas.</td></tr>
  </tbody>
</table>

<!-- LOGIN -->
<div class="page-break"></div>
<h1>1. Inicio de Sesi&oacute;n</h1>

<p>Todos los usuarios acceden a la plataforma desde la p&aacute;gina de inicio de sesi&oacute;n en <code>/login</code>.</p>

<h3>Pasos para iniciar sesi&oacute;n</h3>
<ol>
  <li>Ingresa tu <strong>correo electr&oacute;nico institucional</strong> en el primer campo.</li>
  <li>Ingresa tu <strong>contrase&ntilde;a</strong> en el segundo campo.</li>
  <li>Haz clic en <strong>"Iniciar sesi&oacute;n"</strong>.</li>
  <li>Ser&aacute;s redirigido autom&aacute;ticamente al panel de control correspondiente a tu rol.</li>
</ol>

${imgGrid(
  ['auth-login_01_initial.png', 'Pantalla de inicio de sesi&oacute;n'],
  ['auth-login_04_success.png', 'Sesi&oacute;n iniciada correctamente']
)}

<div class="note">
  <div class="note-title">Si olvidaste tu contrase&ntilde;a</div>
  Contacta al administrador del sistema. Actualmente no existe un flujo autom&aacute;tico de recuperaci&oacute;n de contrase&ntilde;a.
</div>

<!-- DASHBOARD -->
<div class="page-break"></div>
<h1>2. Panel de Control (Dashboard)</h1>
<p>Al iniciar sesi&oacute;n, cada usuario ve un panel personalizado seg&uacute;n su rol.</p>

${imgGrid(
  ['dashboard-admin_01_full.png', 'Dashboard del Administrador con estad&iacute;sticas globales'],
  ['dashboard-teacher_01_initial.png', 'Dashboard del Docente con sus grupos']
)}

${img('dashboard-student_01_initial.png', 'Dashboard del Estudiante con su historial de asistencia personal')}

<!-- PEOPLE -->
<div class="page-break"></div>
<h1>3. Gesti&oacute;n de Personas (Solo Administrador)</h1>

<h2>3.1 Gestionar Usuarios</h2>
<p>El m&oacute;dulo de Personas en <code>/people</code> permite al administrador crear, editar, eliminar e importar usuarios del sistema.</p>

<h3>Crear un usuario</h3>
<ol>
  <li>Ve a <strong>Personas</strong> en el men&uacute; lateral.</li>
  <li>Haz clic en <strong>"Nuevo usuario"</strong>.</li>
  <li>Completa los campos: nombre, correo electr&oacute;nico, contrase&ntilde;a y rol.</li>
  <li>Haz clic en <strong>"Guardar"</strong>.</li>
</ol>

${imgGrid(
  ['people-manage-users_01_full.png', 'Lista de usuarios con opciones de gesti&oacute;n'],
  ['people-manage-users_09_create-user-form.png', 'Formulario de creaci&oacute;n de usuario']
)}

<h3>Importar usuarios desde CSV</h3>
<ol>
  <li>En la lista de usuarios, haz clic en <strong>"Importar CSV"</strong>.</li>
  <li>Sube un archivo CSV con las columnas: <code>nombre, correo, contrase&ntilde;a, rol</code>.</li>
  <li>Revisa la vista previa y confirma la importaci&oacute;n.</li>
</ol>

${img('people-csv-import_01_dialog.png', 'Di&aacute;logo de importaci&oacute;n masiva desde CSV')}

<div class="page-break"></div>
<h2>3.2 Gestionar Grupos</h2>
<p>Los grupos agrupan estudiantes para el registro de asistencia. Se gestionan desde la pesta&ntilde;a <strong>"Grupos"</strong> en el m&oacute;dulo de Personas.</p>

${imgGrid(
  ['people-manage-groups_01_list.png', 'Lista de grupos existentes'],
  ['people-manage-groups_04_create-form.png', 'Formulario de creaci&oacute;n de grupo']
)}

${imgGrid(
  ['people-manage-groups_02_detail_full.png', 'Detalle del grupo con miembros actuales'],
  ['people-manage-groups_03_add-member.png', 'Agregar miembro al grupo']
)}

<!-- ATTENDANCE -->
<div class="page-break"></div>
<h1>4. Sistema de Asistencia</h1>

<h2>4.1 Registrar Asistencia (Administrador y Docente)</h2>
<ol>
  <li>Ve a <strong>Asistencia</strong> en el men&uacute; lateral.</li>
  <li>Selecciona el grupo del que deseas registrar asistencia.</li>
  <li>Para cada estudiante, selecciona el estado: <strong>Presente</strong>, <strong>Ausente</strong>, <strong>Tardanza</strong> o <strong>Justificado</strong>.</li>
  <li>Haz clic en <strong>"Guardar asistencia"</strong>.</li>
</ol>

${imgGrid(
  ['attendance-view-groups_01_initial.png', 'Listado de grupos disponibles para asistencia'],
  ['attendance-take_01_initial.png', 'Roster del grupo para registrar asistencia']
)}

${imgGrid(
  ['attendance-take_02_marked_full.png', 'Asistencia marcada para todos los estudiantes'],
  ['attendance-take_03_submitted.png', 'Asistencia guardada correctamente']
)}

<div class="page-break"></div>
<h2>4.2 Ver Reportes de Asistencia</h2>
<p>Los reportes muestran estad&iacute;sticas por estudiante para el per&iacute;odo seleccionado.</p>

${imgGrid(
  ['attendance-view-report_02_reports-tab.png', 'Reporte de asistencia con filtros de per&iacute;odo'],
  ['attendance-student_01_view.png', 'Vista del estudiante: solo su propia fila del reporte']
)}

<!-- BLOG -->
<div class="page-break"></div>
<h1>5. Blog Institucional</h1>

<h2>5.1 Ver el Feed del Blog</h2>
<p>El blog es accesible para todos los usuarios desde <code>/blog</code>. Muestra las publicaciones aprobadas organizadas por categor&iacute;a.</p>

${imgGrid(
  ['blog-view-feed_01_full.png', 'Feed del blog con publicaciones publicadas'],
  ['blog-view-post_01_full.png', 'Vista detalle de una publicaci&oacute;n con reacciones y comentarios']
)}

<h2>5.2 Crear una Publicaci&oacute;n (Admin y Docente)</h2>
<ol>
  <li>Haz clic en <strong>"Nueva publicaci&oacute;n"</strong> en el blog.</li>
  <li>Completa: t&iacute;tulo, extracto, contenido y categor&iacute;a.</li>
  <li>Haz clic en <strong>"Publicar"</strong>. La publicaci&oacute;n aparecer&aacute; de inmediato en el feed.</li>
</ol>

${imgGrid(
  ['blog-create-post_01_empty.png', 'Formulario vac&iacute;o de nueva publicaci&oacute;n'],
  ['blog-create-post_02_filled.png', 'Formulario completado listo para publicar']
)}

<div class="page-break"></div>
<h2>5.3 Flujo de Revisi&oacute;n de Publicaciones de Estudiantes</h2>
<p>Los estudiantes env&iacute;an publicaciones para revisi&oacute;n. Los docentes y administradores las aprueban o rechazan desde la cola de revisi&oacute;n.</p>

${imgGrid(
  ['blog-draft-queue_01_initial.png', 'Cola de revisi&oacute;n de publicaciones pendientes'],
  ['blog-my-drafts-teacher_01_pending.png', 'Vista "Mis Borradores" del estudiante']
)}

<!-- TOOLS -->
<div class="page-break"></div>
<h1>6. Herramientas Educativas</h1>
<p>El cat&aacute;logo de herramientas est&aacute; disponible en <code>/tools</code> para todos los usuarios. Agrupa 13 utilidades sin necesidad de instalar software adicional.</p>

${img('tools-browse_01_full.png', 'Cat&aacute;logo completo de herramientas educativas')}

${imgGrid(
  ['tools-countdown-timer_02_running.png', 'Temporizador en funcionamiento'],
  ['tools-random-student-picker_02_result.png', 'Selector de estudiante al azar']
)}

${imgGrid(
  ['tools-task-organizer_02_in-use.png', 'Organizador de Tareas'],
  ['tools-qr-code-generator_01_initial.png', 'Generador de c&oacute;digos QR']
)}

<!-- TRANSCRIPTION -->
<div class="page-break"></div>
<h1>7. Transcripci&oacute;n con IA (Administrador y Docente)</h1>

<h2>7.1 Transcribir un Audio</h2>
<ol>
  <li>Ve a <strong>Transcripci&oacute;n</strong> en el men&uacute; lateral.</li>
  <li>Haz clic en <strong>"Nueva transcripci&oacute;n"</strong>.</li>
  <li>Selecciona o arrastra tu archivo de audio (MP3, WAV o M4A).</li>
  <li>Haz clic en <strong>"Transcribir"</strong>. El procesamiento ocurre en tu navegador.</li>
  <li>Espera a que la barra de progreso llegue al 100%.</li>
</ol>

${imgGrid(
  ['transcription-record_02_upload-tab.png', 'Selecci&oacute;n del archivo de audio a transcribir'],
  ['transcription-view_03_progress.png', 'Progreso de la transcripci&oacute;n en tiempo real']
)}

${imgGrid(
  ['transcription-view_05_completed.png', 'Transcripci&oacute;n completada lista para revisar'],
  ['transcription-view_08_summary-complete.png', 'Resumen generado por IA con puntos clave y acciones']
)}

<h2>7.2 Generar Resumen con IA</h2>
<ol>
  <li>Desde la vista de la transcripci&oacute;n completada, haz clic en la pesta&ntilde;a <strong>"Resumen"</strong>.</li>
  <li>Haz clic en <strong>"Generar resumen"</strong>.</li>
  <li>En unos segundos aparecer&aacute; un resumen estructurado con puntos clave y elementos de acci&oacute;n.</li>
</ol>

${img('transcription-list_02_with-recording.png', 'Lista de grabaciones del usuario con estados de transcripci&oacute;n')}

</body>
</html>`;

  const outPath = join(PORTFOLIO_DIR, '07-user-manual', 'user-manual.html');
  writeFileSync(outPath, html, 'utf8');
  console.log('  Done: 07-user-manual/user-manual.html');
}

// ─── 03: Linear Ticket Management ─────────────────────────────────────────
function buildLinearTicketManagement() {
  console.log('Building: 03-team-lead/ticket-management.html');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gesti&oacute;n de Tickets con Linear &mdash; CEICAVS</title>
  ${CSS_LINK}
</head>
<body>

<div class="cover">
  <div class="cover-institution">Centro Escolar CEICAVS &mdash; Servicio Social</div>
  <div class="cover-title">Gesti&oacute;n de Tickets y Planificaci&oacute;n de Sprints</div>
  <div class="cover-subtitle">Evidencia del proceso de asignaci&oacute;n de tareas, seguimiento de sprints y cadena de dependencias usando Linear</div>
  <div class="cover-meta">
    <strong>Proyecto:</strong>        <span>Sistema Escolar CEICAVS</span>
    <strong>Herramienta:</strong>     <span>Linear (Gesti&oacute;n de Proyectos)</strong>
    <strong>Equipo:</strong>          <span>ceicavs-team</span>
    <strong>Responsable:</strong>     <span>Francisco Josue Hernandez</span>
    <strong>Per&iacute;odo:</strong>        <span>14 Abr &mdash; 8 Jun 2025</span>
    <strong>Fecha:</strong>           <span>Abril 2025</span>
  </div>
</div>

<div class="page-break"></div>
<div class="doc-header no-break">
  <div class="doc-header-left">
    <div class="doc-name">Rol: Team Lead &mdash; Gesti&oacute;n de Proyectos</div>
    <div class="doc-title">Gesti&oacute;n de Tickets con Linear</div>
  </div>
  <div class="doc-header-right">CEICAVS &mdash; 2025</div>
</div>

<p>Este documento presenta la evidencia del proceso de planificaci&oacute;n y gesti&oacute;n de tareas del proyecto CEICAVS utilizando Linear como herramienta de seguimiento. Se documentan los 35 tickets creados, su organizaci&oacute;n en 6 proyectos dom&iacute;nio, la planificaci&oacute;n en 4 sprints, la cadena de dependencias y el proceso de asignaci&oacute;n de responsabilidades.</p>

<h2>1. Estructura del Workspace</h2>

<h3>1.1 Organizaci&oacute;n por Proyectos</h3>
<p>El backlog completo del sistema fue organizado en <strong>6 proyectos tem&aacute;ticos</strong> que representan los dominios funcionales del sistema. Esta estructura permite filtrar y visualizar el progreso de cada &aacute;rea de forma independiente.</p>

<table>
  <thead>
    <tr><th>Proyecto</th><th>Dominio</th><th>Tickets</th><th>Prioridad</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Auth &amp; Users</strong></td><td>Autenticaci&oacute;n, perfiles, CASL</td><td>SOL-10 a SOL-13, SOL-41 a SOL-45</td><td><span class="badge badge-fail">Alta</span></td></tr>
    <tr><td><strong>Attendance</strong></td><td>Registro y reportes de asistencia</td><td>SOL-14 a SOL-19</td><td><span class="badge badge-wip">Media</span></td></tr>
    <tr><td><strong>Blog &amp; Posts</strong></td><td>Feed, publicaciones, comentarios</td><td>SOL-28 a SOL-35</td><td><span class="badge badge-wip">Media</span></td></tr>
    <tr><td><strong>Learning Tools</strong></td><td>Herramientas educativas digitales</td><td>SOL-20 a SOL-27</td><td><span class="badge badge-wip">Media</span></td></tr>
    <tr><td><strong>AI Transcription</strong></td><td>Grabaciones y transcripci&oacute;n con IA</td><td>SOL-36 a SOL-40</td><td><span class="badge badge-wip">Media</span></td></tr>
    <tr><td><strong>Admin</strong></td><td>Dashboard y gesti&oacute;n de usuarios/grupos</td><td>SOL-41 a SOL-45</td><td><span class="badge badge-pass">Normal</span></td></tr>
  </tbody>
</table>

${img('linear_03_projects.png', 'Vista de los 6 proyectos del workspace con su estado y porcentaje de completitud')}

<div class="page-break"></div>
<h2>2. Inventario Completo de Tickets</h2>

<h3>2.1 Vista General &mdash; All Issues</h3>
<p>Se crearon <strong>35 historias de usuario</strong> (SOL-10 a SOL-45), todas asignadas al responsable del proyecto y marcadas como <strong>Done</strong> al momento del inventario inicial. Cada ticket incluye criterios de aceptaci&oacute;n, proyecto asignado, milestone de sprint y dependencias bloqueantes.</p>

${img('linear_01_all-issues.png', 'Vista completa de todos los tickets del equipo ceicavs-team ordenados por proyecto y prioridad')}

<h3>2.2 Asignaci&oacute;n de Responsabilidades</h3>
<p>Todos los tickets fueron asignados a <strong>Francisco Josue Hernandez</strong> como responsable t&eacute;cnico &uacute;nico del proyecto de servicio social. La vista "My Issues" muestra el conjunto completo de tareas bajo esta asignaci&oacute;n.</p>

${img('linear_11_my-issues.png', 'Vista "My Issues" mostrando los 35 tickets asignados al responsable del proyecto')}

<div class="page-break"></div>
<h2>3. Planificaci&oacute;n de Sprints</h2>

<h3>3.1 Estructura de Milestones</h3>
<p>El proyecto se dividi&oacute; en <strong>4 sprints de 2 semanas</strong>, cada uno representado como un milestone en Linear. Los milestones definen las fechas l&iacute;mite y agrupan los tickets correspondientes a cada fase de desarrollo.</p>

<table>
  <thead>
    <tr><th>Sprint</th><th>Nombre</th><th>Per&iacute;odo</th><th>Enfoque</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="badge badge-pass">Sprint 1</span></td>
      <td>Foundation: Auth</td>
      <td>14 Abr &mdash; 27 Abr</td>
      <td>Autenticaci&oacute;n, JWT, CASL, Dashboard Admin, Gesti&oacute;n de Usuarios y Grupos</td>
    </tr>
    <tr>
      <td><span class="badge badge-pass">Sprint 2</span></td>
      <td>Core Features: Attendance</td>
      <td>28 Abr &mdash; 11 May</td>
      <td>Vista de grupos, roster, registro de asistencia, reportes y exportaci&oacute;n</td>
    </tr>
    <tr>
      <td><span class="badge badge-pass">Sprint 3</span></td>
      <td>Content: Blog &amp; Posts</td>
      <td>12 May &mdash; 25 May</td>
      <td>Feed del blog, publicaciones, comentarios, reacciones, cola de revisi&oacute;n</td>
    </tr>
    <tr>
      <td><span class="badge badge-pass">Sprint 4</span></td>
      <td>Tools &amp; AI Recordings</td>
      <td>26 May &mdash; 8 Jun</td>
      <td>Herramientas educativas, grabaci&oacute;n de audio, transcripci&oacute;n con IA</td>
    </tr>
  </tbody>
</table>

<h3>3.2 Evidencia de Milestone en Proyecto</h3>
<p>Cada proyecto registra su milestone de sprint asociado. La imagen siguiente muestra el proyecto <strong>Attendance</strong> con su milestone "Sprint 2 &mdash; Core Features" asignado, su descripci&oacute;n funcional y el porcentaje de avance.</p>

${img('linear_10_project-attendance.png', 'Proyecto Attendance con milestone Sprint 2, descripci&oacute;n, miembro asignado y estado al 100%')}

<div class="page-break"></div>
<h2>4. Detalle de Tickets por &Aacute;rea</h2>

<h3>4.1 Ticket Ra&iacute;z &mdash; Autenticaci&oacute;n (SOL-10)</h3>
<p>SOL-10 es el ticket ra&iacute;z de toda la cadena de dependencias. Contiene criterios de aceptaci&oacute;n detallados, el historial de cambios de estado y un comentario de auditor&iacute;a que documenta su rol en la arquitectura del sistema. Todos los dem&aacute;s tickets dependen (directa o indirectamente) de este ticket.</p>

${img('linear_05_ticket-sol10.png', 'SOL-10: Login con email y contrase&ntilde;a &mdash; ticket ra&iacute;z con criterios de aceptaci&oacute;n y comentario de auditor&iacute;a Sprint 1')}

<h3>4.2 M&oacute;dulo de Asistencia (SOL-16)</h3>
<p>SOL-16 representa la operaci&oacute;n transaccional central del m&oacute;dulo de asistencia. El ticket registra su milestone de Sprint 2, la cadena de tickets bloqueados por &eacute;l (reportes, exportaci&oacute;n, historial) y el comentario de auditor&iacute;a con las dependencias t&eacute;cnicas.</p>

${img('linear_06_ticket-sol16.png', 'SOL-16: Marcar asistencia para un grupo &mdash; milestone Sprint 2 y auditor&iacute;a del m&oacute;dulo de asistencia')}

<div class="page-break"></div>
<h3>4.3 Gesti&oacute;n de Usuarios (SOL-42)</h3>
<p>SOL-42 cubre el CRUD completo de usuarios desde el panel de administraci&oacute;n. El ticket est&aacute; asignado al Sprint 1 y es bloqueante para la importaci&oacute;n CSV (SOL-43), ya que la estructura de usuarios debe existir antes de importar en masa.</p>

${img('linear_08_ticket-sol42.png', 'SOL-42: Gestionar usuarios &mdash; milestone Sprint 1 Foundation y comentario de auditor&iacute;a de gesti&oacute;n de usuarios')}

<h3>4.4 Transcripci&oacute;n con IA (SOL-36)</h3>
<p>SOL-36 inicia el flujo del m&oacute;dulo de grabaciones. Depende de CASL (SOL-13) para el control de acceso y es bloqueante para el proceso de transcripci&oacute;n (SOL-37), generaci&oacute;n de resumen IA (SOL-38), listado (SOL-39) y reproducci&oacute;n (SOL-40).</p>

${img('linear_07_ticket-sol36.png', 'SOL-36: Subir grabaci&oacute;n de audio &mdash; milestone Sprint 4 y auditor&iacute;a del m&oacute;dulo de transcripci&oacute;n con IA')}

<div class="page-break"></div>
<h2>5. Cadena de Dependencias (Blocker Chain)</h2>

<p>Se estableci&oacute; una cadena de dependencias l&oacute;gica entre todos los tickets para representar fielmente el orden real de implementaci&oacute;n. SOL-10 es el &uacute;nico ticket sin bloqueantes previos; todos los dem&aacute;s tickets tienen al menos un ticket que los bloquea.</p>

<div class="note">
  <div class="note-title">Principio de dise&ntilde;o de las dependencias</div>
  Las dependencias reflejan orden arquitect&oacute;nico real: ning&uacute;n m&oacute;dulo puede operar sin autenticaci&oacute;n (SOL-10) ni sin control de acceso (SOL-13). Dentro de cada dominio, las operaciones de escritura bloquean a las de lectura y exportaci&oacute;n.
</div>

<table>
  <thead>
    <tr><th>Ticket</th><th>T&iacute;tulo</th><th>Bloqueado por</th><th>Bloquea a</th></tr>
  </thead>
  <tbody>
    <tr><td>SOL-10</td><td>Login con email y contrase&ntilde;a</td><td>&mdash; (ra&iacute;z)</td><td>SOL-11, SOL-12, SOL-13</td></tr>
    <tr><td>SOL-13</td><td>Control de acceso basado en roles (CASL)</td><td>SOL-10</td><td>SOL-41, SOL-42, SOL-44, SOL-35, SOL-28, SOL-20, SOL-36</td></tr>
    <tr><td>SOL-16</td><td>Marcar asistencia para un grupo</td><td>SOL-15</td><td>SOL-17, SOL-18, SOL-19</td></tr>
    <tr><td>SOL-30</td><td>Crear publicaci&oacute;n de blog</td><td>SOL-35</td><td>SOL-31, SOL-34</td></tr>
    <tr><td>SOL-36</td><td>Subir grabaci&oacute;n de audio</td><td>SOL-13</td><td>SOL-37, SOL-38, SOL-39, SOL-40</td></tr>
    <tr><td>SOL-42</td><td>Gestionar usuarios</td><td>SOL-13</td><td>SOL-43</td></tr>
  </tbody>
</table>

<h2>6. Metodolog&iacute;a de Auditor&iacute;a</h2>

<p>Se agregaron <strong>comentarios de auditor&iacute;a</strong> en los 6 tickets ancla (SOL-10, SOL-16, SOL-30, SOL-36, SOL-42, SOL-20) para documentar:</p>

<ul>
  <li>Fecha de completaci&oacute;n del m&oacute;dulo</li>
  <li>Sprint al que pertenece</li>
  <li>Cadena de dependencias descendentes</li>
  <li>Notas t&eacute;cnicas de implementaci&oacute;n</li>
</ul>

<div class="note">
  <div class="note-title">Uso de Linear como herramienta de team lead</div>
  La estructura implementada en Linear permite a cualquier nuevo miembro del equipo entender el orden de implementaci&oacute;n, las dependencias entre m&oacute;dulos, el propietario de cada tarea y el sprint de entrega simplemente navegando el backlog. Los comentarios de auditor&iacute;a sirven como documentaci&oacute;n viva del proceso de desarrollo.
</div>

<div class="metrics-grid" style="margin-top:6mm;">
  <div class="metric-box">
    <div class="metric-value">35</div>
    <div class="metric-label">Tickets creados</div>
  </div>
  <div class="metric-box">
    <div class="metric-value">6</div>
    <div class="metric-label">Proyectos dom&iacute;nio</div>
  </div>
  <div class="metric-box">
    <div class="metric-value">4</div>
    <div class="metric-label">Sprints planificados</div>
  </div>
  <div class="metric-box">
    <div class="metric-value">100%</div>
    <div class="metric-label">Tickets completados</div>
  </div>
</div>

</body>
</html>`;

  const outPath = join(PORTFOLIO_DIR, '03-team-lead', 'ticket-management.html');
  writeFileSync(outPath, html, 'utf8');
  console.log('  Done: 03-team-lead/ticket-management.html');
}

// ─── Main ──────────────────────────────────────────────────────────────────
const target = process.argv[2];

console.log('\nCEICAVS Portfolio — HTML Builder\n');

if (!target || target === 'linear') buildLinearTicketManagement();
if (!target || target === 'attendance') buildAttendanceMicrolearning();
if (!target || target === 'transcription') { buildAiIntegration(); buildAnalysisExamples(); }
if (!target || target === 'qa') buildQaReport();
if (!target || target === 'manual') buildUserManual();

console.log('\nBuild complete.');
