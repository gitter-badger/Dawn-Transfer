import axios from 'axios';
import Web3 from 'web3';
import util from 'ethjs-util';
import isEmpty from '../../util/is-empty';
import {
  GET_WHISPER,
  SEND_WHISPER_MESSAGE,
  CREATE_LISTENER,
  RECEIVED_MESSAGE,
  SET_WHISPER_PROVIDER,
  SET_WHISPER,
  CREATE_MESSAGE_FILTER,
  UPDATE_WHISPER_IDENTITY,
} from '../../state/types';

// Whisper calls
import {
  getWhisperInfo,
  shhext_post,
  shhext_getNewFilterMessages,
  shhext_requestMessages,
} from '../../util/whispercalls';


const test = () => async dispatch => alert("test")

export const setWhisper = (wsProvider, httpProvider) => async dispatch => {
  let web3, provider;
  if (!isEmpty(wsProvider)) {
    web3 = new Web3(new Web3.providers.WebsocketProvider(wsProvider));
    provider = wsProvider;
  } else if (!isEmpty(httpProvider)) {
    web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
    provider = httpProvider;
  }
  dispatch(setWhisperProviderAction(provider));
  const shh = web3.shh;
  dispatch(setWhisperAction(shh));
  console.log('Set `shh` with provider:', provider);
};

export const getWhisper = shh => async dispatch => {
  try {
    console.log('Shh Current Provider', shh.currentProvider);
    console.log('Shh Given Provider:', shh.givenProvider);

    // Get node info
    const info = await shh.getInfo();
    // const isListening = await shh.net.isListening();
    // const peerCount = await shh.net.getPeerCount();
    // const netId = await shh.net.getId();

    // Get Identity
    const keyPairId = await shh.newKeyPair();
    const symKeyId = await shh.newSymKey();
    const publicKey = await shh.getPublicKey(keyPairId);
    const privateKey = await shh.getPrivateKey(keyPairId);
    const whisper = {
      info,
      // isListening,
      // peerCount,
      // netId,
      keyPairId,
      symKeyId,
      publicKey,
      privateKey,
    };
    console.log('New Whisper Peer Identity!');
    return dispatch(getWhisperAction(whisper));
  } catch (err) {
    console.log("Couldn't Get Whisper Details: ", err.message);
    return new Error(err.message);
  }
};

export const sendMessage = (opts, payload, shh) => async dispatch => {
  console.log('PAYLOAD 0:', payload);

  // shh
  //   .post(opts)
  //   .then(h => {
  //     console.log(`Message with hash ${h} was successfuly sent`);
  //     console.log('PAYLOAD:', payload);
  //     dispatch(sendMessageAction(payload));
  //   })
  //   .catch(err => console.log('Error: ', err));

  // shhext_post
  try {
    const response = await shhext_post(opts);
    const hash = JSON.parse(response).result;
    console.log(`Message with hash ${hash} was successfuly sent`);
    console.log('PAYLOAD:', payload);
    dispatch(sendMessageAction(payload));
  } catch (err) {
    console.log('Error in action sendMessage: ', err);
  }
};

export const createListener = opts => async (dispatch, getState) => {
  const { shh } = getState().whisper;

  console.log('Creating Listener with opts:', opts);

  // Generate new identity
  const { topics, keyPairID } = opts;

  // will receive also its own message send, below
  const subscription = await shh
    .subscribe('messages', {
      privateKeyID: keyPairID,
      topics,
    })
    .on('data', data => {
      const payload = JSON.parse(util.toAscii(data.payload));
      dispatch(receivedMessageAction(payload));
      console.log(`Hash Received! Hash: ${payload.hash}`);
      // this.notify(`Hash Received! Hash: ${payload.hash}`, 'info');
    });

  const newMessageFilter = await shh.newMessageFilter({
    privateKeyID: keyPairID,
    topics,
  });

  console.log('SUBSCRIPTION', subscription);
  console.log('MESSAGE FILTER', newMessageFilter);

  dispatch(createListenerAction(subscription));
  dispatch(createMessageFilterAction(newMessageFilter));

  // log
  console.log(
    'Created Listener! Listening for topics:',
    opts.topics.map(t => util.toAscii(t)),
  );
};

export const getFilterMessages = () => async (dispatch, getState) => {
  const { messageFilters, shh } = getState().whisper;

  // web3.getFilterMessages
  // const messages = await shh.getFilterMessages(messageFilters[0]);
  // messages.map(msg => {
  //   console.log('GETFILTERMESSAGES', util.toAscii(msg.payload));
  //   const payload = JSON.parse(util.toAscii(msg.payload));
  //   dispatch(receivedMessageAction(payload));
  // });

  // shhext_getNewFilterMessages

  try {
    messageFilters.forEach(async filter => {
      const response = await shhext_getNewFilterMessages(filter);
      const messages = JSON.parse(response).result;
      console.log('MESSAGES', messages);
      messages.map(msg => {
        console.log('GETFILTERMESSAGES', util.toAscii(msg.payload));
        const payload = JSON.parse(util.toAscii(msg.payload));
        dispatch(receivedMessageAction(payload));
      });
    });
  } catch (err) {
    console.log('Error in action getFilterMessages', err);
  }
};

export const requestHistoricMessages = opts => async (dispatch, getState) => {
  try {
    const response = await shhext_requestMessages(opts);
    console.log('requestHistoricMessages response', response);
    // const messages = JSON.parse(response).result
    // console.log("MESSAGES", messages)
    // messages.map(msg => {
    //   console.log('GETFILTERMESSAGES', util.toAscii(msg.payload));
    //   const payload = JSON.parse(util.toAscii(msg.payload));
    //   dispatch(receivedMessageAction(payload));
    // });
  } catch (err) {
    console.log('Error in action getFilterMessages', err);
  }
};

export const getWhisperIdentityFromPassword = password => async (
  dispatch,
  getState,
) => {
  const { shh } = getState().whisper;
  try {
    const symKeyId = await shh.generateSymKeyFromPassword(password);
    const hasSymKey = await shh.hasSymKey(symKeyId);
    let symKey, pubKey, privateKey;
    if (hasSymKey) {
      console.log('Has SymKey');
      symKey = await shh.getSymKey(symKeyId);
    }
    const keyPairId = await shh.addPrivateKey(password);
    pubKey = await shh.getPublicKey(keyPairId);
    privateKey = await shh.getPrivateKey(keyPairId);

    console.log(
      'SymKeyId:',
      symKeyId,
      '\npassword:',
      password,
      '\nsymKey:',
      symKey,
      '\nkeyPairId',
      keyPairId,
      '\npubKey:',
      pubKey,
      '\nprivateKey',
      privateKey,
    );
    // alert(`
    // Password: ${password} ;
    // SymKeyId: ${symKeyId} ;
    // SymKey: ${symKey} ;
    // keyPairId: ${keyPairId} ;
    // PubKey: ${pubKey} ;
    // PrivKey: ${privateKey} ;
    // `);

    const newIdentity = {
      symKeyId,
      symKey,
      keyPairId,
      pubKey,
      privateKey,
    };

    dispatch(updateWhisperIdentityAction(newIdentity));
  } catch (err) {
    console.log(err);
  }
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

const createMessageFilterAction = messageFilter => ({
  type: CREATE_MESSAGE_FILTER,
  payload: messageFilter,
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

const updateWhisperIdentityAction = details => ({
  type: UPDATE_WHISPER_IDENTITY,
  payload: details,
});
