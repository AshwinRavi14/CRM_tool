import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Mail,
    Upload,
    Layout,
    Compass,
    Info,
    X,
    ChevronRight,
    Settings,
    Cloud,
    Search,
    Bell,
    HelpCircle,
    Twitter,
    Linkedin,
    Facebook,
    Instagram,
    Youtube,
    CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './OnboardingDashboard.css';

const OnboardingDashboard = () => {
    const { user, completeOnboarding } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.onboardingCompleted) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const [showBanner, setShowBanner] = useState(true);
    const [showTips, setShowTips] = useState(user?.showRoleTips ?? true);
    const [sampleData, setSampleData] = useState(user?.showSampleData ?? false);
    const [checklistStatus, setChecklistStatus] = useState(user?.onboardingChecklist || {});

    const updatePersistence = async (updates) => {
        try {
            // Also ensure isFirstLogin is set to false as they are active in the dashboard
            const finalUpdates = { ...updates };
            if (user?.isFirstLogin) {
                finalUpdates.isFirstLogin = false;
            }
            await completeOnboarding(finalUpdates);
        } catch (err) {
            console.error('Failed to update onboarding state', err);
        }
    };

    const handleToggleTips = () => {
        const newValue = !showTips;
        setShowTips(newValue);
        updatePersistence({ showRoleTips: newValue });
    };

    const handleToggleSampleData = () => {
        const newValue = !sampleData;
        setSampleData(newValue);
        updatePersistence({ showSampleData: newValue });
    };

    const handleChecklistAction = (id, isSkip = false) => {
        const newStatus = { ...checklistStatus, [id]: isSkip ? 'SKIPPED' : 'COMPLETED' };
        setChecklistStatus(newStatus);
        updatePersistence({ onboardingChecklist: newStatus });
    };

    const checklistItems = [
        {
            id: 'invite',
            title: 'Invite Team Members',
            desc: 'Collaborate effectively by inviting your colleagues to CRM Suite and assigning their roles.',
            icon: Users,
            action: 'Invite Now',
            highlight: true
        },
        {
            id: 'connect',
            title: 'Connect Inbox/Calendar',
            desc: 'Integrate your email and calendar to automatically log communications and meetings.',
            icon: Mail,
            action: 'Connect'
        },
        {
            id: 'import',
            title: 'Import Contacts',
            desc: 'Bring in your existing customer and lead data from spreadsheets or other systems.',
            icon: Upload,
            action: 'Import'
        },
        {
            id: 'pipeline',
            title: 'Create Your First Pipeline',
            desc: 'Define your sales process stages to track deals and manage opportunities effectively.',
            icon: Layout,
            action: 'Build Pipeline'
        },
        {
            id: 'tour',
            title: 'Take Product Tour',
            desc: 'Explore the core functionalities and hidden gems of CRM Suite with an interactive guide.',
            icon: Compass,
            action: 'Start Tour'
        }
    ];

    return (
        <div className="onboarding-page-wrapper">
            {/* Custom Header for Onboarding Dashboard */}
            <header className="header-salesforce">
                <div className="header-top-row">
                    <div className="header-left-sf">
                        <div className="logo-sf">
                            <Cloud size={32} color="#0176d3" fill="#0176d3" />
                            <span style={{ marginLeft: '8px', fontWeight: 700, fontSize: '18px', color: '#0176d3' }}>CRM Suite Onboarding</span>
                        </div>
                    </div>

                    <div className="header-nav-inline" style={{ display: 'flex', gap: '32px', marginLeft: '40px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer' }}>Home</span>
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '2px solid var(--primary)', paddingBottom: '4px', cursor: 'pointer' }}>Dashboard</span>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer' }}>Customers</span>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer' }}>Deals</span>
                    </div>

                    <div className="header-right-sf" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Search size={18} color="var(--text-muted)" />
                        <Bell size={18} color="var(--text-muted)" />
                        <HelpCircle size={18} color="var(--text-muted)" />
                        <div className="avatar-circle-sf" style={{ width: '32px', height: '32px' }}>
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.firstName || 'User'}+${user?.lastName || ''}&background=707e94&color=fff`}
                                alt="Profile"
                                className="avatar-img-sf"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="onboarding-dashboard fade-in">
                <div className="welcome-header">
                    <h1>Welcome to CRM Suite, {user?.firstName || 'Jane'}! Let's get you set up.</h1>
                </div>

                {showBanner && (
                    <div className="welcome-banner">
                        <div className="banner-content">
                            <div className="banner-info-icon">
                                <Info size={24} />
                            </div>
                            <div className="banner-text">
                                <h2>Welcome to CRM Suite!</h2>
                                <p>Start your journey with a quick product tour to discover key features and maximize your trial experience.</p>
                            </div>
                        </div>
                        <div className="banner-actions">
                            <button className="btn-start-tour">
                                Start Product Tour <ChevronRight size={16} />
                            </button>
                            <button className="btn-close-banner" onClick={() => setShowBanner(false)}>
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                )}

                <section className="checklist-section">
                    <h2 className="section-title">Your Onboarding Checklist</h2>
                    <div className="checklist-grid">
                        {checklistItems.map((item) => (
                            <div key={item.id} className={`checklist-card ${item.highlight && !checklistStatus[item.id] ? 'highlighted' : ''} ${checklistStatus[item.id] ? 'completed' : ''}`}>
                                <div className="checklist-card-top">
                                    <div className="card-icon-wrapper">
                                        <item.icon size={20} />
                                    </div>
                                    <h3>{item.title} {checklistStatus[item.id] === 'COMPLETED' && <CheckCircle2 size={16} color="var(--success)" style={{ marginLeft: '8px' }} />}</h3>
                                    <p>{item.desc}</p>
                                </div>
                                <div className="checklist-card-footer">
                                    <button
                                        className="btn-card-action"
                                        disabled={!!checklistStatus[item.id]}
                                        onClick={() => handleChecklistAction(item.id)}
                                    >
                                        {checklistStatus[item.id] === 'COMPLETED' ? 'Completed' : item.action}
                                    </button>
                                    {!checklistStatus[item.id] && (
                                        <button className="btn-card-skip" onClick={() => handleChecklistAction(item.id, true)}>Skip</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="tips-section">
                    <div className="tips-header">
                        <h3>Your Role-Specific Tips</h3>
                        <p>As an Admin, you can set up global organizational settings, manage users, and configure integrations. Start by defining your team roles.</p>
                    </div>
                    <div className="tips-controls">
                        <button className="admin-settings-link">
                            <Settings size={14} />
                            Go to Admin Settings
                        </button>
                        <div className="toggle-container">
                            <span className="toggle_label_left" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sales Rep</span>
                            <div
                                className={`toggle-switch ${showTips ? 'on' : ''}`}
                                onClick={handleToggleTips}
                            >
                                <div className="toggle-knob"></div>
                            </div>
                            <span className="toggle_label_right" style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Admin</span>
                        </div>
                    </div>
                </section>

                <section className="sample-data-section">
                    <div className="sample-data-info">
                        <h3>Explore with Sample Data</h3>
                        <p>Toggle sample data to explore CRM Suite functionalities without affecting your live data.</p>
                    </div>
                    <div className="toggle-container">
                        <span className="toggle-label">Off</span>
                        <div
                            className={`toggle-switch ${sampleData ? 'on' : ''}`}
                            onClick={handleToggleSampleData}
                        >
                            <div className="toggle-knob"></div>
                        </div>
                        <span className="toggle-label">On</span>
                    </div>
                </section>
            </div>

            <footer className="onboarding-footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <h2>
                            <Cloud size={24} color="#0176d3" fill="#0176d3" />
                            CRM Suite Onboarding
                        </h2>
                        <p>© 2025 CRM Suite Onboarding. All rights reserved.</p>
                        <div className="social-links">
                            <Twitter size={18} className="social-icon" />
                            <Linkedin size={18} className="social-icon" />
                            <Facebook size={18} className="social-icon" />
                            <Instagram size={18} className="social-icon" />
                            <Youtube size={18} className="social-icon" />
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Services</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Cookies</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingDashboard;
