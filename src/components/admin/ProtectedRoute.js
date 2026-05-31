/**
 * Protected Route Component
 * Redirects unauthenticated users to login
 */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import { Box, CircularProgress, Typography } from '@material-ui/core';

const LoadingScreen = () => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
    >
        <CircularProgress style={{ color: '#7B2FF7', marginBottom: 16 }} />
        <Typography style={{ color: '#fff' }}>Loading...</Typography>
    </Box>
);

const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
    const { isAuthenticated, isLoading, hasRole } = useAdminAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Route
            {...rest}
            render={(props) => {
                // Check authentication
                if (!isAuthenticated) {
                    return (
                        <Redirect
                            to={{
                                pathname: '/admin',
                                state: { from: props.location },
                            }}
                        />
                    );
                }

                // Check role if required
                if (requiredRole && !hasRole(requiredRole)) {
                    return (
                        <Redirect
                            to={{
                                pathname: '/admin/dashboard',
                                state: { unauthorized: true },
                            }}
                        />
                    );
                }

                // Render component
                return <Component {...props} />;
            }}
        />
    );
};

export default ProtectedRoute;
