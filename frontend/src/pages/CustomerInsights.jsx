import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    Filter, Download, RefreshCw, TrendingUp, Users,
    Target, Building2, MoreHorizontal, Calendar
} from 'lucide-react';
import apiClient from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import './CustomerInsights.css';

const COLORS = ['#0176d3', '#b199ff', '#2e844a', '#f39223', '#ef4444', '#06b6d4'];

const CustomerInsights = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        sources: [],
        status: [],
        growth: [],
        industry: []
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/reports/customer-insights');
            setData(res.data.data || res.data);
        } catch (err) {
            showToast('Failed to load insights', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

    return (
        <div className="insights-container fade-in">
            <div className="insights-header glass-card">
                <div className="header-left">
                    <div className="report-icon"><TrendingUp size={24} color="white" /></div>
                    <div>
                        <h1>Customer Insights</h1>
                        <p>Detailed analysis of lead acquisition and customer distribution</p>
                    </div>
                </div>
                <div className="header-right">
                    <button className="btn-secondary glass" onClick={fetchData}><RefreshCw size={16} /> Refresh</button>
                    <button className="btn-primary-salesforce"><Download size={16} /> Export PDF</button>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card glass-card">
                    <Users className="stat-icon" color="#0176d3" />
                    <div>
                        <span className="label">Total Leads</span>
                        <span className="value">1,284</span>
                        <span className="trend pos">+12% vs last month</span>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <Target className="stat-icon" color="#2e844a" />
                    <div>
                        <span className="label">Conversion Rate</span>
                        <span className="value">24.5%</span>
                        <span className="trend pos">+3.2% vs last month</span>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <Building2 className="stat-icon" color="#b199ff" />
                    <div>
                        <span className="label">Active Accounts</span>
                        <span className="value">428</span>
                        <span className="trend neg">-2% vs last month</span>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card glass-card">
                    <div className="chart-header">
                        <h3>Leads by Source</h3>
                        <Filter size={16} className="text-muted" />
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.sources}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.sources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass-card">
                    <div className="chart-header">
                        <h3>Lead Growth Over Time</h3>
                        <Calendar size={16} className="text-muted" />
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data.growth}>
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0176d3" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0176d3" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#0176d3" fillOpacity={1} fill="url(#colorGrowth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass-card span-2">
                    <div className="chart-header">
                        <h3>Lead Status Distribution</h3>
                        <MoreHorizontal size={16} className="text-muted" />
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data.status} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.4)" fontSize={12} width={100} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#0176d3" radius={[0, 4, 4, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInsights;
