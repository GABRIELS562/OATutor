/**
 * Assignment Creator Component
 * Create and manage assignments for students
 */

import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Switch,
    FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Icons
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import SendIcon from '@material-ui/icons/Send';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import SchoolIcon from '@material-ui/icons/School';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

// Simple Alert replacement component (Material-UI v4 doesn't have Alert in core)
const SimpleAlert = ({ severity, children, style }) => {
    const colors = {
        info: { bg: '#E3F2FD', border: '#90CAF9', text: '#1565C0' },
        warning: { bg: '#FFF3E0', border: '#FFCC80', text: '#E65100' },
        error: { bg: '#FDEDED', border: '#F5C6CB', text: '#721C24' },
        success: { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32' },
    };
    const c = colors[severity] || colors.info;
    return (
        <Box style={{
            padding: '12px 16px',
            borderRadius: 8,
            backgroundColor: c.bg,
            border: `1px solid ${c.border}`,
            color: c.text,
            ...style
        }}>
            <Typography variant="body2">{children}</Typography>
        </Box>
    );
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
    content: {
        padding: theme.spacing(3),
    },
    stepper: {
        backgroundColor: 'transparent',
        padding: theme.spacing(2, 0),
    },
    section: {
        marginBottom: theme.spacing(4),
    },
    sectionTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    textField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 10,
        },
    },
    problemList: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        maxHeight: 300,
        overflow: 'auto',
    },
    problemItem: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    emptyState: {
        padding: theme.spacing(4),
        textAlign: 'center',
        color: '#64748B',
    },
    selectedStudents: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: theme.spacing(2),
        marginTop: theme.spacing(4),
        paddingTop: theme.spacing(3),
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    },
    summaryCard: {
        backgroundColor: 'rgba(123, 47, 247, 0.04)',
        borderRadius: 12,
        padding: theme.spacing(3),
        border: '1px solid rgba(123, 47, 247, 0.1)',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1, 0),
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
}));

// Mock class/student data
const MOCK_CLASSES = [
    { id: 'class-12a', name: 'Grade 12A', students: 28 },
    { id: 'class-12b', name: 'Grade 12B', students: 25 },
    { id: 'class-11b', name: 'Grade 11B', students: 30 },
    { id: 'class-10c', name: 'Grade 10C', students: 32 },
];

const STEPS = ['Assignment Details', 'Select Problems', 'Assign to Students', 'Review & Publish'];

// Helper to format date for input
const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper to format date for display
const formatDateForDisplay = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const AssignmentCreator = ({ selectedProblems = [], onClearProblems }) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // Default due date: 1 week from now
    const defaultDueDate = formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    // Assignment state
    const [assignment, setAssignment] = useState({
        title: '',
        description: '',
        dueDate: defaultDueDate,
        problems: selectedProblems,
        selectedClasses: [],
        selectedStudents: [],
        settings: {
            allowHints: true,
            showSolutions: false,
            shuffleProblems: false,
            timeLimit: 0, // 0 = no limit
            attemptsAllowed: 3,
        },
    });

    const handleNext = () => {
        setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    const handleChange = (field) => (event) => {
        setAssignment((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleSettingChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setAssignment((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                [field]: value,
            },
        }));
    };

    const handleClassToggle = (classId) => {
        setAssignment((prev) => {
            const isSelected = prev.selectedClasses.includes(classId);
            return {
                ...prev,
                selectedClasses: isSelected
                    ? prev.selectedClasses.filter((id) => id !== classId)
                    : [...prev.selectedClasses, classId],
            };
        });
    };

    const handleRemoveProblem = (index) => {
        setAssignment((prev) => ({
            ...prev,
            problems: prev.problems.filter((_, i) => i !== index),
        }));
    };

    const handlePublish = () => {
        // In production, this would save to backend
        setShowSuccessDialog(true);
    };

    const getTotalStudents = () => {
        return assignment.selectedClasses.reduce((total, classId) => {
            const classData = MOCK_CLASSES.find((c) => c.id === classId);
            return total + (classData?.students || 0);
        }, 0);
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box className={classes.section}>
                        <Typography className={classes.sectionTitle}>
                            <SchoolIcon color="primary" />
                            Assignment Details
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    className={classes.textField}
                                    label="Assignment Title"
                                    variant="outlined"
                                    fullWidth
                                    value={assignment.title}
                                    onChange={handleChange('title')}
                                    placeholder="e.g., Chapter 5: Trigonometry Practice"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className={classes.textField}
                                    label="Description (Optional)"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={assignment.description}
                                    onChange={handleChange('description')}
                                    placeholder="Instructions or notes for students..."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.textField}
                                    label="Due Date"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    value={assignment.dueDate}
                                    onChange={handleChange('dueDate')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: formatDateForInput(new Date()),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.textField}
                                    label="Time Limit (minutes)"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    value={assignment.settings.timeLimit}
                                    onChange={handleSettingChange('timeLimit')}
                                    helperText="0 = No time limit"
                                    InputProps={{
                                        inputProps: { min: 0 },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box mt={4}>
                            <Typography className={classes.sectionTitle}>
                                <AccessTimeIcon color="primary" />
                                Assignment Settings
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={assignment.settings.allowHints}
                                                onChange={handleSettingChange('allowHints')}
                                                color="primary"
                                            />
                                        }
                                        label="Allow hints during assignment"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={assignment.settings.showSolutions}
                                                onChange={handleSettingChange('showSolutions')}
                                                color="primary"
                                            />
                                        }
                                        label="Show solutions after completion"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={assignment.settings.shuffleProblems}
                                                onChange={handleSettingChange('shuffleProblems')}
                                                color="primary"
                                            />
                                        }
                                        label="Shuffle problem order"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl variant="outlined" fullWidth size="small">
                                        <InputLabel>Attempts Allowed</InputLabel>
                                        <Select
                                            value={assignment.settings.attemptsAllowed}
                                            onChange={handleSettingChange('attemptsAllowed')}
                                            label="Attempts Allowed"
                                        >
                                            <MenuItem value={1}>1 attempt</MenuItem>
                                            <MenuItem value={2}>2 attempts</MenuItem>
                                            <MenuItem value={3}>3 attempts</MenuItem>
                                            <MenuItem value={5}>5 attempts</MenuItem>
                                            <MenuItem value={-1}>Unlimited</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                );

            case 1:
                return (
                    <Box className={classes.section}>
                        <Typography className={classes.sectionTitle}>
                            <SchoolIcon color="primary" />
                            Selected Problems ({assignment.problems.length})
                        </Typography>

                        {assignment.problems.length === 0 ? (
                            <Box className={classes.emptyState}>
                                <Typography variant="h6" gutterBottom>
                                    No problems selected
                                </Typography>
                                <Typography variant="body2">
                                    Use the Content Browser to add problems to this assignment
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    style={{ marginTop: 16 }}
                                >
                                    Browse Content
                                </Button>
                            </Box>
                        ) : (
                            <List className={classes.problemList}>
                                {assignment.problems.map((problem, index) => (
                                    <ListItem key={index} className={classes.problemItem}>
                                        <IconButton size="small" style={{ marginRight: 8, cursor: 'grab' }}>
                                            <DragIndicatorIcon />
                                        </IconButton>
                                        <ListItemText
                                            primary={problem.topic || problem.skill || `Problem ${index + 1}`}
                                            secondary={`Skill: ${problem.skill || 'General'}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                size="small"
                                                onClick={() => handleRemoveProblem(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        <SimpleAlert severity="info" style={{ marginTop: 16 }}>
                            Problems are pulled from the SA CAPS curriculum and automatically adapted for each student.
                        </SimpleAlert>
                    </Box>
                );

            case 2:
                return (
                    <Box className={classes.section}>
                        <Typography className={classes.sectionTitle}>
                            <SchoolIcon color="primary" />
                            Assign to Classes
                        </Typography>

                        <Grid container spacing={2}>
                            {MOCK_CLASSES.map((classData) => (
                                <Grid item xs={12} sm={6} key={classData.id}>
                                    <Paper
                                        variant="outlined"
                                        style={{
                                            padding: 16,
                                            borderRadius: 12,
                                            cursor: 'pointer',
                                            borderColor: assignment.selectedClasses.includes(classData.id)
                                                ? '#7B2FF7'
                                                : 'rgba(0, 0, 0, 0.12)',
                                            backgroundColor: assignment.selectedClasses.includes(classData.id)
                                                ? 'rgba(123, 47, 247, 0.04)'
                                                : 'transparent',
                                        }}
                                        onClick={() => handleClassToggle(classData.id)}
                                    >
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography style={{ fontWeight: 600 }}>
                                                    {classData.name}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {classData.students} students
                                                </Typography>
                                            </Box>
                                            {assignment.selectedClasses.includes(classData.id) && (
                                                <Chip label="Selected" color="primary" size="small" />
                                            )}
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        {assignment.selectedClasses.length > 0 && (
                            <Box mt={3}>
                                <Typography variant="body2" color="textSecondary">
                                    Total students: <strong>{getTotalStudents()}</strong>
                                </Typography>
                            </Box>
                        )}
                    </Box>
                );

            case 3:
                return (
                    <Box className={classes.section}>
                        <Typography className={classes.sectionTitle}>
                            <SchoolIcon color="primary" />
                            Review Assignment
                        </Typography>

                        <Box className={classes.summaryCard}>
                            <Box className={classes.summaryRow}>
                                <Typography color="textSecondary">Title</Typography>
                                <Typography style={{ fontWeight: 600 }}>
                                    {assignment.title || 'Untitled Assignment'}
                                </Typography>
                            </Box>
                            <Box className={classes.summaryRow}>
                                <Typography color="textSecondary">Due Date</Typography>
                                <Typography style={{ fontWeight: 600 }}>
                                    {formatDateForDisplay(assignment.dueDate)}
                                </Typography>
                            </Box>
                            <Box className={classes.summaryRow}>
                                <Typography color="textSecondary">Problems</Typography>
                                <Typography style={{ fontWeight: 600 }}>
                                    {assignment.problems.length} problems
                                </Typography>
                            </Box>
                            <Box className={classes.summaryRow}>
                                <Typography color="textSecondary">Assigned To</Typography>
                                <Typography style={{ fontWeight: 600 }}>
                                    {assignment.selectedClasses.length} classes ({getTotalStudents()} students)
                                </Typography>
                            </Box>
                            <Box className={classes.summaryRow}>
                                <Typography color="textSecondary">Time Limit</Typography>
                                <Typography style={{ fontWeight: 600 }}>
                                    {assignment.settings.timeLimit > 0
                                        ? `${assignment.settings.timeLimit} minutes`
                                        : 'No limit'}
                                </Typography>
                            </Box>
                            <Box className={classes.summaryRow}>
                                <Typography color="textSecondary">Hints Allowed</Typography>
                                <Typography style={{ fontWeight: 600 }}>
                                    {assignment.settings.allowHints ? 'Yes' : 'No'}
                                </Typography>
                            </Box>
                        </Box>

                        <SimpleAlert severity="warning" style={{ marginTop: 24 }}>
                            Once published, students will receive a notification and can begin working on this assignment.
                        </SimpleAlert>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Paper className={classes.paper} elevation={0}>
            {/* Header */}
            <Box className={classes.header}>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                    Create Assignment
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Build a custom assignment for your students
                </Typography>
            </Box>

            {/* Stepper */}
            <Box px={3}>
                <Stepper activeStep={activeStep} className={classes.stepper} alternativeLabel>
                    {STEPS.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <Divider />

            {/* Content */}
            <Box className={classes.content}>{renderStepContent()}</Box>

            {/* Action Buttons */}
            <Box className={classes.content}>
                <Box className={classes.actionButtons}>
                    <Button onClick={handleBack} disabled={activeStep === 0}>
                        Back
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<SaveIcon />}
                    >
                        Save Draft
                    </Button>
                    {activeStep < STEPS.length - 1 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SendIcon />}
                            onClick={handlePublish}
                        >
                            Publish Assignment
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
                <DialogTitle>Assignment Published</DialogTitle>
                <DialogContent>
                    <Typography>
                        Your assignment has been successfully published and sent to {getTotalStudents()} students.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSuccessDialog(false)} color="primary">
                        Create Another
                    </Button>
                    <Button
                        onClick={() => setShowSuccessDialog(false)}
                        color="primary"
                        variant="contained"
                    >
                        View Assignments
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AssignmentCreator;
