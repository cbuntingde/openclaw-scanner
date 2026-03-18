# ClawScanner - OpenClaw Health Monitor Plugin

> 🔍 Your OpenClaw health checker. Catches issues before downtime.

## Features

- ✅ **Process Monitor** - Gateway status, memory, CPU
- ✅ **Config Validator** - Env vars, config files
- ✅ **Dependency Checker** - Package versions
- ✅ **Skill Validator** - SKILL.md syntax
- ✅ **Memory Auditor** - Memory system health
- ✅ **Session Manager** - Active sessions, cleanup
- ✅ **API Health** - Endpoint testing
- ✅ **Log Analyzer** - Error detection
- ✅ **Background Service** - Continuous monitoring
- ✅ **Webhook Alerts** - Slack, Discord, Teams support

## Plugin vs Agent

This is now an **enterprise-grade OpenClaw plugin** with:

| Feature | Description |
|---------|-------------|
| Background Service | Continuous health monitoring without agent turns |
| Registered Tools | Direct tool access: `scanner_health`, `scanner_status`, `scanner_check` |
| Alerting | Configurable webhook alerts |
| Skills | Bundled skills for detailed diagnostics |

## Installation

```bash
# Install from local directory
openclaw plugins install ./openclaw-scanner

# Or install with linking (for development)
openclaw plugins install -l ./openclaw-scanner
```

## Configuration

Add to `~/.openclaw/openclaw.json`:

```json5
{
  plugins: {
    entries: {
      "openclaw-scanner": {
        enabled: true,
        config: {
          checkIntervalMinutes: 5,
          alertWebhookUrl: "https://your-webhook.com",
          alertOnCritical: true,
          alertOnWarning: false,
          gatewayPort: 3000,
          memoryThresholdPercent: 90,
          diskThresholdPercent: 85
        }
      }
    }
  }
}
```

### Config Options

| Option | Default | Description |
|--------|---------|-------------|
| `checkIntervalMinutes` | 5 | Health check interval |
| `alertWebhookUrl` | - | Webhook URL for alerts |
| `alertOnCritical` | true | Alert on critical issues |
| `alertOnWarning` | false | Alert on warnings |
| `gatewayPort` | 3000 | OpenClaw gateway port |
| `memoryThresholdPercent` | 90 | Memory alert threshold |
| `diskThresholdPercent` | 85 | Disk alert threshold |

## Tools

This plugin provides these tools:

```typescript
// Get full health status
scanner_health()
// Returns: JSON with all check results

// Get simplified status
scanner_status()
// Returns: "Status: HEALTHY | DEGRADED | CRITICAL"

// Run specific check
scanner_check({ check: "memory" })
// check: process | memory | disk | gateway | config | all
```

## Webhook Alerts

The plugin sends JSON payloads to your webhook URL on critical issues.

### Slack Setup

1. Create an incoming webhook: https://api.slack.com/messaging/webhooks
2. Copy the webhook URL (`https://hooks.slack.com/services/XXX/YYY/ZZZ`)
3. Add to config:

```json5
{
  "alertWebhookUrl": "https://hooks.slack.com/services/XXX/YYY/ZZZ",
  "alertOnCritical": true,
  "alertOnWarning": false
}
```

### Alert Format (Slack Block Kit)

```json
{
  "text": "🚨 *ClawScanner Alert* - Status: CRITICAL",
  "blocks": [
    { "type": "header", "text": { "text": "🚨 ClawScanner: CRITICAL" } },
    { "type": "section", "fields": [
      { "type": "mrkdwn", "text": "*Status:*\nCRITICAL" },
      { "type": "mrkdwn", "text": "*Time:*\n2026-03-18T00:00:00Z" }
    ]},
    { "type": "section", "text": { "text": "*Issues:*\n• gateway: Not running on port 3000" } }
  ]
}
```

### Other Webhook Services

Works with any HTTP endpoint accepting JSON:
- **Discord** - Use channel webhook URL
- **Microsoft Teams** - Incoming webhook
- **PagerDuty** - Events API
- **OpsGenie** - REST API
- **Custom** - Any HTTP receiver

## What It Does

| Check | Frequency | Purpose |
|-------|-----------|---------|
| Process | 5 min | Gateway health |
| API | 5 min | Endpoint status |
| Config | 15 min | Valid settings |
| Sessions | 15 min | Stale cleanup |
| Dependencies | Hourly | Package health |
| Logs | Hourly | Error detection |
| Skills | Daily | File validation |
| Memory | Daily | System health |

## Documentation

- [SETUP.md](SETUP.md) - Installation
- [SOUL.md](SOUL.md) - Identity
- [HEARTBEAT.md](HEARTBEAT.md) - Schedule

---

*Never let OpenClaw go down unnoticed.*

*Need help? Open an issue at https://github.com/cbuntingde/openclaw-advanced-agents/issues*
