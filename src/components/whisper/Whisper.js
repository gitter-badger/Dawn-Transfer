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
      note: this.state.note
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

    this.props.sendMessage(opts, this.props.whisper.shh);
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

    return (
      <div>
        <ToastContainer />
        <h1>Whisper</h1>
        <form onSubmit={this.sendMessage}>
          <input
            type="text"
            name="note"
            value={this.state.note}
            onChange={this.onChange}
            placeholder="Add a note..."
          />
          <br />
          <input
            type="text"
            name="pubKey"
            value={this.state.pubKey}
            onChange={this.onChange}
            placeholder="Recipient's PubKey..."
          />
          <br />
          <input
            type="text"
            name="topic"
            value={this.state.topic}
            onChange={this.onChange}
            placeholder="Topic to Post to..."
          />
          <br />
          <input
            type="submit"
            className="btn btn-block btn-dark"
            value="Send Through Whisper"
          />
        </form>

        <h1>Add Subscription</h1>
        <form onSubmit={this.onSubmitNewSubscription}>
          <input
            type="text"
            name="topics"
            value={this.state.topics}
            onChange={this.onChange}
            placeholder="Topics (Comma separated)..."
          />
          <br />
          <input
            type="submit"
            className="btn btn-block btn-dark"
            value="Create new Listener"
          />
        </form>

        <br />
        <hr />
        <div className="whisper-details">
          <h2>Whisper Details</h2>
          {whisperDetails}
        </div>
        {/* {this.state.contentLoaded ? <p>Hash Sent!</p> : null} */}
      </div>
    );
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
