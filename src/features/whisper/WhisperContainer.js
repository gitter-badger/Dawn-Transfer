// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getWhisper,
  sendMessage,
  createListener,
  setWhisper,
  getFilterMessages,
  requestHistoricMessages,
  getSymKeyIdFromPassword,
} from './actions';
import { newStatus, connectStatus } from './actions_status';

// Core Component
import Whisper from './WhisperComponent';

const mapStateToProps = state => ({
  whisper: state.whisper,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getWhisper,
      setWhisper,
      sendMessage,
      createListener,
      getFilterMessages,
      newStatus,
      connectStatus,
      requestHistoricMessages,
      getSymKeyIdFromPassword
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Whisper);
