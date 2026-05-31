/**
 * TertiaryInstitutionsPage - SA Universities & Colleges Directory
 *
 * Features:
 * - Browse by institution type
 * - Filter by province
 * - Search institutions
 * - View programs and requirements
 * - Direct application links
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
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
    Avatar,
} from '@material-ui/core';
import {
    Search,
    ArrowBack,
    OpenInNew,
    School,
    LocationOn,
    Phone,
    Email,
    Event,
    CheckCircle,
    Star,
} from '@material-ui/icons';
import BrandLogoNav from '../../components/BrandLogoNav';
import {
    INSTITUTION_TYPES,
    PROVINCES,
    INSTITUTIONS,
    searchInstitutions,
} from '../../data/tertiaryInstitutions';

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
        color: '#1a1a2e',
    },
    filtersRow: {
        display: 'flex',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(3),
        flexWrap: 'wrap',
    },
    searchField: {
        flexGrow: 1,
        minWidth: 250,
    },
    filterSelect: {
        minWidth: 180,
    },
    tabs: {
        marginBottom: theme.spacing(3),
        backgroundColor: 'white',
        borderRadius: theme.shape.borderRadius,
    },
    institutionCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
        },
    },
    cardContent: {
        flexGrow: 1,
    },
    institutionName: {
        fontWeight: 600,
        marginBottom: theme.spacing(0.5),
    },
    shortName: {
        color: '#7B2FF7',
        fontWeight: 500,
        marginBottom: theme.spacing(1),
    },
    locationChip: {
        backgroundColor: '#e3f2fd',
        marginRight: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
    },
    rankingBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ffd700',
        color: '#333',
        width: 32,
        height: 32,
        fontSize: '0.85rem',
        fontWeight: 700,
    },
    cardHeader: {
        position: 'relative',
        backgroundColor: '#7B2FF7',
        color: 'white',
        padding: theme.spacing(2),
    },
    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(1),
    },
    programChip: {
        backgroundColor: '#f3e5f5',
        color: '#7B2FF7',
    },
    dialogContent: {
        padding: theme.spacing(3),
    },
    detailSection: {
        marginBottom: theme.spacing(3),
    },
    detailTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    infoBox: {
        padding: theme.spacing(2),
        backgroundColor: '#f5f5f5',
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(2),
    },
    applyButton: {
        backgroundColor: '#7B2FF7',
        color: 'white',
        '&:hover': {
            backgroundColor: '#6B1FE7',
        },
    },
    nsfasChip: {
        backgroundColor: '#4caf50',
        color: 'white',
    },
    apsChip: {
        backgroundColor: '#ff9800',
        color: 'white',
    },
    statsRow: {
        display: 'flex',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    statCard: {
        flex: 1,
        padding: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: theme.shape.borderRadius,
    },
    statValue: {
        fontWeight: 700,
        fontSize: '1.5rem',
        color: '#7B2FF7',
    },
    statLabel: {
        fontSize: '0.75rem',
        color: '#666',
    },
}));

const TertiaryInstitutionsPage = ({ history }) => {
    const classes = useStyles();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedProvince, setSelectedProvince] = useState('all');
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Filter institutions
    const displayedInstitutions = useMemo(() => {
        let results = INSTITUTIONS;

        if (searchQuery) {
            results = searchInstitutions(searchQuery);
        }

        if (selectedType !== 'all') {
            results = results.filter(i => i.type === selectedType);
        }

        if (selectedProvince !== 'all') {
            results = results.filter(i => i.province === selectedProvince);
        }

        // Sort by ranking if available
        return results.sort((a, b) => (a.ranking || 999) - (b.ranking || 999));
    }, [searchQuery, selectedType, selectedProvince]);

    // Stats
    const stats = useMemo(() => ({
        universities: INSTITUTIONS.filter(i => i.type === 'university').length,
        uots: INSTITUTIONS.filter(i => i.type === 'uot').length,
        tvets: INSTITUTIONS.filter(i => i.type === 'tvet').length,
        total: INSTITUTIONS.length,
    }), []);

    const handleInstitutionClick = (institution) => {
        setSelectedInstitution(institution);
        setDialogOpen(true);
    };

    const InstitutionCard = ({ institution }) => (
        <Card className={classes.institutionCard}>
            <div className={classes.cardHeader}>
                <Typography variant="h6" style={{ fontWeight: 600 }}>
                    {institution.shortName || institution.name}
                </Typography>
                {institution.ranking && (
                    <Avatar className={classes.rankingBadge}>
                        #{institution.ranking}
                    </Avatar>
                )}
            </div>
            <CardContent className={classes.cardContent}>
                <Typography variant="body1" className={classes.institutionName}>
                    {institution.name}
                </Typography>
                <div style={{ marginBottom: 8 }}>
                    <Chip
                        size="small"
                        icon={<LocationOn />}
                        label={`${institution.city}, ${PROVINCES.find(p => p.id === institution.province)?.name}`}
                        className={classes.locationChip}
                    />
                </div>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
                    {institution.description}
                </Typography>
                <div className={classes.chipContainer}>
                    {institution.nsfasAccredited && (
                        <Chip
                            size="small"
                            label="NSFAS"
                            className={classes.nsfasChip}
                        />
                    )}
                    {institution.apsRange && (
                        <Chip
                            size="small"
                            label={`APS: ${institution.apsRange}`}
                            className={classes.apsChip}
                        />
                    )}
                </div>
                {institution.notablePrograms && (
                    <div className={classes.chipContainer} style={{ marginTop: 8 }}>
                        {institution.notablePrograms.slice(0, 3).map((prog, i) => (
                            <Chip
                                key={i}
                                size="small"
                                label={prog}
                                variant="outlined"
                            />
                        ))}
                    </div>
                )}
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => handleInstitutionClick(institution)}
                >
                    View Details
                </Button>
                {institution.website && (
                    <Button
                        size="small"
                        href={institution.website}
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
                            SA Tertiary Institutions
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Universities, UoTs & TVET Colleges
                        </Typography>
                    </div>
                </div>

                {/* Stats */}
                <div className={classes.statsRow}>
                    <Paper className={classes.statCard}>
                        <Typography className={classes.statValue}>{stats.universities}</Typography>
                        <Typography className={classes.statLabel}>Universities</Typography>
                    </Paper>
                    <Paper className={classes.statCard}>
                        <Typography className={classes.statValue}>{stats.uots}</Typography>
                        <Typography className={classes.statLabel}>UoTs</Typography>
                    </Paper>
                    <Paper className={classes.statCard}>
                        <Typography className={classes.statValue}>{stats.tvets}</Typography>
                        <Typography className={classes.statLabel}>TVET Colleges</Typography>
                    </Paper>
                </div>

                {/* Filters */}
                <div className={classes.filtersRow}>
                    <TextField
                        variant="outlined"
                        placeholder="Search institutions, programs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={classes.searchField}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl variant="outlined" className={classes.filterSelect}>
                        <InputLabel>Institution Type</InputLabel>
                        <Select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            label="Institution Type"
                        >
                            <MenuItem value="all">All Types</MenuItem>
                            {INSTITUTION_TYPES.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" className={classes.filterSelect}>
                        <InputLabel>Province</InputLabel>
                        <Select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            label="Province"
                        >
                            <MenuItem value="all">All Provinces</MenuItem>
                            {PROVINCES.map((prov) => (
                                <MenuItem key={prov.id} value={prov.id}>
                                    {prov.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* Results Count */}
                <Typography variant="subtitle1" color="textSecondary" style={{ marginBottom: 16 }}>
                    Showing {displayedInstitutions.length} institution{displayedInstitutions.length !== 1 ? 's' : ''}
                </Typography>

                {/* Institution Grid */}
                <Grid container spacing={3}>
                    {displayedInstitutions.map((institution) => (
                        <Grid item xs={12} sm={6} md={4} key={institution.id}>
                            <InstitutionCard institution={institution} />
                        </Grid>
                    ))}
                </Grid>

                {displayedInstitutions.length === 0 && (
                    <Paper style={{ padding: 32, textAlign: 'center' }}>
                        <Typography color="textSecondary">
                            No institutions found matching your criteria.
                        </Typography>
                    </Paper>
                )}
            </Container>

            {/* Institution Detail Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedInstitution && (
                    <>
                        <DialogTitle>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {selectedInstitution.ranking && (
                                    <Avatar className={classes.rankingBadge} style={{ position: 'static' }}>
                                        #{selectedInstitution.ranking}
                                    </Avatar>
                                )}
                                <div>
                                    <Typography variant="h5">
                                        {selectedInstitution.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {selectedInstitution.shortName} | Est. {selectedInstitution.established}
                                    </Typography>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            <Typography variant="body1" paragraph>
                                {selectedInstitution.description}
                            </Typography>

                            <div className={classes.chipContainer} style={{ marginBottom: 16 }}>
                                <Chip
                                    icon={<LocationOn />}
                                    label={`${selectedInstitution.city}, ${PROVINCES.find(p => p.id === selectedInstitution.province)?.name}`}
                                />
                                {selectedInstitution.nsfasAccredited && (
                                    <Chip
                                        label="NSFAS Accredited"
                                        className={classes.nsfasChip}
                                        icon={<CheckCircle />}
                                    />
                                )}
                                {selectedInstitution.accommodationAvailable && (
                                    <Chip label="Student Accommodation" variant="outlined" />
                                )}
                            </div>

                            {selectedInstitution.faculties && (
                                <div className={classes.detailSection}>
                                    <Typography className={classes.detailTitle}>
                                        <School /> Faculties
                                    </Typography>
                                    <List dense>
                                        {selectedInstitution.faculties.map((faculty, i) => (
                                            <ListItem key={i}>
                                                <ListItemIcon>
                                                    <CheckCircle color="primary" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={faculty} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            )}

                            {selectedInstitution.notablePrograms && (
                                <div className={classes.detailSection}>
                                    <Typography className={classes.detailTitle}>
                                        <Star style={{ color: '#ffd700' }} /> Notable Programs
                                    </Typography>
                                    <div className={classes.chipContainer}>
                                        {selectedInstitution.notablePrograms.map((prog, i) => (
                                            <Chip
                                                key={i}
                                                label={prog}
                                                className={classes.programChip}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Divider style={{ margin: '16px 0' }} />

                            <Paper className={classes.infoBox}>
                                <Grid container spacing={2}>
                                    {selectedInstitution.apsRange && (
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                APS Range
                                            </Typography>
                                            <Typography variant="h6">
                                                {selectedInstitution.apsRange}
                                            </Typography>
                                        </Grid>
                                    )}
                                    {selectedInstitution.applicationDeadline && (
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Application Deadline
                                            </Typography>
                                            <Typography variant="h6">
                                                <Event fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                {selectedInstitution.applicationDeadline}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                                {selectedInstitution.contact && (
                                    <div style={{ marginTop: 16 }}>
                                        {selectedInstitution.contact.phone && (
                                            <Typography variant="body2">
                                                <Phone fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                {selectedInstitution.contact.phone}
                                            </Typography>
                                        )}
                                        {selectedInstitution.contact.email && (
                                            <Typography variant="body2">
                                                <Email fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                {selectedInstitution.contact.email}
                                            </Typography>
                                        )}
                                    </div>
                                )}
                            </Paper>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)}>
                                Close
                            </Button>
                            {selectedInstitution.website && (
                                <Button
                                    href={selectedInstitution.website}
                                    target="_blank"
                                    startIcon={<OpenInNew />}
                                >
                                    Visit Website
                                </Button>
                            )}
                            {selectedInstitution.applyLink && (
                                <Button
                                    className={classes.applyButton}
                                    variant="contained"
                                    href={selectedInstitution.applyLink}
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

export default TertiaryInstitutionsPage;
