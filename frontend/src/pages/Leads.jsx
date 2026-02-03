import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Download,
    Upload,
    Target,
    Star,
    RefreshCw,
    LayoutGrid,
    List,
    ChevronDown,
    Calendar,
    AlertCircle,
    Clock
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
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [activeFilter, setActiveFilter] = useState('total');
    const toast = useToast();

    const fetchLeads = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/leads');
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
        e.stopPropagation();
        if (!window.confirm(`Convert ${lead.firstName || lead.name} to an Account and Contact?`)) return;
        try {
            toast.info('Converting lead...');
            const res = await apiClient.post(`/leads/${lead._id}/convert`);
            toast.success('Lead converted successfully!');
            fetchLeads();
            if (res.data?.account?._id) {
                navigate(`/accounts/${res.data.account._id}`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to convert lead');
        }
    };

    const filteredLeads = leads.filter(lead => {
        const fullName = `${lead.firstName || ''} ${lead.lastName || ''} ${lead.name || ''}`.toLowerCase();
        const company = (lead.company || '').toLowerCase();
        const email = (lead.email || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || company.includes(query) || email.includes(query);
    });

    // Intelligence Stats Calculations from actual data
    const stats = {
        total: leads.length,
        noActivity: leads.filter(l => l.status === 'NEW' && !l.lastContactDate).length,
        idle: leads.filter(l => l.status === 'WORKING' && new Date(l.updatedAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
        noUpcoming: leads.length, // Placeholder for tasks logic
        overdue: 2, // Placeholder
        dueToday: 1  // Placeholder
    };

    return (
        <div className="leads-page fade-in">
            {/* Salesforce Style Header */}
            <div className="intelligence-header">
                <div className="header-top">
                    <div className="header-title-area">
                        <div className="entity-icon lead"><Target size={20} color="white" /></div>
                        <div>
                            <div className="entity-type">Leads</div>
                            <h2 className="entity-title">Intelligence View <ChevronDown size={14} /></h2>
                        </div>
                    </div>
                    <div className="header-actions-area">
                        <div className="action-button-group">
                            <button className="icon-btn-salesforce"><RefreshCw size={14} /></button>
                            <button className="icon-btn-salesforce" onClick={() => setViewMode('list')}><List size={14} /></button>
                            <button className="icon-btn-salesforce" onClick={() => setViewMode('grid')}><LayoutGrid size={14} /></button>
                        </div>
                        <button className="btn-primary-salesforce" onClick={() => { setSelectedLead(null); setShowModal(true); }}>New</button>
                    </div>
                </div>

                {/* Intelligence Stats Ribbon */}
                <div className="stats-ribbon">
                    <div
                        className={`stat-box ${activeFilter === 'total' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('total')}
                    >
                        <span className="stat-label">Total Leads</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                    <div
                        className={`stat-box ${activeFilter === 'noActivity' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('noActivity')}
                    >
                        <span className="stat-label">No Activity</span>
                        <span className="stat-value">{stats.noActivity}</span>
                    </div>
                    <div
                        className={`stat-box ${activeFilter === 'idle' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('idle')}
                    >
                        <span className="stat-label">Idle</span>
                        <span className="stat-value">{stats.idle}</span>
                    </div>
                    <div
                        className={`stat-box ${activeFilter === 'overdue' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('overdue')}
                    >
                        <span className="stat-label">Overdue</span>
                        <span className="stat-value danger">{stats.overdue}</span>
                    </div>
                    <div
                        className={`stat-box ${activeFilter === 'dueToday' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('dueToday')}
                    >
                        <span className="stat-label">Due Today</span>
                        <span className="stat-value info">{stats.dueToday}</span>
                    </div>
                </div>

                <div className="list-toolbar">
                    <div className="toolbar-left-actions">
                        <span className="item-count text-muted">{filteredLeads.length} items • Filtered by My Leads</span>
                        <button className="btn-text-salesforce">Add to Campaign</button>
                        <button className="btn-text-salesforce">Change Status</button>
                        <button className="btn-text-salesforce">Assign Label</button>
                    </div>
                    <div className="toolbar-search">
                        <Search size={14} className="search-icon-muted" />
                        <input
                            type="text"
                            placeholder="Search this list..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Leads Table */}
            <div className="leads-content-area">
                <div className="table-responsive-salesforce">
                    <table className="leads-table-salesforce">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}><input type="checkbox" /></th>
                                <th>Name</th>
                                <th>Title</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Lead Source</th>
                                <th>Last Activity</th>
                                <th style={{ width: '120px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="8" className="empty-td"><RefreshCw className="spinner" /> Loading...</td></tr>
                            ) : filteredLeads.map((lead, i) => (
                                <tr key={lead._id || lead.id} className="salesforce-row" onClick={() => { setSelectedLead(lead); setShowModal(true); }}>
                                    <td><input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                                    <td className="primary-cell">
                                        <Star size={14} className="bookmark-icon" />
                                        <span className="text-primary-link">{lead.firstName} {lead.lastName}</span>
                                    </td>
                                    <td className="text-muted">{lead.title || 'Senior VP'}</td>
                                    <td className="text-muted">{lead.company || 'Veritas Ventures'}</td>
                                    <td>
                                        <span className={`status-pill ${lead.status?.toLowerCase() || 'new'}`}>
                                            {lead.status || 'New'}
                                        </span>
                                    </td>
                                    <td className="text-muted">Trade Show</td>
                                    <td className="text-muted">24/02/2026</td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="action-circle" title="Email" onClick={(e) => e.stopPropagation()}><Mail size={14} /></button>
                                            <button className="action-circle" title="Call" onClick={(e) => e.stopPropagation()}><Phone size={14} /></button>
                                            <button className="action-circle" title="Convert" onClick={(e) => handleConvertLead(e, lead)}><Target size={14} /></button>
                                            <button className="action-circle" onClick={(e) => e.stopPropagation()}><ChevronDown size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
