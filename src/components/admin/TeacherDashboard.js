/**
 * Teacher Dashboard
 * Main admin interface for teachers to manage students, content, and assignments
 */

import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    Badge,
    Hidden,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

// Components
import StudentList from './StudentList';
import ContentBrowser from './ContentBrowser';
import AssignmentCreator from './AssignmentCreator';
import ClassStats from './ClassStats';

// Educator Components (Phase 4)
import {
    SlideGenerator,
    AssessmentBuilder,
    AttendanceTracker,
    StudentProgress,
    ClassManager,
    ReportGenerator,
} from '../educator';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SchoolIcon from '@material-ui/icons/School';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import EventNoteIcon from '@material-ui/icons/EventNote';
import GroupIcon from '@material-ui/icons/Group';
import DescriptionIcon from '@material-ui/icons/Description';
import BuildIcon from '@material-ui/icons/Build';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        background: '#58CC02',
        boxShadow: '0 4px 0 0 #58A700',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
    },
    logoIcon: {
        fontSize: 32,
        color: '#FFFFFF',
    },
    logoText: {
        fontWeight: 700,
        fontSize: '1.3rem',
        color: '#fff',
    },
    logoSubtext: {
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.6)',
        marginLeft: theme.spacing(1),
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        borderRight: 'none',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
    },
    drawerContainer: {
        overflow: 'auto',
        paddingTop: theme.spacing(2),
    },
    navItem: {
        margin: theme.spacing(0.5, 1.5),
        borderRadius: 16,
        '&:hover': {
            backgroundColor: 'rgba(88, 204, 2, 0.08)',
        },
    },
    navItemActive: {
        backgroundColor: 'rgba(88, 204, 2, 0.12)',
        '& .MuiListItemIcon-root': {
            color: '#58CC02',
        },
        '& .MuiListItemText-primary': {
            color: '#58CC02',
            fontWeight: 700,
        },
    },
    navIcon: {
        minWidth: 42,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        marginTop: 64,
        minHeight: 'calc(100vh - 64px)',
    },
    userMenu: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    avatar: {
        width: 38,
        height: 38,
        backgroundColor: '#58A700',
        cursor: 'pointer',
    },
    pageHeader: {
        marginBottom: theme.spacing(3),
    },
    pageTitle: {
        fontWeight: 700,
        color: '#1E293B',
    },
    pageSubtitle: {
        color: '#64748B',
    },
    quickStatCard: {
        borderRadius: 16,
        border: '1px solid rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-4px)',
        },
    },
    statIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(2),
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#1E293B',
    },
    statLabel: {
        color: '#64748B',
        fontSize: '0.9rem',
    },
    actionCard: {
        borderRadius: 16,
        padding: theme.spacing(3),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid transparent',
        '&:hover': {
            borderColor: '#58CC02',
            boxShadow: '0 8px 30px rgba(88, 204, 2, 0.15)',
        },
    },
    mobileDrawer: {
        width: drawerWidth,
    },
    backButton: {
        color: '#fff',
    },
}));

// Navigation items
const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'classes', label: 'Classes', icon: <GroupIcon /> },
    { id: 'students', label: 'Students', icon: <PeopleIcon /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUpIcon /> },
    { id: 'content', label: 'Content', icon: <LibraryBooksIcon /> },
    { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon /> },
    { id: 'assessments', label: 'Assessment Builder', icon: <BuildIcon /> },
    { id: 'attendance', label: 'Attendance', icon: <EventNoteIcon /> },
    { id: 'slides', label: 'Slide Generator', icon: <SlideshowIcon /> },
    { id: 'reports', label: 'Reports', icon: <DescriptionIcon /> },
    { id: 'statistics', label: 'Class Stats', icon: <BarChartIcon /> },
];

// Mock quick stats
const QUICK_STATS = [
    { label: 'Total Students', value: 115, icon: <PeopleIcon />, color: '#58CC02' },
    { label: 'Active Today', value: 78, icon: <TrendingUpIcon />, color: '#10B981' },
    { label: 'Avg Accuracy', value: '74%', icon: <SchoolIcon />, color: '#1CB0F6' },
    { label: 'Assignments Due', value: 3, icon: <AssignmentIcon />, color: '#FF9600' },
];

const TeacherDashboard = () => {
    const classes = useStyles();
    const history = useHistory();
    const { user, logout } = useAdminAuth();
    const [activeView, setActiveView] = useState('overview');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProblems, setSelectedProblems] = useState([]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleUserMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        history.push('/admin');
    };

    const handleAddToAssignment = (skill, topic) => {
        setSelectedProblems((prev) => [...prev, { skill, topic: topic.topic }]);
        // Switch to assignments view
        setActiveView('assignments');
    };

    const drawerContent = (
        <>
            <Toolbar />
            <Box className={classes.drawerContainer}>
                <List>
                    {NAV_ITEMS.map((item) => (
                        <ListItem
                            button
                            key={item.id}
                            className={`${classes.navItem} ${
                                activeView === item.id ? classes.navItemActive : ''
                            }`}
                            onClick={() => {
                                setActiveView(item.id);
                                setMobileOpen(false);
                            }}
                        >
                            <ListItemIcon className={classes.navIcon}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}
                </List>
                <Divider style={{ margin: '16px 24px' }} />
                <List>
                    <ListItem button className={classes.navItem}>
                        <ListItemIcon className={classes.navIcon}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </List>
            </Box>
        </>
    );

    const renderContent = () => {
        switch (activeView) {
            case 'classes':
                return <ClassManager />;
            case 'students':
                return <StudentList />;
            case 'progress':
                return <StudentProgress />;
            case 'content':
                return (
                    <ContentBrowser
                        onAddToAssignment={handleAddToAssignment}
                    />
                );
            case 'assignments':
                return (
                    <AssignmentCreator
                        selectedProblems={selectedProblems}
                        onClearProblems={() => setSelectedProblems([])}
                    />
                );
            case 'assessments':
                return <AssessmentBuilder />;
            case 'attendance':
                return <AttendanceTracker />;
            case 'slides':
                return <SlideGenerator />;
            case 'reports':
                return <ReportGenerator />;
            case 'statistics':
                return <ClassStats />;
            case 'overview':
            default:
                return (
                    <Box>
                        {/* Quick Stats */}
                        <Grid container spacing={3} style={{ marginBottom: 32 }}>
                            {QUICK_STATS.map((stat) => (
                                <Grid item xs={6} sm={3} key={stat.label}>
                                    <Card className={classes.quickStatCard} elevation={0}>
                                        <CardContent>
                                            <Box
                                                className={classes.statIcon}
                                                style={{ backgroundColor: `${stat.color}15` }}
                                            >
                                                {React.cloneElement(stat.icon, {
                                                    style: { color: stat.color, fontSize: 26 },
                                                })}
                                            </Box>
                                            <Typography className={classes.statValue}>
                                                {stat.value}
                                            </Typography>
                                            <Typography className={classes.statLabel}>
                                                {stat.label}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Quick Actions */}
                        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 16 }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={3} style={{ marginBottom: 32 }}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    className={classes.actionCard}
                                    elevation={0}
                                    onClick={() => setActiveView('assignments')}
                                >
                                    <Box
                                        className={classes.statIcon}
                                        style={{ backgroundColor: 'rgba(88, 204, 2, 0.1)', margin: 0 }}
                                    >
                                        <AddIcon style={{ color: '#58CC02', fontSize: 26 }} />
                                    </Box>
                                    <Box>
                                        <Typography style={{ fontWeight: 600 }}>
                                            Create Assignment
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Build a new assignment for your class
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    className={classes.actionCard}
                                    elevation={0}
                                    onClick={() => setActiveView('students')}
                                >
                                    <Box
                                        className={classes.statIcon}
                                        style={{ backgroundColor: 'rgba(28, 176, 246, 0.1)', margin: 0 }}
                                    >
                                        <PeopleIcon style={{ color: '#1CB0F6', fontSize: 26 }} />
                                    </Box>
                                    <Box>
                                        <Typography style={{ fontWeight: 600 }}>
                                            View Students
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Check individual progress and stats
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    className={classes.actionCard}
                                    elevation={0}
                                    onClick={() => setActiveView('content')}
                                >
                                    <Box
                                        className={classes.statIcon}
                                        style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', margin: 0 }}
                                    >
                                        <LibraryBooksIcon style={{ color: '#10B981', fontSize: 26 }} />
                                    </Box>
                                    <Box>
                                        <Typography style={{ fontWeight: 600 }}>
                                            Browse Content
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Explore available problems and topics
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    className={classes.actionCard}
                                    elevation={0}
                                    onClick={() => setActiveView('slides')}
                                >
                                    <Box
                                        className={classes.statIcon}
                                        style={{ backgroundColor: 'rgba(206, 130, 255, 0.1)', margin: 0 }}
                                    >
                                        <SlideshowIcon style={{ color: '#CE82FF', fontSize: 26 }} />
                                    </Box>
                                    <Box>
                                        <Typography style={{ fontWeight: 600 }}>
                                            AI Slide Generator
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Create CAPS-aligned presentations
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    className={classes.actionCard}
                                    elevation={0}
                                    onClick={() => setActiveView('attendance')}
                                >
                                    <Box
                                        className={classes.statIcon}
                                        style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', margin: 0 }}
                                    >
                                        <EventNoteIcon style={{ color: '#F59E0B', fontSize: 26 }} />
                                    </Box>
                                    <Box>
                                        <Typography style={{ fontWeight: 600 }}>
                                            Take Attendance
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Mark daily class attendance
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Recent Activity Summary */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <ClassStats />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    style={{ borderRadius: 16, padding: 24, height: '100%' }}
                                >
                                    <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 16 }}>
                                        Upcoming Due Dates
                                    </Typography>
                                    {[
                                        { title: 'Trigonometry Quiz', due: 'Tomorrow', class: '12A' },
                                        { title: 'Functions Practice', due: 'In 3 days', class: '11B' },
                                        { title: 'Calculus Test', due: 'In 5 days', class: '12A' },
                                    ].map((item, index) => (
                                        <Box
                                            key={index}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            py={1.5}
                                            borderBottom={
                                                index < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none'
                                            }
                                        >
                                            <Box>
                                                <Typography style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {item.class}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={item.due}
                                                size="small"
                                                style={{
                                                    backgroundColor:
                                                        item.due === 'Tomorrow'
                                                            ? 'rgba(255, 75, 75, 0.1)'
                                                            : 'rgba(255, 150, 0, 0.1)',
                                                    color:
                                                        item.due === 'Tomorrow' ? '#FF4B4B' : '#FF9600',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </Box>
                                    ))}

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        style={{ marginTop: 24, borderRadius: 10 }}
                                        onClick={() => setActiveView('assignments')}
                                    >
                                        View All Assignments
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                );
        }
    };

    return (
        <Box className={classes.root}>
            {/* App Bar */}
            <AppBar position="fixed" className={classes.appBar} elevation={0}>
                <Toolbar className={classes.toolbar}>
                    <Box display="flex" alignItems="center">
                        <Hidden mdUp>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleDrawerToggle}
                                style={{ marginRight: 8 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                        <IconButton
                            component={Link}
                            to="/"
                            className={classes.backButton}
                            size="small"
                            style={{ marginRight: 16 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box className={classes.logo}>
                            <SchoolIcon className={classes.logoIcon} />
                            <Typography className={classes.logoText}>
                                Angelo
                                <span className={classes.logoSubtext}>Teacher Portal</span>
                            </Typography>
                        </Box>
                    </Box>

                    <Box className={classes.userMenu}>
                        <IconButton color="inherit">
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Avatar
                            className={classes.avatar}
                            onClick={handleUserMenuOpen}
                        >
                            {user?.name?.charAt(0) || 'T'}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* User Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem disabled>
                    <Box>
                        <Typography style={{ fontWeight: 600 }}>{user?.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {user?.email}
                        </Typography>
                    </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleUserMenuClose}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Desktop Drawer */}
            <Hidden smDown>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{ paper: classes.drawerPaper }}
                >
                    {drawerContent}
                </Drawer>
            </Hidden>

            {/* Mobile Drawer */}
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{ paper: classes.mobileDrawer }}
                    ModalProps={{ keepMounted: true }}
                >
                    {drawerContent}
                </Drawer>
            </Hidden>

            {/* Main Content */}
            <Box component="main" className={classes.content}>
                <Container maxWidth="xl">
                    {/* Page Header */}
                    <Box className={classes.pageHeader}>
                        <Typography variant="h4" className={classes.pageTitle}>
                            {NAV_ITEMS.find((item) => item.id === activeView)?.label || 'Dashboard'}
                        </Typography>
                        <Typography className={classes.pageSubtitle}>
                            {activeView === 'overview' && 'Welcome back! Here is your class overview.'}
                            {activeView === 'classes' && 'Create and manage your classes'}
                            {activeView === 'students' && 'Monitor and manage your students'}
                            {activeView === 'progress' && 'Track student performance and skill mastery'}
                            {activeView === 'content' && 'Browse and assign problems from the curriculum'}
                            {activeView === 'assignments' && 'Create and manage assignments'}
                            {activeView === 'assessments' && 'Build custom assessments with AI-powered questions'}
                            {activeView === 'attendance' && 'Track and manage class attendance'}
                            {activeView === 'slides' && 'Generate CAPS-aligned presentations with AI'}
                            {activeView === 'reports' && 'Generate and export comprehensive reports'}
                            {activeView === 'statistics' && 'View detailed class analytics'}
                        </Typography>
                    </Box>

                    {/* Main Content */}
                    {renderContent()}
                </Container>
            </Box>
        </Box>
    );
};

export default TeacherDashboard;
