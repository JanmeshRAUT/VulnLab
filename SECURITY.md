# VulnLab Security Architecture & Threat Model

## Overview
VulnLab is a purpose-built cybersecurity education and training platform. It exposes intentional vulnerabilities designed for pedagogical hands-on training while rigidly enforcing strict security controls across the hosting platform, infrastructure, real filesystem, and user authentication systems.

---

## 1. Vulnerability Architecture: Intentional vs. Platform

| Category | Description | Sandboxing & Protection Mechanism |
| :--- | :--- | :--- |
| **Lab 1: Path Traversal** | Intentional traversal sequences (`../`, nested patterns, absolute paths). | Fully in-memory virtual filesystem mapped by variant. **Zero disk reads/writes**. Never touches host `/etc` or real project directories. |
| **Lab 2: Authentication Bypasses** | Intentional SQL/NoSQL injection in login/status checks. | Isolated in-memory simulated evaluation models. Never affects platform accounts collection. |
| **Lab 3: 2FA & Brute Force** | Intentional 4-digit OTP or timing windows on target accounts (`wiener`, `carlos`). | Ephemeral OTP state stored in Mongo instance records with cryptographic RNG (`secrets.choice`). Dedicated per-user rate limits; host platform login is unaffected. |
| **Lab 4: SSRF** | Intentional request redirection to cloud metadata or internal services. | Fully simulated in-process network dispatcher. Outbound HTTP requests from Python are completely disabled in lab code. |
| **Lab 5: File Upload & RCE** | Simulated file upload vulnerabilities (PHP/script execution). | Uploaded files are stored in-memory/MongoDB with instance-scoped limits (1 MB max per chunk/total, max 5 files). Served strictly as `Content-Type: text/plain` with `Content-Security-Policy: sandbox; default-src 'none'`. No disk execution. |
| **Lab 6: Command Injection** | Simulated command chaining (`|`, `;`, `&&`). | Evaluated against a safe simulated engine. `subprocess`, `os.system`, `eval`, and `exec` are banned and enforced via automated static CI checks. |
| **Lab 7: SQL Injection** | Simulated blind/error-based SQL injection. | Isolated, ephemeral in-memory SQLite instances per lab session. Completely partitioned from host MongoDB databases. |
| **Lab 8: Cross-Site Scripting (XSS)** | Reflected and stored XSS test vectors. | Monitored by a server-side simulated headless DOM/XSS detector (`/api/lab8/1/detect`, `/api/lab8/2/profile`). Lab pages render untrusted HTML inside sandboxed iframes (`sandbox="allow-scripts"` without `allow-same-origin`), isolating student credentials, session cookies, and admin APIs. |

---

## 2. Platform Threat Model & Controls

### Authentication & Authorization
- **Session Protection**: HttpOnly, SameSite=Lax (or Strict in prod), Secure cookies. Sessions only store user identifiers (`user_id`).
- **Role Isolation**: RBAC with fixed permission sets (`student`, `instructor`, `admin`, `super_admin`). Privilege escalation, self-role assignment, and modifying built-in roles are denied. Demoting or deleting the final `super_admin` is programmatically blocked.
- **CSRF & Origin Verification**: Custom headers and Origin/Referer header checks against verified `FRONTEND_URL` / `FRONTEND_URLS`.

### Rate Limiting & Denial of Service Protection
- Distributed rate limits keyed primarily by authenticated `user_id` with client IP fallback (`u:<user_id>` / `ip:<client_ip>`).
- Endpoint protection:
  - Auth (`/api/auth/login`, `/api/auth/register`): 10 req/min
  - Flag submissions (`/api/instances/submit-flag`): 10 req/min
  - Instance launches (`/api/instances/launch`): 5 req/min
  - General lab interactions: 60 req/min

### CI & Automated Auditing
- Continuous automated static analysis via `bandit` and `ruff`.
- Sandbox integrity enforcement (`test_lab_sandbox.py`) fails CI if `open(`, `os.path.join(`, `subprocess`, `aiohttp`, `urllib.request`, `eval(`, or `exec(` are introduced in lab code.
- Automated dependency auditing (`pip-audit`, `npm audit --omit=dev`).
- Secret leakage detection via `gitleaks`.

---

## 3. Vulnerability Reporting
If you discover an unintended vulnerability in the platform infrastructure, please submit a report to the security administrators immediately. Do not disclose findings publicly until resolved.
