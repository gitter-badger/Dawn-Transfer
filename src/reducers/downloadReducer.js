import { IPFS_GET_FILE, DECRYPT_FILE } from '../actions/types';
// import isEmpty from '../utils/is-empty';

const initialState = {
  decrypted: {
    decryptedBuffer: [],
    fileName: '',
  },
};

export default function(state = initialState, action) {
  switch (action.type) {
    case DECRYPT_FILE:
      return {
        ...state,
        decrypted: action.payload,
      };
    default:
      return state;
  }
}
