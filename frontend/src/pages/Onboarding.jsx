import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Square,
    User,
    Mail,
    Lock,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import './AuthLayout.css';

const Onboarding = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [inviteInfo, setInviteInfo] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const res = await apiClient.get(`/invitations/${token}`);
                setInviteInfo(res.data);
            } catch (err) {
                toast.error(err.message || 'Invalid or expired invitation link');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };
        validateToken();
    }, [token, navigate, toast]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.post('/invitations/accept', {
                token,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password
            });
            toast.success('Account created successfully! Welcome to the team.');
            navigate('/login');
        } catch (err) {
            toast.error(err.message || 'Failed to complete onboarding');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="auth-loading-screen">
                <div className="spinner"></div>
                <p>Validating invitation...</p>
            </div>
        );
    }

    return (
        <div className="signup-page-split">
            <div className="signup-logo-container">
                <Square size={28} fill="#0176d3" color="#0176d3" />
                <span className="brand-text">CRM Suite</span>
            </div>

            <div className="signup-main-container">
                <div className="signup-form-pane">
                    <h1>Join the Wersel Team</h1>
                    <p className="subtitle">
                        Completing setup for <span className="text-primary">{inviteInfo?.email}</span>
                        <br />
                        Authorized Role: <span className="role-badge" style={{ marginTop: '5px' }}>{inviteInfo?.role.replace('_', ' ')}</span>
                    </p>

                    <form className="signup-form-sf" onSubmit={handleSubmit}>
                        <div className="row-sf">
                            <div className="form-group-sf">
                                <label>First Name</label>
                                <div className="input-with-icon-sf">
                                    <User size={16} className="field-icon" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group-sf">
                                <label>Last Name</label>
                                <div className="input-with-icon-sf">
                                    <User size={16} className="field-icon" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group-sf">
                            <label>Password</label>
                            <div className="input-with-icon-sf">
                                <Lock size={16} className="field-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a secure password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-sf">
                            <label>Confirm Password</label>
                            <div className="input-with-icon-sf">
                                <Lock size={16} className="field-icon" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Repeat password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="signup-btn-sf" disabled={isSubmitting}>
                            {isSubmitting ? 'Finalizing Setup...' : 'Complete Onboarding'}
                            <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                        </button>

                        <div className="login-link-container">
                            Already joined? <Link to="/login">Log in</Link>
                        </div>
                    </form>
                </div>

                <div className="signup-info-pane">
                    <div className="onboarding-welcome-card glass-card">
                        <ShieldCheck size={48} color="var(--primary)" />
                        <h2>Welcome Aboard!</h2>
                        <p>You've been added to our centralized CRM ecosystem. Your access has been pre-configured by an administrator to match your professional role.</p>

                        <div className="security-badges" style={{ marginTop: '20px' }}>
                            <div className="s-badge"><ShieldCheck size={14} /> Enterprise Encrypted</div>
                            <div className="s-badge"><ShieldCheck size={14} /> Role-Based Access</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
