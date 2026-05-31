/**
 * LanguageToggle - Bilingual toggle between English and Afrikaans
 *
 * A simple, accessible toggle switch for switching between languages.
 * Persists preference to database and localStorage.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    ButtonGroup,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import {
    Language as LanguageIcon,
    Check as CheckIcon,
} from '@material-ui/icons';
import { useLocalization } from '../util/LocalizationContext';

const useStyles = makeStyles((theme) => ({
    // Toggle button style
    toggleButton: {
        minWidth: 40,
        padding: '4px 12px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        transition: 'all 0.2s ease',
        '&.active': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
        },
    },
    // Compact version for nav
    compactToggle: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.2)',
        },
    },
    compactText: {
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'white',
        textTransform: 'uppercase',
    },
    // Floating toggle
    floatingToggle: {
        position: 'fixed',
        bottom: 80,
        right: 16,
        zIndex: 1000,
        borderRadius: '50%',
        width: 48,
        height: 48,
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    // Menu styles
    menuItem: {
        minWidth: 160,
    },
    activeMenuItem: {
        backgroundColor: 'rgba(88, 204, 2, 0.1)',
    },
}));

/**
 * Button Group Toggle (default)
 */
export const LanguageToggleButtons = ({ size = 'small' }) => {
    const classes = useStyles();
    const { language, setLanguage } = useLocalization();

    return (
        <ButtonGroup size={size} variant="outlined" color="primary">
            <Button
                className={`${classes.toggleButton} ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                aria-label="Switch to English"
            >
                EN
            </Button>
            <Button
                className={`${classes.toggleButton} ${language === 'af' ? 'active' : ''}`}
                onClick={() => setLanguage('af')}
                aria-pressed={language === 'af'}
                aria-label="Skakel na Afrikaans"
            >
                AF
            </Button>
        </ButtonGroup>
    );
};

/**
 * Compact Toggle for Navigation Bar
 */
export const LanguageToggleCompact = ({ className }) => {
    const classes = useStyles();
    const { language, toggleLanguage } = useLocalization();

    return (
        <Tooltip title={language === 'en' ? 'Skakel na Afrikaans' : 'Switch to English'}>
            <div
                className={`${classes.compactToggle} ${className || ''}`}
                onClick={toggleLanguage}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && toggleLanguage()}
                aria-label={language === 'en' ? 'Switch to Afrikaans' : 'Switch to English'}
            >
                <LanguageIcon style={{ fontSize: 16 }} />
                <span className={classes.compactText}>
                    {language === 'en' ? 'EN' : 'AF'}
                </span>
            </div>
        </Tooltip>
    );
};

/**
 * Icon Button with Dropdown Menu
 */
export const LanguageToggleMenu = ({ iconColor = 'inherit' }) => {
    const classes = useStyles();
    const { language, setLanguage, SUPPORTED_LANGUAGES, LANGUAGE_NAMES } = useLocalization();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (lang) => {
        setLanguage(lang);
        handleClose();
    };

    return (
        <>
            <Tooltip title={LANGUAGE_NAMES[language]}>
                <IconButton
                    onClick={handleClick}
                    aria-controls="language-menu"
                    aria-haspopup="true"
                    aria-label="Select language"
                    style={{ color: iconColor }}
                >
                    <LanguageIcon />
                </IconButton>
            </Tooltip>
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {SUPPORTED_LANGUAGES.map((lang) => (
                    <MenuItem
                        key={lang}
                        onClick={() => handleSelect(lang)}
                        className={`${classes.menuItem} ${language === lang ? classes.activeMenuItem : ''}`}
                    >
                        {language === lang && (
                            <ListItemIcon style={{ minWidth: 32 }}>
                                <CheckIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                        )}
                        <ListItemText
                            primary={LANGUAGE_NAMES[lang]}
                            style={{ marginLeft: language === lang ? 0 : 32 }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

/**
 * Floating Action Button Toggle (for mobile)
 */
export const LanguageToggleFAB = () => {
    const classes = useStyles();
    const { language, toggleLanguage, LANGUAGE_NAMES } = useLocalization();

    return (
        <Tooltip title={`${LANGUAGE_NAMES[language]} - Tap to switch`}>
            <IconButton
                className={classes.floatingToggle}
                onClick={toggleLanguage}
                aria-label={language === 'en' ? 'Switch to Afrikaans' : 'Switch to English'}
            >
                <span style={{ fontSize: 14, fontWeight: 700 }}>
                    {language.toUpperCase()}
                </span>
            </IconButton>
        </Tooltip>
    );
};

/**
 * Simple Text Toggle
 */
export const LanguageToggleText = ({ className, showIcon = true }) => {
    const { language, toggleLanguage, LANGUAGE_NAMES } = useLocalization();
    const otherLang = language === 'en' ? 'af' : 'en';

    return (
        <Button
            variant="text"
            size="small"
            onClick={toggleLanguage}
            className={className}
            startIcon={showIcon ? <LanguageIcon /> : null}
            aria-label={`Switch to ${LANGUAGE_NAMES[otherLang]}`}
        >
            {LANGUAGE_NAMES[otherLang]}
        </Button>
    );
};

// Default export is the button group
export default LanguageToggleButtons;
