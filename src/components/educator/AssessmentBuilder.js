/**
 * AssessmentBuilder - Create custom assessments and assignments
 * AI-powered question generation with manual editing
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
    Card,
    CardContent,
    IconButton,
    Chip,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';
import {
    Assignment,
    Add,
    Delete,
    Edit,
    Save,
    GetApp,
    Visibility,
    ExpandMore,
    Refresh,
    Timer,
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
    },
    settingsCard: {
        padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    questionCard: {
        marginBottom: theme.spacing(2),
        border: '1px solid rgba(0,0,0,0.08)',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
    },
    questionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        padding: theme.spacing(1, 2),
        backgroundColor: 'rgba(26, 35, 126, 0.05)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
    },
    questionNumber: {
        backgroundColor: '#1a237e',
        color: 'white',
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.875rem',
        fontWeight: 600,
    },
    questionContent: {
        padding: theme.spacing(2),
    },
    subQuestion: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing(2),
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: theme.shape.borderRadius,
    },
    subQuestionLabel: {
        fontWeight: 600,
        minWidth: 40,
    },
    marksChip: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        color: '#4caf50',
    },
    difficultyEasy: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        color: '#4caf50',
    },
    difficultyMedium: {
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        color: '#ff9800',
    },
    difficultyHard: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        color: '#f44336',
    },
    solutionSection: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(1.5),
        backgroundColor: 'rgba(26, 35, 126, 0.03)',
        borderRadius: theme.shape.borderRadius,
        borderLeft: '3px solid #1a237e',
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(3),
    },
    generateButton: {
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
    },
    totalMarks: {
        padding: theme.spacing(2),
        backgroundColor: '#1a237e',
        color: 'white',
        borderRadius: theme.shape.borderRadius,
        textAlign: 'center',
        marginBottom: theme.spacing(2),
    },
    emptyState: {
        textAlign: 'center',
        padding: theme.spacing(4),
        color: '#666',
    },
    addQuestionButton: {
        width: '100%',
        padding: theme.spacing(2),
        border: '2px dashed rgba(26, 35, 126, 0.3)',
        color: '#1a237e',
        '&:hover': {
            backgroundColor: 'rgba(26, 35, 126, 0.05)',
            border: '2px dashed #1a237e',
        },
    },
}));

const AssessmentBuilder = () => {
    const classes = useStyles();

    // Assessment settings
    const [assessmentTitle, setAssessmentTitle] = useState('Mathematics Assessment');
    const [grade, setGrade] = useState(12);
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState(60);
    const targetMarks = 50; // Target total marks for AI generation

    // Questions
    const [questions, setQuestions] = useState([]);

    // UI state
    const [isGenerating, setIsGenerating] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Calculate current total marks
    const currentTotalMarks = questions.reduce((sum, q) => sum + (q.totalMarks || 0), 0);

    // Generate questions with AI
    const handleGenerateQuestions = async () => {
        if (!topic) {
            alert('Please enter a topic');
            return;
        }

        setIsGenerating(true);

        try {
            const result = await SlideGeneratorService.generateQuestionPaper({
                topic,
                grade,
                questionCount: 5,
                totalMarks: targetMarks,
                difficulty: 'mixed',
            });

            if (result.questions) {
                setQuestions(result.questions);
            }
        } catch (error) {
            console.error('Generation error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Add manual question
    const handleAddQuestion = () => {
        const newQuestion = {
            number: questions.length + 1,
            text: '',
            subQuestions: [
                { label: `${questions.length + 1}.1`, text: '', marks: 2 },
            ],
            totalMarks: 2,
            solution: '',
            difficulty: 'medium',
        };

        setEditingQuestion(newQuestion);
        setDialogOpen(true);
    };

    // Save edited question
    const handleSaveQuestion = () => {
        if (editingQuestion) {
            // Calculate total marks from sub-questions
            const totalMarks = editingQuestion.subQuestions.reduce(
                (sum, sq) => sum + (parseInt(sq.marks) || 0),
                0
            );

            const updatedQuestion = { ...editingQuestion, totalMarks };

            const existingIndex = questions.findIndex(q => q.number === editingQuestion.number);
            if (existingIndex >= 0) {
                const newQuestions = [...questions];
                newQuestions[existingIndex] = updatedQuestion;
                setQuestions(newQuestions);
            } else {
                setQuestions([...questions, updatedQuestion]);
            }
        }

        setDialogOpen(false);
        setEditingQuestion(null);
    };

    // Delete question
    const handleDeleteQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        // Renumber questions
        newQuestions.forEach((q, i) => {
            q.number = i + 1;
            q.subQuestions.forEach((sq, j) => {
                sq.label = `${i + 1}.${j + 1}`;
            });
        });
        setQuestions(newQuestions);
    };

    // Edit question
    const handleEditQuestion = (question) => {
        setEditingQuestion({ ...question });
        setDialogOpen(true);
    };

    // Add sub-question
    const handleAddSubQuestion = () => {
        if (editingQuestion) {
            const subQCount = editingQuestion.subQuestions.length;
            setEditingQuestion({
                ...editingQuestion,
                subQuestions: [
                    ...editingQuestion.subQuestions,
                    { label: `${editingQuestion.number}.${subQCount + 1}`, text: '', marks: 2 },
                ],
            });
        }
    };

    // Remove sub-question
    const handleRemoveSubQuestion = (index) => {
        if (editingQuestion && editingQuestion.subQuestions.length > 1) {
            const newSubQuestions = editingQuestion.subQuestions.filter((_, i) => i !== index);
            // Relabel
            newSubQuestions.forEach((sq, i) => {
                sq.label = `${editingQuestion.number}.${i + 1}`;
            });
            setEditingQuestion({
                ...editingQuestion,
                subQuestions: newSubQuestions,
            });
        }
    };

    // Export to PDF
    const handleExportPDF = async () => {
        await ReportExportService.exportToPDF({
            title: assessmentTitle,
            subtitle: `Grade ${grade} • ${topic} • ${currentTotalMarks} Marks • ${duration} Minutes`,
            content: [
                {
                    title: 'Instructions',
                    list: [
                        'Answer ALL questions',
                        'Show ALL working clearly',
                        'Calculators may be used',
                        `Time allowed: ${duration} minutes`,
                    ],
                },
                ...questions.map(q => ({
                    title: `Question ${q.number} [${q.totalMarks} marks]`,
                    text: q.text,
                    list: q.subQuestions.map(sq => `${sq.label} ${sq.text} (${sq.marks})`),
                })),
            ],
            filename: `${assessmentTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        });
    };

    // Get difficulty class
    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case 'easy': return classes.difficultyEasy;
            case 'hard': return classes.difficultyHard;
            default: return classes.difficultyMedium;
        }
    };

    return (
        <div className={classes.root}>
            {/* Header */}
            <div className={classes.header}>
                <Assignment className={classes.headerIcon} />
                <div>
                    <Typography variant="h5" className={classes.title}>
                        Assessment Builder
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Create custom assessments with AI-generated or manual questions
                    </Typography>
                </div>
            </div>

            {/* Settings */}
            <Paper className={classes.settingsCard} elevation={1}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Assessment Title"
                            value={assessmentTitle}
                            onChange={(e) => setAssessmentTitle(e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
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
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            label="Duration (min)"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                            variant="outlined"
                            InputProps={{ startAdornment: <Timer style={{ color: '#999', marginRight: 8 }} /> }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            label="Topic (for AI generation)"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            variant="outlined"
                            placeholder="e.g., Euclidean Geometry, Trigonometry"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            className={classes.generateButton}
                            onClick={handleGenerateQuestions}
                            disabled={isGenerating || !topic}
                            startIcon={<Refresh />}
                            style={{ height: 56 }}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Questions'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Loading */}
            {isGenerating && <LinearProgress style={{ marginBottom: 16 }} />}

            {/* Total Marks Display */}
            {questions.length > 0 && (
                <div className={classes.totalMarks}>
                    <Typography variant="h6">
                        Total: {currentTotalMarks} marks
                    </Typography>
                </div>
            )}

            {/* Questions */}
            {questions.length === 0 && !isGenerating ? (
                <div className={classes.emptyState}>
                    <Assignment style={{ fontSize: 64, opacity: 0.3 }} />
                    <Typography variant="h6" gutterBottom>
                        No questions yet
                    </Typography>
                    <Typography variant="body2">
                        Generate questions with AI or add them manually
                    </Typography>
                </div>
            ) : (
                questions.map((question, index) => (
                    <Card key={index} className={classes.questionCard}>
                        <div className={classes.questionHeader}>
                            <div className={classes.questionNumber}>{question.number}</div>
                            <Typography variant="subtitle1" style={{ flex: 1 }}>
                                {question.text || `Question ${question.number}`}
                            </Typography>
                            <Chip
                                size="small"
                                label={`${question.totalMarks} marks`}
                                className={classes.marksChip}
                            />
                            <Chip
                                size="small"
                                label={question.difficulty}
                                className={getDifficultyClass(question.difficulty)}
                            />
                            <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => handleEditQuestion(question)}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDeleteQuestion(index)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <CardContent className={classes.questionContent}>
                            {question.subQuestions.map((sq, i) => (
                                <div key={i} className={classes.subQuestion}>
                                    <span className={classes.subQuestionLabel}>{sq.label}</span>
                                    <Typography variant="body2" style={{ flex: 1 }}>
                                        {sq.text}
                                    </Typography>
                                    <Chip size="small" label={`${sq.marks}`} />
                                </div>
                            ))}
                            {question.solution && (
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant="body2" color="primary">
                                            View Solution
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            {question.solution}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}

            {/* Add Question Button */}
            <Button
                className={classes.addQuestionButton}
                onClick={handleAddQuestion}
                startIcon={<Add />}
            >
                Add Question Manually
            </Button>

            {/* Action Buttons */}
            {questions.length > 0 && (
                <div className={classes.actionButtons}>
                    <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                    >
                        Preview
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GetApp />}
                        onClick={handleExportPDF}
                    >
                        Export to PDF
                    </Button>
                </div>
            )}

            {/* Edit Question Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {editingQuestion?.number ? `Edit Question ${editingQuestion.number}` : 'Add Question'}
                </DialogTitle>
                <DialogContent>
                    {editingQuestion && (
                        <Grid container spacing={2} style={{ marginTop: 8 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Question Text (optional main question)"
                                    value={editingQuestion.text}
                                    onChange={(e) => setEditingQuestion({
                                        ...editingQuestion,
                                        text: e.target.value,
                                    })}
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Sub-questions:
                                </Typography>
                                {editingQuestion.subQuestions.map((sq, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                        <TextField
                                            label="Label"
                                            value={sq.label}
                                            disabled
                                            style={{ width: 80 }}
                                            variant="outlined"
                                            size="small"
                                        />
                                        <TextField
                                            label="Question"
                                            value={sq.text}
                                            onChange={(e) => {
                                                const newSubs = [...editingQuestion.subQuestions];
                                                newSubs[i].text = e.target.value;
                                                setEditingQuestion({
                                                    ...editingQuestion,
                                                    subQuestions: newSubs,
                                                });
                                            }}
                                            style={{ flex: 1 }}
                                            variant="outlined"
                                            size="small"
                                        />
                                        <TextField
                                            label="Marks"
                                            type="number"
                                            value={sq.marks}
                                            onChange={(e) => {
                                                const newSubs = [...editingQuestion.subQuestions];
                                                newSubs[i].marks = parseInt(e.target.value) || 0;
                                                setEditingQuestion({
                                                    ...editingQuestion,
                                                    subQuestions: newSubs,
                                                });
                                            }}
                                            style={{ width: 80 }}
                                            variant="outlined"
                                            size="small"
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveSubQuestion(i)}
                                            disabled={editingQuestion.subQuestions.length <= 1}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </div>
                                ))}
                                <Button
                                    size="small"
                                    startIcon={<Add />}
                                    onClick={handleAddSubQuestion}
                                >
                                    Add Sub-question
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select
                                        value={editingQuestion.difficulty}
                                        onChange={(e) => setEditingQuestion({
                                            ...editingQuestion,
                                            difficulty: e.target.value,
                                        })}
                                        label="Difficulty"
                                    >
                                        <MenuItem value="easy">Easy</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="hard">Hard</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Solution / Memo"
                                    value={editingQuestion.solution}
                                    onChange={(e) => setEditingQuestion({
                                        ...editingQuestion,
                                        solution: e.target.value,
                                    })}
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSaveQuestion}
                        variant="contained"
                        color="primary"
                        startIcon={<Save />}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AssessmentBuilder;
