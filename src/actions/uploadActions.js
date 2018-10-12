import { IPFS_ADD_FILE, ENCRYPT_FILE, FILE_UPLOADED } from '../actions/types';
import node from '../util/ipfs';
import { encrypt } from '../util/encrypt';

// Add file to IPFS
export const ipfsAddFile = (buffer, fileName) => async dispatch => {
  const filesAdded = await node.files.add({
    content: buffer,
    path: fileName
  });
  console.log('Added file:', filesAdded[0].path, filesAdded[0].hash);
  dispatch(ipfsAddFileAction(filesAdded[0].path, filesAdded[0].hash));
};

// Encrypt File
export const encryptFile = (fileBuffer, fileName) => async dispatch => {
  const encryptedPayload = encrypt(fileBuffer);
  const { encryptedBuffer, iv } = encryptedPayload;
  console.log('File Buffer: ', fileBuffer);
  console.log('File Name: ', fileName);
  console.log('Encrypted Buffer:', encryptedBuffer);
  console.log('Decryption Key (IV):', iv);
  dispatch(encryptFileAction(encryptedBuffer, iv, fileName));
  return { encryptedBuffer, fileName };
};

// On File Uploaded
export const onFileUploaded = (
  fileName,
  mimeType,
  filePreview,
  fileBuffer
) => async dispatch => {
  dispatch(fileUploadedAction(fileName, mimeType, filePreview, fileBuffer));
};

// //////////
// Actions
const fileUploadedAction = (fileName, mimeType, filePreview, fileBuffer) => {
  return {
    type: FILE_UPLOADED,
    payload: {
      fileName,
      mimeType,
      filePreview,
      fileBuffer
    }
  };
};

const encryptFileAction = (encryptedBuffer, decryptionKey, fileName) => {
  return {
    type: ENCRYPT_FILE,
    payload: {
      encryptedBuffer,
      decryptionKey,
      fileName
    }
  };
};

const ipfsAddFileAction = (filePath, fileHash) => {
  return {
    type: IPFS_ADD_FILE,
    payload: { filePath, fileHash }
  };
};
