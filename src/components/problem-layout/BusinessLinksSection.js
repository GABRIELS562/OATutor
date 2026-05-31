import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Chip
} from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';
import LanguageIcon from '@material-ui/icons/Language';
import SchoolIcon from '@material-ui/icons/School';
import ChatIcon from '@material-ui/icons/Chat';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { getFeaturedLinks, getSecondaryLinks } from '../../config/businessLinks';
import withTranslation from '../../util/withTranslation.js';

const styles = theme => ({
    container: {
        marginTop: 48,
        marginBottom: 24,
        [theme.breakpoints.down('sm')]: {
            marginTop: 32,
            marginBottom: 16,
        },
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 700,
        fontSize: '1.5rem',
        color: '#3C3C3C',
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.25rem',
        },
    },
    sectionSubtitle: {
        textAlign: 'center',
        marginBottom: 24,
        color: '#64748B',
        fontSize: '0.95rem',
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.85rem',
            marginBottom: 16,
        },
    },
    featuredCard: {
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: 'none',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        height: '100%',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
        '&:active': {
            transform: 'scale(0.98)',
        },
    },
    cardActionArea: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    cardHeader: {
        padding: '20px 16px 16px',
        textAlign: 'center',
        color: '#fff',
        [theme.breakpoints.down('sm')]: {
            padding: '16px 12px 12px',
        },
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px',
        background: 'rgba(255,255,255,0.2)',
        [theme.breakpoints.down('sm')]: {
            width: 48,
            height: 48,
            borderRadius: 12,
            marginBottom: 8,
        },
    },
    cardTitle: {
        fontWeight: 700,
        fontSize: '1rem',
        marginBottom: 4,
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.9rem',
        },
    },
    cardContent: {
        padding: '16px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            padding: '12px',
        },
    },
    cardDescription: {
        color: '#64748B',
        fontSize: '0.85rem',
        lineHeight: 1.5,
        marginBottom: 12,
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.8rem',
            marginBottom: 8,
        },
    },
    externalChip: {
        background: 'rgba(0, 0, 0, 0.06)',
        color: '#64748B',
        fontSize: '0.7rem',
        height: 24,
    },
    secondaryLinksContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginTop: 24,
        [theme.breakpoints.down('sm')]: {
            gap: 8,
            marginTop: 16,
        },
    },
    secondaryLink: {
        padding: '10px 16px',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '2px solid transparent',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        '&:active': {
            transform: 'scale(0.98)',
        },
        [theme.breakpoints.down('sm')]: {
            padding: '8px 12px',
        },
    },
    secondaryLinkText: {
        fontWeight: 600,
        fontSize: '0.85rem',
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.8rem',
        },
    },
});

// Map icon names to Material-UI icons
const iconMap = {
    'event': EventIcon,
    'people': PeopleIcon,
    'language': LanguageIcon,
    'school': SchoolIcon,
    'chat': ChatIcon,
    'play_circle': PlayCircleFilledIcon,
};

class BusinessLinksSection extends React.Component {
    handleLinkClick = (link) => {
        if (link.external && link.url) {
            window.open(link.url, '_blank', 'noopener,noreferrer');
        }
    };

    render() {
        const { classes, translate } = this.props;
        const featuredLinks = getFeaturedLinks();
        const secondaryLinks = getSecondaryLinks();
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

        return (
            <Box className={classes.container}>
                {/* Section Header */}
                <Typography variant="h5" className={classes.sectionTitle}>
                    {translate('businessLinks.sectionTitle')}
                </Typography>
                <Typography variant="body1" className={classes.sectionSubtitle}>
                    {translate('businessLinks.sectionSubtitle')}
                </Typography>

                {/* Featured Links Grid */}
                <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
                    {featuredLinks.map((link) => {
                        const IconComponent = iconMap[link.icon] || LanguageIcon;

                        return (
                            <Grid item xs={12} sm={6} md={4} key={link.id}>
                                <Card className={classes.featuredCard}>
                                    <CardActionArea
                                        className={classes.cardActionArea}
                                        onClick={() => this.handleLinkClick(link)}
                                    >
                                        <Box
                                            className={classes.cardHeader}
                                            style={{ background: link.gradient }}
                                        >
                                            <div className={classes.iconContainer}>
                                                <IconComponent style={{ color: '#fff', fontSize: isMobile ? 24 : 28 }} />
                                            </div>
                                            <Typography className={classes.cardTitle}>
                                                {isMobile ? link.shortName : link.name}
                                            </Typography>
                                        </Box>
                                        <CardContent className={classes.cardContent}>
                                            <Typography className={classes.cardDescription}>
                                                {link.description}
                                            </Typography>
                                            <Box display="flex" justifyContent="flex-end">
                                                <Chip
                                                    size="small"
                                                    icon={<OpenInNewIcon style={{ fontSize: 14 }} />}
                                                    label={translate('businessLinks.openLink')}
                                                    className={classes.externalChip}
                                                />
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Secondary Links */}
                {secondaryLinks.length > 0 && (
                    <Box className={classes.secondaryLinksContainer}>
                        {secondaryLinks.map((link) => {
                            const IconComponent = iconMap[link.icon] || LanguageIcon;

                            return (
                                <Box
                                    key={link.id}
                                    className={classes.secondaryLink}
                                    style={{
                                        background: `${link.color}10`,
                                        borderColor: `${link.color}30`,
                                    }}
                                    onClick={() => this.handleLinkClick(link)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => e.key === 'Enter' && this.handleLinkClick(link)}
                                >
                                    <IconComponent style={{ color: link.color, fontSize: 20 }} />
                                    <Typography
                                        className={classes.secondaryLinkText}
                                        style={{ color: link.color }}
                                    >
                                        {isMobile ? link.shortName : link.name}
                                    </Typography>
                                    <OpenInNewIcon style={{ color: link.color, fontSize: 14, opacity: 0.7 }} />
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>
        );
    }
}

export default withStyles(styles)(withTranslation(BusinessLinksSection));
