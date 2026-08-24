export const SECURITY_ROWS = [
  {
    principle: "Zero Trust Access",
    implementation: "Identity access with MFA. No VPN.",
    tools: "Keycloak",
  },
  {
    principle: "Deployment-Time Enforcement",
    implementation: "Scans must pass before deploy.",
    tools: "GitHub Actions + OPA",
  },
  {
    principle: "Verifiable Builds",
    implementation: "SLSA Level 3 provenance on builds.",
    tools: "GitHub SLSA Generator",
  },
  {
    principle: "AI Self-Review",
    implementation: "Automated review of AI-generated changes.",
    tools: "Gemini CLI Conductor",
  },
  {
    principle: "WAF + Rate Limiting",
    implementation: "Web firewall with DDoS protection.",
    tools: "Cloudflare",
  },
  {
    principle: "Identity-Aware Proxy",
    implementation: "Authenticate before any resource.",
    tools: "Cloudflare Access",
  },
  {
    principle: "Security Scanning",
    implementation: "Vulnerability scans in CI/CD.",
    tools: "Trivy + Snyk",
  },
  {
    principle: "Monitoring",
    implementation: "Live security alerts.",
    tools: "Prometheus + Grafana",
  },
] as const;

export const SECURITY_RECOVERY = [
  "Take the live site offline and isolate the instance.",
  "Rotate every secret (database, API keys, session keys, admin logins).",
  "Restore from a known-good backup, not from the infected disk.",
  "Patch the hole, then re-run Trivy, Snyk, and OPA before going live.",
  "Tell the campus contact what happened and what was checked.",
  "Watch failed logins and odd admin actions for a period after.",
] as const;
