import React from 'react';
import {
    FileText,
    Pencil,
    Search,
    BarChart2,
    Filter,
    RefreshCcw,
    ChevronDown,
    Settings
} from 'lucide-react';

const ReportHeader = ({
    title,
    subtitle,
    totalRecords,
    isEditing,
    setIsEditing,
    showChart,
    setShowChart,
    showFilterPanel,
    setShowFilterPanel,
    onRefresh
}) => {
    return (
        <div className="report-header-sf">
            {/* Breadcrumb */}
            <div className="report-breadcrumb">
                Reports : Tasks and Events &gt; <span className="breadcrumb-current">Activities by Salesperson</span>
            </div>

            {/* Main Header Row */}
            <div className="report-main-row">
                <div className="header-left">
                    <div className="report-icon-box">
                        <FileText size={20} color="#22C55E" />
                    </div>
                    <div className="title-group">
                        <div className="report-subtitle">Report: Tasks and Events</div>
                        <h1>Activities by Salesperson</h1>
                    </div>
                </div>

                <div className="header-right" role="toolbar" aria-label="Report actions">
                    <div className="action-group">
                        {/* Enable Field Editing Toggle */}
                        <button
                            className={`sf-toolbar-btn sf-outline-btn ${isEditing ? 'active' : ''}`}
                            onClick={() => setIsEditing(!isEditing)}
                            title="Enable Field Editing"
                        >
                            <Pencil size={14} />
                            <span>Enable Field Editing</span>
                        </button>

                        <button className="sf-toolbar-btn sf-icon-btn" title="Search">
                            <Search size={14} />
                        </button>

                        <button
                            className={`sf-toolbar-btn sf-icon-btn ${showChart ? 'active' : ''}`}
                            onClick={() => setShowChart(!showChart)}
                            title="Add Chart"
                        >
                            <BarChart2 size={14} />
                        </button>

                        <button
                            className={`sf-toolbar-btn sf-icon-btn ${showFilterPanel ? 'active' : ''}`}
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            title="Filter"
                        >
                            <Filter size={14} />
                        </button>

                        <button
                            className="sf-toolbar-btn sf-icon-btn"
                            onClick={onRefresh}
                            title="Refresh"
                        >
                            <RefreshCcw size={14} />
                        </button>

                        <div className="sf-split-btn-group">
                            <button className="sf-toolbar-btn sf-edit-btn">Edit</button>
                            <button className="sf-toolbar-btn icon-only sf-edit-dropdown">
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportHeader;
