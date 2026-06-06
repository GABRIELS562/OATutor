/**
 * Skeleton Loader Component
 * Provides loading placeholder animations for lesson cards and problem content
 * Mobile-optimized for SA students on phones
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardActions, Grid, Box } from '@material-ui/core';
import { useLocalization } from '../../util/LocalizationContext';

const useStyles = makeStyles((theme) => ({
    // Base skeleton animation
    skeleton: {
        background: 'linear-gradient(90deg, rgba(88, 204, 2, 0.05) 25%, rgba(88, 204, 2, 0.12) 50%, rgba(88, 204, 2, 0.05) 75%)',
        backgroundSize: '200% 100%',
        animation: '$shimmer 1.5s infinite ease-in-out',
        borderRadius: 8,
    },
    '@keyframes shimmer': {
        '0%': { backgroundPosition: '200% 0' },
        '100%': { backgroundPosition: '-200% 0' },
    },

    // Lesson card skeleton
    lessonCardSkeleton: {
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(88, 204, 2, 0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeader: {
        height: 120,
        background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.15) 0%, rgba(0, 212, 255, 0.15) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            height: 100,
            padding: theme.spacing(2),
        },
    },
    iconPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        marginBottom: theme.spacing(1.5),
    },
    titlePlaceholder: {
        width: '70%',
        height: 24,
        borderRadius: 4,
    },
    cardBody: {
        padding: theme.spacing(3),
        flexGrow: 1,
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(2),
        },
    },
    textLine: {
        height: 14,
        marginBottom: theme.spacing(1),
        borderRadius: 4,
    },
    textLineLong: {
        width: '100%',
    },
    textLineMedium: {
        width: '80%',
    },
    textLineShort: {
        width: '50%',
    },
    chip: {
        width: 80,
        height: 24,
        borderRadius: 12,
        marginTop: theme.spacing(1),
    },
    cardFooter: {
        padding: theme.spacing(2, 3),
        borderTop: '1px solid #f1f5f9',
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1.5, 2),
        },
    },
    button: {
        width: '100%',
        height: 44,
        borderRadius: 10,
        [theme.breakpoints.down('xs')]: {
            height: 48, // Larger touch target on mobile
        },
    },

    // Problem card skeleton
    problemCardSkeleton: {
        borderRadius: 16,
        boxShadow: '0 4px 25px rgba(88, 204, 2, 0.08)',
        padding: theme.spacing(3),
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(2),
            marginBottom: theme.spacing(1.5),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    },
    problemHeader: {
        height: 28,
        width: '60%',
        marginBottom: theme.spacing(2),
        borderRadius: 4,
    },
    problemBody: {
        marginBottom: theme.spacing(3),
    },
    inputArea: {
        height: 50,
        width: '100%',
        borderRadius: 10,
        marginBottom: theme.spacing(2),
    },
    submitButton: {
        height: 48,
        width: 150,
        borderRadius: 10,
        margin: '0 auto',
        display: 'block',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: 52,
        },
    },

    // Feature card skeleton (for home page)
    featureCardSkeleton: {
        padding: theme.spacing(3),
        textAlign: 'center',
        borderRadius: 16,
        border: '1px solid rgba(88, 204, 2, 0.1)',
        height: '100%',
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(2),
        },
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        margin: '0 auto',
        marginBottom: theme.spacing(2),
    },
    featureTitle: {
        width: '60%',
        height: 20,
        margin: '0 auto',
        marginBottom: theme.spacing(1),
        borderRadius: 4,
    },
    featureText: {
        width: '90%',
        height: 14,
        margin: '0 auto',
        marginBottom: theme.spacing(0.5),
        borderRadius: 4,
    },

    // Loading spinner overlay
    spinnerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        borderRadius: 'inherit',
    },
    spinner: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '3px solid rgba(88, 204, 2, 0.2)',
        borderTopColor: '#58CC02',
        animation: '$spin 0.8s linear infinite',
        [theme.breakpoints.down('xs')]: {
            width: 32,
            height: 32,
        },
    },
    '@keyframes spin': {
        to: { transform: 'rotate(360deg)' },
    },
    spinnerText: {
        marginTop: theme.spacing(1.5),
        color: '#58CC02',
        fontWeight: 500,
        fontSize: 14,
        [theme.breakpoints.down('xs')]: {
            fontSize: 13,
        },
    },

    // Progress indicator
    progressDots: {
        display: 'flex',
        gap: 6,
        justifyContent: 'center',
        marginTop: theme.spacing(1),
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'rgba(88, 204, 2, 0.3)',
        animation: '$pulse 1.4s ease-in-out infinite',
        '&:nth-child(2)': {
            animationDelay: '0.2s',
        },
        '&:nth-child(3)': {
            animationDelay: '0.4s',
        },
    },
    '@keyframes pulse': {
        '0%, 100%': {
            transform: 'scale(1)',
            background: 'rgba(88, 204, 2, 0.3)',
        },
        '50%': {
            transform: 'scale(1.2)',
            background: '#58CC02',
        },
    },
}));

/**
 * Lesson Card Skeleton - shown while loading lessons
 */
export const LessonCardSkeleton = ({ count = 1 }) => {
    const classes = useStyles();

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card className={classes.lessonCardSkeleton}>
                        <div className={classes.cardHeader}>
                            <div className={`${classes.skeleton} ${classes.iconPlaceholder}`} />
                            <div className={`${classes.skeleton} ${classes.titlePlaceholder}`} />
                        </div>
                        <CardContent className={classes.cardBody}>
                            <div className={`${classes.skeleton} ${classes.textLine} ${classes.textLineLong}`} />
                            <div className={`${classes.skeleton} ${classes.textLine} ${classes.textLineMedium}`} />
                            <div className={`${classes.skeleton} ${classes.chip}`} />
                        </CardContent>
                        <CardActions className={classes.cardFooter}>
                            <div className={`${classes.skeleton} ${classes.button}`} />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </>
    );
};

/**
 * Course Card Skeleton - shown while loading courses
 */
export const CourseCardSkeleton = ({ count = 1 }) => {
    const classes = useStyles();

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card className={classes.lessonCardSkeleton}>
                        <div className={classes.cardHeader} style={{ height: 140 }}>
                            <div className={`${classes.skeleton} ${classes.iconPlaceholder}`} style={{ width: 56, height: 56 }} />
                            <div className={`${classes.skeleton} ${classes.titlePlaceholder}`} style={{ width: '50%', height: 28 }} />
                        </div>
                        <CardContent className={classes.cardBody}>
                            <div className={`${classes.skeleton} ${classes.textLine} ${classes.textLineLong}`} />
                            <div className={`${classes.skeleton} ${classes.textLine} ${classes.textLineMedium}`} />
                            <div className={`${classes.skeleton} ${classes.chip}`} />
                        </CardContent>
                        <CardActions className={classes.cardFooter}>
                            <div className={`${classes.skeleton} ${classes.button}`} />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </>
    );
};

/**
 * Problem Card Skeleton - shown while loading problem
 */
export const ProblemCardSkeleton = () => {
    const classes = useStyles();

    return (
        <Card className={classes.problemCardSkeleton}>
            <div className={`${classes.skeleton} ${classes.problemHeader}`} />
            <div className={classes.problemBody}>
                <div className={`${classes.skeleton} ${classes.textLine} ${classes.textLineLong}`} />
                <div className={`${classes.skeleton} ${classes.textLine} ${classes.textLineLong}`} />
                <div className={`${classes.skeleton} ${classes.textLine} ${classes.textLineMedium}`} />
            </div>
            <div className={`${classes.skeleton} ${classes.inputArea}`} />
            <div className={`${classes.skeleton} ${classes.submitButton}`} />
        </Card>
    );
};

/**
 * Feature Card Skeleton - shown on home page while loading
 */
export const FeatureCardSkeleton = ({ count = 4 }) => {
    const classes = useStyles();

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <div className={classes.featureCardSkeleton}>
                        <div className={`${classes.skeleton} ${classes.featureIcon}`} />
                        <div className={`${classes.skeleton} ${classes.featureTitle}`} />
                        <div className={`${classes.skeleton} ${classes.featureText}`} />
                        <div className={`${classes.skeleton} ${classes.featureText}`} style={{ width: '70%' }} />
                    </div>
                </Grid>
            ))}
        </>
    );
};

/**
 * Loading Spinner - shows while content is loading
 */
export const LoadingSpinner = ({ text, overlay = false, size = "medium" }) => {
    const classes = useStyles();
    const { t } = useLocalization();

    // Use translated default if no text prop provided
    const displayText = text !== undefined ? text : t('ui.loading');

    const sizes = {
        small: { spinner: 24, text: 12 },
        medium: { spinner: 40, text: 14 },
        large: { spinner: 56, text: 16 },
    };

    const currentSize = sizes[size] || sizes.medium;

    const content = (
        <>
            <div
                className={classes.spinner}
                style={{ width: currentSize.spinner, height: currentSize.spinner }}
                role="status"
                aria-label={t('ui.loading')}
            />
            {displayText && (
                <div className={classes.spinnerText} style={{ fontSize: currentSize.text }}>
                    {displayText}
                </div>
            )}
        </>
    );

    if (overlay) {
        return (
            <div className={classes.spinnerOverlay}>
                {content}
            </div>
        );
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
            {content}
        </Box>
    );
};

/**
 * Progress Dots - animated dots showing activity
 */
export const ProgressDots = () => {
    const classes = useStyles();

    return (
        <div className={classes.progressDots}>
            <div className={classes.progressDot} />
            <div className={classes.progressDot} />
            <div className={classes.progressDot} />
        </div>
    );
};

/**
 * Page Loading Skeleton - full page loading state
 */
export const PageLoadingSkeleton = () => {
    const classes = useStyles();

    return (
        <Box px={2} py={4}>
            <Box mb={4} textAlign="center">
                <div className={`${classes.skeleton}`} style={{ width: '40%', height: 32, margin: '0 auto', borderRadius: 8 }} />
                <div className={`${classes.skeleton}`} style={{ width: '60%', height: 16, margin: '16px auto 0', borderRadius: 4 }} />
            </Box>
            <Grid container spacing={3}>
                <CourseCardSkeleton count={3} />
            </Grid>
        </Box>
    );
};

const SkeletonLoaderComponents = {
    LessonCardSkeleton,
    CourseCardSkeleton,
    ProblemCardSkeleton,
    FeatureCardSkeleton,
    LoadingSpinner,
    ProgressDots,
    PageLoadingSkeleton,
};

export default SkeletonLoaderComponents;
