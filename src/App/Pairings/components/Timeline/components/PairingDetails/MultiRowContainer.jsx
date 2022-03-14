import React from 'react';
import className from 'classnames';

import Tooltip from '../../../../../../components/Tooltip';

const generateCrewComposition = crewComposition => {
  const crewQty = [];
  const crewDescription = [];
  const totalPositions = crewComposition.length;

  for (let i = 0; i < totalPositions; i++) {
    const position = crewComposition[i];
    const isUnderlined = position.balance < 0;
    const isOverlined = position.balance > 0;
    const classNames = className({
      underline: isUnderlined,
      overline: isOverlined,
    });
    const balanceStr =
      position.balance > 0 ? `+${position.balance}` : position.balance;
    const isNotTheLastItem = i < totalPositions - 1;

    crewQty.push(
      <span className={classNames} key={i}>
        {position.quantity}
      </span>
    );
    crewDescription.push(
      <span className={classNames} key={i}>
        {position.quantity} {position.positionCode}
        {position.balance && ` (${balanceStr})`}
      </span>
    );

    if (isNotTheLastItem) {
      crewDescription.push(
        <span key={`separator-${i}`} className="separator">
          ,
        </span>
      );
    }
  }

  const crewCompositionData = {
    crewCompositionCell: <div className="crew-composition">{crewQty}</div>,
    crewCompositionTooltip: (
      <div className="crew-composition">{crewDescription}</div>
    ),
  };

  return crewCompositionData;
};

class MultiRowContainer extends React.PureComponent {
  state = {
    showMore: false,
  };

  toggleShowMore = () => {
    this.setState(prevState => ({ showMore: !prevState.showMore }));
  };

  render() {
    const { showMore } = this.state;
    const { data } = this.props;
    const showMoreConfig = !showMore ? ['expand_more'] : ['expand_less'];
    const {
      crewCompositionCell,
      crewCompositionTooltip,
    } = generateCrewComposition(data.required);

    return (
      <div className="multi-row-container">
        <div className="row">
          <div className="cell" role="cell">
            {data.status}
          </div>
          <div className="cell" role="cell">
            <span className="hightlight">
              <span>
                {data.timeOnGround.duration}
                {data.timeOnGround.isAircraftChange && (
                  <i className="material-icons right-icon">autorenew</i>
                )}
              </span>
            </span>
          </div>
          <div className="cell" role="cell">
            {data.aircraftType}
          </div>
          <div className="cell actions" role="cell">
            <i className="material-icons" onClick={this.toggleShowMore}>
              {showMoreConfig[0]}
            </i>
          </div>
          <div className="cell auto-hide" role="cell">
            <Tooltip title={crewCompositionTooltip}>
              {crewCompositionCell}
            </Tooltip>
          </div>
          <div className="cell auto-hide" role="cell">
            <span className="hightlight">{data.credit}</span>
          </div>
        </div>
        {this.state.showMore && (
          <React.Fragment>
            <div className="row auto-hide">
              <div className="cell header" role="cell">
                <i className="material-icons">group</i>
                <span>Required</span>
              </div>
              <div className="cell header" role="cell">
                <i className="material-icons">account_balance_wallet</i>
                <span>Credit</span>
              </div>
            </div>
            <div className="row auto-hide">
              <div className="cell" role="cell">
                <Tooltip title={crewCompositionTooltip}>
                  {crewCompositionCell}
                </Tooltip>
              </div>
              <div className="cell" role="cell">
                <span className="hightlight">{data.credit}</span>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default MultiRowContainer;
