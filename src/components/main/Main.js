import React from 'react';
import PropTypes from 'prop-types';

// Components
import UploadCard from '../upload/UploadCard';
import Table from '../table/Table';

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
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
