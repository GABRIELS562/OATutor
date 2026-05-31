/**
 * PhotoSolutionPage - JSDT-style "Mathie AI" photo-to-solution feature
 *
 * Workflow:
 * 1. Capture photo or upload image
 * 2. OCR extracts math content (Gemini Vision - FREE)
 * 3. Generate step-by-step solution (Groq - FREE)
 * 4. Display with exam tips and practice links
 */

import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Paper,
    Typography,
    Tabs,
    Tab,
    Button,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    Fade,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import {
    CameraAlt,
    CloudUpload,
    ArrowBack,
    CheckCircle,
    Warning,
    Refresh,
    HelpOutline,
} from '@material-ui/icons';
import BrandLogoNav from '../../components/BrandLogoNav';
import CameraCapture from '../../components/photo-solution/CameraCapture';
import PhotoUpload from '../../components/photo-solution/PhotoUpload';
import SolutionDisplay from '../../components/photo-solution/SolutionDisplay';
import MathOCRService from '../../services/MathOCRService';
import SolutionGeneratorService from '../../services/SolutionGeneratorService';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
    },
    container: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(6),
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },
    backButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flex: 1,
        fontWeight: 700,
        color: '#58CC02',
        fontFamily: "'Nunito', sans-serif",
    },
    helpButton: {
        color: '#666',
    },
    mainCard: {
        borderRadius: theme.shape.borderRadius * 2,
        overflow: 'hidden',
    },
    tabs: {
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
    },
    tab: {
        minWidth: '50%',
        fontWeight: 500,
    },
    tabContent: {
        padding: theme.spacing(3),
    },
    stepperContainer: {
        padding: theme.spacing(2),
        backgroundColor: 'rgba(88, 204, 2, 0.02)',
    },
    stepper: {
        backgroundColor: 'transparent',
        padding: 0,
    },
    stepLabel: {
        '& .MuiStepLabel-label': {
            fontWeight: 500,
        },
    },
    previewContainer: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
        backgroundColor: '#fff',
        borderRadius: theme.shape.borderRadius,
        border: '1px solid rgba(0,0,0,0.08)',
    },
    previewImage: {
        width: '100%',
        maxHeight: 300,
        objectFit: 'contain',
        borderRadius: theme.shape.borderRadius,
    },
    ocrResult: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: 'rgba(88, 204, 2, 0.03)',
        borderRadius: 16,
        borderLeft: '4px solid #58CC02',
    },
    ocrLabel: {
        fontSize: '0.75rem',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: theme.spacing(1),
    },
    ocrText: {
        fontFamily: '"Roboto Mono", monospace',
        whiteSpace: 'pre-wrap',
    },
    actionButtons: {
        display: 'flex',
        gap: theme.spacing(2),
        marginTop: theme.spacing(3),
    },
    solveButton: {
        flex: 1,
        backgroundColor: '#58CC02',
        color: 'white',
        padding: theme.spacing(1.5),
        borderRadius: 16,
        boxShadow: '0 4px 0 0 #58A700',
        fontWeight: 700,
        fontFamily: "'Nunito', sans-serif",
        '&:hover': {
            backgroundColor: '#58A700',
            boxShadow: '0 2px 0 0 #4B9200',
        },
    },
    resetButton: {
        borderColor: '#666',
        color: '#666',
    },
    solutionContainer: {
        marginTop: theme.spacing(3),
    },
    historySection: {
        marginTop: theme.spacing(4),
        padding: theme.spacing(3),
        backgroundColor: '#fff',
        borderRadius: theme.shape.borderRadius * 2,
    },
    historyTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(2),
        color: '#333',
    },
    errorContainer: {
        padding: theme.spacing(3),
        textAlign: 'center',
    },
    errorIcon: {
        fontSize: 48,
        color: '#f44336',
        marginBottom: theme.spacing(2),
    },
    apiStatus: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderRadius: theme.shape.borderRadius,
    },
}));

const STEPS = ['Capture Image', 'Extract Math', 'Generate Solution'];

const PhotoSolutionPage = ({ history }) => {
    const classes = useStyles();

    // State
    const [tabValue, setTabValue] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [capturedImage, setCapturedImage] = useState(null);
    const [ocrResult, setOcrResult] = useState(null);
    const [solution, setSolution] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [helpOpen, setHelpOpen] = useState(false);

    // Handle image capture/upload
    const handleImageReceived = useCallback(async (imageData) => {
        setCapturedImage(imageData);
        setActiveStep(1);
        setError(null);
        setOcrResult(null);
        setSolution(null);

        // Perform OCR
        setIsProcessing(true);
        try {
            const result = await MathOCRService.recognizeMath(imageData);
            setOcrResult(result);
            setActiveStep(2);

            // Show snackbar
            setSnackbar({
                open: true,
                message: result.parseError
                    ? 'Math content extracted (basic)'
                    : `Detected: ${result.subject || 'Mathematics'} problem`
            });

        } catch (err) {
            console.error('OCR error:', err);
            setError({
                type: 'ocr',
                message: err.message || 'Failed to extract math from image'
            });
        } finally {
            setIsProcessing(false);
        }
    }, []);

    // Generate solution
    const handleGenerateSolution = useCallback(async () => {
        if (!ocrResult) return;

        setIsProcessing(true);
        setError(null);
        setActiveStep(2);

        try {
            // Use streaming for real-time display
            setIsStreaming(true);
            setStreamingContent('');

            await SolutionGeneratorService.generateSolutionStream(
                ocrResult,
                (chunk) => {
                    setStreamingContent(chunk);
                },
                (result) => {
                    setSolution(result);
                    setIsStreaming(false);
                    setActiveStep(3);
                },
                (err) => {
                    // Fallback to non-streaming
                    setIsStreaming(false);
                    SolutionGeneratorService.generateSolution(ocrResult)
                        .then(result => {
                            setSolution(result);
                            setActiveStep(3);
                        })
                        .catch(e => {
                            setError({
                                type: 'solution',
                                message: e.message || 'Failed to generate solution'
                            });
                        });
                }
            );

        } catch (err) {
            console.error('Solution error:', err);
            setError({
                type: 'solution',
                message: err.message || 'Failed to generate solution'
            });
            setIsStreaming(false);
        } finally {
            setIsProcessing(false);
        }
    }, [ocrResult]);

    // Reset state
    const handleReset = () => {
        setCapturedImage(null);
        setOcrResult(null);
        setSolution(null);
        setActiveStep(0);
        setError(null);
        setIsStreaming(false);
        setStreamingContent('');
    };

    // Regenerate solution
    const handleRegenerate = () => {
        setSolution(null);
        handleGenerateSolution();
    };

    // Check API status
    const apiStatus = {
        ocr: MathOCRService.getApiStatus(),
        solution: SolutionGeneratorService.getApiStatus()
    };
    const isReady = apiStatus.ocr.configured || apiStatus.solution.ready;

    return (
        <div className={classes.root}>
            <BrandLogoNav />

            <Container maxWidth="md" className={classes.container}>
                {/* Header */}
                <div className={classes.header}>
                    <IconButton
                        className={classes.backButton}
                        onClick={() => history?.goBack() || window.history.back()}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" className={classes.title}>
                        Solve with Photo
                    </Typography>
                    <IconButton
                        className={classes.helpButton}
                        onClick={() => setHelpOpen(true)}
                    >
                        <HelpOutline />
                    </IconButton>
                </div>

                {/* API Status Warning */}
                {!isReady && (
                    <Paper className={classes.apiStatus}>
                        <Typography variant="body2" color="textSecondary">
                            <Warning style={{ fontSize: 18, verticalAlign: 'middle' }} />
                            {' '}AI features require API keys. Add REACT_APP_GEMINI_API_KEY and/or
                            REACT_APP_GROQ_API_KEY to your environment.
                        </Typography>
                    </Paper>
                )}

                {/* Main Card */}
                <Paper className={classes.mainCard} elevation={2}>
                    {/* Progress Stepper */}
                    <div className={classes.stepperContainer}>
                        <Stepper
                            activeStep={activeStep}
                            alternativeLabel
                            className={classes.stepper}
                        >
                            {STEPS.map((label) => (
                                <Step key={label}>
                                    <StepLabel className={classes.stepLabel}>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </div>

                    {/* Input Tabs (Camera/Upload) - only show before capture */}
                    {!capturedImage && (
                        <>
                            <Tabs
                                value={tabValue}
                                onChange={(e, v) => setTabValue(v)}
                                className={classes.tabs}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                            >
                                <Tab
                                    icon={<CameraAlt />}
                                    label="Camera"
                                    className={classes.tab}
                                />
                                <Tab
                                    icon={<CloudUpload />}
                                    label="Upload"
                                    className={classes.tab}
                                />
                            </Tabs>

                            <div className={classes.tabContent}>
                                {tabValue === 0 && (
                                    <CameraCapture onCapture={handleImageReceived} />
                                )}
                                {tabValue === 1 && (
                                    <PhotoUpload
                                        onUpload={handleImageReceived}
                                        onValidate={(file) =>
                                            MathOCRService.validateMathImage(file)
                                                .catch(() => ({ valid: true }))
                                        }
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {/* Preview & OCR Result */}
                    {capturedImage && !solution && (
                        <div className={classes.tabContent}>
                            <div className={classes.previewContainer}>
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className={classes.previewImage}
                                />

                                {/* OCR Result */}
                                {ocrResult && (
                                    <Fade in>
                                        <div className={classes.ocrResult}>
                                            <Typography className={classes.ocrLabel}>
                                                Extracted Content
                                            </Typography>
                                            <Typography className={classes.ocrText}>
                                                {ocrResult.latex || ocrResult.plainText || 'Content extracted'}
                                            </Typography>
                                            {ocrResult.topic && (
                                                <Typography variant="body2" color="primary" style={{ marginTop: 8 }}>
                                                    Topic: {ocrResult.topic}
                                                </Typography>
                                            )}
                                        </div>
                                    </Fade>
                                )}

                                {/* Error */}
                                {error && (
                                    <div className={classes.errorContainer}>
                                        <Warning className={classes.errorIcon} />
                                        <Typography color="error" gutterBottom>
                                            {error.message}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            onClick={handleReset}
                                            startIcon={<Refresh />}
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {ocrResult && !error && (
                                    <div className={classes.actionButtons}>
                                        <Button
                                            variant="outlined"
                                            className={classes.resetButton}
                                            onClick={handleReset}
                                            startIcon={<Refresh />}
                                        >
                                            New Photo
                                        </Button>
                                        <Button
                                            variant="contained"
                                            className={classes.solveButton}
                                            onClick={handleGenerateSolution}
                                            disabled={isProcessing}
                                            startIcon={<CheckCircle />}
                                        >
                                            {isProcessing ? 'Solving...' : 'Generate Solution'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Solution Display */}
                    {(solution || isStreaming) && (
                        <div className={classes.solutionContainer}>
                            <SolutionDisplay
                                solution={solution}
                                isLoading={isProcessing}
                                isStreaming={isStreaming}
                                streamingContent={streamingContent}
                                onRegenerate={handleRegenerate}
                                onPractice={() => {
                                    // Navigate to practice problems
                                    setSnackbar({
                                        open: true,
                                        message: 'Practice problems coming soon!'
                                    });
                                }}
                            />

                            {/* New Problem Button */}
                            <div style={{ padding: 16, textAlign: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleReset}
                                    startIcon={<CameraAlt />}
                                >
                                    Solve Another Problem
                                </Button>
                            </div>
                        </div>
                    )}
                </Paper>

                {/* Help Dialog */}
                <Dialog open={helpOpen} onClose={() => setHelpOpen(false)}>
                    <DialogTitle>How to Use Photo Solver</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" paragraph>
                            <strong>1. Capture or Upload</strong><br />
                            Take a photo of your maths problem or upload an image from your device.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>2. AI Extraction</strong><br />
                            Our AI will read the problem and extract the mathematical content.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>3. Step-by-Step Solution</strong><br />
                            Get a detailed solution with explanations, working, and exam tips.
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            <strong>Tips for best results:</strong>
                            <ul>
                                <li>Ensure good lighting</li>
                                <li>Keep the problem in focus</li>
                                <li>Include all parts of the question</li>
                                <li>Avoid glare or shadows</li>
                            </ul>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setHelpOpen(false)} color="primary">
                            Got It
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    message={snackbar.message}
                />
            </Container>
        </div>
    );
};

export default PhotoSolutionPage;
