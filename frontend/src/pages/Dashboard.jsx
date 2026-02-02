import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    MoreHorizontal,
    RefreshCw,
    Trophy,
    Activity,
    PhoneCall,
    Users2
} from 'lucide-react';
import {
    Funnel,
    FunnelChart,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const kpiData = [
        { title: 'My Open Deals', value: '272', icon: <Trophy size={20} color="#38bdf8" />, change: '+5% vs last month' },
        { title: 'My Untouched Deals', value: '304', icon: <Activity size={20} color="#818cf8" />, change: '-2% vs last month' },
        { title: 'My Calls Today', value: '0', icon: <PhoneCall size={20} color="#10b981" />, change: '0% vs yesterday' },
        { title: 'My Leads', value: '120', icon: <Users2 size={20} color="#f59e0b" />, change: '+12% vs last month' },
    ];

    const pipelineData = [
        { value: 111, name: 'Qualification', fill: '#0ea5e9' },
        { value: 90, name: 'Needs Analysis', fill: '#38bdf8' },
        { value: 75, name: 'Value Proposition', fill: '#818cf8' },
        { value: 60, name: 'Proposal', fill: '#c084fc' },
        { value: 45, name: 'Negotiation', fill: '#f472b6' },
        { value: 30, name: 'Commitment', fill: '#fb7185' },
        { value: 15, name: 'Won', fill: '#10b981' },
    ];

    const tasks = [
        { id: 1, subject: 'Send follow-up materials highlighting AI use cases', dueDate: 'Nov 23, 2025', status: 'Not Started', priority: 'Highest' },
        { id: 2, subject: 'Refer CRM Videos to Sales Team', dueDate: 'Nov 14, 2024', status: 'In Progress', priority: 'Normal' },
        { id: 3, subject: 'Get Approval from Manager for Discount', dueDate: 'Nov 13, 2024', status: 'In Progress', priority: 'Normal' },
        { id: 4, subject: 'Finalize Proposal for Quantum AI Project', dueDate: 'Dec 01, 2025', status: 'Pending', priority: 'High' },
    ];


    return (
        <div className="dashboard-container">
            <div className="welcome-section glass-card">
                <div className="welcome-info">
                    <div className="welcome-avatar">
                        <img src="https://ui-avatars.com/api/?name=Cleona+Davis&background=38bdf8&color=fff" alt="User" />
                    </div>
                    <div className="welcome-text">
                        <h2>Welcome Cleona Davis <span className="wave-emoji">👋</span></h2>
                        <p>Here's what's happening with your sales pipeline today.</p>
                    </div>
                </div>
                <div className="welcome-actions">
                    <button className="icon-btn-rounded pulse">
                        <RefreshCw size={18} />
                    </button>
                    <div className="view-picker glass">
                        <span>Cleona Davis's Home</span>
                    </div>
                </div>
            </div>

            <div className="kpi-grid">
                {kpiData.map((kpi, index) => (
                    <div key={index} className="kpi-card glass-card">
                        <div className="kpi-header">
                            <span className="kpi-title">{kpi.title}</span>
                            <div className="kpi-icon-wrapper glass">
                                {kpi.icon}
                            </div>
                        </div>
                        <div className="kpi-body">
                            <span className="kpi-value">{kpi.value}</span>
                            <span className={`kpi-change ${kpi.change.includes('+') ? 'positive' : 'neutral'}`}>
                                {kpi.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="tasks-section glass-card">
                    <div className="section-header">
                        <h3>My Open Tasks</h3>
                        <button className="text-btn">View All</button>
                    </div>
                    <div className="table-responsive">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task.id}>
                                        <td className="subject-cell">{task.subject}</td>
                                        <td>{task.dueDate}</td>
                                        <td>
                                            <span className={`status-badge ${task.status.replace(' ', '-').toLowerCase()}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pipeline-section glass-card">
                    <div className="section-header">
                        <h3>My Pipeline Deals By Stage</h3>
                        <button className="icon-btn-rounded">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <FunnelChart>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Funnel
                                    data={pipelineData}
                                    dataKey="value"
                                >
                                    <LabelList position="right" fill="#94a3b8" stroke="none" dataKey="name" />
                                    {pipelineData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                                    ))}
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
