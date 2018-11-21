const request = require('request');

const proxyurl = 'https://cors-anywhere.herokuapp.com/';
const url = 'http://104.197.46.74:8545';

const headers = {
	'Content-Type': 'application/json',
};

const callback = (error, response, body) => {
		if (!error && response.statusCode == 200) {
			console.log(body);
			return body
		}
		if (error) {
			console.log(error);
			console.log(response);
			throw new Error(error);
		}
	}

export const callWhisper = () => {
	const dataString =
		'{"jsonrpc":"2.0","method":"shh_version","params":[],"id":1}';

	const options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	console.log('calling whisper');
	request(options, callback);
};

export const getWhisperInfo = () => {
	const dataString =
		'{"jsonrpc":"2.0","method":"shh_info","params":[],"id":1}';

	const options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};
	console.log('getting Whisper info');
	request(options, callback);

};

// #### shhext_confirmMessagesProcessed
export const shhextConfirmMessagesProcessed = (params) => {
	const dataString =
		'{"jsonrpc":"2.0","method":"shhext_confirmMessagesProcessed","params":[],"id":1}';

	const options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	console.log('shhext_confirmMessagesProcessed');
	request(options, callback);
};

// #### shhext_post
export const shhext_post = (params) => {

	console.log("SSHEXT_POST PARAMS", params)

	const dataString =
		`{"jsonrpc":"2.0","method":"shhext_post","params":[${JSON.stringify(params)}],"id":1}`;

	const options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	console.log('shhext_post', dataString);


	request(options, callback);
};

// #### shhext_requestMessages
// TODO: what are the params here
export const shhext_requestMessages = (params) => {

	console.log("SSHEXT_REQUESTMESSAGES PARAMS", params)

	const dataString =
		`{"jsonrpc":"2.0","method":"shhext_requestMessages","params":[${JSON.stringify(params)}],"id":1}`;

	const options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	console.log('shhext_requestMessages', dataString);


	request(options, callback);
};

// #### shhext_getNewFilterMessages
export const shhext_getNewFilterMessages = (params) => {

	console.log("SSHEXT_GETNEWFILTER PARAMS", params)

	const dataString =
		`{"jsonrpc":"2.0","method":"shhext_getNewFilterMessages","params":[${JSON.stringify(params)}],"id":1}`;

	const options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	console.log('shhext_getNewFilterMessages', dataString);


	request(options, callback);
};
