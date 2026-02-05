import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    Square,
    Mail,
    Lock,
    User,
    Building2,
    Briefcase,
    Chrome,
    Cloud,
    ShieldCheck,
    ChevronRight,
    Rocket
} from 'lucide-react';
import './Signup.css';

const Signup = () => {
    const { signup, user } = useAuth();
    const navigate = useNavigate();
    const { toastSuccess, toastError } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        role: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // If user is already logged in, redirect to dashboard or onboarding
    React.useEffect(() => {
        if (user) {
            if (user.onboardingCompleted) {
                navigate('/dashboard');
            } else {
                navigate('/guided-onboarding');
            }
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newUser = await signup(formData);
            toastSuccess('Account created! Let\'s set up your workspace.');

            if (newUser.onboardingCompleted) {
                navigate('/dashboard');
            } else {
                navigate('/guided-onboarding');
            }
        } catch (err) {
            console.error('Signup error:', err);
            toastError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-trial-page">
            <div className="signup-bg-overlay"></div>

            <div className="signup-container">
                <div className="signup-header">
                    <div className="logo-box">
                        <Square size={32} fill="#0176d3" color="#0176d3" />
                    </div>
                    <h1>Start your 14-day free trial</h1>
                    <p className="subtitle">No credit card required. Experience CRM Suite's full power.</p>
                </div>

                <div className="signup-scroll-area">
                    <div className="social-signup-options">
                        <button className="social-btn" type="button">
                            <Chrome size={20} />
                            <span>Sign up with Google</span>
                        </button>
                        <button className="social-btn" type="button">
                            <Cloud size={20} />
                            <span>Sign up with Microsoft Teams</span>
                        </button>
                        <button className="social-btn" type="button">
                            <ShieldCheck size={20} />
                            <span>Sign up with SSO</span>
                        </button>
                    </div>

                    <div className="form-divider">
                        <span>Or continue with email</span>
                    </div>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full name</label>
                            <div className="input-wrapper">
                                <User size={18} className="field-icon" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Work email</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="field-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john.doe@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="field-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="password-strength">
                                <div className="strength-bar"></div>
                                <div className="strength-bar"></div>
                                <div className="strength-bar"></div>
                                <div className="strength-bar"></div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Company name (optional)</label>
                            <div className="input-wrapper">
                                <Building2 size={18} className="field-icon" />
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Acme Corp."
                                    value={formData.companyName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <div className="input-wrapper">
                                <Briefcase size={18} className="field-icon" />
                                <select name="role" value={formData.role} onChange={handleChange}>
                                    <option value="">Select your role</option>
                                    <option value="SALES_MANAGER">Sales Manager</option>
                                    <option value="SALES_REP">Sales Representative</option>
                                    <option value="ACCOUNT_MANAGER">Account Manager</option>
                                    <option value="FOUNDER">Founder / CEO</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            <Rocket size={18} />
                            <span>{isLoading ? 'Creating account...' : 'Start Free Trial'}</span>
                        </button>
                    </form>

                    <div className="signup-footer">
                        Already have an account? <Link to="/login">Log in</Link>
                    </div>

                    <div className="legal-notice">
                        By clicking “Start Free Trial”, you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>.
                        <br />
                        This site is protected by reCAPTCHA and the Google <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
