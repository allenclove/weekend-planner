#!/usr/bin/env python3
import struct
import zlib

def write_png(filename, width, height, r, g, b):
    # PNG signature
    png_sig = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_chunk = create_chunk(b'IHDR', ihdr)

    # Image data (solid color)
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # Filter type 0
        raw_data += bytes([r, g, b]) * width

    # Compress
    compressed = zlib.compress(raw_data)
    idat_chunk = create_chunk(b'IDAT', compressed)

    # IEND chunk
    iend_chunk = create_chunk(b'IEND', b'')

    # Write file
    with open(filename, 'wb') as f:
        f.write(png_sig)
        f.write(ihdr_chunk)
        f.write(idat_chunk)
        f.write(iend_chunk)

def create_chunk(chunk_type, data):
    import struct
    import zlib
    crc = zlib.crc32(chunk_type + data) & 0xffffffff
    return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', crc)

# Create icons with purple gradient color (#667eea)
write_png('icon-192x192.png', 192, 192, 102, 126, 234)
write_png('icon-512x512.png', 512, 512, 102, 126, 234)
print('Icons created!')
