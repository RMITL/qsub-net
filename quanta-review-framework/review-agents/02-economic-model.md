# Agent 02: Economic Model Review

## Purpose
Validate the tokenomic model, incentive structures, and economic sustainability claims. Model fund flows and identify equilibrium states.

---

## Evaluation Scope

This agent examines:
1. Sportsbook rake model viability
2. dTAO emission mechanics integration
3. Incentive alignment across participant types
4. Attack economics and profitability
5. Revenue sustainability projections
6. Token value dynamics

---

## Detailed Evaluation Criteria

### 1. Sportsbook Model Fund Flow Analysis

**Key parameters from documentation:**
| Parameter | Value | Source |
|-----------|-------|--------|
| Network rake | 8% | tokenomics config |
| Network fee | 2% | tokenomics config |
| Fee burn rate | 25% of fees | tokenomics config |
| Loser ante burn | 50% | tokenomics config |
| Top tier threshold | Top 15% | tokenomics config |
| Profitable threshold | Top 50% | tokenomics config |
| Break-even threshold | Next 20% | tokenomics config |
| Penalty band | Bottom 30% | tokenomics config |

**Model Exercise: 100 Miners, 100 α-token ante each**

Step-by-step fund flow:
```
Initial Pool:
- Total ante collected: 100 × 100 = 10,000 α

Step 1: Network Rake (8%)
- Rake: 10,000 × 0.08 = 800 α → Network treasury
- After-rake pool: 9,200 α

Step 2: Categorize by Performance
- Top tier (15%): 15 miners
- Profitable (35%): 35 miners  
- Break-even (20%): 20 miners
- Penalty band (30%): 30 miners

Step 3: Ante Forfeitures
- Penalty band ante: 30 × 100 = 3,000 α forfeited
- Burned (50%): 1,500 α → Deflationary
- Redistributed (50%): 1,500 α → Winner pool

Step 4: Break-Even Returns
- Break-even returns: 20 × 100 = 2,000 α returned

Step 5: Winner Pool Calculation
- After-rake pool: 9,200 α
- Less break-even returns: -2,000 α
- Plus redistributed: +1,500 α
- Winner pool: 8,700 α

Step 6: Distribution (Power-law, γ=1.5)
- To top tier (15 miners): ~60% of 8,700 = 5,220 α
- To profitable (35 miners): ~40% of 8,700 = 3,480 α
```

**Questions to answer:**
- [ ] Is the network profitable under this model? (800 α rake + 1,500 α burn = positive)
- [ ] What's the expected ROI for median performer?
- [ ] At what participation level does the model break?
- [ ] Is there adverse selection risk (only confident participants stay)?

---

### 2. Expected Value Analysis by Tier

**Calculate EV for each tier:**

| Tier | % of Participants | Ante | Expected Return | EV | Net ROI |
|------|------------------|------|-----------------|----|---------| 
| Top Tier (Rank 1-15) | 15% | 100 α | ? | ? | ? |
| Profitable (Rank 16-50) | 35% | 100 α | ? | ? | ? |
| Break-Even (Rank 51-70) | 20% | 100 α | 100 α | 0 | 0% |
| Penalty Band (Rank 71-100) | 30% | 100 α | 0 | -100 α | -100% |

**Questions to answer:**
- [ ] What skill percentile is required for positive expected value?
- [ ] Is the EV distribution sufficient to attract participants?
- [ ] How does this compare to Numerai's EV distribution?
- [ ] What's the "house edge" effectively being charged?

---

### 3. dTAO Emission Integration

**Emission split from Bittensor dTAO:**
- Subnet owners: 18%
- Miners: 41%
- Validators/stakers: 41%

**Questions to answer:**
- [ ] How do TAO emissions interact with α-token ante pools?
- [ ] Are emissions additive to the prize pool or separate?
- [ ] What's the emission rate in TAO terms?
- [ ] How does alpha token price affect emission value?
- [ ] What's the expected TAO/α exchange ratio at equilibrium?

**Alpha token pricing formula:**
```
price = TAO_reserve / alpha_reserve
```

- [ ] Model the AMM dynamics over first 6 months
- [ ] What happens during high volatility periods?
- [ ] Is there a death spiral risk if alpha price drops?

---

### 4. Validator Economics

**Validator costs:**
- Infrastructure: ~$200-500/month
- Stake requirement: 1000 stake-weight minimum
- Data costs: API subscriptions

**Validator revenue:**
- 41% of emissions (shared across validator set)
- Staking rewards from alpha appreciation

**Questions to answer:**
- [ ] At current TAO price, what's expected monthly validator revenue?
- [ ] How many validators is economically viable?
- [ ] Is there centralization pressure (fewer, larger validators)?
- [ ] What prevents validator cartel formation?

---

### 5. Pool Operator Economics

**Pool operator parameters:**
- Fee rate: 10-20% of member rewards
- No direct stake requirement (use UID from progression)

**Model: Pool with 50 signal generators**
```
Scenario: Pool ranks in top 25% overall
- Base reward (before pool fee): 200 α
- Pool operator fee (15%): 30 α
- Distributed to 50 members: 170 α / 50 = 3.4 α each
```

**Questions to answer:**
- [ ] At what scale is pool operation profitable?
- [ ] Do pool economics favor concentration (fewer, larger pools)?
- [ ] What prevents exploitative fee structures?
- [ ] Is there a coordination problem in pool formation?

---

### 6. Attack Economics

**Sybil Attack Profitability:**
```
Attack cost = N × (registration_fee + minimum_stake)
Attack revenue = probability(top_tier) × N × expected_reward
Profit = Attack revenue - Attack cost
```

- [ ] Calculate minimum stake to make Sybil unprofitable
- [ ] What if attacker has information advantage?
- [ ] How does stake duration affect attack economics?

**Validator Collusion Profitability:**
```
Collusion benefit = boosted_rewards - honest_rewards
Collusion cost = detection_probability × slash_penalty
```

- [ ] Model collusion payoff at various stake concentrations
- [ ] At what concentration does collusion become +EV?
- [ ] Are detection mechanisms economically sufficient?

**Gaming Strategy Profitability:**
```
High-variance strategy:
- P(top 10%) = 20% (vs. 10% for median strategy)
- P(penalty band) = 40% (vs. 30% for median strategy)
- EV = 0.20 × top_reward - 0.40 × ante
```

- [ ] Is high-variance gambling +EV under current parameters?
- [ ] Do drawdown limits effectively prevent this?

---

### 7. Revenue Stream Validation

**Claimed revenue streams:**

| Stream | Claimed TAM | QUANTA Projection | Validation Status |
|--------|-------------|-------------------|-------------------|
| Signal API | $6B+ | $2.5-125M | ? |
| Talent discovery | $2B+ recruitment | $50-175K/placement | ? |
| Strategy licensing | Factor market | 5-20 bps on AUM | ? |
| Performance fees | - | 20% of alpha | ? |

**Questions to answer:**
- [ ] What market penetration is implied by projections?
- [ ] What's the conversion path from leaderboard to API customer?
- [ ] How does pricing compare to existing alt-data providers?
- [ ] Is there evidence of institutional demand at these price points?

---

### 8. Long-Term Equilibrium Analysis

**Questions to answer:**
- [ ] What's the steady-state number of participants?
- [ ] Is there a skill threshold that creates a stable participant pool?
- [ ] How does the system behave under:
  - Bull market (high participation)?
  - Bear market (low participation)?
  - Stagnant market (high alpha competition)?
- [ ] Is there reflexivity between alpha quality and token price?

**Model scenarios:**
| Scenario | Participants | Ante Pool | Network Revenue | Sustainability |
|----------|--------------|-----------|-----------------|----------------|
| Launch (Month 1) | 50 | 5,000 α | 400 α | ? |
| Growth (Month 6) | 500 | 50,000 α | 4,000 α | ? |
| Mature (Month 18) | 2,000 | 200,000 α | 16,000 α | ? |
| Stress (Bear market) | 100 | 10,000 α | 800 α | ? |

---

### 9. Tokenomic Red Flags Checklist

- [ ] **Emission > Revenue**: Do emissions exceed sustainable reward funding?
- [ ] **Stake concentration**: Does model encourage whale dominance?
- [ ] **Death spiral risk**: Can low participation trigger collapse?
- [ ] **Inflation pressure**: Is there persistent sell pressure from emissions?
- [ ] **Value capture**: Does token capture value or leak to TAO?

---

## Quantitative Assessment Rubric

| Criterion | Weight | Score Range |
|-----------|--------|-------------|
| Fund flow coherence | 25% | 1-10 |
| Incentive alignment | 25% | 1-10 |
| Attack resistance | 20% | 1-10 |
| Revenue realism | 15% | 1-10 |
| Long-term sustainability | 15% | 1-10 |

---

## Output Requirements

1. **Complete fund flow model** for one epoch with specific numbers
2. **EV calculation** for each participant tier
3. **Attack profitability analysis** for major vectors
4. **Revenue projection validation** with market size basis
5. **Equilibrium state modeling** under various conditions
6. **Red flag identification** with severity ratings
7. **Overall economic design score** (1-10)

---

## References to Validate Against

- Numerai tournament economics and NMR tokenomics
- Bittensor dTAO documentation
- Academic literature on tournament design (Moldovanu & Sela, 2001)
- Prediction market economics (Hanson, 2003)
- Token engineering best practices (Token Engineering Commons)
