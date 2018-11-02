import { GET_WHISPER, CREATE_LISTENER, SET_WHISPER } from '../actions/types';
// import isEmpty from '../utils/is-empty';

const initialState = {
  details: {},
  shh: {},
  subscriptions: [],
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

    case CREATE_LISTENER:
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload],
      };

    default:
      return state;
  }
}
