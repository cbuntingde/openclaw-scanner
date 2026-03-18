import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

const execAsync = promisify(exec);

interface PluginConfig {
  checkIntervalMinutes?: number;
  alertWebhookUrl?: string;
  alertOnCritical?: boolean;
  alertOnWarning?: boolean;
  gatewayPort?: number;
  memoryThresholdPercent?: number;
  diskThresholdPercent?: number;
}

interface HealthStatus {
  status: "healthy" | "degraded" | "critical";
  timestamp: string;
  checks: {
    process: CheckResult;
    memory: CheckResult;
    disk: CheckResult;
    gateway: CheckResult;
    config: CheckResult;
  };
  issues: Issue[];
}

interface CheckResult {
  status: "pass" | "warn" | "fail";
  details: string;
}

interface Issue {
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  fix?: string;
}

let healthCheckInterval: NodeJS.Timeout | null = null;
let currentHealth: HealthStatus | null = null;

async function checkGatewayProcess(config: PluginConfig): Promise<CheckResult> {
  const port = config.gatewayPort || 3000;
  try {
    const { stdout } = await execAsync(`lsof -i :${port} -t`);
    if (stdout.trim()) {
      const pid = stdout.trim();
      const { stdout: psOut } = await execAsync(`ps -p ${pid} -o pid,etime,%mem,%cpu --no-headers`);
      const [, etime, mem, cpu] = psOut.trim().split(/\s+/);
      return { status: "pass", details: `Gateway running on port ${port}, PID: ${pid}, uptime: ${etime}, memory: ${mem}%, cpu: ${cpu}%` };
    }
    return { status: "fail", details: `Gateway not running on port ${port}` };
  } catch {
    return { status: "fail", details: `Gateway not running on port ${port}` };
  }
}

async function checkMemory(config: PluginConfig): Promise<CheckResult> {
  const threshold = config.memoryThresholdPercent || 90;
  try {
    const { stdout } = await execAsync("free | grep Mem");
    const [, total, used] = stdout.trim().split(/\s+/).map(Number);
    const percent = Math.round((used / total) * 100);
    if (percent >= threshold) {
      return { status: "fail", details: `Memory usage at ${percent}% (threshold: ${threshold}%)` };
    } else if (percent >= threshold - 10) {
      return { status: "warn", details: `Memory usage at ${percent}%` };
    }
    return { status: "pass", details: `Memory usage at ${percent}%` };
  } catch (err) {
    return { status: "warn", details: `Could not check memory: ${err}` };
  }
}

async function checkDisk(config: PluginConfig): Promise<CheckResult> {
  const threshold = config.diskThresholdPercent || 85;
  try {
    const { stdout } = await execAsync("df -h / | tail -1");
    const parts = stdout.trim().split(/\s+/);
    const percentStr = parts[4];
    const percent = parseInt(percentStr, 10);
    if (percent >= threshold) {
      return { status: "fail", details: `Disk usage at ${percent}% (threshold: ${threshold}%)` };
    } else if (percent >= threshold - 10) {
      return { status: "warn", details: `Disk usage at ${percent}%` };
    }
    return { status: "pass", details: `Disk usage at ${percent}%` };
  } catch (err) {
    return { status: "warn", details: `Could not check disk: ${err}` };
  }
}

async function checkConfig(): Promise<CheckResult> {
  const homeDir = os.homedir();
  const configPaths = [
    path.join(homeDir, ".openclaw", "openclaw.json"),
    path.join(homeDir, ".openclaw", "config.json"),
    path.join(homeDir, ".openclaw", "config.yaml"),
  ];
  for (const configPath of configPaths) {
    try {
      await fs.access(configPath);
      return { status: "pass", details: `Config found at ${configPath}` };
    } catch {
      continue;
    }
  }
  return { status: "fail", details: "No OpenClaw config found" };
}

async function runHealthCheck(api: any): Promise<HealthStatus> {
  const config = (api.config || {}) as PluginConfig;
  
  const [processCheck, memoryCheck, diskCheck, gatewayCheck, configCheck] = await Promise.all([
    checkGatewayProcess(config),
    checkMemory(config),
    checkDisk(config),
    checkGatewayProcess(config),
    checkConfig(),
  ]);

  const issues: Issue[] = [];

  if (processCheck.status === "fail") {
    issues.push({ severity: "critical", component: "gateway", message: processCheck.details, fix: "Run 'openclaw gateway start'" });
  }
  if (memoryCheck.status === "fail") {
    issues.push({ severity: "critical", component: "memory", message: memoryCheck.details, fix: "Free up system memory" });
  } else if (memoryCheck.status === "warn") {
    issues.push({ severity: "warning", component: "memory", message: memoryCheck.details });
  }
  if (diskCheck.status === "fail") {
    issues.push({ severity: "critical", component: "disk", message: diskCheck.details, fix: "Free up disk space" });
  } else if (diskCheck.status === "warn") {
    issues.push({ severity: "warning", component: "disk", message: diskCheck.details });
  }
  if (configCheck.status === "fail") {
    issues.push({ severity: "critical", component: "config", message: configCheck.details, fix: "Create OpenClaw config file" });
  }

  let overallStatus: "healthy" | "degraded" | "critical" = "healthy";
  if (issues.some(i => i.severity === "critical")) {
    overallStatus = "critical";
  } else if (issues.some(i => i.severity === "warning")) {
    overallStatus = "degraded";
  }

  const health: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks: {
      process: processCheck,
      memory: memoryCheck,
      disk: diskCheck,
      gateway: gatewayCheck,
      config: configCheck,
    },
    issues,
  };

  currentHealth = health;
  return health;
}

async function sendAlert(api: any, health: HealthStatus): Promise<void> {
  const config = (api.config || {}) as PluginConfig;
  const webhookUrl = config.alertWebhookUrl;
  
  if (!webhookUrl) return;
  
  const shouldAlert = (health.status === "critical" && config.alertOnCritical !== false) ||
                     (health.status === "degraded" && config.alertOnWarning === true);
  
  if (!shouldAlert) return;

  try {
    const body = JSON.stringify({
      text: `🚨 *ClawScanner Alert* - Status: ${health.status.toUpperCase()}`,
      blocks: [
        { type: "header", text: { type: "plain_text", text: `🚨 ClawScanner: ${health.status.toUpperCase()}` } },
        { type: "section", fields: [
          { type: "mrkdwn", text: `*Status:*\n${health.status}` },
          { type: "mrkdwn", text: `*Time:*\n${health.timestamp}` },
        ]},
        { type: "section", text: { type: "mrkdwn", text: `*Issues:*\n${health.issues.map(i => `• ${i.component}: ${i.message}`).join("\n")}` } },
      ],
    });

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    api.logger.info("Alert sent successfully");
  } catch (err) {
    api.logger.error(`Failed to send alert: ${err}`);
  }
}

function startMonitoring(api: any): void {
  const config = (api.config || {}) as PluginConfig;
  const intervalMs = (config.checkIntervalMinutes || 5) * 60 * 1000;

  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }

  api.logger.info(`Starting ClawScanner monitoring with ${config.checkIntervalMinutes || 5}min interval`);

  runHealthCheck(api).then(health => {
    if (health.issues.length > 0) {
      sendAlert(api, health);
    }
  });

  healthCheckInterval = setInterval(async () => {
    const health = await runHealthCheck(api);
    if (health.issues.length > 0) {
      sendAlert(api, health);
    }
  }, intervalMs);
}

function stopMonitoring(): void {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
}

export default function (api: any): void {
  api.registerTool({
    name: "scanner_health",
    description: "Get current OpenClaw health status including process, memory, disk, gateway, and config checks",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    async execute(_id: string, _params: any) {
      const health = await runHealthCheck(api);
      return { content: [{ type: "text", text: JSON.stringify(health, null, 2) }] };
    },
  });

  api.registerTool({
    name: "scanner_status",
    description: "Get simplified OpenClaw status (healthy/degraded/critical)",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    async execute(_id: string, _params: any) {
      const health = currentHealth || await runHealthCheck(api);
      return { content: [{ type: "text", text: `Status: ${health.status.toUpperCase()}\nTimestamp: ${health.timestamp}\nIssues: ${health.issues.length}` }] };
    },
  });

  api.registerTool({
    name: "scanner_check",
    description: "Run a specific health check (process, memory, disk, gateway, config)",
    parameters: {
      type: "object",
      properties: {
        check: { type: "string", enum: ["process", "memory", "disk", "gateway", "config", "all"], default: "all" },
      },
      required: ["check"],
    },
    async execute(_id: string, params: any) {
      const config = (api.config || {}) as PluginConfig;
      let result: CheckResult;

      switch (params.check) {
        case "process":
        case "gateway":
          result = await checkGatewayProcess(config);
          break;
        case "memory":
          result = await checkMemory(config);
          break;
        case "disk":
          result = await checkDisk(config);
          break;
        case "config":
          result = await checkConfig();
          break;
        default:
          const health = await runHealthCheck(api);
          return { content: [{ type: "text", text: JSON.stringify(health, null, 2) }] };
      }

      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  });

  api.registerService({
    id: "openclaw-scanner",
    start: async () => {
      api.logger.info("ClawScanner service starting");
      startMonitoring(api);
    },
    stop: async () => {
      api.logger.info("ClawScanner service stopping");
      stopMonitoring();
    },
  });

  api.logger.info("ClawScanner plugin loaded");
}
