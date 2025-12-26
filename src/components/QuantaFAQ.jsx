import React, { useState, useRef, useEffect } from 'react';

const QuantaFAQ = () => {
  const [openSection, setOpenSection] = useState('basics');
  const [openQuestions, setOpenQuestions] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqDropdownOpen, setFaqDropdownOpen] = useState(false);
  const [glossaryDropdownOpen, setGlossaryDropdownOpen] = useState(false);
  const faqDropdownRef = useRef(null);
  const glossaryDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (faqDropdownRef.current && !faqDropdownRef.current.contains(event.target)) {
        setFaqDropdownOpen(false);
      }
      if (glossaryDropdownRef.current && !glossaryDropdownRef.current.contains(event.target)) {
        setGlossaryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const toggleQuestion = (questionId) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const sections = [
    {
      id: 'basics',
      title: 'The Basics',
      questions: [
        {
          id: 'why-subnet',
          q: 'Why is a subnet necessary for QUANTA?',
          a: 'Subnets provide the decentralized infrastructure QUANTA needs: trustless validation (no single entity controls scoring), censorship resistance (anyone can participate globally), transparent incentives (rewards distributed by code, not committees), and crypto-native payments (instant, borderless compensation). Building on Bittensor means QUANTA inherits battle-tested consensus mechanisms rather than building from scratch.'
        },
        {
          id: 'why-bittensor',
          q: 'Why is Bittensor an ideal fit for QUANTA?',
          a: 'Bittensor was designed for exactly this: incentivizing valuable intelligence. Its dTAO mechanism rewards subnets that produce useful outputs, validators reach consensus on quality scores, emissions scale with performance, and the existing ecosystem provides liquidity and staking infrastructure. QUANTA\'s stock-picking signals fit naturally as "valuable intelligence" that Bittensor rewards.'
        },
        {
          id: 'why-emissions',
          q: 'Why are emissions necessary?',
          a: 'Emissions bootstrap the network before external revenue kicks in. They compensate validators for infrastructure costs (market data feeds, compute), reward early miners taking risk on an unproven system, and fund ongoing development. As QUANTA matures, external revenue (API subscriptions, licensing) will supplement and eventually exceed emissions—but emissions provide the initial runway.'
        },
        {
          id: 'vs-school-game',
          q: 'How does this compare to the stock trading game I played in economics class?',
          a: 'Those games reward whoever takes the most risk and gets lucky. QUANTA is fundamentally different: we score risk-adjusted returns using six metrics (Sharpe ratio primary at 40%, plus P/L, max drawdown, Sortino, Calmar, and turnover). A portfolio up 50% with massive volatility loses to one up 20% with steady growth. We penalize drawdowns, reward consistency across multiple time horizons, and require skin-in-the-game via staking. It\'s closer to how professional fund managers are evaluated.'
        },
        {
          id: 'how-validation-works',
          q: 'How do miners and validators authenticate portfolios?',
          a: 'Miners submit portfolio signals (ticker-weight pairs) via a commit-reveal protocol: first a hash commitment, then the actual portfolio after a delay. Validators independently fetch real market prices from licensed data providers (Polygon, Tiingo), compute paper-trading P&L for each portfolio, calculate risk metrics (Sharpe, Sortino, drawdown), and reach consensus on scores using Yuma Consensus. No actual trades occur—it\'s all simulated using real prices.'
        },
        {
          id: 'contact',
          q: 'How do I contact your team?',
          a: <>Email us at <a href="mailto:info@qsub.net" style={{color: '#d4af37'}}>info@qsub.net</a> or use the <a href="/contact" style={{color: '#d4af37'}}>contact form</a>. We're also active on Discord and Twitter for community discussions.</>
        }
      ]
    },
    {
      id: 'overview',
      title: 'General Overview',
      questions: [
        {
          id: 'what-is-quanta',
          q: 'What is QUANTA?',
          a: 'QUANTA is a decentralized Bittensor subnet for portfolio-based alpha signal generation in U.S. equities. Participants submit JSON-formatted portfolio signals (ticker-weight pairs summing to 100%) that validators evaluate using a paper trading engine across rolling 7, 30, and 90-day horizons. Top performers earn TAO and α-token rewards.'
        },
        {
          id: 'what-problem',
          q: 'What problem does it solve?',
          a: 'QUANTA addresses access barriers (the $45T market is dominated by hedge funds), misaligned incentives (traditional prop firms profit when traders fail), untapped global talent (skilled traders have no way to prove ability without institutional backing), and inefficient competition structures (traditional contests reward reckless gambling over risk-adjusted returns).'
        },
        {
          id: 'vs-hedge-fund',
          q: 'How is QUANTA different from a hedge fund?',
          a: 'QUANTA is a protocol, not a fund. Unlike Numerai (which operates a registered hedge fund), QUANTA has no single fund entity, lets miners own their track records, allows signals to flow to any downstream consumer, operates entirely on-chain with transparent scoring, and enables unlimited participation.'
        }
      ]
    },
    {
      id: 'participation',
      title: 'Participation & Signals',
      questions: [
        {
          id: 'what-submit',
          q: 'What do I submit as a miner?',
          a: 'A simple JSON payload containing U.S. equity/ETF tickers and weights that sum to 100%. Example: {"AAPL": 100} (single stock) or {"AAPL": 25, "GOOGL": 20, "MSFT": 15, "AMZN": 15, "NVDA": 10, "META": 10, "TSLA": 5} (diversified). Any strategy is valid—single stock conviction, broad ETF, concentrated sector bet. No code execution, ML models, or GPUs required.'
        },
        {
          id: 'technical-skills',
          q: 'Do I need technical skills?',
          a: 'No. QUANTA\'s portfolio-only model enables participation from retail stock pickers (web GUI), finance professionals (Excel add-on), quant researchers (Python API), and LLM/Agent systems. The same JSON format is accepted regardless of how you generate it.'
        },
        {
          id: 'miner-types',
          q: 'What forms can miners/signal generators take?',
          a: 'Miners can take many forms: Individual traders (discretionary stock pickers), Quant researchers (algorithmic strategies, ML models), AI agents (LLMs like Claude/GPT analyzing markets), Social platforms (aggregating community picks), Copy-trading pools (following top performers), Newsletter operators (monetizing existing audiences), or Hedge fund spinouts (deploying proprietary strategies). The network is agnostic to your method—only results matter.'
        },
        {
          id: 'update-portfolio',
          q: 'Can I update my portfolio?',
          a: 'Yes. Portfolios persist until updated. However, frequent changes incur turnover penalties in your QUANTA Score. The system rewards conviction-driven strategies over noise-chasing.'
        }
      ]
    },
    {
      id: 'signal-pool',
      title: 'Signal Pool Architecture',
      questions: [
        {
          id: 'what-signal-pool',
          q: 'What is the Signal Pool?',
          a: 'QUANTA\'s core innovation that solves Bittensor\'s 256 UID limitation. The Signal Pool decouples signal submission from on-chain registration, enabling unlimited participation through a two-layer architecture.'
        },
        {
          id: 'two-layer',
          q: 'How does the two-layer architecture work?',
          a: 'Off-Chain Layer: Anyone submits signals + stakes α-token (unlimited capacity). On-Chain Layer: Solo Miners (~50) + Pool Operators (~100) + Validators (~64) share 256 UIDs. Pool Operators aggregate signals from multiple generators and submit on their behalf.'
        },
        {
          id: 'progression',
          q: 'How do I progress in the system?',
          a: 'New Participant → Submit via Signal Pool. Qualified Generator → 60-day track record, top 30%. Pool Operator → Obtain UID + build reputation. Solo Miner → 90-day track record, top 10%, 100% rewards.'
        }
      ]
    },
    {
      id: 'scoring',
      title: 'Scoring & Performance',
      questions: [
        {
          id: 'how-scored',
          q: 'How are portfolios scored?',
          a: 'Validators compute a composite QUANTA Score using: Sortino Ratio (35%), Calmar Ratio (25%), Max Drawdown Score (25%), and Turnover Score (15%). These are weighted across time horizons: 7-day (30%), 30-day (40%), 90-day (30%).'
        },
        {
          id: 'disqualification',
          q: 'What disqualifies me from rewards?',
          a: 'Two conditions must be met for eligibility: QUANTA Score > Median, and Maximum drawdown < 10% threshold. Portfolios exceeding 10% drawdown trigger elimination consideration.'
        },
        {
          id: 'prevent-gaming',
          q: 'How do you prevent gaming?',
          a: 'Multi-layered defenses: Ante stake creates skin-in-the-game (no "swinging for the fences"). Originality scoring penalizes correlation >0.7. 20+ day scoring delays prevent copy-follow. Commit-reveal protocol with 14-hour delay prevents front-running.'
        }
      ]
    },
    {
      id: 'economics',
      title: 'Economics & Tokenomics',
      questions: [
        {
          id: 'dual-revenue',
          q: 'What is the dual-revenue model?',
          a: 'Base Emissions: All miners & validators get paid for compute/validation from dTAO (41%/41%/18% split). Reward Pool: Only outperformers get paid for alpha generation from antes + penalties + external revenue. Base emissions compensate infrastructure; reward pool is zero-sum competition.'
        },
        {
          id: 'external-revenue',
          q: 'How does off-chain/external revenue work?',
          a: 'QUANTA can generate revenue beyond Bittensor emissions through: API subscriptions (hedge funds, quant firms pay for top signals), strategy licensing (one-off deals, ETF integrations), educational services (masterclasses, certifications), and treasury trading (deploying capital based on aggregated signals). This revenue flows back to token holders via buy-and-burn and staking rewards.'
        },
        {
          id: 'alpha-token',
          q: 'What is the α-token (QALPHA)?',
          a: 'QUANTA\'s native token with 21M max supply (Bitcoin-style cap), performance-based emission only (no passive emissions), and functions for staking, ante, access, governance, and revenue sharing. Paired in AMM pool with TAO.'
        },
        {
          id: 'ante-mechanism',
          q: 'What is the ante mechanism?',
          a: 'Every miner posts α-token ante proportional to their desired reward exposure (any amount > 0). Rewards scale with ante size—stake more to earn more if you perform well. Top 10% receive premium rewards, profitable tier (45%) get positive ROI, break-even (25%) get ante returned, and penalty band (bottom 20%) forfeit ante (50% burned, 50% redistributed to winners). There is no fixed minimum—the market filters by performance, not capital requirements.'
        },
        {
          id: 'deflationary',
          q: 'What are the deflationary mechanics?',
          a: '50% of forfeited ante burned. Unclaimed rewards burned. 50% of external revenue does quarterly buy-and-burn. 25% of 2% network fee burned. Target: Net supply decreases as adoption grows.'
        }
      ]
    },
    {
      id: 'network',
      title: 'Network Participants',
      questions: [
        {
          id: 'participant-roles',
          q: 'What are the participant roles?',
          a: 'Signal Generators: Submit portfolios via Signal Pool (unlimited). Solo Miners: Direct UID holders, top performers, 100% rewards (~50). Pool Operators: Aggregate signals, hold UIDs, earn 10-15% fees (~100). Validators: Fetch prices, score portfolios, achieve consensus (~64).'
        },
        {
          id: 'validators-do',
          q: 'What do validators do?',
          a: 'Validators fetch live market prices (Tiingo, Polygon), calculate portfolio returns across horizons, compute risk-adjusted metrics and QUANTA Scores, submit rankings on-chain, and participate in Yuma Consensus. Rewarded via 41% emission share.'
        },
        {
          id: 'yuma-consensus',
          q: 'What is Yuma Consensus?',
          a: 'Bittensor\'s stake-weighted consensus algorithm. Critical anti-collusion property: Weights exceeding consensus are clipped to the median, preventing validator-miner collusion from generating outsized rewards.'
        }
      ]
    },
    {
      id: 'regulatory',
      title: 'Regulatory & Compliance',
      questions: [
        {
          id: 'securities-regs',
          q: 'How does QUANTA handle securities regulations?',
          a: 'QUANTA follows Numerai\'s proven compliance architecture: Simulation-based (paper trading only, no actual fund management), signals are not investment advice, α-token has clear utility functions, and SEC\'s "Project Crypto" recognizes tokens can transition from securities to non-securities as networks decentralize.'
        },
        {
          id: 'prediction-market',
          q: 'Is QUANTA a prediction market?',
          a: 'No. Unlike Kalshi or Polymarket (binary event prediction), QUANTA predicts continuous portfolio returns, requires proving skill over rolling windows, outputs tradeable signal products with institutional utility, and has no event-based betting mechanism.'
        }
      ]
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      questions: [
        {
          id: 'start-generator',
          q: 'How do I start as a signal generator?',
          a: '1) Register a Bittensor wallet. 2) Stake α-token ante (amount scales your potential rewards). 3) Submit your first portfolio via web GUI, API, or CLI. 4) Build your track record over 60+ days. 5) Progress to Pool Operator or Solo Miner status.'
        },
        {
          id: 'minimum-investment',
          q: 'What\'s the minimum investment?',
          a: 'Ante amounts are proportional to your potential reward share—stake more to earn more if you perform well. This creates natural alignment between risk and reward. There is no fixed minimum; the system scales rewards based on your relative ante contribution to the pool.'
        },
        {
          id: 'hardware-requirements',
          q: 'What are the hardware requirements?',
          a: 'For Signal Generators: None beyond standard web browsing. For Validators: 4+ vCPUs, 16GB+ RAM, reliable internet. No GPU required.'
        }
      ]
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setOpenSection(sectionId);
    }
    setFaqDropdownOpen(false);
    setGlossaryDropdownOpen(false);
  };

  const scrollToGlossaryCategory = (categoryIndex) => {
    const glossaryElement = document.getElementById('glossary');
    if (glossaryElement) {
      glossaryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Small delay to let scroll complete, then scroll to specific category
      setTimeout(() => {
        const categories = glossaryElement.querySelectorAll('.glossary-category');
        if (categories[categoryIndex]) {
          categories[categoryIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
    setGlossaryDropdownOpen(false);
  };

  const glossaryCategories = [
    { name: 'Bittensor & Crypto', index: 0 },
    { name: 'QUANTA Roles', index: 1 },
    { name: 'Trading & Finance', index: 2 },
    { name: 'Anti-Gaming & Security', index: 3 },
    { name: 'QUANTA-Specific', index: 4 },
    { name: 'Tokenomics', index: 5 }
  ];

  return (
    <div className="faq-container">
      <header className="faq-header">
        <div className="faq-brand">
          <a href="/" className="brand-logo">Q</a>
          <a href="/" className="brand-link">QUANTA</a>
          <span className="brand-separator">|</span>
          <span className="brand-page">FAQ</span>
        </div>
        <nav className="faq-nav">
          <div className="nav-dropdown" ref={faqDropdownRef}>
            <button
              className="nav-dropdown-trigger"
              onClick={() => setFaqDropdownOpen(!faqDropdownOpen)}
              onMouseEnter={() => setFaqDropdownOpen(true)}
            >
              FAQ <span className="dropdown-arrow">▾</span>
            </button>
            {faqDropdownOpen && (
              <div className="nav-dropdown-menu" onMouseLeave={() => setFaqDropdownOpen(false)}>
                {sections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => { e.preventDefault(); scrollToSection(section.id); }}
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="#concepts" onClick={(e) => { e.preventDefault(); scrollToSection('concepts'); }}>Concepts</a>
          <div className="nav-dropdown" ref={glossaryDropdownRef}>
            <button
              className="nav-dropdown-trigger"
              onClick={() => setGlossaryDropdownOpen(!glossaryDropdownOpen)}
              onMouseEnter={() => setGlossaryDropdownOpen(true)}
            >
              Glossary <span className="dropdown-arrow">▾</span>
            </button>
            {glossaryDropdownOpen && (
              <div className="nav-dropdown-menu" onMouseLeave={() => setGlossaryDropdownOpen(false)}>
                <a
                  href="#glossary"
                  onClick={(e) => { e.preventDefault(); scrollToSection('glossary'); }}
                >
                  All Terms
                </a>
                {glossaryCategories.map(cat => (
                  <a
                    key={cat.index}
                    href="#glossary"
                    onClick={(e) => { e.preventDefault(); scrollToGlossaryCategory(cat.index); }}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="/resources">Resources</a>
          <a href="/pitch-lite">Overview</a>
          <a href="/pitch">Deck</a>
          <a href="/contact">Contact</a>
          <a href="/" className="nav-join">Join</a>
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
          <a href="#basics" onClick={(e) => { e.preventDefault(); scrollToSection('basics'); setMobileMenuOpen(false); }}>FAQ</a>
          <a href="#concepts" onClick={(e) => { e.preventDefault(); scrollToSection('concepts'); setMobileMenuOpen(false); }}>Concepts</a>
          <a href="#glossary" onClick={(e) => { e.preventDefault(); scrollToSection('glossary'); setMobileMenuOpen(false); }}>Glossary</a>
          <a href="/resources">Resources</a>
          <a href="/pitch-lite">Overview</a>
          <a href="/pitch">Deck</a>
          <a href="/contact">Contact</a>
          <a href="/" className="mobile-join">Join</a>
        </nav>
      )}


      <main className="faq-main">
        <div id="faq-intro" className="faq-intro">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about QUANTA, the decentralized stock picking competition on Bittensor.</p>
        </div>

        <div className="faq-sections">
          {sections.map(section => (
            <div key={section.id} id={section.id} className={`faq-section ${openSection === section.id ? 'section-open' : ''}`}>
              <button
                className="section-header"
                onClick={() => toggleSection(section.id)}
                aria-expanded={openSection === section.id}
              >
                <h2>{section.title}</h2>
                <span className="section-icon">{openSection === section.id ? '−' : '+'}</span>
              </button>

              <div className="section-content">
                {section.questions.map(item => (
                  <div key={item.id} className={`faq-item ${openQuestions[item.id] ? 'item-open' : ''}`}>
                    <button
                      className="faq-question"
                      onClick={() => toggleQuestion(item.id)}
                      aria-expanded={openQuestions[item.id]}
                    >
                      <span className="q-text">{item.q}</span>
                      <span className="q-icon">{openQuestions[item.id] ? '▲' : '▼'}</span>
                    </button>
                    <div className="faq-answer">
                      <p>{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Visual Diagrams Section */}
        <div id="concepts" className="faq-diagrams">
          <h2>Key Concepts</h2>

          <div className="diagram-card">
            <h3>Signal Pool Architecture</h3>
            <div className="diagram-flow">
              <div className="diagram-box diagram-wide">
                <span className="diagram-label">∞ Signal Generators</span>
                <span className="diagram-sub">Anyone submits portfolios</span>
              </div>
              <div className="diagram-arrow">↓</div>
              <div className="diagram-box">
                <span className="diagram-label">Pool Operators</span>
                <span className="diagram-sub">Aggregate & route signals</span>
              </div>
              <div className="diagram-arrow">↓</div>
              <div className="diagram-box">
                <span className="diagram-label">256 UIDs</span>
                <span className="diagram-sub">On-chain slots</span>
              </div>
              <div className="diagram-arrow">↓</div>
              <div className="diagram-box diagram-highlight">
                <span className="diagram-label">Validators</span>
                <span className="diagram-sub">Score & consensus</span>
              </div>
            </div>
          </div>

          <div className="diagram-card">
            <h3>Reward Distribution</h3>
            <div className="diagram-distribution">
              <div className="dist-bar">
                <div className="dist-segment dist-top" style={{width: '15%'}}>
                  <span>Top 15%</span>
                  <span className="dist-label">Premium</span>
                </div>
                <div className="dist-segment dist-profit" style={{width: '35%'}}>
                  <span>35%</span>
                  <span className="dist-label">Profitable</span>
                </div>
                <div className="dist-segment dist-break" style={{width: '20%'}}>
                  <span>20%</span>
                  <span className="dist-label">Break-even</span>
                </div>
                <div className="dist-segment dist-penalty" style={{width: '30%'}}>
                  <span>30%</span>
                  <span className="dist-label">Penalty</span>
                </div>
              </div>
              <div className="dist-legend">
                <div className="legend-item"><span className="legend-color dist-top"></span> Premium rewards</div>
                <div className="legend-item"><span className="legend-color dist-profit"></span> Positive ROI</div>
                <div className="legend-item"><span className="legend-color dist-break"></span> Ante returned</div>
                <div className="legend-item"><span className="legend-color dist-penalty"></span> Ante forfeited</div>
              </div>
            </div>
          </div>

          <div className="diagram-card">
            <h3>QUANTA Score Formula</h3>
            <div className="formula-display">
              <div className="formula-main">
                QS = Σ<sub>t</sub> w<sub>t</sub> × [0.35×Sortino + 0.25×Calmar + 0.25×DD + 0.15×Turnover]
              </div>
              <div className="formula-weights">
                <div className="weight-item">
                  <span className="weight-value">30%</span>
                  <span className="weight-label">7-day</span>
                </div>
                <div className="weight-item">
                  <span className="weight-value">45%</span>
                  <span className="weight-label">30-day</span>
                </div>
                <div className="weight-item">
                  <span className="weight-value">25%</span>
                  <span className="weight-label">90-day</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glossary Section */}
        <div id="glossary" className="faq-glossary">
          <h2>Glossary</h2>
          <p className="glossary-intro">New to crypto or trading? Here's a quick guide to the key terms.</p>

          <div className="glossary-grid">
            <div className="glossary-category">
              <h3>Bittensor & Crypto Terms</h3>
              <dl className="glossary-list">
                <div className="glossary-item">
                  <dt>α-token (Alpha Token)</dt>
                  <dd>QUANTA's native token used for staking, rewards, and governance. Earned by successful stock pickers.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Bittensor</dt>
                  <dd>A decentralized AI network where different subnets compete to provide valuable intelligence. QUANTA runs on Bittensor as Subnet 87.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Consensus</dt>
                  <dd>Agreement among validators on scores and rankings. QUANTA uses Yuma Consensus - a stake-weighted voting system that resists manipulation.</dd>
                </div>
                <div className="glossary-item">
                  <dt>dTAO (Dynamic TAO)</dt>
                  <dd>Bittensor's system where each subnet has its own token paired with TAO. Better-performing subnets attract more stake and earn larger emission shares.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Emissions</dt>
                  <dd>New tokens created and distributed to network participants. QUANTA receives emissions from Bittensor based on subnet performance.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Hotkey / Coldkey</dt>
                  <dd>Bittensor uses two keys: a hotkey for daily operations (signing transactions) and a coldkey for security (stored offline, controls funds).</dd>
                </div>
                <div className="glossary-item">
                  <dt>On-chain</dt>
                  <dd>Recorded on the blockchain - permanent, transparent, and verifiable by anyone. Your track record is stored on-chain.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Staking</dt>
                  <dd>Locking up tokens to participate in the network. Stakers earn rewards proportional to their stake and the subnet's performance.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Subnet</dt>
                  <dd>A specialized network within Bittensor focused on a specific task. QUANTA is a subnet focused on stock picking. Each subnet has its own token.</dd>
                </div>
                <div className="glossary-item">
                  <dt>TAO</dt>
                  <dd>The native cryptocurrency of the Bittensor network. Think of it like "Bitcoin for AI" - earned by contributing valuable work to the network.</dd>
                </div>
                <div className="glossary-item">
                  <dt>UID</dt>
                  <dd>Unique Identifier - a slot on the Bittensor network (limited to 256 per subnet). Required for direct participation as a miner or validator.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Wallet</dt>
                  <dd>A digital account that stores your cryptocurrency. Like a bank account for crypto, with a public address (like an account number) and private key (like a password).</dd>
                </div>
              </dl>
            </div>

            <div className="glossary-category">
              <h3>QUANTA Roles</h3>
              <dl className="glossary-list">
                <div className="glossary-item">
                  <dt>Miner</dt>
                  <dd>A participant who holds a UID and submits signals directly to the network. Keeps 100% of their rewards.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Pool Operator</dt>
                  <dd>Someone who holds a UID and aggregates signals from multiple generators. Takes a small fee (10-15%) for the service.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Signal Generator</dt>
                  <dd>Anyone who submits stock picks to QUANTA. No special hardware or UID required - just pick stocks and submit.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Validator</dt>
                  <dd>Runs the scoring system - fetches stock prices, calculates performance, and determines who wins. Gets paid for keeping the network honest.</dd>
                </div>
              </dl>
            </div>

            <div className="glossary-category">
              <h3>Trading & Finance Terms</h3>
              <dl className="glossary-list">
                <div className="glossary-item">
                  <dt>Alpha</dt>
                  <dd>Returns above the market average. If the market goes up 10% and you make 15%, your alpha is 5%. QUANTA rewards alpha generation.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Benchmark</dt>
                  <dd>A standard to compare performance against, like the S&P 500. Beating the benchmark means you generated alpha.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Beta</dt>
                  <dd>How much your portfolio moves with the market. Beta of 1 = moves with market. Beta of 2 = twice as volatile. Beta of 0.5 = half as volatile.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Calmar Ratio</dt>
                  <dd>Annual returns divided by maximum drawdown. Rewards consistent performers who avoid big losses.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Long Position</dt>
                  <dd>Betting a stock will go up. You profit when the price rises. Standard stock ownership.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Maximum Drawdown</dt>
                  <dd>The biggest peak-to-trough decline in your portfolio value. If you went from $100 to $80, that's a 20% drawdown.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Paper Trading</dt>
                  <dd>Simulated trading without real money. QUANTA uses paper trading to score portfolios - you don't actually buy stocks.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Portfolio</dt>
                  <dd>A collection of investments. In QUANTA, your portfolio is the list of stocks you pick and how much weight you give each one.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Risk-Adjusted Returns</dt>
                  <dd>Performance that accounts for how much risk you took. Making 20% with wild swings is less impressive than making 15% steadily.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Sharpe Ratio</dt>
                  <dd>A measure of risk-adjusted returns. Higher is better. Compares your returns to a risk-free investment (like treasury bonds).</dd>
                </div>
                <div className="glossary-item">
                  <dt>Short Position</dt>
                  <dd>Betting a stock will go down. You profit when the price falls. More advanced strategy (not available in QUANTA v1).</dd>
                </div>
                <div className="glossary-item">
                  <dt>Sortino Ratio</dt>
                  <dd>Like Sharpe, but only penalizes downside volatility. Big gains don't hurt your score, only big losses do.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Turnover</dt>
                  <dd>How often you change your portfolio. High turnover = frequent trading. QUANTA penalizes excessive turnover to reward conviction.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Volatility</dt>
                  <dd>How much prices swing up and down. High volatility = big swings, more risk. Low volatility = steady performance.</dd>
                </div>
              </dl>
            </div>

            <div className="glossary-category">
              <h3>Anti-Gaming & Security</h3>
              <dl className="glossary-list">
                <div className="glossary-item">
                  <dt>Collusion</dt>
                  <dd>Multiple parties secretly coordinating to manipulate scores. Yuma Consensus clips outlier scores, making collusion ineffective.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Correlation Gaming</dt>
                  <dd>Copying others' portfolios to free-ride on their research. Detected via originality scoring - portfolios too similar to others get penalized.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Front-Running</dt>
                  <dd>Seeing someone's picks before they're final and trading ahead of them. Prevented by the commit-reveal protocol with time delays.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Originality Score</dt>
                  <dd>Measures how unique your portfolio is compared to others. High correlation (&gt;0.7) with other submissions triggers penalties.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Scoring Delay</dt>
                  <dd>20+ day delay before final scores are published. Prevents copy-follow strategies where people mimic top performers.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Skin in the Game</dt>
                  <dd>Having something to lose if you perform poorly. The ante mechanism ensures everyone has real tokens at stake.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Sybil Attack</dt>
                  <dd>Creating multiple fake identities to game the system. QUANTA prevents this with stake requirements - each identity needs real tokens at risk.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Variance Gaming</dt>
                  <dd>"Swinging for the fences" - taking extreme risks hoping to get lucky. QUANTA's risk-adjusted scoring and ante mechanism discourage this.</dd>
                </div>
              </dl>
            </div>

            <div className="glossary-category">
              <h3>QUANTA-Specific Terms</h3>
              <dl className="glossary-list">
                <div className="glossary-item">
                  <dt>Ante</dt>
                  <dd>The stake you put up when submitting signals. Like a buy-in at poker - you risk your ante but can win more if you perform well.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Commit-Reveal</dt>
                  <dd>A two-step submission process: first commit a hidden version of your picks, then reveal them later. Prevents others from copying your strategy.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Epoch</dt>
                  <dd>A scoring period (typically weekly). At the end of each epoch, winners are determined and rewards are distributed.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Meta-Signal</dt>
                  <dd>The aggregated wisdom of all participants combined. Often more accurate than any individual signal.</dd>
                </div>
                <div className="glossary-item">
                  <dt>QUANTA Score (QS)</dt>
                  <dd>Your composite performance rating combining multiple risk metrics across different time windows. Determines your rank and rewards.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Reward Tiers</dt>
                  <dd>Performance bands: Top 15% (premium rewards), profitable tier (positive ROI), break-even (ante returned), penalty band (ante forfeited).</dd>
                </div>
                <div className="glossary-item">
                  <dt>Signal Pool</dt>
                  <dd>The system that allows unlimited participants despite Bittensor's 256 UID limit. Submit signals through the pool without needing your own UID.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Time Horizons</dt>
                  <dd>QUANTA scores across 7-day (30%), 30-day (40%), and 90-day (30%) windows. Balances short-term skill with long-term consistency.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Track Record</dt>
                  <dd>Your historical performance stored on-chain. Builds over time and unlocks progression to higher participation tiers.</dd>
                </div>
              </dl>
            </div>

            <div className="glossary-category">
              <h3>Tokenomics & Economics</h3>
              <dl className="glossary-list">
                <div className="glossary-item">
                  <dt>AMM (Automated Market Maker)</dt>
                  <dd>A system that automatically prices tokens based on supply and demand. α-token is paired with TAO in an AMM pool.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Burn Mechanism</dt>
                  <dd>Permanently destroying tokens to reduce supply. 50% of forfeited antes are burned, making remaining tokens more scarce.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Deflationary</dt>
                  <dd>Token supply decreasing over time due to burns. QUANTA is designed to be net deflationary as adoption grows.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Dual Revenue Model</dt>
                  <dd>QUANTA earns from two sources: Bittensor emissions (base rewards) and the competition pot (antes from participants).</dd>
                </div>
                <div className="glossary-item">
                  <dt>Flywheel Effect</dt>
                  <dd>A virtuous cycle: better signals → more users → higher token value → more stake → larger emissions → attracts more talent.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Network Rake</dt>
                  <dd>An optional, governance-tunable percentage (0-8%) that may be taken from the reward pool. Currently under consideration whether to set this to 0%, as emissions and external revenue may allow 100% of the ante pool to be redistributed to winning signal generators.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Power-Law Distribution</dt>
                  <dd>Reward formula where top performers get disproportionately more. #1 earns more than #2, who earns more than #3, etc.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Zero-Sum Game</dt>
                  <dd>A competition where winners' gains equal losers' losses. The reward pool is zero-sum - top performers win what underperformers lose.</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <footer className="faq-footer">
          <div className="footer-links">
            <a href="/pitch-lite">Overview</a>
            <a href="/pitch">Full Pitch Deck</a>
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

        .faq-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
          color: #e8e6e3;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .faq-header {
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

        .faq-brand {
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

        .faq-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .faq-nav > a {
          color: rgba(232, 230, 227, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .faq-nav > a:hover {
          color: #d4af37;
        }

        .faq-nav > a.nav-join {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0d0d14;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .faq-nav > a.nav-join:hover {
          color: #0d0d14;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        /* Dropdown styles */
        .nav-dropdown {
          position: relative;
        }

        .nav-dropdown-trigger {
          background: none;
          border: none;
          color: rgba(232, 230, 227, 0.8);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-family: inherit;
          transition: color 0.2s;
        }

        .nav-dropdown-trigger:hover {
          color: #d4af37;
        }

        .dropdown-arrow {
          font-size: 0.7rem;
          opacity: 0.7;
          transition: transform 0.2s;
        }

        .nav-dropdown:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .nav-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 15, 22, 0.98);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 8px;
          min-width: 180px;
          padding: 0.5rem 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          z-index: 200;
          backdrop-filter: blur(8px);
        }

        .nav-dropdown-menu::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid rgba(212, 175, 55, 0.25);
        }

        .nav-dropdown-menu::after {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid rgba(15, 15, 22, 0.98);
        }

        .nav-dropdown-menu a {
          display: block;
          padding: 0.5rem 1rem;
          color: rgba(232, 230, 227, 0.8);
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .nav-dropdown-menu a:hover {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.08);
          padding-left: 1.25rem;
        }

        .nav-dropdown-menu a:first-child {
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          margin-bottom: 0.25rem;
          padding-bottom: 0.625rem;
        }

        /* Hamburger button - hidden on desktop */
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

        /* Mobile menu - hidden by default */
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

        .mobile-menu a.mobile-join {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0d0d14;
          font-weight: 600;
          text-align: center;
          margin-top: 0.5rem;
          border-radius: 6px;
        }

        .mobile-menu a.mobile-join:hover {
          color: #0d0d14;
        }

        .faq-main {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .faq-intro {
          text-align: center;
          margin-bottom: 3rem;
        }

        .faq-intro h1 {
          font-size: 2.5rem;
          font-weight: 300;
          color: #d4af37;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }

        .faq-intro p {
          color: rgba(232, 230, 227, 0.7);
          font-size: 1.1rem;
        }

        .faq-sections {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .faq-section {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
          scroll-margin-top: 70px;
        }

        .faq-intro {
          scroll-margin-top: 70px;
        }

        .faq-diagrams {
          scroll-margin-top: 70px;
        }

        .faq-glossary {
          scroll-margin-top: 70px;
        }

        .faq-section:hover {
          border-color: rgba(212, 175, 55, 0.3);
        }

        .section-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: #e8e6e3;
          cursor: pointer;
          text-align: left;
        }

        .section-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: #d4af37;
        }

        .section-icon {
          font-size: 1.5rem;
          color: #d4af37;
          font-weight: 300;
        }

        .section-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        .section-open .section-content {
          max-height: 2000px;
          transition: max-height 0.5s ease-in;
        }

        .faq-item {
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          padding-left: 2rem;
          background: transparent;
          border: none;
          color: #e8e6e3;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .faq-question:hover {
          background: rgba(212, 175, 55, 0.05);
        }

        .q-text {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .q-icon {
          font-size: 0.7rem;
          color: rgba(212, 175, 55, 0.6);
          margin-left: 1rem;
          flex-shrink: 0;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        .item-open .faq-answer {
          max-height: 500px;
          transition: max-height 0.3s ease-in;
        }

        .faq-answer p {
          padding: 0 1.5rem 1rem 2rem;
          margin: 0;
          color: rgba(232, 230, 227, 0.75);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* Diagrams Section */
        .faq-diagrams {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }

        .faq-diagrams > h2 {
          text-align: center;
          color: #d4af37;
          font-size: 1.5rem;
          font-weight: 300;
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
        }

        .diagram-card {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .diagram-card h3 {
          color: #e8e6e3;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1.5rem 0;
          text-align: center;
        }

        .diagram-flow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .diagram-box {
          background: rgba(10, 10, 15, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 6px;
          padding: 0.75rem 1.5rem;
          text-align: center;
          min-width: 180px;
        }

        .diagram-wide {
          min-width: 250px;
        }

        .diagram-highlight {
          background: rgba(212, 175, 55, 0.1);
          border-color: #d4af37;
        }

        .diagram-label {
          display: block;
          font-weight: 600;
          color: #d4af37;
          font-size: 0.9rem;
        }

        .diagram-sub {
          display: block;
          font-size: 0.75rem;
          color: rgba(232, 230, 227, 0.6);
          margin-top: 0.25rem;
        }

        .diagram-arrow {
          color: rgba(212, 175, 55, 0.6);
          font-size: 1.2rem;
        }

        /* Distribution Diagram */
        .diagram-distribution {
          padding: 1rem 0;
        }

        .dist-bar {
          display: flex;
          border-radius: 4px;
          overflow: hidden;
          height: 50px;
        }

        .dist-segment {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #0a0a0f;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem;
        }

        .dist-label {
          font-size: 0.65rem;
          font-weight: 400;
          opacity: 0.8;
        }

        .dist-top { background: #d4af37; }
        .dist-profit { background: #4ade80; }
        .dist-break { background: #94a3b8; }
        .dist-penalty { background: #f87171; }

        .dist-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: rgba(232, 230, 227, 0.7);
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        /* Formula Display */
        .formula-display {
          text-align: center;
        }

        .formula-main {
          font-family: 'Times New Roman', serif;
          font-size: 1rem;
          color: #e8e6e3;
          background: rgba(10, 10, 15, 0.6);
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          overflow-x: auto;
        }

        .formula-weights {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .weight-item {
          text-align: center;
        }

        .weight-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          color: #d4af37;
        }

        .weight-label {
          font-size: 0.8rem;
          color: rgba(232, 230, 227, 0.6);
        }

        /* Glossary Section */
        .faq-glossary {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }

        .faq-glossary > h2 {
          text-align: center;
          color: #d4af37;
          font-size: 1.5rem;
          font-weight: 300;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        .glossary-intro {
          text-align: center;
          color: rgba(232, 230, 227, 0.6);
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        .glossary-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .glossary-category {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 8px;
          padding: 1.25rem;
        }

        .glossary-category h3 {
          color: #d4af37;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .glossary-list {
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem 2rem;
        }

        .glossary-item {
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.08);
        }

        .glossary-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .glossary-item dt {
          color: #e8e6e3;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
        }

        .glossary-item dd {
          color: rgba(232, 230, 227, 0.7);
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
        }

        /* Footer */
        .faq-footer {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          text-align: center;
        }

        .faq-footer p {
          color: rgba(232, 230, 227, 0.6);
          font-style: italic;
          margin-bottom: 1rem;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .footer-links a {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.9rem;
          transition: opacity 0.2s;
        }

        .footer-links a:hover {
          opacity: 0.8;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 1.5rem;
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
        @media (max-width: 640px) {
          .faq-header {
            padding: 0.75rem 1rem;
          }

          .faq-nav {
            display: none;
          }

          .hamburger-btn {
            display: flex;
          }

          .mobile-menu {
            display: flex;
          }

          .faq-intro h1 {
            font-size: 1.75rem;
          }

          .faq-intro p {
            font-size: 0.95rem;
          }

          .section-header {
            padding: 0.875rem 1rem;
          }

          .section-header h2 {
            font-size: 1rem;
          }

          .faq-question {
            padding: 0.875rem 1rem 0.875rem 1.25rem;
          }

          .q-text {
            font-size: 0.9rem;
          }

          .faq-answer p {
            padding: 0 1rem 1rem 1.25rem;
          }

          .diagram-box {
            min-width: 150px;
            padding: 0.5rem 1rem;
          }

          .diagram-wide {
            min-width: 200px;
          }

          .formula-main {
            font-size: 0.85rem;
            padding: 0.75rem;
          }

          .formula-weights {
            gap: 1rem;
          }

          .dist-segment {
            font-size: 0.65rem;
          }

          .dist-label {
            display: none;
          }

          .glossary-category {
            padding: 1rem;
          }

          .glossary-list {
            grid-template-columns: 1fr;
          }

          .glossary-item dt {
            font-size: 0.85rem;
          }

          .glossary-item dd {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuantaFAQ;
