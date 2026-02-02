import React, { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Phone, Tag, Briefcase, Info, ChevronDown, MapPin, Globe, Star } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';
import './LeadModal.css';

const LeadModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        salutation: '--None--',
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        title: '',
        email: '',
        phone: '',
        mobile: '',
        rating: '--None--',
        status: 'New',
        owner: 'Anthony Davis',
        website: '',
        company: '',
        industry: '--None--',
        employees: '',
        source: '--None--',
        address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                company: initialData.company || '',
                status: initialData.status || 'New',
                rating: initialData.rating || '--None--',
                source: initialData.source || '--None--'
            });
        }
    }, [initialData, isOpen]);

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
            toast.error(err.response?.data?.message || 'Failed to save lead');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-sf">
            <div className="modal-content-sf fade-in">
                <div className="modal-header-sf">
                    <h3>{initialData ? 'Edit Lead' : 'New Lead'}</h3>
                    <button className="close-btn-sf" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body-sf">
                    {/* Section 1: Lead Information */}
                    <div className="form-section-sf">
                        <div className="section-title-sf">Lead Information</div>
                        <div className="form-grid-sf">
                            <div className="form-group-sf">
                                <label className="required-sf">Lead Status</label>
                                <select name="status" value={formData.status} onChange={handleInteract}>
                                    <option>New</option>
                                    <option>Working</option>
                                    <option>Nurturing</option>
                                    <option>Qualified</option>
                                </select>
                            </div>
                            <div className="form-group-sf">
                                <label>Lead Owner</label>
                                <div className="readonly-box-sf"><User size={14} /> {formData.owner}</div>
                            </div>

                            <div className="form-group-sf full-width-sf">
                                <label className="required-sf">Name</label>
                                <div className="name-subfields-sf">
                                    <select name="salutation" value={formData.salutation} onChange={handleInteract} style={{ width: '120px' }}>
                                        <option>--None--</option>
                                        <option>Mr.</option>
                                        <option>Ms.</option>
                                        <option>Dr.</option>
                                    </select>
                                    <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInteract} />
                                    <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleInteract} />
                                    <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInteract} />
                                    <input type="text" name="suffix" placeholder="Suffix" value={formData.suffix} onChange={handleInteract} style={{ width: '100px' }} />
                                </div>
                            </div>

                            <div className="form-group-sf">
                                <label>Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Website</label>
                                <input type="text" name="website" value={formData.website} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label className="required-sf">Company</label>
                                <input type="text" name="company" value={formData.company} onChange={handleInteract} required />
                            </div>
                            <div className="form-group-sf">
                                <label>Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Industry</label>
                                <select name="industry" value={formData.industry} onChange={handleInteract}>
                                    <option>--None--</option>
                                    <option>Technology</option>
                                    <option>Healthcare</option>
                                    <option>Finance</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Address Information */}
                    <div className="form-section-sf mt-sm">
                        <div className="section-title-sf">Address Information</div>
                        <div className="form-grid-sf">
                            <div className="form-group-sf full-width-sf">
                                <label>Street</label>
                                <textarea name="address.street" value={formData.address.street} onChange={handleInteract} style={{ height: '60px' }}></textarea>
                            </div>
                            <div className="form-group-sf">
                                <label>City</label>
                                <input type="text" name="address.city" value={formData.address.city} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>State/Province</label>
                                <input type="text" name="address.state" value={formData.address.state} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Zip/Postal Code</label>
                                <input type="text" name="address.zip" value={formData.address.zip} onChange={handleInteract} />
                            </div>
                            <div className="form-group-sf">
                                <label>Country</label>
                                <input type="text" name="address.country" value={formData.address.country} onChange={handleInteract} />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer-sf">
                        <button type="button" className="btn-sf secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn-sf secondary">Save & New</button>
                        <button type="submit" className="btn-sf primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadModal;
