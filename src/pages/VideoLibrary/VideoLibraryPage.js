/**
 * VideoLibraryPage - Browse curated SA YouTube video lectures
 *
 * Features:
 * - Videos organized by Subject → Grade → Topic
 * - In-app YouTube embed (no leaving the app)
 * - Filter by subject, grade, topic
 * - Featured videos section
 * - Watch history tracking
 * - Bilingual support
 */

import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Button,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Box,
    Paper,
    Avatar,
} from '@material-ui/core';
import {
    ArrowBack,
    PlayArrow,
    Close,
    FilterList,
    Star,
    Schedule,
    Visibility,
    School,
} from '@material-ui/icons';
import BrandLogoNav from '../../components/BrandLogoNav';
import { useLocalization } from '../../util/LocalizationContext';
import db from '../../database/DatabaseService';
import { CHANNELS, SEED_VIDEOS, TOPIC_STRUCTURE, seedVideoLibrary } from '../../data/videoLibrarySeed';

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
    titleSection: {
        flex: 1,
    },
    title: {
        fontWeight: 700,
        color: '#58CC02',
        fontFamily: "'Nunito', sans-serif",
    },
    subtitle: {
        color: '#666',
        fontSize: '0.9rem',
    },
    filterBar: {
        display: 'flex',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(3),
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    filterControl: {
        minWidth: 140,
    },
    tabs: {
        marginBottom: theme.spacing(3),
    },
    tabPanel: {
        paddingTop: theme.spacing(2),
    },
    featuredSection: {
        marginBottom: theme.spacing(4),
    },
    sectionTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    channelSection: {
        marginBottom: theme.spacing(4),
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius * 2,
        backgroundColor: 'white',
    },
    channelHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    channelAvatar: {
        width: 48,
        height: 48,
        backgroundColor: theme.palette.primary.main,
    },
    videoCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: theme.shape.borderRadius * 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
    },
    videoMedia: {
        height: 180,
        position: 'relative',
    },
    featuredBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FF9600',
        color: 'white',
        borderRadius: 16,
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        fontSize: '0.75rem',
        padding: '2px 6px',
        borderRadius: 4,
    },
    videoContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    videoTitle: {
        fontWeight: 600,
        fontSize: '0.95rem',
        marginBottom: theme.spacing(1),
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    videoMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        color: '#666',
        fontSize: '0.8rem',
        marginTop: 'auto',
    },
    videoTags: {
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
        marginTop: theme.spacing(1),
    },
    tagChip: {
        height: 20,
        fontSize: '0.7rem',
    },
    emptyState: {
        textAlign: 'center',
        padding: theme.spacing(6),
    },
    playerDialog: {
        '& .MuiDialog-paper': {
            maxWidth: 900,
            width: '100%',
            margin: 16,
        },
    },
    playerContent: {
        padding: 0,
        position: 'relative',
        paddingTop: '56.25%', // 16:9 aspect ratio
    },
    playerIframe: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0,
    },
    playerTitle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    gradeChip: {
        marginLeft: 8,
        backgroundColor: theme.palette.primary.light,
        color: 'white',
    },
}));

// Format duration
const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// TabPanel component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

const VideoLibraryPage = ({ history }) => {
    const classes = useStyles();
    const { t, language } = useLocalization();

    // State
    const [videos, setVideos] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedTopic, setSelectedTopic] = useState('all');
    const [tabValue, setTabValue] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [playerOpen, setPlayerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load videos on mount
    useEffect(() => {
        const loadVideos = async () => {
            try {
                await db.init();

                // Check if videos exist in database
                const existingVideos = await db.getVideos({ limit: 1 });

                if (existingVideos.length === 0) {
                    // Seed the database
                    await seedVideoLibrary(db);
                }

                // Load all videos
                const allVideos = await db.getVideos({});
                setVideos(allVideos.length > 0 ? allVideos : SEED_VIDEOS);
            } catch (e) {
                console.warn('Failed to load from database, using seed data:', e);
                setVideos(SEED_VIDEOS);
            }
            setIsLoading(false);
        };

        loadVideos();
    }, []);

    // Filter videos
    const filteredVideos = useMemo(() => {
        return videos.filter(video => {
            if (selectedSubject !== 'all' && video.subject !== selectedSubject) return false;
            if (selectedGrade !== 'all' && video.grade !== parseInt(selectedGrade)) return false;
            if (selectedTopic !== 'all' && video.topic_id !== selectedTopic) return false;
            return true;
        });
    }, [videos, selectedSubject, selectedGrade, selectedTopic]);

    // Featured videos
    const featuredVideos = useMemo(() => {
        return filteredVideos.filter(v => v.is_featured);
    }, [filteredVideos]);

    // Group by subject
    const mathsVideos = useMemo(() => filteredVideos.filter(v => v.subject === 'mathematics'), [filteredVideos]);
    const scienceVideos = useMemo(() => filteredVideos.filter(v => v.subject === 'physical_sciences'), [filteredVideos]);

    // Available topics based on filters
    const availableTopics = useMemo(() => {
        if (selectedSubject === 'all') return [];
        const subject = selectedSubject;
        const grade = selectedGrade !== 'all' ? parseInt(selectedGrade) : null;

        if (grade && TOPIC_STRUCTURE[subject]?.[grade]) {
            return TOPIC_STRUCTURE[subject][grade];
        }

        // Combine all grades
        const allTopics = new Set();
        Object.values(TOPIC_STRUCTURE[subject] || {}).forEach(topics => {
            topics.forEach(t => allTopics.add(t));
        });
        return Array.from(allTopics);
    }, [selectedSubject, selectedGrade]);

    // Handle video play
    const handlePlayVideo = async (video) => {
        setSelectedVideo(video);
        setPlayerOpen(true);

        // Record view (fire and forget)
        try {
            const userId = localStorage.getItem('angelo_user_id');
            if (userId) {
                await db.recordVideoWatch(userId, video.id, 0, false);
            }
        } catch (e) {
            console.debug('Failed to record video view');
        }
    };

    // Reset topic when subject/grade changes
    useEffect(() => {
        setSelectedTopic('all');
    }, [selectedSubject, selectedGrade]);

    // Render video card
    const renderVideoCard = (video) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card className={classes.videoCard}>
                <CardActionArea onClick={() => handlePlayVideo(video)}>
                    <CardMedia
                        className={classes.videoMedia}
                        image={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_video_id}/mqdefault.jpg`}
                        title={video.title}
                    >
                        {video.is_featured && (
                            <Chip
                                icon={<Star style={{ fontSize: 14 }} />}
                                label={t('videos.featured') || 'Featured'}
                                size="small"
                                className={classes.featuredBadge}
                            />
                        )}
                        {video.duration_seconds && (
                            <span className={classes.durationBadge}>
                                {formatDuration(video.duration_seconds)}
                            </span>
                        )}
                    </CardMedia>
                    <CardContent className={classes.videoContent}>
                        <Typography className={classes.videoTitle}>
                            {video.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" noWrap>
                            {video.channel_name}
                        </Typography>
                        <div className={classes.videoMeta}>
                            <School style={{ fontSize: 14 }} />
                            <span>
                                {language === 'af' ? `Graad ${video.grade}` : `Grade ${video.grade}`}
                            </span>
                            {video.topic_name && (
                                <>
                                    <span>•</span>
                                    <span>{video.topic_name}</span>
                                </>
                            )}
                        </div>
                        {video.tags && (
                            <div className={classes.videoTags}>
                                {(typeof video.tags === 'string' ? JSON.parse(video.tags) : video.tags)
                                    .slice(0, 3)
                                    .map(tag => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            variant="outlined"
                                            className={classes.tagChip}
                                        />
                                    ))
                                }
                            </div>
                        )}
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );

    return (
        <div className={classes.root}>
            <BrandLogoNav />

            <Container maxWidth="xl" className={classes.container}>
                {/* Header */}
                <div className={classes.header}>
                    <IconButton
                        className={classes.backButton}
                        onClick={() => history?.goBack() || window.history.back()}
                    >
                        <ArrowBack />
                    </IconButton>
                    <div className={classes.titleSection}>
                        <Typography variant="h5" className={classes.title}>
                            {t('videos.title') || 'Video Lectures'}
                        </Typography>
                        <Typography className={classes.subtitle}>
                            {t('videos.subtitle') || 'Learn from SA\'s best tutors'}
                        </Typography>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className={classes.filterBar}>
                    <FilterList color="action" />

                    <FormControl variant="outlined" size="small" className={classes.filterControl}>
                        <InputLabel>{t('subjects.mathematics') ? 'Subject' : 'Vak'}</InputLabel>
                        <Select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            label="Subject"
                        >
                            <MenuItem value="all">{t('common.all') || 'All'}</MenuItem>
                            <MenuItem value="mathematics">{t('subjects.mathematics') || 'Mathematics'}</MenuItem>
                            <MenuItem value="physical_sciences">{t('subjects.physical_sciences') || 'Physical Sciences'}</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small" className={classes.filterControl}>
                        <InputLabel>{t('grades.grade10')?.includes('Graad') ? 'Graad' : 'Grade'}</InputLabel>
                        <Select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            label="Grade"
                        >
                            <MenuItem value="all">{t('common.all') || 'All'}</MenuItem>
                            <MenuItem value="10">{t('grades.grade10') || 'Grade 10'}</MenuItem>
                            <MenuItem value="11">{t('grades.grade11') || 'Grade 11'}</MenuItem>
                            <MenuItem value="12">{t('grades.grade12') || 'Grade 12'}</MenuItem>
                        </Select>
                    </FormControl>

                    {availableTopics.length > 0 && (
                        <FormControl variant="outlined" size="small" className={classes.filterControl} style={{ minWidth: 180 }}>
                            <InputLabel>Topic</InputLabel>
                            <Select
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                label="Topic"
                            >
                                <MenuItem value="all">{t('common.all') || 'All'}</MenuItem>
                                {availableTopics.map(topic => (
                                    <MenuItem key={topic} value={topic}>
                                        {topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Chip
                        label={`${filteredVideos.length} ${t('common.results') || 'videos'}`}
                        variant="outlined"
                    />
                </div>

                {/* Tabs */}
                <Paper className={classes.tabs}>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label={t('videos.featured') || 'Featured'} />
                        <Tab label={t('subjects.mathematics') || 'Mathematics'} />
                        <Tab label={t('subjects.physical_sciences') || 'Physical Sciences'} />
                    </Tabs>
                </Paper>

                {/* Featured Tab */}
                <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                        <Star color="secondary" />
                        {t('videos.featured') || 'Featured Videos'}
                    </Typography>
                    {featuredVideos.length > 0 ? (
                        <Grid container spacing={3}>
                            {featuredVideos.map(renderVideoCard)}
                        </Grid>
                    ) : (
                        <div className={classes.emptyState}>
                            <Typography color="textSecondary">
                                {t('videos.noVideos') || 'No featured videos found'}
                            </Typography>
                        </div>
                    )}
                </TabPanel>

                {/* Mathematics Tab */}
                <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                        {t('subjects.mathematics') || 'Mathematics'}
                        <Chip label={mathsVideos.length} size="small" />
                    </Typography>
                    {mathsVideos.length > 0 ? (
                        <Grid container spacing={3}>
                            {mathsVideos.map(renderVideoCard)}
                        </Grid>
                    ) : (
                        <div className={classes.emptyState}>
                            <Typography color="textSecondary">
                                {t('videos.noVideos') || 'No videos found'}
                            </Typography>
                        </div>
                    )}
                </TabPanel>

                {/* Physical Sciences Tab */}
                <TabPanel value={tabValue} index={2} className={classes.tabPanel}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                        {t('subjects.physical_sciences') || 'Physical Sciences'}
                        <Chip label={scienceVideos.length} size="small" />
                    </Typography>
                    {scienceVideos.length > 0 ? (
                        <Grid container spacing={3}>
                            {scienceVideos.map(renderVideoCard)}
                        </Grid>
                    ) : (
                        <div className={classes.emptyState}>
                            <Typography color="textSecondary">
                                {t('videos.noVideos') || 'No videos found'}
                            </Typography>
                        </div>
                    )}
                </TabPanel>

                {/* Channel Credits */}
                <Paper className={classes.channelSection} style={{ marginTop: 32 }}>
                    <Typography variant="h6" gutterBottom>
                        {language === 'af' ? 'Uitgelig Kanale' : 'Featured Channels'}
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.values(CHANNELS).filter(c => c.isFeatured).map(channel => (
                            <Grid item xs={12} sm={6} md={4} key={channel.id}>
                                <div className={classes.channelHeader}>
                                    <Avatar className={classes.channelAvatar}>
                                        {channel.name[0]}
                                    </Avatar>
                                    <div>
                                        <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                                            {channel.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {channel.subscribers} subscribers
                                        </Typography>
                                    </div>
                                </div>
                                <Typography variant="body2" color="textSecondary">
                                    {channel.description}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>

            {/* Video Player Dialog */}
            <Dialog
                open={playerOpen}
                onClose={() => setPlayerOpen(false)}
                className={classes.playerDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle className={classes.playerTitle}>
                    <div>
                        {selectedVideo?.title}
                        <Chip
                            size="small"
                            label={`${language === 'af' ? 'Graad' : 'Grade'} ${selectedVideo?.grade}`}
                            className={classes.gradeChip}
                        />
                    </div>
                    <IconButton onClick={() => setPlayerOpen(false)} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.playerContent}>
                    {selectedVideo && (
                        <iframe
                            className={classes.playerIframe}
                            src={`https://www.youtube.com/embed/${selectedVideo.youtube_video_id}?autoplay=1&rel=0`}
                            title={selectedVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VideoLibraryPage;
