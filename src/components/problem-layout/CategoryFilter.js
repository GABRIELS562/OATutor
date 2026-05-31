import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Chip, Box, Typography } from '@material-ui/core';
import { EXAM_CATEGORIES } from '../../config/examCategories';
import withTranslation from '../../util/withTranslation.js';

const styles = theme => ({
    container: {
        marginBottom: 24,
        padding: '0 16px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: 16,
            padding: '0 8px',
        },
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: 600,
        color: '#1a1a2e',
        fontSize: '0.95rem',
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.9rem',
            marginBottom: 10,
        },
    },
    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            gap: 8,
            overflowX: 'auto',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            padding: '4px 0',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
        },
    },
    chip: {
        fontWeight: 500,
        padding: '4px 8px',
        minHeight: 36,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        [theme.breakpoints.down('sm')]: {
            minHeight: 40,
            flexShrink: 0,
            padding: '4px 6px',
        },
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '@media (hover: none)': {
                transform: 'none',
                boxShadow: 'none',
            },
        },
        '&:active': {
            transform: 'scale(0.98)',
        },
    },
    activeChip: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transform: 'scale(1.02)',
    },
    chipLabel: {
        fontSize: '0.85rem',
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.8rem',
        },
    },
    resultsCount: {
        textAlign: 'center',
        marginTop: 12,
        color: '#64748B',
        fontSize: '0.85rem',
        [theme.breakpoints.down('sm')]: {
            marginTop: 8,
            fontSize: '0.8rem',
        },
    },
});

class CategoryFilter extends React.Component {
    render() {
        const {
            classes,
            selectedCategory,
            onCategoryChange,
            translate,
            lessonCount,
            totalCount
        } = this.props;

        // Detect if mobile using window width (fallback for class component)
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

        return (
            <Box className={classes.container}>
                <Typography variant="subtitle2" className={classes.title}>
                    {translate('examCategories.filterTitle')}
                </Typography>
                <Box className={classes.chipContainer}>
                    {EXAM_CATEGORIES.map(category => {
                        const isSelected = selectedCategory === category.id;
                        return (
                            <Chip
                                key={category.id}
                                label={isMobile ? category.shortName : category.name}
                                onClick={() => onCategoryChange(category.id)}
                                className={`${classes.chip} ${isSelected ? classes.activeChip : ''}`}
                                classes={{ label: classes.chipLabel }}
                                style={{
                                    backgroundColor: isSelected
                                        ? category.color
                                        : `${category.color}15`,
                                    color: isSelected
                                        ? '#FFFFFF'
                                        : category.color,
                                    border: `2px solid ${category.color}`,
                                }}
                                size={isMobile ? "medium" : "small"}
                                aria-pressed={isSelected}
                                aria-label={`Filter by ${category.name}`}
                            />
                        );
                    })}
                </Box>
                {selectedCategory !== 'all' && lessonCount !== undefined && (
                    <Typography className={classes.resultsCount}>
                        {translate('examCategories.showingResults')
                            .replace('{count}', lessonCount)
                            .replace('{total}', totalCount)}
                    </Typography>
                )}
            </Box>
        );
    }
}

export default withStyles(styles)(withTranslation(CategoryFilter));
