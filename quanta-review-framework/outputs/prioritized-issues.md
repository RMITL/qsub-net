# QUANTA Prioritized Issues List

## Summary Statistics

| Severity | Count | Resolution Required |
|----------|-------|---------------------|
| CRITICAL | 8 | Before accelerator application |
| HIGH | 10 | During accelerator program |
| MEDIUM | 9 | Post-accelerator / Phase 2 |
| LOW | 5 | Future enhancements |

---

## CRITICAL Issues (Blockers)

Issues that would prevent accelerator acceptance or indicate fundamental flaws.

| # | Issue | Source | Impact | Effort | Evidence |
|---|-------|--------|--------|--------|----------|
| C1 | **Test coverage ~2%** | 03, 09 | Cannot verify correctness; production blocker | 3-4 weeks | 2 test files for 96 source files |
| C2 | **Bittensor SDK integration missing** | 03, 09, 10 | Cannot deploy to network | 2-3 weeks | Protocol definitions exist, no integration |
| C3 | **Unrealistic 6-month timeline** | 10 | Investor credibility; execution failure risk | 1 week (documentation) | Realistic estimate: 18-24 months |
| C4 | **No budget specification** | 10 | Funding gap of $260K-$530K | 1 week (documentation) | Zero mention of dev costs, salaries, infra |
| C5 | **Team composition unspecified** | 10 | Execution risk; cannot assess capability | 1 week (documentation) | No mention of team size, roles, FTEs |
| C6 | **Performance tier inconsistency** | 02 | Fund flow calculations vary 20-30% | 2 days | Spec: 15%/50%/20%/30% vs Pitch: 10%/45%/25%/20% |
| C7 | **Power-law distribution stubbed** | 03 | Tokenomics incomplete; cannot distribute rewards | 2-3 days | `src/tokenomics/distribution.py` is stub |
| C8 | **10α minimum ante insufficient** | 02, 04 | Profitable Sybil attacks at 100-200 UIDs for $5K | 1 day config change | Acknowledged in spec as insufficient |

---

## HIGH Issues (Major Concerns)

Significant issues requiring resolution, but not immediate blockers.

| # | Issue | Source | Impact | Effort | Evidence |
|---|-------|--------|--------|--------|----------|
| H1 | **No legal opinion on Howey test** | 05, 10 | 40-50% securities risk; regulatory exposure | $25K-$50K, 4-6 weeks | Ante mechanism creates Howey commonality |
| H2 | **Low-cap oracle manipulation viable** | 04, 06 | $100K-$500K attack cost on $500M market cap | 1-2 days | MIN_MARKET_CAP should be $2B |
| H3 | **Validator economics unviable at launch** | 02, 10 | Centralization risk; ~$180/month vs $200-500 costs | 2 weeks | 41% emissions / 64 validators at 2.5% allocation |
| H4 | **API authentication missing** | 03, 09 | Security vulnerability; unauthorized access | 3-4 days | JWT auth not implemented |
| H5 | **Validator stake concentration allows attacks** | 04 | 20 validators can control >50% stake | 1 week | 5% stake cap means 20 needed for majority |
| H6 | **Correlation threshold gaming viable** | 04 | 15-20% noise preserves 85% alpha while avoiding detection | 3-5 days | Threshold at ρ=0.70 too high |
| H7 | **TWAP implementation is simple average** | 06 | Manipulation resistance claims false | 3-5 days | Spec shows `sum(prices)/count` not time-weighted |
| H8 | **Corporate action handling missing** | 06 | Historical returns inaccurate across splits/dividends | 1-2 weeks | API mentioned but no implementation |
| H9 | **Commit-reveal timing manipulation** | 04 | Adverse selection; only favorable signals revealed | 3-5 days | 6-48 hour window allows strategic timing |
| H10 | **Alternative data market claim misleading** | 02 | Investors may overestimate TAM by 10-100x | 1 day | $9.28B is entire market, not portfolio signals |

---

## MEDIUM Issues (Improvements Needed)

Should be addressed but won't prevent accelerator application.

| # | Issue | Source | Impact | Effort | Evidence |
|---|-------|--------|--------|--------|----------|
| M1 | **Horizon weights lack empirical justification** | 01 | Parameter selection appears arbitrary | 1 week | 30%/45%/25% differs from audit research ranges |
| M2 | **Power-law γ=1.5 parameter unjustified** | 01 | Reward concentration may be suboptimal | 3-5 days | No backtest comparison for γ ∈ {1.0-2.0} |
| M3 | **Break-even tier creates adverse selection** | 02 | Mediocre strategies camp in 51-75th percentile | 1 week | 25% guaranteed ante return regardless of quality |
| M4 | **Revenue projections lack conversion funnel** | 02 | No path from free leaderboard to paid API | 1 week | $2M-27M API revenue assumed |
| M5 | **No equilibrium analysis for participant churn** | 02 | Cannot predict steady-state pool size | 2 weeks | Monte Carlo simulation needed |
| M6 | **Monitoring & observability missing** | 09 | Blind spots in production | 1-2 weeks | No Prometheus, structured logging, tracing |
| M7 | **Database migrations empty** | 09 | Schema versioning missing | 1 week | `src/database/migrations/` exists but empty |
| M8 | **Signal Pool precedent risk** | 07, 08 | Novel architecture with unknown game theory | 6+ months testnet | No direct precedent exists |
| M9 | **EU/UK geo-blocking needed** | 05 | MiCA/FCA compliance unclear | 1 week | May require CASP authorization |

---

## LOW Issues (Enhancements)

Nice-to-haves and optimizations for later phases.

| # | Issue | Source | Impact | Effort | Evidence |
|---|-------|--------|--------|--------|----------|
| L1 | **Sigmoid slope parameters undocumented** | 01 | Inconsistent discrimination | 2 days | Sortino uses 0.5, Calmar uses 0.3 |
| L2 | **Bootstrap validation insufficient for 7d horizon** | 01 | 7-day scores may have false precision | 3 days | 1000 iterations with n=7 yields unreliable CIs |
| L3 | **Pool operator fee range too wide** | 02 | Price discovery inefficiency | 1 day | 10-20% range may race to bottom |
| L4 | **WebSocket support missing** | 03, 09 | No real-time updates | 3-4 days | REST polling only |
| L5 | **Duplicate miner implementations** | 09 | Code maintenance burden | 2-3 days | `src/miner/` and `src/house_miner/` overlap |

---

## Issue Resolution Matrix

### Pre-Application Checklist

| Issue | Status | Owner | Deadline |
|-------|--------|-------|----------|
| C1 Test coverage | Not Started | Engineering | Week 4 |
| C2 Bittensor integration | Not Started | Engineering | Week 6 |
| C3 Timeline revision | Not Started | Leadership | Week 1 |
| C4 Budget specification | Not Started | Finance | Week 1 |
| C5 Team specification | Not Started | Leadership | Week 1 |
| C6 Tier reconciliation | Not Started | Product | Week 1 |
| C7 Power-law implementation | Not Started | Engineering | Week 2 |
| C8 Ante minimum increase | Not Started | Product | Week 1 |

### Application Window Checklist

| Issue | Status | Owner | Deadline |
|-------|--------|-------|----------|
| H1 Legal opinion | Not Started | Legal | Week 8 |
| H2 Market cap floor | Not Started | Product | Week 2 |
| H3 Validator subsidies | Not Started | Finance | Week 4 |
| H4 API authentication | Not Started | Engineering | Week 3 |

---

## Impact vs. Effort Matrix

```
High Impact │  C1  C2  C3  C4  │  H1  H3
            │  C5  C6  C7  C8  │  H8
            ├──────────────────┼──────────────────
            │  H2  H4  H5  H6  │  M5  M8
Medium      │  H7  H9  H10     │  M1  M2  M6
Impact      ├──────────────────┼──────────────────
            │  M3  M4  M7  M9  │  L1  L2  L3
Low Impact  │                  │  L4  L5
            └──────────────────┴──────────────────
               Low Effort         High Effort
```

**Priority Quadrant:**
- **Do First** (High Impact, Low Effort): C6, C7, C8, H2, H4
- **Plan** (High Impact, High Effort): C1, C2, H1, H3
- **Delegate** (Low Impact, Low Effort): M3, M4, M7
- **Defer** (Low Impact, High Effort): L4, L5, M8

---

**Document Version:** Prioritized Issues v1.0
**Analysis Date:** 2025-12-11
**Total Issues:** 32
**Critical Blockers:** 8
