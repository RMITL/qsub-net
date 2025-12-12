import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ComposedChart, ReferenceLine
} from 'recharts';

// ============================================================================
// QUANTA INTERACTIVE LITEPAPER
// Based on Technical Specification v5.0
// A scrollable, SN8-style document with interactive elements
// ============================================================================

const QuantaLitepaper = () => {
  const [activeSection, setActiveSection] = useState('cover');

  // ========== INTERACTIVE SCORING CALCULATOR ==========
  const [scoringInputs, setScoringInputs] = useState({
    sharpeRatio: 2.0,
    totalPnL: 15.0,
    sortinoRatio: 1.8,
    calmarRatio: 2.5,
    maxDrawdown: 6,
    turnoverPercent: 30,
  });

  // ========== INTERACTIVE TOKENOMICS MODEL ==========
  const [tokenModel, setTokenModel] = useState({
    taoPrice: 300,
    totalMiners: 500,
    avgAnte: 0.1,
    networkRake: 8,
    powerLawGamma: 1.5,
  });

  // Calculate QUANTA Score based on pitch deck formula (6 metrics)
  const calculateQS = useCallback(() => {
    const { sharpeRatio, totalPnL, sortinoRatio, calmarRatio, maxDrawdown, turnoverPercent } = scoringInputs;

    // Normalize using bounds - Sharpe PRIMARY (40%)
    const sharpeNorm = Math.min(1, Math.max(0, (sharpeRatio + 1) / 4)); // Range: -1 to 3
    const pnlNorm = Math.min(1, Math.max(0, (totalPnL + 20) / 60)); // Range: -20% to 40%
    const ddScore = Math.max(0, 1 - (maxDrawdown / 25)); // 25% threshold
    const sortinoNorm = Math.min(1, Math.max(0, (sortinoRatio + 1) / 4)); // Range: -1 to 3
    const calmarNorm = Math.min(1, Math.max(0, calmarRatio / 5)); // Range: 0 to 5
    const turnoverScore = Math.max(0, 1 - (turnoverPercent / 100)); // 100% max

    // Weighted composite matching pitch deck:
    // Sharpe (40%), Total P/L (20%), MaxDD (15%), Sortino (10%), Calmar (10%), Turnover (5%)
    const qs = (0.40 * sharpeNorm) + (0.20 * pnlNorm) + (0.15 * ddScore) + (0.10 * sortinoNorm) + (0.10 * calmarNorm) + (0.05 * turnoverScore);

    return {
      sharpeNorm: (sharpeNorm * 100).toFixed(1),
      pnlNorm: (pnlNorm * 100).toFixed(1),
      ddScore: (ddScore * 100).toFixed(1),
      sortinoNorm: (sortinoNorm * 100).toFixed(1),
      calmarNorm: (calmarNorm * 100).toFixed(1),
      turnoverScore: (turnoverScore * 100).toFixed(1),
      compositeQS: (qs * 100).toFixed(1),
      percentile: qs > 0.75 ? 'Top 10%' : qs > 0.55 ? 'Top 45%' : qs > 0.35 ? 'Top 70%' : 'Bottom 30%',
      tier: qs > 0.75 ? 'top' : qs > 0.55 ? 'profitable' : qs > 0.35 ? 'breakeven' : 'penalty'
    };
  }, [scoringInputs]);

  const qsResults = calculateQS();

  // Power-law reward distribution
  const generateRewardCurve = useCallback((gamma) => {
    const data = [];
    let total = 0;
    for (let i = 1; i <= 100; i++) total += Math.pow(i, -gamma);
    let cumulative = 0;
    for (let i = 1; i <= 30; i++) {
      const share = Math.pow(i, -gamma) / total;
      cumulative += share;
      data.push({
        rank: i,
        share: (share * 100).toFixed(2),
        cumulative: (cumulative * 100).toFixed(1)
      });
    }
    return data;
  }, []);

  const rewardData = useMemo(() => generateRewardCurve(tokenModel.powerLawGamma), [tokenModel.powerLawGamma, generateRewardCurve]);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.lp-section');
      const scrollPos = window.scrollY + window.innerHeight / 3;

      sections.forEach((section) => {
        if (section.offsetTop <= scrollPos) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Navigation structure matching tech spec
  const navigation = [
    { id: 'cover', label: 'Cover' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'executive', label: 'Executive Summary' },
    { id: 'introduction', label: '1. Introduction' },
    { id: 'architecture', label: '2. Architecture' },
    { id: 'signal-pool', label: '3. Signal Pool' },
    { id: 'signal-spec', label: '4. Signal Specification' },
    { id: 'evaluation', label: '5. Evaluation' },
    { id: 'consensus', label: '6. Consensus & Rewards' },
    { id: 'tokenomics', label: '7. Tokenomics' },
    { id: 'security', label: '8. Security' },
    { id: 'roadmap', label: '9. Roadmap' },
  ];

  // ============================================================================
  // SECTION COMPONENTS
  // ============================================================================

  const CoverSection = () => (
    <section id="cover" className="lp-section lp-cover">
      <div className="lp-cover-content">
        <div className="lp-doc-badge">TECHNICAL SPECIFICATION v5.0</div>
        <h1 className="lp-doc-title">QUANTA</h1>
        <p className="lp-doc-subtitle">Quantitative Autonomous Network for Trading Alpha</p>
        <div className="lp-cover-divider"></div>
        <p className="lp-doc-tagline">A Self-Sustaining Portfolio-Based Alpha Signal Subnet on Bittensor</p>
        <p className="lp-doc-date">November 2025</p>

        <div className="lp-cover-stats">
          <div className="lp-cover-stat">
            <span className="lp-stat-value">$45T</span>
            <span className="lp-stat-label">U.S. Market Cap</span>
          </div>
          <div className="lp-cover-stat">
            <span className="lp-stat-value">52.6%</span>
            <span className="lp-stat-label">Alt Data CAGR</span>
          </div>
          <div className="lp-cover-stat">
            <span className="lp-stat-value">∞</span>
            <span className="lp-stat-label">Signal Pool Capacity</span>
          </div>
        </div>

        <div className="lp-cover-cta">
          <button onClick={() => scrollTo('abstract')} className="lp-btn-primary">
            Read Specification →
          </button>
          <a href="/docs/QUANTA_Technical_Specification_v5.pdf" className="lp-btn-secondary" target="_blank">
            Download Full PDF
          </a>
        </div>
      </div>
    </section>
  );

  const AbstractSection = () => (
    <section id="abstract" className="lp-section">
      <div className="lp-container">
        <div className="lp-section-marker">ABSTRACT</div>

        <div className="lp-abstract-content">
          <p className="lp-lead">
            The decentralized finance ecosystem faces a critical challenge in generating reliable,
            uncorrelated alpha signals at scale. Traditional quantitative trading remains concentrated
            among institutional players with substantial capital and data infrastructure requirements,
            creating barriers to entry and limiting innovation.
          </p>

          <p>
            <strong>QUANTA</strong> (Quantitative Autonomous Network for Trading Alpha) addresses this gap
            through a novel Bittensor subnet architecture specifically designed for portfolio-based alpha
            signal generation in U.S. equities markets. Unlike existing approaches that treat prediction
            as a binary or scalar task, QUANTA implements a comprehensive <strong>Signal Pool</strong> architecture
            that enables miners to submit complete portfolio recommendations with position sizing, while
            validators evaluate performance using sophisticated risk-adjusted metrics.
          </p>

          <div className="lp-innovations-grid">
            <div className="lp-innovation">
              <div className="lp-innovation-num">1</div>
              <div className="lp-innovation-content">
                <strong>Signal Pool Mechanism</strong>
                <p>Overcomes Bittensor's 256 UID limitation, enabling unlimited portfolio diversity</p>
              </div>
            </div>
            <div className="lp-innovation">
              <div className="lp-innovation-num">2</div>
              <div className="lp-innovation-content">
                <strong>Native α-Token</strong>
                <p>Performance-based emissions creating direct economic alignment with signal quality</p>
              </div>
            </div>
            <div className="lp-innovation">
              <div className="lp-innovation-num">3</div>
              <div className="lp-innovation-content">
                <strong>dTAO/Taoflow Integration</strong>
                <p>18%/41%/41% emission split structure aligning all stakeholder incentives</p>
              </div>
            </div>
            <div className="lp-innovation">
              <div className="lp-innovation-num">4</div>
              <div className="lp-innovation-content">
                <strong>Rolling Evaluation Windows</strong>
                <p>7, 30, and 90-day horizons balancing responsiveness with consistency</p>
              </div>
            </div>
          </div>

          <div className="lp-market-context">
            <p>
              With the alternative data market projected to grow from <strong>$9.28B</strong> (2024)
              to <strong>$635B</strong> by 2034 (52.6% CAGR), and precedents like Numerai achieving
              $550M AUM with 25% annual returns, QUANTA represents a significant opportunity to
              democratize quantitative trading infrastructure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const ExecutiveSection = () => (
    <section id="executive" className="lp-section lp-section-alt">
      <div className="lp-container">
        <div className="lp-section-marker">EXECUTIVE SUMMARY</div>

        <div className="lp-exec-grid">
          <div className="lp-exec-main">
            <h3>Investment Opportunity</h3>
            <p>
              The quantitative trading industry represents one of the most lucrative yet exclusive
              domains in global finance. U.S. equities markets alone command a <strong>$45 trillion</strong> market
              capitalization, with quantitative strategies managing trillions in assets.
            </p>
            <p>
              QUANTA disrupts this paradigm by creating the first decentralized network for
              portfolio-based alpha signal generation, built on Bittensor's proven infrastructure
              for incentivized machine intelligence.
            </p>
          </div>

          <div className="lp-exec-sidebar">
            <div className="lp-exec-card">
              <h4>Market Opportunity</h4>
              <ul>
                <li><strong>$9.28B → $635B</strong> Alt Data Market (52.6% CAGR)</li>
                <li><strong>$45T</strong> U.S. Equities Market</li>
                <li><strong>$550M</strong> Numerai AUM Precedent</li>
                <li><strong>64+</strong> Bittensor Subnet Ecosystem</li>
              </ul>
            </div>
          </div>
        </div>

        <h3>Technology Summary</h3>
        <div className="lp-tech-cards">
          <div className="lp-tech-card">
            <h4>Core Architecture</h4>
            <ul>
              <li><strong>Signal Pool:</strong> Decouples submissions from UIDs</li>
              <li><strong>Multi-Horizon:</strong> 7/30/90 day windows (30%/40%/30%)</li>
              <li><strong>Risk-Adjusted:</strong> Sharpe (primary), P/L %, DD, Sortino, Calmar, Turnover (tunable weights)</li>
              <li><strong>dTAO:</strong> 18%/41%/41% emission split</li>
            </ul>
          </div>
          <div className="lp-tech-card">
            <h4>Signal Structure</h4>
            <ul>
              <li>100-500 ticker symbols</li>
              <li>Normalized position weights</li>
              <li>Long/short, net neutral or directional</li>
              <li>1-hour and daily rolling epochs</li>
            </ul>
          </div>
          <div className="lp-tech-card">
            <h4>Consensus & Rewards</h4>
            <ul>
              <li>Yuma consensus (κ=0.67)</li>
              <li>Performance-based allocation</li>
              <li>4-year halving emission cycle</li>
              <li>Top decile 3-5x multiplier</li>
            </ul>
          </div>
        </div>

        <h3>Key Metrics & Targets (Year 1)</h3>
        <div className="lp-metrics-grid">
          <div className="lp-metric">
            <span className="lp-metric-value">500+</span>
            <span className="lp-metric-label">Active Miners</span>
          </div>
          <div className="lp-metric">
            <span className="lp-metric-value">2,000+</span>
            <span className="lp-metric-label">Signals in Pool</span>
          </div>
          <div className="lp-metric">
            <span className="lp-metric-value">64+</span>
            <span className="lp-metric-label">Validators</span>
          </div>
          <div className="lp-metric">
            <span className="lp-metric-value">1.5+</span>
            <span className="lp-metric-label">Target Sharpe</span>
          </div>
          <div className="lp-metric">
            <span className="lp-metric-value">2.0+</span>
            <span className="lp-metric-label">Target Sortino</span>
          </div>
          <div className="lp-metric">
            <span className="lp-metric-value">&lt;15%</span>
            <span className="lp-metric-label">Max Drawdown</span>
          </div>
        </div>
      </div>
    </section>
  );

  const IntroductionSection = () => (
    <section id="introduction" className="lp-section">
      <div className="lp-container">
        <div className="lp-section-marker">1. INTRODUCTION</div>

        <h2>1.1 The Problem: Untapped Global Stock Intelligence</h2>
        <p className="lp-lead">
          Modern financial markets generate vast opportunities for alpha yet remain dominated by
          proprietary hedge funds and centralized platforms with misaligned incentives.
        </p>

        <div className="lp-problem-grid">
          <div className="lp-problem-card">
            <div className="lp-problem-icon">🔒</div>
            <h4>Access Barriers</h4>
            <p>
              Foreign investors hold $16.8T in U.S. equities (18% of market cap) but face
              significant operational friction in participation.
            </p>
          </div>
          <div className="lp-problem-card">
            <div className="lp-problem-icon">🎲</div>
            <h4>Inefficient Competitions</h4>
            <p>
              Paper trading contests encourage variance maximization rather than risk-adjusted
              returns. No skin in the game.
            </p>
          </div>
          <div className="lp-problem-card">
            <div className="lp-problem-icon">📉</div>
            <h4>Accountability Deficit</h4>
            <p>
              74-89% of retail traders lose money. 95% of copy traders still lose even following
              "successful" signal providers.
            </p>
          </div>
          <div className="lp-problem-card">
            <div className="lp-problem-icon">💸</div>
            <h4>Monetization Inequality</h4>
            <p>
              Talented stock-pickers have limited avenues to monetize skill without deploying
              personal capital or attracting investors.
            </p>
          </div>
        </div>

        <h2>1.2 The QUANTA Solution</h2>
        <div className="lp-solution-highlight">
          <p>
            <strong>QUANTA transforms stock picking from a closed, zero-sum contest into a
            decentralized, positive-sum marketplace.</strong>
          </p>
          <p>
            By leveraging Bittensor's blockchain infrastructure, QUANTA creates a trustless arena
            where strategies are evaluated objectively against real market data and rewarded
            proportionally to demonstrated skill.
          </p>
        </div>

        <h2>1.3 Precedent: Numerai</h2>
        <div className="lp-precedent-box">
          <div className="lp-precedent-header">
            <span className="lp-precedent-badge">VALIDATED MODEL</span>
            <h3>Crowdsourced Quantitative Alpha Since 2016</h3>
          </div>
          <div className="lp-precedent-stats">
            <div className="lp-prec-stat">
              <span className="lp-prec-value">$550M</span>
              <span className="lp-prec-label">Assets Under Management</span>
            </div>
            <div className="lp-prec-stat">
              <span className="lp-prec-value">25.45%</span>
              <span className="lp-prec-label">2024 Net Returns</span>
            </div>
            <div className="lp-prec-stat">
              <span className="lp-prec-value">$500M</span>
              <span className="lp-prec-label">Series C Valuation</span>
            </div>
            <div className="lp-prec-stat">
              <span className="lp-prec-value">J.P. Morgan</span>
              <span className="lp-prec-label">$500M Commitment</span>
            </div>
          </div>
          <p className="lp-precedent-note">
            Numerai's stake-and-burn mechanism provides a proven template. QUANTA adapts this to
            Bittensor with multi-horizon evaluation, power-law rewards, and Signal Pool architecture.
          </p>
        </div>
      </div>
    </section>
  );

  const ArchitectureSection = () => (
    <section id="architecture" className="lp-section lp-section-alt">
      <div className="lp-container">
        <div className="lp-section-marker">2. SYSTEM ARCHITECTURE</div>

        <h2>2.1 Network Roles</h2>
        <div className="lp-roles-grid">
          <div className="lp-role-card">
            <div className="lp-role-header">
              <span className="lp-role-icon">⛏️</span>
              <h4>Signal Generators (Miners)</h4>
            </div>
            <p>
              Submit JSON-formatted portfolio signals with ticker-weight pairs summing to 100%.
              Must stake α-token as ante. Portfolios persist until updated with churn penalties.
            </p>
            <div className="lp-role-capacity">Capacity: Unlimited via Signal Pool</div>
          </div>

          <div className="lp-role-card">
            <div className="lp-role-header">
              <span className="lp-role-icon">🏊</span>
              <h4>Pool Operators</h4>
            </div>
            <p>
              Hold on-chain UIDs and aggregate signals from multiple generators. Earn 10-20% fees
              from aggregated rewards. Responsible for curating high-quality pools.
            </p>
            <div className="lp-role-capacity">~100 UID slots</div>
          </div>

          <div className="lp-role-card">
            <div className="lp-role-header">
              <span className="lp-role-icon">🏆</span>
              <h4>Solo Miners</h4>
            </div>
            <p>
              Top performers (90-day track record, top 10%) who earn direct UID registration.
              Receive 100% of rewards without pool operator fees.
            </p>
            <div className="lp-role-capacity">~50 UID slots</div>
          </div>

          <div className="lp-role-card">
            <div className="lp-role-header">
              <span className="lp-role-icon">✅</span>
              <h4>Validators</h4>
            </div>
            <p>
              Operate paper trading engine, fetch pricing from Tiingo/Polygon APIs, calculate
              returns, submit scores on-chain via Yuma Consensus.
            </p>
            <div className="lp-role-capacity">~64 UID slots</div>
          </div>
        </div>

        <h2>2.2 Bittensor Integration</h2>
        <div className="lp-bittensor-diagram">
          <div className="lp-bt-layer lp-bt-root">
            <h4>Bittensor Root Network</h4>
            <p>TAO emissions distributed to subnets based on Taoflow ranking</p>
          </div>
          <div className="lp-bt-arrow">↓</div>
          <div className="lp-bt-layer lp-bt-subnet">
            <h4>QUANTA Subnet (SN-X)</h4>
            <div className="lp-bt-split">
              <div className="lp-bt-segment lp-bt-owner">
                <span className="lp-bt-pct">18%</span>
                <span className="lp-bt-label">Subnet Owner</span>
              </div>
              <div className="lp-bt-segment lp-bt-miners">
                <span className="lp-bt-pct">41%</span>
                <span className="lp-bt-label">Miners</span>
              </div>
              <div className="lp-bt-segment lp-bt-validators">
                <span className="lp-bt-pct">41%</span>
                <span className="lp-bt-label">Validators</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-consensus-box">
          <h4>Yuma Consensus</h4>
          <div className="lp-formula">
            W̄ⱼ = argmax<sub>w</sub>(Σ<sub>i</sub> S<sub>i</sub> × {'{'}W<sub>ij</sub> ≥ w{'}'} ≥ κ)
          </div>
          <p>
            Stake-weighted median calculation with κ=0.67 threshold. Weights exceeding consensus
            are clipped to median, preventing validator-miner collusion.
          </p>
        </div>
      </div>
    </section>
  );

  const SignalPoolSection = () => (
    <section id="signal-pool" className="lp-section">
      <div className="lp-container">
        <div className="lp-section-marker">3. SIGNAL POOL ARCHITECTURE</div>

        <h2>Solving the 256 UID Limitation</h2>
        <p className="lp-lead">
          Bittensor subnets are architecturally constrained to 256 UIDs. QUANTA's Signal Pool
          decouples signal submission from on-chain registration, enabling unlimited participation.
        </p>

        <div className="lp-pool-diagram">
          <div className="lp-pool-layer lp-pool-offchain">
            <div className="lp-pool-header">
              <span className="lp-pool-icon">☁️</span>
              <h4>Off-Chain Layer: Signal Pool</h4>
              <span className="lp-pool-badge">UNLIMITED</span>
            </div>
            <ul>
              <li>Permissionless signal submission</li>
              <li>α-token staking (ante)</li>
              <li>Track record storage & verification</li>
              <li>No UID required to participate</li>
            </ul>
          </div>

          <div className="lp-pool-connector">
            <div className="lp-connector-line"></div>
            <span className="lp-connector-label">Aggregation & Attribution</span>
            <div className="lp-connector-line"></div>
          </div>

          <div className="lp-pool-layer lp-pool-onchain">
            <div className="lp-pool-header">
              <span className="lp-pool-icon">⛓️</span>
              <h4>On-Chain Layer: Bittensor Subnet</h4>
              <span className="lp-pool-badge">256 UIDs</span>
            </div>
            <div className="lp-pool-slots">
              <div className="lp-slot">
                <span className="lp-slot-count">~50</span>
                <span className="lp-slot-label">Solo Miners</span>
              </div>
              <div className="lp-slot">
                <span className="lp-slot-count">~100</span>
                <span className="lp-slot-label">Pool Operators</span>
              </div>
              <div className="lp-slot">
                <span className="lp-slot-count">~64</span>
                <span className="lp-slot-label">Validators</span>
              </div>
            </div>
          </div>
        </div>

        <h2>Reward Flow</h2>
        <div className="lp-reward-flow">
          <div className="lp-flow-item">
            <div className="lp-flow-icon lp-flow-solo">🏆</div>
            <h4>Solo Miners</h4>
            <p>100% of rewards</p>
            <span className="lp-flow-note">Direct UID holders</span>
          </div>
          <div className="lp-flow-arrow">→</div>
          <div className="lp-flow-item">
            <div className="lp-flow-icon lp-flow-pool">🏊</div>
            <h4>Pool Members</h4>
            <p>85-90% after fee</p>
            <span className="lp-flow-note">Via pool operator</span>
          </div>
          <div className="lp-flow-arrow">→</div>
          <div className="lp-flow-item">
            <div className="lp-flow-icon lp-flow-operator">📊</div>
            <h4>Pool Operators</h4>
            <p>10-15% fee</p>
            <span className="lp-flow-note">Aggregation service</span>
          </div>
        </div>

        <h2>Progression System</h2>
        <div className="lp-progression">
          <div className="lp-prog-step">
            <span className="lp-prog-num">1</span>
            <h4>New Participant</h4>
            <p>Join Signal Pool, stake ante, submit signals</p>
          </div>
          <div className="lp-prog-arrow">→</div>
          <div className="lp-prog-step">
            <span className="lp-prog-num">2</span>
            <h4>Qualified Generator</h4>
            <p>60-day track record, top 30% performance</p>
          </div>
          <div className="lp-prog-arrow">→</div>
          <div className="lp-prog-step">
            <span className="lp-prog-num">3</span>
            <h4>Pool Operator</h4>
            <p>UID + reputation, aggregate others</p>
          </div>
          <div className="lp-prog-arrow">→</div>
          <div className="lp-prog-step lp-prog-highlight">
            <span className="lp-prog-num">4</span>
            <h4>Solo Miner</h4>
            <p>90-day track record, top 10%</p>
          </div>
        </div>
      </div>
    </section>
  );

  const SignalSpecSection = () => (
    <section id="signal-spec" className="lp-section lp-section-alt">
      <div className="lp-container">
        <div className="lp-section-marker">4. SIGNAL SPECIFICATION</div>

        <h2>Portfolio Signal Format</h2>
        <div className="lp-code-block">
          <div className="lp-code-header">JSON Signal Schema</div>
          <pre>{`{
  "epoch_id": "2025-Q4-W47",
  "miner_hotkey": "5GrwvaEF...",
  "timestamp": "2025-11-26T16:00:00Z",
  "tickers": ["AAPL", "GOOGL", "MSFT", "AMZN", "NVDA",
              "META", "TSLA", "BRK.B", "UNH", "JNJ"],
  "weights": [0.10, 0.10, 0.10, 0.10, 0.10,
              0.10, 0.10, 0.10, 0.10, 0.10],
  "ante_amount": 50.0,
  "ante_token": "ALPHA",
  "commitment_hash": "0x7f83b1657ff1fc53b92dc18148a1d6...",
  "portfolio_hash": "0xa591a6d40bf420404a011733cfb7b1..."
}`}</pre>
        </div>

        <h2>Signal Constraints</h2>
        <table className="lp-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Specification</th>
              <th>Governance</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Portfolio Size</td><td>1+ tickers (miner's choice)</td><td>Flexible</td></tr>
            <tr><td>Weight Sum</td><td>Must equal 1.0 (±0.001)</td><td>Fixed</td></tr>
            <tr><td>Eligible Universe</td><td>Any ticker with validator price feed</td><td>Validator-dependent</td></tr>
            <tr><td>Position Concentration</td><td>0-100% per ticker (miner's choice)</td><td>Flexible</td></tr>
            <tr><td>Ante Amount</td><td>Any amount &gt; 0 α-tokens</td><td>Flexible</td></tr>
            <tr><td>Short Positions</td><td>Disabled in v1.0 (planned v2.0)</td><td>Tunable</td></tr>
          </tbody>
        </table>

        <h2>Commit-Reveal Protocol</h2>
        <div className="lp-commit-reveal">
          <div className="lp-cr-step">
            <div className="lp-cr-phase">COMMIT</div>
            <div className="lp-cr-content">
              <div className="lp-formula-small">
                H_commit = keccak256(H_portfolio || salt || miner_addr || chain_id || epoch_id)
              </div>
              <p>Submit cryptographic hash of portfolio signal</p>
            </div>
          </div>
          <div className="lp-cr-arrow">→</div>
          <div className="lp-cr-step">
            <div className="lp-cr-phase">DELAY</div>
            <div className="lp-cr-content">
              <p><strong>Minimum:</strong> 6 hours</p>
              <p><strong>Maximum:</strong> 48 hours</p>
              <p><strong>Recommended:</strong> 14+ hours</p>
            </div>
          </div>
          <div className="lp-cr-arrow">→</div>
          <div className="lp-cr-step">
            <div className="lp-cr-phase">REVEAL</div>
            <div className="lp-cr-content">
              <p>Submit plaintext portfolio signal</p>
              <p>Validators verify hash matches commitment</p>
            </div>
          </div>
        </div>

        <div className="lp-security-notes">
          <h4>Security Requirements</h4>
          <ul>
            <li><strong>MUST use <code>block.number</code></strong> — not <code>block.timestamp</code> (miners can manipulate timestamps)</li>
            <li><strong>MUST include <code>msg.sender</code></strong> — prevents commitment copying by other miners</li>
            <li><strong>MUST include <code>chainId</code></strong> — prevents cross-chain replay attacks</li>
            <li><strong>Secret salt MUST be cryptographically random</strong> — not pseudo-random</li>
            <li>Commitment expires after 48-hour reveal window</li>
            <li>Late reveals forfeit ante stake</li>
          </ul>
        </div>
      </div>
    </section>
  );

  const EvaluationSection = () => (
    <section id="evaluation" className="lp-section">
      <div className="lp-container">
        <div className="lp-section-marker">5. EVALUATION METHODOLOGY</div>

        <h2>Multi-Horizon Framework</h2>
        <p className="lp-lead">
          QUANTA evaluates portfolios across three rolling time windows, ensuring miners cannot
          optimize for a single timeframe while genuinely skilled strategies demonstrate consistency.
        </p>

        <div className="lp-horizons">
          <div className="lp-horizon-card">
            <div className="lp-horizon-header">
              <span className="lp-horizon-days">7</span>
              <span className="lp-horizon-unit">Days</span>
            </div>
            <div className="lp-horizon-weight">20%</div>
            <div className="lp-horizon-emphasis">Short-term momentum</div>
          </div>
          <div className="lp-horizon-card">
            <div className="lp-horizon-header">
              <span className="lp-horizon-days">30</span>
              <span className="lp-horizon-unit">Days</span>
            </div>
            <div className="lp-horizon-weight">35%</div>
            <div className="lp-horizon-emphasis">Monthly consistency</div>
          </div>
          <div className="lp-horizon-card lp-horizon-primary">
            <div className="lp-horizon-header">
              <span className="lp-horizon-days">90</span>
              <span className="lp-horizon-unit">Days</span>
            </div>
            <div className="lp-horizon-weight">45%</div>
            <div className="lp-horizon-emphasis">Quarterly persistence (PRIMARY)</div>
          </div>
        </div>

        <h2>Interactive Scoring Engine</h2>
        <p>Adjust the metrics below to see how your QUANTA Score is calculated. Metric weights shown are reference values—actual weights are governance-tunable:</p>

        <div className="lp-scoring-interactive">
          <div className="lp-scoring-inputs">
            <div className="lp-input-group">
              <label>
                <span className="lp-input-label">Sharpe Ratio</span>
                <span className="lp-input-weight">(40% weight - PRIMARY)</span>
              </label>
              <div className="lp-slider-row">
                <input
                  type="range"
                  min="-1"
                  max="3"
                  step="0.1"
                  value={scoringInputs.sharpeRatio}
                  onChange={(e) => setScoringInputs(prev => ({...prev, sharpeRatio: parseFloat(e.target.value)}))}
                />
                <span className="lp-slider-value">{scoringInputs.sharpeRatio.toFixed(1)}</span>
              </div>
              <div className="lp-input-formula">Sharpe = (R<sub>p</sub> - R<sub>f</sub>) / σ</div>
            </div>

            <div className="lp-input-group">
              <label>
                <span className="lp-input-label">Total P/L %</span>
                <span className="lp-input-weight">(20% weight)</span>
              </label>
              <div className="lp-slider-row">
                <input
                  type="range"
                  min="-20"
                  max="40"
                  step="1"
                  value={scoringInputs.totalPnL}
                  onChange={(e) => setScoringInputs(prev => ({...prev, totalPnL: parseFloat(e.target.value)}))}
                />
                <span className="lp-slider-value">{scoringInputs.totalPnL.toFixed(0)}%</span>
              </div>
              <div className="lp-input-formula">P/L = (V<sub>n</sub> - V<sub>0</sub>) / V<sub>0</sub></div>
            </div>

            <div className="lp-input-group">
              <label>
                <span className="lp-input-label">Max Drawdown %</span>
                <span className="lp-input-weight">(15% weight)</span>
              </label>
              <div className="lp-slider-row">
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={scoringInputs.maxDrawdown}
                  onChange={(e) => setScoringInputs(prev => ({...prev, maxDrawdown: parseFloat(e.target.value)}))}
                />
                <span className="lp-slider-value">{scoringInputs.maxDrawdown.toFixed(1)}%</span>
              </div>
              <div className="lp-input-formula">DD_Score = 1 - (MaxDD / 25%)</div>
            </div>

            <div className="lp-input-group">
              <label>
                <span className="lp-input-label">Sortino Ratio</span>
                <span className="lp-input-weight">(10% weight)</span>
              </label>
              <div className="lp-slider-row">
                <input
                  type="range"
                  min="-1"
                  max="3"
                  step="0.1"
                  value={scoringInputs.sortinoRatio}
                  onChange={(e) => setScoringInputs(prev => ({...prev, sortinoRatio: parseFloat(e.target.value)}))}
                />
                <span className="lp-slider-value">{scoringInputs.sortinoRatio.toFixed(1)}</span>
              </div>
              <div className="lp-input-formula">Sortino = (R<sub>p</sub> - R<sub>f</sub>) / σ<sub>d</sub></div>
            </div>

            <div className="lp-input-group">
              <label>
                <span className="lp-input-label">Calmar Ratio</span>
                <span className="lp-input-weight">(10% weight)</span>
              </label>
              <div className="lp-slider-row">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={scoringInputs.calmarRatio}
                  onChange={(e) => setScoringInputs(prev => ({...prev, calmarRatio: parseFloat(e.target.value)}))}
                />
                <span className="lp-slider-value">{scoringInputs.calmarRatio.toFixed(1)}</span>
              </div>
              <div className="lp-input-formula">Calmar = Annual Return / MaxDD</div>
            </div>

            <div className="lp-input-group">
              <label>
                <span className="lp-input-label">Turnover %</span>
                <span className="lp-input-weight">(5% weight)</span>
              </label>
              <div className="lp-slider-row">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={scoringInputs.turnoverPercent}
                  onChange={(e) => setScoringInputs(prev => ({...prev, turnoverPercent: parseFloat(e.target.value)}))}
                />
                <span className="lp-slider-value">{scoringInputs.turnoverPercent}%</span>
              </div>
              <div className="lp-input-formula">Turn_Score = 1 - (Turn / 100%)</div>
            </div>
          </div>

          <div className="lp-scoring-output">
            <div className="lp-score-breakdown">
              <div className="lp-score-bar">
                <span className="lp-bar-label">Sharpe (40%)</span>
                <div className="lp-bar-track"><div className="lp-bar-fill lp-bar-primary" style={{width: `${qsResults.sharpeNorm}%`}}></div></div>
                <span className="lp-bar-value">{qsResults.sharpeNorm}%</span>
              </div>
              <div className="lp-score-bar">
                <span className="lp-bar-label">P/L (20%)</span>
                <div className="lp-bar-track"><div className="lp-bar-fill" style={{width: `${qsResults.pnlNorm}%`}}></div></div>
                <span className="lp-bar-value">{qsResults.pnlNorm}%</span>
              </div>
              <div className="lp-score-bar">
                <span className="lp-bar-label">MaxDD (15%)</span>
                <div className="lp-bar-track"><div className="lp-bar-fill" style={{width: `${qsResults.ddScore}%`}}></div></div>
                <span className="lp-bar-value">{qsResults.ddScore}%</span>
              </div>
              <div className="lp-score-bar">
                <span className="lp-bar-label">Sortino (10%)</span>
                <div className="lp-bar-track"><div className="lp-bar-fill" style={{width: `${qsResults.sortinoNorm}%`}}></div></div>
                <span className="lp-bar-value">{qsResults.sortinoNorm}%</span>
              </div>
              <div className="lp-score-bar">
                <span className="lp-bar-label">Calmar (10%)</span>
                <div className="lp-bar-track"><div className="lp-bar-fill" style={{width: `${qsResults.calmarNorm}%`}}></div></div>
                <span className="lp-bar-value">{qsResults.calmarNorm}%</span>
              </div>
              <div className="lp-score-bar">
                <span className="lp-bar-label">Turnover (5%)</span>
                <div className="lp-bar-track"><div className="lp-bar-fill" style={{width: `${qsResults.turnoverScore}%`}}></div></div>
                <span className="lp-bar-value">{qsResults.turnoverScore}%</span>
              </div>
            </div>

            <div className="lp-composite-result">
              <div className="lp-composite-label">Composite QUANTA Score</div>
              <div className="lp-composite-value">{qsResults.compositeQS}%</div>
              <div className={`lp-composite-tier lp-tier-${qsResults.tier}`}>{qsResults.percentile}</div>
            </div>

            <div className="lp-formula-box">
              <code>QS = 0.40×Sharpe + 0.20×P/L + 0.15×DD + 0.10×Sortino + 0.10×Calmar + 0.05×Turn</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const ConsensusSection = () => (
    <section id="consensus" className="lp-section lp-section-alt">
      <div className="lp-container">
        <div className="lp-section-marker">6. CONSENSUS & REWARDS</div>

        <h2>Validator Consensus</h2>
        <div className="lp-consensus-detail">
          <div className="lp-formula-large">
            W̄<sub>j</sub> = argmax<sub>w</sub>(Σ<sub>i∈V</sub> S<sub>i</sub> × {'{'}W<sub>ij</sub> ≥ w{'}'} ≥ κ)
          </div>
          <div className="lp-consensus-explain">
            <p><strong>κ = 0.67</strong> (consensus threshold)</p>
            <p>Weights exceeding consensus are clipped to median, preventing validator-miner collusion.</p>
          </div>
        </div>

        <h2>Power-Law Reward Distribution</h2>
        <p>
          Top performers earn disproportionately higher rewards. Adjust γ to see the effect:
        </p>

        <div className="lp-reward-interactive">
          <div className="lp-gamma-control">
            <label>Power-Law Exponent (γ)</label>
            <div className="lp-slider-row">
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={tokenModel.powerLawGamma}
                onChange={(e) => setTokenModel(prev => ({...prev, powerLawGamma: parseFloat(e.target.value)}))}
              />
              <span className="lp-slider-value">{tokenModel.powerLawGamma.toFixed(1)}</span>
            </div>
            <div className="lp-gamma-note">
              Higher γ = more concentration at top ranks
            </div>
          </div>

          <div className="lp-reward-chart">
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={rewardData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="rank" stroke="rgba(255,255,255,0.5)" fontSize={12} label={{ value: 'Rank', position: 'bottom', fill: 'rgba(255,255,255,0.5)' }} />
                <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px' }}
                  labelStyle={{ color: '#d4af37' }}
                />
                <Bar yAxisId="left" dataKey="share" fill="rgba(212,175,55,0.7)" name="Reward Share %" />
                <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#22c55e" strokeWidth={2} dot={false} name="Cumulative %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lp-formula-box">
          <code>Reward<sub>i</sub> = R<sub>total</sub> × (rank<sub>i</sub>)<sup>-γ</sup> / Σ<sub>j</sub> (rank<sub>j</sub>)<sup>-γ</sup></code>
        </div>

        <h2>Oracle Pricing</h2>
        <div className="lp-oracle-box">
          <div className="lp-formula-small">
            final_price = weighted_median(TWAP<sub>24h</sub> × 0.5, Primary × 0.3, Volume_Weighted_Spot × 0.2)
          </div>
          <div className="lp-oracle-sources">
            <span>Primary: Tiingo</span>
            <span>Secondary: Polygon.io</span>
            <span>Tertiary: NYSE/NASDAQ Official</span>
          </div>
        </div>
      </div>
    </section>
  );

  const TokenomicsSection = () => (
    <section id="tokenomics" className="lp-section">
      <div className="lp-container">
        <div className="lp-section-marker">7. TOKENOMICS</div>

        <h2>Native α-Token</h2>
        <div className="lp-token-specs">
          <table className="lp-table lp-table-compact">
            <tbody>
              <tr><td>Symbol</td><td><strong>QALPHA (α)</strong></td></tr>
              <tr><td>Maximum Supply</td><td>21,000,000</td></tr>
              <tr><td>Emission</td><td>Performance-based only</td></tr>
              <tr><td>Primary Functions</td><td>Staking, Ante, Access, Governance</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Emission Distribution</h2>
        <div className="lp-emission-visual">
          <div className="lp-emission-bar">
            <div className="lp-em-seg lp-em-owner" style={{width: '18%'}}>
              <span>18%</span>
            </div>
            <div className="lp-em-seg lp-em-miners" style={{width: '41%'}}>
              <span>41%</span>
            </div>
            <div className="lp-em-seg lp-em-validators" style={{width: '41%'}}>
              <span>41%</span>
            </div>
          </div>
          <div className="lp-emission-legend">
            <span><span className="lp-dot lp-dot-owner"></span>Subnet Owner</span>
            <span><span className="lp-dot lp-dot-miners"></span>Miners</span>
            <span><span className="lp-dot lp-dot-validators"></span>Validators</span>
          </div>
        </div>

        <h2>Deflationary Mechanics</h2>
        <div className="lp-defl-grid">
          <div className="lp-defl-item">
            <span className="lp-defl-icon">🔥</span>
            <div className="lp-defl-content">
              <strong>Burn on Failure</strong>
              <p>50% of forfeited ante permanently burned</p>
            </div>
          </div>
          <div className="lp-defl-item">
            <span className="lp-defl-icon">💀</span>
            <div className="lp-defl-content">
              <strong>Unclaimed Burns</strong>
              <p>Undistributed rewards destroyed</p>
            </div>
          </div>
          <div className="lp-defl-item">
            <span className="lp-defl-icon">💰</span>
            <div className="lp-defl-content">
              <strong>Revenue Buy-and-Burn</strong>
              <p>50% of external revenue burns tokens quarterly</p>
            </div>
          </div>
          <div className="lp-defl-item">
            <span className="lp-defl-icon">📉</span>
            <div className="lp-defl-content">
              <strong>Network Fee Burn</strong>
              <p>25% of 2% network fee burned</p>
            </div>
          </div>
        </div>

        <h2>Revenue Streams</h2>
        <div className="lp-revenue-cards">
          <div className="lp-rev-card">
            <h4>Signals API</h4>
            <div className="lp-rev-tiers">
              <span>Basic: $5K/mo</span>
              <span>Pro: $25K/mo</span>
              <span>Enterprise: $100K+/mo</span>
            </div>
          </div>
          <div className="lp-rev-card">
            <h4>Education & Training</h4>
            <p>Courses, webinars, certifications</p>
          </div>
          <div className="lp-rev-card">
            <h4>Talent Scouting</h4>
            <p>25-35% recruitment fee arbitrage</p>
          </div>
          <div className="lp-rev-card">
            <h4>Strategy Licensing</h4>
            <p>5-20 bps on licensed AUM</p>
          </div>
        </div>
      </div>
    </section>
  );

  const SecuritySection = () => (
    <section id="security" className="lp-section lp-section-alt">
      <div className="lp-container">
        <div className="lp-section-marker">8. SECURITY & ANTI-GAMING</div>

        <h2>Attack Vectors & Countermeasures</h2>
        <div className="lp-security-grid">
          <div className="lp-sec-card">
            <h4>🎲 Swinging for the Fences</h4>
            <div className="lp-sec-attack">Maximize variance hoping for lucky win</div>
            <div className="lp-sec-defense">
              <strong>Defense:</strong> Ante stake + ±5% capped payouts + Sortino emphasis
            </div>
          </div>

          <div className="lp-sec-card">
            <h4>📊 Correlation Gaming</h4>
            <div className="lp-sec-attack">Copy consensus portfolio to minimize loss</div>
            <div className="lp-sec-defense">
              <strong>Defense:</strong> MMC originality scoring, &gt;0.7 correlation penalty
            </div>
          </div>

          <div className="lp-sec-card">
            <h4>👥 Strategy Cloning</h4>
            <div className="lp-sec-attack">Copy successful strategies after reveal</div>
            <div className="lp-sec-defense">
              <strong>Defense:</strong> 7+ day scoring delay, 90% overlap rejection, blacklist
            </div>
          </div>

          <div className="lp-sec-card">
            <h4>🔄 Churn Manipulation</h4>
            <div className="lp-sec-attack">Frequent updates to chase momentum</div>
            <div className="lp-sec-defense">
              <strong>Defense:</strong> Churn penalty formula, window reset
            </div>
          </div>

          <div className="lp-sec-card">
            <h4>👻 Sybil Attacks</h4>
            <div className="lp-sec-attack">Multiple identities to game distribution</div>
            <div className="lp-sec-defense">
              <strong>Defense:</strong> Stake requirements, 60-day track record, 0.5α burn
            </div>
          </div>

          <div className="lp-sec-card">
            <h4>🏃 Front-Running</h4>
            <div className="lp-sec-attack">Copy signals before evaluation</div>
            <div className="lp-sec-defense">
              <strong>Defense:</strong> Commit-reveal 14h+ delay, encrypted mempools
            </div>
          </div>
        </div>

        <h2>Validator Slashing</h2>
        <table className="lp-table">
          <thead>
            <tr><th>Violation</th><th>Penalty</th></tr>
          </thead>
          <tbody>
            <tr><td>Missing evaluation window</td><td>0.5% stake slash</td></tr>
            <tr><td>Incorrect score (unintentional)</td><td>1% stake slash</td></tr>
            <tr><td>Detected weight copying</td><td>5% slash + 30-day probation</td></tr>
            <tr><td>Confirmed collusion</td><td>25% slash + permanent ban</td></tr>
            <tr><td>Oracle manipulation attempt</td><td>100% slash + permanent ban</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );

  const RoadmapSection = () => (
    <section id="roadmap" className="lp-section">
      <div className="lp-container">
        <div className="lp-section-marker">9. ROADMAP</div>

        <div className="lp-roadmap-timeline">
          <div className="lp-rm-phase lp-rm-active">
            <div className="lp-rm-header">
              <span className="lp-rm-badge">PHASE 1</span>
              <span className="lp-rm-time">Months 1-6</span>
            </div>
            <h3>Core Infrastructure</h3>
            <ul>
              <li>Subnet registration on Bittensor testnet</li>
              <li>Paper trading engine with multi-source oracles</li>
              <li>Scoring algorithm (Sortino/Calmar/DD)</li>
              <li>Commit-reveal mechanism</li>
              <li>Ante escrow & power-law distribution</li>
              <li>Public testnet launch</li>
            </ul>
          </div>

          <div className="lp-rm-phase">
            <div className="lp-rm-header">
              <span className="lp-rm-badge">PHASE 2</span>
              <span className="lp-rm-time">Months 6-12</span>
            </div>
            <h3>Mainnet Launch</h3>
            <ul>
              <li>Security audit (2+ independent auditors)</li>
              <li>Mainnet deployment</li>
              <li>Signal Pool infrastructure</li>
              <li>Originality scoring (MMC)</li>
              <li>Public leaderboard</li>
            </ul>
          </div>

          <div className="lp-rm-phase">
            <div className="lp-rm-header">
              <span className="lp-rm-badge">PHASE 3</span>
              <span className="lp-rm-time">Months 12-18</span>
            </div>
            <h3>Monetization</h3>
            <ul>
              <li>Signals API ($5K-$100K/mo tiers)</li>
              <li>SaaS analytics platform</li>
              <li>Institutional partnerships</li>
              <li>Buy-and-burn mechanism</li>
            </ul>
          </div>

          <div className="lp-rm-phase">
            <div className="lp-rm-header">
              <span className="lp-rm-badge">PHASE 4</span>
              <span className="lp-rm-time">Months 18+</span>
            </div>
            <h3>Expansion</h3>
            <ul>
              <li>Global equities, ETFs, crypto</li>
              <li>Algorithmic strategy upload</li>
              <li>Strategy Vault licensing</li>
              <li>Full DAO governance</li>
            </ul>
          </div>
        </div>

        <div className="lp-conclusion">
          <h2>Conclusion</h2>
          <p className="lp-lead">
            QUANTA represents a pioneering fusion of decentralized blockchain incentives with the
            rigorous discipline of quantitative trading.
          </p>
          <div className="lp-key-innovations">
            <h4>Key Innovations</h4>
            <ul>
              <li>Signal Pool architecture enabling unlimited participation beyond 256 UIDs</li>
              <li>Multi-horizon evaluation (7/30/90 days) discouraging single-timeframe optimization</li>
              <li>Power-law reward distribution creating meritocratic competition</li>
              <li>Native α-token with performance-based emissions and deflationary mechanics</li>
              <li>Comprehensive anti-gaming measures derived from Numerai and Taoshi SN8</li>
            </ul>
          </div>

          <div className="lp-final-cta">
            <div className="lp-cta-buttons">
              <a href="/docs/QUANTA_Technical_Specification_v5.pdf" className="lp-btn-primary" target="_blank">
                Download Full Technical Spec
              </a>
              <a href="https://discord.gg/quanta" className="lp-btn-secondary" target="_blank" rel="noopener noreferrer">
                Join Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className="lp-wrapper">
      <style>{`
        /* ============================================================================
           QUANTA LITEPAPER STYLES - SN8 STYLE
           ============================================================================ */

        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap');

        .lp-wrapper {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #0a0a0f;
          color: #e0e0e5;
          line-height: 1.7;
          font-size: 16px;
        }

        /* Navigation */
        .lp-nav {
          position: fixed;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .lp-nav-item {
          padding: 0.4rem 0.75rem;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 0.7rem;
          cursor: pointer;
          text-align: left;
          border-left: 2px solid transparent;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .lp-nav-item:hover { color: rgba(255,255,255,0.7); }
        .lp-nav-item.active {
          color: #d4af37;
          border-left-color: #d4af37;
          background: rgba(212,175,55,0.05);
        }

        /* Sections */
        .lp-section {
          min-height: 100vh;
          padding: 6rem 2rem;
        }
        .lp-section-alt {
          background: rgba(255,255,255,0.02);
        }
        .lp-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .lp-section-marker {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: #d4af37;
          margin-bottom: 2rem;
          font-weight: 600;
        }
        .lp-lead {
          font-size: 1.25rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.75rem;
          font-weight: 600;
          margin: 3rem 0 1.5rem;
          color: #fff;
        }
        h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 2rem 0 1rem;
          color: #fff;
        }
        h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem;
          color: rgba(255,255,255,0.9);
        }
        p { margin-bottom: 1rem; color: rgba(255,255,255,0.75); }
        strong { color: #d4af37; }
        ul { margin: 0 0 1rem 1.5rem; color: rgba(255,255,255,0.75); }
        li { margin-bottom: 0.5rem; }
        code {
          font-family: 'JetBrains Mono', monospace;
          background: rgba(212,175,55,0.1);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
          color: #d4af37;
        }

        /* Cover */
        .lp-cover {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%);
        }
        .lp-cover-content { max-width: 700px; }
        .lp-doc-badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: #d4af37;
          margin-bottom: 2rem;
        }
        .lp-doc-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 5rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #f4d03f, #d4af37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-doc-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.7);
          margin: 1rem 0 0.5rem;
        }
        .lp-cover-divider {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          margin: 1.5rem auto;
        }
        .lp-doc-tagline {
          font-size: 1rem;
          color: rgba(255,255,255,0.5);
          font-style: italic;
        }
        .lp-doc-date {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          margin-top: 1rem;
        }
        .lp-cover-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 3rem 0;
        }
        .lp-cover-stat { text-align: center; }
        .lp-stat-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #d4af37;
        }
        .lp-stat-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }
        .lp-cover-cta {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .lp-btn-primary {
          padding: 0.85rem 2rem;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border: none;
          border-radius: 8px;
          color: #0a0a0f;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .lp-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212,175,55,0.3);
        }
        .lp-btn-secondary {
          padding: 0.85rem 2rem;
          background: transparent;
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 8px;
          color: #d4af37;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .lp-btn-secondary:hover { background: rgba(212,175,55,0.1); }

        /* Abstract Innovations */
        .lp-innovations-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 2rem 0;
        }
        .lp-innovation {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        .lp-innovation-num {
          width: 32px;
          height: 32px;
          background: rgba(212,175,55,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          font-weight: 700;
          flex-shrink: 0;
        }
        .lp-innovation-content strong { display: block; color: #fff; margin-bottom: 0.25rem; }
        .lp-innovation-content p { margin: 0; font-size: 0.85rem; }

        .lp-market-context {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02));
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          margin-top: 2rem;
        }
        .lp-market-context p { margin: 0; }

        /* Executive Grid */
        .lp-exec-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .lp-exec-card {
          padding: 1.25rem;
          background: rgba(212,175,55,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 10px;
        }
        .lp-exec-card h4 { margin-top: 0; }
        .lp-exec-card ul { margin: 0; padding-left: 1rem; }
        .lp-exec-card li { margin-bottom: 0.5rem; font-size: 0.9rem; }

        .lp-tech-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .lp-tech-card {
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        .lp-tech-card h4 { margin-top: 0; font-size: 0.95rem; }
        .lp-tech-card ul { margin: 0; padding-left: 1rem; font-size: 0.85rem; }

        .lp-metrics-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .lp-metric {
          text-align: center;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
        }
        .lp-metric-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #d4af37;
        }
        .lp-metric-label {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
        }

        /* Problem Cards */
        .lp-problem-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .lp-problem-card {
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        .lp-problem-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .lp-problem-card h4 { margin: 0 0 0.5rem; }
        .lp-problem-card p { margin: 0; font-size: 0.9rem; }

        .lp-solution-highlight {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02));
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 12px;
          margin: 1.5rem 0;
        }
        .lp-solution-highlight p:last-child { margin: 0; }

        /* Precedent Box */
        .lp-precedent-box {
          padding: 2rem;
          background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02));
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          margin: 2rem 0;
        }
        .lp-precedent-header { margin-bottom: 1.5rem; }
        .lp-precedent-badge {
          display: inline-block;
          padding: 0.3rem 0.75rem;
          background: rgba(212,175,55,0.15);
          border-radius: 4px;
          font-size: 0.7rem;
          color: #d4af37;
          margin-bottom: 0.5rem;
        }
        .lp-precedent-header h3 { margin: 0; }
        .lp-precedent-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .lp-prec-stat { text-align: center; }
        .lp-prec-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #d4af37;
        }
        .lp-prec-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
        .lp-precedent-note { margin: 0; font-size: 0.9rem; }

        /* Roles Grid */
        .lp-roles-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .lp-role-card {
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        .lp-role-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .lp-role-icon { font-size: 1.25rem; }
        .lp-role-header h4 { margin: 0; }
        .lp-role-card p { margin: 0 0 0.75rem; font-size: 0.9rem; }
        .lp-role-capacity {
          font-size: 0.75rem;
          color: #d4af37;
          padding: 0.25rem 0.5rem;
          background: rgba(212,175,55,0.1);
          border-radius: 4px;
          display: inline-block;
        }

        /* Bittensor Diagram */
        .lp-bittensor-diagram {
          margin: 2rem 0;
          text-align: center;
        }
        .lp-bt-layer {
          padding: 1.5rem;
          border-radius: 12px;
          margin: 0.5rem 0;
        }
        .lp-bt-root {
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.3);
        }
        .lp-bt-subnet {
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
        }
        .lp-bt-layer h4 { margin: 0 0 0.5rem; }
        .lp-bt-layer p { margin: 0; font-size: 0.85rem; }
        .lp-bt-arrow {
          font-size: 1.5rem;
          color: rgba(255,255,255,0.3);
          margin: 0.5rem 0;
        }
        .lp-bt-split {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .lp-bt-segment {
          flex: 1;
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
        }
        .lp-bt-owner { background: rgba(212,175,55,0.2); }
        .lp-bt-miners { background: rgba(59,130,246,0.2); }
        .lp-bt-validators { background: rgba(34,197,94,0.2); }
        .lp-bt-pct {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
        }
        .lp-bt-label { font-size: 0.75rem; color: rgba(255,255,255,0.7); }

        .lp-consensus-box {
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          text-align: center;
          margin: 2rem 0;
        }
        .lp-consensus-box h4 { margin: 0 0 1rem; }
        .lp-formula {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.1rem;
          color: #d4af37;
          margin-bottom: 1rem;
        }
        .lp-consensus-box p { margin: 0; }

        /* Pool Diagram */
        .lp-pool-diagram { margin: 2rem 0; }
        .lp-pool-layer {
          padding: 1.5rem;
          border-radius: 12px;
        }
        .lp-pool-offchain {
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.3);
        }
        .lp-pool-onchain {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.3);
        }
        .lp-pool-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .lp-pool-icon { font-size: 1.25rem; }
        .lp-pool-header h4 { margin: 0; flex: 1; }
        .lp-pool-badge {
          padding: 0.25rem 0.75rem;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .lp-pool-layer ul {
          margin: 0;
          padding-left: 1.5rem;
          font-size: 0.9rem;
        }
        .lp-pool-connector {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
        }
        .lp-connector-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.2);
        }
        .lp-connector-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
        }
        .lp-pool-slots {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        .lp-slot {
          flex: 1;
          text-align: center;
          padding: 0.75rem;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
        }
        .lp-slot-count {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          color: #22c55e;
        }
        .lp-slot-label { font-size: 0.75rem; color: rgba(255,255,255,0.6); }

        /* Reward Flow */
        .lp-reward-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }
        .lp-flow-item {
          text-align: center;
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          min-width: 150px;
        }
        .lp-flow-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .lp-flow-item h4 { margin: 0 0 0.25rem; font-size: 0.95rem; }
        .lp-flow-item p { margin: 0; font-weight: 600; color: #d4af37; }
        .lp-flow-note { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
        .lp-flow-arrow { font-size: 1.5rem; color: rgba(255,255,255,0.3); }

        /* Progression */
        .lp-progression {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }
        .lp-prog-step {
          flex: 1;
          min-width: 150px;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          text-align: center;
        }
        .lp-prog-highlight {
          background: rgba(212,175,55,0.08);
          border-color: rgba(212,175,55,0.3);
        }
        .lp-prog-num {
          display: inline-flex;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          background: rgba(212,175,55,0.15);
          border-radius: 50%;
          color: #d4af37;
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .lp-prog-step h4 { margin: 0 0 0.25rem; font-size: 0.9rem; }
        .lp-prog-step p { margin: 0; font-size: 0.75rem; color: rgba(255,255,255,0.6); }
        .lp-prog-arrow { color: rgba(255,255,255,0.3); }

        /* Code Block */
        .lp-code-block {
          margin: 1.5rem 0;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .lp-code-header {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.05);
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .lp-code-block pre {
          margin: 0;
          padding: 1rem;
          background: rgba(0,0,0,0.3);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: #d4af37;
          overflow-x: auto;
          line-height: 1.5;
        }

        /* Tables */
        .lp-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9rem;
        }
        .lp-table th, .lp-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .lp-table th {
          background: rgba(255,255,255,0.03);
          font-weight: 600;
          color: rgba(255,255,255,0.8);
        }
        .lp-table td { color: rgba(255,255,255,0.7); }
        .lp-table-compact td { padding: 0.5rem 1rem; }

        /* Commit-Reveal */
        .lp-commit-reveal {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          flex-wrap: wrap;
        }
        .lp-cr-step {
          flex: 1;
          min-width: 200px;
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        .lp-cr-phase {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: rgba(212,175,55,0.15);
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #d4af37;
          margin-bottom: 0.75rem;
        }
        .lp-cr-content p { margin: 0.25rem 0; font-size: 0.9rem; }
        .lp-formula-small {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: #d4af37;
          margin-bottom: 0.5rem;
        }
        .lp-cr-arrow { color: rgba(255,255,255,0.3); font-size: 1.25rem; }

        .lp-security-notes {
          padding: 1rem 1.25rem;
          background: rgba(239,68,68,0.05);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          margin-top: 1.5rem;
        }
        .lp-security-notes h4 { margin: 0 0 0.75rem; color: #ef4444; }
        .lp-security-notes ul { margin: 0; padding-left: 1.25rem; }
        .lp-security-notes li { font-size: 0.85rem; margin-bottom: 0.25rem; }

        /* Horizons */
        .lp-horizons {
          display: flex;
          gap: 1rem;
          margin: 2rem 0;
        }
        .lp-horizon-card {
          flex: 1;
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          text-align: center;
        }
        .lp-horizon-primary {
          background: rgba(212,175,55,0.08);
          border-color: rgba(212,175,55,0.3);
        }
        .lp-horizon-header {
          margin-bottom: 0.5rem;
        }
        .lp-horizon-days {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #d4af37;
        }
        .lp-horizon-unit {
          font-size: 1rem;
          color: rgba(255,255,255,0.5);
          margin-left: 0.25rem;
        }
        .lp-horizon-weight {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0.5rem 0;
        }
        .lp-horizon-emphasis {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
        }

        /* Scoring Interactive */
        .lp-scoring-interactive {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }
        .lp-scoring-inputs {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .lp-input-group label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .lp-input-label { font-weight: 500; }
        .lp-input-weight { font-size: 0.8rem; color: #d4af37; }
        .lp-slider-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .lp-slider-row input[type="range"] {
          flex: 1;
          height: 6px;
          -webkit-appearance: none;
          background: rgba(255,255,255,0.15);
          border-radius: 3px;
          outline: none;
        }
        .lp-slider-row input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d4af37;
          cursor: grab;
        }
        .lp-slider-value {
          min-width: 50px;
          text-align: right;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          color: #d4af37;
        }
        .lp-input-formula {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          margin-top: 0.25rem;
        }

        .lp-scoring-output {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .lp-score-breakdown {
          margin-bottom: 1.5rem;
        }
        .lp-score-bar {
          display: grid;
          grid-template-columns: 80px 1fr 50px;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .lp-bar-label { font-size: 0.85rem; color: rgba(255,255,255,0.7); }
        .lp-bar-track {
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .lp-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #f4d03f);
          border-radius: 4px;
          transition: width 0.3s;
        }
        .lp-bar-value {
          font-size: 0.8rem;
          font-family: 'JetBrains Mono', monospace;
          text-align: right;
        }

        .lp-composite-result {
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.02));
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 10px;
          margin-bottom: 1rem;
        }
        .lp-composite-label { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
        .lp-composite-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3rem;
          font-weight: 700;
          color: #d4af37;
        }
        .lp-composite-tier {
          display: inline-block;
          padding: 0.3rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }
        .lp-tier-top { background: rgba(34,197,94,0.2); color: #22c55e; }
        .lp-tier-profitable { background: rgba(59,130,246,0.2); color: #3b82f6; }
        .lp-tier-breakeven { background: rgba(156,163,175,0.2); color: #9ca3af; }
        .lp-tier-penalty { background: rgba(239,68,68,0.2); color: #ef4444; }

        .lp-formula-box {
          text-align: center;
          padding: 1rem;
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
        }
        .lp-formula-box code {
          background: transparent;
          padding: 0;
        }

        /* Consensus Detail */
        .lp-consensus-detail {
          text-align: center;
          padding: 2rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          margin: 1.5rem 0;
        }
        .lp-formula-large {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.25rem;
          color: #d4af37;
          margin-bottom: 1rem;
        }
        .lp-consensus-explain p { margin: 0.25rem 0; }

        /* Reward Interactive */
        .lp-reward-interactive {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          margin: 1.5rem 0;
        }
        .lp-gamma-control {
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        .lp-gamma-control label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }
        .lp-gamma-note {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          margin-top: 0.5rem;
        }
        .lp-reward-chart {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 1rem;
        }

        .lp-oracle-box {
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          text-align: center;
          margin: 1.5rem 0;
        }
        .lp-oracle-sources {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
        }

        /* Tokenomics */
        .lp-token-specs {
          max-width: 400px;
          margin: 1.5rem 0;
        }
        .lp-emission-visual { margin: 1.5rem 0; }
        .lp-emission-bar {
          display: flex;
          height: 40px;
          border-radius: 8px;
          overflow: hidden;
        }
        .lp-em-seg {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #fff;
        }
        .lp-em-owner { background: linear-gradient(135deg, #d4af37, #f4d03f); }
        .lp-em-miners { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
        .lp-em-validators { background: linear-gradient(135deg, #22c55e, #4ade80); }
        .lp-emission-legend {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1rem;
          font-size: 0.85rem;
        }
        .lp-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 0.5rem;
        }
        .lp-dot-owner { background: #d4af37; }
        .lp-dot-miners { background: #3b82f6; }
        .lp-dot-validators { background: #22c55e; }

        .lp-defl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .lp-defl-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: rgba(249,115,22,0.05);
          border: 1px solid rgba(249,115,22,0.2);
          border-radius: 10px;
        }
        .lp-defl-icon { font-size: 1.5rem; }
        .lp-defl-content strong { display: block; margin-bottom: 0.25rem; }
        .lp-defl-content p { margin: 0; font-size: 0.85rem; }

        .lp-revenue-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .lp-rev-card {
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        .lp-rev-card h4 { margin: 0 0 0.5rem; }
        .lp-rev-card p { margin: 0; font-size: 0.85rem; }
        .lp-rev-tiers {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
        }

        /* Security Grid */
        .lp-security-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .lp-sec-card {
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
        }
        .lp-sec-card h4 { margin: 0 0 0.75rem; }
        .lp-sec-attack {
          padding: 0.5rem;
          background: rgba(239,68,68,0.1);
          border-radius: 6px;
          font-size: 0.85rem;
          color: #ef4444;
          margin-bottom: 0.75rem;
        }
        .lp-sec-defense { font-size: 0.85rem; }
        .lp-sec-defense strong { color: #22c55e; }

        /* Roadmap */
        .lp-roadmap-timeline {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .lp-rm-phase {
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
        }
        .lp-rm-active {
          background: rgba(212,175,55,0.08);
          border-color: rgba(212,175,55,0.3);
        }
        .lp-rm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .lp-rm-badge {
          padding: 0.25rem 0.75rem;
          background: rgba(212,175,55,0.15);
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #d4af37;
        }
        .lp-rm-time { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
        .lp-rm-phase h3 { margin: 0 0 0.75rem; font-size: 1.1rem; }
        .lp-rm-phase ul { margin: 0; padding-left: 1.25rem; font-size: 0.85rem; }

        /* Conclusion */
        .lp-conclusion {
          margin-top: 3rem;
          padding-top: 3rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .lp-key-innovations {
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          margin: 1.5rem 0;
        }
        .lp-key-innovations h4 { margin: 0 0 1rem; }
        .lp-key-innovations ul { margin: 0; }

        .lp-final-cta {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.02));
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          margin-top: 2rem;
        }
        .lp-final-cta p {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 1.5rem;
        }
        .lp-cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .lp-nav { display: none; }
          .lp-exec-grid { grid-template-columns: 1fr; }
          .lp-tech-cards { grid-template-columns: 1fr; }
          .lp-metrics-grid { grid-template-columns: repeat(3, 1fr); }
          .lp-scoring-interactive { grid-template-columns: 1fr; }
          .lp-reward-interactive { grid-template-columns: 1fr; }
          .lp-roadmap-timeline { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .lp-section { padding: 4rem 1rem; }
          .lp-doc-title { font-size: 3rem; }
          .lp-cover-stats { flex-direction: column; gap: 1.5rem; }
          .lp-innovations-grid { grid-template-columns: 1fr; }
          .lp-problem-grid { grid-template-columns: 1fr; }
          .lp-roles-grid { grid-template-columns: 1fr; }
          .lp-precedent-stats { grid-template-columns: repeat(2, 1fr); }
          .lp-horizons { flex-direction: column; }
          .lp-metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-security-grid { grid-template-columns: 1fr; }
          .lp-defl-grid { grid-template-columns: 1fr; }
          .lp-revenue-cards { grid-template-columns: 1fr; }
          .lp-cta-buttons { flex-direction: column; }
        }
      `}</style>

      {/* Navigation */}
      <nav className="lp-nav">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={`lp-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => scrollTo(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Sections */}
      <CoverSection />
      <AbstractSection />
      <ExecutiveSection />
      <IntroductionSection />
      <ArchitectureSection />
      <SignalPoolSection />
      <SignalSpecSection />
      <EvaluationSection />
      <ConsensusSection />
      <TokenomicsSection />
      <SecuritySection />
      <RoadmapSection />
    </div>
  );
};

export default QuantaLitepaper;
