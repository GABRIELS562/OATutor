import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { renderText } from '../../platform-logic/renderText.js';
import { ThemeContext } from "../../config/config";
import { withLocalization } from '../../util/LocalizationContext';

class MultipleChoice extends React.Component {
    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue || null,
        };
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
        this.props.onChange(event);
    };

    render() {
        let { choices: _choices = [], variabilization, localization } = this.props;
        const t = localization?.t || ((key) => key);

        const choices = []
        if (Array.isArray(_choices)) {
            [...new Set(_choices)].forEach(choice => {
                if (choice.includes(" above")) {
                    choices.push(choice);
                } else {
                    choices.unshift(choice);
                }
            })
        }

        return (
            <div style={{ marginRight: "5%", textAlign: "center" }} role="group" aria-label="Answer choices">
                <FormControl component="fieldset">
                    <FormLabel component="legend" className="sr-only">
                        {t('problemInput.selectYourAnswer')}
                    </FormLabel>
                    <RadioGroup
                        value={this.state.value}
                        onChange={this.handleChange}
                        aria-label="Answer options"
                    >
                        {choices.length > 0
                            ? choices.map((choice, i) =>
                                <FormControlLabel
                                    value={choice}
                                    control={<Radio color="primary" />}
                                    label={renderText(choice, null, variabilization, this.context)}
                                    key={choice}
                                    aria-label={`Option ${i + 1}: ${choice}`}
                                />)
                            : <span role="alert">{t('problemInput.noAnswerChoices')}</span>}
                    </RadioGroup>
                </FormControl>
            </div>
        );
    }
}

export default withLocalization(MultipleChoice);
