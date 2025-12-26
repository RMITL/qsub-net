import React, { useState } from 'react';

const QuantaResources = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const resourceSections = [
    {
      title: 'Presentations',
      description: 'Learn about QUANTA through our interactive decks',
      items: [
        { name: 'Pitch Deck', href: '/pitch', description: 'Full 25-slide investor presentation with interactive tokenomics model' },
        { name: 'Overview Deck', href: '/pitch-lite', description: 'Simplified overview for quick understanding' },
        { name: 'Interactive Litepaper', href: '/litepaper', description: 'Deep dive into QUANTA\'s architecture and mechanics' }
      ]
    },
    {
      title: 'Documentation',
      description: 'Technical specifications and guides',
      items: [
        { name: 'Technical Whitepaper (PDF)', href: '/docs/QUANTA_Technical_Specification_v5.pdf', description: 'Complete technical specification v5', external: true },
        { name: 'Subnet Documentation', href: 'https://docs.qsub.net', description: 'Mintlify-powered developer docs', external: true },
        { name: 'FAQs & Glossary', href: '/faq', description: 'Frequently asked questions and terminology guide' }
      ]
    },
    {
      title: 'Tools & Demos',
      description: 'Try out QUANTA features',
      items: [
        { name: 'Testnet Monitor', href: 'https://dash.qsub.net', description: 'Live testnet dashboard and network status', external: true, badge: 'Testnet' },
        { name: 'Localnet Prototype', href: '/dash', description: 'Preview the miner/validator dashboard interface' },
        { name: 'GitHub Repository', href: '#', description: 'Source code (Coming Soon)', badge: 'Soon' }
      ]
    },
    {
      title: 'Get Started',
      description: 'Join the QUANTA network',
      items: [
        { name: 'Join QUANTA Team', href: '/', description: 'Sign up for early access and updates' },
        { name: 'Contact Us', href: '/contact', description: 'Get in touch with the QUANTA team' }
      ]
    }
  ];

  return (
    <div className="resources-container">
      <header className="resources-header">
        <div className="resources-brand">
          <a href="/" className="brand-logo">Q</a>
          <a href="/" className="brand-link">QUANTA</a>
          <span className="brand-separator">|</span>
          <span className="brand-page">Resources</span>
        </div>
        <nav className="resources-nav">
          <a href="/faq">FAQ</a>
          <a href="/pitch-lite">Overview</a>
          <a href="/pitch">Deck</a>
          <a href="/contact">Contact</a>
        </nav>
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </header>

      {mobileMenuOpen && (
        <nav className="mobile-menu">
          <a href="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
          <a href="/pitch-lite" onClick={() => setMobileMenuOpen(false)}>Overview</a>
          <a href="/pitch" onClick={() => setMobileMenuOpen(false)}>Deck</a>
          <a href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>
      )}

      <main className="resources-main">
        <div className="resources-intro">
          <h1>QUANTA Resources</h1>
          <p>Everything you need to learn about, contribute to, and participate in the QUANTA network</p>
        </div>

        {/* Resource Sections - 2 column grid */}
        <div className="resource-sections">
          {resourceSections.map((section) => (
            <section key={section.title} className="resource-section">
              <div className="section-header">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <div className="resource-list">
                {section.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="resource-card"
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                  >
                    <div className="resource-card-content">
                      <div className="resource-name">
                        {item.name}
                        {item.badge && <span className="resource-badge">{item.badge}</span>}
                        {item.external && (
                          <svg className="external-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        )}
                      </div>
                      <p className="resource-description">{item.description}</p>
                    </div>
                    <div className="resource-arrow">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="resources-footer">
          <div className="footer-cta">
            <p>Ready to start generating alpha?</p>
            <a href="/contact" className="cta-button">Contact Us</a>
          </div>
          <div className="footer-links">
            <a href="mailto:info@qsub.net">info@qsub.net</a>
            <span className="footer-separator">|</span>
            <a href="/pitch">Pitch Deck</a>
            <span className="footer-separator">|</span>
            <a href="/faq">FAQ</a>
          </div>
          <div className="social-links">
            <a href="mailto:info@qsub.net" title="Email" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://qsub.net" title="Website" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </a>
            <a href="/docs/QUANTA_Technical_Specification_v5.pdf" title="Whitepaper" className="social-icon" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            </a>
            <a href="https://t.me/qsubnet" title="Telegram" className="social-icon" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="https://x.com/qsub_net" title="X (Twitter)" className="social-icon" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" title="GitHub (Coming Soon)" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://discord.com/users/qsubnet" title="Discord" className="social-icon" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href="https://www.reddit.com/user/qsubnet/" title="Reddit" className="social-icon" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
            </a>
          </div>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@200;300;400;500;600;700&display=swap');

        .resources-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
          color: #e8e6e3;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .resources-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          background: rgba(10, 10, 15, 0.9);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .resources-brand {
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
          color: rgba(212, 175, 55, 0.4);
        }

        .brand-page {
          color: rgba(232, 230, 227, 0.7);
          font-size: 0.9rem;
          letter-spacing: 0.05em;
        }

        .resources-nav {
          display: flex;
          gap: 1.5rem;
        }

        .resources-nav a {
          color: rgba(232, 230, 227, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .resources-nav a:hover {
          color: #d4af37;
        }

        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .hamburger-line {
          display: block;
          width: 100%;
          height: 2px;
          background: #d4af37;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
        }

        .hamburger-line.open:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .hamburger-line.open:nth-child(2) {
          opacity: 0;
        }

        .hamburger-line.open:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          position: fixed;
          top: 52px;
          left: 0;
          right: 0;
          background: rgba(10, 10, 15, 0.98);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          padding: 1rem;
          z-index: 99;
        }

        .mobile-menu a {
          color: rgba(232, 230, 227, 0.9);
          text-decoration: none;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          transition: color 0.2s, background 0.2s;
        }

        .mobile-menu a:last-child {
          border-bottom: none;
        }

        .mobile-menu a:hover {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.05);
        }

        .resources-main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .resources-intro {
          text-align: center;
          margin-bottom: 3rem;
        }

        .resources-intro h1 {
          font-size: 2.5rem;
          font-weight: 300;
          color: #d4af37;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
          font-family: 'Space Grotesk', sans-serif;
        }

        .resources-intro p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 1.1rem;
        }

        /* Resource Sections - 2 column grid */
        .resource-sections {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .resource-section {
          background: rgba(26, 26, 46, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .section-header {
          margin-bottom: 1.25rem;
        }

        .section-header h2 {
          color: #d4af37;
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .section-header p {
          color: rgba(232, 230, 227, 0.6);
          font-size: 0.85rem;
          margin: 0;
        }

        .resource-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .resource-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1rem;
          background: rgba(10, 10, 15, 0.4);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .resource-card:hover {
          border-color: rgba(212, 175, 55, 0.4);
          background: rgba(212, 175, 55, 0.03);
        }

        .resource-card-content {
          flex: 1;
        }

        .resource-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #e8e6e3;
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 0.2rem;
        }

        .resource-badge {
          font-size: 0.6rem;
          padding: 0.1rem 0.4rem;
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .external-icon {
          opacity: 0.5;
        }

        .resource-description {
          color: rgba(232, 230, 227, 0.6);
          font-size: 0.8rem;
          margin: 0;
        }

        .resource-arrow {
          color: rgba(212, 175, 55, 0.4);
          transition: all 0.2s;
          margin-left: 0.75rem;
        }

        .resource-card:hover .resource-arrow {
          color: #d4af37;
          transform: translateX(4px);
        }

        /* Footer */
        .resources-footer {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          text-align: center;
        }

        .footer-cta {
          margin-bottom: 2rem;
        }

        .footer-cta p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .cta-button {
          display: inline-block;
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0d0d14;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .footer-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .footer-links a {
          color: rgba(232, 230, 227, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #d4af37;
        }

        .footer-separator {
          color: rgba(212, 175, 55, 0.3);
        }

        /* Social Links - small circular buttons */
        .social-links {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: rgba(232, 230, 227, 0.6);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .social-icon:hover {
          color: #d4af37;
          border-color: #d4af37;
          transform: translateY(-2px);
        }

        .social-icon svg {
          width: 18px;
          height: 18px;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .resource-sections {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .resources-header {
            padding: 0.75rem 1rem;
          }

          .resources-nav {
            display: none;
          }

          .hamburger-btn {
            display: flex;
          }

          .mobile-menu {
            display: flex;
          }

          .resources-intro h1 {
            font-size: 1.75rem;
          }

          .resources-intro p {
            font-size: 0.95rem;
          }

          .resource-section {
            padding: 1.25rem 1rem;
          }

          .resource-card {
            padding: 0.75rem 0.875rem;
          }

          .resource-name {
            font-size: 0.9rem;
          }

          .resource-description {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuantaResources;
