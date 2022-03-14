import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ModelSelector from './ModelSelector';
import * as positionsService from '../services/Data/positions';
import * as crewGroupService from '../services/Data/crewGroups';

const crewComplementRange = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
];
const mixedPositionValue = '-1';

const Container = styled.div`
  width: 100%;
  position: relative;
  & > div {
    margin-bottom: 30px;
  }
  & > div:last-child {
    margin-bottom: 0;
  }
`;
const Content = styled.div`
  width: 100%;
  position: relative;
`;
const Title = styled.p`
  margin-bottom: 0;
  font-size: 12px;
`;
const Item = styled.div`
  width: 20%;
  position: relative;
  display: inline-block;
  padding: 0 10px;
  margin: 12px 0 0;
  & label,
  & p {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    max-width: 100%;
    white-space: nowrap;
  }
  & label {
    line-height: 30px;
  }
`;

class StandardCrewComplement extends Component {
  state = {
    positions: [],
    counters: [],
    valueCodes: [],
    crewComposition: [],
    associatedPositionCodes: [],
  };

  getQuantity = positionCode => {
    let quantity = null;
    const { showOnlyAssociatedCGPositions, defaultValues } = this.props;
    let crewComposition = null;

    if (!showOnlyAssociatedCGPositions) {
      crewComposition = defaultValues || [];
    } else if (
      showOnlyAssociatedCGPositions &&
      Array.isArray(defaultValues) &&
      defaultValues.length === 1
    ) {
      crewComposition = defaultValues[0].crewComposition;
    }

    if (crewComposition) {
      const position = crewComposition.find(
        position => position.positionCode === positionCode
      );

      quantity = position ? position.quantity : 0;
      return quantity;
    }

    // for mixed pairings
    for (const el of defaultValues) {
      const selectedComposition = el.crewComposition.find(
        position => position.positionCode === positionCode
      );

      if (selectedComposition) {
        if (quantity == null) {
          quantity = selectedComposition.quantity;
        } else {
          if (selectedComposition.quantity !== quantity) {
            quantity = -1;
            break;
          }
        }
      } else {
        quantity = 0;
      }
    }
    return quantity;
  };

  createStates = (positionsCategorized, associatedPositionCodes = []) => {
    const { initialAssociatedPositionsValue } = this.props;
    const { counters, valueCodes, crewComposition } = this.state;
    positionsCategorized.forEach(positionCategory => {
      const { positionTypeCode } = positionCategory;
      let counterTotal = 0;
      valueCodes[positionTypeCode] = positionCategory.positions.map(
        position => {
          let quantity = this.getQuantity(position.code);
          // If we want to set the initial value of associated positions when modal open for 1st time
          if (
            associatedPositionCodes.includes(position.code) &&
            initialAssociatedPositionsValue
          ) {
            quantity = initialAssociatedPositionsValue;
          }

          const positionBody = {
            positionCode: position.code,
            quantity: quantity,
          };
          counterTotal =
            counterTotal === '--' || quantity === -1
              ? '--'
              : counterTotal + quantity;
          crewComposition.push(positionBody);
          return positionBody;
        }
      );
      counters[positionTypeCode] = counterTotal;
    });
    if (initialAssociatedPositionsValue) {
      this.props.onChange(crewComposition, counters);
    } else {
      this.props.onChange(crewComposition);
    }
  };

  componentDidMount() {
    const { openItemId, currentCrewGroupId } = this.props;
    const getPositions = positionsService.getCategories(this.props.openItemId);
    const getCurrentCGPositionCodes = currentCrewGroupId
      ? crewGroupService.getCrewGroup(currentCrewGroupId, openItemId)
      : {};

    Promise.all([getPositions, getCurrentCGPositionCodes])
      .then(([positions, crewGroup]) => {
        const associatedPositionCodes =
          currentCrewGroupId && crewGroup ? crewGroup.positionCodes : [];
        this.setState(
          {
            positions,
            associatedPositionCodes,
          },
          this.createStates(positions, associatedPositionCodes)
        );
      })
      .catch(err => {
        console.error(err);
      });
  }

  getCounterValue = valueCodeTarget => {
    let total = 0;
    valueCodeTarget.forEach(item => {
      total =
        total === '--' || item.quantity === -1 ? '--' : total + item.quantity;
    });
    return total;
  };

  handleChange = (positionTypeCode, positionCode, value) => {
    const updateCounter = this.state.counters;
    const updateValueCodes = this.state.valueCodes;
    const newValueCodes = [];
    const newCrewComposition = [];

    updateValueCodes[positionTypeCode].forEach(item => {
      if (positionCode === item.positionCode) {
        item.quantity = parseInt(value, 10);
      }
      newValueCodes.push(item);
    });
    this.state.crewComposition.forEach(item => {
      if (positionCode === item.positionCode) {
        item.quantity = parseInt(value, 10);
      }
      newCrewComposition.push(item);
    });

    updateValueCodes[positionTypeCode] = newValueCodes;
    updateCounter[positionTypeCode] = this.getCounterValue(
      updateValueCodes[positionTypeCode]
    );
    if (this.props.onChange) {
      this.setState(
        {
          updateCounter,
          updateValueCodes,
          crewComposition: newCrewComposition,
        },
        this.props.onChange(newCrewComposition, updateCounter)
      );
    } else {
      this.setState({
        updateCounter,
        updateValueCodes,
        crewComposition: newCrewComposition,
      });
    }
  };

  getValueCode = (valueCodeTarget, positionCode) => {
    const position = valueCodeTarget.find(
      position => position.positionCode === positionCode
    );
    return `${position.quantity}`;
  };

  displayTitle = positions => {
    const { associatedPositionCodes } = this.state;
    const { showOnlyAssociatedCGPositions } = this.props;

    if (
      showOnlyAssociatedCGPositions &&
      Array.isArray(positions) &&
      Array.isArray(associatedPositionCodes)
    ) {
      for (const position of positions) {
        if (associatedPositionCodes.includes(position.code)) {
          return true;
        }
      }
      return false;
    }
    return true;
  };

  getPlaceholder = (value, code) => {
    let placeholder = '';
    const selected = this.getValueCode(value, code);
    if (selected === mixedPositionValue) placeholder = 'Mix';
    return placeholder;
  };

  render() {
    const { t, disabled, showOnlyAssociatedCGPositions } = this.props;
    const {
      positions,
      counters,
      valueCodes,
      associatedPositionCodes,
    } = this.state;
    const sectionCrewComplement = 'DATA.aircraft.form.section.crewComplement';

    return (
      <Container>
        {positions.map((positionType, key) => {
          const { positionTypeCode } = positionType;
          return (
            <Content key={`crew_${key}`}>
              <Title
                className="crewCompTitle"
                style={{
                  display: this.displayTitle(positionType.positions)
                    ? ''
                    : 'none',
                }}
              >
                {`${positionType.positionType}: ${t(
                  `${sectionCrewComplement}.crewMembers`,
                  {
                    quantity: counters[positionTypeCode],
                  }
                )}`}
              </Title>
              {positionType.positions.map(position => {
                return (
                  <Item
                    key={position.id}
                    style={{
                      display: showOnlyAssociatedCGPositions
                        ? Array.isArray(associatedPositionCodes) &&
                          associatedPositionCodes.includes(position.code)
                          ? ''
                          : 'none'
                        : '',
                    }}
                  >
                    <ModelSelector
                      name={`${position.id}_${position.code}`}
                      label={position.code}
                      required={true}
                      items={crewComplementRange}
                      selected={this.getValueCode(
                        valueCodes[positionTypeCode],
                        position.code
                      )}
                      defaultValue={mixedPositionValue}
                      placeholder={this.getPlaceholder(
                        valueCodes[positionTypeCode],
                        position.code
                      )}
                      handleChange={value =>
                        this.handleChange(
                          positionType.positionTypeCode,
                          position.code,
                          value
                        )
                      }
                      disabled={disabled}
                    />
                  </Item>
                );
              })}
            </Content>
          );
        })}
      </Container>
    );
  }
}

StandardCrewComplement.propTypes = {
  t: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onChange: PropTypes.func,
  defaultValues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  disabled: PropTypes.bool,
  showOnlyAssociatedCGPositions: PropTypes.bool,
  currentCrewGroupId: PropTypes.number,
  initialAssociatedPositionsValue: PropTypes.number,
};

StandardCrewComplement.defaultProps = {
  onChange: () => {},
  defaultValues: null,
  disabled: false,
  showOnlyAssociatedCGPositions: false,
  currentCrewGroupId: null,
  initialAssociatedPositionsValue: 0,
};

export default StandardCrewComplement;
