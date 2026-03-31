# Typography

CEICAVS uses two font families from Google Fonts.

## Font Families

| Role       | Font              | Weights            | Usage                              |
|------------|-------------------|--------------------|-------------------------------------|
| **Heading** | Inter            | 600, 700           | Page titles, section headers, labels |
| **Body**    | Inter            | 400, 500           | Paragraphs, descriptions, UI text    |
| **Mono**    | JetBrains Mono   | 400, 500           | Code, transcription text, data IDs   |

## Google Fonts Import

### HTML (recommended for Next.js / Vite)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

### CSS @import (alternative)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Next.js `next/font` (optimal performance)

```tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

// Apply to <html> or <body>:
// className={`${inter.variable} ${jetbrainsMono.variable}`}
```

## CSS Custom Properties

```css
:root {
  --font-heading: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
}
```

## Tailwind Usage

With Tailwind CSS v4, apply font families using utility classes or CSS variables:

```html
<!-- Headings -->
<h1 class="font-[Inter] font-semibold text-2xl">Page Title</h1>

<!-- Body text -->
<p class="font-[Inter] font-normal text-base">Body content here.</p>

<!-- Code / monospace -->
<code class="font-[JetBrains_Mono] text-sm">recordingId: abc123</code>
```

If using CSS variables with Tailwind:

```css
@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

Then use `font-sans` and `font-mono` utility classes:

```html
<h1 class="font-sans font-semibold">Title</h1>
<code class="font-mono">code</code>
```

## Type Scale Recommendations

| Element          | Size     | Weight | Font    |
|------------------|----------|--------|---------|
| Page title       | `text-2xl` | 700  | Inter   |
| Section heading  | `text-xl`  | 600  | Inter   |
| Card title       | `text-lg`  | 600  | Inter   |
| Body text        | `text-base`| 400  | Inter   |
| Small / caption  | `text-sm`  | 400  | Inter   |
| Code / mono      | `text-sm`  | 400  | JetBrains Mono |
