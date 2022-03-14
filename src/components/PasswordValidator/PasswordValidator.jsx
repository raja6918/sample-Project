import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CheckIcon from '@material-ui/icons/Check';

const Container = styled.div`
  padding-top: 10px;
  padding-bottom: 5px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #000005;
  letter-spacing: 0;
  line-height: 14px;
`;

const DotIcon = styled.span`
  padding-right: 15px;
  padding-left: 5px;
`;

/**
 * This ia a generic Password Strength Validator component to check whether user input satisfies set of hard-coded criteria.
 */
const PasswordValidator = props => {
  // labels and state boolean corresponding to each validation
  const validationCriteria = [
    [1, props.t('PASSWORD_VALIDATOR.rules.contains8Chars'), 'contains8Chars'],
    [
      2,
      props.t('PASSWORD_VALIDATOR.rules.containsLowerUpperCase'),
      'containsLowerUpperCase',
    ],
    [3, props.t('PASSWORD_VALIDATOR.rules.containsNum'), 'containsNum'],
    [4, props.t('PASSWORD_VALIDATOR.rules.containsNoBlank'), 'containsNoBlank'],
  ];

  const validatePassword = data => {
    let containsUpperCase = false;
    let containsLowerCase = false;
    let contains8Chars = false;
    let containsNum = false;
    let containsNoBlank = false;

    // has uppercase letter
    if (data.toLowerCase() !== data) {
      containsUpperCase = true;
    }

    // has lowercase letter
    if (data.toUpperCase() !== data) {
      containsLowerCase = true;
    }

    // has number
    if (/\d/.test(data)) {
      containsNum = true;
    }

    // has 8 characters
    if (data.length >= 8) {
      contains8Chars = true;
    }

    // Contain no blank spaces
    if (/^\S{1,}$/.test(data)) {
      containsNoBlank = true;
    }

    return {
      containsLowerUpperCase: containsLowerCase && containsUpperCase,
      contains8Chars,
      containsNum,
      containsNoBlank,
    };
  };

  const validityObj = validatePassword(props.value);

  return (
    <Container>
      {validationCriteria.map(validation => {
        const [id, title, isValid] = validation;
        const isValidCriteria = validityObj[isValid];
        const style = {
          color: isValidCriteria ? '#68c163' : '#00000061',
        };
        return (
          <Row key={id} style={style}>
            {isValidCriteria && (
              <CheckIcon
                color="inherit"
                fontSize="small"
                style={{ width: '25px', paddingRight: '10px' }}
              />
            )}
            {!isValidCriteria && <DotIcon>•</DotIcon>}
            {title}
          </Row>
        );
      })}
    </Container>
  );
};

PasswordValidator.propTypes = {
  t: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default PasswordValidator;
