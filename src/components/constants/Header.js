import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import logo from '../../logo.svg';

// Redux

const Header = props => (
  <header className="App-header">
    <h1>Aurora</h1>
    <span className="public-key">
      Your Public Key: {props.whisper.details.publicKey}
    </span>
  </header>
);

const mapStateToProps = state => ({
  whisper: state.whisper,
});

export default connect(mapStateToProps)(Header);
