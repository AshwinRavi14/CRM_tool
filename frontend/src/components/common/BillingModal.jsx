import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Globe } from 'lucide-react';
import './BillingModal.css';

const BillingModal = ({ isOpen, onClose, onSave, onSkip }) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        nameOnCard: '',
        billingCountry: 'United States',
        agreeToCharge: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error('Billing save failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="billing-modal-overlay">
            <div className="billing-modal-content">
                <button className="close-btn-top" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="billing-modal-header">
                    <h2>Enter billing details (optional)</h2>
                    <p>Securely add your payment information for a seamless experience after your trial.</p>
                </div>

                <form className="billing-form" onSubmit={handleSubmit}>
                    <div className="form-group-full">
                        <label>Card number</label>
                        <div className="input-with-icon-billing">
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="**** **** **** ****"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row-billing">
                        <div className="form-group-half">
                            <label>Expiry date</label>
                            <input
                                type="text"
                                name="expiryDate"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-half">
                            <label>CVC</label>
                            <input
                                type="text"
                                name="cvc"
                                placeholder="***"
                                value={formData.cvc}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-full">
                        <label>Name on card</label>
                        <input
                            type="text"
                            name="nameOnCard"
                            placeholder="Jane Doe"
                            value={formData.nameOnCard}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-full">
                        <label>Billing country</label>
                        <div className="select-wrapper-billing">
                            <select
                                name="billingCountry"
                                value={formData.billingCountry}
                                onChange={handleChange}
                            >
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                                <option value="India">India</option>
                                <option value="Germany">Germany</option>
                                <option value="Australia">Australia</option>
                            </select>
                            <Globe size={16} className="select-icon-billing" />
                        </div>
                    </div>

                    <div className="agreement-checkbox">
                        <label className="checkbox-container-billing">
                            <input
                                type="checkbox"
                                name="agreeToCharge"
                                checked={formData.agreeToCharge}
                                onChange={handleChange}
                                required
                            />
                            <span className="checkmark-billing"></span>
                            <div className="checkbox-text-billing">
                                <strong>I agree to be charged after trial ends</strong>
                                <p>You won't be charged during the trial period. Your subscription will start automatically unless you cancel before your trial ends. Upgrade or cancel anytime.</p>
                            </div>
                        </label>
                    </div>

                    <div className="billing-modal-footer">
                        <button type="button" className="btn-skip-billing" onClick={onSkip}>
                            Skip for now
                        </button>
                        <button type="submit" className="btn-save-billing" disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Save card & Start trial'}
                        </button>
                    </div>
                </form>

                <div className="pci-compliance-footer">
                    <Lock size={14} />
                    <span>PCI compliant & secure. <a href="#">Billing terms</a></span>
                </div>
            </div>
        </div>
    );
};

export default BillingModal;
