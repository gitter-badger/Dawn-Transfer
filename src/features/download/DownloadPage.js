import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import isEmpty from "../../util/is-empty"
import isIpfs from "is-ipfs"

import Header from '../../components/header/Header';

class DownloadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: "",
      dek: "",
      path: "",
      msg: ""
    }
  }

  async componentDidMount() {
    // console.log('QUERY', this.props.location.search);
    const params = new URLSearchParams(this.props.location.search);
    const hash = params.get('hash');
    const iv = params.get('iv');
    const path = params.get('path');
    const msg = params.get('msg');

    const query = {
      hash,
      iv,
      path,
      msg,
    };
    console.log("QUERY", query);

    if (this._validateImmediateDownloadQuery(query)) {
      console.log("Downloading query")
      await this.props.downloadAndDecryptFile(hash, path)
    } else {
      console.log("Cannot immediately dl query")
      this.setState({
        hash, iv, path, msg
      })
    }
  }

  _validateImmediateDownloadQuery(query) {
    const { hash, iv, path } = query;
    // If we can grab the valid hash and the decryption key and the filename(path)
    if (!isEmpty(hash) && isIpfs.multihash(hash) && !isEmpty(iv) && !isEmpty(path)) {
      return true
    }
    return false;

  }

  render() {
    return (
      <div className="main-container">
        <div className="flex-vertical">
          {/* Vertical Flex - for Header, Content */}
          <Header />
          <div className="flex-horizontal">
            {/* Horizontal Flex - for Transfer, Messages */}

            {/* Left Half of Page */}
            <div className="container element ">
              <h1>download</h1>
              <p>Hash: {this.state.hash} </p>
              <p>DEK: {this.state.dek} </p>
              <p>Path: {this.state.path} </p>
              <p>Message: {this.state.msg} </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DownloadPage;
