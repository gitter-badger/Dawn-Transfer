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

var inputBytes;
var outputBytes;
var inputHex;
var outputHex;

// encrypt: Encrypts ArrayBuffer with AES CTR. returns cipher Uint8Array
function encrypt(buffer) {
  // Convert data to bytes
  const dataBytes = aesjs.utils.utf8.toBytes(buffer);
  // console.log('DATA BYTES', dataBytes.slice(0, 20), typeof dataBytes);

  inputBytes = dataBytes;

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

  outputBytes = decryptedBytes;

  // Convert our bytes back into text
  const decryptedData = aesjs.utils.utf8.fromBytes(decryptedBytes);

  return decryptedData;
}

// getFile: Reads file from filepath and outputs as ArrayBuffer
async function getFile(filename) {
  const dataFile = await readFile(filename);
  dataBase64 = dataFile.toString('base64');
  return dataBase64;
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

function diffArray(arr1, arr2) {
  var newArr = [];

  arr1.map(function(val) {
    arr2.indexOf(val) < 0 ? newArr.push(val) : '';
  });

  arr2.map(function(val) {
    arr1.indexOf(val) < 0 ? newArr.push(val) : '';
  });

  return newArr;
}

// Main loop
async function main() {
  const filePath = getFilePath();
  const fileExt = path.extname(filePath);

  // Get File
  const inputData = await getFile(filePath);
  console.log('INPUT: ', inputData, typeof inputData);

  // Encrypt data
  const encryptedBytes = encrypt(inputData);
  console.log('ENCRYPTED: ', /* encryptedBytes,*/ typeof encryptedBytes);

  // Decrypt data
  const decryptedData = decrypt(encryptedBytes);
  console.log('DECRYPTED: ', /* decryptedData,*/ typeof decryptedData);

  // Reconvert to ArrayBuffer
  let outputData = toBuffer(decryptedData);

  // Log Input & Output data (ArrayBuffer)
  // console.log('INPUT BUFFER: ', inputData, typeof inputBytes);
  // console.log('OUTPUT BUFFER: ', outputData, typeof outputBytes);

  // Check Input/Output match for byte array !!! Issue here
  console.log(
    inputBytes.slice(0, 1) === outputBytes.slice(0, 1)
      ? 'BYTES MATCH'
      : 'BYTES NO MATCH' //,
    // '\nDiff: ',
    // diffArray(inputBytes, outputBytes), //no difference but there is still an issue
    // '\ninputBytes[0,10]: ',
    // util.inspect(inputBytes.slice(0, 10), false, null, true),
    // '\noutputBytes[0,10]: ',
    // util.inspect(outputBytes.slice(0, 10), false, null, true)
  );

  // Check Input/Output match for data buffer.
  console.log(
    inputData.slice(0, 1) == outputData.slice(0, 1)
      ? 'BUFFER MATCH'
      : 'BUFFER NO MATCH' //,
    // inputData,
    // outputData
  );

  // Output file
  // outputFile(inputData, fileExt); //Outputting input buffer works
  outputFile(outputData, fileExt); //TODO: Outputting output buffer doesn't work.
}
main();
