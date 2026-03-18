# HEARTBEAT.md - ClawScanner Monitoring Schedule

## Active Hours

- **Timezone**: UTC
- **Active**: 24/7 (continuous monitoring)

## Check Schedule

### Every 5 Minutes
| Check | Purpose |
|-------|---------|
| Process Monitor | Gateway status, memory, CPU |
| API Health | Test endpoints, webhooks |

### Every 15 Minutes
| Check | Purpose |
|-------|---------|
| Config Validator | Env vars, config files |
| Session Manager | Active sessions, stale cleanup |

### Hourly
| Check | Purpose |
|-------|---------|
| Dependency Checker | Package versions, updates |
| Log Analyzer | Errors, warnings, anomalies |

### Daily
| Check | Purpose |
|-------|---------|
| Skill Validator | All SKILL.md files valid |
| Memory Auditor | Memory system health |
| Full System Audit | Complete health check |

## Alert Conditions

| Condition | Severity | Action |
|-----------|----------|--------|
| Gateway down | CRITICAL | Alert immediately |
| API 5xx errors | HIGH | Investigate |
| Config invalid | HIGH | Alert + block |
| Memory > 90% | HIGH | Alert |
| Stale sessions > 10 | MEDIUM | Auto-cleanup |
| Missing dependencies | HIGH | Alert |

---

*ClawScanner keeps OpenClaw healthy 24/7.*
