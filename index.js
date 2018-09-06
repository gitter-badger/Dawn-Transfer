const aesjs = require('aes-js');
const fs = require('fs');
const util = require('util');
const minimist = require('minimist');

// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

function encrypt(buffer) {
  // Convert data to bytes
  const dataBytes = aesjs.utils.utf8.toBytes(buffer);
  // console.log('DATA BYTES', dataBytes, typeof dataBytes);

  // The counter is optional, and if omitted will begin at 1
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  const encryptedBytes = aesCtr.encrypt(dataBytes);
  // console.log('ENCRYPTED BYTES', encryptedBytes, typeof encryptedBytes);

  // To print or store the binary data, you may convert it to hex
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  // console.log('ENCRYPTED HEX', encryptedHex, typeof encryptedHex);

  return encryptedHex;
}

function decrypt(encryptedHex) {
  // When ready to decrypt the hex string, convert it back to bytes
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  // console.log('ENCRYPTED BYTES 2: ', encryptedBytes);

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);

  // Convert our bytes back into text
  const decryptedData = aesjs.utils.utf8.fromBytes(decryptedBytes);
  // console.log('DECRYPTED TEXT: ', decryptedData);
  return decryptedData;
}

async function getFile(filename) {
  return readFile(filename);
}

async function main() {
  // Get args from input
  const argv = require('minimist')(process.argv.slice(2));
  if (!argv.f) throw new Error('Supply filepath with flag -f');

  const data = await getFile(argv.f);
  const text = new Buffer(
    'Text may be any length you wish, no padding is required. '
  );
  const encryptedHex = encrypt(data);
  console.log('ENCRYPTED: ', encryptedHex);

  const decryptedData = decrypt(encryptedHex);
  console.log('DECRYPTED: ', decryptedData);
}
main();
