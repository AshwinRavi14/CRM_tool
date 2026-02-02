import React from 'react';
import { X, Calendar, User, Building, Layers } from 'lucide-react';
import './CreateProjectModal.css';

const ProjectModal = ({ onClose, onSave, initialData, title = "Create New Project" }) => {
    const [formData, setFormData] = React.useState({
        name: initialData?.name || '',
        account: initialData?.account || '',
        manager: initialData?.manager || '',
        dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
        phases: initialData?.phases || ['Planning', 'Data Prep', 'Model Dev', 'Validation', 'Deployment']
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    <h3>{title}</h3>
                    <button className="icon-btn-sm" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Project Name</label>
                        <div className="input-with-icon glass">
                            <Layers size={16} />
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Lung Cancer Detection FNN"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Account</label>
                            <div className="input-with-icon glass">
                                <Building size={16} />
                                <input
                                    type="text"
                                    name="account"
                                    placeholder="Client Name"
                                    value={formData.account}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Manager</label>
                            <div className="input-with-icon glass">
                                <User size={16} />
                                <input
                                    type="text"
                                    name="manager"
                                    placeholder="Project Manager"
                                    value={formData.manager}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Due Date</label>
                        <div className="input-with-icon glass">
                            <Calendar size={16} />
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">{initialData ? 'Update Project' : 'Create Project'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
