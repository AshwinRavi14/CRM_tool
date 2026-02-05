import React, { useState } from 'react';
import { X, BarChart2, BarChart3, PieChart, TrendingUp } from 'lucide-react';

const ChartModal = ({ isOpen, onClose, onApply, currentConfig }) => {
    const [selectedType, setSelectedType] = useState(currentConfig?.type || 'vertical-bar');
    const [selectedPalette, setSelectedPalette] = useState(currentConfig?.palette || 'salesforce');

    const chartTypes = [
        { id: 'vertical-bar', name: 'Vertical Bar', icon: BarChart2, description: 'Compare values across categories' },
        { id: 'horizontal-bar', name: 'Horizontal Bar', icon: BarChart3, description: 'Compare values with long labels' },
        { id: 'donut', name: 'Donut', icon: PieChart, description: 'Show proportions of a whole' },
        { id: 'line', name: 'Line', icon: TrendingUp, description: 'Show trends over time' }
    ];

    const palettes = [
        { id: 'salesforce', name: 'Salesforce', colors: ['#1589EE', '#4BC076', '#FFB75D', '#E287B2', '#9D5CFF'] },
        { id: 'ocean', name: 'Ocean', colors: ['#0070D2', '#00A1E0', '#16325C', '#54698D', '#8199AF'] },
        { id: 'sunset', name: 'Sunset', colors: ['#FF6B6B', '#FFA500', '#FFD700', '#FF69B4', '#FF1493'] },
        { id: 'forest', name: 'Forest', colors: ['#2E7D32', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9'] }
    ];

    const handleApply = () => {
        onApply({ type: selectedType, palette: selectedPalette });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Chart</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Chart Type Selection */}
                    <section className="modal-section">
                        <h3>Chart Type</h3>
                        <div className="chart-type-grid">
                            {chartTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <div
                                        key={type.id}
                                        className={`chart-type-card ${selectedType === type.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedType(type.id)}
                                    >
                                        <Icon size={32} />
                                        <h4>{type.name}</h4>
                                        <p>{type.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Color Palette Selection */}
                    <section className="modal-section">
                        <h3>Color Palette</h3>
                        <div className="palette-grid">
                            {palettes.map((palette) => (
                                <div
                                    key={palette.id}
                                    className={`palette-card ${selectedPalette === palette.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedPalette(palette.id)}
                                >
                                    <div className="palette-name">{palette.name}</div>
                                    <div className="palette-colors">
                                        {palette.colors.map((color, idx) => (
                                            <div
                                                key={idx}
                                                className="color-swatch"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Preview Area */}
                    <section className="modal-section">
                        <h3>Preview</h3>
                        <div className="chart-preview">
                            <div className="preview-placeholder">
                                {chartTypes.find(t => t.id === selectedType)?.icon &&
                                    React.createElement(chartTypes.find(t => t.id === selectedType).icon, { size: 48, strokeWidth: 1 })
                                }
                                <p>Chart preview with {selectedType} using {selectedPalette} palette</p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="modal-footer">
                    <button className="sf-toolbar-btn" onClick={onClose}>Cancel</button>
                    <button className="sf-toolbar-btn sf-primary-btn" onClick={handleApply}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default ChartModal;
