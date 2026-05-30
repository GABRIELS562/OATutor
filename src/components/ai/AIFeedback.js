/**
 * AIFeedback - "Was this helpful?" feedback buttons
 */

import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Typography,
    Tooltip,
    Snackbar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

import aiTutor from '../../services/AITutorService';
import { AI_TUTOR_MESSAGES } from '../../config/aiTutorConfig';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(0.5),
        opacity: 0.7,
        transition: 'opacity 0.2s',
        '&:hover': {
            opacity: 1,
        },
    },
    feedbackButton: {
        padding: 4,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    thumbUp: {
        color: theme.palette.success.main,
    },
    thumbDown: {
        color: theme.palette.error.main,
    },
    reportButton: {
        marginLeft: theme.spacing(1),
        fontSize: '0.7rem',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.warning.main,
            textDecoration: 'underline',
        },
    },
    submitted: {
        fontSize: '0.75rem',
        color: theme.palette.success.main,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
}));

function AIFeedback({ messageId, userId, language = 'en' }) {
    const classes = useStyles();
    const [feedback, setFeedback] = useState(null); // null, 'helpful', 'not_helpful', 'error'
    const [submitted, setSubmitted] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const msg = AI_TUTOR_MESSAGES[language] || AI_TUTOR_MESSAGES.en;

    const handleFeedback = async (isHelpful, hasError = false) => {
        if (submitted) return;

        try {
            await aiTutor.submitFeedback(messageId, userId, isHelpful, hasError);
            setFeedback(hasError ? 'error' : (isHelpful ? 'helpful' : 'not_helpful'));
            setSubmitted(true);
            setShowSnackbar(true);
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    if (submitted) {
        return (
            <Box className={classes.container}>
                <Typography className={classes.submitted}>
                    {feedback === 'helpful' && <ThumbUpIcon fontSize="small" />}
                    {feedback === 'not_helpful' && <ThumbDownIcon fontSize="small" />}
                    {feedback === 'error' && <ReportProblemOutlinedIcon fontSize="small" />}
                    {msg.errorReported}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Box className={classes.container}>
                <Typography variant="caption" color="textSecondary">
                    {msg.feedbackPrompt}
                </Typography>

                <Tooltip title={msg.feedbackYes}>
                    <IconButton
                        className={classes.feedbackButton}
                        size="small"
                        onClick={() => handleFeedback(true)}
                    >
                        <ThumbUpOutlinedIcon fontSize="small" className={classes.thumbUp} />
                    </IconButton>
                </Tooltip>

                <Tooltip title={msg.feedbackNo}>
                    <IconButton
                        className={classes.feedbackButton}
                        size="small"
                        onClick={() => handleFeedback(false)}
                    >
                        <ThumbDownOutlinedIcon fontSize="small" className={classes.thumbDown} />
                    </IconButton>
                </Tooltip>

                <Typography
                    className={classes.reportButton}
                    onClick={() => handleFeedback(false, true)}
                >
                    {msg.reportError}
                </Typography>
            </Box>

            <Snackbar
                open={showSnackbar}
                autoHideDuration={2000}
                onClose={() => setShowSnackbar(false)}
                message={msg.errorReported}
            />
        </>
    );
}

export default AIFeedback;
