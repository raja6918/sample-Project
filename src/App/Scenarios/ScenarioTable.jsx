import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MUIPaper from '@material-ui/core/Paper';

import ScenariosRowWithConnect from './ScenariosRow';

const Paper = styled(MUIPaper)`
  width: 100%;
  margin-top: 0;
  overflow: auto;
  -webkit-border-radius: 0 0 2px 2px;
  -moz-border-radius: 0 0 2px 2px;
  border-radius: 0 0 2px 2px;
`;
const Header = styled.h3`
  padding: 10px 16px;
  margin: 0;
  background-color: #fafafa;
  min-width: 200px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
`;
const Table = styled(MUITable)`
  table-layout: fixed;
  tbody tr {
    /* height: 40px; */
    border-bottom: 1px solid #cccccc;
    display: block;
  }
  tbody tr:hover {
    background-color: #e8f4fc;
  }
  tbody td {
    font-size: 0.8125rem;
    text-align: left;
    padding: 6px 1%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    border: none;
  }
  tbody td button {
    height: auto;
    width: auto;
  }
  tbody td:first-child {
    width: 8%;
    padding-right: 0;
    padding-left: 16px;
    overflow: visible;
  }
  tbody td:nth-child(2) {
    width: 36%;
    padding: 0 1% 0 0px;
  }
  tbody td:nth-child(3) {
    width: 20%;
  }
  tbody td:nth-child(4) {
    width: 19%;
  }
  tbody td:nth-child(5) {
    width: 12%;
  }
  tbody td:last-child {
    text-align: right;
    width: 4%;
    padding: 0;
  }
  tbody td:last-child span span {
    margin: 0;
  }
`;

class ScenariosTable extends Component {
  render() {
    const {
      scenarios,
      needHeader,
      scenarioHeader,
      scenariostofilter,
      id,
      style,
      t,
      ...props
    } = this.props;

    return (
      <div className="scenario-table" style={style ? style : null} id={id}>
        {scenarioHeader && needHeader && <Header>{scenarioHeader}</Header>}
        <Paper>
          <Table>
            <TableBody>
              {scenarios.map((scenario, i) => (
                <ScenariosRowWithConnect
                  scenariostofilter={scenariostofilter}
                  index={i}
                  key={i}
                  scenario={scenario}
                  t={t}
                  {...props}
                />
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

ScenariosTable.propTypes = {
  scenarios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      createdBy: PropTypes.string,
      creationTime: PropTypes.string,
      description: PropTypes.string,
      endDate: PropTypes.string,
      startDate: PropTypes.string,
      isOpenedBy: PropTypes.string,
      lastModifiedTime: PropTypes.string,
      lastOpenedByMe: PropTypes.string,
      status: PropTypes.string,
      templateId: PropTypes.string,
      templateName: PropTypes.string,
    })
  ).isRequired,
  needHeader: PropTypes.bool.isRequired,
  scenarioHeader: PropTypes.string.isRequired,
  scenariostofilter: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  style: PropTypes.shape({}).isRequired,
  t: PropTypes.func.isRequired,
};

export default ScenariosTable;
