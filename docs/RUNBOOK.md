# TEOS Bankchain Operations Runbook

**Version**: 1.0  
**Effective Date**: December 2025  
**Last Updated**: December 2025  
**Classification**: Internal - Operations Team Only  
**Next Review**: March 2026

## Overview

This runbook provides step-by-step procedures for handling incidents, performing maintenance, and managing the TEOS Bankchain platform.

## Table of Contents

1. [Incident Response](#incident-response)
2. [System Health Checks](#system-health-checks)
3. [Database Operations](#database-operations)
4. [Deployment Procedures](#deployment-procedures)
5. [Rollback Procedures](#rollback-procedures)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Common Issues](#common-issues)

---

## Incident Response

### Severity Levels

- **P0 (Critical)**: Complete service outage, data loss, security breach
- **P1 (High)**: Major functionality impaired, performance degradation >50%
- **P2 (Medium)**: Minor functionality impaired, workarounds available
- **P3 (Low)**: Cosmetic issues, feature requests

### Incident Response Process

#### 1. Detection & Triage (0-5 minutes)

\`\`\`bash
# Check system health
curl https://api.teos-bankchain.com/health

# Check Grafana dashboards
https://grafana.teos-bankchain.com/d/overview

# Review Sentry errors
https://sentry.io/teos-bankchain/
\`\`\`

#### 2. Initial Response (5-15 minutes)

1. **Acknowledge the incident** in PagerDuty/Slack
2. **Assess severity** using the table above
3. **Start incident channel** (#incident-YYYYMMDD-number)
4. **Assign incident commander** (on-call engineer)

#### 3. Investigation (15-60 minutes)

\`\`\`bash
# Check application logs
kubectl logs -f deployment/teos-backend --tail=100

# Check database performance
psql -h $DB_HOST -U $DB_USER -c "SELECT * FROM pg_stat_activity;"

# Check Redis cache
redis-cli INFO stats

# Review Prometheus metrics
curl http://prometheus:9090/api/v1/query?query=http_requests_total
\`\`\`

#### 4. Resolution & Communication

- Update incident channel every 15 minutes
- Document all actions taken
- Notify stakeholders via status page

#### 5. Post-Incident (Within 24 hours)

1. **Create post-mortem document**
2. **Identify root cause**
3. **Document action items**
4. **Schedule follow-up review**

---

## System Health Checks

### Daily Health Check Procedure

\`\`\`bash
#!/bin/bash
# Daily health check script

echo "=== TEOS Bankchain Health Check ==="
echo "Date: $(date)"

# 1. API Health
echo "\n[API Health]"
curl -s https://api.teos-bankchain.com/health | jq '.'

# 2. Database Connectivity
echo "\n[Database]"
psql -h $DB_HOST -U $DB_USER -c "SELECT version();" > /dev/null && echo "✓ Connected" || echo "✗ Failed"

# 3. Redis Status
echo "\n[Redis Cache]"
redis-cli ping > /dev/null && echo "✓ Connected" || echo "✗ Failed"

# 4. Check Disk Space
echo "\n[Disk Space]"
df -h | grep -E '(Filesystem|/dev/)'

# 5. Check API Response Times
echo "\n[API Performance]"
time curl -s https://api.teos-bankchain.com/v1/wallets > /dev/null

# 6. Check Failed Transactions
echo "\n[Failed Transactions - Last 24h]"
psql -h $DB_HOST -U $DB_USER -c "SELECT COUNT(*) FROM transactions WHERE status='failed' AND created_at > NOW() - INTERVAL '24 hours';"

# 7. Check Compliance Alerts
echo "\n[Open Compliance Alerts]"
psql -h $DB_HOST -U $DB_USER -c "SELECT COUNT(*) FROM compliance_alerts WHERE status='open';"

echo "\n=== Health Check Complete ==="
\`\`\`

---

## Database Operations

### Backup Procedures

\`\`\`bash
# Full database backup
pg_dump -h $DB_HOST -U $DB_USER -d teos_bankchain -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# Verify backup
pg_restore --list backup_*.dump | head -20

# Upload to S3
aws s3 cp backup_*.dump s3://teos-backups/database/
\`\`\`

### Restore Procedures

\`\`\`bash
# Download backup from S3
aws s3 cp s3://teos-backups/database/backup_20240115_120000.dump .

# Restore database
pg_restore -h $DB_HOST -U $DB_USER -d teos_bankchain -c backup_20240115_120000.dump

# Verify restore
psql -h $DB_HOST -U $DB_USER -d teos_bankchain -c "SELECT COUNT(*) FROM users;"
\`\`\`

### Database Migrations

\`\`\`bash
# Run pending migrations
cd backend
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# Create new migration
alembic revision --autogenerate -m "Add new table"
\`\`\`

---

## Deployment Procedures

### Backend Deployment

\`\`\`bash
# 1. Pre-deployment checks
./scripts/pre-deploy-check.sh

# 2. Build Docker image
docker build -t teos-backend:$VERSION -f backend/Dockerfile backend/

# 3. Tag and push
docker tag teos-backend:$VERSION gcr.io/teos-project/backend:$VERSION
docker push gcr.io/teos-project/backend:$VERSION

# 4. Deploy to Kubernetes
kubectl set image deployment/teos-backend backend=gcr.io/teos-project/backend:$VERSION

# 5. Monitor rollout
kubectl rollout status deployment/teos-backend

# 6. Smoke tests
curl https://api.teos-bankchain.com/health
curl https://api.teos-bankchain.com/v1/wallets
\`\`\`

### Frontend Deployment

\`\`\`bash
# 1. Build production bundle
cd frontend/web
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Verify deployment
curl https://app.teos-bankchain.com
\`\`\`

---

## Rollback Procedures

### Emergency Rollback

\`\`\`bash
# 1. Identify previous version
kubectl rollout history deployment/teos-backend

# 2. Rollback
kubectl rollout undo deployment/teos-backend

# 3. Verify rollback
kubectl rollout status deployment/teos-backend

# 4. Check health
curl https://api.teos-bankchain.com/health
\`\`\`

### Database Rollback

\`\`\`bash
# Rollback last migration
alembic downgrade -1

# Rollback to specific version
alembic downgrade abc123def456
\`\`\`

---

## Monitoring & Alerts

### Critical Alerts

#### High Error Rate

**Alert**: API error rate > 5%

**Investigation**:
\`\`\`bash
# Check recent errors
kubectl logs -f deployment/teos-backend --tail=100 | grep ERROR

# Check Sentry for patterns
# Visit: https://sentry.io/teos-bankchain/issues/

# Check database connections
psql -h $DB_HOST -U $DB_USER -c "SELECT COUNT(*), state FROM pg_stat_activity GROUP BY state;"
\`\`\`

**Resolution**:
- Scale up pods if CPU/memory constrained
- Check database query performance
- Review recent deployments

#### Database Connection Exhausted

**Alert**: Available database connections < 10

**Investigation**:
\`\`\`bash
# Check active connections
psql -h $DB_HOST -U $DB_USER -c "SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active';"

# Kill long-running queries
psql -h $DB_HOST -U $DB_USER -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < NOW() - INTERVAL '5 minutes';"
\`\`\`

**Resolution**:
- Increase connection pool size
- Optimize long-running queries
- Scale database instance

#### Sanctions Screening Failures

**Alert**: Sanctions API error rate > 10%

**Investigation**:
\`\`\`bash
# Check sanctions service logs
kubectl logs -f deployment/teos-backend | grep "sanctions"

# Test OFAC API
curl "https://api.trade.gov/consolidated_screening_list/search?name=test"
\`\`\`

**Resolution**:
- Check API credentials
- Verify network connectivity
- Switch to backup provider
- Queue checks for retry

---

## Common Issues

### Issue: High Database Latency

**Symptoms**: API response times > 1s, database queries slow

**Diagnosis**:
\`\`\`bash
# Check slow queries
psql -h $DB_HOST -U $DB_USER -c "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# Check table bloat
psql -h $DB_HOST -U $DB_USER -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;"
\`\`\`

**Resolution**:
1. Add missing indexes
2. Run VACUUM ANALYZE
3. Optimize queries with EXPLAIN
4. Consider read replicas

### Issue: Redis Cache Misses

**Symptoms**: High database load, slow API responses

**Diagnosis**:
\`\`\`bash
# Check cache hit rate
redis-cli INFO stats | grep keyspace

# Check memory usage
redis-cli INFO memory
\`\`\`

**Resolution**:
1. Increase cache TTL
2. Warm up cache after deployment
3. Add more Redis memory
4. Review cache invalidation logic

### Issue: Failed Settlements

**Symptoms**: Transactions stuck in pending, settlement_completed events not firing

**Diagnosis**:
\`\`\`bash
# Check pending settlements
psql -h $DB_HOST -U $DB_USER -c "SELECT * FROM settlements WHERE status = 'pending' AND created_at < NOW() - INTERVAL '1 hour';"

# Check settlement job logs
kubectl logs -f deployment/settlement-worker
\`\`\`

**Resolution**:
1. Manually trigger settlement job
2. Check external API connectivity
3. Review settlement cutoff times
4. Verify bank API credentials

---

## Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| On-Call Engineer | Rotation | +20-XXX-XXXX | oncall@teos-bankchain.com |
| Tech Lead | - | +20-XXX-XXXX | tech@teos-bankchain.com |
| Security Team | - | +20-XXX-XXXX | security@teos-bankchain.com |
| Compliance Officer | - | +20-XXX-XXXX | compliance@teos-bankchain.com |

## Escalation Path

1. **Level 1**: On-call engineer (0-15 min)
2. **Level 2**: Tech lead (15-30 min)
3. **Level 3**: CTO (30-60 min)
4. **Level 4**: Executive team (60+ min)
