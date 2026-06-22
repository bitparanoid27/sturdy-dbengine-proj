// external modules
import { Buffer } from "node:buffer";

// local modules
import {
  header_size,
  magic_string,
  formatVersion,
  formatLayout,
  recordTypes,
} from "./format.js";

export const encodeDataToBytes = (recordType, key, value) => {
  try {
    let keyBuffer = Buffer.from(key);
    let valueBuffer = Buffer.from(value);
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

    //

    requestedSpace.write(magic_string, 0);
    requestedSpace.writeUInt8(formatVersion, 4);
    requestedSpace.writeUInt8(recordType, 5);
    requestedSpace.writeUInt32BE(keyBuffer.length, 8);
    requestedSpace.writeUInt32BE(valueBuffer.length, 12);
    requestedSpace.writeBigUint64BE(BigInt(Date.now()), 16);

    keyBuffer.copy(requestedSpace, 28);
    valueBuffer.copy(requestedSpace, 28 + keyBuffer.length);
    return requestedSpace;
  } catch (error) {
    throw error;
  }
};
