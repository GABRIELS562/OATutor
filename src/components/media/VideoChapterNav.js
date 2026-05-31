/**
 * VideoChapterNav - JSDT-style chapter navigation for video solutions
 * Displays clickable chapters with timestamps and completion status
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    Chip,
    IconButton,
    Collapse,
    Paper,
} from '@material-ui/core';
import {
    PlayCircleOutline,
    CheckCircle,
    ExpandLess,
    ExpandMore,
    AccessTime,
    BookmarkBorder,
    Bookmark,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
    },
    header: {
        padding: theme.spacing(2),
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontWeight: 600,
        fontSize: '1rem',
    },
    progressChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        fontSize: '0.75rem',
    },
    chapterList: {
        padding: 0,
        maxHeight: 300,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: 6,
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: 3,
        },
    },
    chapterItem: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(26, 35, 126, 0.04)',
        },
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    activeChapter: {
        backgroundColor: 'rgba(26, 35, 126, 0.08)',
        borderLeft: '4px solid #1a237e',
    },
    completedChapter: {
        opacity: 0.7,
    },
    chapterIcon: {
        minWidth: 40,
    },
    playIcon: {
        color: '#1a237e',
        fontSize: '1.5rem',
    },
    checkIcon: {
        color: '#4caf50',
        fontSize: '1.5rem',
    },
    chapterTitle: {
        fontWeight: 500,
        fontSize: '0.9rem',
        color: '#333',
    },
    chapterSubtitle: {
        fontSize: '0.75rem',
        color: '#666',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
    },
    timeIcon: {
        fontSize: '0.875rem',
        color: '#999',
    },
    timestamp: {
        fontFamily: 'monospace',
        fontSize: '0.75rem',
        color: '#666',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: '2px 6px',
        borderRadius: 4,
    },
    bookmarkButton: {
        padding: 6,
    },
    bookmarked: {
        color: '#ff9800',
    },
    subChapterList: {
        paddingLeft: theme.spacing(4),
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    subChapterItem: {
        paddingTop: 4,
        paddingBottom: 4,
    },
    subChapterText: {
        fontSize: '0.8rem',
    },
    expandIcon: {
        transition: 'transform 0.2s',
    },
    durationBadge: {
        fontSize: '0.7rem',
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        color: '#1a237e',
        marginLeft: theme.spacing(1),
    },
}));

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate chapter duration from timestamps
 */
const getChapterDuration = (chapter, nextChapter, totalDuration) => {
    const start = chapter.timestamp || 0;
    const end = nextChapter?.timestamp || totalDuration || start + 60;
    return end - start;
};

const VideoChapterNav = ({
    chapters = [],
    currentTime = 0,
    totalDuration = 0,
    onChapterClick,
    onBookmarkToggle,
    bookmarkedChapters = [],
    completedChapters = [],
    compact = false,
}) => {
    const classes = useStyles();
    const [expandedChapters, setExpandedChapters] = React.useState({});

    // Find active chapter based on current time
    const activeChapterIndex = React.useMemo(() => {
        for (let i = chapters.length - 1; i >= 0; i--) {
            if (currentTime >= (chapters[i].timestamp || 0)) {
                return i;
            }
        }
        return 0;
    }, [chapters, currentTime]);

    // Calculate completion progress
    const completionProgress = React.useMemo(() => {
        if (chapters.length === 0) return 0;
        return Math.round((completedChapters.length / chapters.length) * 100);
    }, [chapters.length, completedChapters.length]);

    const handleChapterClick = (chapter, index) => {
        if (onChapterClick) {
            onChapterClick(chapter, index);
        }
    };

    const handleExpandToggle = (index, e) => {
        e.stopPropagation();
        setExpandedChapters(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleBookmark = (chapterId, e) => {
        e.stopPropagation();
        if (onBookmarkToggle) {
            onBookmarkToggle(chapterId);
        }
    };

    const isBookmarked = (chapterId) => bookmarkedChapters.includes(chapterId);
    const isCompleted = (chapterId) => completedChapters.includes(chapterId);

    if (chapters.length === 0) {
        return null;
    }

    return (
        <Paper className={classes.root} elevation={1}>
            {/* Header */}
            <div className={classes.header}>
                <Typography className={classes.headerTitle}>
                    Chapters ({chapters.length})
                </Typography>
                <Chip
                    size="small"
                    label={`${completionProgress}% Complete`}
                    className={classes.progressChip}
                />
            </div>

            {/* Chapter List */}
            <List className={classes.chapterList} dense={compact}>
                {chapters.map((chapter, index) => {
                    const isActive = index === activeChapterIndex;
                    const completed = isCompleted(chapter.id || `chapter-${index}`);
                    const bookmarked = isBookmarked(chapter.id || `chapter-${index}`);
                    const hasSubChapters = chapter.subChapters && chapter.subChapters.length > 0;
                    const isExpanded = expandedChapters[index];
                    const duration = getChapterDuration(chapter, chapters[index + 1], totalDuration);

                    return (
                        <React.Fragment key={chapter.id || `chapter-${index}`}>
                            <ListItem
                                button
                                className={`${classes.chapterItem} ${isActive ? classes.activeChapter : ''} ${completed ? classes.completedChapter : ''}`}
                                onClick={() => handleChapterClick(chapter, index)}
                            >
                                <ListItemIcon className={classes.chapterIcon}>
                                    {completed ? (
                                        <CheckCircle className={classes.checkIcon} />
                                    ) : (
                                        <PlayCircleOutline className={classes.playIcon} />
                                    )}
                                </ListItemIcon>

                                <ListItemText
                                    primary={
                                        <Typography className={classes.chapterTitle}>
                                            {chapter.title || `Chapter ${index + 1}`}
                                            <Chip
                                                size="small"
                                                label={formatTime(duration)}
                                                className={classes.durationBadge}
                                            />
                                        </Typography>
                                    }
                                    secondary={
                                        <span className={classes.chapterSubtitle}>
                                            <AccessTime className={classes.timeIcon} />
                                            <span className={classes.timestamp}>
                                                {formatTime(chapter.timestamp)}
                                            </span>
                                            {chapter.description && (
                                                <span> - {chapter.description}</span>
                                            )}
                                        </span>
                                    }
                                />

                                <ListItemSecondaryAction>
                                    <IconButton
                                        size="small"
                                        className={`${classes.bookmarkButton} ${bookmarked ? classes.bookmarked : ''}`}
                                        onClick={(e) => handleBookmark(chapter.id || `chapter-${index}`, e)}
                                    >
                                        {bookmarked ? <Bookmark /> : <BookmarkBorder />}
                                    </IconButton>

                                    {hasSubChapters && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleExpandToggle(index, e)}
                                        >
                                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>

                            {/* Sub-chapters */}
                            {hasSubChapters && (
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding className={classes.subChapterList}>
                                        {chapter.subChapters.map((subChapter, subIndex) => (
                                            <ListItem
                                                key={`${chapter.id}-sub-${subIndex}`}
                                                button
                                                className={classes.subChapterItem}
                                                onClick={() => handleChapterClick(subChapter, index)}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography className={classes.subChapterText}>
                                                            {subChapter.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <span className={classes.timestamp}>
                                                            {formatTime(subChapter.timestamp)}
                                                        </span>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    );
                })}
            </List>
        </Paper>
    );
};

export default VideoChapterNav;
