import { combineReducers } from 'redux';
import whisperReducer from './whisperReducer';
import providerReducer from './providerReducer';
import uploadReducer from './uploadReducer';
import downloadReducer from './downloadReducer';
import eventsReducer from './eventsReducer';

export default combineReducers({
  whisper: whisperReducer,
  providers: providerReducer,
  upload: uploadReducer,
  download: downloadReducer,
  events: eventsReducer,
});
