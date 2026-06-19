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

const receivedCommand = argv[2];
const receivedKey = argv[3];
const receivedValue = argv[4];

const cleanedCommand = receivedCommand?.trim().toLowerCase();
const cleanedKey = receivedKey?.trim().toLowerCase();
const cleanedValue = receivedValue?.trim().toLowerCase();

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
    console.log("Running encode command");
    let userSelection = userSelectedOperation(cleanedCommand);
    let encodedBuffer = encodeDataToBytes(
      userSelection,
      cleanedKey,
      cleanedValue,
    );
    console.log(encodedBuffer);

    // process.exit(0);
  },
  decode: () => {
    console.log("Running decode command");
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
};

if (!Object.hasOwn(commands, cleanedCommand)) {
  console.error(`Unknown command: ${cleanedCommand}`);
  process.exit(1);
}

let invokedMethod = handlers[cleanedCommand];
invokedMethod();

function userSelectedOperation(cleanedCommand) {
  console.log("Fns 1");
  if (Object.hasOwn(recordTypes, cleanedCommand)) {
    let supportedFn = recordTypes[cleanedCommand];
    return supportedFn;
  } else {
    return 0;
  }
}

// Current blocker supported ops put and delete need a way to connect encode with put.
