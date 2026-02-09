import React, { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ChevronUp, CheckSquare, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import './MainLayout.css';

const MainLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user && user.isFirstLogin && !user.onboardingCompleted && !location.pathname.includes('onboarding')) {
            navigate('/onboarding');
        }
    }, [user, loading, navigate, location.pathname]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner glass">
                    <div className="spinner"></div>
                    <p>Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="layout-horizontal">
            <Header />
            <main className="main-content-sf">
                {user && !user.isVerified && (
                    <div className="verification-reminder-banner">
                        <div className="banner-content">
                            <Mail size={16} className="banner-icon" />
                            <span>Please verify your email to unlock all features. Check your inbox or</span>
                            <button className="resend-link-btn" onClick={() => navigate('/verify-email')}>
                                click here to resend verification.
                            </button>
                        </div>
                    </div>
                )}
                <div className="page-content-sf">
                    <Outlet />
                </div>
            </main>

            {/* Global Salesforce To-Do List Footer */}
            <div className="global-footer-todo-sf">
                <div className="todo-trigger-sf">
                    <div className="todo-label-sf">
                        <CheckSquare size={14} className="todo-icon-sf" />
                        <span>To Do List</span>
                    </div>
                    <ChevronUp size={14} className="todo-arrow-sf" />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
