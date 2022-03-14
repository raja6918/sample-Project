import React from 'react';
import withErrorHandler from './withErrorHandler.jsx';
import scenarioService from './../../services/Scenarios/';
import templatesService from './../../services/Templates/';
import ColorComboBox from '../../components/ColorComboBox/ColorComboBox';

import errorTypes from './constants';
import ColorAutocompleteBox from '../ColorAutocompleteBox/ColorAutocompleteBox.jsx';

const styles = {
  margin: 10,
};

const { SNACK, PAGE } = errorTypes;

class TestPage extends React.Component {
  state = {
    autocompleteValue: null,
  };

  componentWillMount() {
    console.log('componentWillMount TestPage', { props: this.props });
  }

  getScenario = () => {
    scenarioService
      .getScenarioDetails(9999)
      .then(response => console.log(response))
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  fakeGetScenario = fakeErrorCode => {
    scenarioService
      .getScenarioDetailsWithError(9999)
      .then(response => console.log(response))
      .catch(error => {
        if (fakeErrorCode) {
          error.response.status = fakeErrorCode;
        }
        this.props.reportError({ error, errorType: PAGE });
      });
  };
  deleteScenario = () => {
    const customMessageArguments = ['Scenario Name'];
    scenarioService
      .deleteScenario(9999, 1)
      .then(response => console.log(response))
      .catch(error => {
        this.props.reportError({
          error,
          errorType: SNACK,
          customMessageArguments,
        });
      });
  };

  createScenario = () => {
    const data = {
      name: 'test',
      startDate: '2020-08-28T00:00:00.000Z',
      endDate: '2020-09-26T00:00:00.000Z',
      sourceId: 0,
      isTemplate: false,
    };

    scenarioService
      .createScenario(data, 1)
      .then(r => console.log(r))
      .catch(error => {
        this.props.reportError({ error, errorType: PAGE });
      });
  };

  checkforforbidden = fakeErrorCode => {
    scenarioService
      .getScenarioDetailsWithError(9999)
      .then(response => console.log(response))
      .catch(error => {
        if (fakeErrorCode) {
          error.response.status = fakeErrorCode;
        }
        this.props.reportError({ error, errorType: PAGE });
      });
  };

  checkForUnauthorized = fakeErrorCode => {
    scenarioService
      .getScenarioDetailsWithError(9999)
      .then(response => console.log(response))
      .catch(error => {
        if (fakeErrorCode) {
          error.response.status = fakeErrorCode;
        }
        this.props.reportError({ error, errorType: PAGE });
      });
  };

  createTemplate = () => {
    const dataToSave = {
      objects: [
        {
          sourceId: '9999',
          name: 'Blank',
          category: '',
          isTemplate: true,
          description: '',
        },
      ],
    };
    templatesService
      .createTemplate(dataToSave)
      .then(response => console.log(response))
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  handleAutocompleteChange = autocompleteValue => {
    this.setState({ autocompleteValue });
  };

  render() {
    const options = [
      {
        value: 'YZP',
        label: '(YZP) null',
      },

      {
        value: 'YGP',
        label: '(YGP) null',
      },
      {
        value: 'YGK',
        label: '(YGK) null',
        primary: true,
      },
      {
        value: 'ZLO',
        label: '(ZLO) Manzanillo',
      },
      {
        value: 'ZIH',
        label: '(ZIH) Ixtapa/Zihuatanejo',
        primary: true,
      },
      {
        value: 'YZF',
        label: '(YZF) Yellowknife',
        primary: true,
      },
      {
        value: 'DFW',
        label: '(DFW) null',
      },
    ];
    return (
      <React.Fragment>
        <h1>Test page</h1>
        <button type="button" onClick={this.getScenario} style={styles}>
          Get scenario 9999 details
        </button>
        <br />
        <button
          type="button"
          onClick={() => this.fakeGetScenario()}
          style={styles}
        >
          404 error
        </button>
        <br />
        <button
          type="button"
          onClick={() => this.fakeGetScenario(500)}
          style={styles}
        >
          fake 500 error
        </button>
        <br />
        <button
          type="button"
          onClick={() => this.createScenario()}
          style={styles}
        >
          fake 400 error
        </button>
        <br />
        <button
          type="button"
          onClick={() => this.fakeGetScenario(911)}
          style={styles}
        >
          catch all XXX error
        </button>
        <br />
        <button type="button" onClick={this.deleteScenario} style={styles}>
          Delete scenario 9999
        </button>
        <br />
        <button type="button" onClick={this.createTemplate} style={styles}>
          Create template from source 9999
        </button>
        <div>
          <button
            type="button"
            onClick={() => this.checkforforbidden(403)}
            style={styles}
          >
            Check for 403
          </button>
          Make scenarios forbidden and test
        </div>
        <div>
          <button
            type="button"
            onClick={() => this.checkForUnauthorized(401)}
            style={styles}
          >
            Fake 401
          </button>
        </div>
        <div>
          {/* <h1>Drop down ALT-2708 test</h1>
          <ColorComboBox
            primaryItems={[
              { display: 'Option1', value: 'option1' },
              { display: 'Option2', value: 'option2' },
              { display: 'Option3', value: 'option3' },
            ]}
            secondaryItems={[
              { display: 'option4', value: 'option4' },
              { display: 'option5', value: 'option5' },
              { display: 'option6', value: 'option6' },
            ]}
            color="#FF650C"
            placeholder="Station"
            onChange={value => console.log(value, { name: 'station' })}
          /> */}
          <h1>Autocomplete Drop down ALT-2775 test</h1>
          <ColorAutocompleteBox
            options={options}
            color="#FF650C"
            placeholder="Station"
            onChange={this.handleAutocompleteChange}
            value={this.state.autocompleteValue}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default withErrorHandler(TestPage);
