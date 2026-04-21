import React from 'react';
import { useLang } from '@site/src/context/LangContext';
import CodeBlock from '@theme/CodeBlock';

const DIAGRAM = `git push → main
    │
    ▼
[Stage 1] SECRET SCANNING (Gitleaks)
    │  Blocks if any hard-coded secret detected in full git history
    ▼
[Stage 2] UNIT TESTING (Pytest)
    │  Verifies functional correctness before security tools run
    ├──────────────────────────────────┐
    ▼                                  ▼
[Stage 3a] SAST (SonarCloud)    [Stage 3b] SCA (Snyk)
    └──────────────────────────────────┘
    │  Both run in parallel after tests pass
    ▼
[Stage 4] CONTAINER BUILD (Docker → GHCR)
    │  Single build, tagged with commit SHA
    ├──────────────────────────────────┐
    ▼                                  ▼
[Stage 5a] CONTAINER SCAN (Trivy)  [Stage 5b] DAST (OWASP ZAP)
    └──────────────────────────────────┘
    │  Both run in parallel against the built image
    ▼
[Stage 6] CONSOLIDATED REPORT
    Artifact retained 7 days`;

const DOCKERFILE = `# Stage 1: builder — install dependencies
FROM python:3.12-slim AS builder
RUN pip install --prefix=/install -r requirements.txt

# Stage 2: runtime — copy only what's needed
FROM python:3.12-slim
RUN apt-get update && apt-get upgrade -y   # patch OS packages
COPY --from=builder /install /usr/local
RUN useradd -m appuser                     # non-root user
USER appuser
CMD ["gunicorn", "app:create_app()"]`;

const ZAP_RULES = `10015\tFAIL\t# Missing Anti-clickjacking Header
10021\tWARN\t# X-Content-Type-Options Header Missing
10096\tIGNORE # Timestamp Disclosure`;

const SCRIPTS = `scripts/
├── generate_consolidated_report.sh  # orchestrator
├── snyk_summary.sh                  # parses Snyk SARIF
├── trivy_summary.sh                 # parses Trivy JSON
└── zap_summary.sh                   # parses ZAP HTML`;

const FLASK_HEADERS = `@blueprint.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    response.headers['Cross-Origin-Resource-Policy'] = 'same-origin'
    response.headers['Cache-Control'] = 'no-store'
    return response`;

const content = {
  en: {
    intro: "This page documents the DevSecOps CI/CD pipeline implemented in devsecops-app — a GitHub Actions workflow that integrates five security tools across every stage of the software delivery lifecycle.",
    overviewTitle: "Overview",

    s1Title: "Stage 1 — Secret Scanning with Gitleaks",
    s1Intro: "Gitleaks scans the entire repository history for secrets before any code is compiled or tested.",
    s1WhatTitle: "What it catches:",
    s1What: [
      "API keys and tokens embedded in source files",
      "Passwords in configuration files",
      "Private keys accidentally committed",
      "Credentials in environment variable exports",
    ],
    s1Config: <><strong>Configuration:</strong> Default Gitleaks ruleset (detects 100+ secret patterns). The pipeline fails immediately on any finding — secrets must never reach a build artifact.</>,

    s2Title: "Stage 2 — Unit Testing with Pytest",
    s2Intro: "The Flask test suite verifies that the application behaves correctly before security tools are invoked.",
    s2CoverageTitle: "Test coverage:",
    s2Coverage: [
      <><code>GET /</code> → HTTP 200, JSON body with <code>status: "ok"</code></>,
      <><code>GET /health</code> → HTTP 200, JSON body with <code>healthy: true</code></>,
    ],
    s2Why: <><strong>Why test before scanning?</strong> SAST tools analyse code paths — running them against broken code wastes CI minutes and produces noisy results.</>,

    s3SastTitle: "Stage 3 — SAST with SonarCloud",
    s3SastIntro: "Static Application Security Testing analyses source code without executing it, detecting:",
    s3SastItems: [
      "Security vulnerabilities (injection risks, unsafe API usage)",
      "Code smells and maintainability issues",
      "Missing security controls",
    ],
    s3SastFinding: <><strong>Finding resolved:</strong> Routes initially lacked explicit <code>methods={`['GET']`}</code> declarations. SonarCloud flagged this as a least-privilege violation — routes should only accept the HTTP methods they actually handle. Fixed in the Flask blueprint.</>,

    s3ScaTitle: "Stage 3 — SCA with Snyk",
    s3ScaIntro: <><strong>Software Composition Analysis</strong> scans <code>requirements.txt</code> for known CVEs in third-party dependencies.</>,
    s3ScaFinding: <><strong>Finding resolved:</strong> <code>gunicorn==22.0.0</code> had a high-severity vulnerability. Snyk identified the affected version and the patched version. Updated to <code>gunicorn==23.0.0</code>.</>,
    s3ScaThreshold: <><strong>Threshold:</strong> The pipeline fails on high and critical severity CVEs with available fixes. Low and medium severities are flagged but do not block.</>,

    s4Title: "Stage 4 — Container Build",
    s4Intro: "A multi-stage Dockerfile builds the final image:",
    s4DecisionsTitle: "Security decisions:",
    s4Decisions: [
      "Multi-stage build: build tools never reach the runtime image",
      <>  <code>apt-get upgrade</code>: OS base packages are patched at build time</>,
      <>Non-root <code>appuser</code>: limits blast radius if the container is compromised</>,
      "Image tagged with commit SHA and pushed to GHCR for immutable traceability",
    ],

    s5TrivyTitle: "Stage 5 — Container Scanning with Trivy",
    s5TrivyIntro: "Trivy scans the built image at two layers:",
    s5TrivyTableHeaders: ["Layer", "What it checks"],
    s5TrivyTableRows: [
      ["OS packages", "Debian/Ubuntu libraries (libc, openssl, zlib…)"],
      ["Application packages", "Python packages from requirements.txt"],
    ],
    s5TrivyConfigTitle: "Configuration:",
    s5TrivyConfig: [
      <>Severity threshold: <code>CRITICAL,HIGH</code></>,
      <><code>ignore-unfixed: true</code> — only block on CVEs with an available fix</>,
      <><code>.trivyignore</code> — accepted known risks documented and suppressed</>,
    ],
    s5TrivyNote: <>Trivy scans the <strong>same image</strong> pushed to GHCR in Stage 4. This is intentional: it verifies exactly what will be deployed, not a locally rebuilt copy.</>,

    s5ZapTitle: "Stage 5 — Dynamic Testing with OWASP ZAP",
    s5ZapIntro: "OWASP ZAP starts the application from the built container image and actively attacks it to find runtime vulnerabilities.",
    s5ZapFindingTitle: "Findings resolved (5 missing HTTP security headers):",
    s5ZapTableHeaders: ["Header", "Purpose"],
    s5ZapTableRows: [
      ["`X-Content-Type-Options: nosniff`", "Prevents MIME-type sniffing attacks"],
      ["`Content-Security-Policy: default-src 'self'`", "XSS mitigation — restrict resource origins"],
      ["`Permissions-Policy: geolocation=(), microphone=(), camera=()`", "Restricts browser feature access"],
      ["`Cross-Origin-Resource-Policy: same-origin`", "Prevents cross-origin data leaks"],
      ["`Cache-Control: no-store`", "Prevents sensitive data caching by intermediaries"],
    ],
    s5ZapNote: <>All five headers are now added by the Flask <code>add_security_headers()</code> after-request hook.</>,
    s5ZapRulesTitle: "ZAP rules configuration (.zap/rules.tsv):",
    s5ZapRulesNote: "Granular FAIL/WARN/IGNORE control prevents alert noise while enforcing critical issues.",

    s6Title: "Stage 6 — Consolidated Report",
    s6Intro: <>Shell scripts in <code>scripts/</code> aggregate all tool outputs:</>,
    s6Note: "Output is posted as a GitHub Actions step summary and bundled as a downloadable artifact (7-day retention). Every push to main produces a full-pipeline security snapshot.",

    headersTitle: "Application Security Headers",
    headersIntro: <>The Flask app (<code>app/routes.py</code>) adds security headers via an after-request hook:</>,
    headersNote: "These headers were added as a direct result of OWASP ZAP findings — a concrete example of DAST driving remediation.",

    stackTitle: "Tech Stack Summary",
    stackHeaders: ["Component", "Technology"],
    stackRows: [
      ["Application", "Python 3.12, Flask 3.1.3"],
      ["Server", "Gunicorn 23.0.0"],
      ["Container", "Docker (multi-stage, non-root)"],
      ["Registry", "GitHub Container Registry (GHCR)"],
      ["CI/CD", "GitHub Actions"],
      ["Secret Scanning", "Gitleaks"],
      ["SAST", "SonarCloud"],
      ["SCA", "Snyk"],
      ["Container Scan", "Trivy (Aqua Security)"],
      ["DAST", "OWASP ZAP"],
      ["Testing", "Pytest 8.2.0"],
    ],
  },

  es: {
    intro: "Esta página documenta el pipeline CI/CD de DevSecOps implementado en devsecops-app — un workflow de GitHub Actions que integra cinco herramientas de seguridad en cada etapa del ciclo de vida de entrega de software.",
    overviewTitle: "Vista General",

    s1Title: "Etapa 1 — Escaneo de Secretos con Gitleaks",
    s1Intro: "Gitleaks analiza todo el historial del repositorio en busca de secretos antes de que se compile o pruebe cualquier código.",
    s1WhatTitle: "Qué detecta:",
    s1What: [
      "Claves de API y tokens incrustados en archivos fuente",
      "Contraseñas en archivos de configuración",
      "Claves privadas confirmadas accidentalmente",
      "Credenciales en exports de variables de entorno",
    ],
    s1Config: <><strong>Configuración:</strong> Conjunto de reglas predeterminado de Gitleaks (detecta más de 100 patrones de secretos). El pipeline falla inmediatamente ante cualquier hallazgo — los secretos nunca deben llegar a un artefacto de compilación.</>,

    s2Title: "Etapa 2 — Pruebas Unitarias con Pytest",
    s2Intro: "La suite de pruebas Flask verifica que la aplicación funcione correctamente antes de invocar las herramientas de seguridad.",
    s2CoverageTitle: "Cobertura de pruebas:",
    s2Coverage: [
      <><code>GET /</code> → HTTP 200, cuerpo JSON con <code>status: "ok"</code></>,
      <><code>GET /health</code> → HTTP 200, cuerpo JSON con <code>healthy: true</code></>,
    ],
    s2Why: <><strong>¿Por qué probar antes de escanear?</strong> Las herramientas SAST analizan rutas de código — ejecutarlas sobre código roto desperdicia minutos de CI y produce resultados ruidosos.</>,

    s3SastTitle: "Etapa 3 — SAST con SonarCloud",
    s3SastIntro: "El Análisis Estático de Seguridad de Aplicaciones analiza el código fuente sin ejecutarlo, detectando:",
    s3SastItems: [
      "Vulnerabilidades de seguridad (riesgos de inyección, uso inseguro de APIs)",
      "Code smells y problemas de mantenibilidad",
      "Controles de seguridad ausentes",
    ],
    s3SastFinding: <><strong>Hallazgo resuelto:</strong> Las rutas inicialmente carecían de declaraciones explícitas <code>methods={`['GET']`}</code>. SonarCloud lo marcó como una violación de mínimo privilegio — las rutas solo deben aceptar los métodos HTTP que realmente gestionan. Corregido en el blueprint de Flask.</>,

    s3ScaTitle: "Etapa 3 — SCA con Snyk",
    s3ScaIntro: <><strong>El Análisis de Composición de Software</strong> escanea <code>requirements.txt</code> en busca de CVEs conocidos en dependencias de terceros.</>,
    s3ScaFinding: <><strong>Hallazgo resuelto:</strong> <code>gunicorn==22.0.0</code> tenía una vulnerabilidad de alta severidad. Snyk identificó la versión afectada y la versión parcheada. Actualizado a <code>gunicorn==23.0.0</code>.</>,
    s3ScaThreshold: <><strong>Umbral:</strong> El pipeline falla ante CVEs de severidad alta y crítica con correcciones disponibles. Las severidades bajas y medias se marcan pero no bloquean.</>,

    s4Title: "Etapa 4 — Construcción del Contenedor",
    s4Intro: "Un Dockerfile multi-etapa construye la imagen final:",
    s4DecisionsTitle: "Decisiones de seguridad:",
    s4Decisions: [
      "Build multi-etapa: las herramientas de compilación nunca llegan a la imagen de runtime",
      <><code>apt-get upgrade</code>: los paquetes base del SO se parchean en tiempo de compilación</>,
      <>Usuario no root <code>appuser</code>: limita el radio de explosión si el contenedor es comprometido</>,
      "Imagen etiquetada con el SHA del commit y subida a GHCR para trazabilidad inmutable",
    ],

    s5TrivyTitle: "Etapa 5 — Escaneo de Contenedor con Trivy",
    s5TrivyIntro: "Trivy escanea la imagen construida en dos capas:",
    s5TrivyTableHeaders: ["Capa", "Qué verifica"],
    s5TrivyTableRows: [
      ["Paquetes del SO", "Librerías Debian/Ubuntu (libc, openssl, zlib…)"],
      ["Paquetes de aplicación", "Paquetes Python de requirements.txt"],
    ],
    s5TrivyConfigTitle: "Configuración:",
    s5TrivyConfig: [
      <>Umbral de severidad: <code>CRITICAL,HIGH</code></>,
      <><code>ignore-unfixed: true</code> — solo bloquea en CVEs con corrección disponible</>,
      <><code>.trivyignore</code> — riesgos conocidos aceptados documentados y suprimidos</>,
    ],
    s5TrivyNote: <>Trivy escanea la <strong>misma imagen</strong> subida a GHCR en la Etapa 4. Es intencional: verifica exactamente lo que se desplegará, no una copia reconstruida localmente.</>,

    s5ZapTitle: "Etapa 5 — Pruebas Dinámicas con OWASP ZAP",
    s5ZapIntro: "OWASP ZAP inicia la aplicación desde la imagen de contenedor construida y la ataca activamente para encontrar vulnerabilidades en runtime.",
    s5ZapFindingTitle: "Hallazgos resueltos (5 cabeceras HTTP de seguridad faltantes):",
    s5ZapTableHeaders: ["Cabecera", "Propósito"],
    s5ZapTableRows: [
      ["`X-Content-Type-Options: nosniff`", "Previene ataques de sniffing de tipo MIME"],
      ["`Content-Security-Policy: default-src 'self'`", "Mitigación XSS — restringir orígenes de recursos"],
      ["`Permissions-Policy: geolocation=(), microphone=(), camera=()`", "Restringe el acceso a funciones del navegador"],
      ["`Cross-Origin-Resource-Policy: same-origin`", "Previene fugas de datos entre orígenes"],
      ["`Cache-Control: no-store`", "Evita que intermediarios cacheen datos sensibles"],
    ],
    s5ZapNote: <>Los cinco cabeceras son añadidos ahora por el hook after-request <code>add_security_headers()</code> de Flask.</>,
    s5ZapRulesTitle: "Configuración de reglas ZAP (.zap/rules.tsv):",
    s5ZapRulesNote: "El control granular FAIL/WARN/IGNORE evita el ruido de alertas mientras se aplican los problemas críticos.",

    s6Title: "Etapa 6 — Informe Consolidado",
    s6Intro: <>Scripts de shell en <code>scripts/</code> agregan todos los outputs de las herramientas:</>,
    s6Note: "El output se publica como un resumen del paso de GitHub Actions y se empaqueta como un artefacto descargable (retención de 7 días). Cada push a main produce una instantánea de seguridad completa del pipeline.",

    headersTitle: "Cabeceras de Seguridad de la Aplicación",
    headersIntro: <>La app Flask (<code>app/routes.py</code>) añade cabeceras de seguridad mediante un hook after-request:</>,
    headersNote: "Estas cabeceras fueron añadidas como resultado directo de los hallazgos de OWASP ZAP — un ejemplo concreto de DAST impulsando la remediación.",

    stackTitle: "Resumen del Stack Tecnológico",
    stackHeaders: ["Componente", "Tecnología"],
    stackRows: [
      ["Aplicación", "Python 3.12, Flask 3.1.3"],
      ["Servidor", "Gunicorn 23.0.0"],
      ["Contenedor", "Docker (multi-etapa, no root)"],
      ["Registro", "GitHub Container Registry (GHCR)"],
      ["CI/CD", "GitHub Actions"],
      ["Escaneo de Secretos", "Gitleaks"],
      ["SAST", "SonarCloud"],
      ["SCA", "Snyk"],
      ["Escaneo de Contenedor", "Trivy (Aqua Security)"],
      ["DAST", "OWASP ZAP"],
      ["Pruebas", "Pytest 8.2.0"],
    ],
  },
};

function DataTable({ headers, rows }) {
  return (
    <table>
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PipelineContent() {
  const { lang } = useLang();
  const c = content[lang];

  return (
    <div>
      <p>{c.intro}</p>

      <h2>{c.overviewTitle}</h2>
      <CodeBlock language="text">{DIAGRAM}</CodeBlock>

      <h2>{c.s1Title}</h2>
      <p>{c.s1Intro}</p>
      <p><strong>{c.s1WhatTitle}</strong></p>
      <ul>{c.s1What.map((item, i) => <li key={i}>{item}</li>)}</ul>
      <p>{c.s1Config}</p>

      <h2>{c.s2Title}</h2>
      <p>{c.s2Intro}</p>
      <p><strong>{c.s2CoverageTitle}</strong></p>
      <ul>{c.s2Coverage.map((item, i) => <li key={i}>{item}</li>)}</ul>
      <p>{c.s2Why}</p>

      <h2>{c.s3SastTitle}</h2>
      <p>{c.s3SastIntro}</p>
      <ul>{c.s3SastItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
      <p>{c.s3SastFinding}</p>

      <h2>{c.s3ScaTitle}</h2>
      <p>{c.s3ScaIntro}</p>
      <p>{c.s3ScaFinding}</p>
      <p>{c.s3ScaThreshold}</p>

      <h2>{c.s4Title}</h2>
      <p>{c.s4Intro}</p>
      <CodeBlock language="dockerfile">{DOCKERFILE}</CodeBlock>
      <p><strong>{c.s4DecisionsTitle}</strong></p>
      <ul>{c.s4Decisions.map((item, i) => <li key={i}>{item}</li>)}</ul>

      <h2>{c.s5TrivyTitle}</h2>
      <p>{c.s5TrivyIntro}</p>
      <DataTable headers={c.s5TrivyTableHeaders} rows={c.s5TrivyTableRows} />
      <p><strong>{c.s5TrivyConfigTitle}</strong></p>
      <ul>{c.s5TrivyConfig.map((item, i) => <li key={i}>{item}</li>)}</ul>
      <p>{c.s5TrivyNote}</p>

      <h2>{c.s5ZapTitle}</h2>
      <p>{c.s5ZapIntro}</p>
      <p><strong>{c.s5ZapFindingTitle}</strong></p>
      <DataTable headers={c.s5ZapTableHeaders} rows={c.s5ZapTableRows} />
      <p>{c.s5ZapNote}</p>
      <p><strong>{c.s5ZapRulesTitle}</strong></p>
      <CodeBlock language="text">{ZAP_RULES}</CodeBlock>
      <p>{c.s5ZapRulesNote}</p>

      <h2>{c.s6Title}</h2>
      <p>{c.s6Intro}</p>
      <CodeBlock language="bash">{SCRIPTS}</CodeBlock>
      <p>{c.s6Note}</p>

      <h2>{c.headersTitle}</h2>
      <p>{c.headersIntro}</p>
      <CodeBlock language="python">{FLASK_HEADERS}</CodeBlock>
      <p>{c.headersNote}</p>

      <h2>{c.stackTitle}</h2>
      <DataTable headers={c.stackHeaders} rows={c.stackRows} />
    </div>
  );
}
