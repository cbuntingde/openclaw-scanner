---
name: config-validator
description: Validate OpenClaw configuration files
metadata: { "openclaw": { "always": true, "requires": {}, "primaryEnv": null } }
---

# config-validator - OpenClaw Configuration Validator

## Purpose

Validate OpenClaw configuration files, environment variables, and settings to ensure proper operation.

## Checks Performed

### 1. Core Config Files
- `~/.openclaw/config.yaml` or `~/.openclaw/config.json` - main config
- `~/.openclaw/workspace/AGENTS.md` - agent definitions
- `~/.openclaw/workspace/SOUL.md` - identity file
- `~/.openclaw/workspace/TOOLS.md` - tool conventions
- `~/.openclaw/workspace/USER.md` - user profile

### 2. Environment Variables
- `OPENCLAW_HOME` - OpenClaw installation directory
- `OPENCLAW_WORKSPACE` - workspace path
- `OPENCLAW_GATEWAY_PORT` - gateway port (default: 3000)
- `OPENCLAW_LOG_LEVEL` - logging level
- Other OpenClaw-specific env vars

### 3. Configuration Validation
- Syntax validation (YAML/JSON)
- Required fields present
- Valid paths and references
- Port availability check

## Output Format

Returns JSON:
```json
{
  "status": "healthy|degraded|critical",
  "checks": [
    {
      "name": "config-file",
      "status": "pass|fail|warn",
      "details": "description"
    }
  ],
  "issues": [
    {
      "severity": "high|medium|low",
      "component": "config file or env var",
      "issue": "description",
      "fix": "recommended fix"
    }
  ]
}
```

## Usage

```bash
# Run config validation
openclaw config validate

# Or via skill invocation
<invoke skill="config-validator" />
```

## Frequency

Run every 15 minutes as part of heartbeat.
