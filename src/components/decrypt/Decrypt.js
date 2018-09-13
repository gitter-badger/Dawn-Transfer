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

const key = 'SECRET_KEY',
  iv = '9De0DgMTCDFGNokdEEial'; // You must dynamically create

class Decrypt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: '',
      fileName: 'pic.jpg',
      contentLoaded: false,
      res: []
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
    console.log('res:', res);
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
      iv
    );
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
      const decrypted = decrypt(file);
      console.log('Decrypted: ', decrypted);
      this.downloadFile(decrypted, fileName);
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
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
        <br />
        <Whisper />
      </div>
    );
  }
}

export default Decrypt;
