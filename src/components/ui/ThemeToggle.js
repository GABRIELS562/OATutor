/**
 * ThemeToggle Component
 * Allows users to manually switch between light/dark/system theme
 * Persists preference to localStorage
 */

import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Brightness4Icon from '@material-ui/icons/Brightness4'; // Dark
import Brightness7Icon from '@material-ui/icons/Brightness7'; // Light
import SettingsBrightnessIcon from '@material-ui/icons/SettingsBrightness'; // System
import { useLocalization } from '../../util/LocalizationContext';

const THEME_STORAGE_KEY = 'angelo_theme_preference';

const useStyles = makeStyles((theme) => ({
    toggleButton: {
        color: 'inherit',
        padding: 8,
    },
    menuItem: {
        minWidth: 160,
    },
    activeItem: {
        backgroundColor: 'rgba(88, 204, 2, 0.1)',
    },
}));

const ThemeToggle = () => {
    const classes = useStyles();
    const { t } = useLocalization();
    const [anchorEl, setAnchorEl] = useState(null);
    const [theme, setTheme] = useState('system');

    // Load saved preference on mount
    useEffect(() => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
            setTheme(saved);
            applyTheme(saved);
        }
    }, []);

    const applyTheme = (newTheme) => {
        const root = document.documentElement;

        if (newTheme === 'system') {
            // Remove override, let system preference apply
            root.removeAttribute('data-theme');
            root.classList.remove('theme-light', 'theme-dark');
        } else if (newTheme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('theme-dark');
            root.classList.remove('theme-light');
        } else {
            root.setAttribute('data-theme', 'light');
            root.classList.add('theme-light');
            root.classList.remove('theme-dark');
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        applyTheme(newTheme);
        handleClose();
    };

    const getIcon = () => {
        switch (theme) {
            case 'dark':
                return <Brightness4Icon />;
            case 'light':
                return <Brightness7Icon />;
            default:
                return <SettingsBrightnessIcon />;
        }
    };

    const getTooltip = () => {
        switch (theme) {
            case 'dark':
                return t('theme.darkMode');
            case 'light':
                return t('theme.lightMode');
            default:
                return t('theme.systemTheme');
        }
    };

    return (
        <>
            <Tooltip title={getTooltip()}>
                <IconButton
                    className={classes.toggleButton}
                    onClick={handleClick}
                    aria-label={t('ariaLabels.changeTheme')}
                    aria-haspopup="true"
                    aria-expanded={Boolean(anchorEl)}
                >
                    {getIcon()}
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    onClick={() => handleThemeChange('light')}
                    className={`${classes.menuItem} ${theme === 'light' ? classes.activeItem : ''}`}
                >
                    <ListItemIcon>
                        <Brightness7Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t('theme.light')} />
                </MenuItem>
                <MenuItem
                    onClick={() => handleThemeChange('dark')}
                    className={`${classes.menuItem} ${theme === 'dark' ? classes.activeItem : ''}`}
                >
                    <ListItemIcon>
                        <Brightness4Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t('theme.dark')} />
                </MenuItem>
                <MenuItem
                    onClick={() => handleThemeChange('system')}
                    className={`${classes.menuItem} ${theme === 'system' ? classes.activeItem : ''}`}
                >
                    <ListItemIcon>
                        <SettingsBrightnessIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t('theme.system')} />
                </MenuItem>
            </Menu>
        </>
    );
};

export default ThemeToggle;
