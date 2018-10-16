import React from 'react';
import PropTypes from 'prop-types';
import node from '../../util/ipfs';

// Redux
import { connect } from 'react-redux';
import { decryptFile } from '../../actions/downloadActions';

// Dependancy
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// File Downloads
import fileDownload from 'js-file-download';

const key = 'SECRET_KEY',
  iv = '9De0DgMTCDFGNokdEEial'; // You must dynamically create

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  handleDownloadClick = async msg => {
    console.log('MSG', msg);
    const { hash, path, iv, note } = msg;
    console.log('HASH', hash);
    console.log('path', path);
    console.log('iv', iv);
    console.log('note', note);

    await this._downloadAndDecryptFile(hash, path, key, iv);
  };

  _downloadAndDecryptFile = async (hash, fileName, key, iv) => {
    console.log('HASH TWO', hash);
    console.log('PATH TWO', fileName);
    console.log('Key TWO', key);
    console.log('IV TWO', iv);
    try {
      const res = await this._getData(hash);
      this.setState({ contentLoaded: true, res });
      const file = res[0].content;

      // Decrypt File
      await this.props.decryptFile(file, iv, fileName);

      // Trigger file download
      const { decryptedBuffer, filename } = this.props.download.decrypted;
      this._downloadFile(decryptedBuffer, fileName);
    } catch (err) {
      console.log(err.message);
    }
  };

  _downloadFile = (data, fileName) => {
    fileDownload(data, fileName);
  };

  _getData = async hash => {
    const files = await node.files.get(hash);
    // const url = `https://ipfs.io/ipfs/${hash}`;
    // console.log('Getting data from:', url);
    const res = files.map(file => {
      const { content, name, path } = file;
      return { content, name, path };
    });
    // console.log('res:', res);
    return res;
  };

  render() {
    const { events } = this.props.events;
    console.log(events);

    const columns = [
      {
        Header: 'Received/Sent',
        accessor: 'type'
      },
      {
        Header: 'File Name',
        accessor: 'payload.path'
      },
      {
        Header: 'IPFS Hash',
        accessor: 'payload.hash',
        maxWidth: 700
      },
      {
        Header: 'Download',
        accessor: 'payload',
        Cell: row => {
          console.log('ROW', row);
          return (
            <span>
              <button onClick={() => this.handleDownloadClick(row.value)}>
                Download
              </button>
            </span>
          );
        }
      },
      {
        Header: 'Message',
        accessor: 'payload.note'
      }
    ];

    return (
      <div className="message-table">
        <ReactTable
          data={events}
          columns={columns}
          defaultPageSize={20}
          resizable={false}
          style={{
            height: '400px' // This will force the table body to overflow and scroll, since there is not enough room
          }}
        />
      </div>
    );
  }
}

Table.propTypes = {
  decryptFile: PropTypes.func.isRequired,
  download: PropTypes.object.isRequired,
  whisper: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  events: state.events,
  download: state.download
});

export default connect(
  mapStateToProps,
  { decryptFile }
)(Table);
