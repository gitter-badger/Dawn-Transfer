import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';

// Redux
import { Provider } from 'react-redux';
import store from './state/store';

// Components
import HomePage from './features/homepage';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <HomePage />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
