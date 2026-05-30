/**
 * ThemeToggle - Dark/Light mode toggle button
 *
 * A simple, accessible toggle for switching between light and dark mode.
 */

import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@material-ui/icons';
import { useThemeToggle } from '../util/ThemeToggleContext';
import { useLocalization } from '../util/LocalizationContext';

/**
 * Icon Button Theme Toggle
 */
export const ThemeToggleButton = ({ iconColor = 'inherit', size = 'medium' }) => {
    const { isDark, toggleTheme } = useThemeToggle();
    const { translate } = useLocalization();

    const label = isDark
        ? (translate?.('theme.switchToLight') || 'Switch to light mode')
        : (translate?.('theme.switchToDark') || 'Switch to dark mode');

    return (
        <Tooltip title={label}>
            <IconButton
                onClick={toggleTheme}
                aria-label={label}
                style={{ color: iconColor }}
                size={size}
            >
                {isDark ? <LightIcon /> : <DarkIcon />}
            </IconButton>
        </Tooltip>
    );
};

/**
 * Compact Toggle for small spaces
 */
export const ThemeToggleCompact = ({ className }) => {
    const { isDark, toggleTheme } = useThemeToggle();

    return (
        <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
            <div
                className={className}
                onClick={toggleTheme}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && toggleTheme()}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    borderRadius: 20,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
            >
                {isDark ? (
                    <LightIcon style={{ fontSize: 18, color: '#FFD700' }} />
                ) : (
                    <DarkIcon style={{ fontSize: 18, color: 'white' }} />
                )}
            </div>
        </Tooltip>
    );
};

// Default export
export default ThemeToggleButton;
