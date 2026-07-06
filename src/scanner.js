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
import { decodeBytesToData } from "./decoder.js";

const readDataFromDisk = async (fileHandle, currentOffset) => {
  try {
    let tempBuffer = Buffer.alloc(header_size);
    await fileHandle.read(tempBuffer, 0, 28, currentOffset);

    const keyLength = tempBuffer.readUInt32BE(8);
    const valueLength = tempBuffer.readUInt32BE(12);
    const totalByteSize = header_size + keyLength + valueLength;

    let recordBuffer = Buffer.alloc(totalByteSize);
    await fileHandle.read(recordBuffer, 0, totalByteSize, currentOffset);

    // decode the data
    let bufferDataObject = { data: recordBuffer, selectedOps: "put" };
    let decodedData = await decodeBytesToData(bufferDataObject);
    let data = {
      record: decodedData,
      dataLength: totalByteSize,
    };

    return data;
  } catch (error) {
    throw error;
  }
};

// It's a JS generator that reads the record and provides the record for reading to the readDataFromDisk function.
export async function* dataGenerator() {
  let fileHandle;
  try {
    const __fileName = fileURLToPath(import.meta.url);
    const __dirName = path.dirname(__fileName);
    const destinationDir = path.join(__dirName, "../", "data");
    const destinationFile = path.join(destinationDir, "segment-0001.dat");

    // open the file resource.
    fileHandle = await fs.open(destinationFile, "r");
    let fileDescriptor = fileHandle.fd;
    let fileStats = await fileHandle.stat();
    let totalFileSize = fileStats.size;

    let currentOffset = 0;
    while (currentOffset < totalFileSize) {
      const BufferDataToDecode = await readDataFromDisk(
        fileHandle,
        currentOffset,
      );
      yield BufferDataToDecode.record;
      currentOffset += BufferDataToDecode.dataLength;
    }
  } catch (error) {
    throw error;
  } finally {
    fileHandle.close();
  }
}
