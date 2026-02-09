import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * OnboardingGuard - Protects the /onboarding route
 * 
 * Access Rules:
 * - Only users with onboardingCompleted === false can access
 * - Completed users are redirected to /dashboard
 * - Unauthenticated users are redirected to /login
 */
const OnboardingGuard = ({ children }) => {
    const { user, loading } = useAuth();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner glass">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Already completed onboarding - redirect to dashboard
    if (user.onboardingCompleted) {
        return <Navigate to="/dashboard" replace />;
    }

    // User is new and hasn't completed onboarding - allow access
    return children;
};

export default OnboardingGuard;
