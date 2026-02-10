import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Shield, Settings, Database,
    FileText, Activity, Layers, BarChart3,
    ChevronRight, ArrowUpRight
} from 'lucide-react';
import './ManagementHub.css';

const ManagementHub = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: 'User & Security',
            icon: Shield,
            color: '#3b82f6',
            items: [
                { name: 'User Management', desc: 'Manage users, roles and permissions', path: '/dashboard/users', icon: Users },
                { name: 'Security Settings', desc: 'Configure auth policies and API keys', path: '/dashboard/settings', icon: Settings }
            ]
        },
        {
            title: 'Data Management',
            icon: Database,
            color: '#10b981',
            items: [
                { name: 'Import/Export', desc: 'Bulk data tools for leads and accounts', path: '/dashboard/leads', icon: Layers },
                { name: 'Audit Logs', desc: 'Track all record changes and activities', path: '/dashboard/tasks', icon: Activity }
            ]
        },
        {
            title: 'Sales Operations',
            icon: BarChart3,
            color: '#f59e0b',
            items: [
                { name: 'Quote Templates', desc: 'Manage standard pricing and items', path: '/dashboard/quotes', icon: FileText },
                { name: 'Forecast Models', desc: 'Configure sales pipelines and targets', path: '/dashboard/forecasts', icon: BarChart3 }
            ]
        }
    ];

    return (
        <div className="mgmt-hub-container">
            <div className="mgmt-header glass-card">
                <div className="header-info">
                    <h1>Management Hub</h1>
                    <p>Central administration for CRM operations and security</p>
                </div>
            </div>

            <div className="mgmt-grid">
                {sections.map((section, idx) => (
                    <div key={idx} className="mgmt-section">
                        <div className="section-header">
                            <div className="sec-icon" style={{ background: section.color }}>
                                <section.icon size={20} color="white" />
                            </div>
                            <h3>{section.title}</h3>
                        </div>
                        <div className="items-grid">
                            {section.items.map((item, iidx) => (
                                <div key={iidx} className="mgmt-card glass-card" onClick={() => navigate(item.path)}>
                                    <div className="card-icon" style={{ color: section.color }}>
                                        <item.icon size={24} />
                                    </div>
                                    <div className="card-content">
                                        <h4>{item.name}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                    <ArrowUpRight size={16} className="arrow-hint" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mgmt-footer glass-card">
                <div className="footer-status">
                    <span className="status-dot"></span>
                    <p>System Status: <strong>All Services Operational</strong></p>
                </div>
                <div className="footer-links">
                    <span>API Docs</span>
                    <span>Support</span>
                    <span>System Logs</span>
                </div>
            </div>
        </div>
    );
};

export default ManagementHub;
