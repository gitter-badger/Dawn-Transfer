import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import node from '../../util/ipfs';
import default_preview from '../../img/file.png';

// Encryption
import { encrypt } from '../../util/encrypt';

// Max File Upload Size
const fileMaxSize = 9 * 1000000;

// Dropzone Styles
const style = {
  width: 400,
  height: 400,
  borderWidth: 2,
  borderColor: '#eceff4',
  borderStyle: 'dashed',
  borderRadius: 5
};
const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#D8DEE9',
  backgroundColor: '#8AC0CF'
};

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
    // Handle file rejection
    if (rejected.length !== 0) {
      let errors = [];
      errors.push('File Rejected: ', rejected[0].name);
      return this.setState({ errors });
    }
    // Handle file acceptance
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
      const encryptedBuffer = encrypt(fileBuffer);
      console.log('File Buffer: ', fileBuffer);
      console.log('Encrypted Buffer: ', encryptedBuffer);
      await this.addFile(encryptedBuffer, fileName);
      // await this.addFile(fileBuffer, fileName);
    };
  };

  // Add file to IPFS
  addFile = async (buffer, fileName) => {
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
    // Set Content Preview
    let contentPreview;
    switch (this.state.mimeType.split('/')[0]) {
      case 'image':
        contentPreview = <img src={this.state.filePreview} alt="file_image" />;
        break;
      case 'video':
        contentPreview = (
          <video muted controls src={this.state.filePreview}>
            Sorry, your browser doesn't support embedded videos.
          </video>
        );
        break;
      default:
        contentPreview = <img src={default_preview} alt="default_image" />;
        break;
      // End Content Preview
    }
    return (
      <div>
        <h1>Upload</h1>
        <Dropzone
          onDrop={this.handleOnDrop}
          maxSize={fileMaxSize}
          multiple={false}
          style={style}
          activeStyle={activeStyle}
        >
          <div className="centered">
            {this.state.filePath ? contentPreview : null}
            <p>
              {this.state.filePath ? this.state.filePath : 'Drop File here'}
            </p>
          </div>
        </Dropzone>
        <br />
        <p className="errors">
          {this.state.errors ? this.state.errors.map(e => e) : null}
        </p>
        <div className="fileData">
          {this.state.fileHash && this.state.filePath ? (
            <div>
              <p>Encrypted file hash: {this.state.fileHash}</p>
              <p>File name: {this.state.filePath}</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default UploadPage;
