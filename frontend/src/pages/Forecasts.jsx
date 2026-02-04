import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, RefreshCw, Settings, User, Lock } from 'lucide-react';
import apiClient from '../services/apiClient';
import './Forecasts.css';

const Forecasts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchForecasts();
    }, []);

    const fetchForecasts = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('opportunities/forecasts');
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error fetching forecasts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-container">Loading Forecasts...</div>;
    if (!data) return <div className="error-container">Failed to load data.</div>;

    const filteredOpportunities = data.opportunities.filter(opp =>
        opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.account?.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="forecasts-container">
            {/* Header */}
            <header className="forecasts-header">
                <div className="header-left">
                    <div className="profile-icon">
                        <User size={24} />
                    </div>
                    <div className="user-info">
                        <h1>Savannah Baker <ChevronDown size={20} /></h1>
                        <span>Forecast: Opportunity Amount</span>
                    </div>
                </div>
                <div className="header-right">
                    <div className="showing-selector">
                        <span className="showing-label">Showing</span>
                        <div className="select-wrapper">
                            <select className="month-select">
                                <option>October FY 2024</option>
                            </select>
                            <ChevronDown size={14} className="select-chevron" />
                        </div>
                        <button className="settings-btn-v2">
                            <Settings size={16} />
                            <ChevronDown size={10} />
                        </button>
                    </div>
                    <div className="last-updated-section">
                        <span>Last updated 10/5/2024 at 10:19 AM</span>
                        <button className="refresh-btn-v2" onClick={fetchForecasts}>
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Blue Banner */}
            <div className="forecast-banner">
                <div className="banner-item main">
                    <span className="label">Month</span>
                    <div className="value">
                        <span className="month-tag">October FY 2024</span>
                        <span className="current-tag">Current</span>
                    </div>
                </div>
                <div className="banner-item">
                    <span className="label">Quota</span>
                    <div className="value">$ {data.quota?.toLocaleString()} USD</div>
                </div>
                <div className="banner-item">
                    <span className="label">Quota</span>
                    <div className="value">$ {data.quota?.toLocaleString()} USD</div>
                </div>
                <div className="banner-item">
                    <span className="label">Commit Forecast</span>
                    <div className="value">$ {data.commit?.toLocaleString()} USD</div>
                </div>
                <div className="banner-item">
                    <span className="label">Best Case Forecast</span>
                    <div className="value">$ {data.bestCase?.toLocaleString()} USD</div>
                </div>
                <div className="banner-item">
                    <span className="label">Open Pipeline</span>
                    <div className="value">$ {data.openPipeline?.toLocaleString()} USD</div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar-sf">
                <span>Showing opportunities for: Savannah Baker • October FY 2024 • All Forecast Categories</span>
            </div>

            {/* Table Container */}
            <div className="forecasts-table-container">
                <table className="sf-table">
                    <thead>
                        <tr>
                            <th className="index-col"></th>
                            <th className="checkbox-col"><input type="checkbox" /></th>
                            <th>Opportunities Name <ChevronDown size={12} /></th>
                            <th>Account Name <ChevronDown size={12} /></th>
                            <th>Amount <ChevronDown size={12} /></th>
                            <th>Manager Jud... <ChevronDown size={12} /></th>
                            <th>Close Date <ChevronDown size={12} /></th>
                            <th>Stage <ChevronDown size={12} /></th>
                            <th>Probability (%) <ChevronDown size={12} /></th>
                            <th>Forecast Cat... <ChevronDown size={12} /></th>
                            <th>Owner Full Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOpportunities.map((opp, index) => (
                            <tr key={opp._id} className={`table-row ${index === 3 ? 'selected' : ''}`}>
                                <td className="index-col">{index + 1}</td>
                                <td className="checkbox-col"><input type="checkbox" /></td>
                                <td>
                                    <a href={`/opportunities/${opp._id}`} className="opp-name">{opp.name}</a>
                                </td>
                                <td>{opp.account?.companyName}</td>
                                <td>$ {opp.amount?.toLocaleString()} USD</td>
                                <td>{index === 3 ? <Lock size={14} /> : ''}</td>
                                <td>{new Date(opp.expectedCloseDate).toLocaleDateString()}</td>
                                <td><span className="status-tag">{opp.stage}</span></td>
                                <td>{opp.probability}%</td>
                                <td>{opp.stage === 'CLOSED_WON' ? 'Closed' : 'Omitted'}</td>
                                <td>{opp.owner?.firstName} {opp.owner?.lastName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Forecasts;
