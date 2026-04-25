import React from 'react';
import Link from '@docusaurus/Link';
import styles from './ProjectCard.module.css';

const TYPE_COLORS = {
  security: 'var(--op-accent)',
  infrastructure: '#60a5fa',
};

export default function ProjectCard({ project }) {
  const accentColor = TYPE_COLORS[project.type];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span
          className={styles.typeTag}
          style={{ borderColor: accentColor, color: accentColor }}
        >
          {project.typeLabel}
        </span>
        <h2 className={styles.cardTitle}>{project.title}</h2>
        <p className={styles.cardDesc}>{project.description}</p>
      </div>

      <div className={styles.highlights}>
        {project.highlights.map((h, i) => (
          <div key={i} className={styles.highlight}>
            <span className={styles.highlightDot} style={{ background: accentColor }} />
            {h}
          </div>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.stackPills}>
          {project.stack.map(tech => (
            <span key={tech} className={styles.pill}>{tech}</span>
          ))}
        </div>
        <div className={styles.links}>
          {project.links.map(link =>
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
