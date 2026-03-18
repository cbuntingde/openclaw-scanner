---
name: dependency-checker
description: Verify OpenClaw dependencies are installed and up-to-date
metadata: { "openclaw": { "always": true, "requires": {}, "primaryEnv": null } }
---

# dependency-checker - OpenClaw Dependency Checker

## Purpose

Verify all OpenClaw dependencies are installed, working, and up-to-date.

## Checks Performed

### 1. Required Dependencies
- Node.js runtime (v18+)
- npm or bun package manager
- OpenClaw CLI tools
- Required npm packages in `~/.openclaw/`

### 2. External Tools
- `gh` - GitHub CLI
- `git` - Version control
- `ffmpeg` - Video processing
- `curl` or `wget` - HTTP clients

### 3. Skill Dependencies
- ClawHub CLI (if skills are synced)
- Any MCP servers configured

### 4. Version Checks
- Node.js version compatibility
- npm package versions
- CLI tool versions

## Output Format

```json
{
  "status": "healthy|degraded|critical",
  "dependencies": [
    {
      "name": "node",
      "installed": true,
      "version": "v20.10.0",
      "required": "v18+",
      "ok": true
    }
  ],
  "issues": [
    {
      "severity": "high|medium|low",
      "dependency": "package name",
      "issue": "description",
      "fix": "install/upgrade command"
    }
  ]
}
```

## Usage

```bash
# Run dependency check
openclaw check dependencies

# Or via skill invocation
<invoke skill="dependency-checker" />
```

## Frequency

Run hourly as part of heartbeat.
