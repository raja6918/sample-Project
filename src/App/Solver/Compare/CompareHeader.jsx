import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import './CompareHeader.css';

const Header = styled.div`
  margin-bottom: 2em;

  & h2 {
    margin: 0;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.87);
    font-weight: normal;
  }

  .right-wrapper {
    display: inline-flex;
    position: absolute;
    right: 0;
  }
  .right-wrapper > div {
    display: inline-block;
    vertical-align: bottom;
    margin-right: 1em;
  }
  & button {
    font-size: 13px;
    text-transform: capitalize;
    width: 100px;
    margin-left: 20px;
    align-self: center;
    top: 4px;
  }
  @media (max-width: 880px) {
    .right-wrapper {
      position: static;
      display: flex;
    }
  }
  @media (max-width: 709px) {
    & button {
      margin-left: 0;
    }
  }
  @media (max-width: 689px) {
    .right-wrapper {
      flex-flow: row wrap;
    }
    & button {
      top: 10px;
      margin-left: 0;
    }
  }
`;

const solver = 'SOLVER';

class CompareHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnValue: props.columnValue,
      kpiValue: props.kpiValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { columnValue, kpiValue } = nextProps;

    if (nextProps !== this.props) {
      this.setState({
        columnValue,
        kpiValue,
      });
    }
  }

  getDropDownColumns = t => {
    const { handleChangeColumn } = this.props;
    const { columnValue } = this.state;

    return (
      <FormControl>
        <Select
          style={{ width: '150px', margin: '1em 0 0' }}
          value={columnValue}
          onChange={handleChangeColumn}
          MenuProps={{
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          }}
          inputProps={{
            name: 'crewBaseSelected',
            id: 'crewBaseSelected',
          }}
        >
          <MenuItem value="total">
            {t(`${solver}.tabCompare.allCrewBases`)}
          </MenuItem>
          {this.getCrewBases()}
        </Select>
      </FormControl>
    );
  };

  getCrewBases() {
    const { crewbases } = this.props;
    let newBases = [];
    if (crewbases.length)
      newBases = crewbases.map(k => {
        return <MenuItem value={k}>{k}</MenuItem>;
      });
    return newBases;
  }
  // getDrodownKPI = t => {
  //   const { handleChangeKPI } = this.props;
  //   const { kpiValue } = this.state;

  //   return (
  //     <FormControl>
  //       <Select
  //         style={{ width: '150px', margin: '1em 0 0' }}
  //         value={kpiValue}
  //         onChange={handleChangeKPI}
  //         inputProps={{
  //           name: 'kpi',
  //           id: 'kpi-select',
  //         }}
  //       >
  //         <MenuItem value={5}>{t(`${solver}.tabCompare.defaultKPIs`)}</MenuItem>
  //         <MenuItem value={15}>{t(`${solver}.tabCompare.winterKPIs`)}</MenuItem>
  //         <MenuItem value={25}>{t(`${solver}.tabCompare.summerKPIs`)}</MenuItem>
  //         <MenuItem value={35}>{t(`${solver}.tabCompare.pilotNegos`)}</MenuItem>
  //       </Select>
  //     </FormControl>
  //   );
  // };

  render() {
    const { title, t } = this.props;

    return (
      <Header>
        <h2>{title}</h2>
        <div className="drops-wrapper">
          {this.getDropDownColumns(t)}
          {/* <div className="right-wrapper">
            {this.getDrodownKPI(t)}
            <Button variant="contained">{buttonLabel}</Button>
          </div> */}
        </div>
      </Header>
    );
  }
}

CompareHeader.propTypes = {
  title: PropTypes.string,
  handleChangeColumn: PropTypes.func.isRequired,
  columnValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  kpiValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  t: PropTypes.func.isRequired,
};

CompareHeader.defaultProps = {
  columnValue: '',
  kpiValue: '',
  title: '',
};

export default CompareHeader;
