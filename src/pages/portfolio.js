import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLang } from '@site/src/context/LangContext';
import { t } from '@site/src/data/translations';
import projectData from '@site/src/data/project.json';
import styles from './portfolio.module.css';

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
  const tr = t[lang];
  const list = projectData.portfolio[lang];

  return (
    <Layout
      title="Portfolio"
      description="DevSecOps and Cloud Infrastructure projects by Sheng Jun Ye">
      <div className={styles.hero}>
        <div className="container">
          <span className={styles.heroLabel}>
            <span className={styles.heroLabelLine} />
            {tr.portfolioLabel}
          </span>
          <h1 className={styles.heroTitle}>{tr.portfolioTitle}</h1>
          <p className={styles.heroSub}>{tr.portfolioSub}</p>
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
