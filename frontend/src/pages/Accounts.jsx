import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    Search,
    ExternalLink,
    MoreVertical,
    Plus,
    Globe,
    MapPin,
    Users,
    Download,
    Activity
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../services/apiClient';
import AccountModal from '../components/accounts/AccountModal';
import './Accounts.css';

const Accounts = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const toast = useToast();

    const fetchAccounts = async () => {
        try {
            const res = await apiClient.get('/accounts');
            // apiClient interceptor returns response.data
            // Backend returns { success: true, data: [ARRAY], ... }
            // So res is { success, data, ... } and res.data is the array
            setAccounts(res.data || []);
        } catch (err) {
            console.error('Failed to load accounts:', err);
            toast.error('Failed to load accounts. Displaying demo data.');
            setAccounts([
                { id: 'demo1', companyName: 'Quantum Systems', industry: 'AI_DEVELOPMENT', accountType: 'CUSTOMER', billingAddress: { city: 'San Francisco' }, owner: 'Cleona Davis', website: 'quantum.ai' },
                { id: 'demo2', companyName: 'Global Retail Corp', industry: 'RETAIL', accountType: 'PROSPECT', billingAddress: { city: 'London' }, owner: 'John Smith', website: 'globalretail.com' },
            ]);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

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

    const handleEdit = (account) => {
        setSelectedAccount(account);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAccount(null);
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
            toast.error('Export failed. Please try again.');
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

    return (
        <div className="accounts-container">
            <div className="accounts-header glass-card">
                <div className="header-info">
                    <h2>Accounts</h2>
                    <p>Organize and manage your client organizations.</p>
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
                    <div className="accounts-search glass">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="create-btn" onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        <span>Add Account</span>
                    </button>
                </div>
            </div>

            <div className="accounts-grid">
                {filteredAccounts.map(account => (
                    <div key={account.id || account._id} className="account-card glass-card">
                        <div
                            className="card-top"
                            onClick={() => navigate(`/accounts/${account._id || account.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="account-icon glass">
                                <Building2 size={24} color="#38bdf8" />
                            </div>
                            <span className={`account-type-badge ${(account.type || account.accountType || '').toLowerCase()}`}>
                                {account.type || account.accountType}
                            </span>
                        </div>

                        <div
                            className="card-middle"
                            onClick={() => navigate(`/accounts/${account._id || account.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h3 className="account-name">{account.name || account.companyName}</h3>
                            <p className="account-industry">{(account.industry || '').replace('_', ' ')}</p>
                        </div>

                        <div className="card-details">
                            <div className="detail-item">
                                <MapPin size={14} />
                                <span>{account.city || (account.billingAddress && account.billingAddress.city) || 'No city'}</span>
                            </div>
                            <div className="detail-item">
                                <Globe size={14} />
                                <span>{account.website || 'No website'}</span>
                            </div>
                            <div className="detail-item">
                                <Users size={14} />
                                <span>Owned by {
                                    account.owner?.firstName
                                        ? `${account.owner.firstName} ${account.owner.lastName}`
                                        : (account.owner?.name || (typeof account.owner === 'string' ? account.owner : 'System'))
                                }</span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button
                                className="view-details-btn"
                                onClick={() => navigate(`/accounts/${account._id || account.id}`)}
                            >
                                <Activity size={14} />
                                <span>Intelligence Report</span>
                            </button>
                            <button className="icon-btn-rect glass" onClick={() => handleEdit(account)}>
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {filteredAccounts.length === 0 && (
                    <div className="empty-state-card glass-card">
                        <Search size={48} />
                        <p>No accounts found matching your search.</p>
                        {searchQuery && <button className="text-btn" onClick={() => setSearchQuery('')}>Clear search</button>}
                    </div>
                )}
            </div>

            {showModal && (
                <AccountModal
                    onClose={handleCloseModal}
                    onSave={handleSaveAccount}
                    initialData={selectedAccount}
                    title={selectedAccount ? "Edit Account" : "Add New Account"}
                />
            )}
        </div>
    );
};

export default Accounts;
