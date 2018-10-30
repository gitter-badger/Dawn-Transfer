import React from 'react';
import PropTypes from 'prop-types';

import logo from '../../logo.svg';

// Redux
import { connect } from 'react-redux';

const Header = props => {
	return (
		<header className="App-header">
			<h1>Aurora</h1>
			<span className="public-key">
				Your Public Key: {props.whisper.details.publicKey}
			</span>
		</header>
	);
};

const mapStateToProps = state => ({
	whisper: state.whisper
});

export default connect(mapStateToProps)(Header);
