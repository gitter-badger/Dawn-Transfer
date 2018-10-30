import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Components
import MainContainer from './components/main/MainContainer';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <MainContainer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
