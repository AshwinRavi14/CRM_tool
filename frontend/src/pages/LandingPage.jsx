import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, BarChart3, Calendar, MessageSquare, Zap, Shield, Check } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState('Professional');

    if (user && !loading) {
        return <Navigate to="/dashboard" replace />;
    }

    const features = [
        {
            icon: Users,
            title: 'Contact Management',
            description: 'Keep all customer information organized in one place. Track interactions, notes, and communication history.'
        },
        {
            icon: BarChart3,
            title: 'Sales Analytics',
            description: 'Get real-time insights into your sales pipeline. Track performance metrics and identify opportunities.'
        },
        {
            icon: Calendar,
            title: 'Task Automation',
            description: 'Automate repetitive tasks and workflows. Set reminders and never miss a follow-up.'
        },
        {
            icon: MessageSquare,
            title: 'Team Collaboration',
            description: 'Work together seamlessly with shared notes, mentions, and activity feeds for better teamwork.'
        },
        {
            icon: Zap,
            title: 'Integrations',
            description: 'Connect with your favorite tools. Sync data from email, calendar, and hundreds of other apps.'
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'Bank-level encryption and security. Your data is protected with industry-leading safeguards.'
        }
    ];

    const pricingPlans = [
        {
            name: 'Starter',
            price: '29',
            description: 'Perfect for small teams',
            features: ['Up to 5 users', '1,000 contacts', 'Basic analytics', 'Email support', 'Mobile app'],
            popular: false
        },
        {
            name: 'Professional',
            price: '79',
            description: 'For growing businesses',
            features: ['Up to 20 users', '10,000 contacts', 'Advanced analytics', 'Priority support', 'Custom integrations', 'API access'],
            popular: true
        },
        {
            name: 'Enterprise',
            price: '199',
            description: 'For large organizations',
            features: ['Unlimited users', 'Unlimited contacts', 'Custom analytics', 'Dedicated support', 'Advanced security', 'Custom training'],
            popular: false
        }
    ];

    const testimonials = [
        {
            quote: "Wersel CRM transformed how we manage our sales pipeline. We've seen a 40% increase in closed deals since switching.",
            author: "Sarah Johnson",
            role: "VP of Sales, TechCorp",
            avatar: "SJ"
        },
        {
            quote: "The automation features save us hours every week. It's like having an extra team member dedicated to follow-ups.",
            author: "Michael Chen",
            role: "Sales Director, GrowthLabs",
            avatar: "MC"
        },
        {
            quote: "Best CRM we've used. The interface is intuitive, and the customer support team is incredibly responsive.",
            author: "Emily Rodriguez",
            role: "CEO, Startup Inc",
            avatar: "ER"
        }
    ];

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="nav-content">
                        <div className="nav-logo">
                            <div className="logo-icon">
                                <Users size={20} />
                            </div>
                            <span className="logo-text">Wersel CRM</span>
                        </div>
                        <div className="nav-links">
                            <a href="#features" className="nav-link">Features</a>
                            <a href="#pricing" className="nav-link">Pricing</a>
                            <a href="#testimonials" className="nav-link">Testimonials</a>
                            <div className="nav-actions">
                                <Link to="/login" className="nav-link">Sign In</Link>
                                <Link to="/signup" className="btn-primary">Get Started</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="hero-badge">
                                <Zap size={16} />
                                <span>Trusted by 10,000+ teams</span>
                            </div>
                            <h1 className="hero-title">
                                Manage customer relationships that drive growth
                            </h1>
                            <p className="hero-subtitle">
                                Streamline your sales process, nurture customer relationships, and close more deals with our powerful CRM platform.
                            </p>
                            <div className="hero-ctas">
                                <Link to="/signup" className="btn-primary btn-large">Start Free Trial</Link>
                                <button className="btn-secondary btn-large">Watch Demo</button>
                            </div>
                            <p className="hero-note">No credit card required • 14-day free trial</p>
                        </div>
                        <div className="hero-visual">
                            <div className="hero-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                                    alt="CRM Dashboard"
                                    className="hero-image"
                                />
                            </div>
                            <div className="hero-stats-card">
                                <div className="stats-icon">
                                    <BarChart3 size={24} />
                                </div>
                                <div className="stats-content">
                                    <p className="stats-value">+127%</p>
                                    <p className="stats-label">Sales Growth</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Everything you need to succeed</h2>
                        <p className="section-subtitle">
                            Powerful features designed to help your team close more deals and build lasting customer relationships.
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="pricing-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Simple, transparent pricing</h2>
                        <p className="section-subtitle">Choose the plan that's right for your team</p>
                    </div>
                    <div className="pricing-grid">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`pricing-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.name ? 'selected' : ''}`}
                                onClick={() => setSelectedPlan(plan.name)}
                            >
                                {plan.popular && <div className="popular-badge">Most Popular</div>}
                                {selectedPlan === plan.name && (
                                    <div className="selected-check">
                                        <Check size={16} />
                                    </div>
                                )}
                                <h3 className="plan-name">{plan.name}</h3>
                                <p className="plan-description">{plan.description}</p>
                                <div className="plan-price">
                                    <span className="price-amount">${plan.price}</span>
                                    <span className="price-period">/month</span>
                                </div>
                                <button
                                    className={`plan-cta ${plan.popular || selectedPlan === plan.name ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        sessionStorage.setItem('selected_crm_plan', plan.name);
                                        navigate('/signup');
                                    }}
                                >
                                    Get Started
                                </button>
                                <ul className="plan-features">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="plan-feature">
                                            <Check size={18} className="check-icon" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Loved by teams worldwide</h2>
                        <p className="section-subtitle">See what our customers have to say</p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <div className="testimonial-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="star-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="testimonial-quote">{testimonial.quote}</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{testimonial.avatar}</div>
                                    <div className="author-info">
                                        <p className="author-name">{testimonial.author}</p>
                                        <p className="author-role">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="section-container">
                    <h2 className="cta-title">Ready to grow your business?</h2>
                    <p className="cta-subtitle">Join 10,000+ teams using Wersel CRM to close more deals.</p>
                    <div className="cta-actions">
                        <Link to="/signup" className="btn-primary btn-large">Start Free Trial</Link>
                        <button className="btn-secondary btn-large">Contact Sales</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="nav-logo">
                                <div className="logo-icon">
                                    <Users size={20} />
                                </div>
                                <span className="logo-text">Wersel CRM</span>
                            </div>
                            <p className="footer-tagline">
                                The modern CRM platform for teams that want to grow faster.
                            </p>
                        </div>
                        <div className="footer-links-group">
                            <h4 className="footer-heading">Product</h4>
                            <ul className="footer-links">
                                <li><a href="#features">Features</a></li>
                                <li><a href="#pricing">Pricing</a></li>
                                <li><a href="#">Integrations</a></li>
                                <li><a href="#">API</a></li>
                            </ul>
                        </div>
                        <div className="footer-links-group">
                            <h4 className="footer-heading">Company</h4>
                            <ul className="footer-links">
                                <li><a href="#">About</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-links-group">
                            <h4 className="footer-heading">Resources</h4>
                            <ul className="footer-links">
                                <li><a href="#">Documentation</a></li>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Community</a></li>
                                <li><a href="#">Status</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-copyright">© 2026 Wersel CRM. All rights reserved.</p>
                        <div className="footer-legal">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
