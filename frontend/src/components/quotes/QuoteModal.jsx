import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../services/apiClient';
import './QuoteModal.css';

const emptyItem = { product: '', description: '', quantity: 1, unitPrice: 0, discount: 0 };

const QuoteModal = ({ quote, leadData, onClose, onSave }) => {
    const isEdit = !!quote;
    const { showToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        contactName: '',
        contactEmail: '',
        companyName: '',
        items: [{ ...emptyItem }],
        taxRate: 0,
        notes: '',
        validUntil: new Date(+new Date() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    useEffect(() => {
        if (quote) {
            setForm({
                contactName: quote.contactName || '',
                contactEmail: quote.contactEmail || '',
                companyName: quote.companyName || '',
                items: quote.items?.length ? quote.items.map(i => ({
                    product: i.product, description: i.description || '',
                    quantity: i.quantity, unitPrice: i.unitPrice, discount: i.discount || 0
                })) : [{ ...emptyItem }],
                taxRate: quote.taxRate || 0,
                notes: quote.notes || '',
                validUntil: quote.validUntil ? new Date(quote.validUntil).toISOString().split('T')[0] : ''
            });
        } else if (leadData) {
            setForm(prev => ({
                ...prev,
                contactName: `${leadData.firstName} ${leadData.lastName}`,
                contactEmail: leadData.email || '',
                companyName: leadData.company || ''
            }));
        }
    }, [quote, leadData]);

    const updateItem = (idx, field, value) => {
        setForm(prev => {
            const items = [...prev.items];
            items[idx] = { ...items[idx], [field]: value };
            return { ...prev, items };
        });
    };

    const addItem = () => setForm(prev => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
    const removeItem = (idx) => {
        if (form.items.length === 1) return;
        setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
    };

    const calcLineTotal = (item) => (item.quantity || 0) * (item.unitPrice || 0) * (1 - (item.discount || 0) / 100);
    const subtotal = form.items.reduce((s, i) => s + calcLineTotal(i), 0);
    const taxAmount = subtotal * ((form.taxRate || 0) / 100);
    const total = subtotal + taxAmount;

    const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.items.some(i => i.product && i.unitPrice > 0)) {
            showToast('Add at least one item with a price', 'error');
            return;
        }
        setSaving(true);
        try {
            if (isEdit) {
                await apiClient.put(`/quotes/${quote._id}`, form);
                showToast('Quote updated', 'success');
            } else if (leadData) {
                await apiClient.post(`/quotes/generate-from-lead/${leadData._id}`, form);
                showToast('Quote generated from lead', 'success');
            } else {
                await apiClient.post('/quotes', form);
                showToast('Quote created', 'success');
            }
            onSave();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save quote', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="quote-modal glass-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isEdit ? 'Edit Quote' : leadData ? 'Generate Quote from Lead' : 'New Quote'}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Contact Info */}
                    <div className="form-section">
                        <h4>Contact Information</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Contact Name</label>
                                <input type="text" value={form.contactName}
                                    onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))}
                                    placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={form.contactEmail}
                                    onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))}
                                    placeholder="john@example.com" />
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <input type="text" value={form.companyName}
                                    onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))}
                                    placeholder="Acme Corp" />
                            </div>
                            <div className="form-group">
                                <label>Valid Until</label>
                                <input type="date" value={form.validUntil}
                                    onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="form-section">
                        <div className="section-header">
                            <h4>Line Items</h4>
                            <button type="button" className="add-item-btn" onClick={addItem}>
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                        <div className="items-table">
                            <div className="items-header">
                                <span className="col-product">Product / Service</span>
                                <span className="col-qty">Qty</span>
                                <span className="col-price">Unit Price</span>
                                <span className="col-discount">Disc %</span>
                                <span className="col-total">Total</span>
                                <span className="col-action"></span>
                            </div>
                            {form.items.map((item, idx) => (
                                <div className="item-row" key={idx}>
                                    <input className="col-product" value={item.product} placeholder="Product name"
                                        onChange={e => updateItem(idx, 'product', e.target.value)} />
                                    <input className="col-qty" type="number" min="1" value={item.quantity}
                                        onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)} />
                                    <input className="col-price" type="number" min="0" step="0.01" value={item.unitPrice}
                                        onChange={e => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)} />
                                    <input className="col-discount" type="number" min="0" max="100" value={item.discount}
                                        onChange={e => updateItem(idx, 'discount', parseFloat(e.target.value) || 0)} />
                                    <span className="col-total line-total">{formatCurrency(calcLineTotal(item))}</span>
                                    <button type="button" className="col-action remove-btn"
                                        onClick={() => removeItem(idx)} disabled={form.items.length === 1}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="form-section summary-section">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="summary-row tax-row">
                            <span>
                                Tax Rate
                                <input type="number" min="0" max="100" step="0.1" value={form.taxRate}
                                    onChange={e => setForm(p => ({ ...p, taxRate: parseFloat(e.target.value) || 0 }))}
                                    className="tax-input" /> %
                            </span>
                            <span>{formatCurrency(taxAmount)}</span>
                        </div>
                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="form-section">
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea rows={3} value={form.notes}
                                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                                placeholder="Additional notes or terms..." />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? 'Saving...' : isEdit ? 'Update Quote' : 'Create Quote'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuoteModal;
