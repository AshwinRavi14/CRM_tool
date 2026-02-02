import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    MoreHorizontal,
    Search,
    Clock,
    Settings,
    ChevronRight,
    Cpu
} from 'lucide-react';
import apiClient from '../services/apiClient';
import ProjectModal from '../components/projects/ProjectModal';
import './Projects.css';

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProjects = async () => {
        try {
            const response = await apiClient.get('/projects');
            // apiClient's response interceptor returns response.data
            // The API returns { success: true, count: X, data: [projects] }
            if (response && response.data) {
                setProjects(response.data);
            } else {
                setProjects([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (projectData) => {
        try {
            await apiClient.post('/projects', projectData);
            setIsModalOpen(false);
            fetchProjects(); // Refresh list
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project');
        }
    };

    const getDaysDue = (dateString) => {
        if (!dateString) return 'No due date';
        const due = new Date(dateString);
        const now = new Date();
        const diffTime = due - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Due today';
        return `Due in ${diffDays} days`;
    };

    const filteredProjects = Array.isArray(projects) ? projects.filter(project =>
        (project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.account || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="projects-container">
            <div className="projects-header glass-card">
                <div className="header-info">
                    <h2>Projects</h2>
                    <p>Track delivery and deployment of your AI solutions.</p>
                </div>
                <div className="header-actions">
                    <div className="projects-search glass">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="create-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-8">Loading projects...</div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map(project => (
                        <div key={project._id} className="project-card glass-card">
                            <div className="project-card-header">
                                <div className="project-type-icon glass">
                                    <Cpu size={20} color="#38bdf8" />
                                </div>
                                <button className="icon-btn-sm"><MoreHorizontal size={18} /></button>
                            </div>

                            <div className="project-card-body">
                                <span className="project-id">
                                    {project._id ? project._id.substring(project._id.length - 8).toUpperCase() : 'NEW'}
                                </span>
                                <h3 className="project-name">{project.name}</h3>
                                <p className="project-account">{project.account}</p>

                                <div className="project-meta">
                                    <div className="meta-item">
                                        <Clock size={14} />
                                        <span>{getDaysDue(project.dueDate)}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Settings size={14} />
                                        <span>{(project.models ? project.models.length : project.activeModels) || 0} Models active</span>
                                    </div>
                                </div>

                                <div className="project-progress">
                                    <div className="progress-header">
                                        <span>Progress</span>
                                        <span>{project.progress || 0}%</span>
                                    </div>
                                    <div className="progress-bar-bg glass">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${project.progress || 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="project-phases">
                                    {project.phases && Array.isArray(project.phases) && project.phases.slice(0, 3).map((phase, i) => (
                                        <span key={i} className="phase-tag glass">
                                            {typeof phase === 'object' ? phase.name : phase}
                                        </span>
                                    ))}
                                    {project.status !== 'COMPLETED' && (
                                        <span className="phase-next">
                                            Status: {project.status || 'Planning'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="project-card-footer">
                                <div className="manager-info">
                                    <img src={`https://ui-avatars.com/api/?name=${project.manager || 'User'}&background=38bdf8&color=fff`} alt="PM" />
                                    <span>{project.manager}</span>
                                </div>
                                <button
                                    className="view-details-btn"
                                    onClick={() => navigate(`/projects/${project._id}`)}
                                >
                                    <span>Details</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredProjects.length === 0 && (
                        <div className="text-center p-8 glass-card" style={{ gridColumn: '1 / -1' }}>
                            <p>No projects found. Click "New Project" to get started!</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <ProjectModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleCreateProject}
                />
            )}
        </div>
    );
};

export default Projects;
