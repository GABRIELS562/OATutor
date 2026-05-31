/**
 * Analytics Dashboard Component
 * Main dashboard for viewing student progress and performance analytics
 * Integrates BKT mastery model with activity tracking
 */

import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    IconButton,
    Button,
    CircularProgress,
    Chip,
    useMediaQuery,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

// Icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RefreshIcon from '@material-ui/icons/Refresh';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import SchoolIcon from '@material-ui/icons/School';
import TimerIcon from '@material-ui/icons/Timer';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import StarIcon from '@material-ui/icons/Star';

// Context
import { ThemeContext } from '../../config/config';
import { useGamification } from '../../util/GamificationContext';

// Analytics utilities
import {
    getOverallStats,
    getSkillMasteryData,
    getStrengthsWeaknesses,
    getWeeklyProgress,
    getSubjectProgressData,
    getActivityLog,
} from '../../util/analyticsService';

// Child components
import { ProgressRing, MultiBarChart, HorizontalBarChart } from './ProgressChart';
import { SkillMasteryCard, SkillListItem } from './SkillMasteryCard';
import { SubjectProgressOverview, SubjectComparisonChart } from './SubjectProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        background: '#3C3C3C',
        paddingBottom: '40px',
    },
    header: {
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'linear-gradient(180deg, rgba(26,26,46,0.98) 0%, rgba(26,26,46,0.9) 100%)',
        backdropFilter: 'blur(8px)',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
    },
    backButton: {
        color: '#fff',
        marginRight: '8px',
    },
    title: {
        color: '#fff',
        fontWeight: 700,
        fontSize: '20px',
        [theme.breakpoints.down('xs')]: {
            fontSize: '16px',
        },
    },
    refreshButton: {
        color: 'rgba(255,255,255,0.7)',
    },
    // Summary Cards
    summaryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px',
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: 'repeat(2, 1fr)',
        },
    },
    summaryCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(255,255,255,0.08)',
        },
    },
    summaryIcon: {
        fontSize: '32px',
        marginBottom: '8px',
    },
    summaryValue: {
        color: '#fff',
        fontSize: '24px',
        fontWeight: 700,
        marginBottom: '4px',
        [theme.breakpoints.down('xs')]: {
            fontSize: '20px',
        },
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    // Tabs
    tabs: {
        marginBottom: '24px',
        '& .MuiTab-root': {
            color: 'rgba(255,255,255,0.6)',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '13px',
            minWidth: 'auto',
            padding: '8px 16px',
            [theme.breakpoints.down('xs')]: {
                fontSize: '12px',
                padding: '6px 12px',
            },
        },
        '& .Mui-selected': {
            color: '#fff',
        },
        '& .MuiTabs-indicator': {
            background: 'linear-gradient(90deg, #58CC02 0%, #FF9600 100%)',
            height: '3px',
            borderRadius: '3px',
        },
    },
    // Section styles
    section: {
        marginBottom: '24px',
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 700,
        fontSize: '18px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    sectionCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        [theme.breakpoints.down('xs')]: {
            padding: '16px',
        },
    },
    // Strengths/Weaknesses
    analysisGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        },
    },
    analysisCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    analysisTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        color: '#fff',
        fontWeight: 600,
        fontSize: '14px',
    },
    // Activity Timeline
    activityList: {
        maxHeight: '300px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: '4px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
        },
    },
    activityItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    activityIcon: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        fontSize: '16px',
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        color: '#fff',
        fontSize: '13px',
        fontWeight: 500,
    },
    activityTime: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px',
    },
    // Loading state
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
    },
    loadingText: {
        color: 'rgba(255,255,255,0.7)',
        marginTop: '16px',
    },
    // Empty state
    emptyState: {
        textAlign: 'center',
        padding: '40px 20px',
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '16px',
        opacity: 0.5,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '16px',
    },
    // CTA button
    ctaButton: {
        background: 'linear-gradient(135deg, #58CC02 0%, #FF9600 100%)',
        color: '#fff',
        fontWeight: 600,
        padding: '12px 32px',
        borderRadius: '24px',
        textTransform: 'none',
        '&:hover': {
            background: 'linear-gradient(135deg, #6B1FE7 0%, #E71575 100%)',
        },
    },
    // Progress ring container
    progressRingContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap',
        [theme.breakpoints.down('xs')]: {
            gap: '16px',
        },
    },
}));

/**
 * Format time ago string
 */
const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString('en-ZA');
};

/**
 * Analytics Dashboard Component
 */
const AnalyticsDashboard = () => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    // Context
    const themeContext = useContext(ThemeContext);
    const bktParams = themeContext?.bktParams || {};
    // Gamification context available for future use
    useGamification();

    // State
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState({
        overallStats: null,
        skillMastery: [],
        strengthsWeaknesses: null,
        weeklyProgress: [],
        subjectProgress: [],
        activityLog: [],
    });

    /**
     * Load all analytics data
     */
    const loadAnalyticsData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                overallStats,
                strengthsWeaknesses,
                weeklyProgress,
                subjectProgress,
                activityLog,
            ] = await Promise.all([
                getOverallStats(bktParams),
                getStrengthsWeaknesses(bktParams),
                getWeeklyProgress(),
                getSubjectProgressData(bktParams),
                getActivityLog(50),
            ]);

            const skillMastery = getSkillMasteryData(bktParams);

            setAnalyticsData({
                overallStats,
                skillMastery,
                strengthsWeaknesses,
                weeklyProgress,
                subjectProgress,
                activityLog,
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setIsLoading(false);
        }
    }, [bktParams]);

    useEffect(() => {
        loadAnalyticsData();
    }, [loadAnalyticsData]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleRefresh = () => {
        loadAnalyticsData();
    };

    const { overallStats, skillMastery, strengthsWeaknesses, weeklyProgress, subjectProgress, activityLog } = analyticsData;

    // Render loading state
    if (isLoading) {
        return (
            <Box className={classes.root}>
                <Box className={classes.header}>
                    <Box className={classes.headerLeft}>
                        <IconButton
                            component={Link}
                            to="/"
                            className={classes.backButton}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography className={classes.title}>Analytics</Typography>
                    </Box>
                </Box>
                <Container maxWidth="lg">
                    <Box className={classes.loadingContainer}>
                        <CircularProgress style={{ color: '#58CC02' }} />
                        <Typography className={classes.loadingText}>
                            Loading your progress data...
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    // Check if there's data to show
    const hasData = overallStats?.totalAttempts > 0 || skillMastery.length > 0;

    return (
        <Box className={classes.root}>
            {/* Header */}
            <Box className={classes.header}>
                <Box className={classes.headerLeft}>
                    <IconButton
                        component={Link}
                        to="/"
                        className={classes.backButton}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography className={classes.title}>
                        Progress Analytics
                    </Typography>
                </Box>
                <IconButton
                    className={classes.refreshButton}
                    onClick={handleRefresh}
                >
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Container maxWidth="lg">
                {!hasData ? (
                    // Empty state
                    <Box className={classes.emptyState}>
                        <Box className={classes.emptyIcon}>📊</Box>
                        <Typography variant="h6" style={{ color: '#fff', marginBottom: '8px' }}>
                            No Progress Data Yet
                        </Typography>
                        <Typography className={classes.emptyText}>
                            Start practicing problems to see your progress analytics here.
                        </Typography>
                        <Button
                            component={Link}
                            to="/"
                            className={classes.ctaButton}
                        >
                            Start Practicing
                        </Button>
                    </Box>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <Box className={classes.summaryGrid}>
                            <Paper className={classes.summaryCard} elevation={0}>
                                <Box className={classes.summaryIcon}>
                                    <CheckCircleIcon style={{ color: '#10B981', fontSize: 'inherit' }} />
                                </Box>
                                <Typography className={classes.summaryValue}>
                                    {overallStats?.correctAnswers || 0}
                                </Typography>
                                <Typography className={classes.summaryLabel}>
                                    Problems Solved
                                </Typography>
                            </Paper>

                            <Paper className={classes.summaryCard} elevation={0}>
                                <Box className={classes.summaryIcon}>
                                    <TrendingUpIcon style={{ color: '#58CC02', fontSize: 'inherit' }} />
                                </Box>
                                <Typography className={classes.summaryValue}>
                                    {overallStats?.accuracy || 0}%
                                </Typography>
                                <Typography className={classes.summaryLabel}>
                                    Accuracy Rate
                                </Typography>
                            </Paper>

                            <Paper className={classes.summaryCard} elevation={0}>
                                <Box className={classes.summaryIcon}>
                                    <StarIcon style={{ color: '#F59E0B', fontSize: 'inherit' }} />
                                </Box>
                                <Typography className={classes.summaryValue}>
                                    {overallStats?.masteredSkills || 0}
                                </Typography>
                                <Typography className={classes.summaryLabel}>
                                    Skills Mastered
                                </Typography>
                            </Paper>

                            <Paper className={classes.summaryCard} elevation={0}>
                                <Box className={classes.summaryIcon}>
                                    <TimerIcon style={{ color: '#1CB0F6', fontSize: 'inherit' }} />
                                </Box>
                                <Typography className={classes.summaryValue}>
                                    {overallStats?.totalTimeMinutes || 0}m
                                </Typography>
                                <Typography className={classes.summaryLabel}>
                                    Time Practiced
                                </Typography>
                            </Paper>
                        </Box>

                        {/* Tabs */}
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            className={classes.tabs}
                            variant={isMobile ? 'scrollable' : 'standard'}
                            scrollButtons="auto"
                        >
                            <Tab label="Overview" />
                            <Tab label="Skills" />
                            <Tab label="Subjects" />
                            <Tab label="Activity" />
                        </Tabs>

                        {/* Tab Content */}
                        {activeTab === 0 && (
                            <Box>
                                {/* Overall Mastery Ring */}
                                <Paper className={classes.sectionCard} elevation={0} style={{ marginBottom: '24px' }}>
                                    <Box className={classes.progressRingContainer}>
                                        <ProgressRing
                                            value={overallStats?.masteryPercentage || 0}
                                            title="Overall Mastery"
                                            label={`${overallStats?.masteredSkills || 0}/${overallStats?.totalSkills || 0} skills`}
                                            color="#58CC02"
                                        />
                                        <ProgressRing
                                            value={overallStats?.accuracy || 0}
                                            title="Accuracy"
                                            label={`${overallStats?.correctAnswers || 0} correct`}
                                            color="#10B981"
                                        />
                                    </Box>
                                </Paper>

                                {/* Weekly Progress Chart */}
                                {weeklyProgress.length > 0 && (
                                    <Box className={classes.section}>
                                        <MultiBarChart
                                            data={weeklyProgress}
                                            title="This Week's Activity"
                                            labelKey="dayName"
                                            series={[
                                                { key: 'attempts', label: 'Attempted', color: '#58CC02' },
                                                { key: 'correct', label: 'Correct', color: '#10B981' },
                                            ]}
                                        />
                                    </Box>
                                )}

                                {/* Subject Overview */}
                                {subjectProgress.length > 0 && (
                                    <Box className={classes.section}>
                                        <SubjectComparisonChart subjectData={subjectProgress} />
                                    </Box>
                                )}

                                {/* Strengths & Weaknesses */}
                                {strengthsWeaknesses && (
                                    <Box className={classes.analysisGrid}>
                                        <Paper className={classes.analysisCard} elevation={0}>
                                            <Typography className={classes.analysisTitle}>
                                                <StarIcon style={{ color: '#10B981' }} />
                                                Your Strengths
                                            </Typography>
                                            {strengthsWeaknesses.strengths.length > 0 ? (
                                                strengthsWeaknesses.strengths.map((skill, i) => (
                                                    <SkillListItem key={skill.skillId || i} skill={skill} />
                                                ))
                                            ) : (
                                                <Typography style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                                                    Keep practicing to identify your strengths!
                                                </Typography>
                                            )}
                                        </Paper>

                                        <Paper className={classes.analysisCard} elevation={0}>
                                            <Typography className={classes.analysisTitle}>
                                                <WarningIcon style={{ color: '#F59E0B' }} />
                                                Areas to Improve
                                            </Typography>
                                            {strengthsWeaknesses.weaknesses.length > 0 ? (
                                                strengthsWeaknesses.weaknesses.map((skill, i) => (
                                                    <SkillListItem key={skill.skillId || i} skill={skill} />
                                                ))
                                            ) : (
                                                <Typography style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                                                    Great job! No major areas need attention.
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {activeTab === 1 && (
                            <Box>
                                {/* Skill Mastery Distribution */}
                                <Box className={classes.section}>
                                    <HorizontalBarChart
                                        data={[
                                            {
                                                label: 'Mastered',
                                                value: skillMastery.filter(s => s.mastery >= 95).length,
                                                color: '#10B981',
                                            },
                                            {
                                                label: 'Proficient',
                                                value: skillMastery.filter(s => s.mastery >= 75 && s.mastery < 95).length,
                                                color: '#58CC02',
                                            },
                                            {
                                                label: 'Developing',
                                                value: skillMastery.filter(s => s.mastery >= 50 && s.mastery < 75).length,
                                                color: '#F59E0B',
                                            },
                                            {
                                                label: 'Learning',
                                                value: skillMastery.filter(s => s.mastery < 50).length,
                                                color: '#1CB0F6',
                                            },
                                        ]}
                                        title="Skill Distribution"
                                        maxValue={Math.max(skillMastery.length, 10)}
                                    />
                                </Box>

                                {/* All Skills List */}
                                <Box className={classes.section}>
                                    <Typography className={classes.sectionTitle}>
                                        <SchoolIcon />
                                        All Skills ({skillMastery.length})
                                    </Typography>
                                    {skillMastery.slice(0, 20).map((skill, index) => (
                                        <SkillMasteryCard
                                            key={skill.skillId || index}
                                            skill={skill}
                                            bktParams={bktParams}
                                            showBktDetails
                                        />
                                    ))}
                                    {skillMastery.length > 20 && (
                                        <Typography
                                            style={{
                                                color: 'rgba(255,255,255,0.5)',
                                                textAlign: 'center',
                                                padding: '16px',
                                            }}
                                        >
                                            Showing top 20 of {skillMastery.length} skills
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {activeTab === 2 && (
                            <Box>
                                <SubjectProgressOverview subjectData={subjectProgress} />
                            </Box>
                        )}

                        {activeTab === 3 && (
                            <Box>
                                <Typography className={classes.sectionTitle}>
                                    Recent Activity
                                </Typography>
                                <Paper className={classes.sectionCard} elevation={0}>
                                    {activityLog.length > 0 ? (
                                        <Box className={classes.activityList}>
                                            {activityLog.map((activity, index) => (
                                                <Box key={index} className={classes.activityItem}>
                                                    <Box
                                                        className={classes.activityIcon}
                                                        style={{
                                                            background: activity.isCorrect
                                                                ? 'rgba(16, 185, 129, 0.2)'
                                                                : 'rgba(239, 68, 68, 0.2)',
                                                        }}
                                                    >
                                                        {activity.isCorrect ? '✓' : '✗'}
                                                    </Box>
                                                    <Box className={classes.activityContent}>
                                                        <Typography className={classes.activityTitle}>
                                                            {activity.isCorrect ? 'Solved' : 'Attempted'} problem
                                                        </Typography>
                                                        <Typography className={classes.activityTime}>
                                                            {formatTimeAgo(activity.timestamp)}
                                                            {activity.lessonId && ` • ${activity.lessonId}`}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        size="small"
                                                        label={activity.isCorrect ? 'Correct' : 'Try Again'}
                                                        style={{
                                                            background: activity.isCorrect
                                                                ? 'rgba(16, 185, 129, 0.2)'
                                                                : 'rgba(239, 68, 68, 0.2)',
                                                            color: activity.isCorrect ? '#10B981' : '#EF4444',
                                                            fontSize: '10px',
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box className={classes.emptyState}>
                                            <Typography className={classes.emptyText}>
                                                No recent activity recorded.
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        )}

                        {/* CTA to continue practicing */}
                        <Box textAlign="center" mt={4} mb={2}>
                            <Button
                                component={Link}
                                to="/"
                                className={classes.ctaButton}
                            >
                                Continue Practicing
                            </Button>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default AnalyticsDashboard;
