// Compresion / resize de imagenes en el browser ANTES de subirlas al server.
//
// Por que: las fotos de telefono modernas pesan 3-12 MB y Netlify Functions
// limita el body a ~6 MB. Una cartola fotografiada queda ilegible si llega
// recortada por el limite. Tambien acelera Vision (menos pixeles = mas rapido).
//
// Estrategia:
//   - Si NO es imagen (PDF, etc), pasa derecho.
//   - Si es imagen mayor a TARGET_MAX_BYTES, la redimensiona a max 1600px
//     en el lado mas largo y la re-encodea como JPEG calidad 0.85.
//   - Si despues del resize sigue siendo grande, baja calidad iterativamente.
//
// Mantiene la cartola legible para Vision (1600px es mas que suficiente para
// leer texto de un documento) pero garantiza que cabe en el limite del server.

"use client";

const MAX_DIMENSION_PX = 1600;
const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.55;
const TARGET_MAX_BYTES = 4 * 1024 * 1024; // 4 MB de margen contra el limite

/** True si el File es una imagen rasterizable. PDFs y otros pasan derecho. */
function isCompressibleImage(file: File): boolean {
  return file.type.startsWith("image/") && file.type !== "image/svg+xml";
}

/** Carga la imagen en un HTMLImageElement (resuelve cuando esta lista). */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/** Calcula dimensiones manteniendo aspect ratio, max MAX_DIMENSION_PX. */
function calcResizedDimensions(
  width: number,
  height: number,
): { w: number; h: number } {
  if (width <= MAX_DIMENSION_PX && height <= MAX_DIMENSION_PX) {
    return { w: width, h: height };
  }
  const ratio = width / height;
  if (width > height) {
    return { w: MAX_DIMENSION_PX, h: Math.round(MAX_DIMENSION_PX / ratio) };
  }
  return { w: Math.round(MAX_DIMENSION_PX * ratio), h: MAX_DIMENSION_PX };
}

/** Convierte canvas a Blob con calidad ajustable. */
function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob devolvio null"));
      },
      "image/jpeg",
      quality,
    );
  });
}

/**
 * Comprime una imagen del usuario antes de subirla.
 * Si el archivo no es imagen o ya esta dentro del limite, lo devuelve tal cual.
 * Si falla la compresion (browser viejo, archivo corrupto), devuelve el original
 * y deja que el server decida si lo procesa o no.
 */
export async function compressImageIfNeeded(file: File): Promise<File> {
  // PDFs, SVG, etc — devolvemos sin tocar.
  if (!isCompressibleImage(file)) {
    return file;
  }

  // Imagen ya chica — sin tocar.
  if (file.size <= TARGET_MAX_BYTES) {
    return file;
  }

  try {
    const img = await loadImage(file);
    const { w, h } = calcResizedDimensions(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, w, h);

    // Iteramos calidad hasta caber en el limite.
    let quality = INITIAL_QUALITY;
    let blob = await canvasToBlob(canvas, quality);
    while (blob.size > TARGET_MAX_BYTES && quality > MIN_QUALITY) {
      quality -= 0.1;
      blob = await canvasToBlob(canvas, quality);
    }

    // Reusamos el filename original cambiando extension a .jpg.
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const compressed = new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    return compressed;
  } catch {
    // Falla la compresion: devolvemos el original. El server o reportara error,
    // o procesara con su limite. Mejor que perder el archivo silenciosamente.
    return file;
  }
}
