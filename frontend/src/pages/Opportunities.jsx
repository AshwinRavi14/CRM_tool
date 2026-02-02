import React from 'react';
import {
    Plus,
    MoreHorizontal,
    Filter,
    LayoutGrid,
    List,
    Calendar,
    DollarSign
} from 'lucide-react';
import './Opportunities.css';

const Opportunities = () => {
    const stages = [
        { id: 'PROSPECTING', label: 'Prospecting', color: '#38bdf8' },
        { id: 'QUALIFICATION', label: 'Qualification', color: '#818cf8' },
        { id: 'PROPOSAL', label: 'Proposal', color: '#c084fc' },
        { id: 'NEGOTIATION', label: 'Negotiation', color: '#f472b6' },
        { id: 'CLOSED_WON', label: 'Closed Won', color: '#10b981' },
    ];

    const deals = [
        { id: 1, name: 'AI Radiology Solution', account: 'Sacred Heart Hospital', amount: 45000, stage: 'PROSPECTING', owner: 'Cleona Davis' },
        { id: 2, name: 'Cloud Migration Phase 2', account: 'Global Retail Corp', amount: 120000, stage: 'QUALIFICATION', owner: 'John Smith' },
        { id: 3, name: 'Smart Factory Integration', account: 'MegaFab Industries', amount: 85000, stage: 'PROPOSAL', owner: 'Sarah Chen' },
        { id: 4, name: 'Security Audit & Patching', account: 'SafeBank IT', amount: 32000, stage: 'NEGOTIATION', owner: 'Cleona Davis' },
        { id: 5, name: 'HR Platform AI Upgrade', account: 'PeopleFirst Inc', amount: 28000, stage: 'CLOSED_WON', owner: 'Robert Wilson' },
        { id: 6, name: 'Network Infrastructure Build', account: 'ConnectX', amount: 55000, stage: 'PROPOSAL', owner: 'Cleona Davis' },
    ];

    const getDealsByStage = (stageId) => deals.filter(deal => deal.stage === stageId);

    return (
        <div className="opportunities-container">
            <div className="opportunities-header glass-card">
                <div className="header-info">
                    <h2>Deals</h2>
                    <p>Monitor your sales pipeline and close more deals.</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle glass">
                        <button className="active"><LayoutGrid size={18} /></button>
                        <button><List size={18} /></button>
                    </div>
                    <button className="icon-btn-rect glass">
                        <Filter size={18} />
                    </button>
                    <button className="create-btn">
                        <Plus size={18} />
                        <span>Add Deal</span>
                    </button>
                </div>
            </div>

            <div className="kanban-board">
                {stages.map(stage => (
                    <div key={stage.id} className="kanban-column">
                        <div className="column-header">
                            <div className="header-title">
                                <span className="dot" style={{ backgroundColor: stage.color }} />
                                <h3>{stage.label}</h3>
                                <span className="count glass">{getDealsByStage(stage.id).length}</span>
                            </div>
                            <button className="icon-btn-sm"><Plus size={16} /></button>
                        </div>

                        <div className="column-total glass">
                            <DollarSign size={14} />
                            <span>{getDealsByStage(stage.id).reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</span>
                        </div>

                        <div className="kanban-list">
                            {getDealsByStage(stage.id).map(deal => (
                                <div key={deal.id} className="kanban-card glass-card">
                                    <div className="card-header">
                                        <span className="deal-name">{deal.name}</span>
                                        <button className="icon-btn-sm"><MoreHorizontal size={14} /></button>
                                    </div>
                                    <div className="card-body">
                                        <p className="account-name">{deal.account}</p>
                                        <div className="card-footer">
                                            <span className="amount">${deal.amount.toLocaleString()}</span>
                                            <div className="owner-avatar glass" title={deal.owner}>
                                                {deal.owner.charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Opportunities;
