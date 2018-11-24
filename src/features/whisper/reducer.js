import {
  GET_WHISPER,
  CREATE_LISTENER,
  SET_WHISPER,
  CREATE_MESSAGE_FILTER,
  UPDATE_WHISPER_IDENTITY,
} from '../../state/types';

const initialState = {
  details: {
    info: {},
    keyPairId: '',
    symKeyId: '',
    symKey: '',
    publicKey: '',
    privateKey: '',
  },
  shh: {},
  subscriptions: [],
  messageFilters: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_WHISPER:
      return {
        ...state,
        details: action.payload,
      };
    case SET_WHISPER:
      return {
        ...state,
        shh: action.payload,
      };

    case UPDATE_WHISPER_IDENTITY:
      const {
        keyPairId,
        symKeyId,
        symKey,
        pubKey,
        privateKey,
      } = action.payload;

    //   alert(`
    // SymKeyId: ${symKeyId} ;
    // SymKey: ${symKey} ;
    // keyPairId: ${keyPairId} ;
    // PubKey: ${pubKey} ;
    // PrivKey: ${privateKey} ;
    // `);

      return {
        ...state,
        details: { 
          ...state.details,
         keyPairId: keyPairId, 
         symKey: symKey, 
         symKeyId: symKeyId, 
         publicKey: privateKey,  
         publicKey: pubKey },
      };

    case CREATE_LISTENER:
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload],
      };

    case CREATE_MESSAGE_FILTER:
      return {
        ...state,
        messageFilters: [...state.messageFilters, action.payload],
      };

    default:
      return state;
  }
}
