import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    MoreHorizontal,
    RefreshCw,
    Trophy,
    Activity,
    PhoneCall,
    Users2,
    CheckCircle2,
    Clock,
    User,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mock Data for Visily Layout
    const leadStats = [
        { name: 'New', value: 400, fill: '#0176d3' },
        { name: 'Working', value: 300, fill: '#1589ee' },
        { name: 'Nurturing', value: 200, fill: '#706e6b' },
        { name: 'Qualified', value: 100, fill: '#2e844a' },
    ];

    const opportunityData = [
        { stage: 'Qualifying', amount: 50000 },
        { stage: 'Proposal', amount: 35000 },
        { stage: 'Negotiation', amount: 25000 },
        { stage: 'Closed Won', amount: 15000 },
    ];

    const recentActivity = [
        { id: 1, user: 'Anthony Robinson', action: '2 contacts were created in your org recently', time: '9:00am', date: '3/20/24', type: 'contact' },
        { id: 2, user: 'Brandon Taylor', action: '3 leads you own have updated stages', time: '9:00am', date: '3/20/24', type: 'lead' },
        { id: 3, user: 'Christopher Brown', action: '3 leads you own have updated stages', time: '9:00am', date: '3/20/24', type: 'lead' },
        { id: 4, user: 'William Davis', action: '2 contacts were created in your org recently', time: '9:00am', date: '3/20/24', type: 'contact' },
    ];

    const topLeads = [
        { account: 'BrightShift', name: 'Ashley Lopez', title: 'Sales Assistant' },
        { account: 'Total Telecom', name: 'William Davis', title: 'VP of Technology' },
        { account: 'GearVue', name: 'Elena Jimenez', title: 'UX Designer' },
        { account: 'InfoCube', name: 'Jennifer Martinez', title: 'Sales Director' },
    ];

    const topAccounts = [
        { name: 'Anna Fernandez', title: 'Senior Account Manager', role: 'Decision Maker' },
        { name: 'Ashley Scott', title: 'Chief Financial Officer', role: 'Decision Maker' },
        { name: 'Rachel Miller', title: 'Marketing Director', role: 'Decision Maker' },
    ];

    return (
        <div className="dashboard-container fade-in">
            {/* Top Toolbar */}
            <div className="dashboard-toolbar">
                <div className="toolbar-left">
                    <h1 className="page-title">Home</h1>
                    <div className="toolbar-nav">
                        <span>Dashboards</span>
                    </div>
                </div>
                <div className="toolbar-right">
                    <button className="icon-btn-salesforce"><Plus size={16} /></button>
                    <button className="icon-btn-salesforce"><RefreshCw size={16} /></button>
                </div>
            </div>

            <div className="dashboard-grid-layout">
                {/* Column 1: Recent Activity */}
                <div className="dashboard-col">
                    <div className="widget glass-card">
                        <div className="widget-header">
                            <h3>Recent Activity</h3>
                            <MoreHorizontal size={16} className="text-muted" />
                        </div>
                        <div className="activity-list">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className={`activity-icon ${activity.type}`}>
                                        {activity.type === 'contact' ? <User size={14} /> : <CheckCircle2 size={14} />}
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-user">{activity.user}</div>
                                        <p className="activity-text">{activity.action}</p>
                                        <div className="activity-meta">
                                            {activity.time} | {activity.date}
                                        </div>
                                    </div>
                                    <ArrowUpRight size={14} className="activity-arrow" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: Leads */}
                <div className="dashboard-col">
                    <div className="widget glass-card">
                        <div className="widget-header">
                            <h3>Leads</h3>
                            <MoreHorizontal size={16} className="text-muted" />
                        </div>
                        <div className="donut-container">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={leadStats}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {leadStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="donut-legend">
                                {leadStats.map((stat) => (
                                    <div key={stat.name} className="legend-item">
                                        <span className="dot" style={{ backgroundColor: stat.fill }}></span>
                                        <span className="label text-muted">{stat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="view-all-link">View All</div>
                    </div>

                    <div className="widget glass-card mt-md">
                        <div className="widget-header">
                            <h3>Leads Summary</h3>
                            <MoreHorizontal size={16} className="text-muted" />
                        </div>
                        <div className="mini-table-container">
                            <table className="mini-table">
                                <thead>
                                    <tr>
                                        <th>Account</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topLeads.map((lead, i) => (
                                        <tr key={i}>
                                            <td className="text-muted">{lead.account}</td>
                                            <td className="text-primary-link">{lead.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Column 3: Accounts & Opportunities */}
                <div className="dashboard-col">
                    <div className="widget glass-card">
                        <div className="widget-header">
                            <h3>Accounts</h3>
                            <MoreHorizontal size={16} className="text-muted" />
                        </div>
                        <div className="account-list-mini">
                            {topAccounts.map((acc, i) => (
                                <div key={i} className="mini-acc-item">
                                    <div className="mini-acc-avatar">
                                        <User size={16} color="white" />
                                    </div>
                                    <div className="mini-acc-info">
                                        <div className="acc-name">{acc.name}</div>
                                        <div className="acc-sub text-muted">{acc.title}</div>
                                        <div className="acc-sub text-muted">{acc.role}</div>
                                    </div>
                                    <ChevronRight size={14} className="text-muted" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="widget glass-card mt-md">
                        <div className="widget-header">
                            <h3>Opportunities</h3>
                            <MoreHorizontal size={16} className="text-muted" />
                        </div>
                        <div className="bar-chart-container">
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={opportunityData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="stage" hide />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="amount" fill="#fe9339" radius={[0, 4, 4, 0]}>
                                        {opportunityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.2} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="stages-labels">
                                {opportunityData.map(d => (
                                    <div key={d.stage} className="stage-row">
                                        <span className="stage-name text-muted">{d.stage}</span>
                                        <span className="stage-val">${d.amount / 1000}k</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="view-all-link">View All</div>
                    </div>
                </div>
            </div>

            {/* To-Do List bar at bottom like Salesforce */}
            <div className="dashboard-footer-bar">
                <CheckCircle2 size={14} />
                <span>To-Do List</span>
            </div>
        </div>
    );
};

export default Dashboard;
