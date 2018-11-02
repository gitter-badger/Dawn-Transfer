import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { Web3Provider } from 'react-web3';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Web3Provider>
    <App />,
  </Web3Provider>,
  document.getElementById('root')
);
registerServiceWorker();
