/**
 * QuizPage - AI-powered topic quizzes with instant feedback
 *
 * Features:
 * - Topic selection by grade
 * - AI-generated questions
 * - Instant grading with explanations
 * - Performance tracking
 */

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    Button,
    Radio,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    IconButton,
    LinearProgress,
    Chip,
} from '@material-ui/core';
import {
    ArrowBack,
    ArrowForward,
    PlayArrow,
    CheckCircle,
    Cancel,
    Timer,
    Refresh,
    EmojiEvents,
    School,
} from '@material-ui/icons';
import BrandLogoNav from '../../components/BrandLogoNav';
import QuizGeneratorService from '../../services/QuizGeneratorService';

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
    setupCard: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    formControl: {
        minWidth: 200,
        margin: theme.spacing(1),
    },
    topicGrid: {
        marginTop: theme.spacing(3),
    },
    topicChip: {
        margin: theme.spacing(0.5),
        cursor: 'pointer',
    },
    topicChipSelected: {
        backgroundColor: '#58CC02',
        color: 'white',
    },
    startButton: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(1.5, 4),
    },
    quizCard: {
        padding: theme.spacing(3),
    },
    progressBar: {
        marginBottom: theme.spacing(2),
    },
    questionNumber: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    questionText: {
        fontSize: '1.25rem',
        marginBottom: theme.spacing(3),
        lineHeight: 1.6,
    },
    optionCard: {
        marginBottom: theme.spacing(1),
        cursor: 'pointer',
        border: '2px solid transparent',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    optionSelected: {
        borderColor: '#58CC02',
        backgroundColor: 'rgba(88, 204, 2, 0.05)',
    },
    optionCorrect: {
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    optionIncorrect: {
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
    },
    navButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(3),
    },
    timer: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    resultsCard: {
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    scoreCircle: {
        width: 150,
        height: 150,
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
    },
    scoreHigh: {
        backgroundColor: '#e8f5e9',
        border: '4px solid #4caf50',
    },
    scoreMedium: {
        backgroundColor: '#fff3e0',
        border: '4px solid #ff9800',
    },
    scoreLow: {
        backgroundColor: '#ffebee',
        border: '4px solid #f44336',
    },
    scoreValue: {
        fontSize: '2.5rem',
        fontWeight: 700,
    },
    explanationSection: {
        marginTop: theme.spacing(3),
        textAlign: 'left',
    },
    explanationItem: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
    },
    loading: {
        padding: theme.spacing(6),
        textAlign: 'center',
    },
}));

const QuizPage = ({ history }) => {
    const classes = useStyles();

    // Setup state
    const [grade, setGrade] = useState(12);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [questionCount, setQuestionCount] = useState(10);

    // Quiz state
    const [quizState, setQuizState] = useState('setup'); // setup, loading, playing, review, results
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);

    // Get topics for selected grade
    const topics = QuizGeneratorService.getTopicsForGrade(grade);

    // Timer effect
    useEffect(() => {
        let interval;
        if (quizState === 'playing' && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleSubmitQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [quizState, timeRemaining]);

    // Start quiz
    const handleStartQuiz = async () => {
        if (!selectedTopic) return;

        setQuizState('loading');

        try {
            const result = await QuizGeneratorService.generateQuiz({
                topic: selectedTopic,
                grade,
                difficulty,
                questionCount,
            });

            setQuiz(result.quiz);
            setAnswers({});
            setCurrentQuestion(0);
            setTimeRemaining((result.quiz.timeLimit || 15) * 60);
            setQuizState('playing');

        } catch (error) {
            console.error('Quiz generation error:', error);
            setQuizState('setup');
        }
    };

    // Select answer
    const handleSelectAnswer = (questionId, answerId) => {
        if (showExplanation) return;

        setAnswers({
            ...answers,
            [questionId]: answerId,
        });
    };

    // Navigate questions
    const handleNextQuestion = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShowExplanation(false);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setShowExplanation(false);
        }
    };

    // Submit quiz
    const handleSubmitQuiz = () => {
        const quizResults = QuizGeneratorService.gradeQuiz(quiz, answers);
        setResults(quizResults);
        setQuizState('results');
    };

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Reset quiz
    const handleResetQuiz = () => {
        setQuiz(null);
        setAnswers({});
        setResults(null);
        setCurrentQuestion(0);
        setShowExplanation(false);
        setQuizState('setup');
    };

    // Render setup screen
    const renderSetup = () => (
        <Paper className={classes.setupCard}>
            <School style={{ fontSize: 60, color: '#58CC02', marginBottom: 16 }} />
            <Typography variant="h4" gutterBottom>
                Topic Quiz
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Test your knowledge with AI-generated questions
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel>Grade</InputLabel>
                        <Select
                            value={grade}
                            onChange={(e) => {
                                setGrade(e.target.value);
                                setSelectedTopic('');
                            }}
                            label="Grade"
                        >
                            <MenuItem value={10}>Grade 10</MenuItem>
                            <MenuItem value={11}>Grade 11</MenuItem>
                            <MenuItem value={12}>Grade 12</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel>Difficulty</InputLabel>
                        <Select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            label="Difficulty"
                        >
                            <MenuItem value="easy">Easy</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="hard">Hard</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel>Questions</InputLabel>
                        <Select
                            value={questionCount}
                            onChange={(e) => setQuestionCount(e.target.value)}
                            label="Questions"
                        >
                            <MenuItem value={5}>5 Questions</MenuItem>
                            <MenuItem value={10}>10 Questions</MenuItem>
                            <MenuItem value={15}>15 Questions</MenuItem>
                            <MenuItem value={20}>20 Questions</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Typography variant="subtitle2" style={{ marginTop: 24 }}>
                Select Topic:
            </Typography>
            <div className={classes.topicGrid}>
                {topics.map((topic) => (
                    <Chip
                        key={topic}
                        label={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`${classes.topicChip} ${selectedTopic === topic ? classes.topicChipSelected : ''}`}
                    />
                ))}
            </div>

            <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.startButton}
                onClick={handleStartQuiz}
                disabled={!selectedTopic}
                startIcon={<PlayArrow />}
            >
                Start Quiz
            </Button>
        </Paper>
    );

    // Render quiz
    const renderQuiz = () => {
        const question = quiz.questions[currentQuestion];
        const selectedAnswer = answers[question.id];

        return (
            <Paper className={classes.quizCard}>
                {/* Progress */}
                <div className={classes.progressBar}>
                    <LinearProgress
                        variant="determinate"
                        value={((currentQuestion + 1) / quiz.questions.length) * 100}
                    />
                </div>

                {/* Question header */}
                <div className={classes.questionNumber}>
                    <Typography variant="h6">
                        Question {currentQuestion + 1} of {quiz.questions.length}
                    </Typography>
                    <div className={classes.timer}>
                        <Timer />
                        <Typography variant="h6" color={timeRemaining < 60 ? 'error' : 'textPrimary'}>
                            {formatTime(timeRemaining)}
                        </Typography>
                    </div>
                </div>

                {/* Question */}
                <Typography className={classes.questionText}>
                    {question.question}
                </Typography>

                {/* Options */}
                {question.options.map((option) => {
                    let cardClass = classes.optionCard;
                    if (showExplanation) {
                        if (option.id === question.correctAnswer) {
                            cardClass += ` ${classes.optionCorrect}`;
                        } else if (option.id === selectedAnswer) {
                            cardClass += ` ${classes.optionIncorrect}`;
                        }
                    } else if (option.id === selectedAnswer) {
                        cardClass += ` ${classes.optionSelected}`;
                    }

                    return (
                        <Card
                            key={option.id}
                            className={cardClass}
                            onClick={() => handleSelectAnswer(question.id, option.id)}
                        >
                            <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                <Radio
                                    checked={selectedAnswer === option.id}
                                    value={option.id}
                                />
                                <Typography>
                                    <strong>{option.id}.</strong> {option.text}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}

                {/* Explanation */}
                {showExplanation && (
                    <Paper
                        style={{
                            padding: 16,
                            marginTop: 16,
                            backgroundColor: selectedAnswer === question.correctAnswer ? '#e8f5e9' : '#fff3e0',
                        }}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                        </Typography>
                        <Typography variant="body2">
                            {question.explanation}
                        </Typography>
                    </Paper>
                )}

                {/* Navigation */}
                <div className={classes.navButtons}>
                    <Button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestion === 0}
                        startIcon={<ArrowBack />}
                    >
                        Previous
                    </Button>

                    {!showExplanation && selectedAnswer && (
                        <Button
                            variant="outlined"
                            onClick={() => setShowExplanation(true)}
                        >
                            Check Answer
                        </Button>
                    )}

                    {currentQuestion < quiz.questions.length - 1 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNextQuestion}
                            endIcon={<ArrowForward />}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitQuiz}
                        >
                            Submit Quiz
                        </Button>
                    )}
                </div>
            </Paper>
        );
    };

    // Render results
    const renderResults = () => {
        const feedback = QuizGeneratorService.getPerformanceFeedback(results.percentage);
        const scoreClass = results.percentage >= 70
            ? classes.scoreHigh
            : results.percentage >= 40
                ? classes.scoreMedium
                : classes.scoreLow;

        return (
            <Paper className={classes.resultsCard}>
                <EmojiEvents style={{ fontSize: 60, color: '#ffd700', marginBottom: 16 }} />

                <div className={`${classes.scoreCircle} ${scoreClass}`}>
                    <Typography className={classes.scoreValue}>
                        {results.percentage}%
                    </Typography>
                    <Typography variant="body2">
                        {results.score}/{results.totalMarks}
                    </Typography>
                </div>

                <Typography variant="h4" gutterBottom>
                    {feedback.emoji} {feedback.message}
                </Typography>

                <Typography variant="body1" color="textSecondary" paragraph>
                    {feedback.suggestion}
                </Typography>

                <Grid container spacing={2} justifyContent="center" style={{ marginBottom: 24 }}>
                    <Grid item>
                        <Chip
                            icon={<CheckCircle />}
                            label={`${results.correct} Correct`}
                            style={{ backgroundColor: '#e8f5e9' }}
                        />
                    </Grid>
                    <Grid item>
                        <Chip
                            icon={<Cancel />}
                            label={`${results.incorrect} Incorrect`}
                            style={{ backgroundColor: '#ffebee' }}
                        />
                    </Grid>
                    {results.unanswered > 0 && (
                        <Grid item>
                            <Chip
                                label={`${results.unanswered} Unanswered`}
                            />
                        </Grid>
                    )}
                </Grid>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <Button
                        variant="outlined"
                        onClick={handleResetQuiz}
                        startIcon={<Refresh />}
                    >
                        New Quiz
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setQuizState('review')}
                    >
                        Review Answers
                    </Button>
                </div>
            </Paper>
        );
    };

    return (
        <div className={classes.root}>
            <BrandLogoNav />

            <Container className={classes.container} maxWidth="md">
                {/* Header */}
                <div className={classes.header}>
                    <IconButton
                        className={classes.backButton}
                        onClick={() => quizState === 'setup' ? history.goBack() : handleResetQuiz()}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" className={classes.title}>
                        {quiz ? quiz.title : 'Topic Quiz'}
                    </Typography>
                </div>

                {quizState === 'setup' && renderSetup()}

                {quizState === 'loading' && (
                    <div className={classes.loading}>
                        <LinearProgress />
                        <Typography style={{ marginTop: 16 }}>
                            Generating your quiz...
                        </Typography>
                    </div>
                )}

                {(quizState === 'playing' || quizState === 'review') && quiz && renderQuiz()}

                {quizState === 'results' && results && renderResults()}
            </Container>
        </div>
    );
};

export default QuizPage;
