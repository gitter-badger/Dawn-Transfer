import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Connect } from 'uport-connect';
const uport = new Connect('Aurora-test', { network: 'rinkeby' });

class UPortLogin extends Component {
  constructor(props) {
    super(props);
    this.loginUPort = this.loginUPort.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  loginUPort() {
    uport.requestDisclosure({
      requested: ['name', 'country'],
      notifications: true,
    });

    uport.onResponse('disclosureReq').then(payload => {
      const address = payload.address;
    });
  }

  render() {
    return (
      <button
        type={'button'}
        className={'app-button primary'}
        onClick={this.loginUPort}
      >
        Login with uPort
      </button>
    );
  }
}

export default UPortLogin;
