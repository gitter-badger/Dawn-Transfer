import React from 'react';
import PropTypes from 'prop-types';

// Components
import UploadCard from '../upload';
import TableContainer from '../download';
import Header from '../../components/header/Header';
import Navbar from '../../components/navbar/Navbar';

// Metamask 
import ConnectMetamask from '../../components/account/ConnectMetamask';

// Whisper
import Whisper from '../whisper';

class HomepageContainer extends React.Component {
  render() {
    return (
      <div className="main-container">
        <div className="flex-vertical">
          {/* Vertical Flex - for Header, Content */}
          <Header />
          <div className="flex-horizontal">
            {/* Horizontal Flex - for Transfer, Messages */}

            {/* Left Half of Page */}
            <div className="container element transfer">
              <UploadCard />
              <ConnectMetamask />
            </div>

            {/* Right Half of Page */}
            <div className="container element messages">
              <TableContainer />
              <Whisper />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomepageContainer;
