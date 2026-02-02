import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import {
    Square,
    User,
    Building,
    Mail,
    Lock,
    Database,
    Zap,
    LineChart,
    Users,
    ChevronRight,
    ShieldCheck,
    Award
} from 'lucide-react';
import { GoogleLogo, MicrosoftTeamsLogo } from '../components/common/BrandLogos';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import './AuthLayout.css';

const Signup = () => {
    const { user } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companySize: '',
        agreed: false
    });
    const [isLoading, setIsLoading] = useState(false);

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            error('Passwords do not match');
            return;
        }

        if (!formData.agreed) {
            error('Please agree to the Terms & Conditions');
            return;
        }

        setIsLoading(true);
        try {
            // Mapping fullName to firstName/lastName for existing backend compatibility if needed
            const names = formData.fullName.trim().split(' ');
            const payload = {
                firstName: names[0],
                lastName: names.slice(1).join(' ') || ' ',
                email: formData.email,
                password: formData.password,
                companyName: formData.companyName,
                role: 'ADMIN' // Default for new account signups
            };

            await apiClient.post('/auth/register', payload);
            success('Account created successfully! You can now log in.');
            navigate('/login');
        } catch (err) {
            console.error('Signup error:', err);
            error(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-page-split">
            {/* Header Logo */}
            <div className="signup-logo-container">
                <Square size={28} fill="#0176d3" color="#0176d3" />
                <span className="brand-text">CRM Suite</span>
            </div>

            <div className="signup-main-container">
                {/* Left Pane: Form */}
                <div className="signup-form-pane">
                    <h1>Create your CRM Suite Account</h1>
                    <p className="subtitle">Start your free trial today and revolutionize your customer relationships.</p>

                    <form className="signup-form-sf" onSubmit={handleSubmit}>
                        <div className="form-group-sf">
                            <label>Full Name</label>
                            <div className="input-with-icon-sf">
                                <User size={16} className="field-icon" />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-sf">
                            <label>Company Name</label>
                            <div className="input-with-icon-sf">
                                <Building size={16} className="field-icon" />
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Acme Corp"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-sf">
                            <label>Work Email</label>
                            <div className="input-with-icon-sf">
                                <Mail size={16} className="field-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john.doe@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-sf">
                            <label>Password</label>
                            <div className="input-with-icon-sf">
                                <Lock size={16} className="field-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="********"
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
                                    placeholder="********"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-sf">
                            <label>Company Size</label>
                            <select
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                required
                                className="sf-select-input"
                                style={{ paddingLeft: '12px' }}
                            >
                                <option value="" disabled>Select company size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="500+">500+ employees</option>
                            </select>
                        </div>

                        <div className="terms-container-sf">
                            <input
                                type="checkbox"
                                name="agreed"
                                checked={formData.agreed}
                                onChange={handleChange}
                                required
                            />
                            <span>
                                I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
                            </span>
                        </div>

                        <button type="submit" className="signup-btn-sf" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>

                        <div className="login-link-container">
                            Already have an account? <Link to="/login">Log in</Link>
                        </div>

                        <div className="social-signup-divider">
                            <div className="line"></div>
                            <span className="text">OR</span>
                            <div className="line"></div>
                        </div>

                        <div className="social-buttons-container">
                            <button type="button" className="social-signup-btn">
                                <GoogleLogo />
                                <span>Sign in with Google</span>
                            </button>
                            <button type="button" className="social-signup-btn">
                                <MicrosoftTeamsLogo />
                                <span>Sign in with Microsoft Teams</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Pane: Info Sidebar */}
                <div className="signup-info-pane">
                    <div className="signup-illustration-box">
                        <img src="https://img.freepik.com/free-vector/dashboard-interface-user-management-analysis-concept_107791-3065.jpg" alt="Dashboard Illustration" />
                    </div>

                    <h2>Empower Your Sales & Customer Relationships</h2>

                    <div className="benefit-list">
                        <div className="benefit-item">
                            <Database size={20} className="benefit-icon" />
                            <div className="benefit-content">
                                <strong>Centralized Customer Data</strong>
                                <p>Keep all client information organized and accessible in one place.</p>
                            </div>
                        </div>

                        <div className="benefit-item">
                            <Zap size={20} className="benefit-icon" />
                            <div className="benefit-content">
                                <strong>Automated Workflows</strong>
                                <p>Streamline repetitive tasks to focus on what matters most.</p>
                            </div>
                        </div>

                        <div className="benefit-item">
                            <LineChart size={20} className="benefit-icon" />
                            <div className="benefit-content">
                                <strong>Enhanced Sales Performance</strong>
                                <p>Track leads, manage pipelines, and close more deals efficiently.</p>
                            </div>
                        </div>

                        <div className="benefit-item">
                            <Users size={20} className="benefit-icon" />
                            <div className="benefit-content">
                                <strong>Personalized Customer Engagement</strong>
                                <p>Deliver tailored experiences that build lasting loyalty.</p>
                            </div>
                        </div>
                    </div>

                    <div className="trusted-footer">
                        <p>Trusted by leading teams worldwide</p>
                        <div className="partner-logos">
                            <ShieldCheck size={28} className="partner-icon-shield" />
                            <Award size={28} className="partner-icon-award" />
                        </div>
                    </div>
                </div>
            </div>

            <footer className="signup-page-footer">
                <span>© 2026 CRM Suite. All rights reserved.</span>
                <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Support</a>
            </footer>
        </div>
    );
};

export default Signup;
