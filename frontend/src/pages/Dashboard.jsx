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
import apiClient from '../services/apiClient';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        new: 0,
        working: 0,
        nurturing: 0,
        qualified: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                // 1. Fetch leads (filters will be applied by backend based on role)
                const res = await apiClient.get('/leads');
                const leadData = Array.isArray(res.data) ? res.data : (res.data.leads || []);
                setLeads(leadData.slice(0, 5)); // Get top 5 recent leads

                // Calculate stats for donut chart
                const counts = {
                    new: leadData.filter(l => l.status === 'NEW').length,
                    working: leadData.filter(l => l.status === 'WORKING').length,
                    nurturing: leadData.filter(l => l.status === 'NURTURING').length,
                    qualified: leadData.filter(l => l.status === 'QUALIFIED').length
                };
                setStats(counts);

                // 2. Fetch upcoming activities/tasks for current user
                const actRes = await apiClient.get('/activities/my');
                const activityData = Array.isArray(actRes.data) ? actRes.data : (actRes.data.activities || []);
                setTasks(activityData.slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Data for the Donut Chart (Personal Pipeline)
    const leadStats = [
        { name: 'New', value: stats.new || 1, fill: '#0176d3' },
        { name: 'Working', value: stats.working || 0, fill: '#1589ee' },
        { name: 'Nurturing', value: stats.nurturing || 0, fill: '#706e6b' },
        { name: 'Qualified', value: stats.qualified || 0, fill: '#2e844a' },
    ];

    const opportunityData = [
        { stage: 'Qualifying', amount: 50000 },
        { stage: 'Proposal', amount: 35000 },
        { stage: 'Negotiation', amount: 25000 },
        { stage: 'Closed Won', amount: 15000 },
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
                            {isLoading ? (
                                <div className="text-center p-md">Loading activities...</div>
                            ) : tasks.length === 0 ? (
                                <div className="text-center p-md text-muted">No recent activities</div>
                            ) : tasks.map((activity) => (
                                <div key={activity._id} className="activity-item">
                                    <div className={`activity-icon ${activity.type?.toLowerCase()}`}>
                                        {activity.type === 'CALL' ? <PhoneCall size={14} /> :
                                            activity.type === 'EMAIL' ? <Mail size={14} /> :
                                                <CheckCircle2 size={14} />}
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-user">{activity.subject}</div>
                                        <p className="activity-text">{activity.description || 'No description'}</p>
                                        <div className="activity-meta">
                                            {new Date(activity.createdAt).toLocaleDateString()}
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
                                        <th>Source</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="2" className="text-center">Loading...</td></tr>
                                    ) : leads.length === 0 ? (
                                        <tr><td colSpan="2" className="text-center">No leads found</td></tr>
                                    ) : leads.map((lead, i) => (
                                        <tr key={lead._id}>
                                            <td className="text-muted">
                                                <span className={`source-tag ${lead.source?.toLowerCase()}`}>
                                                    {lead.source || 'WEB'}
                                                </span>
                                            </td>
                                            <td className="text-primary-link" onClick={() => navigate('/leads')}>
                                                {lead.firstName} {lead.lastName}
                                            </td>
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
