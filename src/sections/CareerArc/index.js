import React from 'react';
import clsx from 'clsx';
import { useLang } from '@site/src/context/LangContext';
import { t } from '@site/src/data/translations';
import styles from './CareerArc.module.css';

export default function CareerArc() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h3 className={styles.title}>{tr.arcTitle}</h3>
          <p className={styles.intro}>{tr.arcIntro}</p>
        </div>
        <div className={styles.grid}>
          {tr.arc.map(item => (
            <div
              key={item.num}
              className={clsx(styles.cell, item.active && styles.cellActive)}
            >
              <span className={clsx(styles.num, item.active && styles.numActive)}>
                {item.num}
              </span>
              <div className={styles.period}>{item.dates}</div>
              <div className={styles.role}>{item.title}</div>
              <div className={styles.desc}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
