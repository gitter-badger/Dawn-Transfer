const fs = require('fs');
const util = require('util');
const path = require('path');
const minimist = require('minimist'); //extract args
const CryptoJS = require('crypto-js');

const key = 'SECRET_KEY',
  iv = '9De0DgMTCDFGNokdEEial'; // You must dynamically create

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

var inputBuffer;
var inputBuffer64;

const encrypt = dataBuffer => {
  const dataBase64 = dataBuffer.toString('base64');
  const encryptFile = CryptoJS.AES.encrypt(dataBase64, key, { iv: iv });
  const encryptedBuffer = new Buffer(encryptFile.toString(), 'base64');

  inputBuffer = dataBuffer;
  inputBuffer64 = dataBase64;

  return encryptedBuffer;
};

const decrypt = encryptedBuffer => {
  const decryptFile = CryptoJS.AES.decrypt(
    encryptedBuffer.toString('base64'),
    key,
    { iv }
  );
  return decryptFile.toString(CryptoJS.enc.Utf8);
};

const getFilePath = () => {
  // Get args from input using minimist
  const argv = require('minimist')(process.argv.slice(2));
  const filePath = argv.f;
  const fileType = path.extname(filePath);
  return { filePath, fileType };
};

const readFileAsync = async filePath => {
  return await readFile(filePath);
};

// outputFile: Outputs unencrypted file.
const outputFileAsync = (data, fileExt) => {
  writeFile(`out/unencrypted${fileExt}`, data)
    .then(() => console.log('The file was saved!'))
    .catch(error => console.log(error));
};

// Main loop
async function main() {
  // Get Filepath / Filetype
  const { filePath, fileType } = getFilePath();

  // Read data as Buffer from filepath
  const dataBuffer = await readFileAsync(filePath);

  // Encrypt data
  const encrypted = encrypt(dataBuffer);

  // Decrypt Data
  const decrypted = decrypt(encrypted);

  // Convert decrypted data to Buffer
  const outputBuffer = new Buffer(decrypted.toString(), 'base64');

  // Write file to filesystem
  outputFileAsync(outputBuffer, fileType);

  // ~~~ Logging ~~~ //
  // Log Pre-Encryption data
  console.log('PRE-ENCRYPT BUFFER: ', inputBuffer, typeof inputBuffer);
  // console.log('PRE-ENCRYPT BUFFER BASE 64: ', inputBuffer64, typeof inputBuffer64);

  // Log Encrypted data
  // console.log('ENCRYPTED BUFFER: ', encrypted, typeof encrypted);

  // Log Post-Decryption data
  // console.log('DECRYPTED BUFFER BASE 64: ', decrypted, typeof decrypted);
  console.log('DECRYPTED BUFFER: ', outputBuffer, typeof outputBuffer);
  console.log('BASE64 MATCH: ', inputBuffer64 === decrypted);
  console.log('BUFFER MATCH: ', inputBuffer === outputBuffer);
  // ~~~ End Logging ~~~ //
}
main();
