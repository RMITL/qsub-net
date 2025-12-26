import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';

const SponsorsPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    interest: 'Tournament Sponsor',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `[Sponsors] ${form.interest} - ${form.organization}`,
          message: `Organization: ${form.organization}\nRole: ${form.role}\nInterest: ${form.interest}\n\n${form.message}`
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitted(true);
      setForm({ name: '', email: '', organization: '', role: '', interest: 'Tournament Sponsor', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again or email us directly at info@qsub.net');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sponsors-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@200;300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .sponsors-page {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e8e6e3;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        /* Hero Section - Full viewport */
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 6rem 2rem 4rem;
          text-align: center;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%);
        }

        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.85rem;
          color: #d4af37;
          margin-bottom: 2rem;
          animation: fadeInDown 0.8s ease-out;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 200;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .hero-title .highlight {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 400;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(232, 230, 227, 0.7);
          max-width: 600px;
          line-height: 1.6;
          margin-bottom: 3rem;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .cta-primary {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0a0a0f;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
        }

        .cta-secondary {
          background: transparent;
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #d4af37;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }

        .cta-secondary:hover {
          background: rgba(212, 175, 55, 0.1);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(212, 175, 55, 0.5);
          font-size: 0.75rem;
          animation: bounce 2s infinite;
        }

        .scroll-indicator svg {
          width: 24px;
          height: 24px;
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Stats Section */
        .stats-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, #0a0a0f 0%, #0d0d14 100%);
          position: relative;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stat-card {
          text-align: center;
          padding: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }

        .stat-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .stat-card:nth-child(1) { transition-delay: 0s; }
        .stat-card:nth-child(2) { transition-delay: 0.1s; }
        .stat-card:nth-child(3) { transition-delay: 0.2s; }
        .stat-card:nth-child(4) { transition-delay: 0.3s; }

        .stat-value {
          font-size: 3.5rem;
          font-weight: 200;
          font-family: 'Space Grotesk', sans-serif;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(232, 230, 227, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* Partnership Models */
        .models-section {
          padding: 8rem 2rem;
          background: #0a0a0f;
          position: relative;
        }

        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 4rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }

        .section-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .section-overline {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #d4af37;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 300;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: rgba(232, 230, 227, 0.6);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .models-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .model-card {
          position: relative;
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(20, 20, 35, 0.8) 100%);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          overflow: hidden;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.6s ease-out;
        }

        .model-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .model-card:nth-child(1) { transition-delay: 0s; }
        .model-card:nth-child(2) { transition-delay: 0.1s; }
        .model-card:nth-child(3) { transition-delay: 0.2s; }
        .model-card:nth-child(4) { transition-delay: 0.3s; }

        .model-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #d4af37, #f4d03f);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease-out;
        }

        .model-card:hover::before {
          transform: scaleX(1);
        }

        .model-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-5px);
        }

        .model-icon {
          width: 60px;
          height: 60px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .model-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #d4af37;
          margin-bottom: 0.5rem;
        }

        .model-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .model-desc {
          color: rgba(232, 230, 227, 0.7);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .model-features {
          list-style: none;
          display: grid;
          gap: 0.75rem;
        }

        .model-features li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: rgba(232, 230, 227, 0.8);
        }

        .model-features li::before {
          content: '+';
          color: #d4af37;
          font-weight: bold;
          flex-shrink: 0;
        }

        /* Value Props - Horizontal scroll */
        .value-section {
          padding: 6rem 0;
          background: linear-gradient(180deg, #0d0d14 0%, #0a0a0f 100%);
          overflow: hidden;
        }

        .value-track {
          display: flex;
          gap: 2rem;
          padding: 2rem;
          animation: scrollTrack 30s linear infinite;
        }

        @keyframes scrollTrack {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .value-item {
          flex-shrink: 0;
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 12px;
          padding: 2rem;
          width: 300px;
          text-align: center;
        }

        .value-item h3 {
          color: #d4af37;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .value-item p {
          color: rgba(232, 230, 227, 0.6);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        /* Contact Section */
        .contact-section {
          padding: 8rem 2rem;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
            #0a0a0f;
        }

        .contact-container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: start;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.6s ease-out;
        }

        .contact-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .contact-info h2 {
          font-size: 2.5rem;
          font-weight: 300;
          margin-bottom: 1.5rem;
        }

        .contact-info h2 .highlight {
          color: #d4af37;
        }

        .contact-info > p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .benefit-list {
          list-style: none;
          display: grid;
          gap: 1rem;
        }

        .benefit-list li {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(26, 26, 46, 0.3);
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .benefit-list li:hover {
          background: rgba(212, 175, 55, 0.1);
          transform: translateX(5px);
        }

        .benefit-list .icon {
          width: 36px;
          height: 36px;
          background: rgba(212, 175, 55, 0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          flex-shrink: 0;
        }

        .contact-form-card {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .contact-form-card h3 {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          color: #d4af37;
        }

        .sponsors-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.85rem;
          color: rgba(232, 230, 227, 0.8);
          font-weight: 500;
        }

        .sponsors-form input,
        .sponsors-form select,
        .sponsors-form textarea {
          background: rgba(10, 10, 15, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 0.875rem 1rem;
          color: #e8e6e3;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s;
        }

        .sponsors-form input:focus,
        .sponsors-form select:focus,
        .sponsors-form textarea:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .sponsors-form textarea {
          min-height: 120px;
          resize: vertical;
        }

        .sponsors-form select option {
          background: #1a1a2e;
        }

        .sponsors-submit {
          background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
          color: #0a0a0f;
          border: none;
          border-radius: 10px;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }

        .sponsors-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
        }

        .sponsors-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
        }

        .form-success {
          text-align: center;
          padding: 3rem 2rem;
        }

        .form-success .icon {
          width: 80px;
          height: 80px;
          background: rgba(212, 175, 55, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
          color: #d4af37;
        }

        .form-success h3 {
          color: #e8e6e3;
          margin-bottom: 0.5rem;
        }

        .form-success p {
          color: rgba(232, 230, 227, 0.7);
        }

        /* Mobile */
        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .models-grid {
            grid-template-columns: 1fr;
          }

          .contact-container {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          .stat-value {
            font-size: 2.5rem;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .contact-form-card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <Header currentPage="Sponsors" variant="fixed" />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>Enterprise Partnerships</span>
        </div>
        <h1 className="hero-title">
          Power the Future of<br />
          <span className="highlight">Decentralized Alpha</span>
        </h1>
        <p className="hero-subtitle">
          Partner with QUANTA to host branded tournaments, operate custom miner pools,
          or run tournament validators. Join the decentralized stock picking revolution.
        </p>
        <div className="hero-cta">
          <a href="#contact" className="cta-primary">Start Partnership Discussion</a>
          <a href="/pitch-lite" className="cta-secondary">Learn About QUANTA</a>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" id="stats" data-animate>
        <div className="stats-grid">
          <div className={`stat-card ${isVisible('stats') ? 'visible' : ''}`}>
            <div className="stat-value">$45T+</div>
            <div className="stat-label">U.S. Equity Market</div>
          </div>
          <div className={`stat-card ${isVisible('stats') ? 'visible' : ''}`}>
            <div className="stat-value">256</div>
            <div className="stat-label">On-Chain UIDs</div>
          </div>
          <div className={`stat-card ${isVisible('stats') ? 'visible' : ''}`}>
            <div className="stat-value">∞</div>
            <div className="stat-label">Signal Pool Capacity</div>
          </div>
          <div className={`stat-card ${isVisible('stats') ? 'visible' : ''}`}>
            <div className="stat-value">41%</div>
            <div className="stat-label">Validator Emissions</div>
          </div>
        </div>
      </section>

      {/* Partnership Models */}
      <section className="models-section" id="models" data-animate>
        <div className={`section-header ${isVisible('models') ? 'visible' : ''}`}>
          <div className="section-overline">Partnership Models</div>
          <h2 className="section-title">Multiple Ways to Partner</h2>
          <p className="section-subtitle">
            Choose the partnership model that aligns with your objectives,
            from infrastructure to branded competitions.
          </p>
        </div>

        <div className="models-grid">
          <div className={`model-card ${isVisible('models') ? 'visible' : ''}`}>
            <div className="model-icon">&#9881;</div>
            <div className="model-label">Infrastructure</div>
            <h3 className="model-title">Tournament Validator</h3>
            <p className="model-desc">
              Run validation infrastructure for QUANTA tournaments. Earn TAO emissions
              while providing critical network services.
            </p>
            <ul className="model-features">
              <li>41% of emission split to validators</li>
              <li>Access to raw signal data for research</li>
              <li>Priority API access for integrations</li>
              <li>Hardware: 4+ vCPUs, 16GB+ RAM</li>
            </ul>
          </div>

          <div className={`model-card ${isVisible('models') ? 'visible' : ''}`}>
            <div className="model-icon">&#9733;</div>
            <div className="model-label">Aggregation</div>
            <h3 className="model-title">Custom Miner Pool</h3>
            <p className="model-desc">
              Operate a branded pool aggregating signals from your community,
              employees, or customer base.
            </p>
            <ul className="model-features">
              <li>White-label pool with your branding</li>
              <li>10-20% operator fee on earnings</li>
              <li>Unlimited participant capacity</li>
              <li>Custom onboarding flows</li>
            </ul>
          </div>

          <div className={`model-card ${isVisible('models') ? 'visible' : ''}`}>
            <div className="model-icon">&#127942;</div>
            <div className="model-label">Competition</div>
            <h3 className="model-title">Tournament Sponsor</h3>
            <p className="model-desc">
              Sponsor themed tournaments with custom prize pools,
              participant criteria, and marketing integration.
            </p>
            <ul className="model-features">
              <li>Branded tournament landing pages</li>
              <li>Custom scoring rules & themes</li>
              <li>Winner spotlights & case studies</li>
              <li>Joint PR opportunities</li>
            </ul>
          </div>

          <div className={`model-card ${isVisible('models') ? 'visible' : ''}`}>
            <div className="model-icon">&#128202;</div>
            <div className="model-label">Data</div>
            <h3 className="model-title">Signal API Enterprise</h3>
            <p className="model-desc">
              Enterprise access to aggregated QUANTA signals for research,
              trading desk integration, or product development.
            </p>
            <ul className="model-features">
              <li>Real-time WebSocket feeds</li>
              <li>Historical performance data</li>
              <li>Custom endpoints & filters</li>
              <li>Dedicated support & SLA</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Scrolling Value Props */}
      <section className="value-section">
        <div className="value-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="value-item">
                <h3>Brand Visibility</h3>
                <p>Associate your brand with cutting-edge decentralized finance</p>
              </div>
              <div className="value-item">
                <h3>Talent Pipeline</h3>
                <p>Identify top-performing traders and quantitative analysts</p>
              </div>
              <div className="value-item">
                <h3>Revenue Share</h3>
                <p>Earn from emissions and pool operator fees</p>
              </div>
              <div className="value-item">
                <h3>Data Access</h3>
                <p>Enterprise access to aggregated alpha signals</p>
              </div>
              <div className="value-item">
                <h3>Community Building</h3>
                <p>Engage your audience with competitive trading</p>
              </div>
              <div className="value-item">
                <h3>Marketing Integration</h3>
                <p>Joint campaigns and co-branded content</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section" id="contact" data-animate>
        <div className={`contact-container ${isVisible('contact') ? 'visible' : ''}`}>
          <div className="contact-info">
            <h2>Ready to <span className="highlight">Partner</span>?</h2>
            <p>
              Join the next generation of decentralized finance infrastructure.
              Our team will work with you to design a partnership that meets your goals.
            </p>
            <ul className="benefit-list">
              <li>
                <span className="icon">+</span>
                <span>Access $45T+ U.S. equity market signals</span>
              </li>
              <li>
                <span className="icon">+</span>
                <span>Transparent on-chain scoring & rewards</span>
              </li>
              <li>
                <span className="icon">+</span>
                <span>Built on Bittensor's proven infrastructure</span>
              </li>
              <li>
                <span className="icon">+</span>
                <span>Flexible partnership structures</span>
              </li>
            </ul>
          </div>

          <div className="contact-form-card">
            <h3>Start the Conversation</h3>
            {submitted ? (
              <div className="form-success">
                <div className="icon">+</div>
                <h3>Thank You!</h3>
                <p>We've received your inquiry and will be in touch within 1-2 business days.</p>
              </div>
            ) : (
              <form className="sponsors-form" onSubmit={handleSubmit}>
                {error && <div className="form-error">{error}</div>}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="organization">Organization</label>
                    <input
                      id="organization"
                      type="text"
                      placeholder="Company name"
                      value={form.organization}
                      onChange={(e) => setForm({...form, organization: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      id="role"
                      type="text"
                      placeholder="Your title"
                      value={form.role}
                      onChange={(e) => setForm({...form, role: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="interest">Primary Interest</label>
                  <select
                    id="interest"
                    value={form.interest}
                    onChange={(e) => setForm({...form, interest: e.target.value})}
                  >
                    <option value="Tournament Sponsor">Tournament Sponsor</option>
                    <option value="Custom Miner Pool">Custom Miner Pool</option>
                    <option value="Tournament Validator">Tournament Validator</option>
                    <option value="Signal API Enterprise">Signal API Enterprise</option>
                    <option value="Multiple / Exploring">Multiple / Exploring</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tell us about your goals</label>
                  <textarea
                    id="message"
                    placeholder="What are you looking to achieve?"
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    required
                  />
                </div>

                <button type="submit" className="sponsors-submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SponsorsPage;
