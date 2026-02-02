import React, { useState, useEffect } from 'react';
import { X, Briefcase, DollarSign, Calendar, Info, Building2, User } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';

const OpportunityModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        account: '',
        primaryContact: '',
        amount: 0,
        stage: 'PROSPECTING',
        expectedCloseDate: '',
        description: '',
        opportunityType: 'NEW_BUSINESS',
        probability: 10
    });
    const [accounts, setAccounts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchAccounts();
            fetchContacts();
        }
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                account: initialData.account?._id || initialData.account || '',
                primaryContact: initialData.primaryContact?._id || initialData.primaryContact || '',
                amount: initialData.amount || 0,
                stage: initialData.stage || 'PROSPECTING',
                expectedCloseDate: initialData.expectedCloseDate ? new Date(initialData.expectedCloseDate).toISOString().split('T')[0] : '',
                description: initialData.description || '',
                opportunityType: initialData.opportunityType || 'NEW_BUSINESS',
                probability: initialData.probability || 10
            });
        } else {
            setFormData({
                name: '',
                account: '',
                primaryContact: '',
                amount: 0,
                stage: 'PROSPECTING',
                expectedCloseDate: '',
                description: '',
                opportunityType: 'NEW_BUSINESS',
                probability: 10
            });
        }
    }, [initialData, isOpen]);

    const fetchAccounts = async () => {
        try {
            const res = await apiClient.get('/accounts');
            setAccounts(res.data || []);
        } catch (err) {
            console.error('Failed to fetch accounts:', err);
        }
    };

    const fetchContacts = async () => {
        try {
            const res = await apiClient.get('/contacts');
            setContacts(res.data || []);
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' || name === 'probability' ? Number(value) : value
        }));

        // Auto-set probability based on stage
        if (name === 'stage') {
            const stageProbabilities = {
                PROSPECTING: 10,
                QUALIFICATION: 25,
                PROPOSAL: 50,
                NEGOTIATION: 75,
                CLOSED_WON: 100,
                CLOSED_LOST: 0
            };
            setFormData(prev => ({
                ...prev,
                probability: stageProbabilities[value] || 10
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (initialData) {
                await apiClient.put(`/opportunities/${initialData._id}`, formData);
                toast.success('Deal updated successfully');
            } else {
                await apiClient.post('/opportunities', formData);
                toast.success('Deal created successfully');
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving deal:', err);
            toast.error(err.response?.data?.message || 'Failed to save deal');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-card">
                <div className="modal-header">
                    <h3>{initialData ? 'Edit Deal' : 'Add New Deal'}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Deal Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Q1 Software License"
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Account</label>
                            <select
                                name="account"
                                required
                                value={formData.account}
                                onChange={handleChange}
                            >
                                <option value="">Select Account</option>
                                {accounts.map(acc => (
                                    <option key={acc._id} value={acc._id}>{acc.companyName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Primary Contact</label>
                            <select
                                name="primaryContact"
                                value={formData.primaryContact}
                                onChange={handleChange}
                            >
                                <option value="">Select Contact</option>
                                {contacts.map(con => (
                                    <option key={con._id} value={con._id}>{con.firstName} {con.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-group">
                            <label>Expected Close Date</label>
                            <input
                                type="date"
                                name="expectedCloseDate"
                                value={formData.expectedCloseDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Stage</label>
                            <select
                                name="stage"
                                value={formData.stage}
                                onChange={handleChange}
                            >
                                <option value="PROSPECTING">Prospecting</option>
                                <option value="QUALIFICATION">Qualification</option>
                                <option value="PROPOSAL">Proposal</option>
                                <option value="NEGOTIATION">Negotiation</option>
                                <option value="CLOSED_WON">Closed Won</option>
                                <option value="CLOSED_LOST">Closed Lost</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Probability (%)</label>
                            <input
                                type="number"
                                name="probability"
                                value={formData.probability}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add deal details..."
                            rows="3"
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (initialData ? 'Update Deal' : 'Create Deal')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OpportunityModal;
