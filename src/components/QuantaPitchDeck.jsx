import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ComposedChart, ReferenceLine
} from 'recharts';

const QuantaPitchDeckFinal = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideContainerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const navDropdownRef = useRef(null);

  // ========== COMPREHENSIVE TOKENOMICS MODEL ==========
  // Core principle: Signal Pool architecture enables unlimited participants
  // Network takes rake first. Losers fund winners. Pool operators facilitate scaling.
  const [tokenModel, setTokenModel] = useState({
    // Market parameters
    taoPrice: 300,
    subnetEmissionShare: 2.5,

    // Participant tiers (Signal Pool enables unlimited)
    totalSignalGenerators: 500,     // Unlimited in Signal Pool
    soloMinerUIDs: 50,              // Direct UID holders (top performers)
    poolOperatorUIDs: 100,          // Pool operators holding UIDs
    validatorUIDs: 64,              // ~64 validators

    // Economics
    avgAntePerGenerator: 0.1,       // TAO equivalent
    epochsPerDay: 24,               // 1-hour rolling epochs

    // Network rake (guaranteed profit)
    networkRakePercent: 8,

    // Pool operator fee (for aggregating signals)
    poolOperatorFeePercent: 15,

    // Performance distribution
    topTierPercent: 10,             // Premium rewards
    profitablePercent: 45,          // Positive ROI
    breakEvenPercent: 25,           // Ante returned
    loserPercent: 20,               // Ante forfeited

    // Burn mechanics
    loserAnteBurnPercent: 50,       // 50% burned, 50% redistributed

    // Bonus external revenue (NOT required for profitability)
    subscriptionRevenue: 0,
    licensingRevenue: 0
  });

  // Track if component has mounted to prevent hydration flicker
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const slides = [
    'intro', 'problem', 'solution', 'precedent', 'scalability',
    'signalPool', 'participationTiers', 'minerTaxonomy', 'rewardFlow', 'howItWorks',
    'networkDiagram', 'epochLifecycle', 'scoring', 'tokenomics',
    'rewardMechanics', 'interactiveModel', 'deflationary', 'dualRevenue', 'compliance',
    'revenue', 'competitions', 'architecture', 'financialModel', 'roadmap', 'summary'
  ];

  const slideNames = [
    'Intro', 'Problem', 'Solution', 'Precedent', 'Scalability',
    'Signal Pool', 'Tiers', 'Taxonomy', 'Rewards', 'How It Works', 'Network',
    'Epoch', 'Scoring', 'Tokenomics', 'Mechanics', 'Model',
    'Deflationary', 'Dual Revenue', 'Compliance', 'Revenue', 'Competitions', 'Architecture', 'Financial', 'Roadmap', 'Summary'
  ];

  const [isAnimating, setIsAnimating] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const isDraggingSlider = useRef(false);

  // Track which slides have completed their animation to prevent re-triggering
  const animatedSlidesRef = useRef(new Set());
  const [slideAnimated, setSlideAnimated] = useState(false);

  // Track if scroll indicator has been shown for current slide (show once per slide visit)
  const scrollIndicatorShownRef = useRef(new Set());
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false);

  // Contact modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Investment Inquiry',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });

      if (!response.ok) throw new Error('Failed to send message');

      setContactSubmitted(true);
      setContactForm({ name: '', email: '', subject: 'Investment Inquiry', message: '' });
    } catch (err) {
      setContactError('Failed to send message. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  // Debounce ref for scroll state updates
  const scrollCheckTimeout = useRef(null);

  // Check if slide content is scrollable and update scroll state (debounced)
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
      const threshold = 10; // pixels threshold for edge detection

      setCanScrollUp(scrollTop > threshold);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - threshold);
    }, 50);
  }, []);

  // Reset scroll position and check state when slide changes
  useEffect(() => {
    const container = slideContainerRef.current;
    if (container) {
      container.scrollTop = 0;
    }
    // Close dropdown when slide changes
    setNavDropdownOpen(false);
    // Reset scroll indicator visibility for this slide
    setScrollIndicatorVisible(false);

    // For new slides, animate; for already-visited slides, skip animation
    const alreadyAnimated = animatedSlidesRef.current.has(currentSlide);
    setSlideAnimated(alreadyAnimated);

    // Check scroll state and show indicator after content renders
    const scrollCheckTimer = setTimeout(() => {
      checkScrollState();
      // Show scroll indicator once if this slide is scrollable and we haven't shown it yet
      const container = slideContainerRef.current;
      if (container && !scrollIndicatorShownRef.current.has(currentSlide)) {
        const { scrollHeight, clientHeight } = container;
        if (scrollHeight > clientHeight + 10) {
          setScrollIndicatorVisible(true);
          scrollIndicatorShownRef.current.add(currentSlide);
          // Auto-hide after 3 seconds
          setTimeout(() => setScrollIndicatorVisible(false), 3000);
        }
      }
    }, 300);

    if (!alreadyAnimated) {
      // Mark as animated after animation duration
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
      // Ignore if typing in an input
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

      // Check current scroll state
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isScrollable = scrollHeight > clientHeight + 10;
        const atTop = scrollTop <= 5;
        const atBottom = scrollTop >= scrollHeight - clientHeight - 5;

        // If content is scrollable and not at edge, let natural scroll happen
        if (isScrollable) {
          if (delta > 0 && !atBottom) {
            checkScrollState();
            return; // Let the content scroll down
          }
          if (delta < 0 && !atTop) {
            checkScrollState();
            return; // Let the content scroll up
          }
        }
      }

      // At edge or not scrollable - change slides
      if (delta > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 600);
    };

    // Track slider dragging globally
    const handleMouseDown = (e) => {
      if (e.target.type === 'range') {
        isDraggingSlider.current = true;
      }
    };
    const handleMouseUp = () => {
      isDraggingSlider.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Also listen for scroll events to update state
    const container = slideContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollState, { passive: true });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
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

  // ========== COMPREHENSIVE TOKENOMICS CALCULATOR ==========
  const calculateTokenomics = useCallback(() => {
    const {
      taoPrice, subnetEmissionShare, totalSignalGenerators, soloMinerUIDs,
      poolOperatorUIDs, avgAntePerGenerator, epochsPerDay, networkRakePercent,
      poolOperatorFeePercent, topTierPercent, profitablePercent, breakEvenPercent,
      loserPercent, loserAnteBurnPercent, subscriptionRevenue, licensingRevenue
    } = tokenModel;

    // Total participants in Signal Pool
    const pooledGenerators = totalSignalGenerators - soloMinerUIDs;

    // === EPOCH ECONOMICS (Per Epoch) ===
    const epochAntePool = totalSignalGenerators * avgAntePerGenerator * taoPrice;
    
    // STEP 1: Network takes rake FIRST (guaranteed profit)
    const epochNetworkRake = epochAntePool * (networkRakePercent / 100);
    const afterRakePool = epochAntePool - epochNetworkRake;

    // STEP 2: Calculate tier distributions
    const topTierCount = Math.max(1, Math.floor(totalSignalGenerators * (topTierPercent / 100)));
    const profitableCount = Math.max(1, Math.floor(totalSignalGenerators * (profitablePercent / 100)));
    const breakEvenCount = Math.floor(totalSignalGenerators * (breakEvenPercent / 100));
    const loserCount = Math.floor(totalSignalGenerators * (loserPercent / 100));

    // Losers forfeit their ante (goes to pool)
    const loserAnteForfeited = loserCount * avgAntePerGenerator * taoPrice;
    
    // Of forfeited ante: portion burned, rest redistributed
    const loserAnteBurned = loserAnteForfeited * (loserAnteBurnPercent / 100);
    const loserAnteRedistributed = loserAnteForfeited - loserAnteBurned;

    // Pool operator economics
    const poolOperatorTotalFees = pooledGenerators * avgAntePerGenerator * taoPrice *
                                   (profitablePercent / 100) * (poolOperatorFeePercent / 100);

    // Winner pool = redistributed loser ante (after rake already taken)
    // Break-even players get their ante back
    // Top tier and profitable share the surplus
    const breakEvenReturn = breakEvenCount * avgAntePerGenerator * taoPrice;
    const surplusPool = afterRakePool - breakEvenReturn + loserAnteRedistributed;
    
    // Surplus distributed: 45% to top tier (premium), 55% to profitable tier
    const topTierBonus = surplusPool * 0.45;
    const profitableTierShare = surplusPool * 0.55;

    const avgTopTierPayout = topTierCount > 0 ? topTierBonus / topTierCount : 0;
    const avgProfitablePayout = profitableCount > 0 ? profitableTierShare / profitableCount : 0;
    const avgBreakEvenPayout = avgAntePerGenerator * taoPrice;

    // === MONTHLY AGGREGATES ===
    const monthlyAntePool = epochAntePool * epochsPerDay;
    const monthlyNetworkRake = epochNetworkRake * epochsPerDay;
    const monthlyBurns = loserAnteBurned * epochsPerDay;
    const monthlyPoolOperatorFees = poolOperatorTotalFees * epochsPerDay;

    // === BONUS: TAO EMISSIONS (additive, not required) ===
    const dailyTaoEmission = 7200;
    const subnetDailyTao = dailyTaoEmission * (subnetEmissionShare / 100);
    const subnetDailyUSD = subnetDailyTao * taoPrice;
    const monthlyMinerEmissions = subnetDailyUSD * 0.41 * 30;
    const monthlyValidatorEmissions = subnetDailyUSD * 0.41 * 30;
    const monthlyOwnerEmissions = subnetDailyUSD * 0.18 * 30;
    const totalMonthlyEmissions = monthlyMinerEmissions + monthlyValidatorEmissions + monthlyOwnerEmissions;

    // === BONUS: EXTERNAL REVENUE (additive, not required) ===
    const monthlyExternalRevenue = subscriptionRevenue + (licensingRevenue / 12);

    // === NETWORK PROFIT BREAKDOWN ===
    // CORE profit (from participation alone - ALWAYS POSITIVE)
    const coreProfit = monthlyNetworkRake;
    
    // BONUS profit (emissions + external revenue)
    const bonusProfit = monthlyOwnerEmissions + monthlyExternalRevenue;
    
    // Total network value generated
    const totalNetworkValue = coreProfit + bonusProfit + monthlyBurns;
    
    // Proof: Network is ALWAYS profitable if there are participants
    // networkRakePercent > 0 && totalSignalGenerators > 0 => coreProfit > 0
    const isAlwaysProfitable = totalSignalGenerators > 0 && networkRakePercent > 0;

    // ROI calculations
    const anteInUSD = avgAntePerGenerator * taoPrice;
    const soloTopTierROI = anteInUSD > 0 ? ((avgTopTierPayout) - anteInUSD) / anteInUSD * 100 : 0;
    const pooledTopTierROI = anteInUSD > 0 ? ((avgTopTierPayout * (1 - poolOperatorFeePercent/100)) - anteInUSD) / anteInUSD * 100 : 0;
    const profitableROI = anteInUSD > 0 ? ((avgProfitablePayout) - anteInUSD) / anteInUSD * 100 : 0;

    return {
      // Participant counts
      totalSignalGenerators,
      pooledGenerators,
      soloMinerUIDs,
      poolOperatorUIDs,

      // Epoch metrics
      epochAntePool: epochAntePool.toFixed(0),
      epochNetworkRake: epochNetworkRake.toFixed(0),
      afterRakePool: afterRakePool.toFixed(0),

      // Tier counts
      topTierCount,
      profitableCount,
      breakEvenCount,
      loserCount,

      // Forfeiture mechanics
      loserAnteForfeited: loserAnteForfeited.toFixed(0),
      loserAnteBurned: loserAnteBurned.toFixed(0),
      loserAnteRedistributed: loserAnteRedistributed.toFixed(0),

      // Payouts
      avgTopTierPayout: avgTopTierPayout.toFixed(0),
      avgProfitablePayout: avgProfitablePayout.toFixed(0),
      avgBreakEvenPayout: avgBreakEvenPayout.toFixed(0),
      soloTopTierROI: soloTopTierROI.toFixed(1),
      pooledTopTierROI: pooledTopTierROI.toFixed(1),
      profitableROI: profitableROI.toFixed(1),

      // Pool operator
      poolOperatorTotalFees: poolOperatorTotalFees.toFixed(0),
      monthlyPoolOperatorFees: monthlyPoolOperatorFees.toFixed(0),

      // Monthly
      monthlyAntePool: monthlyAntePool.toFixed(0),
      monthlyNetworkRake: monthlyNetworkRake.toFixed(0),
      monthlyBurns: monthlyBurns.toFixed(0),

      // Emissions
      subnetDailyTao: subnetDailyTao.toFixed(2),
      subnetDailyUSD: subnetDailyUSD.toFixed(0),
      monthlyMinerEmissions: monthlyMinerEmissions.toFixed(0),
      monthlyValidatorEmissions: monthlyValidatorEmissions.toFixed(0),
      monthlyOwnerEmissions: monthlyOwnerEmissions.toFixed(0),
      totalMonthlyEmissions: totalMonthlyEmissions.toFixed(0),

      // Profit breakdown
      coreProfit: coreProfit.toFixed(0),
      bonusProfit: bonusProfit.toFixed(0),
      totalNetworkValue: totalNetworkValue.toFixed(0),
      monthlyExternalRevenue: monthlyExternalRevenue.toFixed(0),
      
      // Status
      isAlwaysProfitable,
      
      // For visualization
      rakePercent: networkRakePercent,
      burnPercent: loserAnteBurnPercent * (loserPercent / 100),
      redistributePercent: (100 - networkRakePercent) * (1 - loserAnteBurnPercent / 100) * (loserPercent / 100)
    };
  }, [tokenModel]);

  const metrics = calculateTokenomics();

  // ========== CHART DATA GENERATORS ==========

  // Power-law distribution
  const generatePowerLawData = (gamma = 1.5, n = 50) => {
    const data = [];
    let totalWeight = 0;
    for (let i = 1; i <= n; i++) {
      totalWeight += Math.pow(i, -gamma);
    }

    let cumulative = 0;
    for (let i = 1; i <= n; i++) {
      const weight = Math.pow(i, -gamma) / totalWeight;
      cumulative += weight;
      data.push({
        rank: i,
        reward: (weight * 100).toFixed(2),
        cumulative: (cumulative * 100).toFixed(1)
      });
    }
    return data;
  };

  // Deflationary trajectory
  const generateDeflationaryData = () => {
    const data = [];
    let supply = 1000000;
    const burnRate = 0.02;
    const emissionRate = 0.015;

    for (let month = 0; month <= 36; month++) {
      const burns = supply * burnRate;
      const emissions = supply * emissionRate * Math.pow(0.95, month / 12);
      supply = supply - burns + emissions;

      data.push({
        month: `M${month}`,
        supply: Math.round(supply),
        burned: Math.round(burns),
        emitted: Math.round(emissions)
      });
    }
    return data;
  };

  // Tier distribution
  const generateTierDistribution = () => {
    const { totalSignalGenerators, topTierPercent, profitablePercent, breakEvenPercent, loserPercent } = tokenModel;
    return [
      { name: 'Top Tier', value: Math.floor(totalSignalGenerators * topTierPercent / 100), color: '#22c55e' },
      { name: 'Profitable', value: Math.floor(totalSignalGenerators * (profitablePercent - topTierPercent) / 100), color: '#3b82f6' },
      { name: 'Break-Even', value: Math.floor(totalSignalGenerators * breakEvenPercent / 100), color: '#9ca3af' },
      { name: 'Penalty', value: Math.floor(totalSignalGenerators * loserPercent / 100), color: '#ef4444' }
    ];
  };

  const powerLawData = useMemo(() => generatePowerLawData(1.5, 50), []);
  const deflationaryData = useMemo(() => generateDeflationaryData(), []);
  const tierData = useMemo(() => generateTierDistribution(), [tokenModel]);

  const handleInputChange = (key, value, min, max) => {
    const numValue = parseFloat(value) || 0;
    let clampedValue = Math.min(max, Math.max(min, numValue));

    setTokenModel(prev => {
      const newModel = { ...prev, [key]: clampedValue };

      // Auto-balance tier percentages
      if (['topTierPercent', 'profitablePercent', 'breakEvenPercent', 'loserPercent'].includes(key)) {
        const tierKeys = ['topTierPercent', 'profitablePercent', 'breakEvenPercent', 'loserPercent'];
        const currentTotal = tierKeys.reduce((sum, k) => sum + (k === key ? clampedValue : prev[k]), 0);

        if (currentTotal !== 100 && key !== 'loserPercent') {
          const otherTotal = tierKeys
            .filter(k => k !== 'loserPercent' && k !== key)
            .reduce((sum, k) => sum + prev[k], 0);
          newModel.loserPercent = Math.max(5, 100 - clampedValue - otherTotal);
        }
      }

      return newModel;
    });
  };

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
          A Self-Sustaining Portfolio-Based Alpha Signal Subnet
        </p>
        <p className="hero-tagline">Decentralized Quantitative Intelligence for U.S. Equities</p>
      </div>
      <div className="fade-in" style={{animationDelay: '0.4s'}}>
        <div className="bittensor-badge">
          <span>Built on Bittensor</span>
          <span className="separator">|</span>
          <span>dTAO Economics</span>
          <span className="separator">|</span>
          <span>Signal Pool Architecture</span>
          <span className="separator">|</span>
          <span>12s Block Time</span>
        </div>
      </div>
    </div>
  );

  const ProblemSlide = () => (
    <div className="slide-content slide-grid-2">
      <div className="slide-left">
        <div className="fade-in">
          <div className="overline">THE PROBLEM</div>
        </div>
        <div className="fade-in" style={{animationDelay: '0.1s'}}>
          <h2 className="section-title">
            Untapped Global<br />
            <span className="gold">Stock Intelligence</span>
          </h2>
        </div>
        <div className="fade-in" style={{animationDelay: '0.2s'}}>
          <div className="problem-summary">
            <p className="summary-lead">
              The U.S. stock market is a <strong>$45 trillion</strong> arena with global interest,
              yet the infrastructure for discovering and rewarding genuine trading talent is fundamentally broken.
            </p>
            <div className="summary-points">
              <div className="sp-item">
                <span className="sp-bullet">→</span>
                <span>Retail traders lack credible ways to prove skill</span>
              </div>
              <div className="sp-item">
                <span className="sp-bullet">→</span>
                <span>Competitions reward luck and recklessness over consistency</span>
              </div>
              <div className="sp-item">
                <span className="sp-bullet">→</span>
                <span>No trustless, verifiable track record system exists</span>
              </div>
            </div>
          </div>
        </div>
        <div className="fade-in" style={{animationDelay: '0.3s'}}>
          <div className="key-stat-box">
            <div className="ksb-value">74-89%</div>
            <div className="ksb-label">of retail traders lose money—yet the problem isn't lack of talent, it's lack of proper infrastructure</div>
          </div>
        </div>
      </div>
      <div className="slide-right">
        {[
          { icon: '🎯', title: 'Risk Rewarded Over Skill', desc: 'Most competitions reward maximum risk-taking, not skill. Winners are often lucky outliers, not consistent performers.' },
          { icon: '🔒', title: 'Gatekept Verification', desc: 'Proving a track record requires expensive audits or platform lock-in. Self-reported returns are meaningless.' },
          { icon: '🌍', title: 'Geographic Barriers', desc: 'Non-U.S. traders can\'t access legitimate competitions. Talent is excluded by jurisdiction, not ability.' },
          { icon: '📉', title: 'No Skin in the Game', desc: 'Paper trading competitions don\'t separate real conviction from noise. Cheap talk pollutes signal quality.' }
        ].map((item, i) => (
          <div key={i} className="problem-card fade-in" style={{animationDelay: `${0.2 + i * 0.1}s`}}>
            <div className="pc-icon">{item.icon}</div>
            <div className="pc-content">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SolutionSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">THE SOLUTION</div>
        <h2 className="section-title">QUANTA: <span className="gold">Skill-to-Value Pipeline</span></h2>
      </div>
      <div className="solution-grid fade-in" style={{animationDelay: '0.2s'}}>
        {[
          { icon: '📊', title: 'Portfolio Signals', desc: 'Submit weighted U.S. equity portfolios as JSON. No code, no complexity—just positions and conviction.' },
          { icon: '⚖️', title: 'Risk-Adjusted Scoring', desc: 'Multi-metric evaluation: Sharpe, Sortino, Calmar, max drawdown, originality. Consistency beats luck.' },
          { icon: '🎯', title: 'Stake-to-Play', desc: 'Signal generators stake α-token ante. Real skin in the game separates signal from noise.' },
          { icon: '🏆', title: 'Meritocratic Rewards', desc: 'Top performers earn emissions + redistributed ante. Bottom tier forfeits stake. Performance is the only currency.' },
          { icon: '∞', title: 'Unlimited Access', desc: 'Signal Pool architecture enables unlimited participants. No UID required to compete and earn.' },
          { icon: '🔗', title: 'On-Chain Verification', desc: 'Immutable track records on Bittensor. Verifiable performance history that can\'t be faked.' }
        ].map((item, i) => (
          <div key={i} className="solution-card">
            <div className="sc-icon">{item.icon}</div>
            <h4 className="sc-title">{item.title}</h4>
            <p className="sc-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const PrecedentSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">PROVEN MODEL</div>
        <h2 className="section-title">The <span className="gold">Numerai</span> Precedent</h2>
      </div>
      <div className="precedent-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="precedent-main">
          <div className="pm-stats">
            <div className="pm-stat">
              <div className="pms-value">$550M</div>
              <div className="pms-label">Assets Under Management</div>
            </div>
            <div className="pm-stat">
              <div className="pms-value">25%</div>
              <div className="pms-label">2024 Net Returns</div>
            </div>
            <div className="pm-stat">
              <div className="pms-value">15,000+</div>
              <div className="pms-label">Active Data Scientists</div>
            </div>
          </div>
          <div className="pm-description">
            <p>
              Numerai built a <strong>$550M hedge fund</strong> powered entirely by crowdsourced
              predictions from anonymous data scientists worldwide. Their model proves that
              <strong> aggregated signal from skilled participants </strong>
              can generate institutional-grade alpha.
            </p>
            <p>
              QUANTA applies this proven framework to <strong>portfolio-based signals</strong>—making
              participation accessible to traders without ML expertise.
            </p>
          </div>
        </div>
        <div className="precedent-highlights">
          <div className="ph-item">
            <div className="ph-icon">✓</div>
            <div className="ph-content">
              <strong>Crowdsourced Alpha Works</strong>
              <span>Aggregated signals outperform individual predictions</span>
            </div>
          </div>
          <div className="ph-item">
            <div className="ph-icon">✓</div>
            <div className="ph-content">
              <strong>Stake Creates Accountability</strong>
              <span>NMR staking separates signal from noise</span>
            </div>
          </div>
          <div className="ph-item">
            <div className="ph-icon">✓</div>
            <div className="ph-content">
              <strong>Global Talent Pool</strong>
              <span>15,000+ anonymous contributors worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // NEW: Scalability Solution Slide
  const ScalabilitySlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">ARCHITECTURE INNOVATION</div>
        <h2 className="section-title">Solving the <span className="gold">256 UID Limit</span></h2>
      </div>
      <div className="scalability-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="scale-problem">
          <div className="sp-icon-large">⚖ </div>
          <h3>The Challenge</h3>
          <p>Bittensor subnets are limited to <strong>256 UIDs</strong> (miners + validators combined).
             Traditional design caps participation at ~192 miners.</p>
          <div className="sp-limit">
            <span className="sp-num">~192</span>
            <span className="sp-label">Max Miner UIDs</span>
          </div>
        </div>
        <div className="scale-arrow">→</div>
        <div className="scale-solution">
          <div className="ss-icon">✨</div>
          <h3>Signal Pool Architecture</h3>
          <p>Decouple <strong>signal submission</strong> from <strong>on-chain registration</strong>.
             Anyone can submit; UIDs represent aggregators.</p>
          <div className="ss-unlimited">
            <span className="ss-num">∞</span>
            <span className="ss-label">Unlimited Participants</span>
          </div>
        </div>
      </div>
      <div className="scale-comparison fade-in" style={{animationDelay: '0.3s'}}>
        <div className="sc-row header">
          <span>Feature</span>
          <span>Traditional Subnet</span>
          <span className="gold">QUANTA Signal Pool</span>
        </div>
        {[
          ['Max Participants', '~192', 'Unlimited'],
          ['Registration', 'UID Required', 'Permissionless'],
          ['Barrier to Entry', 'High (UID cost)', 'Low (stake only)'],
          ['Track Record', 'UID holders only', 'All signal generators'],
          ['Reward Distribution', 'Direct only', 'Direct + Pooled']
        ].map((row, i) => (
          <div key={i} className="sc-row">
            <span>{row[0]}</span>
            <span className="dim">{row[1]}</span>
            <span className="gold">{row[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // NEW: Signal Pool Architecture Slide
  const SignalPoolSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">CORE INNOVATION</div>
        <h2 className="section-title">The <span className="gold">Signal Pool</span> Model</h2>
      </div>
      <div className="pool-architecture fade-in" style={{animationDelay: '0.1s'}}>
        <div className="pa-layer offchain">
          <div className="pal-header">
            <span className="pal-icon">☁</span>
            <span>OFF-CHAIN: Signal Pool (Unlimited Capacity)</span>
          </div>
          <div className="pal-content">
            <div className="participants-grid">
              {Array.from({length: 12}, (_, i) => (
                <div key={i} className="participant-node">SG{i+1}</div>
              ))}
              <div className="participant-more">+{tokenModel.totalSignalGenerators - 12} more</div>
            </div>
            <p className="pal-desc">Anyone submits signals + stakes α-token. No UID needed. All track records stored.</p>
          </div>
        </div>

        <div className="pa-arrow">↓ Top signals selected by Pool Operators ↓</div>

        <div className="pa-layer onchain">
          <div className="pal-header">
            <span className="pal-icon">🔗</span>
            <span>ON-CHAIN: Bittensor Subnet (256 UIDs)</span>
          </div>
          <div className="pal-content">
            <div className="uid-grid">
              <div className="uid-section solo">
                <div className="uids-label">Solo Miners (~{tokenModel.soloMinerUIDs})</div>
                <div className="uids-row">
                  {Array.from({length: 5}, (_, i) => (
                    <div key={i} className="uid-node solo">SM{i+1}</div>
                  ))}
                  <span className="uid-more">...</span>
                </div>
                <p className="uid-desc">Top performers with direct UIDs</p>
              </div>
              <div className="uid-section pool">
                <div className="uids-label">Pool Operators (~{tokenModel.poolOperatorUIDs})</div>
                <div className="uids-row">
                  {Array.from({length: 6}, (_, i) => (
                    <div key={i} className="uid-node pool">PO{i+1}</div>
                  ))}
                  <span className="uid-more">...</span>
                </div>
                <p className="uid-desc">Aggregate signals from generators</p>
              </div>
              <div className="uid-section validators">
                <div className="uids-label">Validators (~64)</div>
                <div className="uids-row">
                  {Array.from({length: 4}, (_, i) => (
                    <div key={i} className="uid-node validator">V{i+1}</div>
                  ))}
                  <span className="uid-more">...</span>
                </div>
                <p className="uid-desc">Score & verify all signals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pa-arrow">↓ Rewards flow back through pools ↓</div>

        <div className="pa-layer output">
          <div className="reward-flow-grid">
            <div className="rf-item">
              <span className="rf-icon">🏆</span>
              <div>
                <strong>Solo Miners</strong>
                <span>Direct rewards (100%)</span>
              </div>
            </div>
            <div className="rf-item">
              <span className="rf-icon">🤝</span>
              <div>
                <strong>Pool Members</strong>
                <span>Via Operator ({100 - tokenModel.poolOperatorFeePercent}%)</span>
              </div>
            </div>
            <div className="rf-item">
              <span className="rf-icon">📊</span>
              <div>
                <strong>Pool Operators</strong>
                <span>Fee ({tokenModel.poolOperatorFeePercent}%)</span>
              </div>
            </div>
            <div className="rf-item">
              <span className="rf-icon">🔥</span>
              <div>
                <strong>Losers</strong>
                <span>Ante burned/redistributed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // NEW: Participation Tiers Slide
  const ParticipationTiersSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">PROGRESSION SYSTEM</div>
        <h2 className="section-title">Participation <span className="gold">Tiers</span></h2>
      </div>
      <div className="tiers-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="tier-ladder">
          {[
            {
              tier: 4, name: 'Solo Miner (UID)', icon: '👑', color: '#d4af37',
              req: '90-day track record, top 10%, UID registration',
              benefit: 'Direct on-chain rewards, no operator fee, full control',
              count: `~${tokenModel.soloMinerUIDs} slots`
            },
            {
              tier: 3, name: 'Pool Operator', icon: '🏛', color: '#9b59b6',
              req: 'UID registration, stake requirement, reputation',
              benefit: 'Earn fees from aggregating signals, build miner pools',
              count: `~${tokenModel.poolOperatorUIDs} slots`
            },
            {
              tier: 2, name: 'Qualified Generator', icon: '⭐', color: '#22c55e',
              req: '60-day track record, top 30% performance',
              benefit: 'Priority pool placement, reduced operator fees',
              count: 'Unlimited'
            },
            {
              tier: 1, name: 'Signal Generator', icon: '📈', color: '#3b82f6',
              req: 'Stake minimum, submit valid portfolio signal',
              benefit: 'Build track record, earn via pools, learn the game',
              count: 'Unlimited'
            }
          ].map((t, i) => (
            <div key={i} className="tier-card" style={{'--tier-color': t.color}}>
              <div className="tc-header">
                <span className="tc-icon">{t.icon}</span>
                <span className="tc-tier">Tier {t.tier}</span>
                <span className="tc-name">{t.name}</span>
                <span className="tc-count">{t.count}</span>
              </div>
              <div className="tc-body">
                <div className="tc-req">
                  <span className="tc-label">Requirements:</span>
                  <span>{t.req}</span>
                </div>
                <div className="tc-benefit">
                  <span className="tc-label">Benefits:</span>
                  <span>{t.benefit}</span>
                </div>
              </div>
              {i < 3 && <div className="tc-arrow">→ Promote</div>}
            </div>
          ))}
        </div>
        <div className="tier-dynamics">
          <h4>Meritocratic Progression</h4>
          <div className="td-items">
            <div className="td-item">
              <span className="td-icon">🔄</span>
              <p><strong>Quarterly Challenge:</strong> Bottom 5% of UID holders face replacement by top-performing challengers</p>
            </div>
            <div className="td-item">
              <span className="td-icon">📊</span>
              <p><strong>Performance-Based:</strong> Track record determines promotion, not capital or connections</p>
            </div>
            <div className="td-item">
              <span className="td-icon">🎯</span>
              <p><strong>Multiple Paths:</strong> Earn as a signal generator OR graduate to direct UID holder</p>
            </div>
            <div className="td-item">
              <span className="td-icon">💰</span>
              <p><strong>Pool Incentives:</strong> Operators compete to attract best generators with lower fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Miner Taxonomy Slide - Interactive explorer of participant types
  const MinerTaxonomySlide = () => {
    const [activeCategory, setActiveCategory] = useState('solo');
    const [activeType, setActiveType] = useState(null);

    const categories = {
      solo: {
        label: 'Solo Miners',
        icon: '👑',
        color: '#d4af37',
        desc: 'Direct UID holders (100% rewards)',
        types: [
          { id: 'discretionary', name: 'Discretionary', icon: '🧠', examples: ['Retail stock picker', 'Professional trader', 'Thematic investor', 'Event-driven specialist'], compute: 'None', interface: 'Web/Mobile' },
          { id: 'systematic', name: 'Systematic', icon: '⚙️', examples: ['Factor quant', 'Stat arb operator', 'ML engineer', 'Alt data specialist', 'RL agent', 'LLM-based'], compute: 'Low to Very High', interface: 'API/CLI' },
          { id: 'hybrid', name: 'Hybrid', icon: '🔀', examples: ['Quant + discretionary override', 'Ensemble aggregator'], compute: 'Varies', interface: 'Dashboard' }
        ]
      },
      pool: {
        label: 'Pool Operators',
        icon: '🏛',
        color: '#9b59b6',
        desc: 'Aggregate signals, earn 10-20% fees',
        types: [
          { id: 'social', name: 'Social Platforms', icon: '👥', examples: ['Copy-trading platform', 'Investment club', 'Research community', 'Advisor network'], compute: 'Web infra', interface: 'Web/Mobile' },
          { id: 'systematic-pool', name: 'Systematic Pools', icon: '🤖', examples: ['Quant competition', 'Algorithm marketplace', 'Academic consortium', 'Robo-advisor aggregator'], compute: 'Moderate-High', interface: 'API/Portal' },
          { id: 'hybrid-pool', name: 'Hybrid Pools', icon: '🔄', examples: ['Analyst + quant fusion', 'Crowd + algorithm ensemble'], compute: 'Moderate', interface: 'Multi-modal' }
        ]
      },
      specialist: {
        label: 'Specialists',
        icon: '🎯',
        color: '#22c55e',
        desc: 'Focused expertise areas',
        types: [
          { id: 'sector', name: 'Sector Focus', icon: '📊', examples: ['Biotech expert', 'Semiconductor specialist', 'Energy sector', 'ESG/Impact'], compute: 'Minimal', interface: 'Any' },
          { id: 'strategy', name: 'Strategy Focus', icon: '📈', examples: ['Deep value', 'Momentum/trend', 'Quality/dividend', 'Small-cap', 'Options-informed'], compute: 'Varies', interface: 'Any' },
          { id: 'geographic', name: 'Geographic', icon: '🌍', examples: ['Chinese ADR specialist', 'European exposure', 'EM markets'], compute: 'Minimal', interface: 'Any' }
        ]
      }
    };

    const interfaces = [
      { name: 'CLI', icon: '⌨️', users: 'Developers, quants', time: '30 min' },
      { name: 'Web', icon: '🌐', users: 'Discretionary traders', time: '5 min' },
      { name: 'Mobile', icon: '📱', users: 'Retail investors', time: '5 min' },
      { name: 'API', icon: '🔌', users: 'Platforms, institutions', time: '2-4 hrs' },
      { name: 'Spreadsheet', icon: '📊', users: 'Finance professionals', time: '15 min' },
      { name: 'Social/Chat', icon: '💬', users: 'Communities, clubs', time: '5 min' }
    ];

    const activeData = categories[activeCategory];

    return (
      <div className="slide-content">
        <div className="slide-header">
          <div className="overline">PARTICIPANT ECOSYSTEM</div>
          <h2 className="section-title">Miner <span className="gold">Taxonomy</span></h2>
          <p className="slide-subtitle">From casual stock pickers to sophisticated ML pipelines—all welcome</p>
        </div>

        <div className="taxonomy-layout fade-in" style={{animationDelay: '0.1s'}}>
          {/* Left: Category Navigator */}
          <div className="tax-navigator">
            <div className="tax-categories">
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  className={`tax-cat-btn ${activeCategory === key ? 'tax-cat-btn--active' : ''}`}
                  onClick={() => { setActiveCategory(key); setActiveType(null); }}
                  style={{'--cat-color': cat.color}}
                >
                  <span className="tax-cat-icon">{cat.icon}</span>
                  <div className="tax-cat-info">
                    <span className="tax-cat-label">{cat.label}</span>
                    <span className="tax-cat-desc">{cat.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Interface Types */}
            <div className="tax-interfaces">
              <div className="tax-interfaces-header">Submission Interfaces</div>
              <div className="tax-interface-grid">
                {interfaces.map((iface, i) => (
                  <div key={i} className="tax-interface">
                    <span className="tax-if-icon">{iface.icon}</span>
                    <span className="tax-if-name">{iface.name}</span>
                    <span className="tax-if-time">{iface.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Type Details */}
          <div className="tax-details" style={{'--active-color': activeData.color}}>
            <div className="tax-details-header">
              <span className="tax-dh-icon">{activeData.icon}</span>
              <span className="tax-dh-title">{activeData.label}</span>
            </div>

            <div className="tax-types">
              {activeData.types.map((type) => (
                <div
                  key={type.id}
                  className={`tax-type ${activeType === type.id ? 'tax-type--expanded' : ''}`}
                  onClick={() => setActiveType(activeType === type.id ? null : type.id)}
                >
                  <div className="tax-type-header">
                    <span className="tax-type-icon">{type.icon}</span>
                    <span className="tax-type-name">{type.name}</span>
                    <span className="tax-type-toggle">{activeType === type.id ? '−' : '+'}</span>
                  </div>
                  {activeType === type.id && (
                    <div className="tax-type-details">
                      <div className="tax-type-examples">
                        {type.examples.map((ex, i) => (
                          <span key={i} className="tax-example">{ex}</span>
                        ))}
                      </div>
                      <div className="tax-type-meta">
                        <span><strong>Compute:</strong> {type.compute}</span>
                        <span><strong>Interface:</strong> {type.interface}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="tax-comparison">
              <div className="tax-comp-header">QUANTA vs Numerai</div>
              <div className="tax-comp-row">
                <div className="tax-comp-item tax-comp-item--quanta">
                  <span className="tax-comp-label">QUANTA</span>
                  <span className="tax-comp-value">Portfolio weights (any method)</span>
                </div>
                <div className="tax-comp-item tax-comp-item--numerai">
                  <span className="tax-comp-label">Numerai</span>
                  <span className="tax-comp-value">ML predictions on obfuscated data</span>
                </div>
              </div>
              <div className="tax-comp-insight">
                <strong>Key:</strong> "Can you pick good stocks?" not "Can you build ML models?"
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // NEW: Reward Flow Slide with Chart
  const RewardFlowSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">ECONOMICS</div>
        <h2 className="section-title">Reward <span className="gold">Distribution</span></h2>
      </div>
      <div className="reward-distribution-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="rd-chart">
          <h4 className="chart-title">Performance Tier Distribution</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={tierData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {tierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="rd-total">
            <span className="rdt-value">{tokenModel.totalSignalGenerators}</span>
            <span className="rdt-label">Total Generators</span>
          </div>
        </div>
        <div className="rd-breakdown">
          <h4>Performance Outcomes</h4>
          <div className="rdb-items">
            {[
              { tier: 'Top Tier', pct: tokenModel.topTierPercent, reward: `+150-300% ROI`, note: 'Solo: 100% | Pooled: 85%', color: '#22c55e' },
              { tier: 'Profitable', pct: tokenModel.profitablePercent - tokenModel.topTierPercent, reward: '+20-80% ROI', note: 'Solid returns after fees', color: '#3b82f6' },
              { tier: 'Break-Even', pct: tokenModel.breakEvenPercent, reward: '0% (ante returned)', note: 'No gain, no loss', color: '#9ca3af' },
              { tier: 'Penalty Band', pct: tokenModel.loserPercent, reward: '-100% (ante lost)', note: '50% burned, 50% redistributed', color: '#ef4444' }
            ].map((item, i) => (
              <div key={i} className="rdb-item" style={{'--item-color': item.color}}>
                <div className="rdb-tier">
                  <span className="rdb-name">{item.tier}</span>
                  <span className="rdb-pct">{item.pct}%</span>
                </div>
                <div className="rdb-reward">{item.reward}</div>
                <div className="rdb-note-text">{item.note}</div>
              </div>
            ))}
          </div>
          <div className="rdb-note">
            <span className="rdb-icon">💡</span>
            <span>Pool operators earn {tokenModel.poolOperatorFeePercent}% fee from their generators' rewards</span>
          </div>
        </div>
      </div>
    </div>
  );

  const HowItWorksSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">PARTICIPATION FLOW</div>
        <h2 className="section-title">How <span className="gold">QUANTA</span> Works</h2>
      </div>
      <div className="flow-diagram fade-in" style={{animationDelay: '0.1s'}}>
        {[
          { step: '1', title: 'Join Signal Pool', desc: 'Anyone stakes α-token and submits portfolio signal (JSON: tickers + weights). No UID required.' },
          { step: '2', title: 'Signals Scored', desc: 'Validators mark portfolios to market. Rolling 7/30/90-day performance tracked for all generators.' },
          { step: '3', title: 'Pool Selection', desc: 'Pool Operators select best-performing signals to aggregate and submit on-chain.' },
          { step: '4', title: 'Consensus', desc: 'Yuma Consensus determines final scores. Top performers ranked by risk-adjusted metrics.' },
          { step: '5', title: 'Distribution', desc: 'Winners: rewards via direct or pooled channels. Losers: ante forfeited (50% burned).' }
        ].map((item, i) => (
          <div key={i} className="flow-step">
            <div className="fs-number">{item.step}</div>
            <div className="fs-content">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
            {i < 4 && <div className="fs-arrow">→</div>}
          </div>
        ))}
      </div>
      <div className="flow-summary fade-in" style={{animationDelay: '0.4s'}}>
        <div className="fs-badge">🔄 Continuous Competition</div>
        <p>Signals persist until updated. Churn penalties discourage excessive rebalancing. Long-term alpha rewarded.</p>
      </div>
    </div>
  );

  const NetworkDiagramSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">NETWORK TOPOLOGY</div>
        <h2 className="section-title">Decentralized <span className="gold">Architecture</span></h2>
      </div>
      <div className="network-viz fade-in" style={{animationDelay: '0.1s'}}>
        <div className="nv-layer generators-layer">
          <div className="nv-label">Signal Generators (Unlimited)</div>
          <div className="nv-nodes">
            {Array.from({length: 10}, (_, i) => (
              <div key={i} className="nv-node generator">📈</div>
            ))}
            <span className="nv-ellipsis">+{tokenModel.totalSignalGenerators - 10}...</span>
          </div>
          <div className="nv-desc">Submit portfolio signals + stake ante</div>
        </div>
        <div className="nv-flow">↓ Signals + Stakes ↓</div>
        <div className="nv-layer operators-layer">
          <div className="nv-label">Pool Operators & Solo Miners</div>
          <div className="nv-nodes">
            {Array.from({length: 4}, (_, i) => (
              <div key={i} className="nv-node operator">🏛</div>
            ))}
            {Array.from({length: 4}, (_, i) => (
              <div key={i} className="nv-node solo">👑</div>
            ))}
            <span className="nv-ellipsis">...</span>
          </div>
          <div className="nv-desc">Aggregate & submit on-chain | Direct submissions</div>
        </div>
        <div className="nv-flow">↓ On-Chain Submissions ↓</div>
        <div className="nv-layer validators-layer">
          <div className="nv-label">Validators</div>
          <div className="nv-nodes">
            {Array.from({length: 5}, (_, i) => (
              <div key={i} className="nv-node validator">🔒</div>
            ))}
            <span className="nv-ellipsis">...</span>
          </div>
          <div className="nv-desc">Verify signals, compute scores, propose weights</div>
        </div>
        <div className="nv-flow">↓ Yuma Consensus ↓</div>
        <div className="nv-layer chain-layer">
          <div className="nv-chain-box">
            <div className="nv-chain-title">🔗 Bittensor Blockchain</div>
            <div className="nv-chain-items">
              <span>dTAO Emissions</span>
              <span>12s Block Time</span>
              <span>256 UIDs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EpochLifecycleSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">TEMPORAL MECHANICS</div>
        <h2 className="section-title">Epoch <span className="gold">Lifecycle</span></h2>
      </div>
      <div className="epoch-timeline fade-in" style={{animationDelay: '0.1s'}}>
        <div className="et-track">
          <div className="et-segment commit">
            <div className="ets-label">1-Hour Epochs</div>
            <div className="ets-time">24/day</div>
            <div className="ets-desc">High-frequency signal updates, rapid feedback</div>
          </div>
          <div className="et-segment reveal">
            <div className="ets-label">1-Day Epochs</div>
            <div className="ets-time">Real-time</div>
            <div className="ets-desc">Daily aggregation, position persistence</div>
          </div>
          <div className="et-segment eval">
            <div className="ets-label">Continuous Eval</div>
            <div className="ets-time">Real-time</div>
            <div className="ets-desc">Mark-to-market, Sharpe calculation</div>
          </div>
          <div className="et-segment distribute">
            <div className="ets-label">Distribution</div>
            <div className="ets-time">Per epoch</div>
            <div className="ets-desc">Proportional rewards, rolling payout</div>
          </div>
        </div>
      </div>
      <div className="epoch-windows fade-in" style={{animationDelay: '0.3s'}}>
        <h4>Rolling Evaluation Windows</h4>
        <div className="ew-grid">
          <div className="ew-item">
            <span className="ew-period">7 Days</span>
            <span className="ew-weight">20%</span>
            <span className="ew-focus">Short-term momentum</span>
          </div>
          <div className="ew-item">
            <span className="ew-period">30 Days</span>
            <span className="ew-weight">35%</span>
            <span className="ew-focus">Monthly consistency</span>
          </div>
          <div className="ew-item">
            <span className="ew-period">90 Days</span>
            <span className="ew-weight">45%</span>
            <span className="ew-focus">Quarterly persistence</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ScoringSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">PERFORMANCE EVALUATION</div>
        <h2 className="section-title">Composite <span className="gold">Scoring System</span></h2>
      </div>
      <div className="scoring-grid fade-in" style={{animationDelay: '0.1s'}}>
        <div className="scoring-metrics">
          {[
            { name: 'Sharpe Ratio', weight: '40%', desc: 'Primary: Risk-adjusted returns (industry standard)', formula: '(R - Rf) / σ' },
            { name: 'Total P/L %', weight: '20%', desc: 'Absolute return performance', formula: '(Vₙ - V₀) / V₀' },
            { name: 'Max Drawdown', weight: '15%', desc: 'Largest peak-to-trough decline', formula: '-min((P - Peak) / Peak)' },
            { name: 'Sortino Ratio', weight: '10%', desc: 'Downside-adjusted returns', formula: '(R - Rf) / σ_down' },
            { name: 'Calmar Ratio', weight: '10%', desc: 'Return vs max drawdown', formula: 'CAGR / MaxDD' },
            { name: 'Turnover', weight: '5%', desc: 'Portfolio stability penalty', formula: 'Σ|Δweights|' }
          ].map((m, i) => (
            <div key={i} className="sm-item">
              <div className="sm-header">
                <span className="sm-name">{m.name}</span>
                <span className="sm-weight">{m.weight}</span>
              </div>
              <p className="sm-desc">{m.desc}</p>
              <code className="sm-formula">{m.formula}</code>
            </div>
          ))}
        </div>
        <div className="scoring-composite">
          <h4>Composite Score Formula</h4>
          <div className="sc-formula">
            <code>Score = Σ(wi × normalize(metricᵢ))</code>
          </div>
          <div className="sc-notes">
            <p>All metrics normalized to [0, 1] range</p>
            <p>Outlier capping at 3σ</p>
            <p>Drawdown penalty &gt;10%: -0.1 per 1%</p>
            <p>Originality bonus for unique signals</p>
          </div>
        </div>
      </div>
    </div>
  );

  const TokenomicsSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">SPORTSBOOK ECONOMICS</div>
        <h2 className="section-title">Self-Sustaining <span className="gold">Tokenomics</span></h2>
      </div>
      <div className="tokenomics-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="tl-principle">
          <div className="tlp-icon">⚡</div>
          <div className="tlp-content">
            <h3>Guaranteed Network Sustainability</h3>
            <p>
              QUANTA takes a <strong>rake from the pool first</strong>—before any payouts.
              As long as there are participants, the network is profitable.
              Losers fund winners. External revenue is pure bonus.
            </p>
          </div>
        </div>
        <div className="tl-flow">
          <div className="tlf-step">
            <div className="tlfs-num">1</div>
            <div className="tlfs-content">
              <h4>Pool Collection</h4>
              <p>All generators stake ante</p>
            </div>
          </div>
          <div className="tlf-arrow">→</div>
          <div className="tlf-step highlight">
            <div className="tlfs-num">2</div>
            <div className="tlfs-content">
              <h4>Network Rake</h4>
              <p>{tokenModel.networkRakePercent}% taken first</p>
            </div>
          </div>
          <div className="tlf-arrow">→</div>
          <div className="tlf-step">
            <div className="tlfs-num">3</div>
            <div className="tlfs-content">
              <h4>Burn + Redistribute</h4>
              <p>Loser ante: 50/50 split</p>
            </div>
          </div>
          <div className="tlf-arrow">→</div>
          <div className="tlf-step">
            <div className="tlfs-num">4</div>
            <div className="tlfs-content">
              <h4>Winner Payouts</h4>
              <p>Via direct or pools</p>
            </div>
          </div>
        </div>
      </div>
      <div className="tl-key-insight fade-in" style={{animationDelay: '0.3s'}}>
        <div className="tlki-formula">
          <span className="tlki-left">Network Profit</span>
          <span className="tlki-eq">=</span>
          <span className="tlki-right">
            <span className="tlki-core">Rake (guaranteed)</span>
            <span className="tlki-plus">+</span>
            <span className="tlki-bonus">Emissions + Revenue (bonus)</span>
          </span>
        </div>
        <p className="tlki-note">Network profit is <strong>always positive</strong> when participants &gt; 0</p>
      </div>
    </div>
  );

  const RewardMechanicsSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">DISTRIBUTION MECHANICS</div>
        <h2 className="section-title">Power-Law <span className="gold">Rewards</span></h2>
      </div>
      <div className="distribution-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="dist-chart">
          <h4 className="chart-title">Reward Distribution by Rank (γ = 1.5)</h4>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={powerLawData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="rank" stroke="#666" tick={{fontSize: 10}} />
              <YAxis yAxisId="left" stroke="#d4af37" tick={{fontSize: 10}} />
              <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" tick={{fontSize: 10}} domain={[0, 100]} />
              <Tooltip contentStyle={{backgroundColor: '#1a1a2e', border: '1px solid #333'}} />
              <Legend />
              <Bar yAxisId="left" dataKey="reward" fill="#d4af37" name="Individual %" />
              <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#3b82f6" strokeWidth={2} dot={false} name="Cumulative %" />
              <ReferenceLine yAxisId="right" y={50} stroke="#22c55e" strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="dist-explanation">
          <h4>Key Insights</h4>
          <div className="de-items">
            <div className="de-item">
              <span className="de-icon">🥇</span>
              <p><strong>Top 10%</strong> receive ~50% of rewards</p>
            </div>
            <div className="de-item">
              <span className="de-icon">📉</span>
              <p><strong>Steep curve</strong> incentivizes excellence</p>
            </div>
            <div className="de-item">
              <span className="de-icon">⚖️</span>
              <p><strong>γ parameter</strong> is governance-adjustable</p>
            </div>
            <div className="de-item">
              <span className="de-icon">🔥</span>
              <p><strong>Bottom 30%</strong> forfeit ante entirely</p>
            </div>
          </div>
          <div className="de-formula">
            <code>Reward_i = R_total × (rank)^(-γ) / Σ(rank_j)^(-γ)</code>
          </div>
        </div>
      </div>
    </div>
  );


  // Interactive Model Slide - Comprehensive Economics Simulator
  const InteractiveModelSlide = () => {
    const tierTotal = tokenModel.topTierPercent + tokenModel.profitablePercent + 
                      tokenModel.breakEvenPercent + tokenModel.loserPercent;

    return (
      <div className="slide-content">
        <div className="slide-header">
          <div className="overline">INTERACTIVE SIMULATOR</div>
          <h2 className="section-title">Self-Sustaining <span className="gold">Economics Model</span></h2>
        </div>
        <div className="model-layout">
          <div className="model-inputs">
            <div className="model-section">
              <h4>🌐 Network Parameters</h4>
              <div className="input-grid">
                {[
                  { label: 'TAO Price ($)', key: 'taoPrice', min: 50, max: 2000, step: 10, format: (v) => `$${v}` },
                  { label: 'Emission Share (%)', key: 'subnetEmissionShare', min: 0.1, max: 15, step: 0.1, format: (v) => `${v}%` },
                  { label: 'Signal Generators', key: 'totalSignalGenerators', min: 50, max: 5000, step: 50, format: (v) => v },
                  { label: 'Solo Miner UIDs', key: 'soloMinerUIDs', min: 10, max: 100, step: 5, format: (v) => v },
                  { label: 'Avg Ante (TAO)', key: 'avgAntePerGenerator', min: 0.01, max: 5, step: 0.01, format: (v) => v.toFixed(2) },
                  { label: 'Epochs / Month', key: 'epochsPerDay', min: 1, max: 12, step: 1, format: (v) => v },
                ].map((input, i) => (
                  <div key={input.key} className="input-row">
                    <label>{input.label}</label>
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={tokenModel[input.key]}
                      onMouseDown={(e) => e.stopPropagation()}
                      onInput={(e) => handleInputChange(input.key, e.target.value, input.min, input.max)}
                      onChange={(e) => handleInputChange(input.key, e.target.value, input.min, input.max)}
                    />
                    {editingField === input.key ? (
                      <input
                        type="number"
                        className="input-val-edit"
                        min={input.min}
                        max={input.max}
                        step={input.step}
                        value={tokenModel[input.key]}
                        onChange={(e) => handleInputChange(input.key, e.target.value, input.min, input.max)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                        autoFocus
                      />
                    ) : (
                      <span className="input-val clickable" onClick={() => setEditingField(input.key)}>
                        {input.format(tokenModel[input.key])}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="model-section">
              <h4>💰 Economics</h4>
              <div className="input-grid">
                <div className="input-row highlight-rake">
                  <label>Network Rake (%)</label>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    step={1}
                    value={tokenModel.networkRakePercent}
                    onMouseDown={(e) => e.stopPropagation()}
                    onInput={(e) => handleInputChange('networkRakePercent', e.target.value, 2, 20)}
                    onChange={(e) => handleInputChange('networkRakePercent', e.target.value, 2, 20)}
                  />
                  {editingField === 'networkRakePercent' ? (
                    <input
                      type="number"
                      className="input-val-edit gold"
                      min={2}
                      max={20}
                      step={1}
                      value={tokenModel.networkRakePercent}
                      onChange={(e) => handleInputChange('networkRakePercent', e.target.value, 2, 20)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                      autoFocus
                    />
                  ) : (
                    <span className="input-val gold clickable" onClick={() => setEditingField('networkRakePercent')}>{tokenModel.networkRakePercent}%</span>
                  )}
                </div>
                <div className="input-row">
                  <label>Pool Operator Fee (%)</label>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={tokenModel.poolOperatorFeePercent}
                    onMouseDown={(e) => e.stopPropagation()}
                    onInput={(e) => handleInputChange('poolOperatorFeePercent', e.target.value, 5, 25)}
                    onChange={(e) => handleInputChange('poolOperatorFeePercent', e.target.value, 5, 25)}
                  />
                  {editingField === 'poolOperatorFeePercent' ? (
                    <input
                      type="number"
                      className="input-val-edit"
                      min={5}
                      max={25}
                      step={1}
                      value={tokenModel.poolOperatorFeePercent}
                      onChange={(e) => handleInputChange('poolOperatorFeePercent', e.target.value, 5, 25)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                      autoFocus
                    />
                  ) : (
                    <span className="input-val clickable" onClick={() => setEditingField('poolOperatorFeePercent')}>{tokenModel.poolOperatorFeePercent}%</span>
                  )}
                </div>
                <div className="input-row">
                  <label>Loser Ante Burn (%)</label>
                  <input
                    type="range"
                    min={20}
                    max={80}
                    step={5}
                    value={tokenModel.loserAnteBurnPercent}
                    onMouseDown={(e) => e.stopPropagation()}
                    onInput={(e) => handleInputChange('loserAnteBurnPercent', e.target.value, 20, 80)}
                    onChange={(e) => handleInputChange('loserAnteBurnPercent', e.target.value, 20, 80)}
                  />
                  {editingField === 'loserAnteBurnPercent' ? (
                    <input
                      type="number"
                      className="input-val-edit"
                      min={20}
                      max={80}
                      step={5}
                      value={tokenModel.loserAnteBurnPercent}
                      onChange={(e) => handleInputChange('loserAnteBurnPercent', e.target.value, 20, 80)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                      autoFocus
                    />
                  ) : (
                    <span className="input-val clickable" onClick={() => setEditingField('loserAnteBurnPercent')}>{tokenModel.loserAnteBurnPercent}%</span>
                  )}
                </div>
              </div>
            </div>

            <div className="model-section">
              <h4>📊 Performance Tiers ({tierTotal}%)</h4>
              <div className="input-grid tier-inputs">
                {[
                  { label: '🥇 Top Tier', key: 'topTierPercent', min: 5, max: 30, color: '#22c55e' },
                  { label: '🥈 Profitable', key: 'profitablePercent', min: 20, max: 60, color: '#3b82f6' },
                  { label: '➡️ Break-Even', key: 'breakEvenPercent', min: 0, max: 40, color: '#9ca3af' },
                  { label: '❌ Bottom Tier', key: 'loserPercent', min: 10, max: 50, color: '#ef4444' },
                ].map((input, i) => (
                  <div key={input.key} className="input-row" style={{'--tier-color': input.color}}>
                    <label>{input.label}</label>
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={5}
                      value={tokenModel[input.key]}
                      onMouseDown={(e) => e.stopPropagation()}
                      onInput={(e) => handleInputChange(input.key, e.target.value, input.min, input.max)}
                      onChange={(e) => handleInputChange(input.key, e.target.value, input.min, input.max)}
                    />
                    {editingField === input.key ? (
                      <input
                        type="number"
                        className="input-val-edit"
                        min={input.min}
                        max={input.max}
                        step={5}
                        value={tokenModel[input.key]}
                        onChange={(e) => handleInputChange(input.key, e.target.value, input.min, input.max)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                        autoFocus
                      />
                    ) : (
                      <span className="input-val clickable" onClick={() => setEditingField(input.key)}>{tokenModel[input.key]}%</span>
                    )}
                  </div>
                ))}
              </div>
              {tierTotal !== 100 && (
                <div className="tier-warning">⚠️ Tiers must sum to 100%</div>
              )}
            </div>

            <div className="model-section bonus-section">
              <h4>🎁 Bonus Revenue (Optional)</h4>
              <p className="section-note">NOT required for profitability</p>
              <div className="input-grid">
                {[
                  { label: 'Monthly Subs ($K)', key: 'subscriptionRevenue', min: 0, max: 500, step: 5, isK: true },
                  { label: 'Annual License ($K)', key: 'licensingRevenue', min: 0, max: 2000, step: 10, isK: true }
                ].map((input, i) => (
                  <div key={input.key} className="input-row bonus-row">
                    <label>{input.label}</label>
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={input.isK ? tokenModel[input.key] / 1000 : tokenModel[input.key]}
                      onMouseDown={(e) => e.stopPropagation()}
                      onInput={(e) => handleInputChange(
                        input.key,
                        input.isK ? parseFloat(e.target.value) * 1000 : e.target.value,
                        input.isK ? input.min * 1000 : input.min,
                        input.isK ? input.max * 1000 : input.max
                      )}
                      onChange={(e) => handleInputChange(
                        input.key,
                        input.isK ? parseFloat(e.target.value) * 1000 : e.target.value,
                        input.isK ? input.min * 1000 : input.min,
                        input.isK ? input.max * 1000 : input.max
                      )}
                    />
                    {editingField === input.key ? (
                      <input
                        type="number"
                        className="input-val-edit bonus"
                        min={input.min}
                        max={input.max}
                        step={input.step}
                        value={tokenModel[input.key] / 1000}
                        onChange={(e) => handleInputChange(input.key, parseFloat(e.target.value) * 1000, input.min * 1000, input.max * 1000)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                        autoFocus
                      />
                    ) : (
                      <span className="input-val bonus clickable" onClick={() => setEditingField(input.key)}>
                        ${(tokenModel[input.key] / 1000).toFixed(0)}K
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="model-outputs">
            {/* PROFITABILITY GUARANTEE */}
            <div className="profit-guarantee">
              <div className="pg-icon">✅</div>
              <div className="pg-content">
                <h4>Network Always Profitable</h4>
                <p>Rake taken first • Participants &gt; 0 • Profit &gt; 0</p>
              </div>
            </div>

            <div className="output-section">
              <h5>🔥 Epoch Pool (Per Epoch)</h5>
              <div className="output-row">
                <span>Total Ante Collected</span>
                <span>${Number(metrics.epochAntePool).toLocaleString()}</span>
              </div>
              <div className="output-row highlight-rake">
                <span>Network Rake ({tokenModel.networkRakePercent}%)</span>
                <span className="gold">-${Number(metrics.epochNetworkRake).toLocaleString()}</span>
              </div>
              <div className="output-row">
                <span>Pool After Rake</span>
                <span>${Number(metrics.afterRakePool).toLocaleString()}</span>
              </div>
            </div>

            <div className="output-section">
              <h5>👥 Tier Distribution</h5>
              <div className="tier-viz">
                <div className="tv-bar">
                  <div className="tv-seg top" style={{width: `${tokenModel.topTierPercent}%`}}>
                    {metrics.topTierCount}
                  </div>
                  <div className="tv-seg profitable" style={{width: `${tokenModel.profitablePercent}%`}}>
                    {metrics.profitableCount}
                  </div>
                  <div className="tv-seg breakeven" style={{width: `${tokenModel.breakEvenPercent}%`}}>
                    {metrics.breakEvenCount}
                  </div>
                  <div className="tv-seg loser" style={{width: `${tokenModel.loserPercent}%`}}>
                    {metrics.loserCount}
                  </div>
                </div>
                <div className="tv-legend">
                  <span className="tvl-item top">🥇 Top: {metrics.topTierCount}</span>
                  <span className="tvl-item profitable">🥈 Profit: {metrics.profitableCount}</span>
                  <span className="tvl-item breakeven">➡️ Even: {metrics.breakEvenCount}</span>
                  <span className="tvl-item loser">❌ Lose: {metrics.loserCount}</span>
                </div>
              </div>
            </div>

            <div className="output-section">
              <h5>🔥 Loser Ante Mechanics</h5>
              <div className="output-row">
                <span>Ante Forfeited ({metrics.loserCount} generators)</span>
                <span className="red">${Number(metrics.loserAnteForfeited).toLocaleString()}</span>
              </div>
              <div className="output-row">
                <span>→ Burned ({tokenModel.loserAnteBurnPercent}%)</span>
                <span className="orange">🔥 ${Number(metrics.loserAnteBurned).toLocaleString()}</span>
              </div>
              <div className="output-row">
                <span>→ To Winners ({100 - tokenModel.loserAnteBurnPercent}%)</span>
                <span className="green">💰 ${Number(metrics.loserAnteRedistributed).toLocaleString()}</span>
              </div>
            </div>

            <div className="output-section">
              <h5>💵 Monthly Profit Breakdown</h5>
              <div className="profit-breakdown">
                <div className="pb-item core">
                  <span className="pb-label">Core Profit (Rake)</span>
                  <span className="pb-value">${Number(metrics.monthlyNetworkRake).toLocaleString()}</span>
                  <span className="pb-tag">GUARANTEED</span>
                </div>
                <div className="pb-plus">+</div>
                <div className="pb-item bonus">
                  <span className="pb-label">Bonus (Emissions)</span>
                  <span className="pb-value">${Number(metrics.monthlyOwnerEmissions).toLocaleString()}</span>
                  <span className="pb-tag">18% Owner Share</span>
                </div>
                <div className="pb-plus">+</div>
                <div className="pb-item bonus">
                  <span className="pb-label">Bonus (Revenue)</span>
                  <span className="pb-value">${Number(metrics.monthlyExternalRevenue).toLocaleString()}</span>
                  <span className="pb-tag">OPTIONAL</span>
                </div>
                <div className="pb-plus">+</div>
                <div className="pb-item burn">
                  <span className="pb-label">Value Burned</span>
                  <span className="pb-value">${Number(metrics.monthlyBurns).toLocaleString()}</span>
                  <span className="pb-tag">DEFLATIONARY</span>
                </div>
                <div className="pb-equals">=</div>
                <div className="pb-item total">
                  <span className="pb-label">Total Value Generated</span>
                  <span className="pb-value">${Number(metrics.totalNetworkValue).toLocaleString()}/mo</span>
                </div>
              </div>
            </div>

            <div className="output-section">
              <h5>📈 ROI by Tier (Monthly)</h5>
              <div className="roi-grid">
                <div className="roi-item top">
                  <span className="roi-tier">🥇 Top {tokenModel.topTierPercent}%</span>
                  <span className="roi-payout">${Number(metrics.avgTopTierPayout).toLocaleString()}</span>
                  <span className="roi-pct">+{metrics.soloTopTierROI}%</span>
                </div>
                <div className="roi-item profitable">
                  <span className="roi-tier">🥈 Profitable</span>
                  <span className="roi-payout">${Number(metrics.avgProfitablePayout).toLocaleString()}</span>
                  <span className="roi-pct">+{metrics.profitableROI}%</span>
                </div>
                <div className="roi-item breakeven">
                  <span className="roi-tier">➡️ Break-Even</span>
                  <span className="roi-payout">${Number(metrics.avgBreakEvenPayout).toLocaleString()}</span>
                  <span className="roi-pct">0%</span>
                </div>
                <div className="roi-item loser">
                  <span className="roi-tier">❌ Bottom {tokenModel.loserPercent}%</span>
                  <span className="roi-payout">$0</span>
                  <span className="roi-pct">-100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeflationarySlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">SUPPLY DYNAMICS</div>
        <h2 className="section-title">Deflationary <span className="gold">Trajectory</span></h2>
      </div>
      <div className="deflationary-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="defl-chart">
          <h4 className="chart-title">36-Month Supply Projection</h4>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={deflationaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" tick={{fontSize: 10}} />
              <YAxis stroke="#666" tick={{fontSize: 10}} />
              <Tooltip contentStyle={{backgroundColor: '#1a1a2e', border: '1px solid #333'}} />
              <Legend />
              <Area type="monotone" dataKey="supply" stroke="#d4af37" fill="#d4af3730" name="Total Supply" />
              <ReferenceLine y={1000000} stroke="#ef4444" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="defl-mechanics">
          <h4>Burn Mechanisms</h4>
          <div className="dm-items">
            {[
              { icon: '🔥', label: 'Loser Ante', pct: '50%', desc: 'of forfeited stakes burned' },
              { icon: '⭕', label: 'Unclaimed', pct: '100%', desc: 'unearned rewards destroyed' },
              { icon: '💵', label: 'Buybacks', pct: 'Var', desc: 'revenue-funded burns' }
            ].map((m, i) => (
              <div key={i} className="dm-item">
                <span className="dm-icon">{m.icon}</span>
                <span className="dm-pct">{m.pct}</span>
                <div className="dm-content">
                  <span className="dm-label">{m.label}</span>
                  <span className="dm-desc">{m.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="dm-result">
            <code>Burns &gt; Emissions = Deflationary</code>
          </div>
        </div>
      </div>
    </div>
  );

  // Dual Revenue Flywheel Slide - Why emissions + competition work together
  const DualRevenueSlide = () => {
    return (
      <div className="slide-content">
        <div className="slide-header">
          <div className="overline">WHY TWO LAYERS MATTER</div>
          <h2 className="section-title">Pot + Emissions = <span className="gold">Network Depth</span></h2>
          <p className="slide-subtitle">Prize pool rewards performance. Emissions sustain participation and infrastructure.</p>
        </div>

        <div className="dual-revenue-layout fade-in" style={{animationDelay: '0.1s'}}>
          {/* Left: Comparison */}
          <div className="dr-comparison">
            {/* Prize Pool Only - The Problem */}
            <div className="dr-model dr-model--problem">
              <div className="drm-header">
                <span className="drm-icon">🏆</span>
                <span className="drm-title">Prize Pool Only</span>
                <span className="drm-badge drm-badge--bad">Network Death Spiral</span>
              </div>
              <div className="drm-body">
                <div className="drm-flow">
                  <div className="drm-flow-item">Winner takes most</div>
                  <div className="drm-flow-arrow">↓</div>
                  <div className="drm-flow-item">Losers leave</div>
                  <div className="drm-flow-arrow">↓</div>
                  <div className="drm-flow-item">Validators unpaid</div>
                  <div className="drm-flow-arrow">↓</div>
                  <div className="drm-flow-item drm-flow-item--bad">Network thins → 5 whales competing</div>
                </div>
                <div className="drm-problems">
                  <div className="drm-problem">
                    <span className="drm-x">✗</span>
                    <span>No incentive to run infrastructure</span>
                  </div>
                  <div className="drm-problem">
                    <span className="drm-x">✗</span>
                    <span>Long-tail signals disappear</span>
                  </div>
                  <div className="drm-problem">
                    <span className="drm-x">✗</span>
                    <span>Meta-signal becomes worthless</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUANTA Model - The Solution */}
            <div className="dr-model dr-model--solution">
              <div className="drm-header">
                <span className="drm-icon">⚡</span>
                <span className="drm-title">QUANTA: Pot + Emissions</span>
                <span className="drm-badge drm-badge--good">Self-Sustaining</span>
              </div>
              <div className="drm-body">
                <div className="drm-split">
                  <div className="drm-split-box drm-split-pot">
                    <div className="drm-split-label">Competition Pot</div>
                    <div className="drm-split-desc">Rewards performance</div>
                    <ul className="drm-split-list">
                      <li>Top performers win big</li>
                      <li>Ante redistribution</li>
                      <li>Burns create scarcity</li>
                    </ul>
                  </div>
                  <div className="drm-split-plus">+</div>
                  <div className="drm-split-box drm-split-emissions">
                    <div className="drm-split-label">TAO Emissions</div>
                    <div className="drm-split-desc">Sustains participation</div>
                    <ul className="drm-split-list">
                      <li>Everyone doing work gets paid</li>
                      <li>Infrastructure stays decentralized</li>
                      <li>Long tail stays engaged</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 41/41/18 Split */}
          <div className="dr-emission-split">
            <div className="dres-header">
              <h4>Emission Split (41/41/18)</h4>
              <p>Why each cut matters</p>
            </div>

            <div className="dres-bars">
              <div className="dres-bar dres-bar--validators">
                <div className="dres-bar-fill" style={{width: '41%'}}></div>
                <div className="dres-bar-content">
                  <div className="dres-bar-pct">41%</div>
                  <div className="dres-bar-label">Validators</div>
                </div>
              </div>
              <div className="dres-bar-why">
                <span className="dres-check">✓</span>
                <span>Run nodes, fetch price feeds, compute scores, participate in consensus. <strong>Remove this = no infrastructure.</strong></span>
              </div>

              <div className="dres-bar dres-bar--miners">
                <div className="dres-bar-fill" style={{width: '41%'}}></div>
                <div className="dres-bar-content">
                  <div className="dres-bar-pct">41%</div>
                  <div className="dres-bar-label">Miners</div>
                </div>
              </div>
              <div className="dres-bar-why">
                <span className="dres-check">✓</span>
                <span>Rewarded on a curve—"pretty good" signals still worth submitting. <strong>Maintains signal diversity.</strong></span>
              </div>

              <div className="dres-bar dres-bar--owner">
                <div className="dres-bar-fill" style={{width: '18%'}}></div>
                <div className="dres-bar-content">
                  <div className="dres-bar-pct">18%</div>
                  <div className="dres-bar-label">Subnet Owner</div>
                </div>
              </div>
              <div className="dres-bar-why">
                <span className="dres-check">✓</span>
                <span>Sustainable development, infrastructure costs, team growth. <strong>Aligned incentives.</strong></span>
              </div>
            </div>

            <div className="dres-insight">
              <div className="dres-insight-icon">💡</div>
              <div className="dres-insight-text">
                <strong>Key Insight:</strong> You don't just want 5 whales competing—you want <em>hundreds of diverse signals</em> because that's what makes the meta-signal valuable. Emissions keep the long tail engaged even when they're not winning the pot.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ComplianceSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">REGULATORY POSTURE</div>
        <h2 className="section-title">Compliance by <span className="gold">Design</span></h2>
      </div>
      <div className="compliance-grid fade-in" style={{animationDelay: '0.1s'}}>
        <div className="compliance-main">
          <div className="cm-badge">🛡 Simulation-Only Architecture</div>
          <p>
            QUANTA operates purely as a <strong>paper-trading simulation</strong>. No actual stock trades
            are executed on-chain. Generators submit signals—not trades. The network tracks hypothetical
            performance using real market data.
          </p>
          <div className="cm-checks">
            <div className="cm-check"><span>✔</span> No custody of assets</div>
            <div className="cm-check"><span>✔</span> No trade execution</div>
            <div className="cm-check"><span>✔</span> No securities issuance</div>
            <div className="cm-check"><span>✔</span> Signals ≠ Investment advice</div>
          </div>
        </div>

        <div className="compliance-secondary">
          <div className="cs-card">
            <h4>🎯 Skill-Based Competition</h4>
            <p>Like fantasy sports or chess tournaments—outcomes determined by participant skill, not chance.</p>
          </div>
          <div className="cs-card">
            <h4>⚖️ Howey Test Analysis</h4>
            <p>Profits arise from participant's own analytical work, not from centralized management efforts.</p>
          </div>
          <div className="cs-card">
            <h4>📜 Favorable Precedent</h4>
            <p>SEC "Project Crypto" (Nov 2025): tokens can "mutate" from securities as networks decentralize.</p>
          </div>
        </div>
      </div>
      <div className="compliance-note fade-in" style={{animationDelay: '0.3s'}}>
        <strong>Future Fund Structure:</strong> Any managed fund or advisory would operate under formal LP/GP structure with proper registration—separate from the subnet game.
      </div>
    </div>
  );

  const RevenueSlide = () => {
    const revenueStreams = [
      {
        icon: '📡', title: 'Signals API', desc: 'Top portfolio compositions and real-time rankings',
        market: '$50K-$250K/year', color: '#3498db',
        howItWorks: 'Hedge funds and fintech apps subscribe to QUANTA\'s API for aggregated top-performer signals. Tiered access from daily snapshots to real-time + historical. Priced per seat or data volume.'
      },
      {
        icon: '🎓', title: 'Education', desc: 'Courses, webinars, mentorship, certifications',
        market: 'Recurring revenue', color: '#9b59b6',
        howItWorks: 'Online courses taught by top-ranked miners. Certification programs validating trading competency. Cohort-based mentorship. Revenue share with instructors.'
      },
      {
        icon: '📊', title: 'SaaS Analytics', desc: 'Portfolio dashboards, backtesting, alerts',
        market: '$29-299/mo tiers', color: '#2ecc71',
        howItWorks: 'Self-serve platform for miners to analyze strategies. Backtesting, custom alerts, factor attribution, peer comparison tools. Freemium model with α-token payment discounts.'
      },
      {
        icon: '🏆', title: 'Tournaments', desc: 'Special events with sponsorships and entry fees',
        market: 'Seasonal events', color: '#e67e22',
        howItWorks: 'Quarterly championships with themed challenges. Sponsors pay for branding/prizes. Entry fees fund prize pools. Winners gain prestige + recruiting visibility.'
      },
      {
        icon: '🔍', title: 'Talent Scouting', desc: 'Verified track records for fund recruitment',
        market: '$100K-175K/hire', color: '#e74c3c',
        howItWorks: 'Partner with quant funds seeking talent. Top miners have on-chain verified track records. Recruitment fee = 25% of first-year compensation. Opt-in discoverable status.'
      },
      {
        icon: '🔄', title: 'Strategy Licensing', desc: 'Package top strategies for institutions/ETFs',
        market: '5-20 bps on AUM', color: '#d4af37',
        howItWorks: 'License proven strategies to asset managers. "QUANTA Top 10" index or single-strategy mandates. Smart contract enforces royalty payments. ETF partnerships for retail distribution.'
      }
    ];

    return (
      <div className="slide-content">
        <div className="slide-header">
          <div className="overline">BONUS REVENUE STREAMS</div>
          <h2 className="section-title">Additional <span className="gold">Monetization</span></h2>
          <p className="slide-subtitle">Network is profitable without these—pure bonus ↓</p>
        </div>
        <div className="fade-in" style={{animationDelay: '0.1s'}}>
          <div className="revenue-grid">
            {revenueStreams.map((r, i) => (
              <div
                key={i}
                className="revenue-flip-card"
              >
                <div className="rfc-inner">
                  <div className="rfc-front" style={{borderColor: r.color}}>
                    <div className="rc-icon" style={{background: `${r.color}20`, color: r.color}}>{r.icon}</div>
                    <h4 className="rc-title">{r.title}</h4>
                    <p className="rc-desc">{r.desc}</p>
                    <div className="rc-market" style={{color: r.color}}>{r.market}</div>
                    <div className="rc-flip-hint">Hover to see details</div>
                  </div>
                  <div className="rfc-back" style={{borderColor: r.color, background: `${r.color}15`}}>
                    <div className="rcb-header" style={{color: r.color}}>
                      <span>{r.icon}</span> How It Works
                    </div>
                    <p className="rcb-text">{r.howItWorks}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="fade-in" style={{animationDelay: '0.3s'}}>
          <div className="market-context">
            <div className="mc-stat">
              <span className="mc-value">$9.28B</span>
              <span className="mc-label">Alternative Data Market (2024)</span>
            </div>
            <div className="mc-stat">
              <span className="mc-value">52.6%</span>
              <span className="mc-label">CAGR to 2034</span>
            </div>
            <div className="mc-stat">
              <span className="mc-value">$1.6M</span>
              <span className="mc-label">Avg. Institutional Spend/Year</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CompetitionsSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">ECOSYSTEM GROWTH</div>
        <h2 className="section-title">Competitions & <span className="gold">Community</span></h2>
        <p className="slide-subtitle">Building talent pipelines and brand awareness</p>
      </div>
      <div className="competitions-layout fade-in" style={{animationDelay: '0.1s'}}>
        <div className="comp-section">
          <h3>🏆 Biannual Championships</h3>
          <p className="comp-desc">Major tournaments at regional, national, and international levels creating recurring engagement cycles.</p>
          <div className="comp-levels">
            <div className="comp-level">
              <span className="comp-badge">🏫</span>
              <div className="comp-level-info">
                <h4>High School & College</h4>
                <p>University partnerships, student clubs, academic credit integration</p>
              </div>
            </div>
            <div className="comp-level">
              <span className="comp-badge">🌆</span>
              <div className="comp-level-info">
                <h4>Regional Leagues</h4>
                <p>City and state-level competitions with local sponsorships</p>
              </div>
            </div>
            <div className="comp-level">
              <span className="comp-badge">🌍</span>
              <div className="comp-level-info">
                <h4>National/International</h4>
                <p>Grand championship events with major sponsors and media coverage</p>
              </div>
            </div>
          </div>
        </div>
        <div className="comp-section">
          <h3>🎁 Rewards & Incentives</h3>
          <div className="comp-rewards">
            <div className="comp-reward">
              <span className="reward-icon">💵</span>
              <span>Cash prizes & TAO rewards</span>
            </div>
            <div className="comp-reward">
              <span className="reward-icon">🎤</span>
              <span>Coveted interviews at sponsored firms</span>
            </div>
            <div className="comp-reward">
              <span className="reward-icon">📜</span>
              <span>Certifications & verified credentials</span>
            </div>
            <div className="comp-reward">
              <span className="reward-icon">🏅</span>
              <span>Exclusive badges & leaderboard recognition</span>
            </div>
            <div className="comp-reward">
              <span className="reward-icon">🎓</span>
              <span>Scholarships & educational grants</span>
            </div>
          </div>
        </div>
        <div className="comp-section">
          <h3>🤝 Sponsorship Opportunities</h3>
          <p className="comp-desc">Premium brand placement for financial services, trading platforms, and fintech companies seeking access to engaged trading talent.</p>
          <div className="comp-sponsor-types">
            <span>Title Sponsors</span>
            <span>Prize Sponsors</span>
            <span>Platform Partners</span>
            <span>Media Partners</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ArchitectureSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">TECHNICAL ARCHITECTURE</div>
        <h2 className="section-title">System <span className="gold">Design</span></h2>
      </div>
      <div className="arch-grid fade-in" style={{animationDelay: '0.1s'}}>
        {[
          {
            header: 'Signal Pool', icon: '☁', color: '#3b82f6',
            items: ['Off-chain storage (IPFS/DB)', 'Unlimited capacity', 'Permissionless submission', 'Track record storage', 'Ante escrow contracts']
          },
          {
            header: 'Pool Operators', icon: '🏛', color: '#9b59b6',
            items: ['Aggregate generator signals', 'Hold on-chain UIDs', 'Submit best signals', 'Distribute rewards', 'Earn operator fees']
          },
          {
            header: 'Solo Miners', icon: '👑', color: '#d4af37',
            items: ['Direct UID holders', 'Top performer graduates', 'Submit own signals', 'Full reward capture', 'Premium status']
          },
          {
            header: 'Validators', icon: '🔒', color: '#22c55e',
            items: ['Fetch live market data', 'Tiingo / Polygon APIs', 'Mark portfolios to market', 'Compute risk metrics', 'Yuma consensus weights']
          },
          {
            header: 'Scoring Engine', icon: '⚙', color: '#e67e22',
            items: ['Rolling 7/30/90-day epochs', 'Multi-metric composite', 'Originality scoring', 'Drawdown monitoring', 'Power-law distribution']
          },
          {
            header: 'Security', icon: '🛡', color: '#ef4444',
            items: ['Commit-reveal protocol', 'Sybil resistance (stake)', 'Front-running prevention', 'Collusion detection', 'Plagiarism blacklist']
          }
        ].map((col, i) => (
          <div key={i} className="arch-col" style={{'--arch-color': col.color}}>
            <div className="arch-header">
              <span className="arch-icon">{col.icon}</span>
              <span>{col.header}</span>
            </div>
            <ul className="arch-list">
              {col.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );



  // ========== FINANCIAL MODEL STATE ==========
  const [budgetScenario, setBudgetScenario] = useState('balanced');
  const [showBreakdown, setShowBreakdown] = useState('summary'); // summary, development, operations

  // Detailed cost adjustments (all values in dollars)
  const [costAdjustments, setCostAdjustments] = useState({
    // Revenue offsets
    yumaGrant: 25000,
    apiRevenue: 6000,
    // Development multipliers (percentage of base)
    devMultiplier: 100,
    // Operations adjustments
    marketDataTier: 'polygon', // tiingo, polygon
    infraScale: 100,
    teamSize: 100, // affects contract dev costs
  });

  // Full budget data from Excel
  const fullBudgetData = useMemo(() => ({
    lean: {
      label: 'Lean',
      description: 'Solo founder, AI-assisted dev',
      alpha: {
        total: 20900,
        breakdown: {
          coreDev: 15000,
          marketData: 2000,
          testing: 1500,
          infrastructure: 500,
          security: 0,
          legal: 0,
          contingency: 1900
        }
      },
      beta: {
        total: 28600,
        breakdown: {
          devRefinement: 10000,
          securityAudit: 5000,
          polygonLicense: 6000,
          infrastructure: 2000,
          legal: 3000,
          contingency: 2600
        }
      },
      operations: {
        gross: 78000,
        breakdown: {
          marketData: 12000,
          infrastructure: 8000,
          contractDev: 30000,
          devOps: 6000,
          legal: 8000,
          security: 4000,
          marketing: 3000,
          insurance: 2000,
          misc: 5000
        },
        offsets: { grant: 0, api: 0 }
      },
      seed: 20900,
      monthlyBurn: 6500
    },
    balanced: {
      label: 'Balanced',
      description: 'Small team (1-2), standard tooling',
      alpha: {
        total: 44000,
        breakdown: {
          coreDev: 25000,
          marketData: 5000,
          testing: 4000,
          infrastructure: 1000,
          security: 3000,
          legal: 2000,
          contingency: 4000
        }
      },
      beta: {
        total: 55000,
        breakdown: {
          devRefinement: 18000,
          securityAudit: 12000,
          polygonLicense: 9000,
          infrastructure: 4000,
          legal: 7000,
          contingency: 5000
        }
      },
      operations: {
        gross: 134000,
        breakdown: {
          marketData: 15000,
          infrastructure: 15000,
          contractDev: 50000,
          devOps: 12000,
          legal: 12000,
          security: 8000,
          marketing: 8000,
          insurance: 4000,
          misc: 10000
        },
        offsets: { grant: 25000, api: 6000 }
      },
      seed: 44000,
      monthlyBurn: 8583
    },
    bestCase: {
      label: 'Best-Case',
      description: 'Full team, premium services',
      alpha: {
        total: 71500,
        breakdown: {
          coreDev: 35000,
          marketData: 8000,
          testing: 7000,
          infrastructure: 2000,
          security: 8000,
          legal: 5000,
          contingency: 6500
        }
      },
      beta: {
        total: 82500,
        breakdown: {
          devRefinement: 25000,
          securityAudit: 20000,
          polygonLicense: 12000,
          infrastructure: 6000,
          legal: 12000,
          contingency: 7500
        }
      },
      operations: {
        gross: 201000,
        breakdown: {
          marketData: 18000,
          infrastructure: 24000,
          contractDev: 72000,
          devOps: 18000,
          legal: 18000,
          security: 15000,
          marketing: 15000,
          insurance: 6000,
          misc: 15000
        },
        offsets: { grant: 50000, api: 18000 }
      },
      seed: 71500,
      monthlyBurn: 11083
    }
  }), []);

  const currentBudget = fullBudgetData[budgetScenario];

  // Calculate adjusted totals based on sliders
  const financialCalcs = useMemo(() => {
    const devScale = costAdjustments.devMultiplier / 100;
    const infraScale = costAdjustments.infraScale / 100;
    const teamScale = costAdjustments.teamSize / 100;

    // Market data cost based on tier
    const marketDataCost = costAdjustments.marketDataTier === 'tiingo'
      ? 360 // Tiingo Power annual
      : currentBudget.operations.breakdown.marketData;

    // Adjusted development costs
    const adjustedAlpha = Math.round(currentBudget.alpha.total * devScale);
    const adjustedBeta = Math.round(currentBudget.beta.total * devScale);

    // Adjusted operations
    const baseOps = currentBudget.operations.breakdown;
    const adjustedOps = {
      marketData: marketDataCost,
      infrastructure: Math.round(baseOps.infrastructure * infraScale),
      contractDev: Math.round(baseOps.contractDev * teamScale),
      devOps: Math.round(baseOps.devOps * infraScale),
      legal: baseOps.legal,
      security: baseOps.security,
      marketing: baseOps.marketing,
      insurance: baseOps.insurance,
      misc: baseOps.misc
    };

    const grossOps = Object.values(adjustedOps).reduce((a, b) => a + b, 0);
    const totalOffsets = costAdjustments.yumaGrant + costAdjustments.apiRevenue;
    const netOps = Math.max(0, grossOps - totalOffsets);

    const totalBudget = adjustedAlpha + adjustedBeta + netOps;
    const monthlyBurn = netOps / 12;
    const runway = adjustedAlpha / (monthlyBurn || 1);

    return {
      adjustedAlpha,
      adjustedBeta,
      adjustedOps,
      grossOps,
      netOps,
      totalOffsets,
      totalBudget,
      monthlyBurn,
      runway,
      savings: (currentBudget.alpha.total + currentBudget.beta.total + currentBudget.operations.gross) - totalBudget - totalOffsets
    };
  }, [currentBudget, costAdjustments]);

  // Generate burn curve data
  const burnCurveData = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const month = i + 1;
      let burn, cumulative;

      if (month <= 3) {
        burn = financialCalcs.adjustedAlpha / 3;
        cumulative = burn * month;
      } else if (month <= 6) {
        burn = financialCalcs.adjustedBeta / 3;
        cumulative = financialCalcs.adjustedAlpha + burn * (month - 3);
      } else {
        burn = financialCalcs.monthlyBurn;
        cumulative = financialCalcs.adjustedAlpha + financialCalcs.adjustedBeta + burn * (month - 6);
      }

      return { month, burn: Math.round(burn), cumulative: Math.round(cumulative) };
    });
  }, [financialCalcs]);

  // Cost breakdown labels
  const costLabels = {
    coreDev: 'Core Development',
    marketData: 'Market Data',
    testing: 'Testing & QA',
    infrastructure: 'Infrastructure',
    security: 'Security Review',
    legal: 'Legal Consultation',
    contingency: 'Contingency',
    devRefinement: 'Dev Refinement',
    securityAudit: 'Security Audit',
    polygonLicense: 'Polygon License',
    contractDev: 'Contract Dev',
    devOps: 'DevOps/Monitoring',
    marketing: 'Marketing',
    insurance: 'Insurance',
    misc: 'Misc/Buffer'
  };

  // Slider component for smooth updates
  const FinancialSlider = ({ label, value, onChange, min, max, step, format = (v) => v, color = '#d4af37' }) => (
    <div className="fin-slider-group">
      <div className="fin-slider-header">
        <span className="fin-slider-label">{label}</span>
        <span className="fin-slider-value" style={{ color }}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onMouseDown={() => { isDraggingSlider.current = true; }}
        onMouseUp={() => { isDraggingSlider.current = false; }}
        onTouchStart={() => { isDraggingSlider.current = true; }}
        onTouchEnd={() => { isDraggingSlider.current = false; }}
        style={{ '--slider-color': color }}
      />
    </div>
  );

  // Render financial model slide content directly (not as a separate component to avoid re-creation)
  const renderFinancialModelContent = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">YUMA.AI ACCELERATOR</div>
        <h2 className="section-title">Financial <span className="gold">Model</span></h2>
      </div>

      <div className="financial-model-container">
        {/* Top Controls Row */}
        <div className="fm-controls-row">
          {/* Scenario Selector */}
          <div className="fm-scenario-select">
            {Object.entries(fullBudgetData).map(([key, data]) => (
              <button
                key={key}
                className={`fm-scenario-btn ${budgetScenario === key ? 'active' : ''}`}
                onClick={() => setBudgetScenario(key)}
                onMouseDown={() => { isDraggingSlider.current = true; }}
                onMouseUp={() => { isDraggingSlider.current = false; }}
              >
                <span className="fm-scenario-label">{data.label}</span>
                <span className="fm-scenario-amount">${(data.alpha.total + data.beta.total + data.operations.gross - data.operations.offsets.grant - data.operations.offsets.api).toLocaleString()}</span>
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="fm-view-toggle">
            {[
              { key: 'summary', label: 'Summary' },
              { key: 'development', label: 'Development' },
              { key: 'operations', label: 'Operations' }
            ].map(v => (
              <button
                key={v.key}
                className={`fm-view-btn ${showBreakdown === v.key ? 'active' : ''}`}
                onClick={() => setShowBreakdown(v.key)}
                onMouseDown={() => { isDraggingSlider.current = true; }}
                onMouseUp={() => { isDraggingSlider.current = false; }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="fm-main-grid">
          {/* Left: Sliders & Controls */}
          <div className="fm-controls-panel">
            <div className="fm-panel-header">Adjust Model</div>

            <div className="fm-slider-section">
              <div className="fm-section-title">Revenue Offsets</div>
              <FinancialSlider
                label="Yuma Grant"
                value={costAdjustments.yumaGrant}
                onChange={(v) => setCostAdjustments(p => ({...p, yumaGrant: v}))}
                min={0}
                max={75000}
                step={5000}
                format={(v) => `$${v.toLocaleString()}`}
                color="#22c55e"
              />
              <FinancialSlider
                label="API Revenue (6mo)"
                value={costAdjustments.apiRevenue}
                onChange={(v) => setCostAdjustments(p => ({...p, apiRevenue: v}))}
                min={0}
                max={30000}
                step={1000}
                format={(v) => `$${v.toLocaleString()}`}
                color="#22c55e"
              />
            </div>

            <div className="fm-slider-section">
              <div className="fm-section-title">Cost Scaling</div>
              <FinancialSlider
                label="Development Scale"
                value={costAdjustments.devMultiplier}
                onChange={(v) => setCostAdjustments(p => ({...p, devMultiplier: v}))}
                min={50}
                max={150}
                step={5}
                format={(v) => `${v}%`}
                color="#3b82f6"
              />
              <FinancialSlider
                label="Infrastructure Scale"
                value={costAdjustments.infraScale}
                onChange={(v) => setCostAdjustments(p => ({...p, infraScale: v}))}
                min={50}
                max={150}
                step={5}
                format={(v) => `${v}%`}
                color="#9b59b6"
              />
              <FinancialSlider
                label="Team Size Scale"
                value={costAdjustments.teamSize}
                onChange={(v) => setCostAdjustments(p => ({...p, teamSize: v}))}
                min={50}
                max={150}
                step={5}
                format={(v) => `${v}%`}
                color="#e67e22"
              />
            </div>

            <div className="fm-slider-section">
              <div className="fm-section-title">Data Provider</div>
              <div className="fm-toggle-group">
                <button
                  className={`fm-toggle-btn ${costAdjustments.marketDataTier === 'tiingo' ? 'active' : ''}`}
                  onClick={() => setCostAdjustments(p => ({...p, marketDataTier: 'tiingo'}))}
                  onMouseDown={() => { isDraggingSlider.current = true; }}
                  onMouseUp={() => { isDraggingSlider.current = false; }}
                >
                  Tiingo ($360/yr)
                </button>
                <button
                  className={`fm-toggle-btn ${costAdjustments.marketDataTier === 'polygon' ? 'active' : ''}`}
                  onClick={() => setCostAdjustments(p => ({...p, marketDataTier: 'polygon'}))}
                  onMouseDown={() => { isDraggingSlider.current = true; }}
                  onMouseUp={() => { isDraggingSlider.current = false; }}
                >
                  Polygon ($6-18k/yr)
                </button>
              </div>
            </div>
          </div>

          {/* Right: Visualization */}
          <div className="fm-viz-panel">
            {showBreakdown === 'summary' && (
              <>
                {/* Budget Bars */}
                <div className="fm-budget-bars">
                  <div className="fm-bar-item">
                    <div className="fm-bar-label">Alpha (3mo)</div>
                    <div className="fm-bar-track">
                      <div className="fm-bar-fill alpha" style={{width: `${(financialCalcs.adjustedAlpha / financialCalcs.totalBudget) * 100}%`}}></div>
                    </div>
                    <div className="fm-bar-value">${financialCalcs.adjustedAlpha.toLocaleString()}</div>
                  </div>
                  <div className="fm-bar-item">
                    <div className="fm-bar-label">Beta (3mo)</div>
                    <div className="fm-bar-track">
                      <div className="fm-bar-fill beta" style={{width: `${(financialCalcs.adjustedBeta / financialCalcs.totalBudget) * 100}%`}}></div>
                    </div>
                    <div className="fm-bar-value">${financialCalcs.adjustedBeta.toLocaleString()}</div>
                  </div>
                  <div className="fm-bar-item">
                    <div className="fm-bar-label">Year 1 Ops</div>
                    <div className="fm-bar-track">
                      <div className="fm-bar-fill ops" style={{width: `${(financialCalcs.netOps / financialCalcs.totalBudget) * 100}%`}}></div>
                    </div>
                    <div className="fm-bar-value">${financialCalcs.netOps.toLocaleString()}</div>
                  </div>
                </div>

                {/* Burn Chart */}
                <div className="fm-chart-container">
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={burnCurveData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="fmBurnGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4af37" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="month" tick={{fill: '#666', fontSize: 9}} axisLine={{stroke: '#333'}} tickLine={false} />
                      <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{fill: '#666', fontSize: 9}} axisLine={{stroke: '#333'}} tickLine={false} width={45} />
                      <Tooltip
                        formatter={(v) => [`$${v.toLocaleString()}`, 'Cumulative']}
                        contentStyle={{background: 'rgba(20,20,30,0.95)', border: '1px solid #333', borderRadius: '6px', fontSize: '11px'}}
                        labelFormatter={(l) => `Month ${l}`}
                      />
                      <Area type="monotone" dataKey="cumulative" stroke="#d4af37" fill="url(#fmBurnGrad)" strokeWidth={2} />
                      <ReferenceLine y={financialCalcs.adjustedAlpha} stroke="#3b82f6" strokeDasharray="4 4" />
                      <ReferenceLine y={financialCalcs.adjustedAlpha + financialCalcs.adjustedBeta} stroke="#9b59b6" strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {showBreakdown === 'development' && (
              <div className="fm-breakdown-view">
                <div className="fm-breakdown-section">
                  <div className="fm-breakdown-title">Alpha Prototype (3 months)</div>
                  {Object.entries(currentBudget.alpha.breakdown).map(([key, val]) => (
                    <div key={key} className="fm-breakdown-row">
                      <span className="fm-breakdown-label">{costLabels[key] || key}</span>
                      <span className="fm-breakdown-val">${Math.round(val * costAdjustments.devMultiplier / 100).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="fm-breakdown-total">
                    <span>Subtotal</span>
                    <span>${financialCalcs.adjustedAlpha.toLocaleString()}</span>
                  </div>
                </div>
                <div className="fm-breakdown-section">
                  <div className="fm-breakdown-title">Beta / Mainnet (3 months)</div>
                  {Object.entries(currentBudget.beta.breakdown).map(([key, val]) => (
                    <div key={key} className="fm-breakdown-row">
                      <span className="fm-breakdown-label">{costLabels[key] || key}</span>
                      <span className="fm-breakdown-val">${Math.round(val * costAdjustments.devMultiplier / 100).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="fm-breakdown-total">
                    <span>Subtotal</span>
                    <span>${financialCalcs.adjustedBeta.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {showBreakdown === 'operations' && (
              <div className="fm-breakdown-view">
                <div className="fm-breakdown-section full-width">
                  <div className="fm-breakdown-title">Year 1 Operations (12 months)</div>
                  {Object.entries(financialCalcs.adjustedOps).map(([key, val]) => (
                    <div key={key} className="fm-breakdown-row">
                      <span className="fm-breakdown-label">{costLabels[key] || key}</span>
                      <span className="fm-breakdown-val">${val.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="fm-breakdown-row offset">
                    <span className="fm-breakdown-label">Yuma Grant</span>
                    <span className="fm-breakdown-val green">-${costAdjustments.yumaGrant.toLocaleString()}</span>
                  </div>
                  <div className="fm-breakdown-row offset">
                    <span className="fm-breakdown-label">API Revenue</span>
                    <span className="fm-breakdown-val green">-${costAdjustments.apiRevenue.toLocaleString()}</span>
                  </div>
                  <div className="fm-breakdown-total">
                    <span>Net Operating</span>
                    <span>${financialCalcs.netOps.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Metrics Row */}
        <div className="fm-metrics-row">
          <div className="fm-metric">
            <div className="fm-metric-val">${financialCalcs.totalBudget.toLocaleString()}</div>
            <div className="fm-metric-label">Total Budget</div>
          </div>
          <div className="fm-metric">
            <div className="fm-metric-val">${Math.round(financialCalcs.monthlyBurn).toLocaleString()}</div>
            <div className="fm-metric-label">Monthly Burn</div>
          </div>
          <div className="fm-metric">
            <div className="fm-metric-val">{financialCalcs.runway.toFixed(1)} mo</div>
            <div className="fm-metric-label">Seed Runway</div>
          </div>
          <div className="fm-metric highlight">
            <div className="fm-metric-val green">${financialCalcs.totalOffsets.toLocaleString()}</div>
            <div className="fm-metric-label">Total Offsets</div>
          </div>
          <div className="fm-metric">
            <div className="fm-metric-val">Month 18</div>
            <div className="fm-metric-label">Break-even</div>
          </div>
        </div>
      </div>
    </div>
  );

  const FinancialModelSlide = () => renderFinancialModelContent();

  const RoadmapSlide = () => (
    <div className="slide-content">
      <div className="slide-header">
        <div className="overline">IMPLEMENTATION</div>
        <h2 className="section-title">Development <span className="gold">Roadmap</span></h2>
      </div>
      <div className="roadmap-timeline fade-in" style={{animationDelay: '0.1s'}}>
        {[
          {
            phase: 'Phase 1', title: 'Core + Signal Pool', time: 'Months 1-6', status: 'active',
            items: ['Signal Pool infrastructure', 'Paper trading engine', 'Multi-source oracle integration', 'Scoring algorithm', 'Pool operator framework', 'Public testnet']
          },
          {
            phase: 'Phase 2', title: 'Mainnet Launch', time: 'Months 6-12', status: 'upcoming',
            items: ['Security audit', 'Mainnet deployment', 'Public leaderboard', 'Tier progression system', 'α-token distribution', 'Pool operator onboarding']
          },
          {
            phase: 'Phase 3', title: 'Monetization', time: 'Months 12-18', status: 'future',
            items: ['Signals API launch', 'SaaS analytics platform', 'Institutional partnerships', 'Education programs', 'Buyback mechanism']
          },
          {
            phase: 'Phase 4', title: 'Ecosystem', time: 'Months 18+', status: 'future',
            items: ['Multi-asset expansion', 'Strategy vaults', 'Index products', 'Talent marketplace', 'DAO governance']
          }
        ].map((p, i) => (
          <div key={i} className={`roadmap-phase ${p.status}`}>
            <div className="rp-header">
              <span className="rp-phase">{p.phase}</span>
              <span className="rp-time">{p.time}</span>
            </div>
            <div className="rp-title">{p.title}</div>
            <ul className="rp-items">
              {p.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const SummarySlide = () => (
    <div className="slide-content slide-center">
      <div className="fade-in">
        <div className="overline">THE VISION</div>
      </div>
      <div className="fade-in" style={{animationDelay: '0.1s'}}>
        <h2 className="vision-statement">
          QUANTA creates a <span className="gold">self-sustaining network</span> with
          <span className="gold"> unlimited participation</span> where portfolio signals are
          evaluated objectively, rewarded meritocratically, and monetized transparently.
        </h2>
      </div>
      <div className="fade-in" style={{animationDelay: '0.2s'}}>
        <div className="divider-line" />
      </div>
      <div className="fade-in" style={{animationDelay: '0.3s'}}>
        <div className="final-pillars">
          {[
            { icon: '∞', title: 'Unlimited Scale', desc: 'Signal Pool breaks UID limits' },
            { icon: '⚡', title: 'Self-Sustaining', desc: 'Profitable from day one' },
            { icon: '🔥', title: 'Deflationary', desc: 'Burns exceed emissions' },
            { icon: '💰', title: 'Multi-Path Rewards', desc: 'Direct + Pooled earnings' },
            { icon: '🌍', title: 'Global Access', desc: '24/7 permissionless' }
          ].map((p, i) => (
            <div key={i} className="fp-item">
              <div className="fp-icon">{p.icon}</div>
              <div className="fp-title">{p.title}</div>
              <div className="fp-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="fade-in" style={{animationDelay: '0.4s'}}>
        <div className="cta-section">
          <a href="/litepaper" className="cta-primary">Interactive Litepaper</a>
          <a href="/docs/QUANTA_Technical_Specification_v4.pdf" className="cta-secondary" target="_blank">Technical Spec (v4)</a>
        </div>
        <div className="cta-links">
          <a href="/contact" className="cta-text-link">Contact Us</a>
          <a href="/faq" className="cta-text-link">FAQ</a>
        </div>
      </div>
      <div className="fade-in" style={{animationDelay: '0.5s'}}>
        <div className="final-tagline">
          <em>A sustainable network where every participant who generates real alpha wins.</em>
        </div>
      </div>
    </div>
  );

  const slideComponents = {
    intro: IntroSlide,
    problem: ProblemSlide,
    solution: SolutionSlide,
    precedent: PrecedentSlide,
    scalability: ScalabilitySlide,
    signalPool: SignalPoolSlide,
    participationTiers: ParticipationTiersSlide,
    minerTaxonomy: MinerTaxonomySlide,
    rewardFlow: RewardFlowSlide,
    howItWorks: HowItWorksSlide,
    networkDiagram: NetworkDiagramSlide,
    epochLifecycle: EpochLifecycleSlide,
    scoring: ScoringSlide,
    tokenomics: TokenomicsSlide,
    rewardMechanics: RewardMechanicsSlide,
    interactiveModel: InteractiveModelSlide,
    deflationary: DeflationarySlide,
    dualRevenue: DualRevenueSlide,
    compliance: ComplianceSlide,
    revenue: RevenueSlide,
    competitions: CompetitionsSlide,
    architecture: ArchitectureSlide,
    financialModel: FinancialModelSlide,
    roadmap: RoadmapSlide,
    summary: SummarySlide
  };

  const SlideComponent = slideComponents[slides[currentSlide]] || IntroSlide;

  return (
    <div className="pitch-deck" style={{ opacity: isHydrated ? 1 : 0, transition: 'opacity 0.15s ease-in' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@200;300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .pitch-deck {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d0d14 0%, #151520 50%, #0d0d14 100%);
          color: #f0f0f5;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        .pitch-deck::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(52, 152, 219, 0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Animations disabled - caused double-render flash on hydration */
        .fade-in {
          opacity: 1;
        }

        /* Header */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          z-index: 100;
          background: linear-gradient(180deg, rgba(13,13,20,0.98) 0%, transparent 100%);
        }

        .logo { display: flex; align-items: center; gap: 0.6rem; }

        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #0d0d14;
          font-size: 1.1rem;
          font-family: 'Space Grotesk', sans-serif;
        }

        .logo-text {
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          font-family: 'Space Grotesk', sans-serif;
        }

        .slide-counter {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          font-family: 'JetBrains Mono', monospace;
        }

        /* Main Content - Scrollable Container */
        .main-content {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .main-content-inner {
          min-height: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 1rem 2rem 100px;
        }

        /* Slide transition - no container animation, let individual fade-ins handle it */
        .slide-transition {
          opacity: 1;
        }

        .slide-wrapper {
          width: 100%;
          max-width: 1400px;
        }

        .slide-content {
          min-height: calc(100vh - 180px);
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
        }

        .slide-center {
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .slide-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 3rem;
        }

        .slide-header { margin-bottom: 1.25rem; }
        .slide-subtitle { font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-top: 0.25rem; }

        /* Typography */
        .overline {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: #d4af37;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.15em;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0.5rem 0;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          font-weight: 300;
          color: rgba(255,255,255,0.9);
          max-width: 700px;
          margin: 0 auto;
        }

        .hero-tagline {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.5);
          margin-top: 0.5rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 600;
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1.2;
        }

        .gold { color: #d4af37; }
        .green { color: #22c55e; }
        .red { color: #ef4444; }
        .orange { color: #f97316; }
        .dim { color: rgba(255,255,255,0.4); }

        .divider-line {
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          margin: 1rem auto;
        }

        /* Stats */
        .stats-row {
          display: flex;
          gap: 3rem;
          justify-content: center;
          margin: 1.5rem 0;
        }

        .stat-item { text-align: center; }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          color: #d4af37;
        }

        .stat-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          margin-top: 0.25rem;
        }

        .bittensor-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1.25rem;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 100px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          margin-top: 1rem;
        }

        .separator { color: rgba(255,255,255,0.2); }

        /* Problem Cards */
        .problem-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          margin-bottom: 0.75rem;
        }

        .pc-icon { font-size: 1.5rem; flex-shrink: 0; }
        .pc-content h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem; }
        .pc-content p { font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.4; }

        .problem-summary { margin-bottom: 1rem; }
        .summary-lead { font-size: 1rem; line-height: 1.5; color: rgba(255,255,255,0.8); margin-bottom: 1rem; }
        .summary-points { display: flex; flex-direction: column; gap: 0.4rem; }
        .sp-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.7); }
        .sp-bullet { color: #d4af37; }

        .key-stat-box {
          background: linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.05) 100%);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          padding: 1rem 1.25rem;
        }

        .ksb-value { font-size: 2rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #d4af37; }
        .ksb-label { font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.4; }

        /* Solution Grid */
        .solution-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 0.5rem; }

        .solution-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1.25rem;
          transition: all 0.2s ease;
        }

        .solution-card:hover { border-color: rgba(212,175,55,0.3); background: rgba(212,175,55,0.03); }
        .sc-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
        .sc-title { font-size: 1rem; font-weight: 600; margin-bottom: 0.4rem; }
        .sc-desc { font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.4; }

        /* Precedent */
        .precedent-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .pm-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
        .pm-stat { text-align: center; padding: 1rem; background: rgba(212,175,55,0.05); border-radius: 10px; }
        .pms-value { font-size: 1.75rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #d4af37; }
        .pms-label { font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-top: 0.25rem; }
        .pm-description { font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.5; }
        .pm-description p { margin-bottom: 0.75rem; }
        .precedent-highlights { display: flex; flex-direction: column; gap: 0.75rem; }
        .ph-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; }
        .ph-icon { color: #22c55e; font-size: 1rem; font-weight: bold; }
        .ph-content { display: flex; flex-direction: column; gap: 0.2rem; }
        .ph-content strong { font-size: 0.9rem; color: #f0f0f5; }
        .ph-content span { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
        .chart-title { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem; color: rgba(255,255,255,0.8); text-align: center; }

        /* Scalability */
        .scalability-layout { display: flex; align-items: center; justify-content: center; gap: 2rem; margin: 1rem 0; }
        .scale-problem, .scale-solution { flex: 1; padding: 1.5rem; border-radius: 12px; text-align: center; }
        .scale-problem { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); }
        .scale-solution { background: rgba(34,197,94,0.05); border: 1px solid rgba(34,197,94,0.2); }
        .sp-icon-large, .ss-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .scale-problem h3, .scale-solution h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; }
        .scale-problem p, .scale-solution p { font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 1rem; }
        .sp-limit, .ss-unlimited { padding: 0.75rem; border-radius: 8px; }
        .sp-limit { background: rgba(239,68,68,0.1); }
        .ss-unlimited { background: rgba(34,197,94,0.1); }
        .sp-num, .ss-num { font-size: 2rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; display: block; }
        .sp-num { color: #ef4444; }
        .ss-num { color: #22c55e; }
        .sp-label, .ss-label { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
        .scale-arrow { font-size: 2rem; color: #d4af37; }
        .scale-comparison { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; }
        .sc-row { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 1rem; padding: 0.5rem 0; font-size: 0.85rem; }
        .sc-row.header { font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem; margin-bottom: 0.5rem; }

        /* Signal Pool */
        .pool-architecture { display: flex; flex-direction: column; gap: 0.5rem; }
        .pa-layer { padding: 1rem; border-radius: 12px; }
        .pa-layer.offchain { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05)); border: 1px solid rgba(59,130,246,0.2); }
        .pa-layer.onchain { background: linear-gradient(135deg, rgba(155,89,182,0.1), rgba(155,89,182,0.05)); border: 1px solid rgba(155,89,182,0.2); }
        .pa-layer.output { background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05)); border: 1px solid rgba(212,175,55,0.2); padding: 0.75rem; }
        .pal-header { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; margin-bottom: 0.75rem; }
        .pal-icon { font-size: 1.25rem; }
        .pal-desc { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-align: center; margin-top: 0.5rem; }
        .participants-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
        .participant-node { width: 40px; height: 40px; border-radius: 50%; background: rgba(59,130,246,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 600; }
        .participant-more { padding: 0.5rem 1rem; background: rgba(59,130,246,0.1); border-radius: 20px; font-size: 0.75rem; }
        .uid-grid { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }
        .uid-section { text-align: center; }
        .uids-label { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; }
        .uids-row { display: flex; gap: 0.3rem; align-items: center; justify-content: center; }
        .uid-node { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; font-weight: 600; }
        .uid-node.solo { background: rgba(212,175,55,0.2); }
        .uid-node.pool { background: rgba(155,89,182,0.2); }
        .uid-node.validator { background: rgba(34,197,94,0.2); }
        .uid-more { color: rgba(255,255,255,0.4); font-size: 0.8rem; }
        .uid-desc { font-size: 0.65rem; color: rgba(255,255,255,0.4); margin-top: 0.25rem; }
        .pa-arrow { text-align: center; font-size: 0.8rem; color: #d4af37; padding: 0.25rem 0; }
        .reward-flow-grid { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
        .rf-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; }
        .rf-item div { display: flex; flex-direction: column; }
        .rf-item strong { font-weight: 600; }
        .rf-item span { font-size: 0.7rem; color: rgba(255,255,255,0.5); }
        .rf-icon { font-size: 1.25rem; }

        /* Participation Tiers */
        .tiers-layout { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; }
        .tier-ladder { display: flex; flex-direction: column; gap: 0.6rem; }
        .tier-card { padding: 0.9rem; border-radius: 12px; background: rgba(255,255,255,0.02); border-left: 4px solid var(--tier-color); position: relative; }
        .tc-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
        .tc-icon { font-size: 1.1rem; }
        .tc-tier { font-size: 0.65rem; color: rgba(255,255,255,0.5); }
        .tc-name { font-weight: 600; font-size: 0.9rem; color: var(--tier-color); flex: 1; }
        .tc-count { font-size: 0.7rem; color: rgba(255,255,255,0.4); }
        .tc-body { font-size: 0.75rem; color: rgba(255,255,255,0.7); }
        .tc-label { color: rgba(255,255,255,0.5); margin-right: 0.3rem; }
        .tc-req, .tc-benefit { margin-bottom: 0.2rem; }
        .tc-arrow { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.2); font-size: 0.7rem; }
        .tier-dynamics h4 { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; }
        .td-items { display: flex; flex-direction: column; gap: 0.6rem; }
        .td-item { display: flex; gap: 0.6rem; font-size: 0.8rem; color: rgba(255,255,255,0.7); }
        .td-icon { font-size: 1.1rem; }

        /* Miner Taxonomy */
        .taxonomy-layout {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 1.25rem;
          align-items: stretch;
        }

        .tax-navigator {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tax-categories {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tax-cat-btn {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.7rem 0.85rem;
          border-radius: 0.65rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .tax-cat-btn:hover {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
        }

        .tax-cat-btn--active {
          border-color: var(--cat-color);
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%);
          box-shadow: 0 0 20px rgba(212,175,55,0.1);
        }

        .tax-cat-icon { font-size: 1.4rem; }

        .tax-cat-info {
          display: flex;
          flex-direction: column;
        }

        .tax-cat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f0f0f5;
        }

        .tax-cat-btn--active .tax-cat-label {
          color: var(--cat-color);
        }

        .tax-cat-desc {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.5);
        }

        .tax-interfaces {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.65rem;
          padding: 0.75rem;
        }

        .tax-interfaces-header {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.6rem;
        }

        .tax-interface-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.4rem;
        }

        .tax-interface {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.4rem;
          border-radius: 0.4rem;
          background: rgba(255,255,255,0.03);
          text-align: center;
        }

        .tax-if-icon { font-size: 1rem; margin-bottom: 0.15rem; }
        .tax-if-name { font-size: 0.65rem; font-weight: 500; color: #f0f0f5; }
        .tax-if-time { font-size: 0.55rem; color: rgba(34,197,94,0.9); }

        .tax-details {
          border-radius: 0.75rem;
          background: linear-gradient(145deg, rgba(15,23,42,0.95), rgba(17,24,39,0.95));
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }

        .tax-details-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .tax-dh-icon { font-size: 1.5rem; }
        .tax-dh-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--active-color);
        }

        .tax-types {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .tax-type {
          border-radius: 0.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .tax-type:hover {
          border-color: rgba(255,255,255,0.15);
        }

        .tax-type--expanded {
          border-color: var(--active-color);
          box-shadow: 0 0 12px rgba(212,175,55,0.1);
        }

        .tax-type-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.75rem;
        }

        .tax-type-icon { font-size: 1rem; }
        .tax-type-name { font-size: 0.85rem; font-weight: 500; flex: 1; }
        .tax-type-toggle {
          font-size: 1rem;
          color: rgba(255,255,255,0.4);
          font-weight: 300;
        }

        .tax-type-details {
          padding: 0 0.75rem 0.75rem 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .tax-type-examples {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin: 0.6rem 0;
        }

        .tax-example {
          font-size: 0.65rem;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
        }

        .tax-type-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.6);
        }

        .tax-type-meta strong {
          color: rgba(255,255,255,0.4);
        }

        .tax-comparison {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 0.5rem;
        }

        .tax-comp-header {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.5rem;
        }

        .tax-comp-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .tax-comp-item {
          padding: 0.5rem;
          border-radius: 0.4rem;
          background: rgba(255,255,255,0.03);
        }

        .tax-comp-item--quanta {
          border-left: 3px solid #22c55e;
        }

        .tax-comp-item--numerai {
          border-left: 3px solid #ef4444;
        }

        .tax-comp-label {
          font-size: 0.65rem;
          font-weight: 600;
          display: block;
          margin-bottom: 0.15rem;
        }

        .tax-comp-item--quanta .tax-comp-label { color: #22c55e; }
        .tax-comp-item--numerai .tax-comp-label { color: #ef4444; }

        .tax-comp-value {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.7);
        }

        .tax-comp-insight {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.8);
        }

        .tax-comp-insight strong {
          color: #d4af37;
        }

        @media (max-width: 900px) {
          .taxonomy-layout {
            grid-template-columns: 1fr;
          }
          .tax-interface-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Reward Distribution */
        .reward-distribution-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .rd-chart { position: relative; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; }
        .rd-total { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; }
        .rdt-value { font-size: 2rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #d4af37; display: block; }
        .rdt-label { font-size: 0.7rem; color: rgba(255,255,255,0.5); }
        .rd-breakdown h4 { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; }
        .rdb-items { display: flex; flex-direction: column; gap: 0.5rem; }
        .rdb-item { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem; border-radius: 8px; border-left: 4px solid var(--item-color); background: rgba(255,255,255,0.02); flex-wrap: wrap; gap: 0.25rem; }
        .rdb-tier { display: flex; align-items: center; gap: 0.5rem; }
        .rdb-name { font-weight: 600; font-size: 0.85rem; }
        .rdb-pct { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
        .rdb-reward { font-size: 0.8rem; color: var(--item-color); font-weight: 500; }
        .rdb-note-text { font-size: 0.7rem; color: rgba(255,255,255,0.4); width: 100%; }
        .rdb-note { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.75rem; font-size: 0.8rem; color: rgba(255,255,255,0.6); padding: 0.6rem; background: rgba(212,175,55,0.05); border-radius: 8px; }
        .rdb-icon { font-size: 1rem; }

        /* Flow Diagram */
        .flow-diagram { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; margin: 1rem 0; }
        .flow-step { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; position: relative; }
        .fs-number { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #f4d03f); color: #0d0d14; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem; font-family: 'Space Grotesk', sans-serif; }
        .fs-content h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; }
        .fs-content p { font-size: 0.75rem; color: rgba(255,255,255,0.6); line-height: 1.4; }
        .fs-arrow { position: absolute; right: -1rem; top: 50%; transform: translateY(-50%); font-size: 1.25rem; color: #d4af37; z-index: 1; }
        .flow-summary { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; background: rgba(212,175,55,0.05); border: 1px solid rgba(212,175,55,0.15); border-radius: 10px; }
        .fs-badge { background: rgba(212,175,55,0.15); padding: 0.4rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #d4af37; white-space: nowrap; }
        .flow-summary p { font-size: 0.85rem; color: rgba(255,255,255,0.7); }

        /* Network Visualization */
        .network-viz { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .nv-layer { width: 100%; max-width: 800px; padding: 1rem; border-radius: 12px; text-align: center; }
        .generators-layer { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05)); border: 1px solid rgba(59,130,246,0.2); }
        .operators-layer { background: linear-gradient(135deg, rgba(155,89,182,0.1), rgba(155,89,182,0.05)); border: 1px solid rgba(155,89,182,0.2); }
        .validators-layer { background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05)); border: 1px solid rgba(34,197,94,0.2); }
        .chain-layer { background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05)); border: 1px solid rgba(212,175,55,0.2); }
        .nv-label { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
        .nv-nodes { display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .nv-node { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
        .nv-node.generator { background: rgba(59,130,246,0.2); }
        .nv-node.operator { background: rgba(155,89,182,0.2); }
        .nv-node.solo { background: rgba(212,175,55,0.2); }
        .nv-node.validator { background: rgba(34,197,94,0.2); }
        .nv-ellipsis { color: rgba(255,255,255,0.4); font-size: 0.9rem; align-self: center; }
        .nv-desc { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
        .nv-flow { font-size: 0.8rem; color: #d4af37; padding: 0.25rem 0; }
        .nv-chain-box { padding: 1rem; }
        .nv-chain-title { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
        .nv-chain-items { display: flex; justify-content: center; gap: 1.5rem; font-size: 0.75rem; color: rgba(255,255,255,0.6); }

        /* Epoch Timeline */
        .epoch-timeline { margin: 1.5rem 0; }
        .et-track { display: flex; border-radius: 12px; overflow: hidden; }
        .et-segment { flex: 1; padding: 1.25rem 1rem; text-align: center; position: relative; }
        .et-segment.commit { background: linear-gradient(135deg, rgba(52,152,219,0.15), rgba(52,152,219,0.1)); border-right: 1px solid rgba(255,255,255,0.1); }
        .et-segment.reveal { background: linear-gradient(135deg, rgba(155,89,182,0.15), rgba(155,89,182,0.1)); border-right: 1px solid rgba(255,255,255,0.1); }
        .et-segment.eval { background: linear-gradient(135deg, rgba(46,204,113,0.15), rgba(46,204,113,0.1)); border-right: 1px solid rgba(255,255,255,0.1); }
        .et-segment.distribute { background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.1)); }
        .ets-label { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; }
        .ets-time { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; }
        .ets-desc { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
        .epoch-windows h4 { font-size: 0.9rem; margin-bottom: 0.75rem; color: rgba(255,255,255,0.8); }
        .ew-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .ew-item { display: flex; flex-direction: column; align-items: center; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; }
        .ew-period { font-size: 1.25rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #d4af37; }
        .ew-weight { font-size: 0.85rem; color: rgba(255,255,255,0.8); margin: 0.25rem 0; }
        .ew-focus { font-size: 0.7rem; color: rgba(255,255,255,0.5); }

        /* Scoring */
        .scoring-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .scoring-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        .sm-item { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; }
        .sm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
        .sm-name { font-weight: 600; font-size: 0.9rem; }
        .sm-weight { font-size: 0.8rem; color: #d4af37; font-weight: 600; }
        .sm-desc { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; }
        .sm-formula { font-size: 0.7rem; color: rgba(212,175,55,0.8); font-family: 'JetBrains Mono', monospace; }
        .scoring-composite { padding: 1.25rem; background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05)); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; }
        .scoring-composite h4 { font-size: 1rem; margin-bottom: 0.75rem; }
        .sc-formula { margin-bottom: 1rem; }
        .sc-formula code { font-size: 0.85rem; color: #d4af37; font-family: 'JetBrains Mono', monospace; }
        .sc-notes { font-size: 0.75rem; color: rgba(255,255,255,0.6); line-height: 1.6; }
        .sc-notes p { margin-bottom: 0.25rem; }

        /* Tokenomics Layout */
        .tokenomics-layout { display: flex; flex-direction: column; gap: 1.5rem; }
        .tl-principle { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; margin-bottom: 1rem; background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03)); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; }
        .tlp-icon { font-size: 3rem; }
        .tlp-content h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; font-family: 'Space Grotesk', sans-serif; }
        .tlp-content p { font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.5; }
        .tl-flow { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 1.5rem; }
        .tlf-step { flex: 1; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; text-align: center; }
        .tlf-step.highlight { background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05)); border-color: rgba(34,197,94,0.3); }
        .tlfs-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(212,175,55,0.2); color: #d4af37; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.5rem; font-size: 0.85rem; }
        .tlfs-content h4 { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; }
        .tlfs-content p { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
        .tlfs-tag { display: inline-block; margin-top: 0.5rem; padding: 0.2rem 0.5rem; background: rgba(34,197,94,0.2); border-radius: 4px; font-size: 0.65rem; font-weight: 600; color: #22c55e; }
        .tlf-arrow { color: rgba(255,255,255,0.3); font-size: 1.25rem; }
        .tl-key-insight { padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; text-align: center; }
        .tlki-formula { display: flex; align-items: center; justify-content: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .tlki-left { font-weight: 600; font-size: 1.1rem; }
        .tlki-eq { color: rgba(255,255,255,0.4); }
        .tlki-right { display: flex; align-items: center; gap: 0.5rem; }
        .tlki-core { padding: 0.4rem 0.75rem; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); border-radius: 6px; font-size: 0.85rem; color: #22c55e; }
        .tlki-plus { color: rgba(255,255,255,0.4); }
        .tlki-bonus { padding: 0.4rem 0.75rem; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); border-radius: 6px; font-size: 0.85rem; color: #d4af37; }
        .tlki-note { font-size: 0.85rem; color: rgba(255,255,255,0.6); }

        /* Distribution Chart */
        .distribution-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
        .dist-chart { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; }
        .dist-explanation h4 { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; }
        .de-items { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
        .de-item { display: flex; gap: 0.6rem; font-size: 0.85rem; color: rgba(255,255,255,0.8); }
        .de-icon { font-size: 1.1rem; }
        .de-formula { padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 8px; }
        .de-formula code { font-size: 0.8rem; color: #d4af37; font-family: 'JetBrains Mono', monospace; }

        /* Interactive Model */
        .model-layout { display: grid; grid-template-columns: 1fr 1.3fr; gap: 1.5rem; flex: 1; }
        .model-inputs { display: flex; flex-direction: column; gap: 1rem; }
        .model-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1rem; }
        .model-section h4 { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem; color: rgba(255,255,255,0.9); }
        .model-section.bonus-section { border-color: rgba(212,175,55,0.15); background: rgba(212,175,55,0.02); }
        .section-note { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-top: -0.5rem; margin-bottom: 0.75rem; }
        .input-grid { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-row { display: grid; grid-template-columns: 1fr 1.5fr auto; align-items: center; gap: 0.75rem; }
        .input-row label { font-size: 0.75rem; color: rgba(255,255,255,0.7); }
        .input-row input[type="range"] { width: 100%; height: 6px; -webkit-appearance: none; appearance: none; background: rgba(255,255,255,0.15); border-radius: 3px; outline: none; cursor: pointer; touch-action: none; }
        .input-row input[type="range"]::-webkit-slider-runnable-track { height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; }
        .input-row input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #d4af37; cursor: grab; box-shadow: 0 2px 6px rgba(0,0,0,0.3); margin-top: -6px; }
        .input-row input[type="range"]::-webkit-slider-thumb:active { cursor: grabbing; }
        .input-row input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #d4af37; cursor: grab; border: none; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
        .input-row input[type="range"]::-moz-range-track { height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; }
        .input-val { font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; color: rgba(255,255,255,0.8); min-width: 50px; text-align: right; }
        .input-val.gold { color: #d4af37; font-weight: 600; }
        .input-val.bonus { color: rgba(212,175,55,0.7); }
        .input-val.clickable { cursor: pointer; padding: 0.2rem 0.4rem; border-radius: 4px; transition: background 0.2s ease; }
        .input-val.clickable:hover { background: rgba(212,175,55,0.15); }
        .input-val-edit { width: 60px; padding: 0.2rem 0.4rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(212,175,55,0.5); border-radius: 4px; color: #f0f0f5; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; text-align: right; outline: none; }
        .input-val-edit:focus { border-color: #d4af37; background: rgba(212,175,55,0.1); }
        .input-val-edit.gold { color: #d4af37; }
        .input-val-edit.bonus { color: rgba(212,175,55,0.7); }
        .input-row.highlight-rake { background: rgba(34,197,94,0.05); padding: 0.5rem; margin: -0.25rem; border-radius: 6px; border: 1px solid rgba(34,197,94,0.2); }
        .input-row.bonus-row { opacity: 0.7; }
        .tier-inputs .input-row { border-left: 3px solid var(--tier-color, #fff); padding-left: 0.5rem; }
        .tier-warning { margin-top: 0.5rem; padding: 0.4rem 0.75rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; font-size: 0.75rem; color: #ef4444; }
        
        .model-outputs { display: flex; flex-direction: column; gap: 0.75rem; }
        .profit-guarantee { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05)); border: 1px solid rgba(34,197,94,0.4); border-radius: 10px; }
        .pg-icon { font-size: 2rem; }
        .pg-content h4 { font-size: 1rem; font-weight: 600; color: #22c55e; margin-bottom: 0.25rem; }
        .pg-content p { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
        .output-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.75rem; }
        .output-section h5 { font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; color: rgba(255,255,255,0.9); }
        .output-row { display: flex; justify-content: space-between; font-size: 0.75rem; padding: 0.3rem 0; color: rgba(255,255,255,0.7); }
        .output-row.highlight-rake { background: rgba(34,197,94,0.1); padding: 0.4rem 0.5rem; margin: 0.25rem -0.5rem; border-radius: 4px; }
        .output-row .red { color: #ef4444; }
        .output-row .green { color: #22c55e; }
        .output-row .orange { color: #f97316; }
        .output-row .gold { color: #d4af37; }
        
        /* Tier Visualization */
        .tier-viz { margin: 0.5rem 0; }
        .tv-bar { display: flex; height: 24px; border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
        .tv-seg { display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; color: #fff; }
        .tv-seg.top { background: linear-gradient(135deg, #22c55e, #16a34a); }
        .tv-seg.profitable { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .tv-seg.breakeven { background: linear-gradient(135deg, #9ca3af, #6b7280); }
        .tv-seg.loser { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .tv-legend { display: flex; justify-content: space-between; font-size: 0.65rem; color: rgba(255,255,255,0.6); }
        
        /* Profit Breakdown */
        .profit-breakdown { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; padding: 0.5rem 0; }
        .pb-item { display: flex; flex-direction: column; align-items: center; padding: 0.5rem 0.75rem; border-radius: 6px; min-width: 80px; }
        .pb-item.core { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); }
        .pb-item.bonus { background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); }
        .pb-item.burn { background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.2); }
        .pb-item.total { background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(212,175,55,0.15)); border: 1px solid rgba(212,175,55,0.3); }
        .pb-label { font-size: 0.65rem; color: rgba(255,255,255,0.6); margin-bottom: 0.25rem; }
        .pb-value { font-size: 0.85rem; font-weight: 600; font-family: 'JetBrains Mono', monospace; }
        .pb-item.core .pb-value { color: #22c55e; }
        .pb-item.bonus .pb-value { color: #d4af37; }
        .pb-item.burn .pb-value { color: #f97316; }
        .pb-item.total .pb-value { color: #22c55e; }
        .pb-tag { font-size: 0.55rem; padding: 0.15rem 0.35rem; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 0.25rem; }
        .pb-plus, .pb-equals { font-size: 1rem; color: rgba(255,255,255,0.3); font-weight: 600; }
        
        /* ROI Grid */
        .roi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
        .roi-item { padding: 0.6rem; border-radius: 8px; text-align: center; display: flex; flex-direction: column; gap: 0.25rem; }
        .roi-item.top { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); }
        .roi-item.profitable { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); }
        .roi-item.breakeven { background: rgba(156,163,175,0.1); border: 1px solid rgba(156,163,175,0.2); }
        .roi-item.loser { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); }
        .roi-tier { font-size: 0.65rem; color: rgba(255,255,255,0.5); }
        .roi-payout { font-size: 0.9rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: rgba(255,255,255,0.9); }
        .roi-pct { font-size: 0.7rem; font-weight: 600; }
        .roi-item.top .roi-pct { color: #22c55e; }
        .roi-item.profitable .roi-pct { color: #3b82f6; }
        .roi-item.breakeven .roi-pct { color: #9ca3af; }
        .roi-item.loser .roi-pct { color: #ef4444; }
        
        /* Legacy ROI comparison (keeping for backward compatibility) */
        .roi-comparison { display: flex; gap: 0.75rem; }
        .roi-item.solo { background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); }
        .roi-item.pooled { background: rgba(155,89,182,0.1); border: 1px solid rgba(155,89,182,0.2); }
        .roi-label { font-size: 0.7rem; color: rgba(255,255,255,0.5); display: block; margin-bottom: 0.25rem; }
        .roi-value { font-size: 1.1rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; }
        .roi-item.solo .roi-value { color: #d4af37; }
        .roi-item.pooled .roi-value { color: #9b59b6; }
        .output-section.total { background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(212,175,55,0.1)); border: 1px solid rgba(212,175,55,0.3); }
        .total-value { font-size: 1.75rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #22c55e; text-align: center; padding: 0.5rem; }

        /* Deflationary */
        .deflationary-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
        .defl-chart { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; }
        .defl-mechanics h4 { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; }
        .dm-items { display: flex; flex-direction: column; gap: 0.75rem; }
        .dm-item { display: flex; align-items: center; gap: 0.75rem; }
        .dm-icon { font-size: 1.5rem; }
        .dm-pct { font-size: 1rem; font-weight: 700; color: #f97316; min-width: 50px; }
        .dm-content { display: flex; flex-direction: column; }
        .dm-label { font-weight: 600; font-size: 0.9rem; }
        .dm-desc { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
        .dm-result { margin-top: 1rem; padding: 0.75rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; text-align: center; }
        .dm-result code { font-size: 0.85rem; color: #22c55e; font-family: 'JetBrains Mono', monospace; }

        /* Dual Revenue - Pot vs Emissions */
        .dual-revenue-layout {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 1.5rem;
          align-items: stretch;
        }

        .dr-comparison {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .dr-model {
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid rgba(148,163,184,0.3);
        }

        .dr-model--problem {
          background: linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(15,23,42,0.95) 100%);
          border-color: rgba(239,68,68,0.3);
        }

        .dr-model--solution {
          background: linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(15,23,42,0.95) 100%);
          border-color: rgba(34,197,94,0.3);
        }

        .drm-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.75rem;
          background: rgba(0,0,0,0.2);
          border-bottom: 1px solid rgba(148,163,184,0.15);
        }

        .drm-icon { font-size: 1rem; }
        .drm-title { font-size: 0.8rem; font-weight: 600; flex: 1; }

        .drm-badge {
          font-size: 0.6rem;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          font-weight: 500;
        }

        .drm-badge--bad {
          background: rgba(239,68,68,0.2);
          color: #fca5a5;
          border: 1px solid rgba(239,68,68,0.4);
        }

        .drm-badge--good {
          background: rgba(34,197,94,0.2);
          color: #86efac;
          border: 1px solid rgba(34,197,94,0.4);
        }

        .drm-body { padding: 0.75rem; }

        .drm-flow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          margin-bottom: 0.75rem;
        }

        .drm-flow-item {
          font-size: 0.75rem;
          padding: 0.3rem 0.6rem;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          text-align: center;
        }

        .drm-flow-item--bad {
          background: rgba(239,68,68,0.15);
          color: #fca5a5;
          font-weight: 500;
        }

        .drm-flow-arrow {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
        }

        .drm-problems {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .drm-problem {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.7);
        }

        .drm-x {
          color: #ef4444;
          font-weight: 600;
        }

        .drm-split {
          display: flex;
          align-items: stretch;
          gap: 0.5rem;
        }

        .drm-split-box {
          flex: 1;
          padding: 0.6rem;
          border-radius: 0.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .drm-split-pot { border-color: rgba(212,175,55,0.4); }
        .drm-split-emissions { border-color: rgba(59,130,246,0.4); }

        .drm-split-label {
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.15rem;
        }

        .drm-split-pot .drm-split-label { color: #d4af37; }
        .drm-split-emissions .drm-split-label { color: #60a5fa; }

        .drm-split-desc {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.4rem;
        }

        .drm-split-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .drm-split-list li {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.8);
          padding-left: 0.75rem;
          position: relative;
          margin-bottom: 0.2rem;
        }

        .drm-split-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: rgba(255,255,255,0.4);
        }

        .drm-split-plus {
          display: flex;
          align-items: center;
          font-size: 1.25rem;
          font-weight: 300;
          color: rgba(255,255,255,0.3);
        }

        /* Emission Split Panel */
        .dr-emission-split {
          border-radius: 0.75rem;
          padding: 1rem;
          background: linear-gradient(145deg, rgba(15,23,42,0.97), rgba(17,24,39,0.97));
          border: 1px solid rgba(148,163,184,0.3);
          display: flex;
          flex-direction: column;
        }

        .dres-header {
          margin-bottom: 0.75rem;
        }

        .dres-header h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.15rem 0;
        }

        .dres-header p {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }

        .dres-bars {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .dres-bar {
          position: relative;
          height: 32px;
          background: rgba(255,255,255,0.05);
          border-radius: 6px;
          overflow: hidden;
        }

        .dres-bar-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 6px;
        }

        .dres-bar--validators .dres-bar-fill { background: linear-gradient(90deg, rgba(34,197,94,0.4), rgba(34,197,94,0.2)); }
        .dres-bar--miners .dres-bar-fill { background: linear-gradient(90deg, rgba(59,130,246,0.4), rgba(59,130,246,0.2)); }
        .dres-bar--owner .dres-bar-fill { background: linear-gradient(90deg, rgba(212,175,55,0.4), rgba(212,175,55,0.2)); }

        .dres-bar-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          height: 100%;
          padding: 0 0.75rem;
          gap: 0.5rem;
        }

        .dres-bar-pct {
          font-size: 0.85rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
        }

        .dres-bar--validators .dres-bar-pct { color: #22c55e; }
        .dres-bar--miners .dres-bar-pct { color: #60a5fa; }
        .dres-bar--owner .dres-bar-pct { color: #d4af37; }

        .dres-bar-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.9);
        }

        .dres-bar-why {
          display: flex;
          align-items: flex-start;
          gap: 0.35rem;
          font-size: 0.68rem;
          color: rgba(255,255,255,0.65);
          padding: 0.2rem 0.5rem 0.5rem 0.5rem;
          line-height: 1.4;
        }

        .dres-bar-why strong {
          color: rgba(255,255,255,0.9);
        }

        .dres-check {
          color: #22c55e;
          font-weight: 600;
          flex-shrink: 0;
        }

        .dres-insight {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 8px;
          display: flex;
          gap: 0.5rem;
        }

        .dres-insight-icon {
          font-size: 1rem;
          flex-shrink: 0;
        }

        .dres-insight-text {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.5;
        }

        .dres-insight-text em {
          color: #d4af37;
          font-style: normal;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .dual-revenue-layout {
            grid-template-columns: 1fr;
          }
          .drm-split {
            flex-direction: column;
          }
          .drm-split-plus {
            justify-content: center;
            padding: 0.25rem 0;
          }
        }

        /* Compliance */
        .compliance-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; }
        .compliance-main { padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
        .cm-badge { display: inline-block; padding: 0.4rem 0.75rem; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); border-radius: 6px; font-size: 0.85rem; font-weight: 600; color: #22c55e; margin-bottom: 1rem; }
        .compliance-main p { font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.5; margin-bottom: 1rem; }
        .cm-checks { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .cm-check { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.8); }
        .cm-check span { color: #22c55e; font-weight: 600; }
        .compliance-secondary { display: flex; flex-direction: column; gap: 0.75rem; }
        .cs-card { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; }
        .cs-card h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; }
        .cs-card p { font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.4; }
        .compliance-note { margin-top: 1rem; padding: 1rem 1.25rem; background: rgba(212,175,55,0.05); border: 1px solid rgba(212,175,55,0.15); border-radius: 10px; font-size: 0.85rem; color: rgba(255,255,255,0.7); }

        /* Revenue Grid - Flip Cards */
        .revenue-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 0.5rem 0; }
        .revenue-flip-card { height: 180px; perspective: 1000px; }
        .rfc-inner { position: relative; width: 100%; height: 100%; transition: transform 0.5s ease; transform-style: preserve-3d; }
        .revenue-flip-card:hover .rfc-inner { transform: rotateY(180deg); }
        .rfc-front, .rfc-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 12px; padding: 1rem; border: 1px solid; display: flex; flex-direction: column; }
        .rfc-front { background: rgba(255,255,255,0.02); }
        .rfc-back { transform: rotateY(180deg); }
        .rc-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 0.75rem; }
        .rc-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem; }
        .rc-desc { font-size: 0.75rem; color: rgba(255,255,255,0.6); line-height: 1.4; flex: 1; }
        .rc-market { font-size: 0.8rem; font-weight: 600; }
        .rc-flip-hint { font-size: 0.65rem; color: rgba(255,255,255,0.3); text-align: center; margin-top: 0.5rem; }
        .rcb-header { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.75rem; }
        .rcb-text { font-size: 0.75rem; color: rgba(255,255,255,0.8); line-height: 1.5; flex: 1; }
        .market-context { display: flex; justify-content: center; gap: 3rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 10px; }
        .mc-stat { display: flex; flex-direction: column; align-items: center; }
        .mc-value { font-size: 1.5rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #d4af37; }
        .mc-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); }

        /* Architecture */
        .arch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; }
        .arch-col { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; }
        .arch-header { display: flex; align-items: center; gap: 0.5rem; padding-bottom: 0.6rem; margin-bottom: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: 600; font-size: 0.9rem; color: var(--arch-color); }
        .arch-icon { font-size: 1.1rem; }
        .arch-list { list-style: none; }
        .arch-list li { font-size: 0.75rem; color: rgba(255,255,255,0.7); padding: 0.25rem 0; padding-left: 0.9rem; position: relative; }
        .arch-list li::before { content: '→'; position: absolute; left: 0; color: var(--arch-color, #d4af37); font-size: 0.7rem; }

        /* Competitions Slide */
        .competitions-layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .comp-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem; }
        .comp-section h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; color: #d4af37; }
        .comp-desc { font-size: 0.85rem; color: rgba(255,255,255,0.7); line-height: 1.5; margin-bottom: 1rem; }
        .comp-levels { display: flex; flex-direction: column; gap: 0.75rem; }
        .comp-level { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 8px; }
        .comp-badge { font-size: 1.5rem; }
        .comp-level-info h4 { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; color: rgba(255,255,255,0.9); }
        .comp-level-info p { font-size: 0.75rem; color: rgba(255,255,255,0.6); line-height: 1.4; }
        .comp-rewards { display: flex; flex-direction: column; gap: 0.5rem; }
        .comp-reward { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.02); border-radius: 6px; font-size: 0.85rem; color: rgba(255,255,255,0.8); }
        .reward-icon { font-size: 1.1rem; }
        .comp-sponsor-types { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
        .comp-sponsor-types span { padding: 0.4rem 0.75rem; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); border-radius: 20px; font-size: 0.75rem; color: #d4af37; }



        /* Financial Model - Enhanced */
        .financial-model-container { display: flex; flex-direction: column; gap: 1rem; height: 100%; }

        .fm-controls-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .fm-scenario-select { display: flex; gap: 0.5rem; }
        .fm-scenario-btn { padding: 0.6rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; min-width: 100px; }
        .fm-scenario-btn:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); }
        .fm-scenario-btn.active { background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05)); border-color: rgba(212,175,55,0.5); }
        .fm-scenario-label { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.9); }
        .fm-scenario-btn.active .fm-scenario-label { color: #d4af37; }
        .fm-scenario-amount { font-size: 0.65rem; color: rgba(255,255,255,0.5); margin-top: 0.15rem; }

        .fm-view-toggle { display: flex; gap: 0.25rem; background: rgba(255,255,255,0.03); padding: 0.25rem; border-radius: 8px; }
        .fm-view-btn { padding: 0.4rem 0.8rem; background: transparent; border: none; border-radius: 6px; color: rgba(255,255,255,0.6); font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
        .fm-view-btn:hover { color: rgba(255,255,255,0.9); }
        .fm-view-btn.active { background: rgba(212,175,55,0.2); color: #d4af37; }

        .fm-main-grid { display: grid; grid-template-columns: 280px 1fr; gap: 1rem; flex: 1; min-height: 0; }

        .fm-controls-panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; overflow-y: auto; }
        .fm-panel-header { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); }

        .fm-slider-section { display: flex; flex-direction: column; gap: 0.6rem; }
        .fm-section-title { font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; }

        .fin-slider-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .fin-slider-header { display: flex; justify-content: space-between; align-items: center; }
        .fin-slider-label { font-size: 0.75rem; color: rgba(255,255,255,0.7); }
        .fin-slider-value { font-size: 0.75rem; font-weight: 600; }
        .fin-slider-group input[type="range"] { width: 100%; height: 4px; -webkit-appearance: none; background: rgba(255,255,255,0.1); border-radius: 2px; cursor: pointer; transition: background 0.2s ease; }
        .fin-slider-group input[type="range"]:hover { background: rgba(255,255,255,0.15); }
        .fin-slider-group input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: var(--slider-color, #d4af37); border-radius: 50%; cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease; box-shadow: 0 0 0 3px rgba(212,175,55,0.2); }
        .fin-slider-group input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.1); box-shadow: 0 0 0 4px rgba(212,175,55,0.3); }
        .fin-slider-group input[type="range"]:active::-webkit-slider-thumb { transform: scale(0.95); }

        .fm-toggle-group { display: flex; gap: 0.5rem; }
        .fm-toggle-btn { flex: 1; padding: 0.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: rgba(255,255,255,0.6); font-size: 0.7rem; cursor: pointer; transition: all 0.2s ease; }
        .fm-toggle-btn:hover { background: rgba(255,255,255,0.06); }
        .fm-toggle-btn.active { background: rgba(212,175,55,0.15); border-color: rgba(212,175,55,0.4); color: #d4af37; }

        .fm-viz-panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; overflow: hidden; }

        .fm-budget-bars { display: flex; flex-direction: column; gap: 0.75rem; }
        .fm-bar-item { display: grid; grid-template-columns: 80px 1fr 80px; gap: 0.75rem; align-items: center; }
        .fm-bar-label { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
        .fm-bar-track { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
        .fm-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s ease; }
        .fm-bar-fill.alpha { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
        .fm-bar-fill.beta { background: linear-gradient(90deg, #9b59b6, #a855f7); }
        .fm-bar-fill.ops { background: linear-gradient(90deg, #22c55e, #4ade80); }
        .fm-bar-value { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.9); text-align: right; }

        .fm-chart-container { flex: 1; min-height: 140px; }

        .fm-breakdown-view { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; overflow-y: auto; }
        .fm-breakdown-section { background: rgba(255,255,255,0.02); border-radius: 8px; padding: 0.75rem; }
        .fm-breakdown-section.full-width { grid-column: 1 / -1; }
        .fm-breakdown-title { font-size: 0.8rem; font-weight: 600; color: #d4af37; margin-bottom: 0.6rem; padding-bottom: 0.4rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .fm-breakdown-row { display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.72rem; }
        .fm-breakdown-row.offset { opacity: 0.8; }
        .fm-breakdown-label { color: rgba(255,255,255,0.6); }
        .fm-breakdown-val { color: rgba(255,255,255,0.9); font-weight: 500; }
        .fm-breakdown-val.green { color: #22c55e; }
        .fm-breakdown-total { display: flex; justify-content: space-between; padding-top: 0.5rem; margin-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; font-weight: 600; color: #d4af37; }

        .fm-metrics-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }
        .fm-metric { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 0.75rem; text-align: center; transition: all 0.2s ease; }
        .fm-metric.highlight { border-color: rgba(34,197,94,0.3); }
        .fm-metric-val { font-size: 1.1rem; font-weight: 700; color: #d4af37; transition: color 0.2s ease; }
        .fm-metric-val.green { color: #22c55e; }
        .fm-metric-label { font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-top: 0.2rem; }


        /* Roadmap */
        .roadmap-timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .roadmap-phase { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; transition: all 0.2s ease; }
        .roadmap-phase.active { background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03)); border-color: rgba(212,175,55,0.3); }
        .roadmap-phase.upcoming { border-color: rgba(52,152,219,0.3); }
        .rp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .rp-phase { font-size: 0.7rem; font-weight: 600; color: #d4af37; }
        .rp-time { font-size: 0.65rem; color: rgba(255,255,255,0.4); }
        .rp-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.6rem; }
        .rp-items { list-style: none; }
        .rp-items li { font-size: 0.7rem; color: rgba(255,255,255,0.6); padding: 0.2rem 0; padding-left: 0.9rem; position: relative; }
        .rp-items li::before { content: '→'; position: absolute; left: 0; color: #d4af37; }

        /* Summary */
        .vision-statement { font-size: 1.5rem; font-weight: 400; line-height: 1.6; max-width: 900px; color: rgba(255,255,255,0.9); }
        .final-pillars { display: flex; gap: 2rem; margin: 1.5rem 0; flex-wrap: wrap; justify-content: center; }
        .fp-item { text-align: center; min-width: 120px; }
        .fp-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .fp-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; }
        .fp-desc { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
        .cta-section { display: flex; gap: 1rem; margin: 1.25rem 0; }
        .cta-primary { padding: 0.85rem 1.75rem; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); border: none; border-radius: 8px; color: #0d0d14; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: 'Outfit', sans-serif; text-decoration: none; }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212,175,55,0.3); }
        .cta-secondary { padding: 0.85rem 1.75rem; background: transparent; border: 1px solid rgba(212,175,55,0.4); border-radius: 8px; color: #d4af37; cursor: pointer; transition: all 0.2s ease; font-family: 'Outfit', sans-serif; text-decoration: none; }
        .cta-secondary:hover { background: rgba(212,175,55,0.1); }
        .cta-links { display: flex; gap: 2rem; margin-top: 1rem; justify-content: center; }
        .cta-text-link { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 0.9rem; cursor: pointer; text-decoration: underline; font-family: 'Outfit', sans-serif; transition: color 0.2s; }
        .cta-text-link:hover { color: #d4af37; }

        /* Contact Modal */
        .contact-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .contact-modal { background: linear-gradient(135deg, #1a1a24 0%, #0d0d14 100%); border: 1px solid rgba(212,175,55,0.3); border-radius: 16px; max-width: 500px; width: 100%; padding: 2rem; position: relative; }
        .contact-modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1.5rem; cursor: pointer; line-height: 1; }
        .contact-modal-close:hover { color: #fff; }
        .contact-modal h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; color: #d4af37; margin-bottom: 0.5rem; }
        .contact-modal p { color: rgba(255,255,255,0.6); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .contact-form { display: flex; flex-direction: column; gap: 1rem; }
        .contact-form input, .contact-form select, .contact-form textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 0.75rem 1rem; color: #fff; font-family: 'Outfit', sans-serif; font-size: 0.95rem; }
        .contact-form input:focus, .contact-form select:focus, .contact-form textarea:focus { outline: none; border-color: rgba(212,175,55,0.5); }
        .contact-form textarea { min-height: 120px; resize: vertical; }
        .contact-form select { cursor: pointer; }
        .contact-form select option { background: #1a1a24; color: #fff; }
        .contact-submit { padding: 0.85rem 1.75rem; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); border: none; border-radius: 8px; color: #0d0d14; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
        .contact-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212,175,55,0.3); }
        .contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .contact-success { text-align: center; padding: 2rem 0; }
        .contact-success h3 { color: #22c55e; font-family: 'Space Grotesk', sans-serif; margin-bottom: 0.5rem; }
        .contact-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); padding: 0.75rem 1rem; border-radius: 8px; color: #ef4444; font-size: 0.9rem; margin-bottom: 1rem; }
        .final-tagline { font-size: 0.9rem; color: rgba(255,255,255,0.5); font-style: italic; }

        /* Top Center Nav Pill with Dropdown */
        .nav-pill {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(13, 13, 20, 0.95);
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

        /* Center section with slide name */
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
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-pill-counter {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          font-family: 'JetBrains Mono', monospace;
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
          background: rgba(13, 13, 20, 0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 8px;
          min-width: 200px;
          max-height: 400px;
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
          padding: 8px 12px;
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
          font-family: 'JetBrains Mono', monospace;
          width: 20px;
        }

        .nav-dropdown-item.active .nav-dropdown-num {
          color: #d4af37;
        }

        .nav-dropdown-name {
          font-size: 0.8rem;
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
          background: rgba(13, 13, 20, 0.8);
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

        /* Hide old header on desktop when nav-pill is shown */
        .header {
          opacity: 0;
          pointer-events: none;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .arch-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1024px) {
          .slide-grid-2 { grid-template-columns: 1fr; gap: 1.5rem; }
          .solution-grid { grid-template-columns: repeat(2, 1fr); }
          .precedent-layout { grid-template-columns: 1fr; }
          .scoring-grid { grid-template-columns: 1fr; }
          .model-layout { grid-template-columns: 1fr; }
          .deflationary-layout { grid-template-columns: 1fr; }
          .compliance-grid { grid-template-columns: 1fr; }
          .revenue-grid { grid-template-columns: repeat(2, 1fr); }
          .arch-grid { grid-template-columns: 1fr; }
          .roadmap-timeline { grid-template-columns: repeat(2, 1fr); }
          .scalability-layout { flex-direction: column; }
          .scale-arrow { transform: rotate(90deg); }
          .tiers-layout { grid-template-columns: 1fr; }
          .reward-distribution-layout { grid-template-columns: 1fr; }
          .distribution-layout { grid-template-columns: 1fr; }
          .profit-breakdown { flex-direction: column; align-items: stretch; }
          .pb-plus, .pb-equals { text-align: center; }
          .pb-item { width: 100%; }
          .roi-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .header { display: none; }
          .main-content { top: 50px; }
          .main-content-inner { padding: 1rem 1rem 100px; }
          .slide-content { padding: 1rem; min-height: auto; }
          .hero-title { font-size: 2.5rem; letter-spacing: 0.1em; }
          .hero-subtitle { font-size: 1rem; }
          .section-title { font-size: 1.5rem; }
          .stats-row { flex-direction: column; gap: 1rem; }
          .solution-grid { grid-template-columns: 1fr; }
          .flow-diagram { flex-direction: column; gap: 0.75rem; }
          .flow-step { flex-direction: row; text-align: left; gap: 1rem; }
          .fs-number { margin-bottom: 0; flex-shrink: 0; }
          .fs-arrow { display: none; }
          .ew-grid { grid-template-columns: 1fr; }
          .et-track { flex-direction: column; }
          .roadmap-timeline { grid-template-columns: 1fr; }
          .final-pillars { flex-direction: column; gap: 1rem; }
          .cta-section { flex-direction: column; gap: 0.75rem; }
          .keyboard-hint { display: none; }
          .nav-pill-name { max-width: 100px; }
          .nav-dropdown { min-width: 180px; max-height: 300px; }
          .bittensor-badge { flex-wrap: wrap; gap: 0.5rem; font-size: 0.65rem; }
          .separator { display: none; }
          .tl-flow { flex-direction: column; }
          .tlf-arrow { transform: rotate(90deg); }
          .uid-grid { flex-direction: column; gap: 1rem; }
          .market-context { flex-direction: column; gap: 1rem; }
          .revenue-grid { grid-template-columns: 1fr; }
          .revenue-flip-card { height: 200px; }
          .competitions-layout { grid-template-columns: 1fr; }
          .roi-grid { grid-template-columns: 1fr; }
          .tv-bar { height: 20px; }
          .tv-legend { flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
        }

        @media (max-width: 480px) {
          .roi-grid { grid-template-columns: 1fr; }
          .tv-seg { font-size: 0.6rem; }
        }

        /* Touch device optimizations */
        @media (hover: none) {
          .revenue-flip-card { cursor: pointer; }
          .revenue-flip-card:active .rfc-inner { transform: rotateY(180deg); }
          .rc-flip-hint::after { content: 'Tap to see details'; }
        }
      `}</style>

      <header className="header">
        <div className="logo">
          <div className="logo-icon">Q</div>
          <span className="logo-text">QUANTA</span>
        </div>
        <div className="slide-counter">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      </header>

      <main className="main-content" ref={slideContainerRef}>
        <div
          key={currentSlide}
          className={`main-content-inner slide-transition ${slideAnimated ? 'animations-complete' : ''}`}
        >
          <div className="slide-wrapper">
            <SlideComponent />
          </div>
        </div>
      </main>

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

      {/* Scroll indicator - shows once per slide when content is scrollable */}
      <div className={`scroll-indicator ${scrollIndicatorVisible ? 'visible' : ''}`}>
        <span className="scroll-indicator-text">Scroll for more</span>
        <span className="scroll-indicator-arrow">↓</span>
      </div>

      <div className="keyboard-hint" style={{display: 'none'}}>
        <span>← →</span>
        <span>Space</span>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="contact-modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="contact-modal-close" onClick={() => setShowContactModal(false)}>&times;</button>
            <h2>Questions & Investment</h2>
            <p>Interested in learning more about QUANTA or exploring investment opportunities? Get in touch with our team.</p>

            {contactSubmitted ? (
              <div className="contact-success">
                <h3>Message Sent!</h3>
                <p>Thank you for your interest. We'll be in touch soon.</p>
                <button className="contact-submit" style={{marginTop: '1rem'}} onClick={() => {setShowContactModal(false); setContactSubmitted(false);}}>Close</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleContactSubmit}>
                {contactError && <div className="contact-error">{contactError}</div>}
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                >
                  <option value="Investment Inquiry">Investment Inquiry</option>
                  <option value="Partnership Opportunity">Partnership Opportunity</option>
                  <option value="Technical Questions">Technical Questions</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
                <textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                />
                <button type="submit" className="contact-submit" disabled={contactSubmitting}>
                  {contactSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantaPitchDeckFinal;
