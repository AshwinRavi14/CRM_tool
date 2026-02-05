import React from 'react';
import { X, Calendar, User, Flag, CheckCircle, Building2, UserCircle, Briefcase } from 'lucide-react';

const ActivityDrawer = ({ isOpen, activity, onClose, onUpdate }) => {
    if (!isOpen || !activity) return null;

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={`activity-drawer ${isOpen ? 'open' : ''}`}>
            <div className="drawer-header">
                <div className="drawer-title">
                    <h2>Activity Details</h2>
                    <span className="activity-type-badge">{activity.type || 'Task'}</span>
                </div>
                <button className="close-btn" onClick={onClose} aria-label="Close drawer">
                    <X size={20} />
                </button>
            </div>

            <div className="drawer-body">
                {/* Subject Section */}
                <section className="drawer-section">
                    <h3>Subject</h3>
                    <p className="subject-text">{activity.subject}</p>
                </section>

                {/* Key Details Grid */}
                <section className="drawer-section">
                    <h3>Details</h3>
                    <div className="details-grid">
                        <div className="detail-item">
                            <div className="detail-label">
                                <User size={14} />
                                <span>Assigned To</span>
                            </div>
                            <div className="detail-value">{activity.assigned || '-'}</div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-label">
                                <Flag size={14} />
                                <span>Priority</span>
                            </div>
                            <div className="detail-value">
                                <span className={`priority-badge ${activity.priority?.toLowerCase()}`}>
                                    {activity.priority || 'Normal'}
                                </span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-label">
                                <CheckCircle size={14} />
                                <span>Status</span>
                            </div>
                            <div className="detail-value">
                                <span className={`status-badge ${activity.status?.toLowerCase()}`}>
                                    {activity.status || 'Open'}
                                </span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-label">
                                <Calendar size={14} />
                                <span>Due Date</span>
                            </div>
                            <div className="detail-value">{formatDate(activity.dueDate)}</div>
                        </div>
                    </div>
                </section>

                {/* Related Records */}
                <section className="drawer-section">
                    <h3>Related To</h3>
                    <div className="related-records">
                        {activity.companyAccount && activity.companyAccount !== '-' && (
                            <div className="related-item">
                                <Building2 size={16} />
                                <div>
                                    <div className="related-label">Account</div>
                                    <div className="related-value sf-link">{activity.companyAccount}</div>
                                </div>
                            </div>
                        )}

                        {activity.contact && activity.contact !== '-' && (
                            <div className="related-item">
                                <UserCircle size={16} />
                                <div>
                                    <div className="related-label">Contact</div>
                                    <div className="related-value sf-link">{activity.contact}</div>
                                </div>
                            </div>
                        )}

                        {activity.opportunity && activity.opportunity !== '-' && (
                            <div className="related-item">
                                <Briefcase size={16} />
                                <div>
                                    <div className="related-label">Opportunity</div>
                                    <div className="related-value sf-link">{activity.opportunity}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Description */}
                {activity.description && (
                    <section className="drawer-section">
                        <h3>Description</h3>
                        <p className="description-text">{activity.description}</p>
                    </section>
                )}

                {/* Activity History */}
                <section className="drawer-section">
                    <h3>Activity History</h3>
                    <div className="activity-timeline">
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-header">
                                    <span className="timeline-action">Created</span>
                                    <span className="timeline-date">{formatDate(activity.createdAt)}</span>
                                </div>
                                <div className="timeline-user">by {activity.createdBy || 'System'}</div>
                            </div>
                        </div>
                        {activity.updatedAt && activity.updatedAt !== activity.createdAt && (
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <div className="timeline-header">
                                        <span className="timeline-action">Last Modified</span>
                                        <span className="timeline-date">{formatDate(activity.updatedAt)}</span>
                                    </div>
                                    <div className="timeline-user">by {activity.updatedBy || 'System'}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <div className="drawer-footer">
                <button className="sf-toolbar-btn" onClick={onClose}>Close</button>
                <button className="sf-toolbar-btn sf-primary-btn">Edit</button>
            </div>
        </div>
    );
};

export default ActivityDrawer;
