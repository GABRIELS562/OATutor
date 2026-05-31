/**
 * TutoringPage - Connect with qualified tutors
 *
 * Features:
 * - Browse available tutors
 * - View tutor profiles and specializations
 * - Book tutoring sessions
 * - Free community tutoring option
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import {
    Search,
    ArrowBack,
    School,
    Star,
    Schedule,
    Phone,
    Email,
    WhatsApp,
    CheckCircle,
    VideoCall,
    LocationOn,
} from '@material-ui/icons';
import BrandLogoNav from '../../components/BrandLogoNav';

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
    heroSection: {
        background: '#58CC02',
        color: 'white',
        padding: theme.spacing(4),
        borderRadius: 16,
        marginBottom: theme.spacing(4),
        textAlign: 'center',
        fontFamily: "'Nunito', sans-serif",
    },
    searchSection: {
        marginBottom: theme.spacing(4),
    },
    filtersRow: {
        display: 'flex',
        gap: theme.spacing(2),
        marginTop: theme.spacing(2),
        flexWrap: 'wrap',
    },
    filterSelect: {
        minWidth: 150,
    },
    tutorCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
        },
    },
    tutorCardContent: {
        flexGrow: 1,
    },
    tutorHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    tutorAvatar: {
        width: 64,
        height: 64,
        marginRight: theme.spacing(2),
        backgroundColor: '#58CC02',
        fontSize: '1.5rem',
    },
    tutorName: {
        fontWeight: 600,
    },
    ratingChip: {
        backgroundColor: '#fff3e0',
        color: '#e65100',
        marginLeft: theme.spacing(1),
    },
    subjectChips: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    subjectChip: {
        backgroundColor: '#e3f2fd',
    },
    priceTag: {
        fontWeight: 700,
        color: '#388e3c',
        fontSize: '1.1rem',
    },
    freeTag: {
        backgroundColor: '#4caf50',
        color: 'white',
    },
    dialogContent: {
        padding: theme.spacing(3),
    },
    detailSection: {
        marginBottom: theme.spacing(3),
    },
    communitySection: {
        backgroundColor: '#e8f5e9',
        padding: theme.spacing(3),
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(4),
    },
    communitySectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    contactButton: {
        margin: theme.spacing(0.5),
    },
}));

// Sample tutor data - In production, this would come from a database
const TUTORS = [
    {
        id: 1,
        name: 'Mr. Sipho Ndlovu',
        avatar: null,
        initials: 'SN',
        subjects: ['Mathematics', 'Physical Sciences'],
        grades: [10, 11, 12],
        rating: 4.9,
        reviews: 127,
        experience: '8 years',
        qualification: 'BSc Mathematics (WITS), PGCE',
        bio: 'Passionate about making maths accessible to all learners. Specializes in exam preparation and building strong foundations.',
        location: 'Johannesburg, Gauteng',
        online: true,
        inPerson: true,
        rate: 250,
        availability: ['Mon-Fri 3pm-8pm', 'Sat 9am-2pm'],
        contact: {
            phone: '+27 82 123 4567',
            email: 'sipho.tutoring@email.com',
            whatsapp: '+27821234567',
        },
    },
    {
        id: 2,
        name: 'Ms. Fatima Ahmed',
        avatar: null,
        initials: 'FA',
        subjects: ['Mathematics', 'Mathematical Literacy'],
        grades: [8, 9, 10, 11, 12],
        rating: 4.8,
        reviews: 89,
        experience: '5 years',
        qualification: 'BEd Mathematics (UP)',
        bio: 'Former high school teacher with a gift for explaining complex concepts simply. Great with struggling learners.',
        location: 'Pretoria, Gauteng',
        online: true,
        inPerson: false,
        rate: 200,
        availability: ['Mon-Thu 4pm-7pm', 'Sat-Sun 10am-4pm'],
        contact: {
            phone: '+27 76 987 6543',
            email: 'fatima.maths@email.com',
            whatsapp: '+27769876543',
        },
    },
    {
        id: 3,
        name: 'Mr. Johan van der Merwe',
        avatar: null,
        initials: 'JM',
        subjects: ['Mathematics', 'Accounting'],
        grades: [11, 12],
        rating: 5.0,
        reviews: 64,
        experience: '12 years',
        qualification: 'MCom (Stellenbosch), HDE',
        bio: 'Specialist in Grade 12 exam prep. 100% pass rate with distinctions. Focus on Paper 1 algebra and calculus.',
        location: 'Cape Town, Western Cape',
        online: true,
        inPerson: true,
        rate: 350,
        availability: ['Tue-Fri 5pm-9pm', 'Sat 8am-1pm'],
        contact: {
            phone: '+27 83 555 1234',
            email: 'jvdm.tutoring@email.com',
            whatsapp: '+27835551234',
        },
    },
    {
        id: 4,
        name: 'Community Tutoring',
        avatar: null,
        initials: 'CT',
        subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences'],
        grades: [8, 9, 10, 11, 12],
        rating: 4.7,
        reviews: 312,
        experience: 'Volunteer network',
        qualification: 'Verified university students & graduates',
        bio: 'Free peer tutoring from verified university students. Great for homework help and concept reinforcement.',
        location: 'Online only',
        online: true,
        inPerson: false,
        rate: 0,
        availability: ['Daily 2pm-9pm'],
        contact: {
            whatsapp: '+27600001234',
        },
        isCommunity: true,
    },
];

const TutoringPage = ({ history }) => {
    const classes = useStyles();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

    // Filter tutors
    const filteredTutors = TUTORS.filter(tutor => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!tutor.name.toLowerCase().includes(query) &&
                !tutor.subjects.some(s => s.toLowerCase().includes(query))) {
                return false;
            }
        }
        if (selectedSubject !== 'all' && !tutor.subjects.includes(selectedSubject)) {
            return false;
        }
        if (selectedGrade !== 'all' && !tutor.grades.includes(parseInt(selectedGrade))) {
            return false;
        }
        return true;
    });

    const handleTutorClick = (tutor) => {
        setSelectedTutor(tutor);
        setDialogOpen(true);
    };

    const handleContact = (type, value) => {
        switch (type) {
            case 'phone':
                window.open(`tel:${value}`);
                break;
            case 'email':
                window.open(`mailto:${value}`);
                break;
            case 'whatsapp':
                window.open(`https://wa.me/${value.replace(/\D/g, '')}?text=Hi, I found you on Angelo Tutoring and would like to book a session.`);
                break;
            default:
                break;
        }
    };

    const TutorCard = ({ tutor }) => (
        <Card className={classes.tutorCard}>
            <CardContent className={classes.tutorCardContent}>
                <div className={classes.tutorHeader}>
                    <Avatar className={classes.tutorAvatar}>
                        {tutor.initials}
                    </Avatar>
                    <div>
                        <Typography variant="h6" className={classes.tutorName}>
                            {tutor.name}
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Star style={{ color: '#ffc107', fontSize: 18 }} />
                            <Typography variant="body2" style={{ marginLeft: 4 }}>
                                {tutor.rating} ({tutor.reviews} reviews)
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className={classes.subjectChips}>
                    {tutor.subjects.map(subject => (
                        <Chip
                            key={subject}
                            size="small"
                            label={subject}
                            className={classes.subjectChip}
                        />
                    ))}
                </div>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Grades: {tutor.grades.join(', ')}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                    <Schedule style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }} />
                    {tutor.availability[0]}
                </Typography>

                <div style={{ marginTop: 8 }}>
                    {tutor.isCommunity ? (
                        <Chip label="FREE" className={classes.freeTag} />
                    ) : (
                        <Typography className={classes.priceTag}>
                            R{tutor.rate}/hour
                        </Typography>
                    )}
                    {tutor.online && <Chip size="small" icon={<VideoCall />} label="Online" style={{ marginLeft: 8 }} />}
                </div>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => handleTutorClick(tutor)}
                >
                    View Profile
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleContact('whatsapp', tutor.contact.whatsapp)}
                    startIcon={<WhatsApp />}
                >
                    Contact
                </Button>
            </CardActions>
        </Card>
    );

    return (
        <div className={classes.root}>
            <BrandLogoNav />

            <Container className={classes.container} maxWidth="lg">
                {/* Header */}
                <div className={classes.header}>
                    <IconButton
                        className={classes.backButton}
                        onClick={() => history.goBack()}
                    >
                        <ArrowBack />
                    </IconButton>
                    <div>
                        <Typography variant="h4" className={classes.title}>
                            Tutoring Service
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Connect with qualified tutors
                        </Typography>
                    </div>
                </div>

                {/* Hero Section */}
                <Paper className={classes.heroSection} elevation={0}>
                    <School style={{ fontSize: 60, marginBottom: 16 }} />
                    <Typography variant="h4" gutterBottom>
                        Need Extra Help?
                    </Typography>
                    <Typography variant="body1">
                        Connect with qualified tutors for personalized learning support.
                        Online and in-person options available.
                    </Typography>
                </Paper>

                {/* Search & Filters */}
                <div className={classes.searchSection}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search tutors by name or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div className={classes.filtersRow}>
                        <FormControl variant="outlined" className={classes.filterSelect}>
                            <InputLabel>Subject</InputLabel>
                            <Select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                label="Subject"
                            >
                                <MenuItem value="all">All Subjects</MenuItem>
                                <MenuItem value="Mathematics">Mathematics</MenuItem>
                                <MenuItem value="Physical Sciences">Physical Sciences</MenuItem>
                                <MenuItem value="Mathematical Literacy">Mathematical Literacy</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className={classes.filterSelect}>
                            <InputLabel>Grade</InputLabel>
                            <Select
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                label="Grade"
                            >
                                <MenuItem value="all">All Grades</MenuItem>
                                <MenuItem value="8">Grade 8</MenuItem>
                                <MenuItem value="9">Grade 9</MenuItem>
                                <MenuItem value="10">Grade 10</MenuItem>
                                <MenuItem value="11">Grade 11</MenuItem>
                                <MenuItem value="12">Grade 12</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {/* Tutors Grid */}
                <Grid container spacing={3}>
                    {filteredTutors.map((tutor) => (
                        <Grid item xs={12} sm={6} md={4} key={tutor.id}>
                            <TutorCard tutor={tutor} />
                        </Grid>
                    ))}
                </Grid>

                {filteredTutors.length === 0 && (
                    <Paper style={{ padding: 32, textAlign: 'center' }}>
                        <Typography color="textSecondary">
                            No tutors found matching your criteria.
                        </Typography>
                    </Paper>
                )}

                {/* Community Tutoring Section */}
                <Paper className={classes.communitySection}>
                    <div className={classes.communitySectionTitle}>
                        <School style={{ color: '#388e3c' }} />
                        <Typography variant="h5">
                            Free Community Tutoring
                        </Typography>
                    </div>
                    <Typography variant="body1" paragraph>
                        Can't afford private tutoring? Join our free community tutoring program
                        where verified university students help high school learners.
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle style={{ color: '#388e3c' }} />
                            </ListItemIcon>
                            <ListItemText primary="Free homework help via WhatsApp" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle style={{ color: '#388e3c' }} />
                            </ListItemIcon>
                            <ListItemText primary="Weekly group study sessions online" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle style={{ color: '#388e3c' }} />
                            </ListItemIcon>
                            <ListItemText primary="Exam preparation workshops" />
                        </ListItem>
                    </List>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: '#388e3c', color: 'white' }}
                        startIcon={<WhatsApp />}
                        onClick={() => handleContact('whatsapp', '+27600001234')}
                    >
                        Join Free Tutoring Group
                    </Button>
                </Paper>
            </Container>

            {/* Tutor Profile Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                {selectedTutor && (
                    <>
                        <DialogTitle>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    style={{
                                        width: 56,
                                        height: 56,
                                        marginRight: 16,
                                        backgroundColor: '#58CC02'
                                    }}
                                >
                                    {selectedTutor.initials}
                                </Avatar>
                                <div>
                                    <Typography variant="h5">
                                        {selectedTutor.name}
                                    </Typography>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Star style={{ color: '#ffc107', fontSize: 18 }} />
                                        <Typography variant="body2" style={{ marginLeft: 4 }}>
                                            {selectedTutor.rating} ({selectedTutor.reviews} reviews)
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            <Typography variant="body1" paragraph>
                                {selectedTutor.bio}
                            </Typography>

                            <Divider style={{ margin: '16px 0' }} />

                            <div className={classes.detailSection}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Qualification
                                </Typography>
                                <Typography variant="body1">
                                    {selectedTutor.qualification}
                                </Typography>
                            </div>

                            <div className={classes.detailSection}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Experience
                                </Typography>
                                <Typography variant="body1">
                                    {selectedTutor.experience}
                                </Typography>
                            </div>

                            <div className={classes.detailSection}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Subjects & Grades
                                </Typography>
                                <div className={classes.subjectChips}>
                                    {selectedTutor.subjects.map(subject => (
                                        <Chip key={subject} label={subject} className={classes.subjectChip} />
                                    ))}
                                </div>
                                <Typography variant="body2">
                                    Grades: {selectedTutor.grades.join(', ')}
                                </Typography>
                            </div>

                            <div className={classes.detailSection}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Availability
                                </Typography>
                                {selectedTutor.availability.map((slot, i) => (
                                    <Typography key={i} variant="body1">
                                        <Schedule style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 8 }} />
                                        {slot}
                                    </Typography>
                                ))}
                            </div>

                            <div className={classes.detailSection}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Location
                                </Typography>
                                <Typography variant="body1">
                                    <LocationOn style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 8 }} />
                                    {selectedTutor.location}
                                </Typography>
                                <div style={{ marginTop: 8 }}>
                                    {selectedTutor.online && <Chip size="small" icon={<VideoCall />} label="Online" style={{ marginRight: 8 }} />}
                                    {selectedTutor.inPerson && <Chip size="small" icon={<LocationOn />} label="In-Person" />}
                                </div>
                            </div>

                            <Paper style={{ padding: 16, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                                <Typography variant="h5" style={{ color: '#388e3c', fontWeight: 700 }}>
                                    {selectedTutor.isCommunity ? 'FREE' : `R${selectedTutor.rate}/hour`}
                                </Typography>
                            </Paper>
                        </DialogContent>
                        <DialogActions style={{ padding: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {selectedTutor.contact.phone && (
                                <Button
                                    className={classes.contactButton}
                                    variant="outlined"
                                    startIcon={<Phone />}
                                    onClick={() => handleContact('phone', selectedTutor.contact.phone)}
                                >
                                    Call
                                </Button>
                            )}
                            {selectedTutor.contact.email && (
                                <Button
                                    className={classes.contactButton}
                                    variant="outlined"
                                    startIcon={<Email />}
                                    onClick={() => handleContact('email', selectedTutor.contact.email)}
                                >
                                    Email
                                </Button>
                            )}
                            {selectedTutor.contact.whatsapp && (
                                <Button
                                    className={classes.contactButton}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<WhatsApp />}
                                    onClick={() => handleContact('whatsapp', selectedTutor.contact.whatsapp)}
                                >
                                    WhatsApp
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default TutoringPage;
