// External modules imported here.
import { Buffer } from "node:buffer";

// local modules
import {
  header_size,
  magic_string,
  formatVersion,
  formatLayout,
  recordTypes,
} from "./format.js";

export const decodeBytesToData = (encodedData) => {
  try {
    if (encodedData === undefined) {
      throw new Error("Cannot decode an empty object.");
    }

    const { data, selectedOps } = encodedData;
    // Check for incomplete headers.
    if (data.length < header_size) {
      throw new Error("Incomplete headers received. Package discarded");
    }

    // Check for the magic bytes and read the bytes into utf8.
    const receivedMagicString = data.toString("utf8", 0, 4);
    const magicString = magic_string;

    if (receivedMagicString.trim() !== magicString.trim()) {
      throw new Error("Invalid magic string received. Package rejected");
    }

    const keyLength = data.readUInt32BE(8);
    const valueLength = data.readUInt32BE(12);

    const expectedPackageSize = header_size + keyLength + valueLength;
    if (expectedPackageSize < data.length) {
      throw new Error("Incomplete payload received. Package rejected");
    }

    // return type, key, value, timestamp, checksum, byte lengths, record length, and payload offset.

    const type = data.readUInt8(5);
    const timestamp = data.readBigUint64BE(16);

    // Retrieve key data by converting bytes to text.
    const keyData = data.toString("utf8", header_size, keyLength + header_size);
    const valueData = data.toString(
      "utf8",
      keyLength + header_size,
      header_size + keyLength + valueLength,
    );
    const recordLength = header_size + keyLength + valueLength;

    let decodedData = {
      type,
      keyLength,
      valueLength,
      timestamp,
      keyData,
      valueData,
      recordLength,
    };

    // if decodedData is empty return an empty object.
    return Object.keys(decodedData).length > 0 ? decodedData : {};
  } catch (error) {
    throw error;
  }
};
