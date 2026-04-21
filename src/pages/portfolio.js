import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLang } from '@site/src/context/LangContext';
import styles from './portfolio.module.css';

const projects = {
  en: [
    {
      id: 'devsecops-pipeline',
      type: 'security',
      typeLabel: 'CI/CD Security',
      title: 'DevSecOps Pipeline',
      description:
        'GitHub Actions workflow integrating 5 security gates across the full delivery lifecycle of a Flask application — secret scanning, unit tests, SAST, SCA, container build, container scan, and DAST running in parallel where possible.',
      stack: ['GitHub Actions', 'Gitleaks', 'SonarCloud', 'Snyk', 'Trivy', 'OWASP ZAP', 'Docker', 'Python'],
      links: [
        { label: 'Pipeline Docs', url: '/docs/pipeline', external: false },
        { label: 'GitHub', url: 'https://github.com/Illumidragui/devsecops-pipeline', external: true },
      ],
      highlights: [
        'Shift-left: secrets blocked before code is compiled',
        'SAST + SCA in parallel — SonarCloud and Snyk',
        'DAST found 5 missing security headers → all fixed',
        'Single image build verified by both Trivy and ZAP',
      ],
    },
    {
      id: 'kuberlab',
      type: 'infrastructure',
      typeLabel: 'Cloud Infrastructure',
      title: 'KuberLab — AWS Kubernetes Lab',
      description:
        'Production-realistic Kubernetes platform on AWS provisioned with Terraform. GitOps-driven application delivery via ArgoCD. Zero public IPs — all access through Tailscale VPN. Designed to be torn down and rebuilt repeatedly.',
      stack: ['AWS', 'Terraform', 'k3s', 'ArgoCD', 'Helm', 'Tailscale', 'cert-manager', 'ingress-nginx'],
      links: [
        { label: 'Infrastructure Docs', url: '/infrastructure', external: false },
      ],
      highlights: [
        'Two-phase Terraform deploy (network → platform)',
        'App of Apps pattern for GitOps at scale',
        'No public IP on EC2 — Tailscale-only access',
        'Dynamic AMI lookup — no hardcoded IDs',
      ],
    },
  ],
  es: [
    {
      id: 'devsecops-pipeline',
      type: 'security',
      typeLabel: 'CI/CD Security',
      title: 'Pipeline DevSecOps',
      description:
        'Workflow de GitHub Actions que integra 5 controles de seguridad a lo largo del ciclo de vida completo de una aplicación Flask — escaneo de secretos, pruebas unitarias, SAST, SCA, build del contenedor, escaneo del contenedor y DAST en paralelo donde es posible.',
      stack: ['GitHub Actions', 'Gitleaks', 'SonarCloud', 'Snyk', 'Trivy', 'OWASP ZAP', 'Docker', 'Python'],
      links: [
        { label: 'Pipeline Docs', url: '/docs/pipeline', external: false },
        { label: 'GitHub', url: 'https://github.com/Illumidragui/devsecops-pipeline', external: true },
      ],
      highlights: [
        'Shift-left: secretos bloqueados antes de compilar',
        'SAST + SCA en paralelo — SonarCloud y Snyk',
        'DAST encontró 5 cabeceras de seguridad ausentes → todas corregidas',
        'Una sola build de imagen verificada por Trivy y ZAP',
      ],
    },
    {
      id: 'kuberlab',
      type: 'infrastructure',
      typeLabel: 'Infraestructura Cloud',
      title: 'KuberLab — Laboratorio Kubernetes en AWS',
      description:
        'Plataforma Kubernetes realista en AWS provisionada con Terraform. Entrega de aplicaciones mediante GitOps con ArgoCD. Sin IPs públicas — todo el acceso a través de Tailscale VPN. Diseñado para ser destruido y reconstruido repetidamente.',
      stack: ['AWS', 'Terraform', 'k3s', 'ArgoCD', 'Helm', 'Tailscale', 'cert-manager', 'ingress-nginx'],
      links: [
        { label: 'Documentación de Infra', url: '/infrastructure', external: false },
      ],
      highlights: [
        'Despliegue Terraform en dos fases (red → plataforma)',
        'Patrón App of Apps para GitOps a escala',
        'Sin IP pública en EC2 — acceso solo por Tailscale',
        'Búsqueda dinámica de AMI — sin IDs hardcodeados',
      ],
    },
  ],
};

const TYPE_COLORS = {
  security: 'var(--op-accent)',
  infrastructure: '#60a5fa',
};

function ProjectCard({ project }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span
          className={styles.typeTag}
          style={{ borderColor: TYPE_COLORS[project.type], color: TYPE_COLORS[project.type] }}
        >
          {project.typeLabel}
        </span>
        <h2 className={styles.cardTitle}>{project.title}</h2>
        <p className={styles.cardDesc}>{project.description}</p>
      </div>

      <div className={styles.highlights}>
        {project.highlights.map((h, i) => (
          <div key={i} className={styles.highlight}>
            <span className={styles.highlightDot} style={{ background: TYPE_COLORS[project.type] }} />
            {h}
          </div>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.stackPills}>
          {project.stack.map((tech) => (
            <span key={tech} className={styles.pill}>{tech}</span>
          ))}
        </div>
        <div className={styles.links}>
          {project.links.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {link.label} ↗
              </a>
            ) : (
              <Link key={link.label} to={link.url} className={styles.link}>
                {link.label} →
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { lang } = useLang();
  const list = projects[lang];

  return (
    <Layout
      title={lang === 'es' ? 'Portfolio' : 'Portfolio'}
      description="DevSecOps and Cloud Infrastructure projects by Sheng Jun Ye">
      <div className={styles.hero}>
        <div className="container">
          <span className={styles.heroLabel}>
            <span className={styles.heroLabelLine} />
            {lang === 'es' ? 'PROYECTOS' : 'PROJECTS'}
          </span>
          <h1 className={styles.heroTitle}>
            {lang === 'es' ? 'Portfolio' : 'Portfolio'}
          </h1>
          <p className={styles.heroSub}>
            {lang === 'es'
              ? 'Proyectos de seguridad e infraestructura cloud que he construido.'
              : 'Security and cloud infrastructure projects I have built.'}
          </p>
        </div>
      </div>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {list.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
