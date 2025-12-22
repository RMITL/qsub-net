# QUANTA Technology Review Framework

A comprehensive multi-agent review system for evaluating the QUANTA Bittensor subnet documentation before accelerator applications and institutional due diligence.

---

## Quick Start

### 1. Open in Claude Code
```bash
cd quanta-review
claude
```

### 2. Run the Review
In Claude Code, use these commands:

```
# Start the orchestrated review
@REVIEW_ORCHESTRATOR.md Execute the full review protocol

# Or run individual agents
@review-agents/01-mathematical-validity.md Evaluate the QUANTA documentation
```

### 3. Generate Final Report
```
@SYNTHESIS.md Aggregate all findings and produce accelerator report
```

---

## Directory Structure

```
quanta-review/
├── README.md                    # This file
├── REVIEW_ORCHESTRATOR.md       # Master coordination prompt
├── SYNTHESIS.md                 # Final aggregation protocol
│
├── inputs/                      # Documents under review
│   ├── audit-research.md        # Comprehensive audit research
│   ├── prototype-spec.md        # Technical prototype specification
│   └── miner-taxonomy.md        # Participant classification
│
├── review-agents/               # 10 specialized review prompts
│   ├── 01-mathematical-validity.md
│   ├── 02-economic-model.md
│   ├── 03-technical-architecture.md
│   ├── 04-attack-vectors.md
│   ├── 05-regulatory-compliance.md
│   ├── 06-oracle-integrity.md
│   ├── 07-competitive-analysis.md
│   ├── 08-precedent-validation.md
│   ├── 09-prototype-code.md
│   └── 10-feasibility-assessment.md
│
├── outputs/                     # Generated review outputs
│   ├── findings/               # Individual agent findings
│   └── synthesis/              # Cross-reference analysis
│
└── checklists/                  # Accelerator preparation
    ├── yuma-ai-requirements.md
    └── web3-accelerator-criteria.md
```

---

## Review Agents

### Phase 1: Foundation Review
| Agent | Purpose | Key Focus |
|-------|---------|-----------|
| **01 - Mathematical Validity** | Validate formulas and scoring | QUANTA Score formula, Sortino/Calmar, power-law distribution |
| **02 - Economic Model** | Assess tokenomics sustainability | Fund flows, EV analysis, attack economics |
| **03 - Technical Architecture** | Evaluate system design | Data flows, scalability, API design |

### Phase 2: Security & Risk
| Agent | Purpose | Key Focus |
|-------|---------|-----------|
| **04 - Attack Vectors** | Identify vulnerabilities | Sybil, collusion, gaming, oracle manipulation |
| **05 - Regulatory Compliance** | Assess legal risk | Howey test, CFTC, international frameworks |
| **06 - Oracle Integrity** | Validate data infrastructure | Multi-source aggregation, manipulation resistance |

### Phase 3: Market & Competitive
| Agent | Purpose | Key Focus |
|-------|---------|-----------|
| **07 - Competitive Analysis** | Assess market position | Numerai comparison, differentiation, moats |
| **08 - Precedent Validation** | Verify claims against evidence | Numerai/Taoshi/Polymarket precedents |

### Phase 4: Implementation
| Agent | Purpose | Key Focus |
|-------|---------|-----------|
| **09 - Prototype Code** | Review code quality | Type safety, error handling, completeness |
| **10 - Feasibility Assessment** | Evaluate execution viability | Timeline, budget, team requirements |

---

## Usage Instructions

### Sequential Execution (Recommended)

Run each agent in order, saving outputs before proceeding:

```
# In Claude Code:

# Step 1: Read all inputs first
@inputs/audit-research.md @inputs/prototype-spec.md @inputs/miner-taxonomy.md
Review these documents to understand the full context.

# Step 2: Run Agent 01
@review-agents/01-mathematical-validity.md
Execute this mathematical validity review against the input documents.
Save output to outputs/findings/01-mathematical-validity-findings.md

# Step 3: Run Agent 02
@review-agents/02-economic-model.md
Execute this economic model review.
Save output to outputs/findings/02-economic-model-findings.md

# Continue for all 10 agents...

# Final: Run Synthesis
@SYNTHESIS.md
Aggregate all findings into final accelerator report.
```

### Parallel Execution (Advanced)

For faster results, run non-dependent agents simultaneously:
- Agents 01, 02, 03 can run in parallel
- Agents 04, 05, 06 can run in parallel  
- Agents 07, 08 can run in parallel
- Agents 09, 10 should run after earlier phases

### Single-Agent Deep Dive

To focus on one area:
```
@review-agents/04-attack-vectors.md @inputs/audit-research.md @inputs/prototype-spec.md
Perform a comprehensive security analysis focusing on attack vectors.
```

---

## Output Format

Each agent produces structured findings in this format:

```markdown
# [Agent Name] Review Findings

## Executive Summary
[2-3 sentence overview]

## Findings

### Strengths
| Finding | Evidence | Confidence |
|---------|----------|------------|

### Concerns  
| Severity | Finding | Evidence | Impact | Recommendation |
|----------|---------|----------|--------|----------------|

### Gaps Identified
| Gap | Why It Matters | Suggested Resolution |
|-----|----------------|---------------------|

## Quantitative Assessment
| Criterion | Score (1-10) | Justification |
|-----------|--------------|---------------|

## Overall Rating: X/10

## Key Recommendations (Priority Order)
1. ...
2. ...
3. ...
```

---

## Final Deliverables

After running all agents and synthesis, you'll have:

1. **`outputs/accelerator-report.md`** - Executive summary for accelerator applications
2. **`outputs/prioritized-issues.md`** - All issues ranked by severity
3. **`outputs/action-items.md`** - Actionable next steps with owners
4. **`outputs/synthesis/cross-reference-matrix.md`** - Finding correlations

---

## Accelerator Preparation

Use the checklists to ensure readiness:

- **`checklists/yuma-ai-requirements.md`** - Specific to Yuma.ai program
- **`checklists/web3-accelerator-criteria.md`** - General Web3 accelerator criteria

---

## Tips for Best Results

### 1. Provide Full Context
Always reference all three input documents when running an agent:
```
@inputs/audit-research.md @inputs/prototype-spec.md @inputs/miner-taxonomy.md
```

### 2. Use "Thorough" Mode
When starting Claude Code, enable thorough analysis:
```
claude --thorough
```

### 3. Save Intermediate Results
After each agent, explicitly save the output:
```
Save this analysis to outputs/findings/[agent-name]-findings.md
```

### 4. Cross-Reference Findings
After all agents complete, explicitly ask for cross-referencing:
```
Compare the findings from agents 01, 02, and 04 for consistency in economic assumptions.
```

### 5. Challenge Assumptions
Ask follow-up questions like:
- "What if participant count is 50% lower than projected?"
- "How does this change if TAO price drops 80%?"
- "What's the worst-case regulatory scenario?"

---

## Customization

### Adding New Review Criteria
1. Create new agent file in `review-agents/`
2. Follow the existing template structure
3. Update `REVIEW_ORCHESTRATOR.md` to include in flow
4. Update `SYNTHESIS.md` to incorporate findings

### Modifying Scoring Weights
Edit the rubrics in individual agent files under "Quantitative Assessment Rubric"

### Adding Input Documents
1. Add document to `inputs/`
2. Reference in relevant agent prompts
3. Update `REVIEW_ORCHESTRATOR.md` document list

---

## Support

This framework was designed specifically for QUANTA's accelerator preparation. For questions or modifications, the agent prompts are self-documenting with clear evaluation criteria and output requirements.
