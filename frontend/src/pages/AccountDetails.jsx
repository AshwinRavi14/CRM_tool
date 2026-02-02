import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Building2,
    Globe,
    Phone,
    Mail,
    MapPin,
    Users,
    Activity,
    Briefcase,
    Calendar,
    Clock,
    Plus,
    ExternalLink,
    History,
    Target,
    Edit // Added Edit icon just in case, though might use Plus
} from 'lucide-react';
import apiClient from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import AccountModal from '../components/accounts/AccountModal';
import ProjectModal from '../components/projects/ProjectModal';
import ContactModal from '../components/contacts/ContactModal';
import './AccountDetails.css';

const AccountDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const fetchAccountDetails = async () => {
        try {
            const response = await apiClient.get(`/accounts/${id}`);
            setAccount(response.data.data || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching account details:', error);
            toast.error('Failed to load account details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountDetails();
    }, [id]);

    const handleUpdateAccount = async (formData) => {
        try {
            await apiClient.put(`/accounts/${id}`, formData);
            toast.success('Account information updated');
            setShowAccountModal(false);
            fetchAccountDetails();
        } catch (error) {
            toast.error('Failed to update account information');
        }
    };

    const handleSaveProject = async (projectData) => {
        try {
            // Ensure project is linked to this account ID if the backend expects it
            // or use account name as requested by the schema currently
            await apiClient.post('/projects', {
                ...projectData,
                account: account.companyName // Link by name for consistency with existing projects
            });
            toast.success('Project created successfully');
            setShowProjectModal(false);
            fetchAccountDetails();
        } catch (error) {
            toast.error('Failed to create project');
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading account intelligence...</p>
        </div>
    );

    if (!account) return (
        <div className="error-container glass-card">
            <p>Account not found.</p>
            <button className="primary-btn" onClick={() => navigate('/accounts')}>Back to Registry</button>
        </div>
    );

    // Mock history and future plans if not in schema
    const history = [
        { date: 'Oct 12, 2025', action: 'Lead converted to Account', user: 'System' },
        { date: 'Oct 15, 2025', action: 'Initial strategy meeting scheduled', user: 'Cleona Davis' },
        { date: 'Oct 20, 2025', action: 'Project "Lung Cancer Detection FNN" initiated', user: 'John Smith' }
    ];

    const futurePlans = [
        { date: 'Nov 2025', goal: 'Phase 2 expansion for predictive maintenance' },
        { date: 'Jan 2026', goal: 'Integration with cloud-based inference engine' }
    ];

    const ongoingProjects = account.projects?.filter(p => p.status !== 'COMPLETED') || [];
    const completedProjects = account.projects?.filter(p => p.status === 'COMPLETED') || [];

    return (
        <div className="account-details-container">
            <div className="details-header">
                <div className="header-left">
                    <button className="back-btn glass" onClick={() => navigate('/accounts')}>
                        <ChevronLeft size={20} />
                    </button>
                    <div className="account-title-group">
                        <div className="account-avatar glass">
                            <Building2 size={32} color="var(--primary)" />
                        </div>
                        <div>
                            <h2>{account.companyName}</h2>
                            <p className="industry-tag">{account.industry?.replace('_', ' ')}</p>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="action-btn glass" onClick={() => setShowProjectModal(true)}>
                        <Plus size={18} /> <span>New Project</span>
                    </button>
                </div>
            </div>

            <div className="details-grid">
                {/* Left Column - Core Info */}
                <div className="details-sidebar">
                    <div className="info-card glass-card">
                        <h3>Contact Information</h3>
                        <div className="info-list">
                            <div className="info-item">
                                <Globe size={16} />
                                {account.website ? (
                                    <a href={`https://${account.website}`} target="_blank" rel="noreferrer">{account.website}</a>
                                ) : (
                                    <span className="add-link" onClick={() => setShowAccountModal(true)}>Add website</span>
                                )}
                            </div>
                            <div className="info-item">
                                <Mail size={16} />
                                <span>{account.email || <span className="add-link" onClick={() => setShowAccountModal(true)}>Add email</span>}</span>
                            </div>
                            <div className="info-item">
                                <Phone size={16} />
                                <span>{account.phone || <span className="add-link" onClick={() => setShowAccountModal(true)}>Add phone</span>}</span>
                            </div>
                            <div className="info-item">
                                <MapPin size={16} />
                                <span>{(account.billingAddress && account.billingAddress.city) || <span className="add-link" onClick={() => setShowAccountModal(true)}>Add location</span>}</span>
                            </div>
                        </div>
                        <button className="edit-info-btn" onClick={() => setShowAccountModal(true)}>Edit All</button>
                    </div>

                    <div className="stats-card glass-card">
                        <div className="card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Key Contacts</h3>
                            <button
                                className="icon-btn-sm glass"
                                onClick={() => setShowContactModal(true)}
                                title="Add Contact"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="mini-contact-list">
                            {account.contacts?.length > 0 ? account.contacts.map(c => (
                                <div key={c._id} className="mini-contact-item glass">
                                    <div className="c-avatar">{c.firstName[0]}</div>
                                    <div className="c-info">
                                        <span>{c.firstName} {c.lastName}</span>
                                        <small>{c.title || 'Decision Maker'}</small>
                                    </div>
                                </div>
                            )) : <p className="empty-msg">No contacts linked yet</p>}
                        </div>
                    </div>

                    <div className="stats-card glass-card">
                        <div className="stat-item">
                            <label>Account Type</label>
                            <span className={`type-badge ${account.accountType?.toLowerCase()}`}>{account.accountType}</span>
                        </div>
                        <div className="stat-item">
                            <label>Lifecycle Stage</label>
                            <span>{account.salesStage || 'Discovery'}</span>
                        </div>
                        <div className="stat-item">
                            <label>Account Owner</label>
                            <div className="owner-info">
                                <Users size={14} />
                                <span>{account.owner?.firstName} {account.owner?.lastName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Activity & Projects */}
                <div className="details-main">
                    <div className="tabs-container">
                        <div className="main-sections">
                            {/* Projects Section */}
                            <div className="content-section glass-card">
                                <div className="section-header">
                                    <div className="title-with-icon">
                                        <Briefcase size={20} color="var(--primary)" />
                                        <h3>Projects Portfolio</h3>
                                    </div>
                                </div>

                                <div className="projects-segments">
                                    <div className="project-group">
                                        <h4>Ongoing ({ongoingProjects.length})</h4>
                                        <div className="mini-project-list">
                                            {ongoingProjects.length > 0 ? ongoingProjects.map(p => (
                                                <div key={p._id} className="mini-project-card glass" onClick={() => navigate(`/projects/${p._id}`)}>
                                                    <div className="p-info">
                                                        <h5>{p.name}</h5>
                                                        <div className="p-progress">
                                                            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${p.progress}%` }}></div></div>
                                                            <span>{p.progress}%</span>
                                                        </div>
                                                    </div>
                                                    <ExternalLink size={14} />
                                                </div>
                                            )) : <p className="empty-msg">No active projects</p>}
                                        </div>
                                    </div>

                                    <div className="project-group">
                                        <h4>Completed ({completedProjects.length})</h4>
                                        <div className="mini-project-list">
                                            {completedProjects.length > 0 ? completedProjects.map(p => (
                                                <div key={p._id} className="mini-project-card glass completed" onClick={() => navigate(`/projects/${p._id}`)}>
                                                    <div className="p-info">
                                                        <h5>{p.name}</h5>
                                                        <span className="date">Done on {new Date(p.updatedAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <Activity size={14} color="var(--success)" />
                                                </div>
                                            )) : <p className="empty-msg">No completed projects yet</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Intelligence Section (History & Plans) */}
                            <div className="intel-grid">
                                <div className="glass-card intel-card">
                                    <div className="section-header">
                                        <div className="title-with-icon">
                                            <History size={20} color="var(--accent)" />
                                            <h3>Relationship History</h3>
                                        </div>
                                    </div>
                                    <div className="timeline">
                                        {history.map((h, i) => (
                                            <div key={i} className="timeline-item">
                                                <span className="dot"></span>
                                                <div className="t-content">
                                                    <span className="date">{h.date}</span>
                                                    <p>{h.action}</p>
                                                    <small>by {h.user}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card intel-card">
                                    <div className="section-header">
                                        <div className="title-with-icon">
                                            <Target size={20} color="#f472b6" />
                                            <h3>Future Roadmap</h3>
                                        </div>
                                    </div>
                                    <div className="plans-list">
                                        {futurePlans.map((p, i) => (
                                            <div key={i} className="plan-item glass">
                                                <Calendar size={16} />
                                                <div className="p-details">
                                                    <span className="date">{p.date}</span>
                                                    <p>{p.goal}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAccountModal && (
                <AccountModal
                    onClose={() => setShowAccountModal(false)}
                    onSave={handleUpdateAccount}
                    initialData={account}
                    title="Edit Contact Information"
                />
            )}

            {showProjectModal && (
                <ProjectModal
                    onClose={() => setShowProjectModal(false)}
                    onSave={handleSaveProject}
                    initialData={{ account: account.companyName }}
                    title={`New Project for ${account.companyName}`}
                />
            )}

            {showContactModal && (
                <ContactModal
                    onClose={() => setShowContactModal(false)}
                    onSuccess={fetchAccountDetails}
                    initialAccount={account}
                />
            )}
        </div>
    );
};

export default AccountDetails;
