import React, { useState, useRef } from 'react';
import { X, FileText, Upload, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const UpdatePhaseModal = ({ phase, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        status: phase.status || 'Pending',
        documentation: phase.documentation || '',
        report: phase.report || ''
    });

    const docInputRef = useRef(null);
    const reportInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [field]: file.name });
        }
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
                    <div className="header-title-group">
                        <CheckCircle2 size={20} color="var(--primary)" />
                        <h3>Update Phase: {phase.name}</h3>
                    </div>
                    <button className="icon-btn-sm" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            className="glass-select"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Project Documentation</label>
                        <input
                            type="file"
                            ref={docInputRef}
                            style={{ display: 'none' }}
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, 'documentation')}
                        />
                        <div className="file-upload-zone glass" onClick={() => docInputRef.current.click()}>
                            <Upload size={20} />
                            {formData.documentation ? (
                                <div className="file-info">
                                    <FileText size={16} />
                                    <span>{formData.documentation}</span>
                                </div>
                            ) : (
                                <span>Click to upload documentation (PDF, DOC)</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Phase Report</label>
                        <input
                            type="file"
                            ref={reportInputRef}
                            style={{ display: 'none' }}
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, 'report')}
                        />
                        <div className="file-upload-zone glass" onClick={() => reportInputRef.current.click()}>
                            <Upload size={20} />
                            {formData.report ? (
                                <div className="file-info">
                                    <FileText size={16} />
                                    <span>{formData.report}</span>
                                </div>
                            ) : (
                                <span>Click to upload phase report (PDF, DOC)</span>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePhaseModal;
