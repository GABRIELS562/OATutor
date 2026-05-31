/**
 * Student List Component
 * Displays list of students with progress and actions
 */

import React, { useState, useMemo } from 'react';
import {
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Avatar,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    LinearProgress,
    Tooltip,
    Menu,
    MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Icons
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PersonIcon from '@material-ui/icons/Person';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import WhatshotIcon from '@material-ui/icons/Whatshot';

// Mock student data for demonstration
const MOCK_STUDENTS = [
    {
        id: 'student-001',
        name: 'Thando Molefe',
        email: 'thando.m@school.co.za',
        grade: 12,
        class: '12A',
        avatar: null,
        stats: {
            totalXP: 4250,
            level: 8,
            problemsSolved: 145,
            accuracy: 78,
            currentStreak: 12,
            lastActive: '2025-02-25',
            mathsMastery: 0.72,
            scienceMastery: 0.65,
        },
        trend: 'up',
    },
    {
        id: 'student-002',
        name: 'Lerato Nkosi',
        email: 'lerato.n@school.co.za',
        grade: 12,
        class: '12A',
        avatar: null,
        stats: {
            totalXP: 6800,
            level: 12,
            problemsSolved: 234,
            accuracy: 85,
            currentStreak: 21,
            lastActive: '2025-02-25',
            mathsMastery: 0.85,
            scienceMastery: 0.78,
        },
        trend: 'up',
    },
    {
        id: 'student-003',
        name: 'Sipho Dlamini',
        email: 'sipho.d@school.co.za',
        grade: 11,
        class: '11B',
        avatar: null,
        stats: {
            totalXP: 2100,
            level: 5,
            problemsSolved: 67,
            accuracy: 62,
            currentStreak: 3,
            lastActive: '2025-02-24',
            mathsMastery: 0.45,
            scienceMastery: 0.52,
        },
        trend: 'down',
    },
    {
        id: 'student-004',
        name: 'Nomvula Zulu',
        email: 'nomvula.z@school.co.za',
        grade: 12,
        class: '12A',
        avatar: null,
        stats: {
            totalXP: 5500,
            level: 10,
            problemsSolved: 189,
            accuracy: 81,
            currentStreak: 8,
            lastActive: '2025-02-25',
            mathsMastery: 0.76,
            scienceMastery: 0.82,
        },
        trend: 'up',
    },
    {
        id: 'student-005',
        name: 'Kagiso Mokoena',
        email: 'kagiso.m@school.co.za',
        grade: 11,
        class: '11B',
        avatar: null,
        stats: {
            totalXP: 3200,
            level: 7,
            problemsSolved: 98,
            accuracy: 74,
            currentStreak: 5,
            lastActive: '2025-02-23',
            mathsMastery: 0.58,
            scienceMastery: 0.61,
        },
        trend: 'stable',
    },
    {
        id: 'student-006',
        name: 'Ayanda Mthembu',
        email: 'ayanda.m@school.co.za',
        grade: 10,
        class: '10C',
        avatar: null,
        stats: {
            totalXP: 1800,
            level: 4,
            problemsSolved: 52,
            accuracy: 69,
            currentStreak: 0,
            lastActive: '2025-02-20',
            mathsMastery: 0.38,
            scienceMastery: 0.42,
        },
        trend: 'down',
    },
    {
        id: 'student-007',
        name: 'Bongiwe Ndaba',
        email: 'bongiwe.n@school.co.za',
        grade: 12,
        class: '12B',
        avatar: null,
        stats: {
            totalXP: 7200,
            level: 13,
            problemsSolved: 267,
            accuracy: 88,
            currentStreak: 28,
            lastActive: '2025-02-25',
            mathsMastery: 0.91,
            scienceMastery: 0.85,
        },
        trend: 'up',
    },
    {
        id: 'student-008',
        name: 'Themba Sithole',
        email: 'themba.s@school.co.za',
        grade: 10,
        class: '10C',
        avatar: null,
        stats: {
            totalXP: 950,
            level: 2,
            problemsSolved: 28,
            accuracy: 57,
            currentStreak: 1,
            lastActive: '2025-02-22',
            mathsMastery: 0.25,
            scienceMastery: 0.30,
        },
        trend: 'down',
    },
];

const useStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    header: {
        padding: theme.spacing(3),
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: theme.spacing(2),
    },
    searchField: {
        minWidth: 280,
        '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#F8FAFC',
        },
    },
    tableContainer: {
        maxHeight: 600,
    },
    tableHead: {
        backgroundColor: '#F8FAFC',
        '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#64748B',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
    },
    studentRow: {
        '&:hover': {
            backgroundColor: 'rgba(88, 204, 2, 0.04)',
        },
    },
    studentInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
    },
    avatar: {
        width: 40,
        height: 40,
        backgroundColor: '#58CC02',
    },
    studentName: {
        fontWeight: 600,
        color: '#1E293B',
    },
    studentEmail: {
        fontSize: '0.8rem',
        color: '#64748B',
    },
    levelChip: {
        fontWeight: 600,
        fontSize: '0.75rem',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        width: 80,
        backgroundColor: 'rgba(88, 204, 2, 0.1)',
    },
    progressBarMaths: {
        backgroundColor: '#58CC02',
    },
    progressBarScience: {
        backgroundColor: '#1CB0F6',
    },
    trendUp: {
        color: '#10B981',
    },
    trendDown: {
        color: '#FF4B4B',
    },
    streakBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: '#F59E0B',
    },
    lastActive: {
        fontSize: '0.8rem',
        color: '#64748B',
    },
    lastActiveRecent: {
        color: '#10B981',
    },
    lastActiveOld: {
        color: '#FF4B4B',
    },
}));

const StudentList = ({ onSelectStudent }) => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [anchorEl, setAnchorEl] = useState(null);
    const [, setSelectedStudent] = useState(null);

    // Filter and sort students
    const filteredStudents = useMemo(() => {
        let filtered = MOCK_STUDENTS.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.class.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort
        filtered.sort((a, b) => {
            let aVal, bVal;
            switch (orderBy) {
                case 'name':
                    aVal = a.name;
                    bVal = b.name;
                    break;
                case 'grade':
                    aVal = a.grade;
                    bVal = b.grade;
                    break;
                case 'level':
                    aVal = a.stats.level;
                    bVal = b.stats.level;
                    break;
                case 'accuracy':
                    aVal = a.stats.accuracy;
                    bVal = b.stats.accuracy;
                    break;
                case 'xp':
                    aVal = a.stats.totalXP;
                    bVal = b.stats.totalXP;
                    break;
                default:
                    aVal = a.name;
                    bVal = b.name;
            }

            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            }
            return aVal < bVal ? 1 : -1;
        });

        return filtered;
    }, [searchTerm, orderBy, order]);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleMenuOpen = (event, student) => {
        setAnchorEl(event.currentTarget);
        setSelectedStudent(student);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedStudent(null);
    };

    const getLastActiveStatus = (lastActive) => {
        const today = new Date();
        const lastDate = new Date(lastActive);
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return { text: 'Today', class: classes.lastActiveRecent };
        if (diffDays === 1) return { text: 'Yesterday', class: classes.lastActiveRecent };
        if (diffDays <= 3) return { text: `${diffDays} days ago`, class: classes.lastActive };
        return { text: `${diffDays} days ago`, class: classes.lastActiveOld };
    };

    const getLevelColor = (level) => {
        if (level >= 15) return '#FF9600';
        if (level >= 10) return '#58CC02';
        if (level >= 5) return '#1CB0F6';
        return '#64748B';
    };

    return (
        <Paper className={classes.paper} elevation={0}>
            {/* Header */}
            <Box className={classes.header}>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                    Students ({filteredStudents.length})
                </Typography>
                <TextField
                    className={classes.searchField}
                    placeholder="Search students..."
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
            </Box>

            {/* Table */}
            <TableContainer className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleSort('name')}
                                >
                                    Student
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'grade'}
                                    direction={orderBy === 'grade' ? order : 'asc'}
                                    onClick={() => handleSort('grade')}
                                >
                                    Class
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'level'}
                                    direction={orderBy === 'level' ? order : 'asc'}
                                    onClick={() => handleSort('level')}
                                >
                                    Level
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'xp'}
                                    direction={orderBy === 'xp' ? order : 'asc'}
                                    onClick={() => handleSort('xp')}
                                >
                                    XP
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'accuracy'}
                                    direction={orderBy === 'accuracy' ? order : 'asc'}
                                    onClick={() => handleSort('accuracy')}
                                >
                                    Accuracy
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Mastery</TableCell>
                            <TableCell>Streak</TableCell>
                            <TableCell>Last Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((student) => {
                                const lastActive = getLastActiveStatus(student.stats.lastActive);
                                return (
                                    <TableRow
                                        key={student.id}
                                        className={classes.studentRow}
                                        hover
                                        onClick={() => onSelectStudent && onSelectStudent(student)}
                                        style={{ cursor: onSelectStudent ? 'pointer' : 'default' }}
                                    >
                                        <TableCell>
                                            <Box className={classes.studentInfo}>
                                                <Avatar className={classes.avatar}>
                                                    <PersonIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography className={classes.studentName}>
                                                        {student.name}
                                                    </Typography>
                                                    <Typography className={classes.studentEmail}>
                                                        {student.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={student.class}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`Lvl ${student.stats.level}`}
                                                size="small"
                                                className={classes.levelChip}
                                                style={{
                                                    backgroundColor: `${getLevelColor(student.stats.level)}15`,
                                                    color: getLevelColor(student.stats.level),
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography style={{ fontWeight: 600 }}>
                                                    {student.stats.totalXP.toLocaleString()}
                                                </Typography>
                                                {student.trend === 'up' && (
                                                    <TrendingUpIcon className={classes.trendUp} fontSize="small" />
                                                )}
                                                {student.trend === 'down' && (
                                                    <TrendingDownIcon className={classes.trendDown} fontSize="small" />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography style={{ fontWeight: 600 }}>
                                                {student.stats.accuracy}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" flexDirection="column" gap={0.5}>
                                                <Tooltip title={`Maths: ${Math.round(student.stats.mathsMastery * 100)}%`}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={student.stats.mathsMastery * 100}
                                                        className={classes.progressBar}
                                                        classes={{ bar: classes.progressBarMaths }}
                                                    />
                                                </Tooltip>
                                                <Tooltip title={`Science: ${Math.round(student.stats.scienceMastery * 100)}%`}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={student.stats.scienceMastery * 100}
                                                        className={classes.progressBar}
                                                        classes={{ bar: classes.progressBarScience }}
                                                    />
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className={classes.streakBadge}>
                                                {student.stats.currentStreak > 0 && <WhatshotIcon fontSize="small" />}
                                                <Typography style={{ fontWeight: 600 }}>
                                                    {student.stats.currentStreak}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography className={lastActive.class}>
                                                {lastActive.text}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMenuOpen(e, student);
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredStudents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(e, newPage) => setPage(newPage)}
                onChangeRowsPerPage={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>View Progress</MenuItem>
                <MenuItem onClick={handleMenuClose}>Assign Problems</MenuItem>
                <MenuItem onClick={handleMenuClose}>Send Message</MenuItem>
                <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
            </Menu>
        </Paper>
    );
};

export default StudentList;
