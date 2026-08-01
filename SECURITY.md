# 🔐 Security Policy

Security and responsible vulnerability disclosure are important to the **Flow Task Manager** project.

This document explains how to report potential security vulnerabilities and provides guidelines for responsible disclosure.

---

## 📌 Supported Versions

Flow Task Manager is currently maintained from the latest version available on the `main` branch.

| Version | Supported |
|---|---|
| Latest `main` branch | ✅ Yes |
| Older versions | ❌ No |
| Forks and modified distributions | ❌ No |

Security fixes, when required, will be applied to the actively maintained version of the project.

---

## 🛡️ Security Scope

Flow Task Manager is a client-side web application built using:

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Local Storage API

The application currently does not require:

- A backend server
- User authentication
- A remote database
- Server-side sessions
- Cloud-based task storage

However, client-side applications can still contain security vulnerabilities.

Relevant security concerns may include:

- DOM-based Cross-Site Scripting (XSS)
- Unsafe DOM manipulation
- Improper input handling
- Injection of untrusted HTML
- Local Storage misuse
- Exposure of sensitive information
- Unsafe external resources
- Insecure third-party integrations
- Accidental exposure of API keys or credentials
- Browser-specific security issues

---

## 🚨 Reporting a Vulnerability

If you discover a potential security vulnerability, please report it responsibly.

Avoid publicly disclosing exploitable security issues before they have been reviewed.

When possible, use GitHub's private vulnerability reporting functionality through the repository's **Security** section.

If private reporting is unavailable, contact the repository maintainer through an appropriate private communication channel rather than publishing exploit details in a public issue.

---

## 📋 What to Include in a Security Report

A useful vulnerability report should include:

- A clear description of the vulnerability
- The affected component or file
- Steps required to reproduce the issue
- Expected behavior
- Actual behavior
- Potential security impact
- Browser and operating system information
- Screenshots or recordings when relevant
- Proof-of-concept details when necessary
- Suggested remediation, if known

Please provide enough information for the issue to be reproduced and evaluated.

---

## 🔎 Example Report Structure

```text
Title:
DOM-based XSS in task rendering

Affected Component:
script.js

Description:
Describe how untrusted input reaches an unsafe DOM rendering operation.

Steps to Reproduce:
1. Open the application
2. Perform the affected action
3. Provide the relevant test input
4. Observe the resulting behavior

Expected Behavior:
User-controlled content should be rendered safely.

Actual Behavior:
Describe the unexpected behavior.

Impact:
Explain the potential security consequences.

Environment:
Browser:
Browser Version:
Operating System:
```

Do not include real credentials, private information, or unrelated sensitive data in vulnerability reports.

---

## ⚠️ Please Do Not

When investigating or reporting a vulnerability:

- Do not intentionally compromise another person's data
- Do not perform destructive testing
- Do not attempt unauthorized access to external systems
- Do not publish sensitive vulnerability details before remediation
- Do not use security findings for malicious purposes
- Do not include passwords, tokens, API keys, or personal information in reports

Only test environments and data that you are authorized to use.

---

## 💾 Local Storage Considerations

Flow Task Manager uses the browser's **Local Storage API** for client-side persistence.

Local Storage should not be treated as secure storage for sensitive information.

The application should never intentionally store information such as:

```text
Passwords
Authentication tokens
Private API keys
Access credentials
Financial information
Sensitive personal information
```

Task information stored in Local Storage is accessible within the browser environment for the application's origin.

Users should avoid entering highly sensitive information into tasks.

---

## 🔑 Secrets and Credentials

API keys, passwords, access tokens, private keys, and other credentials must never be committed to the repository.

Sensitive configuration should not be hard-coded into:

```text
index.html
styles.css
script.js
```

If future versions introduce external APIs or backend services, secrets should be managed through appropriate server-side configuration or secure environment-management mechanisms.

Client-side JavaScript must not be considered a secure location for private credentials.

---

## 🧑‍💻 Secure Development Guidelines

Contributors should follow secure frontend development practices.

### Input Handling

- Treat user-controlled input as untrusted
- Validate input where appropriate
- Avoid inserting untrusted content as executable HTML
- Prefer safe DOM APIs such as `textContent` when rendering plain text

### DOM Manipulation

Avoid unsafe patterns involving untrusted data, such as:

```javascript
element.innerHTML = userInput;
```

For plain text, prefer:

```javascript
element.textContent = userInput;
```

If HTML rendering becomes necessary, input must be handled using an appropriate sanitization strategy.

### External Resources

- Use trusted external resources
- Prefer HTTPS
- Review third-party scripts before integration
- Minimize unnecessary dependencies
- Keep dependencies updated if introduced in future versions

---

## 📦 Dependency Security

The current core application is implemented using Vanilla JavaScript and does not require a runtime package dependency ecosystem.

If third-party dependencies are introduced later:

- Keep dependencies updated
- Remove unused packages
- Review known security advisories
- Avoid unmaintained dependencies
- Commit lock files when appropriate
- Review dependency changes before merging

---

## 🧪 Security Review

Security-related changes should be tested carefully before being merged.

Review areas may include:

- Input validation
- DOM rendering
- Local Storage operations
- External resource loading
- URL handling
- User-controlled content
- Third-party scripts
- Configuration changes

---

## 🔄 Vulnerability Handling Process

Reported vulnerabilities will generally follow this process:

```text
Security Report
      ↓
Initial Review
      ↓
Reproduction & Validation
      ↓
Impact Assessment
      ↓
Remediation
      ↓
Verification
      ↓
Responsible Disclosure
```

Resolution time may vary depending on severity, reproducibility, and project scope.

---

## 📢 Public Disclosure

Please allow reasonable time for a reported vulnerability to be investigated and addressed before publicly sharing technical details.

Responsible disclosure helps protect users while allowing maintainers to implement and verify an appropriate fix.

---

## 📜 Policy Updates

This security policy may evolve as Flow Task Manager introduces new functionality, integrations, deployment environments, or architectural components.

The latest version of this document in the `main` branch represents the current project security policy.

---

## 🙏 Acknowledgements

Responsible security research and constructive vulnerability reports are appreciated.

Thank you for helping keep **Flow Task Manager** secure and reliable.
