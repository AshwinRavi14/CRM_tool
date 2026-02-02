import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Download, Calendar, Filter, ChevronDown } from 'lucide-react';
import './Analytics.css';

const Analytics = () => {
    const revenueData = [
        { month: 'Jan', revenue: 45000, target: 40000 },
        { month: 'Feb', revenue: 52000, target: 42000 },
        { month: 'Mar', revenue: 48000, target: 44000 },
        { month: 'Apr', revenue: 61000, target: 46000 },
        { month: 'May', revenue: 55000, target: 48000 },
        { month: 'Jun', revenue: 67000, target: 50000 },
    ];

    const sourceData = [
        { name: 'LinkedIn', value: 40, fill: '#0ea5e9' },
        { name: 'Website', value: 30, fill: '#38bdf8' },
        { name: 'Referral', value: 20, fill: '#818cf8' },
        { name: 'Other', value: 10, fill: '#c084fc' },
    ];

    const performanceData = [
        { name: 'Team A', won: 12, lost: 4 },
        { name: 'Team B', won: 15, lost: 6 },
        { name: 'Team C', won: 8, lost: 2 },
        { name: 'Team D', won: 20, lost: 5 },
    ];

    return (
        <div className="analytics-container">
            <div className="analytics-toolbar glass-card">
                <div className="toolbar-left">
                    <h2>Sales Analytics</h2>
                    <div className="date-picker glass">
                        <Calendar size={16} />
                        <span>Last 6 Months</span>
                        <ChevronDown size={14} />
                    </div>
                </div>
                <div className="toolbar-right">
                    <button className="icon-btn-rect glass"><Filter size={18} /></button>
                    <button className="export-btn glass">
                        <Download size={18} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="chart-card glass-card span-2">
                    <h3>Revenue Performance vs Target</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass-card">
                    <h3>Lead Sources</h3>
                    <div className="chart-wrapper flex-center">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass-card span-2">
                    <h3>Team Win/Loss Ratio</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Bar dataKey="won" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                <Bar dataKey="lost" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="metrics-summary glass-card">
                    <h3>Campaign Effectiveness</h3>
                    <div className="summary-list">
                        <div className="summary-item">
                            <span>Email Blast A</span>
                            <span className="summary-value positive">24.5% Conv.</span>
                        </div>
                        <div className="summary-item">
                            <span>LinkedIn Ads Jul</span>
                            <span className="summary-value positive">18.2% Conv.</span>
                        </div>
                        <div className="summary-item">
                            <span>Webinar Leads</span>
                            <span className="summary-value">12.1% Conv.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
