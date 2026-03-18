---
name: skill-validator
description: Validate skill files and SKILL.md syntax
metadata: { "openclaw": { "always": true, "requires": {}, "primaryEnv": null } }
---

# skill-validator - OpenClaw Skill Validator

## Purpose

Validate skill files, SKILL.md syntax, and skill structure to ensure proper functionality.

## Checks Performed

### 1. Skill Directory Structure
- Each skill has a `SKILL.md` file
- Required fields in SKILL.md:
  - Title/description
  - Purpose section
  - Checks performed (for scanner skills)

### 2. SKILL.md Syntax
- Valid markdown
- Required sections present
- Proper YAML frontmatter (if used)
- Links are valid

### 3. Skill Discovery
- Scan `~/.openclaw/skills/` directory
- Scan `~/.agents/skills/` directory
- Identify all installed skills

### 4. Skill Health
- Skill files readable
- No syntax errors
- Compatible with current OpenClaw version

### 5. ClawHub Skills (if configured)
- Sync status
- Update availability

## Output Format

```json
{
  "status": "healthy|degraded|critical",
  "skills": [
    {
      "name": "config-validator",
      "path": "~/.openclaw/skills/config-validator",
      "valid": true,
      "has_skill_md": true,
      "issues": []
    }
  ],
  "issues": [
    {
      "severity": "high|medium|low",
      "skill": "skill-name",
      "issue": "description",
      "fix": "recommended fix"
    }
  ]
}
```

## Usage

```bash
# Run skill validation
openclaw check skills

# Or via skill invocation
<invoke skill="skill-validator" />
```

## Frequency

Run daily as part of full system audit.
