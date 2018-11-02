import axios from 'axios';

import Web3 from 'web3';
import util from 'ethjs-util';
import {
  GET_WHISPER,
  SEND_WHISPER_MESSAGE,
  CREATE_LISTENER,
  RECEIVED_MESSAGE,
  SET_WHISPER_PROVIDER,
  SET_WHISPER,
} from './types';

export const setWhisper = wsProvider => async dispatch => {
  dispatch(setWhisperProviderAction(wsProvider));
  const web3 = new Web3(new Web3.providers.WebsocketProvider(wsProvider));
  const shh = web3.shh;
  dispatch(setWhisperAction(shh));
};

export const getWhisper = shh => async dispatch => {
  console.log('Shh Current Provider', shh.currentProvider);
  console.log('Shh Given Provider:', shh.givenProvider);

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
  const whisper = {
    info,
    isListening,
    peerCount,
    netId,
    keyPairId,
    symKeyId,
    publicKey,
    privateKey,
  };
  return dispatch(getWhisperAction(whisper));
};

export const sendMessage = (opts, payload, shh) => dispatch => {
  console.log('PAYLOAD 0:', payload);

  shh
    .post(opts)
    .then(h => {
      console.log(`Message with hash ${h} was successfuly sent`);
      console.log('PAYLOAD:', payload);
      dispatch(sendMessageAction(payload));
    })
    .catch(err => console.log('Error: ', err));
};

export const createListener = (opts, shh) => dispatch => {
  // Generate new identity
  const topics = opts.topics;
  // will receive also its own message send, below
  const subscription = shh
    .subscribe('messages', {
      // symKeyID: this.state.whisper.symKeyId, //symKeyId
      privateKeyID: opts.privateKeyID,
      topics,
    })
    .on('data', data => {
      const payload = JSON.parse(util.toAscii(data.payload));
      dispatch(receivedMessageAction(payload));
      console.log(`Hash Received! Hash: ${payload.hash}`);
      // this.notify(`Hash Received! Hash: ${payload.hash}`, 'info');
    });
  dispatch(createListenerAction(subscription));
  // log
  console.log(
    'Created Listener! Listening for topics:',
    opts.topics.map(t => util.toAscii(t)),
  );
};

const sendMessageAction = payload => ({
  type: SEND_WHISPER_MESSAGE,
  payload,
});

const receivedMessageAction = payload => ({
  type: RECEIVED_MESSAGE,
  payload,
});

const createListenerAction = subscription => ({
  type: CREATE_LISTENER,
  payload: subscription,
});

const setWhisperProviderAction = wsProvider => ({
  type: SET_WHISPER_PROVIDER,
  payload: wsProvider,
});

const setWhisperAction = shh => ({
  type: SET_WHISPER,
  payload: shh,
});

const getWhisperAction = whisper => ({
  type: GET_WHISPER,
  payload: whisper,
});
