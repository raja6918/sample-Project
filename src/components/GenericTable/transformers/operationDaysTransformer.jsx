import React, { Fragment } from 'react';
import styled from 'styled-components';

const OperationDay = styled.span`
  display: inline-block;
  width: 10px;
  text-align: center;
`;

const operationDaysTransformer = operationDays => {
  const days = [];
  for (let dayNumber = 1; dayNumber <= 7; dayNumber++) {
    if (operationDays.includes(dayNumber)) {
      days.push(`${dayNumber}`);
    } else {
      days.push('_');
    }
  }
  return (
    <Fragment>
      {days.map((day, index) => {
        return <OperationDay key={index}>{day}</OperationDay>;
      })}
    </Fragment>
  );
};

export default operationDaysTransformer;
