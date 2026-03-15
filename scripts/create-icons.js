const fs = require('fs');
const path = require('path');

// Create simple PNG files with gradient background
function createPNG(width, height, filename) {
  // PNG signature
  const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Create IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // color type (RGBA)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  // Create image data with gradient
  const imageData = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      // Gradient from #667eea to #764ba2
      const t = (x + y) / (width + height);
      imageData[i] = Math.round(102 + (118 - 102) * t);     // R
      imageData[i + 1] = Math.round(126 + (75 - 126) * t);  // G
      imageData[i + 2] = Math.round(234 + (162 - 234) * t); // B
      imageData[i + 3] = 255; // A
    }
  }

  // Simple deflate compression (not real compression, just storing)
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(imageData);

  // Create IDAT chunk
  const idat = Buffer.alloc(compressed.length);
  compressed.copy(idat);

  // Create chunks
  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type, 'ascii');
    const crc = require('zlib').crc32Sync(Buffer.concat([typeBuffer, data]));
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  }

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', idat);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([PNG_SIGNATURE, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(filename, png);
}

// Create icons
const publicDir = path.join(__dirname, '..', 'public');
createPNG(192, 192, path.join(publicDir, 'icon-192x192.png'));
createPNG(512, 512, path.join(publicDir, 'icon-512x512.png'));
console.log('Icons created successfully!');
