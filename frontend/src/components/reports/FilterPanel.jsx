import React from 'react';
import { X } from 'lucide-react';

const FilterPanel = ({
    isOpen,
    onClose,
    filters,
    setFilters,
    onApply,
    availableOwners
}) => {
    const handleChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <aside className={`sf-filter-panel ${isOpen ? 'open' : ''}`} role="complementary" aria-label="Filter panel">
            <div className="filter-panel-header">
                <h2>Filters</h2>
                <button onClick={onClose} aria-label="Close filters">
                    <X size={16} />
                </button>
            </div>

            <div className="filter-panel-content">
                <div className="filter-section">
                    <label>Filter by Owner</label>
                    <select
                        className="sf-filter-select"
                        value={filters.owner}
                        onChange={(e) => handleChange('owner', e.target.value)}
                    >
                        <option value="All">All Users</option>
                        {availableOwners.map(owner => (
                            <option key={owner.id} value={owner.id}>{owner.name}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-section">
                    <label>Priority</label>
                    <select
                        className="sf-filter-select"
                        value={filters.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                    >
                        <option value="All">All Priorities</option>
                        <option value="HIGH">High</option>
                        <option value="NORMAL">Normal</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>

                <div className="filter-section">
                    <label>Activity Type</label>
                    <select
                        className="sf-filter-select"
                        value={filters.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="TASK">Task</option>
                        <option value="EVENT">Event</option>
                    </select>
                </div>

                <div className="filter-section">
                    <label>Date Range</label>
                    <div className="date-inputs">
                        <input
                            type="date"
                            className="sf-filter-input"
                            value={filters.startDate}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                        />
                        <span className="date-sep">to</span>
                        <input
                            type="date"
                            className="sf-filter-input"
                            value={filters.endDate}
                            onChange={(e) => handleChange('endDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="filter-panel-footer">
                <button className="sf-toolbar-btn" onClick={onClose}>Cancel</button>
                <button className="sf-toolbar-btn sf-primary-btn" onClick={onApply}>Apply</button>
            </div>
        </aside>
    );
};

export default FilterPanel;
