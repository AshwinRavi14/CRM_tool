import React, { useState, useEffect } from 'react';
import {
    Menu,
    Search,
    Bell,
    Calendar,
    HelpCircle,
    LayoutGrid,
    ChevronDown,
    Cloud,
    Settings,
    Star,
    Plus,
    Home,
    Users,
    UserSquare2,
    Building2,
    Briefcase,
    FolderKanban,
    BarChart3,
    PieChart,
    LogOut
} from 'lucide-react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const navItems = [
        { name: 'Home', path: '/', exact: true },
        { name: 'Leads', path: '/leads' },
        { name: 'Contacts', path: '/contacts' },
        { name: 'Accounts', path: '/accounts' },
        { name: 'Opportunities', path: '/opportunities' },
        { name: 'Projects', path: '/projects' },
        { name: 'Reports', path: '/reports' },
        { name: 'Dashboards', path: '/analytics' },
    ];

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
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const handleLogout = (e) => {
        e.stopPropagation();
        logout();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.header-right-sf') && !event.target.closest('.search-container-sf')) {
                setActiveMenu(null);
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = () => {
        if (user && user.firstName && user.lastName) {
            return `${user.firstName}+${user.lastName}`;
        }
        return 'User';
    };

    return (
        <header className="header-salesforce">
            {/* Top Row: Logo, Search, Utilities */}
            <div className="header-top-row">
                <div className="header-left-sf">
                    <div className="logo-sf" onClick={() => navigate('/')}>
                        <Cloud size={32} color="#0176d3" fill="#0176d3" />
                    </div>
                    <div className="app-launcher">
                        <LayoutGrid size={20} />
                    </div>
                </div>

                <div className="header-center-sf">
                    <div className="search-container-sf">
                        <Search size={16} className="search-icon-sf" />
                        <input
                            type="text"
                            placeholder="Search setup, records, and more..."
                            className="search-input-sf"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {showResults && results && (
                            <div className="search-results-sf glass-card">
                                {['leads', 'accounts', 'opportunities'].map(type => (
                                    results[type]?.length > 0 && (
                                        <div key={type} className="search-group-sf">
                                            <div className="group-label-sf">{type}</div>
                                            {results[type].map(item => (
                                                <div
                                                    key={item._id}
                                                    className="search-result-item-sf"
                                                    onClick={() => navigate(`${type === 'opportunities' ? '/opportunities/' : '/' + type + '/'}${item._id}`)}
                                                >
                                                    {item.firstName ? `${item.firstName} ${item.lastName}` : (item.companyName || item.name)}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ))}
                                {Object.values(results).every(arr => arr.length === 0) && (
                                    <div className="no-results-sf">No matches found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="header-right-sf">
                    <button className="icon-btn-sf"><Star size={18} /></button>
                    <button className="icon-btn-sf"><Plus size={18} /></button>
                    <button className="icon-btn-sf"><HelpCircle size={18} /></button>
                    <button className="icon-btn-sf"><Settings size={18} /></button>
                    <div className="divider-sf" />
                    <button className="icon-btn-sf relative">
                        <Bell size={18} />
                        <span className="badge-sf" />
                    </button>
                    <div className="profile-trigger-sf" onClick={() => toggleMenu('profile')}>
                        <img
                            src={`https://ui-avatars.com/api/?name=${getInitials()}&background=0176d3&color=fff`}
                            alt="Profile"
                            className="avatar-sf"
                        />
                        <ChevronDown size={12} />
                        {activeMenu === 'profile' && (
                            <div className="dropdown-menu-sf glass-card">
                                <div className="profile-summary">
                                    <div className="name">{user?.firstName} {user?.lastName}</div>
                                    <div className="email">{user?.email}</div>
                                </div>
                                <div className="divider-h"></div>
                                <div className="dropdown-item-sf" onClick={(e) => { e.stopPropagation(); setActiveMenu(null); navigate('/settings'); }}>
                                    <Settings size={14} /> Settings
                                </div>
                                <div className="dropdown-item-sf logout-item-sf" onClick={handleLogout}>
                                    <LogOut size={14} /> Logout
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Navigation Tabs */}
            <div className="header-nav-row">
                <nav className="nav-tabs-sf">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) => `nav-link-sf ${isActive ? 'active' : ''}`}
                        >
                            <span>{item.name}</span>
                            <ChevronDown size={12} className="nav-chevron-sf" />
                        </NavLink>
                    ))}
                    <div className="nav-link-sf more-tab">
                        <span>More</span>
                        <ChevronDown size={12} className="nav-chevron-sf" />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
