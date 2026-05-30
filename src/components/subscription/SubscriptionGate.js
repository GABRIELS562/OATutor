/**
 * SubscriptionGate - Wrapper component for gated content
 *
 * Usage:
 *   <SubscriptionGate contentType="paper" contentId="paper-123">
 *     <PaperViewer paper={paper} />
 *   </SubscriptionGate>
 */

import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import StarIcon from '@material-ui/icons/Star';

import SubscriptionService from '../../services/SubscriptionService';
import { ThemeContext } from '../../util/ThemeContext';
import PaymentModal from './PaymentModal';

const useStyles = makeStyles((theme) => ({
    gateContainer: {
        position: 'relative',
        minHeight: 200,
    },
    lockedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        borderRadius: theme.shape.borderRadius,
        zIndex: 10,
        padding: theme.spacing(3),
    },
    lockIcon: {
        fontSize: 48,
        color: '#FFD700',
        marginBottom: theme.spacing(2),
    },
    message: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: theme.spacing(2),
    },
    subscribeButton: {
        backgroundColor: '#FFD700',
        color: '#000',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#FFC107',
        },
    },
    freePreviewBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: 16,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        zIndex: 5,
    },
    blurredContent: {
        filter: 'blur(8px)',
        pointerEvents: 'none',
        userSelect: 'none',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
    },
}));

function SubscriptionGate({
    children,
    contentType = null,      // 'paper', 'video', 'lesson', 'ai_tutor'
    contentId = null,        // Specific content ID for free content check
    userId,
    language = 'en',
    showBlurred = true,      // Show blurred preview of locked content
    onSubscribe = null,      // Callback when subscribe clicked
}) {
    const classes = useStyles();
    const { darkMode } = useContext(ThemeContext) || {};

    const [loading, setLoading] = useState(true);
    const [canAccess, setCanAccess] = useState(false);
    const [isFreeContent, setIsFreeContent] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        checkAccess();
    }, [userId, contentType, contentId]);

    const checkAccess = async () => {
        if (!userId) {
            setLoading(false);
            setCanAccess(false);
            return;
        }

        try {
            setLoading(true);

            // Check content-specific access if contentType and contentId provided
            if (contentType && contentId) {
                const result = await SubscriptionService.canAccessContent(userId, contentType, contentId);
                setCanAccess(result.canAccess);
                setIsFreeContent(result.reason === 'free_content');
            } else {
                // General subscription check
                const accessStatus = await SubscriptionService.checkAccess(userId);
                setCanAccess(accessStatus.hasAccess);
            }

            // Get display status
            const displayStatus = await SubscriptionService.getSubscriptionStatus(userId, language);
            setStatus(displayStatus);
        } catch (error) {
            console.error('Error checking subscription:', error);
            setCanAccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribeClick = () => {
        if (onSubscribe) {
            onSubscribe();
        } else {
            setShowPaymentModal(true);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        checkAccess(); // Recheck access after payment
    };

    // Loading state
    if (loading) {
        return (
            <Box className={classes.loading}>
                <CircularProgress />
            </Box>
        );
    }

    // User has access
    if (canAccess) {
        return (
            <Box className={classes.gateContainer}>
                {isFreeContent && (
                    <Box className={classes.freePreviewBadge}>
                        <StarIcon fontSize="small" />
                        {language === 'af' ? 'Gratis Voorskou' : 'Free Preview'}
                    </Box>
                )}
                {children}
            </Box>
        );
    }

    // User doesn't have access - show locked state
    const messages = {
        en: {
            locked: 'Subscribe to access this content',
            subscribe: 'Subscribe Now',
            price: 'From R30/month',
        },
        af: {
            locked: 'Teken in om toegang te kry',
            subscribe: 'Teken Nou In',
            price: 'Vanaf R30/maand',
        },
    };
    const msg = messages[language] || messages.en;

    return (
        <Box className={classes.gateContainer}>
            {/* Blurred preview of content */}
            {showBlurred && (
                <Box className={classes.blurredContent}>
                    {children}
                </Box>
            )}

            {/* Lock overlay */}
            <Paper className={classes.lockedOverlay} elevation={0}>
                <LockIcon className={classes.lockIcon} />
                <Typography variant="h6" className={classes.message}>
                    {status?.message || msg.locked}
                </Typography>
                <Typography variant="body2" className={classes.message} style={{ opacity: 0.8 }}>
                    {msg.price}
                </Typography>
                <Button
                    variant="contained"
                    className={classes.subscribeButton}
                    onClick={handleSubscribeClick}
                    size="large"
                >
                    {status?.actionLabel || msg.subscribe}
                </Button>
            </Paper>

            {/* Payment Modal */}
            <PaymentModal
                open={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                userId={userId}
                language={language}
                onSuccess={handlePaymentSuccess}
            />
        </Box>
    );
}

export default SubscriptionGate;
