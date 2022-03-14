import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const textOverflowStyle = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StickyTableContainer = styled.div`
  overflow: auto;
  height: 100%;
`;

const Table = styled.div`
  white-space: nowrap;
  top: -15px;
  font-size: 0;
  position: relative;
  display: inline-block;

  .text-cutter {
    ${textOverflowStyle};
  }

  .col {
    min-width: 100px;
    width: 100px;
    display: inline-block;
  }
  .column {
    min-width: 100px;
    width: 100%;
    position: relative;
  }
  .column.sticky-left,
  .column.sticky-right {
    position: absolute;
    top: 0;
    z-index: 2;
  }
  .col.right:last-child,
  .col.right:last-child .column.sticky-right,
  .col.right:last-child .column.sticky-right .cells-wrapper .cell,
  .col.right:last-child .column.sticky-right .header.cell {
    max-width: 80px;
    width: 80px;
    min-width: 80px;
  }
  .column > .cells-wrapper {
    margin-top: 48px;
    position: absolute;
    width: 100%;
  }

  .cell {
    width: 100%;
    padding: 0 12px;
    text-align: left;
    border-bottom: 1px solid #cccccc;
    vertical-align: inherit;
    color: rgba(0, 0, 0, 0.87);
    font-size: 14px;
    font-weight: 400;
    background: #ffffff;
    height: 48px;
    line-height: 48px;
  }
  .header {
    background: #e0e0e0;
    color: rgba(0, 0, 0, 0.87);
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    border-bottom: 1px solid #cccccc;
    border-top: 1px solid #cccccc;
    ${textOverflowStyle};
  }
  .col:first-child .column .cell {
    border-left: 1px solid #cccccc;
  }
  .col:last-child .column .cell {
    border-right: 1px solid #cccccc;
    text-align: right;
  }
  .column.sticky-left .header.cell.sticky,
  .column.sticky-right .header.cell.sticky {
    z-index: 2;
  }
  .header.cell.sticky {
    position: absolute;
    width: 100%;
    z-index: 1;
  }
`;

class StickyTable extends Component {
  state = {
    headers: this.props.headers,
  };

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        headers: nextProps.headers,
      },
      this.handleResize()
    );
  }

  container = null;

  componentDidMount() {
    this.container = document.getElementById('container');
    if (this.container) {
      this.container.addEventListener('scroll', this.handleScrollTable);
      this.setState(
        {
          headers: this.props.headers,
        },
        () => {
          this.handleResize();
        }
      );
    }

    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.headers.length !== prevProps.headers.length)
      this.handleResize();
  }

  componentWillUnmount() {
    this.container.removeEventListener('scroll', this.handleScrollTable);
    window.removeEventListener('resize', this.handleResize);
  }

  handleScrollTable = () => {
    const table = this.container;

    const headerStickyBothArrLeft = document.querySelectorAll(
      '.header.cell.sticky.both-left'
    );
    const headerStickyBothArrRight = document.querySelectorAll(
      '.header.cell.sticky.both-right'
    );

    const headersStickyArr = document.querySelectorAll('.header.cell.sticky');

    const columnStickyLeft = document.querySelectorAll(
      '.column.sticky-left > .cells-wrapper'
    );

    const columnStickyRight = document.querySelectorAll(
      '.column.sticky-right > .cells-wrapper'
    );

    for (let i = 0; i < headersStickyArr.length; i++) {
      headersStickyArr[i].style.top = table.scrollTop + 'px';
    }

    for (let i = 0; i < headerStickyBothArrLeft.length; i++) {
      headerStickyBothArrLeft[i].style.left = table.scrollLeft + 'px';
      columnStickyLeft[i].style.marginLeft = table.scrollLeft + 'px';
    }

    for (let i = 0; i < headerStickyBothArrRight.length; i++) {
      headerStickyBothArrRight[i].style.right =
        table.scrollWidth - table.clientWidth - table.scrollLeft + 'px';
      columnStickyRight[i].style.right =
        table.scrollWidth - table.clientWidth - table.scrollLeft + 'px';
    }
  };

  handleResize = () => {
    const container = this.container;
    if (container) {
      const table = document.querySelector('.table');
      const cols = document.querySelectorAll('.col');
      const leftColumns = document.querySelectorAll('.column.sticky-left');
      const rightColumns = document.querySelectorAll('.column.sticky-right');

      for (let i = 0; i < cols.length - 1; i++) {
        cols[i].style.width = '100px';
      }
      for (let i = 0; i < leftColumns.length; i++) {
        leftColumns[i].style.width = '100px';
      }
      for (let i = 0; i < rightColumns.length - 1; i++) {
        rightColumns[i].style.width = '100px';
      }

      const rest = container.clientWidth - table.clientWidth;

      for (let i = 0; i < cols.length - 1; i++) {
        cols[i].style.width =
          cols[i].clientWidth + rest / (cols.length - 1) + 'px';
      }

      for (let i = 0; i < leftColumns.length; i++) {
        leftColumns[i].style.width =
          leftColumns[i].clientWidth + rest / (cols.length - 1) + 'px';
      }

      for (let i = 0; i < rightColumns.length - 1; i++) {
        rightColumns[i].style.width =
          rightColumns[i].clientWidth + rest / (cols.length - 1) + 'px';
      }

      this.handleScrollTable();
    }
  };

  displayObject = obj => {
    if (obj.name) return obj.name;
    else if (obj.component) return obj.component;
    else return '';
  };

  displayLeftColumns = () => {
    const { stickyLeft, data } = this.props;
    const { headers } = this.state;

    const LeftColumns = [];
    for (let i = 0; i < stickyLeft; i++) {
      const classes = i > 0 ? 'cell text-cutter' : 'cell';
      LeftColumns.push(
        <div key={i} className="col left">
          <div className="column sticky-left">
            <div className="header cell sticky both-left">
              {this.displayObject(headers[i])}
            </div>
            <div className="cells-wrapper">
              {data.map((data, key) => {
                return (
                  <div
                    title={i > 0 ? data[headers[i].id] : ''}
                    key={key}
                    className={classes}
                  >
                    {data[headers[i].id]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    return <React.Fragment>{LeftColumns}</React.Fragment>;
  };

  displayRightColumns = () => {
    const { stickyRight, data } = this.props;
    const { headers } = this.state;
    const start = headers.length - stickyRight;

    const RightColumns = [];
    for (let i = start; i < headers.length; i++) {
      RightColumns.push(
        <div key={i} className="col right">
          <div className="column sticky-right">
            <div className="header cell sticky both-right">
              {this.displayObject(headers[i])}
            </div>
            <div className="cells-wrapper">
              {data.map((data, key) => {
                return (
                  <div key={key} className="cell">
                    {data[headers[i].id]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    return <React.Fragment>{RightColumns}</React.Fragment>;
  };

  displayColumns = () => {
    const { stickyRight, stickyLeft, data } = this.props;
    const { headers } = this.state;
    const end = headers.length - stickyRight;

    const columns = [];
    for (let i = stickyLeft; i < end; i++) {
      columns.push(
        <div key={i} className="col">
          <div className="column">
            <div className="header cell sticky">
              {this.displayObject(headers[i])}
            </div>
            <div className="cells-wrapper">
              {data.map((data, key) => {
                return (
                  <div
                    title={data[headers[i].id]}
                    key={key}
                    className="cell text-cutter"
                  >
                    {data[headers[i].id]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    return <React.Fragment>{columns}</React.Fragment>;
  };

  render() {
    return (
      <StickyTableContainer id="container" className="container">
        <Table className="table">
          {this.displayLeftColumns()}
          {this.displayColumns()}
          {this.displayRightColumns()}
        </Table>
      </StickyTableContainer>
    );
  }
}

StickyTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  stickyLeft: PropTypes.number,
  stickyRight: PropTypes.number,
};

StickyTable.defaultProps = {
  stickyLeft: 0,
  stickyRight: 0,
};
export default StickyTable;
