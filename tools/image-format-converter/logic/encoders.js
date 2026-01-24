
/**
 * Encodes raw RGBA data to BMP Blob.
 * @param {number} width
 * @param {number} height
 * @param {Uint8ClampedArray} data - RGBA data
 * @returns {Blob}
 */
export function encodeBMP(width, height, data) {
    const padding = (4 - (width * 3) % 4) % 4;
    const rowSize = width * 3 + padding;
    const fileSize = 14 + 40 + rowSize * height;
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);

    // File Header (14 bytes)
    view.setUint8(0, 0x42); // 'B'
    view.setUint8(1, 0x4D); // 'M'
    view.setUint32(2, fileSize, true); // File size
    view.setUint16(6, 0, true); // Reserved
    view.setUint16(8, 0, true); // Reserved
    view.setUint32(10, 54, true); // Offset to pixel data

    // DIB Header (BITMAPINFOHEADER - 40 bytes)
    view.setUint32(14, 40, true); // Header size
    view.setInt32(18, width, true); // Width
    view.setInt32(22, -height, true); // Height (negative for top-down)
    view.setUint16(26, 1, true); // Planes
    view.setUint16(28, 24, true); // BPP (24-bit)
    view.setUint32(30, 0, true); // Compression (BI_RGB)
    view.setUint32(34, 0, true); // Image size (can be 0 for BI_RGB)
    view.setInt32(38, 2835, true); // X PPM (72 DPI)
    view.setInt32(42, 2835, true); // Y PPM (72 DPI)
    view.setUint32(46, 0, true); // Colors used
    view.setUint32(50, 0, true); // Colors important

    let offset = 54;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // BMP stores as BGR
            view.setUint8(offset++, b);
            view.setUint8(offset++, g);
            view.setUint8(offset++, r);
        }
        // Padding
        for (let p = 0; p < padding; p++) {
            view.setUint8(offset++, 0);
        }
    }

    return new Blob([buffer], { type: 'image/bmp' });
}

/**
 * Encodes raw RGBA data to TIFF Blob (Uncompressed RGB).
 * @param {number} width
 * @param {number} height
 * @param {Uint8ClampedArray} data - RGBA data
 * @returns {Blob}
 */
export function encodeTIFF(width, height, data) {
    // We need to construct a minimal TIFF file.
    // Structure: Header + IFD + Values + Image Data
    // Little Endian

    // Calculate sizes
    const pixelDataSize = width * height * 3;
    const numEntries = 12;
    const ifdSize = 2 + (numEntries * 12) + 4; // count + entries + next
    // We'll put image data at the end.
    // Header (8) + IFD (2 + 12*12 + 4 = 150) + Values (some fit in IFD, others need space)

    // Values needing offset:
    // BitsPerSample (3 shorts = 6 bytes)
    // XResolution (2 longs = 8 bytes)
    // YResolution (2 longs = 8 bytes)
    // StripOffsets (1 long = 4 bytes - but logic below might just point to data)
    // StripByteCounts (1 long = 4 bytes)

    // Let's layout:
    // 0: Header (8)
    // 8: IFD (150) -> End at 158
    // 158: BitsPerSample (8,8,8) (6 bytes) -> End 164
    // 164: XResolution (8 bytes) -> End 172
    // 172: YResolution (8 bytes) -> End 180
    // 180: Image Data (pixelDataSize)

    const headerSize = 8;
    const valuesSize = 6 + 8 + 8; // BitsPerSample, XRes, YRes
    const offsetToIFD = 8;
    const offsetToValues = offsetToIFD + ifdSize;
    const offsetToData = offsetToValues + valuesSize;
    const totalSize = offsetToData + pixelDataSize;

    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);

    // Header
    view.setUint8(0, 0x49); // 'I'
    view.setUint8(1, 0x49); // 'I' (Little Endian)
    view.setUint16(2, 42, true); // Magic
    view.setUint32(4, offsetToIFD, true); // Offset to IFD

    // IFD
    let ifdOffset = offsetToIFD;
    view.setUint16(ifdOffset, numEntries, true);
    ifdOffset += 2;

    function writeEntry(tag, type, count, valueOrOffset) {
        view.setUint16(ifdOffset, tag, true);
        view.setUint16(ifdOffset + 2, type, true);
        view.setUint32(ifdOffset + 4, count, true);
        view.setUint32(ifdOffset + 8, valueOrOffset, true);
        ifdOffset += 12;
    }

    // 1. ImageWidth (256)
    writeEntry(256, 3, 1, width); // SHORT
    // 2. ImageHeight (257)
    writeEntry(257, 3, 1, height); // SHORT
    // 3. BitsPerSample (258) - 8,8,8
    const bpsOffset = 158;
    writeEntry(258, 3, 3, bpsOffset);
    // 4. Compression (259) - 1 (None)
    writeEntry(259, 3, 1, 1);
    // 5. PhotometricInterpretation (262) - 2 (RGB)
    writeEntry(262, 3, 1, 2);
    // 6. StripOffsets (273)
    writeEntry(273, 4, 1, offsetToData);
    // 7. SamplesPerPixel (277) - 3
    writeEntry(277, 3, 1, 3);
    // 8. RowsPerStrip (278) - height (one strip)
    writeEntry(278, 3, 1, height);
    // 9. StripByteCounts (279)
    writeEntry(279, 4, 1, pixelDataSize);
    // 10. XResolution (282)
    const xResOffset = 164;
    writeEntry(282, 5, 1, xResOffset);
    // 11. YResolution (283)
    const yResOffset = 172;
    writeEntry(283, 5, 1, yResOffset);
    // 12. ResolutionUnit (296) - 2 (Inch)
    writeEntry(296, 3, 1, 2);

    // Next IFD
    view.setUint32(ifdOffset, 0, true);

    // Write Values
    // BitsPerSample
    view.setUint16(bpsOffset, 8, true);
    view.setUint16(bpsOffset + 2, 8, true);
    view.setUint16(bpsOffset + 4, 8, true);

    // XResolution (72/1)
    view.setUint32(xResOffset, 72, true);
    view.setUint32(xResOffset + 4, 1, true);

    // YResolution (72/1)
    view.setUint32(yResOffset, 72, true);
    view.setUint32(yResOffset + 4, 1, true);

    // Image Data (RGB)
    let p = offsetToData;
    for (let i = 0; i < width * height * 4; i += 4) {
        view.setUint8(p++, data[i]);     // R
        view.setUint8(p++, data[i + 1]); // G
        view.setUint8(p++, data[i + 2]); // B
    }

    return new Blob([buffer], { type: 'image/tiff' });
}
