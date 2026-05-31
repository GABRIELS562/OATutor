/**
 * Content Browser Component
 * Browse available problems by subject, topic, and difficulty
 */

import React, { useState, useMemo } from 'react';
import {
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Tooltip,
    Badge,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Icons
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SchoolIcon from '@material-ui/icons/School';
import FunctionsIcon from '@material-ui/icons/Functions';
import FlareIcon from '@material-ui/icons/Flare'; // Chemistry icon replacement
import MemoryIcon from '@material-ui/icons/Memory';
import EcoIcon from '@material-ui/icons/Eco'; // Biology icon

// Content structure based on SA CAPS curriculum
const CONTENT_STRUCTURE = {
    Mathematics: {
        icon: <FunctionsIcon />,
        color: '#7B2FF7',
        grades: {
            10: [
                {
                    topic: 'Exponents and Surds',
                    skills: ['exponent-laws', 'prime-bases', 'surd-simplification', 'rationalise-denominator'],
                    problems: 12,
                    difficulty: 'Medium',
                },
                {
                    topic: 'Algebraic Expressions',
                    skills: ['factorisation', 'trinomial-factor', 'alg-simplify', 'alg-expansion'],
                    problems: 24,
                    difficulty: 'Medium',
                },
                {
                    topic: 'Linear Equations',
                    skills: ['linear-equations', 'simultaneous-equations', 'solving-equations'],
                    problems: 15,
                    difficulty: 'Easy',
                },
                {
                    topic: 'Inequalities',
                    skills: ['inequalities', 'interval-notation'],
                    problems: 9,
                    difficulty: 'Medium',
                },
                {
                    topic: 'Functions and Graphs',
                    skills: ['gradient', 'linear-graph', 'perpendicular-lines'],
                    problems: 18,
                    difficulty: 'Medium',
                },
                {
                    topic: 'Financial Mathematics',
                    skills: ['simple-interest'],
                    problems: 6,
                    difficulty: 'Easy',
                },
            ],
            11: [
                {
                    topic: 'Functions - Parabola',
                    skills: ['parabola-vertex', 'parabola-axis', 'completing-square'],
                    problems: 15,
                    difficulty: 'Medium',
                },
                {
                    topic: 'Functions - Hyperbola',
                    skills: ['hyperbola-asymptotes', 'hyperbola-domain-range', 'asymptotes'],
                    problems: 12,
                    difficulty: 'Medium',
                },
                {
                    topic: 'Functions - Exponential',
                    skills: ['exponential-graph', 'exponential-growth', 'exponential-decay'],
                    problems: 12,
                    difficulty: 'Medium',
                },
                {
                    topic: 'Trigonometry',
                    skills: ['sine-rule', 'cosine-rule', 'trig-area'],
                    problems: 18,
                    difficulty: 'Hard',
                },
                {
                    topic: 'Sequences and Series',
                    skills: ['arithmetic-sequence', 'geometric-sequence', 'sigma-notation'],
                    problems: 12,
                    difficulty: 'Medium',
                },
                {
                    topic: 'Financial Mathematics',
                    skills: ['compound-interest', 'annuities'],
                    problems: 12,
                    difficulty: 'Hard',
                },
            ],
            12: [
                {
                    topic: 'Euclidean Geometry',
                    skills: ['geo-tangent-theorem', 'geo-cyclic-quad', 'geo-circle-theorems', 'geo-proof-writing'],
                    problems: 24,
                    difficulty: 'Hard',
                },
                {
                    topic: 'Trigonometry - Compound Angles',
                    skills: ['trig-compound-add', 'trig-double-angle', 'trig-special-angles'],
                    problems: 24,
                    difficulty: 'Hard',
                },
                {
                    topic: 'Trigonometry - General Solution',
                    skills: ['trig-general-solution', 'trig-equations', 'trig-identities'],
                    problems: 15,
                    difficulty: 'Hard',
                },
                {
                    topic: 'Analytical Geometry',
                    skills: ['anl-circle-center-form', 'anl-tangent-circle', 'anl-distance-formula'],
                    problems: 18,
                    difficulty: 'Hard',
                },
                {
                    topic: 'Calculus - Differentiation',
                    skills: ['first-principles', 'differentiation-rules', 'tangent-line', 'stationary-points'],
                    problems: 30,
                    difficulty: 'Hard',
                },
                {
                    topic: 'Calculus - Optimization',
                    skills: ['optimization', 'rate-of-change', 'motion-calculus', 'curve-sketching'],
                    problems: 24,
                    difficulty: 'Hard',
                },
                {
                    topic: 'Statistics',
                    skills: ['stats-regression-line', 'stats-correlation'],
                    problems: 12,
                    difficulty: 'Medium',
                },
            ],
        },
    },
    Physics: {
        icon: <MemoryIcon />,
        color: '#00D4FF',
        grades: {
            10: [
                { topic: 'Mechanics', skills: ['phys-newtons-laws'], problems: 12, difficulty: 'Medium' },
            ],
            11: [
                { topic: 'Waves', skills: ['phys-waves'], problems: 12, difficulty: 'Medium' },
                { topic: 'Electricity', skills: ['phys-ohms-law', 'phys-circuits'], problems: 18, difficulty: 'Medium' },
            ],
            12: [
                { topic: 'Momentum', skills: ['phys-momentum'], problems: 18, difficulty: 'Hard' },
                { topic: 'Projectile Motion', skills: ['phys-projectile'], problems: 12, difficulty: 'Hard' },
                { topic: 'Work, Energy & Power', skills: ['phys-work-energy'], problems: 18, difficulty: 'Hard' },
                { topic: 'Doppler Effect', skills: ['phys-doppler'], problems: 12, difficulty: 'Hard' },
                { topic: 'Electromagnetism', skills: ['phys-em-induction', 'phys-circuits'], problems: 15, difficulty: 'Hard' },
                { topic: 'Photoelectric Effect', skills: ['phys-photoelectric', 'phys-optics'], problems: 12, difficulty: 'Hard' },
            ],
        },
    },
    Chemistry: {
        icon: <FlareIcon />,
        color: '#10B981',
        grades: {
            10: [
                { topic: 'Stoichiometry', skills: ['chem-stoichiometry'], problems: 18, difficulty: 'Medium' },
            ],
            11: [
                { topic: 'Reaction Rates', skills: ['chem-reaction-rates'], problems: 9, difficulty: 'Medium' },
            ],
            12: [
                { topic: 'Organic Chemistry', skills: ['chem-organic-reactions', 'chem-functional-groups', 'chem-iupac-naming'], problems: 18, difficulty: 'Hard' },
                { topic: 'Acids and Bases', skills: ['chem-ph-calc', 'chem-titrations'], problems: 18, difficulty: 'Hard' },
                { topic: 'Chemical Equilibrium', skills: ['chem-equilibrium'], problems: 18, difficulty: 'Hard' },
                { topic: 'Electrochemistry', skills: ['chem-galvanic', 'chem-electrolysis'], problems: 12, difficulty: 'Hard' },
            ],
        },
    },
    Biology: {
        icon: <EcoIcon />,
        color: '#F59E0B',
        grades: {
            10: [
                { topic: 'Plant Structure', skills: ['bio-plant-structure'], problems: 15, difficulty: 'Easy' },
            ],
            11: [
                { topic: 'Photosynthesis', skills: ['bio-photosynthesis'], problems: 6, difficulty: 'Medium' },
                { topic: 'Cellular Respiration', skills: ['bio-respiration'], problems: 6, difficulty: 'Medium' },
            ],
            12: [
                { topic: 'DNA and Genetics', skills: ['bio-dna-structure', 'bio-protein-synthesis', 'bio-genetic-crosses'], problems: 21, difficulty: 'Hard' },
                { topic: 'Evolution', skills: ['bio-natural-selection', 'bio-speciation'], problems: 12, difficulty: 'Medium' },
                { topic: 'Nervous System', skills: ['bio-reflex-arc', 'bio-nerve-impulse', 'bio-brain-structure'], problems: 15, difficulty: 'Hard' },
                { topic: 'Endocrine System', skills: ['bio-hormones', 'bio-homeostasis'], problems: 12, difficulty: 'Medium' },
                { topic: 'Reproduction', skills: ['bio-menstrual-cycle', 'bio-meiosis'], problems: 18, difficulty: 'Medium' },
            ],
        },
    },
};

const useStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    header: {
        padding: theme.spacing(3),
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    },
    filters: {
        display: 'flex',
        gap: theme.spacing(2),
        marginTop: theme.spacing(2),
        flexWrap: 'wrap',
    },
    searchField: {
        minWidth: 280,
        '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#F8FAFC',
        },
    },
    filterSelect: {
        minWidth: 140,
        '& .MuiOutlinedInput-root': {
            borderRadius: 10,
        },
    },
    subjectCard: {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
    },
    subjectIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(1.5),
        '& svg': {
            fontSize: 24,
            color: '#fff',
        },
    },
    subjectTitle: {
        fontWeight: 700,
        marginBottom: theme.spacing(0.5),
    },
    accordion: {
        '&:before': {
            display: 'none',
        },
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '12px !important',
        marginBottom: theme.spacing(1.5),
        '&.Mui-expanded': {
            margin: 0,
            marginBottom: theme.spacing(1.5),
        },
    },
    accordionSummary: {
        '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: theme.spacing(2),
        },
    },
    topicTitle: {
        fontWeight: 600,
        flex: 1,
    },
    difficultyChip: {
        fontWeight: 600,
        fontSize: '0.7rem',
    },
    skillList: {
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: theme.spacing(1),
    },
    skillItem: {
        borderRadius: 8,
        marginBottom: theme.spacing(0.5),
        '&:last-child': {
            marginBottom: 0,
        },
        '&:hover': {
            backgroundColor: 'rgba(123, 47, 247, 0.08)',
        },
    },
    skillName: {
        fontSize: '0.9rem',
    },
    noResults: {
        padding: theme.spacing(4),
        textAlign: 'center',
        color: '#64748B',
    },
}));

const ContentBrowser = ({ onSelectProblem, onAddToAssignment }) => {
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [expandedSubject, setExpandedSubject] = useState(null);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return '#10B981';
            case 'Medium': return '#F59E0B';
            case 'Hard': return '#F72585';
            default: return '#64748B';
        }
    };

    // Filter content based on selections
    const filteredContent = useMemo(() => {
        const filtered = {};

        Object.entries(CONTENT_STRUCTURE).forEach(([subject, data]) => {
            if (selectedSubject !== 'All' && selectedSubject !== subject) return;

            const filteredGrades = {};
            Object.entries(data.grades).forEach(([grade, topics]) => {
                if (selectedGrade !== 'All' && selectedGrade !== grade) return;

                const filteredTopics = topics.filter(topic => {
                    // Filter by difficulty
                    if (selectedDifficulty !== 'All' && topic.difficulty !== selectedDifficulty) return false;

                    // Filter by search term
                    if (searchTerm) {
                        const search = searchTerm.toLowerCase();
                        return (
                            topic.topic.toLowerCase().includes(search) ||
                            topic.skills.some(s => s.toLowerCase().includes(search))
                        );
                    }
                    return true;
                });

                if (filteredTopics.length > 0) {
                    filteredGrades[grade] = filteredTopics;
                }
            });

            if (Object.keys(filteredGrades).length > 0) {
                filtered[subject] = { ...data, grades: filteredGrades };
            }
        });

        return filtered;
    }, [searchTerm, selectedSubject, selectedGrade, selectedDifficulty]);

    const getTotalProblems = (subject) => {
        let total = 0;
        Object.values(CONTENT_STRUCTURE[subject].grades).forEach(topics => {
            topics.forEach(topic => {
                total += topic.problems;
            });
        });
        return total;
    };

    return (
        <Paper className={classes.paper} elevation={0}>
            {/* Header with Filters */}
            <Box className={classes.header}>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                    Content Browser
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Browse and assign problems from the SA CAPS curriculum
                </Typography>

                <Box className={classes.filters}>
                    <TextField
                        className={classes.searchField}
                        placeholder="Search topics or skills..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl variant="outlined" size="small" className={classes.filterSelect}>
                        <InputLabel>Subject</InputLabel>
                        <Select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            label="Subject"
                        >
                            <MenuItem value="All">All Subjects</MenuItem>
                            <MenuItem value="Mathematics">Mathematics</MenuItem>
                            <MenuItem value="Physics">Physics</MenuItem>
                            <MenuItem value="Chemistry">Chemistry</MenuItem>
                            <MenuItem value="Biology">Biology</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small" className={classes.filterSelect}>
                        <InputLabel>Grade</InputLabel>
                        <Select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            label="Grade"
                        >
                            <MenuItem value="All">All Grades</MenuItem>
                            <MenuItem value="10">Grade 10</MenuItem>
                            <MenuItem value="11">Grade 11</MenuItem>
                            <MenuItem value="12">Grade 12</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small" className={classes.filterSelect}>
                        <InputLabel>Difficulty</InputLabel>
                        <Select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            label="Difficulty"
                        >
                            <MenuItem value="All">All Levels</MenuItem>
                            <MenuItem value="Easy">Easy</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Hard">Hard</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Subject Cards */}
            <Box p={3}>
                {!expandedSubject && (
                    <Grid container spacing={3}>
                        {Object.entries(filteredContent).map(([subject, data]) => (
                            <Grid item xs={12} sm={6} md={3} key={subject}>
                                <Card
                                    className={classes.subjectCard}
                                    onClick={() => setExpandedSubject(subject)}
                                >
                                    <CardContent>
                                        <Box
                                            className={classes.subjectIcon}
                                            style={{ backgroundColor: data.color }}
                                        >
                                            {data.icon}
                                        </Box>
                                        <Typography className={classes.subjectTitle}>
                                            {subject}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {getTotalProblems(subject)} problems
                                        </Typography>
                                        <Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
                                            {Object.keys(data.grades).map(grade => (
                                                <Chip
                                                    key={grade}
                                                    label={`Gr ${grade}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Expanded Subject View */}
                {expandedSubject && filteredContent[expandedSubject] && (
                    <Box>
                        <Box display="flex" alignItems="center" mb={3}>
                            <Button
                                onClick={() => setExpandedSubject(null)}
                                style={{ marginRight: 16 }}
                            >
                                Back to Subjects
                            </Button>
                            <Box
                                className={classes.subjectIcon}
                                style={{
                                    backgroundColor: filteredContent[expandedSubject].color,
                                    width: 40,
                                    height: 40,
                                    marginRight: 12,
                                }}
                            >
                                {filteredContent[expandedSubject].icon}
                            </Box>
                            <Typography variant="h5" style={{ fontWeight: 700 }}>
                                {expandedSubject}
                            </Typography>
                        </Box>

                        {Object.entries(filteredContent[expandedSubject].grades).map(([grade, topics]) => (
                            <Box key={grade} mb={4}>
                                <Typography
                                    variant="h6"
                                    style={{ fontWeight: 600, marginBottom: 16 }}
                                >
                                    Grade {grade}
                                </Typography>

                                {topics.map((topic, idx) => (
                                    <Accordion
                                        key={idx}
                                        className={classes.accordion}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            className={classes.accordionSummary}
                                        >
                                            <Typography className={classes.topicTitle}>
                                                {topic.topic}
                                            </Typography>
                                            <Chip
                                                label={topic.difficulty}
                                                size="small"
                                                className={classes.difficultyChip}
                                                style={{
                                                    backgroundColor: `${getDifficultyColor(topic.difficulty)}15`,
                                                    color: getDifficultyColor(topic.difficulty),
                                                }}
                                            />
                                            <Badge
                                                badgeContent={topic.problems}
                                                color="primary"
                                            >
                                                <SchoolIcon color="action" />
                                            </Badge>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box width="100%">
                                                <Typography
                                                    variant="subtitle2"
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    Skills Covered:
                                                </Typography>
                                                <List dense className={classes.skillList}>
                                                    {topic.skills.map((skill, skillIdx) => (
                                                        <ListItem
                                                            key={skillIdx}
                                                            className={classes.skillItem}
                                                        >
                                                            <ListItemText
                                                                primary={skill.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                primaryTypographyProps={{
                                                                    className: classes.skillName,
                                                                }}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <Tooltip title="Preview Problems">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => onSelectProblem && onSelectProblem(skill)}
                                                                    >
                                                                        <VisibilityIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Add to Assignment">
                                                                    <IconButton
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={() => onAddToAssignment && onAddToAssignment(skill, topic)}
                                                                    >
                                                                        <AddIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* No Results */}
                {Object.keys(filteredContent).length === 0 && (
                    <Box className={classes.noResults}>
                        <Typography variant="h6" gutterBottom>
                            No content found
                        </Typography>
                        <Typography variant="body2">
                            Try adjusting your search or filter criteria
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default ContentBrowser;
