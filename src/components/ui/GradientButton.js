/**
 * GradientButton - JSDT-style animated gradient button
 * Features smooth hover animations and customizable gradients
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 12,
        padding: '12px 28px',
        fontWeight: 600,
        fontSize: '0.95rem',
        textTransform: 'none',
        transition: 'all 0.3s ease',
        border: 'none',
        color: 'white',
        // Remove default button styles
        boxShadow: 'none',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 1,
            transition: 'opacity 0.3s ease',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            transition: 'opacity 0.3s ease',
        },
        '&:hover': {
            transform: 'translateY(-2px)',
            '&::before': {
                opacity: 0,
            },
            '&::after': {
                opacity: 1,
            },
        },
        '&:active': {
            transform: 'translateY(0)',
        },
        '&:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
            transform: 'none',
        },
    },
    // Button label (ensures text is above gradient)
    label: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(1),
    },
    // Gradient variants
    primary: {
        '&::before': {
            background: '#58CC02',
        },
        '&::after': {
            background: '#58A700',
        },
        boxShadow: '0 4px 0 0 #58A700',
        borderRadius: 16,
        '&:hover': {
            boxShadow: '0 2px 0 0 #4B9200',
        },
    },
    secondary: {
        '&::before': {
            background: '#1CB0F6',
        },
        '&::after': {
            background: '#0095D9',
        },
        boxShadow: '0 4px 0 0 #0095D9',
        borderRadius: 16,
        '&:hover': {
            boxShadow: '0 2px 0 0 #007AB8',
        },
    },
    success: {
        '&::before': {
            background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        },
        '&::after': {
            background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
        },
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
        '&:hover': {
            boxShadow: '0 6px 30px rgba(16, 185, 129, 0.5)',
        },
    },
    warning: {
        '&::before': {
            background: '#FF9600',
        },
        '&::after': {
            background: '#E68600',
        },
        color: '#FFFFFF',
        boxShadow: '0 4px 0 0 #E68600',
        borderRadius: 16,
        '&:hover': {
            boxShadow: '0 2px 0 0 #CC7700',
        },
    },
    danger: {
        '&::before': {
            background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
        },
        '&::after': {
            background: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)',
        },
        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
        '&:hover': {
            boxShadow: '0 6px 30px rgba(239, 68, 68, 0.5)',
        },
    },
    pink: {
        '&::before': {
            background: '#FF9600',
        },
        '&::after': {
            background: '#E68600',
        },
        boxShadow: '0 4px 0 0 #E68600',
        borderRadius: 16,
        '&:hover': {
            boxShadow: '0 2px 0 0 #CC7700',
        },
    },
    rainbow: {
        '&::before': {
            background: 'linear-gradient(135deg, #58CC02, #1CB0F6, #FF9600, #CE82FF, #FF4B4B)',
            backgroundSize: '400% 400%',
            animation: '$rainbowShift 4s ease infinite',
        },
        '&::after': {
            background: 'linear-gradient(135deg, #FF4B4B, #CE82FF, #FF9600, #1CB0F6, #58CC02)',
            backgroundSize: '400% 400%',
            animation: '$rainbowShift 4s ease infinite',
        },
        boxShadow: '0 4px 0 0 #58A700',
        borderRadius: 16,
        '&:hover': {
            boxShadow: '0 2px 0 0 #4B9200',
        },
    },
    // Outlined variant
    outlined: {
        background: 'transparent',
        border: '2px solid',
        '&::before, &::after': {
            display: 'none',
        },
    },
    outlinedPrimary: {
        borderColor: '#58CC02',
        color: '#58CC02',
        borderRadius: 16,
        '&:hover': {
            background: 'rgba(88, 204, 2, 0.1)',
        },
    },
    outlinedSecondary: {
        borderColor: '#1CB0F6',
        color: '#1CB0F6',
        borderRadius: 16,
        '&:hover': {
            background: 'rgba(28, 176, 246, 0.1)',
        },
    },
    // Sizes
    small: {
        padding: '8px 18px',
        fontSize: '0.85rem',
        borderRadius: 8,
    },
    large: {
        padding: '16px 36px',
        fontSize: '1.1rem',
        borderRadius: 14,
    },
    // Full width
    fullWidth: {
        width: '100%',
    },
    // Loading state
    loading: {
        pointerEvents: 'none',
    },
    spinner: {
        color: 'inherit',
    },
    // Animations
    '@keyframes rainbowShift': {
        '0%': {
            backgroundPosition: '0% 50%',
        },
        '50%': {
            backgroundPosition: '100% 50%',
        },
        '100%': {
            backgroundPosition: '0% 50%',
        },
    },
    // Pulse animation for CTA
    pulse: {
        animation: '$pulse 2s infinite',
    },
    '@keyframes pulse': {
        '0%': {
            boxShadow: '0 4px 0 0 #58A700',
        },
        '50%': {
            boxShadow: '0 4px 20px rgba(88, 204, 2, 0.6)',
        },
        '100%': {
            boxShadow: '0 4px 0 0 #58A700',
        },
    },
}));

const GradientButton = React.forwardRef(({
    children,
    className,
    color = 'primary', // primary, secondary, success, warning, danger, pink, rainbow
    variant = 'contained', // contained, outlined
    size = 'medium', // small, medium, large
    fullWidth = false,
    loading = false,
    pulse = false,
    startIcon,
    endIcon,
    disabled,
    ...props
}, ref) => {
    const classes = useStyles();

    const rootClassName = clsx(
        classes.root,
        {
            // Colors
            [classes.primary]: color === 'primary' && variant !== 'outlined',
            [classes.secondary]: color === 'secondary' && variant !== 'outlined',
            [classes.success]: color === 'success' && variant !== 'outlined',
            [classes.warning]: color === 'warning' && variant !== 'outlined',
            [classes.danger]: color === 'danger' && variant !== 'outlined',
            [classes.pink]: color === 'pink' && variant !== 'outlined',
            [classes.rainbow]: color === 'rainbow' && variant !== 'outlined',
            // Outlined
            [classes.outlined]: variant === 'outlined',
            [classes.outlinedPrimary]: variant === 'outlined' && color === 'primary',
            [classes.outlinedSecondary]: variant === 'outlined' && color === 'secondary',
            // Sizes
            [classes.small]: size === 'small',
            [classes.large]: size === 'large',
            // States
            [classes.fullWidth]: fullWidth,
            [classes.loading]: loading,
            [classes.pulse]: pulse,
        },
        className
    );

    return (
        <Button
            ref={ref}
            className={rootClassName}
            disabled={disabled || loading}
            {...props}
        >
            <span className={classes.label}>
                {loading ? (
                    <CircularProgress size={20} className={classes.spinner} />
                ) : (
                    <>
                        {startIcon}
                        {children}
                        {endIcon}
                    </>
                )}
            </span>
        </Button>
    );
});

GradientButton.displayName = 'GradientButton';

export default GradientButton;
