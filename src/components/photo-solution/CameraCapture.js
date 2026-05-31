/**
 * CameraCapture - Capture math problems using device camera
 * Works on both mobile (native camera) and desktop (webcam)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    IconButton,
    Typography,
    Paper,
    Dialog,
    DialogContent,
    CircularProgress,
    Fade,
} from '@material-ui/core';
import {
    CameraAlt,
    FlipCameraAndroid,
    Close,
    CheckCircle,
    Replay,
    FlashOn,
    FlashOff,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        width: '100%',
        maxWidth: 600,
        margin: '0 auto',
    },
    captureButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
        border: '2px dashed rgba(26, 35, 126, 0.3)',
        borderRadius: theme.shape.borderRadius * 2,
        backgroundColor: 'rgba(26, 35, 126, 0.02)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            borderColor: '#1a237e',
            backgroundColor: 'rgba(26, 35, 126, 0.05)',
        },
    },
    cameraIcon: {
        fontSize: 64,
        color: '#1a237e',
        marginBottom: theme.spacing(2),
    },
    captureText: {
        color: '#333',
        fontWeight: 500,
    },
    captureSubtext: {
        color: '#666',
        fontSize: '0.875rem',
        marginTop: theme.spacing(1),
    },
    cameraDialog: {
        '& .MuiDialog-paper': {
            backgroundColor: '#000',
            margin: 0,
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100%',
            height: '100%',
        },
    },
    cameraContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        flex: 1,
        objectFit: 'cover',
    },
    canvas: {
        display: 'none',
    },
    cameraControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing(3),
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    },
    captureBtn: {
        width: 72,
        height: 72,
        borderRadius: '50%',
        backgroundColor: 'white',
        border: '4px solid rgba(255,255,255,0.3)',
        '&:hover': {
            backgroundColor: '#eee',
        },
    },
    controlBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)',
        },
    },
    closeBtn: {
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(2),
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        zIndex: 10,
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.7)',
        },
    },
    guideOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '85%',
        maxWidth: 400,
        aspectRatio: '4/3',
        border: '3px solid rgba(255,255,255,0.5)',
        borderRadius: theme.shape.borderRadius,
        pointerEvents: 'none',
    },
    guideText: {
        position: 'absolute',
        top: theme.spacing(8),
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'white',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        padding: theme.spacing(1),
    },
    previewContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000',
    },
    previewImage: {
        width: '100%',
        flex: 1,
        objectFit: 'contain',
    },
    previewControls: {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(2),
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    retakeBtn: {
        color: 'white',
        borderColor: 'rgba(255,255,255,0.5)',
    },
    usePhotoBtn: {
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
    },
    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
    },
    permissionError: {
        padding: theme.spacing(4),
        textAlign: 'center',
        color: 'white',
    },
}));

const CameraCapture = ({ onCapture, onCancel, disabled = false }) => {
    const classes = useStyles();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [stream, setStream] = useState(null);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
    const [capturedImage, setCapturedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

    // Check for multiple cameras
    useEffect(() => {
        if (navigator.mediaDevices?.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    const videoDevices = devices.filter(d => d.kind === 'videoinput');
                    setHasMultipleCameras(videoDevices.length > 1);
                })
                .catch(() => {});
        }
    }, []);

    // Start camera stream
    const startCamera = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Stop existing stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }

        } catch (err) {
            console.error('Camera access error:', err);
            if (err.name === 'NotAllowedError') {
                setError('Camera access denied. Please allow camera access in your browser settings.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera found on this device.');
            } else {
                setError('Unable to access camera. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [facingMode, stream]);

    // Stop camera stream
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    // Open camera dialog
    const handleOpen = () => {
        setIsOpen(true);
        setCapturedImage(null);
        setError(null);
        startCamera();
    };

    // Close camera dialog
    const handleClose = () => {
        stopCamera();
        setIsOpen(false);
        setCapturedImage(null);
        if (onCancel) onCancel();
    };

    // Flip camera
    const handleFlipCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    // Effect to restart camera when facing mode changes
    useEffect(() => {
        if (isOpen && !capturedImage) {
            startCamera();
        }
    }, [facingMode]);

    // Capture photo
    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Get image data
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
    };

    // Retake photo
    const handleRetake = () => {
        setCapturedImage(null);
        startCamera();
    };

    // Use captured photo
    const handleUsePhoto = () => {
        if (capturedImage && onCapture) {
            onCapture(capturedImage);
            handleClose();
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className={classes.root}>
            {/* Capture Button */}
            <Paper
                className={classes.captureButton}
                onClick={disabled ? undefined : handleOpen}
                elevation={0}
                style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'default' : 'pointer' }}
            >
                <CameraAlt className={classes.cameraIcon} />
                <Typography className={classes.captureText}>
                    Take a Photo
                </Typography>
                <Typography className={classes.captureSubtext}>
                    Point your camera at a maths problem
                </Typography>
            </Paper>

            {/* Camera Dialog */}
            <Dialog
                open={isOpen}
                onClose={handleClose}
                fullScreen
                className={classes.cameraDialog}
            >
                <DialogContent style={{ padding: 0 }}>
                    {/* Close button */}
                    <IconButton className={classes.closeBtn} onClick={handleClose}>
                        <Close />
                    </IconButton>

                    {/* Loading state */}
                    {isLoading && (
                        <div className={classes.loading}>
                            <CircularProgress color="inherit" />
                            <Typography style={{ marginTop: 16 }}>
                                Starting camera...
                            </Typography>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className={classes.permissionError}>
                            <Typography variant="h6" gutterBottom>
                                Camera Error
                            </Typography>
                            <Typography>
                                {error}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={startCamera}
                                style={{ marginTop: 16 }}
                            >
                                Try Again
                            </Button>
                        </div>
                    )}

                    {/* Camera view */}
                    {!capturedImage && !error && (
                        <div className={classes.cameraContainer}>
                            <video
                                ref={videoRef}
                                className={classes.video}
                                autoPlay
                                playsInline
                                muted
                            />
                            <canvas ref={canvasRef} className={classes.canvas} />

                            {/* Guide overlay */}
                            <div className={classes.guideOverlay} />
                            <Typography className={classes.guideText}>
                                Position the maths problem within the frame
                            </Typography>

                            {/* Camera controls */}
                            <Fade in={!isLoading}>
                                <div className={classes.cameraControls}>
                                    {/* Flash toggle (if supported) */}
                                    <IconButton
                                        className={classes.controlBtn}
                                        onClick={() => setFlashEnabled(!flashEnabled)}
                                    >
                                        {flashEnabled ? <FlashOn /> : <FlashOff />}
                                    </IconButton>

                                    {/* Capture button */}
                                    <IconButton
                                        className={classes.captureBtn}
                                        onClick={handleCapture}
                                    >
                                        <CameraAlt style={{ fontSize: 32, color: '#1a237e' }} />
                                    </IconButton>

                                    {/* Flip camera */}
                                    {hasMultipleCameras && (
                                        <IconButton
                                            className={classes.controlBtn}
                                            onClick={handleFlipCamera}
                                        >
                                            <FlipCameraAndroid />
                                        </IconButton>
                                    )}
                                    {!hasMultipleCameras && <div style={{ width: 48 }} />}
                                </div>
                            </Fade>
                        </div>
                    )}

                    {/* Preview captured image */}
                    {capturedImage && (
                        <div className={classes.previewContainer}>
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className={classes.previewImage}
                            />
                            <div className={classes.previewControls}>
                                <Button
                                    variant="outlined"
                                    className={classes.retakeBtn}
                                    startIcon={<Replay />}
                                    onClick={handleRetake}
                                >
                                    Retake
                                </Button>
                                <Button
                                    variant="contained"
                                    className={classes.usePhotoBtn}
                                    startIcon={<CheckCircle />}
                                    onClick={handleUsePhoto}
                                >
                                    Use This Photo
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CameraCapture;
