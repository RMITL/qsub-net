import React, { useState } from 'react';

const QuantaFAQ = () => {
  const [openSection, setOpenSection] = useState('overview');
  const [openQuestions, setOpenQuestions] = useState({});

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
      id: 'overview',
      title: 'General Overview',
      questions: [
        {
          id: 'what-is-quanta',
          q: 'What is QUANTA?',
          a: 'QUANTA is a decentralized Bittensor subnet that creates a marketplace for portfolio-based alpha signal generation in U.S. equities. Participants submit JSON-formatted portfolio signals (ticker-weight pairs summing to 100%) that validators evaluate using a paper trading engine across rolling 7, 30, and 90-day horizons.'
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
          a: 'A simple JSON payload containing U.S. equity/ETF tickers and weights that sum to 100%. Example: {"AAPL": 25, "GOOGL": 20, "MSFT": 15, "AMZN": 15, "NVDA": 10, "META": 10, "TSLA": 5}. No code execution, ML models, or GPUs required.'
        },
        {
          id: 'technical-skills',
          q: 'Do I need technical skills?',
          a: 'No. QUANTA\'s portfolio-only model enables participation from retail stock pickers (web GUI), finance professionals (Excel add-on), quant researchers (Python API), and LLM/Agent systems. The same JSON format is accepted regardless of how you generate it.'
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
          a: 'Validators compute a composite QUANTA Score using: Sortino Ratio (35%), Calmar Ratio (25%), Max Drawdown Score (25%), and Turnover Score (15%). These are weighted across time horizons: 7-day (30%), 30-day (45%), 90-day (25%).'
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
          id: 'alpha-token',
          q: 'What is the α-token (QALPHA)?',
          a: 'QUANTA\'s native token with 21M max supply (Bitcoin-style cap), performance-based emission only (no passive emissions), and functions for staking, ante, access, governance, and revenue sharing. Paired in AMM pool with TAO.'
        },
        {
          id: 'ante-mechanism',
          q: 'What is the ante mechanism?',
          a: 'Every miner posts α-token ante proportional to their desired reward exposure. Rewards scale with ante size—stake more to earn more if you perform well. Top 15% receive premium rewards, profitable tier (50%) get positive ROI, break-even (20%) get ante returned, and penalty band (bottom 30%) forfeit ante (50% burned, 50% redistributed to winners).'
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

  return (
    <div className="faq-container">
      <header className="faq-header">
        <div className="faq-brand">
          <a href="/" className="brand-link">QUANTA</a>
          <span className="brand-separator">|</span>
          <span className="brand-page">FAQ</span>
        </div>
        <nav className="faq-nav">
          <a href="/pitch-lite">Overview</a>
          <a href="/pitch">Full Deck</a>
        </nav>
      </header>

      <main className="faq-main">
        <div className="faq-intro">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about QUANTA, the decentralized stock picking competition on Bittensor.</p>
        </div>

        <div className="faq-sections">
          {sections.map(section => (
            <div key={section.id} className={`faq-section ${openSection === section.id ? 'section-open' : ''}`}>
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
        <div className="faq-diagrams">
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
        <div className="faq-glossary">
          <h2>Glossary</h2>
          <p className="glossary-intro">New to crypto or trading? Here's a quick guide to the key terms.</p>

          <div className="glossary-grid">
            <div className="glossary-category">
              <h3>Bittensor & Crypto Terms</h3>
              <dl className="glossary-list">
                <div className="glossary-item">
                  <dt>TAO</dt>
                  <dd>The native cryptocurrency of the Bittensor network. Think of it like "Bitcoin for AI" - earned by contributing valuable work to the network.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Subnet</dt>
                  <dd>A specialized network within Bittensor focused on a specific task. QUANTA is a subnet focused on stock picking. Each subnet has its own token.</dd>
                </div>
                <div className="glossary-item">
                  <dt>α-token (Alpha Token)</dt>
                  <dd>QUANTA's native token used for staking, rewards, and governance. Earned by successful stock pickers.</dd>
                </div>
                <div className="glossary-item">
                  <dt>UID</dt>
                  <dd>Unique Identifier - a slot on the Bittensor network (limited to 256 per subnet). Required for direct participation as a miner or validator.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Wallet</dt>
                  <dd>A digital account that stores your cryptocurrency. Like a bank account for crypto, with a public address (like an account number) and private key (like a password).</dd>
                </div>
                <div className="glossary-item">
                  <dt>On-chain</dt>
                  <dd>Recorded on the blockchain - permanent, transparent, and verifiable by anyone. Your track record is stored on-chain.</dd>
                </div>
              </dl>
            </div>

            <div className="glossary-category">
              <h3>QUANTA Roles</h3>
              <dl className="glossary-list">
                <div className="glossary-item">
                  <dt>Signal Generator</dt>
                  <dd>Anyone who submits stock picks to QUANTA. No special hardware or UID required - just pick stocks and submit.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Miner</dt>
                  <dd>A participant who holds a UID and submits signals directly to the network. Keeps 100% of their rewards.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Pool Operator</dt>
                  <dd>Someone who holds a UID and aggregates signals from multiple generators. Takes a small fee (10-15%) for the service.</dd>
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
                  <dt>Portfolio</dt>
                  <dd>A collection of investments. In QUANTA, your portfolio is the list of stocks you pick and how much weight you give each one.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Alpha</dt>
                  <dd>Returns above the market average. If the market goes up 10% and you make 15%, your alpha is 5%. QUANTA rewards alpha generation.</dd>
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
                  <dt>Sortino Ratio</dt>
                  <dd>Like Sharpe, but only penalizes downside volatility. Big gains don't hurt your score, only big losses do.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Calmar Ratio</dt>
                  <dd>Annual returns divided by maximum drawdown. Rewards consistent performers who avoid big losses.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Maximum Drawdown</dt>
                  <dd>The biggest peak-to-trough decline in your portfolio value. If you went from $100 to $80, that's a 20% drawdown.</dd>
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
                  <dt>Epoch</dt>
                  <dd>A scoring period (typically weekly). At the end of each epoch, winners are determined and rewards are distributed.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Signal Pool</dt>
                  <dd>The system that allows unlimited participants despite Bittensor's 256 UID limit. Submit signals through the pool without needing your own UID.</dd>
                </div>
                <div className="glossary-item">
                  <dt>QUANTA Score</dt>
                  <dd>Your composite performance rating combining multiple risk metrics across different time windows. Determines your rank and rewards.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Commit-Reveal</dt>
                  <dd>A two-step submission process: first commit a hidden version of your picks, then reveal them later. Prevents others from copying your strategy.</dd>
                </div>
                <div className="glossary-item">
                  <dt>Meta-Signal</dt>
                  <dd>The aggregated wisdom of all participants combined. Often more accurate than any individual signal.</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <footer className="faq-footer">
          <p>QUANTA: Where talent meets transparency, and skill becomes tokenized value.</p>
          <div className="footer-links">
            <a href="/pitch-lite">Overview</a>
            <a href="/pitch">Full Pitch Deck</a>
          </div>
        </footer>
      </main>

      <style>{`
        .faq-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
          color: #e8e6e3;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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

        .brand-link {
          font-size: 1.5rem;
          font-weight: 700;
          color: #d4af37;
          text-decoration: none;
          letter-spacing: 0.1em;
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
          gap: 1.5rem;
        }

        .faq-nav a {
          color: rgba(232, 230, 227, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .faq-nav a:hover {
          color: #d4af37;
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
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .glossary-category {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 8px;
          padding: 1.25rem;
        }

        .glossary-category h3 {
          color: #d4af37;
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .glossary-list {
          margin: 0;
        }

        .glossary-item {
          margin-bottom: 0.75rem;
        }

        .glossary-item:last-child {
          margin-bottom: 0;
        }

        .glossary-item dt {
          color: #e8e6e3;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.2rem;
        }

        .glossary-item dd {
          color: rgba(232, 230, 227, 0.7);
          font-size: 0.8rem;
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

        /* Mobile */
        @media (max-width: 640px) {
          .faq-header {
            padding: 0.75rem 1rem;
          }

          .faq-nav {
            gap: 1rem;
          }

          .faq-nav a {
            font-size: 0.8rem;
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

          .glossary-grid {
            grid-template-columns: 1fr;
          }

          .glossary-category {
            padding: 1rem;
          }

          .glossary-item dt {
            font-size: 0.8rem;
          }

          .glossary-item dd {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuantaFAQ;
