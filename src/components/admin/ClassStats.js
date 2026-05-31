/**
 * Class Statistics Component
 * Displays class-wide statistics and analytics
 */

import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Icons
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import PeopleIcon from '@material-ui/icons/People';
import SchoolIcon from '@material-ui/icons/School';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import GetAppIcon from '@material-ui/icons/GetApp';
import TimelineIcon from '@material-ui/icons/Timeline';

// Mock class statistics
const MOCK_CLASS_STATS = {
    '12A': {
        name: 'Grade 12A',
        totalStudents: 28,
        activeStudents: 24,
        averageXP: 5200,
        averageLevel: 9.5,
        averageAccuracy: 76,
        averageStreak: 8,
        topicsCompleted: 18,
        totalProblems: 4250,
        weeklyGrowth: 12,
        skillMastery: {
            'Trigonometry': 72,
            'Calculus': 68,
            'Euclidean Geometry': 75,
            'Analytical Geometry': 70,
            'Statistics': 82,
        },
        recentActivity: [
            { date: '2025-02-25', students: 22, problems: 145 },
            { date: '2025-02-24', students: 20, problems: 128 },
            { date: '2025-02-23', students: 18, problems: 112 },
            { date: '2025-02-22', students: 15, problems: 89 },
            { date: '2025-02-21', students: 19, problems: 134 },
        ],
        strugglingTopics: [
            { topic: 'Compound Angles', accuracy: 58 },
            { topic: 'Circle Theorems', accuracy: 62 },
            { topic: 'Optimization', accuracy: 65 },
        ],
        topPerformers: [
            { name: 'Bongiwe N.', xp: 7200, level: 13 },
            { name: 'Lerato N.', xp: 6800, level: 12 },
            { name: 'Nomvula Z.', xp: 5500, level: 10 },
        ],
    },
    '11B': {
        name: 'Grade 11B',
        totalStudents: 30,
        activeStudents: 26,
        averageXP: 3100,
        averageLevel: 6.2,
        averageAccuracy: 71,
        averageStreak: 5,
        topicsCompleted: 12,
        totalProblems: 2890,
        weeklyGrowth: 8,
        skillMastery: {
            'Functions': 74,
            'Trigonometry': 65,
            'Sequences': 70,
            'Financial Maths': 78,
            'Analytical Geometry': 62,
        },
        recentActivity: [
            { date: '2025-02-25', students: 24, problems: 132 },
            { date: '2025-02-24', students: 22, problems: 118 },
            { date: '2025-02-23', students: 20, problems: 98 },
            { date: '2025-02-22', students: 18, problems: 87 },
            { date: '2025-02-21', students: 21, problems: 115 },
        ],
        strugglingTopics: [
            { topic: 'Hyperbolas', accuracy: 55 },
            { topic: 'Sine/Cosine Rule', accuracy: 60 },
            { topic: 'Compound Interest', accuracy: 63 },
        ],
        topPerformers: [
            { name: 'Kagiso M.', xp: 3200, level: 7 },
            { name: 'Sipho D.', xp: 2100, level: 5 },
            { name: 'Ayanda M.', xp: 1800, level: 4 },
        ],
    },
};

const useStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    header: {
        padding: theme.spacing(3),
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: theme.spacing(2),
    },
    filterSelect: {
        minWidth: 180,
        '& .MuiOutlinedInput-root': {
            borderRadius: 10,
        },
    },
    statCard: {
        height: '100%',
        borderRadius: 16,
        border: '1px solid rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        },
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(2),
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.2,
    },
    statLabel: {
        color: '#64748B',
        fontSize: '0.85rem',
    },
    trend: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: '0.85rem',
        marginTop: theme.spacing(1),
    },
    trendUp: {
        color: '#10B981',
    },
    trendDown: {
        color: '#F72585',
    },
    progressSection: {
        marginTop: theme.spacing(4),
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    skillRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(0.5),
    },
    strugglingChip: {
        backgroundColor: 'rgba(247, 37, 133, 0.1)',
        color: '#F72585',
        fontWeight: 600,
    },
    performerRow: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        padding: theme.spacing(1.5, 0),
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    performerRank: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '0.85rem',
    },
    activityTable: {
        '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#64748B',
            backgroundColor: '#F8FAFC',
        },
    },
    exportButton: {
        borderRadius: 10,
    },
}));

const ClassStats = ({ onExport }) => {
    const classes = useStyles();
    const [selectedClass, setSelectedClass] = useState('12A');

    const stats = MOCK_CLASS_STATS[selectedClass];

    const handleExportCSV = () => {
        // Generate CSV content
        const csvContent = [
            ['Class Statistics Report', stats.name],
            ['Generated', new Date().toLocaleString()],
            [''],
            ['Metric', 'Value'],
            ['Total Students', stats.totalStudents],
            ['Active Students', stats.activeStudents],
            ['Average XP', stats.averageXP],
            ['Average Level', stats.averageLevel],
            ['Average Accuracy', `${stats.averageAccuracy}%`],
            ['Average Streak', stats.averageStreak],
            ['Topics Completed', stats.topicsCompleted],
            ['Total Problems Solved', stats.totalProblems],
            [''],
            ['Skill Mastery'],
            ...Object.entries(stats.skillMastery).map(([skill, mastery]) => [skill, `${mastery}%`]),
            [''],
            ['Struggling Topics'],
            ...stats.strugglingTopics.map((t) => [t.topic, `${t.accuracy}%`]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${stats.name.replace(' ', '_')}_stats_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        if (onExport) onExport();
    };

    const getProgressColor = (value) => {
        if (value >= 75) return '#10B981';
        if (value >= 60) return '#F59E0B';
        return '#F72585';
    };

    return (
        <Paper className={classes.paper} elevation={0}>
            {/* Header */}
            <Box className={classes.header}>
                <Box>
                    <Typography variant="h6" style={{ fontWeight: 700 }}>
                        Class Statistics
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Performance overview and analytics
                    </Typography>
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                    <FormControl variant="outlined" size="small" className={classes.filterSelect}>
                        <InputLabel>Select Class</InputLabel>
                        <Select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            label="Select Class"
                        >
                            {Object.keys(MOCK_CLASS_STATS).map((classId) => (
                                <MenuItem key={classId} value={classId}>
                                    {MOCK_CLASS_STATS[classId].name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<GetAppIcon />}
                        className={classes.exportButton}
                        onClick={handleExportCSV}
                    >
                        Export CSV
                    </Button>
                </Box>
            </Box>

            <Box p={3}>
                {/* Overview Stats */}
                <Grid container spacing={3}>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card className={classes.statCard} elevation={0}>
                            <CardContent>
                                <Box
                                    className={classes.statIcon}
                                    style={{ backgroundColor: 'rgba(123, 47, 247, 0.1)' }}
                                >
                                    <PeopleIcon style={{ color: '#7B2FF7' }} />
                                </Box>
                                <Typography className={classes.statValue}>
                                    {stats.activeStudents}/{stats.totalStudents}
                                </Typography>
                                <Typography className={classes.statLabel}>Active Students</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card className={classes.statCard} elevation={0}>
                            <CardContent>
                                <Box
                                    className={classes.statIcon}
                                    style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
                                >
                                    <EmojiEventsIcon style={{ color: '#00D4FF' }} />
                                </Box>
                                <Typography className={classes.statValue}>
                                    {stats.averageXP.toLocaleString()}
                                </Typography>
                                <Typography className={classes.statLabel}>Avg XP</Typography>
                                <Box className={`${classes.trend} ${classes.trendUp}`}>
                                    <TrendingUpIcon fontSize="small" />
                                    <span>+{stats.weeklyGrowth}% this week</span>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card className={classes.statCard} elevation={0}>
                            <CardContent>
                                <Box
                                    className={classes.statIcon}
                                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                                >
                                    <SchoolIcon style={{ color: '#10B981' }} />
                                </Box>
                                <Typography className={classes.statValue}>
                                    {stats.averageAccuracy}%
                                </Typography>
                                <Typography className={classes.statLabel}>Avg Accuracy</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card className={classes.statCard} elevation={0}>
                            <CardContent>
                                <Box
                                    className={classes.statIcon}
                                    style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
                                >
                                    <WhatshotIcon style={{ color: '#F59E0B' }} />
                                </Box>
                                <Typography className={classes.statValue}>{stats.averageStreak}</Typography>
                                <Typography className={classes.statLabel}>Avg Streak</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card className={classes.statCard} elevation={0}>
                            <CardContent>
                                <Box
                                    className={classes.statIcon}
                                    style={{ backgroundColor: 'rgba(247, 37, 133, 0.1)' }}
                                >
                                    <TimelineIcon style={{ color: '#F72585' }} />
                                </Box>
                                <Typography className={classes.statValue}>Lvl {stats.averageLevel}</Typography>
                                <Typography className={classes.statLabel}>Avg Level</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card className={classes.statCard} elevation={0}>
                            <CardContent>
                                <Box
                                    className={classes.statIcon}
                                    style={{ backgroundColor: 'rgba(123, 47, 247, 0.1)' }}
                                >
                                    <SchoolIcon style={{ color: '#7B2FF7' }} />
                                </Box>
                                <Typography className={classes.statValue}>
                                    {stats.totalProblems.toLocaleString()}
                                </Typography>
                                <Typography className={classes.statLabel}>Problems Solved</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Skill Mastery & Struggling Topics */}
                <Grid container spacing={3} style={{ marginTop: 24 }}>
                    <Grid item xs={12} md={6}>
                        <Paper variant="outlined" style={{ padding: 24, borderRadius: 16 }}>
                            <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 16 }}>
                                Skill Mastery
                            </Typography>
                            {Object.entries(stats.skillMastery).map(([skill, mastery]) => (
                                <Box key={skill}>
                                    <Box className={classes.skillRow}>
                                        <Typography variant="body2">{skill}</Typography>
                                        <Typography variant="body2" style={{ fontWeight: 600 }}>
                                            {mastery}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={mastery}
                                        className={classes.progressBar}
                                        style={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.06)',
                                        }}
                                        classes={{
                                            bar: {
                                                backgroundColor: getProgressColor(mastery),
                                            },
                                        }}
                                    />
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper variant="outlined" style={{ padding: 24, borderRadius: 16 }}>
                            <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 16 }}>
                                Areas Needing Attention
                            </Typography>
                            {stats.strugglingTopics.map((topic, index) => (
                                <Box
                                    key={topic.topic}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={2}
                                >
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <TrendingDownIcon style={{ color: '#F72585' }} />
                                        <Typography>{topic.topic}</Typography>
                                    </Box>
                                    <Chip
                                        label={`${topic.accuracy}% accuracy`}
                                        size="small"
                                        className={classes.strugglingChip}
                                    />
                                </Box>
                            ))}

                            <Typography
                                variant="h6"
                                style={{ fontWeight: 600, marginTop: 32, marginBottom: 16 }}
                            >
                                Top Performers
                            </Typography>
                            {stats.topPerformers.map((student, index) => (
                                <Box key={student.name} className={classes.performerRow}>
                                    <Box
                                        className={classes.performerRank}
                                        style={{
                                            backgroundColor:
                                                index === 0
                                                    ? '#FFD700'
                                                    : index === 1
                                                    ? '#C0C0C0'
                                                    : '#CD7F32',
                                            color: index === 0 ? '#1a1a2e' : '#fff',
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                    <Box flex={1}>
                                        <Typography style={{ fontWeight: 600 }}>{student.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Level {student.level}
                                        </Typography>
                                    </Box>
                                    <Typography style={{ fontWeight: 700, color: '#7B2FF7' }}>
                                        {student.xp.toLocaleString()} XP
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>
                </Grid>

                {/* Recent Activity Table */}
                <Paper variant="outlined" style={{ marginTop: 24, borderRadius: 16, overflow: 'hidden' }}>
                    <Box p={3} pb={0}>
                        <Typography variant="h6" style={{ fontWeight: 600 }}>
                            Recent Activity
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table className={classes.activityTable}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="center">Active Students</TableCell>
                                    <TableCell align="center">Problems Solved</TableCell>
                                    <TableCell align="center">Avg per Student</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stats.recentActivity.map((day) => (
                                    <TableRow key={day.date}>
                                        <TableCell>
                                            {new Date(day.date).toLocaleDateString('en-ZA', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={`${day.students}/${stats.totalStudents}`}
                                                size="small"
                                                style={{
                                                    backgroundColor:
                                                        day.students > stats.totalStudents * 0.7
                                                            ? 'rgba(16, 185, 129, 0.1)'
                                                            : 'rgba(245, 158, 11, 0.1)',
                                                    color:
                                                        day.students > stats.totalStudents * 0.7
                                                            ? '#10B981'
                                                            : '#F59E0B',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center" style={{ fontWeight: 600 }}>
                                            {day.problems}
                                        </TableCell>
                                        <TableCell align="center">
                                            {(day.problems / day.students).toFixed(1)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Paper>
    );
};

export default ClassStats;
