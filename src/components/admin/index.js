/**
 * Admin Components Index
 * Export all admin components for easy imports
 */

// Auth
export { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
export { default as AdminLogin } from './AdminLogin';
export { default as ProtectedRoute } from './ProtectedRoute';

// Main Dashboard
export { default as TeacherDashboard } from './TeacherDashboard';

// Dashboard Components
export { default as StudentList } from './StudentList';
export { default as ContentBrowser } from './ContentBrowser';
export { default as AssignmentCreator } from './AssignmentCreator';
export { default as ClassStats } from './ClassStats';
