# People Section — UI Mockups

## Users Tab (Admin view)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Personas                                         [+ Agregar usuario]    │
│ 130 usuarios · [2 admin] [8 docentes] [120 estudiantes]                 │
├─────────────────────────────────────────────────────────────────────────┤
│ [Usuarios]  [Grupos]                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ 🔍 Buscar por nombre o correo...  [Todos|Admin|Docente|Est.]  [▼ Grupos]│
├──┬───────────────────────────┬───────────┬────────────────┬─────────────┤
│☐ │ Usuario                   │ Rol       │ Grupos         │ Registrado  │
├──┼───────────────────────────┼───────────┼────────────────┼─────────────┤
│☐ │ 🔵 Admin Rodriguez        │ [Admin]   │ —              │ ago 2025  ⋮ │
│  │    admin@ceicavs.edu       │           │                │             │
├──┼───────────────────────────┼───────────┼────────────────┼─────────────┤
│☑ │ 🟡 Prof. Ana Lopez        │ [Docente] │ [7A] [+1]      │ sep 2025  ⋮ │
│  │    ana.lopez@ceicavs.edu   │           │                │             │
├──┼───────────────────────────┼───────────┼────────────────┼─────────────┤
│☑ │ ⚫ Maria Fernandez        │ [Est.]    │ [7A]           │ ene 2026  ⋮ │
│  │    maria.f@ceicavs.edu     │           │                │             │
└──┴───────────────────────────┴───────────┴────────────────┴─────────────┘
  2 de 130 usuarios

─── Bulk toolbar (floats at bottom when rows selected) ───────────────────
    ┌──────────────────────────────────────────────────────┐
    │ 2 seleccionados  │  Cambiar rol  │  Eliminar  │  ✕   │
    └──────────────────────────────────────────────────────┘
```

## Add/Edit User Sheet (shadcn Sheet, side="right")

```
┌────────────────────────────────────────────────────────────────┬───────────────────────────┐
│                    [main page content dimmed]                  │ Agregar usuario         ✕ │
│                                                                │ Completa la información   │
│                                                                ├───────────────────────────┤
│                                                                │ NOMBRE COMPLETO           │
│                                                                │ ┌─────────────────────┐  │
│                                                                │ │ Ej: María García    │  │
│                                                                │ └─────────────────────┘  │
│                                                                │                           │
│                                                                │ CORREO ELECTRÓNICO        │
│                                                                │ ┌─────────────────────┐  │
│                                                                │ │ usuario@ceicavs.edu │  │
│                                                                │ └─────────────────────┘  │
│                                                                │                           │
│                                                                │ ROL                       │
│                                                                │ ┌─────────────────────┐  │
│                                                                │ │ Admin│Docente│● Est. │  │
│                                                                │ └─────────────────────┘  │
│                                                                │                           │
│                                                                │ GRUPOS (opcional)         │
│                                                                │ ┌─────────────────────┐  │
│                                                                │ │[7A ✓] [8B] [9C]     │  │
│                                                                │ └─────────────────────┘  │
│                                                                │                           │
│                                                                │ [Cancelar]  [Guardar]     │
└────────────────────────────────────────────────────────────────┴───────────────────────────┘
```

## Groups Tab (Admin/Teacher view)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Personas                                            [+ Crear grupo]     │
├─────────────────────────────────────────────────────────────────────────┤
│ [Usuarios]  [Grupos]                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ 🔍 Buscar grupos...                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐   │
│  │ Group 7A          │  │ Group 8B          │  │ Group 9C          │   │
│  │ 28 miembros       │  │ 25 miembros       │  │ 30 miembros       │   │
│  │ Creado por:       │  │ Creado por:       │  │ Creado por:       │   │
│  │ Prof. Ana Lopez   │  │ Prof. Gomez       │  │ Prof. Ana Lopez   │   │
│  │ 7th grade sec. A  │  │ 8th grade sec. B  │  │ 9th grade sec. C  │   │
│  │                   │  │                   │  │                   │   │
│  │ [Editar]  [🗑]    │  │ [Editar]  [🗑]    │  │ [Editar]  [🗑]    │   │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## CSV Import Sheet (shadcn Sheet, side="right")

```
┌──────────────────────────────────────────────────────────┬──────────────────────────────┐
│                  [main page content dimmed]              │ Importar desde CSV         ✕ │
│                                                          │ name, email, role requeridos  │
│                                                          ├──────────────────────────────┤
│                                                          │ ┌──────────────────────────┐ │
│                                                          │ │  📄 Arrastra tu CSV      │ │
│                                                          │ │  o haz clic para abrir   │ │
│                                                          │ └──────────────────────────┘ │
│                                                          │                              │
│                                                          │ Vista previa (3 filas):      │
│                                                          │  name       email    role    │
│                                                          │  Ana T.     ana@...  student │
│                                                          │  Prof.Ruiz  ruiz@... teacher │
│                                                          │  Carlos M.  carlos@  student │
│                                                          │                              │
│                                                          │ ⚠ 1 fila con errores         │
│                                                          │ (fila 4: email inválido)     │
│                                                          │                              │
│                                                          │ [Cancelar] [Importar 2]      │
└──────────────────────────────────────────────────────────┴──────────────────────────────┘
```

## Delete Confirmation (shadcn AlertDialog)

```
┌─────────────────────────────────────────┐
│  ⚠  Eliminar 2 usuarios                 │
│                                         │
│  Esta acción no se puede deshacer.      │
│  Los usuarios serán eliminados          │
│  permanentemente de la plataforma.      │
│                                         │
│       [Cancelar]      [Eliminar]        │
└─────────────────────────────────────────┘
```
