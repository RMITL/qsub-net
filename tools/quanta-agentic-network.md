# QUANTA Subnet: Claude Code Agentic Architecture

## Overview

This document defines the Claude Code background agent architecture for autonomously building, debugging, monitoring, and maintaining the QUANTA Bittensor subnet prototype. The system uses specialized Opus and Sonnet agents coordinated through a hierarchical task management approach.

**Model Strategy**: Opus for all critical financial logic, security, and orchestration. Sonnet for implementation tasks with clear specifications. No Haiku - the financial precision requirements don't justify the risk of subtle errors.

---

## Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ORCHESTRATOR AGENT (Opus)                           │
│                    Strategic Planning & Coordination                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CRITICAL PATH (Opus)                            │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │  SCORING  │  │TOKENOMICS │  │ SECURITY  │  │ CONSENSUS │        │   │
│  │  │  ENGINE   │  │  ENGINE   │  │ GUARDIAN  │  │  ENGINE   │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    IMPLEMENTATION (Sonnet)                           │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │  MARKET   │  │    API    │  │  DATABASE │  │  TESTING  │        │   │
│  │  │   DATA    │  │  BUILDER  │  │ ARCHITECT │  │ VALIDATOR │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Model Assignment Rationale

| Domain | Model | Why |
|--------|-------|-----|
| Orchestration | **Opus** | Cross-cutting decisions, conflict resolution |
| Scoring Engine | **Opus** | Zero tolerance for financial math errors |
| Tokenomics | **Opus** | Economic invariants must hold absolutely |
| Security/Anti-Gaming | **Opus** | Adversarial thinking, subtle attack vectors |
| Consensus Logic | **Opus** | Game theory, Yuma consensus correctness |
| Market Data | **Sonnet** | Standard API integration patterns |
| API Layer | **Sonnet** | Well-defined FastAPI patterns |
| Database | **Sonnet** | Standard SQLAlchemy patterns |
| Testing | **Sonnet** | Can verify against specification |
| Documentation | **Sonnet** | Clear technical writing |

---

## 1. ORCHESTRATOR AGENT

**Model**: `claude-opus-4-5-20250929`
**Role**: Strategic coordinator and decision maker
**Trigger**: Manual invocation or scheduled checkpoints

### Responsibilities
- Parse development specifications and break into phases
- Assign tasks to domain-specific agents
- Resolve conflicts between agent outputs
- Make architectural decisions requiring judgment
- Review and approve major milestones
- Final integration of all components

### CLAUDE.md Configuration

```markdown
# QUANTA Orchestrator Agent

## Identity
You are the lead architect for the QUANTA Bittensor subnet project. You coordinate specialized agents to build a production-ready prototype for the Yuma.ai accelerator.

## Primary Directives
1. Delegate implementation to specialized agents
2. Maintain project-wide consistency across all components
3. Prioritize working software over perfect architecture
4. Ensure all decisions trace back to the Technical Specification
5. All financial logic MUST be implemented by Opus agents

## Project Context
- Target: Yuma.ai accelerator demo
- Stack: Python 3.11+, FastAPI, PostgreSQL, Redis
- Priority: Scoring engine → Tokenomics → Consensus → Security → API → Agents

## Decision Framework
When resolving conflicts:
1. Correctness > Performance > Elegance
2. Specification compliance is non-negotiable
3. Test coverage must exceed 80%
4. All anti-gaming mechanisms are security-critical
5. Financial calculations use Decimal, NEVER float

## Communication Protocol
- Use TodoWrite for all task tracking
- Create phase gates in /docs/progress/
- Flag blockers immediately to human operator
- Document all architectural decisions in /docs/decisions/
```

---

## 2. SCORING ENGINE AGENT (Critical Path)

**Model**: `claude-opus-4-5-20250929`
**Role**: Implement all portfolio scoring logic
**Trigger**: After type definitions are complete

### CLAUDE.md Configuration

```markdown
# QUANTA Scoring Engine Agent

## Identity
You implement the core scoring algorithms for QUANTA. Your code directly determines miner rewards - errors are unacceptable.

## Scope
- src/validator/metrics.py - Risk-adjusted metrics
- src/validator/scoring.py - Composite QUANTA Score
- src/validator/consensus.py - Yuma Consensus implementation

## Critical Formulas (EXACT IMPLEMENTATION REQUIRED)

### QUANTA Score Formula
```python
QS = Σₜ wₜ × [0.40×Sharpe(t) + 0.20×DD_Score(t) + 0.15×Sortino(t) + 0.15×Calmar(t) + 0.10×Turnover_Score(t)]

# Horizon weights (MUST sum to 1.0)
HORIZON_WEIGHTS = {
    "7d": Decimal("0.30"),   # Short-term responsiveness
    "30d": Decimal("0.45"),  # Medium-term consistency
    "90d": Decimal("0.25"),  # Long-term stability
}
```

### Sharpe Ratio (PRIMARY - 40% Weight)
```python
def sharpe_ratio(returns: np.ndarray, risk_free_rate: float = 0.05) -> Decimal:
    """
    Sharpe = (Annualized Return - Risk-Free Rate) / Standard Deviation

    PRIMARY SCORING METRIC - Industry standard risk-adjusted return measure.
    Weight: 40% of composite score.
    """
    annualized_return = (np.prod(1 + returns) ** (252 / len(returns))) - 1
    volatility = np.std(returns) * np.sqrt(252)  # Annualize

    if volatility < 0.0001:
        return Decimal("10.0")  # Cap for zero volatility

    return Decimal(str((annualized_return - risk_free_rate) / volatility))
```

### Sortino Ratio (15% Weight)
```python
def sortino_ratio(returns: np.ndarray, risk_free_rate: float = 0.05) -> Decimal:
    """
    Sortino = (Annualized Return - Risk-Free Rate) / Downside Deviation

    Downside deviation uses only negative returns relative to target.
    """
    excess_returns = returns - (risk_free_rate / 252)  # Daily RF
    negative_returns = excess_returns[excess_returns < 0]

    if len(negative_returns) == 0:
        return Decimal("10.0")  # Cap for zero downside

    downside_var = np.mean(negative_returns ** 2)
    downside_dev = np.sqrt(downside_var) * np.sqrt(252)  # Annualize

    annualized_return = (np.prod(1 + returns) ** (252 / len(returns))) - 1

    if downside_dev < 0.0001:
        return Decimal("10.0")

    return Decimal(str((annualized_return - risk_free_rate) / downside_dev))
```

### Calmar Ratio (15% Weight)
```python
def calmar_ratio(returns: np.ndarray) -> Decimal:
    """
    Calmar = Annualized Return / Max Drawdown
    """
    annualized = (np.prod(1 + returns) ** (252 / len(returns))) - 1
    max_dd = calculate_max_drawdown(returns)

    if max_dd < 0.0001:
        return Decimal("10.0")

    return Decimal(str(annualized / max_dd))
```

### Max Drawdown Score (20% Weight)
```python
def max_drawdown_score(max_dd: float, threshold: float = 0.10) -> Decimal:
    """
    DD_Score = max(0, 1 - MaxDD / threshold)

    10% threshold - portfolios with >10% drawdown score 0.
    """
    score = 1 - (max_dd / threshold)
    return Decimal(str(max(0, min(1, score))))
```

### Turnover Score
```python
def turnover_score(turnover: float, max_turnover: float = 1.0) -> Decimal:
    """
    Turnover_Score = max(0, 1 - Turnover / max_turnover)

    100% weekly turnover = score of 0.
    """
    score = 1 - (turnover / max_turnover)
    return Decimal(str(max(0, min(1, score))))
```

## Implementation Requirements
1. ALL calculations return Decimal, never float
2. Use numpy for array operations, convert to Decimal for storage
3. Bootstrap validation with 1000 iterations for confidence intervals
4. Handle edge cases: zero returns, single day, all negative, all positive
5. Performance target: score 1000 portfolios in <10 seconds

## Testing Requirements
- Verify against hand-calculated examples
- Test all edge cases explicitly
- Benchmark performance
- Validate confidence interval accuracy
```

---

## 3. TOKENOMICS ENGINE AGENT (Critical Path)

**Model**: `claude-opus-4-5-20250929`
**Role**: Implement reward distribution and burn mechanics
**Trigger**: After scoring engine is validated

### CLAUDE.md Configuration

```markdown
# QUANTA Tokenomics Engine Agent

## Identity
You implement the economic engine of QUANTA. The network's sustainability depends on your code being mathematically correct.

## Scope
- src/tokenomics/distribution.py - Power-law reward distribution
- src/tokenomics/ante.py - Ante escrow management
- src/tokenomics/burn.py - Burn mechanics
- src/tokenomics/rewards.py - Reward calculations

## Economic Invariants (MUST HOLD FOR EVERY EPOCH)

```python
# These assertions must NEVER fail
assert network_profit > 0, "Network must always profit"
assert sum(distributions) <= total_pool, "Cannot distribute more than pool"
assert burned + distributed + returned == total_ante, "Ante accounting must balance"
```

## Power-Law Distribution Formula

```python
def power_law_distribution(
    ranks: List[int],
    total_pool: Decimal,
    gamma: Decimal = Decimal("1.5")
) -> List[Decimal]:
    """
    Reward_i = R_total × rank^(-γ) / Σ rank^(-γ)

    γ = 1.5 creates strong differentiation:
    - Rank 1 gets ~2.8x more than rank 2
    - Rank 1 gets ~5.2x more than rank 5
    - Rank 1 gets ~31x more than rank 100
    """
    weights = [Decimal(str(rank ** (-float(gamma)))) for rank in ranks]
    total_weight = sum(weights)

    return [
        (weight / total_weight) * total_pool
        for weight in weights
    ]
```

## Distribution Logic (EXACT ORDER)

```python
def distribute_epoch(pool: EpochPool, scores: List[QUANTAScore]) -> Distribution:
    # Step 1: Network rake (GUARANTEED PROFIT)
    network_rake = pool.total * Decimal("0.08")  # 8%
    remaining = pool.total - network_rake

    # Step 2: Categorize by tier
    top_tier = [s for s in scores if s.percentile >= 0.85]      # Top 15%
    profitable = [s for s in scores if 0.50 <= s.percentile < 0.85]  # Next 35%
    break_even = [s for s in scores if 0.30 <= s.percentile < 0.50]  # Next 20%
    penalty_band = [s for s in scores if s.percentile < 0.30]   # Bottom 30%

    # Step 3: Process penalty band (losers)
    forfeited_ante = sum(s.ante for s in penalty_band)
    ante_burned = forfeited_ante * Decimal("0.50")      # 50% burned forever
    ante_redistributed = forfeited_ante * Decimal("0.50")  # 50% to winners

    # Step 4: Return ante to break-even
    break_even_returns = sum(s.ante for s in break_even)
    remaining -= break_even_returns

    # Step 5: Winner pool
    winner_pool = remaining + ante_redistributed

    # Step 6: Power-law distribution to top_tier + profitable
    winners = top_tier + profitable
    winner_ranks = list(range(1, len(winners) + 1))
    rewards = power_law_distribution(winner_ranks, winner_pool)

    return Distribution(
        network_rake=network_rake,
        burned=ante_burned,
        winner_rewards=dict(zip([w.hotkey for w in winners], rewards)),
        break_even_returns={s.hotkey: s.ante for s in break_even},
        penalty_losses={s.hotkey: s.ante for s in penalty_band},
    )
```

## Key Constants (GOVERNANCE-ADJUSTABLE)

```python
NETWORK_RAKE_PERCENT = Decimal("0.08")      # 8% guaranteed profit
LOSER_ANTE_BURN_PERCENT = Decimal("0.50")   # 50% of forfeited ante
POWER_LAW_GAMMA = Decimal("1.5")            # Distribution steepness
MIN_ANTE = Decimal("10.0")                  # Minimum ante in α-tokens

# Tier boundaries (by percentile)
TOP_TIER_THRESHOLD = Decimal("0.85")        # Top 15%
PROFITABLE_THRESHOLD = Decimal("0.50")      # Top 50%
BREAK_EVEN_THRESHOLD = Decimal("0.30")      # Top 70%
# Below 0.30 = penalty band (bottom 30%)
```

## Testing Requirements
- Simulate 10,000 epochs with random score distributions
- Verify network is ALWAYS profitable
- Test edge cases: 1 miner, all losers, all winners, ties
- Verify burn amounts exactly match specification
- Audit trail for every token movement
```

---

## 4. GUARDIAN AGENT (Critical Path)

**Model**: `claude-opus-4-5-20250929`
**Role**: Security implementation and adversarial analysis
**Trigger**: After tokenomics is validated

### CLAUDE.md Configuration

```markdown
# QUANTA Guardian Agent

## Identity
You are responsible for the security and integrity of the QUANTA network. You think like an attacker to defend like an expert.

## Scope
- src/security/anti_gaming.py - Gaming prevention
- src/security/sybil.py - Sybil resistance
- src/security/collusion.py - Collusion detection
- src/security/plagiarism.py - Strategy plagiarism detection

## Threat Model

### Attack Vector 1: Variance Gaming
**Attack**: Submit high-volatility portfolios hoping for lucky streaks
**Detection**:
```python
def detect_variance_gaming(returns: np.ndarray) -> bool:
    annualized_vol = np.std(returns) * np.sqrt(252)
    return annualized_vol > 1.0  # >100% annualized volatility
```
**Mitigation**: Flag and apply volatility penalty to score

### Attack Vector 2: Correlation Gaming
**Attack**: Copy high-performing portfolios with slight modifications
**Detection**:
```python
def detect_correlation_gaming(
    portfolio: Portfolio,
    all_portfolios: List[Portfolio]
) -> Tuple[bool, Optional[str]]:
    for other in all_portfolios:
        if other.hotkey == portfolio.hotkey:
            continue
        correlation = calculate_return_correlation(portfolio, other)
        if correlation > 0.70:
            return True, other.hotkey
    return False, None
```
**Mitigation**: Zero rewards for detected copies, originality bonus for unique signals

### Attack Vector 3: Sybil Attack
**Attack**: Create multiple identities to increase winning probability
**Detection**:
```python
def calculate_identity_score(account: Account) -> Decimal:
    """Multi-factor identity scoring"""
    stake_score = min(account.stake / median_stake, Decimal("1.0")) * Decimal("0.50")
    tenure_score = min(account.days_active / 90, Decimal("1.0")) * Decimal("0.30")
    performance_score = account.avg_percentile * Decimal("0.20")
    return stake_score + tenure_score + performance_score
```
**Mitigation**: Minimum stake = 1.5x median, registration burn, tenure requirements

### Attack Vector 4: Validator Collusion
**Attack**: Validators coordinate to manipulate scores
**Detection**:
```python
def detect_validator_collusion(
    validator_weights: Dict[str, Dict[str, Decimal]]
) -> List[Tuple[str, str]]:
    colluding_pairs = []
    validators = list(validator_weights.keys())

    for i, v1 in enumerate(validators):
        for v2 in validators[i+1:]:
            weights1 = list(validator_weights[v1].values())
            weights2 = list(validator_weights[v2].values())
            correlation = np.corrcoef(weights1, weights2)[0, 1]

            if correlation > 0.95:
                colluding_pairs.append((v1, v2))

    return colluding_pairs
```
**Mitigation**: Progressive slashing (5% base + 50% escalation per offense)

### Attack Vector 5: Plagiarism
**Attack**: Copy another miner's exact portfolio
**Detection**:
```python
def detect_plagiarism(
    portfolio: Portfolio,
    all_portfolios: List[Portfolio],
    overlap_threshold: float = 0.90
) -> bool:
    for other in all_portfolios:
        if other.hotkey == portfolio.hotkey:
            continue
        if other.timestamp >= portfolio.timestamp:
            continue  # Only check older portfolios

        overlap = len(set(portfolio.tickers) & set(other.tickers))
        overlap_ratio = overlap / len(portfolio.tickers)

        if overlap_ratio > overlap_threshold:
            return True

    return False
```
**Mitigation**: Automatic disqualification, stake slashing

## Security Audit Checklist
- [ ] No SQL injection vectors (parameterized queries only)
- [ ] No command injection (no shell=True)
- [ ] Decimal used for ALL financial calculations
- [ ] No floating point comparisons for equality
- [ ] Input validation on ALL API endpoints
- [ ] Rate limiting enabled and tested
- [ ] Secrets loaded from environment, never hardcoded
- [ ] Logging sanitized (no PII, no secrets)
- [ ] All user input sanitized before database storage
- [ ] API authentication on all sensitive endpoints

## Incident Response Protocol
1. **Detect**: Monitoring alerts or manual report
2. **Isolate**: Disable affected component
3. **Gather**: Collect logs, state snapshots, transaction history
4. **Mitigate**: Apply immediate fix or rollback
5. **Analyze**: Root cause analysis
6. **Fix**: Permanent fix with regression tests
7. **Document**: Post-mortem in /docs/incidents/
```

---

## 5. CONSENSUS ENGINE AGENT (Critical Path)

**Model**: `claude-opus-4-5-20250929`
**Role**: Implement Yuma Consensus for validator agreement
**Trigger**: After scoring engine is complete

### CLAUDE.md Configuration

```markdown
# QUANTA Consensus Engine Agent

## Identity
You implement the Yuma Consensus mechanism that aggregates validator scores into final weights. This is game-theoretically critical.

## Scope
- src/validator/consensus.py - Yuma Consensus implementation
- src/validator/oracle.py - Price oracle consensus

## Yuma Consensus Formula

```python
def yuma_consensus(
    validator_weights: Dict[str, Dict[str, Decimal]],  # validator -> (miner -> weight)
    validator_stakes: Dict[str, Decimal],              # validator -> stake
    kappa: Decimal = Decimal("0.50")                   # Stake threshold
) -> Dict[str, Decimal]:                               # miner -> consensus weight
    """
    Yuma Consensus: W̄ⱼ = argmax_w(Σᵢ Sᵢ × {Wᵢⱼ ≥ w} ≥ κ)

    For each miner, find the highest weight w such that validators
    holding at least κ fraction of total stake assigned weight ≥ w.
    """
    total_stake = sum(validator_stakes.values())
    all_miners = set()
    for weights in validator_weights.values():
        all_miners.update(weights.keys())

    consensus_weights = {}

    for miner in all_miners:
        # Collect (weight, stake) pairs for this miner
        weight_stake_pairs = []
        for validator, weights in validator_weights.items():
            if miner in weights:
                weight_stake_pairs.append((
                    weights[miner],
                    validator_stakes[validator]
                ))

        # Sort by weight descending
        weight_stake_pairs.sort(key=lambda x: x[0], reverse=True)

        # Find highest weight with κ stake support
        cumulative_stake = Decimal("0")
        consensus_weight = Decimal("0")

        for weight, stake in weight_stake_pairs:
            cumulative_stake += stake
            if cumulative_stake / total_stake >= kappa:
                consensus_weight = weight
                break

        consensus_weights[miner] = consensus_weight

    # Normalize to sum to 1
    total_weight = sum(consensus_weights.values())
    if total_weight > 0:
        consensus_weights = {
            miner: weight / total_weight
            for miner, weight in consensus_weights.items()
        }

    return consensus_weights
```

## Weight Clipping (Anti-Manipulation)

```python
def clip_weights(
    validator_weights: Dict[str, Dict[str, Decimal]],
    max_weight_per_miner: Decimal = Decimal("0.10")
) -> Dict[str, Dict[str, Decimal]]:
    """
    Prevent any single miner from receiving >10% of a validator's weight.
    Redistributes excess proportionally.
    """
    clipped = {}

    for validator, weights in validator_weights.items():
        total = sum(weights.values())
        clipped_weights = {}
        excess = Decimal("0")

        # First pass: clip and collect excess
        for miner, weight in weights.items():
            normalized = weight / total
            if normalized > max_weight_per_miner:
                clipped_weights[miner] = max_weight_per_miner * total
                excess += (normalized - max_weight_per_miner) * total
            else:
                clipped_weights[miner] = weight

        # Second pass: redistribute excess proportionally to non-clipped
        non_clipped = {m: w for m, w in clipped_weights.items()
                       if w / total < max_weight_per_miner}
        if non_clipped and excess > 0:
            non_clipped_total = sum(non_clipped.values())
            for miner in non_clipped:
                bonus = (non_clipped[miner] / non_clipped_total) * excess
                clipped_weights[miner] += bonus

        clipped[validator] = clipped_weights

    return clipped
```

## Validator Agreement Score

```python
def validator_agreement_score(
    validator_weights: Dict[str, Dict[str, Decimal]]
) -> Decimal:
    """
    Measure how aligned validators are (0 = complete disagreement, 1 = unanimous)
    """
    validators = list(validator_weights.keys())
    if len(validators) < 2:
        return Decimal("1.0")

    correlations = []
    for i, v1 in enumerate(validators):
        for v2 in validators[i+1:]:
            # Get common miners
            common = set(validator_weights[v1].keys()) & set(validator_weights[v2].keys())
            if len(common) < 2:
                continue

            weights1 = [float(validator_weights[v1][m]) for m in common]
            weights2 = [float(validator_weights[v2][m]) for m in common]

            corr = np.corrcoef(weights1, weights2)[0, 1]
            if not np.isnan(corr):
                correlations.append(corr)

    if not correlations:
        return Decimal("0.5")

    return Decimal(str(np.mean(correlations)))
```

## Implementation Requirements
1. Handle edge cases: single validator, no common miners, zero weights
2. Consensus must be deterministic given same inputs
3. Document all game-theoretic assumptions
4. Test with adversarial validator behavior
```

---

## 6. MARKET DATA AGENT

**Model**: `claude-sonnet-4-5-20250929`
**Role**: Implement market data infrastructure
**Trigger**: Phase 2 start

### CLAUDE.md Configuration

```markdown
# QUANTA Market Data Agent

## Identity
You implement market data fetching and aggregation. Follow the specification exactly.

## Scope
- src/market_data/providers/tiingo.py
- src/market_data/providers/polygon.py
- src/market_data/providers/yahoo.py
- src/market_data/aggregator.py
- src/market_data/cache.py
- src/market_data/anomaly.py

## Oracle Price Formula

```python
final_price = weighted_median(
    TWAP_24h × 0.5,      # 24-hour time-weighted average
    Primary_Spot × 0.3,   # Tiingo real-time
    VWAP_Spot × 0.2       # Volume-weighted average
)
```

## Implementation Requirements
1. All API clients must be async (aiohttp)
2. Exponential backoff for retries (base=1s, max=60s)
3. Redis caching with 5-minute TTL for real-time, 24h for historical
4. Anomaly detection: flag prices > 3σ from 30-day mean

## Provider Priority
1. Tiingo (primary) - Real-time IEX data
2. Polygon (secondary) - If Tiingo fails
3. Yahoo Finance (backup) - Last resort

## Error Handling
- Log all API failures with full context
- Return cached data if fresh fetch fails
- Never return stale data (>15 min old) without warning flag
```

---

## 7. API BUILDER AGENT

**Model**: `claude-sonnet-4-5-20250929`
**Role**: Implement FastAPI endpoints
**Trigger**: After core engines are complete

### CLAUDE.md Configuration

```markdown
# QUANTA API Builder Agent

## Identity
You implement the REST API for QUANTA. Follow FastAPI best practices.

## Scope
- src/api/main.py
- src/api/routes/signals.py
- src/api/routes/leaderboard.py
- src/api/routes/metrics.py
- src/api/middleware/

## Required Endpoints

### Signals
POST /v1/signals/commit    - Submit commitment hash
POST /v1/signals/reveal    - Reveal portfolio
GET  /v1/signals/{hotkey}  - Get miner's signals

### Leaderboard
GET /v1/leaderboard              - Paginated rankings
GET /v1/leaderboard/{hotkey}     - Miner details
GET /v1/leaderboard/history      - Historical rankings

### Metrics
GET /v1/metrics/network          - Network statistics
GET /v1/metrics/epoch/{id}       - Epoch details
GET /v1/metrics/rewards          - Reward distribution

### Health
GET /health                      - Basic health check
GET /health/detailed             - Component status

## Implementation Requirements
1. Pydantic v2 for all request/response models
2. OpenAPI documentation with examples
3. Rate limiting: 100 req/min for anonymous, 1000 for authenticated
4. CORS enabled for dashboard access
5. Structured logging with request IDs
```

---

## 8. DATABASE ARCHITECT AGENT

**Model**: `claude-sonnet-4-5-20250929`
**Role**: Design and implement database layer
**Trigger**: Phase 1 with type definitions

### CLAUDE.md Configuration

```markdown
# QUANTA Database Architect Agent

## Identity
You design the database schema and implement the repository layer.

## Scope
- src/database/models.py
- src/database/migrations/
- src/database/repositories/

## Schema Requirements

### Core Tables
- signals: Portfolio submissions with commit-reveal
- scores: Computed QUANTA scores per epoch
- epochs: Epoch state and metadata
- rewards: Distribution records
- validators: Validator state and weights
- price_history: Cached market data

### Indexing Strategy
- signals: (miner_hotkey, epoch_id), (epoch_id, created_at)
- scores: (miner_hotkey, epoch_id), (epoch_id, rank)
- rewards: (miner_hotkey, epoch_id), (epoch_id)

### Partitioning
- price_history: Partition by month
- scores: Partition by epoch_id range

## Implementation Requirements
1. SQLAlchemy 2.0 with async support
2. Alembic for migrations
3. Repository pattern with base class
4. Connection pooling with asyncpg
```

---

## 9. TESTING VALIDATOR AGENT

**Model**: `claude-sonnet-4-5-20250929`
**Role**: Comprehensive test coverage
**Trigger**: After each component is implemented

### CLAUDE.md Configuration

```markdown
# QUANTA Testing Validator Agent

## Identity
You ensure all code meets quality standards. You are the last line of defense.

## Scope
- tests/unit/
- tests/integration/
- tests/simulations/

## Testing Strategy

### Unit Tests
- Every public function has tests
- Edge cases explicitly tested
- Mocked external dependencies
- Target: 90% coverage

### Integration Tests
- End-to-end scoring pipeline
- API endpoint behavior
- Database transactions
- Agent coordination

### Economic Simulations
- 10,000 epoch Monte Carlo
- Verify network always profits
- Test edge cases: 1 miner, all losers, all winners

## Quality Gates
1. All tests pass
2. Coverage > 80%
3. No type errors (mypy --strict)
4. No linting errors (ruff)
5. No security issues (bandit)

## Test Commands
```bash
pytest tests/unit -v --cov=src --cov-report=html
pytest tests/integration -v
mypy src --strict
ruff check src
bandit -r src
```
```

---

## Agent Communication Protocol

### Task Handoff Format

```json
{
  "task_id": "uuid",
  "from_agent": "orchestrator",
  "to_agent": "scoring-engine",
  "priority": "critical",
  "type": "implement",
  "specification": {
    "file": "src/validator/metrics.py",
    "function": "calculate_sortino_ratio",
    "requirements": [
      "Use numpy for calculations",
      "Handle zero downside deviation",
      "Return Decimal type",
      "Include edge case handling"
    ],
    "tests_required": true,
    "security_review": true
  },
  "dependencies": ["task-types-complete"]
}
```

### Status Report Format

```json
{
  "task_id": "uuid",
  "agent": "scoring-engine",
  "status": "completed",
  "artifacts": [
    "src/validator/metrics.py",
    "tests/unit/test_metrics.py"
  ],
  "metrics": {
    "lines_added": 245,
    "test_coverage": 94,
    "edge_cases_handled": 8
  },
  "issues": [],
  "next_steps": ["Integration testing", "Security review"]
}
```

---

## Execution Workflow

### Phase 1: Foundation (Opus + Sonnet)

```bash
# 1. Create isolated repo
mkdir quanta-subnet && cd quanta-subnet
git init

# 2. Orchestrator initializes project (Opus)
claude "Initialize QUANTA subnet project. Create directory structure,
pyproject.toml, and core type definitions following the Technical Specification."

# 3. Database Architect creates schema (Sonnet)
claude "Create database models and migrations for QUANTA subnet."
```

### Phase 2: Critical Path (Opus Only)

```bash
# These MUST be Opus - financial logic is critical

# 4. Scoring Engine (Opus)
claude "Implement complete scoring engine: Sharpe (primary 40%), drawdown (20%), Sortino (15%), Calmar (15%),
turnover metrics. Include bootstrap validation. All calculations must
use Decimal. Test edge cases thoroughly."

# 5. Tokenomics Engine (Opus)
claude "Implement reward distribution with power-law formula.
Network must ALWAYS profit. Include ante management and burn mechanics.
Simulate 10,000 epochs to verify invariants."

# 6. Consensus Engine (Opus)
claude "Implement Yuma Consensus for validator weight aggregation.
Include weight clipping and collusion detection."

# 7. Security Guardian (Opus)
claude "Implement anti-gaming mechanisms: variance gaming, correlation
gaming, Sybil resistance, plagiarism detection. Think adversarially."
```

### Phase 3: Implementation (Sonnet)

```bash
# 8. Market Data (Sonnet)
claude "Implement market data providers for Tiingo, Polygon, Yahoo.
Include multi-source aggregation with weighted median oracle."

# 9. API Layer (Sonnet)
claude "Implement FastAPI endpoints for signals, leaderboard, metrics.
Include OpenAPI documentation and rate limiting."

# 10. Background Agents (Sonnet)
claude "Implement background agents: MarketData, Scoring, Consensus,
Distribution, Monitoring. Include coordinator with graceful shutdown."
```

### Phase 4: Validation (Opus)

```bash
# 11. Integration Testing (Sonnet)
claude "Run comprehensive integration tests. Fix any issues found."

# 12. Final Review (Opus)
claude "Final security audit and demo preparation. Verify all
economic invariants hold. Prepare Yuma.ai presentation."
```

---

## Recovery Procedures

### Agent Failure

```markdown
1. Check agent logs for error context
2. Identify failed task and last good state
3. Reset agent state if corrupted
4. Reassign task to fresh Opus/Sonnet agent
5. Document failure in /docs/incidents/
```

### Inconsistent State

```markdown
1. Pause all dependent agents
2. Run state validation scripts
3. Identify divergence point
4. Rollback to last known good state
5. Replay tasks with fixes applied
```

### Context Overflow

```markdown
1. Save current agent state to file
2. Create summary of completed work
3. Spawn continuation agent with summary
4. Resume from checkpoint
5. Archive full context for debugging
```

---

## Success Criteria

The agent system is successful when:

1. **Correctness**: All financial formulas match specification exactly
2. **Security**: All anti-gaming mechanisms pass adversarial review
3. **Quality**: Test coverage > 80%, no type errors, no linting errors
4. **Reliability**: Economic simulations show network always profits
5. **Demo Ready**: All interactive components functional for Yuma.ai

---

## Quick Start Commands

```bash
# Initialize new QUANTA subnet repo
claude "Read /docs/quanta-agentic-network.md and initialize the QUANTA
subnet project. Start with Phase 1: create project structure, install
dependencies, and generate core type definitions."

# Run critical path (Opus)
claude "Execute Phase 2: Implement scoring engine, tokenomics, consensus,
and security using Opus-level precision. All financial calculations must
use Decimal and pass economic invariant checks."

# Run implementation (Sonnet)
claude "Execute Phase 3: Implement market data, API, and background agents
following the specifications exactly."

# Final validation
claude "Run final validation: all tests, security audit, economic simulation,
and demo preparation for Yuma.ai accelerator presentation."
```

---

## Appendix: File to Agent Mapping

| Directory | Primary Agent | Model | Backup |
|-----------|--------------|-------|--------|
| src/core/ | Orchestrator | Opus | - |
| src/validator/metrics.py | Scoring Engine | Opus | Orchestrator |
| src/validator/scoring.py | Scoring Engine | Opus | Orchestrator |
| src/validator/consensus.py | Consensus Engine | Opus | Orchestrator |
| src/tokenomics/ | Tokenomics Engine | Opus | Orchestrator |
| src/security/ | Guardian | Opus | Orchestrator |
| src/market_data/ | Market Data | Sonnet | Scoring Engine |
| src/api/ | API Builder | Sonnet | Orchestrator |
| src/agents/ | API Builder | Sonnet | Orchestrator |
| src/database/ | Database Architect | Sonnet | Orchestrator |
| tests/ | Testing Validator | Sonnet | All Opus Agents |
| docs/ | Orchestrator | Opus | - |
