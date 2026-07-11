//  External modules

import zlib from "node:zlib";
import { Buffer } from "node:buffer";

// local modules
import {
  header_size,
  magic_string,
  formatVersion,
  formatLayout,
  recordTypes,
} from "./format.js";

export const checksumGenerator = (keyBuffer, valueBuffer) => {
  try {
    // consume a buffer to generate a checksum.
    let checkSum = zlib.crc32(keyBuffer);
    checkSum = zlib.crc32(valueBuffer, checkSum);
    return checkSum;
  } catch (error) {
    throw error;
  }
};

// consume a filled-dataBuffer, retrieve key and value data. Calculate and verify checksum.
export const verifyChecksum = (
  dataBuffer,
  keyLength,
  valueLength,
  checkSumValueFound,
) => {
  try {
    if (dataBuffer.length <= 0) {
      throw new Error("Empty buffer received. Checksum verification failed.");
    }
    const retrievedKeyData = dataBuffer.toString(
      "utf8",
      header_size,
      header_size + keyLength,
    );
    const retrievedValData = dataBuffer.toString(
      "utf8",
      header_size + keyLength,
      header_size + keyLength + valueLength,
    );

    const checkSumValueCalculated = checksumGenerator(
      retrievedKeyData,
      retrievedValData,
    );

    if (checkSumValueFound === checkSumValueCalculated) {
      console.log("Check sum matched. Data not tampered");
      return { checkSumData: checkSumValueCalculated };
    } else {
      console.log("Checksum failed. Aborted");
      return { checkSumData: -1 };
    }
  } catch (error) {
    throw error;
  }
};
