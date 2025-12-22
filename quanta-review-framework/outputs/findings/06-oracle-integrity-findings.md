# Oracle Integrity Review Findings

## Executive Summary

QUANTA's oracle architecture employs a multi-source aggregation strategy using weighted median of TWAP (50%), primary spot (30%), and VWAP (20%) from Tiingo, Polygon, and Yahoo Finance. While the conceptual design demonstrates manipulation resistance through time-averaging and redundancy, **significant gaps exist between specification and implementation reality**. The system scores **6.5/10** overall, with critical weaknesses in data source economic security, corporate action handling, and lack of on-chain verification.

## Evaluation Scope

This review evaluated:
- Data provider reliability, coverage overlap, and cost structure
- Multi-source aggregation methodology (weighted median implementation)
- Price manipulation resistance via cost-benefit analysis
- Anomaly detection effectiveness (3σ threshold, volume floors)
- Staleness handling (5-min cache, 15-min max staleness)
- Corporate action processing (splits, dividends, mergers)
- Failure modes and recovery procedures

## Findings

### Strengths

| Finding | Evidence | Confidence |
|---------|----------|------------|
| **TWAP-based manipulation resistance** | 50% weight on 24h TWAP makes flash-loan attacks economically infeasible for large-cap stocks ($10B+ market cap requires ~$75M attack cost for 5% deviation) | High |
| **Multi-source redundancy** | 3-tier fallback (Tiingo → Polygon → Yahoo) provides resilience against single-provider outages | High |
| **Weighted median aggregation** | Resistant to single outlier source (up to 50% weight manipulation), superior to simple mean | Medium |
| **Statistical anomaly detection** | 3σ threshold with 30-day rolling baseline catches extreme price deviations | Medium |
| **Explicit staleness thresholds** | 5-min cache TTL and 15-min max staleness prevent using outdated prices for scoring | High |

### Concerns

| Severity | Finding | Evidence | Impact | Recommendation |
|----------|---------|----------|--------|----------------|
| **CRITICAL** | **Low-cap stock manipulation viable** | No documented minimum market cap or volume floor for eligible stocks. A $100M market cap stock could be manipulated for ~$100K attack cost | Allows economically rational oracle attacks on signal scores | Implement minimum $500M market cap + $10M daily volume requirements |
| **CRITICAL** | **TWAP implementation incomplete** | Spec shows simple average, NOT time-weighted. True TWAP requires time-weighted calculation | TWAP manipulation resistance claims are false | Reimplement with proper time-weighting or rename to "24h average price" |
| **HIGH** | **No corporate action handling** | Documentation mentions APIs but no implementation. Stock splits, dividends cause discontinuous price series | Historical returns will be wildly inaccurate across corporate events | Implement split-adjustment pipeline before mainnet |
| **HIGH** | **Centralized oracle trust model** | Unlike Chainlink (10+ independent nodes), QUANTA relies on 3 commercial APIs | Single provider compromise can corrupt all validator scores | Add Chainlink price feeds as 4th source with 15% weight |
| **MEDIUM** | **Volume floor too low** | 10% of average volume threshold easily bypassed | False negatives allow low-volume manipulation | Increase to 30% volume floor during market hours |

## Manipulation Cost Analysis

| Market Cap | Price Move Cost (1%) | TWAP Impact | Feasibility |
|-----------|-----------------|-------------|-------------|
| **$100M** | ~$1.05M | 0.042% | **VIABLE** ✗ |
| **$1B** | ~$10.2M | 0.042% | **MARGINAL** |
| **$10B** | ~$100.5M | 0.042% | **INFEASIBLE** ✓ |
| **$50B+** | $500M+ | <0.01% | **IMPOSSIBLE** ✓ |

**Recommendation**: Set **minimum $500M market cap AND $10M average daily volume** for eligible stocks.

## Quantitative Assessment

| Criterion | Score (1-10) | Justification |
|-----------|--------------|---------------|
| Data source reliability | **7** | Tiingo/Polygon professional-grade, but Yahoo Finance backup is free-tier with unknown SLA |
| Aggregation methodology | **6** | Weighted median sound, but TWAP is actually simple average. Weights lack empirical justification |
| Manipulation resistance | **5** | Strong for large-cap ($10B+), vulnerable in $100M-$500M range |
| Anomaly detection | **6** | 3σ threshold is industry-standard, but no empirical validation. Volume floor too low |
| Failure handling | **7** | 3-tier fallback robust, staleness thresholds explicit, but no disaster recovery runbook |
| Corporate action handling | **3** | Mentioned but no implementation found. Critical gap for multi-month evaluation |

## Overall Rating: 6.5/10

## Key Recommendations (Priority Order)

### 1. [CRITICAL] Implement market cap + volume filters
- Minimum $500M market cap AND $10M average daily volume
- **Effort**: Low (1-2 days)

### 2. [CRITICAL] Fix TWAP calculation to be actually time-weighted
- Replace `sum(prices) / count` with proper time-weighted formula
- **Effort**: Medium (3-5 days)

### 3. [CRITICAL] Implement corporate action adjustment pipeline
- Integrate Polygon/Tiingo corporate action APIs
- **Effort**: High (1-2 weeks)

### 4. [HIGH] Add Chainlink price feeds as 4th oracle source
- Adds decentralized, economically secured oracle
- **Effort**: Medium (5-7 days)

### 5. [MEDIUM] Increase volume anomaly floor to 30%
- With time-of-day adjustment
- **Effort**: Low (1 day)

### 6. [MEDIUM] Conduct empirical anomaly detection validation
- Backtest 3σ threshold on 2020-2024 price data
- **Effort**: Medium (3-5 days)

### 7. [LOW] Create disaster recovery runbook
- Document procedures for all oracles down scenarios
- **Effort**: Low (2-3 days)

---

**Document Version:** Oracle Integrity Review v1.0
**Analysis Date:** 2025-12-11
**Overall Rating:** 6.5/10
