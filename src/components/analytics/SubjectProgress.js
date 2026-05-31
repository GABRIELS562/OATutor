/**
 * Subject Progress Component
 * Displays per-subject progress breakdown with visual indicators
 * Shows skills mastered, average mastery, and subject-specific stats
 */

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    LinearProgress,
    Collapse,
    IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { getSubjectColor } from '../../util/analyticsService';

const useStyles = makeStyles((theme) => ({
    container: {
        marginBottom: '24px',
    },
    title: {
        color: '#fff',
        fontWeight: 700,
        marginBottom: '16px',
        fontSize: '18px',
    },
    // Subject Card Styles
    subjectCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(255,255,255,0.08)',
            transform: 'translateY(-2px)',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '16px',
        },
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
    },
    subjectIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        marginRight: '12px',
        flexShrink: 0,
        [theme.breakpoints.down('xs')]: {
            width: '40px',
            height: '40px',
            fontSize: '20px',
        },
    },
    subjectInfo: {
        flex: 1,
        minWidth: 0,
    },
    subjectName: {
        color: '#fff',
        fontWeight: 700,
        fontSize: '16px',
        marginBottom: '4px',
        [theme.breakpoints.down('xs')]: {
            fontSize: '14px',
        },
    },
    subjectMeta: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '12px',
    },
    masteryBadge: {
        textAlign: 'center',
        marginLeft: '12px',
    },
    masteryValue: {
        fontSize: '28px',
        fontWeight: 800,
        lineHeight: 1,
        [theme.breakpoints.down('xs')]: {
            fontSize: '24px',
        },
    },
    masteryLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    progressSection: {
        marginBottom: '12px',
    },
    progressHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
    },
    progressLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
    },
    progressValue: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 600,
    },
    progressTrack: {
        height: '8px',
        borderRadius: '4px',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    progressBar: {
        borderRadius: '4px',
    },
    statsRow: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    statItem: {
        textAlign: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: '20px',
        fontWeight: 700,
        [theme.breakpoints.down('xs')]: {
            fontSize: '18px',
        },
    },
    statLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '10px',
        textTransform: 'uppercase',
    },
    // Expanded Skills Section
    skillsSection: {
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    skillsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    skillsTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '13px',
        fontWeight: 600,
    },
    skillsList: {
        maxHeight: '200px',
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
    skillItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    skillName: {
        flex: 1,
        color: 'rgba(255,255,255,0.8)',
        fontSize: '12px',
        marginRight: '8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    skillMastery: {
        fontSize: '12px',
        fontWeight: 600,
        minWidth: '40px',
        textAlign: 'right',
    },
    masteredIcon: {
        color: '#10B981',
        fontSize: '16px',
        marginLeft: '4px',
    },
    expandButton: {
        color: 'rgba(255,255,255,0.5)',
        padding: '4px',
    },
    // Overview Cards
    overviewGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: '1fr',
        },
    },
    overviewCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
    },
    overviewIcon: {
        fontSize: '32px',
        marginBottom: '8px',
    },
    overviewValue: {
        color: '#fff',
        fontSize: '24px',
        fontWeight: 700,
    },
    overviewLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '11px',
        textTransform: 'uppercase',
    },
}));

// Subject icons mapping
const SUBJECT_ICONS = {
    Mathematics: { emoji: '🔢', alt: 'Maths' },
    Physics: { emoji: '⚛️', alt: 'Physics' },
    Chemistry: { emoji: '🧪', alt: 'Chem' },
    Biology: { emoji: '🧬', alt: 'Bio' },
};

/**
 * Single Subject Progress Card
 */
export const SubjectProgressCard = ({ subject, data, expanded, onToggle }) => {
    const classes = useStyles();

    const {
        skillCount = 0,
        averageMastery = 0,
        masteredCount = 0,
        color,
        skills = [],
    } = data;

    const subjectColor = color || getSubjectColor(subject);
    const icon = SUBJECT_ICONS[subject] || { emoji: '📚', alt: subject };
    const masteryPercentage = skillCount > 0 ? Math.round((masteredCount / skillCount) * 100) : 0;

    return (
        <Paper
            className={classes.subjectCard}
            elevation={0}
            onClick={() => onToggle && onToggle(!expanded)}
        >
            <Box className={classes.cardHeader}>
                <Box display="flex" alignItems="center" flex={1}>
                    <Box
                        className={classes.subjectIcon}
                        style={{ background: `${subjectColor.primary}30` }}
                    >
                        {icon.emoji}
                    </Box>
                    <Box className={classes.subjectInfo}>
                        <Typography className={classes.subjectName}>{subject}</Typography>
                        <Typography className={classes.subjectMeta}>
                            {skillCount} skills tracked
                        </Typography>
                    </Box>
                </Box>
                <Box className={classes.masteryBadge}>
                    <Typography
                        className={classes.masteryValue}
                        style={{ color: subjectColor.primary }}
                    >
                        {averageMastery}%
                    </Typography>
                    <Typography className={classes.masteryLabel}>Avg Mastery</Typography>
                </Box>
            </Box>

            {/* Progress Bar */}
            <Box className={classes.progressSection}>
                <Box className={classes.progressHeader}>
                    <Typography className={classes.progressLabel}>
                        Skills Mastered
                    </Typography>
                    <Typography className={classes.progressValue}>
                        {masteredCount} / {skillCount}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={masteryPercentage}
                    classes={{
                        root: classes.progressTrack,
                        bar: classes.progressBar,
                    }}
                    style={{
                        '& .MuiLinearProgress-bar': {
                            background: subjectColor.gradient,
                        },
                    }}
                />
            </Box>

            {/* Quick Stats */}
            <Box className={classes.statsRow}>
                <Box className={classes.statItem}>
                    <Typography className={classes.statValue} style={{ color: '#10B981' }}>
                        {masteredCount}
                    </Typography>
                    <Typography className={classes.statLabel}>Mastered</Typography>
                </Box>
                <Box className={classes.statItem}>
                    <Typography className={classes.statValue} style={{ color: '#F59E0B' }}>
                        {skillCount - masteredCount}
                    </Typography>
                    <Typography className={classes.statLabel}>In Progress</Typography>
                </Box>
                <Box className={classes.statItem}>
                    <Typography className={classes.statValue} style={{ color: subjectColor.primary }}>
                        {averageMastery}%
                    </Typography>
                    <Typography className={classes.statLabel}>Average</Typography>
                </Box>
            </Box>

            {/* Expanded Skills List */}
            <Collapse in={expanded}>
                <Box className={classes.skillsSection}>
                    <Box className={classes.skillsHeader}>
                        <Typography className={classes.skillsTitle}>
                            Skills Breakdown
                        </Typography>
                        <IconButton
                            className={classes.expandButton}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggle && onToggle(false);
                            }}
                        >
                            <ExpandLessIcon />
                        </IconButton>
                    </Box>
                    <Box className={classes.skillsList}>
                        {skills
                            .sort((a, b) => b.mastery - a.mastery)
                            .map((skill, index) => (
                                <Box key={skill.skillId || index} className={classes.skillItem}>
                                    <Typography className={classes.skillName}>
                                        {skill.name}
                                    </Typography>
                                    <Typography
                                        className={classes.skillMastery}
                                        style={{
                                            color: skill.isMastered
                                                ? '#10B981'
                                                : skill.mastery >= 50
                                                    ? '#F59E0B'
                                                    : 'rgba(255,255,255,0.6)',
                                        }}
                                    >
                                        {skill.mastery}%
                                    </Typography>
                                    {skill.isMastered && (
                                        <CheckCircleIcon className={classes.masteredIcon} />
                                    )}
                                </Box>
                            ))}
                    </Box>
                </Box>
            </Collapse>

            {!expanded && skills.length > 0 && (
                <Box textAlign="center" mt={1}>
                    <Typography
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '11px',
                        }}
                    >
                        Tap to view skills
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

/**
 * Subject Progress Overview (all subjects)
 */
export const SubjectProgressOverview = ({ subjectData, title = "Progress by Subject" }) => {
    const classes = useStyles();
    const [expandedSubject, setExpandedSubject] = useState(null);

    const handleToggle = (subject) => (isExpanded) => {
        setExpandedSubject(isExpanded ? subject : null);
    };

    return (
        <Box className={classes.container}>
            {title && <Typography className={classes.title}>{title}</Typography>}
            <Grid container spacing={2}>
                {subjectData.map((data, index) => (
                    <Grid item xs={12} md={6} key={data.subject || index}>
                        <SubjectProgressCard
                            subject={data.subject}
                            data={data}
                            expanded={expandedSubject === data.subject}
                            onToggle={handleToggle(data.subject)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

/**
 * Mini Subject Progress Cards (for dashboard)
 */
export const SubjectProgressMini = ({ subjectData }) => {
    const classes = useStyles();

    return (
        <Box className={classes.overviewGrid}>
            {subjectData.map((data, index) => {
                const icon = SUBJECT_ICONS[data.subject] || { emoji: '📚' };
                const color = data.color || getSubjectColor(data.subject);

                return (
                    <Box
                        key={data.subject || index}
                        className={classes.overviewCard}
                        style={{
                            borderLeft: `3px solid ${color.primary}`,
                        }}
                    >
                        <Box className={classes.overviewIcon}>{icon.emoji}</Box>
                        <Typography
                            className={classes.overviewValue}
                            style={{ color: color.primary }}
                        >
                            {data.averageMastery}%
                        </Typography>
                        <Typography className={classes.overviewLabel}>
                            {data.subject}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

/**
 * Subject Comparison Chart
 */
export const SubjectComparisonChart = ({ subjectData, height = 200 }) => {
    const classes = useStyles();

    const maxMastery = Math.max(...subjectData.map(d => d.averageMastery), 100);

    return (
        <Paper
            style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
            }}
            elevation={0}
        >
            <Typography className={classes.title}>Subject Comparison</Typography>
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    height: `${height}px`,
                    paddingTop: '20px',
                }}
            >
                {subjectData.map((data, index) => {
                    const icon = SUBJECT_ICONS[data.subject] || { emoji: '📚' };
                    const color = data.color || getSubjectColor(data.subject);
                    const barHeight = (data.averageMastery / maxMastery) * (height - 60);

                    return (
                        <Box
                            key={data.subject || index}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                flex: 1,
                                maxWidth: '80px',
                            }}
                        >
                            <Typography
                                style={{
                                    color: color.primary,
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    marginBottom: '4px',
                                }}
                            >
                                {data.averageMastery}%
                            </Typography>
                            <Box
                                style={{
                                    width: '40px',
                                    height: `${Math.max(barHeight, 4)}px`,
                                    background: color.gradient,
                                    borderRadius: '8px 8px 0 0',
                                    transition: 'height 0.5s ease-out',
                                }}
                            />
                            <Box
                                style={{
                                    marginTop: '8px',
                                    fontSize: '20px',
                                }}
                            >
                                {icon.emoji}
                            </Box>
                            <Typography
                                style={{
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '10px',
                                    textAlign: 'center',
                                }}
                            >
                                {data.subject}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

const SubjectProgressComponents = {
    SubjectProgressCard,
    SubjectProgressOverview,
    SubjectProgressMini,
    SubjectComparisonChart,
};

export default SubjectProgressComponents;
