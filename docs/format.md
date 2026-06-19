## Binary Database Format

### Header (28 Bytes)

- **Byte Order:** Big-Endian (BE)
- **Record Types:** `1` (PUT), `2` (DELETE)
- **Checksum Coverage:** Covers the Header and the Payload bytes.

### Payload

- The Key bytes start immediately after the 28-byte header.
- The Value bytes start immediately after the Key bytes.
- Key and Value are UTF-8 encoded.
