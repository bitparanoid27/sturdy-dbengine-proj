// external modules
import { Buffer } from "node:buffer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import * as fs from "node:fs/promises";
// local modules
import {
  header_size,
  magic_string,
  formatVersion,
  formatLayout,
  recordTypes,
} from "./format.js";
import { checksumGenerator } from "./checksum.js";

export const encodeDataToBytes = (recordType, key, value) => {
  try {
    let keyBuffer = Buffer.from(key);
    // to create a BYTES buffer from array.
    let valueBuffer;
    for (const element of value) {
      valueBuffer = Buffer.from(element);
    }
    // if key byte length is 0 throw error.
    // if the record type is not 1 or 2 i.e. put or delete throw error.

    // if key or value length is more 32 bits i.e. max 4 gb of data throw error.

    if (keyBuffer.length === 0) {
      throw new Error(`Invalid key received. Key cannot be empty.`);
    }

    if (
      !(recordType !== recordTypes.put || recordType !== recordTypes.delete)
    ) {
      throw new Error(
        `Unsupported operation selected. Only PUT and DELETE operations are supported.`,
      );
    }

    if (keyBuffer.length > 4294967295 || valueBuffer.length > 4294967295) {
      throw new Error(`Data exceeds maximum 4GB limit.`);
    }

    // Ask OS for space to store the data.

    let finalBufferSize = 28 + keyBuffer.length + valueBuffer.length;
    let requestedSpace = Buffer.alloc(finalBufferSize);

    // Generate checksum as the payload is final.
    // console.log(keyBuffer);
    // console.log(valueBuffer);
    const cks = checksumGenerator(keyBuffer, valueBuffer);

    requestedSpace.write(magic_string, 0);
    requestedSpace.writeUInt8(formatVersion, 4);
    requestedSpace.writeUInt8(recordType, 5);
    requestedSpace.writeUInt32BE(keyBuffer.length, 8);
    requestedSpace.writeUInt32BE(valueBuffer.length, 12);
    requestedSpace.writeBigUint64BE(BigInt(Date.now()), 16);
    requestedSpace.writeUInt32BE(cks, 24);

    keyBuffer.copy(requestedSpace, 28);
    valueBuffer.copy(requestedSpace, 28 + keyBuffer.length);
    return requestedSpace;
  } catch (error) {
    throw error;
  }
};

export const writeDataToDisk = async (encodedData) => {
  let fileHandle;
  try {
    // Retrieve file and folder name for the respective files.
    const __fileName = fileURLToPath(import.meta.url);
    const __dirName = path.dirname(__fileName);

    const destinationDir = path.join(__dirName, "../", "data");
    const destinationFile = path.join(destinationDir, "segment-0001.dat");
    await mkdir(destinationDir, { recursive: true });

    fileHandle = await fs.open(destinationFile, "a+");
    let fileDescriptor = fileHandle.fd;
    let fileStats = await fileHandle.stat();

    try {
      await fileHandle.write(
        encodedData,
        0,
        encodedData.length,
        fileStats.size,
      );
      console.log("Data written to the file");
    } catch (error) {
      console.log("Error while data writing");
      throw error;
    }
  } catch (error) {
    throw error;
  } finally {
    fileHandle.close();
  }
};
