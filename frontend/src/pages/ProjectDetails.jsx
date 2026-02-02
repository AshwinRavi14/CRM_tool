import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Calendar,
    User,
    Building,
    Cpu,
    CheckCircle2,
    Clock,
    Edit,
    Plus,
    Activity,
    Check,
    X as XIcon,
    FileText,
    ExternalLink
} from 'lucide-react';
import apiClient from '../services/apiClient';
import ProjectModal from '../components/projects/ProjectModal';
import AddModelModal from '../components/projects/AddModelModal';
import UpdatePhaseModal from '../components/projects/UpdatePhaseModal';
import './ProjectDetails.css';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModelModalOpen, setIsAddModelModalOpen] = useState(false);
    const [selectedPhase, setSelectedPhase] = useState(null);

    const fetchProject = async () => {
        try {
            const response = await apiClient.get(`/projects/${id}`);
            const projectData = response.data.data || response.data;
            setProject(projectData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching project:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const handleUpdateProject = async (updatedData) => {
        try {
            await apiClient.put(`/projects/${id}`, updatedData);
            setIsEditModalOpen(false);
            fetchProject();
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project');
        }
    };

    const handleUpdatePhase = async (phaseData) => {
        try {
            const phaseIndex = project.phases.findIndex(p => p.name === selectedPhase.name);
            const updatedPhases = [...project.phases];
            updatedPhases[phaseIndex] = { ...updatedPhases[phaseIndex], ...phaseData };

            // Calculate new progress based on completed phases
            const completedCount = updatedPhases.filter(p => p.status === 'Completed').length;
            const newProgress = Math.round((completedCount / updatedPhases.length) * 100);

            await apiClient.put(`/projects/${id}`, {
                phases: updatedPhases,
                progress: newProgress,
                status: updatedPhases.find(p => p.status === 'In Progress')?.name || project.status
            });

            setSelectedPhase(null);
            fetchProject();
        } catch (error) {
            console.error('Error updating phase:', error);
        }
    };

    const handleAddModel = async (modelData) => {
        try {
            const currentModels = project.models || [];
            const updatedModels = [...currentModels, { ...modelData, active: true }];
            await apiClient.put(`/projects/${id}`, { models: updatedModels });
            setIsAddModelModalOpen(false);
            fetchProject();
        } catch (error) {
            console.error('Error adding model:', error);
        }
    };

    const handleToggleModelStatus = async (modelIndex) => {
        try {
            const updatedModels = [...project.models];
            updatedModels[modelIndex].active = !updatedModels[modelIndex].active;
            await apiClient.put(`/projects/${id}`, { models: updatedModels });
            fetchProject();
        } catch (error) {
            console.error('Error toggling model status:', error);
        }
    };

    if (loading) return (
        <div className="p-8 text-center glass-card" style={{ margin: '40px' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p>Loading project details...</p>
        </div>
    );

    if (!project) return (
        <div className="p-8 text-center glass-card" style={{ margin: '40px' }}>
            <p>Project not found.</p>
            <button className="create-btn" onClick={() => navigate('/projects')} style={{ marginTop: '16px' }}>
                Back to Projects
            </button>
        </div>
    );

    const phases = project.phases || [];

    return (
        <div className="project-details-container">
            <div className="details-header">
                <div className="header-left">
                    <button className="back-btn glass" onClick={() => navigate('/projects')}>
                        <ChevronLeft size={20} />
                    </button>
                    <div className="title-group">
                        <span className="id-badge">
                            {project._id ? project._id.substring(project._id.length - 8).toUpperCase() : 'NEW'}
                        </span>
                        <h2>{project.name}</h2>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="action-btn glass" onClick={() => setIsEditModalOpen(true)}>
                        <Edit size={18} /> <span>Edit</span>
                    </button>
                </div>
            </div>

            <div className="details-grid">
                {/* Main Content */}
                <div className="details-main">
                    <div className="overview-card glass-card">
                        <div className="section-title">
                            <Activity size={20} color="var(--primary)" />
                            <h3>Project Overview</h3>
                        </div>
                        <div className="overview-grid">
                            <div className="info-item">
                                <label><Building size={16} /> Account</label>
                                <span>{project.account}</span>
                            </div>
                            <div className="info-item">
                                <label><User size={16} /> Manager</label>
                                <span>{project.manager}</span>
                            </div>
                            <div className="info-item">
                                <label><Calendar size={16} /> Due Date</label>
                                <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not set'}</span>
                            </div>
                            <div className="info-item">
                                <label><Clock size={16} /> Status</label>
                                <span className={`status-tag ${(project.status || 'NOT_STARTED').toLowerCase()}`}>
                                    {project.status || 'NOT_STARTED'}
                                </span>
                            </div>
                        </div>

                        <div className="progress-section">
                            <div className="progress-header">
                                <span>Overall Completion</span>
                                <span>{project.progress || 0}%</span>
                            </div>
                            <div className="progress-bar-bg glass">
                                <div className="progress-bar-fill" style={{ width: `${project.progress || 0}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="phases-card glass-card">
                        <div className="section-title">
                            <CheckCircle2 size={20} color="var(--primary)" />
                            <h3>Project Phases</h3>
                        </div>
                        <div className="phases-stepper">
                            {phases.map((phase, index) => (
                                <div
                                    key={index}
                                    className={`phase-step ${phase.status.toLowerCase().replace(' ', '-')}`}
                                    onClick={() => setSelectedPhase(phase)}
                                >
                                    <div className="step-marker">
                                        {phase.status === 'Completed' ? <CheckCircle2 size={16} /> : index + 1}
                                    </div>
                                    <div className="step-content">
                                        <div className="step-header">
                                            <h4>{phase.name}</h4>
                                            <span className={`status-dot ${phase.status.toLowerCase().replace(' ', '-')}`}></span>
                                        </div>
                                        <p>{phase.status}</p>

                                        {(phase.documentation || phase.report) && (
                                            <div className="phase-assets">
                                                {phase.documentation && (
                                                    <div className="asset-link glass" onClick={(e) => e.stopPropagation()}>
                                                        <FileText size={12} />
                                                        <span>Doc</span>
                                                        <ExternalLink size={10} />
                                                    </div>
                                                )}
                                                {phase.report && (
                                                    <div className="asset-link glass" onClick={(e) => e.stopPropagation()}>
                                                        <Activity size={12} />
                                                        <span>Report</span>
                                                        <ExternalLink size={10} />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="details-sidebar">
                    <div className="models-card glass-card">
                        <div className="card-header">
                            <h3>Active Models</h3>
                            <button className="icon-btn-sm" onClick={() => setIsAddModelModalOpen(true)}>
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="models-list">
                            {(!project.models || project.models.length === 0) ? (
                                <p className="empty-state">No models active yet.</p>
                            ) : (
                                project.models.map((model, index) => (
                                    <div key={index} className={`model-item glass ${model.active ? '' : 'inactive-model'}`}>
                                        <div className="model-icon">
                                            <Cpu size={16} />
                                        </div>
                                        <div className="model-info">
                                            <span>{model.name} v{model.version}</span>
                                            <small>Accuracy: {model.accuracy}%</small>
                                        </div>
                                        <div className="model-actions">
                                            {model.active ? (
                                                <button
                                                    className="toggle-btn deselect"
                                                    onClick={() => handleToggleModelStatus(index)}
                                                    title="Deselect Model"
                                                >
                                                    <XIcon size={14} />
                                                </button>
                                            ) : (
                                                <button
                                                    className="toggle-btn select"
                                                    onClick={() => handleToggleModelStatus(index)}
                                                    title="Select Model"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="timeline-card glass-card">
                        <h3>Recent Activity</h3>
                        <div className="activity-timeline">
                            <div className="timeline-item">
                                <div className="time">2h ago</div>
                                <div className="text">Progress updated to {project.progress || 0}%</div>
                            </div>
                            <div className="timeline-item">
                                <div className="time">Yesterday</div>
                                <div className="text">New model deployed</div>
                            </div>
                            <div className="timeline-item">
                                <div className="time">3 days ago</div>
                                <div className="text">Data Prep phase completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <ProjectModal
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleUpdateProject}
                    initialData={project}
                    title="Edit Project"
                />
            )}

            {isAddModelModalOpen && (
                <AddModelModal
                    onClose={() => setIsAddModelModalOpen(false)}
                    onSave={handleAddModel}
                />
            )}

            {selectedPhase && (
                <UpdatePhaseModal
                    phase={selectedPhase}
                    onClose={() => setSelectedPhase(null)}
                    onSave={handleUpdatePhase}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
