const fs = require('fs');
const util = require('util');
const path = require('path');
const minimist = require('minimist'); //extract args
const aesjs = require('aes-js'); //encryption
const Buffer = require('buffer/').Buffer; //buffer utils
const toBuffer = require('typedarray-to-buffer');

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
// In practice, generate a new key every time.
const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// encrypt: Encrypts ArrayBuffer with AES CTR. returns cipher Uint8Array
function encrypt(buffer) {
  // Convert data to bytes
  const dataBytes = aesjs.utils.utf8.toBytes(buffer);
  // console.log('DATA BYTES', dataBytes, typeof dataBytes);

  // The counter is optional, and if omitted will begin at 1
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  const encryptedBytes = aesCtr.encrypt(dataBytes);

  return encryptedBytes;
}

// encrypt: decrypts cipher Uint8Array. returns decrypted Uint8Array
function decrypt(encryptedBytes) {
  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);

  // Convert our bytes back into text
  const decryptedData = aesjs.utils.utf8.fromBytes(decryptedBytes);

  return decryptedData;
}

// getFile: Reads file from filepath and outputs as ArrayBuffer
async function getFile(filename) {
  const fileBuffer = await readFile(filename);
  return fileBuffer;
}

// putFile: Reads binary from ArrayBuffer and outputs as file.
async function outputFile(data, fileExt) {
  fs.writeFile(`out/out${fileExt}`, data, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
}

function getFilePath() {
  // Get args from input using minimist
  const argv = require('minimist')(process.argv.slice(2));

  // Handle incorrect args
  try {
    if (!argv.f) throw new Error('Supply filepath with flag -f');
    return argv.f;
  } catch (err) {
    console.log(err.message);
    return;
  }
}

// Main loop
async function main() {
  const filePath = getFilePath();
  const fileExt = path.extname(filePath);

  // Get File
  const inputData = await getFile(filePath);

  // Error handling for invalid input file
  try {
    if (!inputData) throw new Error('Couldn"t get data');
  } catch (err) {
    console.log(err.message);
    return;
  }

  // Encrypt data
  const encryptedBytes = encrypt(inputData);
  // console.log('ENCRYPTED: ', encryptedBytes, typeof encryptedBytes);

  // Decrypt data
  const decryptedData = decrypt(encryptedBytes);
  // console.log('DECRYPTED: ', decryptedData, typeof decryptedData);

  // Reconvert to ArrayBuffer
  let outputData = toBuffer(decryptedData);

  // Log Input & Output data (ArrayBuffer)
  console.log('INPUT BUFFER: ', inputData, typeof inputData);
  console.log('OUTPUT BUFFER: ', outputData, typeof outputData);

  // Check Input/Output match
  console.log(inputData == outputData ? 'MATCH' : 'NO MATCH');

  // Output file
  outputFile(inputData, fileExt); //Outputting input buffer works
  // outputFile(outputData, fileExt); //TODO: Outputting output buffer doesn't work.
}
main();
