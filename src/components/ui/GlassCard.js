/**
 * GlassCard - JSDT-style glassmorphism card component
 * Modern frosted glass effect with blur and transparency
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Box } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: theme.shape.borderRadius * 2,
        // Glassmorphism effect
        background: theme.palette.type === 'dark'
            ? 'rgba(60, 60, 60, 0.6)'
            : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${theme.palette.type === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.5)'}`,
        boxShadow: theme.palette.type === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.37)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
    },
    // Variants
    elevated: {
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.type === 'dark'
                ? '0 12px 48px rgba(0, 0, 0, 0.5)'
                : '0 12px 48px rgba(0, 0, 0, 0.15)',
        },
    },
    interactive: {
        cursor: 'pointer',
        '&:hover': {
            borderColor: theme.palette.primary.main,
            background: theme.palette.type === 'dark'
                ? 'rgba(88, 204, 2, 0.1)'
                : 'rgba(88, 204, 2, 0.05)',
        },
        '&:active': {
            transform: 'scale(0.98)',
        },
    },
    gradient: {
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #58CC02, #1CB0F6, #FF9600)',
            backgroundSize: '200% 100%',
            animation: '$shimmer 3s linear infinite',
        },
    },
    glow: {
        '&::after': {
            content: '""',
            position: 'absolute',
            top: -50,
            left: -50,
            right: -50,
            bottom: -50,
            background: 'radial-gradient(circle at 30% 30%, rgba(88, 204, 2, 0.15), transparent 50%)',
            pointerEvents: 'none',
        },
    },
    // Accent colors
    primary: {
        borderColor: 'rgba(88, 204, 2, 0.3)',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: '#58CC02',
            borderRadius: '16px 16px 0 0',
        },
    },
    secondary: {
        borderColor: 'rgba(28, 176, 246, 0.3)',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: '#1CB0F6',
            borderRadius: '16px 16px 0 0',
        },
    },
    success: {
        borderColor: 'rgba(16, 185, 129, 0.3)',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #10B981, #34D399)',
        },
    },
    warning: {
        borderColor: 'rgba(245, 158, 11, 0.3)',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
        },
    },
    error: {
        borderColor: 'rgba(239, 68, 68, 0.3)',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #EF4444, #F87171)',
        },
    },
    // Content
    content: {
        position: 'relative',
        zIndex: 1,
    },
    // Animation
    '@keyframes shimmer': {
        '0%': {
            backgroundPosition: '-200% 0',
        },
        '100%': {
            backgroundPosition: '200% 0',
        },
    },
}));

const GlassCard = React.forwardRef(({
    children,
    className,
    variant = 'default', // default, elevated, interactive
    color, // primary, secondary, success, warning, error
    gradient = false,
    glow = false,
    padding = 3,
    onClick,
    component: Component = Paper,
    ...props
}, ref) => {
    const classes = useStyles();

    const rootClassName = clsx(
        classes.root,
        {
            [classes.elevated]: variant === 'elevated',
            [classes.interactive]: variant === 'interactive' || onClick,
            [classes.gradient]: gradient,
            [classes.glow]: glow,
            [classes.primary]: color === 'primary',
            [classes.secondary]: color === 'secondary',
            [classes.success]: color === 'success',
            [classes.warning]: color === 'warning',
            [classes.error]: color === 'error',
        },
        className
    );

    return (
        <Component
            ref={ref}
            className={rootClassName}
            elevation={0}
            onClick={onClick}
            {...props}
        >
            <Box className={classes.content} p={padding}>
                {children}
            </Box>
        </Component>
    );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
