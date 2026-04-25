import React from 'react';
import styles from './OverviewContent.module.css';

const LAB_COMPONENTS = [
  {
    term: 'Kubernetes cluster',
    desc: 'Single-node k3s on EC2 t3.medium, private subnet, no public IP.',
  },
  {
    term: 'GitOps',
    desc: 'ArgoCD with the App of Apps pattern manages every cluster workload.',
  },
  {
    term: 'Infrastructure as Code',
    desc: 'Terraform provisions the full AWS stack in a two-phase deploy.',
  },
  {
    term: 'Access',
    desc: 'Tailscale VPN for operator access; public traffic via AWS NLB → ingress-nginx.',
  },
  {
    term: 'TLS',
    desc: 'cert-manager + Let\'s Encrypt handles certificate lifecycle automatically.',
  },
  {
    term: 'CI/CD pipeline',
    desc: 'Reusable GitHub Actions workflows; the pipeline commits image tags — it never touches kubectl directly.',
  },
];

const CHANGE_FLOW = [
  'Push to main triggers GitHub Actions.',
  'Security gates run in order: secret scanning, unit tests, SAST + SCA in parallel, container build, container scan + DAST in parallel.',
  'Image is built once, SHA-tagged, and pushed to Docker Hub.',
  'The workflow commits the new image tag into the Helm chart values file.',
  'ArgoCD detects the commit on its next refresh and rolls out the new pod automatically.',
];

const SECTION_CARDS = [
  {
    id: 'cicd',
    label: 'CI/CD Pipeline',
    desc: 'Six-stage GitHub Actions pipeline with security gates at every step. Secret scanning, SAST, SCA, container scanning, and DAST — all must pass before a deploy.',
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    desc: 'AWS VPC, EC2, k3s, Tailscale, ArgoCD App of Apps, cert-manager, and ingress-nginx — fully provisioned with Terraform in a two-phase deploy.',
  },
];

export default function OverviewContent({ onNavigate }) {
  return (
    <div>
      <p>
        KuberLab is a personal DevOps lab built on AWS. The goal is to practise Kubernetes,
        Terraform, ArgoCD, and GitHub Actions through repeated destroy-and-rebuild cycles —
        not to keep a system permanently running, but to build the muscle memory of standing
        one up from scratch.
      </p>

      <h2>What's in the lab</h2>
      <dl className={styles.termList}>
        {LAB_COMPONENTS.map(({ term, desc }) => (
          <div key={term} className={styles.termRow}>
            <dt className={styles.term}>{term}</dt>
            <dd className={styles.termDesc}>{desc}</dd>
          </div>
        ))}
      </dl>

      <h2>How a change flows through the system</h2>
      <ol className={styles.flowList}>
        {CHANGE_FLOW.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <h2>Explore</h2>
      <div className={styles.sectionCards}>
        {SECTION_CARDS.map(({ id, label, desc }) => (
          <button
            key={id}
            className={styles.sectionCard}
            onClick={() => onNavigate(id)}
          >
            <span className={styles.sectionCardLabel}>{label}</span>
            <p className={styles.sectionCardDesc}>{desc}</p>
            <span className={styles.sectionCardCta}>Read more →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
