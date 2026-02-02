import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';
import apiClient from '../services/apiClient';

const CreateReportModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Sales',
        frequency: 'Weekly',
        format: 'PDF'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await apiClient.post('/reports', formData);
            if (onSuccess) onSuccess(); // Callback to refresh list
            onClose();
        } catch (error) {
            console.error('Failed to create report:', error);
            // In a real app, use toast.error(error.message)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-card">
                <div className="modal-header">
                    <h3>Create New Report</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="report-form">
                    <div className="form-group">
                        <label>Report Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Q1 Sales Analysis"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <div className="select-wrapper">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Sales">Sales</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Inventory">Inventory</option>
                                    <option value="Activity">Activity</option>
                                    <option value="Performance">User Performance</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Frequency</label>
                            <div className="select-wrapper">
                                <select
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                >
                                    <option value="Real-time">Real-time</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Format</label>
                        <div className="format-options">
                            {['PDF', 'Excel', 'CSV'].map(format => (
                                <div
                                    key={format}
                                    className={`format-option glass ${formData.format === format ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, format })}
                                >
                                    <FileText size={16} />
                                    <span>{format}</span>
                                    {formData.format === format && <Check size={14} className="check-icon" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReportModal;
