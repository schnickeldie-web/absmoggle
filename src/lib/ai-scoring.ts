import * as tf from "@tensorflow/tfjs";

export interface FitnessScore {
  definition: number; // 0-10: Muskelkontur-Schärfe
  bodyFat: number; // 0-10: Geschätzter Fettanteil (10 = sehr niedrig)
  visibility: number; // 0-10: Sichtbarkeit der Bauchmuskeln
  finalRating: number; // 0-10: Durchschnitt, aber 0 wenn Bauch nicht sichtbar
  abdominalVisible: boolean; // Wurde Bauch erkannt?
}

/**
 * Analysiert ein Bild-Frame und gibt ein Fitness-Rating (0-10) zurück
 * Basiert auf Definition, Fettanteil und Sichtbarkeit der Bauchmuskulatur
 */
export async function scoreFitnessFrame(
  imageData: ImageData
): Promise<FitnessScore> {
  try {
    // Canvas für Bildverarbeitung
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(imageData, 0, 0);

    // In Tensor konvertieren und normalisieren
    let imageTensor = tf.browser.fromPixels(canvas);
    imageTensor = imageTensor.resizeNearestNeighbor([224, 224]);
    imageTensor = imageTensor.div(tf.scalar(255.0));

    // Body-Region detektieren (mittlerer Torso-Bereich)
    const bodyRegion = extractTorsoRegion(imageData);
    const definition = analyzeDefinition(bodyRegion);
    const bodyFat = estimateBodyFat(bodyRegion);
    const { visibility, abdominalVisible } = analyzeAbdominalVisibility(
      bodyRegion
    );

    imageTensor.dispose();

    // Auto-Disqualifikation: Kein Bauch sichtbar = 0
    const finalRating = abdominalVisible
      ? (definition + bodyFat + visibility) / 3
      : 0;

    return {
      definition: Math.min(10, Math.max(0, definition)),
      bodyFat: Math.min(10, Math.max(0, bodyFat)),
      visibility: Math.min(10, Math.max(0, visibility)),
      finalRating: Math.min(10, Math.max(0, finalRating)),
      abdominalVisible
    };
  } catch (error) {
    console.error("Fitness scoring error:", error);
    return {
      definition: 0,
      bodyFat: 0,
      visibility: 0,
      finalRating: 0,
      abdominalVisible: false
    };
  }
}

/**
 * Extrahiert den zentralen Torso-Bereich aus dem Bild
 * Fokus auf Bauchbereich (mittlere 60% des Bildes, vertikal 30-80%)
 */
function extractTorsoRegion(imageData: ImageData): Uint8ClampedArray {
  const { data, width, height } = imageData;
  const torsoData = new Uint8ClampedArray(data.length);

  const startX = Math.floor(width * 0.2);
  const endX = Math.floor(width * 0.8);
  const startY = Math.floor(height * 0.3);
  const endY = Math.floor(height * 0.8);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      if (x >= startX && x < endX && y >= startY && y < endY) {
        torsoData[idx] = data[idx]; // R
        torsoData[idx + 1] = data[idx + 1]; // G
        torsoData[idx + 2] = data[idx + 2]; // B
        torsoData[idx + 3] = data[idx + 3]; // A
      }
    }
  }

  return torsoData;
}

/**
 * Analysiert Muskelkontur-Schärfe (Definition)
 * Misst Edge-Contraste im Bild
 */
function analyzeDefinition(torsoData: Uint8ClampedArray): number {
  let totalContrast = 0;
  let pixelCount = 0;

  // Einfacher Edge-Detection durch Nachbar-Vergleich
  for (let i = 0; i < torsoData.length; i += 4) {
    const r = torsoData[i];
    const g = torsoData[i + 1];
    const b = torsoData[i + 2];

    // Helligkeit berechnen
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    // Mit Nachbarn vergleichen (vereinfacht)
    if (i + 4 < torsoData.length) {
      const nextR = torsoData[i + 4];
      const nextG = torsoData[i + 5];
      const nextB = torsoData[i + 6];
      const nextBrightness = 0.299 * nextR + 0.587 * nextG + 0.114 * nextB;

      const contrast = Math.abs(brightness - nextBrightness);
      totalContrast += contrast;
      pixelCount++;
    }
  }

  const avgContrast = pixelCount > 0 ? totalContrast / pixelCount : 0;

  // Normalisieren: 0-255 → 0-10
  // Hoher Kontrast = deutliche Muskeln
  return (avgContrast / 255) * 10;
}

/**
 * Schätzt den Körperfettanteil basierend auf Hautfarbe & Helligkeit
 * Höhere Definition bei niedrigerem Fettanteil
 */
function estimateBodyFat(torsoData: Uint8ClampedArray): number {
  let totalHue = 0;
  let totalBrightness = 0;
  let pixelCount = 0;

  // Skin-Tone Analyse
  for (let i = 0; i < torsoData.length; i += 4) {
    const r = torsoData[i];
    const g = torsoData[i + 1];
    const b = torsoData[i + 2];
    const a = torsoData[i + 3];

    // Ignoriere transparent pixels
    if (a < 200) continue;

    // Helligkeit (Luminance)
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    // Hautfarben-Index: Rötlicher Ton = niedrigerer Fettanteil
    const redness = r - (g + b) / 2;

    totalBrightness += brightness;
    totalHue += redness;
    pixelCount++;
  }

  const avgBrightness = pixelCount > 0 ? totalBrightness / pixelCount : 127;
  const avgHue = pixelCount > 0 ? totalHue / pixelCount : 0;

  // Inverse: Hellere + rötlichere Haut = niedriger Fettanteil = höheres Rating
  const fatScore = (avgHue / 128) * 0.6 + ((255 - avgBrightness) / 255) * 0.4;
  return Math.max(0, fatScore * 10);
}

/**
 * Analysiert die Sichtbarkeit von Bauchmuskeln
 * Sucht nach vertikalen & horizontalen Linien-Mustern (Sixpack-Definition)
 */
function analyzeAbdominalVisibility(
  torsoData: Uint8ClampedArray
): { visibility: number; abdominalVisible: boolean } {
  const width = Math.sqrt(torsoData.length / 4);
  const height = Math.sqrt(torsoData.length / 4);

  let verticalEdges = 0;
  let horizontalEdges = 0;
  let totalPixels = 0;

  // Vertikale Kanten detektieren (Muskelsegmentierung)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const leftIdx = (y * width + (x - 1)) * 4;
      const rightIdx = (y * width + (x + 1)) * 4;

      const brightness =
        0.299 * torsoData[idx] +
        0.587 * torsoData[idx + 1] +
        0.114 * torsoData[idx + 2];
      const leftBrightness =
        0.299 * torsoData[leftIdx] +
        0.587 * torsoData[leftIdx + 1] +
        0.114 * torsoData[leftIdx + 2];
      const rightBrightness =
        0.299 * torsoData[rightIdx] +
        0.587 * torsoData[rightIdx + 1] +
        0.114 * torsoData[rightIdx + 2];

      const verticalDiff =
        Math.abs(brightness - leftBrightness) +
        Math.abs(brightness - rightBrightness);

      if (verticalDiff > 30) verticalEdges++;
      totalPixels++;
    }
  }

  // Horizontale Kanten detektieren (Sixpack-Segmente)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const topIdx = ((y - 1) * width + x) * 4;
      const bottomIdx = ((y + 1) * width + x) * 4;

      const brightness =
        0.299 * torsoData[idx] +
        0.587 * torsoData[idx + 1] +
        0.114 * torsoData[idx + 2];
      const topBrightness =
        0.299 * torsoData[topIdx] +
        0.587 * torsoData[topIdx + 1] +
        0.114 * torsoData[topIdx + 2];
      const bottomBrightness =
        0.299 * torsoData[bottomIdx] +
        0.587 * torsoData[bottomIdx + 1] +
        0.114 * torsoData[bottomIdx + 2];

      const horizontalDiff =
        Math.abs(brightness - topBrightness) +
        Math.abs(brightness - bottomBrightness);

      if (horizontalDiff > 30) horizontalEdges++;
    }
  }

  // Sichtbarkeits-Score: Kombination aus vertikalen & horizontalen Kanten
  const edgeRatio =
    (verticalEdges + horizontalEdges) / (totalPixels * 2);
  const visibility = edgeRatio * 20; // Skalieren auf 0-10 Range

  // Auto-Disqualifikation: Wenn Sichtbarkeit < 1.5, kein Bauch erkannt
  const abdominalVisible = visibility > 1.5;

  return {
    visibility: Math.min(10, visibility),
    abdominalVisible
  };
}

/**
 * Berechnet den Durchschnitt über mehrere Frames
 */
export function calculateAverageScore(scores: FitnessScore[]): number {
  if (scores.length === 0) return 0;

  // Wenn irgendein Frame 0 hat (Bauch nicht sichtbar), Disqualifikation
  if (scores.some((s) => s.finalRating === 0)) {
    return 0;
  }

  const avg =
    scores.reduce((sum, s) => sum + s.finalRating, 0) / scores.length;
  return Math.min(10, Math.max(0, avg));
}
