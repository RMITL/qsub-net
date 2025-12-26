import React, { useState } from 'react';

const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
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
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitted(true);
      setForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again or email us directly at info@qsub.net');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@200;300;400;500;600;700&display=swap');

        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d0d14 0%, #151520 50%, #0d0d14 100%);
          color: #e8e6e3;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .contact-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(52, 152, 219, 0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .contact-header {
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

        .contact-brand {
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

        .contact-nav {
          display: flex;
          gap: 1.5rem;
        }

        .contact-nav a {
          color: rgba(232, 230, 227, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .contact-nav a:hover {
          color: #d4af37;
        }

        .contact-nav a.nav-join {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0d0d14;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .contact-nav a.nav-join:hover {
          color: #0d0d14;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .contact-main {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
        }

        .contact-intro {
          text-align: center;
          margin-bottom: 3rem;
        }

        .contact-intro h1 {
          font-size: 2.5rem;
          font-weight: 300;
          color: #d4af37;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }

        .contact-intro p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .contact-card {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
          padding: 2rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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

        .contact-form input,
        .contact-form select,
        .contact-form textarea {
          background: rgba(13, 13, 20, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 0.875rem 1rem;
          color: #e8e6e3;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .contact-form input:focus,
        .contact-form select:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: rgba(232, 230, 227, 0.4);
        }

        .contact-form select {
          cursor: pointer;
        }

        .contact-form select option {
          background: #1a1a2e;
          color: #e8e6e3;
        }

        .contact-form textarea {
          min-height: 150px;
          resize: vertical;
        }

        .contact-submit {
          background: linear-gradient(135deg, #d4af37, #c9a227);
          color: #0d0d14;
          border: none;
          border-radius: 8px;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 0.5rem;
        }

        .contact-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .contact-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .contact-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .contact-success {
          text-align: center;
          padding: 2rem;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .contact-success h2 {
          color: #d4af37;
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .contact-success p {
          color: rgba(232, 230, 227, 0.7);
          margin-bottom: 1.5rem;
        }

        .contact-info {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212, 175, 55, 0.15);
        }

        .contact-info h3 {
          color: #d4af37;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-method {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(232, 230, 227, 0.8);
          font-size: 0.95rem;
        }

        .contact-method a {
          color: #d4af37;
          text-decoration: none;
        }

        .contact-method a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .contact-header {
            padding: 0.75rem 1rem;
          }

          .contact-nav {
            gap: 1rem;
          }

          .contact-main {
            padding: 2rem 1rem;
          }

          .contact-intro h1 {
            font-size: 2rem;
          }

          .contact-card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <header className="contact-header">
        <div className="contact-brand">
          <a href="/" className="brand-logo">Q</a>
          <a href="/" className="brand-link">QUANTA</a>
          <span className="brand-separator">|</span>
          <span className="brand-page">Contact</span>
        </div>
        <nav className="contact-nav">
          <a href="/faq">FAQ</a>
          <a href="/resources">Resources</a>
          <a href="/pitch-lite">Overview</a>
          <a href="/pitch">Deck</a>
          <a href="/" className="nav-join">Join</a>
        </nav>
      </header>

      <main className="contact-main">
        <div className="contact-intro">
          <h1>Get in Touch</h1>
          <p>Have questions about QUANTA? Interested in partnerships or investment opportunities? We'd love to hear from you.</p>
        </div>

        <div className="contact-card">
          {submitted ? (
            <div className="contact-success">
              <div className="success-icon">✓</div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
              <button
                className="contact-submit"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {error && <div className="contact-error">{error}</div>}

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
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm({...form, subject: e.target.value})}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Investment Inquiry">Investment Inquiry</option>
                  <option value="Partnership Opportunity">Partnership Opportunity</option>
                  <option value="Technical Questions">Technical Questions</option>
                  <option value="Mining/Validation">Mining / Validation</option>
                  <option value="Press/Media">Press / Media</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="contact-submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}

          <div className="contact-info">
            <h3>Other Ways to Reach Us</h3>
            <div className="contact-methods">
              <div className="contact-method">
                <span>📧</span>
                <a href="mailto:info@qsub.net">info@qsub.net</a>
              </div>
              <div className="contact-method">
                <span>💬</span>
                <a href="https://discord.com/users/qsubnet" target="_blank" rel="noopener noreferrer">Discord</a>
              </div>
              <div className="contact-method">
                <span>✈️</span>
                <a href="https://t.me/qsubnet" target="_blank" rel="noopener noreferrer">Telegram</a>
              </div>
              <div className="contact-method">
                <span>🐦</span>
                <a href="https://x.com/qsub_net" target="_blank" rel="noopener noreferrer">X / Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactForm;
