import { NOTIFY } from '../actions/types';
// import isEmpty from '../utils/is-empty';

const initialState = {
  notifications: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NOTIFY:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    default:
      return state;
  }
}
