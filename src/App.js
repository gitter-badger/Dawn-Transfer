import React, { Component } from 'react';

// Routes
import Routes from './routes'

// Redux
import { Provider } from 'react-redux';
import store from './state/store';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
          <div className="App">
            <Routes/>
          </div>
      </Provider>
    );
  }
}

export default App;
