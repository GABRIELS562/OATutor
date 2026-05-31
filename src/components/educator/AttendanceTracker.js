/**
 * AttendanceTracker - EduRegister-style attendance tracking
 * Quick daily attendance with stats and reporting
 */

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    LinearProgress,
    Tooltip,
} from '@material-ui/core';
import {
    Today,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Cancel,
    Schedule,
    GetApp,
    Notes,
    Warning,
} from '@material-ui/icons';
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
    dateNavigation: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
    dateDisplay: {
        minWidth: 200,
        textAlign: 'center',
    },
    statsRow: {
        display: 'flex',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(3),
        flexWrap: 'wrap',
    },
    statCard: {
        flex: '1 1 auto',
        minWidth: 120,
        padding: theme.spacing(2),
        textAlign: 'center',
        borderRadius: theme.shape.borderRadius,
    },
    statPresent: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderLeft: '4px solid #4caf50',
    },
    statAbsent: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderLeft: '4px solid #f44336',
    },
    statLate: {
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderLeft: '4px solid #ff9800',
    },
    statTotal: {
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        borderLeft: '4px solid #1a237e',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 600,
    },
    statLabel: {
        fontSize: '0.75rem',
        color: '#666',
        textTransform: 'uppercase',
    },
    tableContainer: {
        marginBottom: theme.spacing(3),
    },
    studentRow: {
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.02)',
        },
    },
    studentInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
    },
    studentAvatar: {
        backgroundColor: '#1a237e',
    },
    statusButton: {
        minWidth: 40,
        height: 40,
        borderRadius: '50%',
        margin: theme.spacing(0, 0.5),
    },
    statusPresent: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        color: '#4caf50',
        '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
        },
    },
    statusPresentActive: {
        backgroundColor: '#4caf50',
        color: 'white',
        '&:hover': {
            backgroundColor: '#388e3c',
        },
    },
    statusAbsent: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        color: '#f44336',
        '&:hover': {
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
        },
    },
    statusAbsentActive: {
        backgroundColor: '#f44336',
        color: 'white',
        '&:hover': {
            backgroundColor: '#d32f2f',
        },
    },
    statusLate: {
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        color: '#ff9800',
        '&:hover': {
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
        },
    },
    statusLateActive: {
        backgroundColor: '#ff9800',
        color: 'white',
        '&:hover': {
            backgroundColor: '#f57c00',
        },
    },
    notesField: {
        width: 150,
    },
    attendanceRateBadge: {
        marginLeft: theme.spacing(1),
    },
    lowAttendance: {
        color: '#f44336',
    },
    actionsBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quickActions: {
        display: 'flex',
        gap: theme.spacing(1),
    },
}));

// Mock student data (would come from database)
const MOCK_STUDENTS = [
    { id: 1, name: 'Thabo Mokoena', grade: 12 },
    { id: 2, name: 'Lindiwe Ndlovu', grade: 12 },
    { id: 3, name: 'Sipho Mthembu', grade: 12 },
    { id: 4, name: 'Nomvula Dlamini', grade: 12 },
    { id: 5, name: 'Kagiso Molefe', grade: 12 },
    { id: 6, name: 'Zanele Khumalo', grade: 12 },
    { id: 7, name: 'Bongani Nkosi', grade: 12 },
    { id: 8, name: 'Palesa Maseko', grade: 12 },
];

const AttendanceTracker = ({ className = 'Grade 12A Mathematics' }) => {
    const classes = useStyles();

    // State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [students] = useState(MOCK_STUDENTS);
    const [attendance, setAttendance] = useState({});
    const [notes, setNotes] = useState({});
    const [studentStats, setStudentStats] = useState({});
    const [notesDialogOpen, setNotesDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Format date
    const formatDate = (date) => {
        return date.toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateKey = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Navigate dates
    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    // Load attendance for date
    useEffect(() => {
        const dateKey = formatDateKey(selectedDate);
        // In real app, load from database
        // For demo, use local storage
        const savedAttendance = localStorage.getItem(`attendance-${dateKey}`);
        if (savedAttendance) {
            setAttendance(JSON.parse(savedAttendance));
        } else {
            setAttendance({});
        }

        const savedNotes = localStorage.getItem(`attendance-notes-${dateKey}`);
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        } else {
            setNotes({});
        }

        // Calculate student stats (mock)
        const stats = {};
        students.forEach(s => {
            stats[s.id] = {
                attendanceRate: Math.random() * 0.3 + 0.7, // 70-100%
                daysPresent: Math.floor(Math.random() * 20) + 10,
                daysAbsent: Math.floor(Math.random() * 5),
            };
        });
        setStudentStats(stats);
    }, [selectedDate, students]);

    // Save attendance
    const saveAttendance = (studentId, status) => {
        const newAttendance = { ...attendance, [studentId]: status };
        setAttendance(newAttendance);

        // Save to localStorage (would be database in real app)
        const dateKey = formatDateKey(selectedDate);
        localStorage.setItem(`attendance-${dateKey}`, JSON.stringify(newAttendance));
    };

    // Save notes
    const saveNotes = (studentId, noteText) => {
        const newNotes = { ...notes, [studentId]: noteText };
        setNotes(newNotes);

        const dateKey = formatDateKey(selectedDate);
        localStorage.setItem(`attendance-notes-${dateKey}`, JSON.stringify(newNotes));
    };

    // Mark all present
    const markAllPresent = () => {
        const allPresent = {};
        students.forEach(s => {
            allPresent[s.id] = 'present';
        });
        setAttendance(allPresent);

        const dateKey = formatDateKey(selectedDate);
        localStorage.setItem(`attendance-${dateKey}`, JSON.stringify(allPresent));
    };

    // Calculate stats
    const stats = {
        present: Object.values(attendance).filter(s => s === 'present').length,
        absent: Object.values(attendance).filter(s => s === 'absent').length,
        late: Object.values(attendance).filter(s => s === 'late').length,
        total: students.length,
        unmarked: students.length - Object.keys(attendance).length,
    };

    // Export report
    const handleExportReport = async () => {
        const attendanceData = students.map(student => ({
            studentName: student.name,
            date: formatDateKey(selectedDate),
            status: attendance[student.id] || 'unmarked',
            notes: notes[student.id] || '',
        }));

        await ReportExportService.exportAttendanceReport(
            attendanceData,
            { name: className },
            { start: formatDateKey(selectedDate), end: formatDateKey(selectedDate) }
        );
    };

    // Open notes dialog
    const handleOpenNotes = (student) => {
        setSelectedStudent(student);
        setNotesDialogOpen(true);
    };

    // Get status button class
    const getStatusButtonClass = (studentId, status) => {
        const currentStatus = attendance[studentId];
        switch (status) {
            case 'present':
                return currentStatus === 'present' ? classes.statusPresentActive : classes.statusPresent;
            case 'absent':
                return currentStatus === 'absent' ? classes.statusAbsentActive : classes.statusAbsent;
            case 'late':
                return currentStatus === 'late' ? classes.statusLateActive : classes.statusLate;
            default:
                return '';
        }
    };

    return (
        <div className={classes.root}>
            {/* Header */}
            <div className={classes.header}>
                <Today className={classes.headerIcon} />
                <div>
                    <Typography variant="h5" className={classes.title}>
                        Attendance Tracker
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {className}
                    </Typography>
                </div>
            </div>

            {/* Date Navigation */}
            <div className={classes.dateNavigation}>
                <IconButton onClick={goToPreviousDay}>
                    <ChevronLeft />
                </IconButton>
                <div className={classes.dateDisplay}>
                    <Typography variant="h6">
                        {formatDate(selectedDate)}
                    </Typography>
                    {formatDateKey(selectedDate) !== formatDateKey(new Date()) && (
                        <Button size="small" onClick={goToToday}>
                            Go to Today
                        </Button>
                    )}
                </div>
                <IconButton onClick={goToNextDay}>
                    <ChevronRight />
                </IconButton>
            </div>

            {/* Stats Row */}
            <div className={classes.statsRow}>
                <Paper className={`${classes.statCard} ${classes.statPresent}`} elevation={0}>
                    <Typography className={classes.statValue} style={{ color: '#4caf50' }}>
                        {stats.present}
                    </Typography>
                    <Typography className={classes.statLabel}>Present</Typography>
                </Paper>
                <Paper className={`${classes.statCard} ${classes.statAbsent}`} elevation={0}>
                    <Typography className={classes.statValue} style={{ color: '#f44336' }}>
                        {stats.absent}
                    </Typography>
                    <Typography className={classes.statLabel}>Absent</Typography>
                </Paper>
                <Paper className={`${classes.statCard} ${classes.statLate}`} elevation={0}>
                    <Typography className={classes.statValue} style={{ color: '#ff9800' }}>
                        {stats.late}
                    </Typography>
                    <Typography className={classes.statLabel}>Late</Typography>
                </Paper>
                <Paper className={`${classes.statCard} ${classes.statTotal}`} elevation={0}>
                    <Typography className={classes.statValue} style={{ color: '#1a237e' }}>
                        {Math.round((stats.present / stats.total) * 100)}%
                    </Typography>
                    <Typography className={classes.statLabel}>Attendance Rate</Typography>
                </Paper>
            </div>

            {/* Quick Actions */}
            <div className={classes.actionsBar}>
                <div className={classes.quickActions}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={markAllPresent}
                    >
                        Mark All Present
                    </Button>
                    {stats.unmarked > 0 && (
                        <Chip
                            size="small"
                            icon={<Warning />}
                            label={`${stats.unmarked} unmarked`}
                            color="secondary"
                        />
                    )}
                </div>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<GetApp />}
                    onClick={handleExportReport}
                >
                    Export Report
                </Button>
            </div>

            {/* Attendance Table */}
            <TableContainer component={Paper} className={classes.tableContainer} style={{ marginTop: 16 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Student</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Attendance Rate</TableCell>
                            <TableCell>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id} className={classes.studentRow}>
                                <TableCell>
                                    <div className={classes.studentInfo}>
                                        <Avatar className={classes.studentAvatar}>
                                            {student.name.charAt(0)}
                                        </Avatar>
                                        <div>
                                            <Typography variant="body1">
                                                {student.name}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Grade {student.grade}
                                            </Typography>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Present">
                                        <IconButton
                                            className={`${classes.statusButton} ${getStatusButtonClass(student.id, 'present')}`}
                                            onClick={() => saveAttendance(student.id, 'present')}
                                        >
                                            <CheckCircle />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Absent">
                                        <IconButton
                                            className={`${classes.statusButton} ${getStatusButtonClass(student.id, 'absent')}`}
                                            onClick={() => saveAttendance(student.id, 'absent')}
                                        >
                                            <Cancel />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Late">
                                        <IconButton
                                            className={`${classes.statusButton} ${getStatusButtonClass(student.id, 'late')}`}
                                            onClick={() => saveAttendance(student.id, 'late')}
                                        >
                                            <Schedule />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                    {studentStats[student.id] && (
                                        <div>
                                            <Typography
                                                variant="body2"
                                                className={studentStats[student.id].attendanceRate < 0.8 ? classes.lowAttendance : ''}
                                            >
                                                {Math.round(studentStats[student.id].attendanceRate * 100)}%
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={studentStats[student.id].attendanceRate * 100}
                                                style={{ height: 4, borderRadius: 2 }}
                                            />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            placeholder="Add note..."
                                            value={notes[student.id] || ''}
                                            onChange={(e) => saveNotes(student.id, e.target.value)}
                                            className={classes.notesField}
                                        />
                                        <Tooltip title="View History">
                                            <IconButton size="small" onClick={() => handleOpenNotes(student)}>
                                                <Notes />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Notes Dialog */}
            <Dialog
                open={notesDialogOpen}
                onClose={() => setNotesDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedStudent?.name} - Attendance History
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && studentStats[selectedStudent.id] && (
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper style={{ padding: 16, textAlign: 'center' }}>
                                    <Typography variant="h4" style={{ color: '#4caf50' }}>
                                        {studentStats[selectedStudent.id].daysPresent}
                                    </Typography>
                                    <Typography variant="caption">Days Present</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper style={{ padding: 16, textAlign: 'center' }}>
                                    <Typography variant="h4" style={{ color: '#f44336' }}>
                                        {studentStats[selectedStudent.id].daysAbsent}
                                    </Typography>
                                    <Typography variant="caption">Days Absent</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper style={{ padding: 16, textAlign: 'center' }}>
                                    <Typography variant="h4" style={{ color: '#1a237e' }}>
                                        {Math.round(studentStats[selectedStudent.id].attendanceRate * 100)}%
                                    </Typography>
                                    <Typography variant="caption">Rate</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Notes for today"
                                    multiline
                                    rows={3}
                                    value={notes[selectedStudent.id] || ''}
                                    onChange={(e) => saveNotes(selectedStudent.id, e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNotesDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AttendanceTracker;
