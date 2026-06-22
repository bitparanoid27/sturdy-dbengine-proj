## Binary Log Database Engine

### Project description

A zero-dependency, file-backed, append-only key-value storage engine built from the ground up in Node.js. This project is a systems-engineering exercise designed to explore memory allocation, binary serialization, and crash-resilient storage mechanics.

### Why Build a Storage Engine?

This project is a deep dive into the underlying mechanics of storage engines. By building a custom binary format and an append-only log, I am exploring the boundaries of V8 engine optimization, Node.js Buffer ownership, and OS-level file system I/O.

### Supported operations ( descriptions are evolving and might change )

Usage:
npm run <command>

| Command          | Description             |
| ---------------- | ----------------------- |
| `db help`        | Shows available options |
| `db`             | Shows available options |
| `put`            | Writes data             |
| `get`            | Retrieves data          |
| `scan`           | Analyzes data           |
| `delete`         | Deletes data            |
| `inspect`        | Inspects actions        |
| `inspect-format` | Inspects format         |
| `encode`         | Encodes data            |
| `decode`         | Decodes data            |
| `recover`        | Recovers data           |
| `compact`        | Compresses data         |
| `bench`          | Runs benchmark tests    |
| `test`           | Runs tests on data      |

### The Binary Record Layout

To read data efficiently, the database encodes every write into a contiguous binary record. Each record starts with a strict 28-byte header, followed immediately by the UTF-8 payload.

| Offset | Field         | Size (bytes) | Rule / Description         |
| ------ | ------------- | ------------ | -------------------------- |
| 0      | `magic`       | 4            | Must be `"LOG1"`           |
| 4      | `version`     | 1            | Must be `1`                |
| 5      | `type`        | 1            | `1 = PUT`, `2 = DELETE`    |
| 6      | `reserved`    | 2            | Empty (`0x0000`)           |
| 8      | `keyLength`   | 4            | `UInt32BE`                 |
| 12     | `valueLength` | 4            | `UInt32BE`                 |
| 16     | `timestamp`   | 8            | `BigUInt64BE` (`Date.now`) |
| 24     | `checksum`    | 4            | `UInt32BE` (`CRC-32`)      |

### Development Roadmap

1. Project Shell and CLI Command Router (Completed)
2. Binary Record Format Specification (Completed)
3. Buffer Serialization and Record Encoding (Completed)
4. Segment File Append-Only I/O (In Progress)
5. Sequential Segment Scanning (Planned)
6. Checksum Verification and Corruption Checks (Planned)
7. In-Memory Key Indexing (Planned)
8. Compaction, Tombstones, and Crash Recovery (Planned)

### How to Run the Current Utilities

Inspect the binary format layout

```
npm run inspect-format
```

Test the binary encoder

```
npm run encode mykey myvalue
```

### Note: This project is actively being developed.
