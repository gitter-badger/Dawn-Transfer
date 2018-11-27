import { IPFS_GET_FILE, DECRYPT_FILE, DOWNLOAD_FILE } from '../../state/types';

import node from '../../util/ipfs';
import { decrypt } from '../../util/encrypt';
import isEmpty from '../../util/is-empty';

import fileDownload from 'js-file-download';

//////////////////
// API Function calls

// Tries downloading and Decrypting the file given payload
export const downloadAndDecryptFile = (
  hash,
  fileName,
  key = 'SECRET_KEY',
  iv = '9De0DgMTCDFGNokdEEial',
) => async dispatch => {
  console.log("Downloading")
  try {
    console.log('HASH:', hash);
    const res = await getFile(hash);
    console.log("Got file")

    const file = res[0].content;
    dispatch(ipfsGetFileAction(file));

    // Decrypt File
    const decryptedBuffer = await decryptFile(file, iv);
    dispatch(decryptFileAction(decryptedBuffer, fileName));

    // Trigger file download
    downloadFile(decryptedBuffer, fileName);
    dispatch(downloadFileAction());
  } catch (err) {
    console.log(err.message);
  }
};

// Decrypts File
export const decryptFile = async (encryptedBuffer, iv) => {
  console.log('Decrypting..');
  const decryptedBuffer = decrypt(encryptedBuffer, iv);
  console.log('Decrypted: ', decryptedBuffer);
  return decryptedBuffer;
};

// Get File form IPFS
const getFile = hash =>
  new Promise((resolve, reject) => {
    node.on('ready', async () => {
      const files = await node.files.get(hash);
      const res = files.map(file => {
        const { content, name, path } = file;
        return { content, name, path };
      });
      return resolve(res);
    });
  });

// Encrypt File
const downloadFile = (decryptedBuffer, fileName) => {
  return fileDownload(decryptedBuffer, fileName);
};

//////////////////
// Action Creators
const decryptFileAction = (decryptedBuffer, fileName) => ({
  type: DECRYPT_FILE,
  payload: {
    decryptedBuffer,
    fileName,
  },
});

const ipfsGetFileAction = file => ({
  type: IPFS_GET_FILE,
  payload: file,
});

const downloadFileAction = () => ({
  type: DOWNLOAD_FILE,
});
