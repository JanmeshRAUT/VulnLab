# VulnLab Production Deployment Guide

## Architecture Overview
- **Backend**: FastAPI running on Python 3.12 (Render or containerized via Docker).
- **Frontend**: React + Vite SPA deployed on Vercel.
- **Database**: MongoDB Atlas Cluster (M10+ recommended for university loads).

---

## 1. Environment Configuration

### Backend Environment Variables (`render.yaml` / `.env`)
| Variable | Description | Required / Example |
| :--- | :--- | :--- |
| `ENVIRONMENT` | Environment mode (`prod` or `dev`) | `prod` |
| `MONGO_URI` | MongoDB Atlas replica set connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGO_DB` | MongoDB database name | `vuln_ecommerce_new` |
| `SECRET_KEY` | 32+ character cryptographic secret for session signing | Cryptographically random string |
| `FRONTEND_URL` | Primary allowed origin for CORS and CSRF checks | `https://vulnlab.vercel.app` |
| `FRONTEND_URLS` | Optional additional allowed frontend origins | `https://staging.vulnlab.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | `*.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret | `GOCSPX-...` |
| `ALLOWED_EMAIL_DOMAINS` | Comma-separated list or JSON array of student email domains | `university.edu,alumni.university.edu` |
| `SUPER_ADMIN_EMAILS` | Comma-separated list or JSON array of admin emails | `admin@university.edu` |
| `FORWARDED_ALLOW_IPS` | Trusted proxy IP addresses or subnets | `10.0.0.0/8,127.0.0.1` |
| `ALLOW_NO_SUPERADMIN` | Set to 1 only during initial bootstrap if admins are added manually | `0` |

### Frontend Environment Variables (`.env.production`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API base URL | `https://vulnlab-backend.onrender.com` |

---

## 2. Deployment Instructions

### Deploying the Backend on Render
1. Connect the GitHub repository to Render.
2. Select **Blueprint** using `render.yaml` or create a **Web Service** manually.
3. If creating manually:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2`
   - Health Check Path: `/health`
4. Configure required secrets in the Render Dashboard Environment tab.

### Deploying the Frontend on Vercel
1. Import the repository into Vercel.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Ensure `vercel.json` rewrite and CSP headers match your backend URL.

---

## 3. Database Maintenance, Backup & Restore

### MongoDB Atlas Setup
- **Network Access**: Add Render egress IP ranges or enable IP access lists with strict restrictions.
- **Indexes**: VulnLab automatically creates unique and TTL indexes at startup.

### Backup Strategy
```bash
# Automated dump using mongodump
mongodump --uri="mongodb+srv://<user>:<password>@cluster.mongodb.net/vuln_ecommerce_new" --out=/backups/$(date +%F)

# Automated restore using mongorestore
mongorestore --uri="mongodb+srv://<user>:<password>@cluster.mongodb.net/vuln_ecommerce_new" --drop /backups/2026-10-11/vuln_ecommerce_new/
```

---

## 4. Secret Rotation Procedure
1. **Rotate MongoDB Password**:
   - Create new database user credentials in Atlas.
   - Update `MONGO_URI` in Render Environment variables.
   - Trigger a zero-downtime deploy; delete old user from Atlas.
2. **Rotate `SECRET_KEY`**:
   - Generate a 64-character random hex string: `python -c "import secrets; print(secrets.token_hex(32))"`.
   - Update `SECRET_KEY` in Render. Existing active sessions will safely expire and require re-login.
3. **Rotate Google OAuth Secret**:
   - Generate new client secret in Google Cloud Console.
   - Update `GOOGLE_CLIENT_SECRET` in Render.

---

## 5. Security Incident Response Checklist
1. **Immediate Revocation**:
   - If an account is compromised, suspend the account via `/api/admin/users/{id}/suspend` or MongoDB update (`is_active: false`). Suspended accounts lose access immediately.
2. **Session Flush**:
   - Rotate `SECRET_KEY` in Render to immediately invalidate all student/admin session cookies.
3. **Audit Trail Review**:
   - Query the append-only `audit_logs` collection to examine actor actions, source IPs, affected resources, and request IDs.
4. **Log Inspection**:
   - Inspect structured JSON logs in Render or log drain (e.g. Datadog/BetterStack).
