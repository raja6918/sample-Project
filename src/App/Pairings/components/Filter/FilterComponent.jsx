import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { withRouter } from 'react-router';

import { getComponent } from './constants';

const TitleSession = styled.div`
  width: ${props => props.width};
  float: left;
  margin-top: 20px;
  padding-right: 10px;
  font-size: 15px;
`;

const ComponentSession = styled.div`
  width: ${props => props.width};
  float: left;
  margin-top: -8px;
`;

const CloseSession = styled.div`
  width: ${props => props.width};
  float: left;
  margin-top: 18px;
`;

export const FilterComponent = ({
  t,
  criteria,
  handleCriteriaChange,
  handleRemoveCriteria,
  location,
  value,
}) => {
  const component = getComponent(t, criteria, location);
  const CustomComponent = component ? component.component : null;
  const localisedCriteriaName = t(
    `FILTER.filterCriteria.criteria.${criteria.crKey}`
  );

  const valueProp = value ? { value } : {};
  const isSubCategory = component.props.isSubCategory
    ? component.props.isSubCategory
    : false;
  return (
    <div>
      {!isSubCategory && (
        <TitleSession
          style={{ fontWeight: 500 }}
          width={isSubCategory ? '0%' : '45%'}
        >
          {localisedCriteriaName}
        </TitleSession>
      )}
      <ComponentSession width={isSubCategory ? '100%' : '50%'}>
        {component && (
          <CustomComponent
            {...component.props}
            t={t}
            onChange={(value, data, error) =>
              handleCriteriaChange(criteria.crName, value, data, error)
            }
            {...valueProp}
          />
        )}
      </ComponentSession>
      {!isSubCategory && (
        <CloseSession width={isSubCategory ? '0%' : '5%'}>
          <IconButton
            style={{ float: 'right' }}
            aria-label="close row"
            size="small"
            onClick={() => handleRemoveCriteria(criteria)}
          >
            <DeleteIcon color="primary" />
          </IconButton>
        </CloseSession>
      )}
    </div>
  );
};

FilterComponent.propTypes = {
  t: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.string),
  ]),
  criteria: PropTypes.shape({}).isRequired,
  handleCriteriaChange: PropTypes.func.isRequired,
  handleRemoveCriteria: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
};

FilterComponent.defaultProps = {
  value: null,
};

export default withRouter(FilterComponent);
