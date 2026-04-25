import React from 'react';
import styles from './Timeline.module.css';
import { renderDescBlock } from '@site/src/components/DescBlock';

function TimelineEntry({ title, subtitle, date, description }) {
  return (
    <div className={styles.entry}>
      <div className={styles.dot} />
      <div className={styles.card}>
        <div className={styles.head}>
          <div>
            <div className={styles.role}>{title}</div>
            <div className={styles.company}>{subtitle}</div>
          </div>
          <div className={styles.date}>{date}</div>
        </div>
        {description && (
          <div className={styles.body}>
            {description.map((line, i) => renderDescBlock(line, i))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline({ entries }) {
  return (
    <div className={styles.wrapper}>
      {entries.map((entry, i) => (
        <TimelineEntry key={i} {...entry} />
      ))}
    </div>
  );
}
