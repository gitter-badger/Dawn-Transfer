import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Components
import Header from './components/constants/Header';
import Upload from './components/upload/Upload';
import Decrypt from './components/decrypt/Decrypt';
import Main from './components/main/Main';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header />
            <Main />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
