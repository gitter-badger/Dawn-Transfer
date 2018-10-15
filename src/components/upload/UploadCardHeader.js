import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

// Redux
import { connect } from 'react-redux';
import {
	ipfsAddFile,
	encryptFile,
	onFileUploaded
} from '../../actions/uploadActions';

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
	borderRadius: 5
};
const activeStyle = {
	borderStyle: 'solid',
	borderColor: '#D8DEE9',
	backgroundColor: '#8AC0CF'
};

class UploadCardHeader extends Component {
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
			this.setState({ errors: { file: '' } });
		};
	};

	render() {
		// Get latest addedFile from props
		const { ipfsAddedFile, uploadedFile } = this.props.upload;

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

						<p>
							{ipfsAddedFile.filePath
								? ipfsAddedFile.filePath
								: 'Drop File here'}
						</p>
					</div>
				</Dropzone>
			</div>
		);
	}
}

UploadCardHeader.propTypes = {
	ipfsAddFile: PropTypes.func.isRequired,
	encryptFile: PropTypes.func.isRequired,
	onFileUploaded: PropTypes.func.isRequired,
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
)(UploadCardHeader);
