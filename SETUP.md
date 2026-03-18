# Setup - ClawScanner

## Prerequisites

- OpenClaw 2026.1+
- Node.js 18+

## Installation

```bash
# Copy to workspace
cp -r ~/openclaw-scanner ~/.openclaw/workspace/clawscanner

# Configure
cd ~/.openclaw/workspace/clawscanner
cp config/defaults.json config/local.json
```

## Usage

```bash
# Run health check
clawscanner health

# Check specific
clawscanner process
clawscanner config
clawscanner logs

# Enable monitoring
clawscanner monitor --start
```

## Cron Setup

```bash
# Add to crontab
*/5 * * * * clawscanner health --silent
```

---

*Keep OpenClaw healthy.*
