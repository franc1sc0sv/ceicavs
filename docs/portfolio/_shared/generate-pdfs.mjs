/**
 * CEICAVS Portfolio — PDF Generator
 * Uses Puppeteer (headless Chrome) for reliable A4 PDF output.
 * Fixes page-break issues that browser print-to-PDF cannot guarantee.
 *
 * Usage:
 *   node docs/portfolio/_shared/generate-pdfs.mjs
 *   node docs/portfolio/_shared/generate-pdfs.mjs 05-ai-transcription/ai-integration.html
 */

import puppeteer from 'puppeteer';
import { readdir, stat } from 'fs/promises';
import { resolve, relative, join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORTFOLIO_DIR = resolve(__dirname, '..');

const PDF_OPTIONS = {
  format: 'A4',
  printBackground: true,
  margin: {
    top:    '18mm',
    bottom: '18mm',
    left:   '15mm',
    right:  '15mm',
  },
  // Let CSS @page handle sizing — don't override
  preferCSSPageSize: false,
  // Inject page numbers via header/footer template
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: `
    <div style="
      width: 100%;
      font-size: 9px;
      color: #94a3b8;
      font-family: -apple-system, 'Segoe UI', Arial, sans-serif;
      text-align: center;
      padding: 0 15mm;
    ">
      <span class="pageNumber"></span> / <span class="totalPages"></span>
    </div>
  `,
};

/** Recursively find all .html files under a directory. */
async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_shared') {
        files.push(...(await findHtmlFiles(full)));
      }
    } else if (entry.isFile() && extname(entry.name) === '.html') {
      files.push(full);
    }
  }
  return files.sort();
}

async function generatePdf(browser, htmlPath) {
  const pdfPath = htmlPath.replace(/\.html$/, '.pdf');
  const rel = relative(PORTFOLIO_DIR, htmlPath);

  console.log(`  Generating: ${rel}`);

  const page = await browser.newPage();
  try {
    // Set viewport to A4 width at 96dpi (794px)
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0',
      timeout: 60_000,
    });

    // Wait for images to fully load (base64 images are inline but still need paint)
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              })
        )
      );
    });

    await page.pdf({ path: pdfPath, ...PDF_OPTIONS });
    console.log(`  Done:       ${relative(PORTFOLIO_DIR, pdfPath)}`);
  } finally {
    await page.close();
  }
}

async function main() {
  const targetArg = process.argv[2];

  let htmlFiles;
  if (targetArg) {
    // Single file mode
    const abs = resolve(PORTFOLIO_DIR, targetArg);
    htmlFiles = [abs];
  } else {
    htmlFiles = await findHtmlFiles(PORTFOLIO_DIR);
  }

  if (htmlFiles.length === 0) {
    console.log('No HTML files found.');
    process.exit(0);
  }

  console.log(`\nCEICAVS Portfolio PDF Generator`);
  console.log(`Generating ${htmlFiles.length} PDF(s)...\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const htmlFile of htmlFiles) {
      await generatePdf(browser, htmlFile);
    }
  } finally {
    await browser.close();
  }

  console.log(`\nAll PDFs generated successfully.`);
}

main().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
