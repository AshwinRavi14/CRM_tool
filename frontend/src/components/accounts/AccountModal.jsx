import React, { useState } from 'react';
import { X, Building2, Globe, Phone, Mail, MapPin, Tag, Briefcase } from 'lucide-react';
import '../projects/CreateProjectModal.css'; // Reusing modal styles

const AccountModal = ({ onClose, onSave, initialData, title = "Add New Account" }) => {
    const [formData, setFormData] = useState({
        companyName: initialData?.companyName || '',
        accountType: initialData?.accountType || 'PROSPECT',
        industry: initialData?.industry || 'OTHER',
        website: initialData?.website || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        billingAddress: {
            city: initialData?.billingAddress?.city || '',
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'city') {
            setFormData({
                ...formData,
                billingAddress: { ...formData.billingAddress, city: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="modal-content glass-card slide-up">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="icon-btn-sm" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Company Name</label>
                        <div className="input-with-icon glass">
                            <Building2 size={16} />
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Quantum Systems"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Account Type</label>
                            <div className="input-with-icon glass">
                                <Tag size={16} />
                                <select
                                    name="accountType"
                                    className="glass-select"
                                    value={formData.accountType}
                                    onChange={handleChange}
                                >
                                    <option value="PROSPECT">Prospect</option>
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="PARTNER">Partner</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Industry</label>
                            <div className="input-with-icon glass">
                                <Briefcase size={16} />
                                <select
                                    name="industry"
                                    className="glass-select"
                                    value={formData.industry}
                                    onChange={handleChange}
                                >
                                    <option value="AI_DEVELOPMENT">AI Development</option>
                                    <option value="HEALTHCARE">Healthcare</option>
                                    <option value="RETAIL">Retail</option>
                                    <option value="FINANCE">Finance</option>
                                    <option value="LOGISTICS">Logistics</option>
                                    <option value="ENERGY">Energy</option>
                                    <option value="MANUFACTURING">Manufacturing</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Website</label>
                            <div className="input-with-icon glass">
                                <Globe size={16} />
                                <input
                                    type="text"
                                    name="website"
                                    placeholder="example.com"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <div className="input-with-icon glass">
                                <MapPin size={16} />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="New York"
                                    value={formData.billingAddress.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-with-icon glass">
                                <Mail size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="contact@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <div className="input-with-icon glass">
                                <Phone size={16} />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+1 234 567 890"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">{initialData ? 'Update Account' : 'Create Account'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountModal;
