import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    BarChart3,
    PieChart,
    Users,
    UserSquare2,
    Building2,
    Briefcase,
    FolderKanban,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const { success } = useToast();
    const navItems = [
        { name: 'Home', icon: <Home size={20} />, path: '/' },
        { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
        { name: 'Analytics', icon: <PieChart size={20} />, path: '/analytics' },
        { type: 'divider', label: 'Sales Team' },
        { name: 'Leads', icon: <Users size={20} />, path: '/leads' },
        { name: 'Contacts', icon: <UserSquare2 size={20} />, path: '/contacts' },
        { name: 'Accounts', icon: <Building2 size={20} />, path: '/accounts' },
        { name: 'Deals', icon: <Briefcase size={20} />, path: '/opportunities' },
        { name: 'Projects', icon: <FolderKanban size={20} />, path: '/projects' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
            <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon">W</div>
                        <span className="logo-text">Wersel CRM</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item, index) => (
                        item.type === 'divider' ? (
                            <div key={index} className="nav-divider">
                                <span>{item.label}</span>
                            </div>
                        ) : (
                            <NavLink
                                key={index}
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <span className="icon">{item.icon}</span>
                                <span className="label">{item.name}</span>
                                <ChevronRight size={14} className="chevron" />
                            </NavLink>
                        )
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => {
                        logout();
                        success('Signed out successfully');
                    }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
