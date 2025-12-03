# TEOS Bankchain AI Assistant

**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Production Ready

## Overview

The TEOS Bankchain AI Assistant is an enterprise-grade, compliance-aware chatbot that provides 24/7 support to users across the platform. Built with multi-language support, audit logging, and escalation workflows, the assistant integrates directly with our compliance documentation and regulatory frameworks.

## Key Features

### 1. Compliance Knowledge Base Integration

The AI assistant has direct access to:
- **KYC (Know Your Customer)** procedures and requirements
- **AML (Anti-Money Laundering)** monitoring and alert thresholds
- **Sanctions Screening** protocols (OFAC, EU, UN lists)
- **Regulatory Reporting** requirements and schedules
- **Audit Procedures** and export formats

All responses are sourced from official compliance documentation (`COMPLIANCE.md`, `RUNBOOK.md`) ensuring regulator-grade accuracy.

### 2. Multi-Language Support

#### Supported Languages
- **English (en)** - Default language
- **Arabic (ar)** - Full RTL (Right-to-Left) text support

#### Language Switching
Users can toggle between languages at any time using the globe icon in the chat header. The assistant automatically:
- Updates the UI direction (LTR/RTL)
- Translates all responses
- Maintains conversation context
- Logs the language preference

#### Implementation
\`\`\`typescript
const [language, setLanguage] = useState<"en" | "ar">("en")

// Toggle language
<Button onClick={() => setLanguage(language === "en" ? "ar" : "en")}>
  <Globe className="w-4 h-4 mr-1" />
  {language === "en" ? "AR" : "EN"}
</Button>
\`\`\`

### 3. Append-Only Audit Logging

Every interaction with the AI assistant is logged for compliance and transparency.

#### Logged Information
- User message content
- Assistant response
- Language used
- Timestamp (UTC)
- User ID
- IP address
- User agent
- Cryptographic hash (SHA-256)
- Previous log hash (creates tamper-proof chain)

#### Audit Log Structure
\`\`\`typescript
{
  event_type: "ai_assistant_interaction",
  user_id: "user_123",
  action: "chat_message",
  resource_type: "ai_assistant",
  details: {
    user_message: "What are KYC requirements?",
    assistant_response: "KYC requirements include...",
    language: "en",
    timestamp: "2024-12-15T10:30:00Z"
  },
  ip_address: "192.168.1.1",
  hash: "a3f5b8...",
  previous_hash: "c7d2e9...",
  signature: "RSA-SHA256..."
}
\`\`\`

#### API Endpoint
\`\`\`bash
POST /api/v1/compliance/audit-log
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "event_type": "ai_assistant_interaction",
  "action": "chat_message",
  "resource_type": "ai_assistant",
  "details": {
    "user_message": "...",
    "assistant_response": "...",
    "language": "en"
  }
}
\`\`\`

### 4. Escalation to Human Support

When the AI assistant cannot adequately answer a query, it offers escalation to human support.

#### Escalation Triggers
- Complex compliance questions beyond knowledge base
- User explicitly requests human support
- Technical issues requiring admin intervention
- Sensitive account matters

#### Escalation Flow
1. **Detection**: Assistant recognizes need for human support
2. **Notification**: Banner appears offering escalation option
3. **User Confirmation**: User clicks "Connect Now" button
4. **Audit Log**: Escalation event logged with full conversation history
5. **System Message**: User receives reference ID and estimated response time
6. **Support Notification**: Compliance officer dashboard receives alert

#### Implementation
\`\`\`typescript
const handleEscalation = async () => {
  // Log escalation event
  await apiClient.post("/api/v1/compliance/audit-log", {
    event_type: "ai_assistant_escalation",
    action: "escalate_to_human",
    resource_type: "ai_assistant",
    details: {
      conversation: messages,
      language: language,
      timestamp: new Date().toISOString()
    }
  })
  
  // Notify user
  const supportMessage = {
    role: "assistant",
    content: "A support specialist will contact you within 15 minutes..."
  }
}
\`\`\`

### 5. Quick Questions

Pre-defined quick questions help users get started:

**English:**
- How do I create a wallet?
- Check my transaction status
- What are compliance requirements?
- Talk to support

**Arabic:**
- كيف أنشئ محفظة؟
- تحقق من حالة المعاملة
- ما هي متطلبات الامتثال؟
- تحدث مع الدعم

## Technical Architecture

### Frontend Component
- **Location**: `components/ai-chat-assistant.tsx`
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components
- **State Management**: React hooks (useState, useEffect)

### Backend API
- **Location**: `backend/api/compliance.py`
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy
- **Security**: JWT authentication, RBAC

### Knowledge Base
- **Source**: `docs/COMPLIANCE.md`, `docs/RUNBOOK.md`
- **Format**: Markdown with structured sections
- **Updates**: Manual updates reflected immediately in responses

## Usage Examples

### Creating a Wallet
**User (English):** "How do I create a wallet?"

**Assistant:** "To create a wallet:

1. Go to the Wallets page
2. Click 'Create New Wallet'
3. Choose between custodial or non-custodial
4. Select your currency (EGP, USD, SAR, or PI)
5. Confirm creation

Your wallet will be ready instantly. Would you like help with anything else?"

### KYC Requirements
**User (Arabic):** "ما هي متطلبات اعرف عميلك؟"

**Assistant:** "متطلبات اعرف عميلك (KYC):

• الاسم القانوني الكامل
• تاريخ الميلاد والجنسية
• عنوان السكن
• الهوية الحكومية
• إثبات العنوان
• إقرار مصدر الأموال

عملية التحقق: تحميل المستندات ← التحقق الآلي ← فحص الحيوية ← تقييم المخاطر ← موافقة مسؤول الامتثال."

## Security & Privacy

### Data Protection
- All messages encrypted in transit (TLS 1.3)
- Audit logs encrypted at rest (AES-256)
- No sensitive data stored in client-side cache
- Automatic session timeout after 30 minutes of inactivity

### Access Control
- Authentication required (JWT tokens)
- Role-based permissions for audit log access
- Escalation requires verified user identity

### Compliance
- GDPR compliant (data minimization, purpose limitation)
- Egyptian Data Protection Law compliant
- Audit logs retained for 7 years (regulatory requirement)
- Regular security audits and penetration testing

## Monitoring & Analytics

### Key Metrics
- Total interactions per day/week/month
- Average response time
- Escalation rate
- Language distribution (EN vs AR)
- Most common questions
- User satisfaction (based on escalation patterns)

### Dashboards
Compliance officers can view AI assistant metrics in:
- `/admin/observability` - Real-time metrics
- `/audit` - Detailed audit logs with export
- Grafana dashboards - Historical trends

## Maintenance

### Updating Knowledge Base
1. Edit `docs/COMPLIANCE.md` or `docs/RUNBOOK.md`
2. Update `COMPLIANCE_KNOWLEDGE` object in `components/ai-chat-assistant.tsx`
3. Deploy updated frontend
4. Verify responses in staging environment
5. Deploy to production

### Adding New Languages
1. Add language code to `language` state type
2. Create translations in `QUICK_QUESTIONS` object
3. Add translations to `COMPLIANCE_KNOWLEDGE` object
4. Update language switcher UI
5. Test RTL/LTR rendering
6. Update documentation

### Troubleshooting

#### Assistant Not Responding
- Check browser console for errors
- Verify JWT token is valid
- Check network requests to `/api/v1/compliance/audit-log`
- Verify backend service is running

#### Audit Logs Not Being Created
- Check backend logs for database errors
- Verify PostgreSQL connection
- Check audit_log table exists
- Verify user has proper permissions

#### Language Switching Not Working
- Clear browser cache
- Check RTL/LTR CSS is loaded
- Verify language state is updating
- Check console for React errors

## Roadmap

### Upcoming Features
- **Voice Input**: Speech-to-text for accessibility
- **Document Upload**: Share compliance documents for analysis
- **Sentiment Analysis**: Detect frustrated users for proactive escalation
- **ML-Powered Responses**: Train custom models on historical conversations
- **Video Chat Escalation**: Direct video call with compliance officers
- **WhatsApp Integration**: Extend assistant to WhatsApp Business API

## Support

### Contact
- **Technical Issues**: dev@teos-egypt.com
- **Compliance Questions**: compliance@teos-egypt.com
- **Feature Requests**: product@teos-egypt.com

### Documentation
- Main README: `/docs/README.md`
- API Guide: `/docs/API_GUIDE.md`
- Compliance: `/docs/COMPLIANCE.md`
- Security: `/docs/SECURITY.md`

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Next Review:** March 2025  
**Owner:** TEOS Egypt / Elmahrosa Engineering Team
