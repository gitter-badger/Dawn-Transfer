import React from 'react';
import PropTypes from 'prop-types';

// Components
import UploadCard from '../upload/UploadCard';
import Table from '../table/Table';

// Whisper
import Whisper from '../whisper/Whisper';

class Main extends React.Component {
  render() {
    return (
      <div className="row">
        {/* Left Half of Page*/}
        <div className="split left">
          <div className="centered">
            <UploadCard />
          </div>
        </div>
        {/* Right Half of Page*/}
        <div className="split right">
          <div className="centered">
            <Table />
            <Whisper />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
