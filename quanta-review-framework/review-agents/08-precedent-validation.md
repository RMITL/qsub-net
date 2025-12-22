# Agent 08: Precedent Validation

## Purpose
Validate QUANTA's claims against established precedents. Verify that referenced models (Numerai, Taoshi, Polymarket) support the assumptions made. Identify where QUANTA diverges from proven approaches.

---

## Evaluation Scope

This agent examines:
1. Numerai model precedent validation
2. Taoshi SN8 Bittensor precedent
3. Polymarket prediction market precedent
4. Academic research precedent
5. Traditional quant fund precedent
6. Precedent gaps and novel assumptions

---

## Detailed Evaluation Criteria

### 1. Numerai Precedent Validation

**Claims made about Numerai in documentation:**

| Claim | Source | Verification Status |
|-------|--------|---------------------|
| $550M AUM | Audit research | Verify |
| 25.45% net return 2024 | Audit research | Verify |
| $500M Series C valuation | Audit research | Verify |
| 15,000+ participants | Implied | Verify |
| J.P. Morgan $500M capacity | Audit research | Verify |
| MMC scoring rewards originality | Audit research | Verify |
| ±5% payout cap | Audit research | Verify |

**Verification tasks:**
- [ ] Confirm AUM figure from official sources
- [ ] Verify 2024 return figure
- [ ] Confirm Series C details
- [ ] Check participant count methodology
- [ ] Verify J.P. Morgan relationship

**Model mechanics comparison:**

| Aspect | Numerai (Actual) | QUANTA (Proposed) | Valid Parallel? |
|--------|------------------|-------------------|-----------------|
| Submission format | ML predictions | Portfolio weights | Different |
| Scoring metric | Corr + MMC | Sortino + Calmar | Different |
| Resolution period | 20 days | 7/30/90 days | Similar |
| Stake mechanism | NMR stake | α-token ante | Similar |
| Payout cap | ±5% per round | Power-law | Different |
| Feed mechanism | Meta-model | Signal Pool | Similar concept |

**Questions to answer:**
- [ ] Is portfolio submission as effective as ML predictions?
- [ ] Does risk-adjusted scoring generate comparable signal quality?
- [ ] Is power-law distribution as effective as capped payouts?
- [ ] What made Numerai successful that QUANTA must replicate?

---

### 2. Numerai Tournament Economics Validation

**Claimed economics:**
```
Payout formula: stake × clip(payout_factor × (corr × 0.5 + mmc × 2), -0.05, +0.05)
```

**Validation questions:**
- [ ] What is the actual average participant ROI?
- [ ] What skill level is required for positive expectation?
- [ ] What's the distribution of returns across participants?
- [ ] How many participants are consistently profitable?

**Numerai participant data to find:**
- Average stake per participant
- Median return over 12 months
- Attrition rate
- Top performer characteristics

**QUANTA implications:**
- [ ] Does QUANTA's EV math align with Numerai's demonstrated economics?
- [ ] Is QUANTA's power-law more or less attractive than Numerai's caps?

---

### 3. Taoshi SN8 Precedent Validation

**Claims made about Taoshi:**

| Claim | Source | Verification Status |
|-------|--------|---------------------|
| Plagiarism detection with blacklisting | Audit research | Verify |
| 10% max drawdown threshold | Audit research | Verify |
| 60-day challenge period | Audit research | Verify |
| Top 75th percentile qualification | Audit research | Verify |
| Probationary system | Audit research | Verify |

**Verification tasks:**
- [ ] Review Taoshi documentation for mechanism details
- [ ] Check actual enforcement of anti-gaming measures
- [ ] Verify challenge period effectiveness
- [ ] Assess current miner count and quality

**Bittensor-specific learnings:**

| Taoshi Mechanism | Effectiveness | QUANTA Adoption |
|------------------|---------------|-----------------|
| Plagiarism detection | ? | Similar proposed |
| Drawdown limits | ? | 10% threshold adopted |
| Challenge period | ? | Not explicitly mentioned |
| Probationary system | ? | Progression system similar |

**Questions to answer:**
- [ ] What anti-gaming measures have proven effective on Taoshi?
- [ ] What attacks has Taoshi experienced?
- [ ] How does Taoshi handle the 256 UID limit?
- [ ] What can QUANTA learn from Taoshi's operational experience?

---

### 4. Polymarket Precedent Validation

**Claims made about Polymarket:**

| Claim | Source | Verification Status |
|-------|--------|---------------------|
| $1.4M CFTC settlement 2022 | Audit research | Verify |
| Amended DCM designation obtained | Audit research | Verify |
| Kalshi v. CFTC favorable precedent | Audit research | Verify |

**Relevance to QUANTA:**
- Prediction market vs. signal competition (different)
- CFTC regulatory treatment (relevant)
- Market-based aggregation (concept parallel)

**Questions to answer:**
- [ ] Is QUANTA more like Polymarket or Numerai from regulatory perspective?
- [ ] Does Polymarket's DCM path apply to QUANTA?
- [ ] What regulatory lessons apply?

---

### 5. Academic Research Precedent Validation

**Claims requiring academic support:**

**Claim: Power-law distribution optimal for heavy-tailed noise**
```
Source: Audit research cites "Journal of Labor Economics"
Claim: "For heavy-tailed noise distributions, extreme prize sharing is optimal"
```

- [ ] Find and verify the specific paper
- [ ] Confirm claim interpretation is correct
- [ ] Assess applicability to portfolio signals

**Claim: Sharpe and Sortino highly correlated (r > 0.95)**
```
Source: Audit research cites "CAIA research"
```

- [ ] Verify the correlation claim
- [ ] Assess whether this undermines Sortino preference

**Claim: 30% of quant funds attribute 20%+ alpha to alt data**
```
Source: Audit research cites "Greenwich Associates"
```

- [ ] Verify the statistic
- [ ] Assess relevance to QUANTA's value proposition

**Academic literature to verify:**
- [ ] Tournament prize structure theory (Lazear & Rosen, 1981)
- [ ] Crowdsourced prediction aggregation
- [ ] Risk-adjusted performance measurement
- [ ] Alternative data alpha generation

---

### 6. Traditional Quant Fund Precedent

**Relevant precedents:**

| Fund/Firm | Model | Relevance to QUANTA |
|-----------|-------|---------------------|
| Renaissance | Systematic trading | Scale of alpha possible |
| Two Sigma | Data-driven | Alt data validation |
| Citadel | Multi-strategy | Tournament talent sourcing |
| AQR | Factor investing | Risk-adjusted metrics |

**Key questions:**
- [ ] What makes traditional quant funds successful?
- [ ] How do they source and validate signals?
- [ ] What's the typical signal-to-noise ratio?
- [ ] How do they compensate signal providers?

---

### 7. Precedent Gap Analysis

**Novel assumptions without precedent:**

| QUANTA Assumption | Precedent Support | Risk Level |
|-------------------|-------------------|------------|
| Portfolio-only can generate alpha | Partial (traditional funds) | Medium |
| Signal Pool aggregation at scale | None direct | High |
| Bittensor + equity signals | None | High |
| Multi-horizon risk-adjusted scoring | Partial (traditional) | Medium |
| Token-based ante system | Numerai (similar) | Low |
| Validator consensus on scoring | Taoshi (similar) | Medium |

**Questions to answer:**
- [ ] Which assumptions are most novel (highest risk)?
- [ ] How can novel assumptions be validated pre-launch?
- [ ] What pilots or tests could de-risk novel elements?

---

### 8. Failure Case Precedents

**Failed projects to learn from:**

**Quantopian (2020 shutdown):**
```
What happened: Crowdsourced algo platform, shut down after 9 years
Reasons: 
- Couldn't monetize community effectively
- Algorithms didn't scale to institutional
- Regulatory challenges with fund operation

QUANTA lessons:
- [ ] How does QUANTA avoid Quantopian's fate?
- [ ] Is the monetization model different?
- [ ] Is signal quality sufficient for institutions?
```

**Cryptoquant tournaments:**
```
Various crypto prediction tournaments have failed
Common issues:
- Gaming/manipulation
- Insufficient liquidity
- Poor signal quality

QUANTA lessons:
- [ ] Are anti-gaming measures sufficient?
- [ ] Is equity market different enough?
```

---

### 9. Precedent Alignment Scorecard

| Category | Precedent Alignment | Confidence |
|----------|---------------------|------------|
| Tournament mechanics | High (Numerai) | High |
| Bittensor integration | Medium (Taoshi) | Medium |
| Regulatory path | Medium (Numerai/Polymarket) | Medium |
| Signal quality claims | Low (unproven) | Low |
| Tokenomics | Medium (dTAO documented) | Medium |
| Market opportunity | Medium (alt data stats) | Medium |

---

### 10. Precedent-Based Recommendations

**Strongly supported by precedent:**
- Tournament stake mechanism (Numerai)
- Anti-gaming measures (Taoshi)
- Skill-based participation model

**Weakly supported - need validation:**
- Portfolio format effectiveness
- Signal Pool aggregation quality
- Institutional demand at projected levels

**No precedent - highest risk:**
- Bittensor equity signal subnet
- Specific scoring formula effectiveness
- Multi-horizon weighting scheme

---

## Quantitative Assessment Rubric

| Criterion | Weight | Score Range |
|-----------|--------|-------------|
| Claim accuracy | 25% | 1-10 |
| Precedent relevance | 25% | 1-10 |
| Gap identification | 20% | 1-10 |
| Failure learning | 15% | 1-10 |
| Novel risk assessment | 15% | 1-10 |

---

## Output Requirements

1. **Claim verification table** with source confirmation
2. **Precedent alignment matrix** showing parallels and gaps
3. **Novel assumption list** with risk ratings
4. **Failure case lessons** applicable to QUANTA
5. **Recommendations** for validating unproven assumptions
6. **Overall precedent support score** (1-10)

---

## Research Tasks

For each major claim, find:
1. Primary source (company announcement, research paper, regulatory filing)
2. Date of information
3. Context that might affect interpretation
4. Contradicting information if any

## References to Verify

- Numerai official blog/announcements
- Taoshi subnet documentation
- CFTC enforcement actions
- Academic papers cited
- Industry research reports (Greenwich, Burton-Taylor)
- Failed project post-mortems
