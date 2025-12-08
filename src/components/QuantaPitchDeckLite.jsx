import React, { useState, useEffect, useCallback, useRef } from 'react';

const QuantaPitchDeckLite = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const isDraggingSlider = useRef(false);
  const slideContainerRef = useRef(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const navDropdownRef = useRef(null);

  // Track which slides have completed their animation to prevent re-triggering
  const animatedSlidesRef = useRef(new Set());
  const [slideAnimated, setSlideAnimated] = useState(false);

  // Track if scroll indicator has been shown for current slide (show once per slide visit)
  const scrollIndicatorShownRef = useRef(new Set());
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const slides = [
    'intro',
    'problem',
    'stockMarketGame',
    'precedents',
    'solution',
    'howItWorks',
    'signalPool',
    'rewardSystem',
    'whyBittensor',
    'participants',
    'roadmap',
    'summary'
  ];

  const slideNames = [
    'Intro',
    'Problem',
    'The Game',
    'Precedents',
    'Solution',
    'How It Works',
    'Signal Pool',
    'Rewards',
    'Why Bittensor',
    'Participants',
    'Roadmap',
    'Summary'
  ];

  // Debounce ref for scroll state updates
  const scrollCheckTimeout = useRef(null);

  // Check if slide content is scrollable (debounced to prevent flashing)
  const checkScrollState = useCallback(() => {
    const container = slideContainerRef.current;
    if (!container) return;

    // Clear any pending timeout
    if (scrollCheckTimeout.current) {
      clearTimeout(scrollCheckTimeout.current);
    }

    // Debounce the state update to prevent flashing
    scrollCheckTimeout.current = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10);
    }, 50);
  }, []);

  // Reset scroll position when slide changes
  useEffect(() => {
    const container = slideContainerRef.current;
    if (container) {
      container.scrollTop = 0;
    }
    setNavDropdownOpen(false);
    setScrollIndicatorVisible(false);

    // For new slides, animate; for already-visited slides, skip animation
    const alreadyAnimated = animatedSlidesRef.current.has(currentSlide);
    setSlideAnimated(alreadyAnimated);

    // Check scroll state and show indicator after content renders
    const scrollCheckTimer = setTimeout(() => {
      checkScrollState();
      const container = slideContainerRef.current;
      if (container && !scrollIndicatorShownRef.current.has(currentSlide)) {
        const { scrollHeight, clientHeight } = container;
        if (scrollHeight > clientHeight + 10) {
          setScrollIndicatorVisible(true);
          scrollIndicatorShownRef.current.add(currentSlide);
          setTimeout(() => setScrollIndicatorVisible(false), 3000);
        }
      }
    }, 300);

    if (!alreadyAnimated) {
      const timer = setTimeout(() => {
        animatedSlidesRef.current.add(currentSlide);
        setSlideAnimated(true);
      }, 650);
      return () => {
        clearTimeout(timer);
        clearTimeout(scrollCheckTimer);
      };
    }
    return () => clearTimeout(scrollCheckTimer);
  }, [currentSlide, checkScrollState]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setNavDropdownOpen(false);
      }
    };
    if (navDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    let wheelTimeout = null;
    const handleWheel = (e) => {
      if (wheelTimeout || isDraggingSlider.current) return;

      const container = slideContainerRef.current;
      const delta = e.deltaY;
      if (Math.abs(delta) < 50) return;

      // Smart scroll: only change slides at content boundaries
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isScrollable = scrollHeight > clientHeight + 10;
        const atTop = scrollTop <= 5;
        const atBottom = scrollTop >= scrollHeight - clientHeight - 5;

        if (isScrollable) {
          if (delta > 0 && !atBottom) {
            checkScrollState();
            return;
          }
          if (delta < 0 && !atTop) {
            checkScrollState();
            return;
          }
        }
      }

      if (delta > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 600);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });

    const container = slideContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollState, { passive: true });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      if (container) {
        container.removeEventListener('scroll', checkScrollState);
      }
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [currentSlide, checkScrollState]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  }, [currentSlide]);

  const goToSlide = useCallback((index) => {
    if (index !== currentSlide) setCurrentSlide(index);
  }, [currentSlide]);

  // ========== SLIDE COMPONENTS ==========

  const IntroSlide = () => (
    <div className="slide-content slide-center">
      <div className="fade-in">
        <div className="overline">BITTENSOR SUBNET</div>
      </div>
      <div className="fade-in" style={{animationDelay: '0.1s'}}>
        <h1 className="hero-title">QUANTA</h1>
      </div>
      <div className="fade-in" style={{animationDelay: '0.2s'}}>
        <div className="divider-line" />
      </div>
      <div className="fade-in" style={{animationDelay: '0.3s'}}>
        <p className="hero-subtitle">
          A Decentralized Stock Picking Competition
        </p>
      </div>
      <div className="fade-in" style={{animationDelay: '0.4s'}}>
        <div className="bittensor-badge">
          <span>Built on Bittensor</span>
          <span className="separator">|</span>
          <span>Crypto + Stocks</span>
          <span className="separator">|</span>
          <span>Real Rewards</span>
        </div>
      </div>
    </div>
  );

  const ProblemSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">THE PROBLEM</div>
        <h2 className="section-title">Great Stock Pickers <span className="gold">Exist Everywhere</span></h2>
        <p className="slide-subtitle">But there's no way to prove it—or profit from it</p>
      </div>

      <div className="problem-grid fade-in" style={{animationDelay: '0.1s'}}>
        <div className="problem-card">
          <div className="pc-icon">📊</div>
          <h4>No Verifiable Track Record</h4>
          <p>Anyone can claim to be a great trader. Screenshots can be faked. There's no trustworthy system to prove skill over time.</p>
        </div>

        <div className="problem-card">
          <div className="pc-icon">🎰</div>
          <h4>Competitions Reward Luck</h4>
          <p>Trading competitions favor high-risk gamblers who get lucky once. Consistent performers lose to volatility chasers.</p>
        </div>

        <div className="problem-card">
          <div className="pc-icon">🏦</div>
          <h4>Wall Street Gatekeeping</h4>
          <p>Talented individuals need hedge fund jobs to monetize skill. The barriers: credentials, connections, capital.</p>
        </div>

        <div className="problem-card">
          <div className="pc-icon">💸</div>
          <h4>74-89% Lose Money</h4>
          <p>Not because retail lacks talent—but because the infrastructure rewards the wrong behaviors.</p>
        </div>
      </div>
    </div>
  );

  const StockMarketGameSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">THE ORIGINAL PROOF OF CONCEPT</div>
        <h2 className="section-title">The Stock Market <span className="gold">Game</span></h2>
        <p className="slide-subtitle">Remember playing this in school? Same concept—but with real money</p>
      </div>

      <div className="smg-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="smg-comparison">
          <div className="smg-side smg-old">
            <h4>📚 The School Version</h4>
            <ul>
              <li>Virtual $100K to invest</li>
              <li>Pick stocks, track performance</li>
              <li>Teacher grades you on returns</li>
              <li>Winner gets... bragging rights</li>
            </ul>
            <div className="smg-verdict">Fun, but no real stakes</div>
          </div>

          <div className="smg-arrow">→</div>

          <div className="smg-side smg-new">
            <h4>💰 QUANTA Version</h4>
            <ul>
              <li>Submit daily stock picks</li>
              <li>Validators score risk-adjusted returns</li>
              <li>Network consensus determines winners</li>
              <li>Winners earn TAO cryptocurrency</li>
            </ul>
            <div className="smg-verdict smg-verdict--good">Same game, real rewards</div>
          </div>
        </div>

        <div className="smg-insight">
          <strong>Key Insight:</strong> The stock market game taught millions how markets work.
          QUANTA turns that same intuition into a decentralized prediction market where anyone can participate and earn.
        </div>
      </div>
    </div>
  );

  const PrecedentsSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">MARKET VALIDATION</div>
        <h2 className="section-title">Similar Platforms <span className="gold">Prove the Model</span></h2>
        <p className="slide-subtitle">Prediction markets and crowdsourced intelligence are booming</p>
      </div>

      <div className="precedents-grid fade-in" style={{animationDelay: '0.1s'}}>
        <div className="precedent-card">
          <div className="prec-header">
            <span className="prec-name">Numerai</span>
            <span className="prec-type">Crowdsourced Hedge Fund</span>
          </div>
          <div className="prec-stats">
            <div className="prec-stat"><span>$550M</span> AUM</div>
            <div className="prec-stat"><span>25%</span> 2024 Returns</div>
            <div className="prec-stat"><span>10K+</span> Data Scientists</div>
          </div>
          <p className="prec-desc">Aggregates ML predictions on obfuscated data. Proves crowdsourced alpha works.</p>
          <div className="prec-diff">
            <strong>QUANTA difference:</strong> Real stock picks, not obfuscated data. Lower barrier—no ML required.
          </div>
        </div>

        <div className="precedent-card">
          <div className="prec-header">
            <span className="prec-name">Polymarket</span>
            <span className="prec-type">Prediction Market</span>
          </div>
          <div className="prec-stats">
            <div className="prec-stat"><span>$1B+</span> Volume</div>
            <div className="prec-stat"><span>Events</span> Binary</div>
            <div className="prec-stat"><span>1M+</span> Users</div>
          </div>
          <p className="prec-desc">Bet on event outcomes (elections, sports). High volume proves demand for prediction markets.</p>
          <div className="prec-diff">
            <strong>QUANTA difference:</strong> Continuous stock portfolios, not one-time event bets.
          </div>
        </div>

        <div className="precedent-card">
          <div className="prec-header">
            <span className="prec-name">Kalshi</span>
            <span className="prec-type">CFTC-Regulated Exchange</span>
          </div>
          <div className="prec-stats">
            <div className="prec-stat"><span>Legal</span> U.S. Trading</div>
            <div className="prec-stat"><span>Events</span> Economic</div>
            <div className="prec-stat"><span>Growing</span> Fast</div>
          </div>
          <p className="prec-desc">Regulated event contracts (inflation, Fed rates). Shows regulatory path exists.</p>
          <div className="prec-diff">
            <strong>QUANTA difference:</strong> Decentralized, global, portfolio-based.
          </div>
        </div>

        <div className="precedent-card precedent-card--highlight">
          <div className="prec-header">
            <span className="prec-name">Taoshi (SN8)</span>
            <span className="prec-type">Bittensor Subnet</span>
          </div>
          <div className="prec-stats">
            <div className="prec-stat"><span>#1</span> dTAO Subnet</div>
            <div className="prec-stat"><span>Crypto</span> Trading</div>
            <div className="prec-stat"><span>Proven</span> Model</div>
          </div>
          <p className="prec-desc">Crowdsourced crypto trading signals on Bittensor. Top subnet by market cap.</p>
          <div className="prec-diff">
            <strong>QUANTA difference:</strong> U.S. equities (10x larger market), portfolio-based, risk-adjusted scoring.
          </div>
        </div>
      </div>
    </div>
  );

  const SolutionSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">THE SOLUTION</div>
        <h2 className="section-title">QUANTA: <span className="gold">The Stock Signal Network</span></h2>
        <p className="slide-subtitle">A decentralized competition where anyone can submit stock picks and earn rewards</p>
      </div>

      <div className="solution-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="solution-pillars">
          <div className="pillar">
            <div className="pillar-icon">📈</div>
            <h4>Submit Portfolios</h4>
            <p>Pick your best stocks daily. Long, short, or both. Any allocation you want.</p>
          </div>

          <div className="pillar">
            <div className="pillar-icon">⚖️</div>
            <h4>Risk-Adjusted Scoring</h4>
            <p>Not just returns—Sharpe ratio, drawdown, consistency. Rewards skill, not gambling.</p>
          </div>

          <div className="pillar">
            <div className="pillar-icon">🏆</div>
            <h4>Earn TAO Rewards</h4>
            <p>Top performers earn cryptocurrency. Everyone who contributes gets something.</p>
          </div>

          <div className="pillar">
            <div className="pillar-icon">🔗</div>
            <h4>Decentralized</h4>
            <p>No single company controls it. Validators run the network. Transparent and trustless.</p>
          </div>
        </div>

        <div className="solution-value">
          <h4>The Meta-Signal</h4>
          <p>
            When hundreds of independent traders submit picks, their combined intelligence creates a
            <strong> meta-signal</strong>—more accurate than any individual. This aggregated signal
            is the network's real product, valuable to institutional investors.
          </p>
        </div>
      </div>
    </div>
  );

  const HowItWorksSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">SIMPLE FLOW</div>
        <h2 className="section-title">How <span className="gold">QUANTA</span> Works</h2>
        <p className="slide-subtitle">From stock pick to payout in 4 steps</p>
      </div>

      <div className="hiw-flow fade-in" style={{animationDelay: '0.1s'}}>
        <div className="hiw-step">
          <div className="hiw-num">1</div>
          <div className="hiw-icon">📝</div>
          <h4>Submit Portfolio</h4>
          <p>Pick stocks you think will perform well. Set allocations. Submit before the deadline.</p>
          <div className="hiw-example">Example: "50% AAPL, 30% NVDA, 20% short TSLA"</div>
        </div>

        <div className="hiw-arrow">→</div>

        <div className="hiw-step">
          <div className="hiw-num">2</div>
          <div className="hiw-icon">⏱️</div>
          <h4>Market Opens</h4>
          <p>Your picks are locked. Real market data determines performance over the epoch.</p>
          <div className="hiw-example">Rolling 24-hour epochs</div>
        </div>

        <div className="hiw-arrow">→</div>

        <div className="hiw-step">
          <div className="hiw-num">3</div>
          <div className="hiw-icon">📊</div>
          <h4>Validators Score</h4>
          <p>Network validators calculate risk-adjusted returns. Sharpe, Sortino, max drawdown.</p>
          <div className="hiw-example">Not just "did it go up?"—"how smart was the bet?"</div>
        </div>

        <div className="hiw-arrow">→</div>

        <div className="hiw-step">
          <div className="hiw-num">4</div>
          <div className="hiw-icon">💰</div>
          <h4>Earn Rewards</h4>
          <p>Top performers get the biggest share. Even middle-tier contributors earn something.</p>
          <div className="hiw-example">TAO paid automatically on-chain</div>
        </div>
      </div>

      <div className="hiw-note fade-in" style={{animationDelay: '0.3s'}}>
        <strong>No actual trading required.</strong> You're not buying stocks—you're submitting predictions.
        The network pays you for accurate forecasts.
      </div>
    </div>
  );

  const SignalPoolSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">UNLIMITED PARTICIPATION</div>
        <h2 className="section-title">The <span className="gold">Signal Pool</span></h2>
        <p className="slide-subtitle">Bittensor has 256 UID slots. QUANTA has infinite capacity.</p>
      </div>

      <div className="sp-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="sp-comparison">
          <div className="sp-side sp-old">
            <h4>Traditional Subnet</h4>
            <div className="sp-diagram">
              <div className="sp-box">256 UIDs</div>
              <div className="sp-arrow">↓</div>
              <div className="sp-box sp-box--small">Only 256 can participate</div>
            </div>
            <p>Fixed slots create gatekeeping. Whales dominate. New talent blocked out.</p>
          </div>

          <div className="sp-vs">VS</div>

          <div className="sp-side sp-new">
            <h4>QUANTA Signal Pool</h4>
            <div className="sp-diagram">
              <div className="sp-box sp-box--pool">
                <span>∞ Signal Generators</span>
                <span className="sp-sub">Anyone can submit</span>
              </div>
              <div className="sp-arrow">↓</div>
              <div className="sp-box">256 UIDs aggregate signals</div>
              <div className="sp-arrow">↓</div>
              <div className="sp-box sp-box--small">Meta-signal to validators</div>
            </div>
            <p>Unlimited participants. UID holders aggregate and route signals. Everyone can play.</p>
          </div>
        </div>

        <div className="sp-tiers">
          <h4>Three Ways to Participate</h4>
          <div className="sp-tier-grid">
            <div className="sp-tier">
              <div className="sp-tier-icon">👤</div>
              <h5>Solo Miner</h5>
              <p>Hold a UID directly. Submit your own signals. Keep 100% of rewards.</p>
            </div>
            <div className="sp-tier">
              <div className="sp-tier-icon">🏊</div>
              <h5>Pool Participant</h5>
              <p>Submit through a pool operator. Lower barrier, shared rewards.</p>
            </div>
            <div className="sp-tier">
              <div className="sp-tier-icon">🏢</div>
              <h5>Pool Operator</h5>
              <p>Run a pool. Aggregate signals from many. Earn fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RewardSystemSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">DUAL REVENUE MODEL</div>
        <h2 className="section-title">Competition + <span className="gold">Emissions</span></h2>
        <p className="slide-subtitle">Two reward layers that keep the network sustainable</p>
      </div>

      <div className="rs-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="rs-layers">
          <div className="rs-layer">
            <div className="rs-layer-header">
              <span className="rs-icon">🏆</span>
              <h4>Competition Pot</h4>
            </div>
            <div className="rs-layer-body">
              <p><strong>Performance rewards:</strong> Winners take from losers.</p>
              <ul>
                <li>Top performers get the biggest share</li>
                <li>Middle-tier get smaller rewards</li>
                <li>Poor performers lose their ante</li>
              </ul>
              <div className="rs-why">
                <strong>Why it matters:</strong> Creates real stakes. Skin in the game.
              </div>
            </div>
          </div>

          <div className="rs-plus">+</div>

          <div className="rs-layer">
            <div className="rs-layer-header">
              <span className="rs-icon">⛏️</span>
              <h4>TAO Emissions</h4>
            </div>
            <div className="rs-layer-body">
              <p><strong>Infrastructure rewards:</strong> Everyone doing work gets paid.</p>
              <div className="rs-split">
                <div className="rs-split-item">
                  <span className="rs-pct">41%</span>
                  <span>Validators</span>
                  <span className="rs-sub">Run nodes, fetch prices, score</span>
                </div>
                <div className="rs-split-item">
                  <span className="rs-pct">41%</span>
                  <span>Miners</span>
                  <span className="rs-sub">Diverse signals, long tail</span>
                </div>
                <div className="rs-split-item">
                  <span className="rs-pct">18%</span>
                  <span>Subnet Owner</span>
                  <span className="rs-sub">Sustainable development</span>
                </div>
              </div>
              <div className="rs-why">
                <strong>Why it matters:</strong> Keeps the long tail engaged. Network depth.
              </div>
            </div>
          </div>
        </div>

        <div className="rs-insight">
          <strong>Key Insight:</strong> Prize-pool-only models create death spirals (winners stay, losers leave, network thins).
          Emissions keep infrastructure running and maintain signal diversity—hundreds of diverse signals make the meta-signal valuable.
        </div>
      </div>
    </div>
  );

  const WhyBittensorSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">WHY A BITTENSOR SUBNET?</div>
        <h2 className="section-title">Decentralized <span className="gold">Infrastructure</span></h2>
        <p className="slide-subtitle">Why not just build a centralized platform?</p>
      </div>

      <div className="wb-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="wb-comparison">
          <div className="wb-side wb-centralized">
            <h4>❌ Centralized Approach</h4>
            <ul>
              <li><span className="wb-x">✗</span> Single point of failure</li>
              <li><span className="wb-x">✗</span> Trust the company</li>
              <li><span className="wb-x">✗</span> They can change rules</li>
              <li><span className="wb-x">✗</span> KYC/compliance barriers</li>
              <li><span className="wb-x">✗</span> Geographic restrictions</li>
              <li><span className="wb-x">✗</span> Can shut down anytime</li>
            </ul>
          </div>

          <div className="wb-side wb-decentralized">
            <h4>✓ Bittensor Subnet</h4>
            <ul>
              <li><span className="wb-check">✓</span> Distributed validators</li>
              <li><span className="wb-check">✓</span> Trustless consensus</li>
              <li><span className="wb-check">✓</span> Code is law</li>
              <li><span className="wb-check">✓</span> Pseudonymous participation</li>
              <li><span className="wb-check">✓</span> Global access</li>
              <li><span className="wb-check">✓</span> Immutable, runs forever</li>
            </ul>
          </div>
        </div>

        <div className="wb-benefits">
          <h4>What Bittensor Provides</h4>
          <div className="wb-benefit-grid">
            <div className="wb-benefit">
              <span className="wb-benefit-icon">💎</span>
              <h5>TAO Economy</h5>
              <p>Built-in cryptocurrency with real value. No need to bootstrap a token.</p>
            </div>
            <div className="wb-benefit">
              <span className="wb-benefit-icon">🔐</span>
              <h5>Consensus Layer</h5>
              <p>Validators agree on scores. No single arbiter. Byzantine fault tolerant.</p>
            </div>
            <div className="wb-benefit">
              <span className="wb-benefit-icon">📊</span>
              <h5>Emission Schedule</h5>
              <p>Predictable rewards. Subnet incentive alignment. dTAO economics.</p>
            </div>
            <div className="wb-benefit">
              <span className="wb-benefit-icon">🌐</span>
              <h5>Network Effects</h5>
              <p>Part of broader Bittensor ecosystem. Cross-subnet composability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ParticipantsSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">WHO CAN PARTICIPATE?</div>
        <h2 className="section-title">From <span className="gold">Casual to Pro</span></h2>
        <p className="slide-subtitle">QUANTA welcomes all skill levels and approaches</p>
      </div>

      <div className="part-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="part-spectrum">
          <div className="part-category">
            <div className="part-cat-header">
              <span className="part-icon">🧠</span>
              <h4>Discretionary Traders</h4>
            </div>
            <p>Human judgment. Read the news, follow trends, trust your gut.</p>
            <div className="part-examples">
              <span>Day traders</span>
              <span>Stock pickers</span>
              <span>News traders</span>
            </div>
            <div className="part-req">
              <strong>Compute:</strong> None needed
            </div>
          </div>

          <div className="part-category">
            <div className="part-cat-header">
              <span className="part-icon">📊</span>
              <h4>Systematic Quants</h4>
            </div>
            <p>Algorithmic strategies. Backtest, optimize, automate.</p>
            <div className="part-examples">
              <span>Factor models</span>
              <span>Statistical arbitrage</span>
              <span>ML pipelines</span>
            </div>
            <div className="part-req">
              <strong>Compute:</strong> Low to high
            </div>
          </div>

          <div className="part-category">
            <div className="part-cat-header">
              <span className="part-icon">🤖</span>
              <h4>AI/ML Engineers</h4>
            </div>
            <p>Deep learning, LLMs, reinforcement learning agents.</p>
            <div className="part-examples">
              <span>Transformer models</span>
              <span>RL agents</span>
              <span>LLM analysis</span>
            </div>
            <div className="part-req">
              <strong>Compute:</strong> High
            </div>
          </div>

          <div className="part-category">
            <div className="part-cat-header">
              <span className="part-icon">🏢</span>
              <h4>Pool Operators</h4>
            </div>
            <p>Aggregate signals from communities. Run competitions within competitions.</p>
            <div className="part-examples">
              <span>Discord servers</span>
              <span>Trading communities</span>
              <span>Signal aggregators</span>
            </div>
            <div className="part-req">
              <strong>Compute:</strong> Varies
            </div>
          </div>
        </div>

        <div className="part-interfaces">
          <h4>Multiple Interfaces</h4>
          <div className="part-int-grid">
            <div className="part-int"><span>🌐</span> Web App</div>
            <div className="part-int"><span>📱</span> Mobile</div>
            <div className="part-int"><span>⌨️</span> CLI</div>
            <div className="part-int"><span>🔌</span> API</div>
            <div className="part-int"><span>📊</span> Spreadsheet</div>
            <div className="part-int"><span>💬</span> Discord Bot</div>
          </div>
        </div>
      </div>
    </div>
  );

  const RoadmapSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">DEVELOPMENT PATH</div>
        <h2 className="section-title">Roadmap to <span className="gold">Launch</span></h2>
        <p className="slide-subtitle">Phased rollout with testnet validation</p>
      </div>

      <div className="roadmap-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="roadmap-phases">
          <div className="rm-phase rm-phase--done">
            <div className="rm-marker">✓</div>
            <div className="rm-content">
              <h4>Phase 1: Foundation</h4>
              <ul>
                <li>Core scoring engine</li>
                <li>Signal Pool architecture</li>
                <li>Validator consensus protocol</li>
                <li>Anti-gaming detection</li>
              </ul>
            </div>
          </div>

          <div className="rm-phase rm-phase--current">
            <div className="rm-marker">●</div>
            <div className="rm-content">
              <h4>Phase 2: Testnet</h4>
              <ul>
                <li>Closed testnet with validators</li>
                <li>Scoring calibration</li>
                <li>Economic parameter tuning</li>
                <li>Web interface beta</li>
              </ul>
            </div>
          </div>

          <div className="rm-phase">
            <div className="rm-marker">○</div>
            <div className="rm-content">
              <h4>Phase 3: Mainnet Launch</h4>
              <ul>
                <li>Bittensor mainnet deployment</li>
                <li>Public Signal Pool</li>
                <li>Mobile app launch</li>
                <li>Pool operator onboarding</li>
              </ul>
            </div>
          </div>

          <div className="rm-phase">
            <div className="rm-marker">○</div>
            <div className="rm-content">
              <h4>Phase 4: Scale</h4>
              <ul>
                <li>Institutional API</li>
                <li>Cross-subnet integration</li>
                <li>International markets</li>
                <li>Meta-signal monetization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SummarySlide = () => (
    <div className="slide-content slide-center">
      <div className="fade-in">
        <div className="overline">THE OPPORTUNITY</div>
      </div>
      <div className="fade-in" style={{animationDelay: '0.1s'}}>
        <h2 className="section-title summary-title">QUANTA</h2>
      </div>
      <div className="fade-in" style={{animationDelay: '0.2s'}}>
        <p className="summary-tagline">
          A decentralized stock picking competition where anyone can prove their skill and earn real rewards
        </p>
      </div>

      <div className="summary-points fade-in" style={{animationDelay: '0.3s'}}>
        <div className="sum-point">
          <span className="sum-check">✓</span>
          <span><strong>$45T market</strong> — U.S. equities, the world's largest</span>
        </div>
        <div className="sum-point">
          <span className="sum-check">✓</span>
          <span><strong>Proven model</strong> — Numerai, Polymarket, Taoshi validate demand</span>
        </div>
        <div className="sum-point">
          <span className="sum-check">✓</span>
          <span><strong>Signal Pool</strong> — Unlimited participants, not just 256</span>
        </div>
        <div className="sum-point">
          <span className="sum-check">✓</span>
          <span><strong>Dual revenue</strong> — Competition + emissions = sustainable</span>
        </div>
        <div className="sum-point">
          <span className="sum-check">✓</span>
          <span><strong>Bittensor native</strong> — Decentralized, trustless, global</span>
        </div>
      </div>

      <div className="fade-in" style={{animationDelay: '0.4s'}}>
        <div className="summary-cta">
          <p>The stock market game for the crypto age.</p>
          <p className="summary-sub">Prove your skill. Earn TAO. Join the network.</p>
        </div>
      </div>

      <div className="fade-in" style={{animationDelay: '0.5s'}}>
        <div className="summary-links">
          <a href="/" className="sum-link">qsub.net</a>
          <span className="sum-sep">|</span>
          <a href="/pitch" className="sum-link">Full Pitch Deck</a>
          <span className="sum-sep">|</span>
          <a href="/litepaper" className="sum-link">Litepaper</a>
        </div>
      </div>
    </div>
  );

  const slideComponents = {
    intro: IntroSlide,
    problem: ProblemSlide,
    stockMarketGame: StockMarketGameSlide,
    precedents: PrecedentsSlide,
    solution: SolutionSlide,
    howItWorks: HowItWorksSlide,
    signalPool: SignalPoolSlide,
    rewardSystem: RewardSystemSlide,
    whyBittensor: WhyBittensorSlide,
    participants: ParticipantsSlide,
    roadmap: RoadmapSlide,
    summary: SummarySlide
  };

  const CurrentSlideComponent = slideComponents[slides[currentSlide]];

  return (
    <div className="pitch-deck-lite">
      <style>{`
        /* ========== CORE STYLES ========== */
        .pitch-deck-lite {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%);
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .pitch-deck-lite * {
          box-sizing: border-box;
        }

        /* Slide Container - Scrollable */
        .slide-container {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .slide-container-inner {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px 60px 100px;
        }

        /* Slide transition - no container animation, let individual fade-ins handle it */
        .slide-transition {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .slide-container-inner {
            padding: 16px 20px 100px;
          }
        }

        .slide-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .slide-center {
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        /* Animations */
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
          will-change: opacity, transform;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* When parent has animations-complete, disable all fade-in animations */
        .animations-complete .fade-in {
          animation: none !important;
          opacity: 1 !important;
          transform: translateY(0) !important;
          will-change: auto;
        }

        /* Prevent re-animation on scroll-triggered re-renders */
        .slide-content {
          contain: layout style;
        }

        /* Typography */
        .overline {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: #d4af37;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .hero-title {
          font-size: clamp(3rem, 10vw, 6rem);
          font-weight: 800;
          letter-spacing: 0.1em;
          background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 50%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          margin: 0 0 8px;
          line-height: 1.2;
        }

        .gold { color: #d4af37; }

        .divider-line {
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          margin: 16px auto;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: #e0e0e0;
          margin: 0 0 8px;
        }

        .hero-tagline {
          font-size: 1rem;
          color: #888;
          margin: 0;
        }

        .slide-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .slide-subtitle {
          font-size: 1rem;
          color: #888;
          margin: 0;
        }

        /* Stats Row */
        .stats-row {
          display: flex;
          gap: 40px;
          justify-content: center;
          margin: 32px 0;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #d4af37;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* Badge */
        .bittensor-badge {
          display: flex;
          gap: 12px;
          justify-content: center;
          align-items: center;
          font-size: 0.8rem;
          color: #666;
          flex-wrap: wrap;
        }

        .bittensor-badge .separator {
          color: #333;
        }

        /* Navigation */
        .nav-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 100;
        }

        .nav-logo {
          font-weight: 700;
          color: #d4af37;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-logo-lite {
          font-size: 0.65rem;
          background: rgba(212, 175, 55, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          color: #d4af37;
        }

        .nav-dots {
          display: flex;
          gap: 6px;
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #333;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-dot:hover {
          background: #555;
        }

        .nav-dot.active {
          background: #d4af37;
          width: 24px;
          border-radius: 4px;
        }

        .nav-info {
          font-size: 0.75rem;
          color: #666;
        }

        /* Top Center Nav Pill with Dropdown */
        .nav-pill {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 4px;
          z-index: 200;
          transition: all 0.3s ease;
        }

        .nav-pill:hover {
          border-color: rgba(212,175,55,0.3);
        }

        .nav-pill-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          transition: all 0.2s ease;
        }

        .nav-pill-btn:hover:not(:disabled) {
          color: #fff;
          background: rgba(255,255,255,0.1);
        }

        .nav-pill-btn:disabled {
          color: rgba(255,255,255,0.15);
          cursor: not-allowed;
        }

        .nav-pill-center {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 12px;
          cursor: pointer;
          border-radius: 20px;
          transition: all 0.2s ease;
        }

        .nav-pill-center:hover {
          background: rgba(255,255,255,0.05);
        }

        .nav-pill-name {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-pill-counter {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          font-family: monospace;
        }

        .nav-pill-chevron {
          font-size: 0.6rem;
          color: rgba(255,255,255,0.4);
          transition: transform 0.2s ease;
        }

        .nav-pill-center.open .nav-pill-chevron {
          transform: rotate(180deg);
        }

        /* Dropdown menu */
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(10, 10, 15, 0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 8px;
          min-width: 180px;
          max-height: 350px;
          overflow-y: auto;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-10px);
          transition: all 0.2s ease;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }

        .nav-pill-center.open .nav-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .nav-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .nav-dropdown-item:hover {
          background: rgba(255,255,255,0.05);
        }

        .nav-dropdown-item.active {
          background: rgba(212,175,55,0.1);
        }

        .nav-dropdown-num {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.3);
          font-family: monospace;
          width: 20px;
        }

        .nav-dropdown-item.active .nav-dropdown-num {
          color: #d4af37;
        }

        .nav-dropdown-name {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
        }

        .nav-dropdown-item.active .nav-dropdown-name {
          color: #d4af37;
          font-weight: 500;
        }

        .nav-dropdown-item:hover .nav-dropdown-name {
          color: rgba(255,255,255,0.9);
        }

        /* Scroll indicator - now at bottom */
        .scroll-indicator {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          will-change: opacity;
        }

        .scroll-indicator.visible {
          opacity: 1;
          transition: opacity 0.3s ease 0.1s;
        }

        .scroll-indicator-text {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
        }

        .scroll-indicator-arrow {
          font-size: 0.8rem;
          color: rgba(212,175,55,0.6);
          animation: bounce 1.5s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }

        /* Hide old nav-bar since we use nav-pill now */
        .nav-bar {
          display: none;
        }

        @media (max-width: 600px) {
          .nav-pill-name { max-width: 80px; }
        }

        /* ========== PROBLEM SLIDE ========== */
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          flex: 1;
        }

        .problem-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
        }

        .problem-card .pc-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }

        .problem-card h4 {
          font-size: 1.1rem;
          margin: 0 0 8px;
          color: #fff;
        }

        .problem-card p {
          font-size: 0.9rem;
          color: #888;
          margin: 0;
          line-height: 1.5;
        }

        /* ========== STOCK MARKET GAME SLIDE ========== */
        .smg-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .smg-comparison {
          display: flex;
          align-items: stretch;
          gap: 24px;
          flex-wrap: wrap;
        }

        .smg-side {
          flex: 1;
          min-width: 280px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
        }

        .smg-side h4 {
          font-size: 1.1rem;
          margin: 0 0 16px;
        }

        .smg-old h4 { color: #888; }
        .smg-new h4 { color: #d4af37; }

        .smg-side ul {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
        }

        .smg-side li {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.9rem;
          color: #aaa;
        }

        .smg-side li:last-child {
          border-bottom: none;
        }

        .smg-verdict {
          font-size: 0.85rem;
          padding: 8px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          color: #666;
          text-align: center;
        }

        .smg-verdict--good {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
        }

        .smg-arrow {
          font-size: 2rem;
          color: #d4af37;
          align-self: center;
        }

        @media (max-width: 768px) {
          .smg-arrow {
            transform: rotate(90deg);
          }
        }

        .smg-insight {
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 16px;
          font-size: 0.9rem;
          color: #ccc;
          line-height: 1.6;
        }

        /* ========== PRECEDENTS SLIDE ========== */
        .precedents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          flex: 1;
        }

        .precedent-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .precedent-card--highlight {
          border-color: rgba(212, 175, 55, 0.3);
          background: rgba(212, 175, 55, 0.02);
        }

        .prec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .prec-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
        }

        .prec-type {
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .prec-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .prec-stat {
          font-size: 0.75rem;
          color: #888;
        }

        .prec-stat span {
          color: #d4af37;
          font-weight: 600;
        }

        .prec-desc {
          font-size: 0.85rem;
          color: #888;
          margin: 0 0 12px;
          flex: 1;
        }

        .prec-diff {
          font-size: 0.8rem;
          color: #aaa;
          background: rgba(212, 175, 55, 0.05);
          padding: 8px 10px;
          border-radius: 6px;
          border-left: 2px solid rgba(212, 175, 55, 0.3);
        }

        /* ========== SOLUTION SLIDE ========== */
        .solution-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .solution-pillars {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .pillar {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .pillar-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }

        .pillar h4 {
          font-size: 1rem;
          margin: 0 0 8px;
          color: #fff;
        }

        .pillar p {
          font-size: 0.85rem;
          color: #888;
          margin: 0;
          line-height: 1.5;
        }

        .solution-value {
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 20px;
        }

        .solution-value h4 {
          font-size: 1rem;
          color: #d4af37;
          margin: 0 0 8px;
        }

        .solution-value p {
          font-size: 0.9rem;
          color: #ccc;
          margin: 0;
          line-height: 1.6;
        }

        /* ========== HOW IT WORKS SLIDE ========== */
        .hiw-flow {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          flex: 1;
        }

        .hiw-step {
          flex: 1;
          min-width: 180px;
          max-width: 240px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          position: relative;
        }

        .hiw-num {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 24px;
          background: #d4af37;
          color: #0a0a0f;
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hiw-icon {
          font-size: 2rem;
          margin: 8px 0;
        }

        .hiw-step h4 {
          font-size: 0.95rem;
          margin: 0 0 8px;
          color: #fff;
        }

        .hiw-step p {
          font-size: 0.8rem;
          color: #888;
          margin: 0 0 8px;
        }

        .hiw-example {
          font-size: 0.7rem;
          color: #666;
          font-style: italic;
        }

        .hiw-arrow {
          font-size: 1.5rem;
          color: #d4af37;
          align-self: center;
          padding-top: 20px;
        }

        @media (max-width: 900px) {
          .hiw-arrow {
            display: none;
          }
        }

        .hiw-note {
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 16px;
          font-size: 0.9rem;
          color: #ccc;
          text-align: center;
          margin-top: 24px;
        }

        /* ========== SIGNAL POOL SLIDE ========== */
        .sp-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sp-comparison {
          display: flex;
          gap: 24px;
          align-items: stretch;
          flex-wrap: wrap;
        }

        .sp-side {
          flex: 1;
          min-width: 280px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .sp-old { opacity: 0.6; }
        .sp-new { border-color: rgba(212, 175, 55, 0.3); }

        .sp-side h4 {
          font-size: 1rem;
          margin: 0 0 16px;
          text-align: center;
        }

        .sp-diagram {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .sp-box {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 0.9rem;
          color: #fff;
        }

        .sp-box--small {
          font-size: 0.8rem;
          color: #888;
        }

        .sp-box--pool {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sp-sub {
          font-size: 0.7rem;
          color: #888;
        }

        .sp-arrow {
          color: #666;
          font-size: 1.2rem;
        }

        .sp-vs {
          font-size: 1.2rem;
          color: #666;
          align-self: center;
          font-weight: 700;
        }

        .sp-side > p {
          font-size: 0.85rem;
          color: #888;
          margin: 0;
          text-align: center;
        }

        .sp-tiers h4 {
          font-size: 1rem;
          color: #fff;
          margin: 0 0 16px;
          text-align: center;
        }

        .sp-tier-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .sp-tier {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .sp-tier-icon {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .sp-tier h5 {
          font-size: 0.9rem;
          margin: 0 0 8px;
          color: #fff;
        }

        .sp-tier p {
          font-size: 0.8rem;
          color: #888;
          margin: 0;
        }

        /* ========== REWARD SYSTEM SLIDE ========== */
        .rs-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .rs-layers {
          display: flex;
          gap: 16px;
          align-items: stretch;
          flex-wrap: wrap;
        }

        .rs-layer {
          flex: 1;
          min-width: 280px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
        }

        .rs-layer-header {
          background: rgba(212, 175, 55, 0.1);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rs-icon {
          font-size: 1.5rem;
        }

        .rs-layer-header h4 {
          font-size: 1rem;
          margin: 0;
          color: #fff;
        }

        .rs-layer-body {
          padding: 16px;
        }

        .rs-layer-body > p {
          font-size: 0.9rem;
          color: #ccc;
          margin: 0 0 12px;
        }

        .rs-layer-body ul {
          list-style: none;
          padding: 0;
          margin: 0 0 12px;
        }

        .rs-layer-body li {
          font-size: 0.85rem;
          color: #888;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .rs-split {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rs-split-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .rs-pct {
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          min-width: 48px;
          text-align: center;
        }

        .rs-split-item .rs-sub {
          font-size: 0.75rem;
          color: #666;
          margin-left: auto;
        }

        .rs-why {
          background: rgba(255, 255, 255, 0.03);
          padding: 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          color: #aaa;
          margin-top: 12px;
        }

        .rs-plus {
          font-size: 2rem;
          color: #d4af37;
          align-self: center;
          font-weight: 300;
        }

        .rs-insight {
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 16px;
          font-size: 0.9rem;
          color: #ccc;
          line-height: 1.6;
        }

        /* ========== WHY BITTENSOR SLIDE ========== */
        .wb-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .wb-comparison {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .wb-side {
          flex: 1;
          min-width: 260px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .wb-centralized {
          opacity: 0.7;
        }

        .wb-decentralized {
          border-color: rgba(212, 175, 55, 0.3);
        }

        .wb-side h4 {
          font-size: 1rem;
          margin: 0 0 16px;
        }

        .wb-side ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .wb-side li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          font-size: 0.85rem;
          color: #888;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .wb-x {
          color: #ef4444;
          font-weight: 600;
        }

        .wb-check {
          color: #22c55e;
          font-weight: 600;
        }

        .wb-benefits h4 {
          font-size: 1rem;
          color: #fff;
          margin: 0 0 16px;
          text-align: center;
        }

        .wb-benefit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .wb-benefit {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .wb-benefit-icon {
          font-size: 1.5rem;
        }

        .wb-benefit h5 {
          font-size: 0.9rem;
          margin: 8px 0;
          color: #fff;
        }

        .wb-benefit p {
          font-size: 0.8rem;
          color: #888;
          margin: 0;
        }

        /* ========== PARTICIPANTS SLIDE ========== */
        .part-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .part-spectrum {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .part-category {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .part-cat-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .part-icon {
          font-size: 1.5rem;
        }

        .part-cat-header h4 {
          font-size: 1rem;
          margin: 0;
          color: #fff;
        }

        .part-category > p {
          font-size: 0.85rem;
          color: #888;
          margin: 0 0 12px;
        }

        .part-examples {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .part-examples span {
          font-size: 0.7rem;
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .part-req {
          font-size: 0.75rem;
          color: #666;
        }

        .part-interfaces h4 {
          font-size: 1rem;
          color: #fff;
          margin: 0 0 16px;
          text-align: center;
        }

        .part-int-grid {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .part-int {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 0.85rem;
          color: #888;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ========== ROADMAP SLIDE ========== */
        .roadmap-layout {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }

        .roadmap-phases {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          padding-left: 40px;
        }

        .roadmap-phases::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 20px;
          bottom: 20px;
          width: 2px;
          background: linear-gradient(180deg, #d4af37, #333);
        }

        .rm-phase {
          display: flex;
          gap: 16px;
          padding: 16px 0;
          position: relative;
        }

        .rm-marker {
          position: absolute;
          left: -40px;
          width: 24px;
          height: 24px;
          background: #1a1a1a;
          border: 2px solid #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #666;
        }

        .rm-phase--done .rm-marker {
          background: #22c55e;
          border-color: #22c55e;
          color: #fff;
        }

        .rm-phase--current .rm-marker {
          background: #d4af37;
          border-color: #d4af37;
          color: #0a0a0f;
        }

        .rm-content h4 {
          font-size: 1rem;
          margin: 0 0 8px;
          color: #fff;
        }

        .rm-phase--done .rm-content h4 {
          color: #22c55e;
        }

        .rm-phase--current .rm-content h4 {
          color: #d4af37;
        }

        .rm-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .rm-content li {
          font-size: 0.85rem;
          color: #888;
          padding: 4px 0;
        }

        /* ========== SUMMARY SLIDE ========== */
        .summary-title {
          font-size: clamp(2.5rem, 8vw, 4rem);
          background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 50%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .summary-tagline {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #ccc;
          max-width: 600px;
          margin: 0 auto 24px;
          line-height: 1.5;
        }

        .summary-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto 32px;
          text-align: left;
        }

        .sum-point {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem;
          color: #ccc;
        }

        .sum-check {
          color: #d4af37;
          font-weight: 600;
        }

        .summary-cta {
          margin-bottom: 24px;
        }

        .summary-cta p {
          font-size: 1.1rem;
          color: #fff;
          margin: 0;
        }

        .summary-sub {
          font-size: 0.9rem !important;
          color: #888 !important;
        }

        .summary-links {
          display: flex;
          gap: 16px;
          justify-content: center;
          align-items: center;
        }

        .sum-link {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .sum-link:hover {
          text-decoration: underline;
        }

        .sum-sep {
          color: #333;
        }

        /* ========== MOBILE ADJUSTMENTS ========== */
        @media (max-width: 600px) {
          .precedents-grid,
          .problem-grid,
          .solution-pillars,
          .part-spectrum {
            grid-template-columns: 1fr;
          }

          .rs-layers,
          .wb-comparison,
          .smg-comparison,
          .sp-comparison {
            flex-direction: column;
          }

          .rs-plus,
          .sp-vs {
            align-self: center;
          }

          .hiw-flow {
            flex-direction: column;
            align-items: center;
          }

          .hiw-step {
            max-width: 100%;
          }
        }
      `}</style>

      {/* Top Center Nav Pill with Dropdown */}
      <nav className="nav-pill">
        <button
          className="nav-pill-btn"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div
          ref={navDropdownRef}
          className={`nav-pill-center ${navDropdownOpen ? 'open' : ''}`}
          onClick={() => setNavDropdownOpen(!navDropdownOpen)}
        >
          <span className="nav-pill-counter">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="nav-pill-name">{slideNames[currentSlide]}</span>
          <span className="nav-pill-chevron">▼</span>

          {/* Dropdown */}
          <div className="nav-dropdown">
            {slideNames.map((name, i) => (
              <button
                key={i}
                className={`nav-dropdown-item ${i === currentSlide ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(i);
                  setNavDropdownOpen(false);
                }}
              >
                <span className="nav-dropdown-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="nav-dropdown-name">{name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          className="nav-pill-btn"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </nav>

      {/* Slide Content - Scrollable */}
      <div className="slide-container" ref={slideContainerRef}>
        <div
          key={currentSlide}
          className={`slide-container-inner slide-transition ${slideAnimated ? 'animations-complete' : ''}`}
        >
          {isHydrated && CurrentSlideComponent && <CurrentSlideComponent />}
        </div>
      </div>

      {/* Scroll indicator - shows once per slide when content is scrollable */}
      <div className={`scroll-indicator ${scrollIndicatorVisible ? 'visible' : ''}`}>
        <span className="scroll-indicator-text">Scroll for more</span>
        <span className="scroll-indicator-arrow">↓</span>
      </div>
    </div>
  );
};

export default QuantaPitchDeckLite;
