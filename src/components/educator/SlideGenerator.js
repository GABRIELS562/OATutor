/**
 * SlideGenerator - AI-powered presentation generator for educators
 * Creates CAPS-aligned lesson presentations with one click
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Chip,
    IconButton,
    LinearProgress,
    Card,
    CardContent,
    Tooltip,
    Switch,
    FormControlLabel,
} from '@material-ui/core';
import {
    Slideshow,
    GetApp,
    Refresh,
    Assignment,
} from '@material-ui/icons';
import SlideGeneratorService from '../../services/SlideGeneratorService';
import ReportExportService from '../../services/ReportExportService';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
    headerIcon: {
        fontSize: 40,
        color: '#1a237e',
    },
    title: {
        fontWeight: 600,
        color: '#333',
    },
    subtitle: {
        color: '#666',
    },
    formSection: {
        marginBottom: theme.spacing(3),
    },
    formRow: {
        display: 'flex',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),
        flexWrap: 'wrap',
    },
    formControl: {
        minWidth: 150,
        flex: '1 1 auto',
    },
    topicChips: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(1),
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
    generateButton: {
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        padding: theme.spacing(1.5, 4),
        '&:hover': {
            background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
        },
    },
    previewSection: {
        marginTop: theme.spacing(4),
    },
    previewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    slideCard: {
        marginBottom: theme.spacing(2),
        border: '1px solid rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
    },
    slideCardTitle: {
        backgroundColor: '#1a237e',
        color: 'white',
        padding: theme.spacing(1, 2),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    slideNumber: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: '0.75rem',
    },
    slideType: {
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        opacity: 0.8,
    },
    slideContent: {
        padding: theme.spacing(2),
    },
    slideBullet: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: theme.spacing(0.5),
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: '#1a237e',
        marginRight: theme.spacing(1),
        marginTop: 6,
        flexShrink: 0,
    },
    slideNotes: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderRadius: theme.shape.borderRadius,
        fontSize: '0.85rem',
        color: '#e65100',
    },
    worksheetSection: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
        backgroundColor: 'rgba(26, 35, 126, 0.03)',
        borderRadius: theme.shape.borderRadius,
    },
    worksheetQuestion: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(1.5),
        backgroundColor: 'white',
        borderRadius: theme.shape.borderRadius,
        border: '1px solid rgba(0,0,0,0.08)',
    },
    actionsBar: {
        display: 'flex',
        gap: theme.spacing(2),
        marginTop: theme.spacing(3),
        justifyContent: 'center',
    },
    loadingContainer: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    templateWarning: {
        padding: theme.spacing(2),
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(2),
    },
}));

// Available topics
const TOPICS = [
    { id: 'euclidean-geometry', label: 'Euclidean Geometry', grade: [10, 11, 12] },
    { id: 'trigonometry', label: 'Trigonometry', grade: [10, 11, 12] },
    { id: 'analytical-geometry', label: 'Analytical Geometry', grade: [10, 11, 12] },
    { id: 'calculus', label: 'Calculus', grade: [12] },
    { id: 'functions', label: 'Functions', grade: [10, 11, 12] },
    { id: 'algebra', label: 'Algebra', grade: [10, 11, 12] },
    { id: 'statistics', label: 'Statistics', grade: [10, 11, 12] },
    { id: 'sequences', label: 'Sequences & Series', grade: [11, 12] },
    { id: 'finance', label: 'Financial Maths', grade: [10, 11, 12] },
];

const SlideGenerator = () => {
    const classes = useStyles();

    // Form state
    const [topic, setTopic] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [grade, setGrade] = useState(12);
    const [duration, setDuration] = useState(45);
    const [includeWorksheet, setIncludeWorksheet] = useState(true);
    const [includeExamTips, setIncludeExamTips] = useState(true);

    // Generation state
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSlides, setGeneratedSlides] = useState(null);
    const [error, setError] = useState(null);

    // Filter topics by grade
    const filteredTopics = TOPICS.filter(t => t.grade.includes(grade));

    // Handle generate
    const handleGenerate = async () => {
        const selectedTopic = customTopic || topic;

        if (!selectedTopic) {
            setError('Please select or enter a topic');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const slides = await SlideGeneratorService.generateSlides({
                topic: selectedTopic,
                grade,
                duration,
                includeWorksheet,
                includeExamTips,
            });

            setGeneratedSlides(slides);

        } catch (err) {
            console.error('Generation error:', err);
            setError('Failed to generate slides. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle export to PDF
    const handleExportPDF = async () => {
        if (!generatedSlides) return;

        try {
            await ReportExportService.exportSlidesToPDF(
                generatedSlides,
                `${generatedSlides.title || 'presentation'}.pdf`
            );
        } catch (err) {
            console.error('Export error:', err);
        }
    };

    // Handle topic chip click
    const handleTopicClick = (topicId) => {
        setTopic(topicId === topic ? '' : topicId);
        setCustomTopic('');
    };

    return (
        <div className={classes.root}>
            {/* Header */}
            <div className={classes.header}>
                <Slideshow className={classes.headerIcon} />
                <div>
                    <Typography variant="h5" className={classes.title}>
                        AI Slide Generator
                    </Typography>
                    <Typography variant="body2" className={classes.subtitle}>
                        Create CAPS-aligned lesson presentations instantly
                    </Typography>
                </div>
            </div>

            {/* Form Section */}
            <Paper className={classes.formSection} elevation={1} style={{ padding: 24 }}>
                <Grid container spacing={3}>
                    {/* Grade Selection */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Grade</InputLabel>
                            <Select
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                label="Grade"
                            >
                                <MenuItem value={10}>Grade 10</MenuItem>
                                <MenuItem value={11}>Grade 11</MenuItem>
                                <MenuItem value={12}>Grade 12</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Duration */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Duration</InputLabel>
                            <Select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                label="Duration"
                            >
                                <MenuItem value={30}>30 minutes</MenuItem>
                                <MenuItem value={45}>45 minutes</MenuItem>
                                <MenuItem value={60}>60 minutes</MenuItem>
                                <MenuItem value={90}>90 minutes (double)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Options */}
                    <Grid item xs={12} sm={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeWorksheet}
                                    onChange={(e) => setIncludeWorksheet(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Include Worksheet"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeExamTips}
                                    onChange={(e) => setIncludeExamTips(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Include Exam Tips"
                        />
                    </Grid>

                    {/* Topic Selection */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                            Select Topic:
                        </Typography>
                        <div className={classes.topicChips}>
                            {filteredTopics.map((t) => (
                                <Chip
                                    key={t.id}
                                    label={t.label}
                                    onClick={() => handleTopicClick(t.id)}
                                    className={`${classes.topicChip} ${topic === t.id ? classes.topicChipSelected : ''}`}
                                />
                            ))}
                        </div>
                    </Grid>

                    {/* Custom Topic */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Or enter a custom topic"
                            value={customTopic}
                            onChange={(e) => {
                                setCustomTopic(e.target.value);
                                setTopic('');
                            }}
                            placeholder="e.g., Circle Theorems, Compound Angles"
                        />
                    </Grid>

                    {/* Generate Button */}
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            className={classes.generateButton}
                            onClick={handleGenerate}
                            disabled={isGenerating || (!topic && !customTopic)}
                            startIcon={isGenerating ? null : <Slideshow />}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Presentation'}
                        </Button>
                    </Grid>
                </Grid>

                {/* Error */}
                {error && (
                    <Typography color="error" style={{ marginTop: 16, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}
            </Paper>

            {/* Loading */}
            {isGenerating && (
                <div className={classes.loadingContainer}>
                    <LinearProgress style={{ marginBottom: 16 }} />
                    <Typography color="textSecondary">
                        Creating your presentation with AI...
                    </Typography>
                </div>
            )}

            {/* Preview Section */}
            {generatedSlides && !isGenerating && (
                <div className={classes.previewSection}>
                    {/* Template warning */}
                    {generatedSlides.isTemplate && (
                        <div className={classes.templateWarning}>
                            <Typography variant="body2">
                                <strong>Note:</strong> This is a template. Add your Groq API key for AI-generated content.
                            </Typography>
                        </div>
                    )}

                    <div className={classes.previewHeader}>
                        <div>
                            <Typography variant="h6">
                                {generatedSlides.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {generatedSlides.slides?.length} slides • {generatedSlides.duration}
                            </Typography>
                        </div>
                        <div>
                            <Tooltip title="Regenerate">
                                <IconButton onClick={handleGenerate}>
                                    <Refresh />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export to PDF">
                                <IconButton onClick={handleExportPDF}>
                                    <GetApp />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Slides */}
                    {generatedSlides.slides?.map((slide, index) => (
                        <Card key={index} className={classes.slideCard}>
                            <div className={classes.slideCardTitle}>
                                <span className={classes.slideNumber}>Slide {index + 1}</span>
                                <Typography variant="subtitle1">{slide.title}</Typography>
                                <span className={classes.slideType}>{slide.type}</span>
                            </div>
                            <CardContent className={classes.slideContent}>
                                {slide.content?.map((item, i) => (
                                    <div key={i} className={classes.slideBullet}>
                                        <span className={classes.bulletDot} />
                                        <Typography variant="body2">{item}</Typography>
                                    </div>
                                ))}
                                {slide.notes && (
                                    <div className={classes.slideNotes}>
                                        <strong>Teacher Notes: </strong>{slide.notes}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {/* Worksheet Questions */}
                    {generatedSlides.worksheetQuestions?.length > 0 && (
                        <div className={classes.worksheetSection}>
                            <Typography variant="h6" gutterBottom>
                                <Assignment style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                Practice Worksheet
                            </Typography>
                            {generatedSlides.worksheetQuestions.map((q, i) => (
                                <div key={i} className={classes.worksheetQuestion}>
                                    <Typography variant="body1">
                                        <strong>Q{i + 1}.</strong> {q.question}
                                        <Chip
                                            size="small"
                                            label={`${q.marks} marks`}
                                            style={{ marginLeft: 8 }}
                                        />
                                    </Typography>
                                    {q.solution && (
                                        <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                                            <em>Solution: {q.solution}</em>
                                        </Typography>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className={classes.actionsBar}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<GetApp />}
                            onClick={handleExportPDF}
                        >
                            Download PDF
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={handleGenerate}
                        >
                            Regenerate
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlideGenerator;
