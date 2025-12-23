# QUANTA - Yuma Subnet Program Application

---

## Company
**CQ Financial Technologies Inc.**

---

## Subnet Name
**QUANTA**

---

## One-Line Subnet Description
Decentralized stock picking competition with risk-adjusted scoring and TAO rewards.

---

## The Team

### Contact Information
info@qsub.net

### Who are the founders?
**Jay Hirschfeld, Protocol Architect & Founder**

Digital marketing expert with deep background in design, development, and startup entrepreneurship. Author of multiple funded business plans with proven ability to translate complex technical concepts into viable businesses. For the past several years, focused exclusively on algorithmic and quantitative trading—building and deploying systematic strategies across platforms including Composer, QuantConnect, TradingView (PineScript), n8n automation, and custom node-graph-based strategy builders. This hands-on experience with both the promise and limitations of existing quantitative tools directly informed QUANTA's design.

### Why this team?
The QUANTA protocol requires a rare combination of skills: understanding what retail and prosumer traders actually need (not what institutions assume they need), the technical ability to architect decentralized systems, and the business acumen to design sustainable tokenomics.

Jay's background uniquely qualifies him for this challenge:

- **Practitioner-first perspective**: Years of hands-on algorithmic trading across multiple platforms revealed the structural gaps QUANTA addresses—no verifiable track records, competitions that reward luck over skill, and gatekeeping that excludes talented individuals.
- **Full-stack builder**: Design, development, and marketing expertise means the ability to ship complete products, not just whitepapers.
- **Startup DNA**: Multiple funded ventures demonstrate the ability to identify market opportunities, articulate compelling value propositions, and execute from concept to launch.

This isn't a team that theorized about quantitative trading—it's a team that lived the problem and built the solution.

---

## The Innovation

### The subnet idea
**QUANTA is a decentralized portfolio-based alpha signal generation network on Bittensor.**

**Problem:** Talented stock pickers exist globally—retail traders, quantitative researchers, AI/ML engineers—but have no trustworthy way to prove skill or monetize it. Traditional trading competitions reward lucky gamblers who take maximum risk. The equities market remains gatekept by hedge funds requiring credentials, connections, and capital.

**Solution:** QUANTA runs a continuous, permissionless stock picking competition. Participants submit portfolio signals (ticker-weight allocations) and validators score them using real market data and risk-adjusted metrics (Sortino ratio, Calmar ratio, max drawdown, turnover). Unlike games that reward raw returns, QUANTA rewards *consistency* and *risk management* across 7/30/90-day rolling evaluation windows.

**Key innovation:** The Signal Pool architecture overcomes Bittensor's 256 UID limitation, enabling unlimited participation. Signal generators stake proportional ante (skin-in-the-game), top performers win redistributed stake from underperformers, and a dual-revenue model (emissions + ante pool) keeps the long tail engaged while rewarding genuine alpha.

**Why it matters:** QUANTA democratizes quantitative trading infrastructure. Anyone with stock picking skill—human or AI—can build a verifiable on-chain track record and earn crypto rewards.

### Why is your subnet idea unique?
1. **Portfolio-first design:** Unlike prediction markets (binary outcomes) or price forecasting (scalar), QUANTA evaluates complete portfolio allocations with position sizing—the actual output institutional allocators need.

2. **Risk-adjusted scoring:** We don't reward lucky gamblers. The QUANTA Score weights Sortino ratio (35%), Calmar ratio (25%), max drawdown penalty (25%), and turnover penalty (15%) across multiple time horizons. Consistent risk-managers beat volatile winners.

3. **Signal Pool innovation:** We solved Bittensor's 256 UID bottleneck. Unlimited signal generators submit through Pool Operators who aggregate and route signals on-chain—enabling true scale while maintaining cryptographic attribution.

4. **Dual-revenue economics:** Emissions sustain infrastructure (validators, long-tail miners); the ante pool creates zero-sum competition for alpha. This prevents the "death spiral" where only whales can participate.

5. **Multi-horizon evaluation:** Rolling 7/30/90-day windows (weighted 30%/40%/30%) balance short-term alpha capture with long-term consistency—mirroring how professional fund managers are actually evaluated.

6. **Broad accessibility:** No GPUs, no ML expertise required. Submit a JSON of tickers and weights via web app, mobile, API, CLI, or spreadsheet. Human discretionary traders compete alongside AI agents on equal footing.

### Launch Status
**Development stage with working prototype**

- Localnet operational with full miner/validator communication
- Testnet deployment on consumer hardware imminent
- Core scoring engine, Signal Pool architecture, and anti-gaming detection complete
- Production repository with comprehensive documentation
- Corporate entity formed and operational

### Applicable link(s)
- **Website:** https://qsub.net
- **Pitch Deck:** https://qsub.net/pitch
- **Overview:** https://qsub.net/pitch-lite
- **FAQ:** https://qsub.net/faq
- **Technical Specification (PDF):** https://qsub.net/docs/QUANTA_Technical_Specification_v5.pdf

### Pitch deck & whitepaper
Technical Specification v5.0 (whitepaper) and interactive pitch deck available at links above.

---

## The Traction

### Revenue Model
QUANTA operates on a dual-revenue architecture that combines Bittensor's native emission system with a competitive ante pool, creating sustainable incentives at every layer of participation.

The emission layer follows Bittensor's dTAO mechanism with an 41/41/18 split: 41% flows to signal generators (miners) based on their performance ranking, 41% compensates validators for running infrastructure—fetching price feeds, computing scores, and participating in consensus—and 18% supports subnet development and operations. This base layer ensures that everyone contributing meaningful work to the network receives compensation, preventing the "death spiral" common in winner-take-all systems where only top performers remain engaged.

The competition layer adds skin-in-the-game through a proportional ante pool. Signal generators stake α-tokens when submitting portfolios, with stake size scaling their potential rewards. After each evaluation period, bottom performers forfeit their ante—50% is burned permanently (creating deflationary pressure) and 50% is redistributed to winners. Top performers earn premium returns from this redistributed stake, while break-even participants receive their ante back. We're currently considering setting the optional network rake to 0%, as emissions and external revenue may provide sufficient sustainability to allow 100% of the ante pool to flow to winning signal generators.

Beyond protocol-native revenue, we've identified six external monetization channels. First, a **Signals API** where hedge funds and fintech platforms subscribe for aggregated top-performer signals with tiered access from daily snapshots to real-time feeds, priced per seat or data volume ($50K-$250K/year per institutional client). Second, **SaaS Analytics** providing self-serve portfolio dashboards, backtesting, custom alerts, and factor attribution tools on a freemium model ($29-299/month tiers). Third, **Education** programs including courses taught by top-ranked miners, certification programs validating trading competency, and cohort-based mentorship with revenue-share for instructors. Fourth, **Tournaments**—quarterly championships with themed challenges where sponsors pay for branding, entry fees fund prize pools, and winners gain prestige plus recruiting visibility. Fifth, **Talent Scouting** partnering with quant funds seeking verified talent, where top miners' on-chain track records serve as auditable resumes and QUANTA earns recruitment fees (25% of first-year compensation, typically $100K-175K per placement). Finally, **Strategy Licensing** packaging proven strategies for asset managers—"QUANTA Top 10" indices, single-strategy mandates, smart contract-enforced royalties, and ETF partnerships for retail distribution (5-20 bps on AUM). These streams are additive to core network sustainability—pure bonus that further supports token value and ecosystem growth.

### User traction or milestones
- **Working prototype**: Localnet deployed with functional miner-validator scoring loop
- **Testnet imminent**: Consumer-grade hardware validation underway
- **Complete marketing presence**: Website, pitch deck, FAQ, technical specification
- **Corporate entity**: CQ Financial Technologies Inc. formed and operational
- **Documentation**: 100+ page technical specification (v5.0), comprehensive codebase

### Why Yuma?
Greg Schvey is COO of Yuma and a great friend who was early to Bitcoin—I should have believed him then. But beyond personal connection, QUANTA is precisely the type of project that benefits most from what the Yuma Accelerator offers.

We believe QUANTA is a great fit for the support Yuma can provide. We need access to seasoned Bittensor engineers who deeply understand subnet architecture, Yuma consensus, and dTAO mechanics—the kind of expertise that takes years to develop independently. We need launch partners who can run validator infrastructure from day one, giving the network immediate credibility and operational stability. We need increased access to the quant and trader community to bootstrap signal generators, validate our scoring mechanism, and create the network effects that make the meta-signal valuable. The α-token requires sufficient liquidity to function as an effective ante and reward mechanism, and Yuma's ecosystem can help establish that foundation. Perhaps most importantly, Yuma's backing signals legitimacy to the broader Bittensor ecosystem—a credibility multiplier that accelerates adoption.

What we bring to the partnership is equally substantial: a fully-specified, working protocol with clear technical differentiation; complete marketing materials and professional presentation ready for public launch; a founder who has lived the problem firsthand through years of algorithmic trading and built the solution from that experience; a market opportunity sitting at the intersection of DeFi, AI, and quantitative finance; and the will, determination, and skillset to see it through to realization.

Building alone is possible. Building with Yuma's support, community, and expertise means launching stronger, faster, and with the confidence that comes from having the right partners at the table.
