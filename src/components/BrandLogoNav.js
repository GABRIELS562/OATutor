import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../config/config";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

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
        background: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 50%, #F72585 100%)',
        borderRadius: '12px',
        opacity: 0.4,
        filter: 'blur(4px)',
        transition: 'opacity 0.3s ease',
        // Mobile styles
        [theme.breakpoints.down('sm')]: {
            borderRadius: '10px',
        },
        [theme.breakpoints.down('xs')]: {
            borderRadius: '8px',
            filter: 'blur(3px)',
        },
    },
    "logoInner": {
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        // Mobile styles
        [theme.breakpoints.down('sm')]: {
            borderRadius: '8px',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.25)',
        },
        [theme.breakpoints.down('xs')]: {
            borderRadius: '7px',
        },
    },
    "logoText": {
        fontFamily: "'Titillium Web', sans-serif",
        fontWeight: 700,
        fontSize: '16px',
        background: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 50%, #F72585 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '1px',
        // Mobile styles
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
            letterSpacing: '0.5px',
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '13px',
        },
    },
    "logoAccent": {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'linear-gradient(90deg, #00D4FF, #7B2FF7, #F72585)',
        // Mobile styles
        [theme.breakpoints.down('xs')]: {
            height: '2px',
        },
    },
    "brandText": {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.1,
        minWidth: 0, // Allow text to shrink
    },
    "brandName": {
        fontFamily: "'Titillium Web', sans-serif",
        fontWeight: 700,
        fontSize: '18px',
        letterSpacing: '0.5px',
        color: '#1a1a2e',
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
        background: 'linear-gradient(135deg, #7B2FF7 0%, #F72585 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    "brandTagline": {
        fontFamily: "'Titillium Web', sans-serif",
        fontSize: '11px',
        color: '#666',
        fontWeight: 400,
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
        "& $logoText": {
            fontSize: '12px',
        },
        "& $logoGlow": {
            borderRadius: '8px',
            filter: 'blur(2px)',
        },
        "& $logoInner": {
            borderRadius: '6px',
        },
        "& $logoAccent": {
            height: '2px',
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
            {/* Modern Logo Mark */}
            <div className={classes.logoContainer}>
                <div className={classes.logoGlow}></div>
                <div className={classes.logoInner}>
                    <div className={classes.logoAccent}></div>
                    <span className={classes.logoText}>AT</span>
                </div>
            </div>

            {/* Brand Text - hidden in compact mode or very small screens */}
            {!compact && (
                <div className={classes.brandText}>
                    <span className={classes.brandName}>
                        {isMobile ? (
                            // Shortened name on mobile
                            <>
                                <span className={classes.brandNameAccent}>Angelo</span>
                            </>
                        ) : (
                            // Full name on larger screens
                            <>
                                Angelo <span className={classes.brandNameAccent}>Tutoring</span>
                            </>
                        )}
                    </span>
                    <span className={classes.brandTagline}>
                        Grade 10-12 | Maths & Science
                    </span>
                </div>
            )}
        </>
    );

    const containerClass = `${classes.siteNavLink} ${isDarkMode ? classes.darkMode : ''} ${compact ? classes.compact : ''}`;

    return (
        <>
            {noLink || (context.jwt.length !== 0 && !isPrivileged)
                ? <div className={containerClass} aria-label="Angelo Tutoring">
                    <BrandContent />
                </div>
                : <div
                    role={"link"}
                    tabIndex={0}
                    onClick={navigateLink}
                    onKeyDown={navigateLink}
                    className={containerClass}
                    aria-label="Go to Angelo Tutoring home"
                    style={{ cursor: 'pointer' }}
                >
                    <BrandContent />
                </div>
            }
        </>
    );
}

export default BrandLogoNav;
