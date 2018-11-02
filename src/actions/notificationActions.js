import { NOTIFY } from './types';

export const notify = (msg, type) => dispatch => {
  switch (type) {
    case 'SUCCESS':
      return dispatch(notifyAction(msg, type));
    case 'ERROR':
      return dispatch(notifyAction(msg, type));
    case 'INFO':
      return dispatch(notifyAction(msg), type);
    default:
      break;
  }
};

const notifyAction = (msg, type) => ({
  type: NOTIFY,
  payload: { msg, type },
});
