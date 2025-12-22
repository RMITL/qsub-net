# Agent 01: Mathematical Validity Review

## Purpose
Validate all mathematical formulas, scoring algorithms, and quantitative claims in the QUANTA documentation. Identify errors, unjustified parameters, and edge cases.

---

## Evaluation Scope

This agent examines:
1. Composite QUANTA Score formula
2. Risk-adjusted metric calculations (Sortino, Calmar, Drawdown, Turnover)
3. Power-law reward distribution
4. Normalization and transformation functions
5. Statistical validation methodology
6. Yuma Consensus mathematical implementation

---

## Detailed Evaluation Criteria

### 1. QUANTA Score Formula Validation

**Formula under review:**
```
QS = Σₜ wₜ × [0.35×Sortino(t) + 0.25×Calmar(t) + 0.25×DD_Score(t) + 0.15×Turnover_Score(t)]
```

**Horizon weights:**
- 7-day: 0.30
- 30-day: 0.45
- 90-day: 0.25

**Questions to answer:**
- [ ] Do metric weights within each horizon sum to 1.0? (0.35 + 0.25 + 0.25 + 0.15 = 1.0 ✓)
- [ ] Do horizon weights sum to 1.0? (0.30 + 0.45 + 0.25 = 1.0 ✓)
- [ ] Are these specific weight values empirically justified or arbitrary?
- [ ] What is the sensitivity of rankings to weight changes?
- [ ] Are there academic or industry precedents for this weighting scheme?
- [ ] What happens when one horizon has insufficient data?

**Edge case analysis:**
- Portfolio with only 7 days of history
- Portfolio with extreme but short-lived drawdown
- Portfolio with zero turnover for extended periods
- Two portfolios with identical scores (tie-breaking)

---

### 2. Sortino Ratio Validation

**Formula under review:**
```
Sortino = (R_p - MAR) / σ_d
where σ_d = √[Σ min(R_i - MAR, 0)² / n]
```

**Implementation from prototype:**
```python
def _downside_deviation(self, returns: np.ndarray) -> float:
    excess_returns = returns - self.daily_rf
    negative_returns = excess_returns[excess_returns < 0]
    if len(negative_returns) == 0:
        return 0.0001  # Avoid division by zero
    downside_var = np.mean(negative_returns ** 2)
    return np.sqrt(downside_var) * np.sqrt(self.trading_days)
```

**Questions to answer:**
- [ ] Is the MAR (Minimum Acceptable Return) correctly set to risk-free rate?
- [ ] Is the downside deviation formula mathematically correct?
- [ ] Is the annualization factor (√252) correctly applied?
- [ ] Is 0.0001 an appropriate floor value? What does this imply for scores?
- [ ] What happens with all-positive return periods?
- [ ] Is using daily risk-free rate for threshold appropriate?

**Mathematical verification:**
- Derive expected Sortino for a portfolio with 10% annual return, 5% risk-free, 8% downside deviation
- Verify the normalization transformation maintains monotonicity

---

### 3. Calmar Ratio Validation

**Formula under review:**
```
Calmar = Annualized Return / Max Drawdown
```

**Implementation from prototype:**
```python
def _calmar_ratio(self, annualized_return: float, max_drawdown: float) -> float:
    if max_drawdown < 0.0001:
        return 10.0  # Cap for extremely low drawdown
    return annualized_return / max_drawdown
```

**Questions to answer:**
- [ ] Is the annualization of returns correct for each horizon?
- [ ] What's the appropriate lookback for max drawdown calculation?
- [ ] Is capping at 10.0 appropriate? What percentile does this represent?
- [ ] How does this handle negative returns with low drawdown?
- [ ] Is max drawdown calculated peak-to-trough or peak-to-current?

**Mathematical verification:**
- Calculate expected Calmar for 15% annual return with 8% max drawdown
- Verify behavior at boundary conditions

---

### 4. Max Drawdown Score Validation

**Formula under review:**
```
DD_Score = 1 - (MaxDD / DD_threshold)
where DD_threshold = 0.10 (10%)
```

**Questions to answer:**
- [ ] Is 10% an appropriate threshold? What's the justification?
- [ ] What happens when MaxDD > 10%? (Score goes negative?)
- [ ] Is clamping to [0, 1] implemented?
- [ ] How does this interact with Calmar ratio (both use MaxDD)?
- [ ] Should severe drawdowns be penalized more than linearly?

**Edge case analysis:**
- Portfolio with 15% drawdown: Score = 1 - 1.5 = -0.5 → clamped to 0?
- Portfolio with 0% drawdown: Score = 1.0

---

### 5. Turnover Score Validation

**Formula under review:**
```
Turnover_Score = 1 - (Turnover / Turnover_max)
where Turnover_max = 1.0 (100% per week)
```

**Turnover calculation:**
```python
def _calculate_turnover(self, current: Dict, previous: Dict) -> float:
    total_change = sum(abs(current.get(t, 0) - previous.get(t, 0)) for t in all_tickers)
    return total_change / 2  # Divide by 2 to avoid double counting
```

**Questions to answer:**
- [ ] Is 100% weekly turnover an appropriate maximum?
- [ ] Is the double-counting correction correct?
- [ ] How is turnover measured across different time horizons?
- [ ] What's the interaction between turnover penalty and rebalancing necessity?
- [ ] Should turnover be penalized more aggressively (non-linear)?

---

### 6. Normalization Functions Validation

**Sortino normalization:**
```python
def _normalize_sortino(self, sortino: float) -> float:
    return 1 / (1 + np.exp(-0.5 * (sortino - 1)))
```

**Calmar normalization:**
```python
def _normalize_calmar(self, calmar: float) -> float:
    return 1 / (1 + np.exp(-0.3 * (calmar - 1)))
```

**Questions to answer:**
- [ ] What are the effective input/output ranges for each function?
- [ ] Why different coefficients (0.5 vs 0.3)?
- [ ] Is the inflection point at 1.0 appropriate for both metrics?
- [ ] Do these transformations preserve ranking order (monotonicity)?
- [ ] What percentile of scores map to 0.5?

**Mathematical verification:**
Create mapping table:
| Input Sortino | Normalized Output |
|--------------|-------------------|
| -2.0 | ? |
| 0.0 | ? |
| 1.0 | 0.5 |
| 2.0 | ? |
| 4.0 | ? |

---

### 7. Power-Law Reward Distribution Validation

**Formula under review:**
```
Reward_i = R_total × (rank_i)^(-γ) / Σⱼ (rank_j)^(-γ)
where γ = 1.5
```

**Questions to answer:**
- [ ] Is γ = 1.5 justified? What's the empirical basis?
- [ ] What percentage of rewards go to each decile?
- [ ] How does this compare to Numerai's reward distribution?
- [ ] Is there academic support for this exponent in tournament settings?
- [ ] What's the Gini coefficient of this distribution?

**Distribution modeling (for 100 participants):**
| Rank Range | % of Total Rewards |
|------------|-------------------|
| 1-10 | ? |
| 11-25 | ? |
| 26-50 | ? |
| 51-75 | ? |
| 76-100 | ? |

**Sensitivity analysis:**
- γ = 1.0: More egalitarian
- γ = 1.5: Current
- γ = 2.0: More winner-take-all

---

### 8. Bootstrap Validation Methodology

**Parameters:**
- n_iterations: 1000
- confidence_level: 0.95

**Questions to answer:**
- [ ] Is 1000 iterations sufficient for stable confidence intervals?
- [ ] What's the expected width of confidence intervals?
- [ ] How does block bootstrapping (time series) compare to simple resampling?
- [ ] Should stratified sampling be used?
- [ ] What's the minimum sample size for valid bootstrap?

---

### 9. Yuma Consensus Mathematical Implementation

**Formula under review:**
```
W̄_j = argmax_w(Σ S_i × {W_ij ≥ w} ≥ κ)
where κ = 0.5
```

**Questions to answer:**
- [ ] Is the stake-weighted median correctly implemented?
- [ ] What happens at exactly κ = 0.5 (boundary condition)?
- [ ] Is the clipping mechanism mathematically sound?
- [ ] What's the minimum validator count for stable consensus?
- [ ] How does EMA bond mechanism affect weight dynamics?

---

## Quantitative Assessment Rubric

| Criterion | Weight | Score Range |
|-----------|--------|-------------|
| Formula correctness | 25% | 1-10 |
| Parameter justification | 20% | 1-10 |
| Edge case handling | 20% | 1-10 |
| Statistical validity | 20% | 1-10 |
| Precedent alignment | 15% | 1-10 |

---

## Output Requirements

1. **Verify or refute** each formula's mathematical correctness
2. **Calculate specific examples** to demonstrate formula behavior
3. **Identify parameter sensitivity** where choices significantly impact outcomes
4. **Flag unjustified parameters** with recommendations for validation
5. **Model the distribution** of rewards across participant rankings
6. **Provide confidence rating** for each mathematical component
7. **Overall mathematical rigor score** (1-10)

---

## References to Validate Against

- Sortino, Frank A. "Managing Downside Risk in Financial Markets"
- CAIA Association risk-adjusted return standards
- Numerai tournament mechanics documentation
- Bittensor Yuma Consensus specification
- Academic literature on tournament prize structures (Lazear & Rosen, 1981)
