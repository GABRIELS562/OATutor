import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import styles from './common-styles.js';
import IconButton from '@material-ui/core/IconButton';
import { _coursePlansNoEditor, ThemeContext, SITE_NAME, SHOW_COPYRIGHT } from '../../config/config.js';
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import { Typography, Container, Card, CardContent, CardActions, Chip, Collapse, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import CategoryFilter from './CategoryFilter';
import { EXAM_CATEGORIES, getCategoryById } from '../../config/examCategories';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { IS_STAGING_OR_DEVELOPMENT } from "../../util/getBuildType";
import BuildTimeIndicator from "@components/BuildTimeIndicator";
import withTranslation from "../../util/withTranslation.js";
import Popup from '../Popup/Popup.js';
import About from '../../pages/Posts/About.js';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SchoolIcon from '@material-ui/icons/School';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { LocalizationConsumer } from '../../util/LocalizationContext';
import { LessonCardSkeleton, CourseCardSkeleton, FeatureCardSkeleton } from '../ui/SkeletonLoader';
import MenuIcon from '@material-ui/icons/Menu';
import BusinessLinksDrawer from './BusinessLinksDrawer';
import BusinessLinksSection from './BusinessLinksSection';

// Helper function to get course type from name
const getCourseType = (courseName) => {
    if (courseName.toLowerCase().includes('mathematics') || courseName.toLowerCase().includes('maths')) return 'Mathematics';
    if (courseName.toLowerCase().includes('physical')) return 'Physical Sciences';
    if (courseName.toLowerCase().includes('life')) return 'Life Sciences';
    return 'default';
};

// Course icons mapping
const courseIcons = {
    'Mathematics': '📐',
    'Physical Sciences': '⚛️',
    'Life Sciences': '🧬',
    'default': '📚'
};

// Duolingo-style Course colors mapping
const courseColors = {
    'Mathematics': { primary: '#CE82FF', secondary: '#DDA0FF', gradient: '#CE82FF', shadow: '#A855F7' },
    'Physical Sciences': { primary: '#1CB0F6', secondary: '#84D8FF', gradient: '#1CB0F6', shadow: '#1899D6' },
    'Life Sciences': { primary: '#58CC02', secondary: '#89E219', gradient: '#58CC02', shadow: '#58A700' },
    'default': { primary: '#58CC02', secondary: '#89E219', gradient: '#58CC02', shadow: '#58A700' }
};

// Duolingo-style mobile responsiveness
const mobileStyles = {
    // Hero section - clean white Duolingo style
    heroContainer: {
        background: '#FFFFFF',
        color: '#3C3C3C',
        padding: '40px 16px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '-30px',
        borderBottom: '2px solid #E5E5E5',
    },
    heroContainerMobile: {
        padding: '32px 12px 48px',
        marginBottom: '-24px',
    },
    heroTitle: {
        fontWeight: 800,
        marginBottom: '12px',
        fontSize: 'clamp(1.5rem, 5vw, 2.8rem)',
        lineHeight: 1.2,
        color: '#3C3C3C',
        fontFamily: '"Nunito", sans-serif',
    },
    heroSubtitle: {
        opacity: 0.8,
        maxWidth: '600px',
        margin: '0 auto 24px',
        fontWeight: 600,
        lineHeight: 1.6,
        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
        padding: '0 8px',
        color: '#777777',
    },
    tagline: {
        color: '#58CC02',
        fontSize: 'clamp(0.75rem, 2vw, 1.1rem)',
        fontWeight: 800,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        marginBottom: '8px',
    },
    chipContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        padding: '0 8px',
    },
    chip: {
        background: '#58CC02',
        color: '#fff',
        fontWeight: 700,
        padding: '6px 12px',
        fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
        borderRadius: '12px',
        boxShadow: '0 2px 0 0 #58A700',
    },
    // Duolingo-style Card responsive styles
    courseCard: {
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        border: '2px solid #E5E5E5',
        boxShadow: '0 4px 0 0 #E5E5E5',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
    },
    cardHeader: {
        padding: '24px 16px',
        color: '#fff',
        textAlign: 'center',
    },
    cardHeaderMobile: {
        padding: '20px 12px',
    },
    cardContent: {
        flexGrow: 1,
        padding: '20px',
    },
    cardContentMobile: {
        padding: '16px',
    },
    cardFooter: {
        padding: '12px 20px',
        borderTop: '1px solid #f1f5f9',
    },
    cardFooterMobile: {
        padding: '12px 16px',
    },
    startButton: {
        color: '#fff',
        fontWeight: 600,
        padding: '10px 16px',
        borderRadius: '10px',
        minHeight: '44px', // Touch-friendly
        fontSize: '0.95rem',
    },
    startButtonMobile: {
        padding: '12px 16px',
        minHeight: '48px', // Larger touch target on mobile
        fontSize: '1rem',
    },
    // Feature cards
    featureCard: {
        padding: '20px',
        textAlign: 'center',
        borderRadius: '16px',
        border: '1px solid rgba(123, 47, 247, 0.1)',
        transition: 'all 0.3s ease',
        height: '100%',
    },
    featureCardMobile: {
        padding: '16px',
        borderRadius: '12px',
    },
    // Section titles
    sectionTitle: {
        fontWeight: 700,
        color: '#1a1a2e',
        marginBottom: '8px',
        fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
    },
    // Back button
    backButton: {
        marginBottom: '16px',
        color: '#64748B',
        fontWeight: 500,
        textTransform: 'none',
        minHeight: '44px',
    },
    // Footer
    footer: {
        background: '#1a1a2e',
        color: '#fff',
        padding: '20px 16px',
    },
    footerMobile: {
        padding: '16px 12px',
        flexDirection: 'column',
        gap: '12px',
    },
};

class LessonSelection extends React.Component {
    static contextType = ThemeContext;

    constructor(props, context) {
        super(props);

        this.user = context.user || {}
        this.isPrivileged = !!this.user.privileged

        this.coursePlans = _coursePlansNoEditor;
        this.togglePopup = this.togglePopup.bind(this);

        this.state = {
            preparedRemoveProgress: false,
            removedProgress: false,
            showPopup: false,
            expandedLesson: null,
            isLoading: true,
            isMobile: window.innerWidth <= 600,
            isTablet: window.innerWidth <= 768 && window.innerWidth > 600,
            cardLoadedState: {}, // Track which cards have animated in
            selectedCategory: 'all', // Exam category filter
            businessDrawerOpen: false, // Business links drawer
        }
    }

    componentDidMount() {
        // Simulate loading for skeleton display (remove in production if data loads instantly)
        this.loadingTimer = setTimeout(() => {
            this.setState({ isLoading: false });
        }, 300);

        // Add resize listener for responsive updates
        this.handleResize = () => {
            this.setState({
                isMobile: window.innerWidth <= 600,
                isTablet: window.innerWidth <= 768 && window.innerWidth > 600,
            });
        };
        window.addEventListener('resize', this.handleResize);

        // Load saved category preference from localStorage
        try {
            const savedCategory = localStorage.getItem('preferredExamCategory');
            if (savedCategory && EXAM_CATEGORIES.find(c => c.id === savedCategory)) {
                this.setState({ selectedCategory: savedCategory });
            }
        } catch (e) {
            console.debug('Could not load preferredExamCategory from localStorage');
        }

        // Stagger card animations
        this.animateCardsIn();
    }

    componentWillUnmount() {
        if (this.loadingTimer) {
            clearTimeout(this.loadingTimer);
        }
        window.removeEventListener('resize', this.handleResize);
    }

    animateCardsIn = () => {
        const { courseNum } = this.props;
        const items = courseNum == null
            ? this.coursePlans
            : (this.coursePlans[courseNum]?.lessons || []);

        items.forEach((_, index) => {
            setTimeout(() => {
                this.setState(prev => ({
                    cardLoadedState: {
                        ...prev.cardLoadedState,
                        [index]: true
                    }
                }));
            }, index * 100);
        });
    }

    toggleLessonExpand = (lessonId) => {
        this.setState(prevState => ({
            expandedLesson: prevState.expandedLesson === lessonId ? null : lessonId
        }));
    }

    togglePopup = () => {
        this.setState((prevState) => ({
          showPopup: !prevState.showPopup,
        }));
      };

    removeProgress = () => {
        this.setState({ removedProgress: true });
        this.props.removeProgress();
    }

    prepareRemoveProgress = () => {
        this.setState({ preparedRemoveProgress: true });
    }

    handleCourseSelect = (course, courseIndex) => {
        const { history } = this.props;
        history.push(`/courses/${courseIndex}`);
    };

    handleBackClick = () => {
        const { history } = this.props;
        history.push('/');
    };

    // Handle exam category filter change
    handleCategoryChange = (categoryId) => {
        this.setState({ selectedCategory: categoryId });

        // Save preference to localStorage
        try {
            localStorage.setItem('preferredExamCategory', categoryId);
        } catch (e) {
            console.debug('Could not save preferredExamCategory to localStorage');
        }

        // Reset card animation state when category changes
        this.setState({ cardLoadedState: {} }, () => {
            this.animateCardsIn();
        });
    };

    // Filter lessons based on selected category
    getFilteredLessons = (lessons) => {
        const { selectedCategory } = this.state;

        if (selectedCategory === 'all') {
            return lessons;
        }

        return lessons.filter(lesson =>
            lesson.examCategories?.includes(selectedCategory)
        );
    };

    // Business links drawer handlers
    openBusinessDrawer = () => {
        this.setState({ businessDrawerOpen: true });
    };

    closeBusinessDrawer = () => {
        this.setState({ businessDrawerOpen: false });
    };

    render() {
        const { translate } = this.props;
        const { courseNum } = this.props;
        const selectionMode = courseNum == null ? "course" : "lesson"
        const { showPopup, isLoading, isMobile, cardLoadedState } = this.state;

        if (selectionMode === "lesson" && courseNum >= this.coursePlans.length) {
            return <Box width={'100%'} textAlign={'center'} pt={4} pb={4} px={2}>
                <Typography variant={'h4'} style={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
                    Course <code>{courseNum}</code> is not valid!
                </Typography>
            </Box>
        }

        // Get responsive styles
        const heroStyle = {
            ...mobileStyles.heroContainer,
            ...(isMobile ? mobileStyles.heroContainerMobile : {}),
        };

        return (
            <>
                <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
                    {/* Hero Section - Only on home page (course selection) */}
                    {selectionMode === "course" && (
                        <div style={heroStyle}>
                            {/* Menu Button */}
                            <IconButton
                                onClick={this.openBusinessDrawer}
                                style={{
                                    position: 'absolute',
                                    top: isMobile ? 12 : 16,
                                    right: isMobile ? 12 : 16,
                                    color: '#fff',
                                    background: 'rgba(255,255,255,0.15)',
                                    padding: isMobile ? 10 : 12,
                                    zIndex: 10,
                                }}
                                aria-label="Open menu"
                            >
                                <MenuIcon />
                            </IconButton>
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #00D4FF, #7B2FF7, #F72585)',
                            }}></div>
                            <Container maxWidth="md">
                                <div style={mobileStyles.tagline}>
                                    CAPS Curriculum | Grade 10-12
                                </div>
                                <Typography variant="h2" style={mobileStyles.heroTitle}>
                                    Master Maths & Science with{' '}
                                    <span style={{
                                        background: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 50%, #F72585 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}>
                                        {SITE_NAME}
                                    </span>
                                </Typography>
                                <Typography variant="h6" style={mobileStyles.heroSubtitle}>
                                    Adaptive tutoring powered by AI. Practice problems aligned to the South African CAPS curriculum.
                                    Get instant hints and step-by-step guidance.
                                </Typography>
                                <div style={mobileStyles.chipContainer}>
                                    <Chip
                                        icon={<CheckCircleIcon style={{ color: '#10B981', fontSize: isMobile ? 16 : 18 }} />}
                                        label="100% Free"
                                        style={mobileStyles.chip}
                                        size={isMobile ? "small" : "medium"}
                                    />
                                    <Chip
                                        icon={<CheckCircleIcon style={{ color: '#10B981', fontSize: isMobile ? 16 : 18 }} />}
                                        label="CAPS Aligned"
                                        style={mobileStyles.chip}
                                        size={isMobile ? "small" : "medium"}
                                    />
                                    <Chip
                                        icon={<CheckCircleIcon style={{ color: '#10B981', fontSize: isMobile ? 16 : 18 }} />}
                                        label="AI Hints"
                                        style={mobileStyles.chip}
                                        size={isMobile ? "small" : "medium"}
                                    />
                                </div>
                                <Box mt={isMobile ? 2 : 3}>
                                    <Button
                                        component="a"
                                        href="/#/curriculum"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="outlined"
                                        style={{
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            color: '#fff',
                                            fontWeight: 500,
                                            padding: isMobile ? '8px 16px' : '8px 24px',
                                            borderRadius: '8px',
                                            fontSize: isMobile ? '0.85rem' : '0.95rem',
                                            minHeight: '44px',
                                        }}
                                        startIcon={<MenuBookIcon />}
                                    >
                                        {isMobile ? 'CAPS Reference' : 'View CAPS Curriculum Reference'}
                                    </Button>
                                </Box>
                            </Container>
                            {IS_STAGING_OR_DEVELOPMENT && <BuildTimeIndicator/>}
                        </div>
                    )}

                    {/* Main Content Area */}
                    <Container
                        maxWidth="lg"
                        style={{
                            paddingTop: selectionMode === "course" ? (isMobile ? '40px' : '60px') : (isMobile ? '16px' : '30px'),
                            paddingBottom: isMobile ? '24px' : '40px',
                            paddingLeft: isMobile ? '12px' : '24px',
                            paddingRight: isMobile ? '12px' : '24px',
                        }}
                    >
                        {/* Back Button for Lesson Selection */}
                        {selectionMode === "lesson" && (
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={this.handleBackClick}
                                style={mobileStyles.backButton}
                            >
                                Back to Subjects
                            </Button>
                        )}

                        {/* Section Title */}
                        <Box textAlign="center" mb={isMobile ? 2 : 4}>
                            <Typography variant="h4" style={mobileStyles.sectionTitle}>
                                {selectionMode === "course" ? 'Choose Your Subject' :
                                    `${this.coursePlans[courseNum].courseName}`}
                            </Typography>
                            {selectionMode === "course" ? (
                                <Typography variant="body1" style={{ color: '#64748B', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                    Select a subject to start practicing
                                </Typography>
                            ) : (
                                <Typography variant="body2" style={{ color: '#64748B', marginTop: '4px' }}>
                                    {this.getFilteredLessons(this.coursePlans[courseNum].lessons || []).length} of {this.coursePlans[courseNum].lessons?.length || 0} lessons
                                </Typography>
                            )}
                        </Box>

                        {/* Category Filter - Only show on lesson selection */}
                        {selectionMode === "lesson" && (
                            <CategoryFilter
                                selectedCategory={this.state.selectedCategory}
                                onCategoryChange={this.handleCategoryChange}
                                lessonCount={this.getFilteredLessons(this.coursePlans[courseNum].lessons || []).length}
                                totalCount={this.coursePlans[courseNum].lessons?.length || 0}
                            />
                        )}

                        {/* Course/Lesson Cards */}
                        <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
                            {isLoading ? (
                                selectionMode === "course"
                                    ? <CourseCardSkeleton count={3} />
                                    : <LessonCardSkeleton count={6} />
                            ) : (
                                selectionMode === "course"
                                    ? this.coursePlans.map((course, i) => {
                                        const courseType = getCourseType(course.courseName);
                                        const icon = courseIcons[courseType] || courseIcons.default;
                                        const colors = courseColors[courseType] || courseColors.default;
                                        const lessonCount = course.lessons ? course.lessons.length : 0;
                                        const isCardLoaded = cardLoadedState[i];

                                        const descriptions = {
                                            'Mathematics': 'Geometry, Trigonometry, Analytical Geometry, Statistics & more',
                                            'Physical Sciences': 'Mechanics, Electricity, Waves, Chemistry & more',
                                            'Life Sciences': 'Genetics, Evolution, Nervous System, Reproduction & more',
                                            'default': 'Interactive learning content'
                                        };

                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={course.courseName}>
                                                <Card
                                                    style={{
                                                        ...mobileStyles.courseCard,
                                                        opacity: isCardLoaded ? 1 : 0,
                                                        transform: isCardLoaded ? 'translateY(0)' : 'translateY(20px)',
                                                        transition: 'all 0.4s ease-out',
                                                    }}
                                                    onClick={() => this.handleCourseSelect(course, i)}
                                                    onTouchStart={(e) => {
                                                        e.currentTarget.style.transform = 'scale(0.98)';
                                                    }}
                                                    onTouchEnd={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <div style={{
                                                        background: colors.gradient,
                                                        ...mobileStyles.cardHeader,
                                                        ...(isMobile ? mobileStyles.cardHeaderMobile : {}),
                                                    }}>
                                                        <div style={{ fontSize: isMobile ? '36px' : '48px', marginBottom: isMobile ? '8px' : '12px' }}>{icon}</div>
                                                        <Typography variant="h5" style={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                                                            {course.courseName}
                                                        </Typography>
                                                    </div>
                                                    <CardContent style={{
                                                        ...mobileStyles.cardContent,
                                                        ...(isMobile ? mobileStyles.cardContentMobile : {}),
                                                    }}>
                                                        <Typography variant="body2" style={{ color: '#64748B', marginBottom: '12px', fontSize: isMobile ? '0.85rem' : '0.9rem', lineHeight: 1.5 }}>
                                                            {descriptions[courseType] || descriptions.default}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={`${lessonCount} ${lessonCount === 1 ? 'Lesson' : 'Lessons'}`}
                                                            style={{
                                                                background: `${colors.primary}15`,
                                                                color: colors.primary,
                                                                fontWeight: 600,
                                                                fontSize: isMobile ? '0.75rem' : '0.8rem',
                                                            }}
                                                        />
                                                    </CardContent>
                                                    <CardActions style={{
                                                        ...mobileStyles.cardFooter,
                                                        ...(isMobile ? mobileStyles.cardFooterMobile : {}),
                                                    }}>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            style={{
                                                                background: colors.gradient,
                                                                ...mobileStyles.startButton,
                                                                ...(isMobile ? mobileStyles.startButtonMobile : {}),
                                                            }}
                                                            endIcon={<ArrowForwardIcon />}
                                                        >
                                                            Start Learning
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        );
                                    })
                                    : this.getFilteredLessons(this.coursePlans[this.props.courseNum].lessons).map((lesson, i) => {
                                        const courseName = this.coursePlans[this.props.courseNum].courseName;
                                        const courseType = getCourseType(courseName);
                                        const colors = courseColors[courseType] || courseColors.default;
                                        const isExpanded = this.state.expandedLesson === lesson.id;
                                        const hasCurriculumNotes = lesson.curriculumNotes && lesson.curriculumNotes.length > 0;
                                        const isCardLoaded = cardLoadedState[i];

                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={i}>
                                                <Card style={{
                                                    borderRadius: isMobile ? '12px' : '16px',
                                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                                                    border: `1px solid ${colors.primary}15`,
                                                    transition: 'all 0.3s ease',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    opacity: isCardLoaded ? 1 : 0,
                                                    transform: isCardLoaded ? 'translateY(0)' : 'translateY(20px)',
                                                }}
                                                onTouchStart={(e) => {
                                                    e.currentTarget.style.transform = 'scale(0.98)';
                                                    e.currentTarget.style.boxShadow = `0 2px 10px ${colors.primary}15`;
                                                }}
                                                onTouchEnd={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                                                }}
                                                >
                                                    <CardContent style={{
                                                        flexGrow: 1,
                                                        padding: isMobile ? '16px' : '24px',
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                            <Typography variant="h6" style={{
                                                                fontWeight: 700,
                                                                color: '#1a1a2e',
                                                                flex: 1,
                                                                fontSize: isMobile ? '1rem' : '1.1rem',
                                                                lineHeight: 1.3,
                                                            }}>
                                                                {lesson.name.replace(/##/g, "")}
                                                            </Typography>
                                                            <IconButton
                                                                size="small"
                                                                style={{
                                                                    background: `${colors.primary}10`,
                                                                    marginLeft: '8px',
                                                                    padding: isMobile ? '6px' : '8px',
                                                                }}
                                                                aria-label={`View all problems for lesson ${lesson.id}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.props.history.push(`/lessons/${lesson.id}/problems`);
                                                                }}
                                                            >
                                                                <MenuBookIcon fontSize="small" style={{ color: colors.primary }} />
                                                            </IconButton>
                                                        </div>
                                                        <Typography variant="body2" style={{
                                                            color: '#64748B',
                                                            marginBottom: '8px',
                                                            fontSize: isMobile ? '0.85rem' : '0.9rem',
                                                            lineHeight: 1.5,
                                                        }}>
                                                            {lesson.topics}
                                                        </Typography>

                                                        {/* Category Tags */}
                                                        {lesson.examCategories && lesson.examCategories.length > 0 && (
                                                            <Box display="flex" style={{ gap: 4, flexWrap: 'wrap', marginBottom: '8px' }}>
                                                                {lesson.examCategories.slice(0, 3).map(catId => {
                                                                    const cat = getCategoryById(catId);
                                                                    return cat ? (
                                                                        <Chip
                                                                            key={catId}
                                                                            label={isMobile ? cat.shortName : cat.name}
                                                                            size="small"
                                                                            style={{
                                                                                backgroundColor: `${cat.color}15`,
                                                                                color: cat.color,
                                                                                fontSize: '0.7rem',
                                                                                height: 22,
                                                                                fontWeight: 500,
                                                                            }}
                                                                        />
                                                                    ) : null;
                                                                })}
                                                                {lesson.examCategories.length > 3 && (
                                                                    <Chip
                                                                        label={`+${lesson.examCategories.length - 3}`}
                                                                        size="small"
                                                                        style={{
                                                                            backgroundColor: '#E2E8F0',
                                                                            color: '#64748B',
                                                                            fontSize: '0.7rem',
                                                                            height: 22,
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        )}

                                                        {/* Curriculum Notes Expandable Section */}
                                                        {hasCurriculumNotes && (
                                                            <>
                                                                <Button
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        this.toggleLessonExpand(lesson.id);
                                                                    }}
                                                                    style={{
                                                                        color: colors.primary,
                                                                        textTransform: 'none',
                                                                        fontWeight: 500,
                                                                        padding: '4px 8px',
                                                                        marginLeft: '-8px',
                                                                        fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                                        minHeight: '36px', // Touch-friendly
                                                                    }}
                                                                    endIcon={
                                                                        <ExpandMoreIcon
                                                                            style={{
                                                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                                transition: 'transform 0.3s ease'
                                                                            }}
                                                                        />
                                                                    }
                                                                >
                                                                    {isExpanded ? 'Hide' : 'What you\'ll learn'}
                                                                </Button>
                                                                <Collapse in={isExpanded}>
                                                                    <List dense style={{ paddingTop: '4px' }}>
                                                                        {lesson.curriculumNotes.map((note, noteIndex) => (
                                                                            <ListItem key={noteIndex} style={{ paddingLeft: 0, paddingTop: '1px', paddingBottom: '1px' }}>
                                                                                <ListItemIcon style={{ minWidth: '24px' }}>
                                                                                    <CheckCircleOutlineIcon style={{ fontSize: '14px', color: colors.primary }} />
                                                                                </ListItemIcon>
                                                                                <ListItemText
                                                                                    primary={note}
                                                                                    primaryTypographyProps={{
                                                                                        style: { fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#475569', lineHeight: 1.4 }
                                                                                    }}
                                                                                />
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>
                                                                </Collapse>
                                                            </>
                                                        )}
                                                    </CardContent>
                                                    <CardActions style={{
                                                        padding: isMobile ? '12px 16px' : '16px 24px',
                                                        borderTop: '1px solid #f1f5f9'
                                                    }}>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            style={{
                                                                background: colors.gradient,
                                                                color: '#fff',
                                                                fontWeight: 600,
                                                                padding: isMobile ? '12px' : '10px',
                                                                borderRadius: '10px',
                                                                minHeight: isMobile ? '48px' : '44px',
                                                                fontSize: isMobile ? '0.95rem' : '0.9rem',
                                                            }}
                                                            onClick={() => this.props.history.push(`/lessons/${lesson.id}`)}
                                                            endIcon={<ArrowForwardIcon />}
                                                        >
                                                            {translate('lessonSelection.onlyselect')}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        );
                                    })
                            )}
                        </Grid>

                        {/* Features Section - Only on home page */}
                        {selectionMode === "course" && (
                            <Box mt={isMobile ? 5 : 8}>
                                <Typography variant="h5" style={{
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    color: '#1a1a2e',
                                    marginBottom: isMobile ? '20px' : '32px',
                                    fontSize: isMobile ? '1.1rem' : '1.5rem',
                                }}>
                                    Why Students Love {SITE_NAME}
                                </Typography>
                                <Grid container spacing={isMobile ? 2 : 3}>
                                    {isLoading ? (
                                        <FeatureCardSkeleton count={4} />
                                    ) : (
                                        <>
                                            <Grid item xs={6} sm={6} md={3}>
                                                <Paper style={{
                                                    ...mobileStyles.featureCard,
                                                    ...(isMobile ? mobileStyles.featureCardMobile : {}),
                                                }} elevation={0}>
                                                    <SchoolIcon style={{ fontSize: isMobile ? 36 : 48, color: '#7B2FF7', marginBottom: isMobile ? '8px' : '16px' }} />
                                                    <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '4px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                                        CAPS Aligned
                                                    </Typography>
                                                    <Typography variant="body2" style={{ color: '#64748B', fontSize: isMobile ? '0.75rem' : '0.85rem', lineHeight: 1.4 }}>
                                                        {isMobile ? 'Grade 10-12 curriculum' : 'Problems designed specifically for SA Grade 10-12 curriculum'}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={3}>
                                                <Paper style={{
                                                    ...mobileStyles.featureCard,
                                                    ...(isMobile ? mobileStyles.featureCardMobile : {}),
                                                }} elevation={0}>
                                                    <EmojiObjectsIcon style={{ fontSize: isMobile ? 36 : 48, color: '#00D4FF', marginBottom: isMobile ? '8px' : '16px' }} />
                                                    <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '4px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                                        AI Hints
                                                    </Typography>
                                                    <Typography variant="body2" style={{ color: '#64748B', fontSize: isMobile ? '0.75rem' : '0.85rem', lineHeight: 1.4 }}>
                                                        {isMobile ? 'Smart help when stuck' : 'Get intelligent hints when stuck, not just the answer'}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={3}>
                                                <Paper style={{
                                                    ...mobileStyles.featureCard,
                                                    ...(isMobile ? mobileStyles.featureCardMobile : {}),
                                                }} elevation={0}>
                                                    <TrendingUpIcon style={{ fontSize: isMobile ? 36 : 48, color: '#10B981', marginBottom: isMobile ? '8px' : '16px' }} />
                                                    <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '4px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                                        Track Progress
                                                    </Typography>
                                                    <Typography variant="body2" style={{ color: '#64748B', fontSize: isMobile ? '0.75rem' : '0.85rem', lineHeight: 1.4 }}>
                                                        {isMobile ? 'See your growth' : 'See your mastery grow with adaptive problem selection'}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={3}>
                                                <Paper style={{
                                                    ...mobileStyles.featureCard,
                                                    ...(isMobile ? mobileStyles.featureCardMobile : {}),
                                                }} elevation={0}>
                                                    <CheckCircleIcon style={{ fontSize: isMobile ? 36 : 48, color: '#F72585', marginBottom: isMobile ? '8px' : '16px' }} />
                                                    <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '4px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                                        100% Free
                                                    </Typography>
                                                    <Typography variant="body2" style={{ color: '#64748B', fontSize: isMobile ? '0.75rem' : '0.85rem', lineHeight: 1.4 }}>
                                                        {isMobile ? 'Always free for SA' : 'Quality education accessible to all SA students'}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </Box>
                        )}

                        {/* Business Links Section - Only on home page */}
                        {selectionMode === "course" && (
                            <BusinessLinksSection />
                        )}

                        {/* Reset Progress Button */}
                        {!this.isPrivileged && (
                            <Box mt={isMobile ? 3 : 4} textAlign="center">
                                {this.state.preparedRemoveProgress ?
                                    <Button
                                        variant="outlined"
                                        size={isMobile ? "medium" : "small"}
                                        onClick={this.removeProgress}
                                        disabled={this.state.removedProgress}
                                        style={{
                                            borderColor: '#F72585',
                                            color: '#F72585',
                                            minHeight: '44px',
                                            padding: isMobile ? '10px 24px' : '8px 16px',
                                        }}
                                    >
                                        {this.state.removedProgress ? translate('lessonSelection.reset') : translate('lessonSelection.aresure')}
                                    </Button> :
                                    <Button
                                        variant="text"
                                        size={isMobile ? "medium" : "small"}
                                        onClick={this.prepareRemoveProgress}
                                        disabled={this.state.preparedRemoveProgress}
                                        style={{
                                            color: '#64748B',
                                            minHeight: '44px',
                                        }}
                                    >
                                        {translate('lessonSelection.resetprogress')}
                                    </Button>
                                }
                            </Box>
                        )}
                    </Container>
                </div>

                {/* Footer */}
                <footer style={{
                    ...mobileStyles.footer,
                }}>
                    <Container maxWidth="lg">
                        <div style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: isMobile ? '12px' : '0',
                        }}>
                            <div style={{ fontSize: isMobile ? 12 : 14, opacity: 0.8, textAlign: isMobile ? 'center' : 'left' }}>
                                {SHOW_COPYRIGHT && <>Copyright {new Date().getFullYear()} {SITE_NAME} | Empowering SA Students</>}
                            </div>
                            <div>
                                <IconButton
                                    aria-label="about"
                                    title={`About ${SITE_NAME}`}
                                    onClick={this.togglePopup}
                                    style={{ color: '#fff', padding: isMobile ? '12px' : '8px' }}
                                >
                                    <HelpOutlineOutlinedIcon style={{ fontSize: isMobile ? 24 : 28 }}/>
                                </IconButton>
                            </div>
                        </div>
                    </Container>
                    <Popup isOpen={showPopup} onClose={this.togglePopup}>
                        <About />
                    </Popup>
                </footer>

                {/* Business Links Drawer */}
                <BusinessLinksDrawer
                    open={this.state.businessDrawerOpen}
                    onClose={this.closeBusinessDrawer}
                />
            </>
        )
    }
}

export default withStyles(styles)(withTranslation((props) => (
    <LocalizationConsumer>
        {({ language, platformLanguage }) => (
            <LessonSelection
                {...props}
                language={language}
                platformLanguage={platformLanguage}
            />
        )}
    </LocalizationConsumer>
)));
