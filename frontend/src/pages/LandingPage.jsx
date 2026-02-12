import React, { useState, useEffect } from 'react';
import {
    Shield,
    Zap,
    BarChart3,
    Users,
    MessageSquare,
    Globe,
    ArrowRight,
    Check,
    Star,
    ChevronRight,
    LayoutDashboard,
    PieChart,
    Calendar,
    Settings,
    Menu,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logo from '../assets/logo.svg';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('Pro');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <Users className="w-6 h-6" />,
            title: "Lead Management",
            description: "Track and nurture leads through a customizable pipeline and convert them with ease."
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Advanced Analytics",
            description: "Deep insights into your sales performance with real-time reporting and forecasting."
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Team Collaboration",
            description: "Seamlessly collaborate with your team, share notes, and assign tasks in one place."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Automated Workflows",
            description: "Save time by automating repetitive tasks like follow-up emails and reminders."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Enterprise Security",
            description: "Bank-grade security ensures your customer data is always protected and compliant."
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Global Integration",
            description: "Connect with over 1,000+ apps including Slack, Google Workspace, and Zoom."
        }
    ];

    const pricing = [
        {
            name: "Basic",
            price: "$29",
            description: "Perfect for small teams",
            features: ["Up to 5 Users", "Basic CRM Tools", "Email Support", "Core Integrations"]
        },
        {
            name: "Pro",
            price: "$79",
            description: "Our most popular choice",
            features: ["Up to 25 Users", "Advanced Analytics", "Priority Support", "Automated Flows", "Custom Reports"]
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For large organizations",
            features: ["Unlimited Users", "Full White-labeling", "Dedicated Manager", "SLA Guarantee", "Custom API Access"]
        }
    ];

    return (
        <div className="landing-page">
            {/* Header / Nav */}
            <nav className={`landing-nav ${scrolled ? 'nav-scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="nav-content">
                        <div className="nav-logo">
                            <img src={logo} alt="Wersel Logo" style={{ width: '32px', height: '32px' }} />
                            <span className="logo-text">Wersel CRM</span>
                        </div>
                        <div className="nav-links">
                            <a href="#features" className="nav-link">Features</a>
                            <a href="#pricing" className="nav-link">Pricing</a>
                            <a href="#testimonials" className="nav-link">Customers</a>
                        </div>
                        <div className="nav-actions">
                            <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
                            <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="hero-badge">
                                <Zap className="w-4 h-4" />
                                <span>Version 2.0 is now live</span>
                            </div>
                            <h1 className="hero-title">
                                Accelerate your sales with
                                <span className="text-blue"> Intelligence.</span>
                            </h1>
                            <p className="hero-subtitle">
                                The AI-powered CRM that helps teams sell smarter, faster, and more efficiently. Built for modern growth teams.
                            </p>
                            <div className="hero-ctas">
                                <button className="btn-primary btn-large" onClick={() => navigate('/signup')}>
                                    Start Free Trial
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </button>
                                <button className="btn-secondary btn-large">View Demo</button>
                            </div>
                            <p className="hero-note">No credit card required. 14-day free trial.</p>
                        </div>
                        <div className="hero-visual">
                            <div className="hero-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                                    alt="CRM Dashboard"
                                    className="hero-image"
                                />
                            </div>
                            <div className="hero-stats-card">
                                <div className="stats-icon">
                                    <PieChart className="w-6 h-6" />
                                </div>
                                <div className="stats-info">
                                    <p className="stats-value">32%</p>
                                    <p className="stats-label">Revenue Growth</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Everything you need to grow</h2>
                        <p className="section-subtitle">Powerful features to help you manage leads, close deals, and build lasting customer relationships.</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, idx) => (
                            <div key={idx} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
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
                        <p className="section-subtitle">Choose the plan that's right for your business. No hidden fees.</p>
                    </div>
                    <div className="pricing-grid">
                        {pricing.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`pricing-card ${selectedPlan === plan.name ? 'selected' : ''}`}
                                onClick={() => setSelectedPlan(plan.name)}
                            >
                                {selectedPlan === plan.name && (
                                    <div className="selected-check">
                                        <Check className="w-5 h-5" />
                                    </div>
                                )}
                                {plan.name === 'Pro' && <span className="popular-badge">Most Popular</span>}
                                <h3 className="plan-name">{plan.name}</h3>
                                <p className="plan-description">{plan.description}</p>
                                <div className="plan-price">
                                    <span className="price-amount">{plan.price}</span>
                                    <span className="price-period">/month</span>
                                </div>
                                <button className={`plan-cta ${plan.name === 'Pro' ? 'btn-primary' : 'btn-secondary'}`}>
                                    Get Started
                                </button>
                                <ul className="plan-features">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="plan-feature">
                                            <Check className="w-4 h-4 check-icon" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="testimonials-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Trusted by thousands</h2>
                        <p className="section-subtitle">Join over 10,000+ teams who use Wersel CRM to grow their business.</p>
                    </div>
                    <div className="testimonials-grid">
                        {[1, 2, 3].map((_, idx) => (
                            <div key={idx} className="testimonial-card">
                                <div className="testimonial-stars">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="star-icon" fill="currentColor" />)}
                                </div>
                                <p className="testimonial-quote">
                                    "Wersel has completely transformed how our sales team operates. We've seen a 40% increase in productivity within the first three months."
                                </p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">JD</div>
                                    <div className="author-info">
                                        <p className="author-name">John Doe</p>
                                        <p className="author-role">Director of Sales, TechCo</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2 className="cta-title">Ready to supercharge your sales?</h2>
                    <p className="cta-subtitle">Start your 14-day free trial today. No credit card required.</p>
                    <div className="cta-actions">
                        <button className="btn-primary btn-large" onClick={() => navigate('/signup')}>
                            Get Started Now
                        </button>
                        <button className="btn-secondary btn-large">Talk to Sales</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        {/* Brand Section */}
                        <div className="footer-column brand-column">
                            <div className="footer-logo">
                                <img src={logo} alt="Wersel Logo" />
                                <span className="footer-brand-name">Wersel CRM</span>
                            </div>
                            <p className="footer-description">
                                The modern CRM platform for teams that want to grow faster.
                            </p>
                        </div>

                        {/* Product */}
                        <div className="footer-column">
                            <h3 className="footer-heading">PRODUCT</h3>
                            <ul className="footer-links">
                                <li><a href="#features">Features</a></li>
                                <li><a href="#pricing">Pricing</a></li>
                                <li><a href="#">Integrations</a></li>
                                <li><a href="#">API</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="footer-column">
                            <h3 className="footer-heading">COMPANY</h3>
                            <ul className="footer-links">
                                <li><a href="#">About</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="footer-column">
                            <h3 className="footer-heading">RESOURCES</h3>
                            <ul className="footer-links">
                                <li><a href="#">Documentation</a></li>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Community</a></li>
                                <li><a href="#">Status</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom-divider"></div>

                    <div className="footer-bottom">
                        <p className="footer-copyright">© 2026 Wersel CRM</p>
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

