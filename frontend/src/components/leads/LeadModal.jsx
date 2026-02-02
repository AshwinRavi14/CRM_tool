import React, { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Phone, Tag, Briefcase, Info } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';

const LeadModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        source: 'WEBSITE',
        status: 'NEW',
        rating: 'COLD',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                company: initialData.company || '',
                source: initialData.source || 'WEBSITE',
                status: initialData.status || 'NEW',
                rating: initialData.rating || 'COLD',
                notes: initialData.notes || ''
            });
        }
    }, [initialData, isOpen]);

    const handleInteract = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (initialData) {
                await apiClient.put(`/leads/${initialData._id}`, formData);
                toast.success('Lead updated successfully');
            } else {
                await apiClient.post('/leads', formData);
                toast.success('Lead created successfully');
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving lead:', err);
            toast.error(err.response?.data?.message || 'Failed to save lead');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-card">
                <div className="modal-header">
                    <h3>{initialData ? 'Edit Lead' : 'Add New Lead'}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleInteract}
                                placeholder="e.g. John"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleInteract}
                                placeholder="e.g. Doe"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Company</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInteract}
                            placeholder="e.g. Quantum Systems"
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInteract}
                                placeholder="john@company.com"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInteract}
                                placeholder="e.g. +1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Source</label>
                            <select
                                name="source"
                                value={formData.source}
                                onChange={handleInteract}
                                className="glass-input"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="WEBSITE">Website</option>
                                <option value="REFERRAL">Referral</option>
                                <option value="LINKEDIN">LinkedIn</option>
                                <option value="CONFERENCE">Conference</option>
                                <option value="COLD_CALL">Cold Call</option>
                                <option value="EMAIL">Email</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Rating</label>
                            <select
                                name="rating"
                                value={formData.rating}
                                onChange={handleInteract}
                                className="glass-input"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="HOT">Hot</option>
                                <option value="WARM">Warm</option>
                                <option value="COLD">Cold</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInteract}
                            className="glass-input"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="UNQUALIFIED">Unqualified</option>
                            <option value="CONVERTED">Converted</option>
                            <option value="LOST">Lost</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInteract}
                            placeholder="Add lead notes here..."
                            style={{
                                width: '100%',
                                minHeight: '80px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                color: 'white',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (initialData ? 'Update Lead' : 'Create Lead')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadModal;
