import { argv } from "node:process";

// local module imports

import {
  header_size,
  magic_string,
  formatVersion,
  formatLayout,
  recordTypes,
} from "./format.js";
import { encodeDataToBytes, writeDataToDisk } from "./encoder.js";
import { decodeBytesToData } from "./decoder.js";
import { dataGenerator } from "./scanner.js";

// Retrieve user selected command.
const receivedCommand = argv[2];
const cleanedCommand = receivedCommand?.trim().toLowerCase();

// if command received is help or undefined show the entire menu to navigate the project.
let commands = {
  "db help": "shows available options ",
  db: "shows available options ",
  put: "writes data",
  get: "retrieves data",
  scan: "analyzes data",
  delete: "delete data",
  inspect: "inspects actions",
  "inspect-format": "inspects format",
  encode: "encodes data",
  decode: "decodes data",
  recover: "recovers data",
  compact: "compresses data",
  bench: "run benchmark tests",
  test: "run tests on data",
  "test-ed":
    "run encoder and decoder to check the logic flow. Pure experimental will be deleted later.",
};

if (cleanedCommand === "help" || cleanedCommand === undefined) {
  console.log("Usage:");
  console.log("  npm run <command>\n");
  console.log("Commands:");
  for (const [element, desc] of Object.entries(commands)) {
    console.log(`  ${element.padEnd(16)}${desc}`);
  }

  process.exit(0);
}

const handlers = {
  put: () => {
    console.log("Running put command");

    // process.exit(0);
  },
  get: () => {
    console.log("Running get command");
    process.exit(0);
  },
  scan: async () => {
    const requestedOps = argv[3];
    console.log("Running scan command");
    let counter = 1;
    let result = [];
    try {
      for await (const element of dataGenerator(requestedOps)) {
        result.push(element);
        counter++;
        if (counter === 10) {
          break;
        }
      }
    } catch (error) {
      if (error.code === "CHECKSUM_MISMATCH") {
        console.error(`File corrupted at byte ${error.offset}.`);
        console.log("Scan command finished.");
        process.exit(1);
      }
    }
    console.log(result);
    console.log("Scan command finished.");
    process.exit(0);
  },
  delete: () => {
    console.log("Running delete command");
    // process.exit(0);
  },
  inspect: () => {
    console.log("Running inspect command");
    process.exit(0);
  },
  "inspect-format": () => {
    console.log("Running inspect-format command");
    console.log(`HEADER SIZE: ${header_size} bytes\n`);
    console.log("FIELD".padEnd(15) + "SIZE".padEnd(8) + "RULE");
    console.log("-".repeat(60));
    for (const [key, value] of Object.entries(formatLayout)) {
      console.log(
        `${key.padEnd(12)} - size ${value.size}, rule ${value.rule} `,
      );
    }

    process.exit(0);
  },
  encode: async () => {
    // Retrieve requested ops put || delete, and data
    const requestedOps = argv[3];
    const receivedKey = argv[4];
    const receivedValue = argv.slice(5);

    const cleanedKey = receivedKey?.trim().toLowerCase();
    const cleanedValue = receivedValue.map((item) => item.trim());
    const cleanedRequestedOps = requestedOps?.trim().toLowerCase();

    console.log("Running encode command");
    let userSelection = userSelectedOperation(cleanedRequestedOps);
    let encodedBuffer = encodeDataToBytes(
      userSelection,
      cleanedKey,
      cleanedValue,
    );
    console.log("Data encoded successfully");
    let encodedBufferData = {
      data: encodedBuffer,
      selectedOps: cleanedRequestedOps,
    };

    // save encoded data to the disk.
    await writeDataToDisk(encodedBuffer);

    return encodedBufferData;
    process.exit(0);
  },
  decode: (dataToBeDecoded) => {
    console.log("Running decode command");
    let decodeFnRetData = decodeBytesToData(dataToBeDecoded);
    console.log("Data decoded successfully");
    console.log(decodeFnRetData);
    process.exit(0);
  },
  recover: () => {
    console.log("Running recover command");
    process.exit(0);
  },
  compact: () => {
    console.log("Running compact command");
    process.exit(0);
  },
  bench: () => {
    console.log("Running bench command");
    process.exit(0);
  },
  test: () => {
    console.log("Running test command");
    process.exit(0);
  },
  "test-ed": async () => {
    console.log("Running the test-ed command");
    let encodeFnRetData = await handlers.encode();
    handlers.decode(encodeFnRetData);
  },
};

// if unknown command provided. Display unknown command selected.
if (!Object.hasOwn(commands, cleanedCommand)) {
  console.error(`Unknown command: ${cleanedCommand}`);
  process.exit(1);
}

let invokedMethod = handlers[cleanedCommand];
invokedMethod();

function userSelectedOperation(selectedCmd) {
  if (Object.hasOwn(recordTypes, selectedCmd)) {
    let supportedFn = recordTypes[selectedCmd];
    return supportedFn;
  } else {
    return 0;
  }
}
