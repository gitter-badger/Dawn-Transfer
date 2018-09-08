import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import node from '../../util/ipfs.js';

const fileMaxSize = 9 * 1000000;

class UploadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: '',
      fileHash: ''
    };
    this.addFile = this.addFile.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
  }

  handleOnDrop = (accepted, rejected, links) => {
    // console.log('Accepted: ', accepted[0]);
    // console.log('Rejected: ', rejected);
    const file = accepted[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const fileBuffer = Buffer.from(reader.result);
      await this.addFile(fileBuffer, fileName);
    };
  };

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
    return (
      <main className="container">
        <h1>Upload</h1>
        <Dropzone
          onDrop={this.handleOnDrop}
          maxSize={fileMaxSize}
          multiple={false}
        >
          {this.state.filePath ? this.state.filePath : 'Drop File here'}
        </Dropzone>
        <p>File hash: {this.state.fileHash}</p>
        <p>File path: {this.state.filePath}</p>
      </main>
    );
  }
}

export default UploadPage;
