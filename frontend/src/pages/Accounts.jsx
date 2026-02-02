import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    Search,
    MoreVertical,
    Plus,
    Download,
    Pin,
    Star,
    RefreshCw,
    LayoutGrid,
    List,
    LayoutList,
    ChevronDown,
    Mail,
    Phone,
    Building,
    Settings,
    Pencil,
    BarChart2,
    Filter
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import AccountModal from '../components/accounts/AccountModal';
import './Accounts.css';

const Accounts = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const toast = useToast();

    const fetchAccounts = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/accounts');
            setAccounts(res.data || []);
        } catch (err) {
            console.error('Failed to load accounts:', err);
            toast.error('Failed to load accounts.');
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleSaveAccount = async (accountData) => {
        try {
            if (selectedAccount) {
                await apiClient.put(`/accounts/${selectedAccount._id || selectedAccount.id}`, accountData);
                toast.success('Account updated successfully');
            } else {
                await apiClient.post('/accounts', accountData);
                toast.success('Account created successfully');
            }
            setShowModal(false);
            setSelectedAccount(null);
            fetchAccounts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save account');
        }
    };

    const handleExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            const response = await apiClient.get('/bulk/export/accounts', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `accounts_export_${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(link);
            link.click();
            toast.success('Accounts exported successfully');
        } catch (err) {
            toast.error('Export failed.');
        } finally {
            setIsExporting(false);
        }
    };

    const filteredAccounts = accounts.filter(account => {
        const name = (account.name || account.companyName || '').toLowerCase();
        const industry = (account.industry || '').toLowerCase();
        const city = (account.city || (account.billingAddress && account.billingAddress.city) || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || industry.includes(query) || city.includes(query);
    });

    // Account Stats
    const stats = {
        total: accounts.length,
        customers: accounts.filter(a => a.accountType === 'CUSTOMER').length,
        prospects: accounts.filter(a => a.accountType === 'PROSPECT').length,
        noActivity: accounts.length > 0 ? 1 : 0
    };

    return (
        <div className="accounts-page-sf fade-in">
            {/* High-Fidelity Salesforce Header */}
            <div className="accounts-header-sf">
                {/* Row 1: Entity & Actions */}
                <div className="header-row-top-sf">
                    <div className="entity-block-sf">
                        <div className="entity-icon-sf account"><Building2 size={22} color="white" /></div>
                        <div className="entity-text-sf">
                            <span className="entity-label-sf">Accounts</span>
                            <h2 className="entity-title-sf">
                                All Accounts <ChevronDown size={14} className="caret-sf" />
                                <button className="pin-btn-sf"><Pin size={14} fill="#0176d3" color="#0176d3" /></button>
                            </h2>
                        </div>
                    </div>
                    <div className="header-actions-sf">
                        <div className="btn-group-sf">
                            <button className="btn-sf" onClick={() => { setSelectedAccount(null); setShowModal(true); }}>New</button>
                            <button className="btn-sf">Import</button>
                            <button className="btn-sf">Assign</button>
                        </div>
                    </div>
                </div>

                {/* Row 2: Metadata Summary */}
                <div className="header-row-meta-sf">
                    <span>{filteredAccounts.length} items • Sorted by Account Name • Filtered by All Accounts • Updated a few seconds ago</span>
                </div>

                {/* Row 3: Toolbar */}
                <div className="header-row-toolbar-sf">
                    <div className="toolbar-search-sf">
                        <Search size={14} className="search-icon-sf" />
                        <input
                            type="text"
                            placeholder="Search this list..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="toolbar-controls-sf">
                        <button className="icon-ctrl-sf careted"><Settings size={16} /><ChevronDown size={10} /></button>
                        <button className="icon-ctrl-sf careted"><LayoutList size={16} /><ChevronDown size={10} /></button>
                        <button className="icon-ctrl-sf"><Pencil size={16} /></button>
                        <button className="icon-ctrl-sf" onClick={fetchAccounts}><RefreshCw size={16} /></button>
                        <button className="icon-ctrl-sf"><BarChart2 size={16} /></button>
                        <button className="icon-ctrl-sf"><Filter size={16} /></button>
                        <button className="icon-ctrl-sf"><ChevronDown size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Accounts Table */}
            <div className="accounts-content-area">
                <div className="table-responsive-salesforce">
                    <table className="accounts-table-sf">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}><div className="sf-checkbox-header"><ChevronDown size={14} /></div></th>
                                <th style={{ width: '40px' }}></th>
                                <th>Account Name <ChevronDown size={10} /></th>
                                <th>Type <ChevronDown size={10} /></th>
                                <th>Last Activity <ChevronDown size={10} /></th>
                                <th>Next Activity <ChevronDown size={10} /></th>
                                <th>Open Opportunities <ChevronDown size={10} /></th>
                                <th>Next Opportunities <ChevronDown size={10} /></th>
                                <th>Open Cases <ChevronDown size={10} /></th>
                                <th>YTD Spending <ChevronDown size={10} /></th>
                                <th>Owner <ChevronDown size={10} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="11" className="empty-td"><RefreshCw className="spinner" /> Loading...</td></tr>
                            ) : filteredAccounts.map((account, i) => (
                                <tr key={account._id || account.id} className="salesforce-row" onClick={() => navigate(`/accounts/${account._id || account.id}`)}>
                                    <td><input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                                    <td></td>
                                    <td className="primary-cell">
                                        <Star size={14} className="bookmark-icon" />
                                        <span className="text-primary-link">{account.name || account.companyName}</span>
                                    </td>
                                    <td>
                                        <span className="text-muted">{account.type || account.accountType || 'Prospect'}</span>
                                    </td>
                                    <td className="text-muted">--</td>
                                    <td className="text-muted">--</td>
                                    <td className="text-muted">0</td>
                                    <td className="text-muted">--</td>
                                    <td className="text-muted">0</td>
                                    <td className="text-muted">$0.00</td>
                                    <td className="text-muted">Anthony Davis</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <AccountModal
                    onClose={() => { setShowModal(false); setSelectedAccount(null); }}
                    onSave={handleSaveAccount}
                    initialData={selectedAccount}
                    title={selectedAccount ? "Edit Account" : "Add New Account"}
                />
            )}
        </div>
    );
};

export default Accounts;
