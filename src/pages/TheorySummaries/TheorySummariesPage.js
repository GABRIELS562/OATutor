/**
 * TheorySummariesPage - CAPS Mathematics Theory Notes
 *
 * Features:
 * - Browse by category or grade
 * - View formulas, key points, tips
 * - Search summaries
 * - Exam weight indicators
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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';
import {
    Search,
    ArrowBack,
    ExpandMore,
    CheckCircle,
    EmojiObjects,
    Functions,
    School,
    Star,
} from '@material-ui/icons';
import BrandLogoNav from '../../components/BrandLogoNav';
import { useLocalization } from '../../util/LocalizationContext';
import {
    THEORY_CATEGORIES,
    THEORY_SUMMARIES,
    getSummariesByCategory,
    getSummariesByGrade,
    getSummaryById,
    searchSummaries,
} from '../../data/theorySummaries';

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
        minWidth: 150,
    },
    categoryCard: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'center',
        padding: theme.spacing(2),
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[6],
        },
    },
    categoryIcon: {
        fontSize: 48,
        marginBottom: theme.spacing(1),
    },
    summaryCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
    summaryTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(1),
    },
    gradeChips: {
        display: 'flex',
        gap: theme.spacing(0.5),
        marginBottom: theme.spacing(1),
    },
    gradeChip: {
        backgroundColor: '#e3f2fd',
        color: '#1565c0',
    },
    examWeightChip: {
        backgroundColor: '#fff3e0',
        color: '#e65100',
    },
    dialogContent: {
        padding: theme.spacing(3),
    },
    sectionTitle: {
        fontWeight: 600,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    formulaCard: {
        backgroundColor: '#f3e5f5',
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(1),
        fontFamily: 'monospace',
    },
    formulaName: {
        fontWeight: 600,
        color: '#58CC02',
    },
    formulaText: {
        fontSize: '1.1rem',
    },
    tipItem: {
        backgroundColor: '#e8f5e9',
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(1),
        padding: theme.spacing(1, 2),
    },
    keyPointItem: {
        paddingTop: 4,
        paddingBottom: 4,
    },
}));

const TheorySummariesPage = ({ history }) => {
    const classes = useStyles();

    const localization = useLocalization();
    const translate = localization?.translate || ((key) => {
        const fallbacks = {
            'theory.title': 'Theory Summaries',
            'theory.subtitle': 'CAPS Mathematics Notes & Formulas',
            'theory.searchPlaceholder': 'Search topics, formulas...',
            'theory.grade': 'Grade',
            'theory.allGrades': 'All Grades',
            'theory.topics': 'topics',
            'theory.gradeTopics': 'Topics',
            'theory.searchResults': 'Search Results',
            'theory.viewSummary': 'View Summary',
            'theory.noResults': 'No summaries found matching your search.',
            'theory.keyPoints': 'Key Points',
            'theory.importantFormulas': 'Important Formulas',
            'theory.examTips': 'Exam Tips',
            'theory.tip': 'Tip',
            'theory.practiceQuiz': 'Practice Quiz',
            'common.close': 'Close',
        };
        return fallbacks[key] || key.split('.').pop();
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedSummary, setSelectedSummary] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showCategories, setShowCategories] = useState(true);

    // Filter summaries
    const displayedSummaries = useMemo(() => {
        let results = THEORY_SUMMARIES;

        if (searchQuery) {
            results = searchSummaries(searchQuery);
            setShowCategories(false);
        } else if (selectedCategory !== 'all') {
            results = getSummariesByCategory(selectedCategory);
            setShowCategories(false);
        } else if (selectedGrade !== 'all') {
            results = getSummariesByGrade(parseInt(selectedGrade));
            setShowCategories(false);
        } else {
            setShowCategories(true);
        }

        return results;
    }, [searchQuery, selectedCategory, selectedGrade]);

    const handleSummaryClick = (summary) => {
        setSelectedSummary(summary);
        setDialogOpen(true);
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        setSearchQuery('');
        setSelectedGrade('all');
    };

    const handleBackToCategories = () => {
        setSelectedCategory('all');
        setSelectedGrade('all');
        setSearchQuery('');
    };

    const getCategoryColor = (categoryId) => {
        const cat = THEORY_CATEGORIES.find(c => c.id === categoryId);
        return cat?.color || '#58CC02';
    };

    return (
        <div className={classes.root}>
            <BrandLogoNav />

            <Container className={classes.container} maxWidth="lg">
                {/* Header */}
                <div className={classes.header}>
                    <IconButton
                        className={classes.backButton}
                        onClick={() => showCategories ? history.goBack() : handleBackToCategories()}
                    >
                        <ArrowBack />
                    </IconButton>
                    <div>
                        <Typography variant="h4" className={classes.title}>
                            {translate('theory.title')}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {translate('theory.subtitle')}
                        </Typography>
                    </div>
                </div>

                {/* Filters */}
                <div className={classes.filtersRow}>
                    <TextField
                        variant="outlined"
                        placeholder={translate('theory.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setSelectedCategory('all');
                            setSelectedGrade('all');
                        }}
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
                        <InputLabel>{translate('theory.grade')}</InputLabel>
                        <Select
                            value={selectedGrade}
                            onChange={(e) => {
                                setSelectedGrade(e.target.value);
                                setSelectedCategory('all');
                                setSearchQuery('');
                            }}
                            label={translate('theory.grade')}
                        >
                            <MenuItem value="all">{translate('theory.allGrades')}</MenuItem>
                            <MenuItem value="10">{translate('grades.grade10') || 'Grade 10'}</MenuItem>
                            <MenuItem value="11">{translate('grades.grade11') || 'Grade 11'}</MenuItem>
                            <MenuItem value="12">{translate('grades.grade12') || 'Grade 12'}</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Category Grid */}
                {showCategories && (
                    <Grid container spacing={3} style={{ marginBottom: 32 }}>
                        {THEORY_CATEGORIES.map((category) => (
                            <Grid item xs={6} sm={4} md={3} key={category.id}>
                                <Card
                                    className={classes.categoryCard}
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <Functions
                                        className={classes.categoryIcon}
                                        style={{ color: category.color }}
                                    />
                                    <Typography variant="h6">
                                        {category.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {getSummariesByCategory(category.id).length} {translate('theory.topics')}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Summaries List */}
                {!showCategories && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            {selectedCategory !== 'all'
                                ? THEORY_CATEGORIES.find(c => c.id === selectedCategory)?.name
                                : selectedGrade !== 'all'
                                    ? `${translate('theory.grade')} ${selectedGrade} ${translate('theory.gradeTopics')}`
                                    : `${translate('theory.searchResults')} (${displayedSummaries.length})`
                            }
                        </Typography>
                        <Grid container spacing={3}>
                            {displayedSummaries.map((summary) => (
                                <Grid item xs={12} sm={6} md={4} key={summary.id}>
                                    <Card className={classes.summaryCard}>
                                        <CardContent className={classes.cardContent}>
                                            <Typography variant="h6" className={classes.summaryTitle}>
                                                {summary.title}
                                            </Typography>
                                            <div className={classes.gradeChips}>
                                                {summary.grade.map(g => (
                                                    <Chip
                                                        key={g}
                                                        size="small"
                                                        label={`Gr ${g}`}
                                                        className={classes.gradeChip}
                                                    />
                                                ))}
                                                <Chip
                                                    size="small"
                                                    icon={<Star style={{ fontSize: 14 }} />}
                                                    label={summary.examWeight?.split(' - ')[0]}
                                                    className={classes.examWeightChip}
                                                />
                                            </div>
                                            <Typography variant="body2" color="textSecondary">
                                                {summary.keyPoints[0]}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() => handleSummaryClick(summary)}
                                            >
                                                {translate('theory.viewSummary')}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {displayedSummaries.length === 0 && (
                            <Paper style={{ padding: 32, textAlign: 'center' }}>
                                <Typography color="textSecondary">
                                    {translate('theory.noResults')}
                                </Typography>
                            </Paper>
                        )}
                    </>
                )}
            </Container>

            {/* Summary Detail Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedSummary && (
                    <>
                        <DialogTitle>
                            <Typography variant="h5">
                                {selectedSummary.title}
                            </Typography>
                            <div className={classes.gradeChips} style={{ marginTop: 8 }}>
                                {selectedSummary.grade.map(g => (
                                    <Chip
                                        key={g}
                                        size="small"
                                        icon={<School />}
                                        label={`Grade ${g}`}
                                        className={classes.gradeChip}
                                    />
                                ))}
                                <Chip
                                    size="small"
                                    label={selectedSummary.examWeight}
                                    className={classes.examWeightChip}
                                />
                            </div>
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            {/* Key Points */}
                            <Typography className={classes.sectionTitle}>
                                <CheckCircle style={{ color: '#4caf50' }} />
                                {translate('theory.keyPoints')}
                            </Typography>
                            <List dense>
                                {selectedSummary.keyPoints.map((point, i) => (
                                    <ListItem key={i} className={classes.keyPointItem}>
                                        <ListItemIcon>
                                            <CheckCircle color="primary" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={point} />
                                    </ListItem>
                                ))}
                            </List>

                            <Divider style={{ margin: '16px 0' }} />

                            {/* Formulas */}
                            {selectedSummary.formulas && (
                                <>
                                    <Typography className={classes.sectionTitle}>
                                        <Functions style={{ color: '#58CC02' }} />
                                        {translate('theory.importantFormulas')}
                                    </Typography>
                                    {selectedSummary.formulas.map((formula, i) => (
                                        <div key={i} className={classes.formulaCard}>
                                            <Typography className={classes.formulaName}>
                                                {formula.name}
                                            </Typography>
                                            <Typography className={classes.formulaText}>
                                                {formula.formula}
                                            </Typography>
                                        </div>
                                    ))}
                                </>
                            )}

                            <Divider style={{ margin: '16px 0' }} />

                            {/* Tips */}
                            {selectedSummary.tips && (
                                <>
                                    <Typography className={classes.sectionTitle}>
                                        <EmojiObjects style={{ color: '#ffa000' }} />
                                        {translate('theory.examTips')}
                                    </Typography>
                                    {selectedSummary.tips.map((tip, i) => (
                                        <div key={i} className={classes.tipItem}>
                                            <Typography variant="body2">
                                                <strong>{translate('theory.tip')} {i + 1}:</strong> {tip}
                                            </Typography>
                                        </div>
                                    ))}
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)}>
                                {translate('common.close')}
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    setDialogOpen(false);
                                    history.push('/quiz');
                                }}
                            >
                                {translate('theory.practiceQuiz')}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default TheorySummariesPage;
