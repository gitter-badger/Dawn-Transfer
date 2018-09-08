import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import node from '../../util/ipfs.js';
import default_preview from './file.png';

const fileMaxSize = 9 * 1000000;
const ipfsURL = 'https://ipfs.io/ipfs/';

class UploadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: '',
      fileHash: '',
      mimeType: '',
      filePreview: '',
      errors: []
    };
    this.addFile = this.addFile.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
  }

  handleOnDrop = (accepted, rejected, links) => {
    // console.log('Accepted: ', accepted[0]);
    // console.log('Rejected: ', rejected);
    // Get file attributes
    if (rejected.length !== 0) {
      let errors = [];
      errors.push('File Rejected: ', rejected[0].name);
      return this.setState({ errors });
    }
    const file = accepted[0];
    const fileName = file.name;
    const mimeType = file.type;
    const filePreview = file.preview;
    this.setState({ mimeType, filePreview, errors: [] });

    // Convert file from blob to buffer and ipfs add
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const fileBuffer = Buffer.from(reader.result);
      await this.addFile(fileBuffer, fileName);
    };
  };

  addFile = async (buffer, fileName) => {
    // ipfs add
    const filesAdded = await node.files.add({
      path: fileName,
      content: buffer
    });
    console.log('Added file:', filesAdded[0].path, filesAdded[0].hash);
    this.setState({
      filePath: filesAdded[0].path,
      fileHash: filesAdded[0].hash
    });
  };

  render() {
    // Set content preview
    let contentPreview;
    switch (this.state.mimeType.split('/')[0]) {
      case 'image':
        contentPreview = <img src={this.state.filePreview} alt="file_image" />;
        break;
      case 'video':
        contentPreview = (
          <video muted autoplay controls src={this.state.filePreview}>
            Sorry, your browser doesn't support embedded videos.
          </video>
        );
        break;
      default:
        contentPreview = <img src={default_preview} alt="default_image" />;
        break;
    }
    return (
      <div className="container">
        <div className="row">
          <div className="split left">
            <div className="centered">
              <h1>Upload</h1>
              <Dropzone
                onDrop={this.handleOnDrop}
                maxSize={fileMaxSize}
                multiple={false}
              >
                {this.state.filePath ? contentPreview : null}
                {this.state.filePath ? this.state.filePath : 'Drop File here'}
              </Dropzone>
              <br />
              <p className="errors">
                {this.state.errors ? this.state.errors.map(e => e) : null}
              </p>
            </div>
          </div>
          <div className="split right">
            <div className="centered">
              <p>File hash: {this.state.fileHash}</p>
              <p>File path: {this.state.filePath}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadPage;
