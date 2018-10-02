import React from 'react';
import PropTypes from 'prop-types';

// Components
import Upload from '../upload/Upload';
import Decrypt from '../decrypt/Decrypt';

class Main extends React.Component {
  render() {
    return (
      <div className="row">
        {/* Left Half of Page*/}
        <div className="split left">
          <div className="centered">
            <Upload />
          </div>
        </div>
        {/* Right Half of Page*/}
        <div className="split right">
          <div className="centered">
            <Decrypt />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
