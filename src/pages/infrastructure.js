import React from 'react';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import InfraContent from '@site/src/components/InfraContent';
import PipelineContent from '@site/src/components/PipelineContent';
import { useLang } from '@site/src/context/LangContext';
import styles from './infrastructure.module.css';

function InfraHeader() {
  const { lang } = useLang();
  return (
    <div className={styles.header}>
      <div className="container">
        <span className={styles.label}>
          <span className={styles.labelLine} />
          {lang === 'es' ? 'INFRAESTRUCTURA & PIPELINE' : 'INFRASTRUCTURE & PIPELINE'}
        </span>
        <h1 className={styles.title}>
          {lang === 'es' ? 'KuberLab — Infraestructura y CI/CD' : 'KuberLab — Infrastructure & CI/CD'}
        </h1>
        <p className={styles.subtitle}>
          AWS · Terraform · k3s · ArgoCD · Helm · Tailscale · GitHub Actions
        </p>
      </div>
    </div>
  );
}

export default function InfrastructurePage() {
  const { lang } = useLang();
  return (
    <Layout
      title={lang === 'es' ? 'Infraestructura' : 'Infrastructure'}
      description="KuberLab — Infrastructure and CI/CD pipeline documentation">
      <InfraHeader />
      <div className={styles.body}>
        <div className="container">
          <Tabs>
            <TabItem value="cicd" label={lang === 'es' ? 'Pipeline CI/CD' : 'CI/CD Pipeline'} default>
              <PipelineContent />
            </TabItem>
            <TabItem value="infrastructure" label={lang === 'es' ? 'Infraestructura' : 'Infrastructure'}>
              <InfraContent />
            </TabItem>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
