/**
 * BottomNavigation - Mobile-optimized bottom navigation bar
 * JSDT-style with glassmorphism effect
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BottomNavigation as MuiBottomNav, BottomNavigationAction, Badge } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import {
    Home,
    School,
    CameraAlt,
    Description,
    Person,
} from '@material-ui/icons';
import { useLocalization } from '../../util/LocalizationContext';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        // Glassmorphism effect
        background: theme.palette.type === 'dark'
            ? 'rgba(15, 15, 35, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${theme.palette.type === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)'}`,
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.1)',
        // Safe area padding for notched devices
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
    },
    action: {
        minWidth: 60,
        padding: '6px 0 8px',
        transition: 'all 0.3s ease',
        '&.Mui-selected': {
            color: theme.palette.primary.main,
        },
        '& .MuiBottomNavigationAction-label': {
            fontSize: '0.65rem',
            fontWeight: 500,
            marginTop: 4,
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
                fontSize: '0.7rem',
                fontWeight: 600,
            },
        },
    },
    iconWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIcon: {
        color: theme.palette.primary.main,
        transform: 'scale(1.1)',
        transition: 'all 0.3s ease',
    },
    indicator: {
        position: 'absolute',
        top: -8,
        width: 4,
        height: 4,
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
    },
    badge: {
        '& .MuiBadge-badge': {
            top: -2,
            right: -2,
            backgroundColor: '#FF6B6B',
            color: 'white',
            fontSize: '0.65rem',
            minWidth: 16,
            height: 16,
        },
    },
}));

// Navigation items with translation keys
const NAV_ITEMS = [
    {
        labelKey: 'navigation.home',
        icon: Home,
        path: '/',
    },
    {
        labelKey: 'navigation.learn',
        icon: School,
        path: '/dashboard',
    },
    {
        labelKey: 'navigation.solve',
        icon: CameraAlt,
        path: '/solve-photo',
        highlight: true,
    },
    {
        labelKey: 'navigation.papers',
        icon: Description,
        path: '/past-papers',
    },
    {
        labelKey: 'navigation.profile',
        icon: Person,
        path: '/profile',
        badge: 0, // Set to number to show badge
    },
];

const BottomNavigation = ({ hidden = false }) => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const { t: translate } = useLocalization();

    // Find current nav item index
    const currentIndex = NAV_ITEMS.findIndex(item => {
        if (item.path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(item.path);
    });

    const handleChange = (event, newValue) => {
        const item = NAV_ITEMS[newValue];
        if (item && item.path !== location.pathname) {
            history.push(item.path);
        }
    };

    // Don't show on certain pages (e.g., admin)
    if (hidden || location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <MuiBottomNav
            value={currentIndex >= 0 ? currentIndex : 0}
            onChange={handleChange}
            showLabels
            className={classes.root}
        >
            {NAV_ITEMS.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === currentIndex;

                return (
                    <BottomNavigationAction
                        key={item.path}
                        label={translate(item.labelKey)}
                        className={classes.action}
                        icon={
                            <div className={classes.iconWrapper}>
                                {isSelected && <span className={classes.indicator} />}
                                {item.badge !== undefined && item.badge > 0 ? (
                                    <Badge
                                        badgeContent={item.badge}
                                        className={classes.badge}
                                    >
                                        <Icon
                                            className={isSelected ? classes.selectedIcon : ''}
                                            fontSize="small"
                                        />
                                    </Badge>
                                ) : (
                                    <Icon
                                        className={isSelected ? classes.selectedIcon : ''}
                                        fontSize="small"
                                    />
                                )}
                            </div>
                        }
                    />
                );
            })}
        </MuiBottomNav>
    );
};

export default BottomNavigation;
