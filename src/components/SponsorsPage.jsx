import React, { useState } from 'react';

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

        .sponsors-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d0d14 0%, #151520 50%, #0d0d14 100%);
          color: #e8e6e3;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .sponsors-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(52, 152, 219, 0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .sponsors-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(13, 13, 20, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          padding: 0.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sponsors-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-logo {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #0d0d14;
          text-decoration: none;
          font-family: 'Space Grotesk', sans-serif;
        }

        .brand-link {
          font-size: 1.25rem;
          font-weight: 700;
          color: #d4af37;
          text-decoration: none;
          letter-spacing: 0.1em;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .brand-separator {
          color: rgba(212, 175, 55, 0.3);
        }

        .brand-page {
          color: rgba(232, 230, 227, 0.7);
          font-size: 0.9rem;
        }

        .sponsors-nav {
          display: flex;
          gap: 1.5rem;
        }

        .sponsors-nav a {
          color: rgba(232, 230, 227, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .sponsors-nav a:hover {
          color: #d4af37;
        }

        .sponsors-nav a.nav-join {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0d0d14;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .sponsors-nav a.nav-join:hover {
          color: #0d0d14;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .sponsors-main {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          padding: 3rem 1.5rem 4rem;
        }

        .sponsors-hero {
          text-align: center;
          margin-bottom: 3rem;
        }

        .sponsors-hero h1 {
          font-size: 2.5rem;
          font-weight: 300;
          color: #d4af37;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }

        .sponsors-hero p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto;
        }

        .value-props {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .value-card {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .value-card h3 {
          color: #d4af37;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .value-card p {
          color: rgba(232, 230, 227, 0.75);
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .sponsor-types {
          margin-bottom: 3rem;
        }

        .sponsor-types h2 {
          text-align: center;
          color: #d4af37;
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
        }

        .type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .type-card {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .type-card h3 {
          color: #e8e6e3;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .type-card .type-label {
          color: #d4af37;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }

        .type-card p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .type-card ul {
          margin: 0;
          padding-left: 1.25rem;
          color: rgba(232, 230, 227, 0.7);
          font-size: 0.9rem;
        }

        .type-card li {
          margin-bottom: 0.5rem;
        }

        .contact-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .contact-info-section {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
          padding: 2rem;
        }

        .contact-info-section h2 {
          color: #d4af37;
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .contact-info-section p {
          color: rgba(232, 230, 227, 0.75);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .benefit-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefit-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: rgba(232, 230, 227, 0.8);
          font-size: 0.95rem;
        }

        .benefit-list .check {
          color: #d4af37;
          font-weight: bold;
        }

        .contact-form-section {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
          padding: 2rem;
        }

        .contact-form-section h2 {
          color: #d4af37;
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .sponsors-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.85rem;
          color: rgba(232, 230, 227, 0.8);
          font-weight: 500;
        }

        .sponsors-form input,
        .sponsors-form select,
        .sponsors-form textarea {
          background: rgba(13, 13, 20, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #e8e6e3;
          font-size: 0.95rem;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .sponsors-form input:focus,
        .sponsors-form select:focus,
        .sponsors-form textarea:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .sponsors-form input::placeholder,
        .sponsors-form textarea::placeholder {
          color: rgba(232, 230, 227, 0.4);
        }

        .sponsors-form select option {
          background: #1a1a2e;
          color: #e8e6e3;
        }

        .sponsors-form textarea {
          min-height: 100px;
          resize: vertical;
        }

        .sponsors-submit {
          background: linear-gradient(135deg, #d4af37, #c9a227);
          color: #0d0d14;
          border: none;
          border-radius: 8px;
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 0.5rem;
        }

        .sponsors-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .sponsors-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .form-success {
          text-align: center;
          padding: 2rem 1rem;
        }

        .form-success .success-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .form-success h3 {
          color: #d4af37;
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .form-success p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .sponsors-header {
            padding: 0.75rem 1rem;
          }

          .sponsors-nav {
            gap: 1rem;
            font-size: 0.85rem;
          }

          .sponsors-main {
            padding: 2rem 1rem;
          }

          .sponsors-hero h1 {
            font-size: 2rem;
          }

          .contact-section {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="sponsors-header">
        <div className="sponsors-brand">
          <a href="/" className="brand-logo">Q</a>
          <a href="/" className="brand-link">QUANTA</a>
          <span className="brand-separator">|</span>
          <span className="brand-page">Sponsors</span>
        </div>
        <nav className="sponsors-nav">
          <a href="/education">Education</a>
          <a href="/faq">FAQ</a>
          <a href="/resources">Resources</a>
          <a href="/pitch-lite">Overview</a>
          <a href="/contact">Contact</a>
          <a href="/" className="nav-join">Join</a>
        </nav>
      </header>

      <main className="sponsors-main">
        <div className="sponsors-hero">
          <h1>Enterprise & Sponsorship Partnerships</h1>
          <p>
            Partner with QUANTA to host branded tournaments, run custom miner pools,
            or become a tournament validator. Engage your audience with the future of
            decentralized alpha generation.
          </p>
        </div>

        <div className="value-props">
          <div className="value-card">
            <h3>Brand Visibility</h3>
            <p>
              Your brand associated with cutting-edge decentralized finance.
              Reach crypto-native audiences and quantitative finance professionals.
            </p>
          </div>
          <div className="value-card">
            <h3>Talent Discovery</h3>
            <p>
              Identify top-performing stock pickers and quant strategists.
              Direct pipeline to skilled traders and analysts.
            </p>
          </div>
          <div className="value-card">
            <h3>Custom Tournaments</h3>
            <p>
              Host branded competitions with custom rules, prize pools, and
              participant criteria tailored to your objectives.
            </p>
          </div>
        </div>

        <div className="sponsor-types">
          <h2>Partnership Models</h2>
          <div className="type-grid">
            <div className="type-card">
              <div className="type-label">Infrastructure</div>
              <h3>Tournament Validator</h3>
              <p>
                Run validation infrastructure for QUANTA tournaments. Earn TAO emissions
                while providing critical network services.
              </p>
              <ul>
                <li>41% of emission split to validators</li>
                <li>Hardware requirements: 4+ vCPUs, 16GB+ RAM</li>
                <li>Access to raw signal data for internal research</li>
                <li>Priority API access for enterprise integrations</li>
              </ul>
            </div>

            <div className="type-card">
              <div className="type-label">Aggregation</div>
              <h3>Custom Miner Pool</h3>
              <p>
                Operate a branded pool aggregating signals from your community,
                employees, or customer base.
              </p>
              <ul>
                <li>White-label pool interface with your branding</li>
                <li>10-20% operator fee on pool earnings</li>
                <li>Unlimited participant capacity</li>
                <li>Custom onboarding and compliance flows</li>
              </ul>
            </div>

            <div className="type-card">
              <div className="type-label">Competition</div>
              <h3>Tournament Sponsor</h3>
              <p>
                Sponsor themed tournaments with custom prize pools,
                participant criteria, and marketing integration.
              </p>
              <ul>
                <li>Branded tournament landing pages</li>
                <li>Custom scoring rules (sector-focused, ESG, etc.)</li>
                <li>Winner spotlights and case studies</li>
                <li>Joint PR and marketing opportunities</li>
              </ul>
            </div>

            <div className="type-card">
              <div className="type-label">Data</div>
              <h3>Signal API Enterprise</h3>
              <p>
                Enterprise access to aggregated QUANTA signals for research,
                trading desk integration, or product development.
              </p>
              <ul>
                <li>Real-time signal feeds via WebSocket</li>
                <li>Historical performance data and backtests</li>
                <li>Custom filtering and ranking endpoints</li>
                <li>Dedicated support and SLA guarantees</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="contact-section">
          <div className="contact-info-section">
            <h2>Why Partner with QUANTA?</h2>
            <p>
              QUANTA is building the world's largest decentralized stock picking
              competition on Bittensor. Our unique Signal Pool architecture enables
              unlimited participation while maintaining rigorous, risk-adjusted scoring.
            </p>
            <ul className="benefit-list">
              <li>
                <span className="check">+</span>
                <span>Access to $45T+ U.S. equity market alpha signals</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>Crypto-native payments and transparent on-chain scoring</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>Built on Bittensor's battle-tested consensus infrastructure</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>Portfolio-only model enables diverse participant types</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>Multi-horizon evaluation (7/30/90-day) for robust signals</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>Zero-to-high compute barrier accommodates all skill levels</span>
              </li>
            </ul>
          </div>

          <div className="contact-form-section">
            <h2>Start the Conversation</h2>
            {submitted ? (
              <div className="form-success">
                <div className="success-icon">+</div>
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
                      placeholder="Company or institution"
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
                    <option value="Multiple / Exploring">Multiple / Exploring Options</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tell us about your goals</label>
                  <textarea
                    id="message"
                    placeholder="What are you looking to achieve with a QUANTA partnership?"
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
      </main>
    </div>
  );
};

export default SponsorsPage;
