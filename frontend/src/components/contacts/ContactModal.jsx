import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../services/apiClient';
import '../../pages/Contacts.css'; // Reusing existing styles for now, or move to dedicated CSS

const ContactModal = ({ onClose, onSuccess, initialAccount = null }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const toast = useToast();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        title: '',
        account: initialAccount ? (initialAccount._id || initialAccount) : '',
        email: '',
        phone: '',
        isDecisionMaker: false
    });

    useEffect(() => {
        // Fetch accounts if not provided or just to have the list
        const fetchAccounts = async () => {
            try {
                const res = await apiClient.get('/accounts');
                console.log('Fetched accounts in modal:', res.data);
                setAccounts(res.data || []);
            } catch (err) {
                console.error('Error fetching accounts:', err);
                toast.error('Failed to load accounts list');
            }
        };
        fetchAccounts();
    }, []);

    const handleInteract = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.account) {
            toast.error('Please select an account');
            return;
        }

        try {
            setIsSubmitting(true);
            await apiClient.post('/contacts', formData);
            toast.success('Contact created successfully');
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error creating contact:', err);
            toast.error(err.response?.data?.message || 'Failed to create contact');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-card">
                <div className="modal-header">
                    <h3>Add New Contact</h3>
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
                        <label>Professional Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInteract}
                            placeholder="e.g. Chief Technology Officer"
                        />
                    </div>

                    <div className="form-group">
                        <label>Associated Account</label>
                        <select
                            name="account"
                            required
                            value={formData.account}
                            onChange={handleInteract}
                            className="glass-input"
                            disabled={!!initialAccount}
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="">Select an account</option>
                            {accounts.map(acc => (
                                <option key={acc._id} value={acc._id}>
                                    {acc.companyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
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
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating Contact...' : 'Create Contact'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;
