import React, { Component } from 'react';
import { Route } from 'react-router';
import HomeContainer from './layouts/home/HomeContainer';
import UploadContainer from './layouts/upload/UploadContainer';

// Styles
import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';
// IPFS
// import node from './util/ipfs.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" component={UploadContainer} />
        <Route path="home" component={HomeContainer} />
      </div>
    );
  }
}

export default App;
