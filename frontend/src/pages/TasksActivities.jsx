import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Search, Filter, CheckCircle2, Clock, AlertCircle,
    Calendar, MoreVertical, Edit, Trash2, CheckCircle, List, LayoutGrid
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import TaskModal from '../components/tasks/TaskModal';
import './TasksActivities.css';

const TYPE_CONFIG = {
    TASK: { label: 'Task', color: '#3b82f6', icon: CheckCircle2 },
    CALL: { label: 'Call', color: '#10b981', icon: Clock },
    EMAIL: { label: 'Email', color: '#8b5cf6', icon: Edit },
    MEETING: { label: 'Meeting', color: '#f59e0b', icon: Calendar },
    NOTE: { label: 'Note', color: '#94a3b8', icon: Edit }
};

const STATUS_CONFIG = {
    PLANNED: { label: 'Planned', color: '#f59e0b', icon: Clock },
    COMPLETED: { label: 'Completed', color: '#10b981', icon: CheckCircle },
    CANCELLED: { label: 'Cancelled', color: '#ef4444', icon: CheckCircle }
};

const TasksActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [activeTab, setActiveTab] = useState('ALL'); // ALL, TASK, ACTIVITY
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const { showToast } = useToast();

    const fetchActivities = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/activities');
            setActivities(res.data.activities || res.data || []);
        } catch (err) {
            showToast('Failed to load activities', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { fetchActivities(); }, [fetchActivities]);

    const filteredActivities = activities.filter(a => {
        const matchesTab = activeTab === 'ALL' || (activeTab === 'TASK' ? a.type === 'TASK' : a.type !== 'TASK');
        const matchesSearch = a.subject?.toLowerCase().includes(search.toLowerCase()) ||
            a.relatedToId?.name?.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await apiClient.delete(`/activities/${id}`);
            showToast('Deleted successfully', 'success');
            fetchActivities();
        } catch { showToast('Delete failed', 'error'); }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

    return (
        <div className="tasks-page-container">
            <div className="tasks-header glass-card">
                <div className="header-left">
                    <h2>Tasks & Activities</h2>
                    <div className="tab-switcher">
                        <button className={activeTab === 'ALL' ? 'active' : ''} onClick={() => setActiveTab('ALL')}>All</button>
                        <button className={activeTab === 'TASK' ? 'active' : ''} onClick={() => setActiveTab('TASK')}>Tasks</button>
                        <button className={activeTab === 'ACTIVITY' ? 'active' : ''} onClick={() => setActiveTab('ACTIVITY')}>Activities</button>
                    </div>
                </div>
                <div className="header-right">
                    <div className="search-box glass">
                        <Search size={16} />
                        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className="view-toggle glass" onClick={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')}>
                        {viewMode === 'list' ? <LayoutGrid size={18} /> : <List size={18} />}
                    </button>
                    <button className="create-btn" onClick={() => { setSelectedActivity(null); setModalOpen(true); }}>
                        <Plus size={18} /> <span>New {activeTab === 'TASK' ? 'Task' : 'Activity'}</span>
                    </button>
                </div>
            </div>

            <div className="tasks-content">
                {loading ? (
                    <div className="loading-screen"><div className="spinner" /></div>
                ) : filteredActivities.length === 0 ? (
                    <div className="empty-state glass-card">
                        <CheckCircle2 size={48} strokeWidth={1} />
                        <h3>Clean slate!</h3>
                        <p>No {activeTab.toLowerCase()} items found.</p>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="tasks-list glass-card">
                        <table className="tasks-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '30px' }}></th>
                                    <th>Subject</th>
                                    <th>Type</th>
                                    <th>Related To</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    <th>Owner</th>
                                    <th style={{ width: '60px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredActivities.map(a => {
                                    const type = TYPE_CONFIG[a.type] || TYPE_CONFIG.TASK;
                                    const status = STATUS_CONFIG[a.status] || STATUS_CONFIG.PLANNED;
                                    return (
                                        <tr key={a._id} className="task-row">
                                            <td><input type="checkbox" checked={a.status === 'COMPLETED'} readOnly /></td>
                                            <td className="subject-cell" onClick={() => { setSelectedActivity(a); setModalOpen(true); }}>
                                                {a.subject}
                                            </td>
                                            <td>
                                                <span className="type-tag" style={{ '--type-color': type.color }}>
                                                    <type.icon size={12} /> {type.label}
                                                </span>
                                            </td>
                                            <td className="related-cell">{a.relatedToType}: {a.relatedToId?.name || '—'}</td>
                                            <td>
                                                <span className="status-badge" style={{ '--status-color': status.color }}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="date-cell">{formatDate(a.dueDate)}</td>
                                            <td>{a.owner?.firstName}</td>
                                            <td className="action-cell">
                                                <button className="action-btn" onClick={() => handleDelete(a._id)}><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="kanban-view">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <div key={key} className="kanban-column glass-card">
                                <div className="column-header">
                                    <span className="dot" style={{ background: cfg.color }}></span>
                                    <h4>{cfg.label}</h4>
                                    <span className="count">{filteredActivities.filter(a => a.status === key).length}</span>
                                </div>
                                <div className="column-body">
                                    {filteredActivities.filter(a => a.status === key).map(a => {
                                        const type = TYPE_CONFIG[a.type] || TYPE_CONFIG.TASK;
                                        return (
                                            <div key={a._id} className="task-card glass" onClick={() => { setSelectedActivity(a); setModalOpen(true); }}>
                                                <div className="card-top">
                                                    <span className="type-tag-mini" style={{ '--type-color': type.color }}>
                                                        <type.icon size={10} /> {type.label}
                                                    </span>
                                                    <span className="priority-dot" style={{ background: a.priority === 'HIGH' ? '#ef4444' : a.priority === 'NORMAL' ? '#3b82f6' : '#94a3b8' }}></span>
                                                </div>
                                                <p className="card-subject">{a.subject}</p>
                                                <div className="card-footer">
                                                    <span className="card-date">{formatDate(a.dueDate)}</span>
                                                    <span className="card-owner">{a.owner?.firstName?.[0]}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modalOpen && (
                <TaskModal
                    activity={selectedActivity}
                    onClose={() => setModalOpen(false)}
                    onSave={() => { setModalOpen(false); fetchActivities(); }}
                />
            )}
        </div>
    );
};

export default TasksActivities;
