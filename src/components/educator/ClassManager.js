/**
 * ClassManager - Manage classes, enrollments, and student groups
 * Create classes, add students, organize groups, and manage class settings
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Tooltip,
    InputAdornment,
    Snackbar,
} from '@material-ui/core';
import {
    Add,
    Delete,
    Group,
    Person,
    School,
    Search,
    PersonAdd,
    Settings,
    FileCopy,
    CheckCircle,
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(3),
        flexWrap: 'wrap',
        gap: theme.spacing(2),
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
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
    addButton: {
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
        },
    },
    classCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
        },
    },
    classHeader: {
        backgroundColor: '#1a237e',
        color: 'white',
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    className: {
        fontWeight: 600,
    },
    classGrade: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: '0.75rem',
    },
    classContent: {
        flex: 1,
        padding: theme.spacing(2),
    },
    classStat: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    classStatIcon: {
        color: '#666',
        fontSize: 20,
    },
    classActions: {
        borderTop: '1px solid rgba(0,0,0,0.08)',
        justifyContent: 'space-between',
    },
    joinCode: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: 'rgba(26, 35, 126, 0.05)',
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(1),
    },
    joinCodeText: {
        fontFamily: 'monospace',
        fontWeight: 600,
        color: '#1a237e',
        letterSpacing: 2,
    },
    dialogContent: {
        minWidth: 400,
    },
    formField: {
        marginBottom: theme.spacing(2),
    },
    studentList: {
        maxHeight: 300,
        overflow: 'auto',
    },
    studentChip: {
        margin: theme.spacing(0.5),
    },
    selectedStudents: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: 'rgba(26, 35, 126, 0.03)',
        borderRadius: theme.shape.borderRadius,
        minHeight: 50,
    },
    searchField: {
        marginBottom: theme.spacing(2),
    },
    emptyState: {
        textAlign: 'center',
        padding: theme.spacing(4),
        color: '#666',
    },
    emptyStateIcon: {
        fontSize: 60,
        color: '#ccc',
        marginBottom: theme.spacing(2),
    },
}));

// Mock data - in production, fetch from Supabase
const MOCK_CLASSES = [
    {
        id: '1',
        name: 'Grade 12A Mathematics',
        grade: 12,
        subject: 'Mathematics',
        joinCode: 'AT12A-2024',
        students: 28,
        avgMastery: 72,
        createdAt: '2024-01-15',
    },
    {
        id: '2',
        name: 'Grade 12B Mathematics',
        grade: 12,
        subject: 'Mathematics',
        joinCode: 'AT12B-2024',
        students: 25,
        avgMastery: 68,
        createdAt: '2024-01-15',
    },
    {
        id: '3',
        name: 'Grade 11A Mathematics',
        grade: 11,
        subject: 'Mathematics',
        joinCode: 'AT11A-2024',
        students: 30,
        avgMastery: 75,
        createdAt: '2024-01-20',
    },
];

const MOCK_STUDENTS = [
    { id: '1', name: 'Thabo Mokoena', email: 'thabo@school.co.za', grade: 12 },
    { id: '2', name: 'Lerato Nkosi', email: 'lerato@school.co.za', grade: 12 },
    { id: '3', name: 'Sipho Dlamini', email: 'sipho@school.co.za', grade: 12 },
    { id: '4', name: 'Ayanda Zulu', email: 'ayanda@school.co.za', grade: 12 },
    { id: '5', name: 'Nomvula Ndlovu', email: 'nomvula@school.co.za', grade: 11 },
    { id: '6', name: 'Bongani Mthembu', email: 'bongani@school.co.za', grade: 11 },
    { id: '7', name: 'Zanele Khumalo', email: 'zanele@school.co.za', grade: 11 },
    { id: '8', name: 'Mandla Sithole', email: 'mandla@school.co.za', grade: 12 },
];

const ClassManager = () => {
    const classes = useStyles();

    // State
    const [classList, setClassList] = useState(MOCK_CLASSES);
    const [allStudents] = useState(MOCK_STUDENTS);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showStudentDialog, setShowStudentDialog] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form state
    const [newClass, setNewClass] = useState({
        name: '',
        grade: 12,
        subject: 'Mathematics',
    });
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Generate join code
    const generateJoinCode = (grade) => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = `AT${grade}`;
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    // Create class
    const handleCreateClass = () => {
        if (!newClass.name.trim()) {
            setSnackbar({ open: true, message: 'Please enter a class name', severity: 'error' });
            return;
        }

        const createdClass = {
            id: Date.now().toString(),
            ...newClass,
            joinCode: generateJoinCode(newClass.grade),
            students: 0,
            avgMastery: 0,
            createdAt: new Date().toISOString().split('T')[0],
        };

        setClassList([...classList, createdClass]);
        setShowCreateDialog(false);
        setNewClass({ name: '', grade: 12, subject: 'Mathematics' });
        setSnackbar({ open: true, message: 'Class created successfully!', severity: 'success' });
    };

    // Delete class
    const handleDeleteClass = (classId) => {
        if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            setClassList(classList.filter(c => c.id !== classId));
            setSnackbar({ open: true, message: 'Class deleted', severity: 'info' });
        }
    };

    // Copy join code
    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setSnackbar({ open: true, message: 'Join code copied to clipboard!', severity: 'success' });
    };

    // Add students to class
    const handleAddStudents = () => {
        if (selectedStudents.length === 0) {
            setSnackbar({ open: true, message: 'Please select at least one student', severity: 'error' });
            return;
        }

        // Update class student count
        setClassList(classList.map(c => {
            if (c.id === selectedClass.id) {
                return { ...c, students: c.students + selectedStudents.length };
            }
            return c;
        }));

        setShowStudentDialog(false);
        setSelectedStudents([]);
        setSnackbar({ open: true, message: `${selectedStudents.length} students added to ${selectedClass.name}`, severity: 'success' });
    };

    // Toggle student selection
    const toggleStudent = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    // Filter students by search
    const filteredStudents = allStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={classes.root}>
            {/* Header */}
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <Group className={classes.headerIcon} />
                    <div>
                        <Typography variant="h5" className={classes.title}>
                            Class Manager
                        </Typography>
                        <Typography variant="body2" className={classes.subtitle}>
                            Create and manage your classes
                        </Typography>
                    </div>
                </div>

                <Button
                    variant="contained"
                    className={classes.addButton}
                    startIcon={<Add />}
                    onClick={() => setShowCreateDialog(true)}
                >
                    Create Class
                </Button>
            </div>

            {/* Classes Grid */}
            {classList.length === 0 ? (
                <Paper className={classes.emptyState}>
                    <School className={classes.emptyStateIcon} />
                    <Typography variant="h6" gutterBottom>
                        No classes yet
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                        Create your first class to start tracking student progress
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setShowCreateDialog(true)}
                    >
                        Create Class
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {classList.map(classItem => (
                        <Grid item xs={12} sm={6} md={4} key={classItem.id}>
                            <Card className={classes.classCard}>
                                <div className={classes.classHeader}>
                                    <Typography className={classes.className}>
                                        {classItem.name}
                                    </Typography>
                                    <span className={classes.classGrade}>
                                        Grade {classItem.grade}
                                    </span>
                                </div>

                                <CardContent className={classes.classContent}>
                                    <div className={classes.classStat}>
                                        <Person className={classes.classStatIcon} />
                                        <Typography variant="body2">
                                            {classItem.students} students enrolled
                                        </Typography>
                                    </div>
                                    <div className={classes.classStat}>
                                        <CheckCircle className={classes.classStatIcon} />
                                        <Typography variant="body2">
                                            {classItem.avgMastery}% average mastery
                                        </Typography>
                                    </div>
                                    <div className={classes.classStat}>
                                        <School className={classes.classStatIcon} />
                                        <Typography variant="body2">
                                            {classItem.subject}
                                        </Typography>
                                    </div>

                                    <div className={classes.joinCode}>
                                        <Typography variant="caption" color="textSecondary">
                                            Join Code:
                                        </Typography>
                                        <Typography className={classes.joinCodeText}>
                                            {classItem.joinCode}
                                        </Typography>
                                        <Tooltip title="Copy code">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCopyCode(classItem.joinCode)}
                                            >
                                                <FileCopy fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </CardContent>

                                <CardActions className={classes.classActions}>
                                    <Button
                                        size="small"
                                        startIcon={<PersonAdd />}
                                        onClick={() => {
                                            setSelectedClass(classItem);
                                            setShowStudentDialog(true);
                                        }}
                                    >
                                        Add Students
                                    </Button>
                                    <div>
                                        <Tooltip title="Class settings">
                                            <IconButton size="small">
                                                <Settings />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete class">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteClass(classItem.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Class Dialog */}
            <Dialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Create New Class</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <TextField
                        fullWidth
                        label="Class Name"
                        variant="outlined"
                        value={newClass.name}
                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                        className={classes.formField}
                        placeholder="e.g., Grade 12A Mathematics"
                    />

                    <FormControl fullWidth variant="outlined" className={classes.formField}>
                        <InputLabel>Grade</InputLabel>
                        <Select
                            value={newClass.grade}
                            onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                            label="Grade"
                        >
                            <MenuItem value={10}>Grade 10</MenuItem>
                            <MenuItem value={11}>Grade 11</MenuItem>
                            <MenuItem value={12}>Grade 12</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth variant="outlined" className={classes.formField}>
                        <InputLabel>Subject</InputLabel>
                        <Select
                            value={newClass.subject}
                            onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                            label="Subject"
                        >
                            <MenuItem value="Mathematics">Mathematics</MenuItem>
                            <MenuItem value="Mathematical Literacy">Mathematical Literacy</MenuItem>
                            <MenuItem value="Physical Sciences">Physical Sciences</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCreateDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateClass}
                    >
                        Create Class
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Students Dialog */}
            <Dialog
                open={showStudentDialog}
                onClose={() => {
                    setShowStudentDialog(false);
                    setSelectedStudents([]);
                    setSearchQuery('');
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Add Students to {selectedClass?.name}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={classes.searchField}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {selectedStudents.length > 0 && (
                        <div className={classes.selectedStudents}>
                            {selectedStudents.map(id => {
                                const student = allStudents.find(s => s.id === id);
                                return (
                                    <Chip
                                        key={id}
                                        label={student?.name}
                                        onDelete={() => toggleStudent(id)}
                                        size="small"
                                        color="primary"
                                    />
                                );
                            })}
                        </div>
                    )}

                    <List className={classes.studentList}>
                        {filteredStudents.map(student => (
                            <ListItem
                                key={student.id}
                                button
                                onClick={() => toggleStudent(student.id)}
                                dense
                            >
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: '#1a237e' }}>
                                        {student.name.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={student.name}
                                    secondary={`${student.email} • Grade ${student.grade}`}
                                />
                                <ListItemSecondaryAction>
                                    <Checkbox
                                        edge="end"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => toggleStudent(student.id)}
                                        color="primary"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowStudentDialog(false);
                        setSelectedStudents([]);
                        setSearchQuery('');
                    }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddStudents}
                        disabled={selectedStudents.length === 0}
                    >
                        Add {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ClassManager;
