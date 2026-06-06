/**
 * Angelo Tutoring - Mock Test Page
 * Timed practice tests for exam preparation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Box,
    IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Timer as TimerIcon,
    PlayArrow as StartIcon,
    Stop as StopIcon,
    Assessment as ResultsIcon,
    School as SubjectIcon,
    ArrowBack as BackIcon,
} from '@material-ui/icons';
import { useGamification } from '../../util/GamificationContext';
import { useLocalization } from '../../util/LocalizationContext';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)',
    },
    header: {
        marginBottom: theme.spacing(4),
        textAlign: 'center',
    },
    title: {
        fontWeight: 700,
        color: '#58CC02',
        marginBottom: theme.spacing(1),
    },
    subtitle: {
        color: theme.palette.text.secondary,
    },
    testCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        transition: 'all 0.3s ease',
        border: '1px solid rgba(88, 204, 2, 0.1)',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(88, 204, 2, 0.15)',
        },
    },
    cardHeader: {
        background: '#58CC02',
        color: 'white',
        padding: theme.spacing(2),
        borderRadius: '16px 16px 0 0',
    },
    cardContent: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    timerDisplay: {
        fontSize: '3rem',
        fontWeight: 700,
        textAlign: 'center',
        fontFamily: 'monospace',
        color: '#58CC02',
    },
    timerWarning: {
        color: '#F59E0B',
    },
    timerDanger: {
        color: '#FF4B4B',
    },
    progressSection: {
        marginTop: theme.spacing(3),
    },
    questionCounter: {
        textAlign: 'center',
        marginBottom: theme.spacing(2),
    },
    resultCard: {
        textAlign: 'center',
        padding: theme.spacing(4),
    },
    scoreCircle: {
        width: 150,
        height: 150,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        marginBottom: theme.spacing(3),
        background: '#58CC02',
        color: 'white',
        boxShadow: '0 6px 0 0 #58A700',
    },
    scoreText: {
        fontSize: '2.5rem',
        fontWeight: 700,
    },
    statItem: {
        padding: theme.spacing(2),
        textAlign: 'center',
        borderRadius: 12,
        background: 'rgba(88, 204, 2, 0.05)',
    },
    backButton: {
        marginBottom: theme.spacing(2),
    },
}));

// Test configurations
const TEST_CONFIGS = [
    {
        id: 'quick',
        name: 'Quick Quiz',
        description: 'A fast 5-question test to warm up',
        questions: 5,
        timeMinutes: 10,
        subjects: ['all'],
        icon: '⚡',
        difficulty: 'Mixed',
    },
    {
        id: 'maths-short',
        name: 'Maths Sprint',
        description: 'Quick maths practice - algebra, functions, calculus',
        questions: 10,
        timeMinutes: 20,
        subjects: ['maths'],
        icon: '📐',
        difficulty: 'Mixed',
    },
    {
        id: 'science-short',
        name: 'Science Sprint',
        description: 'Quick science practice - physics, chemistry, biology',
        questions: 10,
        timeMinutes: 20,
        subjects: ['science'],
        icon: '🔬',
        difficulty: 'Mixed',
    },
    {
        id: 'full-maths',
        name: 'Full Maths Test',
        description: 'Comprehensive maths test covering all topics',
        questions: 25,
        timeMinutes: 60,
        subjects: ['maths'],
        icon: '📊',
        difficulty: 'Exam-style',
    },
    {
        id: 'full-science',
        name: 'Full Science Test',
        description: 'Comprehensive science test - all three sciences',
        questions: 25,
        timeMinutes: 60,
        subjects: ['science'],
        icon: '🧪',
        difficulty: 'Exam-style',
    },
    {
        id: 'nsc-prep',
        name: 'NSC Exam Prep',
        description: 'Full mock exam experience with all subjects',
        questions: 30,
        timeMinutes: 90,
        subjects: ['all'],
        icon: '🎓',
        difficulty: 'NSC Level',
    },
];

const MockTestPage = () => {
    const classes = useStyles();
    const history = useHistory();
    const { addXP, recordProblemAttempt } = useGamification();

    const localization = useLocalization();
    const translate = localization?.translate || ((key) => {
        const fallbacks = {
            'mockTest.title': 'Mock Tests',
            'mockTest.subtitle': 'Practice under exam conditions with timed tests',
            'mockTest.questions': 'Questions',
            'mockTest.min': 'min',
            'mockTest.startTest': 'Start Test',
            'mockTest.endTest': 'End Test',
            'mockTest.questionOf': 'Question {current} of {total}',
            'mockTest.correctAnswer': 'Correct Answer',
            'mockTest.wrongAnswer': 'Wrong Answer',
            'mockTest.endTestEarly': 'End Test Early?',
            'mockTest.questionsRemaining': 'You have {count} questions remaining. Are you sure you want to end the test now?',
            'mockTest.continueTest': 'Continue Test',
            'mockTest.testComplete': 'Test Complete!',
            'mockTest.correct': 'Correct',
            'mockTest.incorrect': 'Incorrect',
            'mockTest.timeUsed': 'Time Used',
            'mockTest.bonusXP': 'Bonus XP',
            'mockTest.greatJob': "Great job! You're well prepared!",
            'mockTest.goodEffort': 'Good effort! Keep practicing!',
            'mockTest.reviewTopics': 'Review the topics and try again!',
            'mockTest.takeAnotherTest': 'Take Another Test',
            'mockTest.viewDashboard': 'View Dashboard',
        };
        return fallbacks[key] || key.split('.').pop();
    });

    // State
    const [selectedTest, setSelectedTest] = useState(null);
    const [testState, setTestState] = useState('select'); // select, running, results
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState(null);
    const [showConfirmEnd, setShowConfirmEnd] = useState(false);

    // Timer effect
    useEffect(() => {
        let timer;
        if (testState === 'running' && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        endTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [testState, timeRemaining]);

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Get timer class based on time remaining
    const getTimerClass = () => {
        if (!selectedTest) return classes.timerDisplay;
        const totalSeconds = selectedTest.timeMinutes * 60;
        const percentRemaining = (timeRemaining / totalSeconds) * 100;

        if (percentRemaining <= 10) return `${classes.timerDisplay} ${classes.timerDanger}`;
        if (percentRemaining <= 25) return `${classes.timerDisplay} ${classes.timerWarning}`;
        return classes.timerDisplay;
    };

    // Start test
    const startTest = (config) => {
        setSelectedTest(config);
        setTimeRemaining(config.timeMinutes * 60);
        setCurrentQuestion(0);
        setAnswers([]);
        setTestState('running');
    };

    // Record answer
    const recordAnswer = useCallback((isCorrect, timeSpent = 0) => {
        setAnswers(prev => [...prev, { isCorrect, timeSpent }]);

        // Record for gamification
        recordProblemAttempt({
            isCorrect,
            hintsUsed: 0, // No hints in test mode
            attempts: 1,
            timeSeconds: timeSpent,
            knowledgeComponents: ['mock-test'],
        });

        if (currentQuestion + 1 >= selectedTest.questions) {
            endTest();
        } else {
            setCurrentQuestion(prev => prev + 1);
        }
    }, [currentQuestion, selectedTest, recordProblemAttempt]);

    // End test
    const endTest = useCallback(() => {
        const correctCount = answers.filter(a => a.isCorrect).length;
        const totalQuestions = selectedTest?.questions || answers.length;
        const score = Math.round((correctCount / totalQuestions) * 100);
        const totalTime = selectedTest ? (selectedTest.timeMinutes * 60 - timeRemaining) : 0;

        // Calculate bonus XP
        let bonusXP = 0;
        if (score >= 90) bonusXP = 50;
        else if (score >= 80) bonusXP = 30;
        else if (score >= 70) bonusXP = 20;
        else if (score >= 60) bonusXP = 10;

        if (bonusXP > 0) {
            addXP(bonusXP, 'mock_test_bonus');
        }

        setResults({
            score,
            correctCount,
            totalQuestions,
            totalTime,
            bonusXP,
            testName: selectedTest?.name,
        });
        setTestState('results');
    }, [answers, selectedTest, timeRemaining, addXP]);

    // Reset to test selection
    const resetTest = () => {
        setSelectedTest(null);
        setTestState('select');
        setTimeRemaining(0);
        setCurrentQuestion(0);
        setAnswers([]);
        setResults(null);
    };

    // Render test selection
    const renderTestSelection = () => (
        <>
            <Box className={classes.header}>
                <Typography variant="h3" className={classes.title}>
                    {translate('mockTest.title')}
                </Typography>
                <Typography variant="h6" className={classes.subtitle}>
                    {translate('mockTest.subtitle')}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {TEST_CONFIGS.map((config) => (
                    <Grid item xs={12} sm={6} md={4} key={config.id}>
                        <Card className={classes.testCard}>
                            <Box className={classes.cardHeader}>
                                <Typography variant="h4" style={{ marginBottom: 8 }}>
                                    {config.icon}
                                </Typography>
                                <Typography variant="h6">
                                    {config.name}
                                </Typography>
                            </Box>
                            <CardContent className={classes.cardContent}>
                                <Typography variant="body2" color="textSecondary" paragraph>
                                    {config.description}
                                </Typography>
                                <Box mb={2}>
                                    <Chip
                                        size="small"
                                        icon={<SubjectIcon />}
                                        label={`${config.questions} ${translate('mockTest.questions')}`}
                                        className={classes.chip}
                                    />
                                    <Chip
                                        size="small"
                                        icon={<TimerIcon />}
                                        label={`${config.timeMinutes} ${translate('mockTest.min')}`}
                                        className={classes.chip}
                                    />
                                </Box>
                                <Chip
                                    size="small"
                                    label={config.difficulty}
                                    color="primary"
                                    variant="outlined"
                                />
                            </CardContent>
                            <CardActions style={{ padding: 16 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<StartIcon />}
                                    onClick={() => startTest(config)}
                                >
                                    {translate('mockTest.startTest')}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );

    // Render active test
    const renderActiveTest = () => (
        <Paper style={{ padding: 24, borderRadius: 16 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">
                    {selectedTest?.icon} {selectedTest?.name}
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<StopIcon />}
                    onClick={() => setShowConfirmEnd(true)}
                >
                    {translate('mockTest.endTest')}
                </Button>
            </Box>

            <Box className={getTimerClass()}>
                {formatTime(timeRemaining)}
            </Box>

            <Box className={classes.progressSection}>
                <Typography className={classes.questionCounter}>
                    {translate('mockTest.questionOf').replace('{current}', currentQuestion + 1).replace('{total}', selectedTest?.questions)}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={((currentQuestion + 1) / selectedTest?.questions) * 100}
                    style={{ height: 10, borderRadius: 5 }}
                />
            </Box>

            <Box mt={4} textAlign="center">
                <Typography variant="body1" color="textSecondary" paragraph>
                    Problems will load from your course content here.
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                    For now, simulate answering:
                </Typography>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => recordAnswer(true, Math.floor(Math.random() * 60) + 30)}
                        style={{ marginRight: 16 }}
                    >
                        {translate('mockTest.correctAnswer')}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => recordAnswer(false, Math.floor(Math.random() * 60) + 30)}
                    >
                        {translate('mockTest.wrongAnswer')}
                    </Button>
                </Box>
            </Box>

            {/* Confirm End Dialog */}
            <Dialog open={showConfirmEnd} onClose={() => setShowConfirmEnd(false)}>
                <DialogTitle>{translate('mockTest.endTestEarly')}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {translate('mockTest.questionsRemaining').replace('{count}', selectedTest?.questions - currentQuestion)}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmEnd(false)}>
                        {translate('mockTest.continueTest')}
                    </Button>
                    <Button onClick={() => { setShowConfirmEnd(false); endTest(); }} color="secondary">
                        {translate('mockTest.endTest')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );

    // Render results
    const renderResults = () => (
        <Paper className={classes.resultCard}>
            <Typography variant="h4" gutterBottom>
                {translate('mockTest.testComplete')}
            </Typography>

            <Box className={classes.scoreCircle}>
                <Typography className={classes.scoreText}>
                    {results?.score}%
                </Typography>
            </Box>

            <Typography variant="h5" gutterBottom>
                {results?.testName}
            </Typography>

            <Grid container spacing={3} style={{ marginTop: 24, marginBottom: 24 }}>
                <Grid item xs={6} sm={3}>
                    <Box className={classes.statItem}>
                        <Typography variant="h4" color="primary">
                            {results?.correctCount}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {translate('mockTest.correct')}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Box className={classes.statItem}>
                        <Typography variant="h4" color="secondary">
                            {results?.totalQuestions - results?.correctCount}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {translate('mockTest.incorrect')}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Box className={classes.statItem}>
                        <Typography variant="h4">
                            {Math.floor(results?.totalTime / 60)}:{(results?.totalTime % 60).toString().padStart(2, '0')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {translate('mockTest.timeUsed')}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Box className={classes.statItem}>
                        <Typography variant="h4" style={{ color: '#10B981' }}>
                            +{results?.bonusXP}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {translate('mockTest.bonusXP')}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {results?.score >= 80 && (
                <Chip
                    label={translate('mockTest.greatJob')}
                    color="primary"
                    style={{ marginBottom: 24 }}
                />
            )}
            {results?.score >= 60 && results?.score < 80 && (
                <Chip
                    label={translate('mockTest.goodEffort')}
                    style={{ marginBottom: 24, backgroundColor: '#F59E0B', color: 'white' }}
                />
            )}
            {results?.score < 60 && (
                <Chip
                    label={translate('mockTest.reviewTopics')}
                    color="secondary"
                    style={{ marginBottom: 24 }}
                />
            )}

            <Box mt={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={resetTest}
                    startIcon={<ResultsIcon />}
                    style={{ marginRight: 16 }}
                >
                    {translate('mockTest.takeAnotherTest')}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => history.push('/dashboard')}
                >
                    {translate('mockTest.viewDashboard')}
                </Button>
            </Box>
        </Paper>
    );

    return (
        <Container maxWidth="lg" className={classes.root}>
            <IconButton
                className={classes.backButton}
                onClick={() => history.push('/')}
            >
                <BackIcon /> Back to Home
            </IconButton>

            {testState === 'select' && renderTestSelection()}
            {testState === 'running' && renderActiveTest()}
            {testState === 'results' && renderResults()}
        </Container>
    );
};

export default MockTestPage;
