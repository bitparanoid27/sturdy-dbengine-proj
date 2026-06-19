export const header_size = 28;
export const magic_string = "LOG1";
export const formatVersion = 1;
export const recordTypes = {
  put: 1,
  delete: 2,
};

export const formatLayout = {
  magic: { offset: 0, size: 4, rule: "Must be 'LOG1'" },
  version: { offset: 4, size: 1, rule: "Must be 1" },
  type: { offset: 5, size: 1, rule: "1 = PUT, 2 = DELETE" },
  reserved: { offset: 6, size: 2, rule: "Empty (0x0000)" },
  keyLength: { offset: 8, size: 4, rule: "UInt32BE" },
  valueLength: { offset: 12, size: 4, rule: "UInt32BE" },
  timestamp: { offset: 16, size: 8, rule: "BigUInt64BE (Date.now)" },
  checksum: { offset: 24, size: 4, rule: "UInt32BE (CRC-32)" },
};
