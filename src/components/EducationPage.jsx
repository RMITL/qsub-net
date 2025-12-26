import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';

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
  const [visibleSections, setVisibleSections] = useState(new Set());

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

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .education-page {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e8e6e3;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        /* Hero Section */
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
            radial-gradient(ellipse at 70% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 80%, rgba(52, 152, 219, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%);
        }

        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.02' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.8;
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

        .hero-badge span:first-child {
          font-size: 1rem;
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
          max-width: 650px;
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

        /* Why QUANTA Section */
        .why-section {
          padding: 8rem 2rem;
          background: linear-gradient(180deg, #0a0a0f 0%, #0d0d14 100%);
        }

        .why-container {
          max-width: 1200px;
          margin: 0 auto;
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

        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .why-card {
          position: relative;
          background: linear-gradient(180deg, rgba(26, 26, 46, 0.6) 0%, rgba(20, 20, 35, 0.4) 100%);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: center;
          overflow: hidden;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.6s ease-out;
        }

        .why-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .why-card:nth-child(1) { transition-delay: 0s; }
        .why-card:nth-child(2) { transition-delay: 0.15s; }
        .why-card:nth-child(3) { transition-delay: 0.3s; }

        .why-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .why-card:hover::before {
          opacity: 1;
        }

        .why-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-5px);
        }

        .why-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
          position: relative;
        }

        .why-card h3 {
          font-size: 1.35rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #e8e6e3;
        }

        .why-card p {
          color: rgba(232, 230, 227, 0.7);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        /* Comparison Section */
        .comparison-section {
          padding: 6rem 2rem;
          background: #0a0a0f;
        }

        .comparison-container {
          max-width: 900px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.6s ease-out;
        }

        .comparison-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .comparison-card {
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 25, 0.8) 100%);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 20px;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }

        .comparison-card::before {
          content: '"';
          position: absolute;
          top: 1rem;
          left: 2rem;
          font-size: 6rem;
          font-family: Georgia, serif;
          color: rgba(212, 175, 55, 0.1);
          line-height: 1;
        }

        .comparison-quote {
          font-size: 1.35rem;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(232, 230, 227, 0.9);
          margin-bottom: 1.5rem;
          position: relative;
        }

        .comparison-source {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .comparison-source .line {
          width: 40px;
          height: 2px;
          background: #d4af37;
        }

        .comparison-source span {
          color: #d4af37;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Programs Section */
        .programs-section {
          padding: 8rem 2rem;
          background: linear-gradient(180deg, #0a0a0f 0%, #0d0d14 100%);
        }

        .programs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .program-card {
          position: relative;
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(20, 20, 35, 0.7) 100%);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          overflow: hidden;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.6s ease-out;
        }

        .program-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .program-card:nth-child(1) { transition-delay: 0s; }
        .program-card:nth-child(2) { transition-delay: 0.1s; }
        .program-card:nth-child(3) { transition-delay: 0.2s; }
        .program-card:nth-child(4) { transition-delay: 0.3s; }

        .program-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #d4af37, #f4d03f);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.4s ease-out;
        }

        .program-card:hover::before {
          transform: scaleY(1);
        }

        .program-card:hover {
          border-color: rgba(212, 175, 55, 0.25);
        }

        .program-icon {
          width: 56px;
          height: 56px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .program-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #d4af37;
          margin-bottom: 0.5rem;
        }

        .program-title {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .program-desc {
          color: rgba(232, 230, 227, 0.7);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .program-features {
          list-style: none;
          display: grid;
          gap: 0.6rem;
        }

        .program-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: rgba(232, 230, 227, 0.8);
        }

        .program-features li::before {
          content: '+';
          color: #d4af37;
          font-weight: bold;
        }

        /* Stats Marquee */
        .stats-marquee {
          padding: 4rem 0;
          background: linear-gradient(180deg, #0d0d14 0%, #0a0a0f 100%);
          overflow: hidden;
        }

        .marquee-track {
          display: flex;
          animation: marquee 25s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-item {
          flex-shrink: 0;
          padding: 0 4rem;
          text-align: center;
        }

        .marquee-value {
          font-size: 3rem;
          font-weight: 200;
          font-family: 'Space Grotesk', sans-serif;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .marquee-label {
          font-size: 0.85rem;
          color: rgba(232, 230, 227, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* Contact Section */
        .contact-section {
          padding: 8rem 2rem;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
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
          line-height: 1.2;
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
          gap: 0.75rem;
        }

        .benefit-list li {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(26, 26, 46, 0.3);
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .benefit-list li:hover {
          background: rgba(212, 175, 55, 0.08);
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
          font-weight: bold;
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

        .education-form {
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

        .education-form input,
        .education-form select,
        .education-form textarea {
          background: rgba(10, 10, 15, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 0.875rem 1rem;
          color: #e8e6e3;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s;
        }

        .education-form input:focus,
        .education-form select:focus,
        .education-form textarea:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .education-form textarea {
          min-height: 120px;
          resize: vertical;
        }

        .education-form select option {
          background: #1a1a2e;
        }

        .education-submit {
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

        .education-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
        }

        .education-submit:disabled {
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
          .why-grid {
            grid-template-columns: 1fr;
          }

          .programs-grid {
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

          .section-title {
            font-size: 1.75rem;
          }

          .why-card {
            padding: 2rem 1.5rem;
          }

          .comparison-card {
            padding: 2rem;
          }

          .comparison-quote {
            font-size: 1.1rem;
          }

          .contact-form-card {
            padding: 1.5rem;
          }

          .marquee-value {
            font-size: 2rem;
          }
        }
      `}</style>

      <Header currentPage="Education" variant="fixed" />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>&#127891;</span>
          <span>Academic Partnerships</span>
        </div>
        <h1 className="hero-title">
          The Future of<br />
          <span className="highlight">Finance Education</span>
        </h1>
        <p className="hero-subtitle">
          Bring real-world quantitative finance to your classroom. QUANTA provides
          hands-on experience in portfolio management, risk analysis, and decentralized markets.
        </p>
        <div className="hero-cta">
          <a href="#contact" className="cta-primary">Partner With Us</a>
          <a href="/pitch-lite" className="cta-secondary">Learn About QUANTA</a>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </section>

      {/* Why QUANTA */}
      <section className="why-section" id="why" data-animate>
        <div className="why-container">
          <div className={`section-header ${isVisible('why') ? 'visible' : ''}`}>
            <div className="section-overline">Why QUANTA</div>
            <h2 className="section-title">Real Skills, Real Markets</h2>
            <p className="section-subtitle">
              Move beyond theoretical exercises. Students compete with real market prices
              and learn the metrics that matter in professional portfolio management.
            </p>
          </div>

          <div className="why-grid">
            <div className={`why-card ${isVisible('why') ? 'visible' : ''}`}>
              <div className="why-icon">&#128200;</div>
              <h3>Real Market Prices</h3>
              <p>
                Paper trade against actual U.S. equity and ETF prices.
                No simulated data or artificial market conditions.
              </p>
            </div>

            <div className={`why-card ${isVisible('why') ? 'visible' : ''}`}>
              <div className="why-icon">&#128202;</div>
              <h3>Risk-Adjusted Scoring</h3>
              <p>
                Learn Sharpe, Sortino, Calmar ratios and max drawdown
                through practical application, not textbook formulas.
              </p>
            </div>

            <div className={`why-card ${isVisible('why') ? 'visible' : ''}`}>
              <div className="why-icon">&#9939;</div>
              <h3>Blockchain Literacy</h3>
              <p>
                Hands-on experience with decentralized networks,
                consensus mechanisms, and token economics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Quote */}
      <section className="comparison-section" id="comparison" data-animate>
        <div className={`comparison-container ${isVisible('comparison') ? 'visible' : ''}`}>
          <div className="comparison-card">
            <p className="comparison-quote">
              Traditional stock market simulators reward whoever takes the most risk and gets lucky.
              QUANTA's risk-adjusted scoring teaches students what actually matters in professional
              portfolio management: consistency, risk control, and sustainable alpha generation.
            </p>
            <div className="comparison-source">
              <div className="line"></div>
              <span>The QUANTA Approach</span>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="programs-section" id="programs" data-animate>
        <div className={`section-header ${isVisible('programs') ? 'visible' : ''}`}>
          <div className="section-overline">Academic Programs</div>
          <h2 className="section-title">Flexible Integration Options</h2>
          <p className="section-subtitle">
            From semester-long courses to one-off competitions,
            we'll work with you to design the right program.
          </p>
        </div>

        <div className="programs-grid">
          <div className={`program-card ${isVisible('programs') ? 'visible' : ''}`}>
            <div className="program-icon">&#128218;</div>
            <div className="program-label">Classroom</div>
            <h3 className="program-title">Curriculum Integration</h3>
            <p className="program-desc">
              Incorporate QUANTA into finance, economics, or computer science
              courses as a practical lab component.
            </p>
            <ul className="program-features">
              <li>Ready-to-use lesson plans</li>
              <li>Performance dashboards for grading</li>
              <li>Guest lectures from QUANTA team</li>
              <li>Academic pricing</li>
            </ul>
          </div>

          <div className={`program-card ${isVisible('programs') ? 'visible' : ''}`}>
            <div className="program-icon">&#127942;</div>
            <div className="program-label">Competition</div>
            <h3 className="program-title">Student Tournament</h3>
            <p className="program-desc">
              Host inter-university or intra-department competitions with
              custom prize pools and academic recognition.
            </p>
            <ul className="program-features">
              <li>Branded competition pages</li>
              <li>Semester or intensive formats</li>
              <li>Winner certificates & portfolio</li>
              <li>Recruiting partner intros</li>
            </ul>
          </div>

          <div className={`program-card ${isVisible('programs') ? 'visible' : ''}`}>
            <div className="program-icon">&#128300;</div>
            <div className="program-label">Research</div>
            <h3 className="program-title">Academic Consortium</h3>
            <p className="program-desc">
              Join our research consortium where universities contribute
              strategies and access aggregate signal data.
            </p>
            <ul className="program-features">
              <li>Contribute research strategies</li>
              <li>Citation-weighted rewards</li>
              <li>Access to signal datasets</li>
              <li>Multi-institution collaboration</li>
            </ul>
          </div>

          <div className={`program-card ${isVisible('programs') ? 'visible' : ''}`}>
            <div className="program-icon">&#128101;</div>
            <div className="program-label">Club</div>
            <h3 className="program-title">Investment Club Pool</h3>
            <p className="program-desc">
              Student investment clubs can operate as a QUANTA pool,
              aggregating member picks into consensus portfolios.
            </p>
            <ul className="program-features">
              <li>Democratic voting on picks</li>
              <li>Member performance tracking</li>
              <li>Earn real crypto rewards</li>
              <li>Build verifiable track records</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Marquee */}
      <section className="stats-marquee">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="marquee-item">
                <div className="marquee-value">$0</div>
                <div className="marquee-label">Capital Required</div>
              </div>
              <div className="marquee-item">
                <div className="marquee-value">7/30/90</div>
                <div className="marquee-label">Day Horizons</div>
              </div>
              <div className="marquee-item">
                <div className="marquee-value">6</div>
                <div className="marquee-label">Risk Metrics</div>
              </div>
              <div className="marquee-item">
                <div className="marquee-value">&#8734;</div>
                <div className="marquee-label">Participants</div>
              </div>
              <div className="marquee-item">
                <div className="marquee-value">On-Chain</div>
                <div className="marquee-label">Track Records</div>
              </div>
              <div className="marquee-item">
                <div className="marquee-value">Real</div>
                <div className="marquee-label">Market Prices</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section" id="contact" data-animate>
        <div className={`contact-container ${isVisible('contact') ? 'visible' : ''}`}>
          <div className="contact-info">
            <h2>Bring <span className="highlight">QUANTA</span> to Your Institution</h2>
            <p>
              Our team will work with you to design a program that fits your
              curriculum, timeline, and educational objectives.
            </p>
            <ul className="benefit-list">
              <li>
                <span className="icon">+</span>
                <span>Risk-adjusted scoring mirrors industry standards</span>
              </li>
              <li>
                <span className="icon">+</span>
                <span>No capital required - pure skill competition</span>
              </li>
              <li>
                <span className="icon">+</span>
                <span>Portable on-chain track records for resumes</span>
              </li>
              <li>
                <span className="icon">+</span>
                <span>Connect students with industry practitioners</span>
              </li>
            </ul>
          </div>

          <div className="contact-form-card">
            <h3>Get Started</h3>
            {submitted ? (
              <div className="form-success">
                <div className="icon">+</div>
                <h3>Thank You!</h3>
                <p>We'll be in touch within 1-2 business days to discuss your program.</p>
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
                      placeholder="University name"
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
                      placeholder="Professor, Admin, etc."
                      value={form.role}
                      onChange={(e) => setForm({...form, role: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="interest">Program Type</label>
                    <select
                      id="interest"
                      value={form.interest}
                      onChange={(e) => setForm({...form, interest: e.target.value})}
                    >
                      <option value="Curriculum Integration">Curriculum Integration</option>
                      <option value="Student Tournament">Student Tournament</option>
                      <option value="Academic Consortium">Research Consortium</option>
                      <option value="Investment Club">Investment Club Pool</option>
                      <option value="Multiple / Exploring">Exploring Options</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentCount">Est. Participants</label>
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
                    placeholder="What courses or programs are you considering?"
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
      </section>
    </div>
  );
};

export default EducationPage;
