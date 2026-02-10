import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import {
    Activity, Download, RefreshCw, Filter,
    Calendar, User, CheckCircle2, Clock, Mail, Phone
} from 'lucide-react';
import apiClient from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import './SalesRepActivity.css';

const SalesRepActivity = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        activityTrend: [],
        repPerformance: [],
        topPerformers: []
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/reports/sales-rep-activity');
            setData(res.data.data || res.data);
        } catch (err) {
            showToast('Failed to load activity report', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

    return (
        <div className="rep-activity-container fade-in">
            <div className="rep-header glass-card">
                <div className="header-left">
                    <div className="report-icon-rep"><Activity size={24} color="white" /></div>
                    <div>
                        <h1>Customer Rep Activity</h1>
                        <p>Analyze sales representative interactions and productivity</p>
                    </div>
                </div>
                <div className="header-right">
                    <button className="btn-secondary glass" onClick={fetchData}><RefreshCw size={16} /> Refresh</button>
                    <button className="btn-primary-salesforce"><Download size={16} /> Export CSV</button>
                </div>
            </div>

            <div className="activity-grid">
                <div className="chart-card glass-card span-2">
                    <div className="chart-header">
                        <h3>Interaction Trend (All Reps)</h3>
                        <div className="header-actions">
                            <span className="pill glass">Last 30 Days</span>
                        </div>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.activityTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Calls" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Emails" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Meetings" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass-card">
                    <div className="chart-header">
                        <h3>Productivity by Rep</h3>
                        <Filter size={16} className="text-muted" />
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data.repPerformance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.4)" fontSize={12} width={100} />
                                <Tooltip />
                                <Bar dataKey="activities" fill="#b199ff" radius={[0, 4, 4, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="top-performers glass-card">
                    <div className="chart-header">
                        <h3>Top Performers</h3>
                        <CheckCircle2 size={16} className="text-muted" />
                    </div>
                    <div className="performers-list">
                        {data.topPerformers.map((rep, idx) => (
                            <div key={idx} className="performer-item glass">
                                <div className="rep-avatar">{rep.name[0]}</div>
                                <div className="rep-info">
                                    <span className="rep-name">{rep.name}</span>
                                    <span className="rep-title">Sales Representative</span>
                                </div>
                                <div className="rep-stats">
                                    <span className="stat-num">{rep.count}</span>
                                    <span className="stat-label">Tasks</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesRepActivity;
