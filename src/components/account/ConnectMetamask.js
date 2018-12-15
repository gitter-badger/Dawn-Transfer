import React from 'react';
import PropTypes from 'prop-types';

import store from '../../state/store';

import { Web3Provider } from 'react-web3';
import Web3 from 'web3';

import ethUtil from 'ethereumjs-util';
// import sigUtil from 'eth-sig-util'
import Eth from 'ethjs';

window.Eth = Eth;

class ConnectMetamask extends React.Component {
	constructor(props) {
		super(props);
		this.onClickLoginButton = this.onClickLoginButton.bind(this);
		this.onClickSignButton = this.onClickSignButton.bind(this);
	}

	onClickLoginButton(e) {
		e.preventDefault();
		console.log('You clicked the Login Button! LOL!');
		this.connect();
	}

	onClickSignButton(e) {
		e.preventDefault();
		console.log('You clicked the Sign Button! LOL!');
		this.signMessage();
	}

	connect() {
		console.log('window.ethereum:', window.ethereum);
		if (typeof window.ethereum !== 'undefined') {
			window.ethereum
				.enable()
				.then(res => {
					console.log('window.ethereum:', window.ethereum);
				})
				.catch(console.error);
		}
	}

	async signMessage() {
		// Web3 hack
		// const newAccount = web3.eth.accounts[0] //WHy can't we use web3.eth.accounts

		const web3 = store.getState().web3.web3Instance;

		const msg =
			'0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
		// console.log("ETH", Object.keys(Eth), Eth.HttpProvider())
		const accounts = await web3.eth.getAccounts();
		const from = accounts[0];

		// console.log('from,', from, web3.utils.isAddress(from));

		if (!from) return this.connect();
		web3.currentProvider.sendAsync(
			{
				method: 'eth_signTypedData',
				params: [
					[
						{
							type: 'string',
							name: 'Message',
							value: 'Hi, Alice!',
						},
						{ type: 'uint32', name: 'A number', value: 1337 },
					],
					from,
				],
				from: from,
			},
			function(err, result) {
				if (err) return console.log(err)
				console.log(result.result);
			},
		);
	}

	render() {
		return (
			<div className="flex-vertical">
				<h3>Login with Metamask</h3>
				<button onClick={this.onClickLoginButton}>Connect</button>
				<button onClick={this.onClickSignButton}>Sign</button>
			</div>
		);
	}
}

export default ConnectMetamask;
