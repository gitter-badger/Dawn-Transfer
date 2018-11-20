const request = require('request');

const callWhisper = () => {
	const headers = {
		'Content-Type': 'application/json',
	};

	var dataString =
		'{"jsonrpc":"2.0","method":"shh_version","params":[],"id":1}';

	var options = {
		url: 'http://104.197.46.74:8545',
		method: 'POST',
		headers: headers,
		body: dataString,
	};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
		}
		if (error) {
			console.log(error)
			console.log(response)
		}
	}
    console.log("calling whisper")
	request(options, callback);
};

export default callWhisper;