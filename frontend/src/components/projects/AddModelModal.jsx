import React from 'react';
import { X, Cpu, Tag, Target } from 'lucide-react';

const AddModelModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        version: '1.0.0',
        accuracy: 95.0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'accuracy' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="modal-content glass-card slide-up">
                <div className="modal-header">
                    <h3>Add AI Model</h3>
                    <button className="icon-btn-sm" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Model Name</label>
                        <div className="input-with-icon glass">
                            <Cpu size={16} />
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. YOLOv8 Object Detection"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Version</label>
                            <div className="input-with-icon glass">
                                <Tag size={16} />
                                <input
                                    type="text"
                                    name="version"
                                    placeholder="1.0.0"
                                    value={formData.version}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Target Accuracy (%)</label>
                            <div className="input-with-icon glass">
                                <Target size={16} />
                                <input
                                    type="number"
                                    step="0.1"
                                    name="accuracy"
                                    value={formData.accuracy}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Add Model</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddModelModal;
