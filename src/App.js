import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Redux
// import { Provider } from 'react-redux';

// Components
import Header from './components/constants/Header';
import Upload from './components/upload/Upload';
import Decrypt from './components/decrypt/Decrypt';
import generateContainer from './components/constants/generateContainer';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Upload />
          <Decrypt />
        </div>
      </Router>
    );
  }
}

export default App;
