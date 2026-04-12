import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname, join, basename } from 'path'
import { marked } from '../node_modules/.pnpm/marked@18.0.0/node_modules/marked/lib/marked.esm.js'

const DOCS_DIR = resolve('./docs')
const SCREENSHOTS_DIR = join(DOCS_DIR, 'screenshots')

// ─── Screenshot map: flowId → sorted absolute paths ───────────────────────────
const screenshotsByFlow = {}
for (const file of readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png')).sort()) {
  const m = file.match(/^(.+?)_\d{2}_/)
  if (m) {
    const id = m[1]
    if (!screenshotsByFlow[id]) screenshotsByFlow[id] = []
    screenshotsByFlow[id].push(join(SCREENSHOTS_DIR, file))
  }
}

// ─── Encode one screenshot ────────────────────────────────────────────────────
function encodeScreenshot(absPath) {
  return readFileSync(absPath).toString('base64')
}

// ─── Render screenshot gallery ────────────────────────────────────────────────
function screenshotGallery(paths) {
  if (!paths || paths.length === 0) return ''
  const items = paths.map(p => {
    const b64 = encodeScreenshot(p)
    const label = basename(p, '.png').replace(/_/g, ' ')
    return `<figure class="screenshot">
      <img src="data:image/png;base64,${b64}" alt="${label}"/>
      <figcaption>${label}</figcaption>
    </figure>`
  }).join('\n')
  return `<div class="screenshot-gallery">${items}</div>`
}

// ─── Convert markdown file → HTML, injecting screenshots ─────────────────────
function flowToHtml(mdPath, flowId) {
  let md = readFileSync(mdPath, 'utf8')
  // Normalise image refs to absolute before marked parses them
  md = md.replace(/!\[([^\]]*)\]\(([^)]+\.png)\)/g, (match, alt, relPath) => {
    if (relPath.startsWith('/')) return match
    const abs = resolve(dirname(mdPath), relPath)
    return `![${alt}](${abs})`
  })
  let html = marked.parse(md)
  // Replace absolute-path img tags with embedded base64
  html = html.replace(/<img src="(\/[^"]+\.png)"([^>]*)>/g, (match, absPath, rest) => {
    if (!existsSync(absPath)) return ''
    const b64 = encodeScreenshot(absPath)
    return `<img src="data:image/png;base64,${b64}"${rest}>`
  })
  // Wrap orphan img tags in figure
  html = html.replace(/<img ([^>]+)>/g, (match, attrs) => {
    if (match.includes('class="screenshot')) return match
    const altM = attrs.match(/alt="([^"]*)"/)
    const alt = altM ? altM[1] : ''
    return `<figure class="screenshot"><img ${attrs}>${alt ? `<figcaption>${alt}</figcaption>` : ''}</figure>`
  })
  // Append gallery of all screenshots for this flow (deduplicated)
  const gallery = screenshotGallery(screenshotsByFlow[flowId] || [])
  if (gallery) {
    html += `<h3>Capturas de pantalla</h3>${gallery}`
  }
  return html
}

// ─── Render a role guide ──────────────────────────────────────────────────────
function roleToHtml(mdPath) {
  let md = readFileSync(mdPath, 'utf8')
  // Clean .md links (just show label text)
  md = md.replace(/\[([^\]]+)\]\([^)]+\.md\)/g, '$1')
  return marked.parse(md)
}

// ─── Add heading IDs ──────────────────────────────────────────────────────────
function addIds(html) {
  return html.replace(/<h([1-3])>([^<]+)<\/h\1>/g, (_, lvl, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 80)
    return `<h${lvl} id="${id}">${text}</h${lvl}>`
  })
}

// ─── Build ToC ────────────────────────────────────────────────────────────────
function buildToc(html) {
  const items = []
  const re = /<h([1-2]) id="([^"]+)">([^<]+)<\/h[1-2]>/g
  let m
  while ((m = re.exec(html)) !== null) {
    items.push({ level: +m[1], id: m[2], text: m[3] })
  }
  let toc = '<nav class="toc"><h2 class="toc-title">Índice de Contenidos</h2><ul class="toc-list">'
  items.forEach(({ level, id, text }) => {
    toc += `<li class="toc-l${level}"><a href="#${id}">${text}</a></li>`
  })
  return toc + '</ul></nav>'
}

// ─── Module sections ──────────────────────────────────────────────────────────
const modules = [
  {
    title: 'Autenticación',
    flows: [['auth-login', 'Iniciar sesión']],
  },
  {
    title: 'Panel de Control',
    flows: [
      ['dashboard-admin', 'Panel del Administrador'],
      ['dashboard-teacher', 'Panel del Docente'],
      ['dashboard-student', 'Panel del Estudiante'],
    ],
  },
  {
    title: 'Personas',
    flows: [
      ['people-manage-users', 'Gestión de Usuarios'],
      ['people-csv-import', 'Importar Usuarios desde CSV'],
      ['people-manage-groups', 'Gestión de Grupos'],
    ],
  },
  {
    title: 'Asistencia',
    flows: [
      ['attendance-view-groups', 'Ver Grupos de Asistencia'],
      ['attendance-take', 'Tomar Asistencia'],
      ['attendance-view-report', 'Ver Reporte de Asistencia'],
      ['attendance-export', 'Exportar Asistencia'],
      ['attendance-student-history', 'Historial Individual de Estudiante'],
    ],
  },
  {
    title: 'Blog',
    flows: [
      ['blog-view-feed', 'Ver Feed del Blog'],
      ['blog-view-post', 'Ver Publicación'],
      ['blog-create-post', 'Crear Publicación'],
      ['blog-draft-queue', 'Cola de Revisión de Borradores'],
      ['blog-my-drafts', 'Mis Borradores'],
      ['blog-categories', 'Gestión de Categorías'],
    ],
  },
  {
    title: 'Herramientas Educativas',
    flows: [
      ['tools-browse', 'Explorar Herramientas'],
      ['tools-countdown-timer', 'Temporizador'],
      ['tools-task-organizer', 'Organizador de Tareas'],
      ['tools-text-simplifier', 'Simplificador de Texto (IA)'],
      ['tools-word-pdf-converter', 'Convertidor Word/PDF'],
      ['tools-image-format-converter', 'Convertidor de Formato de Imágenes'],
      ['tools-youtube-downloader', 'Descargador de YouTube'],
      ['tools-image-compressor', 'Compresor de Imágenes'],
      ['tools-qr-code-generator', 'Generador de Códigos QR'],
      ['tools-screenshot-to-text', 'Imagen a Texto (OCR)'],
      ['tools-quick-notes', 'Notas Rápidas'],
      ['tools-scientific-calculator', 'Calculadora Científica'],
      ['tools-password-generator', 'Generador de Contraseñas'],
      ['tools-roulette', 'Ruleta'],
      ['tools-random-student-picker', 'Selector Aleatorio de Estudiante'],
    ],
  },
  {
    title: 'Transcripción con IA',
    flows: [
      ['transcription-list', 'Lista de Grabaciones'],
      ['transcription-record', 'Subir Audio para Transcripción'],
      ['transcription-view', 'Ver Transcripción y Generar Resumen'],
    ],
  },
]

// ─── Roles ────────────────────────────────────────────────────────────────────
const roles = [
  ['admin', 'Guía del Administrador'],
  ['teacher', 'Guía del Docente'],
  ['student', 'Guía del Estudiante'],
]

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --navy:    #0F172A;
    --blue:    #3B82F6;
    --indigo:  #6366F1;
    --green:   #10B981;
    --amber:   #F59E0B;
    --rose:    #F43F5E;
    --purple:  #8B5CF6;
    --slate:   #64748B;
    --light:   #F8FAFC;
    --border:  #E2E8F0;
    --text:    #1E293B;
    --muted:   #64748B;
    --radius:  10px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.72;
    color: var(--text);
    background: #fff;
    max-width: 860px;
    margin: 0 auto;
    padding: 0 40px;
  }

  /* ── Cover ── */
  .cover {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 0;
    position: relative;
    overflow: hidden;
    page-break-after: always;
  }
  .cover-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 50%, #F0FDF4 100%);
    z-index: -1;
  }
  .cover-accent {
    position: absolute;
    top: -100px; right: -150px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    z-index: -1;
  }
  .cover-accent2 {
    position: absolute;
    bottom: -80px; left: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
    z-index: -1;
  }
  .cover-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 24px;
  }
  .cover-logo {
    font-size: 72px;
    font-weight: 900;
    letter-spacing: -4px;
    color: var(--navy);
    line-height: 1;
    margin-bottom: 4px;
  }
  .cover-logo .accent { color: var(--blue); }
  .cover-tagline {
    font-size: 20px;
    font-weight: 300;
    color: var(--slate);
    letter-spacing: -0.5px;
    margin-bottom: 56px;
  }
  .cover-rule {
    width: 72px; height: 4px;
    background: linear-gradient(90deg, var(--blue), var(--indigo));
    border-radius: 2px;
    margin-bottom: 56px;
  }
  .cover-stats {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
  }
  .cover-stat { }
  .cover-stat-value {
    font-size: 32px;
    font-weight: 800;
    color: var(--navy);
    letter-spacing: -1px;
    line-height: 1;
  }
  .cover-stat-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
    margin-top: 4px;
  }
  .cover-date {
    margin-top: 64px;
    font-size: 12px;
    color: var(--muted);
  }
  .cover-date strong { color: var(--navy); }

  /* ── ToC ── */
  .toc {
    padding: 64px 0 80px;
    page-break-after: always;
  }
  .toc-title {
    font-size: 32px !important;
    font-weight: 800 !important;
    letter-spacing: -1px !important;
    color: var(--navy) !important;
    margin: 0 0 40px !important;
    padding-bottom: 20px !important;
    border-bottom: 3px solid var(--border) !important;
  }
  .toc-title::before { display: none !important; }
  .toc-list { list-style: none; }
  .toc-list li { border-bottom: 1px solid var(--border); }
  .toc-l1 > a {
    display: flex;
    align-items: center;
    padding: 12px 0;
    font-size: 15px;
    font-weight: 700;
    color: var(--navy);
    text-decoration: none;
    gap: 12px;
  }
  .toc-l1 > a::before {
    content: '';
    display: inline-block;
    width: 4px; height: 18px;
    background: linear-gradient(180deg, var(--blue), var(--indigo));
    border-radius: 2px;
    flex-shrink: 0;
  }
  .toc-l2 > a {
    display: block;
    padding: 8px 0 8px 24px;
    font-size: 13px;
    font-weight: 500;
    color: var(--slate);
    text-decoration: none;
  }
  .toc-l1 > a:hover, .toc-l2 > a:hover { color: var(--blue); }

  /* ── Body typography ── */
  h1 {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -1.5px;
    color: var(--navy);
    margin: 72px 0 24px;
    padding-bottom: 20px;
    border-bottom: 3px solid;
    border-image: linear-gradient(90deg, var(--blue), var(--indigo), transparent) 1;
    page-break-before: always;
  }
  h2 {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--navy);
    margin: 48px 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  h2::before {
    content: '';
    display: inline-block;
    width: 4px; height: 22px;
    background: linear-gradient(180deg, var(--blue), var(--indigo));
    border-radius: 2px;
    flex-shrink: 0;
  }
  h3 {
    font-size: 13px;
    font-weight: 700;
    color: var(--slate);
    margin: 28px 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  h4 {
    font-size: 13px;
    font-weight: 600;
    color: var(--navy);
    margin: 20px 0 8px;
  }

  p { margin-bottom: 12px; }
  strong { font-weight: 700; color: var(--navy); }
  em { font-style: italic; }
  a { color: var(--blue); text-decoration: none; }

  hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 40px 0;
  }

  code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 11.5px;
    background: #F1F5F9;
    color: var(--indigo);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
  }
  pre {
    background: #0F172A;
    color: #CBD5E1;
    border-radius: 12px;
    padding: 20px 24px;
    margin: 16px 0;
    overflow-x: auto;
    font-size: 11.5px;
    line-height: 1.6;
  }
  pre code { background: none; color: inherit; padding: 0; }

  blockquote {
    border-left: 4px solid var(--blue);
    background: rgba(59,130,246,0.04);
    padding: 14px 18px;
    border-radius: 0 8px 8px 0;
    margin: 16px 0;
    color: var(--slate);
  }

  ul, ol { padding-left: 22px; margin-bottom: 12px; }
  li { margin-bottom: 5px; }

  /* ── Tables ── */
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 20px 0 28px;
    font-size: 12px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 0 1px var(--border);
  }
  thead { background: linear-gradient(135deg, var(--navy) 0%, #1E293B 100%); }
  thead th {
    color: #fff;
    padding: 12px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    white-space: nowrap;
  }
  tbody tr:nth-child(even) { background: var(--light); }
  td {
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }
  td:first-child { font-weight: 500; }

  /* ── Screenshots ── */
  figure.screenshot {
    margin: 20px 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow:
      0 4px 6px -1px rgba(0,0,0,0.1),
      0 2px 4px -2px rgba(0,0,0,0.08),
      0 0 0 1px rgba(0,0,0,0.06);
    page-break-inside: avoid;
    break-inside: avoid;
  }
  figure.screenshot img { width: 100%; display: block; }
  figure.screenshot figcaption {
    background: var(--light);
    border-top: 1px solid var(--border);
    padding: 8px 14px;
    font-size: 10.5px;
    color: var(--muted);
    font-style: italic;
  }

  .screenshot-gallery {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin: 24px 0;
  }
  .screenshot-gallery figure.screenshot { margin: 0; }

  /* ── Flow sections ── */
  .flow-section {
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px 32px;
    margin: 32px 0;
    page-break-inside: avoid;
    background: #FAFBFC;
  }
  .flow-section h2 {
    margin-top: 0;
    font-size: 18px;
  }

  /* ── Details / technical ── */
  details {
    background: var(--light);
    border: 1px solid var(--border);
    border-radius: 10px;
    margin: 20px 0;
    overflow: hidden;
    font-size: 12px;
  }
  summary {
    padding: 10px 16px;
    cursor: pointer;
    font-weight: 600;
    font-size: 11px;
    color: var(--slate);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    list-style: none;
    user-select: none;
  }
  summary::-webkit-details-marker { display: none; }
  details[open] summary { border-bottom: 1px solid var(--border); }
  details > *:not(summary) { padding: 16px; }

  /* ── Module divider ── */
  .module-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 80px 0 32px;
    padding: 28px 32px;
    background: linear-gradient(135deg, var(--navy) 0%, #1E293B 100%);
    border-radius: 16px;
    color: #fff;
    page-break-before: always;
    page-break-after: avoid;
  }
  .module-header:first-of-type { page-break-before: avoid; }
  .module-icon {
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .module-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .module-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    margin-top: 2px;
  }

  /* ── Role card header ── */
  .role-card-admin .module-header { background: linear-gradient(135deg, #7C3AED, #4F46E5); }
  .role-card-teacher .module-header { background: linear-gradient(135deg, #0369A1, #0284C7); }
  .role-card-student .module-header { background: linear-gradient(135deg, #059669, #10B981); }

  /* ── Print ── */
  @media print {
    @page { size: A4; margin: 18mm 14mm; }
    body { max-width: none; padding: 0; font-size: 11.5px; }
    .cover { page-break-after: always; min-height: 100vh; }
    .toc { page-break-after: always; }
    h1 { page-break-before: always; }
    .module-header { page-break-before: always; page-break-after: avoid; }
    figure.screenshot, .screenshot-gallery { page-break-inside: avoid; break-inside: avoid; }
    a { color: inherit; text-decoration: none; }
    details { display: none; }
    .cover-bg, .cover-accent, .cover-accent2 { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    thead { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .module-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`

// ─── Module icons ─────────────────────────────────────────────────────────────
const moduleIcons = {
  'Autenticación': '🔐',
  'Panel de Control': '📊',
  'Personas': '👥',
  'Asistencia': '✅',
  'Blog': '📝',
  'Herramientas Educativas': '🛠️',
  'Transcripción con IA': '🎙️',
}

// ─── Assemble body HTML ───────────────────────────────────────────────────────
let bodyHtml = ''

// Intro from PROJECT_DOCUMENTATION.md (just the overview + tech + permissions sections)
const masterMd = readFileSync(join(DOCS_DIR, 'PROJECT_DOCUMENTATION.md'), 'utf8')
// Extract only the first 3 sections (up to "## Flujos por Módulo")
const introEnd = masterMd.indexOf('\n## Flujos por Módulo')
const introPart = introEnd > 0 ? masterMd.slice(0, introEnd) : masterMd.slice(0, 1500)
// Also extract Permisos, Capacidades, Glosario from master
const appendixStart = masterMd.indexOf('\n## Permisos por Rol')
const appendixPart = appendixStart > 0 ? masterMd.slice(appendixStart) : ''

let introHtml = marked.parse(introPart
  .replace(/\[([^\]]+)\]\([^)]+\.md\)/g, '$1')  // strip .md links
)
bodyHtml += introHtml

// Role Guides section
bodyHtml += `<div class="module-header" style="margin-top:72px"><div class="module-icon">👤</div><div><div class="module-title">Guías por Rol</div><div class="module-sub">Documentación específica para cada tipo de usuario</div></div></div>`
for (const [roleId, roleTitle] of roles) {
  const mdPath = join(DOCS_DIR, 'roles', `${roleId}.md`)
  if (!existsSync(mdPath)) continue
  let roleHtml = roleToHtml(mdPath)
  bodyHtml += `<section class="role-card-${roleId}">${roleHtml}</section>`
}

// Module sections
for (const mod of modules) {
  const icon = moduleIcons[mod.title] || '📁'
  bodyHtml += `<div class="module-header"><div class="module-icon">${icon}</div><div><div class="module-title">${mod.title}</div><div class="module-sub">${mod.flows.length} flujo${mod.flows.length !== 1 ? 's' : ''}</div></div></div>`

  for (const [flowId, flowTitle] of mod.flows) {
    const mdPath = join(DOCS_DIR, 'flows', `${flowId}.md`)
    if (!existsSync(mdPath)) continue
    const fHtml = flowToHtml(mdPath, flowId)
    bodyHtml += `<section class="flow-section">${fHtml}</section>`
  }
}

// Appendix (permissions, capabilities, glossary)
if (appendixPart) {
  bodyHtml += marked.parse(appendixPart.replace(/\[([^\]]+)\]\([^)]+\.md\)/g, '$1'))
}

// Add IDs to headings for ToC
bodyHtml = addIds(bodyHtml)

// Build ToC
const toc = buildToc(bodyHtml)

// ─── Cover ────────────────────────────────────────────────────────────────────
const today = new Date().toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' })
const totalScreenshots = Object.values(screenshotsByFlow).reduce((n, a) => n + a.length, 0)
const cover = `
<div class="cover">
  <div class="cover-bg"></div>
  <div class="cover-accent"></div>
  <div class="cover-accent2"></div>
  <div class="cover-eyebrow">Centro Escolar CEICAVS · Plataforma de Gestión Escolar</div>
  <div class="cover-logo">CEIC<span class="accent">AVS</span></div>
  <div class="cover-tagline">Documentación Completa del Sistema</div>
  <div class="cover-rule"></div>
  <div class="cover-stats">
    <div class="cover-stat">
      <div class="cover-stat-value">3</div>
      <div class="cover-stat-label">Roles de usuario</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-value">${modules.reduce((n, m) => n + m.flows.length, 0)}</div>
      <div class="cover-stat-label">Flujos documentados</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-value">14</div>
      <div class="cover-stat-label">Herramientas educativas</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-value">${totalScreenshots}</div>
      <div class="cover-stat-label">Capturas de pantalla</div>
    </div>
  </div>
  <div class="cover-date">Generado el <strong>${today}</strong> · Versión 1.0</div>
</div>
`

// ─── Final HTML ───────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>CEICAVS — Documentación Completa del Sistema</title>
  <style>${CSS}</style>
</head>
<body>
${cover}
${toc}
${bodyHtml}
</body>
</html>`

const outPath = join(DOCS_DIR, 'ceicavs-documentation.html')
writeFileSync(outPath, html, 'utf8')
const sizeMb = (html.length / 1024 / 1024).toFixed(1)
const imgCount = (html.match(/data:image\/png/g) || []).length
console.log(`✓  HTML: ${outPath}`)
console.log(`   Size: ${sizeMb} MB  |  Screenshots embedded: ${imgCount}`)
