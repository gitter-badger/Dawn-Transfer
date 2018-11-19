import React from 'react';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';
import node from '../../util/ipfs';

// Decryption
import { decrypt } from '../../util/encrypt';
import axios from 'axios';

// File Download
import fileDownload from 'js-file-download';

// Whisper
import Whisper from '../whisper/Whisper';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { decryptFile } from '../../actions/downloadActions';

const key = 'SECRET_KEY',
  iv = '9De0DgMTCDFGNokdEEial'; // You must dynamically create

class Decrypt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: '',
      fileName: 'pic.jpg',
      contentLoaded: false,
      res: [],
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.downloadAndDecryptFile = this.downloadAndDecryptFile.bind(this);
    this.getData = this.getData.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

  getData = async hash => {
    const files = await node.files.get(hash);
    // const url = `https://ipfs.io/ipfs/${hash}`;
    // console.log('Getting data from:', url);
    const res = files.map(file => {
      const { content, name, path } = file;
      return { content, name, path };
    });
    // console.log('res:', res);
    return res;
  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { hash, fileName } = this.state;

    const fileBuffer = await this.downloadAndDecryptFile(
      hash,
      fileName,
      key,
      iv,
    );
  };

  handleMessageClick = async msg => {
    const { hash, path, iv, note } = msg;
    await this.downloadAndDecryptFile(hash, path, key, iv);
  };

  downloadFile = (data, fileName) => {
    fileDownload(data, fileName);
  };

  downloadAndDecryptFile = async (hash, fileName, key, iv) => {
    console.log('decrypting hash: ', hash);
    try {
      const res = await this.getData(hash);
      this.setState({ contentLoaded: true, res });
      const file = res[0].content;

      // Decrypt File
      await this.props.decryptFile(file, iv, fileName);

      // Trigger file download
      const { decryptedBuffer, filename } = this.props.download.decrypted;
      this.downloadFile(decryptedBuffer, fileName);
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
    // Incoming Messages
    let incomingMessages;

    const messages = this.props.events.received_messages;
    if (messages.length !== 0) {
      incomingMessages = messages.map((msg, idx) => {
        const { hash, path, iv, note } = msg;
        return (
          <button onClick={() => this.handleMessageClick(msg)}>
            {note ? note : idx}
          </button>
        );
      });
    }
    console.log(incomingMessages);

    return (
      <div>
        <h1>Decrypt</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="hash"
            value={this.state.hash}
            onChange={this.onChange}
            placeholder="Input Hash..."
          />
          <br />
          <input
            type="text"
            name="fileName"
            value={this.state.fileName}
            onChange={this.onChange}
            placeholder="Filename.."
          />
          <br />
          <input
            type="submit"
            className="btn btn-block btn-dark"
            value="Download from IPFS"
          />
        </form>
        {this.state.contentLoaded ? <p>File Loaded!</p> : null}
        <div className="messages">
          <h2>Messages</h2>
          {incomingMessages ? incomingMessages : null}
        </div>
        <br />
        <hr />
        <Whisper hash={this.state.hash} />
      </div>
    );
  }
}

Decrypt.propTypes = {
  decryptFile: PropTypes.func.isRequired,
  download: PropTypes.object.isRequired,
  whisper: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  download: state.download,
  whisper: state.whisper,
  events: state.events,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      decryptFile,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Decrypt);
