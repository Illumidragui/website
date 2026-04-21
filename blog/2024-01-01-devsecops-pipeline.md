---
slug: devsecops-pipeline-overview
title: Building a Security-first CI/CD Pipeline
authors: [devsecops]
tags: [devsecops, security, cicd, gitleaks, sonarcloud, snyk, trivy, owasp-zap]
---

## Overview

This pipeline integrates 5 security tools across every stage of the CI/CD lifecycle, turning security checks from an afterthought into a first-class pipeline gate.

<!-- truncate -->

## The Security Gates

### Stage 1: Secret Scanning (Gitleaks)

Before a single line of code is compiled or tested, Gitleaks scans the full repository history for hard-coded secrets — API keys, tokens, passwords, and credentials.

**Why first?** Secrets in source code can be exploited immediately after a push. Catching them at the first gate prevents them from ever reaching a build artifact.

### Stage 2: Unit Testing (Pytest)

The Flask test suite verifies the application is functionally correct before any security analysis begins. SAST tools that analyse broken code produce noisy, irrelevant results.

### Stage 3: SAST + SCA (Parallel)

**SonarCloud** performs Static Application Security Testing — analysing source code without running it to find security vulnerabilities, code smells, and quality issues.

**Snyk** performs Software Composition Analysis — scanning `requirements.txt` for known CVEs in third-party dependencies.

Both run in parallel to keep the pipeline fast.

**Finding resolved:** Snyk detected `gunicorn==22.0.0` had a high-severity CVE. Updated to `gunicorn==23.0.0`.

### Stage 4: Container Build (Docker → GHCR)

A multi-stage Dockerfile builds a hardened image:
- Python 3.12-slim base (minimal attack surface)
- Non-root `appuser` (limits blast radius)
- `apt-get upgrade` at build time (patches OS packages)
- Tagged with commit SHA for immutable traceability

### Stage 5: Container Scan + DAST (Parallel)

**Trivy** scans the built image at two layers — OS packages and Python dependencies — failing on `CRITICAL/HIGH` with available fixes.

**OWASP ZAP** dynamically attacks the running application. On the first run, it detected 5 missing HTTP security headers. All 5 were added as a direct result:

- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy: default-src 'self'`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- `Cross-Origin-Resource-Policy: same-origin`
- `Cache-Control: no-store`

### Stage 6: Consolidated Report

Shell scripts aggregate all tool outputs into a single downloadable artifact, giving a complete security posture snapshot on every push to `main`.

## Key Lessons

1. **Shift left aggressively** — secret scanning as the very first gate catches credentials before anything else runs
2. **Parallel scanning** — SAST + SCA and container scan + DAST run in parallel, cutting pipeline time nearly in half
3. **Single image build** — Trivy and ZAP test the exact image that reaches production, not a locally rebuilt copy
4. **ZAP finds what static tools miss** — all 5 missing security headers were caught only by dynamic testing, not SAST

Check out the [Pipeline Architecture docs](/docs/pipeline) for the full technical breakdown.
