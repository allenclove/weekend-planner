import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createPNG(width, height, filename) {
  // PNG signature
  const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Create IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(2, 9); // color type (RGB)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  // Create image data with solid color (#667eea)
  const rowData = Buffer.alloc(width * 3);
  for (let i = 0; i < width; i++) {
    rowData[i * 3] = 102;     // R
    rowData[i * 3 + 1] = 126; // G
    rowData[i * 3 + 2] = 234; // B
  }

  const imageData = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    imageData[y * (1 + width * 3)] = 0; // Filter type 0
    rowData.copy(imageData, y * (1 + width * 3) + 1);
  }

  // Compress image data
  const compressed = zlib.deflateSync(imageData);

  // Create chunks
  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type, 'ascii');
    const crc = zlib.crc32(Buffer.concat([typeBuffer, data]));
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  }

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([PNG_SIGNATURE, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(filename, png);
}

// Create icons
const publicDir = path.join(__dirname, '..', 'public');
createPNG(192, 192, path.join(publicDir, 'icon-192x192.png'));
createPNG(512, 512, path.join(publicDir, 'icon-512x512.png'));
console.log('Icons created successfully!');
