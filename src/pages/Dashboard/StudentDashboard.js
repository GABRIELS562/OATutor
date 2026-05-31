/**
 * Student Dashboard
 * Shows XP, streaks, badges, skill mastery, and recommended practice
 */

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    LinearProgress,
    Chip,
    Button,
    Tabs,
    Tab,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useGamification } from '../../util/GamificationContext';
import {
    DAILY_GOALS,
    getBadgesByCategory,
} from '../../config/gamificationConfig';

// Icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        paddingBottom: '40px',
    },
    header: {
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        color: '#fff',
    },
    title: {
        color: '#fff',
        fontWeight: 700,
    },
    headerActions: {
        display: 'flex',
        gap: '8px',
    },
    analyticsButton: {
        color: '#fff',
        background: 'rgba(123, 47, 247, 0.2)',
        '&:hover': {
            background: 'rgba(123, 47, 247, 0.4)',
        },
    },
    mainCard: {
        background: 'linear-gradient(135deg, rgba(123, 47, 247, 0.2) 0%, rgba(247, 37, 133, 0.2) 100%)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    levelBadge: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(123, 47, 247, 0.4)',
        margin: '0 auto 16px',
    },
    levelNumber: {
        fontSize: '36px',
        fontWeight: 800,
        color: '#fff',
    },
    levelTitle: {
        fontSize: '12px',
        color: 'rgba(255,255,255,0.9)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    xpProgress: {
        height: '12px',
        borderRadius: '6px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginTop: '16px',
    },
    xpProgressBar: {
        borderRadius: '6px',
        background: 'linear-gradient(90deg, #7B2FF7 0%, #F72585 100%)',
    },
    statCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-4px)',
        },
    },
    statIcon: {
        fontSize: '32px',
        marginBottom: '8px',
    },
    statValue: {
        fontSize: '28px',
        fontWeight: 700,
        color: '#fff',
    },
    statLabel: {
        fontSize: '12px',
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 700,
        marginBottom: '16px',
        marginTop: '32px',
    },
    badgeGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '16px',
    },
    badge: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease',
    },
    badgeEarned: {
        background: 'rgba(123, 47, 247, 0.2)',
        border: '1px solid rgba(123, 47, 247, 0.4)',
    },
    badgeLocked: {
        opacity: 0.5,
        filter: 'grayscale(100%)',
    },
    badgeIcon: {
        fontSize: '40px',
        marginBottom: '8px',
    },
    badgeName: {
        fontSize: '11px',
        color: '#fff',
        fontWeight: 600,
    },
    goalCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '16px',
    },
    goalOption: {
        padding: '12px 16px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '2px solid transparent',
        marginBottom: '8px',
        '&:hover': {
            background: 'rgba(255,255,255,0.1)',
        },
    },
    goalSelected: {
        background: 'rgba(123, 47, 247, 0.2)',
        border: '2px solid #7B2FF7',
    },
    activityCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    streakFire: {
        animation: '$pulse 1.5s ease-in-out infinite',
    },
    '@keyframes pulse': {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.1)' },
    },
    tabs: {
        marginBottom: '24px',
        '& .MuiTab-root': {
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'none',
            fontWeight: 600,
        },
        '& .Mui-selected': {
            color: '#fff',
        },
        '& .MuiTabs-indicator': {
            background: 'linear-gradient(90deg, #7B2FF7 0%, #F72585 100%)',
        },
    },
    // Analytics Banner
    analyticsBanner: {
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(123, 47, 247, 0.15) 100%)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '24px',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
    },
    analyticsBannerContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    analyticsBannerIcon: {
        background: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 100%)',
        borderRadius: '12px',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    analyticsBannerText: {
        color: '#fff',
        fontWeight: 600,
        fontSize: '14px',
    },
    analyticsBannerSubtext: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
    },
    analyticsViewButton: {
        background: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 100%)',
        color: '#fff',
        fontWeight: 600,
        padding: '8px 20px',
        borderRadius: '20px',
        textTransform: 'none',
        '&:hover': {
            background: 'linear-gradient(135deg, #00B8E0 0%, #6B1FE7 100%)',
        },
    },
}));

const StudentDashboard = () => {
    const classes = useStyles();
    const {
        stats,
        streakData,
        dailyActivity,
        earnedBadges,
        dailyGoal,
        getLevelInfo,
        getDailyGoalProgress,
        updateDailyGoal,
    } = useGamification();

    const [activeTab, setActiveTab] = useState(0);
    const levelInfo = getLevelInfo();
    const goalProgress = getDailyGoalProgress();
    const badgesByCategory = getBadgesByCategory();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box className={classes.root}>
            {/* Header */}
            <Box className={classes.header}>
                <IconButton
                    component={Link}
                    to="/"
                    className={classes.backButton}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" className={classes.title}>
                    My Progress
                </Typography>
                <Box className={classes.headerActions}>
                    <Tooltip title="Detailed Analytics">
                        <IconButton
                            component={Link}
                            to="/analytics"
                            className={classes.analyticsButton}
                        >
                            <BarChartIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton className={classes.backButton}>
                        <SettingsIcon />
                    </IconButton>
                </Box>
            </Box>

            <Container maxWidth="lg">
                {/* Analytics Banner */}
                <Box className={classes.analyticsBanner}>
                    <Box className={classes.analyticsBannerContent}>
                        <Box className={classes.analyticsBannerIcon}>
                            <BarChartIcon style={{ color: '#fff', fontSize: '24px' }} />
                        </Box>
                        <Box>
                            <Typography className={classes.analyticsBannerText}>
                                View Detailed Analytics
                            </Typography>
                            <Typography className={classes.analyticsBannerSubtext}>
                                Track skill mastery, strengths, and areas to improve
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        component={Link}
                        to="/analytics"
                        className={classes.analyticsViewButton}
                    >
                        View Analytics
                    </Button>
                </Box>

                {/* Main Stats Card */}
                <Paper className={classes.mainCard} elevation={0}>
                    <Grid container spacing={4} alignItems="center">
                        {/* Level Badge */}
                        <Grid item xs={12} md={4}>
                            <Box
                                className={classes.levelBadge}
                                style={{
                                    background: `linear-gradient(135deg, ${levelInfo.titleColor} 0%, ${levelInfo.titleColor}80 100%)`,
                                }}
                            >
                                <Typography className={classes.levelNumber}>
                                    {levelInfo.level}
                                </Typography>
                                <Typography className={classes.levelTitle}>
                                    {levelInfo.title}
                                </Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography style={{ color: '#fff', fontWeight: 600 }}>
                                    {stats.totalXP.toLocaleString()} XP
                                </Typography>
                                <Typography style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                                    {levelInfo.nextLevelXP
                                        ? `${(levelInfo.nextLevelXP - stats.totalXP).toLocaleString()} XP to Level ${levelInfo.nextLevel}`
                                        : 'Max Level!'}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={levelInfo.progressPercent}
                                    classes={{
                                        root: classes.xpProgress,
                                        bar: classes.xpProgressBar,
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Quick Stats */}
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Box className={classes.statCard}>
                                        <Box className={`${classes.statIcon} ${streakData.currentStreak > 0 ? classes.streakFire : ''}`}>
                                            {streakData.currentStreak > 0 ? '🔥' : '❄️'}
                                        </Box>
                                        <Typography className={classes.statValue}>
                                            {streakData.currentStreak}
                                        </Typography>
                                        <Typography className={classes.statLabel}>
                                            Day Streak
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box className={classes.statCard}>
                                        <Box className={classes.statIcon}>✅</Box>
                                        <Typography className={classes.statValue}>
                                            {stats.totalProblemsCorrect}
                                        </Typography>
                                        <Typography className={classes.statLabel}>
                                            Problems Solved
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box className={classes.statCard}>
                                        <Box className={classes.statIcon}>🏆</Box>
                                        <Typography className={classes.statValue}>
                                            {earnedBadges.length}
                                        </Typography>
                                        <Typography className={classes.statLabel}>
                                            Badges Earned
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box className={classes.statCard}>
                                        <Box className={classes.statIcon}>📚</Box>
                                        <Typography className={classes.statValue}>
                                            {stats.lessonsCompleted}
                                        </Typography>
                                        <Typography className={classes.statLabel}>
                                            Lessons Done
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    className={classes.tabs}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Today's Progress" icon={<TrendingUpIcon />} />
                    <Tab label="Badges" icon={<EmojiEventsIcon />} />
                    <Tab label="Daily Goal" icon={<WhatshotIcon />} />
                </Tabs>

                {/* Tab Content */}
                {activeTab === 0 && (
                    <Box>
                        {/* Today's Activity */}
                        <Paper className={classes.activityCard} elevation={0}>
                            <Typography variant="h6" style={{ color: '#fff', marginBottom: '16px', fontWeight: 700 }}>
                                Today's Activity
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={6} sm={3}>
                                    <Box textAlign="center">
                                        <Typography style={{ color: '#7B2FF7', fontSize: '32px', fontWeight: 700 }}>
                                            {dailyActivity.xpEarned}
                                        </Typography>
                                        <Typography style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                            XP Earned
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box textAlign="center">
                                        <Typography style={{ color: '#00D4FF', fontSize: '32px', fontWeight: 700 }}>
                                            {dailyActivity.problemsSolved}
                                        </Typography>
                                        <Typography style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                            Problems Attempted
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box textAlign="center">
                                        <Typography style={{ color: '#10B981', fontSize: '32px', fontWeight: 700 }}>
                                            {dailyActivity.correctAnswers}
                                        </Typography>
                                        <Typography style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                            Correct Answers
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box textAlign="center">
                                        <Typography style={{ color: '#F59E0B', fontSize: '32px', fontWeight: 700 }}>
                                            {Math.round(goalProgress.percent)}%
                                        </Typography>
                                        <Typography style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                            Daily Goal
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Goal Progress Bar */}
                            <Box mt={3}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                        Daily Goal Progress
                                    </Typography>
                                    <Typography style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                                        {goalProgress.isComplete ? '✅ Complete!' : `${Math.round(goalProgress.percent)}%`}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={goalProgress.percent}
                                    classes={{
                                        root: classes.xpProgress,
                                        bar: classes.xpProgressBar,
                                    }}
                                />
                            </Box>
                        </Paper>

                        {/* Quick Actions */}
                        <Box mt={3} display="flex" justifyContent="center" style={{ gap: '16px', flexWrap: 'wrap' }}>
                            <Button
                                component={Link}
                                to="/"
                                variant="contained"
                                size="large"
                                style={{
                                    background: 'linear-gradient(135deg, #7B2FF7 0%, #F72585 100%)',
                                    color: '#fff',
                                    fontWeight: 600,
                                    padding: '12px 48px',
                                    borderRadius: '30px',
                                }}
                            >
                                Continue Learning
                            </Button>
                            <Button
                                component={Link}
                                to="/analytics"
                                variant="outlined"
                                size="large"
                                style={{
                                    borderColor: '#00D4FF',
                                    color: '#00D4FF',
                                    fontWeight: 600,
                                    padding: '12px 32px',
                                    borderRadius: '30px',
                                }}
                            >
                                View Analytics
                            </Button>
                        </Box>
                    </Box>
                )}

                {activeTab === 1 && (
                    <Box>
                        {badgesByCategory.map((category) => (
                            <Box key={category.name} mb={4}>
                                <Typography variant="h6" style={{ color: '#fff', marginBottom: '16px', fontWeight: 600 }}>
                                    {category.name}
                                </Typography>
                                <Box className={classes.badgeGrid}>
                                    {category.badges.map((badge) => {
                                        const isEarned = earnedBadges.includes(badge.id);
                                        return (
                                            <Tooltip
                                                key={badge.id}
                                                title={
                                                    <Box p={1}>
                                                        <Typography style={{ fontWeight: 600 }}>{badge.name}</Typography>
                                                        <Typography style={{ fontSize: '12px' }}>{badge.description}</Typography>
                                                        {badge.xpReward > 0 && (
                                                            <Typography style={{ fontSize: '12px', color: '#A855F7', marginTop: '4px' }}>
                                                                +{badge.xpReward} XP
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                                arrow
                                            >
                                                <Box
                                                    className={`${classes.badge} ${isEarned ? classes.badgeEarned : classes.badgeLocked}`}
                                                >
                                                    <Box className={classes.badgeIcon}>
                                                        {badge.icon}
                                                    </Box>
                                                    <Typography className={classes.badgeName}>
                                                        {badge.name}
                                                    </Typography>
                                                    {isEarned && (
                                                        <Chip
                                                            label="Earned"
                                                            size="small"
                                                            style={{
                                                                marginTop: '8px',
                                                                background: 'rgba(123, 47, 247, 0.3)',
                                                                color: '#A855F7',
                                                                fontSize: '10px',
                                                                height: '20px',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Tooltip>
                                        );
                                    })}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}

                {activeTab === 2 && (
                    <Paper className={classes.goalCard} elevation={0}>
                        <Typography variant="h6" style={{ color: '#fff', marginBottom: '16px', fontWeight: 700 }}>
                            Set Your Daily Goal
                        </Typography>
                        <Typography style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
                            Choose how much you want to practice each day:
                        </Typography>

                        {DAILY_GOALS.OPTIONS.map((goal) => (
                            <Box
                                key={goal.id}
                                className={`${classes.goalOption} ${dailyGoal === goal.id ? classes.goalSelected : ''}`}
                                onClick={() => updateDailyGoal(goal.id)}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography style={{ color: '#fff', fontWeight: 600 }}>
                                            {goal.label}
                                        </Typography>
                                        <Typography style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                                            {goal.description}
                                        </Typography>
                                    </Box>
                                    {dailyGoal === goal.id && (
                                        <Chip
                                            label="Selected"
                                            size="small"
                                            style={{
                                                background: '#7B2FF7',
                                                color: '#fff',
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default StudentDashboard;
