# QUANTA Technology Review Orchestrator

## Purpose
This orchestrator coordinates a comprehensive technology, mathematical, and conceptual review of QUANTA—a Bittensor subnet for decentralized portfolio-based alpha signal generation. The review prepares the project for Yuma.ai accelerator application and institutional due diligence.

---

## Context Summary

**QUANTA** is a proposed Bittensor subnet that:
- Accepts portfolio-based signals (JSON payloads of U.S. equity tickers + weights)
- Scores portfolios using risk-adjusted metrics (Sortino, Calmar, Max Drawdown, Turnover)
- Distributes rewards via power-law mechanics with stake-and-burn tokenomics
- Uses a Signal Pool architecture to scale beyond Bittensor's 256 UID limitation
- Targets the $9B+ alternative data market with institutional API licensing

**Key Precedents**: Numerai ($550M AUM, 25% returns 2024), Taoshi SN8, Polymarket

---

## Documents Under Review

| Document | Location | Purpose |
|----------|----------|---------|
| Comprehensive Audit Research | `inputs/audit-research.md` | Market analysis, precedents, regulatory framework, security considerations |
| Prototype Specification | `inputs/prototype-spec.md` | Technical implementation details, code structure, API design |
| Miner Taxonomy | `inputs/miner-taxonomy.md` | Participant classification, interface types, computational requirements |

---

## Review Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        REVIEW EXECUTION FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PHASE 1: FOUNDATION REVIEW                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐            │
│  │ Agent 01:       │ │ Agent 02:       │ │ Agent 03:       │            │
│  │ Mathematical    │ │ Economic        │ │ Technical       │            │
│  │ Validity        │ │ Model           │ │ Architecture    │            │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘            │
│           │                   │                   │                     │
│           ▼                   ▼                   ▼                     │
│  PHASE 2: SECURITY & RISK REVIEW                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐            │
│  │ Agent 04:       │ │ Agent 05:       │ │ Agent 06:       │            │
│  │ Attack Vectors  │ │ Regulatory      │ │ Oracle          │            │
│  │ & Game Theory   │ │ Compliance      │ │ Integrity       │            │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘            │
│           │                   │                   │                     │
│           ▼                   ▼                   ▼                     │
│  PHASE 3: MARKET & COMPETITIVE REVIEW                                   │
│  ┌─────────────────┐ ┌─────────────────┐                                │
│  │ Agent 07:       │ │ Agent 08:       │                                │
│  │ Competitive     │ │ Precedent       │                                │
│  │ Analysis        │ │ Validation      │                                │
│  └────────┬────────┘ └────────┬────────┘                                │
│           │                   │                                         │
│           ▼                   ▼                                         │
│  PHASE 4: IMPLEMENTATION REVIEW                                         │
│  ┌─────────────────┐ ┌─────────────────┐                                │
│  │ Agent 09:       │ │ Agent 10:       │                                │
│  │ Prototype       │ │ Feasibility     │                                │
│  │ Code Review     │ │ Assessment      │                                │
│  └────────┬────────┘ └────────┬────────┘                                │
│           │                   │                                         │
│           └─────────┬─────────┘                                         │
│                     ▼                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    SYNTHESIS & FINAL REPORT                      │    │
│  │  • Cross-reference all findings                                  │    │
│  │  • Prioritize by severity (Critical/High/Medium/Low)            │    │
│  │  • Map to accelerator criteria                                   │    │
│  │  • Generate executive summary                                    │    │
│  │  • Produce action item list                                      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Execution Protocol

### Step 1: Document Ingestion
Before running any agent, read ALL input documents completely. Build a mental model of:
- Core value proposition and differentiation
- Technical architecture and data flows
- Economic model and incentive structures
- Target participants and market opportunity
- Competitive positioning and precedents

### Step 2: Sequential Agent Execution
Run each agent in order (01 → 10). For each agent:

1. **Read the agent prompt** from `review-agents/XX-agent-name.md`
2. **Execute the evaluation** against all relevant input documents
3. **Produce structured output** in the specified format
4. **Save findings** to `outputs/findings/XX-agent-name-findings.md`
5. **Note any cross-cutting concerns** for synthesis

### Step 3: Synthesis
After all agents complete:
1. Run `SYNTHESIS.md` to aggregate findings
2. Resolve contradictions between agents
3. Prioritize issues by severity
4. Map to accelerator evaluation criteria
5. Generate final deliverables

---

## Output Format Standard

All agent outputs must follow this structure:

```markdown
# [Agent Name] Review Findings

## Executive Summary
[2-3 sentence overview of this agent's key findings]

## Evaluation Scope
[What specific aspects this agent evaluated]

## Findings

### Strengths
| Finding | Evidence | Confidence |
|---------|----------|------------|
| [Strength 1] | [Citation from source docs] | High/Medium/Low |
| ... | ... | ... |

### Concerns
| Severity | Finding | Evidence | Impact | Recommendation |
|----------|---------|----------|--------|----------------|
| Critical/High/Medium/Low | [Issue] | [Citation] | [Impact assessment] | [Specific recommendation] |
| ... | ... | ... | ... | ... |

### Gaps Identified
| Gap | Why It Matters | Suggested Resolution |
|-----|----------------|---------------------|
| [Missing information] | [Impact of gap] | [How to address] |
| ... | ... | ... |

## Quantitative Assessment
| Criterion | Score (1-10) | Justification |
|-----------|--------------|---------------|
| [Criterion 1] | X | [Brief justification] |
| ... | ... | ... |

## Overall Rating: X/10

## Key Recommendations (Priority Order)
1. [Most important recommendation]
2. [Second most important]
3. [...]

## Cross-Cutting Notes
[Any observations relevant to other agents or synthesis]
```

---

## Accelerator Alignment

This review is designed to address typical accelerator evaluation criteria:

| Criterion | Relevant Agents | Weight |
|-----------|-----------------|--------|
| Technical Innovation | 03, 09 | High |
| Market Opportunity | 07, 08 | High |
| Team Capability | 10 | High |
| Tokenomic Soundness | 02, 04 | High |
| Security Posture | 04, 06 | High |
| Regulatory Clarity | 05 | Medium |
| Competitive Moat | 07, 08 | Medium |
| Roadmap Credibility | 10 | Medium |
| Mathematical Rigor | 01 | Medium |

---

## Success Criteria

A successful review produces:
1. **10 agent finding documents** with structured assessments
2. **Prioritized issue list** with severity ratings
3. **Cross-reference matrix** showing finding correlations
4. **Accelerator readiness report** (2-3 pages executive summary)
5. **Action item list** with effort estimates and priorities

---

## Begin Review

Start with: `review-agents/01-mathematical-validity.md`

Execute each agent sequentially, saving outputs before proceeding to the next.
