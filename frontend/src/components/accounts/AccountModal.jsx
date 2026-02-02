import React, { useState, useEffect } from 'react';
import { X, Building2, Globe, Phone, Mail, MapPin, Tag, Briefcase, User, Info, DollarSign, Users } from 'lucide-react';
import './AccountModal.css';

const AccountModal = ({ onClose, onSave, initialData, title = "New Account" }) => {
    const [formData, setFormData] = useState({
        name: '',
        parentAccount: '',
        accountNumber: '',
        tickerSymbol: '',
        type: 'Prospect',
        ownership: '--None--',
        industry: 'Technology',
        employees: '',
        annualRevenue: '',
        rating: '--None--',
        phone: '',
        website: '',
        email: '',
        owner: 'Anthony Davis',
        billingAddress: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        },
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                name: initialData.name || initialData.companyName || '',
                type: initialData.type || initialData.accountType || 'Prospect',
                industry: initialData.industry || 'Technology',
                website: initialData.website || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                billingAddress: {
                    ...formData.billingAddress,
                    city: initialData.city || (initialData.billingAddress && initialData.billingAddress.city) || ''
                }
            });
        }
    }, [initialData]);

    const handleInteract = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Adjusting field name for backend compatibility
            const payload = { ...formData, companyName: formData.name };
            await onSave(payload);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay-sf">
            <div className="modal-content-sf fade-in">
                <div className="modal-header-sf">
                    <h3>{initialData ? 'Edit Account' : 'New Account'}</h3>
                    <button className="close-btn-sf" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body-sf">
                    {/* Section 1: Account Information */}
                    <div className="form-section-sf">
                        <div className="section-title-sf">Account Information</div>
                        <div className="form-grid-sf">
                            <div className="form-group-sf">
                                <label className="required-sf">Account Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInteract} required />
                            </div>
                            <div className="form-group-sf">
                                <label>Account Owner</label>
                                <div className="readonly-box-sf"><User size={14} /> {formData.owner}</div>
                            </div>
                            <div className="form-group-sf">
                                <label>Type</label>
                                <select name="type" value={formData.type} onChange={handleInteract}>
                                    <option>Prospect</option>
                                    <option>Customer - Direct</option>
                                    <option>Customer - Channel</option>
                                    <option>Channel Partner</option>
                                </select>
                            </div>
                            <div className="form-group-sf">
                                <label>Parent Account</label>
                                <input type="text" name="parentAccount" value={formData.parentAccount} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Website</label>
                                <input type="text" name="website" value={formData.website} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Account Number</label>
                                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Ticker Symbol</label>
                                <input type="text" name="tickerSymbol" value={formData.tickerSymbol} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Industry</label>
                                <select name="industry" value={formData.industry} onChange={handleInteract}>
                                    <option>Technology</option>
                                    <option>Finance</option>
                                    <option>Healthcare</option>
                                    <option>Manufacturing</option>
                                </select>
                            </div>
                            <div className="form-group-sf">
                                <label>Employees</label>
                                <input type="number" name="employees" value={formData.employees} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Annual Revenue</label>
                                <div className="input-with-symbol-sf">
                                    <span>$</span>
                                    <input type="text" name="annualRevenue" value={formData.annualRevenue} onChange={handleInteract} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Address Information */}
                    <div className="form-section-sf mt-sm">
                        <div className="section-title-sf">Address Information</div>
                        <div className="form-grid-sf">
                            <div className="form-group-sf full-width-sf">
                                <label>Billing Street</label>
                                <textarea name="billingAddress.street" value={formData.billingAddress.street} onChange={handleInteract} style={{ height: '60px' }}></textarea>
                            </div>
                            <div className="form-group-sf">
                                <label>Billing City</label>
                                <input type="text" name="billingAddress.city" value={formData.billingAddress.city} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Billing State/Province</label>
                                <input type="text" name="billingAddress.state" value={formData.billingAddress.state} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Billing Zip/Postal Code</label>
                                <input type="text" name="billingAddress.zip" value={formData.billingAddress.zip} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Billing Country</label>
                                <input type="text" name="billingAddress.country" value={formData.billingAddress.country} onChange={handleInteract} />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer-sf">
                        <button type="button" className="btn-sf secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-sf primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountModal;
