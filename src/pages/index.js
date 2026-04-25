import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/sections/Hero';
import CareerArc from '@site/src/sections/CareerArc';
import Experience from '@site/src/sections/Experience';
import Education from '@site/src/sections/Education';
import styles from './index.module.css';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="DevSecOps Engineer — Sheng Jun Ye · Security-first CI/CD"
    >
      <Hero />
      <div className={styles.divider} />
      <main>
        <CareerArc />
        <div className={styles.divider} />
        <Experience />
        <div className={styles.divider} />
        <Education />
      </main>
    </Layout>
  );
}
