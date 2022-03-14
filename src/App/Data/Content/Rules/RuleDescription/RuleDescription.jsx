import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import DescriptionWithConnect from './Description';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import withErrorHandler from '../../../../../components/ErrorHandler/withErrorHandler';
import { checkElementVisibility } from '../../../../../utils/common';
import isEmpty from 'lodash/isEmpty';
import './style.scss';

const PrimarySessionDiv = styled.div`
  padding: 14px 56px 14px 56px;
`;

const SecondarySessionDiv = styled.div`
  padding: 0px 56px 0px 56px;
`;

const SubSessionDiv = styled.div`
  display: flex;
  padding: 14px 0px 14px 0px;
`;

const BorderDiv = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const SubSessionsTitle = styled.div`
  color: #000000;
  font-weight: bold;
  font-size: 13px;
  line-height: 17px;
`;

export class RuleDescription extends Component {
  state = {
    subSessions: [],
    overlay: false,
  };

  containerRef = createRef();

  previouslyMovedUpRule = null;
  selectedLink = null;

  componentDidMount() {
    // Fetch parent description
    this.props.fetchDescription(this.props.data);
  }

  getDescription = (code, ruleDescriptions) => {
    const ruleDescription = ruleDescriptions.find(
      ruleDescription => ruleDescription.code === code
    );

    return ruleDescription ? ruleDescription : null;
  };

  handleLink = (data, ruleSet) => {
    const checkExit = this.state.subSessions.find(code => code === data.code);

    if (!checkExit) {
      this.selectedLink = data.code;
      this.setState(
        prevState => ({ subSessions: [...prevState.subSessions, data.code] }),
        () => {
          this.props.fetchDescription(data, ruleSet);
          // Manually calling columsResizing method in GenericCollapsibleTable to fix any size issue caused by detail session
          this.props.triggerResize();
        }
      );
    }
  };

  /**
   * To fix bug with new scrollbar ie unwanted space at bottom of table body when last row's subsessions are collapsed.
   * Here we calculate subsession height that we need to move up the scrollbar to fix the spacing issues.
   */
  calculateMoveUpHeight = subSessionRef => {
    try {
      const height = subSessionRef.current
        ? subSessionRef.current.clientHeight
        : 0;
      const moveUpHeight =
        this.props.scrollRefY.clientHeight - height < 0
          ? this.props.scrollRefY.clientHeight
          : height;

      return {
        moveUpHeight: moveUpHeight + 40,
      };
    } catch (error) {
      console.error(error);
      return {
        moveUpHeight: 0,
      };
    }
  };

  handleClose = (code, subSessionRef) => {
    const { scrollRefY, needToMoveUp } = this.props;
    // To fix bug with new scrollbar ie unwanted space at bottom of table body when last row's subsession collapsed.
    if (scrollRefY && needToMoveUp) {
      const { moveUpHeight } = this.calculateMoveUpHeight(subSessionRef);
      const currentPos = scrollRefY.scrollTop;
      scrollRefY.scrollTop -= moveUpHeight;
      /**
       * For ALT-2311 - When an expanded rule located toward the bottom is contracted,
       * either by collapsing the rule description altogether or by closing an extension section,
       * the rule remains at the same vertical height (i.e., the top edge of the row stays in place)
       * So here we reset back to original position.
       */
      const timer = setTimeout(() => {
        scrollRefY.scrollTop = currentPos;
        clearTimeout(timer);
      });
    }

    this.setState(
      prevState => ({
        subSessions: prevState.subSessions.filter(data => data !== code),
      }),
      () => {
        // Manually calling columsResizing method in GenericCollapsibleTable to fix any size issue caused by detail session
        this.props.triggerResize();
      }
    );
  };

  setOverlay = () => {
    this.setState({ overlay: true });
  };

  removeOverlay = () => {
    this.props.clearErrorNotification();
    this.setState({ overlay: false });
  };

  reportError = error => {
    this.props.reportError({ error });
  };

  /**
   * For ALT-2311 - When a rule located toward the bottom of the Rules table is expanded, the view is adjusted
   * (vertical scroll) such that the rule expansion section is entirely visible in the page.
   * And When an expanded rule located toward the bottom of the Rules table is extended by clicking a link in the
   * rule description, the view is adjusted (vertical scroll) such that the rule expansion section is entirely visible in the page.
   */
  moveUp = (elementRef, delay = 500) => {
    const timer = setTimeout(() => {
      try {
        /**
         * Giving a samll delay to make sure that element is properly rendered to get its height.
         * Go with setTimeout approach intead of calling this method from componentDidMount and ComponentDidUpdate because
         * the scrollbar move up is not working in the last row (ie scrollRefY.scrollTop is not mutating) without giving 500ms delay.
         */
        const { scrollRefY } = this.props;
        const { isVisible, bottomHeightDiff } = checkElementVisibility(
          scrollRefY,
          elementRef.current
        );
        if (scrollRefY && !isVisible && bottomHeightDiff > 0) {
          scrollRefY.scrollTop += bottomHeightDiff;
        }
        clearTimeout(timer);
      } catch (error) {
        console.error(error);
      }
    }, delay);
  };

  render() {
    const { subSessions, overlay } = this.state;
    const {
      t,
      data,
      userId,
      readOnly,
      scenarioId,
      ruleDescriptions,
      handleParamSet,
      handleParamReset,
      toggleLoader,
      isOpen,
      lastOpenedRowData,
      refreshRules,
    } = this.props;

    const description = this.getDescription(data.code, ruleDescriptions);
    const parentDescriptionCode = data.code;

    const checkCurrentRowOpenedWithData =
      isOpen &&
      lastOpenedRowData &&
      lastOpenedRowData.code === data.code &&
      description;
    const checkSubMenusNotOpen =
      Array.isArray(subSessions) && subSessions.length === 0;
    const checkDuplicateMovedUp = this.previouslyMovedUpRule !== data.code;

    if (
      checkCurrentRowOpenedWithData &&
      checkSubMenusNotOpen &&
      checkDuplicateMovedUp
    ) {
      this.moveUp(this.containerRef, 500);
      this.previouslyMovedUpRule = data.code;
    }

    return (
      <div className="rule-description" ref={this.containerRef}>
        {overlay && <div className="overlay" onClick={this.removeOverlay} />}
        {/**
         * The rendering primary session
         */}
        <PrimarySessionDiv>
          {description && description.userDescription && (
            <DescriptionWithConnect
              t={t}
              code={parentDescriptionCode}
              data={description.userDescription}
              ruleSet={description.ruleset}
              handleParamSet={handleParamSet}
              handleParamReset={handleParamReset}
              handleLink={this.handleLink}
              overlay={overlay}
              setOverlay={this.setOverlay}
              removeOverlay={this.removeOverlay}
              userId={userId}
              scenarioId={scenarioId}
              readOnly={readOnly}
              toggleLoader={toggleLoader}
              reportError={this.reportError}
              refreshRules={refreshRules}
            />
          )}
        </PrimarySessionDiv>
        {/**
         * The rendering of subsessions by looping subSessions state
         */}
        {Array.isArray(subSessions) && subSessions.length > 0 && (
          <SecondarySessionDiv>
            {subSessions.length > 0 && <BorderDiv />}
            {subSessions.map(code => {
              const description = this.getDescription(code, ruleDescriptions);
              const subSessionRef = createRef();

              if (description === null) {
                return <Fragment key={code} />;
              }

              if (this.selectedLink === code) {
                this.moveUp(this.containerRef, 500);
                this.selectedLink = null;
              }

              return (
                <SubSessionDiv key={code}>
                  <span ref={subSessionRef}>
                    <SubSessionsTitle
                      style={{
                        paddingBottom: isEmpty(
                          description.userDescription.references
                        )
                          ? '4px'
                          : '',
                      }}
                    >
                      {description.name}
                    </SubSessionsTitle>
                    {description && description.userDescription && (
                      <DescriptionWithConnect
                        t={t}
                        code={code}
                        data={description.userDescription}
                        ruleSet={description.ruleset}
                        handleParamSet={handleParamSet}
                        handleParamReset={handleParamReset}
                        handleLink={this.handleLink}
                        overlay={overlay}
                        setOverlay={this.setOverlay}
                        removeOverlay={this.removeOverlay}
                        userId={userId}
                        scenarioId={scenarioId}
                        readOnly={readOnly}
                        toggleLoader={toggleLoader}
                        reportError={this.reportError}
                        refreshRules={refreshRules}
                      />
                    )}
                  </span>
                  <span style={{ flex: 1 }}>
                    <IconButton
                      style={{ float: 'right' }}
                      aria-label="close row"
                      size="small"
                      onClick={() => this.handleClose(code, subSessionRef)}
                    >
                      <CloseIcon color="disabled" fontSize="small" />
                    </IconButton>
                  </span>
                </SubSessionDiv>
              );
            })}
          </SecondarySessionDiv>
        )}
      </div>
    );
  }
}

RuleDescription.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape().isRequired,
  ruleDescriptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleParamSet: PropTypes.func.isRequired,
  handleParamReset: PropTypes.func.isRequired,
  fetchDescription: PropTypes.func.isRequired,
  triggerResize: PropTypes.func.isRequired,
  scrollRefY: PropTypes.shape({
    clientHeight: PropTypes.number,
    scrollTop: PropTypes.number,
  }).isRequired,
  needToMoveUp: PropTypes.bool.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  scenarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  readOnly: PropTypes.bool.isRequired,
  toggleLoader: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  clearErrorNotification: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  lastOpenedRowData: PropTypes.shape({ code: PropTypes.string.isRequired }),
  refreshRules: PropTypes.func.isRequired,
};

RuleDescription.defaultProps = {
  lastOpenedRowData: null,
};

export default translate()(withErrorHandler(RuleDescription, 360000));
