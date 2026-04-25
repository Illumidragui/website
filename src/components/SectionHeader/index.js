import React from 'react';
import styles from './SectionHeader.module.css';

export default function SectionHeader({ label, title }) {
  return (
    <div className={styles.header}>
      <span className={styles.label}>
        <span className={styles.labelLine} aria-hidden="true" />
        {label}
      </span>
      <h2>{title}</h2>
    </div>
  );
}
