import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public");
mkdirSync(outDir, { recursive: true });

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function png(width, height, painter) {
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = painter(x, y, width, height);
      const offset = 1 + x * 4;
      row[offset] = r;
      row[offset + 1] = g;
      row[offset + 2] = b;
      row[offset + 3] = a;
    }
    rows.push(row);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function mix(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function arenaPainter(x, y, width, height) {
  const nx = x / width;
  const ny = y / height;
  const radial = Math.max(0, 1 - Math.hypot(nx - 0.5, ny - 0.45) * 1.6);
  const cyanBeam = Math.max(0, 1 - Math.abs(nx - 0.25 - Math.sin(ny * 9) * 0.04) * 9);
  const pinkBeam = Math.max(0, 1 - Math.abs(nx - 0.76 + Math.cos(ny * 7) * 0.04) * 8);
  const grid = x % 72 < 2 || y % 72 < 2 ? 26 : 0;
  const r = mix(3 + grid, 20, radial) + Math.round(pinkBeam * 70);
  const g = mix(7 + grid, 32, radial) + Math.round(cyanBeam * 95);
  const b = mix(13 + grid, 48, radial) + Math.round(cyanBeam * 130 + pinkBeam * 80);
  return [Math.min(255, r), Math.min(255, g), Math.min(255, b), 255];
}

function scannerPainter(x, y, width, height) {
  const nx = x / width;
  const ny = y / height;
  const torso = Math.max(0, 1 - Math.hypot((nx - 0.5) / 0.34, (ny - 0.52) / 0.48));
  const absLine = Math.abs(nx - 0.5) < 0.015 || Math.abs((ny * 6) % 1 - 0.5) < 0.025 ? 90 : 0;
  const glow = Math.max(0, 1 - Math.abs(ny - 0.5) * 2.1);
  const r = 8 + Math.round(torso * 35 + glow * 18 + absLine);
  const g = 12 + Math.round(torso * 92 + glow * 85 + absLine);
  const b = 20 + Math.round(torso * 120 + glow * 140 + absLine);
  return [Math.min(255, r), Math.min(255, g), Math.min(255, b), 255];
}

function reportPainter(x, y, width, height) {
  const nx = x / width;
  const ny = y / height;
  const stripe = (x + y) % 44 < 22 ? 12 : 0;
  const target = Math.max(0, 1 - Math.hypot(nx - 0.5, ny - 0.5) * 2.2);
  return [22 + stripe + Math.round(target * 80), 18 + stripe, 34 + stripe + Math.round(target * 110), 255];
}

writeFileSync(join(outDir, "arena-keyart.png"), png(1600, 1000, arenaPainter));
writeFileSync(join(outDir, "scanner-panel.png"), png(900, 1100, scannerPainter));
writeFileSync(join(outDir, "opponent-silhouette.png"), png(900, 900, scannerPainter));
writeFileSync(join(outDir, "report-placeholder.png"), png(800, 450, reportPainter));
