/**
 * XPNotification Component
 * Animated floating notification when XP is earned
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'none',
    },
    notification: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #7B2FF7 0%, #F72585 100%)',
        borderRadius: '30px',
        boxShadow: '0 8px 32px rgba(123, 47, 247, 0.4)',
        animation: '$popIn 0.3s ease-out, $floatUp 1.5s ease-in-out 0.3s forwards',
    },
    icon: {
        fontSize: '24px',
    },
    text: {
        color: '#fff',
        fontWeight: 700,
        fontSize: '18px',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    bonus: {
        fontSize: '12px',
        color: 'rgba(255,255,255,0.9)',
        fontWeight: 500,
    },
    '@keyframes popIn': {
        '0%': {
            transform: 'scale(0)',
            opacity: 0,
        },
        '50%': {
            transform: 'scale(1.2)',
        },
        '100%': {
            transform: 'scale(1)',
            opacity: 1,
        },
    },
    '@keyframes floatUp': {
        '0%': {
            transform: 'translateY(0)',
            opacity: 1,
        },
        '100%': {
            transform: 'translateY(-50px)',
            opacity: 0,
        },
    },
}));

const XPNotification = ({ amount, bonus = null, onComplete }) => {
    const classes = useStyles();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
        }, 1800);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!visible || amount <= 0) return null;

    return (
        <Box className={classes.container} role="status" aria-live="polite" aria-atomic="true">
            <Box className={classes.notification}>
                <span className={classes.icon} aria-hidden="true">💎</span>
                <Box>
                    <Typography className={classes.text}>
                        +{amount} XP
                    </Typography>
                    {bonus && (
                        <Typography className={classes.bonus}>
                            {bonus}
                        </Typography>
                    )}
                </Box>
            </Box>
            {/* Screen reader announcement */}
            <span className="sr-only">
                You earned {amount} experience points{bonus ? `. ${bonus}` : ''}
            </span>
        </Box>
    );
};

/**
 * XPNotificationManager - Manages queue of XP notifications
 */
export const XPNotificationManager = () => {
    const [notifications, setNotifications] = useState([]);

    // Expose method to show notifications globally
    useEffect(() => {
        window.showXPNotification = (amount, bonus = null) => {
            const id = Date.now();
            setNotifications(prev => [...prev, { id, amount, bonus }]);
        };

        return () => {
            delete window.showXPNotification;
        };
    }, []);

    const handleComplete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <>
            {notifications.map((notification, index) => (
                <Box
                    key={notification.id}
                    style={{
                        position: 'fixed',
                        top: `${20 + (index * 60)}%`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999 - index,
                    }}
                >
                    <XPNotification
                        amount={notification.amount}
                        bonus={notification.bonus}
                        onComplete={() => handleComplete(notification.id)}
                    />
                </Box>
            ))}
        </>
    );
};

export default XPNotification;
