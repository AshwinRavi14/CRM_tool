import React from 'react';
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Lock,
    Mail,
    Smartphone,
    CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BillingModal from '../components/common/BillingModal';
import './Settings.css';

const Settings = () => {
    const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = React.useState('profile');
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');
    const [reducedMotion, setReducedMotion] = React.useState(localStorage.getItem('reducedMotion') === 'true');
    const [showBillingModal, setShowBillingModal] = React.useState(false);
    const [billingInfo, setBillingInfo] = React.useState(null);

    React.useEffect(() => {
        if (activeTab === 'billing') {
            fetchBillingInfo();
        }
    }, [activeTab]);

    const fetchBillingInfo = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/billing`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setBillingInfo(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch billing info', err);
        }
    };

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    React.useEffect(() => {
        if (reducedMotion) {
            document.documentElement.style.scrollBehavior = 'auto';
        } else {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
        localStorage.setItem('reducedMotion', reducedMotion);
    }, [reducedMotion]);

    const sections = [
        { id: 'profile', title: 'Profile Information', icon: <User size={20} />, description: 'Update your personal details and public profile.' },
        { id: 'notifications', title: 'Notification Settings', icon: <Bell size={20} />, description: 'Configure how you receive alerts and updates.' },
        { id: 'security', title: 'Security & Privacy', icon: <Shield size={20} />, description: 'Manage passwords and 2FA settings.' },
        { id: 'billing', title: 'Billing & Subscription', icon: <CreditCard size={20} />, description: 'Manage your plan and payment methods.' },
        { id: 'appearance', title: 'Appearance', icon: <Palette size={20} />, description: 'Choose between dark, light, and custom glass themes.' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="settings-section fade-in">
                        <h3>Profile Information</h3>
                        <div className="profile-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" className="glass" defaultValue={authUser?.firstName || ''} />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" className="glass" defaultValue={authUser?.lastName || ''} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-with-icon glass">
                                    <Mail size={16} />
                                    <input type="email" defaultValue={authUser?.email || ''} readOnly />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <input type="text" className="glass" defaultValue={authUser?.role?.replace('_', ' ') || ''} readOnly />
                            </div>

                            <div className="form-actions">
                                <button className="cancel-btn">Discard Changes</button>
                                <button className="save-btn">Save Preferences</button>
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="settings-section fade-in">
                        <h3>Notification Settings</h3>
                        <div className="settings-group">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Email Notifications</h4>
                                    <p>Receive daily summaries and important alerts via email.</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Push Notifications</h4>
                                    <p>Get real-time updates on your desktop or mobile device.</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Weekly Digest</h4>
                                    <p>A weekly report of your team's performance and key metrics.</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="save-btn">Save Preferences</button>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="settings-section fade-in">
                        <h3>Security & Privacy</h3>
                        <div className="profile-form">
                            <div className="form-group">
                                <label>Current Password</label>
                                <div className="input-with-icon glass">
                                    <Lock size={16} />
                                    <input type="password" placeholder="Enter current password" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>New Password</label>
                                    <div className="input-with-icon glass">
                                        <Lock size={16} />
                                        <input type="password" placeholder="Enter new password" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <div className="input-with-icon glass">
                                        <Lock size={16} />
                                        <input type="password" placeholder="Confirm new password" />
                                    </div>
                                </div>
                            </div>
                            <div className="divider-h my-4" style={{ borderColor: 'var(--border)' }}></div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Two-Factor Authentication</h4>
                                    <p>Add an extra layer of security to your account.</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="form-actions">
                                <button className="save-btn">Update Security</button>
                            </div>
                        </div>
                    </div>
                );
            case 'appearance':
                return (
                    <div className="settings-section fade-in">
                        <h3>Appearance</h3>
                        <div className="theme-grid">
                            <div
                                className={`theme-card glass ${theme === 'dark' ? 'active' : ''}`}
                                onClick={() => setTheme('dark')}
                            >
                                <div className="theme-preview dark"></div>
                                <span>Midnight Glass</span>
                            </div>
                            <div
                                className={`theme-card glass ${theme === 'light' ? 'active' : ''}`}
                                onClick={() => setTheme('light')}
                            >
                                <div className="theme-preview light"></div>
                                <span>Daylight Glass</span>
                            </div>
                            <div
                                className={`theme-card glass ${theme === 'ocean' ? 'active' : ''}`}
                                onClick={() => setTheme('ocean')}
                            >
                                <div className="theme-preview ocean"></div>
                                <span>Ocean Depth</span>
                            </div>
                        </div>
                        <div className="setting-item mt-4">
                            <div className="setting-info">
                                <h4>Reduced Motion</h4>
                                <p>Minimize animations for a simpler experience.</p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={reducedMotion}
                                    onChange={(e) => setReducedMotion(e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                );
            case 'billing':
                return (
                    <div className="settings-section fade-in">
                        <h3>Billing & Subscription</h3>
                        <div className="settings-group">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Current Plan</h4>
                                    <p>{billingInfo?.subscriptionPlan || 'TRIAL'} - {billingInfo?.subscriptionStatus || 'TRIALING'}</p>
                                    {billingInfo?.trialEndsAt && (
                                        <p className="mt-2" style={{ fontSize: '12px', color: 'var(--primary)' }}>
                                            Trial expires on {new Date(billingInfo.trialEndsAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <button className="save-btn" style={{ padding: '8px 16px' }}>Upgrade Plan</button>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Payment Method</h4>
                                    {billingInfo?.billingDetails?.last4 ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>{billingInfo.billingDetails.cardBrand} ending in {billingInfo.billingDetails.last4}</span>
                                        </div>
                                    ) : (
                                        <p>No payment method on file.</p>
                                    )}
                                </div>
                                <button
                                    className="cancel-btn"
                                    style={{ border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px' }}
                                    onClick={() => setShowBillingModal(true)}
                                >
                                    {billingInfo?.billingDetails?.last4 ? 'Edit Details' : 'Add Card'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleSaveBilling = async (billingData) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/billing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ cardDetails: billingData, plan: 'PROFESSIONAL' })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setBillingInfo(data.data);
                setShowBillingModal(false);
            }
        } catch (err) {
            console.error('Failed to save billing info', err);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header glass-card">
                <div className="header-info">
                    <h2>Settings</h2>
                    <p>Manage your account preferences and system configuration.</p>
                </div>
            </div>

            <div className="settings-grid">
                <div className="settings-nav glass-card">
                    <ul className="settings-menu">
                        {sections.map((section) => (
                            <li
                                key={section.id}
                                className={activeTab === section.id ? 'active' : ''}
                                onClick={() => setActiveTab(section.id)}
                            >
                                <span className="menu-icon">{section.icon}</span>
                                <div className="menu-text">
                                    <span className="menu-title">{section.title}</span>
                                    <span className="menu-desc">{section.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="settings-main glass-card">
                    {renderContent()}
                </div>
            </div>

            <BillingModal
                isOpen={showBillingModal}
                onClose={() => setShowBillingModal(false)}
                onSave={handleSaveBilling}
                onSkip={() => setShowBillingModal(false)}
            />
        </div>
    );
};

export default Settings;
