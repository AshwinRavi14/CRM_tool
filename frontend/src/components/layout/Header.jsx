import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, Calendar, HelpCircle, LayoutGrid } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = ({ title = 'Home', onMenuClick }) => {
    const { user, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null); // 'notifications', 'apps', 'help', 'profile'

    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const placeholders = [
        "Search records...",
        "Search leads...",
        "Search accounts...",
        "Search opportunities..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 30000); // Change every 30 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 2) {
                try {
                    const res = await apiClient.get(`/search?q=${searchTerm}`);
                    setResults(res.data);
                    setShowResults(true);
                } catch (err) {
                    console.error('Search failed', err);
                }
            } else {
                setResults(null);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const toggleMenu = (menu) => {
        if (activeMenu === menu) {
            setActiveMenu(null);
        } else {
            setActiveMenu(menu);
        }
    };

    const handleLogout = () => {
        logout();
    };

    // Close menus when clicking outside (simple implementation)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.header-right') && !event.target.closest('.search-container')) {
                setActiveMenu(null);
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getInitials = () => {
        if (user && user.firstName && user.lastName) {
            return `${user.firstName}+${user.lastName}`;
        }
        return 'User';
    };

    return (
        <header className="header glass">
            <div className="header-left">
                <button className="menu-btn icon-btn" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
                <div className="search-container glass">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder={placeholders[placeholderIndex]}
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.length > 2 && setShowResults(true)}
                    />

                    {showResults && results && (
                        <div className="search-results-dropdown glass-card">
                            {['leads', 'accounts', 'opportunities'].map(type => (
                                results[type]?.length > 0 && (
                                    <div key={type} className="search-group">
                                        <div className="group-label">{type}</div>
                                        {results[type].map(item => (
                                            <div key={item._id} className="search-result-item">
                                                {item.firstName ? `${item.firstName} ${item.lastName}` : (item.companyName || item.name)}
                                            </div>
                                        ))}
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="header-center">
                {/* Empty or removed */}
            </div>

            <div className="header-right">
                <button className="icon-btn search-mobile">
                    <Search size={20} />
                </button>
                <div className="divider" />

                {/* Notifications */}
                <div className="relative-container">
                    <button className={`icon-btn ${activeMenu === 'notifications' ? 'active' : ''}`} onClick={() => toggleMenu('notifications')}>
                        <Bell size={20} />
                        <span className="badge" />
                    </button>
                    {activeMenu === 'notifications' && (
                        <div className="dropdown-menu glass-card">
                            <div className="dropdown-header">Notifications</div>
                            <div className="dropdown-item unread">
                                <p className="notification-title">New Lead Assigned</p>
                                <p className="notification-time">5 mins ago</p>
                            </div>
                            <div className="dropdown-item">
                                <p className="notification-title">Meeting with TechCorp</p>
                                <p className="notification-time">1 hour ago</p>
                            </div>
                            <div className="dropdown-footer">View All</div>
                        </div>
                    )}
                </div>

                {/* Calendar */}
                <button className="icon-btn" title="Calendar">
                    <Calendar size={20} />
                </button>

                {/* Help */}
                <div className="relative-container">
                    <button className={`icon-btn ${activeMenu === 'help' ? 'active' : ''}`} onClick={() => toggleMenu('help')}>
                        <HelpCircle size={20} />
                    </button>
                    {activeMenu === 'help' && (
                        <div className="dropdown-menu glass-card">
                            <div className="dropdown-item">Documentation</div>
                            <div className="dropdown-item">Support Ticket</div>
                            <div className="dropdown-item">Keyboard Shortcuts</div>
                        </div>
                    )}
                </div>

                {/* Apps Grid */}
                <div className="relative-container">
                    <button className={`icon-btn ${activeMenu === 'apps' ? 'active' : ''}`} onClick={() => toggleMenu('apps')}>
                        <LayoutGrid size={20} />
                    </button>
                    {activeMenu === 'apps' && (
                        <div className="dropdown-menu apps-dropdown glass-card">
                            <div className="dropdown-header">Wersel Apps</div>
                            <div className="apps-grid">
                                <div className="app-item">
                                    <div className="app-icon crm">CRM</div>
                                    <span>CRM</span>
                                </div>
                                <div className="app-item">
                                    <div className="app-icon mail">Mail</div>
                                    <span>Mail</span>
                                </div>
                                <div className="app-item">
                                    <div className="app-icon desk">Desk</div>
                                    <span>Desk</span>
                                </div>
                                <div className="app-item">
                                    <div className="app-icon books">Books</div>
                                    <span>Books</span>
                                </div>
                                <div className="app-item">
                                    <div className="app-icon chat">Chat</div>
                                    <span>Chat</span>
                                </div>
                                <div className="app-item">
                                    <div className="app-icon people">People</div>
                                    <span>People</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative-container profile-btn">
                    <img
                        src={`https://ui-avatars.com/api/?name=${getInitials()}&background=38bdf8&color=fff`}
                        alt="Profile"
                        className="avatar"
                        onClick={() => toggleMenu('profile')}
                    />
                    {activeMenu === 'profile' && (
                        <div className="dropdown-menu profile-menu glass-card">
                            <div className="profile-header">
                                <div className="profile-name">{user?.firstName} {user?.lastName}</div>
                                <div className="profile-email">{user?.email}</div>
                            </div>
                            <div className="divider-h"></div>
                            <div className="dropdown-item">My Profile</div>
                            <div className="dropdown-item">Settings</div>
                            <div className="divider-h"></div>
                            <div className="dropdown-item dangerous" onClick={handleLogout}>Logout</div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
