import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { decryptFile } from '../../actions/downloadActions';

// Dependancy
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class Table extends React.Component {
  render() {
    const { events } = this.props.events;
    console.log(events);

    const columns = [
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
        Header: 'Received/Sent',
        accessor: 'type'
      },
      {
        Header: 'Download',
        accessor: 'payload.hash'
      }
    ];

    return (
      <div className="message-table">
        <ReactTable
          data={events}
          columns={columns}
          defaultPageSize={5}
          resizable={true}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events
});

export default connect(
  mapStateToProps,
  { decryptFile }
)(Table);
