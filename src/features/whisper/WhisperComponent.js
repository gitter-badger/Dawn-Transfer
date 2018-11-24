import React from 'react';
import PropTypes from 'prop-types';
import util from 'ethjs-util';

import {
  callWhisper,
  getWhisperInfo,
  shhextConfirmMessagesProcessed,
} from '../../util/whispercalls';

// Web3 whisper default provider
const wsProvider = 'ws://50.2.39.116:8546';
const httpProvider = 'http://104.197.46.74:8545';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const enode = '';

const topic1 = '1234';
const topic2 = '5678';

class Whisper extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.doGetFilterMessages = this.doGetFilterMessages.bind(this);
    this.doRequestHistoricMessages = this.doRequestHistoricMessages.bind(this);
    this.doGetWhisperIdentityFromPassword = this.doGetWhisperIdentityFromPassword.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // async onSubmitNewSubscription(e) {
  //   e.preventDefault();
  //   const topics = this.state.topics.split(',').map(t => t.trim().slice(0, 4));
  //   await this.createListener(topics);
  // }

  async doGetFilterMessages(e) {
    e.preventDefault()
    await this.props.getFilterMessages();
  }

  async doRequestHistoricMessages(e) {
    e.preventDefault()
    const opts = {
      mailServerPeer: enode,
      topic: topic1,
      symKeyId: this.props.whisper.details.symKeyId

    }
    await this.props.requestHistoricMessages(opts);
  }

  async componentDidMount() {
    // callWhisper();
    // getWhisperInfo();
    // shhextConfirmMessagesProcessed();
    await this.props.newStatus();
    await this.props.connectStatus(null, proxyUrl + httpProvider);

    // Set Whisper using default provider
    await this.props.setWhisper(null, proxyUrl + httpProvider);
    // callWhisper()

    // Get web3.shh from props
    const { shh } = this.props.whisper;

    // Create a new Whisper Peer Identity
    await this.props.getWhisper(shh);

    // Set default values for component
    console.log('props.whisper: ', this.props.whisper);

    // Create default listener
    await this.createListener([topic1]);
  }

  async doGetWhisperIdentityFromPassword(e) {
    e.preventDefault();
    await this.props.getWhisperIdentityFromPassword('0x8bda3abeb454847b515fa9b404cede50b1cc63cfdeddd4999d074284b4c21e15');
    // TODO: Clear
    await this.createListener([topic1])
  }

  // Wrapper function for creating a new listener
  createListener = async topics => {
    // Convert ascii topics to hex
    const topicsHex = topics.map(t => util.fromAscii(t));
    console.log('topics hex:', topicsHex);
    // Create opts for subscribe function
    const opts = {
      topics: topicsHex,
      keyPairID: this.props.whisper.details.keyPairId,
    };

    // call shh.subscribe
    await this.props.createListener(opts);
  };

  render = () => (
    <div>
      <button onClick={this.doGetFilterMessages}> getFilterMessages </button>
      <button onClick={this.doRequestHistoricMessages}>
        requestHistoricMessages
        </button>
      <button onClick={this.doGetWhisperIdentityFromPassword}>
        doGetWhisperIdentityFromPassword
      </button>
    </div>
  );
}

Whisper.propTypes = {
  hash: PropTypes.string,
  whisper: PropTypes.object.isRequired,
};

export default Whisper;
