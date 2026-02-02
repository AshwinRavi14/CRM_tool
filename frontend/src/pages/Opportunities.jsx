import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    MoreHorizontal,
    Filter,
    LayoutGrid,
    List,
    DollarSign,
    Loader2
} from 'lucide-react';
import apiClient from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import OpportunityModal from '../components/opportunities/OpportunityModal';
import './Opportunities.css';

const Opportunities = () => {
    const [pipeline, setPipeline] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const toast = useToast();

    const stages = [
        { id: 'PROSPECTING', label: 'Prospecting', color: '#38bdf8', key: 'prospecting' },
        { id: 'QUALIFICATION', label: 'Qualification', color: '#818cf8', key: 'qualification' },
        { id: 'PROPOSAL', label: 'Proposal', color: '#c084fc', key: 'proposal' },
        { id: 'NEGOTIATION', label: 'Negotiation', color: '#f472b6', key: 'negotiation' },
        { id: 'CLOSED_WON', label: 'Closed Won', color: '#10b981', key: 'closed_won' },
        { id: 'CLOSED_LOST', label: 'Closed Lost', color: '#ef4444', key: 'closed_lost' },
    ];

    const fetchPipeline = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/opportunities/pipeline');
            setPipeline(res.data);
        } catch (err) {
            console.error('Failed to fetch pipeline:', err);
            toast.error('Failed to load deals.');
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchPipeline();
    }, [fetchPipeline]);

    const handleCreateDeal = () => {
        setSelectedDeal(null);
        setShowModal(true);
    };

    const handleEditDeal = (deal) => {
        setSelectedDeal(deal);
        setShowModal(true);
    };

    const handleAdvanceStage = async (dealId, currentStage) => {
        const stageIndex = stages.findIndex(s => s.id === currentStage);
        if (stageIndex >= stages.length - 2) {
            toast.info('Deal is already in final stage or closed.');
            return;
        }

        const nextStage = stages[stageIndex + 1].id;

        try {
            toast.info(`Advancing deal to ${nextStage}...`);
            await apiClient.put(`/opportunities/${dealId}/advance-stage`, { newStage: nextStage });
            toast.success('Stage updated!');
            fetchPipeline();
        } catch (err) {
            console.error('Failed to advance stage:', err);
            toast.error(err.response?.data?.message || 'Failed to update stage');
        }
    };

    if (isLoading && !pipeline) {
        return (
            <div className="opportunities-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading your pipeline...</p>
            </div>
        );
    }

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
                    <button className="icon-btn-rect glass" onClick={fetchPipeline}>
                        <Filter size={18} />
                    </button>
                    <button className="create-btn" onClick={handleCreateDeal}>
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
                                <span className="count glass">{pipeline?.[stage.key]?.length || 0}</span>
                            </div>
                            <button className="icon-btn-sm" onClick={handleCreateDeal}><Plus size={16} /></button>
                        </div>

                        <div className="column-total glass">
                            <DollarSign size={14} />
                            <span>
                                {pipeline?.[stage.key]?.reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString() || 0}
                            </span>
                        </div>

                        <div className="kanban-list">
                            {pipeline?.[stage.key]?.map(deal => (
                                <div key={deal._id} className="kanban-card glass-card" onClick={() => handleEditDeal(deal)}>
                                    <div className="card-header">
                                        <span className="deal-name">{deal.name}</span>
                                        <button
                                            className="icon-btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAdvanceStage(deal._id, deal.stage);
                                            }}
                                            title="Advance Stage"
                                        >
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <p className="account-name">{deal.account?.companyName || 'Unknown Account'}</p>
                                        <div className="card-footer">
                                            <span className="amount">${deal.amount?.toLocaleString()}</span>
                                            <div className="owner-avatar glass" title={deal.owner?.firstName || 'Owner'}>
                                                {(deal.owner?.firstName || 'O').charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!pipeline?.[stage.key] || pipeline[stage.key].length === 0) && (
                                <div className="empty-column-msg" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                    No deals here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <OpportunityModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchPipeline}
                initialData={selectedDeal}
            />
        </div>
    );
};

export default Opportunities;

