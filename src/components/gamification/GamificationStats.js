/**
 * GamificationStats Component
 * Displays XP, streak, and level in a compact header bar
 */

import React from 'react';
import { Box, Typography, Tooltip, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useGamification } from '../../util/GamificationContext';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '8px 16px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        // Mobile responsive
        [theme.breakpoints.down('sm')]: {
            gap: '8px',
            padding: '6px 10px',
        },
        [theme.breakpoints.down('xs')]: {
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '8px',
        },
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
        },
        [theme.breakpoints.down('sm')]: {
            gap: '4px',
            padding: '2px 4px',
        },
    },
    icon: {
        fontSize: '20px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '16px',
        },
    },
    value: {
        fontWeight: 700,
        fontSize: '14px',
        color: '#fff',
        [theme.breakpoints.down('sm')]: {
            fontSize: '12px',
        },
    },
    label: {
        fontSize: '11px',
        opacity: 0.8,
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        [theme.breakpoints.down('sm')]: {
            display: 'none', // Hide labels on mobile
        },
    },
    streakFire: {
        animation: '$pulse 1.5s ease-in-out infinite',
    },
    '@keyframes pulse': {
        '0%, 100%': {
            transform: 'scale(1)',
        },
        '50%': {
            transform: 'scale(1.1)',
        },
    },
    levelBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 12px',
        borderRadius: '20px',
        background: props => props.titleColor || '#7B2FF7',
        [theme.breakpoints.down('sm')]: {
            gap: '4px',
            padding: '3px 8px',
        },
    },
    levelNumber: {
        fontWeight: 800,
        fontSize: '14px',
        color: '#fff',
        [theme.breakpoints.down('sm')]: {
            fontSize: '12px',
        },
    },
    levelProgress: {
        width: '60px',
        height: '6px',
        borderRadius: '3px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        [theme.breakpoints.down('sm')]: {
            width: '40px',
            height: '4px',
        },
    },
    // Hide level title on very small screens
    levelTitle: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    levelProgressBar: {
        borderRadius: '3px',
        backgroundColor: '#fff',
    },
    xpGlow: {
        textShadow: '0 0 10px rgba(123, 47, 247, 0.5)',
    },
}));

const GamificationStats = ({ compact = false, onClick }) => {
    const { stats, streakData, getLevelInfo, getDailyGoalProgress, isLoaded } = useGamification();
    const levelInfo = getLevelInfo();
    const goalProgress = getDailyGoalProgress();
    const classes = useStyles({ titleColor: levelInfo.titleColor });

    if (!isLoaded) {
        return null;
    }

    if (compact) {
        // Super compact version for mobile
        return (
            <Box className={classes.container} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
                <Tooltip title={`Level ${levelInfo.level} - ${levelInfo.title}`}>
                    <Box className={classes.statItem}>
                        <span className={classes.icon}>⭐</span>
                        <Typography className={classes.value}>{levelInfo.level}</Typography>
                    </Box>
                </Tooltip>
                <Tooltip title={`${stats.totalXP} XP total`}>
                    <Box className={classes.statItem}>
                        <span className={classes.icon}>💎</span>
                        <Typography className={classes.value}>{formatNumber(stats.totalXP)}</Typography>
                    </Box>
                </Tooltip>
                <Tooltip title={`${streakData.currentStreak} day streak`}>
                    <Box className={classes.statItem}>
                        <span className={`${classes.icon} ${streakData.currentStreak > 0 ? classes.streakFire : ''}`}>
                            {streakData.currentStreak > 0 ? '🔥' : '❄️'}
                        </span>
                        <Typography className={classes.value}>{streakData.currentStreak}</Typography>
                    </Box>
                </Tooltip>
            </Box>
        );
    }

    // Full version for desktop
    return (
        <Box className={classes.container} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            {/* Level Badge */}
            <Tooltip title={`${levelInfo.xpInCurrentLevel}/${levelInfo.xpForNextLevel} XP to Level ${levelInfo.nextLevel || 'MAX'}`}>
                <Box className={classes.levelBadge}>
                    <Typography className={classes.levelNumber}>
                        Lv.{levelInfo.level}
                    </Typography>
                    <Box>
                        <Typography style={{ fontSize: '10px', color: '#fff', opacity: 0.9 }}>
                            {levelInfo.title}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={levelInfo.progressPercent}
                            classes={{
                                root: classes.levelProgress,
                                bar: classes.levelProgressBar,
                            }}
                        />
                    </Box>
                </Box>
            </Tooltip>

            {/* XP */}
            <Tooltip title={`${stats.totalXP} XP total • +${goalProgress.xpProgress} today`}>
                <Box className={classes.statItem}>
                    <span className={classes.icon}>💎</span>
                    <Box>
                        <Typography className={`${classes.value} ${classes.xpGlow}`}>
                            {formatNumber(stats.totalXP)}
                        </Typography>
                        <Typography className={classes.label}>XP</Typography>
                    </Box>
                </Box>
            </Tooltip>

            {/* Streak */}
            <Tooltip title={
                streakData.currentStreak > 0
                    ? `${streakData.currentStreak} day streak! Longest: ${streakData.longestStreak} days`
                    : 'Start a streak by practicing today!'
            }>
                <Box className={classes.statItem}>
                    <span className={`${classes.icon} ${streakData.currentStreak > 0 ? classes.streakFire : ''}`}>
                        {streakData.currentStreak > 0 ? '🔥' : '❄️'}
                    </span>
                    <Box>
                        <Typography className={classes.value}>
                            {streakData.currentStreak}
                        </Typography>
                        <Typography className={classes.label}>
                            {streakData.currentStreak === 1 ? 'Day' : 'Days'}
                        </Typography>
                    </Box>
                </Box>
            </Tooltip>

            {/* Daily Goal Progress (mini) */}
            {!goalProgress.isComplete && (
                <Tooltip title={`Daily goal: ${goalProgress.problemsProgress}/${goalProgress.problemsTarget} problems or ${goalProgress.xpProgress}/${goalProgress.xpTarget} XP`}>
                    <Box className={classes.statItem}>
                        <span className={classes.icon}>🎯</span>
                        <Box>
                            <Typography className={classes.value}>
                                {Math.round(goalProgress.percent)}%
                            </Typography>
                            <Typography className={classes.label}>Goal</Typography>
                        </Box>
                    </Box>
                </Tooltip>
            )}
            {goalProgress.isComplete && (
                <Tooltip title="Daily goal complete! Great job!">
                    <Box className={classes.statItem}>
                        <span className={classes.icon}>✅</span>
                        <Box>
                            <Typography className={classes.value} style={{ color: '#10B981' }}>
                                Done!
                            </Typography>
                            <Typography className={classes.label}>Goal</Typography>
                        </Box>
                    </Box>
                </Tooltip>
            )}
        </Box>
    );
};

/**
 * Format large numbers (1000 -> 1K)
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export default GamificationStats;
