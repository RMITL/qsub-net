# Agent 05: Regulatory Compliance Review

## Purpose
Assess regulatory risk across jurisdictions and evaluate compliance pathway viability. Identify required legal structures and disclosure requirements.

---

## Evaluation Scope

This agent examines:
1. U.S. Securities Law (SEC/Howey Test)
2. U.S. Commodities Law (CFTC)
3. Investment Adviser Regulations
4. International Frameworks (EU MiCA, UK FCA, Singapore MAS)
5. Numerai Compliance Model Analysis
6. Recommended Compliance Architecture

---

## Detailed Evaluation Criteria

### 1. SEC Securities Law Analysis

**Howey Test Framework:**
A transaction is an "investment contract" (security) if it involves:
1. Investment of money
2. In a common enterprise
3. With expectation of profits
4. Derived from efforts of others

**QUANTA α-Token Analysis:**

| Prong | Application to QUANTA | Assessment |
|-------|----------------------|------------|
| **1. Investment of Money** | Miners stake α-token as ante | Likely satisfied - tokens have economic value |
| **2. Common Enterprise** | Pooled rewards distributed based on collective performance | Horizontal commonality possible - all participants share same pool |
| **3. Expectation of Profits** | Miners expect returns exceeding ante | Clearly satisfied - economic incentive is profit |
| **4. Efforts of Others** | Critical question - whose efforts? | Analysis required |

**Prong 4 Deep Dive: Efforts of Others**

**Arguments that α-token IS a security:**
- Network operators develop and maintain platform
- Validators perform scoring that determines rewards
- Pool operators aggregate signals
- Infrastructure enables profit generation

**Arguments that α-token is NOT a security:**
- Miners generate their own alpha through individual research
- Profits depend primarily on miner's own skill
- Similar to tournament prize money
- Active participation required (not passive investment)

**Key question:** Is profit "derived primarily from the efforts of others"?

**Relevant precedents:**
- *SEC v. W.J. Howey Co.* (1946) - Original test
- *SEC v. LBRY* (2022) - Token sold to fund development = security
- *SEC v. Ripple* (2023) - Programmatic sales may differ from institutional
- SEC Chairman Atkins "mutation" concept (Nov 2025) - Tokens can transition

**Questions to answer:**
- [ ] Does miner skill requirement satisfy "active participation"?
- [ ] Does Signal Pool aggregation create "pooled investment"?
- [ ] Is there "reliance on efforts of others" for API revenue sharing?
- [ ] Does decentralization affect analysis?

---

### 2. CFTC Commodities Law Analysis

**Key Questions:**

**Is α-token a commodity?**
- CFTC considers most cryptocurrencies commodities
- Likely yes under current interpretation

**Is QUANTA a commodity pool?**
```
Commodity Pool: A collective investment vehicle that trades commodities
CPO Registration: Required if operating a commodity pool

QUANTA analysis:
- Does not directly trade commodities/futures
- Aggregates stock portfolio signals
- Stakes are "ante" not "investment"

Likely NOT a commodity pool - but analysis required
```

**Is QUANTA a swap execution facility?**
```
Polymarket precedent: $1.4M settlement for unregistered SEF
QUANTA difference: Not pairing buyers/sellers of contracts

Likely NOT an SEF
```

**Kalshi v. CFTC implications:**
- Courts limited CFTC authority over prediction markets
- "Prediction markets are not inherently gaming"
- Favorable precedent for signal competition models

**Questions to answer:**
- [ ] Does signal aggregation constitute commodity advice?
- [ ] If API monetized, does that trigger CPO/CTA requirements?
- [ ] What exemptions might apply (4.13(a)(3))?

---

### 3. Investment Adviser Analysis

**Investment Advisers Act of 1940:**
An investment adviser is anyone who:
1. Provides advice about securities
2. As part of a regular business
3. For compensation

**QUANTA Analysis:**

| Element | Application | Assessment |
|---------|-------------|------------|
| Advice about securities | Leaderboard shows top portfolios | Potentially yes |
| Regular business | Continuous operation | Yes |
| Compensation | Subscription fees for API | Yes |

**Exemptions potentially available:**

**Publisher's Exemption:**
- Applies to "bona fide newspaper, news magazine, or business/financial publication"
- Leaderboard as "publication" of results?
- Requires: general circulation, impersonal nature, no direct advice

**Questions to answer:**
- [ ] Does displaying leaderboard constitute "advice"?
- [ ] Does API access providing portfolio data require RIA registration?
- [ ] Is there a publisher's exemption argument?
- [ ] What disclaimers are required?

---

### 4. International Regulatory Framework

**EU Markets in Crypto-Assets (MiCA):**
Effective December 2024

| Category | Definition | QUANTA Classification |
|----------|------------|----------------------|
| E-Money Token | Pegged to fiat | Not applicable |
| Asset-Referenced Token | Pegged to assets | Not applicable |
| Utility Token | Access to service | Possible fit |
| Crypto-Asset Service | Custody, exchange, advice | API may trigger |

**CASP Requirements if triggered:**
- Authorization in EU member state
- Capital requirements
- Conduct rules
- Cross-border passporting available

**UK Financial Conduct Authority:**
- Implementing comprehensive crypto rules through 2026
- Market abuse prohibitions
- Consumer protection requirements

**Singapore MAS:**
- Digital Payment Token framework expanded June 2025
- High licensing barriers
- Stablecoin-focused regulations

**Questions to answer:**
- [ ] Which jurisdictions require licensing for QUANTA operations?
- [ ] Is geographic restriction feasible?
- [ ] What's the registration cost/timeline per jurisdiction?

---

### 5. Numerai Compliance Model Analysis

**How Numerai structures compliance:**

```
Structure:
├── Numerai Tournament (LLC?)
│   ├── Accepts NMR stakes
│   ├── Pays rewards in NMR
│   ├── Tournament ≠ investment in fund
│   └── Educational/research framing
│
├── Numerai Fund (LP)
│   ├── Registered investment adviser
│   ├── Uses tournament signals
│   ├── LP investors ≠ tournament participants
│   └── Traditional fund structure
```

**Key separation principles:**
1. **Tournament participation ≠ fund investment**
   - Tournament prizes are for skill/competition
   - Not profit participation in fund performance

2. **NMR utility**
   - Used for staking (skin in game)
   - Not equity or profit-sharing instrument

3. **Clear disclosures**
   - Tournament is for research/education
   - No guarantee of fund performance correlation

**QUANTA comparison:**

| Numerai | QUANTA | Equivalence |
|---------|--------|-------------|
| NMR staking | α-token ante | Similar |
| Tournament | Signal competition | Similar |
| Meta-model | Signal Pool | Similar |
| Fund (separate) | No fund entity | Different |
| RIA registration | None planned | Gap |

**Questions to answer:**
- [ ] Does QUANTA need to establish fund entity?
- [ ] Should signal competition be structured as "educational"?
- [ ] What disclaimers does Numerai use?
- [ ] Is the α-token vs NMR structure comparable?

---

### 6. Compliance Architecture Recommendations

**Option A: Pure Competition Model**
```
Structure:
- α-token is utility token for competition access
- Competition framed as educational/research
- No fund operations
- API licensed as "data product" not "advice"

Pros: Simplest, lowest cost
Cons: May limit revenue opportunities
Risk: May not withstand SEC scrutiny
```

**Option B: Hybrid Model (Numerai-style)**
```
Structure:
- Competition entity (non-US if needed)
- Separate fund entity (RIA registered)
- Clear legal separation
- Fund independently uses signal data

Pros: Proven model, institutional credibility
Cons: Complex, expensive, requires fund management expertise
Risk: Execution complexity
```

**Option C: Non-US Domicile**
```
Structure:
- Entity domiciled in crypto-friendly jurisdiction
- Block US persons from token functions
- Comply with non-US requirements (MiCA, etc.)

Pros: Avoids SEC jurisdiction
Cons: Limits US market, may still face CFTC
Risk: Enforcement risk if US persons participate
```

---

### 7. Required Disclosures Checklist

Regardless of structure, these disclosures are likely required:

- [ ] Risk of loss disclosure
- [ ] Not investment advice disclaimer
- [ ] Past performance disclaimer
- [ ] Conflict of interest disclosure (operator participation)
- [ ] Data source limitations
- [ ] Regulatory status clarification
- [ ] Geographic restrictions
- [ ] Tax implications notice

---

### 8. Legal Work Required Pre-Launch

| Task | Priority | Estimated Cost | Timeline |
|------|----------|----------------|----------|
| Howey test legal opinion | Critical | $15-30K | 4-6 weeks |
| CFTC analysis | High | $10-20K | 3-4 weeks |
| Terms of service drafting | Critical | $5-10K | 2-3 weeks |
| Privacy policy | High | $3-5K | 1-2 weeks |
| Token opinion (non-security) | High | $20-40K | 6-8 weeks |
| International compliance review | Medium | $15-25K | 4-6 weeks |
| Structure recommendation | Critical | Included above | - |

**Total estimated legal cost: $70-130K**

---

## Regulatory Risk Assessment

| Jurisdiction | Risk Level | Key Concern | Mitigation |
|--------------|------------|-------------|------------|
| US (SEC) | High | Howey test on α-token | Utility token structure, skill-based framing |
| US (CFTC) | Medium | Commodity pool/advice | Exemption analysis |
| EU (MiCA) | Medium | CASP licensing | Registration or geo-block |
| UK (FCA) | Medium | Market abuse rules | Compliance program |
| Singapore | Low | Clear framework | Standard registration |

---

## Quantitative Assessment Rubric

| Criterion | Weight | Score Range |
|-----------|--------|-------------|
| US securities risk assessment | 25% | 1-10 (10 = low risk) |
| US commodities risk | 15% | 1-10 |
| Investment adviser risk | 15% | 1-10 |
| International compliance | 15% | 1-10 |
| Compliance pathway clarity | 15% | 1-10 |
| Precedent alignment | 15% | 1-10 |

---

## Output Requirements

1. **Howey test analysis** with detailed prong-by-prong assessment
2. **CFTC jurisdiction analysis** with exemption identification
3. **Investment adviser risk assessment**
4. **International requirement summary** by jurisdiction
5. **Numerai comparison** with structural recommendations
6. **Compliance architecture recommendation**
7. **Legal work roadmap** with cost estimates
8. **Overall regulatory risk score** (1-10, where 10 = highest risk)

---

## References

- SEC v. W.J. Howey Co., 328 U.S. 293 (1946)
- SEC v. LBRY, Inc. (D.N.H. 2022)
- SEC v. Ripple Labs (S.D.N.Y. 2023)
- Kalshi v. CFTC (D.C. Circuit 2024)
- Polymarket CFTC Settlement (2022)
- SEC Chairman Atkins "Project Crypto" Speech (Nov 2025)
- CLARITY Act of 2025 (pending)
- EU MiCA Regulation 2023/1114
- UK FCA Crypto-Asset Implementation Plan
- Singapore MAS Payment Services Act amendments
