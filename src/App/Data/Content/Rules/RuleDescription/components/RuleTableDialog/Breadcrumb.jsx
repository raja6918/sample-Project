import React from 'react';
import { t } from 'i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const StyledBtnLink = styled.button`
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-decoration-line: ${props => props.textDecoration};
  color: #333333;
`;

const Breadcrumb = ({
  exceptions,
  exceptionsSelected,
  handleStateChange,
  handleExceptionsSelectedChange,
}) => {
  const filteredExceptions = exceptions
    .map((exception, index) => ({ ...exception, position: index }))
    .filter(exception => exceptionsSelected[exception.key]);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <StyledBtnLink
        className="button-reset"
        textDecoration={filteredExceptions.length > 0 ? 'underline' : 'none'}
        disabled={filteredExceptions.length === 0}
        onClick={() => handleStateChange('general')}
      >
        {t('DATA.rules.ruleTable.general')}
      </StyledBtnLink>
      {filteredExceptions.map((exception, index) => (
        <StyledBtnLink
          key={exception.key}
          className=" button-reset"
          textDecoration={
            filteredExceptions.length !== index + 1 ? 'underline' : 'none'
          }
          disabled={filteredExceptions.length === index + 1}
          onClick={() =>
            handleExceptionsSelectedChange(
              exception.key,
              exceptionsSelected[exception.key],
              exception.position
            )
          }
        >
          {exceptionsSelected[exception.key]}
        </StyledBtnLink>
      ))}
    </Breadcrumbs>
  );
};

Breadcrumb.propTypes = {
  exceptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  exceptionsSelected: PropTypes.shape().isRequired,
  handleStateChange: PropTypes.func.isRequired,
  handleExceptionsSelectedChange: PropTypes.func.isRequired,
};

export default Breadcrumb;
