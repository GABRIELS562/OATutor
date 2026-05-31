/**
 * Leaderboard - Display top learners by XP, streaks, or weekly progress
 *
 * Features:
 * - Multiple leaderboard types (total, weekly, streak)
 * - Privacy-conscious (initials/avatars only)
 * - Current user highlighted
 * - Motivating, age-appropriate design
 * - Bilingual support
 */

import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Chip,
    Tabs,
    Tab,
    Box,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import {
    EmojiEvents as TrophyIcon,
    LocalFireDepartment as FireIcon,
    TrendingUp as TrendingIcon,
    Star as StarIcon,
    Refresh as RefreshIcon,
} from '@material-ui/icons';
import { useLocalization } from '../../util/LocalizationContext';
import { useGamification } from '../../util/GamificationContext';
import db from '../../database/DatabaseService';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: theme.shape.borderRadius * 2,
        overflow: 'hidden',
    },
    header: {
        padding: theme.spacing(2),
        background: 'linear-gradient(135deg, #7B2FF7 0%, #F72585 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        fontWeight: 600,
    },
    tabs: {
        backgroundColor: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
    },
    tab: {
        minWidth: 80,
        fontSize: '0.75rem',
    },
    list: {
        padding: 0,
        maxHeight: 400,
        overflow: 'auto',
    },
    listItem: {
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    currentUser: {
        backgroundColor: 'rgba(123, 47, 247, 0.08)',
        borderLeft: `4px solid ${theme.palette.primary.main}`,
    },
    rank: {
        fontWeight: 700,
        minWidth: 32,
        textAlign: 'center',
    },
    rankGold: {
        color: '#FFD700',
    },
    rankSilver: {
        color: '#C0C0C0',
    },
    rankBronze: {
        color: '#CD7F32',
    },
    avatar: {
        width: 40,
        height: 40,
        fontWeight: 600,
        fontSize: '0.9rem',
    },
    avatarFirst: {
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    },
    avatarSecond: {
        background: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
    },
    avatarThird: {
        background: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
    },
    avatarDefault: {
        backgroundColor: theme.palette.primary.light,
    },
    username: {
        fontWeight: 500,
    },
    stats: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: '#666',
        fontSize: '0.85rem',
    },
    xpBadge: {
        fontWeight: 600,
        minWidth: 70,
        textAlign: 'right',
    },
    levelChip: {
        marginLeft: 8,
        height: 20,
        fontSize: '0.7rem',
    },
    streakBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        color: '#F72585',
    },
    emptyState: {
        textAlign: 'center',
        padding: theme.spacing(4),
        color: '#999',
    },
    loadingState: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(4),
    },
    refreshButton: {
        color: 'white',
    },
    podium: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: theme.spacing(2),
        backgroundColor: 'rgba(123, 47, 247, 0.05)',
    },
    podiumItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(1),
    },
    podiumFirst: {
        order: 2,
    },
    podiumSecond: {
        order: 1,
    },
    podiumThird: {
        order: 3,
    },
    podiumAvatar: {
        width: 56,
        height: 56,
        marginBottom: 8,
        border: '3px solid',
    },
    podiumName: {
        fontSize: '0.8rem',
        fontWeight: 600,
        marginBottom: 4,
    },
    podiumXP: {
        fontSize: '0.75rem',
        color: '#666',
    },
}));

// Generate display name from user ID (privacy-conscious)
const generateDisplayName = (userId) => {
    if (!userId) return 'Anonymous';
    // Use first 2-3 characters or generate initials
    const hash = userId.substring(0, 8);
    return `Learner ${hash.substring(0, 4).toUpperCase()}`;
};

// Get avatar color based on rank
const getAvatarClass = (rank, classes) => {
    if (rank === 1) return classes.avatarFirst;
    if (rank === 2) return classes.avatarSecond;
    if (rank === 3) return classes.avatarThird;
    return classes.avatarDefault;
};

// Get rank color
const getRankClass = (rank, classes) => {
    if (rank === 1) return classes.rankGold;
    if (rank === 2) return classes.rankSilver;
    if (rank === 3) return classes.rankBronze;
    return '';
};

const Leaderboard = ({ compact = false, maxItems = 10 }) => {
    const classes = useStyles();
    const { t, language } = useLocalization();
    const { stats } = useGamification();

    // State
    const [tabValue, setTabValue] = useState(0);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentUserId = localStorage.getItem('angelo_user_id');

    // Load leaderboard data
    const loadLeaderboard = async (type = 'total') => {
        setIsLoading(true);
        try {
            await db.init();
            const data = await db.getLeaderboard(type, maxItems);
            setLeaderboardData(data);
        } catch (e) {
            console.warn('Failed to load leaderboard:', e);
            // Generate mock data for display
            setLeaderboardData([
                { user_id: currentUserId || 'user1', display_name: null, total_xp: stats?.totalXP || 0, level: stats?.level || 1, current_streak: stats?.currentStreak || 0, weekly_xp: 0 },
            ]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadLeaderboard(tabValue === 0 ? 'total' : tabValue === 1 ? 'weekly' : 'streak');
    }, [tabValue]);

    // Add current user to leaderboard if not present
    const enrichedData = useMemo(() => {
        if (!currentUserId || !stats) return leaderboardData;

        const userInList = leaderboardData.find(item => item.user_id === currentUserId);
        if (userInList) return leaderboardData;

        // Add current user at the end with their stats
        return [
            ...leaderboardData,
            {
                user_id: currentUserId,
                display_name: null,
                total_xp: stats.totalXP || 0,
                level: stats.level || 1,
                current_streak: stats.currentStreak || 0,
                weekly_xp: 0,
                isCurrentUser: true,
            }
        ].sort((a, b) => {
            if (tabValue === 0) return b.total_xp - a.total_xp;
            if (tabValue === 1) return b.weekly_xp - a.weekly_xp;
            return b.current_streak - a.current_streak;
        }).slice(0, maxItems);
    }, [leaderboardData, currentUserId, stats, tabValue, maxItems]);

    // Tab labels
    const tabLabels = language === 'af'
        ? ['Totaal', 'Hierdie Week', 'Reeks']
        : ['All Time', 'This Week', 'Streak'];

    // Render podium (top 3)
    const renderPodium = () => {
        if (enrichedData.length < 3) return null;

        const top3 = enrichedData.slice(0, 3);

        return (
            <div className={classes.podium}>
                {[1, 0, 2].map((index) => {
                    const item = top3[index];
                    if (!item) return null;
                    const rank = index === 1 ? 1 : index === 0 ? 2 : 3;
                    const isCurrentUser = item.user_id === currentUserId;

                    return (
                        <div
                            key={item.user_id}
                            className={`${classes.podiumItem} ${
                                rank === 1 ? classes.podiumFirst :
                                rank === 2 ? classes.podiumSecond :
                                classes.podiumThird
                            }`}
                        >
                            <Avatar
                                className={`${classes.podiumAvatar} ${getAvatarClass(rank, classes)}`}
                                style={{
                                    borderColor: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32',
                                    transform: rank === 1 ? 'scale(1.2)' : 'scale(1)',
                                }}
                            >
                                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                            </Avatar>
                            <Typography className={classes.podiumName}>
                                {isCurrentUser
                                    ? (language === 'af' ? 'Jy' : 'You')
                                    : (item.display_name || generateDisplayName(item.user_id))
                                }
                            </Typography>
                            <Typography className={classes.podiumXP}>
                                {tabValue === 2
                                    ? `${item.current_streak} ${language === 'af' ? 'dae' : 'days'}`
                                    : `${(tabValue === 1 ? item.weekly_xp : item.total_xp).toLocaleString()} XP`
                                }
                            </Typography>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Paper className={classes.root} elevation={2}>
            {/* Header */}
            <div className={classes.header}>
                <div className={classes.title}>
                    <TrophyIcon />
                    <Typography variant="h6">
                        {t('gamification.leaderboard') || 'Leaderboard'}
                    </Typography>
                </div>
                <Tooltip title={language === 'af' ? 'Verfris' : 'Refresh'}>
                    <IconButton
                        className={classes.refreshButton}
                        size="small"
                        onClick={() => loadLeaderboard(tabValue === 0 ? 'total' : tabValue === 1 ? 'weekly' : 'streak')}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </div>

            {/* Tabs */}
            <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                className={classes.tabs}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
            >
                <Tab
                    className={classes.tab}
                    icon={<TrophyIcon style={{ fontSize: 16 }} />}
                    label={tabLabels[0]}
                />
                <Tab
                    className={classes.tab}
                    icon={<TrendingIcon style={{ fontSize: 16 }} />}
                    label={tabLabels[1]}
                />
                <Tab
                    className={classes.tab}
                    icon={<FireIcon style={{ fontSize: 16 }} />}
                    label={tabLabels[2]}
                />
            </Tabs>

            {/* Content */}
            {isLoading ? (
                <div className={classes.loadingState}>
                    <CircularProgress size={32} />
                </div>
            ) : enrichedData.length === 0 ? (
                <div className={classes.emptyState}>
                    <Typography>
                        {language === 'af'
                            ? 'Geen data nog nie. Begin leer!'
                            : 'No data yet. Start learning!'
                        }
                    </Typography>
                </div>
            ) : (
                <>
                    {/* Podium for top 3 */}
                    {!compact && renderPodium()}

                    {/* List */}
                    <List className={classes.list}>
                        {enrichedData.slice(compact ? 0 : 3).map((item, index) => {
                            const rank = compact ? index + 1 : index + 4;
                            const isCurrentUser = item.user_id === currentUserId;
                            const displayName = isCurrentUser
                                ? (language === 'af' ? 'Jy' : 'You')
                                : (item.display_name || generateDisplayName(item.user_id));

                            return (
                                <ListItem
                                    key={item.user_id}
                                    className={`${classes.listItem} ${isCurrentUser ? classes.currentUser : ''}`}
                                >
                                    <Typography className={`${classes.rank} ${getRankClass(rank, classes)}`}>
                                        {rank}
                                    </Typography>
                                    <ListItemAvatar>
                                        <Avatar className={`${classes.avatar} ${getAvatarClass(rank, classes)}`}>
                                            {displayName.substring(0, 2).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <span className={classes.username}>
                                                {displayName}
                                                {isCurrentUser && (
                                                    <Chip
                                                        size="small"
                                                        label={language === 'af' ? 'Jy' : 'You'}
                                                        color="primary"
                                                        className={classes.levelChip}
                                                    />
                                                )}
                                            </span>
                                        }
                                        secondary={
                                            <span className={classes.stats}>
                                                <StarIcon style={{ fontSize: 14 }} />
                                                {language === 'af' ? `Vlak ${item.level}` : `Level ${item.level}`}
                                                {item.current_streak > 0 && (
                                                    <span className={classes.streakBadge}>
                                                        <FireIcon style={{ fontSize: 14 }} />
                                                        {item.current_streak}
                                                    </span>
                                                )}
                                            </span>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Typography className={classes.xpBadge} color="primary">
                                            {tabValue === 2
                                                ? `${item.current_streak} 🔥`
                                                : `${(tabValue === 1 ? item.weekly_xp : item.total_xp).toLocaleString()} XP`
                                            }
                                        </Typography>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>
                </>
            )}
        </Paper>
    );
};

export default Leaderboard;
