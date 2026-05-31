/**
 * Angelo Tutoring - Lazy Imports for Code Splitting
 * Reduces initial bundle size by loading components on demand
 */

import React, { Suspense } from 'react';
import { CircularProgress, Box, Typography } from '@material-ui/core';

// Loading fallback component
export const LoadingFallback = ({ message = 'Loading...' }) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        gap={2}
    >
        <CircularProgress
            size={48}
            style={{
                background: '#58CC02',
                borderRadius: '50%',
            }}
        />
        <Typography variant="body2" color="textSecondary">
            {message}
        </Typography>
    </Box>
);

// Lazy load heavy components
export const LazyStudentDashboard = React.lazy(() =>
    import(/* webpackChunkName: "dashboard" */ '../pages/Dashboard/StudentDashboard')
);

export const LazyMockTestPage = React.lazy(() =>
    import(/* webpackChunkName: "mock-test" */ '../pages/MockTest/MockTestPage')
);

export const LazyProblemCard = React.lazy(() =>
    import(/* webpackChunkName: "problem-card" */ '../components/problem-layout/ProblemCard')
);

export const LazyViewAllProblems = React.lazy(() =>
    import(/* webpackChunkName: "view-problems" */ '../components/problem-layout/ViewAllProblems')
);

export const LazyLessonSelection = React.lazy(() =>
    import(/* webpackChunkName: "lesson-selection" */ '../components/problem-layout/LessonSelection')
);

// Wrapper component for lazy loaded routes
export const withLazyLoad = (LazyComponent, fallbackMessage) => {
    return (props) => (
        <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
            <LazyComponent {...props} />
        </Suspense>
    );
};

// Pre-configured lazy components with suspense
export const DashboardWithSuspense = withLazyLoad(
    LazyStudentDashboard,
    'Loading Dashboard...'
);

export const MockTestWithSuspense = withLazyLoad(
    LazyMockTestPage,
    'Loading Mock Test...'
);

export const ProblemCardWithSuspense = withLazyLoad(
    LazyProblemCard,
    'Loading Problem...'
);
