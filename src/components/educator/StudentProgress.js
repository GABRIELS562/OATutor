/**
 * StudentProgress - Enhanced student analytics and progress tracking
 * Shows detailed performance metrics, skill mastery, and learning trends
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Grid,
    Card,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Tabs,
    Tab,
    Box,
    Button,
} from '@material-ui/core';
import {
    TrendingUp,
    TrendingDown,
    TrendingFlat,
    School,
    Timer,
    Warning,
    GetApp,
    Person,
    Star,
    EmojiEvents,
    Assessment,
    Timeline,
} from '@material-ui/icons';
import ReportExportService from '../../services/ReportExportService';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(3),
        flexWrap: 'wrap',
        gap: theme.spacing(2),
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    headerIcon: {
        fontSize: 40,
        color: '#1a237e',
    },
    title: {
        fontWeight: 600,
        color: '#333',
    },
    subtitle: {
        color: '#666',
    },
    filters: {
        display: 'flex',
        gap: theme.spacing(2),
        flexWrap: 'wrap',
    },
    formControl: {
        minWidth: 150,
    },
    statsGrid: {
        marginBottom: theme.spacing(3),
    },
    statCard: {
        textAlign: 'center',
        padding: theme.spacing(2),
        height: '100%',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#1a237e',
    },
    statLabel: {
        color: '#666',
        marginTop: theme.spacing(0.5),
    },
    statTrend: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(1),
        fontSize: '0.875rem',
    },
    trendUp: {
        color: '#4caf50',
    },
    trendDown: {
        color: '#f44336',
    },
    trendFlat: {
        color: '#ff9800',
    },
    contentGrid: {
        marginTop: theme.spacing(2),
    },
    sectionCard: {
        height: '100%',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(2),
        fontWeight: 600,
    },
    skillItem: {
        marginBottom: theme.spacing(2),
    },
    skillHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(0.5),
    },
    skillName: {
        fontWeight: 500,
    },
    skillMastery: {
        fontWeight: 600,
    },
    masteryHigh: {
        color: '#4caf50',
    },
    masteryMedium: {
        color: '#ff9800',
    },
    masteryLow: {
        color: '#f44336',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    progressBarHigh: {
        backgroundColor: '#e8f5e9',
        '& .MuiLinearProgress-bar': {
            backgroundColor: '#4caf50',
        },
    },
    progressBarMedium: {
        backgroundColor: '#fff3e0',
        '& .MuiLinearProgress-bar': {
            backgroundColor: '#ff9800',
        },
    },
    progressBarLow: {
        backgroundColor: '#ffebee',
        '& .MuiLinearProgress-bar': {
            backgroundColor: '#f44336',
        },
    },
    studentAvatar: {
        backgroundColor: '#1a237e',
    },
    topPerformer: {
        backgroundColor: '#ffd700',
    },
    achievementChip: {
        margin: theme.spacing(0.5),
    },
    activityItem: {
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
        backgroundColor: 'rgba(26, 35, 126, 0.03)',
        borderRadius: theme.shape.borderRadius,
    },
    activityTime: {
        fontSize: '0.75rem',
        color: '#999',
    },
    emptyState: {
        textAlign: 'center',
        padding: theme.spacing(4),
        color: '#666',
    },
    tabPanel: {
        padding: theme.spacing(2, 0),
    },
    chartPlaceholder: {
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(26, 35, 126, 0.03)',
        borderRadius: theme.shape.borderRadius,
        color: '#666',
    },
    weeklyGoal: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: theme.shape.borderRadius,
    },
    goalProgress: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        marginTop: theme.spacing(1),
    },
}));

// Mock data - in production, fetch from Supabase
const MOCK_STUDENTS = [
    { id: '1', name: 'Thabo Mokoena', grade: 12, avatar: null, streak: 7, xp: 2450 },
    { id: '2', name: 'Lerato Nkosi', grade: 12, avatar: null, streak: 12, xp: 3200 },
    { id: '3', name: 'Sipho Dlamini', grade: 12, avatar: null, streak: 3, xp: 1800 },
    { id: '4', name: 'Ayanda Zulu', grade: 12, avatar: null, streak: 5, xp: 2100 },
];

const MOCK_SKILLS = [
    { id: '1', name: 'Euclidean Geometry', mastery: 0.85, problems: 45, trend: 'up' },
    { id: '2', name: 'Trigonometry', mastery: 0.72, problems: 38, trend: 'up' },
    { id: '3', name: 'Calculus - Differentiation', mastery: 0.65, problems: 32, trend: 'flat' },
    { id: '4', name: 'Calculus - Integration', mastery: 0.45, problems: 18, trend: 'down' },
    { id: '5', name: 'Analytical Geometry', mastery: 0.78, problems: 42, trend: 'up' },
    { id: '6', name: 'Statistics', mastery: 0.88, problems: 55, trend: 'up' },
];

const MOCK_ACTIVITY = [
    { id: '1', student: 'Thabo Mokoena', action: 'Completed Circle Theorems Quiz', score: '85%', time: '10 min ago' },
    { id: '2', student: 'Lerato Nkosi', action: 'Mastered Compound Angles', score: null, time: '25 min ago' },
    { id: '3', student: 'Sipho Dlamini', action: 'Started Calculus Module', score: null, time: '1 hour ago' },
    { id: '4', student: 'Ayanda Zulu', action: 'Completed Practice Problems', score: '72%', time: '2 hours ago' },
];

const StudentProgress = ({ classId }) => {
    const classes = useStyles();

    // State
    const [selectedClass, setSelectedClass] = useState(classId || 'all');
    const [selectedStudent, setSelectedStudent] = useState('all');
    const [dateRange, setDateRange] = useState('week');
    const [activeTab, setActiveTab] = useState(0);
    const [students] = useState(MOCK_STUDENTS);
    const [skills] = useState(MOCK_SKILLS);
    const [activity] = useState(MOCK_ACTIVITY);

    // Stats calculations
    const averageMastery = skills.reduce((sum, s) => sum + s.mastery, 0) / skills.length;
    const totalProblems = skills.reduce((sum, s) => sum + s.problems, 0);
    const activeStudents = students.filter(s => s.streak > 0).length;

    // Get mastery level class
    const getMasteryClass = (mastery) => {
        if (mastery >= 0.7) return { text: classes.masteryHigh, bar: classes.progressBarHigh };
        if (mastery >= 0.5) return { text: classes.masteryMedium, bar: classes.progressBarMedium };
        return { text: classes.masteryLow, bar: classes.progressBarLow };
    };

    // Get trend icon
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return <TrendingUp className={classes.trendUp} />;
            case 'down': return <TrendingDown className={classes.trendDown} />;
            default: return <TrendingFlat className={classes.trendFlat} />;
        }
    };

    // Export report
    const handleExportReport = async () => {
        const progressData = skills.map(skill => ({
            skillName: skill.name,
            mastery: skill.mastery,
            problemsAttempted: skill.problems,
            accuracy: skill.mastery,
            lastPracticed: new Date().toISOString(),
        }));

        const studentData = {
            name: selectedStudent === 'all' ? 'Class Average' : students.find(s => s.id === selectedStudent)?.name,
            grade: 12,
            overallMastery: averageMastery,
            totalProblems: totalProblems,
            averageAccuracy: averageMastery,
            streak: 5,
        };

        await ReportExportService.exportProgressReport(studentData, progressData);
    };

    return (
        <div className={classes.root}>
            {/* Header */}
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <Assessment className={classes.headerIcon} />
                    <div>
                        <Typography variant="h5" className={classes.title}>
                            Student Progress
                        </Typography>
                        <Typography variant="body2" className={classes.subtitle}>
                            Track performance, skills, and learning trends
                        </Typography>
                    </div>
                </div>

                <div className={classes.filters}>
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>Class</InputLabel>
                        <Select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            label="Class"
                        >
                            <MenuItem value="all">All Classes</MenuItem>
                            <MenuItem value="12a">Grade 12A</MenuItem>
                            <MenuItem value="12b">Grade 12B</MenuItem>
                            <MenuItem value="11a">Grade 11A</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>Student</InputLabel>
                        <Select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            label="Student"
                        >
                            <MenuItem value="all">All Students</MenuItem>
                            {students.map(student => (
                                <MenuItem key={student.id} value={student.id}>
                                    {student.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>Period</InputLabel>
                        <Select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            label="Period"
                        >
                            <MenuItem value="today">Today</MenuItem>
                            <MenuItem value="week">This Week</MenuItem>
                            <MenuItem value="month">This Month</MenuItem>
                            <MenuItem value="term">This Term</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        startIcon={<GetApp />}
                        onClick={handleExportReport}
                    >
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <Grid container spacing={2} className={classes.statsGrid}>
                <Grid item xs={6} sm={3}>
                    <Card className={classes.statCard}>
                        <Typography className={classes.statValue}>
                            {Math.round(averageMastery * 100)}%
                        </Typography>
                        <Typography variant="body2" className={classes.statLabel}>
                            Avg Mastery
                        </Typography>
                        <div className={`${classes.statTrend} ${classes.trendUp}`}>
                            <TrendingUp fontSize="small" />
                            <span>+5% from last week</span>
                        </div>
                    </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Card className={classes.statCard}>
                        <Typography className={classes.statValue}>
                            {totalProblems}
                        </Typography>
                        <Typography variant="body2" className={classes.statLabel}>
                            Problems Solved
                        </Typography>
                        <div className={`${classes.statTrend} ${classes.trendUp}`}>
                            <TrendingUp fontSize="small" />
                            <span>+23 this week</span>
                        </div>
                    </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Card className={classes.statCard}>
                        <Typography className={classes.statValue}>
                            {activeStudents}/{students.length}
                        </Typography>
                        <Typography variant="body2" className={classes.statLabel}>
                            Active Students
                        </Typography>
                        <div className={`${classes.statTrend} ${classes.trendFlat}`}>
                            <TrendingFlat fontSize="small" />
                            <span>Same as last week</span>
                        </div>
                    </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Card className={classes.statCard}>
                        <Typography className={classes.statValue}>
                            4.2h
                        </Typography>
                        <Typography variant="body2" className={classes.statLabel}>
                            Avg Study Time
                        </Typography>
                        <div className={`${classes.statTrend} ${classes.trendUp}`}>
                            <TrendingUp fontSize="small" />
                            <span>+0.5h from last week</span>
                        </div>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper>
                <Tabs
                    value={activeTab}
                    onChange={(e, v) => setActiveTab(v)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Skills Overview" icon={<School />} />
                    <Tab label="Student Rankings" icon={<EmojiEvents />} />
                    <Tab label="Recent Activity" icon={<Timeline />} />
                </Tabs>

                {/* Skills Tab */}
                {activeTab === 0 && (
                    <Box className={classes.tabPanel} p={2}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" className={classes.sectionTitle}>
                                    <School /> Skill Mastery
                                </Typography>
                                {skills.map(skill => {
                                    const masteryClasses = getMasteryClass(skill.mastery);
                                    return (
                                        <div key={skill.id} className={classes.skillItem}>
                                            <div className={classes.skillHeader}>
                                                <Typography className={classes.skillName}>
                                                    {skill.name}
                                                </Typography>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <Typography className={`${classes.skillMastery} ${masteryClasses.text}`}>
                                                        {Math.round(skill.mastery * 100)}%
                                                    </Typography>
                                                    {getTrendIcon(skill.trend)}
                                                </div>
                                            </div>
                                            <LinearProgress
                                                variant="determinate"
                                                value={skill.mastery * 100}
                                                className={`${classes.progressBar} ${masteryClasses.bar}`}
                                            />
                                            <Typography variant="caption" color="textSecondary">
                                                {skill.problems} problems attempted
                                            </Typography>
                                        </div>
                                    );
                                })}
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" className={classes.sectionTitle}>
                                    <Timer /> Weekly Goal
                                </Typography>
                                <div className={classes.weeklyGoal}>
                                    <Typography variant="body2">
                                        <strong>Target:</strong> Complete 50 problems
                                    </Typography>
                                    <div className={classes.goalProgress}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={72}
                                            style={{ flex: 1, height: 10, borderRadius: 5 }}
                                        />
                                        <Typography variant="body2" style={{ fontWeight: 600 }}>
                                            36/50
                                        </Typography>
                                    </div>
                                    <Typography variant="caption" color="textSecondary">
                                        14 more problems to reach this week's goal
                                    </Typography>
                                </div>

                                <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
                                    <Warning /> Areas for Improvement
                                </Typography>
                                {skills.filter(s => s.mastery < 0.6).map(skill => (
                                    <Chip
                                        key={skill.id}
                                        label={skill.name}
                                        className={classes.achievementChip}
                                        color="secondary"
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Rankings Tab */}
                {activeTab === 1 && (
                    <Box className={classes.tabPanel} p={2}>
                        <Typography variant="h6" className={classes.sectionTitle}>
                            <EmojiEvents /> Top Performers
                        </Typography>
                        <List>
                            {students
                                .sort((a, b) => b.xp - a.xp)
                                .map((student, index) => (
                                    <ListItem key={student.id}>
                                        <ListItemAvatar>
                                            <Avatar className={index === 0 ? classes.topPerformer : classes.studentAvatar}>
                                                {index < 3 ? index + 1 : <Person />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={student.name}
                                            secondary={
                                                <span>
                                                    <Star fontSize="small" style={{ verticalAlign: 'middle', color: '#ffd700' }} />
                                                    {' '}{student.xp} XP • {student.streak} day streak
                                                </span>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Chip
                                                label={`Grade ${student.grade}`}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                        </List>
                    </Box>
                )}

                {/* Activity Tab */}
                {activeTab === 2 && (
                    <Box className={classes.tabPanel} p={2}>
                        <Typography variant="h6" className={classes.sectionTitle}>
                            <Timeline /> Recent Activity
                        </Typography>
                        {activity.map(item => (
                            <div key={item.id} className={classes.activityItem}>
                                <Typography variant="body2">
                                    <strong>{item.student}</strong> {item.action}
                                    {item.score && (
                                        <Chip
                                            label={item.score}
                                            size="small"
                                            style={{ marginLeft: 8 }}
                                            color="primary"
                                        />
                                    )}
                                </Typography>
                                <Typography className={classes.activityTime}>
                                    {item.time}
                                </Typography>
                            </div>
                        ))}
                    </Box>
                )}
            </Paper>
        </div>
    );
};

export default StudentProgress;
