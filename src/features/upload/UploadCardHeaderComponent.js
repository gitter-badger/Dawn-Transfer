import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

// // DropZone Config
// Max File Upload Size
const fileMaxSize = 9 * 1000000;

// Dropzone Styles
const style = {
  width: '100%',
  height: 100,
  borderWidth: 2,
  borderColor: '#eceff4',
  borderStyle: 'dashed',
  borderRadius: 5,
};
const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#D8DEE9',
  backgroundColor: '#8AC0CF',
};

class UploadCardHeader extends Component {
  constructor(props) {
    super(props);
  }

  handleOnDrop = (accepted, rejected, links) => {
    // Handle file rejection
    if (rejected.length !== 0) {
      const { errors } = this.state;
      errors.file = 'File Rejected: ' + rejected[0].name;
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
        fileBuffer,
      );

      await this.props.encryptAndAddFile(fileBuffer, file.name);

      this.setState({ errors: { file: '' } });
    };
  };

  render() {
    // Get latest addedFile from props
    const { ipfsAddedFile, uploadedFile } = this.props.upload;
    let renderUploadContent;

    // Change Display based on status of uploaded file
    if (ipfsAddedFile.filePath) {
      renderUploadContent = (
        <div>
          <p className="file-added-confirmation">
            File Added! {ipfsAddedFile.filePath}
          </p>
          <span> (Click to add another) </span>
        </div>
      );
    } else {
      renderUploadContent = (
        <div>
          <p> + Add your File </p>
        </div>
      );
    }

    return (
      <div className={'app-card-header'}>
        <Dropzone
          onDrop={this.handleOnDrop}
          maxSize={fileMaxSize}
          multiple={false}
          style={style}
          activeStyle={activeStyle}
        >
          <div className="centered">
            {/* TODO: Errors
            <p className="errors">
              {this.state.errors.file
                ? this.state.errors.file
                : null}
            </p>
          */}
            <div className="upload-card-header">{renderUploadContent}</div>
          </div>
        </Dropzone>
      </div>
    );
  }
}

UploadCardHeader.propTypes = {
  encryptAndAddFile: PropTypes.func.isRequired,
  onFileUploaded: PropTypes.func.isRequired,
  upload: PropTypes.object.isRequired,
};

export default UploadCardHeader;
