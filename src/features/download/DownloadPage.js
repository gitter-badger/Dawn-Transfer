import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import isEmpty from '../../util/is-empty';
import isIpfs from 'is-ipfs';

import Header from '../../components/header/Header';

class DownloadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: '',
      iv: '',
      path: '',
      msg: '',
    };
    this.submitDownloadForm = this.submitDownloadForm.bind(this);
    this._onTextChange = this._onTextChange.bind(this);
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
    console.log('QUERY', query);
    await this._makeDownloadQuery(query);
  }

  _validateImmediateDownloadQuery(query) {
    const { hash, iv, path } = query;
    // If we can grab the valid hash and the decryption key and the filename(path)
    if (
      !isEmpty(hash) &&
      isIpfs.multihash(hash) &&
      !isEmpty(iv) &&
      !isEmpty(path)
    ) {
      return true;
    }
    return false;
  }

  submitDownloadForm(e) {
    e.preventDefault();
    const { hash, iv, path } = this.state;
    const query = {
      hash,
      iv,
      path,
    };
    this._makeDownloadQuery(query);
  }

  async _makeDownloadQuery(query) {

    const { hash, iv, path, msg } = query; 

    if (this._validateImmediateDownloadQuery(query)) {
      console.log('Downloading query');
      await this.props.downloadAndDecryptFile(hash, path);
    } else {
      alert('Cannot Download query');
      this.setState({
        hash,
        iv,
        path,
        msg,
      });
    }
  }

  _onTextChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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
              <form onSubmit={this.submitDownloadForm}>
                <div className="app-form-item">
                  <label htmlFor={'hash'}>Hash(encrypted)</label>
                  <input
                    onChange={this._onTextChange}
                    value={this.state.hash}
                    name={'hash'}
                    placeholder={'HASH'}
                    type={'text'}
                    id={'hash'}
                  />
                </div>
                <div className={'app-form-item'}>
                  <label htmlFor={'iv'}>Decryption Key(iv)</label>
                  <textarea
                    value={this.state.iv}
                    onChange={this._onTextChange}
                    placeholder={'Decryption Key (IV)'}
                    id={'iv'}
                    name={'iv'}
                  />
                </div>
                                <div className={'app-form-item'}>
                  <label htmlFor={'path'}>File Name (path):</label>
                  <textarea
                    value={this.state.path}
                    onChange={this._onTextChange}
                    placeholder={'File Name (path)'}
                    id={'path'}
                    name={'path'}
                  />
                </div>
                <div className={'app-form-actions'}>
                  <button type={'submit'} className={'app-button primary'}>
                    Send to Peer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DownloadPage;
