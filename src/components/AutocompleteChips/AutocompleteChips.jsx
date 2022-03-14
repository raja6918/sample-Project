import React from 'react';
import classNames from 'classnames';
import Creatable from 'react-select3/creatable';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import './AutoCompleteChips.css';
import SierraTooltip from '../../_shared/components/SierraTooltip';

const StyledSelect = styled(Creatable)`
  .input {
    display: flex;
    padding: 0;
    height: auto;
  }

  .value-container {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    align-items: center;
    overflow: hidden;
  }
  .chip {
    margin: 2px;
  }

  .single-value {
    font-size: 16;
  }

  .placeholder {
    position: absolute;
    left: 2;
    font-size: 16;
    color: #909090;
  }

  .paper {
    margin-top: 8px;
  }
`;

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  const inputClasses = classNames({
    input: true,
  });

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: inputClasses,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  const classes = classNames({
    placeholder: true,
  });
  return (
    <span color="textSecondary" className={classes} {...props.innerProps}>
      {props.children}
    </span>
  );
}

function SingleValue(props) {
  const classes = classNames({
    'single-value': true,
  });
  return (
    <span className={classes} {...props.innerProps}>
      {props.children}
    </span>
  );
}

function ValueContainer(props) {
  const classes = classNames({
    'value-container': true,
  });

  return <div className={classes}>{props.children}</div>;
}

function Menu(props) {
  const classes = classNames({
    'paper-container': true,
    paper: true,
  });

  return (
    <Paper square className={classes} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

//this is for tooltip not fully developed

// const MultiValueLabel = props => {
//   return (
//     <SierraTooltip
//       html={
//         <span style={{ padding: '2px', wordWrap: 'break-word' }}>
//           {props.data.label}
//         </span>
//       }
//     >
//       <span>{props.data.value}</span>
//     </SierraTooltip>
//   );
// };

const components = {
  Option,
  Control,
  Placeholder,
  SingleValue,
  ValueContainer,
  Menu,
  // MultiValueLabel,
};

class AutocompleteChips extends React.Component {
  state = {
    chips: [],
    suggestions: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.chips) {
      const suggestions = nextProps.chipsSource.map(suggestion => ({
        value: suggestion,
        label: suggestion,
      }));

      const chips = nextProps.chips.map(tag => ({
        value: tag,
        label: tag,
      }));

      this.setState({ suggestions, chips });
    }
  }

  onChange = chips => {
    let elements = [];
    if (chips) {
      elements = chips.map(chip => chip.label.trim());
    }
    this.props.onChipsUpdate(elements);
  };

  changeTextStyle = () => {
    const { label } = this.props;
    const el = document.getElementById(`${label}`);
    if (el) {
      if (el.style.color) {
        el.style.color = '';
      } else {
        el.style.color = '#0A75C2';
      }
    }
  };

  validateOption = text => {
    let isValid = false;
    const cleanText = text.trim();
    const elements = this.props.chips;

    if (text.trim() === '') {
      isValid = false;
    } else {
      isValid = Array.isArray(elements) && !elements.includes(cleanText);
    }

    return isValid;
  };

  render() {
    const { suggestions, chips } = this.state;
    const { disabled, placeholder } = this.props;
    const selectStyles = {
      input: base => ({
        ...base,
        color: 'gray',
      }),
      indicatorsContainer: base => ({
        ...base,
        cursor: 'pointer',
      }),
      multiValue: base => ({
        ...base,
        backgroundColor: '#e0e0e0',
        borderRadius: '13px',
        // font: '13.6px Roboto, Helvetica, Arial, sans-serif',
        // padding: '3px 3px 3px 6px',
      }),
      MultiValueRemove: base => ({ ...base, cursor: 'pointer' }),
    };

    return (
      <StyledSelect
        closeMenuOnSelect={false}
        styles={selectStyles}
        textFieldProps={{
          label: 'Label',
          InputLabelProps: {
            shrink: true,
          },
        }}
        options={suggestions}
        components={components}
        value={chips}
        onChange={this.onChange}
        placeholder={placeholder}
        isMulti
        openMenuOnClick={false}
        isValidNewOption={input => {
          return this.validateOption(input);
        }}
        isDisabled={disabled}
        onFocus={this.changeTextStyle}
        onBlur={this.changeTextStyle}
      />
    );
  }
}

AutocompleteChips.propTypes = {
  chipsSource: PropTypes.arrayOf(PropTypes.string).isRequired,
  chips: PropTypes.arrayOf(PropTypes.string),
  onChipsUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

AutocompleteChips.defaultProps = {
  chips: [],
  disabled: false,
  placeholder: '',
};

export default AutocompleteChips;
