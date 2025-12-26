import React, { useState } from 'react';

const EducationPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    institution: '',
    role: '',
    interest: 'Curriculum Integration',
    studentCount: '',
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
          subject: `[Education] ${form.interest} - ${form.institution}`,
          message: `Institution: ${form.institution}\nRole: ${form.role}\nInterest: ${form.interest}\nEstimated Students: ${form.studentCount}\n\n${form.message}`
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitted(true);
      setForm({ name: '', email: '', institution: '', role: '', interest: 'Curriculum Integration', studentCount: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again or email us directly at info@qsub.net');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="education-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@200;300;400;500;600;700&display=swap');

        .education-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d0d14 0%, #151520 50%, #0d0d14 100%);
          color: #e8e6e3;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .education-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(52, 152, 219, 0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .education-header {
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

        .education-brand {
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

        .education-nav {
          display: flex;
          gap: 1.5rem;
        }

        .education-nav a {
          color: rgba(232, 230, 227, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .education-nav a:hover {
          color: #d4af37;
        }

        .education-nav a.nav-join {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0d0d14;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .education-nav a.nav-join:hover {
          color: #0d0d14;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .education-main {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          padding: 3rem 1.5rem 4rem;
        }

        .education-hero {
          text-align: center;
          margin-bottom: 3rem;
        }

        .education-hero h1 {
          font-size: 2.5rem;
          font-weight: 300;
          color: #d4af37;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }

        .education-hero p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto;
        }

        .use-cases {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .use-case-card {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .use-case-card h3 {
          color: #d4af37;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .use-case-card p {
          color: rgba(232, 230, 227, 0.75);
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .program-types {
          margin-bottom: 3rem;
        }

        .program-types h2 {
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

        .testimonial-section {
          background: rgba(26, 26, 46, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 3rem;
          text-align: center;
        }

        .testimonial-section h2 {
          color: #d4af37;
          font-size: 1.25rem;
          font-weight: 400;
          margin-bottom: 1rem;
        }

        .testimonial-section p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 1rem;
          line-height: 1.7;
          font-style: italic;
          max-width: 700px;
          margin: 0 auto;
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

        .education-form {
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

        .education-form input,
        .education-form select,
        .education-form textarea {
          background: rgba(13, 13, 20, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #e8e6e3;
          font-size: 0.95rem;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .education-form input:focus,
        .education-form select:focus,
        .education-form textarea:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .education-form input::placeholder,
        .education-form textarea::placeholder {
          color: rgba(232, 230, 227, 0.4);
        }

        .education-form select option {
          background: #1a1a2e;
          color: #e8e6e3;
        }

        .education-form textarea {
          min-height: 100px;
          resize: vertical;
        }

        .education-submit {
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

        .education-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .education-submit:disabled {
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
          .education-header {
            padding: 0.75rem 1rem;
          }

          .education-nav {
            gap: 1rem;
            font-size: 0.85rem;
          }

          .education-main {
            padding: 2rem 1rem;
          }

          .education-hero h1 {
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

      <header className="education-header">
        <div className="education-brand">
          <a href="/" className="brand-logo">Q</a>
          <a href="/" className="brand-link">QUANTA</a>
          <span className="brand-separator">|</span>
          <span className="brand-page">Education</span>
        </div>
        <nav className="education-nav">
          <a href="/sponsors">Sponsors</a>
          <a href="/faq">FAQ</a>
          <a href="/resources">Resources</a>
          <a href="/pitch-lite">Overview</a>
          <a href="/contact">Contact</a>
          <a href="/" className="nav-join">Join</a>
        </nav>
      </header>

      <main className="education-main">
        <div className="education-hero">
          <h1>QUANTA for Education</h1>
          <p>
            Bring real-world quantitative finance to your classroom. QUANTA provides
            universities and educational institutions with hands-on experience in
            portfolio management, risk analysis, and decentralized markets.
          </p>
        </div>

        <div className="use-cases">
          <div className="use-case-card">
            <h3>Real Market Experience</h3>
            <p>
              Students test investment theses against actual U.S. equity prices
              in a risk-free paper trading environment with real consequences.
            </p>
          </div>
          <div className="use-case-card">
            <h3>Quantitative Skills</h3>
            <p>
              Teach Sharpe ratios, Sortino, Calmar, and maximum drawdown through
              practical application rather than textbook examples.
            </p>
          </div>
          <div className="use-case-card">
            <h3>Blockchain Fundamentals</h3>
            <p>
              Introduce students to decentralized networks, consensus mechanisms,
              and token economics through hands-on participation.
            </p>
          </div>
        </div>

        <div className="program-types">
          <h2>Academic Programs</h2>
          <div className="type-grid">
            <div className="type-card">
              <div className="type-label">Classroom</div>
              <h3>Curriculum Integration</h3>
              <p>
                Incorporate QUANTA into existing finance, economics, or computer
                science courses as a practical lab component.
              </p>
              <ul>
                <li>Ready-to-use lesson plans and assignments</li>
                <li>Performance dashboards for grading</li>
                <li>Guest lectures from QUANTA team</li>
                <li>Academic pricing for institutional access</li>
              </ul>
            </div>

            <div className="type-card">
              <div className="type-label">Competition</div>
              <h3>Student Tournament</h3>
              <p>
                Host inter-university or intra-department competitions with
                custom prize pools and academic recognition.
              </p>
              <ul>
                <li>Branded competition landing page</li>
                <li>Semester-long or intensive formats</li>
                <li>Winner certificates and portfolio</li>
                <li>Recruiting partner introductions</li>
              </ul>
            </div>

            <div className="type-card">
              <div className="type-label">Research</div>
              <h3>Academic Consortium</h3>
              <p>
                Join our research consortium where universities contribute
                published strategies and access aggregate signal data.
              </p>
              <ul>
                <li>Contribute research-backed strategies</li>
                <li>Citation-weighted reward sharing</li>
                <li>Access to anonymized signal datasets</li>
                <li>Collaboration with other institutions</li>
              </ul>
            </div>

            <div className="type-card">
              <div className="type-label">Club</div>
              <h3>Investment Club Pool</h3>
              <p>
                Student investment clubs can operate as a QUANTA pool,
                aggregating member picks into consensus portfolios.
              </p>
              <ul>
                <li>Democratic voting on allocations</li>
                <li>Member performance attribution</li>
                <li>Earn real TAO/alpha rewards</li>
                <li>Build verifiable track records</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="testimonial-section">
          <h2>The Future of Finance Education</h2>
          <p>
            "Traditional stock market simulators reward luck and excessive risk-taking.
            QUANTA's risk-adjusted scoring teaches students what actually matters in
            professional portfolio management: consistency, risk control, and
            sustainable alpha generation."
          </p>
        </div>

        <div className="contact-section">
          <div className="contact-info-section">
            <h2>Why QUANTA for Education?</h2>
            <p>
              QUANTA bridges the gap between academic theory and industry practice.
              Our platform provides students with skills directly applicable to
              quantitative finance careers.
            </p>
            <ul className="benefit-list">
              <li>
                <span className="check">+</span>
                <span>Risk-adjusted scoring mirrors institutional standards</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>Multi-horizon evaluation teaches long-term thinking</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>No capital required - pure skill-based competition</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>Portable on-chain track records for job applications</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>Exposure to blockchain technology and tokenomics</span>
              </li>
              <li>
                <span className="check">+</span>
                <span>Connects students with industry practitioners</span>
              </li>
            </ul>
          </div>

          <div className="contact-form-section">
            <h2>Get Started</h2>
            {submitted ? (
              <div className="form-success">
                <div className="success-icon">+</div>
                <h3>Thank You!</h3>
                <p>We've received your inquiry and will be in touch within 1-2 business days to discuss how QUANTA can support your educational goals.</p>
              </div>
            ) : (
              <form className="education-form" onSubmit={handleSubmit}>
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
                      placeholder="you@university.edu"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="institution">Institution</label>
                    <input
                      id="institution"
                      type="text"
                      placeholder="University or school name"
                      value={form.institution}
                      onChange={(e) => setForm({...form, institution: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      id="role"
                      type="text"
                      placeholder="Professor, Administrator, etc."
                      value={form.role}
                      onChange={(e) => setForm({...form, role: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="interest">Primary Interest</label>
                    <select
                      id="interest"
                      value={form.interest}
                      onChange={(e) => setForm({...form, interest: e.target.value})}
                    >
                      <option value="Curriculum Integration">Curriculum Integration</option>
                      <option value="Student Tournament">Student Tournament</option>
                      <option value="Academic Consortium">Academic Research Consortium</option>
                      <option value="Investment Club">Investment Club Pool</option>
                      <option value="Multiple / Exploring">Multiple / Exploring Options</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentCount">Est. Student Participants</label>
                    <input
                      id="studentCount"
                      type="text"
                      placeholder="e.g., 50-100"
                      value={form.studentCount}
                      onChange={(e) => setForm({...form, studentCount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tell us about your program</label>
                  <textarea
                    id="message"
                    placeholder="What courses or programs are you considering QUANTA for?"
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    required
                  />
                </div>

                <button type="submit" className="education-submit" disabled={submitting}>
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

export default EducationPage;
