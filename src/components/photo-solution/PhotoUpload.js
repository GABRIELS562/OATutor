/**
 * PhotoUpload - Upload math problem images from device
 * Supports drag & drop and file picker
 */

import React, { useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Button,
    IconButton,
    LinearProgress,
    Fade,
} from '@material-ui/core';
import {
    CloudUpload,
    InsertPhoto,
    Close,
    CheckCircle,
    Warning,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        width: '100%',
        maxWidth: 600,
        margin: '0 auto',
    },
    dropzone: {
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
    dropzoneActive: {
        borderColor: '#1a237e',
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        borderStyle: 'solid',
    },
    uploadIcon: {
        fontSize: 64,
        color: '#1a237e',
        marginBottom: theme.spacing(2),
    },
    uploadText: {
        color: '#333',
        fontWeight: 500,
        textAlign: 'center',
    },
    uploadSubtext: {
        color: '#666',
        fontSize: '0.875rem',
        marginTop: theme.spacing(1),
        textAlign: 'center',
    },
    hiddenInput: {
        display: 'none',
    },
    browseButton: {
        marginTop: theme.spacing(2),
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
        },
    },
    previewContainer: {
        position: 'relative',
        marginTop: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.1)',
    },
    previewImage: {
        width: '100%',
        maxHeight: 300,
        objectFit: 'contain',
        backgroundColor: '#f5f5f5',
    },
    previewOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing(1.5),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    },
    fileName: {
        color: 'white',
        fontSize: '0.875rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
    },
    removeButton: {
        color: 'white',
        marginLeft: theme.spacing(1),
    },
    progressContainer: {
        padding: theme.spacing(2),
    },
    validationStatus: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1),
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
    },
    validSuccess: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        color: '#4caf50',
    },
    validWarning: {
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        color: '#ff9800',
    },
    validError: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        color: '#f44336',
    },
    useButton: {
        marginTop: theme.spacing(2),
        width: '100%',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
        },
    },
    supportedFormats: {
        marginTop: theme.spacing(2),
        fontSize: '0.75rem',
        color: '#999',
        textAlign: 'center',
    },
}));

// Supported file types
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const PhotoUpload = ({
    onUpload,
    onValidate,
    disabled = false,
    maxSize = MAX_FILE_SIZE,
    acceptedTypes = ACCEPTED_TYPES,
}) => {
    const classes = useStyles();
    const inputRef = useRef(null);

    const [isDragActive, setIsDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [validationStatus, setValidationStatus] = useState(null);
    const [error, setError] = useState(null);

    // Handle file selection
    const handleFile = useCallback(async (file) => {
        setError(null);
        setValidationStatus(null);

        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
            setError(`Unsupported file type. Please use: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`);
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            setError(`File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`);
            return;
        }

        setSelectedFile(file);
        setUploadProgress(0);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);

                // Run validation if provided
                if (onValidate) {
                    setValidationStatus({ status: 'validating', message: 'Checking image...' });
                    onValidate(file)
                        .then(result => {
                            setValidationStatus({
                                status: result.valid ? 'success' : 'warning',
                                message: result.valid
                                    ? 'Math problem detected!'
                                    : result.reason || 'Could not confirm math content'
                            });
                        })
                        .catch(() => {
                            setValidationStatus({
                                status: 'warning',
                                message: 'Validation skipped'
                            });
                        });
                } else {
                    setValidationStatus({ status: 'success', message: 'Image ready' });
                }
            }
        }, 50);

    }, [acceptedTypes, maxSize, onValidate]);

    // Handle drag events
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (disabled) return;

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    // Handle click to browse
    const handleClick = () => {
        if (!disabled && inputRef.current) {
            inputRef.current.click();
        }
    };

    // Handle file input change
    const handleInputChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    // Remove selected file
    const handleRemove = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
        setValidationStatus(null);
        setError(null);
    };

    // Use the uploaded image
    const handleUse = () => {
        if (previewUrl && onUpload) {
            onUpload(previewUrl, selectedFile);
        }
    };

    // Get validation status class
    const getValidationClass = () => {
        if (!validationStatus) return '';
        switch (validationStatus.status) {
            case 'success': return classes.validSuccess;
            case 'warning': return classes.validWarning;
            case 'error': return classes.validError;
            default: return '';
        }
    };

    return (
        <div className={classes.root}>
            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                className={classes.hiddenInput}
                onChange={handleInputChange}
            />

            {/* Dropzone (only show if no file selected) */}
            {!selectedFile && (
                <Paper
                    className={`${classes.dropzone} ${isDragActive ? classes.dropzoneActive : ''}`}
                    elevation={0}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleClick}
                    style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'default' : 'pointer' }}
                >
                    <CloudUpload className={classes.uploadIcon} />
                    <Typography className={classes.uploadText}>
                        {isDragActive ? 'Drop your image here' : 'Upload an Image'}
                    </Typography>
                    <Typography className={classes.uploadSubtext}>
                        Drag and drop or click to browse
                    </Typography>
                    <Button
                        variant="contained"
                        className={classes.browseButton}
                        startIcon={<InsertPhoto />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                        disabled={disabled}
                    >
                        Browse Files
                    </Button>
                    <Typography className={classes.supportedFormats}>
                        Supported: JPG, PNG, WebP, HEIC (max {Math.round(maxSize / 1024 / 1024)}MB)
                    </Typography>
                </Paper>
            )}

            {/* Error message */}
            {error && (
                <div className={`${classes.validationStatus} ${classes.validError}`}>
                    <Warning />
                    <Typography variant="body2">{error}</Typography>
                </div>
            )}

            {/* Preview with progress */}
            {selectedFile && (
                <Fade in={true}>
                    <div>
                        <div className={classes.previewContainer}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className={classes.previewImage}
                            />
                            <div className={classes.previewOverlay}>
                                <Typography className={classes.fileName}>
                                    {selectedFile.name}
                                </Typography>
                                <IconButton
                                    size="small"
                                    className={classes.removeButton}
                                    onClick={handleRemove}
                                >
                                    <Close />
                                </IconButton>
                            </div>
                        </div>

                        {/* Upload progress */}
                        {uploadProgress < 100 && (
                            <div className={classes.progressContainer}>
                                <LinearProgress
                                    variant="determinate"
                                    value={uploadProgress}
                                />
                            </div>
                        )}

                        {/* Validation status */}
                        {validationStatus && (
                            <div className={`${classes.validationStatus} ${getValidationClass()}`}>
                                {validationStatus.status === 'success' && <CheckCircle />}
                                {validationStatus.status === 'warning' && <Warning />}
                                {validationStatus.status === 'validating' && (
                                    <div style={{ width: 24, height: 24 }}>
                                        <LinearProgress />
                                    </div>
                                )}
                                <Typography variant="body2">
                                    {validationStatus.message}
                                </Typography>
                            </div>
                        )}

                        {/* Use button */}
                        {uploadProgress >= 100 && (
                            <Button
                                variant="contained"
                                className={classes.useButton}
                                onClick={handleUse}
                                startIcon={<CheckCircle />}
                            >
                                Solve This Problem
                            </Button>
                        )}
                    </div>
                </Fade>
            )}
        </div>
    );
};

export default PhotoUpload;
