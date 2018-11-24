// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { decryptFile, getFile, downloadAndDecryptFile } from './actions';
import { sendMessage } from '../whisper/actions';

// Core Component
import DownloadPage from './DownloadPage';

const mapStateToProps = state => ({
  events: state.events,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      downloadAndDecryptFile,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DownloadPage);
