import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    Box,
    Divider,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';
import LanguageIcon from '@material-ui/icons/Language';
import SchoolIcon from '@material-ui/icons/School';
import ChatIcon from '@material-ui/icons/Chat';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { getAllLinks } from '../../config/businessLinks';
import withTranslation from '../../util/withTranslation.js';

const styles = theme => ({
    drawer: {
        '& .MuiDrawer-paper': {
            width: '320px',
            maxWidth: '85vw',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                maxWidth: '100%',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                maxHeight: '85vh',
            },
        },
    },
    header: {
        background: '#58CC02',
        color: '#fff',
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '16px 16px 0 0',
    },
    headerTitle: {
        fontWeight: 700,
        fontSize: '1.1rem',
    },
    closeButton: {
        color: '#fff',
        padding: 8,
    },
    listItem: {
        padding: '16px 20px',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(88, 204, 2, 0.08)',
        },
        '&:active': {
            background: 'rgba(88, 204, 2, 0.12)',
        },
    },
    listItemIcon: {
        minWidth: 48,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItemTextPrimary: {
        fontWeight: 600,
        fontSize: '0.95rem',
        color: '#3C3C3C',
    },
    listItemTextSecondary: {
        fontSize: '0.8rem',
        color: '#64748B',
        marginTop: 2,
    },
    externalIcon: {
        fontSize: 16,
        color: '#94A3B8',
        marginLeft: 4,
    },
    divider: {
        margin: '8px 16px',
    },
    footer: {
        padding: '16px 20px',
        background: '#F8FAFC',
        textAlign: 'center',
    },
    footerText: {
        fontSize: '0.75rem',
        color: '#94A3B8',
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

class BusinessLinksDrawer extends React.Component {
    handleLinkClick = (link) => {
        if (link.external && link.url) {
            window.open(link.url, '_blank', 'noopener,noreferrer');
        }
        // Close drawer after clicking
        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    render() {
        const { classes, open, onClose, translate } = this.props;
        const links = getAllLinks();
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

        return (
            <Drawer
                anchor={isMobile ? "bottom" : "right"}
                open={open}
                onClose={onClose}
                className={classes.drawer}
            >
                {/* Header */}
                <Box className={classes.header}>
                    <Typography className={classes.headerTitle}>
                        {translate('businessLinks.menuTitle')}
                    </Typography>
                    <IconButton
                        className={classes.closeButton}
                        onClick={onClose}
                        aria-label={translate('businessLinks.closeMenu')}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Links List */}
                <List style={{ flex: 1, paddingTop: 8, paddingBottom: 8 }}>
                    {links.map((link, index) => {
                        const IconComponent = iconMap[link.icon] || LanguageIcon;

                        return (
                            <React.Fragment key={link.id}>
                                <ListItem
                                    button
                                    className={classes.listItem}
                                    onClick={() => this.handleLinkClick(link)}
                                    aria-label={link.name}
                                >
                                    <ListItemIcon className={classes.listItemIcon}>
                                        <div
                                            className={classes.iconContainer}
                                            style={{ background: `${link.color}15` }}
                                        >
                                            <IconComponent style={{ color: link.color, fontSize: 22 }} />
                                        </div>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center">
                                                <span className={classes.listItemTextPrimary}>
                                                    {link.name}
                                                </span>
                                                {link.external && (
                                                    <OpenInNewIcon className={classes.externalIcon} />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <span className={classes.listItemTextSecondary}>
                                                {link.description}
                                            </span>
                                        }
                                    />
                                </ListItem>
                                {index < links.length - 1 && link.featured && !links[index + 1].featured && (
                                    <Divider className={classes.divider} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </List>

                {/* Footer */}
                <Box className={classes.footer}>
                    <Typography className={classes.footerText}>
                        {translate('businessLinks.poweredBy')}
                    </Typography>
                </Box>
            </Drawer>
        );
    }
}

export default withStyles(styles)(withTranslation(BusinessLinksDrawer));
