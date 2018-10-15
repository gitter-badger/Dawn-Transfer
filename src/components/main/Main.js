import React from 'react';
import PropTypes from 'prop-types';

// Components
import Decrypt from '../decrypt/Decrypt';
import Upload from '../upload/Upload';
import Table from '../table/Table';

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
            <Table />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
