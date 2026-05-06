// Genera el PDF del pitch deck desde el HTML usando puppeteer-core +
// el Chrome instalado en el sistema. Sin descargar Chromium.

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = path.join(
  __dirname,
  "..",
  "entregables",
  "pitch-deck",
  "clariza-pitch-deck.html",
);
const PDF_PATH = path.join(
  __dirname,
  "..",
  "entregables",
  "pitch-deck",
  "clariza-pitch-deck.pdf",
);

const CHROME_PATH =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function main() {
  console.log("Lanzando Chrome headless...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  console.log(`Cargando ${HTML_PATH}`);
  await page.goto(pathToFileURL(HTML_PATH).href, {
    waitUntil: "networkidle0",
  });

  // Esperar a que las fonts de Google Fonts terminen de cargar.
  await page.evaluate(() => document.fonts.ready);

  console.log("Generando PDF...");
  await page.pdf({
    path: PDF_PATH,
    width: "1920px",
    height: "1080px",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log(`✓ PDF guardado en ${PDF_PATH}`);
}

main().catch((err) => {
  console.error("Fallo generando PDF:", err);
  process.exit(1);
});
