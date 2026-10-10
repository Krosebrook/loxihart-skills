# Security Checklist

## Input Validation
- [ ] All string inputs validated (non-empty, length limits)
- [ ] Numeric inputs have min/max bounds
- [ ] Enum values checked against whitelist
- [ ] SQL injection prevention (parameterized queries or regex filters)
- [ ] Path traversal prevention (no `../` in file paths)
- [ ] URL validation (allowed domains only)

## Authentication & Authorization
- [ ] API keys loaded from environment variables only
- [ ] Never log secrets or tokens
- [ ] Implement least privilege (minimal required scopes)
- [ ] Explicit permission checks before operations
- [ ] Token expiration handled gracefully

## Rate Limiting
- [ ] Per-user rate limits implemented
- [ ] Per-endpoint rate limits implemented
- [ ] Burst protection (prevent spike attacks)
- [ ] Clear error messages when rate limited

## Error Handling
- [ ] Errors follow cause→fix→retry pattern
- [ ] No secret leakage in error messages
- [ ] Stack traces sanitized in production
- [ ] Failed requests logged for monitoring

## Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS/TLS for all API calls
- [ ] No PII in logs
- [ ] Secure cookie settings (HttpOnly, Secure, SameSite)

## Deployment
- [ ] `.env` file in `.gitignore`
- [ ] `.env.example` provided with placeholders
- [ ] Secrets in environment (never in code)
- [ ] Security headers configured (CSP, HSTS, etc.)
