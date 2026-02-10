import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Search, Filter, MoreVertical, FileText, Send,
    CheckCircle, XCircle, Clock, Download, Trash2, Edit, Eye, ChevronDown
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import QuoteModal from '../components/quotes/QuoteModal';
import './Quotes.css';

const STATUS_CONFIG = {
    DRAFT: { label: 'Draft', color: '#94a3b8', icon: FileText },
    SENT: { label: 'Sent', color: '#3b82f6', icon: Send },
    ACCEPTED: { label: 'Accepted', color: '#10b981', icon: CheckCircle },
    REJECTED: { label: 'Rejected', color: '#ef4444', icon: XCircle },
    EXPIRED: { label: 'Expired', color: '#f59e0b', icon: Clock }
};

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [actionMenu, setActionMenu] = useState(null);
    const { showToast } = useToast();

    const fetchQuotes = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter !== 'ALL') params.append('status', statusFilter);
            const res = await apiClient.get(`/quotes?${params}`);
            setQuotes(res.data.quotes || []);
        } catch (err) {
            showToast('Failed to load quotes', 'error');
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this quote?')) return;
        try {
            await apiClient.delete(`/quotes/${id}`);
            showToast('Quote deleted', 'success');
            fetchQuotes();
        } catch { showToast('Failed to delete', 'error'); }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await apiClient.patch(`/quotes/${id}/status`, { status });
            showToast(`Quote marked as ${status.toLowerCase()}`, 'success');
            fetchQuotes();
        } catch { showToast('Failed to update status', 'error'); }
        setActionMenu(null);
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

    return (
        <div className="quotes-container">
            {/* Header */}
            <div className="quotes-header glass-card">
                <div className="header-info">
                    <h2>Quotes</h2>
                    <p>{quotes.length} quote{quotes.length !== 1 ? 's' : ''} total</p>
                </div>
                <div className="header-actions">
                    <div className="quotes-search glass">
                        <Search size={16} />
                        <input type="text" placeholder="Search quotes..." value={search}
                            onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="status-filter glass">
                        <Filter size={16} />
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="ALL">All Status</option>
                            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="select-arrow" />
                    </div>
                    <button className="create-btn" onClick={() => { setSelectedQuote(null); setModalOpen(true); }}>
                        <Plus size={18} /> <span>New Quote</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="quotes-table-wrapper glass-card">
                {loading ? (
                    <div className="loading-state"><div className="spinner" /><p>Loading quotes...</p></div>
                ) : quotes.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={48} strokeWidth={1} />
                        <h3>No quotes found</h3>
                        <p>Create your first quote to get started.</p>
                        <button className="create-btn" onClick={() => setModalOpen(true)}>
                            <Plus size={18} /> New Quote
                        </button>
                    </div>
                ) : (
                    <table className="quotes-table">
                        <thead>
                            <tr>
                                <th>Quote #</th>
                                <th>Contact</th>
                                <th>Company</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Valid Until</th>
                                <th>Created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map(q => {
                                const cfg = STATUS_CONFIG[q.status] || STATUS_CONFIG.DRAFT;
                                const Icon = cfg.icon;
                                return (
                                    <tr key={q._id}>
                                        <td className="quote-number">{q.quoteNumber}</td>
                                        <td>{q.contactName || '—'}</td>
                                        <td>{q.companyName || '—'}</td>
                                        <td>{q.items?.length || 0}</td>
                                        <td className="amount">{formatCurrency(q.totalAmount)}</td>
                                        <td>
                                            <span className="status-badge" style={{ '--status-color': cfg.color }}>
                                                <Icon size={12} /> {cfg.label}
                                            </span>
                                        </td>
                                        <td>{formatDate(q.validUntil)}</td>
                                        <td>{formatDate(q.createdAt)}</td>
                                        <td className="actions-cell">
                                            <button className="action-trigger" onClick={() => setActionMenu(actionMenu === q._id ? null : q._id)}>
                                                <MoreVertical size={16} />
                                            </button>
                                            {actionMenu === q._id && (
                                                <div className="action-dropdown glass-card">
                                                    <div className="action-item" onClick={() => { setSelectedQuote(q); setModalOpen(true); setActionMenu(null); }}>
                                                        <Edit size={14} /> Edit
                                                    </div>
                                                    {q.status === 'DRAFT' && (
                                                        <div className="action-item" onClick={() => handleStatusChange(q._id, 'SENT')}>
                                                            <Send size={14} /> Mark Sent
                                                        </div>
                                                    )}
                                                    {q.status === 'SENT' && (
                                                        <>
                                                            <div className="action-item success" onClick={() => handleStatusChange(q._id, 'ACCEPTED')}>
                                                                <CheckCircle size={14} /> Accept
                                                            </div>
                                                            <div className="action-item danger" onClick={() => handleStatusChange(q._id, 'REJECTED')}>
                                                                <XCircle size={14} /> Reject
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="action-item danger" onClick={() => { handleDelete(q._id); setActionMenu(null); }}>
                                                        <Trash2 size={14} /> Delete
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {modalOpen && (
                <QuoteModal
                    quote={selectedQuote}
                    onClose={() => { setModalOpen(false); setSelectedQuote(null); }}
                    onSave={() => { setModalOpen(false); setSelectedQuote(null); fetchQuotes(); }}
                />
            )}
        </div>
    );
};

export default Quotes;
