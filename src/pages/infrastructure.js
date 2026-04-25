import React, { useState } from 'react';
import Layout from '@theme/Layout';
import OverviewContent from '@site/src/components/OverviewContent';
import InfraContent from '@site/src/components/InfraContent';
import PipelineContent from '@site/src/components/PipelineContent';
import { useLang } from '@site/src/context/LangContext';
import styles from './infrastructure.module.css';

// ── Nav config ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'overview', en: 'Overview',       es: 'Introducción'   },
  { id: 'cicd',     en: 'CI/CD Pipeline', es: 'Pipeline CI/CD' },
  { id: 'infra',    en: 'Infrastructure', es: 'Infraestructura' },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function PageHeader({ lang }) {
  return (
    <div className={styles.header}>
      <div className="container">
        <span className={styles.label}>
          <span className={styles.labelLine} />
          {lang === 'es' ? 'INFRAESTRUCTURA & PIPELINE' : 'INFRASTRUCTURE & PIPELINE'}
        </span>
        <h1 className={styles.title}>
          {lang === 'es'
            ? 'KuberLab — Infraestructura y CI/CD'
            : 'KuberLab — Infrastructure & CI/CD'}
        </h1>
        <p className={styles.subtitle}>
          AWS · Terraform · k3s · ArgoCD · Helm · Tailscale · GitHub Actions
        </p>
      </div>
    </div>
  );
}

function Sidebar({ page, setPage, lang }) {
  return (
    <nav className={styles.sidebar}>
      <span className={styles.navSection}>KuberLab</span>
      {NAV_ITEMS.map(({ id, en, es }) => (
        <button
          key={id}
          className={`${styles.navItem} ${page === id ? styles.navItemActive : ''}`}
          onClick={() => setPage(id)}
        >
          {lang === 'es' ? es : en}
        </button>
      ))}
    </nav>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

const PAGES = {
  overview: (setPage) => <OverviewContent onNavigate={setPage} />,
  cicd:     ()       => <PipelineContent />,
  infra:    ()       => <InfraContent />,
};

export default function InfrastructurePage() {
  const { lang } = useLang();
  const [page, setPage] = useState('overview');

  return (
    <Layout
      title={lang === 'es' ? 'Infraestructura' : 'Infrastructure'}
      description="KuberLab — Infrastructure and CI/CD pipeline documentation"
    >
      <PageHeader lang={lang} />
      <div className={styles.body}>
        <div className="container">
          <div className={styles.layout}>
            <Sidebar page={page} setPage={setPage} lang={lang} />
            <main className={styles.content}>
              {PAGES[page]?.(setPage)}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
