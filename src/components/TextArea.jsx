import styled from 'styled-components';

import Input from '@material-ui/core/TextField';

const TextArea = styled(Input)`
  margin-bottom: 10px;
  & textarea {
    font-size: 16px;
    height: ${props =>
      props.customheight
        ? `${Number(props.customheight) - 21}px !important`
        : '88px !important'};
    overflow-y: auto !important;
    padding: 9px 17px;
  }
  & > div::before,
  & > div::after {
    content: none;
  }
  & > div {
    border: ${props =>
      props.disabled ? '1px dotted #979797' : '1px solid #979797'};
    /* padding: 9px 15px; */
    height: ${props =>
      props.customheight ? `${props.customheight}px` : '109px'};
  }
  & label {
    left: 15px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.87);
  }
  & label[data-shrink='true'] {
    transform: translate(-16px, 0px) scale(1);
  }
  & label[class*='focused'] {
    color: rgb(7, 81, 135);
  }
  & label[class*='focused'] + div {
    border-color: rgb(7, 81, 135);
  }
  & > div {
    /* overflow-y: auto; */
  }
  [name='description'] {
    height: ${props =>
      props.customheight ? `${Number(props.customheight) - 21}px ` : '88px'};
  }
`;

export default TextArea;
