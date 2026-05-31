/**
 * LevelUpCelebration Component
 * Full-screen celebration when user levels up
 */

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useGamification } from '../../util/GamificationContext';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        animation: '$fadeIn 0.5s ease-out',
    },
    confetti: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
    },
    confettiPiece: {
        position: 'absolute',
        width: '10px',
        height: '10px',
        animation: '$fall 3s ease-in-out infinite',
    },
    levelBadge: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: props => `linear-gradient(135deg, ${props.color} 0%, ${props.colorLight} 100%)`,
        boxShadow: props => `0 0 60px ${props.color}60`,
        animation: '$pulse 2s ease-in-out infinite, $scaleIn 0.5s ease-out',
        marginBottom: '24px',
    },
    levelNumber: {
        fontSize: '48px',
        fontWeight: 800,
        color: '#fff',
        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
    },
    title: {
        fontSize: '36px',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '8px',
        textAlign: 'center',
        animation: '$slideUp 0.5s ease-out 0.2s both',
    },
    subtitle: {
        fontSize: '24px',
        fontWeight: 600,
        marginBottom: '16px',
        textAlign: 'center',
        animation: '$slideUp 0.5s ease-out 0.3s both',
    },
    description: {
        fontSize: '16px',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: '32px',
        textAlign: 'center',
        animation: '$slideUp 0.5s ease-out 0.4s both',
    },
    continueBtn: {
        padding: '12px 48px',
        fontSize: '18px',
        fontWeight: 600,
        borderRadius: '30px',
        background: 'linear-gradient(135deg, #1CB0F6 0%, #58CC02 100%)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(88, 204, 2, 0.4)',
        animation: '$slideUp 0.5s ease-out 0.5s both',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 30px rgba(88, 204, 2, 0.6)',
        },
    },
    stars: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        animation: '$slideUp 0.5s ease-out 0.25s both',
    },
    star: {
        fontSize: '32px',
        animation: '$spin 1s ease-out',
    },
    '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
    },
    '@keyframes scaleIn': {
        '0%': {
            transform: 'scale(0) rotate(-180deg)',
        },
        '50%': {
            transform: 'scale(1.2) rotate(10deg)',
        },
        '100%': {
            transform: 'scale(1) rotate(0deg)',
        },
    },
    '@keyframes pulse': {
        '0%, 100%': {
            transform: 'scale(1)',
        },
        '50%': {
            transform: 'scale(1.05)',
        },
    },
    '@keyframes slideUp': {
        from: {
            opacity: 0,
            transform: 'translateY(30px)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
    '@keyframes spin': {
        from: {
            transform: 'rotate(0deg) scale(0)',
        },
        to: {
            transform: 'rotate(360deg) scale(1)',
        },
    },
    '@keyframes fall': {
        '0%': {
            transform: 'translateY(-100%) rotate(0deg)',
            opacity: 1,
        },
        '100%': {
            transform: 'translateY(100vh) rotate(720deg)',
            opacity: 0,
        },
    },
}));

const LevelUpCelebration = () => {
    const { showLevelUp, clearLevelUp, getLevelInfo } = useGamification();
    const levelInfo = getLevelInfo();

    const color = levelInfo.titleColor || '#58CC02';
    const colorLight = lightenColor(color, 30);
    const classes = useStyles({ color, colorLight });

    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        if (showLevelUp) {
            // Generate confetti
            const pieces = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                delay: `${Math.random() * 2}s`,
                color: ['#58CC02', '#1CB0F6', '#FF9600', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
                size: Math.random() * 10 + 5,
            }));
            setConfetti(pieces);
        }
    }, [showLevelUp]);

    if (!showLevelUp) return null;

    return (
        <Backdrop
            open={showLevelUp}
            className={classes.backdrop}
            role="dialog"
            aria-modal="true"
            aria-labelledby="level-up-title"
            aria-describedby="level-up-description"
        >
            {/* Confetti - decorative */}
            <Box className={classes.confetti} aria-hidden="true">
                {confetti.map(piece => (
                    <Box
                        key={piece.id}
                        className={classes.confettiPiece}
                        style={{
                            left: piece.left,
                            animationDelay: piece.delay,
                            backgroundColor: piece.color,
                            width: piece.size,
                            height: piece.size,
                            borderRadius: Math.random() > 0.5 ? '50%' : '0',
                        }}
                    />
                ))}
            </Box>

            <Box className={classes.container} role="status" aria-live="assertive">
                {/* Level Badge */}
                <Box className={classes.levelBadge}>
                    <Typography className={classes.levelNumber}>
                        {levelInfo.level}
                    </Typography>
                </Box>

                {/* Stars */}
                <Box className={classes.stars}>
                    {[...Array(Math.min(levelInfo.level, 5))].map((_, i) => (
                        <span
                            key={i}
                            className={classes.star}
                            style={{ animationDelay: `${0.1 * i}s` }}
                        >
                            ⭐
                        </span>
                    ))}
                </Box>

                {/* Text */}
                <Typography id="level-up-title" className={classes.title}>
                    Level Up!
                </Typography>
                <span id="level-up-description" className="sr-only">
                    Congratulations! You reached level {levelInfo.level}
                </span>
                <Typography
                    className={classes.subtitle}
                    style={{ color: levelInfo.titleColor }}
                >
                    {levelInfo.title}
                </Typography>
                <Typography className={classes.description}>
                    You've reached Level {levelInfo.level}!
                    {levelInfo.nextLevelXP && (
                        <> Only {levelInfo.nextLevelXP - levelInfo.totalXP} XP to Level {levelInfo.nextLevel}.</>
                    )}
                </Typography>

                {/* Continue Button */}
                <Button
                    className={classes.continueBtn}
                    onClick={clearLevelUp}
                >
                    Continue Learning
                </Button>
            </Box>
        </Backdrop>
    );
};

/**
 * Lighten a hex color
 */
function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 0 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

export default LevelUpCelebration;
