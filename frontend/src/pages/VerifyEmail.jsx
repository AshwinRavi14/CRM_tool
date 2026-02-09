import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, RefreshCw, ChevronRight, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './VerifyEmail.css';

const VerifyEmail = () => {
    const { user, resendVerification } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { success: toastSuccess, error: toastError } = useToast();
    const [isResending, setIsResending] = useState(false);

    // Get email from state or user object
    const userEmail = location.state?.email || user?.email || 'your email';

    // Trial dates logic (Mocking for UI match)
    const trialStartDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const handleResend = async () => {
        if (isResending) return;
        setIsResending(true);
        try {
            await resendVerification(userEmail);
            toastSuccess('Verification email resent! Please check your inbox.');
        } catch (err) {
            toastError(err.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setIsResending(false);
        }
    };

    const handleContinue = () => {
        // Allow temporary access - take them to the onboarding dashboard
        navigate('/onboarding');
    };

    return (
        <div className="verify-email-container">
            <div className="verify-email-card fade-in">
                <div className="verify-card-header">
                    <div className="mail-icon-circle">
                        <Mail size={32} />
                    </div>
                    <h1>Check your email</h1>
                </div>

                <div className="verify-card-body">
                    <p className="invite-text">
                        We've sent a verification link to <strong>{userEmail}</strong>.
                        Please click the link to verify your account and continue.
                    </p>

                    <div className="verify-actions">
                        <button className="btn-continue-product" onClick={handleContinue}>
                            Continue to product (skip verification)
                        </button>

                        <button
                            className={`btn-resend-email ${isResending ? 'loading' : ''}`}
                            onClick={handleResend}
                            disabled={isResending}
                        >
                            {isResending ? <RefreshCw size={16} className="spin" /> : null}
                            {isResending ? 'Resending...' : 'Resend email'}
                        </button>
                    </div>
                </div>

                <div className="verify-card-footer">
                    <div className="trial-info">
                        <div className="trial-row">
                            <span className="label">Trial started:</span>
                            <span className="value">{trialStartDate}</span>
                        </div>
                        <div className="trial-row">
                            <span className="label">Ends:</span>
                            <span className="value">{trialEndDate}</span>
                        </div>
                    </div>

                    <div className="progress-info">
                        <span className="label">Onboarding Progress:</span>
                        <span className="value">Step 2 of 4</span>
                    </div>

                    <div className="help-link">
                        <a href="/support">
                            Need help? Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
