import React, { Component } from 'react';
import ReactTable from 'react-table-v6';
import withFixedColumns from './react-table-hoc-fixed-columns';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import 'react-table-v6/react-table.css';
import './react-table-hoc-fixed-columns/lib/styles.css';
import './FixedColumnTable.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { perfectScrollConfig, scrollSyncXRT } from '../../utils/common';

const WithScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Scrollbar = styled.div`
  width: 1%;
  min-width: 18px;
  overflow: auto;
  max-height: 100%;
`;

const ReactTableFixedColumn = withFixedColumns(ReactTable);

/**
 * This table provides the Sticky Headers and Fixed Columns functionalities
 * by using react-table-v6 along with react-table-hoc-fixed-columns HOC.
 */
class FixedColumnTable extends Component {
  state = { selectedRowIndex: 0, headers: [] };
  tableElement = null;
  tableBodyElement = null;
  scrollElement = null;
  isIE = window.document.documentMode; // IE 6-11

  componentDidMount() {
    this.setState({ headers: this.buildHeaders(this.props.headers) });
    window.addEventListener('resize', () => {
      setTimeout(() => {
        if (this._scrollRefX) this._scrollRefX.scrollLeft = 0;
      }, 100);
    });

    if (this.isIE) {
      this.tableElement = document.querySelector('.rt-table');
      this.tableBodyElement = document.querySelector('.rt-tbody');
      this.scrollElement = document.querySelector('#scrollbar');
      window.addEventListener('resize', this.scrollToRight);
      this.scrollElement.addEventListener('scroll', this.onScrollSB);
      this.tableBodyElement.addEventListener('scroll', this.onScrollTB);
      this.scrollToRight();
    }
  }

  componentDidUpdate() {
    if (this.isIE) {
      this.tableElement.scrollTop = 0;
      this.scrollToRight();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.headers !== nextProps.headers)
      this.setState({ headers: this.buildHeaders(nextProps.headers) });
  }

  /* Builds the customized table headers*/
  buildHeaders = headers => {
    return headers.map((header, index) => {
      return {
        ...header,
        Header: header.name || header.component,
        accessor: header.id.toString(),
        headerClassName: 'table-cell table-header',
        className: 'table-cell table-data',
        Cell: row => (
          <span
            title={[0, headers.length - 1].includes(index) ? '' : row.value}
          >
            {row.value}
          </span>
        ),
      };
    });
  };

  /* Get the current row and change the style so as to display the dropdown*/
  getRowSetStyle = (state, rowInfo) => {
    return rowInfo
      ? {
          onFocus: () => {
            this.setState({
              selectedRowIndex: rowInfo.viewIndex,
            });
          },
          style: {
            zIndex: rowInfo.viewIndex === this.state.selectedRowIndex ? 3 : 2,
          },
        }
      : {};
  };

  /* For fixing IE issue */
  scrollToRight = () => {
    this.tableElement.scrollLeft += 1;
  };

  /* For scroll sync */
  onScrollSB = () => {
    this.tableBodyElement.scrollTop = this.scrollElement.scrollTop;
  };

  /* For scroll sync */
  onScrollTB = () => {
    this.scrollElement.scrollTop = this.tableBodyElement.scrollTop;
  };

  /* Get the main JSX content */
  getJSX = () => {
    const { data } = this.props;
    const height = (data.length + 1) * 48; //48px is the height of a row
    return (
      <PerfectScrollbar
        option={perfectScrollConfig}
        containerRef={ref => {
          this._scrollRefX = ref;
        }}
        onXReachEnd={() => scrollSyncXRT(this._scrollRefX)}
      >
        <ReactTableFixedColumn
          minRows={data.length + 1}
          defaultPageSize={50}
          className="table"
          data={data}
          columns={this.state.headers}
          showPagination={false}
          resizable={false}
          sortable={false}
          getTrProps={this.getRowSetStyle}
          style={{ height }}
        />
      </PerfectScrollbar>
    );
  };

  /* Used to create a component with a scroll bar. This is to fix the IE issue where 
     the scroll bar was not attached to body */
  getJSXIE = () => {
    const height = (this.props.data.length + 2) * 48;
    return (
      <WithScrollContainer id="fct-container" className="fct-container">
        {this.getJSX()}
        <Scrollbar id="scrollbar" style={{ height }}>
          <section id="sectionScroll" style={{ height }} />
        </Scrollbar>
      </WithScrollContainer>
    );
  };

  render() {
    return this.isIE ? this.getJSXIE() : this.getJSX();
  }
}

FixedColumnTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default FixedColumnTable;
