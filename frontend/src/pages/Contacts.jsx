import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Search,
    Plus,
    Mail,
    Phone,
    ShieldCheck,
    Building,
    MoreVertical,
    ChevronDown,
    X,
    Loader
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import ContactModal from '../components/contacts/ContactModal';
import './Contacts.css';

const Contacts = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const toast = useToast();

    // Fetch Contacts
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const contactsRes = await apiClient.get('/contacts');
            setContacts(contactsRes.data || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            toast.error('Failed to load contacts data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleDecisionMaker = async (contact) => {
        try {
            const updatedStatus = !contact.isDecisionMaker;
            // Optimistic update
            setContacts(prev => prev.map(c =>
                c._id === contact._id ? { ...c, isDecisionMaker: updatedStatus } : c
            ));

            await apiClient.put(`/contacts/${contact._id}`, {
                isDecisionMaker: updatedStatus
            });

            toast.success(`Updated ${contact.firstName}'s status`);
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error('Failed to update status');
            fetchData(); // Revert on error
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="contacts-container">
            <div className="contacts-header glass-card">
                <div className="header-info">
                    <h2>Contacts</h2>
                    <p>Maintain your directory of key stakeholders and decision makers.</p>
                </div>
                <div className="header-actions">
                    <div className="contacts-search glass">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="create-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        <span>Add Contact</span>
                    </button>
                </div>
            </div>

            <div className="contacts-list glass-card">
                {isLoading ? (
                    <div className="loading-state">
                        <Loader size={32} className="animate-spin" />
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="contacts-table">
                            <thead>
                                <tr>
                                    <th>Full Name <ChevronDown size={14} /></th>
                                    <th>Account</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Decision Maker</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContacts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-state">
                                            No contacts found. Create one to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContacts.map(contact => (
                                        <tr key={contact._id}>
                                            <td className="name-cell">
                                                <div className="contact-avatar glass">
                                                    {(contact.firstName?.[0] || '') + (contact.lastName?.[0] || '')}
                                                </div>
                                                <div>
                                                    <span className="contact-name">{contact.firstName} {contact.lastName}</span>
                                                    <span className="contact-title">{contact.title}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className="account-link"
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                    onClick={() => {
                                                        if (contact.account?._id) {
                                                            navigate(`/accounts/${contact.account._id}`);
                                                        } else {
                                                            navigate('/accounts');
                                                        }
                                                    }}
                                                >
                                                    <Building size={14} color="var(--primary)" />
                                                    <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
                                                        {contact.account?.companyName || 'Unknown Account (Click to go to Accounts)'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="icon-link">
                                                    <Mail size={14} />
                                                    {contact.email}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="icon-link">
                                                    <Phone size={14} />
                                                    {contact.phone}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <label className="switch">
                                                        <input
                                                            type="checkbox"
                                                            checked={contact.isDecisionMaker}
                                                            onChange={() => toggleDecisionMaker(contact)}
                                                        />
                                                        <span className="slider"></span>
                                                    </label>
                                                    <span style={{ fontSize: '0.75rem', color: contact.isDecisionMaker ? 'var(--success)' : 'var(--text-secondary)', fontWeight: 600 }}>
                                                        {contact.isDecisionMaker ? 'YES' : 'NO'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reusable Contact Modal */}
            {isModalOpen && (
                <ContactModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchData}
                />
            )}
        </div>
    );
};

export default Contacts;
