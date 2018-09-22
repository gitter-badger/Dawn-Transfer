import React from 'react';
import PropTypes from 'prop-types';

let wsProvider = 'ws://50.2.39.116:8546';
// const shh = new Shh(nodeProvider);

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider(wsProvider));
var shh = web3.shh;

console.log(`Shh Ready: `);
console.log('Shh Current Provider', shh.currentProvider);
console.log('Shh Given Provider:', shh.givenProvider);

const getWhisperDetails = async () => {
  const info = await shh.getInfo();
  const isListening = await shh.net.isListening();
  const whispkey = await shh.newKeyPair();
  const publicKey = await shh.getPublicKey(whispkey)
  const privateKey = await shh.getPrivateKey(whispkey)
  console.log('info', info);
  console.log('isListening:', isListening);
  console.log('whispkey:', whispkey);
  console.log('publicKey:', publicKey);
  console.log('privateKey:', privateKey);
};

getWhisperDetails();

var identities = [];
var subscription = null;

class Whisper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: '',
      peerName: 'peerId',
      res: []
    };
    this.onChange = this.onChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  sendMessage = () => {
    Promise.all([
      shh.newSymKey().then(id => {
        identities.push(id);
      }),
      shh.newKeyPair().then(id => {
        identities.push(id);
      })
    ])
      .then(() => {
        // will receive also its own message send, below
        subscription = shh
          .subscribe('messages', {
            symKeyID: identities[0],
            topics: ['0xffaadd11']
          })
          .on('data', console.log);
      })
      .then(() => {
        shh
          .post({
            symKeyID: identities[0], // encrypts using the sym key ID
            sig: identities[1], // signs the message using the keyPair ID
            ttl: 10,
            topic: '0xffaadd11',
            payload: '0xffffffdddddd1122',
            powTime: 3,
            powTarget: 0.5
          })
          .then(h => console.log(`Message with hash ${h} was successfuly sent`))
          .catch(err => console.log('Error: ', err));
      });
  };

  render() {
    return (
      <div>
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
            name="peerId"
            value={this.state.peerId}
            onChange={this.onChange}
            placeholder="Peer ID..."
          />
          <br />
          <input
            type="submit"
            className="btn btn-block btn-dark"
            value="Send Hash"
          />
        </form>
        {/* {this.state.contentLoaded ? <p>Hash Sent!</p> : null} */}
      </div>
    );
  }
}

export default Whisper;
