export const SECURITY_ROWS = [
  {
    principle: "Zero Trust Access",
    implementation: "Identity access with MFA. No VPN.",
  },
  {
    principle: "Deployment-Time Enforcement",
    implementation: "Scans and policy checks must pass before deploy.",
  },
  {
    principle: "Verifiable Builds",
    implementation: "SLSA Level 3 provenance on builds.",
  },
  {
    principle: "AI Self-Review",
    implementation: "Automated review of AI-generated changes.",
  },
  {
    principle: "WAF + Rate Limiting",
    implementation: "Web firewall with DDoS protection.",
  },
  {
    principle: "Identity-Aware Proxy",
    implementation: "Authenticate before any resource.",
  },
  {
    principle: "Security Scanning",
    implementation: "Vulnerability scans in the deploy pipeline.",
  },
  {
    principle: "Monitoring",
    implementation: "Live security alerts.",
  },
] as const;

export const SECURITY_RECOVERY = [
  "Take the live site offline and isolate the instance.",
  "Rotate every secret (database, API keys, session keys, admin logins).",
  "Restore from a known-good backup, not from the infected disk.",
  "Patch the hole, then re-run vulnerability and policy checks before going live.",
  "Tell the campus contact what happened and what was checked.",
  "Watch failed logins and odd admin actions for a period after.",
] as const;
