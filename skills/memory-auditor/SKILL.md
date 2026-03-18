---
name: memory-auditor
description: Check OpenClaw memory system and detect anomalies
metadata: { "openclaw": { "always": true, "requires": {}, "primaryEnv": null } }
---

# memory-auditor - OpenClaw Memory Auditor

## Purpose

Check OpenClaw's memory system, verify decay policies, and detect corruption or anomalies.

## Checks Performed

### 1. Memory Files
- Scan `~/.openclaw/memory/` directory
- Check for existence of daily memory files
- Verify file structure (YYYY-MM-DD.md format)

### 2. Memory Content
- Check for corruption (invalid markdown, truncation)
- Detect missing required sections
- Validate date formatting
- Check for encoding issues

### 3. Memory Decay/Retention
- Verify decay policy is configured
- Check which files should be kept vs. deleted
- Verify old files are being cleaned up
- Calculate memory age distribution

### 4. Memory Integrity
- Disk space for memory storage
- File permissions
- Backup status (if configured)

### 5. Context Loading
- Test loading today's memory
- Test loading yesterday's memory
- Verify memory can be parsed

## Output Format

```json
{
  "status": "healthy|degraded|critical",
  "memory_stats": {
    "total_files": 30,
    "oldest_date": "2025-01-01",
    "newest_date": "2026-03-12",
    "total_size_mb": 2.5,
    "files_to_decay": 5
  },
  "issues": [
    {
      "severity": "high|medium|low",
      "type": "corruption|decay|permission|missing",
      "issue": "description",
      "fix": "recommended fix"
    }
  ]
}
```

## Usage

```bash
# Run memory audit
openclaw check memory

# Or via skill invocation
<invoke skill="memory-auditor" />
```

## Frequency

Run daily as part of full system audit.
