import React, { useState, useEffect } from 'react';
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
    ShieldCheck,
    ChevronRight,
    Rocket
} from 'lucide-react';
import { GoogleLogo, MicrosoftTeamsLogo } from '../components/common/BrandLogos';
import logo from '../assets/logo.svg';
import './Signup.css';

const Signup = () => {
    const { signup, user } = useAuth();
    const navigate = useNavigate();
    const { success: toastSuccess, error: toastError } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        role: ''
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const calculateStrength = (password) => {
        let score = 0;
        if (!password) return 0;
        if (password.length > 6) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    useEffect(() => {
        if (user) {
            // If user just signed up (unverified), don't redirect - let handleSubmit do it
            if (!user.isVerified) {
                return; // Let the explicit navigate('/verify-email') in handleSubmit take effect
            }
            // For verified users returning to signup page, redirect them appropriately
            if (user.onboardingCompleted) {
                navigate('/dashboard');
            } else {
                navigate('/onboarding');
            }
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'password') {
            setPasswordStrength(calculateStrength(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newUser = await signup(formData);
            toastSuccess('Account created! Please verify your email to continue.');
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err) {
            console.error('Signup error:', err);
            const responseData = err.response?.data;
            let errorMessage = responseData?.message || err.message || 'Failed to create account';

            if (responseData?.errors && Array.isArray(responseData.errors)) {
                errorMessage = `${errorMessage}: ${responseData.errors.join(', ')}`;
            }

            toastError(errorMessage);
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
                        <img src={logo} alt="Wersel Logo" className="auth-logo-img" style={{ width: '32px', height: '32px' }} />
                    </div>
                    <h1>Start your 14-day free trial</h1>
                    <p className="subtitle">No credit card required. Experience CRM Suite's full power.</p>
                </div>

                <div className="signup-scroll-area">
                    <div className="social-signup-options">
                        <button className="social-btn" type="button">
                            <GoogleLogo />
                            <span>Sign up with Google</span>
                        </button>
                        <button className="social-btn" type="button">
                            <MicrosoftTeamsLogo />
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
                            <div className={`password-strength level-${passwordStrength}`}>
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
