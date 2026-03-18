---
name: log-analyzer
description: Scan OpenClaw logs for errors and anomalies
metadata: { "openclaw": { "always": true, "requires": {}, "primaryEnv": null } }
---

# log-analyzer - OpenClaw Log Analyzer

## Purpose

Scan OpenClaw logs for errors, warnings, and anomalies to identify potential issues.

## Checks Performed

### 1. Log Files
- Scan `~/.openclaw/logs/` directory
- Check for recent log files
- Verify log rotation working

### 2. Error Detection
- Parse logs for ERROR level
- Parse logs for WARN level
- Identify exception/stack traces
- Detect repeated errors

### 3. Pattern Analysis
- Identify error patterns
- Detect recurring issues
- Spot performance degradation
- Find resource warnings

### 4. Anomaly Detection
- Unusual error spikes
- Unexpected shutdowns
- Authentication failures
- Connection issues

### 5. Log Health
- Log file sizes
- Disk space for logs
- Log rotation status
- Log retention compliance

## Commands Used

```bash
# Find log files
find ~/.openclaw/logs -name "*.log" -type f

# Search for errors
grep -r "ERROR" ~/.openclaw/logs/
grep -r "WARN" ~/.openclaw/logs/

# Recent errors
tail -100 ~/.openclaw/logs/openclaw.log

# Error count
grep -c "ERROR" ~/.openclaw/logs/openclaw.log
```

## Output Format

```json
{
  "status": "healthy|degraded|critical",
  "log_stats": {
    "total_files": 5,
    "total_size_mb": 10.5,
    "error_count": 12,
    "warning_count": 45,
    "recent_errors": 3
  },
  "recent_issues": [
    {
      "timestamp": "2026-03-12T01:20:00Z",
      "level": "ERROR",
      "source": "gateway",
      "message": "connection timeout",
      "count": 3
    }
  ],
  "issues": [
    {
      "severity": "high|medium|low",
      "pattern": "error pattern",
      "occurrences": 5,
      "first_seen": "2026-03-12T00:00:00Z",
      "recommendation": "fix description"
    }
  ]
}
```

## Usage

```bash
# Run log analysis
openclaw check logs

# Or via skill invocation
<invoke skill="log-analyzer" />
```

## Frequency

Run hourly as part of heartbeat.
