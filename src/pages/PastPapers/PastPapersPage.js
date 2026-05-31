/**
 * PastPapersPage - Browse and access SA CAPS past examination papers
 *
 * Features:
 * - DBE (NSC) papers from 2009-2024
 * - IEB papers (requires license)
 * - Provincial trial papers
 * - Filter by year, type, topic
 * - Offline download & caching
 * - Side-by-side memo viewing
 */

import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Chip,
    IconButton,
    Snackbar,
    LinearProgress,
} from '@material-ui/core';
import {
    ArrowBack,
    CloudDownload,
    CloudDone,
    Storage,
    Info,
} from '@material-ui/icons';
import BrandLogoNav from '../../components/BrandLogoNav';
import PaperCard from '../../components/past-papers/PaperCard';
import PaperFilters from '../../components/past-papers/PaperFilters';
import PaperViewer from '../../components/past-papers/PaperViewer';
import {
    pastPapersIndex,
    filterPapers,
    getPaperPath,
    getMemoPath,
} from '../../data/pastPapersIndex';
import OfflinePapersService from '../../services/OfflinePapersService';

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
    titleSection: {
        flex: 1,
    },
    title: {
        fontWeight: 700,
        color: '#58CC02',
        fontFamily: "'Nunito', sans-serif",
    },
    subtitle: {
        color: '#666',
        fontSize: '0.9rem',
    },
    statsBar: {
        display: 'flex',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(3),
        flexWrap: 'wrap',
    },
    statChip: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.08)',
    },
    storageCard: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(3),
        borderRadius: theme.shape.borderRadius * 2,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    storageIcon: {
        color: '#58CC02',
    },
    storageInfo: {
        flex: 1,
    },
    storageProgress: {
        marginTop: theme.spacing(0.5),
        height: 6,
        borderRadius: 3,
    },
    grid: {
        marginTop: theme.spacing(2),
    },
    emptyState: {
        textAlign: 'center',
        padding: theme.spacing(6),
    },
    emptyIcon: {
        fontSize: 64,
        color: '#ccc',
        marginBottom: theme.spacing(2),
    },
    yearSection: {
        marginBottom: theme.spacing(4),
    },
    yearHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2),
    },
    yearTitle: {
        fontWeight: 600,
        color: '#333',
    },
    downloadAllButton: {
        fontSize: '0.8rem',
    },
    quickFilters: {
        display: 'flex',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(3),
        flexWrap: 'wrap',
    },
    quickFilterChip: {
        cursor: 'pointer',
        borderRadius: 16,
        '&:hover': {
            backgroundColor: 'rgba(88, 204, 2, 0.15)',
        },
    },
    quickFilterActive: {
        backgroundColor: '#58CC02',
        color: 'white',
        '&:hover': {
            backgroundColor: '#58A700',
        },
    },
}));

const PastPapersPage = ({ history }) => {
    const classes = useStyles();

    // State
    const [filters, setFilters] = useState({});
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [storageStatus, setStorageStatus] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    // Load storage status
    useEffect(() => {
        const loadStatus = async () => {
            const status = await OfflinePapersService.getStatus();
            setStorageStatus(status);
        };
        loadStatus();
    }, []);

    // Filter papers based on current filters
    const filteredPapers = useMemo(() => {
        return filterPapers({
            ...filters,
            availableOnly: false, // Show all papers, even unavailable ones
        });
    }, [filters]);

    // Group papers by year
    const papersByYear = useMemo(() => {
        const grouped = {};
        filteredPapers.forEach(paper => {
            if (!grouped[paper.year]) {
                grouped[paper.year] = [];
            }
            grouped[paper.year].push(paper);
        });
        return grouped;
    }, [filteredPapers]);

    const years = Object.keys(papersByYear).sort((a, b) => b - a);

    // Handle paper view
    const handleViewPaper = (paper, url) => {
        setSelectedPaper({
            paper,
            paperUrl: getPaperPath(paper),
            memoUrl: getMemoPath(paper),
        });
        setViewerOpen(true);
    };

    // Handle filter change
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    // Quick filter handlers
    const handleQuickFilter = (key, value) => {
        if (filters[key] === value) {
            // Toggle off if already selected
            const newFilters = { ...filters };
            delete newFilters[key];
            setFilters(newFilters);
        } else {
            setFilters({ ...filters, [key]: value });
        }
    };

    // Download all papers for a year
    const handleDownloadYear = async (year) => {
        const yearPapers = papersByYear[year].filter(p => p.isAvailable);
        const urls = [];

        yearPapers.forEach(paper => {
            urls.push(getPaperPath(paper));
            if (paper.hasMemo) {
                urls.push(getMemoPath(paper));
            }
        });

        setSnackbar({ open: true, message: `Downloading ${urls.length} files...` });

        try {
            await OfflinePapersService.downloadPapers(urls, (progress) => {
                // Could show progress here
            });
            setSnackbar({ open: true, message: 'Download complete!' });

            // Refresh storage status
            const status = await OfflinePapersService.getStatus();
            setStorageStatus(status);
        } catch (error) {
            setSnackbar({ open: true, message: 'Some downloads failed' });
        }
    };

    // Stats
    const totalPapers = pastPapersIndex.length;
    const availablePapers = pastPapersIndex.filter(p => p.isAvailable).length;
    const cachedCount = storageStatus?.cachedCount || 0;

    return (
        <div className={classes.root}>
            <BrandLogoNav />

            <Container maxWidth="lg" className={classes.container}>
                {/* Header */}
                <div className={classes.header}>
                    <IconButton
                        className={classes.backButton}
                        onClick={() => history?.goBack() || window.history.back()}
                    >
                        <ArrowBack />
                    </IconButton>
                    <div className={classes.titleSection}>
                        <Typography variant="h5" className={classes.title}>
                            Past Papers
                        </Typography>
                        <Typography className={classes.subtitle}>
                            NSC, IEB & Provincial Mathematics Papers (2009-2024)
                        </Typography>
                    </div>
                </div>

                {/* Stats */}
                <div className={classes.statsBar}>
                    <Chip
                        icon={<Info />}
                        label={`${totalPapers} Total Papers`}
                        className={classes.statChip}
                    />
                    <Chip
                        icon={<CloudDownload />}
                        label={`${availablePapers} Available Free`}
                        className={classes.statChip}
                    />
                    <Chip
                        icon={<CloudDone />}
                        label={`${cachedCount} Downloaded`}
                        className={classes.statChip}
                        color={cachedCount > 0 ? 'primary' : 'default'}
                    />
                </div>

                {/* Storage Status */}
                {storageStatus?.isAvailable && (
                    <Paper className={classes.storageCard} elevation={1}>
                        <Storage className={classes.storageIcon} />
                        <div className={classes.storageInfo}>
                            <Typography variant="body2">
                                Offline Storage: {storageStatus.storageUsed} used
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={storageStatus.storagePercentage}
                                className={classes.storageProgress}
                            />
                        </div>
                        {cachedCount > 0 && (
                            <Button
                                size="small"
                                onClick={async () => {
                                    await OfflinePapersService.clearAllPapers();
                                    const status = await OfflinePapersService.getStatus();
                                    setStorageStatus(status);
                                    setSnackbar({ open: true, message: 'Offline papers cleared' });
                                }}
                            >
                                Clear
                            </Button>
                        )}
                    </Paper>
                )}

                {/* Quick Filters */}
                <div className={classes.quickFilters}>
                    <Typography variant="body2" color="textSecondary" style={{ alignSelf: 'center', marginRight: 8 }}>
                        Quick:
                    </Typography>
                    <Chip
                        label="Paper 1"
                        size="small"
                        onClick={() => handleQuickFilter('variant', 'p1')}
                        className={`${classes.quickFilterChip} ${filters.variant === 'p1' ? classes.quickFilterActive : ''}`}
                    />
                    <Chip
                        label="Paper 2"
                        size="small"
                        onClick={() => handleQuickFilter('variant', 'p2')}
                        className={`${classes.quickFilterChip} ${filters.variant === 'p2' ? classes.quickFilterActive : ''}`}
                    />
                    <Chip
                        label="NSC Only"
                        size="small"
                        onClick={() => handleQuickFilter('type', 'nsc')}
                        className={`${classes.quickFilterChip} ${filters.type === 'nsc' ? classes.quickFilterActive : ''}`}
                    />
                    <Chip
                        label="2024"
                        size="small"
                        onClick={() => handleQuickFilter('year', 2024)}
                        className={`${classes.quickFilterChip} ${filters.year === 2024 ? classes.quickFilterActive : ''}`}
                    />
                    <Chip
                        label="2023"
                        size="small"
                        onClick={() => handleQuickFilter('year', 2023)}
                        className={`${classes.quickFilterChip} ${filters.year === 2023 ? classes.quickFilterActive : ''}`}
                    />
                </div>

                {/* Filters */}
                <PaperFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    resultCount={filteredPapers.length}
                />

                {/* Papers Grid by Year */}
                {years.length > 0 ? (
                    years.map(year => (
                        <div key={year} className={classes.yearSection}>
                            <div className={classes.yearHeader}>
                                <Typography variant="h6" className={classes.yearTitle}>
                                    {year}
                                    <Chip
                                        size="small"
                                        label={papersByYear[year].length}
                                        style={{ marginLeft: 8 }}
                                    />
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<CloudDownload />}
                                    className={classes.downloadAllButton}
                                    onClick={() => handleDownloadYear(year)}
                                >
                                    Download All
                                </Button>
                            </div>

                            <Grid container spacing={3}>
                                {papersByYear[year].map(paper => (
                                    <Grid item xs={12} sm={6} md={4} key={paper.id}>
                                        <PaperCard
                                            paper={paper}
                                            onView={handleViewPaper}
                                            onViewMemo={(p, url) => handleViewPaper(p, url)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    ))
                ) : (
                    <div className={classes.emptyState}>
                        <Info className={classes.emptyIcon} />
                        <Typography variant="h6" color="textSecondary">
                            No papers match your filters
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Try adjusting your filter criteria
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => setFilters({})}
                            style={{ marginTop: 16 }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </Container>

            {/* Paper Viewer Modal */}
            <PaperViewer
                open={viewerOpen}
                onClose={() => setViewerOpen(false)}
                paper={selectedPaper?.paper}
                paperUrl={selectedPaper?.paperUrl}
                memoUrl={selectedPaper?.memoUrl}
            />

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />
        </div>
    );
};

export default PastPapersPage;
