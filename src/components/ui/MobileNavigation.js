/**
 * Mobile Navigation Component
 * Responsive hamburger menu and mobile-optimized navigation
 * Designed for SA students accessing on mobile devices
 */

import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Typography,
    Box,
    Collapse,
    Chip,
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssessmentIcon from '@material-ui/icons/Assessment';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StarIcon from '@material-ui/icons/Star';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { ThemeContext, SITE_NAME, _coursePlansNoEditor } from '../../config/config';
import { useGamification } from '../../util/GamificationContext';

const useStyles = makeStyles((theme) => ({
    menuButton: {
        padding: 10,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        [theme.breakpoints.up('md')]: {
            display: 'none', // Hide on desktop
        },
    },
    drawer: {
        '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: 320,
            borderRadius: '0 20px 20px 0',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
            color: '#fff',
            paddingBottom: 'env(safe-area-inset-bottom)',
        },
    },
    drawerHeader: {
        padding: theme.spacing(3),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 50%, #F72585 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 16,
        color: '#fff',
    },
    logoText: {
        fontWeight: 700,
        fontSize: 18,
    },
    logoAccent: {
        background: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 50%, #F72585 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    closeButton: {
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
    },
    navSection: {
        padding: theme.spacing(2, 0),
    },
    sectionTitle: {
        padding: theme.spacing(1, 3),
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    navItem: {
        margin: theme.spacing(0.5, 1.5),
        borderRadius: 12,
        transition: 'all 0.2s ease',
        minHeight: 52, // Touch-friendly
        '&:hover': {
            backgroundColor: 'rgba(123, 47, 247, 0.15)',
        },
        '&.active': {
            background: 'linear-gradient(135deg, rgba(123, 47, 247, 0.2) 0%, rgba(247, 37, 133, 0.2) 100%)',
            borderLeft: '3px solid #7B2FF7',
        },
    },
    navItemIcon: {
        color: 'rgba(255, 255, 255, 0.7)',
        minWidth: 44,
    },
    navItemText: {
        '& .MuiListItemText-primary': {
            fontWeight: 500,
            fontSize: 15,
        },
        '& .MuiListItemText-secondary': {
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: 12,
        },
    },
    activeIcon: {
        color: '#7B2FF7',
    },
    subNavItem: {
        paddingLeft: theme.spacing(6),
        minHeight: 48,
        margin: theme.spacing(0.25, 1.5),
        borderRadius: 10,
        '&:hover': {
            backgroundColor: 'rgba(123, 47, 247, 0.1)',
        },
    },
    statsContainer: {
        padding: theme.spacing(2, 3),
        background: 'rgba(255, 255, 255, 0.05)',
        margin: theme.spacing(2, 1.5),
        borderRadius: 12,
    },
    statsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
        '&:last-child': {
            marginBottom: 0,
        },
    },
    statsLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    statsValue: {
        fontWeight: 600,
        fontSize: 15,
    },
    xpBadge: {
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        color: '#fff',
        fontWeight: 600,
        padding: '4px 12px',
        borderRadius: 20,
    },
    levelBadge: {
        background: 'linear-gradient(135deg, #7B2FF7 0%, #F72585 100%)',
        color: '#fff',
        fontWeight: 600,
    },
    streakBadge: {
        background: 'linear-gradient(135deg, #F72585 0%, #E11D48 100%)',
        color: '#fff',
    },
    divider: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        margin: theme.spacing(1, 0),
    },
    footer: {
        padding: theme.spacing(2, 3),
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: 'auto',
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        textAlign: 'center',
    },
    backButton: {
        margin: theme.spacing(1, 1.5, 0),
        borderRadius: 10,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff',
        minHeight: 44,
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
        },
    },
    courseChip: {
        background: 'rgba(0, 212, 255, 0.15)',
        color: '#00D4FF',
        fontSize: 11,
        height: 24,
        marginLeft: theme.spacing(1),
    },
}));

// Navigation items configuration
const NAV_ITEMS = [
    {
        id: 'home',
        label: 'Home',
        icon: HomeIcon,
        path: '/',
        description: 'Course selection',
    },
    {
        id: 'curriculum',
        label: 'CAPS Curriculum',
        icon: MenuBookIcon,
        path: '/curriculum',
        description: 'Reference guide',
        openInNewTab: true,
    },
    {
        id: 'dashboard',
        label: 'My Progress',
        icon: DashboardIcon,
        path: '/dashboard',
        description: 'Stats & achievements',
    },
    {
        id: 'mock-test',
        label: 'Mock Test',
        icon: AssessmentIcon,
        path: '/mock-test',
        description: 'Practice exams',
        badge: 'NEW',
    },
];

function MobileNavigation({ currentLesson, courseNum }) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    useContext(ThemeContext); // Available for future use
    const { stats } = useGamification();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [coursesExpanded, setCoursesExpanded] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleNavigation = (path, openInNewTab = false) => {
        if (openInNewTab) {
            window.open(`/#${path}`, '_blank', 'noopener,noreferrer');
        } else {
            history.push(path);
        }
        setDrawerOpen(false);
    };

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const handleBack = () => {
        if (currentLesson) {
            // If in a lesson, go to course selection
            const currentCourse = _coursePlansNoEditor.findIndex(course =>
                course.lessons.some(l => l.id === currentLesson.id)
            );
            if (currentCourse >= 0) {
                history.push(`/courses/${currentCourse}`);
            } else {
                history.push('/');
            }
        } else if (courseNum !== undefined) {
            // If in course view, go to home
            history.push('/');
        } else {
            history.goBack();
        }
        setDrawerOpen(false);
    };

    // Get current course info
    const currentCourseInfo = courseNum !== undefined
        ? _coursePlansNoEditor[parseInt(courseNum)]
        : null;

    return (
        <>
            {/* Hamburger Menu Button */}
            <IconButton
                className={classes.menuButton}
                onClick={handleDrawerToggle}
                aria-label="Open navigation menu"
                edge="start"
            >
                <MenuIcon />
            </IconButton>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                className={classes.drawer}
            >
                {/* Header */}
                <div className={classes.drawerHeader}>
                    <div className={classes.logoContainer}>
                        <div className={classes.logoIcon}>AT</div>
                        <div>
                            <Typography className={classes.logoText}>
                                Angelo <span className={classes.logoAccent}>Tutoring</span>
                            </Typography>
                        </div>
                    </div>
                    <IconButton
                        className={classes.closeButton}
                        onClick={handleDrawerToggle}
                        aria-label="Close navigation menu"
                    >
                        <CloseIcon />
                    </IconButton>
                </div>

                {/* Back Button (when in lesson/course) */}
                {(currentLesson || courseNum !== undefined) && (
                    <ListItem
                        button
                        className={classes.backButton}
                        onClick={handleBack}
                    >
                        <ListItemIcon className={classes.navItemIcon}>
                            <ArrowBackIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={currentLesson ? 'Back to Course' : 'All Subjects'}
                            className={classes.navItemText}
                        />
                    </ListItem>
                )}

                {/* Current Context Info */}
                {currentCourseInfo && (
                    <Box className={classes.statsContainer} style={{ padding: '12px 16px' }}>
                        <Typography style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                            Currently studying:
                        </Typography>
                        <Typography style={{ fontWeight: 600, fontSize: 14 }}>
                            {currentCourseInfo.courseName}
                        </Typography>
                        {currentLesson && (
                            <Typography style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                                {currentLesson.name.replace(/##/g, '')}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Gamification Stats */}
                {stats && (
                    <Box className={classes.statsContainer}>
                        <div className={classes.statsRow}>
                            <span className={classes.statsLabel}>
                                <StarIcon style={{ fontSize: 16, color: '#F59E0B' }} />
                                XP
                            </span>
                            <span className={classes.xpBadge}>{stats.xp || 0}</span>
                        </div>
                        <div className={classes.statsRow}>
                            <span className={classes.statsLabel}>
                                <EmojiEventsIcon style={{ fontSize: 16, color: '#7B2FF7' }} />
                                Level
                            </span>
                            <Chip
                                label={`Level ${stats.level || 1}`}
                                size="small"
                                className={classes.levelBadge}
                            />
                        </div>
                        <div className={classes.statsRow}>
                            <span className={classes.statsLabel}>
                                Streak
                            </span>
                            <Chip
                                label={`${stats.streak || 0} days`}
                                size="small"
                                className={classes.streakBadge}
                            />
                        </div>
                    </Box>
                )}

                <Divider className={classes.divider} />

                {/* Main Navigation */}
                <div className={classes.navSection}>
                    <Typography className={classes.sectionTitle}>Navigation</Typography>
                    <List>
                        {NAV_ITEMS.map((item) => (
                            <ListItem
                                button
                                key={item.id}
                                className={`${classes.navItem} ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => handleNavigation(item.path, item.openInNewTab)}
                            >
                                <ListItemIcon className={`${classes.navItemIcon} ${isActive(item.path) ? classes.activeIcon : ''}`}>
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center">
                                            {item.label}
                                            {item.badge && (
                                                <Chip
                                                    label={item.badge}
                                                    size="small"
                                                    className={classes.courseChip}
                                                    style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}
                                                />
                                            )}
                                        </Box>
                                    }
                                    secondary={item.description}
                                    className={classes.navItemText}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>

                <Divider className={classes.divider} />

                {/* Courses Section */}
                <div className={classes.navSection}>
                    <Typography className={classes.sectionTitle}>Subjects</Typography>
                    <List>
                        <ListItem
                            button
                            className={classes.navItem}
                            onClick={() => setCoursesExpanded(!coursesExpanded)}
                        >
                            <ListItemIcon className={classes.navItemIcon}>
                                <SchoolIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Browse Courses"
                                secondary={`${_coursePlansNoEditor.length} available`}
                                className={classes.navItemText}
                            />
                            {coursesExpanded ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>

                        <Collapse in={coursesExpanded} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {_coursePlansNoEditor.map((course, index) => (
                                    <ListItem
                                        button
                                        key={course.courseName}
                                        className={classes.subNavItem}
                                        onClick={() => handleNavigation(`/courses/${index}`)}
                                    >
                                        <ListItemText
                                            primary={course.courseName}
                                            secondary={`${course.lessons?.length || 0} lessons`}
                                            className={classes.navItemText}
                                        />
                                        <Chip
                                            label={course.lessons?.length || 0}
                                            size="small"
                                            className={classes.courseChip}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </List>
                </div>

                {/* Settings Section */}
                <Divider className={classes.divider} />
                <div className={classes.navSection}>
                    <Typography className={classes.sectionTitle}>Settings</Typography>
                    <List>
                        <ListItem
                            button
                            onClick={() => {
                                // Toggle dark mode
                                const root = document.documentElement;
                                const isDark = root.classList.contains('theme-dark');
                                if (isDark) {
                                    root.classList.remove('theme-dark');
                                    root.classList.add('theme-light');
                                    root.setAttribute('data-theme', 'light');
                                    localStorage.setItem('angelo_theme_preference', 'light');
                                } else {
                                    root.classList.remove('theme-light');
                                    root.classList.add('theme-dark');
                                    root.setAttribute('data-theme', 'dark');
                                    localStorage.setItem('angelo_theme_preference', 'dark');
                                }
                            }}
                            className={classes.navItem}
                        >
                            <ListItemIcon className={classes.navItemIcon}>
                                {typeof window !== 'undefined' && document.documentElement.classList.contains('theme-dark')
                                    ? <Brightness7Icon />
                                    : <Brightness4Icon />
                                }
                            </ListItemIcon>
                            <ListItemText
                                primary="Dark Mode"
                                secondary="Toggle light/dark theme"
                                className={classes.navItemText}
                            />
                        </ListItem>
                    </List>
                </div>

                {/* Footer */}
                <div className={classes.footer}>
                    <Typography className={classes.footerText}>
                        {SITE_NAME} - CAPS Curriculum
                        <br />
                        Grade 10-12 | Maths & Science
                    </Typography>
                </div>
            </Drawer>
        </>
    );
}

export default MobileNavigation;
