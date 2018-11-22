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
  CREATE_MESSAGE_FILTER
} from '../../state/types';

// Whisper calls 
import { getWhisperInfo, shhext_post } from "../../util/whispercalls"

import StatusJS from "status-js-api"


export const newStatus = () => async dispatch => {
	const status = new StatusJS;
	console.log("NEW STATUS", status)
}

export const connectStatus = (wsProvider, httpProvider) => async dispatch => {
	const status = new StatusJS;
	try {
		await status.connect(httpProvider)
		console.log("status.connect")
	} catch (err) {
		console.log("ERROR: ", err.message)
	}
}


export const setWhisper = (wsProvider, httpProvider) => async dispatch => {
  let status, provider;
  if (!isEmpty(wsProvider)) {
    status = new Web3(new Web3.providers.WebsocketProvider(wsProvider));
    provider = wsProvider;
  } else if (!isEmpty(httpProvider)) {
    status = new Web3(new Web3.providers.HttpProvider(httpProvider));
    provider = httpProvider;
  }
  dispatch(setWhisperProviderAction(provider));
  const shh = status.shh;
  dispatch(setWhisperAction(shh));
  console.log("Set `shh` with provider:",provider)

};



export const sendMessage = (opts, payload, shh) => dispatch => {
  console.log('PAYLOAD 0:', payload);

  // shh
  //   .post(opts)
  //   .then(h => {
  //     console.log(`Message with hash ${h} was successfuly sent`);
  //     console.log('PAYLOAD:', payload);
  //     dispatch(sendMessageAction(payload));
  //   })
  //   .catch(err => console.log('Error: ', err));

  shhext_post(opts);
};

export const createListener = (opts, shh) => async dispatch => {

  console.log("Creating Listener with opts:", opts)

  // Generate new identity
  const { topics, privateKeyID } = opts;

  // will receive also its own message send, below
  const subscription = await shh
    .subscribe('messages', {
      privateKeyID,
      topics,
    })
    .on('data', data => {
      const payload = JSON.parse(util.toAscii(data.payload));
      dispatch(receivedMessageAction(payload));
      console.log(`Hash Received! Hash: ${payload.hash}`);
      // this.notify(`Hash Received! Hash: ${payload.hash}`, 'info');
    });


  const newMessageFilter = await shh.newMessageFilter({
    privateKeyID,
    topics
  })

  console.log("SUBSCRIPTION", subscription);
  console.log("MESSAGE FILTER", newMessageFilter);


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
  const messages = await shh.getFilterMessages(messageFilters[0])
  messages.map(msg => {
    console.log("GETFILTERMESSAGES", util.toAscii(msg.payload))
    const payload = JSON.parse(util.toAscii(msg.payload));
    dispatch(receivedMessageAction(payload));
  });

}

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
