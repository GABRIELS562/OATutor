/**
 * BursariesPage - SA Bursaries and Scholarships Directory
 *
 * Features:
 * - Browse by category
 * - Search by field of study
 * - View eligibility and deadlines
 * - Links to applications
 */

import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from '@material-ui/core';
import {
    Search,
    ArrowBack,
    OpenInNew,
    CheckCircle,
    Event,
    Phone,
    Star,
    School,
    AttachMoney,
} from '@material-ui/icons';
import BrandLogoNav from '../../components/BrandLogoNav';
import {
    BURSARY_CATEGORIES,
    BURSARIES,
    getBursariesByCategory,
    getFeaturedBursaries,
    searchBursaries,
} from '../../data/bursariesData';

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
        fontWeight: 700,
        color: '#3C3C3C',
        fontFamily: "'Nunito', sans-serif",
    },
    searchBar: {
        marginBottom: theme.spacing(3),
    },
    tabs: {
        marginBottom: theme.spacing(3),
        backgroundColor: 'white',
        borderRadius: theme.shape.borderRadius,
    },
    featuredSection: {
        marginBottom: theme.spacing(4),
    },
    sectionTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    bursaryCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    bursaryCardContent: {
        flexGrow: 1,
    },
    bursaryTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(0.5),
    },
    provider: {
        color: '#666',
        fontSize: '0.875rem',
        marginBottom: theme.spacing(1),
    },
    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(1),
    },
    featuredChip: {
        backgroundColor: '#ffd700',
        color: '#333',
    },
    deadlineChip: {
        backgroundColor: '#e3f2fd',
        color: '#1565c0',
    },
    dialogContent: {
        padding: theme.spacing(3),
    },
    detailSection: {
        marginBottom: theme.spacing(2),
    },
    detailTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(1),
    },
    coverageItem: {
        paddingTop: 4,
        paddingBottom: 4,
    },
}));

const BursariesPage = ({ history }) => {
    const classes = useStyles();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBursary, setSelectedBursary] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Filter bursaries
    const displayedBursaries = useMemo(() => {
        let results = BURSARIES;

        if (searchQuery) {
            results = searchBursaries(searchQuery);
        } else if (selectedCategory !== 'all') {
            results = getBursariesByCategory(selectedCategory);
        }

        return results;
    }, [searchQuery, selectedCategory]);

    const featuredBursaries = getFeaturedBursaries();

    const handleBursaryClick = (bursary) => {
        setSelectedBursary(bursary);
        setDialogOpen(true);
    };

    const BursaryCard = ({ bursary }) => (
        <Card className={classes.bursaryCard}>
            <CardContent className={classes.bursaryCardContent}>
                <Typography variant="h6" className={classes.bursaryTitle}>
                    {bursary.name}
                </Typography>
                <Typography className={classes.provider}>
                    {bursary.provider}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {bursary.description}
                </Typography>
                <div className={classes.chipContainer}>
                    {bursary.featured && (
                        <Chip
                            size="small"
                            label="Featured"
                            icon={<Star />}
                            className={classes.featuredChip}
                        />
                    )}
                    <Chip
                        size="small"
                        label={bursary.applicationDeadline}
                        icon={<Event />}
                        className={classes.deadlineChip}
                    />
                </div>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => handleBursaryClick(bursary)}
                >
                    View Details
                </Button>
                {bursary.website && (
                    <Button
                        size="small"
                        href={bursary.website}
                        target="_blank"
                        startIcon={<OpenInNew />}
                    >
                        Website
                    </Button>
                )}
            </CardActions>
        </Card>
    );

    return (
        <div className={classes.root}>
            <BrandLogoNav />

            <Container className={classes.container} maxWidth="lg">
                {/* Header */}
                <div className={classes.header}>
                    <IconButton
                        className={classes.backButton}
                        onClick={() => history.goBack()}
                    >
                        <ArrowBack />
                    </IconButton>
                    <div>
                        <Typography variant="h4" className={classes.title}>
                            Bursaries & Scholarships
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Fund your education with SA bursaries
                        </Typography>
                    </div>
                </div>

                {/* Search */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by bursary name, provider, or field of study..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={classes.searchBar}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Category Tabs */}
                <Paper className={classes.tabs}>
                    <Tabs
                        value={selectedCategory}
                        onChange={(e, v) => {
                            setSelectedCategory(v);
                            setSearchQuery('');
                        }}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="All" value="all" />
                        {BURSARY_CATEGORIES.map((cat) => (
                            <Tab key={cat.id} label={cat.name} value={cat.id} />
                        ))}
                    </Tabs>
                </Paper>

                {/* Featured Section */}
                {selectedCategory === 'all' && !searchQuery && (
                    <div className={classes.featuredSection}>
                        <Typography variant="h5" className={classes.sectionTitle}>
                            <Star style={{ color: '#ffd700' }} />
                            Featured Bursaries
                        </Typography>
                        <Grid container spacing={3}>
                            {featuredBursaries.map((bursary) => (
                                <Grid item xs={12} sm={6} md={4} key={bursary.id}>
                                    <BursaryCard bursary={bursary} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                )}

                {/* Bursary List */}
                <Typography variant="h5" className={classes.sectionTitle}>
                    <AttachMoney />
                    {searchQuery
                        ? `Search Results (${displayedBursaries.length})`
                        : selectedCategory === 'all'
                            ? 'All Bursaries'
                            : BURSARY_CATEGORIES.find(c => c.id === selectedCategory)?.name
                    }
                </Typography>
                <Grid container spacing={3}>
                    {displayedBursaries.map((bursary) => (
                        <Grid item xs={12} sm={6} md={4} key={bursary.id}>
                            <BursaryCard bursary={bursary} />
                        </Grid>
                    ))}
                </Grid>

                {displayedBursaries.length === 0 && (
                    <Paper style={{ padding: 32, textAlign: 'center' }}>
                        <Typography color="textSecondary">
                            No bursaries found matching your criteria.
                        </Typography>
                    </Paper>
                )}
            </Container>

            {/* Bursary Detail Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedBursary && (
                    <>
                        <DialogTitle>
                            <Typography variant="h5">
                                {selectedBursary.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {selectedBursary.provider}
                            </Typography>
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            <Typography variant="body1" paragraph>
                                {selectedBursary.description}
                            </Typography>

                            <div className={classes.detailSection}>
                                <Typography className={classes.detailTitle}>
                                    What's Covered
                                </Typography>
                                <List dense>
                                    {selectedBursary.coverage?.map((item, i) => (
                                        <ListItem key={i} className={classes.coverageItem}>
                                            <ListItemIcon>
                                                <CheckCircle color="primary" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>

                            <Divider />

                            <div className={classes.detailSection} style={{ marginTop: 16 }}>
                                <Typography className={classes.detailTitle}>
                                    Eligibility Requirements
                                </Typography>
                                <List dense>
                                    {selectedBursary.eligibility?.map((item, i) => (
                                        <ListItem key={i} className={classes.coverageItem}>
                                            <ListItemIcon>
                                                <CheckCircle fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>

                            <div className={classes.detailSection}>
                                <Typography className={classes.detailTitle}>
                                    Fields of Study
                                </Typography>
                                <div className={classes.chipContainer}>
                                    {selectedBursary.fieldsOfStudy?.map((field, i) => (
                                        <Chip
                                            key={i}
                                            label={field}
                                            icon={<School />}
                                            variant="outlined"
                                        />
                                    ))}
                                </div>
                            </div>

                            <Paper style={{ padding: 16, backgroundColor: '#e3f2fd', marginTop: 16 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Application Deadline
                                </Typography>
                                <Typography variant="h6">
                                    {selectedBursary.applicationDeadline}
                                </Typography>
                                {selectedBursary.contact && (
                                    <Typography variant="body2" style={{ marginTop: 8 }}>
                                        <Phone fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                        {selectedBursary.contact}
                                    </Typography>
                                )}
                            </Paper>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)}>
                                Close
                            </Button>
                            {selectedBursary.applicationLink && (
                                <Button
                                    color="primary"
                                    variant="contained"
                                    href={selectedBursary.applicationLink}
                                    target="_blank"
                                    startIcon={<OpenInNew />}
                                >
                                    Apply Now
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default BursariesPage;
