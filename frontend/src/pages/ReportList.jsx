import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import apiClient from '../services/apiClient';
import {
    FileText,
    Download,
    Calendar,
    BarChart,
    PieChart,
    TrendingUp,
    Activity,
    Users
} from 'lucide-react';

const ReportList = () => {
    const { category } = useParams();
    const { refreshTrigger } = useOutletContext() || {};
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Sales';
    // map 'user-performance' to 'Performance' for matching
    const normalizedCategory = currentCategory === 'User-performance' ? 'Performance' : currentCategory;

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                // Fetch reports filtering by category
                const response = await apiClient.get(`/reports?category=${normalizedCategory}`);

                // Verify the response structure based on the controller
                if (response.data && response.data.reports) {
                    setReports(response.data.reports);
                } else if (response.data && response.data.data && response.data.data.reports) {
                    setReports(response.data.data.reports);
                } else if (Array.isArray(response.data)) {
                    setReports(response.data);
                } else {
                    setReports([]);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
                setReports([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [normalizedCategory, refreshTrigger]);

    const getIcon = (category) => {
        switch (category) {
            case 'Sales': return TrendingUp;
            case 'Marketing': return PieChart;
            case 'Inventory': return FileText;
            case 'Activity': return Activity;
            case 'Performance': return Users;
            default: return FileText;
        }
    };

    return (
        <div className="reports-main glass-card">
            <div className="reports-list-header">
                <h3>{normalizedCategory} Reports</h3>
                <span className="report-count">{reports.length} reports available</span>
            </div>

            <div className="table-responsive">
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th>Report Name</th>
                            <th>Category</th>
                            <th>Frequency</th>
                            <th>Last Run</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="empty-state">Loading reports...</td></tr>
                        ) : reports.length > 0 ? (
                            reports.map(report => {
                                const Icon = getIcon(report.category);
                                return (
                                    <tr key={report._id}>
                                        <td className="report-name-cell">
                                            <div className="report-icon-wrapper">
                                                <Icon size={18} />
                                            </div>
                                            <span>{report.name}</span>
                                        </td>
                                        <td><span className="category-tag glass">{report.category}</span></td>
                                        <td>{report.frequency}</td>
                                        <td>
                                            <div className="time-info">
                                                <Calendar size={14} />
                                                {new Date(report.lastRun).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <button className="download-btn-sm glass">
                                                <Download size={16} />
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    No reports found for this category.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportList;
