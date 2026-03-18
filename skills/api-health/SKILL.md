---
name: api-health
description: Test OpenClaw API endpoints and connectivity
metadata: { "openclaw": { "always": true, "requires": {}, "primaryEnv": null } }
---

# api-health - OpenClaw API Health Checker

## Purpose

Test OpenClaw API endpoints, webhooks, and external service connectivity.

## Checks Performed

### 1. Gateway API
- Health endpoint: `GET /health`
- Status endpoint: `GET /status`
- API responds within timeout
- Authentication working

### 2. Internal Endpoints
- WebSocket connection
- Session management endpoints
- Skill invocation endpoints

### 3. External Services (if configured)
- GitHub API connectivity
- ClawHub API connectivity
- Any configured MCP servers

### 4. Webhooks (if configured)
- Webhook endpoints reachable
- Webhook delivery status
- Retry mechanisms working

### 5. Latency & Performance
- Response time metrics
- Endpoint availability
- Error rate monitoring

## Commands Used

```bash
# Check gateway health
curl -s http://localhost:3000/health
curl -s http://localhost:3000/status

# Check API response time
time curl -s http://localhost:3000/health

# Test WebSocket
wscat -c ws://localhost:3000/ws
```

## Output Format

```json
{
  "status": "healthy|degraded|critical",
  "endpoints": [
    {
      "name": "gateway-health",
      "url": "http://localhost:3000/health",
      "status": "pass|fail",
      "response_time_ms": 45,
      "status_code": 200
    }
  ],
  "external_services": [
    {
      "name": "github",
      "connected": true,
      "latency_ms": 120
    }
  ],
  "issues": [
    {
      "severity": "high|medium|low",
      "endpoint": "service name",
      "issue": "description",
      "fix": "recommended fix"
    }
  ]
}
```

## Usage

```bash
# Run API health check
openclaw check api

# Or via skill invocation
<invoke skill="api-health" />
```

## Frequency

Run every 5 minutes as part of heartbeat.
