import React from 'react';
import PropTypes from 'prop-types';

var Shh = require('web3-shh');
var shh = new Shh(
  Shh.givenProvider ||
    'https://rinkeby.infura.io/f1d66975e01047168520efe6009f9177'
);

class Whisper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: '',
      fileName: 'pic.jpg',
      contentLoaded: false,
      res: []
    };
  }
  render() {
    return (
      <div>
        <h1>Whisper</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="hash"
            value={this.state.hash}
            onChange={this.onChange}
            placeholder="Input Hash..."
          />
          <br />
          <input
            type="text"
            name="fileName"
            value={this.state.fileName}
            onChange={this.onChange}
            placeholder="Filename.."
          />
          <br />
          <input
            type="submit"
            className="btn btn-block btn-dark"
            value="Peer ID"
          />
          <input
            type="submit"
            className="btn btn-block btn-dark"
            value="Download from IPFS"
          />
        </form>
        {this.state.contentLoaded ? <p>Hash Sent!</p> : null}
      </div>
    );
  }
}

export default Whisper;
