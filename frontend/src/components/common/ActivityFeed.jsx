import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, MessageSquare, CheckCircle2, Clock, Plus } from 'lucide-react';
import apiClient from '../../services/apiClient';
import './ActivityFeed.css';

const ActivityFeed = ({ relatedToType, relatedToId }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLogging, setIsLogging] = useState(false);
    const [newActivity, setNewActivity] = useState({
        type: 'NOTE',
        subject: '',
        description: '',
        status: 'COMPLETED'
    });

    useEffect(() => {
        fetchActivities();
    }, [relatedToId]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/activities?relatedToType=${relatedToType}&relatedToId=${relatedToId}`);
            setActivities(res.data || []);
        } catch (err) {
            console.error('Failed to fetch activities', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogActivity = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/activities', {
                ...newActivity,
                relatedToType,
                relatedToId
            });
            setIsLogging(false);
            setNewActivity({ type: 'NOTE', subject: '', description: '', status: 'COMPLETED' });
            fetchActivities();
        } catch (err) {
            console.error('Failed to log activity', err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'CALL': return <Phone size={14} />;
            case 'EMAIL': return <Mail size={14} />;
            case 'MEETING': return <Calendar size={14} />;
            case 'TASK': return <CheckCircle2 size={14} />;
            default: return <MessageSquare size={14} />;
        }
    };

    return (
        <div className="activity-feed-container">
            <div className="feed-header">
                <h3>Activity Feed</h3>
                <button className="btn-add-activity" onClick={() => setIsLogging(!isLogging)}>
                    <Plus size={14} /> Log Activity
                </button>
            </div>

            {isLogging && (
                <form className="log-activity-form glass-card" onSubmit={handleLogActivity}>
                    <div className="form-row">
                        <select
                            value={newActivity.type}
                            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                        >
                            <option value="CALL">Call</option>
                            <option value="EMAIL">Email</option>
                            <option value="MEETING">Meeting</option>
                            <option value="NOTE">Note</option>
                            <option value="TASK">Task</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Subject"
                            required
                            value={newActivity.subject}
                            onChange={(e) => setNewActivity({ ...newActivity, subject: e.target.value })}
                        />
                    </div>
                    <textarea
                        placeholder="Description/Notes..."
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    />
                    <div className="form-actions">
                        <button type="button" onClick={() => setIsLogging(false)}>Cancel</button>
                        <button type="submit" className="btn-submit">Log</button>
                    </div>
                </form>
            )}

            <div className="timeline">
                {loading ? (
                    <div className="loading-state">Loading timeline...</div>
                ) : activities.length === 0 ? (
                    <div className="empty-state">No activities logged yet.</div>
                ) : activities.map((act) => (
                    <div key={act._id} className={`timeline-item ${act.type.toLowerCase()}`}>
                        <div className="timeline-icon">
                            {getIcon(act.type)}
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-header">
                                <span className="timeline-subject">{act.subject}</span>
                                <span className="timeline-time">
                                    {new Date(act.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            {act.description && <p className="timeline-desc">{act.description}</p>}
                            <div className="timeline-footer">
                                <span className="owner-badge">
                                    <Clock size={10} /> {act.owner?.firstName} {act.owner?.lastName}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
