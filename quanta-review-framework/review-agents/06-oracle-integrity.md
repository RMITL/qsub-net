# Agent 06: Oracle & Data Integrity Review

## Purpose
Evaluate the reliability, security, and manipulation resistance of market data infrastructure. Assess oracle design against known attack vectors and data quality requirements.

---

## Evaluation Scope

This agent examines:
1. Data provider reliability and coverage
2. Multi-source aggregation methodology
3. Anomaly detection effectiveness
4. Price manipulation resistance
5. Data staleness and latency handling
6. Corporate action processing
7. Historical data integrity
8. Failure mode analysis

---

## Detailed Evaluation Criteria

### 1. Data Provider Analysis

**Provider hierarchy from documentation:**
| Provider | Role | Cost Tier | Coverage | Reliability |
|----------|------|-----------|----------|-------------|
| Tiingo | Primary | ~$30/mo retail, higher for commercial | US equities, ETFs | High |
| Polygon | Secondary | $29-199/mo | US equities, options | High |
| Yahoo Finance | Backup | Free | Global, delayed | Medium |

**Questions to answer:**
- [ ] What's the coverage overlap between providers?
- [ ] Are there tickers covered by only one provider?
- [ ] What's the historical uptime for each provider?
- [ ] What are the API rate limits?
- [ ] What's the latency from market to API?

**Coverage analysis required:**
```
For S&P 500 constituents:
- Tiingo coverage: ?%
- Polygon coverage: ?%
- Yahoo coverage: ?%
- All three: ?%

For Russell 2000 (small cap):
- Tiingo coverage: ?%
- Polygon coverage: ?%
- Yahoo coverage: ?%
- All three: ?%
```

---

### 2. Multi-Source Aggregation Methodology

**Current implementation:**
```python
final_price = weighted_median(
    TWAP_24h × 0.5,
    Primary_Source × 0.3,
    Volume_Weighted_Spot × 0.2
)
```

**Weighted median implementation:**
```python
def _weighted_median(self, values: List[Decimal], weights: List[Decimal]) -> Decimal:
    vals = np.array([float(v) for v in values])
    wts = np.array([float(w) for w in weights])
    sorted_indices = np.argsort(vals)
    sorted_vals = vals[sorted_indices]
    sorted_wts = wts[sorted_indices]
    cumsum = np.cumsum(sorted_wts)
    median_idx = np.searchsorted(cumsum, 0.5 * cumsum[-1])
    return Decimal(str(sorted_vals[median_idx]))
```

**Questions to answer:**
- [ ] Is weighted median the right aggregation method?
- [ ] Why these specific weights (0.5, 0.3, 0.2)?
- [ ] What happens when only 2 sources available?
- [ ] What happens when only 1 source available?
- [ ] Is TWAP calculation correctly implemented?

**TWAP calculation review:**
```python
async def _calculate_twap_24h(self, ticker: str) -> Optional[Decimal]:
    history = self._price_history.get(ticker, [])
    cutoff = datetime.utcnow() - timedelta(hours=24)
    recent_history = [p for p in history if p.timestamp >= cutoff]
    if len(recent_history) < 10:  # Minimum data points
        return None
    return sum(p.price for p in recent_history) / len(recent_history)
```

- [ ] Is 10 data points sufficient for reliable TWAP?
- [ ] Should TWAP be time-weighted or equal-weighted?
- [ ] How are gaps in price history handled?
- [ ] What's the sampling frequency for TWAP?

---

### 3. Anomaly Detection Assessment

**Current implementation:**
```python
class AnomalyDetector:
    def __init__(self, std_threshold: float = 3.0, min_volume_percent: float = 10.0):
        ...
```

**Detection methods to evaluate:**

**Statistical Anomaly (3σ threshold):**
- [ ] What's the lookback period for calculating σ?
- [ ] Is 3σ appropriate for equity prices?
- [ ] How are regime changes handled (earnings, news)?
- [ ] What's the expected false positive rate?
- [ ] What's the expected false negative rate?

**Volume Anomaly (10% threshold):**
- [ ] How is "normal" volume established?
- [ ] Is 10% of average volume too aggressive?
- [ ] How does this handle pre-market/after-hours?

**Questions to answer:**
- [ ] What happens when an anomaly is detected?
- [ ] Is there human escalation for anomalies?
- [ ] Are anomalies logged for post-analysis?
- [ ] Can anomaly thresholds be gamed?

---

### 4. Price Manipulation Resistance

**Attack vector: Low-liquidity stock manipulation**
```
Attack scenario:
1. Attacker includes low-liquidity stock in portfolio
2. Attacker trades underlying to move price
3. QUANTA oracle reflects manipulated price
4. Portfolio score improves artificially

Defense layers:
- TWAP (50% weight) dampens short-term manipulation
- Multi-source aggregation requires manipulating multiple feeds
- Volume anomaly detection flags unusual activity
```

**Questions to answer:**
- [ ] What's the minimum market cap for included stocks?
- [ ] What's the minimum daily volume requirement?
- [ ] How long must manipulation persist to affect TWAP?
- [ ] What's the cost to manipulate TWAP for 24 hours?

**Attack cost model:**
```
For $100M market cap stock:
- Price impact of 1% move: ~$1M trading
- Must sustain for 24h for TWAP effect
- Total cost: $1M + opportunity cost + detection risk

For $10B market cap stock:
- Price impact of 1% move: ~$100M trading
- Economically infeasible

Threshold analysis:
- At what market cap is manipulation economically viable?
- Should there be a market cap floor for eligible stocks?
```

---

### 5. Data Staleness and Latency

**Configuration parameters:**
```python
price_cache_ttl_seconds: int = 300  # 5 minutes
max_price_staleness_seconds: int = 900  # 15 minutes
```

**Staleness scenarios:**

| Scenario | Duration | Handling | Acceptable? |
|----------|----------|----------|-------------|
| API temporary outage | 5 min | Use cache | Yes |
| API extended outage | 30 min | Stale flag, fallback | Maybe |
| Market holiday | Full day | Use last close | Yes |
| Provider deprecation | Permanent | Switch provider | Plan needed |

**Questions to answer:**
- [ ] What's the acceptable staleness for scoring purposes?
- [ ] How does staleness interact with commit-reveal timing?
- [ ] Are weekend/holiday prices handled correctly?
- [ ] What's the latency from NYSE close to QUANTA price?

**Latency analysis:**
```
Critical path for end-of-day scoring:
16:00 ET - Market close
16:05 ET - Tiingo updates (assumed)
16:10 ET - QUANTA fetches prices
16:15 ET - Cache populated
16:20 ET - Scoring can begin

Questions:
- [ ] Is this timeline accurate?
- [ ] What if Tiingo is delayed?
- [ ] How are after-hours moves handled?
```

---

### 6. Corporate Action Processing

**Corporate actions that affect prices:**
| Action | Effect | Handling Required |
|--------|--------|-------------------|
| Stock split | Price divided | Adjust historical prices |
| Reverse split | Price multiplied | Adjust historical prices |
| Cash dividend | Price drops ex-div | May need adjustment |
| Stock dividend | Dilution | Adjust prices |
| Spin-off | New ticker created | Update portfolio mapping |
| Merger | Ticker changes | Handle ticker substitution |
| Delisting | No more quotes | Handle gracefully |

**Questions to answer:**
- [ ] Is corporate action processing implemented?
- [ ] How are split adjustments handled in TWAP?
- [ ] What happens when a portfolio stock is acquired?
- [ ] How are spin-offs reflected in holdings?
- [ ] Is there a dividend adjustment policy?

---

### 7. Historical Data Integrity

**Use cases for historical data:**
- 7/30/90-day performance calculation
- TWAP computation
- Anomaly detection baseline
- Bootstrap validation

**Data quality requirements:**
- [ ] Adjusted vs. unadjusted prices
- [ ] Point-in-time accuracy (no lookahead)
- [ ] Gap handling (missing days)
- [ ] Survivorship bias consideration

**Questions to answer:**
- [ ] Are historical prices split-adjusted?
- [ ] Are historical prices dividend-adjusted?
- [ ] What's the historical data retention period?
- [ ] How is data backfilled if missing?

---

### 8. Failure Mode Analysis

**Failure scenarios and responses:**

| Failure Mode | Detection | Response | Recovery |
|--------------|-----------|----------|----------|
| Tiingo API down | Connection timeout | Use Polygon/Yahoo | Auto-retry |
| All APIs down | No fresh prices | Flag staleness, halt scoring | Manual intervention |
| Database corruption | Consistency check | Restore from backup | Reprocess |
| Cache failure | Redis ping fails | Direct API calls | Restart Redis |
| Network partition | Validators disagree | Consensus delay | Wait for resolution |
| Bad data injected | Anomaly detection | Reject, alert | Investigate source |

**Questions to answer:**
- [ ] Is there comprehensive failure mode documentation?
- [ ] What's the maximum acceptable downtime?
- [ ] Are failure modes tested?
- [ ] Is there runbook for each failure type?

---

### 9. Oracle Security Audit Checklist

**Data Source Security:**
- [ ] API keys stored securely (not in code)
- [ ] HTTPS enforced for all API calls
- [ ] Rate limiting implemented to avoid bans
- [ ] Provider status monitoring
- [ ] Fallback chain tested

**Data Integrity:**
- [ ] Input validation on all price data
- [ ] Range checks (price > 0, reasonable magnitude)
- [ ] Timestamp validation (not in future)
- [ ] Source attribution maintained
- [ ] Audit trail for price decisions

**Aggregation Security:**
- [ ] Weighted median resistant to single-source manipulation
- [ ] Minimum source count enforced
- [ ] Anomaly detection before aggregation
- [ ] Result caching with integrity checks

---

### 10. Comparison to Industry Standards

**Chainlink price feed design:**
- Multiple independent node operators
- Aggregation via median
- Deviation threshold triggers (0.5-1%)
- Heartbeat updates (minimum frequency)

**QUANTA vs. Chainlink:**
| Feature | Chainlink | QUANTA | Assessment |
|---------|-----------|--------|------------|
| Data sources | 10+ nodes | 3 providers | Lower redundancy |
| Aggregation | Median | Weighted median | Similar |
| On-chain verification | Yes | No | Lower transparency |
| Economic security | Staking | None | Weaker guarantees |

**Questions to answer:**
- [ ] Should QUANTA consider Chainlink integration?
- [ ] Is centralized oracle acceptable for this use case?
- [ ] What's the trust assumption on oracle operators?

---

### 11. Recommendations Framework

**Immediate improvements (pre-launch):**
1. ?
2. ?
3. ?

**Short-term improvements (first 3 months):**
1. ?
2. ?
3. ?

**Long-term considerations:**
1. ?
2. ?
3. ?

---

## Quantitative Assessment Rubric

| Criterion | Weight | Score Range |
|-----------|--------|-------------|
| Data source reliability | 20% | 1-10 |
| Aggregation methodology | 20% | 1-10 |
| Manipulation resistance | 25% | 1-10 |
| Anomaly detection | 15% | 1-10 |
| Failure handling | 10% | 1-10 |
| Corporate action handling | 10% | 1-10 |

---

## Output Requirements

1. **Data provider coverage analysis** with gap identification
2. **Aggregation methodology critique** with alternatives
3. **Manipulation resistance assessment** with cost models
4. **Anomaly detection evaluation** with false positive/negative estimates
5. **Failure mode matrix** with recovery procedures
6. **Corporate action handling gaps**
7. **Comparison to industry best practices**
8. **Overall oracle integrity score** (1-10)

---

## References

- Chainlink Price Feed Design Documentation
- DeFi Oracle Manipulation Attack Database
- "Flash Boys 2.0" (Daian et al.) - MEV and oracle attacks
- SEC Market Data Infrastructure Rule (2020)
- Best Execution requirements for price data
