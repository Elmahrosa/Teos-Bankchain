# TEOS Bankchain Security Documentation

## Overview

This document outlines the security architecture, threat model, and mitigations for the TEOS Bankchain platform.

---

## Security Architecture

### Defense in Depth

TEOS Bankchain implements multiple layers of security:

1. **Network Security**
   - HTTPS only (TLS 1.3)
   - WAF (Web Application Firewall)
   - DDoS protection
   - VPC isolation

2. **Application Security**
   - Input validation
   - Output encoding
   - CSRF protection
   - Rate limiting

3. **Authentication & Authorization**
   - OIDC + JWT
   - Role-Based Access Control (RBAC)
   - Multi-Factor Authentication (MFA)
   - Biometric authentication

4. **Data Security**
   - Encryption at rest (AES-256)
   - Encryption in transit (TLS 1.3)
   - Secrets management (Vault/Firebase)
   - Database encryption

5. **Monitoring & Response**
   - Real-time threat detection
   - Audit logging
   - Intrusion detection
   - Incident response

---

## Threat Model

### Assets

1. **User Data**
   - Personal Information (PII)
   - Financial data
   - Authentication credentials
   - Transaction history

2. **System Data**
   - API keys and secrets
   - Database credentials
   - Encryption keys
   - Audit logs

3. **Business Logic**
   - Transaction processing
   - Compliance checks
   - Settlement flows
   - FX conversion rates

### Threat Actors

1. **External Attackers**
   - Sophistication: Low to High
   - Motivation: Financial gain, data theft
   - Access: Public internet

2. **Malicious Insiders**
   - Sophistication: Medium to High
   - Motivation: Financial gain, sabotage
   - Access: Internal systems

3. **Nation State**
   - Sophistication: Very High
   - Motivation: Espionage, disruption
   - Access: Advanced persistent threats

### Attack Vectors

#### 1. Authentication Bypass

**Threat**: Attacker gains unauthorized access to user accounts

**Mitigations**:
- Strong password requirements (min 12 chars, complexity)
- MFA for privileged accounts (bank admins, compliance)
- Biometric authentication on mobile
- Account lockout after 5 failed attempts
- JWT tokens with short expiration (1 hour)
- Refresh tokens rotated on use

#### 2. SQL Injection

**Threat**: Attacker manipulates database queries

**Mitigations**:
- Parameterized queries (prepared statements)
- ORM usage (SQLAlchemy)
- Input validation and sanitization
- WAF rules for SQL injection patterns
- Principle of least privilege for DB users
- Regular security scanning

#### 3. Cross-Site Scripting (XSS)

**Threat**: Attacker injects malicious scripts

**Mitigations**:
- Content Security Policy (CSP)
- Output encoding
- XSS-safe templating (React)
- HTTPOnly cookies
- Input sanitization
- WAF XSS protection

#### 4. API Abuse

**Threat**: Attacker overwhelms or exploits APIs

**Mitigations**:
- Rate limiting (sliding window algorithm)
- API authentication required
- Request signing (HMAC-SHA256)
- Input validation on all endpoints
- Audit logging of all API calls
- Anomaly detection

#### 5. Data Breach

**Threat**: Unauthorized access to sensitive data

**Mitigations**:
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Database encryption
- Secrets in secure vault
- Access controls (RBAC)
- Data masking in logs
- Regular backups (encrypted)

#### 6. Insider Threat

**Threat**: Malicious employee accesses sensitive data

**Mitigations**:
- RBAC with least privilege
- Audit logging of all actions
- Multi-person approval for sensitive operations
- Background checks for employees
- Access reviews (quarterly)
- Monitoring of privileged accounts

#### 7. Denial of Service

**Threat**: Service availability disrupted

**Mitigations**:
- DDoS protection (Cloudflare)
- Rate limiting
- Auto-scaling
- Health checks and monitoring
- Circuit breakers
- Graceful degradation

#### 8. Supply Chain Attack

**Threat**: Compromised dependencies

**Mitigations**:
- Dependency scanning (Snyk, Dependabot)
- Automated security updates
- Lock files for reproducible builds
- Container scanning (Trivy)
- Signature verification
- Private package registry

---

## Security Controls

### Authentication

#### Password Requirements
- Minimum 12 characters
- Uppercase, lowercase, number, symbol
- No common passwords (dictionary check)
- Password history (last 5)
- Expiration: 90 days

#### MFA Requirements
- **Required for**: Bank admins, compliance officers, operations
- **Methods**: TOTP (Google Authenticator), SMS, biometric
- **Backup codes**: 10 one-time codes provided

#### Session Management
- Access tokens: 1 hour expiration
- Refresh tokens: 30 days, rotated on use
- Automatic logout after 30 minutes inactivity
- Concurrent session limit: 3 devices

### Authorization

#### Roles & Permissions

| Role | Permissions |
|------|-------------|
| Bank Admin | Full access, user management, system configuration |
| Compliance Officer | View all transactions, sanctions screening, audit logs |
| Operations | Transaction approval, settlement management |
| Business | Limited transaction creation, wallet management |
| Individual | Personal wallets, transaction history |
| Agent | Cash-in/out operations, limited user onboarding |

#### Approval Tiers

| Amount | Tier 1 | Tier 2 | Tier 3 |
|--------|--------|--------|--------|
| < $1,000 | Operations | - | - |
| $1,000 - $10,000 | Operations | Compliance | - |
| > $10,000 | Operations | Compliance | Bank Admin |

### Data Protection

#### Encryption

**At Rest**:
\`\`\`python
# Database encryption (PostgreSQL)
ssl_mode = 'require'
ssl_cert = '/path/to/client-cert.pem'
ssl_key = '/path/to/client-key.pem'
ssl_root_cert = '/path/to/ca-cert.pem'

# Application-level encryption
from cryptography.fernet import Fernet
cipher = Fernet(encryption_key)
encrypted = cipher.encrypt(sensitive_data.encode())
\`\`\`

**In Transit**:
\`\`\`nginx
# TLS 1.3 only
ssl_protocols TLSv1.3;
ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384';
ssl_prefer_server_ciphers on;
\`\`\`

#### Data Retention

| Data Type | Retention Period |
|-----------|------------------|
| Transaction records | 7 years (regulatory) |
| Audit logs | 5 years |
| User PII | Until account closure + 2 years |
| Backups | 90 days |

### Network Security

#### Firewall Rules

\`\`\`bash
# Allow HTTPS only
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow PostgreSQL from app servers only
iptables -A INPUT -p tcp --dport 5432 -s 10.0.1.0/24 -j ACCEPT

# Block all other incoming
iptables -P INPUT DROP
\`\`\`

#### VPC Configuration

\`\`\`yaml
# Network isolation
vpc:
  cidr: 10.0.0.0/16
  subnets:
    - public:
        - 10.0.1.0/24  # Load balancers
    - private:
        - 10.0.10.0/24  # Application servers
        - 10.0.20.0/24  # Database servers
  
  security_groups:
    - web:
        ingress:
          - port: 443
            source: 0.0.0.0/0
    - app:
        ingress:
          - port: 8000
            source: web-sg
    - db:
        ingress:
          - port: 5432
            source: app-sg
\`\`\`

---

## Compliance

### Regulatory Requirements

#### PCI-DSS (Payment Card Industry)
- Secure network configuration
- Protect cardholder data
- Vulnerability management
- Access control measures
- Network monitoring
- Security policies

#### GDPR (General Data Protection Regulation)
- Data subject rights
- Consent management
- Data breach notification (72 hours)
- Data portability
- Right to erasure

#### AML/CFT (Anti-Money Laundering)
- Customer due diligence
- Transaction monitoring
- Suspicious activity reporting
- Sanctions screening
- Record keeping (5 years)

### Audit Requirements

#### Internal Audits
- **Frequency**: Quarterly
- **Scope**: Access controls, audit logs, compliance checks
- **Report to**: Compliance Officer, CTO

#### External Audits
- **Frequency**: Annual
- **Scope**: Full security assessment, penetration testing
- **Certification**: SOC 2 Type II

---

## Incident Response

### Incident Classification

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | Data breach, system compromise | Immediate |
| High | Service outage, security vulnerability | 1 hour |
| Medium | Performance issue, minor security issue | 4 hours |
| Low | Cosmetic bug, feature request | 1 business day |

### Response Procedures

#### Data Breach Response

1. **Containment** (0-1 hour)
   - Isolate affected systems
   - Revoke compromised credentials
   - Block malicious IPs

2. **Investigation** (1-4 hours)
   - Identify scope of breach
   - Determine data accessed
   - Preserve evidence

3. **Notification** (Within 72 hours)
   - Notify affected users
   - Regulatory reporting
   - Public disclosure (if required)

4. **Remediation** (1-2 weeks)
   - Patch vulnerabilities
   - Reset credentials
   - Enhance monitoring

5. **Post-Mortem** (Within 1 week)
   - Root cause analysis
   - Action items
   - Policy updates

---

## Security Testing

### Automated Testing

\`\`\`yaml
# .github/workflows/security.yml
- name: Dependency scan
  run: |
    npm audit
    pip-audit
    
- name: SAST
  run: |
    bandit -r backend/
    semgrep --config=auto
    
- name: Container scan
  run: |
    trivy image teos-backend:latest
    
- name: Secrets scan
  run: |
    gitleaks detect
\`\`\`

### Manual Testing

- **Penetration Testing**: Annual, by third-party firm
- **Code Review**: All PRs require security review
- **Architecture Review**: Quarterly, for new features

---

## Security Contacts

| Role | Email | PGP Key |
|------|-------|---------|
| Security Team | security@teos-bankchain.com | [Link] |
| Bug Bounty | bugbounty@teos-bankchain.com | [Link] |
| Incident Response | incident@teos-bankchain.com | [Link] |

### Responsible Disclosure

If you discover a security vulnerability, please:

1. **DO NOT** publicly disclose the issue
2. Email security@teos-bankchain.com with details
3. Allow 90 days for remediation
4. Receive credit in our hall of fame (if desired)

**Bug Bounty Rewards**:
- Critical: $5,000 - $10,000
- High: $1,000 - $5,000
- Medium: $500 - $1,000
- Low: $100 - $500

---

**Version**: 1.0  
**Effective Date**: December 2025  
**Last Updated**: December 2025  
**Classification**: Internal  
**Next Review**: March 2026
