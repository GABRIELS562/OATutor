/**
 * AudioExplanation - AI-generated audio explanations using Web Speech API
 * JSDT-style feature for step-by-step audio walkthroughs
 *
 * Uses FREE Web Speech API for text-to-speech
 * Integrates with Groq for generating explanations
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    IconButton,
    Typography,
    Slider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress,
    Tooltip,
    Collapse,
    Button,
    CircularProgress,
} from '@material-ui/core';
import {
    VolumeUp,
    VolumeOff,
    PlayArrow,
    Pause,
    Stop,
    SkipNext,
    SkipPrevious,
    Refresh,
    ExpandMore,
    ExpandLess,
    RecordVoiceOver,
} from '@material-ui/icons';
import AudioExplanationService from '../../services/AudioExplanationService';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#fff',
        border: '1px solid rgba(26, 35, 126, 0.1)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(1),
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        fontWeight: 600,
        color: '#1a237e',
    },
    titleIcon: {
        color: '#1a237e',
    },
    expandButton: {
        padding: 4,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    playButton: {
        backgroundColor: '#1a237e',
        color: 'white',
        '&:hover': {
            backgroundColor: '#0d47a1',
        },
        width: 56,
        height: 56,
    },
    secondaryButton: {
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        '&:hover': {
            backgroundColor: 'rgba(26, 35, 126, 0.2)',
        },
    },
    progressContainer: {
        marginBottom: theme.spacing(2),
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        '& .MuiLinearProgress-bar': {
            backgroundColor: '#1a237e',
        },
    },
    timeDisplay: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#666',
        marginTop: theme.spacing(0.5),
    },
    settingsRow: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    volumeSlider: {
        width: 100,
        color: '#1a237e',
    },
    speedSelect: {
        minWidth: 80,
        '& .MuiSelect-root': {
            fontSize: '0.875rem',
        },
    },
    voiceSelect: {
        minWidth: 150,
        '& .MuiSelect-root': {
            fontSize: '0.875rem',
        },
    },
    textPreview: {
        padding: theme.spacing(2),
        backgroundColor: 'rgba(26, 35, 126, 0.03)',
        borderRadius: theme.shape.borderRadius,
        maxHeight: 150,
        overflowY: 'auto',
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: '#333',
        '&::-webkit-scrollbar': {
            width: 6,
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#ccc',
            borderRadius: 3,
        },
    },
    currentWord: {
        backgroundColor: 'rgba(26, 35, 126, 0.2)',
        padding: '2px 4px',
        borderRadius: 2,
    },
    generateButton: {
        marginTop: theme.spacing(2),
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
        },
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3),
        gap: theme.spacing(2),
    },
    errorText: {
        color: theme.palette.error.main,
        fontSize: '0.875rem',
        textAlign: 'center',
        marginTop: theme.spacing(1),
    },
    stepIndicator: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(1),
        fontSize: '0.875rem',
        color: '#666',
    },
}));

const AudioExplanation = ({
    problemId,
    stepId,
    problemText,
    questionText,
    hintText,
    solutionText,
    onComplete,
    autoGenerate = false,
    compact = false,
}) => {
    const classes = useStyles();

    // State
    const [isExpanded, setIsExpanded] = useState(!compact);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(1);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [speed, setSpeed] = useState(1);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [error, setError] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    // Refs
    const utteranceRef = useRef(null);
    const audioServiceRef = useRef(null);
    const wordsRef = useRef([]);

    // Initialize audio service and load voices
    useEffect(() => {
        audioServiceRef.current = AudioExplanationService;

        // Load available voices
        const loadVoices = () => {
            const availableVoices = AudioExplanationService.getAvailableVoices();
            setVoices(availableVoices);

            // Try to select a good default voice (South African English or British English)
            const preferredVoice = availableVoices.find(v =>
                v.lang.includes('en-ZA') ||
                v.lang.includes('en-GB') ||
                v.name.toLowerCase().includes('english')
            ) || availableVoices[0];

            if (preferredVoice) {
                setSelectedVoice(preferredVoice.name);
            }
        };

        // Voices may not be immediately available
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        loadVoices();

        // Auto-generate if enabled
        if (autoGenerate && !explanation) {
            generateExplanation();
        }

        return () => {
            // Cleanup: stop any ongoing speech
            speechSynthesis.cancel();
        };
    }, []);

    // Generate AI explanation
    const generateExplanation = useCallback(async () => {
        setIsGenerating(true);
        setError('');

        try {
            const context = {
                problemId,
                stepId,
                problemText,
                questionText,
                hintText,
                solutionText,
            };

            const generatedText = await AudioExplanationService.generateExplanation(context);
            setExplanation(generatedText);

            // Parse steps if explanation contains numbered steps
            const steps = generatedText.split(/(?=Step \d+:|\d+\.)/g).filter(s => s.trim());
            setTotalSteps(Math.max(1, steps.length));

            // Parse words for highlighting
            wordsRef.current = generatedText.split(/\s+/);

        } catch (err) {
            console.error('Failed to generate explanation:', err);
            setError('Failed to generate explanation. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    }, [problemId, stepId, problemText, questionText, hintText, solutionText]);

    // Play/Resume audio
    const handlePlay = useCallback(() => {
        if (isPaused) {
            speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        if (!explanation) {
            generateExplanation().then(() => {
                // Will play after generation
            });
            return;
        }

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(explanation);
        utterance.rate = speed;
        utterance.volume = volume;

        // Set voice
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) {
            utterance.voice = voice;
        }

        // Track word boundaries for highlighting
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                // Calculate approximate word index
                const wordsUpToIndex = explanation.substring(0, event.charIndex).split(/\s+/).length - 1;
                setCurrentWordIndex(wordsUpToIndex);

                // Update progress
                const progressPercent = (event.charIndex / explanation.length) * 100;
                setProgress(progressPercent);
            }
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(100);
            setCurrentWordIndex(-1);
            if (onComplete) {
                onComplete();
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech error:', event);
            setIsPlaying(false);
            setError('Speech synthesis error. Please try again.');
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
    }, [explanation, speed, volume, selectedVoice, voices, isPaused, onComplete, generateExplanation]);

    // Pause audio
    const handlePause = useCallback(() => {
        speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
    }, []);

    // Stop audio
    const handleStop = useCallback(() => {
        speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
        setCurrentWordIndex(-1);
    }, []);

    // Skip to next step (rough implementation)
    const handleNextStep = useCallback(() => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
            // In a full implementation, this would seek to the next step
        }
    }, [currentStep, totalSteps]);

    // Skip to previous step
    const handlePrevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    // Render text with word highlighting
    const renderHighlightedText = () => {
        if (!explanation) return null;

        return wordsRef.current.map((word, index) => (
            <span
                key={index}
                className={index === currentWordIndex ? classes.currentWord : ''}
            >
                {word}{' '}
            </span>
        ));
    };

    // Loading state
    if (isGenerating) {
        return (
            <Paper className={classes.root}>
                <div className={classes.loadingContainer}>
                    <CircularProgress size={40} style={{ color: '#1a237e' }} />
                    <Typography variant="body2" color="textSecondary">
                        Generating audio explanation...
                    </Typography>
                </div>
            </Paper>
        );
    }

    return (
        <Paper className={classes.root} elevation={0}>
            {/* Header */}
            <div className={classes.header}>
                <Typography className={classes.title}>
                    <RecordVoiceOver className={classes.titleIcon} />
                    Audio Explanation
                </Typography>
                <IconButton
                    size="small"
                    className={classes.expandButton}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </div>

            <Collapse in={isExpanded}>
                {/* Step indicator */}
                {totalSteps > 1 && (
                    <div className={classes.stepIndicator}>
                        Step {currentStep + 1} of {totalSteps}
                    </div>
                )}

                {/* Main controls */}
                <div className={classes.controls}>
                    <Tooltip title="Previous step">
                        <IconButton
                            className={classes.secondaryButton}
                            onClick={handlePrevStep}
                            disabled={currentStep === 0}
                        >
                            <SkipPrevious />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
                        <IconButton
                            className={classes.playButton}
                            onClick={isPlaying ? handlePause : handlePlay}
                        >
                            {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Stop">
                        <IconButton
                            className={classes.secondaryButton}
                            onClick={handleStop}
                            disabled={!isPlaying && !isPaused}
                        >
                            <Stop />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Next step">
                        <IconButton
                            className={classes.secondaryButton}
                            onClick={handleNextStep}
                            disabled={currentStep === totalSteps - 1}
                        >
                            <SkipNext />
                        </IconButton>
                    </Tooltip>
                </div>

                {/* Progress bar */}
                <div className={classes.progressContainer}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        className={classes.progressBar}
                    />
                    <div className={classes.timeDisplay}>
                        <span>{Math.round(progress)}%</span>
                        <span>{isPlaying ? 'Playing...' : isPaused ? 'Paused' : 'Ready'}</span>
                    </div>
                </div>

                {/* Settings row */}
                <div className={classes.settingsRow}>
                    {/* Volume */}
                    <Tooltip title="Volume">
                        <IconButton
                            size="small"
                            onClick={() => setVolume(volume > 0 ? 0 : 1)}
                        >
                            {volume > 0 ? <VolumeUp /> : <VolumeOff />}
                        </IconButton>
                    </Tooltip>
                    <Slider
                        className={classes.volumeSlider}
                        value={volume}
                        onChange={(e, val) => setVolume(val)}
                        min={0}
                        max={1}
                        step={0.1}
                        size="small"
                    />

                    {/* Speed */}
                    <FormControl size="small" className={classes.speedSelect}>
                        <InputLabel>Speed</InputLabel>
                        <Select
                            value={speed}
                            onChange={(e) => setSpeed(e.target.value)}
                            label="Speed"
                        >
                            <MenuItem value={0.5}>0.5x</MenuItem>
                            <MenuItem value={0.75}>0.75x</MenuItem>
                            <MenuItem value={1}>1x</MenuItem>
                            <MenuItem value={1.25}>1.25x</MenuItem>
                            <MenuItem value={1.5}>1.5x</MenuItem>
                            <MenuItem value={2}>2x</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Voice selection */}
                    {voices.length > 0 && (
                        <FormControl size="small" className={classes.voiceSelect}>
                            <InputLabel>Voice</InputLabel>
                            <Select
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                label="Voice"
                            >
                                {voices.map((voice) => (
                                    <MenuItem key={voice.name} value={voice.name}>
                                        {voice.name.split(' ')[0]} ({voice.lang})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </div>

                {/* Text preview with highlighting */}
                {explanation && (
                    <div className={classes.textPreview}>
                        {renderHighlightedText()}
                    </div>
                )}

                {/* Generate button (if no explanation yet) */}
                {!explanation && (
                    <Button
                        fullWidth
                        variant="contained"
                        className={classes.generateButton}
                        onClick={generateExplanation}
                        startIcon={<RecordVoiceOver />}
                    >
                        Generate Audio Explanation
                    </Button>
                )}

                {/* Regenerate button */}
                {explanation && (
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={generateExplanation}
                        startIcon={<Refresh />}
                        style={{ marginTop: 16 }}
                    >
                        Regenerate Explanation
                    </Button>
                )}

                {/* Error message */}
                {error && (
                    <Typography className={classes.errorText}>
                        {error}
                    </Typography>
                )}
            </Collapse>
        </Paper>
    );
};

export default AudioExplanation;
