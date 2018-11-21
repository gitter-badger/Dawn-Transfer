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
	var dataString =
		'{"jsonrpc":"2.0","method":"shh_version","params":[],"id":1}';

	var options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	console.log('calling whisper');
	request(options, callback);
};

export const getWhisperInfo = () => {
	var dataString =
		'{"jsonrpc":"2.0","method":"shh_info","params":[],"id":1}';

	var options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	console.log('getting Whisper info');
	request(options, callback);

};


export const shhextConfirmMessagesProcessed = () => {
	var dataString =
		'{"jsonrpc":"2.0","method":"shhext_confirmMessagesProcessed","params":[],"id":1}';

	var options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	console.log('shhext_confirmMessagesProcessed');
	request(options, callback);
};

export const shhext_post = () => {
	var dataString =
		'{"jsonrpc":"2.0","method":"shhext_post","params":[],"id":1}';

	var options = {
		url: proxyurl + url,
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	console.log('shhext_post');


	request(options, callback);
};
