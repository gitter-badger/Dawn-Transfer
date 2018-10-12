import { SET_WHISPER_PROVIDER } from '../actions/types';
// import isEmpty from '../utils/is-empty';

const initialState = {
  whisper: '',
  ipfs: '',
  web3: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_WHISPER_PROVIDER:
      return {
        ...state,
        whisper: action.payload
      };
    default:
      return state;
  }
}
