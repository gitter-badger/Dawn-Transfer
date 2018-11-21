import { GET_WHISPER, CREATE_LISTENER, SET_WHISPER, CREATE_MESSAGE_FILTER } from '../../state/types';

const initialState = {
  details: {},
  shh: {},
  subscriptions: [],
  messageFilters: []
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

    case CREATE_MESSAGE_FILTER:
      return {
        ...state,
        messageFilters: [...state.messageFilters, action.payload],
      };

    default:
      return state;
  }
}
