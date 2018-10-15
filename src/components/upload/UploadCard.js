import React, { Component } from 'react';

import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import _ from 'lodash';
import util from 'ethjs-util';

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
import { sendMessage } from '../../actions/whisperActions';

// DropZone Config
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

class UploadCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			form: {
				files: [],
				uploadedFile: {},
				publicKey: '',
				topic: '1234',
				message: ''
			},

			errors: {
				publicKey: '',
				topic: '',
				message: '',
				file: ''
			}
		};

		this._onTextChange = this._onTextChange.bind(this);
		this._onSubmit = this._onSubmit.bind(this);
		this.handleOnDrop = this.handleOnDrop.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
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

	// Send a message
	sendMessage = e => {
		e.preventDefault();
		const { ipfsAddedFile, encryptedFile } = this.props.upload;

		// Construct payload
		const payload = {
			hash: ipfsAddedFile.fileHash,
			path: ipfsAddedFile.filePath,
			iv: encryptedFile.decryptionKey,
			note: this.state.message ? this.state.message : ''
		};

		if (payload.hash === '' || payload.path === '' || payload.iv === '') {
			return alert('Upload a file before sending through whisper!');
		}

		// Set options
		const opts = {
			pubKey: this.state.form.publicKey,
			sig: this.props.whisper.details.keyPairId, // signs the message using the keyPair ID
			ttl: 10,
			// topic: '0xffaadd11',
			topic: util.fromAscii(this.state.form.topic),
			payload: util.fromAscii(JSON.stringify(payload)),
			powTime: 3,
			powTarget: 0.5
		};

		console.log('PAYLOAD PRE', payload);
		this.props.sendMessage(opts, payload, this.props.whisper.shh);
	};

	_onSubmit(event) {
		event.preventDefault();
		alert('Submitting!');
		this.sendMessage();
	}

	_onTextChange(event) {
		let { form } = this.state;

		const fieldName = event.target.name;
		const fieldValue = event.target.value;

		form[fieldName] = fieldValue;
		this.setState({ form });
	}

	async componentWillReceiveProps(nextProps) {
		// Set default values for component
		const { form } = this.state;
		form.publicKey = nextProps.whisper.details.publicKey;
		form.topic = '1234';
		this.setState({ form });
	}

	render() {
		const { form, errors } = this.state;
		const { files } = form;

		// Get latest addedFile from props
		const { ipfsAddedFile, uploadedFile } = this.props.upload;
		// Set Content Preview
		let contentPreview;
		// switch (uploadedFile.mimeType.split('/')[0]) {
		// 	default:
		// 		contentPreview = (
		// 			<img src={default_preview} alt="default_image" />
		// 		);
		// 		break;
		// 	// End Content Preview
		// }

		return (
			<div className={'app-card'}>
				<div className={'app-card-header'}>
					<Dropzone
						onDrop={this.handleOnDrop}
						maxSize={fileMaxSize}
						multiple={false}
						style={style}
						activeStyle={activeStyle}
					>
						<div className="centered">
							{ipfsAddedFile.filePath ? contentPreview : null}
							<p className="errors">
								{this.state.errors.file
									? this.state.errors.file
									: null}
							</p>
							<p>
								{ipfsAddedFile.filePath
									? ipfsAddedFile.filePath
									: 'Drop File here'}
							</p>
						</div>
					</Dropzone>
				</div>
				<div className={'app-card-content'}>
					<div className={'app-card-content-inner'}>
						<form onSubmit={this.sendMessage}>
							<div
								className={classNames('app-form-item', {
									error: _.get(errors, 'publicKey')
								})}
							>
								<label htmlFor={'publicKey'}>
									Send to publicKey
								</label>
								<input
									onChange={this._onTextChange}
									value={form.publicKey}
									name={'publicKey'}
									placeholder={
										_.get(errors, 'publicKey')
											? _.get(errors, 'publicKey')
											: 'PUBKEY'
									}
									type={'text'}
									id={'publicKey'}
								/>
							</div>

							<div
								className={classNames('app-form-item', {
									error: _.get(errors, 'topic')
								})}
							>
								<label htmlFor={'topic'}>Topic</label>
								<input
									value={_.get(form, 'topic')}
									onChange={this._onTextChange}
									name={'topic'}
									placeholder={
										_.get(errors, 'topic')
											? _.get(errors, 'topic')
											: '1234'
									}
									type={'text'}
									id={'topic'}
								/>
							</div>

							<div className={'app-form-item'}>
								<label htmlFor={'message'}>Message</label>
								<textarea
									value={_.get(form, 'message', '')}
									onChange={this._onTextChange}
									placeholder={'Add a note (optional)'}
									id={'message'}
									name={'message'}
								/>
							</div>

							<div className={'app-form-actions'}>
								<button
									type={'submit'}
									className={'app-button primary'}
								>
									Send through Whisper
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

UploadCard.propTypes = {
	ipfsAddFile: PropTypes.func.isRequired,
	encryptFile: PropTypes.func.isRequired,
	upload: PropTypes.object.isRequired,
	whisper: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	upload: state.upload,
	whisper: state.whisper
});

export default connect(
	mapStateToProps,
	{
		ipfsAddFile,
		encryptFile,
		onFileUploaded,
		sendMessage
	}
)(UploadCard);
