/**
 * Skill Mastery Card Component
 * Displays individual skill mastery information based on BKT model
 * Shows progress, level, and trends for each skill
 */

import React from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Chip,
    Collapse,
    IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import StarIcon from '@material-ui/icons/Star';
import SchoolIcon from '@material-ui/icons/School';
import { getMasteryLevel, getSubjectColor } from '../../util/analyticsService';

const useStyles = makeStyles((theme) => ({
    card: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(255,255,255,0.08)',
        },
    },
    cardMastered: {
        borderColor: 'rgba(16, 185, 129, 0.3)',
        background: 'rgba(16, 185, 129, 0.05)',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
    },
    skillInfo: {
        flex: 1,
        minWidth: 0,
    },
    skillName: {
        color: '#fff',
        fontWeight: 600,
        fontSize: '14px',
        marginBottom: '4px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    subjectChip: {
        height: '20px',
        fontSize: '10px',
        fontWeight: 600,
        marginRight: '8px',
    },
    levelChip: {
        height: '20px',
        fontSize: '10px',
        fontWeight: 600,
        '& .MuiChip-icon': {
            fontSize: '12px',
            marginLeft: '4px',
        },
    },
    masteryValue: {
        color: '#fff',
        fontWeight: 700,
        fontSize: '24px',
        marginLeft: '16px',
        flexShrink: 0,
    },
    progressWrapper: {
        marginTop: '8px',
    },
    progressTrack: {
        height: '8px',
        borderRadius: '4px',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    progressBar: {
        borderRadius: '4px',
    },
    progressLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '4px',
    },
    progressLabel: {
        fontSize: '10px',
        color: 'rgba(255,255,255,0.5)',
    },
    expandedContent: {
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    statRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    statLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
    },
    statValue: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    trendIcon: {
        fontSize: '16px',
    },
    trendUp: {
        color: '#10B981',
    },
    trendDown: {
        color: '#EF4444',
    },
    bktParams: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        marginTop: '12px',
    },
    bktParam: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '8px',
        textAlign: 'center',
    },
    bktParamValue: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: 600,
    },
    bktParamLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '9px',
        textTransform: 'uppercase',
        marginTop: '2px',
    },
    expandButton: {
        color: 'rgba(255,255,255,0.5)',
        padding: '4px',
    },
    // Compact card variant
    compactCard: {
        padding: '12px',
        marginBottom: '8px',
    },
    compactHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    compactProgress: {
        width: '100px',
        marginLeft: '12px',
    },
    // List view variant
    listItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    listIcon: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        flexShrink: 0,
    },
    listContent: {
        flex: 1,
        minWidth: 0,
    },
    listName: {
        color: '#fff',
        fontSize: '13px',
        fontWeight: 500,
        marginBottom: '2px',
    },
    listSubject: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px',
    },
    listProgress: {
        width: '60px',
        textAlign: 'right',
        marginLeft: '8px',
    },
    listMastery: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: 700,
    },
}));

/**
 * Get icon for mastery level
 */
const getMasteryIcon = (level) => {
    switch (level.icon) {
        case 'star':
            return <StarIcon style={{ color: level.color, fontSize: '18px' }} />;
        case 'trophy':
            return <span style={{ fontSize: '14px' }}>trophy</span>;
        case 'school':
            return <SchoolIcon style={{ color: level.color, fontSize: '18px' }} />;
        default:
            return null;
    }
};

/**
 * Full Skill Mastery Card
 */
export const SkillMasteryCard = ({
    skill,
    bktParams = {},
    expanded: controlledExpanded,
    onToggleExpand,
    showBktDetails = false,
}) => {
    const classes = useStyles();
    const [localExpanded, setLocalExpanded] = React.useState(false);

    const isControlled = controlledExpanded !== undefined;
    const expanded = isControlled ? controlledExpanded : localExpanded;

    const handleToggle = () => {
        if (isControlled && onToggleExpand) {
            onToggleExpand(!expanded);
        } else {
            setLocalExpanded(!localExpanded);
        }
    };

    const {
        skillId,
        name,
        mastery,
        subject,
        isMastered,
        level,
        attempts = 0,
        accuracy = 0,
        recentTrend,
        isImproving,
        isStruggling,
    } = skill;

    const masteryLevel = level || getMasteryLevel(mastery / 100);
    const subjectColor = getSubjectColor(subject);
    const params = bktParams[skillId] || {};

    return (
        <Box className={`${classes.card} ${isMastered ? classes.cardMastered : ''}`}>
            <Box className={classes.cardHeader}>
                <Box className={classes.skillInfo}>
                    <Typography className={classes.skillName}>{name}</Typography>
                    <Box display="flex" alignItems="center" flexWrap="wrap" style={{ gap: '4px' }}>
                        <Chip
                            label={subject}
                            size="small"
                            className={classes.subjectChip}
                            style={{
                                background: subjectColor.primary,
                                color: '#fff',
                            }}
                        />
                        <Chip
                            label={masteryLevel.label}
                            size="small"
                            className={classes.levelChip}
                            icon={getMasteryIcon(masteryLevel)}
                            style={{
                                background: `${masteryLevel.color}30`,
                                color: masteryLevel.color,
                            }}
                        />
                        {isImproving && (
                            <TrendingUpIcon className={`${classes.trendIcon} ${classes.trendUp}`} />
                        )}
                        {isStruggling && (
                            <TrendingDownIcon className={`${classes.trendIcon} ${classes.trendDown}`} />
                        )}
                    </Box>
                </Box>
                <Box display="flex" alignItems="center">
                    <Typography className={classes.masteryValue}>{mastery}%</Typography>
                    <IconButton
                        className={classes.expandButton}
                        onClick={handleToggle}
                        size="small"
                    >
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>
            </Box>

            <Box className={classes.progressWrapper}>
                <LinearProgress
                    variant="determinate"
                    value={mastery}
                    classes={{
                        root: classes.progressTrack,
                        bar: classes.progressBar,
                    }}
                    style={{
                        '& .MuiLinearProgress-bar': {
                            background: isMastered ? '#10B981' : masteryLevel.color,
                        },
                    }}
                />
                <Box className={classes.progressLabels}>
                    <Typography className={classes.progressLabel}>0%</Typography>
                    <Typography className={classes.progressLabel}>
                        Mastery at 95%
                    </Typography>
                    <Typography className={classes.progressLabel}>100%</Typography>
                </Box>
            </Box>

            <Collapse in={expanded}>
                <Box className={classes.expandedContent}>
                    <Box className={classes.statRow}>
                        <Typography className={classes.statLabel}>Problems Attempted</Typography>
                        <Typography className={classes.statValue}>{attempts}</Typography>
                    </Box>
                    <Box className={classes.statRow}>
                        <Typography className={classes.statLabel}>Accuracy</Typography>
                        <Typography className={classes.statValue}>{accuracy}%</Typography>
                    </Box>
                    {recentTrend !== null && (
                        <Box className={classes.statRow}>
                            <Typography className={classes.statLabel}>Recent Performance</Typography>
                            <Typography className={classes.statValue}>
                                {Math.round(recentTrend * 100)}%
                                {recentTrend > 0.6 && (
                                    <TrendingUpIcon className={`${classes.trendIcon} ${classes.trendUp}`} />
                                )}
                                {recentTrend < 0.4 && (
                                    <TrendingDownIcon className={`${classes.trendIcon} ${classes.trendDown}`} />
                                )}
                            </Typography>
                        </Box>
                    )}

                    {showBktDetails && Object.keys(params).length > 0 && (
                        <Box className={classes.bktParams}>
                            <Box className={classes.bktParam}>
                                <Typography className={classes.bktParamValue}>
                                    {Math.round((params.probMastery || 0) * 100)}%
                                </Typography>
                                <Typography className={classes.bktParamLabel}>
                                    P(Mastery)
                                </Typography>
                            </Box>
                            <Box className={classes.bktParam}>
                                <Typography className={classes.bktParamValue}>
                                    {Math.round((params.probTransit || 0) * 100)}%
                                </Typography>
                                <Typography className={classes.bktParamLabel}>
                                    P(Transit)
                                </Typography>
                            </Box>
                            <Box className={classes.bktParam}>
                                <Typography className={classes.bktParamValue}>
                                    {Math.round((params.probSlip || 0) * 100)}%
                                </Typography>
                                <Typography className={classes.bktParamLabel}>
                                    P(Slip)
                                </Typography>
                            </Box>
                            <Box className={classes.bktParam}>
                                <Typography className={classes.bktParamValue}>
                                    {Math.round((params.probGuess || 0) * 100)}%
                                </Typography>
                                <Typography className={classes.bktParamLabel}>
                                    P(Guess)
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

/**
 * Compact Skill Card (for lists)
 */
export const CompactSkillCard = ({ skill }) => {
    const classes = useStyles();

    const { name, mastery, level } = skill;
    const masteryLevel = level || getMasteryLevel(mastery / 100);

    return (
        <Box className={`${classes.card} ${classes.compactCard}`}>
            <Box className={classes.compactHeader}>
                <Box className={classes.skillInfo}>
                    <Typography className={classes.skillName}>{name}</Typography>
                    <Chip
                        label={masteryLevel.label}
                        size="small"
                        className={classes.levelChip}
                        style={{
                            background: `${masteryLevel.color}30`,
                            color: masteryLevel.color,
                        }}
                    />
                </Box>
                <Box className={classes.compactProgress}>
                    <LinearProgress
                        variant="determinate"
                        value={mastery}
                        classes={{
                            root: classes.progressTrack,
                            bar: classes.progressBar,
                        }}
                    />
                    <Typography
                        style={{
                            color: masteryLevel.color,
                            fontSize: '12px',
                            fontWeight: 600,
                            textAlign: 'right',
                            marginTop: '2px',
                        }}
                    >
                        {mastery}%
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

/**
 * Skill List Item (minimal)
 */
export const SkillListItem = ({ skill, onClick }) => {
    const classes = useStyles();

    const { name, mastery, subject, level } = skill;
    const masteryLevel = level || getMasteryLevel(mastery / 100);

    return (
        <Box
            className={classes.listItem}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <Box
                className={classes.listIcon}
                style={{ background: `${masteryLevel.color}30` }}
            >
                {getMasteryIcon(masteryLevel)}
            </Box>
            <Box className={classes.listContent}>
                <Typography className={classes.listName}>{name}</Typography>
                <Typography className={classes.listSubject}>{subject}</Typography>
            </Box>
            <Box className={classes.listProgress}>
                <Typography
                    className={classes.listMastery}
                    style={{ color: masteryLevel.color }}
                >
                    {mastery}%
                </Typography>
            </Box>
        </Box>
    );
};

/**
 * Skill Grid for dashboard overview
 */
export const SkillMasteryGrid = ({ skills, maxItems = 6, onViewAll }) => {
    const displaySkills = skills.slice(0, maxItems);

    return (
        <Box>
            {displaySkills.map((skill, index) => (
                <CompactSkillCard key={skill.skillId || index} skill={skill} />
            ))}
            {skills.length > maxItems && onViewAll && (
                <Box textAlign="center" mt={2}>
                    <Typography
                        style={{
                            color: '#58CC02',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                        onClick={onViewAll}
                    >
                        View all {skills.length} skills
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default SkillMasteryCard;
