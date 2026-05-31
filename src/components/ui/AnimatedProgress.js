/**
 * AnimatedProgress - Smooth animated progress bar with multiple styles
 * Features gradient fills, animations, and milestone markers
 */

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    // Header with label and value
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
    },
    label: {
        fontWeight: 500,
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
    },
    value: {
        fontWeight: 600,
        color: theme.palette.text.primary,
        fontSize: '0.875rem',
    },
    // Track (background)
    track: {
        position: 'relative',
        width: '100%',
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: theme.palette.type === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.08)',
    },
    // Bar (fill)
    bar: {
        height: '100%',
        borderRadius: 100,
        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
    },
    // Sizes
    small: {
        height: 6,
    },
    medium: {
        height: 10,
    },
    large: {
        height: 16,
    },
    // Color variants
    primary: {
        background: 'linear-gradient(90deg, #7B2FF7 0%, #9D5FFF 100%)',
    },
    secondary: {
        background: 'linear-gradient(90deg, #00D4FF 0%, #00A7CC 100%)',
    },
    success: {
        background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
    },
    warning: {
        background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
    },
    danger: {
        background: 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)',
    },
    rainbow: {
        background: 'linear-gradient(90deg, #7B2FF7, #00D4FF, #10B981, #F59E0B, #F72585)',
        backgroundSize: '200% 100%',
        animation: '$shimmer 2s linear infinite',
    },
    // Shimmer animation
    shimmer: {
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: '$shimmerMove 2s linear infinite',
        },
    },
    // Glow effect
    glow: {
        boxShadow: '0 0 20px rgba(123, 47, 247, 0.5)',
    },
    // Striped pattern
    striped: {
        backgroundImage: `linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
        )`,
        backgroundSize: '1rem 1rem',
        animation: '$stripeMove 1s linear infinite',
    },
    // Milestones
    milestones: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        pointerEvents: 'none',
    },
    milestone: {
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 4,
        height: '140%',
        backgroundColor: theme.palette.type === 'dark'
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
    },
    milestoneLabel: {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: 4,
        fontSize: '0.65rem',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
    },
    // Completed state
    completed: {
        background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
    },
    // Animations
    '@keyframes shimmerMove': {
        '0%': {
            left: '-100%',
        },
        '100%': {
            left: '100%',
        },
    },
    '@keyframes shimmer': {
        '0%': {
            backgroundPosition: '-200% 0',
        },
        '100%': {
            backgroundPosition: '200% 0',
        },
    },
    '@keyframes stripeMove': {
        '0%': {
            backgroundPosition: '0 0',
        },
        '100%': {
            backgroundPosition: '1rem 0',
        },
    },
    '@keyframes pulse': {
        '0%, 100%': {
            opacity: 1,
        },
        '50%': {
            opacity: 0.7,
        },
    },
    // Indeterminate
    indeterminate: {
        width: '30%',
        animation: '$indeterminate 1.5s ease-in-out infinite',
    },
    '@keyframes indeterminate': {
        '0%': {
            transform: 'translateX(-100%)',
        },
        '100%': {
            transform: 'translateX(400%)',
        },
    },
}));

const AnimatedProgress = ({
    value = 0,
    max = 100,
    label,
    showValue = true,
    valueFormat, // function to format value display
    size = 'medium', // small, medium, large
    color = 'primary', // primary, secondary, success, warning, danger, rainbow
    animated = true,
    shimmer = false,
    striped = false,
    glow = false,
    indeterminate = false,
    milestones = [], // [{value: 25, label: '25%'}, ...]
    className,
    ...props
}) => {
    const classes = useStyles();
    const [displayValue, setDisplayValue] = useState(0);

    // Animate value on change
    useEffect(() => {
        if (!animated) {
            setDisplayValue(value);
            return;
        }

        // Animate from current to new value
        const duration = 800;
        const startTime = Date.now();
        const startValue = displayValue;
        const endValue = Math.min(value, max);

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplayValue(startValue + (endValue - startValue) * eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, max, animated]);

    const percentage = Math.min((displayValue / max) * 100, 100);
    const isCompleted = percentage >= 100;

    const trackClassName = clsx(
        classes.track,
        classes[size]
    );

    const barClassName = clsx(
        classes.bar,
        classes[color],
        {
            [classes.shimmer]: shimmer && !indeterminate,
            [classes.striped]: striped,
            [classes.glow]: glow,
            [classes.completed]: isCompleted && color !== 'rainbow',
            [classes.indeterminate]: indeterminate,
        }
    );

    const formatValue = valueFormat || ((v, m) => `${Math.round(v)}/${m}`);

    return (
        <Box className={clsx(classes.root, className)} {...props}>
            {(label || showValue) && (
                <Box className={classes.header}>
                    {label && (
                        <Typography className={classes.label}>
                            {label}
                        </Typography>
                    )}
                    {showValue && !indeterminate && (
                        <Typography className={classes.value}>
                            {formatValue(displayValue, max)}
                        </Typography>
                    )}
                </Box>
            )}

            <Box className={trackClassName}>
                <Box
                    className={barClassName}
                    style={{
                        width: indeterminate ? undefined : `${percentage}%`,
                    }}
                />

                {/* Milestones */}
                {milestones.length > 0 && (
                    <Box className={classes.milestones}>
                        {milestones.map((milestone, index) => (
                            <Box
                                key={index}
                                className={classes.milestone}
                                style={{ left: `${(milestone.value / max) * 100}%` }}
                            >
                                {milestone.label && (
                                    <span className={classes.milestoneLabel}>
                                        {milestone.label}
                                    </span>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default AnimatedProgress;
