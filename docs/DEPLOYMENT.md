# TEOS Bankchain - Deployment Guide

## Deployment Overview

TEOS Bankchain supports multiple deployment strategies:
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

## Environment Requirements

### Backend (FastAPI)
- Python 3.11+
- PostgreSQL 14+
- Redis 7+ (optional but recommended)
- 2GB RAM minimum (4GB recommended)
- 2 vCPUs minimum

### Frontend (Next.js)
- Node.js 18+
- 1GB RAM minimum
- 1 vCPU minimum

### Database
- PostgreSQL 14+ with async support
- 10GB storage minimum
- Automated backups enabled
- SSL/TLS encryption

## Backend Deployment

### Option 1: Vercel (Serverless)

Unfortunately, FastAPI cannot be deployed directly to Vercel. Use Option 2 or 3.

### Option 2: Railway / Render

1. **Create Account** on Railway.app or Render.com

2. **Create New Project**
   - Connect GitHub repository
   - Select `backend` directory
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Configure Environment Variables**
   \`\`\`
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   PI_API_KEY=your-pi-api-key
   FX_API_KEY=your-fx-api-key
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   \`\`\`

4. **Deploy**: Push to main branch

### Option 3: Docker + VPS

1. **Build Docker Image**
   \`\`\`bash
   cd backend
   docker build -t teos-bankchain-api .
   \`\`\`

2. **Run Container**
   \`\`\`bash
   docker run -d \
     -p 8000:8000 \
     -e DATABASE_URL=postgresql://... \
     -e SECRET_KEY=your-secret-key \
     --name teos-api \
     teos-bankchain-api
   \`\`\`

3. **Setup Nginx Reverse Proxy**
   \`\`\`nginx
   server {
       listen 80;
       server_name api.teos-bankchain.com;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   \`\`\`

4. **Enable SSL with Let's Encrypt**
   \`\`\`bash
   sudo certbot --nginx -d api.teos-bankchain.com
   \`\`\`

### Option 4: AWS / Google Cloud / Azure

1. **Container Registry**: Push Docker image to ECR/GCR/ACR
2. **Compute**: Deploy to ECS/Cloud Run/Container Instances
3. **Database**: Use managed PostgreSQL (RDS/Cloud SQL/Azure Database)
4. **Secrets**: Use AWS Secrets Manager / GCP Secret Manager / Azure Key Vault
5. **Monitoring**: CloudWatch / Cloud Logging / Azure Monitor

## Frontend Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Login to Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy Frontend**
   \`\`\`bash
   cd frontend/web
   vercel --prod
   \`\`\`

4. **Set Environment Variables** in Vercel Dashboard
   \`\`\`
   NEXT_PUBLIC_API_URL=https://api.teos-bankchain.com
   NEXT_PUBLIC_WS_URL=wss://api.teos-bankchain.com
   \`\`\`

5. **Configure Domain** in Vercel settings

### Alternative: Netlify / Amplify

Similar steps to Vercel - connect GitHub repo and configure build settings.

## Database Setup

### PostgreSQL on Supabase (Recommended)

1. **Create Project** at supabase.com

2. **Get Connection String** from project settings

3. **Run Migrations**
   \`\`\`bash
   cd backend
   # Install Alembic
   pip install alembic
   
   # Create migration
   alembic revision --autogenerate -m "Initial schema"
   
   # Apply migration
   alembic upgrade head
   \`\`\`

4. **Enable Row Level Security (RLS)**
   - Enable RLS on all tables
   - Create policies for user access

### Alternative: Neon / Railway

Similar setup to Supabase - create database and apply migrations.

## Mobile App Deployment

### Android (Google Play Store)

1. **Build Release APK**
   \`\`\`bash
   cd mobile/android
   npm run sync
   npx cap open android
   \`\`\`

2. **In Android Studio**
   - Build > Generate Signed Bundle / APK
   - Select "Android App Bundle"
   - Create or select signing key
   - Build release bundle

3. **Upload to Google Play Console**
   - Create app listing
   - Upload AAB file
   - Complete store listing
   - Submit for review

### iOS (Apple App Store)

1. **Build Release**
   \`\`\`bash
   cd mobile/ios
   npm run sync
   npx cap open ios
   \`\`\`

2. **In Xcode**
   - Product > Archive
   - Validate archive
   - Distribute to App Store

3. **Upload to App Store Connect**
   - Create app listing
   - Submit for review
   - Wait for approval

## Environment Variables

### Backend (.env)
\`\`\`bash
# Environment
DEBUG=false
ENVIRONMENT=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/teos_bankchain

# Security
SECRET_KEY=your-256-bit-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Keys
PI_API_KEY=your-pi-network-api-key
FX_API_KEY=your-fx-rate-api-key

# CORS
ALLOWED_ORIGINS=https://teos-bankchain.com,https://www.teos-bankchain.com

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CREDENTIALS_PATH=/path/to/credentials.json
\`\`\`

### Frontend (.env.local)
\`\`\`bash
NEXT_PUBLIC_API_URL=https://api.teos-bankchain.com
NEXT_PUBLIC_WS_URL=wss://api.teos-bankchain.com
NEXT_PUBLIC_ENV=production
\`\`\`

## SSL/TLS Configuration

### Backend
- Use Let's Encrypt for free SSL certificates
- Configure Nginx/Caddy as reverse proxy
- Enable HTTP/2 and TLS 1.3
- Implement HSTS headers

### Frontend
- Vercel provides automatic HTTPS
- Custom domain requires DNS configuration
- Enable automatic certificate renewal

## Monitoring & Logging

### Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **New Relic**: Application performance monitoring

### Infrastructure Monitoring
- **Datadog**: Full-stack monitoring
- **Prometheus + Grafana**: Metrics and dashboards
- **UptimeRobot**: Uptime monitoring and alerts

### Log Aggregation
- **Papertrail**: Log management
- **Loggly**: Log analysis
- **ELK Stack**: Elasticsearch, Logstash, Kibana

## Backup & Disaster Recovery

### Database Backups
- Automated daily backups
- Point-in-time recovery enabled
- Off-site backup storage
- Test restore procedures monthly

### Application Backups
- Git repository backups
- Container image backups
- Configuration backups

### Disaster Recovery Plan
1. **Backup Verification**: Weekly automated tests
2. **Recovery Time Objective (RTO)**: < 4 hours
3. **Recovery Point Objective (RPO)**: < 1 hour
4. **Failover Procedures**: Documented and tested quarterly

## Security Checklist

- [ ] HTTPS enabled on all endpoints
- [ ] Secrets stored in secret manager (not in code)
- [ ] Database uses SSL/TLS connections
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers set (CSP, HSTS, X-Frame-Options)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection enabled
- [ ] Regular security scans scheduled
- [ ] Dependency vulnerability scanning
- [ ] Penetration testing completed

## CI/CD Pipeline

### GitHub Actions Example

\`\`\`yaml
name: Deploy Backend

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          cd backend
          pip install -r requirements.txt
          pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy commands here
\`\`\`

## Post-Deployment Verification

1. **Health Check**: Verify `/health` endpoint returns 200
2. **Database Connection**: Verify database connectivity
3. **Authentication**: Test login flow
4. **API Endpoints**: Smoke test critical endpoints
5. **WebSocket**: Verify real-time connections
6. **Mobile Apps**: Test on physical devices

## Rollback Procedure

1. **Identify Issue**: Monitor logs and metrics
2. **Decision**: Determine if rollback is necessary
3. **Execute Rollback**:
   \`\`\`bash
   # Revert to previous deployment
   vercel rollback
   
   # Or redeploy previous version
   git revert <commit>
   git push
   \`\`\`
4. **Verify**: Run post-deployment checks
5. **Investigate**: Analyze what went wrong

## Support & Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify DATABASE_URL is correct
- Check firewall rules
- Ensure SSL is configured

**CORS Errors**
- Add frontend URL to ALLOWED_ORIGINS
- Check for trailing slashes

**Authentication Failures**
- Verify SECRET_KEY matches across environments
- Check token expiration settings

### Getting Help
- **Documentation**: https://docs.teos-bankchain.com
- **Support Email**: ayman@teosegypt.com
- **Website**: bankchain.teosegypt.com
- **WhatsApp**: +201006167293

---

*Document Version: 1.0*  
*Last Updated: December 2024*
