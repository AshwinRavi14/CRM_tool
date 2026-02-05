import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import ReportHeader from '../components/reports/ReportHeader';
import ActivitiesTable from '../components/reports/ActivitiesTable';
import FilterPanel from '../components/reports/FilterPanel';
import ChartArea from '../components/reports/ChartArea';
import ChartModal from '../components/reports/ChartModal';
import ActivityDrawer from '../components/reports/ActivityDrawer';
import { List } from 'lucide-react';
import './ActivitiesReport.css';

const ActivitiesReport = () => {
    const { toast } = useToast();

    // Data State
    const [reportData, setReportData] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // UI State
    const [isEditing, setIsEditing] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    // Grid State
    const [sortConfig, setSortConfig] = useState({ field: 'createdAt', order: 'desc' });

    // Chart & Drawer State
    const [showChartModal, setShowChartModal] = useState(false);
    const [chartConfig, setChartConfig] = useState({ type: 'vertical-bar', palette: 'salesforce' });
    const [activeDrawerActivity, setActiveDrawerActivity] = useState(null);

    // Toggles State
    const [showRowCounts, setShowRowCounts] = useState(true);
    const [showDetailRows, setShowDetailRows] = useState(true);
    const [showSubtotals, setShowSubtotals] = useState(true);
    const [showGrandTotal, setShowGrandTotal] = useState(true);

    // Filter State
    const [filters, setFilters] = useState({
        owner: 'All',
        priority: 'All',
        type: 'All',
        status: 'All',
        startDate: '',
        endDate: ''
    });

    const fetchReportData = useCallback(async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.owner !== 'All') queryParams.append('owner', filters.owner);
            if (filters.priority !== 'All') queryParams.append('priority', filters.priority);
            if (filters.type !== 'All') queryParams.append('type', filters.type);
            if (filters.status !== 'All') queryParams.append('status', filters.status);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            queryParams.append('sortField', sortConfig.field);
            queryParams.append('sortOrder', sortConfig.order);

            const [reportRes, summaryRes] = await Promise.all([
                apiClient.get(`/reports/activity/salesperson?${queryParams.toString()}`),
                apiClient.get('/reports/activity/summary')
            ]);

            setReportData(reportRes.data.reportData);
            setTotalRecords(reportRes.data.totalRecords);
            setSummaryData(summaryRes.data.summary);
        } catch (error) {
            console.error('Failed to load report data:', error);
            toast.error('Failed to load report data');
        } finally {
            setIsLoading(false);
        }
    }, [filters, sortConfig, toast]);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    const handleUpdateActivity = async (id, updates) => {
        try {
            await apiClient.patch(`/activities/${id}`, updates);
            toast.success('Activity updated');
            // Refresh local data optimistically or just re-fetch
            fetchReportData();
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Failed to update activity');
        }
    };

    const handleSort = (field) => {
        setSortConfig(prev => ({
            field,
            order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const handleBulkAction = async (action, ids) => {
        if (action === 'DELETE' && !window.confirm(`Are you sure you want to delete ${ids.length} items?`)) {
            return;
        }

        try {
            if (action === 'COMPLETE') {
                await Promise.all(ids.map(id => apiClient.patch(`/activities/${id}`, { status: 'COMPLETED' })));
            } else if (action === 'DELETE') {
                await Promise.all(ids.map(id => apiClient.delete(`/activities/${id}`)));
            }
            toast.success(`Bulk action ${action} successful`);
            fetchReportData();
        } catch (error) {
            console.error('Bulk action failed:', error);
            toast.error('Bulk action failed');
        }
    };

    const handleChartApply = (config) => {
        setChartConfig(config);
        setShowChart(true);
    };

    const handleRowClick = (activity) => {
        setActiveDrawerActivity(activity);
    };

    const renderToggle = (value, setter) => (
        <button
            className={`toggle-switch ${value ? 'on' : ''}`}
            onClick={() => setter(!value)}
        >
            <div className="switch-handle" />
        </button>
    );

    // Extract available owners for filter dropdown
    const availableOwners = summaryData.map(s => ({
        id: s.id || s.name, // backend summary might need id
        name: s.name
    }));

    return (
        <div className="activities-report-page fade-in" role="main" aria-label="Activities by Salesperson Report">
            <ReportHeader
                title="Activities by Salesperson"
                subtitle="Report: Tasks and Events"
                totalRecords={totalRecords}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                showChart={showChart}
                setShowChart={() => setShowChartModal(true)}
                showFilterPanel={showFilterPanel}
                setShowFilterPanel={setShowFilterPanel}
                onRefresh={fetchReportData}
            />

            {/* Summary Section */}
            <div className="report-summary-section">
                <div className="summary-block">
                    <span className="summary-label">Total Records</span>
                    <span className="summary-value" style={{ fontSize: '24px', fontWeight: '400' }}>{totalRecords}</span>
                </div>
            </div>

            {/* Backdrop for Panels */}
            {(showFilterPanel || !!activeDrawerActivity) && (
                <div
                    className="report-backdrop fade-in"
                    onClick={() => {
                        setShowFilterPanel(false);
                        setActiveDrawerActivity(null);
                    }}
                />
            )}

            {showChart && summaryData.length > 0 && (
                <ChartArea
                    data={summaryData}
                    onClose={() => setShowChart(false)}
                />
            )}

            <div className="report-content-area">
                <ActivitiesTable
                    data={reportData}
                    isLoading={isLoading}
                    isEditing={isEditing}
                    onUpdateActivity={handleUpdateActivity}
                    onBulkAction={handleBulkAction}
                    onRowClick={handleRowClick}
                    showRowCounts={showRowCounts}
                    showDetailRows={showDetailRows}
                    showSubtotals={showSubtotals}
                    showGrandTotal={showGrandTotal}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                />
            </div>

            {/* Footer Control Bar */}
            <div className="report-footer-controls">
                <div className="control-item">
                    <span className="control-label">Row Counts</span>
                    {renderToggle(showRowCounts, setShowRowCounts)}
                </div>
                <div className="control-item">
                    <span className="control-label">Detail Rows</span>
                    {renderToggle(showDetailRows, setShowDetailRows)}
                </div>
                <div className="control-item">
                    <span className="control-label">Subtotals</span>
                    {renderToggle(showSubtotals, setShowSubtotals)}
                </div>
                <div className="control-item">
                    <span className="control-label">Grand Total</span>
                    {renderToggle(showGrandTotal, setShowGrandTotal)}
                </div>
            </div>

            {/* To Do List Tab */}
            <div className="todo-list-tab">
                <List size={14} />
                <span>To Do List</span>
            </div>

            <FilterPanel
                isOpen={showFilterPanel}
                onClose={() => setShowFilterPanel(false)}
                filters={filters}
                setFilters={setFilters}
                onApply={() => {
                    setShowFilterPanel(false);
                    fetchReportData();
                }}
                availableOwners={availableOwners}
            />

            <ChartModal
                isOpen={showChartModal}
                onClose={() => setShowChartModal(false)}
                onApply={handleChartApply}
                currentConfig={chartConfig}
            />

            <ActivityDrawer
                isOpen={!!activeDrawerActivity}
                activity={activeDrawerActivity}
                onClose={() => setActiveDrawerActivity(null)}
                onUpdate={handleUpdateActivity}
            />
        </div>
    );
};

export default ActivitiesReport;
