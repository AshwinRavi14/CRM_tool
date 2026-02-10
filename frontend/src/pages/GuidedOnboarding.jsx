import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import {
    Building2,
    Target,
    Database,
    ChevronRight,
    ChevronLeft,
    Users,
    BarChart3,
    Calendar,
    MessageSquare,
    CheckCircle2,
    ShieldCheck,
    Rocket
} from 'lucide-react';
import BillingModal from '../components/common/BillingModal';
import './GuidedOnboarding.css';

const GuidedOnboarding = () => {
    const { user, completeOnboarding } = useAuth();
    const navigate = useNavigate();
    const { success: toastSuccess, error: toastError } = useToast();

    React.useEffect(() => {
        if (user && user.onboardingCompleted) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const [step, setStep] = useState(1);
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [formData, setFormData] = useState({
        companyName: user?.companyName || '',
        role: user?.role || '',
        teamSize: '',
        primaryGoals: [],
        seedDemoData: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSelectOption = (name, value) => {
        if (name === 'primaryGoals') {
            const currentGoals = formData.primaryGoals || [];
            const newGoals = currentGoals.includes(value)
                ? currentGoals.filter(g => g !== value)
                : [...currentGoals, value];
            setFormData({ ...formData, primaryGoals: newGoals });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        if (step === 3 && !showBillingModal) {
            setShowBillingModal(true);
            return;
        }

        await finalizeOnboarding();
    };

    const finalizeOnboarding = async (billingData = null) => {
        setIsSubmitting(true);
        try {
            const finalData = { ...formData };
            if (billingData) {
                // Call the billing API using standardized apiClient
                await apiClient.post('/billing', {
                    cardDetails: billingData,
                    plan: 'PROFESSIONAL'
                });
            }

            await completeOnboarding(finalData);
            toastSuccess('Onboarding complete! Welcome to your dashboard.');
            navigate('/dashboard');
        } catch (err) {
            toastError('Failed to complete onboarding. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="onboarding-wizard">
            <div className="wizard-container">
                <div className="wizard-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
                </div>

                <div className="wizard-content">
                    {step === 1 && (
                        <div className="step-fade-in">
                            <h2>Tell us about your workspace</h2>
                            <p>We'll customize your CRM experience based on your team.</p>

                            <div className="onboarding-form">
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="Enter your company name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>What is your role?</label>
                                    <select name="role" value={formData.role} onChange={handleChange}>
                                        <option value="">Select Role</option>
                                        <option value="SALES_MANAGER">Sales Manager</option>
                                        <option value="SALES_REP">Sales Representative</option>
                                        <option value="FOUNDER">Founder / CEO</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Approximate team size</label>
                                    <div className="option-grid">
                                        {['1-10', '11-50', '51-200', '200+'].map(size => (
                                            <button
                                                key={size}
                                                className={`option-btn ${formData.teamSize === size ? 'selected' : ''}`}
                                                onClick={() => handleSelectOption('teamSize', size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-fade-in">
                            <h2>What do you want to do first?</h2>
                            <p>Select your primary goal to help us personalize your dashboard.</p>

                            <div className="goal-grid">
                                {[
                                    { id: 'leads', icon: Users, title: 'Track Leads', desc: 'Manage your sales pipeline effectively.' },
                                    { id: 'activities', icon: Calendar, title: 'Manage Activities', desc: 'Schedule calls, meetings, and tasks.' },
                                    { id: 'reports', icon: BarChart3, title: 'View Reports', desc: 'Get insights into team performance.' },
                                    { id: 'collab', icon: MessageSquare, title: 'Team Collaboration', desc: 'Work together on accounts and deals.' }
                                ].map(goal => (
                                    <div
                                        key={goal.id}
                                        className={`goal-card ${(formData.primaryGoals || []).includes(goal.id) ? 'selected' : ''}`}
                                        onClick={() => handleSelectOption('primaryGoals', goal.id)}
                                    >
                                        <goal.icon size={24} className="goal-icon" />
                                        <h3>{goal.title}</h3>
                                        <p>{goal.desc}</p>
                                        {(formData.primaryGoals || []).includes(goal.id) && <CheckCircle2 className="selected-icon" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-fade-in">
                            <h2>Set up your data</h2>
                            <p>Start with a clean slate or use demo data to explore features.</p>

                            <div className="data-option-box">
                                <div className="data-option active">
                                    <div className="data-icon-box">
                                        <Database size={32} />
                                    </div>
                                    <div className="data-text">
                                        <h3>Populate with Demo Data</h3>
                                        <p>We'll add sample leads, activities, and reports so you can see how everything works immediately.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="seedDemoData"
                                        checked={formData.seedDemoData}
                                        onChange={handleChange}
                                        className="onboarding-checkbox"
                                    />
                                </div>

                                <div className="trust-badge-onboarding">
                                    <ShieldCheck size={16} />
                                    <span>You can clear this data anytime in Settings.</span>
                                </div>
                            </div>

                            <div className="final-confirmation">
                                <div className="conf-item">
                                    <CheckCircle2 size={16} />
                                    <span>14-day Professional trial active</span>
                                </div>
                                <div className="conf-item">
                                    <CheckCircle2 size={16} />
                                    <span>No credit card required</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="wizard-footer">
                    {step > 1 && (
                        <button className="btn-back" onClick={handlePrev}>
                            <ChevronLeft size={18} />
                            <span>Back</span>
                        </button>
                    )}
                    <div style={{ flex: 1 }}></div>
                    {step < 3 ? (
                        <button className="btn-next btn-primary" onClick={handleNext} disabled={step === 1 && !formData.companyName}>
                            <span>Continue</span>
                            <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button className="btn-next btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                            <span>{isSubmitting ? 'Setting up...' : 'Go to Dashboard'}</span>
                            <Rocket size={18} />
                        </button>
                    )}
                </div>
            </div>

            <BillingModal
                isOpen={showBillingModal}
                onClose={() => setShowBillingModal(false)}
                onSave={(billingData) => finalizeOnboarding(billingData)}
                onSkip={() => finalizeOnboarding()}
            />
        </div>
    );
};

export default GuidedOnboarding;
