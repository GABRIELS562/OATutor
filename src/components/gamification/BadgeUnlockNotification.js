/**
 * BadgeUnlockNotification Component
 * Shows when user earns a new badge
 */

import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Slide } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useGamification } from '../../util/GamificationContext';

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9998,
        maxWidth: '320px',
    },
    notification: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(123, 47, 247, 0.3)',
        animation: '$slideIn 0.3s ease-out',
    },
    iconContainer: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #7B2FF7 0%, #F72585 100%)',
        boxShadow: '0 4px 15px rgba(123, 47, 247, 0.4)',
        animation: '$bounce 0.5s ease-out 0.3s both',
    },
    icon: {
        fontSize: '32px',
    },
    content: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontWeight: 700,
        fontSize: '14px',
        marginBottom: '4px',
    },
    badgeName: {
        color: '#A855F7',
        fontWeight: 600,
        fontSize: '16px',
        marginBottom: '2px',
    },
    description: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px',
    },
    xpReward: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '8px',
        padding: '4px 10px',
        background: 'rgba(123, 47, 247, 0.2)',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#A855F7',
        fontWeight: 600,
    },
    closeBtn: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        color: 'rgba(255, 255, 255, 0.5)',
        padding: '4px',
        '&:hover': {
            color: '#fff',
        },
    },
    '@keyframes slideIn': {
        from: {
            transform: 'translateX(100%)',
            opacity: 0,
        },
        to: {
            transform: 'translateX(0)',
            opacity: 1,
        },
    },
    '@keyframes bounce': {
        '0%': {
            transform: 'scale(0)',
        },
        '50%': {
            transform: 'scale(1.2)',
        },
        '100%': {
            transform: 'scale(1)',
        },
    },
}));

const BadgeUnlockNotification = () => {
    const classes = useStyles();
    const { newBadges, clearNewBadges } = useGamification();
    const [currentBadge, setCurrentBadge] = useState(null);
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        if (newBadges.length > 0) {
            setQueue(prev => [...prev, ...newBadges]);
            clearNewBadges();
        }
    }, [newBadges, clearNewBadges]);

    useEffect(() => {
        if (!currentBadge && queue.length > 0) {
            setCurrentBadge(queue[0]);
            setQueue(prev => prev.slice(1));
        }
    }, [currentBadge, queue]);

    // Auto-dismiss after 5 seconds
    useEffect(() => {
        if (currentBadge) {
            const timer = setTimeout(() => {
                setCurrentBadge(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [currentBadge]);

    const handleClose = () => {
        setCurrentBadge(null);
    };

    if (!currentBadge) return null;

    return (
        <Slide direction="left" in={!!currentBadge} mountOnEnter unmountOnExit>
            <Box className={classes.container}>
                <Box className={classes.notification}>
                    <IconButton
                        className={classes.closeBtn}
                        onClick={handleClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>

                    <Box className={classes.iconContainer}>
                        <span className={classes.icon}>{currentBadge.icon}</span>
                    </Box>

                    <Box className={classes.content}>
                        <Typography className={classes.title}>
                            Badge Unlocked!
                        </Typography>
                        <Typography className={classes.badgeName}>
                            {currentBadge.name}
                        </Typography>
                        <Typography className={classes.description}>
                            {currentBadge.description}
                        </Typography>
                        {currentBadge.xpReward > 0 && (
                            <Box className={classes.xpReward}>
                                <span>+{currentBadge.xpReward} XP</span>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Slide>
    );
};

export default BadgeUnlockNotification;
