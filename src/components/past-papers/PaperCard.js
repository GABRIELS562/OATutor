/**
 * PaperCard - Display card for a past paper
 * Shows paper details, download status, and actions
 */

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    IconButton,
    Chip,
    LinearProgress,
    Tooltip,
} from '@material-ui/core';
import {
    Description,
    CloudDownload,
    CloudDone,
    Visibility,
    CheckCircle,
    Lock,
    Delete,
} from '@material-ui/icons';
import { getPaperPath, getMemoPath, PAPER_TYPES } from '../../data/pastPapersIndex';
import OfflinePapersService from '../../services/OfflinePapersService';

const useStyles = makeStyles((theme) => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: theme.shape.borderRadius * 2,
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
    },
    cardUnavailable: {
        opacity: 0.7,
    },
    header: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing(1.5),
        marginBottom: theme.spacing(1),
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    iconNSC: {
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
    },
    iconIEB: {
        background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
        color: 'white',
    },
    iconTrial: {
        background: 'linear-gradient(135deg, #00796b 0%, #009688 100%)',
        color: 'white',
    },
    icon: {
        fontSize: 24,
    },
    titleContainer: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.3,
    },
    year: {
        color: '#666',
        fontSize: '0.875rem',
    },
    content: {
        flex: 1,
        paddingTop: 0,
    },
    metaRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(1),
    },
    chip: {
        height: 24,
        fontSize: '0.75rem',
    },
    chipPaper1: {
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        color: '#1a237e',
    },
    chipPaper2: {
        backgroundColor: 'rgba(0, 121, 107, 0.1)',
        color: '#00796b',
    },
    topicsRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(1),
    },
    topicChip: {
        height: 20,
        fontSize: '0.7rem',
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
    statsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(1.5),
        padding: theme.spacing(1),
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: theme.shape.borderRadius,
    },
    stat: {
        textAlign: 'center',
    },
    statValue: {
        fontWeight: 600,
        color: '#1a237e',
    },
    statLabel: {
        fontSize: '0.7rem',
        color: '#666',
        textTransform: 'uppercase',
    },
    actions: {
        padding: theme.spacing(1, 2, 2),
        gap: theme.spacing(1),
    },
    viewButton: {
        flex: 1,
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
        },
    },
    downloadButton: {
        minWidth: 'auto',
    },
    progressContainer: {
        padding: theme.spacing(0, 2, 1),
    },
    offlineIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
        fontSize: '0.75rem',
        color: '#4caf50',
        marginTop: theme.spacing(1),
    },
    unavailableNote: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderRadius: theme.shape.borderRadius,
        fontSize: '0.8rem',
        color: '#e65100',
    },
}));

const PaperCard = ({ paper, onView, onViewMemo }) => {
    const classes = useStyles();
    const [isCached, setIsCached] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const paperUrl = getPaperPath(paper);
    const memoUrl = getMemoPath(paper);

    // Check if paper is cached on mount
    useEffect(() => {
        const checkCache = async () => {
            const cached = await OfflinePapersService.isPaperCached(paperUrl);
            setIsCached(cached);
        };
        checkCache();
    }, [paperUrl]);

    // Get icon style based on paper type
    const getIconClass = () => {
        switch (paper.type) {
            case PAPER_TYPES.IEB:
                return classes.iconIEB;
            case PAPER_TYPES.TRIAL:
            case PAPER_TYPES.PROVINCIAL:
                return classes.iconTrial;
            default:
                return classes.iconNSC;
        }
    };

    // Get paper type label
    const getTypeLabel = () => {
        switch (paper.type) {
            case PAPER_TYPES.NSC:
                return 'NSC';
            case PAPER_TYPES.NSC_SUPPLEMENTARY:
                return 'Supplementary';
            case PAPER_TYPES.IEB:
                return 'IEB';
            case PAPER_TYPES.TRIAL:
                return `${paper.province?.toUpperCase() || ''} Trial`;
            case PAPER_TYPES.PROVINCIAL:
                return `${paper.province?.toUpperCase() || ''} Provincial`;
            default:
                return paper.type;
        }
    };

    // Handle download
    const handleDownload = async () => {
        if (!paper.isAvailable) return;

        setIsDownloading(true);
        setDownloadProgress(0);

        try {
            // Download paper
            await OfflinePapersService.downloadPaper(paperUrl, (progress) => {
                setDownloadProgress(progress * 0.6); // Paper is 60% of total
            });

            // Download memo if available
            if (paper.hasMemo) {
                await OfflinePapersService.downloadPaper(memoUrl, (progress) => {
                    setDownloadProgress(60 + progress * 0.4); // Memo is 40% of total
                });
            }

            setIsCached(true);
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    // Handle remove from cache
    const handleRemove = async () => {
        await OfflinePapersService.removePaper(paperUrl);
        if (paper.hasMemo) {
            await OfflinePapersService.removePaper(memoUrl);
        }
        setIsCached(false);
    };

    // Handle view
    const handleView = () => {
        if (onView) {
            onView(paper, paperUrl);
        } else {
            window.open(paperUrl, '_blank');
        }
    };

    // Handle view memo
    const handleViewMemo = () => {
        if (onViewMemo) {
            onViewMemo(paper, memoUrl);
        } else {
            window.open(memoUrl, '_blank');
        }
    };

    return (
        <Card className={`${classes.card} ${!paper.isAvailable ? classes.cardUnavailable : ''}`}>
            <CardContent className={classes.content}>
                {/* Header */}
                <div className={classes.header}>
                    <div className={`${classes.iconContainer} ${getIconClass()}`}>
                        {paper.isAvailable ? (
                            <Description className={classes.icon} />
                        ) : (
                            <Lock className={classes.icon} />
                        )}
                    </div>
                    <div className={classes.titleContainer}>
                        <Typography className={classes.title}>
                            {paper.title}
                        </Typography>
                        <Typography className={classes.year}>
                            {getTypeLabel()} • {paper.year}
                        </Typography>
                    </div>
                </div>

                {/* Meta chips */}
                <div className={classes.metaRow}>
                    <Chip
                        label={paper.variant === 'p1' ? 'Paper 1' : 'Paper 2'}
                        size="small"
                        className={`${classes.chip} ${paper.variant === 'p1' ? classes.chipPaper1 : classes.chipPaper2}`}
                    />
                    <Chip
                        label={`Grade ${paper.grade}`}
                        size="small"
                        className={classes.chip}
                    />
                    {paper.hasMemo && (
                        <Chip
                            label="With Memo"
                            size="small"
                            className={classes.chip}
                            icon={<CheckCircle style={{ fontSize: 14 }} />}
                        />
                    )}
                </div>

                {/* Topics */}
                <div className={classes.topicsRow}>
                    {paper.topics.slice(0, 4).map((topic) => (
                        <Chip
                            key={topic}
                            label={topic.replace(/-/g, ' ')}
                            size="small"
                            className={classes.topicChip}
                        />
                    ))}
                </div>

                {/* Stats */}
                <div className={classes.statsRow}>
                    <div className={classes.stat}>
                        <Typography className={classes.statValue}>
                            {paper.totalMarks}
                        </Typography>
                        <Typography className={classes.statLabel}>Marks</Typography>
                    </div>
                    <div className={classes.stat}>
                        <Typography className={classes.statValue}>
                            {Math.floor(paper.duration / 60)}h
                        </Typography>
                        <Typography className={classes.statLabel}>Duration</Typography>
                    </div>
                    <div className={classes.stat}>
                        <Typography className={classes.statValue}>
                            {paper.topics.length}
                        </Typography>
                        <Typography className={classes.statLabel}>Topics</Typography>
                    </div>
                </div>

                {/* Offline indicator */}
                {isCached && (
                    <div className={classes.offlineIndicator}>
                        <CloudDone style={{ fontSize: 16 }} />
                        Available offline
                    </div>
                )}

                {/* Unavailable note */}
                {!paper.isAvailable && paper.note && (
                    <div className={classes.unavailableNote}>
                        {paper.note}
                    </div>
                )}
            </CardContent>

            {/* Download progress */}
            {isDownloading && (
                <div className={classes.progressContainer}>
                    <LinearProgress variant="determinate" value={downloadProgress} />
                </div>
            )}

            {/* Actions */}
            <CardActions className={classes.actions}>
                <Button
                    variant="contained"
                    className={classes.viewButton}
                    startIcon={<Visibility />}
                    onClick={handleView}
                    disabled={!paper.isAvailable}
                >
                    View Paper
                </Button>

                {paper.hasMemo && (
                    <Tooltip title="View Memo">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleViewMemo}
                            disabled={!paper.isAvailable}
                        >
                            Memo
                        </Button>
                    </Tooltip>
                )}

                {paper.isAvailable && (
                    isCached ? (
                        <Tooltip title="Remove offline copy">
                            <IconButton
                                size="small"
                                className={classes.downloadButton}
                                onClick={handleRemove}
                            >
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Download for offline">
                            <IconButton
                                size="small"
                                className={classes.downloadButton}
                                onClick={handleDownload}
                                disabled={isDownloading}
                            >
                                <CloudDownload />
                            </IconButton>
                        </Tooltip>
                    )
                )}
            </CardActions>
        </Card>
    );
};

export default PaperCard;
