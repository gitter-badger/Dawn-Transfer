import { IPFS_GET_FILE, DECRYPT_FILE, DOWNLOAD_FILE } from '../../state/types';

import node from '../../util/ipfs';
import { decrypt } from '../../util/encrypt';
import fileDownload from 'js-file-download';

// store
import store from '../../state/store';

// Web3
import Web3 from 'web3';

//////////////////
// API Function calls

// Tries downloading and Decrypting the file given payload
export const connectMetamask = () => async dispatch => {
	if (typeof window.ethereum !== 'undefined') {
		try {
			await window.ethereum.enable();
			console.log('window.ethereum:', window.ethereum);
		} catch (err) {
			console.log(err);
		}
	}
};
export const signMetamaskLogin = () => async dispatch => {
	const web3 = store.getState().web3.web3Instance;
	const msg =
		'0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
	const accounts = await web3.eth.getAccounts();
	const from = accounts[0];

	if (!from) return connectMetamask();

	web3.currentProvider.sendAsync(
		{
			method: 'eth_signTypedData',
			params: [
				[
					{
						type: 'string',
						name: 'Message',
						value: 'DAWN',
					},
				],
				from,
			],
			from: from,
		},
		function(err, result) {
			if (err) return console.log(err);
			console.log(result.result);
		},
	);
};

// Encrypt File
const downloadFile = (decryptedBuffer, fileName) => {
	return fileDownload(decryptedBuffer, fileName);
};

//////////////////
// Action Creators
const decryptFileAction = (decryptedBuffer, fileName) => ({
	type: DECRYPT_FILE,
	payload: {
		decryptedBuffer,
		fileName,
	},
});

const ipfsGetFileAction = file => ({
	type: IPFS_GET_FILE,
	payload: file,
});

const downloadFileAction = () => ({
	type: DOWNLOAD_FILE,
});
