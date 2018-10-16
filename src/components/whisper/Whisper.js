import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import util from 'ethjs-util';

// redux
import { connect } from 'react-redux';
import {
  getWhisper,
  sendMessage,
  createListener,
  setWhisper
} from '../../actions/whisperActions';

// Toasts
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Web3 whisper default provider
const wsProvider = 'ws://50.2.39.116:8546';
const topic1 = '1234';
const topic2 = '5678';

class Whisper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: '',
      pubKey: '',
      symKey: '',
      topics: '', // subcribe to topics
      topic: '' // sendTo topic
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitNewSubscription = this.onSubmitNewSubscription.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  notify = (msg, type) => {
    switch (type) {
      case 'success':
        toast.success(msg, {
          position: toast.POSITION.TOP_CENTER
        });
        break;
      case 'error':
        toast.error(msg, {
          position: toast.POSITION.TOP_CENTER
        });
        break;
      case 'info':
        toast.info(msg, {
          position: toast.POSITION.TOP_CENTER
        });
        break;
      default:
        toast(msg);
    }
  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async onSubmitNewSubscription(e) {
    e.preventDefault();
    const topics = this.state.topics.split(',').map(t => t.trim().slice(0, 4));
    await this.createListener(topics);
  }

  async componentDidMount() {
    // Set Whisper using default provider
    await this.props.setWhisper(wsProvider);
    console.log('Set Whisper');

    // Get web3.shh from props
    const { shh } = this.props.whisper;

    // Create a new Whisper Peer Identity
    await this.props.getWhisper(shh);
    console.log('New Whisper Peer Identity!');

    // Set default values for component
    console.log(this.props.whisper.details.publicKey);
    this.setState({
      topic: '1234',
      pubKey: this.props.whisper.details.publicKey
    });

    // Create default listener
    await this.createListener([this.state.topic]);
  }

  // Wrapper function for creating a new listener
  createListener = async topics => {
    // Convert ascii topics to hex
    const topicsHex = topics.map(t => util.fromAscii(t));
    console.log('topics hex:', topicsHex);
    // Create opts for subscribe function
    const opts = {
      topics: topicsHex,
      privateKeyID: this.props.whisper.details.keyPairId
    };

    // call shh.subscribe
    await this.props.createListener(opts, this.props.whisper.shh);
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
      note: this.state.note ? this.state.note : ''
    };

    if (payload.hash === '' || payload.path === '' || payload.iv === '') {
      return alert('Upload a file before sending through whisper!');
    }

    // Set options
    const opts = {
      pubKey: this.state.pubKey,
      sig: this.props.whisper.details.keyPairId, // signs the message using the keyPair ID
      ttl: 10,
      // topic: '0xffaadd11',
      topic: util.fromAscii(this.state.topic),
      payload: util.fromAscii(JSON.stringify(payload)),
      powTime: 3,
      powTarget: 0.5
    };

    console.log('PAYLOAD PRE', payload);
    this.props.sendMessage(opts, payload, this.props.whisper.shh);
  };

  render() {
    // Whisper Details
    let whisperDetails, incomingMessages;
    const { details } = this.props.whisper;
    if (details.isListening) {
      whisperDetails = (
        <div className="whisper-details">
          <p>Listening: true</p>
          <p>Peer Count: {details.peerCount}</p>
          <p>Peer ID: {details.keyPairId}</p>
          <p>Public Key: {details.publicKey}</p>
          <p>Sym Key: {details.symKeyId} </p>
        </div>
      );
    } else {
      whisperDetails = (
        <div>
          <p>Not Connected to whisper</p>
        </div>
      );
    }

    return <div />;
  }
}

Whisper.propTypes = {
  hash: PropTypes.string,
  whisper: PropTypes.object.isRequired,
  upload: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  whisper: state.whisper,
  upload: state.upload
});

export default connect(
  mapStateToProps,
  {
    getWhisper,
    setWhisper,
    sendMessage,
    createListener
  }
)(Whisper);
