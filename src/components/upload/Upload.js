import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
// import node from '../../util/ipfs';
import default_preview from '../../img/file.png';

// Encryption
import { encrypt } from '../../util/encrypt';

// Redux
import { connect } from 'react-redux';
import {
  ipfsAddFile,
  encryptFile,
  onFileUploaded
} from '../../actions/uploadActions';

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
      errors: []
    };
    // this.addFile = this.addFile.bind(this);
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

    // Create FileReader and read file
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      // Convert file from blob to buffer
      const fileBuffer = Buffer.from(reader.result);

      // Log Upload File Success
      await this.props.onFileUploaded(
        file.name,
        file.type,
        file.preview,
        fileBuffer
      );

      // Encrypt File
      // await this.props.encryptFile(fileBuffer, file.name);
      // const { encryptedBuffer, fileName } = this.props.upload.encryptedFile;
      const { encryptedBuffer, fileName } = await this.props.encryptFile(
        fileBuffer,
        file.name
      );

      // IPFS Add File
      await this.props.ipfsAddFile(encryptedBuffer, fileName);
    };
  };

  render() {
    // Get latest addedFile from props
    const { ipfsAddedFile, uploadedFile } = this.props.upload;

    // Set Content Preview
    let contentPreview;
    switch (uploadedFile.mimeType.split('/')[0]) {
      case 'image':
        contentPreview = (
          <img src={uploadedFile.filePreview} alt="file_image" />
        );
        break;
      case 'video':
        contentPreview = (
          <video muted controls src={uploadedFile.filePreview}>
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
            {ipfsAddedFile.filePath ? contentPreview : null}
            <p>
              {ipfsAddedFile.filePath
                ? ipfsAddedFile.filePath
                : 'Drop File here'}
            </p>
          </div>
        </Dropzone>
        <br />
        <p className="errors">
          {this.state.errors ? this.state.errors.map(e => e) : null}
        </p>
        <div className="fileData">
          {ipfsAddedFile.fileHash && ipfsAddedFile.filePath ? (
            <div>
              <p>Encrypted file hash: {ipfsAddedFile.fileHash}</p>
              <p>File name: {ipfsAddedFile.filePath}</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

UploadPage.propTypes = {
  ipfsAddFile: PropTypes.func.isRequired,
  encryptFile: PropTypes.func.isRequired,
  upload: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  upload: state.upload
});

export default connect(
  mapStateToProps,
  {
    ipfsAddFile,
    encryptFile,
    onFileUploaded
  }
)(UploadPage);
