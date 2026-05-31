import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Collapse, Typography, Box } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import WarningIcon from '@material-ui/icons/Warning';
import { renderText, chooseVariables } from '../../platform-logic/renderText.js';
import withTranslation from '../../util/withTranslation.js';
import { ThemeContext } from '../../config/config.js';

const styles = theme => ({
    panel: {
        marginTop: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    content: {
        padding: 20,
        borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(28, 176, 246, 0.08) 0%, rgba(8, 145, 178, 0.08) 100%)',
        border: '2px solid rgba(28, 176, 246, 0.3)',
        borderLeft: '4px solid #1CB0F6',
        [theme.breakpoints.down('sm')]: {
            padding: 16,
            borderRadius: 10,
        },
        [theme.breakpoints.down('xs')]: {
            padding: 12,
            borderRadius: 8,
        },
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        color: '#0891B2',
        fontWeight: 600,
        fontSize: '1.1rem',
        [theme.breakpoints.down('xs')]: {
            fontSize: '1rem',
            marginBottom: 12,
        },
    },
    headerIcon: {
        fontSize: '1.4rem',
        [theme.breakpoints.down('xs')]: {
            fontSize: '1.2rem',
        },
    },
    stepContainer: {
        marginTop: 12,
    },
    stepItem: {
        padding: '12px 0',
        borderBottom: '1px solid rgba(28, 176, 246, 0.15)',
        '&:last-child': {
            borderBottom: 'none',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '10px 0',
        },
    },
    stepNumber: {
        color: '#0891B2',
        fontWeight: 600,
        marginRight: 8,
        fontSize: '0.95rem',
    },
    stepTitle: {
        fontWeight: 500,
        color: '#0E7490',
        marginBottom: 4,
    },
    stepText: {
        marginTop: 4,
        marginLeft: 16,
        color: '#334155',
        fontSize: '0.95rem',
        lineHeight: 1.6,
        [theme.breakpoints.down('xs')]: {
            marginLeft: 8,
            fontSize: '0.9rem',
        },
    },
    answerBox: {
        marginTop: 16,
        padding: 16,
        background: 'rgba(16, 185, 129, 0.1)',
        borderRadius: 10,
        border: '2px solid rgba(16, 185, 129, 0.3)',
        [theme.breakpoints.down('xs')]: {
            padding: 12,
            borderRadius: 8,
        },
    },
    answerLabel: {
        fontWeight: 600,
        color: '#059669',
        marginBottom: 8,
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    answerValue: {
        fontSize: '1.15rem',
        color: '#047857',
        fontWeight: 500,
        lineHeight: 1.5,
        [theme.breakpoints.down('xs')]: {
            fontSize: '1.05rem',
        },
    },
    warningBanner: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 8,
        color: '#D97706',
        fontSize: '0.9rem',
        marginBottom: 16,
        [theme.breakpoints.down('xs')]: {
            padding: '8px 12px',
            fontSize: '0.85rem',
            gap: 6,
        },
    },
    warningIcon: {
        fontSize: '1.2rem',
        flexShrink: 0,
    },
    noHintsMessage: {
        color: '#64748B',
        fontStyle: 'italic',
        fontSize: '0.95rem',
        marginBottom: 12,
    },
});

class WorkedSolutionPanel extends React.Component {
    static contextType = ThemeContext;

    renderHintAsStep = (hint, index) => {
        const { classes, problemID, seed, stepVars } = this.props;

        // Skip bottom-out hints and gpt hints in worked solution display
        if (hint.type === 'bottomOut' || hint.type === 'gptHint') {
            return null;
        }

        const hintTitle = hint.title && hint.title !== 'nan' ? hint.title : '';
        const hintText = hint.text || '';

        return (
            <div key={hint.id || index} className={classes.stepItem}>
                <Typography component="div" className={classes.stepTitle}>
                    <span className={classes.stepNumber}>Step {index + 1}:</span>
                    {renderText(
                        hintTitle,
                        problemID,
                        chooseVariables(
                            Object.assign({}, stepVars, hint.variabilization || {}),
                            seed
                        ),
                        this.context
                    )}
                </Typography>
                {hintText && (
                    <Typography
                        variant="body2"
                        component="div"
                        className={classes.stepText}
                    >
                        {renderText(
                            hintText,
                            problemID,
                            chooseVariables(
                                Object.assign({}, stepVars, hint.variabilization || {}),
                                seed
                            ),
                            this.context
                        )}
                    </Typography>
                )}
            </div>
        );
    };

    render() {
        const {
            classes,
            step,
            isVisible,
            viewedBeforeAttempt,
            translate,
            problemID,
            seed,
            stepVars,
        } = this.props;

        // Get hints for this step (excluding bottomOut and gptHint)
        const hintPathway = this.context.hintPathway || 'DefaultPathway';
        const allHints = step.hints?.[hintPathway] || [];
        const displayHints = allHints.filter(h =>
            h.type !== 'bottomOut' && h.type !== 'gptHint'
        );

        // Get the answer(s)
        const answers = step.stepAnswer || [];
        const primaryAnswer = answers[0] || '';

        // Format the answer for display (wrap in LaTeX if not already)
        const formattedAnswer = primaryAnswer.startsWith('$$')
            ? primaryAnswer
            : `$$${primaryAnswer}$$`;

        return (
            <div className={classes.panel}>
                <Collapse in={isVisible} timeout={300}>
                    <div className={classes.content}>
                        {/* Warning if viewed before attempt */}
                        {viewedBeforeAttempt && (
                            <div className={classes.warningBanner}>
                                <WarningIcon className={classes.warningIcon} />
                                <span>{translate('workedSolution.viewedBeforeAttempt')}</span>
                            </div>
                        )}

                        {/* Header */}
                        <div className={classes.header}>
                            <CheckCircleOutlineIcon className={classes.headerIcon} />
                            <Typography variant="h6" component="span">
                                {translate('workedSolution.header')}
                            </Typography>
                        </div>

                        {/* Step-by-step hints as worked solution */}
                        {displayHints.length > 0 ? (
                            <div className={classes.stepContainer}>
                                {displayHints.map((hint, idx) =>
                                    this.renderHintAsStep(hint, idx)
                                )}
                            </div>
                        ) : (
                            <Typography className={classes.noHintsMessage}>
                                {translate('workedSolution.noSteps')}
                            </Typography>
                        )}

                        {/* Final Answer */}
                        {primaryAnswer && (
                            <Box className={classes.answerBox}>
                                <Typography className={classes.answerLabel}>
                                    <CheckCircleOutlineIcon style={{ fontSize: '1.1rem' }} />
                                    {translate('workedSolution.finalAnswer')}:
                                </Typography>
                                <Typography className={classes.answerValue} component="div">
                                    {renderText(
                                        formattedAnswer,
                                        problemID,
                                        chooseVariables(stepVars, seed),
                                        this.context
                                    )}
                                </Typography>
                            </Box>
                        )}
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default withStyles(styles)(withTranslation(WorkedSolutionPanel));
