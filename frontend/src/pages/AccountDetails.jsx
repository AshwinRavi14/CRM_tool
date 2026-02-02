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
    Plus,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    Star,
    Pencil,
    Trash2,
    Copy,
    MessageSquare,
    Calendar,
    FileText,
    History,
    MoreHorizontal,
    Info,
    UploadCloud,
    Package,
    LayoutGrid
} from 'lucide-react';
import apiClient from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import AccountModal from '../components/accounts/AccountModal';
import ContactModal from '../components/contacts/ContactModal';
import './AccountDetails.css';

const AccountDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [activeStage, setActiveStage] = useState(1);
    const [activeActivityTab, setActiveActivityTab] = useState('logCall');
    const [collapsedSections, setCollapsedSections] = useState({ about: false, touch: false });
    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(false);
    const [activityInput, setActivityInput] = useState({ type: 'logCall', comment: '', date: new Date().toISOString().split('T')[0] });

    const stages = ['Qualifying', 'Nurturing', 'Proposal', 'Negotiation', 'Closed Won'];

    const fetchAccountDetails = async () => {
        try {
            const response = await apiClient.get(`/accounts/${id}`);
            const data = response.data.data || response.data;
            setAccount(data);
            const stageIndex = stages.findIndex(s => s.toLowerCase() === (data.salesStage || '').toLowerCase());
            if (stageIndex !== -1) setActiveStage(stageIndex);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching account details:', error);
            toast.error('Failed to load account details');
            setLoading(false);
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await apiClient.get(`/activities?account=${id}`);
            setActivities(response.data.data || []);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const handleActivitySubmit = async (e) => {
        e.preventDefault();
        if (!activityInput.comment.trim()) return;

        try {
            setActivityLoading(true);
            await apiClient.post('/activities', {
                account: id,
                type: activityInput.type,
                description: activityInput.comment,
                dueDate: activityInput.date
            });
            toast.success('Activity logged');
            setActivityInput({ ...activityInput, comment: '' });
            fetchActivities();
        } catch (error) {
            console.error('Error logging activity:', error);
            toast.error('Failed to log activity');
        } finally {
            setActivityLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountDetails();
        fetchActivities();
    }, [id]);

    const markStageComplete = async () => {
        try {
            const nextIndex = activeStage + 1;
            if (nextIndex >= stages.length) return;

            const nextStage = stages[nextIndex];
            await apiClient.put(`/accounts/${id}`, { salesStage: nextStage });
            toast.success(`Moved to ${nextStage}`);
            fetchAccountDetails();
        } catch (error) {
            console.error('Error updating stage:', error);
            toast.error('Failed to update stage');
        }
    };

    const handleHeaderDelete = async () => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                await apiClient.delete(`/accounts/${id}`);
                toast.success('Account deleted');
                navigate('/accounts');
            } catch (error) {
                console.error('Error deleting account:', error);
                toast.error('Failed to delete account');
            }
        }
    };

    const toggleSection = (section) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner-salesforce"></div>
            <p>Loading Intelligence...</p>
        </div>
    );

    if (!account) return (
        <div className="error-container">
            <p>Account not found.</p>
            <button className="btn-primary-salesforce" onClick={() => navigate('/accounts')}>Back to Registry</button>
        </div>
    );

    return (
        <div className="account-details-page-sf fade-in">
            {/* Blue Top Tab Indicator */}
            <div className="top-tab-indicator-sf"></div>

            {/* Header Section */}
            <div className="details-header-sf-top">
                <div className="header-breadcrumbs-sf">
                    <span onClick={() => navigate('/accounts')}>Accounts</span>
                    <ChevronLeft size={12} className="rotate-180" />
                    <span className="current-id">{account.companyName}</span>
                </div>
                <div className="header-main-row-sf">
                    <div className="header-title-block-sf">
                        <div className="grid-drag-handle-sf"><LayoutGrid size={14} /></div>
                        <div className="entity-icon-big account-sf"><Building2 size={24} color="white" /></div>
                        <div className="entity-text-sf">
                            <div className="entity-label-sf">Account</div>
                            <h1 className="entity-name-sf">
                                {account.companyName}
                                <ChevronDown size={18} className="caret-sf" />
                            </h1>
                        </div>
                    </div>
                    <div className="header-actions-sf">
                        <button className="btn-sf-light"><Plus size={14} /> Follow</button>
                        <div className="btn-group-sf">
                            <button className="btn-sf-light" onClick={() => setShowAccountModal(true)}>New</button>
                            <button className="btn-sf-icon-only"><ChevronDown size={14} /></button>
                        </div>
                        <button className="btn-sf-light" onClick={() => setShowAccountModal(true)}>Edit</button>
                        <button className="btn-sf-light" onClick={handleHeaderDelete}>Delete</button>
                        <div className="btn-group-sf">
                            <button className="btn-sf-light">Clone</button>
                            <button className="btn-sf-icon-only"><ChevronDown size={14} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="details-body-sf">
                <div className="details-grid-3col-sf">

                    {/* Left Column: Information */}
                    <div className="col-left-sf">
                        <div className="collapsible-widget-sf">
                            <div className="widget-header-sf-collapsible" onClick={() => toggleSection('about')}>
                                {collapsedSections.about ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                <span>About</span>
                            </div>
                            {!collapsedSections.about && (
                                <div className="widget-content-sf">
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Name <Info size={12} className="info-icon-sf" /></div>
                                        <div className="field-value-sf">
                                            <span>{account.companyName}</span>
                                            <Pencil size={12} className="edit-pencil-sf" onClick={() => setShowAccountModal(true)} />
                                        </div>
                                    </div>
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Website</div>
                                        <div className="field-value-sf">
                                            <span className="link-sf">{account.website || 'Add Website'}</span>
                                            <Pencil size={12} className="edit-pencil-sf" onClick={() => setShowAccountModal(true)} />
                                        </div>
                                    </div>
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Type</div>
                                        <div className="field-value-sf">
                                            <span>{account.accountType || 'Prospect'}</span>
                                            <Pencil size={12} className="edit-pencil-sf" />
                                        </div>
                                    </div>
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Description</div>
                                        <div className="field-value-sf">
                                            <span className="placeholder-sf">Add Description</span>
                                            <Pencil size={12} className="edit-pencil-sf" />
                                        </div>
                                    </div>
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Parent Account</div>
                                        <div className="field-value-sf">
                                            <span className="placeholder-sf">Add Parent Account</span>
                                            <Pencil size={12} className="edit-pencil-sf" />
                                        </div>
                                    </div>
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Account Owner</div>
                                        <div className="field-value-sf">
                                            <div className="owner-box-sf">
                                                <div className="owner-avatar-sf">ED</div>
                                                <span className="link-sf">Elizabeth Watson</span>
                                            </div>
                                            <Pencil size={12} className="edit-pencil-sf" />
                                        </div>
                                    </div>
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Account Currency</div>
                                        <div className="field-value-sf">
                                            <span>USD - U.S. Dollar</span>
                                            <Pencil size={12} className="edit-pencil-sf" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="collapsible-widget-sf mt-md-sf">
                            <div className="widget-header-sf-collapsible" onClick={() => toggleSection('touch')}>
                                {collapsedSections.touch ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                <span>Get in Touch</span>
                            </div>
                            {!collapsedSections.touch && (
                                <div className="widget-content-sf">
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Phone Number</div>
                                        <div className="field-value-sf">
                                            <span>{account.phone || 'Add Phone'}</span>
                                            <Pencil size={12} className="edit-pencil-sf" />
                                        </div>
                                    </div>
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Billing Address</div>
                                        <div className="field-value-sf">
                                            <span className="placeholder-sf">Add Billing Address</span>
                                            <Pencil size={12} className="edit-pencil-sf" />
                                        </div>
                                    </div>
                                    <div className="detail-field-sf">
                                        <div className="field-label-sf">Shipping Address</div>
                                        <div className="field-value-sf">
                                            <span className="placeholder-sf">Add Shipping Address</span>
                                            <Pencil size={12} className="edit-pencil-sf" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center Column: Workflow & Timeline */}
                    <div className="col-center-sf">
                        {/* Stage Ribbon Section */}
                        <div className="path-container-sf">
                            <div className="path-ribbon-sf">
                                {stages.map((stage, index) => {
                                    const isCompleted = index < activeStage;
                                    const isCurrent = index === activeStage;
                                    return (
                                        <div
                                            key={stage}
                                            className={`path-step-sf ${isCompleted ? 'completed' : isCurrent ? 'current' : ''}`}
                                            onClick={() => setActiveStage(index)}
                                        >
                                            <div className="step-arrow-sf">
                                                {isCompleted && <CheckCircle2 size={12} />}
                                                <span>{stage}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="path-step-sf incomplete"><span>Incomplete</span></div>
                                <div className="path-step-sf final"><span>Final Step</span></div>
                            </div>
                            <div className="path-status-sf">
                                <div className="status-text-sf">Status: <strong>{stages[activeStage]}</strong></div>
                                <button className="btn-sf-primary" onClick={markStageComplete}>Mark Stage as Complete</button>
                            </div>
                            <div className="tips-section-sf">
                                <div className="tips-title-sf">Tips for Success</div>
                                <ul className="tips-list-sf">
                                    <li>What issues do they seek to solve and what outcomes are they aiming to achieve?</li>
                                    <li>Why are they exploring options now and how advanced are they in the buying cycle?</li>
                                    <li>What's their budget for this?</li>
                                    <li>What other alternative solutions are they considering?</li>
                                </ul>
                            </div>
                        </div>

                        {/* Activity Tabs Section */}
                        <div className="activity-tabs-sf mt-lg-sf">
                            <div className="activity-triggers-sf">
                                <div className="trigger-group-sf">
                                    <button
                                        className={`trigger-btn-sf ${activeActivityTab === 'logCall' ? 'active' : ''}`}
                                        onClick={() => { setActiveActivityTab('logCall'); setActivityInput(p => ({ ...p, type: 'logCall' })); }}
                                    >
                                        <Phone size={14} color="#00a1e0" /> Log a Call <ChevronDown size={14} className="btn-caret-sf" />
                                    </button>
                                    <button
                                        className={`trigger-btn-sf ${activeActivityTab === 'email' ? 'active' : ''}`}
                                        onClick={() => { setActiveActivityTab('email'); setActivityInput(p => ({ ...p, type: 'email' })); }}
                                    >
                                        <Mail size={14} color="#00a1e0" /> Email <ChevronDown size={14} className="btn-caret-sf" />
                                    </button>
                                    <button
                                        className={`trigger-btn-sf ${activeActivityTab === 'event' ? 'active' : ''}`}
                                        onClick={() => { setActiveActivityTab('event'); setActivityInput(p => ({ ...p, type: 'event' })); }}
                                    >
                                        <Calendar size={14} color="#f33" /> New Event <ChevronDown size={14} className="btn-caret-sf" />
                                    </button>
                                    <button
                                        className={`trigger-btn-sf ${activeActivityTab === 'task' ? 'active' : ''}`}
                                        onClick={() => { setActiveActivityTab('task'); setActivityInput(p => ({ ...p, type: 'task' })); }}
                                    >
                                        <CheckCircle2 size={14} color="#3ba755" /> New Task <ChevronDown size={14} className="btn-caret-sf" />
                                    </button>
                                </div>
                            </div>

                            <div className="activity-composer-sf">
                                <form onSubmit={handleActivitySubmit}>
                                    <textarea
                                        placeholder={`Log your ${activeActivityTab} details here...`}
                                        value={activityInput.comment}
                                        onChange={(e) => setActivityInput(p => ({ ...p, comment: e.target.value }))}
                                    ></textarea>
                                    <div className="composer-footer-sf">
                                        <input
                                            type="date"
                                            value={activityInput.date}
                                            onChange={(e) => setActivityInput(p => ({ ...p, date: e.target.value }))}
                                        />
                                        <button type="submit" className="btn-sf-primary" disabled={activityLoading}>
                                            {activityLoading ? 'Logging...' : 'Log Activity'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="activity-options-sf">
                                <div className="insight-toggle-sf">
                                    <div className="toggle-label-sf">Only show activities with insights</div>
                                    <div className="toggle-switch-sf active"></div>
                                </div>
                                <div className="activity-filters-sf">
                                    Filters: <span>All time</span> | <span>All Activities</span> | <span>Logged calls, email, events, List email, and tasks</span>
                                    <ChevronDown size={12} className="filter-caret-sf" />
                                </div>
                                <div className="activity-controls-sf">
                                    <span>Refresh</span> • <span>Expand All</span> • <span>View All</span>
                                </div>
                            </div>

                            <div className="timeline-sf mt-lg-sf">
                                <div className="timeline-title-sf">
                                    <ChevronDown size={14} /> <span>Upcoming and Overdue</span>
                                    <div className="timeline-help-sf"><ChevronDown size={14} /></div>
                                </div>
                                <div className="timeline-items-sf">
                                    {activities.length === 0 ? (
                                        <div className="empty-timeline-sf">No activities found for this account.</div>
                                    ) : activities.map((act, i) => (
                                        <div key={act._id} className="timeline-item-sf">
                                            <div className={`tl-icon-circle-sf ${act.type}-sf`}>
                                                {act.type === 'logCall' && <Phone size={14} />}
                                                {act.type === 'email' && <Mail size={14} />}
                                                {act.type === 'event' && <Calendar size={14} />}
                                                {act.type === 'task' && <CheckCircle2 size={14} />}
                                            </div>
                                            {i < activities.length - 1 && <div className="tl-line-sf"></div>}
                                            <div className="tl-body-sf">
                                                <div className="tl-header-sf">
                                                    <span className="tl-title-sf link-sf">{act.description.substring(0, 50)}...</span>
                                                    <div className="tl-meta-sf">
                                                        <span>{new Date(act.createdAt).toLocaleString()}</span>
                                                        <ChevronDown size={12} />
                                                    </div>
                                                </div>
                                                <div className="tl-desc-sf">Activity logged by Anthony Davis</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Related Lists */}
                    <div className="col-right-sf">
                        <div className="related-widget-sf">
                            <div className="related-header-sf">
                                <div className="related-title-box-sf">
                                    <div className="widget-icon-box-sf contacts-sf"><Users size={16} /></div>
                                    <span>Contacts ({account.contacts?.length || 0})</span>
                                </div>
                                <ChevronDown size={14} className="related-arrow-sf" />
                            </div>
                            <div className="related-body-sf">
                                {account.contacts?.map(contact => (
                                    <div key={contact._id} className="related-item-sf">
                                        <div className="item-avatar-sf contact-sf"><Building2 size={12} /></div>
                                        <div className="item-info-sf">
                                            <div className="item-name-sf link-sf">{contact.firstName} {contact.lastName}</div>
                                            <div className="item-sub-sf">
                                                <div>Title: <span>{contact.title || 'Senior Account Manager'}</span></div>
                                                <div>Role: <span>Decision Maker</span></div>
                                            </div>
                                        </div>
                                        <ChevronDown size={14} className="item-caret-sf" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="related-widget-sf mt-md-sf">
                            <div className="related-header-sf">
                                <div className="related-title-box-sf">
                                    <div className="widget-icon-box-sf opportunities-sf"><Briefcase size={16} /></div>
                                    <span>Opportunities ({account.opportunities?.length || 0})</span>
                                </div>
                                <ChevronDown size={14} className="related-arrow-sf" />
                            </div>
                            <div className="related-body-sf">
                                {account.opportunities?.map(opp => (
                                    <div key={opp._id} className="related-item-sf">
                                        <div className="item-avatar-sf opp-sf"><Briefcase size={12} /></div>
                                        <div className="item-info-sf">
                                            <div className="item-name-sf link-sf">{opp.name}</div>
                                            <div className="item-sub-sf">
                                                <div>Amount: <span>${opp.amount?.toLocaleString() || '0'}</span></div>
                                                <div>Close Date: <span>{opp.closeDate ? new Date(opp.closeDate).toLocaleDateString() : '--'}</span></div>
                                            </div>
                                        </div>
                                        <ChevronDown size={14} className="item-caret-sf" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="related-widget-sf mt-md-sf">
                            <div className="related-header-sf">
                                <div className="related-title-box-sf">
                                    <div className="widget-icon-box-sf cases-sf"><MessageSquare size={16} /></div>
                                    <span>Cases (0)</span>
                                </div>
                                <ChevronDown size={14} className="related-arrow-sf" />
                            </div>
                        </div>

                        <div className="related-widget-sf mt-md-sf">
                            <div className="related-header-sf">
                                <div className="related-title-box-sf">
                                    <div className="widget-icon-box-sf files-sf"><FileText size={16} /></div>
                                    <span>Files (0)</span>
                                </div>
                                <ChevronDown size={14} className="related-arrow-sf" />
                            </div>
                            <div className="file-upload-zone-sf">
                                <div className="upload-btn-sf">
                                    <UploadCloud size={16} />
                                    <span>Upload</span>
                                </div>
                                <div className="upload-hint-sf">or drop image</div>
                            </div>
                        </div>

                        <div className="related-widget-sf mt-md-sf">
                            <div className="related-header-sf">
                                <div className="related-title-box-sf">
                                    <div className="widget-icon-box-sf products-sf"><Package size={16} /></div>
                                    <span>Products</span>
                                </div>
                                <ChevronDown size={14} className="related-arrow-sf" />
                            </div>
                            <div className="placeholder-content-sf">
                                <span>Placeholder Content</span>
                                <p>replace with a local component</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modals */}
            {showAccountModal && (
                <AccountModal
                    onClose={() => setShowAccountModal(false)}
                    onSave={async (data) => {
                        await apiClient.put(`/accounts/${id}`, data);
                        toast.success('Account updated');
                        fetchAccountDetails();
                        setShowAccountModal(false);
                    }}
                    initialData={account}
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
