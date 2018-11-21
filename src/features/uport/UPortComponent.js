import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Connect } from 'uport-connect';
const uport = new Connect('Aurora-test', { network: 'rinkeby' });

uport.requestDisclosure({
  requested: ['name', 'country'],
  notifications: true,
});
uport.onResponse('disclosureReq').then(payload => {
  const address = payload.address;
});

class UPortLogin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button type={'button'} className={'app-button primary'}>
        Login with uPort
      </button>
    );
  }
}

export default UPortLogin;
