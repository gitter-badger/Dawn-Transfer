import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let wsProvider = 'ws://50.2.39.116:8546';
var web3 = new Web3(new Web3.providers.WebsocketProvider(wsProvider));
var shh = web3.shh;

console.log(`Shh Ready: `);
console.log('Shh Current Provider', shh.currentProvider);
console.log('Shh Given Provider:', shh.givenProvider);

var identities = [];
var subscription = null;

class Whisper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: '',
      pubKey: '',
      symKey: '',
      whisper: {}
    };
    this.getWhisperDetails = this.getWhisperDetails.bind(this);
    this.onChange = this.onChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.createListener = this.createListener.bind(this);
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

  componentDidMount() {
    this.getWhisperDetails()
      .then(() => {
        console.log('Whisper:', this.state.whisper);
      })
      .then(() => {
        this.createListener();
      });
  }

  componentWillReceiveProps(nextprops) {
    this.setState({ hash: nextprops.hash });
  }

  createListener() {
    // Generate new identity
    console.log('creating listener...');
    const topics = ['0xffaadd11'];
    // will receive also its own message send, below
    subscription = shh
      .subscribe('messages', {
        // symKeyID: this.state.whisper.symKeyId, //symKeyId
        privateKeyID: this.state.whisper.keyPairId,
        topics
      })
      .on('data', data => {
        const payload = JSON.parse(web3.utils.hexToAscii(data.payload));
        console.log('PAYLOAD:', payload);
        this.notify(`Hash Received! Hash: ${payload.hash}`, 'info');
      });
  }

  // Send a message
  sendMessage = e => {
    e.preventDefault();

    // Construct payload
    const payload = {
      hash: this.state.hash,
      iv: '9De0DgMTCDFGNokdEEial'
    };

    shh
      .post({
        // symKeyID: this.state.symKey, // encrypts using the sym key ID
        pubKey: this.state.pubKey,
        sig: this.state.whisper.keyPairId, // signs the message using the keyPair ID
        ttl: 10,
        topic: '0xffaadd11',
        payload: web3.utils.asciiToHex(JSON.stringify(payload)),
        powTime: 3,
        powTarget: 0.5
      })
      .then(h => {
        console.log(`Message with hash ${h} was successfuly sent`);
        this.notify(`Message sent!`, 'success');
      })
      .catch(err => console.log('Error: ', err));
  };

  // Gets all details related to Whisper
  getWhisperDetails = async () => {
    // Get node info
    const info = await shh.getInfo();
    const isListening = await shh.net.isListening();
    const peerCount = await shh.net.getPeerCount();
    const netId = await shh.net.getId();

    // Get Identity
    const keyPairId = await shh.newKeyPair();
    const symKeyId = await shh.newSymKey();
    const publicKey = await shh.getPublicKey(keyPairId);
    const privateKey = await shh.getPrivateKey(keyPairId);

    // Set State
    this.setState({
      whisper: {
        info,
        isListening,
        peerCount,
        netId,
        keyPairId,
        symKeyId,
        publicKey,
        privateKey
      }
    });
  };

  render() {
    let whisperDetails;
    const { whisper } = this.state;
    if (whisper.isListening) {
      whisperDetails = (
        <div className="whisper-details">
          <p>Listening: true</p>
          <p>Peer Count: {whisper.peerCount}</p>
          <p>Peer ID: {whisper.keyPairId}</p>
          <p>Public Key: {whisper.publicKey}</p>
          <p>Sym Key: {whisper.symKeyId} </p>
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
            name="hash"
            value={this.state.hash}
            onChange={this.onChange}
            placeholder="File Hash..."
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
            name="symKey"
            value={this.state.symkey}
            onChange={this.onChange}
            placeholder="Recipient's SymKey ID..."
          />
          <br />
          <input
            type="submit"
            className="btn btn-block btn-dark"
            value="Send Through Whisper"
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
  hash: PropTypes.string
  // key: PropTypes.string
  // TTL? //
};

export default Whisper;
