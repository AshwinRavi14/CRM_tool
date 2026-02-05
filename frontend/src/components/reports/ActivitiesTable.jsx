import React, { useState, useEffect } from 'react';
import {
    ChevronDown,
    ChevronRight,
    CheckCircle,
    Circle,
    MoreHorizontal,
    Pencil
} from 'lucide-react';

const ActivitiesTable = ({
    data,
    isLoading,
    isEditing,
    onUpdateActivity,
    onBulkAction,
    showRowCounts,
    showDetailRows,
    showSubtotals,
    showGrandTotal,
    sortConfig,
    onSort,
    onRowClick
}) => {
    const [expandedGroups, setExpandedGroups] = useState({});

    // Auto-expand all groups when data loads
    useEffect(() => {
        if (data && data.length > 0) {
            const allExpanded = {};
            data.forEach(group => {
                allExpanded[group.id] = true;
            });
            setExpandedGroups(allExpanded);
        }
    }, [data]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editingSubject, setEditingSubject] = useState(null); // { id, value }
    const [activeColFilter, setActiveColFilter] = useState(null); // field name

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleSelectGroup = (activities, isChecked) => {
        const activityIds = activities.map(a => a.id);
        if (isChecked) {
            setSelectedRows(prev => Array.from(new Set([...prev, ...activityIds])));
        } else {
            setSelectedRows(prev => prev.filter(id => !activityIds.includes(id)));
        }
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            const allIds = data.flatMap(group => group.activities.map(a => a.id));
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };

    if (isLoading) {
        return <div className="report-loading">Loading report data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="report-empty">No activities found for this report.</div>;
    }

    const totalRecords = data.reduce((sum, group) => sum + group.activities.length, 0);
    const isAllSelected = selectedRows.length === totalRecords && totalRecords > 0;

    const renderHeader = (label, field, hasFilter = true) => (
        <th className="sortable-header">
            <div className="header-cell-content">
                <span className="header-label" onClick={() => onSort(field)}>{label}</span>
                <div className="header-actions">
                    {sortConfig?.field === field && (
                        <span className="sort-indicator">{sortConfig.order === 'asc' ? '▴' : '▾'}</span>
                    )}
                    {hasFilter && (
                        <button className="sf-header-filter-btn" onClick={() => setActiveColFilter(activeColFilter === field ? null : field)}>
                            <ChevronDown size={10} />
                        </button>
                    )}
                </div>
            </div>
            {activeColFilter === field && (
                <div className="col-filter-popover fade-in">
                    <input type="text" placeholder={`Filter ${label}...`} autoFocus />
                    <button onClick={() => setActiveColFilter(null)}>Apply</button>
                </div>
            )}
        </th>
    );

    return (
        <div className="report-table-wrapper">
            {selectedRows.length > 0 && (
                <div className="bulk-actions-toolbar fade-in">
                    <span className="selection-count">{selectedRows.length} items selected</span>
                    <div className="bulk-buttons">
                        <button onClick={() => onBulkAction('COMPLETE', selectedRows)}>Mark Complete</button>
                        <button onClick={() => onBulkAction('DELETE', selectedRows)}>Delete</button>
                        <button className="secondary" onClick={() => setSelectedRows([])}>Clear</button>
                    </div>
                </div>
            )}
            <table className="sf-report-table" role="grid">
                <thead>
                    <tr role="row">
                        <th className="checkbox-col">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                        </th>
                        {renderHeader('Assigned', 'owner')}
                        {renderHeader('Subject', 'subject')}
                        {renderHeader('Priority', 'priority')}
                        {renderHeader('Task', 'status', false)}
                        {renderHeader('Company / Account', 'companyAccount')}
                        {renderHeader('Contact', 'contact')}
                        {renderHeader('Lead', 'lead')}
                        {renderHeader('Opportunities', 'opportunity')}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="empty-state-cell">
                                No activities found
                            </td>
                        </tr>
                    ) : (
                        data.map((group) => {
                            const allGroupSelected = group.activities.every(a => selectedRows.includes(a.id));
                            return (
                                <React.Fragment key={group.id}>
                                    {/* Group Header */}
                                    <tr className="group-header-row">
                                        <td className="checkbox-col">
                                            <input
                                                type="checkbox"
                                                checked={allGroupSelected}
                                                onChange={(e) => handleSelectGroup(group.activities, e.target.checked)}
                                            />
                                        </td>
                                        <td className="assigned-col">
                                            <div className="group-assigned-info">
                                                <button className="group-toggle" onClick={() => toggleGroup(group.id)}>
                                                    {expandedGroups[group.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </button>
                                                <span className="group-name sf-link" onClick={() => toggleGroup(group.id)}>
                                                    {group.assigned} {showRowCounts && `(${group.activities.length})`}
                                                </span>
                                            </div>
                                        </td>
                                        <td colSpan="7"></td>
                                    </tr>

                                    {(expandedGroups[group.id] || !group.id) && showDetailRows && group.activities.map((row) => (
                                        <tr key={row.id} className={`detail-row ${selectedRows.includes(row.id) ? 'selected' : ''}`}>
                                            <td className="checkbox-col">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row.id)}
                                                    onChange={() => handleSelectRow(row.id)}
                                                />
                                            </td>
                                            <td className="assigned-col"></td>
                                            <td className="subject-cell">
                                                {isEditing ? (
                                                    editingSubject?.id === row.id ? (
                                                        <div className="inline-edit-group">
                                                            <input
                                                                type="text"
                                                                value={editingSubject.value}
                                                                onChange={(e) => setEditingSubject({ ...editingSubject, value: e.target.value })}
                                                                className="inline-edit-input"
                                                                autoFocus
                                                            />
                                                            <div className="inline-edit-actions">
                                                                <button
                                                                    className="save-btn"
                                                                    onClick={() => {
                                                                        onUpdateActivity(row.id, { subject: editingSubject.value });
                                                                        setEditingSubject(null);
                                                                    }}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    className="cancel-btn"
                                                                    onClick={() => setEditingSubject(null)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="editable-field" onClick={() => setEditingSubject({ id: row.id, value: row.subject })}>
                                                            <span className="sf-link">{row.subject}</span>
                                                            <Pencil size={10} className="edit-reveal" />
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="sf-link" onClick={() => onRowClick && onRowClick(row)}>{row.subject}</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="priority-text">
                                                    {row.priority === 'NORMAL' ? 'Normal' : row.priority}
                                                </span>
                                            </td>
                                            <td className="center-col">
                                                <input
                                                    type="checkbox"
                                                    checked={row.status === 'COMPLETED'}
                                                    onChange={() => onUpdateActivity(row.id, { status: row.status === 'COMPLETED' ? 'OPEN' : 'COMPLETED' })}
                                                    className="sf-row-checkbox"
                                                />
                                            </td>
                                            <td>
                                                <span className={row.companyAccount !== '-' ? 'sf-link' : 'muted-text'}>
                                                    {row.companyAccount}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={row.contact !== '-' ? 'sf-link' : 'muted-text'}>
                                                    {row.contact}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={row.lead !== '-' ? 'sf-link' : 'muted-text'}>
                                                    {row.lead}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={row.opportunity !== '-' ? 'sf-link' : 'muted-text'}>
                                                    {row.opportunity}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Subtotal Row */}
                                    {(expandedGroups[group.id] || !group.id) && showSubtotals && (
                                        <tr className="subtotal-row">
                                            <td className="checkbox-col"></td>
                                            <td className="assigned-col">
                                                <span className="subtotal-label">Subtotal</span>
                                            </td>
                                            <td colSpan="7">
                                                <div className="subtotal-content">
                                                    <span className="subtotal-count">{group.activities.length} records</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>
                {showGrandTotal && totalRecords > 0 && (
                    <tfoot>
                        <tr className="grand-total-row">
                            <td className="checkbox-col"></td>
                            <td className="assigned-col">
                                <span className="grand-total-label">Grand Total</span>
                            </td>
                            <td colSpan="7">
                                <div className="grand-total-content">
                                    <span className="grand-total-count">{totalRecords} records</span>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default ActivitiesTable;
