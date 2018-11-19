import { IPFS_GET_FILE, DECRYPT_FILE } from '../../state/types';

const initialState = {
  decrypted: {
    decryptedBuffer: [],
    fileName: '',
  },
  encryptedFile: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case DECRYPT_FILE:
      return {
        ...state,
        decrypted: action.payload,
      };
    case IPFS_GET_FILE:
      return {
        ...state,
        encryptedFile: action.payload,
      };
    default:
      return state;
  }
}
