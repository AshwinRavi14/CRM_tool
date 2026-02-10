import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../services/apiClient';
import './TaskModal.css';

const TaskModal = ({ activity, onClose, onSave }) => {
    const isEdit = !!activity;
    const { showToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [leads, setLeads] = useState([]);
    const [contacts, setContacts] = useState([]);

    const [form, setForm] = useState({
        type: 'TASK',
        subject: '',
        description: '',
        status: 'PLANNED',
        priority: 'NORMAL',
        dueDate: new Date().toISOString().slice(0, 16),
        relatedToType: 'Lead',
        relatedToId: ''
    });

    useEffect(() => {
        if (activity) {
            setForm({
                type: activity.type,
                subject: activity.subject,
                description: activity.description || '',
                status: activity.status,
                priority: activity.priority,
                dueDate: activity.dueDate ? new Date(activity.dueDate).toISOString().slice(0, 16) : '',
                relatedToType: activity.relatedToType,
                relatedToId: activity.relatedToId?._id || activity.relatedToId
            });
        }
    }, [activity]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lRes, cRes] = await Promise.all([
                    apiClient.get('/leads'),
                    apiClient.get('/contacts')
                ]);
                setLeads(lRes.data.leads || lRes.data || []);
                setContacts(cRes.data.contacts || cRes.data || []);
            } catch (err) { console.error('Data load failed', err); }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.subject || !form.relatedToId) {
            showToast('Subject and Related Record are required', 'error');
            return;
        }
        setSaving(true);
        try {
            if (isEdit) {
                await apiClient.put(`/activities/${activity._id}`, form);
                showToast('Updated successfully', 'success');
            } else {
                await apiClient.post('/activities', form);
                showToast('Created successfully', 'success');
            }
            onSave();
        } catch (err) {
            showToast('Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    const relatedOptions = form.relatedToType === 'Lead' ? leads : contacts;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="task-modal glass-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isEdit ? 'Edit Item' : 'New Task / Activity'}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option value="TASK">Task</option>
                                <option value="CALL">Call</option>
                                <option value="EMAIL">Email</option>
                                <option value="MEETING">Meeting</option>
                                <option value="NOTE">Note</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                                <option value="LOW">Low</option>
                                <option value="NORMAL">Normal</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div className="form-group span-2">
                            <label>Subject</label>
                            <input type="text" value={form.subject} placeholder="e.g. Follow up on proposal"
                                onChange={e => setForm({ ...form, subject: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Related To</label>
                            <select value={form.relatedToType} onChange={e => setForm({ ...form, relatedToType: e.target.value, relatedToId: '' })}>
                                <option value="Lead">Lead</option>
                                <option value="Contact">Contact</option>
                                <option value="Account">Account</option>
                                <option value="Opportunity">Opportunity</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Record</label>
                            <select value={form.relatedToId} onChange={e => setForm({ ...form, relatedToId: e.target.value })}>
                                <option value="">Select...</option>
                                {relatedOptions.map(opt => (
                                    <option key={opt._id} value={opt._id}>
                                        {opt.firstName ? `${opt.firstName} ${opt.lastName}` : (opt.companyName || opt.name || opt.company)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="PLANNED">Planned</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="datetime-local" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                        </div>
                        <div className="form-group span-2">
                            <label>Description</label>
                            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
