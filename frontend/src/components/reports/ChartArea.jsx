import React, { useEffect, useState } from 'react';
import { X, BarChart2 } from 'lucide-react';

const ChartArea = ({ data, onClose }) => {
    // Simple bar chart using CSS
    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="report-chart-container">
            <div className="chart-header">
                <div className="chart-title">
                    <BarChart2 size={16} />
                    <h3>Activities by Salesperson</h3>
                </div>
                <button className="chart-close" onClick={onClose} aria-label="Close chart">
                    <X size={16} />
                </button>
            </div>

            <div className="chart-body">
                <div className="bars-container">
                    {data.map((item, index) => (
                        <div key={index} className="chart-bar-group">
                            <div className="bar-label">{item.count}</div>
                            <div
                                className="bar-fill"
                                style={{
                                    height: `${(item.count / maxCount) * 100}px`,
                                    backgroundColor: `hsl(${210 + (index * 20)}, 70%, 50%)`
                                }}
                                title={`${item.name}: ${item.count} records`}
                            ></div>
                            <div className="bar-name">{item.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChartArea;
