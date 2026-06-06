import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../config/config";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { useLocalization } from "../util/LocalizationContext";

const useStyles = makeStyles((theme) => ({
    "siteNavLink": {
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        "&:hover": {
            cursor: "pointer",
        },
        "&:hover $logoContainer": {
            transform: 'scale(1.05)',
        },
        "&:hover $logoGlow": {
            opacity: 0.6,
        },
        // Mobile styles
        [theme.breakpoints.down('sm')]: {
            gap: '8px',
        },
        [theme.breakpoints.down('xs')]: {
            gap: '6px',
        },
    },
    "logoContainer": {
        position: 'relative',
        width: 44,
        height: 44,
        transition: 'transform 0.3s ease',
        flexShrink: 0,
        // Mobile styles
        [theme.breakpoints.down('sm')]: {
            width: 38,
            height: 38,
        },
        [theme.breakpoints.down('xs')]: {
            width: 34,
            height: 34,
        },
    },
    "logoGlow": {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        background: '#58CC02',
        borderRadius: '14px',
        opacity: 0.3,
        filter: 'blur(4px)',
        transition: 'opacity 0.3s ease',
        // Mobile styles
        [theme.breakpoints.down('sm')]: {
            borderRadius: '12px',
        },
        [theme.breakpoints.down('xs')]: {
            borderRadius: '10px',
            filter: 'blur(3px)',
        },
    },
    "logoInner": {
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#58CC02',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 0 0 #58A700',
        overflow: 'hidden',
        // Mobile styles
        [theme.breakpoints.down('sm')]: {
            borderRadius: '10px',
            boxShadow: '0 3px 0 0 #58A700',
        },
        [theme.breakpoints.down('xs')]: {
            borderRadius: '7px',
        },
    },
    "bookEmoji": {
        fontSize: '24px',
        lineHeight: 1,
        // Mobile styles
        [theme.breakpoints.down('sm')]: {
            fontSize: '20px',
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '18px',
        },
    },
    "brandText": {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.1,
        minWidth: 0, // Allow text to shrink
    },
    "brandName": {
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 800,
        fontSize: '18px',
        letterSpacing: '0.5px',
        color: '#3C3C3C',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
        // Mobile styles
        [theme.breakpoints.down('sm')]: {
            fontSize: '15px',
            letterSpacing: '0.3px',
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '14px',
            gap: '3px',
        },
    },
    "brandNameAccent": {
        color: '#58CC02',
    },
    "brandTagline": {
        fontFamily: "'Nunito', sans-serif",
        fontSize: '11px',
        color: '#777777',
        fontWeight: 600,
        letterSpacing: '0.3px',
        marginTop: '2px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        // Hide on small screens
        [theme.breakpoints.down('sm')]: {
            fontSize: '10px',
        },
        [theme.breakpoints.down('xs')]: {
            display: 'none', // Hide tagline on very small screens
        },
    },
    // Dark mode styles
    "darkMode": {
        "& $brandName": {
            color: '#ffffff',
        },
        "& $brandTagline": {
            color: '#aaa',
        },
    },
    // Compact variant for mobile
    "compact": {
        "& $logoContainer": {
            width: 32,
            height: 32,
        },
        "& $bookEmoji": {
            fontSize: '16px',
        },
        "& $logoGlow": {
            borderRadius: '8px',
            filter: 'blur(2px)',
        },
        "& $logoInner": {
            borderRadius: '6px',
        },
        "& $brandText": {
            display: 'none', // Hide text in compact mode
        },
    },
}));

function BrandLogoNav({ isPrivileged = false, noLink = false, compact = false }) {
    const context = useContext(ThemeContext);
    const history = useHistory();
    const classes = useStyles();
    const isDarkMode = context?.prefersDarkMode;
    const { t } = useLocalization();

    // Track if on mobile for additional adjustments
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navigateLink = (evt) => {
        if (evt.type === "click" || evt.key === "Enter") {
            history.push("/");
        }
    };

    const BrandContent = () => (
        <>
            {/* Book Emoji Logo */}
            <div className={classes.logoContainer}>
                <div className={classes.logoGlow}></div>
                <div className={classes.logoInner}>
                    <span className={classes.bookEmoji}>📚</span>
                </div>
            </div>

            {/* Brand Text - hidden in compact mode or very small screens */}
            {!compact && (
                <div className={classes.brandText}>
                    <span className={classes.brandName}>
                        <span className={classes.brandNameAccent}>{t('brand.name')}</span>
                    </span>
                    <span className={classes.brandTagline}>
                        {t('brand.tagline')}
                    </span>
                </div>
            )}
        </>
    );

    const containerClass = `${classes.siteNavLink} ${isDarkMode ? classes.darkMode : ''} ${compact ? classes.compact : ''}`;

    return (
        <>
            {noLink || (context.jwt.length !== 0 && !isPrivileged)
                ? <div className={containerClass} aria-label={t('ariaLabels.brandLogo')}>
                    <BrandContent />
                </div>
                : <div
                    role={"link"}
                    tabIndex={0}
                    onClick={navigateLink}
                    onKeyDown={navigateLink}
                    className={containerClass}
                    aria-label={t('ariaLabels.goToHome')}
                    style={{ cursor: 'pointer' }}
                >
                    <BrandContent />
                </div>
            }
        </>
    );
}

export default BrandLogoNav;
