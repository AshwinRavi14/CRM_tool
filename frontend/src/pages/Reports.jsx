import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    FileText,
    Search,
    BarChart,
    PieChart,
    Package,
    Activity,
    Users,
    Plus
} from 'lucide-react';
import CreateReportModal from './CreateReportModal';
import './Reports.css';

const Reports = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <div className="reports-container">
            <div className="reports-header glass-card">
                <div className="header-info">
                    <h2>Reports</h2>
                    <p>Generate and download detailed business summaries.</p>
                </div>
                <div className="header-actions">
                    <div className="reports-search glass">
                        <Search size={18} />
                        <input type="text" placeholder="Search reports..." />
                    </div>
                    <button className="create-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        <span>Create Report</span>
                    </button>
                </div>
            </div>

            <div className="reports-grid">
                <div className="categories-sidebar glass-card">
                    <h3>Categories</h3>
                    <ul className="category-list">
                        <li>
                            <NavLink to="/reports/sales" className={({ isActive }) => isActive ? 'active' : ''}>
                                <BarChart size={18} />
                                <span>Sales Reports</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/reports/marketing" className={({ isActive }) => isActive ? 'active' : ''}>
                                <PieChart size={18} />
                                <span>Marketing</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/reports/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
                                <Package size={18} />
                                <span>Inventory</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/reports/activity" className={({ isActive }) => isActive ? 'active' : ''}>
                                <Activity size={18} />
                                <span>Activity</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/reports/user-performance" className={({ isActive }) => isActive ? 'active' : ''}>
                                <Users size={18} />
                                <span>User Performance</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="reports-content-area">
                    <Outlet context={{ refreshTrigger }} />
                </div>
            </div>

            <CreateReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => setRefreshTrigger(prev => prev + 1)}
            />
        </div>
    );
};

export default Reports;
