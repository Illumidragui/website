import React from 'react';
import Layout from '@theme/Layout';
import InfraContent from '@site/src/components/InfraContent';
import { useLang } from '@site/src/context/LangContext';
import styles from './infrastructure.module.css';

function InfraHeader() {
  const { lang } = useLang();
  return (
    <div className={styles.header}>
      <div className="container">
        <span className={styles.label}>
          <span className={styles.labelLine} />
          {lang === 'es' ? 'INFRAESTRUCTURA CLOUD' : 'CLOUD INFRASTRUCTURE'}
        </span>
        <h1 className={styles.title}>
          {lang === 'es' ? 'KuberLab — Laboratorio Personal de DevOps en AWS' : 'KuberLab — Personal DevOps Lab on AWS'}
        </h1>
        <p className={styles.subtitle}>
          {lang === 'es'
            ? 'AWS · Terraform · k3s · ArgoCD · Helm · Tailscale'
            : 'AWS · Terraform · k3s · ArgoCD · Helm · Tailscale'}
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
      description="KuberLab — Personal DevOps lab on AWS using Terraform, k3s, ArgoCD and Tailscale">
      <InfraHeader />
      <div className={styles.body}>
        <div className="container">
          <InfraContent />
        </div>
      </div>
    </Layout>
  );
}
