import React from 'react';
import styles from './DescBlock.module.css';

function DescStack({ label, items }) {
  return (
    <div className={styles.descStack}>
      <span className={styles.descStackLabel}>{label}</span>
      <div className={styles.descStackPills}>
        {items.map((item, i) => (
          <span key={i} className={styles.descStackPill}>{item}</span>
        ))}
      </div>
    </div>
  );
}

export function renderDescBlock(line, i) {
  if (line.startsWith('> ')) {
    return <p key={i} className={styles.descProse}>{line.slice(2)}</p>;
  }
  const stackMatch = line.match(/^-\s+([^:]+):\s*(.+)$/);
  if (stackMatch) {
    const label = stackMatch[1].trim();
    const items = stackMatch[2].replace(/\.$/, '').split(',').map(s => s.trim()).filter(Boolean);
    return <DescStack key={i} label={label} items={items} />;
  }
  return <p key={i} className={styles.descProse}>{line}</p>;
}
