# QUANTA Miner Taxonomy

## Complete Classification of Network Participants

QUANTA's portfolio-only submission model enables unprecedented diversity in participant types. This document catalogs the full spectrum of miner configurations, interfaces, and computational requirements.

---

## 1. Classification Framework

Miners are classified along four dimensions:

| Dimension | Options |
|-----------|---------|
| **Registration** | Solo (Direct UID) Â· Pooled (via Operator) |
| **Generation Method** | Discretionary Â· Systematic Â· Hybrid |
| **Operator Scale** | Individual Â· Team Â· Platform |
| **Interface Type** | CLI Â· Web Â· Mobile Â· API Â· Social Â· Embedded |

---

## 2. Solo Miners (Direct UID Holders)

Solo miners hold direct on-chain UIDs, receiving 100% of rewards without pool operator fees. Requires 90-day track record in top 10% to qualify.

### 2.1 Solo Discretionary Miners

Participants who generate portfolios through human judgment, research, and intuition.

#### 2.1.1 Retail Stock Picker
- **Profile**: Individual investor with strong market intuition
- **Method**: Fundamental analysis, news reading, sector expertise
- **Interface**: Web GUI, mobile app, or simple text submission
- **Compute**: None beyond standard web browsing
- **Update Frequency**: Weekly to monthly
- **Example**: Former sell-side analyst picking stocks based on earnings analysis

#### 2.1.2 Professional Discretionary Trader
- **Profile**: Ex-hedge fund PM, family office manager, RIA
- **Method**: Deep fundamental research, channel checks, expert networks
- **Interface**: Custom dashboard, Bloomberg terminal integration, API
- **Compute**: Minimalâ€”spreadsheets, research databases
- **Update Frequency**: Weekly
- **Example**: Portfolio manager running personal capital alongside QUANTA submissions

#### 2.1.3 Thematic/Macro Investor
- **Profile**: Macro strategist, sector specialist
- **Method**: Top-down allocation based on economic themes
- **Interface**: Web dashboard with sector/theme builders
- **Compute**: None
- **Update Frequency**: Monthly to quarterly
- **Example**: Energy sector specialist building fossil fuel vs. renewables tilts

#### 2.1.4 Event-Driven Specialist
- **Profile**: M&A arbitrageur, earnings trader, catalyst investor
- **Method**: Calendar-driven portfolio adjustments around corporate events
- **Interface**: Event calendar integration, news feed dashboard
- **Compute**: Minimalâ€”event tracking tools
- **Update Frequency**: High (event-triggered)
- **Example**: Merger arb specialist weighting acquirer/target pairs

---

### 2.2 Solo Systematic Miners

Participants using algorithmic, quantitative, or ML-based portfolio generation.

#### 2.2.1 Quantitative Factor Investor
- **Profile**: Quant with factor model expertise
- **Method**: Multi-factor optimization (value, momentum, quality, etc.)
- **Interface**: Python scripts â†’ JSON export, API submission
- **Compute**: Low-moderate (laptop/desktop sufficient)
  - Daily factor scoring: 1-2 CPU hours
  - Portfolio optimization: Minutes
- **Update Frequency**: Weekly to monthly
- **Example**: CFA running proprietary 5-factor model in Python

#### 2.2.2 Statistical Arbitrage Operator
- **Profile**: Quantitative trader, ex-prop shop
- **Method**: Mean reversion, pairs trading, cointegration models
- **Interface**: Automated pipeline with API submission
- **Compute**: Moderate
  - Cointegration testing: 2-4 CPU hours daily
  - Signal generation: Real-time capable on single server
- **Update Frequency**: Daily to weekly
- **Example**: Former Jane Street trader running simplified stat arb book

#### 2.2.3 Machine Learning Engineer
- **Profile**: Data scientist, ML practitioner
- **Method**: Gradient boosting, neural networks, transformers on market data
- **Interface**: MLOps pipeline â†’ portfolio extraction â†’ API
- **Compute**: Moderate-High
  - Model training: 4-24 GPU hours (weekly retraining)
  - Inference: Minutes on CPU
  - Data pipeline: 2-8 CPU hours daily
- **Update Frequency**: Daily to weekly
- **Example**: Kaggle grandmaster applying tabular ML to stock selection

#### 2.2.4 Alternative Data Specialist
- **Profile**: Data engineer with alt-data expertise
- **Method**: Satellite imagery, web scraping, NLP on filings/news
- **Interface**: Data pipeline â†’ signal extraction â†’ portfolio weights
- **Compute**: High
  - Data ingestion: 10-50 GB daily
  - NLP processing: 8-24 GPU hours
  - Signal generation: 2-4 CPU hours
- **Update Frequency**: Daily
- **Example**: Quant shop using credit card transaction data for retail sector signals

#### 2.2.5 Reinforcement Learning Agent
- **Profile**: AI researcher, algorithmic trading specialist
- **Method**: RL agents trained on market simulation
- **Interface**: Agent inference â†’ action space â†’ portfolio weights
- **Compute**: Very High (training), Low (inference)
  - Training: 100-1000+ GPU hours
  - Inference: Seconds on CPU
- **Update Frequency**: Daily
- **Example**: PhD researcher deploying PPO agent trained on 20-year backtest

#### 2.2.6 LLM/Agent-Based System
- **Profile**: AI developer, prompt engineer
- **Method**: LLM reasoning over news, filings, market data
- **Interface**: Agent orchestration â†’ structured output â†’ portfolio JSON
- **Compute**: Moderate (API costs)
  - LLM inference: $10-100/day in API calls
  - Orchestration: Minimal CPU
- **Update Frequency**: Daily
- **Example**: Claude/GPT-4 agent analyzing earnings calls and generating allocations

---

### 2.3 Solo Hybrid Miners

Combining systematic signals with discretionary overlay.

#### 2.3.1 Quant + Discretionary Override
- **Profile**: Experienced trader with quantitative background
- **Method**: Algorithmic base portfolio with human veto/adjustment
- **Interface**: Dashboard showing model output with override controls
- **Compute**: Low-moderate (model runs automatically)
- **Update Frequency**: Weekly
- **Example**: PM using factor model but overriding based on earnings surprises

#### 2.3.2 Ensemble Aggregator
- **Profile**: Multi-strategy operator
- **Method**: Combining outputs from multiple personal models/approaches
- **Interface**: Meta-portfolio constructor averaging sub-strategies
- **Compute**: Sum of underlying strategies
- **Update Frequency**: Weekly
- **Example**: Running value, momentum, and ML models, averaging their outputs

---

## 3. Pool Operators

Pool Operators hold on-chain UIDs and aggregate signals from multiple participants. They earn 10-20% fees while providing accessibility infrastructure.

### 3.1 Discretionary Pool Platforms

#### 3.1.1 Social Trading Platform
- **Description**: Copy-trading interface where users follow top performers
- **User Interface**: 
  - Leaderboard of top portfolios
  - One-click follow/copy functionality
  - Portfolio builder with social proof
- **Aggregation Method**: Stake-weighted average of followed portfolios
- **Compute Requirements**: 
  - Web infrastructure: 2-4 vCPUs, 8GB RAM
  - Database for user portfolios: Standard PostgreSQL
- **Revenue Model**: Platform fee (15%) + premium features
- **Example**: "QUANTA Social" - Robinhood-meets-eToro for signal generation

#### 3.1.2 Investment Club Aggregator
- **Description**: Formalized investment club submitting consensus portfolio
- **User Interface**: 
  - Voting/polling system for stock picks
  - Discussion forums
  - Portfolio proposal workflow
- **Aggregation Method**: Democratic voting or weighted by member track record
- **Compute Requirements**: Minimal (collaboration tools)
- **Revenue Model**: Membership fees + reward sharing
- **Example**: "The Stockpickers Club" - 50 members voting on weekly portfolio

#### 3.1.3 Research Community Platform
- **Description**: Analyst community sharing research and building portfolios
- **User Interface**:
  - Research publishing platform
  - Conviction scoring on stock ideas
  - Automatic portfolio construction from high-conviction ideas
- **Aggregation Method**: Conviction-weighted across published research
- **Compute Requirements**: Content platform infrastructure
- **Revenue Model**: Premium research subscriptions + QUANTA rewards
- **Example**: "AlphaSeek" - Seeking Alpha meets prediction markets

#### 3.1.4 Financial Advisor Network
- **Description**: RIAs/advisors pooling best ideas
- **User Interface**:
  - Professional dashboard
  - Compliance-friendly submission flow
  - Attribution tracking for advisor performance
- **Aggregation Method**: Equal-weight or AUM-weighted across advisors
- **Compute Requirements**: Minimal + compliance logging
- **Revenue Model**: Advisor licensing fees + shared rewards
- **Example**: "AdvisorAlpha Network" - 200 RIAs contributing top picks

#### 3.1.5 Prediction Market Hybrid
- **Description**: Market-based aggregation of stock predictions
- **User Interface**:
  - Prediction market for individual stocks
  - Prices converted to portfolio weights
  - Trading interface for predictions
- **Aggregation Method**: Market prices â†’ implied probability â†’ weights
- **Compute Requirements**: Market matching engine (moderate)
- **Revenue Model**: Trading spreads + platform fees
- **Example**: "StockCast Markets" - Polymarket for equity predictions

---

### 3.2 Systematic Pool Platforms

#### 3.2.1 Quant Competition Platform
- **Description**: Ongoing competition for algorithmic strategies
- **User Interface**:
  - Strategy submission portal
  - Backtesting environment
  - Leaderboard and performance analytics
- **Aggregation Method**: Top N strategies weighted by live performance
- **Compute Requirements**: 
  - Backtesting infrastructure: 8-32 vCPUs
  - Strategy sandboxing: Container orchestration
- **Revenue Model**: Competition fees + talent scouting partnerships
- **Example**: "QuantArena" - Numerai-style competition feeding QUANTA

#### 3.2.2 Algorithm Marketplace
- **Description**: Platform for buying/selling/renting trading algorithms
- **User Interface**:
  - Algorithm store with performance metrics
  - Subscription management
  - Paper trading verification
- **Aggregation Method**: Subscriber-weighted combination of purchased algos
- **Compute Requirements**:
  - Sandboxed execution: 16-64 vCPUs
  - Performance tracking: Moderate database load
- **Revenue Model**: Transaction fees + subscriptions
- **Example**: "AlgoMart" - App store for trading algorithms

#### 3.2.3 Academic Research Consortium
- **Description**: Universities/researchers contributing published strategies
- **User Interface**:
  - Research paper â†’ strategy conversion
  - Academic attribution tracking
  - Reproducibility verification
- **Aggregation Method**: Citation-weighted or committee-selected
- **Compute Requirements**: Paper replication infrastructure
- **Revenue Model**: Grant funding + institutional partnerships
- **Example**: "FinancePhD Consortium" - Top finance departments pooling research

#### 3.2.4 Robo-Advisor Aggregator
- **Description**: Multiple robo-advisor strategies combined
- **User Interface**:
  - Risk questionnaire
  - Strategy selection
  - Automatic rebalancing signals
- **Aggregation Method**: User-preference-weighted across robo strategies
- **Compute Requirements**: Low (pre-computed allocations)
- **Revenue Model**: AUM-based fees + QUANTA rewards
- **Example**: "RoboPool" - Aggregating Wealthfront/Betterment-style allocations

#### 3.2.5 Open Source Strategy Collective
- **Description**: Community-maintained open source strategies
- **User Interface**:
  - GitHub-integrated strategy repository
  - Pull request workflow for strategy updates
  - Transparent performance tracking
- **Aggregation Method**: Maintainer-curated selection
- **Compute Requirements**: CI/CD for strategy execution
- **Revenue Model**: Donations + sponsor recognition + reward sharing
- **Example**: "OpenAlpha DAO" - Gitcoin-style collective for trading strategies

---

### 3.3 Hybrid Pool Platforms

#### 3.3.1 Analyst + Quant Fusion
- **Description**: Human research enhanced by quantitative screening
- **User Interface**:
  - Quant screens surface candidates
  - Human analysts write up and score
  - Combined scoring drives portfolio
- **Aggregation Method**: Analyst conviction Ã— quant factor score
- **Compute Requirements**: Moderate (factor model + content platform)
- **Revenue Model**: Research subscriptions + rewards
- **Example**: "AlphaFusion" - Morningstar meets quantitative screening

#### 3.3.2 Crowd + Algorithm Ensemble
- **Description**: Equal weighting of crowd wisdom and systematic signals
- **User Interface**:
  - Public voting on stocks
  - Algorithm portfolio displayed alongside
  - Ensemble output shown in real-time
- **Aggregation Method**: 50/50 crowd vote + algorithm
- **Compute Requirements**: Moderate (both systems)
- **Revenue Model**: Freemium access + premium analytics
- **Example**: "WisdomBlend" - Testing crowd vs. quant performance

---

## 4. Specialized Miner Configurations

### 4.1 Sector/Theme Specialists

#### 4.1.1 Sector-Focused Solo Miner
- **Profile**: Deep expertise in specific sector (biotech, semiconductors, energy)
- **Universe**: Restricted to sector constituents
- **Edge**: Domain knowledge, conference attendance, expert networks
- **Compute**: Minimal
- **Example**: Former pharma executive picking biotech stocks

#### 4.1.2 ESG/Impact Pool
- **Description**: Sustainability-focused portfolio aggregation
- **User Interface**: ESG scoring integration, impact metrics dashboard
- **Aggregation**: ESG-score-weighted across participant submissions
- **Example**: "GreenAlpha Pool" - Climate-conscious stock selection

#### 4.1.3 Geographic Specialist
- **Profile**: Expertise in US-listed ADRs from specific regions
- **Universe**: Chinese ADRs, European ADRs, EM exposure
- **Edge**: Language skills, local market knowledge
- **Example**: Mandarin-speaking analyst specializing in Chinese tech ADRs

---

### 4.2 Strategy-Specific Configurations

#### 4.2.1 Long-Only Value
- **Method**: Deep value, contrarian, distressed
- **Compute**: Fundamental data processing
- **Turnover**: Low (monthly/quarterly rebalance)

#### 4.2.2 Momentum/Trend Following
- **Method**: Price momentum, moving average signals
- **Compute**: Daily price data processing
- **Turnover**: Moderate (weekly rebalance)

#### 4.2.3 Quality/Dividend Focus
- **Method**: Dividend growth, quality screens, low volatility
- **Compute**: Quarterly fundamental updates
- **Turnover**: Very low

#### 4.2.4 Small-Cap Specialist
- **Method**: Under-followed small caps, special situations
- **Compute**: Extensive screening across universe
- **Edge**: Coverage gap exploitation

#### 4.2.5 Options-Informed Equity
- **Method**: Using options flow/implied vol for equity selection
- **Compute**: Options data processing
- **Edge**: Vol surface interpretation

---

## 5. Interface Types & Technical Requirements

### 5.1 Command Line Interface (CLI)

```
Target User: Developers, quants, automation enthusiasts
Technical Stack: Python/Node CLI tool
Submission Flow: quanta submit --portfolio portfolio.json --ante 50
Compute: None (client-side)
Maintenance: Self-managed
```

**Best For**: Solo systematic miners, developers testing strategies

### 5.2 Web Dashboard

```
Target User: Discretionary traders, casual participants
Technical Stack: React/Vue frontend, REST API backend
Features:
  - Portfolio builder with search/autocomplete
  - Weight sliders with real-time validation
  - Performance tracking dashboard
  - Ante management interface
Compute: 2-4 vCPUs, 4-8GB RAM for self-hosted
Maintenance: Platform operator
```

**Best For**: Retail participants, discretionary stock pickers

### 5.3 Mobile Application

```
Target User: Retail investors, mobile-first users
Technical Stack: React Native / Flutter
Features:
  - Swipe-based stock selection
  - Push notifications for performance
  - Quick rebalance gestures
  - Social features (follow/copy)
Compute: Mobile device + API backend
Maintenance: App store deployment, platform operator
```

**Best For**: Casual participants, social trading pools

### 5.4 API Integration

```
Target User: Systematic traders, platforms, institutions
Technical Stack: REST/GraphQL/WebSocket API
Features:
  - Programmatic submission
  - Real-time status webhooks
  - Batch operations
  - Historical performance queries
Compute: Minimal (API calls from existing infrastructure)
Maintenance: Self-managed integration
```

**Best For**: Quant shops, platform operators, automated systems

### 5.5 Spreadsheet Integration

```
Target User: Finance professionals, Excel power users
Technical Stack: Excel/Google Sheets add-on
Features:
  - Portfolio template with validation
  - One-click submission from sheet
  - Performance data import
  - Historical tracking
Compute: None
Maintenance: Add-on updates
```

**Best For**: RIAs, investment clubs, spreadsheet-native analysts

### 5.6 Social/Chat Integration

```
Target User: Community-oriented traders, casual participants
Technical Stack: Discord/Telegram/Slack bot
Features:
  - /submit AAPL:20% MSFT:15% ...
  - /status - current portfolio
  - /leaderboard - pool rankings
  - /rebalance - guided rebalance flow
Compute: Bot hosting (minimal)
Maintenance: Bot operator
```

**Best For**: Investment clubs, trading communities, Discord groups

### 5.7 TradingView Integration

```
Target User: Technical analysts, chart-focused traders
Technical Stack: TradingView widget/webhook integration
Features:
  - Export watchlist as portfolio
  - Indicator-triggered submissions
  - Chart-based weight assignment
Compute: None (TradingView infrastructure)
Maintenance: Webhook configuration
```

**Best For**: Technical analysts, chart-based discretionary traders

### 5.8 Broker Integration (Phase 2)

```
Target User: Active traders with existing brokerage
Technical Stack: Broker API integration (read-only)
Features:
  - Mirror existing portfolio as QUANTA signal
  - Delta submissions (changes only)
  - Performance comparison: actual vs. QUANTA
Compute: Minimal (API polling)
Maintenance: Broker API credentials
```

**Best For**: Traders wanting to monetize existing portfolios

---

## 6. Computational Requirements Summary

### 6.1 By Miner Type

| Miner Type | CPU | GPU | RAM | Storage | Daily Runtime |
|------------|-----|-----|-----|---------|---------------|
| Discretionary Individual | None | None | None | None | N/A |
| Factor Quant | 2-4 cores | None | 8GB | 50GB | 1-2 hours |
| Stat Arb | 4-8 cores | None | 16GB | 100GB | 2-4 hours |
| ML Engineer | 4-8 cores | 1 GPU | 32GB | 500GB | 4-8 hours |
| Alt Data Specialist | 8-16 cores | 1-2 GPUs | 64GB | 2TB | 8-24 hours |
| RL Agent (inference) | 2 cores | None | 8GB | 10GB | Minutes |
| RL Agent (training) | 16+ cores | 4-8 GPUs | 128GB | 1TB | 100+ hours |
| LLM-Based | 2 cores | None* | 8GB | 10GB | 1-2 hours |

*LLM compute via API calls ($10-100/day)

### 6.2 By Platform Type

| Platform Type | vCPUs | RAM | Storage | Bandwidth | Est. Monthly Cost |
|---------------|-------|-----|---------|-----------|-------------------|
| Simple Web GUI | 2-4 | 4-8GB | 50GB | 100GB | $20-50 |
| Social Trading Platform | 8-16 | 32GB | 500GB | 1TB | $200-500 |
| Quant Competition | 16-32 | 64GB | 2TB | 2TB | $500-1000 |
| Algorithm Marketplace | 32-64 | 128GB | 5TB | 5TB | $1000-2500 |
| Full Pool Operator | 8-16 | 32GB | 500GB | 1TB | $200-500 |

---

## 7. Entry Path Recommendations

### For Individuals

| Background | Recommended Path | Time to First Submission |
|------------|------------------|-------------------------|
| Retail investor | Web GUI via Pool | 5 minutes |
| Finance professional | Spreadsheet integration | 15 minutes |
| Software developer | CLI tool | 30 minutes |
| Data scientist | API + Python pipeline | 2-4 hours |
| Quant researcher | Full systematic pipeline | 1-2 weeks |

### For Platforms/Operators

| Goal | Recommended Architecture | Development Time |
|------|-------------------------|------------------|
| Simple investment club | Discord bot + web dashboard | 1-2 weeks |
| Social trading platform | Full web app + mobile | 2-3 months |
| Quant competition | Backtesting infra + submission portal | 3-6 months |
| Algorithm marketplace | Sandboxed execution + marketplace | 6-12 months |

---

## 8. Competitive Positioning

### QUANTA vs. Numerai: Participation Accessibility

| Dimension | Numerai | QUANTA |
|-----------|---------|--------|
| Submission format | ML model predictions on obfuscated data | Portfolio weights (any method) |
| Minimum skill | Data science/ML expertise | Stock picking ability |
| Compute requirement | GPU for model training | None to high (participant choice) |
| Interface options | Python API only | CLI, Web, Mobile, Social, API |
| Pool/aggregation | Not supported | First-class architecture |
| Entry barrier | High | Very low |

### Accessibility Spectrum

```
Low Barrier                                              High Barrier
    â”‚                                                         â”‚
    â–¼                                                         â–¼
[QUANTA Web GUI] â†’ [QUANTA CLI] â†’ [QUANTA API] â†’ [Numerai] â†’ [Prop Trading]
    â”‚                   â”‚              â”‚             â”‚            â”‚
 5 minutes          30 minutes      Hours        Weeks        Years
```

---

## 9. Conclusion

QUANTA's portfolio-only submission model enables a uniquely diverse ecosystem of participants:

- **Zero compute barrier**: Discretionary traders submit via GUI
- **Unlimited compute ceiling**: Sophisticated ML pipelines welcome
- **Individual to institutional**: Solo miners to aggregation platforms
- **Any interface**: CLI, web, mobile, social, API, spreadsheet

This accessibilityâ€”combined with the Signal Pool architecture for unlimited scaleâ€”positions QUANTA to aggregate intelligence from the broadest possible participant base, maximizing the network's collective alpha generation potential.

The network benefits from diversity: discretionary traders capture qualitative insights algorithms miss, while systematic strategies provide consistency and scale. Pool operators create accessibility layers that expand participation beyond crypto-native users.

**The question is not "can you build a trading algorithm?" but "can you pick good stocks?"** QUANTA democratizes access to alpha generation while maintaining the rigor of performance-based rewards.
