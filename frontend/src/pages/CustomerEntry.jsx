import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    UserPlus, Building2, Mail, Phone, MapPin,
    FileText, Save, X, ArrowLeft, Loader2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import './CustomerEntry.css';

const CustomerEntry = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.firstName || !form.lastName || !form.email) {
            showToast('First name, last name, and email are required', 'error');
            return;
        }

        setLoading(true);
        try {
            // This creates a lead/contact. In our CRM, it goes to Leads first or direct to Contacts.
            // Flowchart says "Customer Entry", which usually means quick-starting a lead or contact.
            // Let's create a Lead for now as it's the start of the flow.
            const res = await apiClient.post('/leads', {
                ...form,
                source: 'OTHER',
                status: 'NEW'
            });
            showToast('Customer recorded successfully', 'success');
            navigate('/dashboard/leads');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to record customer', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="customer-entry-container">
            <div className="entry-header glass-card">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2>Quick Customer Entry</h2>
                        <p>Fast-track a new lead or contact into the system</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="entry-form-grid">
                <div className="form-column">
                    <div className="form-section glass-card">
                        <div className="section-title">
                            <UserPlus size={18} />
                            <h3>Personal Information</h3>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name*</label>
                                <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Jane" />
                            </div>
                            <div className="form-group">
                                <label>Last Name*</label>
                                <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email Address*</label>
                            <div className="input-with-icon glass">
                                <Mail size={16} />
                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane.doe@example.com" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-with-icon glass">
                                <Phone size={16} />
                                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Job Title</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Product Manager" />
                        </div>
                    </div>

                    <div className="form-actions-desktop">
                        <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
                            <span>Save Customer</span>
                        </button>
                    </div>
                </div>

                <div className="form-column">
                    <div className="form-section glass-card">
                        <div className="section-title">
                            <Building2 size={18} />
                            <h3>Company & Location</h3>
                        </div>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc." />
                        </div>
                        <div className="form-group">
                            <label>Street Address</label>
                            <div className="input-with-icon glass">
                                <MapPin size={16} />
                                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Business Way" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Seattle" />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="WA" />
                            </div>
                        </div>
                    </div>

                    <div className="form-section glass-card">
                        <div className="section-title">
                            <FileText size={18} />
                            <h3>Additional Notes</h3>
                        </div>
                        <div className="form-group">
                            <textarea rows={5} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Initial interaction details, interest areas..." />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CustomerEntry;
