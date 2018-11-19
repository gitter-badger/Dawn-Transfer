// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getWhisper, sendMessage, createListener, setWhisper } from './actions';

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
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Whisper);
