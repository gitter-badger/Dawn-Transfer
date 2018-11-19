import React from 'react';
import PropTypes from 'prop-types';
import util from 'ethjs-util';

// Web3 whisper default provider
const wsProvider = 'ws://50.2.39.116:8546';
const topic1 = '1234';
const topic2 = '5678';

class Whisper extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // async onSubmitNewSubscription(e) {
  //   e.preventDefault();
  //   const topics = this.state.topics.split(',').map(t => t.trim().slice(0, 4));
  //   await this.createListener(topics);
  // }

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

    // Create default listener
    await this.createListener([topic1]);
  }

  // Wrapper function for creating a new listener
  createListener = async topics => {
    // Convert ascii topics to hex
    const topicsHex = topics.map(t => util.fromAscii(t));
    console.log('topics hex:', topicsHex);
    // Create opts for subscribe function
    const opts = {
      topics: topicsHex,
      privateKeyID: this.props.whisper.details.keyPairId,
    };

    // call shh.subscribe
    await this.props.createListener(opts, this.props.whisper.shh);
  };

  render = () => <div />;
}

Whisper.propTypes = {
  hash: PropTypes.string,
  whisper: PropTypes.object.isRequired,
};

export default Whisper;
