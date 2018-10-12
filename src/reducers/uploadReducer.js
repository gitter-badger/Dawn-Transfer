import { IPFS_ADD_FILE, ENCRYPT_FILE, FILE_UPLOADED } from '../actions/types';
// import isEmpty from '../utils/is-empty';

const initialState = {
  ipfsAddedFile: {
    filePath: '',
    filehash: ''
  },
  encryptedFile: {
    encryptedBuffer: [],
    decryptionKey: '',
    fileName: ''
  },
  uploadedFile: {
    fileName: '',
    mimeType: '',
    filePreview: '',
    fileBuffer: []
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case IPFS_ADD_FILE:
      return {
        ...state,
        ipfsAddedFile: action.payload
      };
    case ENCRYPT_FILE:
      return {
        ...state,
        encryptedFile: action.payload
      };
    case FILE_UPLOADED:
      return {
        ...state,
        uploadedFile: action.payload
      };
    default:
      return state;
  }
}
