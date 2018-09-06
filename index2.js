const CryptoJS = require('crypto-js');
const fs = require('fs');
const Base64Binary = require('./base64Binary');
const Base64ArrayBuffer = require('base64-arraybuffer');

const key = 'SECRET_KEY',
  iv = '9De0DgMTCDFGNokdEEial'; // You must dynamically create

var inputBuffer;
var inputBuffer64;

const encrypt = async filePath => {
  const dataFile = fs.readFileSync(filePath),
    dataBase64 = dataFile.toString('base64'),
    encryptFile = CryptoJS.AES.encrypt(dataBase64, key, { iv: iv }),
    buffer = new Buffer(encryptFile.toString(), 'base64');

  inputBuffer = dataFile;
  inputBuffer64 = dataBase64;

  fs.writeFileSync(`out/${filePath}`, buffer);
  return buffer;
};

const decrypt = (filePath, fileType) => {
  const dataFile = fs.readFileSync(filePath);
  const decryptFile = CryptoJS.AES.decrypt(dataFile.toString('base64'), key, {
    iv: iv
  });

  return decryptFile.toString(CryptoJS.enc.Utf8);
};

// Main loop
async function main() {
  const fileType = '.jpg';

  // Encrypt data
  const encrypted = encrypt(`files/test${fileType}`);

  // Decrypt Data
  const decrypted = decrypt(`out/files/test${fileType}`, fileType);

  // Convert decrypted data to Buffer
  outputBuffer = new Buffer(decrypted.toString(), 'base64');

  // Write file to filesystem
  fs.writeFileSync(`out/files/decrypted${fileType}`, outputBuffer);

  // ~~~ Logging ~~~
  // Log Pre-Encryption data
  console.log('PRE-ENCRYPT BYTE ARRAY: ', inputBuffer, typeof inputBuffer);
  // console.log(
  //   'PRE-ENCRYPT BYTE ARRAY BASE64: ',
  //   inputBuffer64,
  //   typeof inputBuffer64
  // );

  // Log Post-Encryption data
  // console.log('ENCRYPTED BYTE ARRAY: ', encrypted, typeof encrypted);

  // Log Post-Decryption data
  // console.log('DECRYPTED BYTE ARRAY BASE 64: ', decrypted, typeof decrypted);
  console.log('DECRYPTED BYTE ARRAY: ', outputBuffer, typeof outputBuffer);
  console.log('BASE64 MATCH: ', inputBuffer64 === decrypted);
  console.log('BUFFER MATCH: ', inputBuffer === outputBuffer);
}
main();
