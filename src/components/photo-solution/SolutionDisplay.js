/**
 * SolutionDisplay - Display step-by-step AI-generated solutions
 * JSDT-style presentation with expandable steps and exam tips
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Button,
    IconButton,
    Tooltip,
    LinearProgress,
} from '@material-ui/core';
import {
    ExpandMore,
    CheckCircle,
    EmojiObjects,
    School,
    Star,
    BookmarkBorder,
    Bookmark,
    PlayArrow,
    VolumeUp,
    FileCopy,
    Refresh,
} from '@material-ui/icons';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
    },
    header: {
        padding: theme.spacing(3),
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    },
    title: {
        fontWeight: 600,
        marginBottom: theme.spacing(1),
    },
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    chip: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white',
        fontSize: '0.75rem',
    },
    difficultyEasy: {
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
    },
    difficultyMedium: {
        backgroundColor: 'rgba(255, 152, 0, 0.3)',
    },
    difficultyHard: {
        backgroundColor: 'rgba(244, 67, 54, 0.3)',
    },
    content: {
        backgroundColor: '#fff',
    },
    stepsContainer: {
        padding: theme.spacing(2),
    },
    stepAccordion: {
        marginBottom: theme.spacing(1),
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: theme.shape.borderRadius,
        '&:before': {
            display: 'none',
        },
        '&.Mui-expanded': {
            margin: `0 0 ${theme.spacing(1)}px 0`,
        },
    },
    stepSummary: {
        '&.Mui-expanded': {
            minHeight: 48,
        },
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: '#1a237e',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        marginRight: theme.spacing(2),
        flexShrink: 0,
    },
    stepCompleted: {
        backgroundColor: '#4caf50',
    },
    stepTitle: {
        fontWeight: 500,
        flex: 1,
    },
    stepDetails: {
        flexDirection: 'column',
        paddingTop: 0,
    },
    explanation: {
        color: '#666',
        marginBottom: theme.spacing(2),
        fontSize: '0.9rem',
        lineHeight: 1.6,
    },
    workingBox: {
        backgroundColor: 'rgba(26, 35, 126, 0.03)',
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        borderLeft: '4px solid #1a237e',
        marginBottom: theme.spacing(2),
    },
    workingLabel: {
        fontSize: '0.75rem',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: theme.spacing(1),
    },
    working: {
        fontFamily: '"Roboto Mono", monospace',
        fontSize: '0.95rem',
    },
    tipBox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing(1),
        backgroundColor: 'rgba(255, 152, 0, 0.08)',
        padding: theme.spacing(1.5),
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(1),
    },
    tipIcon: {
        color: '#ff9800',
        fontSize: '1.25rem',
    },
    tipText: {
        fontSize: '0.85rem',
        color: '#e65100',
    },
    finalAnswerSection: {
        padding: theme.spacing(3),
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
        borderTop: '2px solid #4caf50',
    },
    finalAnswerLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        color: '#4caf50',
        fontWeight: 600,
        marginBottom: theme.spacing(1),
    },
    finalAnswer: {
        fontSize: '1.25rem',
        fontWeight: 500,
        padding: theme.spacing(2),
        backgroundColor: 'white',
        borderRadius: theme.shape.borderRadius,
        border: '1px solid rgba(76, 175, 80, 0.3)',
    },
    checkMethod: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(1.5),
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: theme.shape.borderRadius,
        fontSize: '0.9rem',
    },
    examTipsSection: {
        padding: theme.spacing(3),
        backgroundColor: 'rgba(26, 35, 126, 0.02)',
    },
    examTipsList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    examTipItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(1),
        '&:last-child': {
            marginBottom: 0,
        },
    },
    starIcon: {
        color: '#ffc107',
        fontSize: '1rem',
        marginTop: 2,
    },
    actionsBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0,0,0,0.08)',
        backgroundColor: '#fafafa',
        borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
    },
    actionButton: {
        color: '#666',
    },
    practiceButton: {
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
    },
    loadingContainer: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    streamingContent: {
        padding: theme.spacing(3),
        whiteSpace: 'pre-wrap',
        fontFamily: '"Roboto Mono", monospace',
        fontSize: '0.9rem',
        lineHeight: 1.6,
        maxHeight: 400,
        overflowY: 'auto',
    },
}));

// Helper to render math content
const renderMath = (text) => {
    if (!text) return null;

    // Check if text contains LaTeX
    const hasDisplayMath = text.includes('$$') || text.includes('\\[');
    const hasInlineMath = text.includes('$') && !hasDisplayMath;

    if (hasDisplayMath) {
        // Extract and render display math
        const parts = text.split(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/);
        return parts.map((part, i) => {
            if (i % 2 === 1) {
                return <BlockMath key={i} math={part} />;
            }
            return <span key={i}>{part}</span>;
        });
    }

    if (hasInlineMath) {
        // Extract and render inline math
        const parts = text.split(/\$(.*?)\$/);
        return parts.map((part, i) => {
            if (i % 2 === 1) {
                return <InlineMath key={i} math={part} />;
            }
            return <span key={i}>{part}</span>;
        });
    }

    // Plain text
    return text;
};

const SolutionDisplay = ({
    solution,
    isLoading = false,
    isStreaming = false,
    streamingContent = '',
    onRegenerate,
    onPractice,
    onAudioPlay,
}) => {
    const classes = useStyles();
    const [expandedSteps, setExpandedSteps] = useState([0]);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleStepChange = (stepIndex) => (event, isExpanded) => {
        if (isExpanded) {
            setExpandedSteps([...expandedSteps, stepIndex]);
            if (!completedSteps.includes(stepIndex)) {
                setCompletedSteps([...completedSteps, stepIndex]);
            }
        } else {
            setExpandedSteps(expandedSteps.filter(i => i !== stepIndex));
        }
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case 'easy': return classes.difficultyEasy;
            case 'hard': return classes.difficultyHard;
            default: return classes.difficultyMedium;
        }
    };

    const handleCopy = async () => {
        if (!solution) return;
        const text = solution.solution?.steps
            ?.map(s => `Step ${s.number}: ${s.title}\n${s.working}`)
            .join('\n\n');
        try {
            await navigator.clipboard.writeText(text || '');
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    // Loading state
    if (isLoading && !isStreaming) {
        return (
            <Paper className={classes.root}>
                <div className={classes.loadingContainer}>
                    <LinearProgress style={{ marginBottom: 16 }} />
                    <Typography color="textSecondary">
                        Generating step-by-step solution...
                    </Typography>
                </div>
            </Paper>
        );
    }

    // Streaming state
    if (isStreaming) {
        return (
            <Paper className={classes.root}>
                <div className={classes.header}>
                    <Typography variant="h6" className={classes.title}>
                        Generating Solution...
                    </Typography>
                </div>
                <div className={classes.streamingContent}>
                    {streamingContent || 'Starting...'}
                    <span className="cursor-blink">▋</span>
                </div>
            </Paper>
        );
    }

    // No solution
    if (!solution) return null;

    const { title, difficulty, topic, estimatedMarks, solution: sol, examTips } = solution;
    const steps = sol?.steps || [];

    return (
        <Paper className={classes.root} elevation={2}>
            {/* Header */}
            <div className={classes.header}>
                <Typography variant="h6" className={classes.title}>
                    {title || 'Solution'}
                </Typography>
                <div className={classes.metaRow}>
                    {topic && (
                        <Chip
                            icon={<School style={{ color: 'inherit' }} />}
                            label={topic}
                            size="small"
                            className={classes.chip}
                        />
                    )}
                    {difficulty && (
                        <Chip
                            label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            size="small"
                            className={`${classes.chip} ${getDifficultyClass(difficulty)}`}
                        />
                    )}
                    {estimatedMarks && (
                        <Chip
                            label={`${estimatedMarks} marks`}
                            size="small"
                            className={classes.chip}
                        />
                    )}
                </div>
            </div>

            {/* Steps */}
            <div className={classes.content}>
                <div className={classes.stepsContainer}>
                    <Typography variant="subtitle2" gutterBottom style={{ color: '#666' }}>
                        {steps.length} Step{steps.length !== 1 ? 's' : ''} •
                        {completedSteps.length} Completed
                    </Typography>

                    {steps.map((step, index) => (
                        <Accordion
                            key={index}
                            className={classes.stepAccordion}
                            expanded={expandedSteps.includes(index)}
                            onChange={handleStepChange(index)}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                className={classes.stepSummary}
                            >
                                <div
                                    className={`${classes.stepNumber} ${
                                        completedSteps.includes(index) ? classes.stepCompleted : ''
                                    }`}
                                >
                                    {completedSteps.includes(index) ? (
                                        <CheckCircle style={{ fontSize: 18 }} />
                                    ) : (
                                        step.number || index + 1
                                    )}
                                </div>
                                <Typography className={classes.stepTitle}>
                                    {step.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails className={classes.stepDetails}>
                                {/* Explanation */}
                                {step.explanation && (
                                    <Typography className={classes.explanation}>
                                        {step.explanation}
                                    </Typography>
                                )}

                                {/* Working */}
                                {step.working && (
                                    <div className={classes.workingBox}>
                                        <Typography className={classes.workingLabel}>
                                            Working
                                        </Typography>
                                        <div className={classes.working}>
                                            {renderMath(step.working)}
                                        </div>
                                    </div>
                                )}

                                {/* Tip */}
                                {step.tip && (
                                    <div className={classes.tipBox}>
                                        <EmojiObjects className={classes.tipIcon} />
                                        <Typography className={classes.tipText}>
                                            {step.tip}
                                        </Typography>
                                    </div>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>

                {/* Final Answer */}
                {sol?.finalAnswer && (
                    <div className={classes.finalAnswerSection}>
                        <Typography className={classes.finalAnswerLabel}>
                            <CheckCircle />
                            Final Answer
                        </Typography>
                        <div className={classes.finalAnswer}>
                            {renderMath(sol.finalAnswer)}
                        </div>
                        {sol.checkMethod && (
                            <div className={classes.checkMethod}>
                                <strong>Check: </strong>
                                {sol.checkMethod}
                            </div>
                        )}
                    </div>
                )}

                {/* Exam Tips */}
                {examTips && examTips.length > 0 && (
                    <div className={classes.examTipsSection}>
                        <Typography variant="subtitle2" gutterBottom>
                            <Star style={{ fontSize: 18, verticalAlign: 'middle', color: '#ffc107' }} />
                            {' '}NSC Exam Tips
                        </Typography>
                        <ul className={classes.examTipsList}>
                            {examTips.map((tip, i) => (
                                <li key={i} className={classes.examTipItem}>
                                    <Star className={classes.starIcon} />
                                    <Typography variant="body2">{tip}</Typography>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className={classes.actionsBar}>
                <div>
                    <Tooltip title="Bookmark">
                        <IconButton
                            className={classes.actionButton}
                            onClick={() => setIsBookmarked(!isBookmarked)}
                        >
                            {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy solution">
                        <IconButton className={classes.actionButton} onClick={handleCopy}>
                            <FileCopy />
                        </IconButton>
                    </Tooltip>
                    {onAudioPlay && (
                        <Tooltip title="Listen to explanation">
                            <IconButton className={classes.actionButton} onClick={onAudioPlay}>
                                <VolumeUp />
                            </IconButton>
                        </Tooltip>
                    )}
                    {onRegenerate && (
                        <Tooltip title="Regenerate solution">
                            <IconButton className={classes.actionButton} onClick={onRegenerate}>
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
                {onPractice && (
                    <Button
                        variant="contained"
                        className={classes.practiceButton}
                        startIcon={<PlayArrow />}
                        onClick={onPractice}
                    >
                        Practice Similar
                    </Button>
                )}
            </div>
        </Paper>
    );
};

export default SolutionDisplay;
