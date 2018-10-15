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
          defaultPageSize={7}
          resizable={true}
          className="-striped -highlight -hover -bordered -responsive"
          style={{
            height: '400px' // This will force the table body to overflow and scroll, since there is not enough room
          }}
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
