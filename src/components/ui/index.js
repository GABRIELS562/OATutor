/**
 * UI Components Index
 * Central export for all UI utility components
 */

// Skeleton Loaders
export {
    LessonCardSkeleton,
    CourseCardSkeleton,
    ProblemCardSkeleton,
    FeatureCardSkeleton,
    LoadingSpinner,
    ProgressDots,
    PageLoadingSkeleton,
} from './SkeletonLoader';

// Error Display Components
export {
    ErrorDisplay,
    OfflineBanner,
    WarningDisplay,
    InfoDisplay,
    useRetry,
    detectErrorType,
} from './ErrorDisplay';

// Mobile Navigation
export { default as MobileNavigation } from './MobileNavigation';

// Theme Toggle
export { default as ThemeToggle } from './ThemeToggle';

// JSDT-style Components (Phase 6)
export { default as BottomNavigation } from './BottomNavigation';
export { default as GlassCard } from './GlassCard';
export { default as GradientButton } from './GradientButton';
export { default as AnimatedProgress } from './AnimatedProgress';

// Default export with all components
const UIComponents = {
    // Skeleton Loaders
    LessonCardSkeleton: require('./SkeletonLoader').LessonCardSkeleton,
    CourseCardSkeleton: require('./SkeletonLoader').CourseCardSkeleton,
    ProblemCardSkeleton: require('./SkeletonLoader').ProblemCardSkeleton,
    FeatureCardSkeleton: require('./SkeletonLoader').FeatureCardSkeleton,
    LoadingSpinner: require('./SkeletonLoader').LoadingSpinner,
    ProgressDots: require('./SkeletonLoader').ProgressDots,
    PageLoadingSkeleton: require('./SkeletonLoader').PageLoadingSkeleton,

    // Error Display
    ErrorDisplay: require('./ErrorDisplay').ErrorDisplay,
    OfflineBanner: require('./ErrorDisplay').OfflineBanner,
    WarningDisplay: require('./ErrorDisplay').WarningDisplay,
    InfoDisplay: require('./ErrorDisplay').InfoDisplay,

    // Mobile Navigation
    MobileNavigation: require('./MobileNavigation').default,

    // Theme Toggle
    ThemeToggle: require('./ThemeToggle').default,

    // JSDT-style Components
    BottomNavigation: require('./BottomNavigation').default,
    GlassCard: require('./GlassCard').default,
    GradientButton: require('./GradientButton').default,
    AnimatedProgress: require('./AnimatedProgress').default,
};

export default UIComponents;
