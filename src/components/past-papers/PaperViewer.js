/**
 * PaperViewer - PDF viewer for past papers with side-by-side memo view
 * Uses browser's built-in PDF viewer via iframe
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogContent,
    IconButton,
    Typography,
    Button,
    ButtonGroup,
    Tabs,
    Tab,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import {
    Close,
    CloudDownload,
    Fullscreen,
    FullscreenExit,
    Description,
    Assignment,
    OpenInNew,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    dialog: {
        '& .MuiDialog-paper': {
            maxWidth: '95vw',
            maxHeight: '95vh',
            width: '100%',
            height: '100%',
            margin: theme.spacing(1),
        },
    },
    dialogFullscreen: {
        '& .MuiDialog-paper': {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '100vw',
            height: '100vh',
            margin: 0,
            borderRadius: 0,
        },
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(1, 2),
        backgroundColor: '#1a237e',
        color: 'white',
    },
    titleSection: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    title: {
        fontWeight: 600,
    },
    subtitle: {
        fontSize: '0.875rem',
        opacity: 0.8,
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    headerButton: {
        color: 'white',
    },
    tabs: {
        backgroundColor: 'rgba(26, 35, 126, 0.05)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
    },
    content: {
        padding: 0,
        display: 'flex',
        height: 'calc(100% - 100px)',
        overflow: 'hidden',
    },
    viewerContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    viewerSplit: {
        flex: 1,
        display: 'flex',
        height: '100%',
    },
    pdfFrame: {
        width: '100%',
        height: '100%',
        border: 'none',
    },
    pdfFrameHalf: {
        width: '50%',
        height: '100%',
        border: 'none',
        borderRight: '1px solid rgba(0,0,0,0.1)',
    },
    viewModeButtons: {
        padding: theme.spacing(1),
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(2),
        borderTop: '1px solid rgba(0,0,0,0.08)',
    },
    placeholder: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#666',
        gap: theme.spacing(2),
    },
    placeholderIcon: {
        fontSize: 64,
        opacity: 0.3,
    },
    mobileNote: {
        padding: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
    },
}));

const VIEW_MODES = {
    PAPER: 'paper',
    MEMO: 'memo',
    SPLIT: 'split',
};

const PaperViewer = ({
    open,
    onClose,
    paper,
    paperUrl,
    memoUrl,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [viewMode, setViewMode] = useState(VIEW_MODES.PAPER);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    if (!paper || !open) return null;

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        link.click();
    };

    const handleOpenExternal = (url) => {
        window.open(url, '_blank');
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Mobile view uses tabs
    if (isMobile) {
        return (
            <Dialog
                open={open}
                onClose={onClose}
                fullScreen
                className={classes.dialog}
            >
                {/* Header */}
                <div className={classes.header}>
                    <div className={classes.titleSection}>
                        <Description />
                        <div>
                            <Typography className={classes.title}>
                                {paper.title}
                            </Typography>
                            <Typography className={classes.subtitle}>
                                {paper.year}
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.headerActions}>
                        <IconButton className={classes.headerButton} onClick={onClose}>
                            <Close />
                        </IconButton>
                    </div>
                </div>

                {/* Tabs for mobile */}
                <Tabs
                    value={tabValue}
                    onChange={(e, v) => setTabValue(v)}
                    className={classes.tabs}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Paper" icon={<Description />} />
                    {paper.hasMemo && <Tab label="Memo" icon={<Assignment />} />}
                </Tabs>

                {/* Content */}
                <DialogContent className={classes.content}>
                    <div className={classes.viewerContainer}>
                        {tabValue === 0 ? (
                            <iframe
                                src={paperUrl}
                                className={classes.pdfFrame}
                                title={`${paper.title} - Paper`}
                            />
                        ) : (
                            <iframe
                                src={memoUrl}
                                className={classes.pdfFrame}
                                title={`${paper.title} - Memo`}
                            />
                        )}
                    </div>
                </DialogContent>

                {/* Mobile action buttons */}
                <div className={classes.viewModeButtons}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CloudDownload />}
                        onClick={() => handleDownload(tabValue === 0 ? paperUrl : memoUrl)}
                    >
                        Download
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<OpenInNew />}
                        onClick={() => handleOpenExternal(tabValue === 0 ? paperUrl : memoUrl)}
                    >
                        Open in New Tab
                    </Button>
                </div>
            </Dialog>
        );
    }

    // Desktop view
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isFullscreen}
            className={isFullscreen ? classes.dialogFullscreen : classes.dialog}
            maxWidth={false}
        >
            {/* Header */}
            <div className={classes.header}>
                <div className={classes.titleSection}>
                    <Description />
                    <div>
                        <Typography className={classes.title}>
                            {paper.title}
                        </Typography>
                        <Typography className={classes.subtitle}>
                            {paper.year} • {paper.totalMarks} marks • {Math.floor(paper.duration / 60)} hours
                        </Typography>
                    </div>
                </div>
                <div className={classes.headerActions}>
                    <ButtonGroup size="small" variant="outlined">
                        <Tooltip title="View Paper">
                            <Button
                                className={classes.headerButton}
                                onClick={() => setViewMode(VIEW_MODES.PAPER)}
                                variant={viewMode === VIEW_MODES.PAPER ? 'contained' : 'outlined'}
                            >
                                Paper
                            </Button>
                        </Tooltip>
                        {paper.hasMemo && (
                            <>
                                <Tooltip title="View Memo">
                                    <Button
                                        className={classes.headerButton}
                                        onClick={() => setViewMode(VIEW_MODES.MEMO)}
                                        variant={viewMode === VIEW_MODES.MEMO ? 'contained' : 'outlined'}
                                    >
                                        Memo
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Side-by-side view">
                                    <Button
                                        className={classes.headerButton}
                                        onClick={() => setViewMode(VIEW_MODES.SPLIT)}
                                        variant={viewMode === VIEW_MODES.SPLIT ? 'contained' : 'outlined'}
                                    >
                                        Split
                                    </Button>
                                </Tooltip>
                            </>
                        )}
                    </ButtonGroup>

                    <Tooltip title="Download">
                        <IconButton
                            className={classes.headerButton}
                            onClick={() => handleDownload(viewMode === VIEW_MODES.MEMO ? memoUrl : paperUrl)}
                        >
                            <CloudDownload />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                        <IconButton
                            className={classes.headerButton}
                            onClick={toggleFullscreen}
                        >
                            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                        </IconButton>
                    </Tooltip>

                    <IconButton className={classes.headerButton} onClick={onClose}>
                        <Close />
                    </IconButton>
                </div>
            </div>

            {/* Content */}
            <DialogContent className={classes.content}>
                {viewMode === VIEW_MODES.SPLIT ? (
                    <div className={classes.viewerSplit}>
                        <iframe
                            src={paperUrl}
                            className={classes.pdfFrameHalf}
                            title={`${paper.title} - Paper`}
                        />
                        <iframe
                            src={memoUrl}
                            className={classes.pdfFrame}
                            title={`${paper.title} - Memo`}
                        />
                    </div>
                ) : (
                    <div className={classes.viewerContainer}>
                        <iframe
                            src={viewMode === VIEW_MODES.MEMO ? memoUrl : paperUrl}
                            className={classes.pdfFrame}
                            title={`${paper.title} - ${viewMode === VIEW_MODES.MEMO ? 'Memo' : 'Paper'}`}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PaperViewer;
