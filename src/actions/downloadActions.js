import { IPFS_GET_FILE, DECRYPT_FILE } from '../actions/types';
import node from '../util/ipfs';
import { decrypt } from '../util/encrypt';

// Encrypt File
export const decryptFile = (
  encryptedBuffer,
  iv,
  fileName
) => async dispatch => {
  console.log('decrypting..');
  const decryptedBuffer = decrypt(encryptedBuffer, iv);
  console.log('Decrypted: ', decryptedBuffer);
  dispatch(decryptFileAction(decryptedBuffer, fileName));
};

// //////////
// Actions
const decryptFileAction = (decryptedBuffer, fileName) => {
  return {
    type: DECRYPT_FILE,
    payload: {
      decryptedBuffer,
      fileName
    }
  };
};

const ipfsAddFileAction = (filePath, fileHash) => {
  return {
    type: IPFS_GET_FILE,
    payload: { filePath, fileHash }
  };
};
