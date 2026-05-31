/**
 * Admin Login Page
 * Clean, professional login form for teachers
 */

import React, { useState } from 'react';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

// Icons
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import SchoolIcon from '@material-ui/icons/School';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        background: '#3C3C3C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(5),
        maxWidth: 440,
        width: '100%',
        borderRadius: 24,
        background: '#fff',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(4),
    },
    logoIcon: {
        fontSize: 48,
        color: '#58CC02',
        marginRight: theme.spacing(1.5),
    },
    logoText: {
        fontWeight: 700,
        fontSize: '1.8rem',
        background: 'linear-gradient(135deg, #58CC02 0%, #FF9600 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        textAlign: 'center',
        color: '#64748B',
        marginBottom: theme.spacing(4),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
    },
    textField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F8FAFC',
            '&:hover': {
                backgroundColor: '#F1F5F9',
            },
            '&.Mui-focused': {
                backgroundColor: '#fff',
            },
        },
    },
    loginButton: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(1.5),
        borderRadius: 16,
        fontSize: '1rem',
        fontWeight: 700,
        background: '#58CC02',
        boxShadow: '0 4px 0 0 #58A700',
        '&:hover': {
            boxShadow: '0 2px 0 0 #58A700',
            transform: 'translateY(2px)',
        },
        transition: 'all 0.1s ease',
    },
    backLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(3),
        color: '#64748B',
        textDecoration: 'none',
        '&:hover': {
            color: '#58CC02',
        },
    },
    demoInfo: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
        backgroundColor: 'rgba(88, 204, 2, 0.05)',
        borderRadius: 16,
        border: '1px dashed rgba(88, 204, 2, 0.3)',
    },
    demoTitle: {
        fontWeight: 600,
        color: '#58CC02',
        fontSize: '0.85rem',
        marginBottom: theme.spacing(1),
    },
    demoText: {
        color: '#64748B',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
    },
}));

const AdminLogin = ({ history }) => {
    const classes = useStyles();
    const { login } = useAdminAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            history.push('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className={classes.root}>
            <Paper className={classes.paper} elevation={0}>
                {/* Logo */}
                <Box className={classes.logoContainer}>
                    <SchoolIcon className={classes.logoIcon} />
                    <Typography className={classes.logoText}>
                        Angelo Admin
                    </Typography>
                </Box>

                <Typography className={classes.subtitle}>
                    Teacher and Admin Portal
                </Typography>

                {/* Error Alert */}
                {error && (
                    <Box style={{
                        marginBottom: 24,
                        borderRadius: 12,
                        padding: '12px 16px',
                        backgroundColor: '#FDEDED',
                        border: '1px solid #F5C6CB',
                        color: '#721C24'
                    }}>
                        <Typography variant="body2">{error}</Typography>
                    </Box>
                )}

                {/* Login Form */}
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        className={classes.textField}
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        className={classes.textField}
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className={classes.loginButton}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                {/* Back to Student Portal */}
                <Link to="/" className={classes.backLink}>
                    <ArrowBackIcon style={{ marginRight: 8, fontSize: 18 }} />
                    Back to Student Portal
                </Link>

                {/* Demo Credentials */}
                <Box className={classes.demoInfo}>
                    <Typography className={classes.demoTitle}>
                        Demo Credentials
                    </Typography>
                    <Typography className={classes.demoText}>
                        Teacher: teacher@angelo.co.za / demo123
                    </Typography>
                    <Typography className={classes.demoText}>
                        Admin: admin@angelo.co.za / admin123
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminLogin;
