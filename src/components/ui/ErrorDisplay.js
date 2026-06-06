/**
 * Error Display Components
 * User-friendly error messages with retry mechanisms
 * Mobile-optimized for SA students on phones
 */

import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Typography, Paper, Collapse, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import StorageIcon from '@material-ui/icons/Storage';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import { useLocalization } from '../../util/LocalizationContext';

const useStyles = makeStyles((theme) => ({
    errorContainer: {
        textAlign: 'center',
        padding: theme.spacing(4),
        maxWidth: 500,
        margin: '0 auto',
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(3),
            margin: theme.spacing(2),
        },
    },
    errorPaper: {
        padding: theme.spacing(4),
        borderRadius: 16,
        border: '1px solid rgba(255, 75, 75, 0.15)',
        background: 'linear-gradient(180deg, rgba(255, 75, 75, 0.03) 0%, rgba(255, 255, 255, 1) 100%)',
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(3),
            borderRadius: 12,
        },
    },
    errorIcon: {
        fontSize: 64,
        color: '#FF4B4B',
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            fontSize: 48,
        },
    },
    warningIcon: {
        fontSize: 64,
        color: '#F59E0B',
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            fontSize: 48,
        },
    },
    infoIcon: {
        fontSize: 64,
        color: '#1CB0F6',
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            fontSize: 48,
        },
    },
    errorTitle: {
        fontWeight: 700,
        color: '#3C3C3C',
        marginBottom: theme.spacing(1),
        fontSize: '1.5rem',
        [theme.breakpoints.down('xs')]: {
            fontSize: '1.25rem',
        },
    },
    errorMessage: {
        color: '#64748B',
        marginBottom: theme.spacing(3),
        lineHeight: 1.6,
        fontSize: '1rem',
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.9rem',
            marginBottom: theme.spacing(2),
        },
    },
    retryButton: {
        background: 'linear-gradient(135deg, #58CC02 0%, #FF4B4B 100%)',
        color: '#fff',
        padding: theme.spacing(1.5, 4),
        borderRadius: 10,
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: '0 4px 15px rgba(88, 204, 2, 0.35)',
        minWidth: 150,
        minHeight: 48, // Touch-friendly
        '&:hover': {
            background: 'linear-gradient(135deg, #58CC02 0%, #FF4B4B 100%)',
            boxShadow: '0 6px 20px rgba(88, 204, 2, 0.45)',
            transform: 'translateY(-2px)',
        },
        '&:disabled': {
            background: '#E2E8F0',
            color: '#94A3B8',
            boxShadow: 'none',
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            padding: theme.spacing(1.5, 3),
        },
    },
    secondaryButton: {
        marginLeft: theme.spacing(2),
        borderColor: '#58CC02',
        color: '#58CC02',
        minHeight: 48,
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0,
            marginTop: theme.spacing(1.5),
            width: '100%',
        },
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            gap: theme.spacing(1.5),
        },
    },
    detailsToggle: {
        color: '#64748B',
        fontSize: '0.85rem',
        marginTop: theme.spacing(2),
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            color: '#58CC02',
        },
    },
    expandIcon: {
        transition: 'transform 0.3s ease',
    },
    expandIconRotated: {
        transform: 'rotate(180deg)',
    },
    technicalDetails: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: 'rgba(88, 204, 2, 0.04)',
        borderRadius: 8,
        textAlign: 'left',
        fontSize: '0.8rem',
        color: '#64748B',
        fontFamily: 'monospace',
        overflowX: 'auto',
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.75rem',
            padding: theme.spacing(1.5),
        },
    },
    offlineBanner: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #FF4B4B 0%, #E11D48 100%)',
        color: '#fff',
        padding: theme.spacing(1.5, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(1.5),
        zIndex: 9999,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1, 1.5),
            fontSize: '0.85rem',
        },
    },
    offlineIcon: {
        fontSize: 20,
        [theme.breakpoints.down('xs')]: {
            fontSize: 18,
        },
    },
    retryingText: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        color: '#58CC02',
        fontSize: '0.9rem',
        marginTop: theme.spacing(1),
    },
    retryCount: {
        background: 'rgba(88, 204, 2, 0.1)',
        padding: theme.spacing(0.5, 1.5),
        borderRadius: 20,
        fontSize: '0.8rem',
        color: '#58CC02',
        fontWeight: 500,
        marginTop: theme.spacing(1),
    },
    suggestionList: {
        textAlign: 'left',
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        color: '#64748B',
        '& li': {
            marginBottom: theme.spacing(0.5),
            fontSize: '0.9rem',
            [theme.breakpoints.down('xs')]: {
                fontSize: '0.85rem',
            },
        },
    },
}));

// Error types and their configurations - function that returns translated configs
const getErrorConfigs = (translate) => ({
    network: {
        icon: WifiOffIcon,
        title: t('errorDisplay.network.title'),
        message: t('errorDisplay.network.message'),
        suggestions: [
            t('errorDisplay.network.suggestions.checkData'),
            t('errorDisplay.network.suggestions.betterSignal'),
            t('errorDisplay.network.suggestions.waitAndRetry'),
        ],
    },
    server: {
        icon: StorageIcon,
        title: t('errorDisplay.server.title'),
        message: t('errorDisplay.server.message'),
        suggestions: [
            t('errorDisplay.server.suggestions.waitMinutes'),
            t('errorDisplay.server.suggestions.progressSaved'),
            t('errorDisplay.server.suggestions.refreshPage'),
        ],
    },
    content: {
        icon: ErrorOutlineIcon,
        title: t('errorDisplay.content.title'),
        message: t('errorDisplay.content.message'),
        suggestions: [
            t('errorDisplay.content.suggestions.goHome'),
            t('errorDisplay.content.suggestions.differentLesson'),
            t('errorDisplay.content.suggestions.contactSupport'),
        ],
    },
    generic: {
        icon: ErrorOutlineIcon,
        title: t('errorDisplay.generic.title'),
        message: t('errorDisplay.generic.message'),
        suggestions: [
            t('errorDisplay.generic.suggestions.refreshPage'),
            t('errorDisplay.generic.suggestions.clearCache'),
            t('errorDisplay.generic.suggestions.tryLater'),
        ],
    },
    timeout: {
        icon: WifiOffIcon,
        title: t('errorDisplay.timeout.title'),
        message: t('errorDisplay.timeout.message'),
        suggestions: [
            t('errorDisplay.timeout.suggestions.checkSpeed'),
            t('errorDisplay.timeout.suggestions.betterSignal'),
            t('errorDisplay.timeout.suggestions.strongerWifi'),
        ],
    },
});

/**
 * Main Error Display Component
 */
export const ErrorDisplay = ({
    type = 'generic',
    title,
    message,
    onRetry,
    onSecondaryAction,
    secondaryActionLabel,
    showDetails = false,
    errorDetails,
    retryCount = 0,
    maxRetries = 3,
    isRetrying = false,
}) => {
    const classes = useStyles();
    const { t } = useLocalization();
    const [detailsExpanded, setDetailsExpanded] = useState(false);

    const ERROR_CONFIGS = getErrorConfigs(t);
    const config = ERROR_CONFIGS[type] || ERROR_CONFIGS.generic;
    const defaultSecondaryLabel = secondaryActionLabel || t('errorDisplay.buttons.goHome');
    const IconComponent = config.icon;

    const canRetry = retryCount < maxRetries;
    const displayTitle = title || config.title;
    const displayMessage = message || config.message;

    return (
        <Box className={classes.errorContainer}>
            <Paper className={classes.errorPaper} elevation={0}>
                <IconComponent className={classes.errorIcon} />

                <Typography variant="h5" className={classes.errorTitle}>
                    {displayTitle}
                </Typography>

                <Typography className={classes.errorMessage}>
                    {displayMessage}
                </Typography>

                {config.suggestions && config.suggestions.length > 0 && (
                    <ul className={classes.suggestionList}>
                        {config.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                )}

                {retryCount > 0 && canRetry && (
                    <div className={classes.retryCount}>
                        {t('errorDisplay.retryAttempt').replace('{current}', retryCount).replace('{max}', maxRetries)}
                    </div>
                )}

                <Box className={classes.buttonContainer} mt={3}>
                    {onRetry && (
                        <Button
                            className={classes.retryButton}
                            onClick={onRetry}
                            disabled={!canRetry || isRetrying}
                            startIcon={isRetrying ? null : <RefreshIcon />}
                        >
                            {isRetrying ? t('errorDisplay.buttons.retrying') : canRetry ? t('errorDisplay.buttons.tryAgain') : t('errorDisplay.buttons.maxRetries')}
                        </Button>
                    )}

                    {onSecondaryAction && (
                        <Button
                            variant="outlined"
                            className={classes.secondaryButton}
                            onClick={onSecondaryAction}
                        >
                            {defaultSecondaryLabel}
                        </Button>
                    )}
                </Box>

                {showDetails && errorDetails && (
                    <>
                        <div
                            className={classes.detailsToggle}
                            onClick={() => setDetailsExpanded(!detailsExpanded)}
                        >
                            <span>{t('errorDisplay.technicalDetails')}</span>
                            <IconButton size="small">
                                <ExpandMoreIcon
                                    className={`${classes.expandIcon} ${detailsExpanded ? classes.expandIconRotated : ''}`}
                                />
                            </IconButton>
                        </div>

                        <Collapse in={detailsExpanded}>
                            <pre className={classes.technicalDetails}>
                                {typeof errorDetails === 'string'
                                    ? errorDetails
                                    : JSON.stringify(errorDetails, null, 2)}
                            </pre>
                        </Collapse>
                    </>
                )}
            </Paper>
        </Box>
    );
};

/**
 * Offline Banner - shows when user loses connection
 */
export const OfflineBanner = ({ onRetry }) => {
    const classes = useStyles();
    const { t } = useLocalization();

    return (
        <div className={classes.offlineBanner} role="alert">
            <WifiOffIcon className={classes.offlineIcon} />
            <span>{t('errorDisplay.offline.message')}</span>
            {onRetry && (
                <Button
                    size="small"
                    onClick={onRetry}
                    style={{
                        color: '#fff',
                        borderColor: '#fff',
                        minWidth: 'auto',
                        padding: '4px 12px',
                    }}
                    variant="outlined"
                >
                    {t('errorDisplay.offline.retry')}
                </Button>
            )}
        </div>
    );
};

/**
 * Warning Display - for non-critical issues
 */
export const WarningDisplay = ({ title, message, onDismiss }) => {
    const classes = useStyles();
    const { t } = useLocalization();

    return (
        <Box className={classes.errorContainer}>
            <Paper className={classes.errorPaper} elevation={0} style={{ borderColor: 'rgba(245, 158, 11, 0.15)' }}>
                <WarningIcon className={classes.warningIcon} />
                <Typography variant="h5" className={classes.errorTitle}>
                    {title || t('errorDisplay.warning.title')}
                </Typography>
                <Typography className={classes.errorMessage}>
                    {message}
                </Typography>
                {onDismiss && (
                    <Button
                        className={classes.retryButton}
                        onClick={onDismiss}
                        style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                    >
                        {t('errorDisplay.warning.understood')}
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

/**
 * Info Display - for informational messages
 */
export const InfoDisplay = ({ title, message, onAction, actionLabel }) => {
    const classes = useStyles();
    const { t } = useLocalization();
    const displayActionLabel = actionLabel || t('errorDisplay.info.continue');

    return (
        <Box className={classes.errorContainer}>
            <Paper className={classes.errorPaper} elevation={0} style={{ borderColor: 'rgba(28, 176, 246, 0.15)' }}>
                <InfoIcon className={classes.infoIcon} />
                <Typography variant="h5" className={classes.errorTitle}>
                    {title || t('errorDisplay.info.title')}
                </Typography>
                <Typography className={classes.errorMessage}>
                    {message}
                </Typography>
                {onAction && (
                    <Button
                        className={classes.retryButton}
                        onClick={onAction}
                        style={{ background: 'linear-gradient(135deg, #1CB0F6 0%, #0891B2 100%)' }}
                    >
                        {displayActionLabel}
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

/**
 * Custom hook for retry logic with exponential backoff
 */
export const useRetry = (asyncFn, options = {}) => {
    const {
        maxRetries = 3,
        initialDelay = 1000,
        maxDelay = 10000,
        backoffFactor = 2,
        onError,
        onSuccess,
    } = options;

    const [state, setState] = useState({
        isLoading: false,
        error: null,
        retryCount: 0,
        data: null,
    });

    const execute = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        let lastError = null;
        let currentDelay = initialDelay;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await asyncFn();
                setState({
                    isLoading: false,
                    error: null,
                    retryCount: attempt,
                    data: result,
                });
                if (onSuccess) onSuccess(result);
                return result;
            } catch (error) {
                lastError = error;
                setState(prev => ({
                    ...prev,
                    retryCount: attempt,
                    error: error,
                }));

                if (attempt < maxRetries) {
                    const delay = currentDelay;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    currentDelay = Math.min(currentDelay * backoffFactor, maxDelay);
                }
            }
        }

        setState(prev => ({
            ...prev,
            isLoading: false,
            error: lastError,
        }));

        if (onError) onError(lastError);
        return null;
    }, [asyncFn, maxRetries, initialDelay, maxDelay, backoffFactor, onError, onSuccess]);

    const reset = useCallback(() => {
        setState({
            isLoading: false,
            error: null,
            retryCount: 0,
            data: null,
        });
    }, []);

    return {
        ...state,
        execute,
        reset,
        canRetry: state.retryCount < maxRetries,
    };
};

/**
 * Detect error type from error object
 */
export const detectErrorType = (error) => {
    if (!navigator.onLine) return 'network';
    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) return 'network';
    if (error?.name === 'AbortError' || error?.message?.includes('timeout')) return 'timeout';
    if (error?.status === 404) return 'content';
    if (error?.status >= 500) return 'server';
    return 'generic';
};

const ErrorDisplayComponents = {
    ErrorDisplay,
    OfflineBanner,
    WarningDisplay,
    InfoDisplay,
    useRetry,
    detectErrorType,
};

export default ErrorDisplayComponents;
