# Tailwind Color Configuration

CEICAVS uses Tailwind CSS v4 built-in color palettes. No custom color definitions are needed.

## Color Roles

| Role        | Tailwind Palette | Purpose                                  |
|-------------|------------------|------------------------------------------|
| **Primary** | `indigo`         | Accents, active states, primary actions   |
| **Secondary** | `amber`        | Warnings, secondary highlights, badges    |
| **Neutral** | `slate`          | Text, backgrounds, surfaces, borders      |

## Light / Dark Mode Mapping

| Token              | Light              | Dark                  |
|--------------------|--------------------|-----------------------|
| Primary accent     | `indigo-600`       | `indigo-400`          |
| Primary subtle     | `indigo-50`        | `indigo-500/10`       |
| Secondary accent   | `amber-500`        | `amber-400`           |
| Secondary subtle   | `amber-50`         | `amber-500/10`        |
| Background         | `slate-50`         | `slate-950`           |
| Surface            | `white`            | `slate-900`           |
| Text               | `slate-900`        | `slate-100`           |
| Text (muted)       | `slate-500`        | `slate-400`           |
| Border             | `slate-200`        | `slate-800`           |

## Usage Examples

### Buttons

```html
<!-- Primary button -->
<button class="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400">
  Save
</button>

<!-- Secondary / outline button -->
<button class="border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
  Cancel
</button>
```

### Cards

```html
<div class="bg-white border border-slate-200 rounded-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
  <h3 class="text-slate-900 dark:text-slate-100">Card Title</h3>
  <p class="text-slate-500 dark:text-slate-400">Description text</p>
</div>
```

### Status / Role Badges

```html
<!-- Admin badge -->
<span class="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">Admin</span>

<!-- Teacher badge -->
<span class="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">Docente</span>

<!-- Student badge -->
<span class="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">Estudiante</span>
```

### Active Navigation Item

```html
<a class="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
  Dashboard
</a>
```

### Backgrounds

```html
<!-- Page background -->
<main class="bg-slate-50 dark:bg-slate-950">
  <!-- Content surface -->
  <section class="bg-white dark:bg-slate-900">
    ...
  </section>
</main>
```

## Semantic Colors

| Purpose  | Light          | Dark           |
|----------|----------------|----------------|
| Success  | `emerald-600`  | `emerald-400`  |
| Warning  | `amber-500`    | `amber-400`    |
| Error    | `red-600`      | `red-400`      |
| Info     | `indigo-600`   | `indigo-400`   |

## Notes

- Always pair light mode classes with `dark:` variants for full theme support.
- Use Tailwind's built-in opacity modifiers (e.g., `indigo-500/10`) for subtle backgrounds.
- No `tailwind.config.js` is needed -- Tailwind CSS v4 uses built-in color palettes directly.
