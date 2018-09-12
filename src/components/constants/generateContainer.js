import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const generateContainer = (WrappedComponent1, WrappedComponent2) => {
  class MainContainer extends React.Component {
    render() {
      return (
        <div className="row">
          {/* Left Half of Page*/}
          <div className="split left">
            <div className="centered">
              <WrappedComponent1 />
            </div>
          </div>
          {/* Right Half of Page*/}
          <div className="split right">
            <div className="centered">
              <WrappedComponent2 />
            </div>
          </div>
        </div>
      );
    }
  }

  return MainContainer;
};

export default generateContainer;
