import React, { useState, useRef, useEffect } from 'react';

/**
 * Shared Header component for FAQ, Resources, Contact, Sponsors, Education pages
 *
 * Props:
 * - currentPage: string - The current page name to display after "QUANTA |"
 * - variant: 'sticky' | 'fixed' - Position behavior (default: 'sticky')
 * - showPageInDropdowns: boolean - If true, page-specific dropdowns are shown (e.g., FAQ sections)
 * - pageDropdowns: array - Custom dropdowns for the page (e.g., FAQ sections, Glossary categories)
 * - onDropdownClick: function - Callback when a dropdown item is clicked
 */
const Header = ({
  currentPage = '',
  variant = 'sticky',
  pageDropdowns = [],
  onDropdownClick = () => {}
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const contactDropdownRef = useRef(null);
  const dropdownRefs = useRef({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target)) {
        setContactDropdownOpen(false);
      }
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          if (activeDropdown === key) {
            setActiveDropdown(null);
          }
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const contactSublinks = [
    { href: '/contact', label: 'General Inquiry' },
    { href: '/sponsors', label: 'Enterprise & Sponsors' },
    { href: '/education', label: 'Education & Academic' }
  ];

  const isContactPage = ['Contact', 'Sponsors', 'Education'].includes(currentPage);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@200;300;400;500;600;700&display=swap');

        .unified-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          padding: 0 2rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          z-index: 100;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .unified-header.sticky {
          position: sticky;
          top: 0;
        }

        .unified-header.fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-brand-logo {
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

        .header-brand-link {
          font-size: 1.25rem;
          font-weight: 700;
          color: #d4af37;
          text-decoration: none;
          letter-spacing: 0.1em;
          font-family: 'Space Grotesk', sans-serif;
        }

        .header-brand-separator {
          color: rgba(212, 175, 55, 0.3);
        }

        .header-brand-page {
          color: rgba(232, 230, 227, 0.7);
          font-size: 0.9rem;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .header-nav > a {
          color: rgba(232, 230, 227, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .header-nav > a:hover {
          color: #d4af37;
        }

        .header-nav > a.nav-join {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0d0d14;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .header-nav > a.nav-join:hover {
          color: #0d0d14;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .header-dropdown {
          position: relative;
        }

        .header-dropdown-trigger {
          background: none;
          border: none;
          color: rgba(232, 230, 227, 0.7);
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-family: 'Outfit', sans-serif;
          padding: 0;
          transition: color 0.2s;
        }

        .header-dropdown-trigger:hover,
        .header-dropdown-trigger.active {
          color: #d4af37;
        }

        .dropdown-arrow {
          font-size: 0.75rem;
          transition: transform 0.2s;
        }

        .header-dropdown-trigger.active .dropdown-arrow {
          transform: rotate(180deg);
        }

        .header-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(20, 20, 30, 0.98);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 0.5rem 0;
          min-width: 180px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          z-index: 200;
        }

        .header-dropdown-menu a {
          display: block;
          padding: 0.6rem 1rem;
          color: rgba(232, 230, 227, 0.8);
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.15s;
        }

        .header-dropdown-menu a:hover {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
        }

        .header-dropdown-menu a.current-page {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.05);
        }

        .header-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 28px;
          height: 28px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .hamburger-line {
          width: 100%;
          height: 2px;
          background: #d4af37;
          transition: all 0.3s ease;
        }

        .hamburger-line.open:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger-line.open:nth-child(2) {
          opacity: 0;
        }

        .hamburger-line.open:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .header-mobile-menu {
          display: none;
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background: rgba(13, 13, 20, 0.98);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          padding: 1rem;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 99;
          backdrop-filter: blur(20px);
        }

        .header-mobile-menu.open {
          display: flex;
        }

        .header-mobile-menu a {
          color: rgba(232, 230, 227, 0.8);
          text-decoration: none;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          transition: all 0.2s;
          font-size: 0.95rem;
        }

        .header-mobile-menu a:hover {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
        }

        .header-mobile-menu a.mobile-join {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0d0d14;
          font-weight: 600;
          text-align: center;
          margin-top: 0.5rem;
        }

        .mobile-submenu-label {
          color: rgba(212, 175, 55, 0.6);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.5rem 1rem 0.25rem;
          margin-top: 0.5rem;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }

        .mobile-submenu a {
          padding-left: 1.5rem;
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .header-nav {
            display: none;
          }

          .header-hamburger {
            display: flex;
          }

          .unified-header {
            padding: 0 1rem;
          }
        }
      `}</style>

      <header className={`unified-header ${variant}`}>
        <div className="header-brand">
          <a href="/" className="header-brand-logo">Q</a>
          <a href="/" className="header-brand-link">QUANTA</a>
          {currentPage && (
            <>
              <span className="header-brand-separator">|</span>
              <span className="header-brand-page">{currentPage}</span>
            </>
          )}
        </div>

        <nav className="header-nav">
          {/* Page-specific dropdowns */}
          {pageDropdowns.map((dropdown, idx) => (
            <div
              key={dropdown.label}
              className="header-dropdown"
              ref={el => dropdownRefs.current[dropdown.label] = el}
            >
              <button
                className={`header-dropdown-trigger ${activeDropdown === dropdown.label ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === dropdown.label ? null : dropdown.label)}
                onMouseEnter={() => setActiveDropdown(dropdown.label)}
              >
                {dropdown.label} <span className="dropdown-arrow">▾</span>
              </button>
              {activeDropdown === dropdown.label && (
                <div
                  className="header-dropdown-menu"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {dropdown.items.map(item => (
                    <a
                      key={item.id || item.label}
                      href={item.href || `#${item.id}`}
                      onClick={(e) => {
                        if (item.id) {
                          e.preventDefault();
                          onDropdownClick(item);
                          setActiveDropdown(null);
                        }
                      }}
                    >
                      {item.label || item.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <a href="/faq">FAQ</a>
          <a href="/resources">Resources</a>
          <a href="/pitch-lite">Overview</a>

          {/* Contact dropdown */}
          <div className="header-dropdown" ref={contactDropdownRef}>
            <button
              className={`header-dropdown-trigger ${contactDropdownOpen ? 'active' : ''}`}
              onClick={() => setContactDropdownOpen(!contactDropdownOpen)}
              onMouseEnter={() => setContactDropdownOpen(true)}
            >
              Contact <span className="dropdown-arrow">▾</span>
            </button>
            {contactDropdownOpen && (
              <div
                className="header-dropdown-menu"
                onMouseLeave={() => setContactDropdownOpen(false)}
              >
                {contactSublinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={link.label.includes(currentPage) ||
                      (currentPage === 'Contact' && link.href === '/contact') ||
                      (currentPage === 'Sponsors' && link.href === '/sponsors') ||
                      (currentPage === 'Education' && link.href === '/education')
                      ? 'current-page' : ''}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="/" className="nav-join">Join</a>
        </nav>

        <button
          className="header-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </header>

      <nav className={`header-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Page-specific links for mobile */}
        {pageDropdowns.length > 0 && pageDropdowns.map(dropdown => (
          <React.Fragment key={dropdown.label}>
            <div className="mobile-submenu-label">{dropdown.label}</div>
            <div className="mobile-submenu">
              {dropdown.items.slice(0, 4).map(item => (
                <a
                  key={item.id || item.label}
                  href={item.href || `#${item.id}`}
                  onClick={(e) => {
                    if (item.id) {
                      e.preventDefault();
                      onDropdownClick(item);
                    }
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.label || item.title}
                </a>
              ))}
            </div>
          </React.Fragment>
        ))}

        <a href="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
        <a href="/resources" onClick={() => setMobileMenuOpen(false)}>Resources</a>
        <a href="/pitch-lite" onClick={() => setMobileMenuOpen(false)}>Overview</a>

        <div className="mobile-submenu-label">Contact</div>
        <div className="mobile-submenu">
          {contactSublinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a href="/" onClick={() => setMobileMenuOpen(false)} className="mobile-join">Join QUANTA</a>
      </nav>
    </>
  );
};

export default Header;
