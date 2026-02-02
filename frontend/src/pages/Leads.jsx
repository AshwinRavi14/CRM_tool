import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    ExternalLink,
    Download,
    Upload,
    Calendar,
    Target
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import LeadModal from '../components/leads/LeadModal';
import './Leads.css';

const Leads = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const toast = useToast();

    const fetchLeads = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/leads');
            // Assuming API returns { data: { leads: [...] } } or similar based on Leads.jsx:26
            setLeads(Array.isArray(res.data) ? res.data : (res.data.leads || []));
        } catch (err) {
            console.error('Failed to load leads:', err);
            toast.error('Failed to load leads.');
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const handleExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            const response = await apiClient.get('/bulk/export/leads', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'leads_export.csv');
            document.body.appendChild(link);
            link.click();
            toast.success('Leads exported successfully');
        } catch (err) {
            toast.error('Export failed');
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        setIsImporting(true);

        try {
            await apiClient.post('/bulk/import/leads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Leads imported successfully');
            fetchLeads();
        } catch (err) {
            toast.error('Import failed. Please check CSV format.');
        } finally {
            setIsImporting(false);
        }
    };

    const handleConvertLead = async (e, lead) => {
        e.stopPropagation(); // Don't trigger edit modal
        if (!window.confirm(`Convert ${lead.firstName || lead.name} to an Account and Contact?`)) return;

        try {
            toast.info('Converting lead...');
            const res = await apiClient.post(`/leads/${lead._id}/convert`);
            toast.success('Lead converted successfully!');
            fetchLeads(); // Refresh list to show CONVERTED status

            // Navigate to the new account if returned
            if (res.data?.account?._id) {
                navigate(`/accounts/${res.data.account._id}`);
            }
        } catch (err) {
            console.error('Conversion failed:', err);
            toast.error(err.response?.data?.message || 'Failed to convert lead');
        }
    };

    const handleEditLead = (lead) => {
        setSelectedLead(lead);
        setShowModal(true);
    };

    const handleCreateClick = () => {
        setSelectedLead(null);
        setShowModal(true);
    };

    const filteredLeads = leads.filter(lead => {
        const fullName = `${lead.firstName || ''} ${lead.lastName || ''} ${lead.name || ''}`.toLowerCase();
        const company = (lead.company || '').toLowerCase();
        const email = (lead.email || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || company.includes(query) || email.includes(query);
    });

    return (
        <div className="leads-container">
            <div className="leads-header glass-card">
                <div className="header-info">
                    <h2>Leads</h2>
                    <p>Manage and track your potential customers.</p>
                </div>
                <div className="header-actions">
                    <button
                        className={`icon-btn-rect glass ${isExporting ? 'loading' : ''}`}
                        onClick={handleExport}
                        disabled={isExporting}
                        title="Export CSV"
                    >
                        <Download size={18} />
                    </button>
                    <label className={`icon-btn-rect glass pointer ${isImporting ? 'loading' : ''}`} title="Import CSV">
                        <Upload size={18} />
                        <input type="file" hidden onChange={handleImport} accept=".csv" disabled={isImporting} />
                    </label>
                    <div className="leads-search glass">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Filter leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="create-btn" onClick={handleCreateClick}>
                        <Plus size={18} />
                        <span>Create Lead</span>
                    </button>
                </div>
            </div>

            <div className="leads-list glass-card">
                <div className="table-responsive">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Lead Name</th>
                                <th>Company</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Rating</th>
                                <th style={{ width: '80px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div className="loading-spinner">Loading leads...</div>
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div className="empty-state">No leads found.</div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map(lead => (
                                    <tr key={lead._id || lead.id} onClick={() => handleEditLead(lead)} className="clickable-row">
                                        <td className="name-cell">
                                            <div className="lead-avatar">{(lead.firstName || lead.name || '?').charAt(0)}</div>
                                            <span>
                                                {lead.firstName
                                                    ? `${lead.firstName} ${lead.lastName}`
                                                    : (lead.name || 'Unknown Lead')}
                                            </span>
                                        </td>
                                        <td>{lead.company || 'Private'}</td>
                                        <td>
                                            <div className="icon-link">
                                                <Mail size={14} />
                                                {lead.email}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="icon-link">
                                                <Phone size={14} />
                                                {lead.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge-outline ${(lead.status || 'NEW').toLowerCase()}`}>
                                                {lead.status || 'NEW'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`rating-badge ${(lead.rating || 'COLD').toLowerCase()}`}>
                                                {lead.rating || 'COLD'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                {lead.status !== 'CONVERTED' && (
                                                    <button
                                                        className="icon-btn-sm glass"
                                                        onClick={(e) => handleConvertLead(e, lead)}
                                                        title="Convert to Account"
                                                        style={{ color: 'var(--success)' }}
                                                    >
                                                        <Target size={16} />
                                                    </button>
                                                )}
                                                <button className="icon-btn-sm glass">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && filteredLeads.length > 0 && (
                    <div className="leads-pagination">
                        <p>Showing {filteredLeads.length} of {leads.length} leads</p>
                        <div className="pagination-btns">
                            <button className="page-btn active">1</button>
                        </div>
                    </div>
                )}
            </div>

            <LeadModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchLeads}
                initialData={selectedLead}
            />
        </div>
    );
};

export default Leads;
