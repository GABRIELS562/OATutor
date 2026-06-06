/**
 * CostDashboard - Admin view for unit economics
 *
 * Shows: AI messages, estimated costs, subscribers, revenue
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

import db from '../../database/DatabaseService';
import { useLocalization } from '../../util/LocalizationContext';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
        maxWidth: 1200,
        margin: '0 auto',
    },
    header: {
        marginBottom: theme.spacing(3),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    card: {
        height: '100%',
    },
    cardIcon: {
        fontSize: 40,
        opacity: 0.3,
        position: 'absolute',
        right: 16,
        top: 16,
    },
    cardContent: {
        position: 'relative',
    },
    metricValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    metricLabel: {
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
    },
    sectionTitle: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
    },
    highlight: {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText,
    },
    warning: {
        backgroundColor: theme.palette.warning.light,
    },
    unitEconomics: {
        padding: theme.spacing(3),
        backgroundColor: theme.palette.grey[50],
        marginTop: theme.spacing(3),
    },
    profitPositive: {
        color: theme.palette.success.main,
        fontWeight: 'bold',
    },
    profitNegative: {
        color: theme.palette.error.main,
        fontWeight: 'bold',
    },
}));

function CostDashboard({ userId }) {
    const classes = useStyles();
    const { t } = useLocalization();

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [data, setData] = useState(null);
    const [billingPeriod, setBillingPeriod] = useState(db.getCurrentBillingPeriod());
    const [availablePeriods, setAvailablePeriods] = useState([]);

    useEffect(() => {
        checkAdminAndLoadData();
    }, [userId, billingPeriod]);

    const checkAdminAndLoadData = async () => {
        setLoading(true);
        try {
            // Check if user is admin
            const adminStatus = await db.isAdmin(userId);
            setIsAdmin(adminStatus);

            if (!adminStatus) {
                setLoading(false);
                return;
            }

            // Load dashboard data
            const dashboardData = await db.getAdminCostDashboard(billingPeriod);
            setData(dashboardData);

            // Generate available periods (last 6 months)
            const periods = [];
            const now = new Date();
            for (let i = 0; i < 6; i++) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                periods.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
            }
            setAvailablePeriods(periods);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    // Convert USD to ZAR (approximate rate)
    const usdToZar = (usd) => (usd * 18.5).toFixed(2);

    if (loading) {
        return (
            <Box className={classes.container} display="flex" justifyContent="center" py={8}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAdmin) {
        return (
            <Box className={classes.container}>
                <Typography variant="h5" color="error">
                    {t('adminLogin.accessDenied')}
                </Typography>
                <Typography color="textSecondary">
                    {t('adminLogin.noPermission')}
                </Typography>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box className={classes.container}>
                <Typography>{t('adminLogin.noData')}</Typography>
            </Box>
        );
    }

    // Calculate unit economics
    const revenueZar = data.payments.total_revenue_zar;
    const costZar = parseFloat(usdToZar(data.ai.total_cost_usd));
    const profit = revenueZar - costZar;
    const profitMargin = revenueZar > 0 ? ((profit / revenueZar) * 100).toFixed(1) : 0;
    const avgCostPerSubZar = parseFloat(usdToZar(data.unit_economics.avg_cost_per_subscriber_usd));

    return (
        <Box className={classes.container}>
            {/* Header */}
            <Box className={classes.header}>
                <Box>
                    <Typography variant="h4">{t('costDashboard.title')}</Typography>
                    <Typography color="textSecondary">
                        {t('costDashboard.subtitle')}
                    </Typography>
                </Box>
                <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
                    <InputLabel>{t('costDashboard.period')}</InputLabel>
                    <Select
                        value={billingPeriod}
                        onChange={(e) => setBillingPeriod(e.target.value)}
                        label={t('costDashboard.period')}
                    >
                        {availablePeriods.map((period) => (
                            <MenuItem key={period} value={period}>
                                {period}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Key Metrics */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <PeopleIcon className={classes.cardIcon} />
                            <Typography className={classes.metricLabel}>
                                {t('costDashboard.activeSubscribers')}
                            </Typography>
                            <Typography className={classes.metricValue}>
                                {data.subscriptions.active_subscribers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <ChatIcon className={classes.cardIcon} />
                            <Typography className={classes.metricLabel}>
                                {t('costDashboard.aiMessages')}
                            </Typography>
                            <Typography className={classes.metricValue}>
                                {data.ai.total_messages.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <AttachMoneyIcon className={classes.cardIcon} />
                            <Typography className={classes.metricLabel}>
                                {t('costDashboard.aiCostEst')}
                            </Typography>
                            <Typography className={classes.metricValue}>
                                R{usdToZar(data.ai.total_cost_usd)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                ${data.ai.total_cost_usd.toFixed(4)} USD
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <TrendingUpIcon className={classes.cardIcon} />
                            <Typography className={classes.metricLabel}>
                                {t('costDashboard.revenue')}
                            </Typography>
                            <Typography className={classes.metricValue}>
                                R{revenueZar.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {data.payments.total_payments} {t('costDashboard.payments')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Unit Economics Summary */}
            <Paper className={classes.unitEconomics}>
                <Typography variant="h6" gutterBottom>
                    {t('costDashboard.unitEconomicsSummary')}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{t('costDashboard.revenue')}</TableCell>
                                        <TableCell align="right">R{revenueZar.toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{t('costDashboard.aiCosts')}</TableCell>
                                        <TableCell align="right">-R{costZar}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>{t('costDashboard.grossProfit')}</strong></TableCell>
                                        <TableCell
                                            align="right"
                                            className={profit >= 0 ? classes.profitPositive : classes.profitNegative}
                                        >
                                            R{profit.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{t('costDashboard.profitMargin')}</TableCell>
                                        <TableCell
                                            align="right"
                                            className={profit >= 0 ? classes.profitPositive : classes.profitNegative}
                                        >
                                            {profitMargin}%
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{t('costDashboard.avgCostPerSubscriber')}</TableCell>
                                        <TableCell align="right">R{avgCostPerSubZar}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{t('costDashboard.avgRevenuePerSubscriber')}</TableCell>
                                        <TableCell align="right">
                                            R{data.subscriptions.active_subscribers > 0
                                                ? (revenueZar / data.subscriptions.active_subscribers).toFixed(2)
                                                : '0.00'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{t('costDashboard.messagesPerSubscriber')}</TableCell>
                                        <TableCell align="right">
                                            {data.subscriptions.active_subscribers > 0
                                                ? (data.ai.total_messages / data.subscriptions.active_subscribers).toFixed(1)
                                                : '0'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{t('costDashboard.costPerMessage')}</TableCell>
                                        <TableCell align="right">
                                            R{data.ai.total_messages > 0
                                                ? (costZar / data.ai.total_messages).toFixed(4)
                                                : '0.0000'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Paper>

            {/* AI Usage Details */}
            <Typography variant="h6" className={classes.sectionTitle}>
                {t('costDashboard.aiUsageDetails')}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                {t('costDashboard.tokenUsage')}
                            </Typography>
                            <Divider style={{ margin: '8px 0' }} />
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>{t('costDashboard.inputTokens')}</Typography>
                                <Typography>{data.ai.total_input_tokens.toLocaleString()}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>{t('costDashboard.outputTokens')}</Typography>
                                <Typography>{data.ai.total_output_tokens.toLocaleString()}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                {t('costDashboard.userFeedback')}
                            </Typography>
                            <Divider style={{ margin: '8px 0' }} />
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <ThumbUpIcon fontSize="small" color="primary" />
                                    <Typography>{t('costDashboard.helpful')}</Typography>
                                </Box>
                                <Typography>{data.feedback.helpful_count}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Box display="flex" alignItems="center" gap={1}>
                                    <ReportProblemIcon fontSize="small" color="error" />
                                    <Typography>{t('costDashboard.errorReports')}</Typography>
                                </Box>
                                <Typography>{data.feedback.error_reports}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CostDashboard;
