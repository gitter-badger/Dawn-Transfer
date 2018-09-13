import React from 'react';
import PropTypes from 'prop-types';

const Shh = require('web3-shh');
const shh = new Shh(
  Shh.givenProvider ||
    'https://rinkeby.infura.io/f1d66975e01047168520efe6009f9177'
);

const whispkey = shh.newKeyPair();

console.log(`Shh Ready:
Shh Current Provider: ${shh.currentProvider}
Shh Given Provider: ${shh.givenProvider}
Shh is listening: ${shh.net.isListening()}
`);

console.log(shh.net.getPeerCount());

var identities = [];
var subscription = null;

const sendMessage = Promise.all([
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

class Whisper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: '',
      peerName: 'peerId',
      res: []
    };
    this.onChange = this.onChange.bind(this);
    // this.sendMessage = this.sendMessage.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>Whisper</h1>
        <form onSubmit={sendMessage}>
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
