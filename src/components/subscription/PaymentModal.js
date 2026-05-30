/**
 * PaymentModal - Subscription plan selection and payment flow
 */

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Grid,
    CircularProgress,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SchoolIcon from '@material-ui/icons/School';
import DescriptionIcon from '@material-ui/icons/Description';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import PsychologyIcon from '@material-ui/icons/Psychology';
import TimelineIcon from '@material-ui/icons/Timeline';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';

import PaymentService from '../../services/PaymentService';
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_FEATURES, formatPrice } from '../../config/subscriptionConfig';

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
    },
    planCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
            borderColor: theme.palette.primary.main,
            transform: 'translateY(-4px)',
        },
    },
    planCardSelected: {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        right: 16,
        backgroundColor: '#FFD700',
        color: '#000',
        fontWeight: 'bold',
    },
    savingsBadge: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        marginLeft: theme.spacing(1),
    },
    price: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
    },
    pricePeriod: {
        fontSize: '1rem',
        color: theme.palette.text.secondary,
    },
    featuresList: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    featureIcon: {
        color: '#4CAF50',
        minWidth: 36,
    },
    paymentMethods: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.shape.borderRadius,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10,
    },
    successMessage: {
        textAlign: 'center',
        padding: theme.spacing(4),
    },
    successIcon: {
        fontSize: 64,
        color: '#4CAF50',
        marginBottom: theme.spacing(2),
    },
}));

// Map icon names to components
const iconMap = {
    School: SchoolIcon,
    Description: DescriptionIcon,
    VideoLibrary: VideoLibraryIcon,
    Psychology: PsychologyIcon,
    Timeline: TimelineIcon,
    EmojiEvents: EmojiEventsIcon,
};

function PaymentModal({ open, onClose, userId, language = 'en', onSuccess }) {
    const classes = useStyles();

    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const plans = Object.values(SUBSCRIPTION_PLANS);

    const messages = {
        en: {
            title: 'Unlock Full Access',
            subtitle: 'Choose your plan',
            perMonth: '/month',
            perYear: '/year',
            save: 'Save',
            popular: 'Most Popular',
            features: "What's included:",
            payNow: 'Pay Now',
            processing: 'Processing...',
            success: 'Payment Successful!',
            successMessage: 'You now have full access to all content.',
            continue: 'Continue Learning',
            error: 'Payment failed. Please try again.',
        },
        af: {
            title: 'Ontsluit Volle Toegang',
            subtitle: 'Kies jou plan',
            perMonth: '/maand',
            perYear: '/jaar',
            save: 'Spaar',
            popular: 'Mees Gewild',
            features: 'Wat is ingesluit:',
            payNow: 'Betaal Nou',
            processing: 'Verwerk...',
            success: 'Betaling Suksesvol!',
            successMessage: 'Jy het nou volle toegang tot alle inhoud.',
            continue: 'Gaan Voort met Leer',
            error: 'Betaling het misluk. Probeer asseblief weer.',
        },
    };
    const msg = messages[language] || messages.en;

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
        setError(null);
    };

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await PaymentService.initiatePayment(userId, selectedPlan, 'card');

            if (result.redirectUrl) {
                // Redirect to payment gateway
                window.location.href = result.redirectUrl;
            } else {
                // For inline checkout (like Yoco), handle differently
                // For now, simulate success for testing
                console.log('Payment initiated:', result);

                // STUB: In production, integrate with actual payment flow
                // For demo, simulate successful payment
                await PaymentService.manualComplete(result.paymentId, userId);
                setPaymentSuccess(true);
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(msg.error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessContinue = () => {
        setPaymentSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
    };

    // Success state
    if (paymentSuccess) {
        return (
            <Dialog open={open} onClose={handleSuccessContinue} maxWidth="sm" fullWidth>
                <DialogContent className={classes.successMessage}>
                    <CheckCircleIcon className={classes.successIcon} />
                    <Typography variant="h5" gutterBottom>
                        {msg.success}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        {msg.successMessage}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSuccessContinue}
                    >
                        {msg.continue}
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className={classes.dialogTitle} disableTypography>
                <Box>
                    <Typography variant="h6">{msg.title}</Typography>
                    <Typography variant="body2" style={{ opacity: 0.8 }}>
                        {msg.subtitle}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} style={{ color: '#fff' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent style={{ position: 'relative', paddingTop: 24 }}>
                {loading && (
                    <Box className={classes.loadingOverlay}>
                        <CircularProgress />
                        <Typography style={{ marginLeft: 16 }}>{msg.processing}</Typography>
                    </Box>
                )}

                {/* Plan selection */}
                <Grid container spacing={3}>
                    {plans.map((plan) => (
                        <Grid item xs={12} sm={6} key={plan.id}>
                            <Card
                                className={`${classes.planCard} ${
                                    selectedPlan === plan.id ? classes.planCardSelected : ''
                                }`}
                                onClick={() => handlePlanSelect(plan.id)}
                            >
                                {plan.popular && (
                                    <Chip
                                        label={msg.popular}
                                        size="small"
                                        className={classes.popularBadge}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {plan.name}
                                    </Typography>
                                    <Box display="flex" alignItems="baseline">
                                        <Typography className={classes.price}>
                                            {formatPrice(plan.priceCents)}
                                        </Typography>
                                        <Typography className={classes.pricePeriod}>
                                            {plan.id === 'annual' ? msg.perYear : msg.perMonth}
                                        </Typography>
                                    </Box>
                                    {plan.savings && (
                                        <Chip
                                            label={`${msg.save} R${plan.savings}`}
                                            size="small"
                                            className={classes.savingsBadge}
                                        />
                                    )}
                                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                                        {plan.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Features list */}
                <Box className={classes.featuresList}>
                    <Typography variant="subtitle1" gutterBottom>
                        {msg.features}
                    </Typography>
                    <List dense>
                        {SUBSCRIPTION_FEATURES.map((feature, index) => {
                            const IconComponent = iconMap[feature.icon] || CheckCircleIcon;
                            return (
                                <ListItem key={index}>
                                    <ListItemIcon className={classes.featureIcon}>
                                        <IconComponent fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary={feature.text} />
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>

                {error && (
                    <Typography color="error" align="center" style={{ marginTop: 16 }}>
                        {error}
                    </Typography>
                )}
            </DialogContent>

            <Divider />

            <DialogActions style={{ padding: 16 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {msg.payNow} - {formatPrice(SUBSCRIPTION_PLANS[selectedPlan].priceCents)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PaymentModal;
