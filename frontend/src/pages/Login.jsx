import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import {
    Square,
    Mail,
    Lock,
    Database,
    Zap,
    LineChart,
    Users,
    ShieldCheck,
    Award
} from 'lucide-react';
import { GoogleLogo, MicrosoftTeamsLogo } from '../components/common/BrandLogos';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logo from '../assets/logo.svg';
import './AuthLayout.css';

const Login = () => {
    const { login, user } = useAuth();
    const { error: toastError, success: toastSuccess } = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (user) {
        if (user.onboardingCompleted) {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/onboarding" replace />;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toastError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const user = await login(email, password);
            toastSuccess('Welcome back!');

            if (user.onboardingCompleted) {
                navigate('/dashboard');
            } else {
                navigate('/onboarding');
            }
        } catch (err) {
            console.error('Login error:', err);
            toastError(err.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-page-split">
            {/* Header Logo */}
            <div className="signup-logo-container">
                <img src={logo} alt="Wersel Logo" className="auth-logo-img" style={{ width: '32px', height: '32px', marginRight: '10px' }} />
                <span className="brand-text">WERSEL-CRM</span>
            </div>

            <div className="signup-main-container">
                {/* Left Pane: Form */}
                <div className="signup-form-pane">
                    <h1>Sign in to WERSEL-CRM</h1>
                    <p className="subtitle">Enter your credentials to access your customer relationship platform.</p>

                    <form className="signup-form-sf" onSubmit={handleSubmit}>
                        <div className="form-group-sf">
                            <label>Work Email</label>
                            <div className="input-with-icon-sf">
                                <Mail size={16} className="field-icon" />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-sf">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label>Password</label>
                                <a href="#" style={{ fontSize: '0.7rem', color: '#0176d3', textDecoration: 'none' }}>Forgot password?</a>
                            </div>
                            <div className="input-with-icon-sf">
                                <Lock size={16} className="field-icon" />
                                <input
                                    type="password"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="signup-btn-sf" disabled={isLoading} style={{ marginTop: '20px' }}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="login-link-container">
                            New to WERSEL-CRM? <Link to="/signup">Create an account</Link>
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

                    <h2>Accelerate Your Business Growth</h2>

                    <div className="benefit-list">
                        <div className="benefit-item">
                            <Database size={20} className="benefit-icon" />
                            <div className="benefit-content">
                                <strong>360-Degree Customer View</strong>
                                <p>Get a complete understanding of every customer interaction and history.</p>
                            </div>
                        </div>

                        <div className="benefit-item">
                            <Zap size={20} className="benefit-icon" />
                            <div className="benefit-content">
                                <strong>Intelligent Automation</strong>
                                <p>Let AI handle the routine work so you can focus on building relationships.</p>
                            </div>
                        </div>

                        <div className="benefit-item">
                            <LineChart size={20} className="benefit-icon" />
                            <div className="benefit-content">
                                <strong>Real-Time Analytics</strong>
                                <p>Make data-driven decisions with live dashboards and predictive insights.</p>
                            </div>
                        </div>

                        <div className="benefit-item">
                            <Users size={20} className="benefit-icon" />
                            <div className="benefit-content">
                                <strong>Seamless Collaboration</strong>
                                <p>Connect your teams across sales, marketing, and support effortlessly.</p>
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
                <span>© 2026 WERSEL-CRM. All rights reserved.</span>
                <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Support</a>
            </footer>
        </div>
    );
};

export default Login;
