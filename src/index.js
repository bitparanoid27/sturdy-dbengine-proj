import { argv } from "node:process";

const receivedCommand = argv[2];

const cleanedCommand = receivedCommand?.trim().toLowerCase();

// if command received is help or undefined show the entire menu to navigate the project.
let commands = {
  "db help": "shows available options ",
  db: "shows available options ",
  put: "writes data",
  get: "retrieves data",
  scan: "analyzes data",
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
    process.exit(0);
  },
  get: () => {
    console.log("Running get command");
    process.exit(0);
  },
  scan: () => {
    console.log("Running scan command");
    process.exit(0);
  },
  inspect: () => {
    console.log("Running inspect command");
    process.exit(0);
  },
  "inspect-format": () => {
    console.log("Running inspect-format command");
    process.exit(0);
  },
  encode: () => {
    console.log("Running encode command");
    process.exit(0);
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
