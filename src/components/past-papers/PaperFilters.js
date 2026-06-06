/**
 * PaperFilters - Filter controls for past papers
 * Year, type, paper variant, topic filters
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Button,
    Typography,
    IconButton,
    Collapse,
} from '@material-ui/core';
import {
    FilterList,
    Clear,
    ExpandMore,
    ExpandLess,
} from '@material-ui/icons';
import {
    getAvailableYears,
    PAPER_TYPES,
    PAPER_VARIANTS,
    PROVINCES,
} from '../../data/pastPapersIndex';
import { useLocalization } from '../../util/LocalizationContext';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(3),
        borderRadius: theme.shape.borderRadius * 2,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2),
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        fontWeight: 600,
        color: '#333',
    },
    expandButton: {
        padding: 4,
    },
    filterRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    formControl: {
        minWidth: 120,
        flex: '1 1 auto',
        maxWidth: 200,
    },
    topicsSection: {
        marginTop: theme.spacing(2),
    },
    topicsLabel: {
        fontSize: '0.875rem',
        color: '#666',
        marginBottom: theme.spacing(1),
    },
    topicsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
    },
    topicChip: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(26, 35, 126, 0.15)',
        },
    },
    topicChipSelected: {
        backgroundColor: '#1a237e',
        color: 'white',
        '&:hover': {
            backgroundColor: '#0d47a1',
        },
    },
    actionsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2),
        borderTop: '1px solid rgba(0,0,0,0.08)',
    },
    activeFilters: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        flexWrap: 'wrap',
    },
    activeFilterChip: {
        height: 28,
    },
    clearButton: {
        color: '#666',
    },
    resultCount: {
        fontSize: '0.875rem',
        color: '#666',
    },
}));

// Available topics for filtering - keys map to pastPapersFilters translations
const TOPICS = [
    { id: 'algebra', key: 'algebra' },
    { id: 'functions', key: 'functions' },
    { id: 'calculus', key: 'calculus' },
    { id: 'sequences', key: 'sequencesSeries' },
    { id: 'finance', key: 'financialMaths' },
    { id: 'trigonometry', key: 'trigonometry' },
    { id: 'euclidean-geometry', key: 'euclideanGeometry' },
    { id: 'analytical-geometry', key: 'analyticalGeometry' },
    { id: 'statistics', key: 'statistics' },
];

const PaperFilters = ({
    filters,
    onFilterChange,
    resultCount = 0,
    showExpanded = true,
}) => {
    const classes = useStyles();
    const { t } = useLocalization();
    const [expanded, setExpanded] = React.useState(showExpanded);

    const years = getAvailableYears();

    const handleChange = (key, value) => {
        onFilterChange({
            ...filters,
            [key]: value || null,
        });
    };

    const handleTopicToggle = (topicId) => {
        const currentTopics = filters.topics || [];
        const newTopics = currentTopics.includes(topicId)
            ? currentTopics.filter(t => t !== topicId)
            : [...currentTopics, topicId];

        onFilterChange({
            ...filters,
            topics: newTopics.length > 0 ? newTopics : null,
        });
    };

    const handleClear = () => {
        onFilterChange({});
    };

    // Count active filters
    const activeFilterCount = Object.values(filters).filter(v =>
        v !== null && v !== undefined && (!Array.isArray(v) || v.length > 0)
    ).length;

    // Get active filter labels for chips
    const getActiveFilterLabels = () => {
        const labels = [];

        if (filters.year) labels.push({ key: 'year', label: String(filters.year) });
        if (filters.type) labels.push({ key: 'type', label: filters.type.toUpperCase() });
        if (filters.variant) labels.push({ key: 'variant', label: filters.variant === 'p1' ? t('pastPapersFilters.paper1') : t('pastPapersFilters.paper2') });
        if (filters.province) labels.push({ key: 'province', label: filters.province.toUpperCase() });
        if (filters.topics?.length) {
            labels.push({ key: 'topics', label: t('pastPapersFilters.nTopics', { count: filters.topics.length }) });
        }

        return labels;
    };

    return (
        <Paper className={classes.root} elevation={1}>
            {/* Header */}
            <div className={classes.header}>
                <Typography className={classes.title}>
                    <FilterList />
                    {t('pastPapersFilters.filterPapers')}
                    {activeFilterCount > 0 && (
                        <Chip
                            size="small"
                            label={activeFilterCount}
                            color="primary"
                        />
                    )}
                </Typography>
                <IconButton
                    className={classes.expandButton}
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </div>

            <Collapse in={expanded}>
                {/* Main filters */}
                <div className={classes.filterRow}>
                    {/* Year */}
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>{t('pastPapersFilters.year')}</InputLabel>
                        <Select
                            value={filters.year || ''}
                            onChange={(e) => handleChange('year', e.target.value)}
                            label={t('pastPapersFilters.year')}
                        >
                            <MenuItem value="">{t('pastPapersFilters.allYears')}</MenuItem>
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Type */}
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>{t('pastPapersFilters.type')}</InputLabel>
                        <Select
                            value={filters.type || ''}
                            onChange={(e) => handleChange('type', e.target.value)}
                            label={t('pastPapersFilters.type')}
                        >
                            <MenuItem value="">{t('pastPapersFilters.allTypes')}</MenuItem>
                            <MenuItem value={PAPER_TYPES.NSC}>{t('pastPapersFilters.nscNovember')}</MenuItem>
                            <MenuItem value={PAPER_TYPES.NSC_SUPPLEMENTARY}>{t('pastPapersFilters.supplementary')}</MenuItem>
                            <MenuItem value={PAPER_TYPES.IEB}>{t('pastPapersFilters.ieb')}</MenuItem>
                            <MenuItem value={PAPER_TYPES.TRIAL}>{t('pastPapersFilters.trialExams')}</MenuItem>
                            <MenuItem value={PAPER_TYPES.PROVINCIAL}>{t('pastPapersFilters.provincial')}</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Paper variant */}
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel>{t('pastPapersFilters.paper')}</InputLabel>
                        <Select
                            value={filters.variant || ''}
                            onChange={(e) => handleChange('variant', e.target.value)}
                            label={t('pastPapersFilters.paper')}
                        >
                            <MenuItem value="">{t('pastPapersFilters.bothPapers')}</MenuItem>
                            <MenuItem value={PAPER_VARIANTS.PAPER_1}>{t('pastPapersFilters.paper1')}</MenuItem>
                            <MenuItem value={PAPER_VARIANTS.PAPER_2}>{t('pastPapersFilters.paper2')}</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Province (for trial/provincial) */}
                    {(filters.type === PAPER_TYPES.TRIAL || filters.type === PAPER_TYPES.PROVINCIAL) && (
                        <FormControl variant="outlined" size="small" className={classes.formControl}>
                            <InputLabel>{t('pastPapersFilters.province')}</InputLabel>
                            <Select
                                value={filters.province || ''}
                                onChange={(e) => handleChange('province', e.target.value)}
                                label={t('pastPapersFilters.province')}
                            >
                                <MenuItem value="">{t('pastPapersFilters.allProvinces')}</MenuItem>
                                {PROVINCES.map((province) => (
                                    <MenuItem key={province} value={province}>
                                        {province.toUpperCase()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </div>

                {/* Topics filter */}
                <div className={classes.topicsSection}>
                    <Typography className={classes.topicsLabel}>
                        {t('pastPapersFilters.filterByTopic')}
                    </Typography>
                    <div className={classes.topicsContainer}>
                        {TOPICS.map((topic) => (
                            <Chip
                                key={topic.id}
                                label={t(`pastPapersFilters.${topic.key}`)}
                                size="small"
                                onClick={() => handleTopicToggle(topic.id)}
                                className={`${classes.topicChip} ${
                                    filters.topics?.includes(topic.id) ? classes.topicChipSelected : ''
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </Collapse>

            {/* Actions row */}
            <div className={classes.actionsRow}>
                <div className={classes.activeFilters}>
                    {getActiveFilterLabels().map(({ key, label }) => (
                        <Chip
                            key={key}
                            label={label}
                            size="small"
                            onDelete={() => handleChange(key, null)}
                            className={classes.activeFilterChip}
                        />
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Typography className={classes.resultCount}>
                        {resultCount !== 1
                            ? t('pastPapersFilters.papersFound', { count: resultCount })
                            : t('pastPapersFilters.paperFound', { count: resultCount })
                        }
                    </Typography>
                    {activeFilterCount > 0 && (
                        <Button
                            size="small"
                            startIcon={<Clear />}
                            className={classes.clearButton}
                            onClick={handleClear}
                        >
                            {t('pastPapersFilters.clearAll')}
                        </Button>
                    )}
                </div>
            </div>
        </Paper>
    );
};

export default PaperFilters;
