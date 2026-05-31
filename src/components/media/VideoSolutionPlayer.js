/**
 * VideoSolutionPlayer Component
 * JSDT-style video solution player with step-by-step navigation
 * Supports YouTube embeds, self-hosted videos, and AI audio explanations
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    IconButton,
    Typography,
    Slider,
    Collapse,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Menu,
    MenuItem,
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import SpeedIcon from '@material-ui/icons/Speed';
import ListIcon from '@material-ui/icons/List';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';

const useStyles = makeStyles((theme) => ({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(123, 47, 247, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)',
        border: '1px solid rgba(123, 47, 247, 0.2)',
    },
    videoWrapper: {
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%', // 16:9 aspect ratio
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    iframe: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
    },
    controls: {
        padding: theme.spacing(1, 2),
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        transition: 'opacity 0.3s ease',
    },
    controlsHidden: {
        opacity: 0,
    },
    progressBar: {
        marginBottom: theme.spacing(1),
    },
    progressSlider: {
        color: '#7B2FF7',
        height: 4,
        '& .MuiSlider-thumb': {
            height: 12,
            width: 12,
            backgroundColor: '#fff',
            '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(123, 47, 247, 0.16)',
            },
        },
        '& .MuiSlider-rail': {
            opacity: 0.3,
            backgroundColor: '#fff',
        },
    },
    controlButtons: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftControls: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    rightControls: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    iconButton: {
        color: '#fff',
        padding: 8,
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
    },
    timeDisplay: {
        color: '#fff',
        fontSize: '0.875rem',
        fontFamily: 'monospace',
        marginLeft: theme.spacing(1),
    },
    volumeSlider: {
        width: 80,
        color: '#fff',
        marginLeft: theme.spacing(1),
        '& .MuiSlider-thumb': {
            width: 10,
            height: 10,
        },
    },
    chaptersSection: {
        borderTop: '1px solid rgba(123, 47, 247, 0.2)',
    },
    chapterHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(1.5, 2),
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(123, 47, 247, 0.05)',
        },
    },
    chapterTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    chapterList: {
        maxHeight: 300,
        overflow: 'auto',
        padding: 0,
    },
    chapterItem: {
        borderLeft: '3px solid transparent',
        '&:hover': {
            backgroundColor: 'rgba(123, 47, 247, 0.05)',
        },
    },
    chapterItemActive: {
        borderLeftColor: '#7B2FF7',
        backgroundColor: 'rgba(123, 47, 247, 0.1)',
    },
    chapterItemCompleted: {
        '& .MuiListItemText-primary': {
            color: theme.palette.success.main,
        },
    },
    chapterTime: {
        color: theme.palette.text.secondary,
        fontSize: '0.75rem',
        fontFamily: 'monospace',
    },
    speedChip: {
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        fontSize: '0.75rem',
        height: 24,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        cursor: 'pointer',
    },
    playButtonLarge: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(123, 47, 247, 0.9)',
        '&:hover': {
            backgroundColor: '#7B2FF7',
        },
    },
}));

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const REGEX_YOUTUBE = /^((?:https?:)?\/\/)?((?:www|m)\.)?(youtube(-nocookie)?\.com|youtu.be)(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoSolutionPlayer({
    videoUrl,
    videoType = 'auto', // 'youtube', 'self-hosted', 'auto'
    chapters = [], // [{time: 0, label: "Step 1", completed: false}, ...]
    onChapterComplete,
    onVideoComplete,
    problemId,
    stepId,
}) {
    const classes = useStyles();
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [showChapters, setShowChapters] = useState(true);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [completedChapters, setCompletedChapters] = useState(new Set());
    const [speedAnchorEl, setSpeedAnchorEl] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);

    // Detect video type
    const detectedType = videoType === 'auto'
        ? (REGEX_YOUTUBE.test(videoUrl) ? 'youtube' : 'self-hosted')
        : videoType;

    const isYouTube = detectedType === 'youtube';

    // Extract YouTube video ID
    const youtubeMatch = videoUrl?.match(REGEX_YOUTUBE);
    const youtubeId = youtubeMatch ? youtubeMatch[6] : null;

    // Handle video time update
    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            const time = videoRef.current.currentTime;
            setCurrentTime(time);

            // Update current chapter
            if (chapters.length > 0) {
                for (let i = chapters.length - 1; i >= 0; i--) {
                    if (time >= chapters[i].time) {
                        if (i !== currentChapterIndex) {
                            setCurrentChapterIndex(i);
                            // Mark previous chapter as completed
                            if (i > 0 && !completedChapters.has(i - 1)) {
                                const newCompleted = new Set(completedChapters);
                                newCompleted.add(i - 1);
                                setCompletedChapters(newCompleted);
                                onChapterComplete?.(chapters[i - 1], i - 1);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }, [chapters, currentChapterIndex, completedChapters, onChapterComplete]);

    // Handle video loaded
    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    }, []);

    // Handle video ended
    const handleEnded = useCallback(() => {
        setIsPlaying(false);
        // Mark last chapter as completed
        if (chapters.length > 0) {
            const newCompleted = new Set(completedChapters);
            newCompleted.add(chapters.length - 1);
            setCompletedChapters(newCompleted);
            onChapterComplete?.(chapters[chapters.length - 1], chapters.length - 1);
        }
        onVideoComplete?.();
    }, [chapters, completedChapters, onChapterComplete, onVideoComplete]);

    // Play/Pause toggle
    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
                setHasStarted(true);
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    // Seek to time
    const seekTo = useCallback((time) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    // Handle chapter click
    const handleChapterClick = useCallback((chapter, index) => {
        seekTo(chapter.time);
        setCurrentChapterIndex(index);
        if (!isPlaying && videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
            setHasStarted(true);
        }
    }, [seekTo, isPlaying]);

    // Handle volume change
    const handleVolumeChange = useCallback((_, newValue) => {
        const vol = newValue / 100;
        setVolume(vol);
        setIsMuted(vol === 0);
        if (videoRef.current) {
            videoRef.current.volume = vol;
        }
    }, []);

    // Toggle mute
    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
        }
    }, [isMuted]);

    // Handle playback speed
    const handleSpeedChange = useCallback((speed) => {
        setPlaybackSpeed(speed);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
        setSpeedAnchorEl(null);
    }, []);

    // Handle progress bar change
    const handleProgressChange = useCallback((_, newValue) => {
        seekTo((newValue / 100) * duration);
    }, [seekTo, duration]);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen();
            }
        }
    }, []);

    // Auto-hide controls
    useEffect(() => {
        let timeout;
        if (isPlaying) {
            timeout = setTimeout(() => setShowControls(false), 3000);
        } else {
            setShowControls(true);
        }
        return () => clearTimeout(timeout);
    }, [isPlaying, currentTime]);

    // YouTube embed
    if (isYouTube) {
        // Build YouTube URL with chapters as timestamps
        const chapterParams = chapters.length > 0 ? `&start=${Math.floor(chapters[0]?.time || 0)}` : '';
        const youtubeUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?controls=1&modestbranding=1&rel=0&cc_load_policy=1${chapterParams}`;

        return (
            <Card className={classes.container}>
                <div className={classes.videoWrapper}>
                    <iframe
                        className={classes.iframe}
                        src={youtubeUrl}
                        title="Video Solution"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                {chapters.length > 0 && (
                    <div className={classes.chaptersSection}>
                        <div
                            className={classes.chapterHeader}
                            onClick={() => setShowChapters(!showChapters)}
                        >
                            <div className={classes.chapterTitle}>
                                <ListIcon color="primary" />
                                <Typography variant="subtitle2">
                                    Step-by-Step Chapters ({chapters.length})
                                </Typography>
                            </div>
                            {showChapters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </div>
                        <Collapse in={showChapters}>
                            <List className={classes.chapterList}>
                                {chapters.map((chapter, index) => (
                                    <ListItem
                                        key={index}
                                        button
                                        className={`${classes.chapterItem}`}
                                        onClick={() => {
                                            // For YouTube, we need to reload with new start time
                                            const iframe = document.querySelector('iframe');
                                            if (iframe) {
                                                iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?controls=1&modestbranding=1&rel=0&autoplay=1&start=${Math.floor(chapter.time)}`;
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <RadioButtonUncheckedIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={chapter.label}
                                            secondary={formatTime(chapter.time)}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </div>
                )}
            </Card>
        );
    }

    // Self-hosted video player
    return (
        <Card className={classes.container} ref={containerRef}>
            <div
                className={classes.videoWrapper}
                onMouseMove={() => setShowControls(true)}
                onMouseLeave={() => isPlaying && setShowControls(false)}
            >
                <video
                    ref={videoRef}
                    className={classes.video}
                    src={videoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlay}
                />

                {/* Play overlay when not started */}
                {!hasStarted && (
                    <div className={classes.overlay} onClick={togglePlay}>
                        <IconButton className={classes.playButtonLarge}>
                            <PlayArrowIcon style={{ fontSize: 48, color: '#fff' }} />
                        </IconButton>
                    </div>
                )}

                {/* Controls */}
                <div className={`${classes.controls} ${!showControls && hasStarted ? classes.controlsHidden : ''}`}>
                    {/* Progress bar */}
                    <div className={classes.progressBar}>
                        <Slider
                            className={classes.progressSlider}
                            value={duration > 0 ? (currentTime / duration) * 100 : 0}
                            onChange={handleProgressChange}
                            aria-label="Video progress"
                        />
                    </div>

                    {/* Control buttons */}
                    <div className={classes.controlButtons}>
                        <div className={classes.leftControls}>
                            <IconButton className={classes.iconButton} onClick={togglePlay}>
                                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>

                            <IconButton className={classes.iconButton} onClick={toggleMute}>
                                {isMuted ? <VolumeOffIcon /> : volume < 0.5 ? <VolumeDownIcon /> : <VolumeUpIcon />}
                            </IconButton>

                            <Slider
                                className={classes.volumeSlider}
                                value={isMuted ? 0 : volume * 100}
                                onChange={handleVolumeChange}
                                aria-label="Volume"
                            />

                            <Typography className={classes.timeDisplay}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </Typography>
                        </div>

                        <div className={classes.rightControls}>
                            <Chip
                                className={classes.speedChip}
                                icon={<SpeedIcon style={{ color: '#fff', fontSize: 16 }} />}
                                label={`${playbackSpeed}x`}
                                onClick={(e) => setSpeedAnchorEl(e.currentTarget)}
                                size="small"
                            />
                            <Menu
                                anchorEl={speedAnchorEl}
                                open={Boolean(speedAnchorEl)}
                                onClose={() => setSpeedAnchorEl(null)}
                            >
                                {PLAYBACK_SPEEDS.map((speed) => (
                                    <MenuItem
                                        key={speed}
                                        selected={speed === playbackSpeed}
                                        onClick={() => handleSpeedChange(speed)}
                                    >
                                        {speed}x
                                    </MenuItem>
                                ))}
                            </Menu>

                            <IconButton className={classes.iconButton} onClick={toggleFullscreen}>
                                <FullscreenIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapters section */}
            {chapters.length > 0 && (
                <div className={classes.chaptersSection}>
                    <div
                        className={classes.chapterHeader}
                        onClick={() => setShowChapters(!showChapters)}
                    >
                        <div className={classes.chapterTitle}>
                            <ListIcon color="primary" />
                            <Typography variant="subtitle2">
                                Step-by-Step Chapters ({completedChapters.size}/{chapters.length} completed)
                            </Typography>
                        </div>
                        {showChapters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <Collapse in={showChapters}>
                        <List className={classes.chapterList}>
                            {chapters.map((chapter, index) => (
                                <ListItem
                                    key={index}
                                    button
                                    className={`${classes.chapterItem} ${
                                        index === currentChapterIndex ? classes.chapterItemActive : ''
                                    } ${completedChapters.has(index) ? classes.chapterItemCompleted : ''}`}
                                    onClick={() => handleChapterClick(chapter, index)}
                                >
                                    <ListItemIcon>
                                        {completedChapters.has(index) ? (
                                            <CheckCircleIcon fontSize="small" color="primary" />
                                        ) : (
                                            <RadioButtonUncheckedIcon fontSize="small" />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={chapter.label}
                                        secondary={
                                            <span className={classes.chapterTime}>
                                                {formatTime(chapter.time)}
                                            </span>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </div>
            )}
        </Card>
    );
}
