import base64
import struct

def create_simple_png(width, height, filename):
    """Create a simple PNG with gradient"""
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_chunk = create_chunk(b'IHDR', ihdr_data)

    # Image data with gradient
    img_data = bytearray()
    for y in range(height):
        img_data.append(0)  # Filter type 0 (None)
        for x in range(width):
            # Gradient from #667eea to #764ba2
            t = (x + y) / (width + height)
            r = int(102 + (118 - 102) * t)
            g = int(126 + (75 - 126) * t)
            b = int(234 + (162 - 234) * t)
            img_data.extend([r, g, b, 255])

    # Compress image data
    import zlib
    compressed = zlib.compress(img_data)

    # IDAT chunk
    idat_chunk = create_chunk(b'IDAT', compressed)

    # IEND chunk
    iend_chunk = create_chunk(b'IEND', b'')

    # Write PNG file
    with open(filename, 'wb') as f:
        f.write(png_signature)
        f.write(ihdr_chunk)
        f.write(idat_chunk)
        f.write(iend_chunk)

def create_chunk(chunk_type, data):
    """Create a PNG chunk"""
    import zlib
    length = struct.pack('>I', len(data))
    crc = zlib.crc32(chunk_type + data) & 0xffffffff
    crc_bytes = struct.pack('>I', crc)
    return length + chunk_type + data + crc_bytes

if __name__ == '__main__':
    create_simple_png(192, 192, 'icon-192x192.png')
    create_simple_png(512, 512, 'icon-512x512.png')
    print('Icons created successfully!')
