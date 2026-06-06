/**
 * CareerGuidancePage - Explore SA careers requiring Mathematics
 *
 * Features:
 * - Browse careers by field
 * - View requirements, salaries, growth outlook
 * - Link to related bursaries and institutions
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
    Button,
    Chip,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
} from '@material-ui/core';
import {
    Search,
    ArrowBack,
    Work,
    School,
    TrendingUp,
    AttachMoney,
    CheckCircle,
    Bookmark,
} from '@material-ui/icons';
import BrandLogoNav from '../../components/BrandLogoNav';
import { useLocalization } from '../../util/LocalizationContext';
import {
    CAREER_FIELDS,
    getCareersByField,
    searchCareers,
    formatSalaryRange,
} from '../../data/careerGuidance';

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
    subtitle: {
        color: '#666',
    },
    searchBar: {
        marginBottom: theme.spacing(3),
    },
    fieldCard: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        height: '100%',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        },
    },
    fieldIcon: {
        fontSize: 48,
        marginBottom: theme.spacing(1),
    },
    careerCard: {
        marginBottom: theme.spacing(2),
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        },
    },
    careerTitle: {
        fontWeight: 600,
    },
    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(1),
    },
    salaryChip: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
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
    universityChip: {
        margin: theme.spacing(0.5),
    },
}));

const CareerGuidancePage = ({ history }) => {
    const classes = useStyles();

    const localization = useLocalization();
    const translate = localization?.translate || ((key) => {
        const fallbacks = {
            'careers.title': 'Career Guidance',
            'careers.subtitle': 'Explore careers that use Mathematics',
            'careers.searchPlaceholder': 'Search careers, skills, or fields...',
            'careers.careersCount': 'careers',
            'careers.found': 'Found',
            'careers.careerResults': 'career(s)',
            'careers.noResults': 'No careers found matching your search.',
            'careers.requirements': 'Requirements',
            'careers.mathematics': 'Mathematics',
            'careers.otherSubjects': 'Other Subjects',
            'careers.qualification': 'Qualification',
            'careers.salaryOutlook': 'Salary & Outlook',
            'careers.growth': 'Growth',
            'careers.whereToStudy': 'Where to Study',
            'careers.keySkills': 'Key Skills',
            'careers.findBursaries': 'Find Bursaries',
            'common.close': 'Close',
        };
        return fallbacks[key] || key.split('.').pop();
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedField, setSelectedField] = useState(null);
    const [selectedCareer, setSelectedCareer] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Filter careers based on search or selected field
    const displayedCareers = useMemo(() => {
        if (searchQuery) {
            return searchCareers(searchQuery);
        }
        if (selectedField) {
            return getCareersByField(selectedField);
        }
        return [];
    }, [searchQuery, selectedField]);

    const handleCareerClick = (career) => {
        setSelectedCareer(career);
        setDialogOpen(true);
    };

    const handleBackToFields = () => {
        setSelectedField(null);
        setSearchQuery('');
    };

    return (
        <div className={classes.root}>
            <BrandLogoNav />

            <Container className={classes.container} maxWidth="lg">
                {/* Header */}
                <div className={classes.header}>
                    <IconButton
                        className={classes.backButton}
                        onClick={() => selectedField ? handleBackToFields() : history.goBack()}
                    >
                        <ArrowBack />
                    </IconButton>
                    <div>
                        <Typography variant="h4" className={classes.title}>
                            {translate('careers.title')}
                        </Typography>
                        <Typography variant="body1" className={classes.subtitle}>
                            {translate('careers.subtitle')}
                        </Typography>
                    </div>
                </div>

                {/* Search */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={translate('careers.searchPlaceholder')}
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

                {/* Fields Grid (when no field selected and no search) */}
                {!selectedField && !searchQuery && (
                    <Grid container spacing={3}>
                        {CAREER_FIELDS.map((field) => (
                            <Grid item xs={6} sm={4} md={3} key={field.id}>
                                <Card
                                    className={classes.fieldCard}
                                    onClick={() => setSelectedField(field.id)}
                                >
                                    <CardContent style={{ textAlign: 'center' }}>
                                        <Work
                                            className={classes.fieldIcon}
                                            style={{ color: field.color }}
                                        />
                                        <Typography variant="h6">
                                            {field.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {getCareersByField(field.id).length} {translate('careers.careersCount')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Career List */}
                {(selectedField || searchQuery) && (
                    <>
                        {selectedField && !searchQuery && (
                            <Typography variant="h5" gutterBottom>
                                {CAREER_FIELDS.find(f => f.id === selectedField)?.name}
                            </Typography>
                        )}

                        {searchQuery && (
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                {translate('careers.found')} {displayedCareers.length} {translate('careers.careerResults')}
                            </Typography>
                        )}

                        {displayedCareers.map((career) => (
                            <Card
                                key={career.id}
                                className={classes.careerCard}
                                onClick={() => handleCareerClick(career)}
                            >
                                <CardContent>
                                    <Typography variant="h6" className={classes.careerTitle}>
                                        {career.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {career.description}
                                    </Typography>
                                    <div className={classes.chipContainer}>
                                        <Chip
                                            size="small"
                                            label={career.mathsRequired}
                                            icon={<School />}
                                        />
                                        <Chip
                                            size="small"
                                            label={formatSalaryRange(career.salaryRange)}
                                            className={classes.salaryChip}
                                        />
                                        <Chip
                                            size="small"
                                            label={career.growthOutlook}
                                            icon={<TrendingUp />}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {displayedCareers.length === 0 && (
                            <Paper style={{ padding: 32, textAlign: 'center' }}>
                                <Typography color="textSecondary">
                                    {translate('careers.noResults')}
                                </Typography>
                            </Paper>
                        )}
                    </>
                )}
            </Container>

            {/* Career Detail Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedCareer && (
                    <>
                        <DialogTitle>
                            <Typography variant="h5">
                                {selectedCareer.title}
                            </Typography>
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            <Typography variant="body1" paragraph>
                                {selectedCareer.description}
                            </Typography>

                            <div className={classes.detailSection}>
                                <Typography className={classes.detailTitle}>
                                    <School /> {translate('careers.requirements')}
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemText
                                            primary={translate('careers.mathematics')}
                                            secondary={selectedCareer.mathsRequired}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={translate('careers.otherSubjects')}
                                            secondary={selectedCareer.otherSubjects?.join(', ')}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={translate('careers.qualification')}
                                            secondary={selectedCareer.qualification}
                                        />
                                    </ListItem>
                                </List>
                            </div>

                            <Divider />

                            <div className={classes.detailSection} style={{ marginTop: 16 }}>
                                <Typography className={classes.detailTitle}>
                                    <AttachMoney /> {translate('careers.salaryOutlook')}
                                </Typography>
                                <Typography variant="body1">
                                    {formatSalaryRange(selectedCareer.salaryRange)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {translate('careers.growth')}: {selectedCareer.growthOutlook}
                                </Typography>
                            </div>

                            <div className={classes.detailSection}>
                                <Typography className={classes.detailTitle}>
                                    <School /> {translate('careers.whereToStudy')}
                                </Typography>
                                {selectedCareer.universities?.map((uni) => (
                                    <Chip
                                        key={uni}
                                        label={uni}
                                        className={classes.universityChip}
                                        variant="outlined"
                                    />
                                ))}
                            </div>

                            <div className={classes.detailSection}>
                                <Typography className={classes.detailTitle}>
                                    <CheckCircle /> {translate('careers.keySkills')}
                                </Typography>
                                {selectedCareer.skills?.map((skill) => (
                                    <Chip
                                        key={skill}
                                        label={skill}
                                        className={classes.universityChip}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)}>
                                {translate('common.close')}
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => history.push('/bursaries')}
                                startIcon={<Bookmark />}
                            >
                                {translate('careers.findBursaries')}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default CareerGuidancePage;
