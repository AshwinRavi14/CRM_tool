import React, { useState, useEffect, useCallback } from 'react';
import {
    Users,
    Shield,
    Trash2,
    Search,
    RefreshCw,
    ChevronDown,
    ShieldCheck,
    ShieldAlert,
    UserCircle
} from 'lucide-react';
import apiClient from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', role: 'SALES_REP' });
    const [invitations, setInvitations] = useState([]);
    const toast = useToast();

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const [usersRes, invitesRes] = await Promise.all([
                apiClient.get('/users'),
                apiClient.get('/invitations')
            ]);
            setUsers(usersRes.data || []);
            setInvitations(invitesRes.data || []);
        } catch (err) {
            console.error('Failed to load user data:', err);
            toast.error('Failed to load user management data');
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            toast.info(`Updating role to ${newRole}...`);
            await apiClient.patch(`/users/${userId}/role`, { role: newRole });
            toast.success('Role updated successfully');
            fetchUsers();
        } catch (err) {
            toast.error(err.message || 'Failed to update role');
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await apiClient.post('/invitations', inviteData);
            toast.success(`Invitation sent to ${inviteData.email}`);
            setIsInviteModalOpen(false);
            setInviteData({ email: '', role: 'SALES_REP' });
            fetchUsers();
        } catch (err) {
            toast.error(err.message || 'Failed to send invitation');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevokeInvite = async (inviteId) => {
        try {
            await apiClient.delete(`/invitations/${inviteId}`);
            toast.success('Invitation revoked');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to revoke invitation');
        }
    };

    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) return;
        try {
            await apiClient.delete(`/users/${user._id}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => {
        const fullInfo = `${user.firstName} ${user.lastName} ${user.email} ${user.role}`.toLowerCase();
        return fullInfo.includes(searchQuery.toLowerCase());
    });

    const roles = [
        'ADMIN',
        'SALES_MANAGER',
        'SALES_REP',
        'ACCOUNT_MANAGER',
        'PROJECT_MANAGER',
        'SUPPORT_STAFF'
    ];

    return (
        <div className="user-mgmt-page fade-in">
            <div className="intelligence-header">
                <div className="header-top">
                    <div className="header-title-area">
                        <div className="entity-icon user-mgmt"><Users size={20} color="white" /></div>
                        <div>
                            <div className="entity-type">Administration</div>
                            <h2 className="entity-title">User Management <ChevronDown size={14} /></h2>
                        </div>
                    </div>
                    <div className="header-actions-area">
                        <button className="primary-btn-salesforce" onClick={() => setIsInviteModalOpen(true)}>
                            Invite Team Member
                        </button>
                        <button className="icon-btn-salesforce" onClick={fetchUsers}>
                            <RefreshCw size={14} className={isLoading ? 'spinner' : ''} />
                        </button>
                    </div>
                </div>

                <div className="list-toolbar" style={{ marginTop: '20px' }}>
                    <div className="toolbar-left-actions">
                        <span className="item-count text-muted">{filteredUsers.length} users in organization</span>
                    </div>
                    <div className="toolbar-search">
                        <Search size={14} className="search-icon-muted" />
                        <input
                            type="text"
                            placeholder="Search users, roles, or emails..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="user-mgmt-content">
                <div className="table-responsive-salesforce glass-card">
                    <table className="leads-table-salesforce">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Current Role</th>
                                <th>Assign New Role</th>
                                <th style={{ width: '80px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="empty-td"><RefreshCw className="spinner" /> Loading Users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="empty-td">No users found</td></tr>
                            ) : filteredUsers.map((u) => (
                                <tr key={u._id} className="salesforce-row">
                                    <td className="primary-cell">
                                        <div className="user-name-cell">
                                            {u.role === 'ADMIN' ?
                                                <ShieldCheck size={16} color="var(--primary)" /> :
                                                <UserCircle size={16} className="text-muted" />
                                            }
                                            <span className="text-primary-link">{u.firstName} {u.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted">{u.email}</td>
                                    <td>
                                        <span className={`role-badge ${u.role.toLowerCase()}`}>
                                            {u.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="role-select-sf"
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        >
                                            {roles.map(r => (
                                                <option key={r} value={r}>{r.replace('_', ' ')}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            <button
                                                className="action-circle danger"
                                                title="Delete User"
                                                onClick={() => handleDeleteUser(u)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pending Invitations Section */}
                {invitations.filter(i => i.status === 'PENDING').length > 0 && (
                    <div style={{ marginTop: '30px' }}>
                        <h3 className="section-subtitle">Pending Invitations</h3>
                        <div className="table-responsive-salesforce glass-card">
                            <table className="leads-table-salesforce">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Expiry</th>
                                        <th style={{ width: '80px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invitations.filter(i => i.status === 'PENDING').map(invite => (
                                        <tr key={invite._id} className="salesforce-row">
                                            <td className="text-primary-link">{invite.email}</td>
                                            <td>
                                                <span className={`role-badge ${invite.role.toLowerCase()}`}>
                                                    {invite.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${invite.status.toLowerCase()}`}>
                                                    {invite.status}
                                                </span>
                                            </td>
                                            <td className="text-muted">
                                                {new Date(invite.expiresAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button
                                                    className="action-circle danger"
                                                    title="Revoke Invite"
                                                    onClick={() => handleRevokeInvite(invite._id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card fade-in">
                        <div className="modal-header">
                            <h3>Invite New Team Member</h3>
                            <button className="close-btn" onClick={() => setIsInviteModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleInvite}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="sf-input"
                                    placeholder="Enter colleague's email..."
                                    value={inviteData.email}
                                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Assigned Role</label>
                                <select
                                    className="sf-select"
                                    value={inviteData.role}
                                    onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                                >
                                    {roles.map(r => (
                                        <option key={r} value={r}>{r.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="secondary-btn-salesforce" onClick={() => setIsInviteModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn-salesforce" disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
