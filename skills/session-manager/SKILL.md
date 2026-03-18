---
name: session-manager
description: Monitor and clean up OpenClaw sessions
metadata: { "openclaw": { "always": true, "requires": {}, "primaryEnv": null } }
---

# session-manager - OpenClaw Session Manager

## Purpose

Monitor active sessions, track session health, and clean up stale sessions.

## Checks Performed

### 1. Active Sessions
- List all active sub-agent sessions
- Session creation time
- Last activity timestamp
- Session status (active, idle, completed)

### 2. Session Health
- Detect stale/idle sessions
- Identify sessions exceeding timeout
- Check for zombie processes
- Session resource usage

### 3. Session Configuration
- Session timeout settings
- Max concurrent sessions
- Session cleanup policy

### 4. Session Cleanup
- Identify sessions to terminate
- Force cleanup of stuck sessions
- Log terminated sessions

## Commands Used

```bash
# List sessions (if supported)
openclaw sessions list
openclaw gateway sessions

# Or check process-level
ps aux | grep -E "subagent|agent:"
```

## Output Format

```json
{
  "status": "healthy|degraded|critical",
  "sessions": [
    {
      "id": "abc-123",
      "type": "subagent",
      "created": "2026-03-12T01:00:00Z",
      "last_activity": "2026-03-12T01:15:00Z",
      "idle_time": "5m",
      "status": "active|idle|stale",
      "should_cleanup": false
    }
  ],
  "cleanup_needed": [
    {
      "id": "def-456",
      "reason": "idle for 30 minutes",
      "action": "terminate"
    }
  ],
  "issues": []
}
```

## Usage

```bash
# Run session check
openclaw check sessions

# Clean up stale sessions
openclaw sessions cleanup

# Or via skill invocation
<invoke skill="session-manager" />
```

## Frequency

Run every 15 minutes as part of heartbeat.
