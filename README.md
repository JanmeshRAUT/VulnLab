# VulnLab - Cybersecurity Education & Vulnerability Simulation Platform

VulnLab is a full-stack interactive training environment providing students with realistic, hands-on cybersecurity laboratories modeled after real-world vulnerabilities.

---

## Features
- **8 Dedicated Security Labs**:
  - **Lab 1**: Path Traversal (Simulated virtual file systems)
  - **Lab 2**: Broken Authentication & SQL/NoSQL Injection
  - **Lab 3**: Two-Factor Authentication & Brute-Force Testing
  - **Lab 4**: Server-Side Request Forgery (SSRF) (Simulated network dispatcher)
  - **Lab 5**: File Upload Vulnerabilities (In-memory bounded storage)
  - **Lab 6**: OS Command Injection (Safe sandboxed engine)
  - **Lab 7**: SQL Injection (Ephemeral in-memory SQLite per session)
  - **Lab 8**: Cross-Site Scripting (XSS) (Server-side detector with sandboxed iframes)
- **Hardened Platform Infrastructure**:
  - Sandboxed execution guarantees: real filesystem, operating system, and external network are fully protected.
  - Strict session management and CSRF prevention.
  - Role-based Access Control (RBAC) with granular admin controls, audit logging, and bulk cohort management.
  - User-keyed rate limiting (`u:<user_id>`).
  - Production readiness probes (`/health`, `/ready`) and structured JSON logging.

---

## Quick Start (Local Development)

### 1. Prerequisites
- Python 3.11+ (or Python 3.12)
- Node.js 20+ & npm
- MongoDB running locally or MongoDB Atlas

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate virtual environment
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your SECRET_KEY and optional credentials in .env
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to explore VulnLab.

---

## Testing & Quality Assurance

### Run Backend Tests & Exploit Suites
```bash
cd backend
python -m pytest
```

### Run Lab Sandbox Static Check
```bash
cd backend
pytest tests/test_lab_sandbox.py
```

### Build Frontend
```bash
cd frontend
npm run build
```

---

## Documentation
- [Security Model & Sandboxing (SECURITY.md)](SECURITY.md)
- [Deployment & Operation Guide (DEPLOYMENT.md)](DEPLOYMENT.md)
