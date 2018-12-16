import React from 'react';
import PropTypes from 'prop-types';

import { Web3Provider } from 'react-web3';

class ConnectMetamask extends React.Component {
	constructor(props) {
		super(props);
		this.onClickLoginButton = this.onClickLoginButton.bind(this);
		this.onClickSignButton = this.onClickSignButton.bind(this);
	}

	onClickLoginButton(e) {
		e.preventDefault();
		console.log('You clicked the Login Button! LOL!');
		this.props.connectMetamask();
	}

	onClickSignButton(e) {
		e.preventDefault();
		console.log('You clicked the Sign Button! LOL!');
		this.props.signMetamaskLogin();
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
