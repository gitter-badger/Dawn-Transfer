import React from 'react';
import PropTypes from 'prop-types';

// Components
import UploadCard from '../upload/UploadCard';
import Header from '../constants/Header';
import Navbar from '../constants/Navbar';
import Table from '../table/Table';

// Whisper
import Whisper from '../whisper/Whisper';

class Main extends React.Component {
  render() {
    return (
      <div className="main-container">
        <div className="flex-vertical">
          {/* Vertical Flex - for Header, Content */}
          <Header />

          <div className="flex-horizontal">
            {/* Horizontal Flex - for Transfer, Messages */}

            {/* Left Half of Page*/}
            <div className="container element transfer">
              <UploadCard />
            </div>

            {/* Right Half of Page*/}
            <div className="container element messages">
              <Table />
              <Whisper />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
