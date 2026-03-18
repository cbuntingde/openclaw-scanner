---
name: process-monitor
description: Monitor OpenClaw processes and system resources
metadata: { "openclaw": { "always": true, "requires": {}, "primaryEnv": null } }
---

# process-monitor - OpenClaw Process Monitor

## Purpose

Monitor OpenClaw processes, gateway status, and system resource usage.

## Checks Performed

### 1. Gateway Process
- Is `openclaw gateway` running?
- Process ID and uptime
- Memory usage
- CPU usage
- Port binding (default 3000)

### 2. Active Processes
- Main OpenClaw daemon
- Any active sub-agents
- Scheduled/cron processes

### 3. System Resources
- Memory usage (RAM)
- Disk space
- Open file descriptors
- Network connections

### 4. Service Health
- Gateway responds to health checks
- WebSocket connections active
- API endpoint accessibility

## Commands Used

```bash
# Check gateway status
openclaw gateway status

# List processes
ps aux | grep openclaw
pgrep -f openclaw

# Check port
lsof -i :3000
netstat -tlnp | grep 3000

# Resource usage
free -h
df -h
```

## Output Format

```json
{
  "status": "healthy|degraded|critical",
  "gateway": {
    "running": true,
    "pid": 12345,
    "uptime": "2h 30m",
    "memory": "150MB",
    "cpu": "5%",
    "port": 3000,
    "responding": true
  },
  "processes": [
    {
      "name": "openclaw-gateway",
      "pid": 12345,
      "status": "running",
      "cpu": "5%",
      "memory": "150MB"
    }
  ],
  "issues": []
}
```

## Usage

```bash
# Run process check
openclaw check processes

# Or via skill invocation
<invoke skill="process-monitor" />
```

## Frequency

Run every 5 minutes as part of heartbeat.
