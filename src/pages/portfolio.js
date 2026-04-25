import React from 'react';
import Layout from '@theme/Layout';
import { useLang } from '@site/src/context/LangContext';
import { t } from '@site/src/data/translations';
import projectData from '@site/src/data/project.json';
import ProjectCard from '@site/src/components/ProjectCard';
import styles from './portfolio.module.css';

export default function PortfolioPage() {
  const { lang } = useLang();
  const tr = t[lang];
  const list = projectData.portfolio[lang];

  return (
    <Layout
      title="Portfolio"
      description="DevSecOps and Cloud Infrastructure projects by Sheng Jun Ye"
    >
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
            {list.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
