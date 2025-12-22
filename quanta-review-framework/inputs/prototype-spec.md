# QUANTA Bittensor Subnet Prototype: Claude Code Development Specification

## Executive Summary

Build a **production-ready prototype** of QUANTAâ€”a decentralized Bittensor subnet for continuously scoring and ranking equity portfolio signals. This prototype must demonstrate the complete system lifecycle: signal submission, market data ingestion, multi-horizon scoring, consensus aggregation, reward distribution, and anti-gaming mechanisms.

**Target Outcome**: A functional demonstration system suitable for Yuma.ai accelerator presentation that proves technical viability and economic sustainability.

---

## Architecture Overview

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                           QUANTA SUBNET ARCHITECTURE                        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                                             â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                â”‚
â”‚  â”‚   MINERS     â”‚â”€â”€â”€â”€â–¶â”‚  SIGNAL POOL â”‚â”€â”€â”€â”€â–¶â”‚  VALIDATORS  â”‚                â”‚
â”‚  â”‚  (Signals)   â”‚     â”‚  (Off-Chain) â”‚     â”‚  (Scoring)   â”‚                â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                â”‚
â”‚         â”‚                    â”‚                    â”‚                         â”‚
â”‚         â”‚                    â”‚                    â–¼                         â”‚
â”‚         â”‚                    â”‚           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                  â”‚
â”‚         â”‚                    â”‚           â”‚   CONSENSUS  â”‚                  â”‚
â”‚         â”‚                    â”‚           â”‚    ENGINE    â”‚                  â”‚
â”‚         â”‚                    â”‚           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                  â”‚
â”‚         â”‚                    â”‚                    â”‚                         â”‚
â”‚         â–¼                    â–¼                    â–¼                         â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”               â”‚
â”‚  â”‚              PAPER TRADING ENGINE (Core)                â”‚               â”‚
â”‚  â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”       â”‚               â”‚
â”‚  â”‚  â”‚ Tiingo  â”‚ â”‚ Polygon â”‚ â”‚ Yahoo   â”‚ â”‚ Cache   â”‚       â”‚               â”‚
â”‚  â”‚  â”‚  API    â”‚ â”‚   API   â”‚ â”‚ Backup  â”‚ â”‚ Layer   â”‚       â”‚               â”‚
â”‚  â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜       â”‚               â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜               â”‚
â”‚         â”‚                                                                   â”‚
â”‚         â–¼                                                                   â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”               â”‚
â”‚  â”‚                   REWARD DISTRIBUTION                    â”‚               â”‚
â”‚  â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”       â”‚               â”‚
â”‚  â”‚  â”‚ Power   â”‚ â”‚  Ante   â”‚ â”‚  Burn   â”‚ â”‚ Leaderboardâ”‚    â”‚               â”‚
â”‚  â”‚  â”‚  Law    â”‚ â”‚ Escrow  â”‚ â”‚ Engine  â”‚ â”‚  API    â”‚       â”‚               â”‚
â”‚  â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜       â”‚               â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜               â”‚
â”‚                                                                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Phase 1: Core Infrastructure

### 1.1 Project Structure

Create the following directory structure:

```
quanta-subnet/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ core/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ config.py              # Configuration management
â”‚   â”‚   â”œâ”€â”€ constants.py           # Protocol constants
â”‚   â”‚   â””â”€â”€ types.py               # Type definitions (Pydantic models)
â”‚   â”œâ”€â”€ miner/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ signal.py              # Signal submission logic
â”‚   â”‚   â”œâ”€â”€ portfolio.py           # Portfolio management
â”‚   â”‚   â”œâ”€â”€ commit_reveal.py       # Commit-reveal protocol
â”‚   â”‚   â””â”€â”€ api.py                 # Miner REST API
â”‚   â”œâ”€â”€ validator/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ scoring.py             # Scoring engine
â”‚   â”‚   â”œâ”€â”€ metrics.py             # Risk-adjusted metrics
â”‚   â”‚   â”œâ”€â”€ consensus.py           # Validator consensus
â”‚   â”‚   â”œâ”€â”€ oracle.py              # Price oracle logic
â”‚   â”‚   â””â”€â”€ api.py                 # Validator REST API
â”‚   â”œâ”€â”€ signal_pool/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ pool_manager.py        # Signal pool operations
â”‚   â”‚   â”œâ”€â”€ aggregator.py          # Signal aggregation
â”‚   â”‚   â””â”€â”€ progression.py         # Merit-based progression
â”‚   â”œâ”€â”€ market_data/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ providers/
â”‚   â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”‚   â”œâ”€â”€ tiingo.py          # Tiingo API client
â”‚   â”‚   â”‚   â”œâ”€â”€ polygon.py         # Polygon API client
â”‚   â”‚   â”‚   â””â”€â”€ yahoo.py           # Yahoo Finance backup
â”‚   â”‚   â”œâ”€â”€ aggregator.py          # Multi-source aggregation
â”‚   â”‚   â”œâ”€â”€ cache.py               # Redis caching layer
â”‚   â”‚   â””â”€â”€ anomaly.py             # Anomaly detection
â”‚   â”œâ”€â”€ tokenomics/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ rewards.py             # Reward calculations
â”‚   â”‚   â”œâ”€â”€ ante.py                # Ante management
â”‚   â”‚   â”œâ”€â”€ burn.py                # Burn mechanics
â”‚   â”‚   â””â”€â”€ distribution.py        # Power-law distribution
â”‚   â”œâ”€â”€ security/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ anti_gaming.py         # Gaming prevention
â”‚   â”‚   â”œâ”€â”€ sybil.py               # Sybil resistance
â”‚   â”‚   â”œâ”€â”€ collusion.py           # Collusion detection
â”‚   â”‚   â””â”€â”€ plagiarism.py          # Strategy plagiarism detection
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ main.py                # FastAPI application
â”‚   â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”‚   â”œâ”€â”€ signals.py         # Signal endpoints
â”‚   â”‚   â”‚   â”œâ”€â”€ leaderboard.py     # Leaderboard endpoints
â”‚   â”‚   â”‚   â”œâ”€â”€ metrics.py         # Performance metrics
â”‚   â”‚   â”‚   â””â”€â”€ admin.py           # Admin endpoints
â”‚   â”‚   â””â”€â”€ middleware/
â”‚   â”‚       â”œâ”€â”€ __init__.py
â”‚   â”‚       â”œâ”€â”€ auth.py            # Authentication
â”‚   â”‚       â””â”€â”€ rate_limit.py      # Rate limiting
â”‚   â”œâ”€â”€ database/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ models.py              # SQLAlchemy models
â”‚   â”‚   â”œâ”€â”€ migrations/
â”‚   â”‚   â””â”€â”€ repositories/
â”‚   â”‚       â”œâ”€â”€ __init__.py
â”‚   â”‚       â”œâ”€â”€ signals.py
â”‚   â”‚       â”œâ”€â”€ portfolios.py
â”‚   â”‚       â””â”€â”€ scores.py
â”‚   â””â”€â”€ utils/
â”‚       â”œâ”€â”€ __init__.py
â”‚       â”œâ”€â”€ crypto.py              # Cryptographic utilities
â”‚       â”œâ”€â”€ validation.py          # Input validation
â”‚       â””â”€â”€ logging.py             # Structured logging
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ unit/
â”‚   â”œâ”€â”€ integration/
â”‚   â””â”€â”€ e2e/
â”œâ”€â”€ scripts/
â”‚   â”œâ”€â”€ setup_db.py
â”‚   â”œâ”€â”€ seed_data.py
â”‚   â””â”€â”€ run_epoch.py
â”œâ”€â”€ docker/
â”‚   â”œâ”€â”€ Dockerfile
â”‚   â””â”€â”€ docker-compose.yml
â”œâ”€â”€ docs/
â”‚   â””â”€â”€ api/
â”œâ”€â”€ pyproject.toml
â”œâ”€â”€ requirements.txt
â””â”€â”€ README.md
```

### 1.2 Core Type Definitions

Create `src/core/types.py`:

```python
"""
QUANTA Core Type Definitions
Implements strict typing for all protocol messages and data structures.
"""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator, root_validator
import hashlib


class ParticipantRole(str, Enum):
    """Network participant roles."""
    SIGNAL_GENERATOR = "signal_generator"
    POOL_OPERATOR = "pool_operator"
    SOLO_MINER = "solo_miner"
    VALIDATOR = "validator"


class PortfolioTier(str, Enum):
    """Portfolio risk tier classification."""
    LOW_VOLATILITY = "low"
    MEDIUM_VOLATILITY = "medium"
    HIGH_VOLATILITY = "high"


class EpochPhase(str, Enum):
    """Epoch lifecycle phases."""
    SUBMISSION = "submission"
    COMMIT = "commit"
    REVEAL = "reveal"
    EVALUATION = "evaluation"
    CONSENSUS = "consensus"
    DISTRIBUTION = "distribution"


class PerformanceTier(str, Enum):
    """Miner performance classification."""
    TOP_TIER = "top_tier"          # Top 15% - Premium rewards
    PROFITABLE = "profitable"       # Top 50% - Positive ROI
    BREAK_EVEN = "break_even"       # Next 20% - Ante returned
    PENALTY_BAND = "penalty_band"   # Bottom 30% - Ante forfeited


# ============== PORTFOLIO SIGNAL MODELS ==============

class PortfolioPosition(BaseModel):
    """Individual position within a portfolio."""
    ticker: str = Field(..., min_length=1, max_length=10, regex=r'^[A-Z]{1,5}$')
    weight: Decimal = Field(..., ge=0, le=Decimal("0.20"))  # Max 20% per position
    
    @validator('ticker')
    def uppercase_ticker(cls, v):
        return v.upper()


class PortfolioSignal(BaseModel):
    """
    Complete portfolio signal submission.
    JSON payload of U.S. equity/ETF tickers with weights summing to 100%.
    """
    epoch_id: str = Field(..., regex=r'^\d{4}-Q[1-4]-W\d{1,2}$')
    miner_hotkey: str = Field(..., min_length=48, max_length=48)
    timestamp: datetime
    positions: List[PortfolioPosition] = Field(..., min_items=5, max_items=30)
    ante_amount: Decimal = Field(..., ge=Decimal("10.0"))  # Minimum 10 Î±-token
    ante_token: str = Field(default="ALPHA")
    commitment_hash: Optional[str] = None
    portfolio_hash: Optional[str] = None
    
    @root_validator
    def validate_weights(cls, values):
        positions = values.get('positions', [])
        total_weight = sum(p.weight for p in positions)
        if not (Decimal("0.999") <= total_weight <= Decimal("1.001")):
            raise ValueError(f"Weights must sum to 1.0, got {total_weight}")
        return values
    
    @root_validator
    def generate_hashes(cls, values):
        if values.get('positions') and not values.get('portfolio_hash'):
            # Generate portfolio hash for commit-reveal
            positions_str = '|'.join(
                f"{p.ticker}:{p.weight}" 
                for p in sorted(values['positions'], key=lambda x: x.ticker)
            )
            values['portfolio_hash'] = hashlib.sha256(
                positions_str.encode()
            ).hexdigest()
        return values
    
    def to_tickers_and_weights(self) -> tuple[List[str], List[float]]:
        """Extract tickers and weights for scoring engine."""
        tickers = [p.ticker for p in self.positions]
        weights = [float(p.weight) for p in self.positions]
        return tickers, weights


class CommitmentPayload(BaseModel):
    """Commit-reveal commitment structure."""
    commitment: str = Field(..., min_length=64, max_length=64)
    miner_hotkey: str
    epoch_id: str
    commit_block: int
    chain_id: int = Field(default=1)  # Bittensor mainnet
    expires_at: datetime


class RevealPayload(BaseModel):
    """Commit-reveal reveal structure."""
    commitment: str
    signal: PortfolioSignal
    secret: str = Field(..., min_length=32)
    reveal_block: int
    
    def verify_commitment(self) -> bool:
        """Verify reveal matches commitment."""
        components = (
            self.signal.portfolio_hash +
            self.secret +
            self.signal.miner_hotkey +
            str(self.signal.epoch_id)
        )
        computed = hashlib.keccak_256(components.encode()).hexdigest()
        return computed == self.commitment


# ============== SCORING MODELS ==============

class TimeHorizon(str, Enum):
    """Evaluation time horizons."""
    SHORT_7D = "7d"
    MEDIUM_30D = "30d"
    LONG_90D = "90d"


HORIZON_WEIGHTS = {
    TimeHorizon.SHORT_7D: Decimal("0.30"),
    TimeHorizon.MEDIUM_30D: Decimal("0.45"),
    TimeHorizon.LONG_90D: Decimal("0.25"),
}


class MetricWeights(BaseModel):
    """Scoring metric weights within each horizon."""
    sortino: Decimal = Field(default=Decimal("0.35"))
    calmar: Decimal = Field(default=Decimal("0.25"))
    max_drawdown: Decimal = Field(default=Decimal("0.25"))
    turnover: Decimal = Field(default=Decimal("0.15"))
    
    @root_validator
    def validate_sum(cls, values):
        total = sum(values.values())
        if not (Decimal("0.99") <= total <= Decimal("1.01")):
            raise ValueError("Metric weights must sum to 1.0")
        return values


class HorizonMetrics(BaseModel):
    """Performance metrics for a single time horizon."""
    horizon: TimeHorizon
    period_start: datetime
    period_end: datetime
    
    # Raw metrics
    total_return: Decimal
    annualized_return: Decimal
    volatility: Decimal
    downside_deviation: Decimal
    max_drawdown: Decimal
    max_drawdown_duration_days: int
    turnover: Decimal
    
    # Risk-adjusted metrics
    sharpe_ratio: Optional[Decimal] = None
    sortino_ratio: Decimal
    calmar_ratio: Decimal
    
    # Normalized scores [0, 1]
    sortino_score: Decimal = Field(ge=0, le=1)
    calmar_score: Decimal = Field(ge=0, le=1)
    drawdown_score: Decimal = Field(ge=0, le=1)
    turnover_score: Decimal = Field(ge=0, le=1)
    
    # Composite for this horizon
    horizon_score: Decimal = Field(ge=0, le=1)


class QUANTAScore(BaseModel):
    """
    Complete QUANTA Score for a miner's portfolio.
    
    Formula:
    QS = Î£â‚œ wâ‚œ Ã— [0.35Ã—Sortino(t) + 0.25Ã—Calmar(t) + 0.25Ã—DD_Score(t) + 0.15Ã—Turnover_Score(t)]
    """
    miner_hotkey: str
    epoch_id: str
    computed_at: datetime
    
    # Per-horizon metrics
    metrics_7d: Optional[HorizonMetrics] = None
    metrics_30d: Optional[HorizonMetrics] = None
    metrics_90d: Optional[HorizonMetrics] = None
    
    # Composite score
    composite_score: Decimal = Field(ge=0, le=1)
    
    # Ranking info
    rank: Optional[int] = None
    percentile: Optional[Decimal] = None
    performance_tier: Optional[PerformanceTier] = None
    
    # Validation
    confidence_interval_lower: Optional[Decimal] = None
    confidence_interval_upper: Optional[Decimal] = None
    bootstrap_iterations: int = 1000
    
    # Anti-gaming flags
    originality_score: Optional[Decimal] = None  # MMC-style
    variance_flag: bool = False  # High-variance gaming detection
    correlation_flag: bool = False  # Copy detection
    
    def is_eligible_for_rewards(self, median_score: Decimal, dd_threshold: Decimal = Decimal("0.10")) -> bool:
        """Check if miner meets emission eligibility criteria."""
        max_dd = max(
            self.metrics_7d.max_drawdown if self.metrics_7d else 0,
            self.metrics_30d.max_drawdown if self.metrics_30d else 0,
            self.metrics_90d.max_drawdown if self.metrics_90d else 0,
        )
        return self.composite_score > median_score and max_dd < dd_threshold


# ============== REWARD DISTRIBUTION MODELS ==============

class RewardAllocation(BaseModel):
    """Individual miner reward allocation."""
    miner_hotkey: str
    epoch_id: str
    rank: int
    performance_tier: PerformanceTier
    
    # Inputs
    ante_posted: Decimal
    composite_score: Decimal
    
    # Calculations
    power_law_weight: Decimal
    gross_reward: Decimal
    
    # Deductions
    network_fee: Decimal
    pool_operator_fee: Decimal = Decimal("0")  # Only for pooled miners
    
    # Final
    net_reward: Decimal
    roi_percent: Decimal
    
    # Ante disposition
    ante_returned: bool
    ante_burned: Decimal = Decimal("0")
    ante_redistributed: Decimal = Decimal("0")


class EpochRewardSummary(BaseModel):
    """Complete epoch reward distribution summary."""
    epoch_id: str
    computed_at: datetime
    
    # Pool totals
    total_ante_collected: Decimal
    network_rake: Decimal
    after_rake_pool: Decimal
    
    # Burn mechanics
    total_ante_forfeited: Decimal
    total_burned: Decimal
    total_redistributed: Decimal
    
    # Distribution
    total_distributed: Decimal
    
    # Tier breakdowns
    top_tier_total: Decimal
    top_tier_count: int
    profitable_tier_total: Decimal
    profitable_tier_count: int
    break_even_count: int
    penalty_band_count: int
    
    # Individual allocations
    allocations: List[RewardAllocation]


# ============== VALIDATOR CONSENSUS MODELS ==============

class ValidatorWeight(BaseModel):
    """Weight assignment from validator to miner."""
    validator_hotkey: str
    miner_hotkey: str
    epoch_id: str
    weight: Decimal = Field(ge=0, le=1)
    computed_at: datetime
    raw_score: Decimal
    
    # Data source verification
    price_sources: List[str]
    data_hash: str  # Hash of pricing data used


class ConsensusResult(BaseModel):
    """Yuma Consensus aggregated result for a miner."""
    miner_hotkey: str
    epoch_id: str
    
    # Raw validator inputs
    validator_weights: List[ValidatorWeight]
    
    # Consensus calculation
    # WÌ„â±¼ = argmax_w(Î£áµ¢ Sáµ¢ Ã— {Wáµ¢â±¼ â‰¥ w} â‰¥ Îº)
    consensus_weight: Decimal
    stake_weighted_median: Decimal
    
    # Clipping applied
    weights_before_clipping: Dict[str, Decimal]
    weights_after_clipping: Dict[str, Decimal]
    
    # Validation
    validator_agreement_score: Decimal  # How aligned validators were
    dispute_flagged: bool = False


# ============== SIGNAL POOL MODELS ==============

class SignalPoolMembership(BaseModel):
    """Signal generator's membership in a pool."""
    generator_hotkey: str
    pool_operator_hotkey: str
    joined_at: datetime
    fee_rate: Decimal = Field(ge=Decimal("0.10"), le=Decimal("0.20"))  # 10-20%
    
    # Track record
    signals_submitted: int = 0
    epochs_participated: int = 0
    avg_rank_percentile: Optional[Decimal] = None


class PoolOperatorProfile(BaseModel):
    """Pool operator metadata and performance."""
    operator_hotkey: str
    uid: int  # On-chain UID
    
    # Pool stats
    member_count: int
    total_stake_managed: Decimal
    
    # Performance
    pool_avg_score: Decimal
    pool_avg_rank: int
    
    # Economics
    fee_rate: Decimal
    total_fees_earned: Decimal
    
    # Reputation
    reputation_score: Decimal
    uptime_percent: Decimal


class ProgressionStatus(BaseModel):
    """Merit-based progression tracking."""
    participant_hotkey: str
    current_role: ParticipantRole
    
    # Track record
    days_active: int
    total_epochs: int
    avg_rank_percentile: Decimal
    
    # Progression requirements
    # Signal Generator â†’ Pool Operator: 60 days, top 30%
    # Pool Operator â†’ Solo Miner: 90 days, top 10%
    eligible_for_pool_operator: bool
    eligible_for_solo_miner: bool
    
    # UID status
    uid_assigned: Optional[int] = None
```

### 1.3 Configuration Management

Create `src/core/config.py`:

```python
"""
QUANTA Configuration Management
Environment-aware configuration with validation.
"""

from decimal import Decimal
from typing import Optional, List
from pydantic import BaseSettings, Field, validator
from enum import Enum


class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class MarketDataConfig(BaseSettings):
    """Market data provider configuration."""
    
    # Tiingo (Primary)
    tiingo_api_key: str = Field(..., env="TIINGO_API_KEY")
    tiingo_base_url: str = "https://api.tiingo.com"
    
    # Polygon (Secondary)
    polygon_api_key: Optional[str] = Field(None, env="POLYGON_API_KEY")
    polygon_base_url: str = "https://api.polygon.io"
    
    # Yahoo Finance (Backup - no key needed)
    yahoo_enabled: bool = True
    
    # Cache settings
    redis_url: str = Field("redis://localhost:6379", env="REDIS_URL")
    price_cache_ttl_seconds: int = 300  # 5 minutes
    historical_cache_ttl_seconds: int = 86400  # 24 hours
    
    # Data quality
    max_price_staleness_seconds: int = 900  # 15 minutes intraday
    anomaly_std_threshold: float = 3.0  # Flag prices > 3Ïƒ from mean
    min_volume_threshold_percent: float = 10.0  # vs 30-day avg


class ScoringConfig(BaseSettings):
    """Scoring engine configuration."""
    
    # Time horizons
    horizon_7d_weight: Decimal = Decimal("0.30")
    horizon_30d_weight: Decimal = Decimal("0.45")
    horizon_90d_weight: Decimal = Decimal("0.25")
    
    # Metric weights within horizons
    sortino_weight: Decimal = Decimal("0.35")
    calmar_weight: Decimal = Decimal("0.25")
    max_drawdown_weight: Decimal = Decimal("0.25")
    turnover_weight: Decimal = Decimal("0.15")
    
    # Thresholds
    max_drawdown_threshold: Decimal = Decimal("0.10")  # 10%
    max_turnover_per_week: Decimal = Decimal("1.0")  # 100%
    
    # Validation
    bootstrap_iterations: int = 1000
    confidence_level: Decimal = Decimal("0.95")
    
    # Anti-gaming
    originality_correlation_threshold: Decimal = Decimal("0.70")
    variance_ratio_threshold: Decimal = Decimal("3.0")


class TokenomicsConfig(BaseSettings):
    """Tokenomics and reward distribution."""
    
    # Network parameters
    network_rake_percent: Decimal = Decimal("0.08")  # 8%
    network_fee_percent: Decimal = Decimal("0.02")  # 2%
    network_fee_burn_percent: Decimal = Decimal("0.25")  # 25% of fee burned
    
    # Performance tiers
    top_tier_percent: Decimal = Decimal("0.15")
    profitable_tier_percent: Decimal = Decimal("0.50")
    break_even_percent: Decimal = Decimal("0.20")
    penalty_band_percent: Decimal = Decimal("0.30")
    
    # Ante mechanics
    minimum_ante: Decimal = Decimal("10.0")  # 10 Î±-token
    loser_ante_burn_percent: Decimal = Decimal("0.50")  # 50% burned
    
    # Reward distribution
    power_law_gamma: Decimal = Decimal("1.5")  # Zipfian exponent
    
    # Pool operators
    default_pool_fee_percent: Decimal = Decimal("0.15")  # 15%
    max_pool_fee_percent: Decimal = Decimal("0.20")  # 20%
    
    # Emissions (from Bittensor)
    miner_emission_share: Decimal = Decimal("0.41")
    validator_emission_share: Decimal = Decimal("0.41")
    owner_emission_share: Decimal = Decimal("0.18")


class ConsensusConfig(BaseSettings):
    """Validator consensus configuration."""
    
    # Yuma Consensus parameters
    kappa: Decimal = Decimal("0.50")  # Stake fraction threshold
    bond_ema_alpha: Decimal = Decimal("0.1")  # EMA smoothing
    
    # Commit-reveal
    commit_reveal_delay_hours: int = 14
    commitment_expiry_hours: int = 48
    
    # Dispute resolution
    dispute_supermajority: Decimal = Decimal("0.66")  # 66%
    dispute_bond_penalty: Decimal = Decimal("0.01")  # 1%
    
    # Collusion detection
    max_validator_stake_percent: Decimal = Decimal("0.05")  # 5%
    correlation_threshold: Decimal = Decimal("0.95")
    
    # Temporal randomization
    score_submission_window_minutes: int = 30


class SecurityConfig(BaseSettings):
    """Security and anti-gaming configuration."""
    
    # Sybil resistance
    min_stake_multiplier: Decimal = Decimal("1.5")  # k in S_min formula
    identity_stake_weight: Decimal = Decimal("0.50")
    identity_performance_weight: Decimal = Decimal("0.30")
    identity_tenure_weight: Decimal = Decimal("0.20")
    
    # Plagiarism detection
    ticker_overlap_threshold: Decimal = Decimal("0.90")  # 90%
    
    # Progressive slashing
    base_slash_penalty: Decimal = Decimal("0.05")  # 5%
    slash_escalation_factor: Decimal = Decimal("0.50")


class EpochConfig(BaseSettings):
    """Epoch lifecycle configuration."""
    
    # Timing (blocks)
    blocks_per_epoch: int = 360  # ~72 minutes on Bittensor
    submission_phase_blocks: int = 60
    evaluation_phase_blocks: int = 240
    distribution_phase_blocks: int = 60
    
    # Calendar
    daily_close_time: str = "16:00"  # 4 PM Eastern
    timezone: str = "America/New_York"


class QUANTAConfig(BaseSettings):
    """Master configuration aggregating all components."""
    
    environment: Environment = Environment.DEVELOPMENT
    debug: bool = False
    
    # Component configs
    market_data: MarketDataConfig = MarketDataConfig()
    scoring: ScoringConfig = ScoringConfig()
    tokenomics: TokenomicsConfig = TokenomicsConfig()
    consensus: ConsensusConfig = ConsensusConfig()
    security: SecurityConfig = SecurityConfig()
    epoch: EpochConfig = EpochConfig()
    
    # Database
    database_url: str = Field(..., env="DATABASE_URL")
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_workers: int = 4
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "json"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
```

---

## Phase 2: Market Data Infrastructure

### 2.1 Multi-Source Price Oracle

Create `src/market_data/aggregator.py`:

```python
"""
QUANTA Multi-Source Market Data Aggregator
Implements manipulation-resistant pricing with multi-source verification.

Oracle formula:
final_price = weighted_median(TWAP_24h Ã— 0.5, Primary_Source Ã— 0.3, Volume_Weighted_Spot Ã— 0.2)
"""

import asyncio
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import numpy as np
from collections import defaultdict

from src.core.config import MarketDataConfig
from src.market_data.providers.tiingo import TiingoClient
from src.market_data.providers.polygon import PolygonClient
from src.market_data.providers.yahoo import YahooClient
from src.market_data.cache import PriceCache
from src.market_data.anomaly import AnomalyDetector


@dataclass
class PricePoint:
    """Standardized price point from any source."""
    ticker: str
    price: Decimal
    timestamp: datetime
    source: str
    volume: Optional[int] = None
    bid: Optional[Decimal] = None
    ask: Optional[Decimal] = None
    vwap: Optional[Decimal] = None


@dataclass
class AggregatedPrice:
    """Final aggregated price with confidence metrics."""
    ticker: str
    final_price: Decimal
    timestamp: datetime
    
    # Component prices
    twap_24h: Optional[Decimal]
    primary_spot: Decimal
    vwap_spot: Optional[Decimal]
    
    # Weights applied
    twap_weight: Decimal
    primary_weight: Decimal
    vwap_weight: Decimal
    
    # Data quality
    source_count: int
    sources_used: List[str]
    spread_bps: Optional[Decimal]  # Bid-ask spread in basis points
    
    # Anomaly flags
    anomaly_detected: bool = False
    staleness_warning: bool = False
    volume_warning: bool = False


class MarketDataAggregator:
    """
    Multi-source market data aggregator with anomaly detection.
    
    Architecture:
    1. Fetch from multiple sources concurrently
    2. Apply anomaly detection
    3. Calculate weighted median
    4. Cache results
    """
    
    def __init__(self, config: MarketDataConfig):
        self.config = config
        
        # Initialize providers
        self.tiingo = TiingoClient(config.tiingo_api_key, config.tiingo_base_url)
        self.polygon = PolygonClient(config.polygon_api_key, config.polygon_base_url) if config.polygon_api_key else None
        self.yahoo = YahooClient() if config.yahoo_enabled else None
        
        # Initialize cache
        self.cache = PriceCache(config.redis_url, config.price_cache_ttl_seconds)
        
        # Initialize anomaly detector
        self.anomaly_detector = AnomalyDetector(
            std_threshold=config.anomaly_std_threshold,
            min_volume_percent=config.min_volume_threshold_percent
        )
        
        # Historical data for TWAP calculation
        self._price_history: Dict[str, List[PricePoint]] = defaultdict(list)
    
    async def get_prices(
        self,
        tickers: List[str],
        require_twap: bool = True
    ) -> Dict[str, AggregatedPrice]:
        """
        Get aggregated prices for multiple tickers.
        
        Args:
            tickers: List of ticker symbols
            require_twap: Whether to require 24h TWAP (False for real-time only)
            
        Returns:
            Dictionary mapping tickers to aggregated prices
        """
        # Check cache first
        cached_results = {}
        tickers_to_fetch = []
        
        for ticker in tickers:
            cached = await self.cache.get(ticker)
            if cached and not self._is_stale(cached):
                cached_results[ticker] = cached
            else:
                tickers_to_fetch.append(ticker)
        
        if not tickers_to_fetch:
            return cached_results
        
        # Fetch from all sources concurrently
        fetch_tasks = [
            self._fetch_from_tiingo(tickers_to_fetch),
        ]
        if self.polygon:
            fetch_tasks.append(self._fetch_from_polygon(tickers_to_fetch))
        if self.yahoo:
            fetch_tasks.append(self._fetch_from_yahoo(tickers_to_fetch))
        
        source_results = await asyncio.gather(*fetch_tasks, return_exceptions=True)
        
        # Aggregate results by ticker
        ticker_prices: Dict[str, List[PricePoint]] = defaultdict(list)
        for result in source_results:
            if isinstance(result, Exception):
                continue  # Log and continue
            for price_point in result:
                ticker_prices[price_point.ticker].append(price_point)
        
        # Compute final prices
        final_results = {}
        for ticker in tickers_to_fetch:
            prices = ticker_prices.get(ticker, [])
            if not prices:
                continue  # No data available
            
            aggregated = await self._aggregate_prices(ticker, prices, require_twap)
            if aggregated:
                final_results[ticker] = aggregated
                await self.cache.set(ticker, aggregated)
        
        return {**cached_results, **final_results}
    
    async def _aggregate_prices(
        self,
        ticker: str,
        prices: List[PricePoint],
        require_twap: bool
    ) -> Optional[AggregatedPrice]:
        """
        Compute weighted median price from multiple sources.
        
        Formula: final_price = weighted_median(
            TWAP_24h Ã— 0.5,
            Primary_Source Ã— 0.3,
            Volume_Weighted_Spot Ã— 0.2
        )
        """
        if not prices:
            return None
        
        # Sort by timestamp to get most recent
        prices.sort(key=lambda p: p.timestamp, reverse=True)
        
        # Extract primary spot (Tiingo preferred)
        tiingo_prices = [p for p in prices if p.source == "tiingo"]
        primary_spot = tiingo_prices[0].price if tiingo_prices else prices[0].price
        
        # Calculate VWAP from available data
        vwap_spot = self._calculate_vwap(prices)
        
        # Get 24h TWAP from history
        twap_24h = await self._calculate_twap_24h(ticker) if require_twap else None
        
        # Apply anomaly detection
        anomaly_detected = self.anomaly_detector.check_price(
            ticker, primary_spot, [p.price for p in prices]
        )
        
        # Weighted aggregation
        weights = []
        values = []
        
        if twap_24h:
            weights.append(Decimal("0.5"))
            values.append(twap_24h)
        else:
            # Redistribute TWAP weight if not available
            pass
        
        weights.append(Decimal("0.3"))
        values.append(primary_spot)
        
        if vwap_spot:
            weights.append(Decimal("0.2"))
            values.append(vwap_spot)
        
        # Normalize weights
        total_weight = sum(weights)
        weights = [w / total_weight for w in weights]
        
        # Weighted median calculation
        final_price = self._weighted_median(values, weights)
        
        # Calculate spread if bid/ask available
        spread_bps = None
        bid_ask_prices = [p for p in prices if p.bid and p.ask]
        if bid_ask_prices:
            p = bid_ask_prices[0]
            spread_bps = ((p.ask - p.bid) / p.price) * Decimal("10000")
        
        return AggregatedPrice(
            ticker=ticker,
            final_price=final_price,
            timestamp=datetime.utcnow(),
            twap_24h=twap_24h,
            primary_spot=primary_spot,
            vwap_spot=vwap_spot,
            twap_weight=Decimal("0.5") if twap_24h else Decimal("0"),
            primary_weight=Decimal("0.3"),
            vwap_weight=Decimal("0.2") if vwap_spot else Decimal("0"),
            source_count=len(set(p.source for p in prices)),
            sources_used=list(set(p.source for p in prices)),
            spread_bps=spread_bps,
            anomaly_detected=anomaly_detected,
            staleness_warning=self._check_staleness(prices),
            volume_warning=self._check_volume(prices)
        )
    
    def _weighted_median(
        self,
        values: List[Decimal],
        weights: List[Decimal]
    ) -> Decimal:
        """Calculate weighted median."""
        # Convert to numpy for calculation
        vals = np.array([float(v) for v in values])
        wts = np.array([float(w) for w in weights])
        
        # Sort by values
        sorted_indices = np.argsort(vals)
        sorted_vals = vals[sorted_indices]
        sorted_wts = wts[sorted_indices]
        
        # Find weighted median
        cumsum = np.cumsum(sorted_wts)
        median_idx = np.searchsorted(cumsum, 0.5 * cumsum[-1])
        
        return Decimal(str(sorted_vals[median_idx]))
    
    def _calculate_vwap(self, prices: List[PricePoint]) -> Optional[Decimal]:
        """Calculate volume-weighted average price."""
        prices_with_volume = [p for p in prices if p.volume and p.volume > 0]
        if not prices_with_volume:
            return None
        
        total_volume = sum(p.volume for p in prices_with_volume)
        if total_volume == 0:
            return None
        
        vwap = sum(p.price * p.volume for p in prices_with_volume) / total_volume
        return Decimal(str(vwap))
    
    async def _calculate_twap_24h(self, ticker: str) -> Optional[Decimal]:
        """Calculate 24-hour time-weighted average price."""
        history = self._price_history.get(ticker, [])
        cutoff = datetime.utcnow() - timedelta(hours=24)
        
        recent_history = [p for p in history if p.timestamp >= cutoff]
        if len(recent_history) < 10:  # Minimum data points
            return None
        
        # Simple TWAP - average of all prices in period
        return sum(p.price for p in recent_history) / len(recent_history)
    
    async def _fetch_from_tiingo(self, tickers: List[str]) -> List[PricePoint]:
        """Fetch prices from Tiingo API."""
        return await self.tiingo.get_realtime_prices(tickers)
    
    async def _fetch_from_polygon(self, tickers: List[str]) -> List[PricePoint]:
        """Fetch prices from Polygon API."""
        if not self.polygon:
            return []
        return await self.polygon.get_realtime_prices(tickers)
    
    async def _fetch_from_yahoo(self, tickers: List[str]) -> List[PricePoint]:
        """Fetch prices from Yahoo Finance."""
        if not self.yahoo:
            return []
        return await self.yahoo.get_realtime_prices(tickers)
    
    def _is_stale(self, price: AggregatedPrice) -> bool:
        """Check if cached price is stale."""
        age = (datetime.utcnow() - price.timestamp).total_seconds()
        return age > self.config.max_price_staleness_seconds
    
    def _check_staleness(self, prices: List[PricePoint]) -> bool:
        """Check if price data is stale."""
        if not prices:
            return True
        most_recent = max(p.timestamp for p in prices)
        age = (datetime.utcnow() - most_recent).total_seconds()
        return age > self.config.max_price_staleness_seconds
    
    def _check_volume(self, prices: List[PricePoint]) -> bool:
        """Check for abnormal volume (potential manipulation)."""
        # Implementation would compare to historical average
        return False


# === TIINGO CLIENT ===

class TiingoClient:
    """Tiingo API client for equity prices."""
    
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self._session = None
    
    async def get_realtime_prices(self, tickers: List[str]) -> List[PricePoint]:
        """Fetch real-time prices from Tiingo IEX endpoint."""
        import aiohttp
        
        results = []
        url = f"{self.base_url}/iex"
        headers = {"Authorization": f"Token {self.api_key}"}
        params = {"tickers": ",".join(tickers)}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, params=params) as response:
                if response.status != 200:
                    return results
                
                data = await response.json()
                for item in data:
                    results.append(PricePoint(
                        ticker=item["ticker"],
                        price=Decimal(str(item["last"])),
                        timestamp=datetime.fromisoformat(item["timestamp"].replace("Z", "+00:00")),
                        source="tiingo",
                        volume=item.get("volume"),
                        bid=Decimal(str(item["bidPrice"])) if item.get("bidPrice") else None,
                        ask=Decimal(str(item["askPrice"])) if item.get("askPrice") else None,
                    ))
        
        return results
    
    async def get_historical_prices(
        self,
        ticker: str,
        start_date: datetime,
        end_date: datetime
    ) -> List[PricePoint]:
        """Fetch historical daily prices."""
        import aiohttp
        
        results = []
        url = f"{self.base_url}/tiingo/daily/{ticker}/prices"
        headers = {"Authorization": f"Token {self.api_key}"}
        params = {
            "startDate": start_date.strftime("%Y-%m-%d"),
            "endDate": end_date.strftime("%Y-%m-%d"),
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, params=params) as response:
                if response.status != 200:
                    return results
                
                data = await response.json()
                for item in data:
                    results.append(PricePoint(
                        ticker=ticker,
                        price=Decimal(str(item["adjClose"])),
                        timestamp=datetime.fromisoformat(item["date"]),
                        source="tiingo_historical",
                        volume=item.get("adjVolume"),
                    ))
        
        return results
```

---

## Phase 3: Scoring Engine

### 3.1 Risk-Adjusted Metrics Calculator

Create `src/validator/metrics.py`:

```python
"""
QUANTA Risk-Adjusted Metrics Calculator
Implements Sortino, Calmar, Max Drawdown, and Turnover scoring.
"""

import numpy as np
from decimal import Decimal
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass

from src.core.types import (
    HorizonMetrics, TimeHorizon, PortfolioSignal,
    HORIZON_WEIGHTS, MetricWeights
)


@dataclass
class DailyReturn:
    """Portfolio daily return with metadata."""
    date: datetime
    return_pct: float
    portfolio_value: float
    benchmark_return: Optional[float] = None


class MetricsCalculator:
    """
    Computes risk-adjusted performance metrics.
    
    Metrics:
    - Sortino Ratio: Return / Downside Deviation (rewards low downside volatility)
    - Calmar Ratio: Annualized Return / Max Drawdown (rewards recovery)
    - Max Drawdown Score: 1 - (MaxDD / DD_threshold)
    - Turnover Score: 1 - (Turnover / Turnover_max)
    """
    
    def __init__(
        self,
        risk_free_rate: float = 0.05,  # 5% annual
        trading_days_per_year: int = 252,
        max_drawdown_threshold: float = 0.10,  # 10%
        max_turnover_per_week: float = 1.0,  # 100%
    ):
        self.risk_free_rate = risk_free_rate
        self.trading_days = trading_days_per_year
        self.dd_threshold = max_drawdown_threshold
        self.turnover_max = max_turnover_per_week
        self.daily_rf = (1 + risk_free_rate) ** (1/252) - 1
    
    def calculate_horizon_metrics(
        self,
        returns: List[DailyReturn],
        horizon: TimeHorizon,
        current_weights: Dict[str, float],
        previous_weights: Optional[Dict[str, float]] = None,
    ) -> HorizonMetrics:
        """
        Calculate all metrics for a specific time horizon.
        
        Args:
            returns: Daily return series
            horizon: Time horizon (7d, 30d, 90d)
            current_weights: Current portfolio weights
            previous_weights: Previous portfolio weights (for turnover)
            
        Returns:
            HorizonMetrics with all computed values
        """
        if len(returns) < 2:
            raise ValueError("Insufficient data for metrics calculation")
        
        # Extract return series
        ret_series = np.array([r.return_pct for r in returns])
        
        # Basic return metrics
        total_return = self._total_return(ret_series)
        annualized_return = self._annualize_return(total_return, len(returns))
        
        # Risk metrics
        volatility = self._volatility(ret_series)
        downside_dev = self._downside_deviation(ret_series)
        max_dd, max_dd_duration = self._max_drawdown(ret_series)
        
        # Risk-adjusted metrics
        sortino = self._sortino_ratio(ret_series, downside_dev)
        calmar = self._calmar_ratio(annualized_return, max_dd)
        
        # Turnover
        turnover = self._calculate_turnover(current_weights, previous_weights)
        
        # Normalized scores [0, 1]
        sortino_score = self._normalize_sortino(sortino)
        calmar_score = self._normalize_calmar(calmar)
        dd_score = self._max_drawdown_score(max_dd)
        turnover_score = self._turnover_score(turnover)
        
        # Composite score for this horizon
        weights = MetricWeights()
        horizon_score = (
            float(weights.sortino) * sortino_score +
            float(weights.calmar) * calmar_score +
            float(weights.max_drawdown) * dd_score +
            float(weights.turnover) * turnover_score
        )
        
        return HorizonMetrics(
            horizon=horizon,
            period_start=returns[0].date,
            period_end=returns[-1].date,
            total_return=Decimal(str(total_return)),
            annualized_return=Decimal(str(annualized_return)),
            volatility=Decimal(str(volatility)),
            downside_deviation=Decimal(str(downside_dev)),
            max_drawdown=Decimal(str(max_dd)),
            max_drawdown_duration_days=max_dd_duration,
            turnover=Decimal(str(turnover)),
            sortino_ratio=Decimal(str(sortino)),
            calmar_ratio=Decimal(str(calmar)),
            sortino_score=Decimal(str(sortino_score)),
            calmar_score=Decimal(str(calmar_score)),
            drawdown_score=Decimal(str(dd_score)),
            turnover_score=Decimal(str(turnover_score)),
            horizon_score=Decimal(str(horizon_score)),
        )
    
    def _total_return(self, returns: np.ndarray) -> float:
        """Calculate total cumulative return."""
        return np.prod(1 + returns) - 1
    
    def _annualize_return(self, total_return: float, days: int) -> float:
        """Annualize return based on holding period."""
        if days <= 0:
            return 0.0
        return (1 + total_return) ** (self.trading_days / days) - 1
    
    def _volatility(self, returns: np.ndarray) -> float:
        """Calculate annualized volatility."""
        return np.std(returns) * np.sqrt(self.trading_days)
    
    def _downside_deviation(self, returns: np.ndarray) -> float:
        """
        Calculate downside deviation (semi-deviation below target).
        Uses risk-free rate as target.
        """
        excess_returns = returns - self.daily_rf
        negative_returns = excess_returns[excess_returns < 0]
        
        if len(negative_returns) == 0:
            return 0.0001  # Avoid division by zero
        
        downside_var = np.mean(negative_returns ** 2)
        return np.sqrt(downside_var) * np.sqrt(self.trading_days)
    
    def _max_drawdown(self, returns: np.ndarray) -> Tuple[float, int]:
        """
        Calculate maximum drawdown and duration.
        
        Returns:
            Tuple of (max_drawdown_pct, duration_in_days)
        """
        # Calculate cumulative returns
        cum_returns = np.cumprod(1 + returns)
        running_max = np.maximum.accumulate(cum_returns)
        drawdowns = (cum_returns - running_max) / running_max
        
        max_dd = abs(np.min(drawdowns))
        
        # Calculate duration
        # Find the longest underwater period
        underwater = drawdowns < 0
        max_duration = 0
        current_duration = 0
        
        for is_underwater in underwater:
            if is_underwater:
                current_duration += 1
                max_duration = max(max_duration, current_duration)
            else:
                current_duration = 0
        
        return max_dd, max_duration
    
    def _sortino_ratio(
        self,
        returns: np.ndarray,
        downside_dev: float
    ) -> float:
        """
        Calculate Sortino ratio.
        
        Formula: (Annualized Return - Risk-Free Rate) / Downside Deviation
        """
        excess_return = self._annualize_return(
            self._total_return(returns), len(returns)
        ) - self.risk_free_rate
        
        if downside_dev < 0.0001:
            return 10.0  # Cap for extremely low downside risk
        
        return excess_return / downside_dev
    
    def _calmar_ratio(
        self,
        annualized_return: float,
        max_drawdown: float
    ) -> float:
        """
        Calculate Calmar ratio.
        
        Formula: Annualized Return / Max Drawdown
        """
        if max_drawdown < 0.0001:
            return 10.0  # Cap for extremely low drawdown
        
        return annualized_return / max_drawdown
    
    def _calculate_turnover(
        self,
        current: Dict[str, float],
        previous: Optional[Dict[str, float]]
    ) -> float:
        """
        Calculate portfolio turnover.
        
        Turnover = Sum of |weight_changes| / 2
        """
        if previous is None:
            return 0.0
        
        all_tickers = set(current.keys()) | set(previous.keys())
        
        total_change = sum(
            abs(current.get(ticker, 0) - previous.get(ticker, 0))
            for ticker in all_tickers
        )
        
        return total_change / 2  # Divide by 2 to avoid double counting
    
    def _normalize_sortino(self, sortino: float) -> float:
        """
        Normalize Sortino ratio to [0, 1] scale.
        Uses sigmoid-like transformation.
        """
        # Expected range: -2 to +4 for reasonable portfolios
        # Map to 0-1 using logistic function
        return 1 / (1 + np.exp(-0.5 * (sortino - 1)))
    
    def _normalize_calmar(self, calmar: float) -> float:
        """
        Normalize Calmar ratio to [0, 1] scale.
        """
        # Expected range: -1 to +5
        return 1 / (1 + np.exp(-0.3 * (calmar - 1)))
    
    def _max_drawdown_score(self, max_dd: float) -> float:
        """
        Calculate drawdown score.
        
        Formula: 1 - (MaxDD / DD_threshold)
        """
        score = 1 - (max_dd / self.dd_threshold)
        return max(0, min(1, score))  # Clamp to [0, 1]
    
    def _turnover_score(self, turnover: float) -> float:
        """
        Calculate turnover score.
        
        Formula: 1 - (Turnover / Turnover_max)
        """
        score = 1 - (turnover / self.turnover_max)
        return max(0, min(1, score))


class BootstrapValidator:
    """
    Validates scores using bootstrap resampling for confidence intervals.
    """
    
    def __init__(self, n_iterations: int = 1000, confidence_level: float = 0.95):
        self.n_iterations = n_iterations
        self.confidence_level = confidence_level
    
    def validate_score(
        self,
        returns: List[DailyReturn],
        calculator: MetricsCalculator,
        horizon: TimeHorizon,
    ) -> Tuple[float, float, float]:
        """
        Bootstrap validation of score.
        
        Returns:
            Tuple of (mean_score, lower_bound, upper_bound)
        """
        scores = []
        ret_array = np.array([r.return_pct for r in returns])
        n = len(ret_array)
        
        for _ in range(self.n_iterations):
            # Resample with replacement
            indices = np.random.choice(n, size=n, replace=True)
            resampled = ret_array[indices]
            
            # Create mock returns
            mock_returns = [
                DailyReturn(
                    date=datetime.now() + timedelta(days=i),
                    return_pct=r,
                    portfolio_value=1000
                )
                for i, r in enumerate(resampled)
            ]
            
            # Calculate metrics
            try:
                metrics = calculator.calculate_horizon_metrics(
                    mock_returns, horizon, {}, None
                )
                scores.append(float(metrics.horizon_score))
            except Exception:
                continue
        
        if not scores:
            return 0.5, 0.0, 1.0
        
        scores = np.array(scores)
        mean_score = np.mean(scores)
        
        alpha = 1 - self.confidence_level
        lower = np.percentile(scores, alpha/2 * 100)
        upper = np.percentile(scores, (1 - alpha/2) * 100)
        
        return mean_score, lower, upper
```

### 3.2 Composite Scoring Engine

Create `src/validator/scoring.py`:

```python
"""
QUANTA Composite Scoring Engine
Aggregates multi-horizon metrics into final QUANTA Score (QS).

Formula:
QS = Î£â‚œ wâ‚œ Ã— [0.35Ã—Sortino(t) + 0.25Ã—Calmar(t) + 0.25Ã—DD_Score(t) + 0.15Ã—Turnover_Score(t)]

where wâ‚œ = {0.30 for 7d, 0.45 for 30d, 0.25 for 90d}
"""

from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Dict, Optional, Tuple
import numpy as np
from collections import defaultdict
import asyncio

from src.core.types import (
    QUANTAScore, HorizonMetrics, TimeHorizon, HORIZON_WEIGHTS,
    PortfolioSignal, PerformanceTier
)
from src.core.config import ScoringConfig
from src.validator.metrics import MetricsCalculator, BootstrapValidator, DailyReturn
from src.market_data.aggregator import MarketDataAggregator


class ScoringEngine:
    """
    Main scoring engine for QUANTA subnet.
    
    Responsibilities:
    1. Ingest portfolio signals
    2. Fetch market data for constituents
    3. Calculate daily returns
    4. Compute multi-horizon metrics
    5. Generate composite scores with confidence intervals
    6. Rank miners and assign performance tiers
    """
    
    def __init__(
        self,
        config: ScoringConfig,
        market_data: MarketDataAggregator,
    ):
        self.config = config
        self.market_data = market_data
        
        self.metrics_calculator = MetricsCalculator(
            max_drawdown_threshold=float(config.max_drawdown_threshold),
            max_turnover_per_week=float(config.max_turnover_per_week),
        )
        
        self.bootstrap_validator = BootstrapValidator(
            n_iterations=config.bootstrap_iterations,
            confidence_level=float(config.confidence_level),
        )
        
        # Cache for portfolio returns
        self._return_cache: Dict[str, List[DailyReturn]] = {}
        
        # Historical weights for turnover calculation
        self._weight_history: Dict[str, Dict[str, float]] = {}
    
    async def score_portfolio(
        self,
        signal: PortfolioSignal,
        evaluation_date: datetime,
    ) -> QUANTAScore:
        """
        Score a single portfolio signal.
        
        Args:
            signal: Portfolio signal to score
            evaluation_date: Date of evaluation
            
        Returns:
            Complete QUANTA score with all metrics
        """
        tickers, weights = signal.to_tickers_and_weights()
        weights_dict = dict(zip(tickers, weights))
        
        # Fetch historical prices for all horizons
        start_date_90d = evaluation_date - timedelta(days=90)
        prices = await self._get_historical_prices(tickers, start_date_90d, evaluation_date)
        
        if not prices:
            raise ValueError(f"No price data available for portfolio")
        
        # Calculate daily returns
        returns = self._calculate_portfolio_returns(prices, weights_dict)
        
        # Get previous weights for turnover
        previous_weights = self._weight_history.get(signal.miner_hotkey)
        self._weight_history[signal.miner_hotkey] = weights_dict
        
        # Calculate metrics for each horizon
        metrics_7d = None
        metrics_30d = None
        metrics_90d = None
        
        # 7-day horizon
        if len(returns) >= 7:
            returns_7d = returns[-7:]
            metrics_7d = self.metrics_calculator.calculate_horizon_metrics(
                returns_7d, TimeHorizon.SHORT_7D, weights_dict, previous_weights
            )
        
        # 30-day horizon
        if len(returns) >= 30:
            returns_30d = returns[-30:]
            metrics_30d = self.metrics_calculator.calculate_horizon_metrics(
                returns_30d, TimeHorizon.MEDIUM_30D, weights_dict, previous_weights
            )
        
        # 90-day horizon
        if len(returns) >= 90:
            returns_90d = returns[-90:]
            metrics_90d = self.metrics_calculator.calculate_horizon_metrics(
                returns_90d, TimeHorizon.LONG_90D, weights_dict, previous_weights
            )
        
        # Calculate composite score
        composite_score = self._calculate_composite_score(
            metrics_7d, metrics_30d, metrics_90d
        )
        
        # Bootstrap validation for confidence intervals
        ci_lower, ci_upper = await self._calculate_confidence_interval(
            returns, composite_score
        )
        
        # Anti-gaming checks
        originality = await self._check_originality(signal)
        variance_flag = self._check_variance_gaming(returns)
        
        return QUANTAScore(
            miner_hotkey=signal.miner_hotkey,
            epoch_id=signal.epoch_id,
            computed_at=datetime.utcnow(),
            metrics_7d=metrics_7d,
            metrics_30d=metrics_30d,
            metrics_90d=metrics_90d,
            composite_score=composite_score,
            confidence_interval_lower=ci_lower,
            confidence_interval_upper=ci_upper,
            originality_score=originality,
            variance_flag=variance_flag,
        )
    
    async def score_all_portfolios(
        self,
        signals: List[PortfolioSignal],
        evaluation_date: datetime,
    ) -> List[QUANTAScore]:
        """
        Score all portfolios and assign rankings.
        
        Args:
            signals: List of portfolio signals
            evaluation_date: Date of evaluation
            
        Returns:
            List of scored portfolios with rankings
        """
        # Score all portfolios concurrently
        tasks = [
            self.score_portfolio(signal, evaluation_date)
            for signal in signals
        ]
        scores = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out errors
        valid_scores: List[QUANTAScore] = [
            s for s in scores if isinstance(s, QUANTAScore)
        ]
        
        # Sort by composite score (descending)
        valid_scores.sort(key=lambda s: s.composite_score, reverse=True)
        
        # Assign rankings and performance tiers
        n_miners = len(valid_scores)
        for rank, score in enumerate(valid_scores, 1):
            score.rank = rank
            score.percentile = Decimal(str(1 - (rank - 1) / n_miners))
            score.performance_tier = self._assign_tier(rank, n_miners)
        
        return valid_scores
    
    def _calculate_composite_score(
        self,
        metrics_7d: Optional[HorizonMetrics],
        metrics_30d: Optional[HorizonMetrics],
        metrics_90d: Optional[HorizonMetrics],
    ) -> Decimal:
        """
        Calculate composite QUANTA Score from horizon metrics.
        
        Formula:
        QS = 0.30Ã—QS_7d + 0.45Ã—QS_30d + 0.25Ã—QS_90d
        """
        components = []
        weights = []
        
        if metrics_7d:
            components.append(float(metrics_7d.horizon_score))
            weights.append(float(HORIZON_WEIGHTS[TimeHorizon.SHORT_7D]))
        
        if metrics_30d:
            components.append(float(metrics_30d.horizon_score))
            weights.append(float(HORIZON_WEIGHTS[TimeHorizon.MEDIUM_30D]))
        
        if metrics_90d:
            components.append(float(metrics_90d.horizon_score))
            weights.append(float(HORIZON_WEIGHTS[TimeHorizon.LONG_90D]))
        
        if not components:
            return Decimal("0.5")  # Default score
        
        # Normalize weights
        total_weight = sum(weights)
        normalized_weights = [w / total_weight for w in weights]
        
        # Weighted sum
        composite = sum(c * w for c, w in zip(components, normalized_weights))
        
        return Decimal(str(round(composite, 6)))
    
    def _assign_tier(self, rank: int, total: int) -> PerformanceTier:
        """Assign performance tier based on rank."""
        percentile = 1 - (rank - 1) / total
        
        if percentile >= 0.85:  # Top 15%
            return PerformanceTier.TOP_TIER
        elif percentile >= 0.50:  # Top 50%
            return PerformanceTier.PROFITABLE
        elif percentile >= 0.30:  # Next 20%
            return PerformanceTier.BREAK_EVEN
        else:  # Bottom 30%
            return PerformanceTier.PENALTY_BAND
    
    def _calculate_portfolio_returns(
        self,
        prices: Dict[str, Dict[datetime, Decimal]],
        weights: Dict[str, float],
    ) -> List[DailyReturn]:
        """Calculate weighted portfolio returns from constituent prices."""
        # Get all dates
        all_dates = set()
        for ticker_prices in prices.values():
            all_dates.update(ticker_prices.keys())
        
        sorted_dates = sorted(all_dates)
        if len(sorted_dates) < 2:
            return []
        
        returns = []
        prev_portfolio_value = 1.0
        
        for i in range(1, len(sorted_dates)):
            prev_date = sorted_dates[i-1]
            curr_date = sorted_dates[i]
            
            # Calculate weighted return
            portfolio_return = 0.0
            for ticker, weight in weights.items():
                if ticker not in prices:
                    continue
                
                prev_price = prices[ticker].get(prev_date)
                curr_price = prices[ticker].get(curr_date)
                
                if prev_price and curr_price and prev_price > 0:
                    ticker_return = float((curr_price - prev_price) / prev_price)
                    portfolio_return += weight * ticker_return
            
            new_portfolio_value = prev_portfolio_value * (1 + portfolio_return)
            
            returns.append(DailyReturn(
                date=curr_date,
                return_pct=portfolio_return,
                portfolio_value=new_portfolio_value,
            ))
            
            prev_portfolio_value = new_portfolio_value
        
        return returns
    
    async def _get_historical_prices(
        self,
        tickers: List[str],
        start_date: datetime,
        end_date: datetime,
    ) -> Dict[str, Dict[datetime, Decimal]]:
        """Fetch historical prices from market data aggregator."""
        # This would use the market data aggregator's historical endpoint
        # For now, return empty dict - implementation depends on data provider
        return {}
    
    async def _calculate_confidence_interval(
        self,
        returns: List[DailyReturn],
        composite_score: Decimal,
    ) -> Tuple[Decimal, Decimal]:
        """Calculate bootstrap confidence interval for score."""
        if len(returns) < 20:
            # Not enough data for bootstrap
            return composite_score * Decimal("0.9"), composite_score * Decimal("1.1")
        
        # Use bootstrap validator
        mean, lower, upper = self.bootstrap_validator.validate_score(
            returns, self.metrics_calculator, TimeHorizon.MEDIUM_30D
        )
        
        return Decimal(str(lower)), Decimal(str(upper))
    
    async def _check_originality(self, signal: PortfolioSignal) -> Decimal:
        """
        Check portfolio originality (MMC-style).
        Higher score = more original.
        """
        # Implementation would compare against all active portfolios
        # and calculate correlation/overlap
        return Decimal("1.0")  # Placeholder
    
    def _check_variance_gaming(self, returns: List[DailyReturn]) -> bool:
        """Detect high-variance gaming strategies."""
        if len(returns) < 10:
            return False
        
        ret_array = np.array([r.return_pct for r in returns])
        volatility = np.std(ret_array) * np.sqrt(252)
        
        # Flag if volatility is extremely high (>100% annualized)
        return volatility > 1.0
```

---

## Phase 4: Reward Distribution Engine

### 4.1 Power-Law Distribution

Create `src/tokenomics/distribution.py`:

```python
"""
QUANTA Reward Distribution Engine
Implements power-law (Zipfian) distribution with rake and burn mechanics.

Formula:
Reward_i = R_total Ã— (rank_i)^(-Î³) / Î£â±¼ (rank_j)^(-Î³)

where Î³ = 1.5 (governance-adjustable, range 1.0-2.0)
"""

from decimal import Decimal
from typing import List, Dict, Tuple
from dataclasses import dataclass
import numpy as np

from src.core.types import (
    QUANTAScore, RewardAllocation, EpochRewardSummary,
    PerformanceTier
)
from src.core.config import TokenomicsConfig


@dataclass
class EpochPool:
    """Represents the total reward pool for an epoch."""
    epoch_id: str
    
    # TAO emissions (from Bittensor)
    tao_emissions: Decimal
    
    # Ante contributions
    total_ante: Decimal
    
    # External revenue (bonus)
    external_revenue: Decimal
    
    @property
    def total_pool(self) -> Decimal:
        """Total pool before rake."""
        return self.tao_emissions + self.total_ante + self.external_revenue


class RewardDistributor:
    """
    Distributes rewards using power-law distribution.
    
    Process:
    1. Network takes rake (guaranteed profit)
    2. Losers forfeit ante (50% burned, 50% redistributed)
    3. Break-even tier gets ante back
    4. Remaining pool distributed by power-law to top performers
    """
    
    def __init__(self, config: TokenomicsConfig):
        self.config = config
        self.gamma = float(config.power_law_gamma)
    
    def distribute(
        self,
        scores: List[QUANTAScore],
        pool: EpochPool,
        ante_amounts: Dict[str, Decimal],  # hotkey -> ante posted
    ) -> EpochRewardSummary:
        """
        Execute reward distribution for an epoch.
        
        Args:
            scores: Ranked list of miner scores
            pool: Epoch reward pool
            ante_amounts: Ante posted by each miner
            
        Returns:
            Complete distribution summary
        """
        n_miners = len(scores)
        if n_miners == 0:
            raise ValueError("No miners to distribute rewards to")
        
        # Step 1: Network rake (guaranteed profit)
        network_rake = pool.total_pool * self.config.network_rake_percent
        after_rake_pool = pool.total_pool - network_rake
        
        # Step 2: Categorize miners by tier
        top_tier = [s for s in scores if s.performance_tier == PerformanceTier.TOP_TIER]
        profitable = [s for s in scores if s.performance_tier == PerformanceTier.PROFITABLE]
        break_even = [s for s in scores if s.performance_tier == PerformanceTier.BREAK_EVEN]
        penalty_band = [s for s in scores if s.performance_tier == PerformanceTier.PENALTY_BAND]
        
        # Step 3: Calculate ante forfeitures
        forfeited_ante = sum(
            ante_amounts.get(s.miner_hotkey, Decimal("0"))
            for s in penalty_band
        )
        
        ante_burned = forfeited_ante * self.config.loser_ante_burn_percent
        ante_redistributed = forfeited_ante - ante_burned
        
        # Step 4: Calculate break-even returns
        break_even_returns = sum(
            ante_amounts.get(s.miner_hotkey, Decimal("0"))
            for s in break_even
        )
        
        # Step 5: Calculate winner pool
        # Winner pool = after-rake pool - break-even returns + redistributed ante
        winner_pool = after_rake_pool - break_even_returns + ante_redistributed
        
        # Ensure winner pool is not negative
        winner_pool = max(winner_pool, Decimal("0"))
        
        # Step 6: Allocate to top tier and profitable using power-law
        winning_miners = top_tier + profitable
        allocations = self._power_law_allocate(
            winning_miners,
            winner_pool,
            ante_amounts,
        )
        
        # Step 7: Add break-even allocations (ante returned)
        for score in break_even:
            hotkey = score.miner_hotkey
            ante = ante_amounts.get(hotkey, Decimal("0"))
            
            allocations.append(RewardAllocation(
                miner_hotkey=hotkey,
                epoch_id=pool.epoch_id,
                rank=score.rank or 0,
                performance_tier=PerformanceTier.BREAK_EVEN,
                ante_posted=ante,
                composite_score=score.composite_score,
                power_law_weight=Decimal("0"),
                gross_reward=ante,  # Get ante back
                network_fee=Decimal("0"),
                net_reward=ante,
                roi_percent=Decimal("0"),  # Break-even
                ante_returned=True,
            ))
        
        # Step 8: Add penalty band allocations (ante lost)
        for score in penalty_band:
            hotkey = score.miner_hotkey
            ante = ante_amounts.get(hotkey, Decimal("0"))
            
            burn_portion = ante * self.config.loser_ante_burn_percent
            redist_portion = ante - burn_portion
            
            allocations.append(RewardAllocation(
                miner_hotkey=hotkey,
                epoch_id=pool.epoch_id,
                rank=score.rank or 0,
                performance_tier=PerformanceTier.PENALTY_BAND,
                ante_posted=ante,
                composite_score=score.composite_score,
                power_law_weight=Decimal("0"),
                gross_reward=Decimal("0"),
                network_fee=Decimal("0"),
                net_reward=Decimal("0"),
                roi_percent=Decimal("-100"),  # Lost everything
                ante_returned=False,
                ante_burned=burn_portion,
                ante_redistributed=redist_portion,
            ))
        
        # Calculate totals
        total_distributed = sum(a.net_reward for a in allocations)
        top_tier_total = sum(
            a.net_reward for a in allocations 
            if a.performance_tier == PerformanceTier.TOP_TIER
        )
        profitable_total = sum(
            a.net_reward for a in allocations 
            if a.performance_tier == PerformanceTier.PROFITABLE
        )
        
        return EpochRewardSummary(
            epoch_id=pool.epoch_id,
            computed_at=__import__('datetime').datetime.utcnow(),
            total_ante_collected=pool.total_ante,
            network_rake=network_rake,
            after_rake_pool=after_rake_pool,
            total_ante_forfeited=forfeited_ante,
            total_burned=ante_burned,
            total_redistributed=ante_redistributed,
            total_distributed=total_distributed,
            top_tier_total=top_tier_total,
            top_tier_count=len(top_tier),
            profitable_tier_total=profitable_total,
            profitable_tier_count=len(profitable),
            break_even_count=len(break_even),
            penalty_band_count=len(penalty_band),
            allocations=allocations,
        )
    
    def _power_law_allocate(
        self,
        miners: List[QUANTAScore],
        total_pool: Decimal,
        ante_amounts: Dict[str, Decimal],
    ) -> List[RewardAllocation]:
        """
        Allocate rewards using power-law distribution.
        
        Reward_i = R_total Ã— rank^(-Î³) / Î£â±¼ rank^(-Î³)
        """
        if not miners:
            return []
        
        # Calculate power-law weights
        ranks = np.arange(1, len(miners) + 1)
        raw_weights = ranks ** (-self.gamma)
        normalization = np.sum(raw_weights)
        normalized_weights = raw_weights / normalization
        
        allocations = []
        
        for i, score in enumerate(miners):
            hotkey = score.miner_hotkey
            ante = ante_amounts.get(hotkey, Decimal("0"))
            
            # Calculate reward
            weight = Decimal(str(normalized_weights[i]))
            gross_reward = total_pool * weight
            
            # Apply network fee
            network_fee = gross_reward * self.config.network_fee_percent
            fee_burn = network_fee * self.config.network_fee_burn_percent
            
            net_reward = gross_reward - network_fee
            
            # Calculate ROI
            if ante > 0:
                roi = ((net_reward - ante) / ante) * Decimal("100")
            else:
                roi = Decimal("0")
            
            tier = PerformanceTier.TOP_TIER if i < len(miners) * 0.15 else PerformanceTier.PROFITABLE
            
            allocations.append(RewardAllocation(
                miner_hotkey=hotkey,
                epoch_id=score.epoch_id,
                rank=score.rank or i + 1,
                performance_tier=tier,
                ante_posted=ante,
                composite_score=score.composite_score,
                power_law_weight=weight,
                gross_reward=gross_reward,
                network_fee=network_fee,
                net_reward=net_reward,
                roi_percent=roi,
                ante_returned=True,  # Winners get ante back plus profit
            ))
        
        return allocations
    
    def calculate_expected_reward(
        self,
        rank: int,
        total_miners: int,
        total_pool: Decimal,
    ) -> Decimal:
        """
        Calculate expected reward for a given rank.
        Useful for UI/projections.
        """
        if rank > total_miners or rank < 1:
            return Decimal("0")
        
        # Generate all weights
        ranks = np.arange(1, total_miners + 1)
        raw_weights = ranks ** (-self.gamma)
        normalization = np.sum(raw_weights)
        
        # Get weight for this rank
        weight = Decimal(str(raw_weights[rank - 1] / normalization))
        
        return total_pool * weight
```

---

## Phase 5: API Layer

### 5.1 FastAPI Application

Create `src/api/main.py`:

```python
"""
QUANTA API Server
RESTful API for signal submission, leaderboard access, and metrics.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from src.core.config import QUANTAConfig
from src.core.types import (
    PortfolioSignal, CommitmentPayload, RevealPayload,
    QUANTAScore, PerformanceTier
)


# ============== API MODELS ==============

class SubmitSignalRequest(BaseModel):
    """Request model for signal submission."""
    epoch_id: str
    miner_hotkey: str
    positions: List[dict]  # [{ticker: str, weight: float}]
    ante_amount: float
    signature: str  # Signed by miner hotkey


class SubmitCommitmentRequest(BaseModel):
    """Request model for commit phase."""
    commitment: str
    miner_hotkey: str
    epoch_id: str


class SubmitRevealRequest(BaseModel):
    """Request model for reveal phase."""
    commitment: str
    signal: dict
    secret: str


class LeaderboardEntry(BaseModel):
    """Leaderboard entry for public display."""
    rank: int
    miner_hotkey: str
    composite_score: float
    performance_tier: str
    
    # Performance metrics
    return_7d: Optional[float]
    return_30d: Optional[float]
    sharpe_30d: Optional[float]
    max_drawdown_30d: Optional[float]
    
    # Track record
    epochs_participated: int
    avg_rank_percentile: float


class LeaderboardResponse(BaseModel):
    """Full leaderboard response."""
    epoch_id: str
    updated_at: datetime
    total_miners: int
    entries: List[LeaderboardEntry]
    
    # Aggregate stats
    avg_return_7d: float
    median_score: float
    top_performer_return: float


class NetworkStatsResponse(BaseModel):
    """Network-wide statistics."""
    total_signal_generators: int
    solo_miners: int
    pool_operators: int
    validators: int
    
    # Economics
    total_stake: float
    total_rewards_distributed: float
    total_burned: float
    
    # Performance
    network_avg_return_30d: float
    top_10_avg_return_30d: float


# ============== API APPLICATION ==============

def create_app(config: QUANTAConfig) -> FastAPI:
    """Create and configure FastAPI application."""
    
    app = FastAPI(
        title="QUANTA API",
        description="Decentralized Portfolio Signal Subnet API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Store config in app state
    app.state.config = config
    
    # ============== SIGNAL ENDPOINTS ==============
    
    @app.post("/v1/signals/commit", tags=["Signals"])
    async def submit_commitment(request: SubmitCommitmentRequest):
        """
        Submit commitment hash for commit-reveal protocol.
        
        Must be submitted at least 14 hours before reveal.
        """
        # Validate commitment format
        if len(request.commitment) != 64:
            raise HTTPException(400, "Invalid commitment hash length")
        
        # Store commitment (implementation)
        # ...
        
        return {
            "status": "accepted",
            "commitment": request.commitment,
            "expires_at": datetime.utcnow().isoformat(),
            "reveal_window_starts": datetime.utcnow().isoformat(),
        }
    
    @app.post("/v1/signals/reveal", tags=["Signals"])
    async def submit_reveal(request: SubmitRevealRequest, background_tasks: BackgroundTasks):
        """
        Submit signal reveal after commitment period.
        
        Verifies commitment hash matches and schedules scoring.
        """
        # Verify commitment exists and is within reveal window
        # ...
        
        # Verify hash matches
        # ...
        
        # Schedule background scoring
        # background_tasks.add_task(score_signal, request.signal)
        
        return {
            "status": "accepted",
            "signal_id": "...",
            "scoring_scheduled": True,
        }
    
    @app.post("/v1/signals/submit", tags=["Signals"])
    async def submit_signal_direct(request: SubmitSignalRequest):
        """
        Direct signal submission (for testing/development).
        
        In production, use commit-reveal protocol.
        """
        # Validate signal
        total_weight = sum(p["weight"] for p in request.positions)
        if not (0.999 <= total_weight <= 1.001):
            raise HTTPException(400, f"Weights must sum to 1.0, got {total_weight}")
        
        # Validate ante
        if request.ante_amount < float(config.tokenomics.minimum_ante):
            raise HTTPException(400, f"Minimum ante is {config.tokenomics.minimum_ante}")
        
        return {
            "status": "accepted",
            "signal_id": "...",
            "epoch_id": request.epoch_id,
        }
    
    # ============== LEADERBOARD ENDPOINTS ==============
    
    @app.get("/v1/leaderboard", response_model=LeaderboardResponse, tags=["Leaderboard"])
    async def get_leaderboard(
        epoch_id: Optional[str] = Query(None, description="Specific epoch (default: current)"),
        limit: int = Query(50, ge=1, le=500),
        offset: int = Query(0, ge=0),
        tier: Optional[str] = Query(None, description="Filter by performance tier"),
    ):
        """
        Get current leaderboard rankings.
        
        Supports pagination and tier filtering.
        """
        # Implementation would query database
        return LeaderboardResponse(
            epoch_id=epoch_id or "2025-Q4-W48",
            updated_at=datetime.utcnow(),
            total_miners=150,
            entries=[],
            avg_return_7d=0.02,
            median_score=0.45,
            top_performer_return=0.15,
        )
    
    @app.get("/v1/leaderboard/{miner_hotkey}", tags=["Leaderboard"])
    async def get_miner_details(miner_hotkey: str):
        """
        Get detailed performance metrics for a specific miner.
        """
        return {
            "miner_hotkey": miner_hotkey,
            "current_rank": 1,
            "current_score": 0.85,
            "performance_tier": "top_tier",
            "epochs_participated": 45,
            "track_record": {
                "return_7d": 0.05,
                "return_30d": 0.12,
                "return_90d": 0.28,
                "sharpe_30d": 1.8,
                "sortino_30d": 2.4,
                "max_drawdown_30d": 0.04,
            },
            "portfolio": {
                "positions": [],  # Obfuscated in production
                "last_updated": datetime.utcnow().isoformat(),
            },
        }
    
    # ============== METRICS ENDPOINTS ==============
    
    @app.get("/v1/metrics/network", response_model=NetworkStatsResponse, tags=["Metrics"])
    async def get_network_stats():
        """
        Get network-wide aggregate statistics.
        """
        return NetworkStatsResponse(
            total_signal_generators=500,
            solo_miners=50,
            pool_operators=100,
            validators=64,
            total_stake=1000000.0,
            total_rewards_distributed=50000.0,
            total_burned=5000.0,
            network_avg_return_30d=0.03,
            top_10_avg_return_30d=0.15,
        )
    
    @app.get("/v1/metrics/epoch/{epoch_id}", tags=["Metrics"])
    async def get_epoch_metrics(epoch_id: str):
        """
        Get detailed metrics for a specific epoch.
        """
        return {
            "epoch_id": epoch_id,
            "total_signals": 150,
            "total_ante": 75000.0,
            "network_rake": 6000.0,
            "total_distributed": 69000.0,
            "total_burned": 3000.0,
            "avg_score": 0.48,
            "score_distribution": {
                "top_tier_count": 22,
                "profitable_count": 75,
                "break_even_count": 30,
                "penalty_band_count": 23,
            },
        }
    
    # ============== HEALTH ENDPOINTS ==============
    
    @app.get("/health", tags=["Health"])
    async def health_check():
        """Basic health check."""
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    
    @app.get("/health/detailed", tags=["Health"])
    async def detailed_health():
        """Detailed health check with component status."""
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "components": {
                "database": "healthy",
                "redis": "healthy",
                "market_data": "healthy",
                "scoring_engine": "healthy",
            },
            "current_epoch": "2025-Q4-W48",
            "epoch_phase": "evaluation",
        }
    
    return app


# ============== MAIN ==============

if __name__ == "__main__":
    config = QUANTAConfig()
    app = create_app(config)
    uvicorn.run(app, host=config.api_host, port=config.api_port)
```

---

## Phase 6: Multi-Agent Background Processing

### 6.1 Agent Architecture

Create `src/agents/coordinator.py`:

```python
"""
QUANTA Multi-Agent Coordinator
Orchestrates background agents for continuous processing.

Agents:
1. Market Data Agent - Continuous price fetching and caching
2. Scoring Agent - Periodic portfolio evaluation
3. Consensus Agent - Validator consensus aggregation
4. Distribution Agent - Reward calculation and distribution
5. Monitoring Agent - Health checks and anomaly detection
"""

import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from dataclasses import dataclass, field
from enum import Enum
import logging

from src.core.config import QUANTAConfig


class AgentStatus(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    ERROR = "error"
    STOPPED = "stopped"


@dataclass
class AgentState:
    """State tracking for an agent."""
    name: str
    status: AgentStatus = AgentStatus.IDLE
    last_run: Optional[datetime] = None
    last_success: Optional[datetime] = None
    error_count: int = 0
    last_error: Optional[str] = None
    metrics: Dict[str, Any] = field(default_factory=dict)


class BaseAgent:
    """Base class for all QUANTA agents."""
    
    def __init__(self, name: str, config: QUANTAConfig):
        self.name = name
        self.config = config
        self.state = AgentState(name=name)
        self.logger = logging.getLogger(f"quanta.agents.{name}")
        self._running = False
        self._task: Optional[asyncio.Task] = None
    
    async def start(self):
        """Start the agent's processing loop."""
        self._running = True
        self.state.status = AgentStatus.RUNNING
        self._task = asyncio.create_task(self._run_loop())
        self.logger.info(f"Agent {self.name} started")
    
    async def stop(self):
        """Stop the agent."""
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        self.state.status = AgentStatus.STOPPED
        self.logger.info(f"Agent {self.name} stopped")
    
    async def _run_loop(self):
        """Main processing loop."""
        while self._running:
            try:
                self.state.last_run = datetime.utcnow()
                await self.process()
                self.state.last_success = datetime.utcnow()
                self.state.error_count = 0
            except Exception as e:
                self.state.error_count += 1
                self.state.last_error = str(e)
                self.state.status = AgentStatus.ERROR
                self.logger.error(f"Agent {self.name} error: {e}")
                
                if self.state.error_count >= 5:
                    self.logger.critical(f"Agent {self.name} exceeded error threshold")
                    break
            
            await asyncio.sleep(self.get_interval())
    
    async def process(self):
        """Override in subclasses."""
        raise NotImplementedError
    
    def get_interval(self) -> float:
        """Return processing interval in seconds."""
        return 60.0


class MarketDataAgent(BaseAgent):
    """
    Continuously fetches and caches market data.
    
    Responsibilities:
    - Fetch real-time prices for all active portfolio tickers
    - Maintain TWAP calculations
    - Detect price anomalies
    - Update historical data
    """
    
    def __init__(self, config: QUANTAConfig, market_data_aggregator):
        super().__init__("market_data", config)
        self.market_data = market_data_aggregator
        self._active_tickers: set = set()
    
    def get_interval(self) -> float:
        return 30.0  # 30 seconds
    
    async def process(self):
        """Fetch and cache current prices."""
        if not self._active_tickers:
            return
        
        prices = await self.market_data.get_prices(
            list(self._active_tickers),
            require_twap=True
        )
        
        self.state.metrics["tickers_fetched"] = len(prices)
        self.state.metrics["anomalies_detected"] = sum(
            1 for p in prices.values() if p.anomaly_detected
        )
    
    def register_tickers(self, tickers: list):
        """Add tickers to watch list."""
        self._active_tickers.update(tickers)


class ScoringAgent(BaseAgent):
    """
    Periodically scores all active portfolios.
    
    Responsibilities:
    - Calculate metrics for all time horizons
    - Generate composite scores
    - Update rankings
    - Trigger consensus when complete
    """
    
    def __init__(self, config: QUANTAConfig, scoring_engine):
        super().__init__("scoring", config)
        self.scoring_engine = scoring_engine
        self._pending_signals: list = []
    
    def get_interval(self) -> float:
        return 300.0  # 5 minutes
    
    async def process(self):
        """Score pending signals."""
        if not self._pending_signals:
            return
        
        scores = await self.scoring_engine.score_all_portfolios(
            self._pending_signals,
            datetime.utcnow()
        )
        
        self.state.metrics["signals_scored"] = len(scores)
        self.state.metrics["avg_score"] = (
            sum(float(s.composite_score) for s in scores) / len(scores)
            if scores else 0
        )
        
        # Clear processed signals
        self._pending_signals = []
    
    def queue_signal(self, signal):
        """Add signal to scoring queue."""
        self._pending_signals.append(signal)


class ConsensusAgent(BaseAgent):
    """
    Aggregates validator scores into consensus.
    
    Responsibilities:
    - Collect validator weight submissions
    - Apply Yuma Consensus algorithm
    - Clip weights exceeding median
    - Detect collusion patterns
    """
    
    def __init__(self, config: QUANTAConfig):
        super().__init__("consensus", config)
        self._validator_submissions: Dict[str, list] = {}
    
    def get_interval(self) -> float:
        return 600.0  # 10 minutes
    
    async def process(self):
        """Aggregate validator submissions."""
        # Implementation would apply Yuma Consensus
        pass


class DistributionAgent(BaseAgent):
    """
    Calculates and executes reward distributions.
    
    Responsibilities:
    - Trigger at epoch end
    - Calculate power-law allocations
    - Execute burns
    - Record transactions
    """
    
    def __init__(self, config: QUANTAConfig, reward_distributor):
        super().__init__("distribution", config)
        self.distributor = reward_distributor
    
    def get_interval(self) -> float:
        return 3600.0  # 1 hour (check for epoch transitions)
    
    async def process(self):
        """Check for epoch end and distribute rewards."""
        # Check if current epoch has ended
        # If so, trigger distribution
        pass


class MonitoringAgent(BaseAgent):
    """
    System health monitoring and alerting.
    
    Responsibilities:
    - Monitor all agent health
    - Track system metrics
    - Generate alerts
    - Log anomalies
    """
    
    def __init__(self, config: QUANTAConfig, agents: Dict[str, BaseAgent]):
        super().__init__("monitoring", config)
        self.agents = agents
    
    def get_interval(self) -> float:
        return 60.0  # 1 minute
    
    async def process(self):
        """Check health of all agents."""
        for name, agent in self.agents.items():
            if agent.state.status == AgentStatus.ERROR:
                self.logger.warning(f"Agent {name} in error state: {agent.state.last_error}")
            
            if agent.state.last_success:
                time_since_success = datetime.utcnow() - agent.state.last_success
                if time_since_success > timedelta(minutes=10):
                    self.logger.warning(f"Agent {name} hasn't succeeded in {time_since_success}")
        
        self.state.metrics["agents_healthy"] = sum(
            1 for a in self.agents.values()
            if a.state.status == AgentStatus.RUNNING
        )


class AgentCoordinator:
    """
    Coordinates all QUANTA agents.
    """
    
    def __init__(self, config: QUANTAConfig):
        self.config = config
        self.agents: Dict[str, BaseAgent] = {}
        self.logger = logging.getLogger("quanta.coordinator")
    
    def register_agent(self, agent: BaseAgent):
        """Register an agent with the coordinator."""
        self.agents[agent.name] = agent
    
    async def start_all(self):
        """Start all registered agents."""
        self.logger.info(f"Starting {len(self.agents)} agents")
        for agent in self.agents.values():
            await agent.start()
    
    async def stop_all(self):
        """Stop all agents."""
        self.logger.info("Stopping all agents")
        for agent in self.agents.values():
            await agent.stop()
    
    def get_status(self) -> Dict[str, AgentState]:
        """Get status of all agents."""
        return {name: agent.state for name, agent in self.agents.items()}
```

---

## Phase 7: Docker Deployment

### 7.1 Docker Compose

Create `docker/docker-compose.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: quanta-postgres
    environment:
      POSTGRES_DB: quanta
      POSTGRES_USER: quanta
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-quanta_dev}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U quanta"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: quanta-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # QUANTA API Server
  api:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: quanta-api
    environment:
      DATABASE_URL: postgresql://quanta:${POSTGRES_PASSWORD:-quanta_dev}@postgres:5432/quanta
      REDIS_URL: redis://redis:6379
      TIINGO_API_KEY: ${TIINGO_API_KEY}
      POLYGON_API_KEY: ${POLYGON_API_KEY}
      ENVIRONMENT: ${ENVIRONMENT:-development}
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # Background Agent Workers
  agents:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: quanta-agents
    command: python -m src.agents.main
    environment:
      DATABASE_URL: postgresql://quanta:${POSTGRES_PASSWORD:-quanta_dev}@postgres:5432/quanta
      REDIS_URL: redis://redis:6379
      TIINGO_API_KEY: ${TIINGO_API_KEY}
      POLYGON_API_KEY: ${POLYGON_API_KEY}
      ENVIRONMENT: ${ENVIRONMENT:-development}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  # Prometheus Metrics
  prometheus:
    image: prom/prometheus:latest
    container_name: quanta-prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  # Grafana Dashboard
  grafana:
    image: grafana/grafana:latest
    container_name: quanta-grafana
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-admin}
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
```

### 7.2 Dockerfile

Create `docker/Dockerfile`:

```dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ src/
COPY scripts/ scripts/

# Create non-root user
RUN useradd -m -u 1000 quanta
USER quanta

# Expose port
EXPOSE 8000

# Default command
CMD ["uvicorn", "src.api.main:create_app", "--host", "0.0.0.0", "--port", "8000", "--factory"]
```

---

## Phase 8: Testing Framework

### 8.1 Test Structure

Create `tests/conftest.py`:

```python
"""
QUANTA Test Configuration
Pytest fixtures and shared test utilities.
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from decimal import Decimal
from typing import List

from src.core.config import QUANTAConfig, ScoringConfig, TokenomicsConfig
from src.core.types import PortfolioSignal, PortfolioPosition, QUANTAScore


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def config():
    """Test configuration."""
    return QUANTAConfig(
        environment="development",
        debug=True,
        database_url="sqlite:///test.db",
    )


@pytest.fixture
def sample_portfolio() -> PortfolioSignal:
    """Sample portfolio signal for testing."""
    return PortfolioSignal(
        epoch_id="2025-Q4-W48",
        miner_hotkey="5" + "a" * 47,  # 48 char hotkey
        timestamp=datetime.utcnow(),
        positions=[
            PortfolioPosition(ticker="AAPL", weight=Decimal("0.15")),
            PortfolioPosition(ticker="GOOGL", weight=Decimal("0.15")),
            PortfolioPosition(ticker="MSFT", weight=Decimal("0.15")),
            PortfolioPosition(ticker="AMZN", weight=Decimal("0.15")),
            PortfolioPosition(ticker="NVDA", weight=Decimal("0.10")),
            PortfolioPosition(ticker="META", weight=Decimal("0.10")),
            PortfolioPosition(ticker="TSLA", weight=Decimal("0.10")),
            PortfolioPosition(ticker="JPM", weight=Decimal("0.10")),
        ],
        ante_amount=Decimal("50.0"),
    )


@pytest.fixture
def sample_returns():
    """Sample return series for testing."""
    import numpy as np
    from src.validator.metrics import DailyReturn
    
    np.random.seed(42)
    returns = np.random.normal(0.001, 0.02, 90)  # 90 days
    
    base_date = datetime.utcnow() - timedelta(days=90)
    return [
        DailyReturn(
            date=base_date + timedelta(days=i),
            return_pct=float(returns[i]),
            portfolio_value=1000 * np.prod(1 + returns[:i+1])
        )
        for i in range(len(returns))
    ]


@pytest.fixture
def sample_scores() -> List[QUANTAScore]:
    """Sample scores for distribution testing."""
    scores = []
    for i in range(100):
        score = QUANTAScore(
            miner_hotkey=f"5{'a' * 47}",
            epoch_id="2025-Q4-W48",
            computed_at=datetime.utcnow(),
            composite_score=Decimal(str(0.9 - i * 0.008)),  # Decreasing scores
            rank=i + 1,
            percentile=Decimal(str(1 - i/100)),
        )
        scores.append(score)
    return scores
```

---

## Implementation Notes

### Development Priorities

1. **Week 1-2: Core Infrastructure**
   - Set up project structure
   - Implement type definitions
   - Create configuration management
   - Set up database models

2. **Week 3-4: Market Data**
   - Implement Tiingo API client
   - Build multi-source aggregator
   - Create caching layer
   - Add anomaly detection

3. **Week 5-6: Scoring Engine**
   - Implement metrics calculator
   - Build composite scoring
   - Add bootstrap validation
   - Create ranking system

4. **Week 7-8: Tokenomics**
   - Implement power-law distribution
   - Build ante management
   - Create burn mechanics
   - Add reward allocation

5. **Week 9-10: API & Integration**
   - Build FastAPI endpoints
   - Implement authentication
   - Create leaderboard
   - Add rate limiting

6. **Week 11-12: Agents & Deployment**
   - Build agent coordinator
   - Implement background processing
   - Create Docker deployment
   - Add monitoring

### Key Technical Decisions

1. **Python 3.11+** for async/await support and performance
2. **FastAPI** for high-performance async API
3. **PostgreSQL** for relational data storage
4. **Redis** for caching and real-time data
5. **Pydantic** for strict type validation
6. **SQLAlchemy** for ORM
7. **Docker** for containerized deployment

### Performance Targets

- API response time: <100ms p95
- Scoring computation: <5s for 500 portfolios
- Price fetch: <500ms for 30 tickers
- Bootstrap validation: <10s per portfolio

### Security Considerations

1. All inputs validated via Pydantic
2. Commit-reveal prevents front-running
3. Rate limiting prevents spam
4. Stake requirements create economic barriers
5. Anomaly detection flags manipulation

---

## Getting Started

```bash
# Clone and setup
git clone <repo>
cd quanta-subnet

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your API keys

# Start services
docker-compose up -d postgres redis

# Run migrations
python scripts/setup_db.py

# Start API server
uvicorn src.api.main:create_app --reload --factory

# Start agents (separate terminal)
python -m src.agents.main
```

---

## Conclusion

This specification provides a comprehensive blueprint for building a production-ready QUANTA prototype. The modular architecture enables parallel development, thorough testing, and incremental deployment. Each component is designed to be independently testable while integrating seamlessly with the overall system.

The multi-agent architecture ensures continuous operation with proper health monitoring and error recovery. The API layer provides clean interfaces for external integrations, while the scoring engine implements the sophisticated risk-adjusted metrics required for fair and manipulation-resistant rankings.

This prototype demonstrates all key technical capabilities required for the Yuma.ai accelerator submission while providing a solid foundation for production scaling.
