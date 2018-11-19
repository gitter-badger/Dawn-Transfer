import { combineReducers } from 'redux';

// Reducers
import whisperReducer from '../features/whisper/reducer';
import providerReducer from '../features/providers/reducer';
import uploadReducer from '../features/upload/reducer';
import downloadReducer from '../features/download/reducer';
import eventsReducer from '../features/events/reducer';

export default combineReducers({
  whisper: whisperReducer,
  providers: providerReducer,
  upload: uploadReducer,
  download: downloadReducer,
  events: eventsReducer,
});
