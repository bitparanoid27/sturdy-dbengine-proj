import { argv } from "node:process";

// local module imports

import {
  header_size,
  magic_string,
  formatVersion,
  formatLayout,
  recordTypes,
} from "./format.js";
import { encodeDataToBytes } from "./encoder.js";
import { decodeBytesToData } from "./decoder.js";

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
  scan: () => {
    console.log("Running scan command");
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
  encode: () => {
    // Retrieve requested ops put || delete, and data
    const requestedOps = argv[3];
    const receivedKey = argv[4];
    const receivedValue = argv[5];

    const cleanedKey = receivedKey?.trim().toLowerCase();
    const cleanedValue = receivedValue?.trim().toLowerCase();
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
  "test-ed": () => {
    console.log("Running the test-ed command");
    let encodeFnRetData = handlers.encode();
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
