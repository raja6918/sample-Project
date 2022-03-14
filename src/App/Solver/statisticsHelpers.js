import React from 'react';
import IconButton from '@material-ui/core/IconButton';

import Icon from '../../components/Icon';
import Autocomplete from '../../components/Autocomplete/AutoComplete';
import _ from 'lodash';

export const getDefaultStats = [
  'totalCost',
  'salaryCost',
  'hotelCost',
  'pairingOccurNb',
  'pairingPatternNb',
  'blockHoursDur',
  'dutyDayNb',
  'avgBlockPerDayDur',
  'dutyNb',
  'acChangeNb',
  'tafbDur',
];

export const getFilteredArray = (arrayToFilter, key, value) => {
  return arrayToFilter.filter(data => data[key] !== value);
};

export const showSelectorBox = () => {
  setTimeout(() => {
    const Menu = document.querySelector('.Select-menu-outer');
    if (Menu) {
      Menu.scrollIntoView();
    }
  }, 50);
};

export const buildHeaders = (variableHeader, that) => {
  const fixedHeader = [
    {
      id: 'statistics',
      name: that.props.t('SOLVER.tabStatistics.statistics'),
      fixed: 'left',
      minWidth: 250,
    },
    {
      id: 'total',
      name: that.props.t('SOLVER.tabStatistics.total'),
      fixed: 'left',
    },
  ];

  const settingsButton = [
    {
      id: 'delete',
      component: (
        <IconButton onClick={that.handleOpenColumns}>
          <Icon margin={'0'} iconcolor={'#0A75C2'}>
            settings
          </Icon>
        </IconButton>
      ),
      width: 80,
      minWidth: 80,
      fixed: 'right',
    },
  ];
  return fixedHeader.concat(variableHeader, settingsButton);
};

export const modifySuggestions = (
  selectedSuggestions,
  suggestions,
  value = null
) => {
  if (value)
    return suggestions.filter(
      suggestion =>
        !selectedSuggestions.includes(suggestion.value) ||
        suggestion.value === value
    );
  else
    return suggestions.filter(
      suggestion => !selectedSuggestions.includes(suggestion.value)
    );
};

export const formatData = (data, that, suggestions, selectedSuggestions) => {
  let formatedData = [];
  formatedData = data.map(data => {
    const nextId = data.id;
    return {
      ...data,
      statistics:
        nextId !== 0 ? (
          <Autocomplete
            id={`${nextId}`}
            name={`${nextId}`}
            suggestions={modifySuggestions(
              selectedSuggestions,
              suggestions,
              data.statistics.value
            )}
            onChange={v => that.handleChange(v, nextId)}
            defaultValue={data.statistics.value}
            value={data.statistics.value}
            onClick={() => that.handleClickSelector(nextId)}
            t={that.props.t}
          />
        ) : (
          <Autocomplete
            id="0"
            name="0"
            suggestions={modifySuggestions(selectedSuggestions, suggestions)}
            onChange={v => that.addNewRow(v)}
            defaultValue={''}
            onClick={() => that.handleClickSelector(0)}
            t={that.props.t}
          />
        ),
      delete:
        data.id !== 0 ? (
          <IconButton onClick={() => that.deleteRow(data.id)}>
            <Icon margin={'0'} iconcolor={'#0A75C2'}>
              delete
            </Icon>
          </IconButton>
        ) : (
          ''
        ),
    };
  });
  return formatedData;
};
export const basesAggregator = solvers => {
  let bases = [];
  for (let i = 0; i < solvers.length; i++) {
    bases = Array.isArray(solvers[i].bases)
      ? [...solvers[i].bases, ...bases]
      : [...bases];
  }

  return _.uniq(bases);
};
export const updateData = (
  //data can be taken from that
  rawData,
  crewBaseSelected,
  that,
  moveScroll: false,
  newSolvers = []
) => {
  const data = rawData || [];
  const solvers = newSolvers.length ? newSolvers : that.props.solvers;
  const newData = [];
  const BlankRow = data[data.length - 1];

  for (let i = 0; i < data.length - 1; i++) {
    const newRow = { ...data[i] };
    solvers.map(k => {
      if (k.data) {
        Object.keys(k.data).map(l => {
          if (
            that.props.t(`SOLVER.KpiParameters.${l}`) ===
            newRow.statistics.defaultValue
          ) {
            newRow[k.id] =
              k['data'][l] && k['data'][l][crewBaseSelected]
                ? k['data'][l][crewBaseSelected]
                : '--';
            return true;
          }
          return true;
        });
      }
      return true;
    });
    newData.push(newRow);
  }
  newData.push(BlankRow);
  if (moveScroll) {
    if (that.container) {
      that.container.scrollTo(that.container.scrollWidth, 0);
    }
  }
  return newData;
};

export const suggestionsAggregator = solvers => {
  let suggestions = [];
  solvers.map(sol => {
    const solKeys = sol && sol.data ? Object.keys(sol.data) : [];
    suggestions = [...suggestions, ...solKeys];
    return true;
  });
  return _.uniq(suggestions);
};
