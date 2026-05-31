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
            background: 'linear-gradient(135deg, #7B2FF7 0%, #9D5FFF 100%)',
        },
        '&::after': {
            background: 'linear-gradient(135deg, #9D5FFF 0%, #7B2FF7 100%)',
        },
        boxShadow: '0 4px 20px rgba(123, 47, 247, 0.4)',
        '&:hover': {
            boxShadow: '0 6px 30px rgba(123, 47, 247, 0.5)',
        },
    },
    secondary: {
        '&::before': {
            background: 'linear-gradient(135deg, #00D4FF 0%, #00A7CC 100%)',
        },
        '&::after': {
            background: 'linear-gradient(135deg, #00A7CC 0%, #00D4FF 100%)',
        },
        boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
        '&:hover': {
            boxShadow: '0 6px 30px rgba(0, 212, 255, 0.5)',
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
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        },
        '&::after': {
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
        },
        color: '#1a1a2e',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
        '&:hover': {
            boxShadow: '0 6px 30px rgba(245, 158, 11, 0.5)',
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
            background: 'linear-gradient(135deg, #F72585 0%, #FF6B9D 100%)',
        },
        '&::after': {
            background: 'linear-gradient(135deg, #FF6B9D 0%, #F72585 100%)',
        },
        boxShadow: '0 4px 20px rgba(247, 37, 133, 0.4)',
        '&:hover': {
            boxShadow: '0 6px 30px rgba(247, 37, 133, 0.5)',
        },
    },
    rainbow: {
        '&::before': {
            background: 'linear-gradient(135deg, #7B2FF7, #00D4FF, #10B981, #F59E0B, #F72585)',
            backgroundSize: '400% 400%',
            animation: '$rainbowShift 4s ease infinite',
        },
        '&::after': {
            background: 'linear-gradient(135deg, #F72585, #F59E0B, #10B981, #00D4FF, #7B2FF7)',
            backgroundSize: '400% 400%',
            animation: '$rainbowShift 4s ease infinite',
        },
        boxShadow: '0 4px 20px rgba(123, 47, 247, 0.4)',
        '&:hover': {
            boxShadow: '0 6px 30px rgba(123, 47, 247, 0.5)',
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
        borderColor: '#7B2FF7',
        color: '#7B2FF7',
        '&:hover': {
            background: 'rgba(123, 47, 247, 0.1)',
        },
    },
    outlinedSecondary: {
        borderColor: '#00D4FF',
        color: '#00D4FF',
        '&:hover': {
            background: 'rgba(0, 212, 255, 0.1)',
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
            boxShadow: '0 4px 20px rgba(123, 47, 247, 0.4)',
        },
        '50%': {
            boxShadow: '0 4px 40px rgba(123, 47, 247, 0.6)',
        },
        '100%': {
            boxShadow: '0 4px 20px rgba(123, 47, 247, 0.4)',
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
