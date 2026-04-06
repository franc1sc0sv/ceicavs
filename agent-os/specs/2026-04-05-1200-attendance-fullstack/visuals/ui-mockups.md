# Attendance — UI Mockups

> Layout pattern: Groups list stays on the main page. Clicking a group opens a **Side Sheet** (shadcn `<Sheet side="right">`). The sheet contains roster + reports tabs. Student view is full-page (no side sheet needed).

---

## View 1: Groups List (Admin / Teacher)

```
┌─────────────────────────────────────────────────────────────────────┐
│  AppShell Sidebar │                  Main Content                    │
│  ───────────────  │  ┌───────────────────────────────────────────┐  │
│   Dashboard       │  │  Asistencia                               │  │
│ ▶ Asistencia      │  │  Selecciona un grupo para tomar la lista  │  │
│   Personas        │  └───────────────────────────────────────────┘  │
│   Blog            │                                                  │
│   Herramientas    │  ⚠ 2 grupo(s) sin asistencia registrada hoy     │
│   Transcripción   │                                                  │
│                   │  ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│                   │  │ 3ºA Matutino │ │ 3ºB Matutino │ │ 4ºA Ves │ │
│                   │  │  28 alumnos  │ │  25 alumnos  │ │ 30 alum │ │
│                   │  │   ╭───╮  93% │ │   ╭───╮  88% │ │  ╭───╮  │ │
│                   │  │   │ ● │ ✓Env │ │   │ ● │ ✓Env │ │  │   │  │ │
│                   │  │   ╰───╯      │ │   ╰───╯      │ │  ╰───╯  │ │
│                   │  └──────────────┘ └──────────────┘ └─────────┘ │
│                   │                                                  │
│                   │  ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│                   │  │Club Robótica │ │Taller de Arte│ │Eq Fútbol│ │
│                   │  │  12 alumnos  │ │  15 alumnos  │ │18 alum  │ │
│                   │  │   ╭───╮ 100% │ │   ╭───╮  --- │ │  ╭───╮  │ │
│                   │  │   │ ● │ ✓Env │ │   │   │      │ │  │ ● │  │ │
│                   │  │   ╰───╯      │ │   ╰───╯      │ │  ╰───╯  │ │
│                   │  └──────────────┘ └──────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────────────┘

Legend:
  ● = ring filled (rate color: green ≥90%, amber ≥75%, red <75%)
  ✓Env = "Enviado" badge (todaySubmitted: true)
  --- = sin datos (todayRate: null)
```

---

## View 2: Side Sheet Open — Roster Tab

```
┌─────────────────────────────────────────────────────────────────────┐
│  AppShell Sidebar │  Groups List (dimmed)   │  SIDE SHEET          │
│  ───────────────  │  ┌──────────┐ ┌──────┐  │  ╔═══════════════╗  │
│   Dashboard       │  │ 3ºA Mat  │ │ 3ºB  │  │  ║ 3ºA Matutino ║  │
│ ▶ Asistencia      │  │   ...    │ │  ... │  │  ║ Lista del día ║  │
│   Personas        │  └──────────┘ └──────┘  │  ╠═══════════════╣  │
│   Blog            │  ┌──────────┐ ┌──────┐  │  ║ Fecha: [2026-04-05]║│
│                   │  │ Club Rob │ │Taller│  │  ╠═══════╦═══════╣  │
│                   │  │   ...    │ │  ... │  │  ║Lista  ║Reportes║ │
│                   │  └──────────┘ └──────┘  │  ╠═══════╩═══════╣  │
│                   │                         │  ║ P:3 A:1 T:1   ║  │
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║ Ana López      ║  │
│                   │                         │  ║ [P] [A] [T] [J]║  │
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║ Diego Ramírez  ║  │
│                   │                         │  ║ [P] [A] [T] [J]║  │
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║ Sofía Torres   ║  │
│                   │                         │  ║ [P] [A] [T][J] ║  │
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║ Carlos Martínez║  │
│                   │                         │  ║ [P][A] [T] [J] ║  │
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║               ║  │
│                   │                         │  ║ [Enviar lista] ║  │
│                   │                         │  ╚═══════════════╝  │
└─────────────────────────────────────────────────────────────────────┘

Side Sheet specs:
  - shadcn <Sheet side="right">
  - Width: w-[480px] on desktop, full-width on mobile
  - SheetHeader: group name + date picker
  - SheetContent: scrollable roster list
  - SheetFooter (sticky): Submit button

Status segmented control per row:
  [P] = Presente  → bg-emerald-600 text-white (selected)
  [A] = Ausente   → bg-red-600 text-white (selected)
  [T] = Tarde     → bg-amber-500 text-white (selected)
  [J] = Justif.   → bg-slate-500 text-white (selected)
  Unselected: bg-transparent text-slate-500 border border-slate-200
```

---

## View 3: Side Sheet Open — Reports Tab

```
┌─────────────────────────────────────────────────────────────────────┐
│  AppShell Sidebar │  Groups List (dimmed)   │  SIDE SHEET          │
│  ───────────────  │  ...                    │  ╔═══════════════╗  │
│   Dashboard       │                         │  ║ 3ºA Matutino ║  │
│ ▶ Asistencia      │                         │  ╠═══════╦═══════╣  │
│                   │                         │  ║Lista  ║Reportes║ │
│                   │                         │  ╠═══════╩═══════╣  │
│                   │                         │  ║[Diario][Semanal][Mensual]║│
│                   │                         │  ║  [PDF↓] [Excel↓]  ║  │
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║ Alumno     Asist ║ │
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║ Ana López  ████░ 97%║│
│                   │                         │  ║            P:29 A:0 T:1 J:0║│
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║ Diego R.   ███░░ 90%║│
│                   │                         │  ║            P:25 A:2 T:3 J:0║│
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║ Sofía T.   ███░░ 87%║│
│                   │                         │  ║            P:22 A:1 T:5 J:2║│
│                   │                         │  ╠───────────────╣  │
│                   │                         │  ║ Carlos M.  ██░░░ 73%║│
│                   │                         │  ║            P:20 A:6 T:2 J:2║│
│                   │                         │  ╚═══════════════╝  │
└─────────────────────────────────────────────────────────────────────┘

Reports tab specs:
  - Period filter: segmented control (Diario / Semanal / Mensual)
  - Export row: PDF + Excel buttons (right-aligned)
  - Table: student name + progress bar + % + counts (P/A/T/J)
  - Progress bar color: green ≥90%, amber ≥75%, red <75%
  - On export click: mutation → returns jobId → toast "Exportación en proceso"
    → poll every 2s → toast updates to "Listo — Descargar"
```

---

## View 4: Student Personal View (Full Page, No Sheet)

```
┌─────────────────────────────────────────────────────────────────────┐
│  AppShell Sidebar │                  Main Content                    │
│  ───────────────  │  ┌─────────────────────────────────────────┐   │
│   Dashboard       │  │  ╔═══════════════════════════════════╗  │   │
│ ▶ Asistencia      │  │  ║  Mi Asistencia                    ║  │   │
│   Blog            │  │  ║ ─────────────────────────────── ║  │   │
│   Herramientas    │  │  ║  ╭───╮       🔥          3      ║  │   │
│   Transcripción   │  │  ║  │95%│   12 días seg.   grupos  ║  │   │
│                   │  │  ║  ╰───╯                           ║  │   │
│                   │  │  ╚═══════════════════════════════════╝  │   │
│                   │  │                                          │   │
│                   │  │  HISTORIAL                               │   │
│                   │  │                                          │   │
│                   │  │  viernes, 28 de marzo                    │   │
│                   │  │  ┌───────────────┬──────────┐           │   │
│                   │  │  │ 3ºA Matutino  │ Presente │           │   │
│                   │  │  ├───────────────┼──────────┤           │   │
│                   │  │  │ Club Robótica │ Presente │           │   │
│                   │  │  └───────────────┴──────────┘           │   │
│                   │  │                                          │   │
│                   │  │  jueves, 27 de marzo                     │   │
│                   │  │  ┌───────────────┬──────────┐           │   │
│                   │  │  │ 3ºA Matutino  │ Presente │           │   │
│                   │  │  ├───────────────┼──────────┤           │   │
│                   │  │  │ Club Robótica │  Tarde   │           │   │
│                   │  │  └───────────────┴──────────┘           │   │
│                   │  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

Student view specs:
  - No group cards, no side sheet
  - Summary banner: indigo gradient card (from-indigo-600 to-indigo-700)
    - RateRing SVG (64px), streak with 🔥 icon, group count
  - History: grouped by date, each day is a section with date header
  - Status badge colors:
      Presente  → bg-emerald-100 text-emerald-700 (dark: emerald-500/20)
      Ausente   → bg-red-100 text-red-700
      Tarde     → bg-amber-100 text-amber-700
      Justif.   → bg-slate-100 text-slate-600
```

---

## shadcn Components Needed

| Component | Usage |
|-----------|-------|
| `Sheet` | Side sheet for group roster/reports |
| `Tabs` | "Lista del día" / "Reportes" inside the sheet |
| `Badge` | Status badges, "Enviado" badge on group card |
| `Button` | Submit, Export (PDF/Excel) |
| `Input` (type=date) | Date picker in sheet header |
| `Progress` | Attendance rate bar in reports |
| `Separator` | Dividers inside sheet |
| `Toast` / `Sonner` | Export job status notifications |
| `Skeleton` | Loading states for cards + roster rows |
| `ScrollArea` | Scrollable roster list inside fixed-height sheet |

## Key Interaction Notes

- **Sheet opens** when a group card is clicked (not a page navigation)
- **Sheet closes** via `×` button or clicking the backdrop
- **Date picker** inside the sheet header — changing date triggers `useRoster` re-fetch with new date
- **Submit button** is sticky at the bottom of the sheet (inside `SheetFooter`)
- **Export polling** uses `setInterval` (2s) inside a `useEffect`, clears when status = `done` or `failed`
- **Mobile**: sheet is full-width (100vw), scrollable, with sticky header and footer
