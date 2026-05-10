import React, { useState } from 'react';
import { useLang } from '@site/src/context/LangContext';
import { t } from '@site/src/data/translations';
import styles from './ExperienceCard.module.css';

export default function ExperienceCard({ title, subtitle, date, summary, highlights, details, index }) {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const tr = t[lang];
  const panelId = `exp-panel-${index}`;

  return (
    <div className={`${styles.entry} ${open ? styles.entryOpen : ''}`}>
      <div className={styles.dot} aria-hidden="true" />
      <div className={styles.card}>

        <div className={styles.head}>
          <div className={styles.meta}>
            <span className={styles.role}>{title}</span>
            <span className={styles.company}>{subtitle}</span>
          </div>
          <span className={styles.date}>{date}</span>
        </div>

        {summary && <p className={styles.summary}>{summary}</p>}

        {highlights?.length > 0 && (
          <ul className={styles.highlights} aria-label="Key achievements">
            {highlights.map((h, i) => (
              <li key={i} className={styles.highlight}>
                <span className={styles.highlightDot} aria-hidden="true" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {details?.length > 0 && (
          <>
            <button
              className={styles.toggle}
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-controls={panelId}
            >
              <span>{open ? tr.expDetailsHide : tr.expDetailsShow}</span>
              <svg
                className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                aria-hidden="true"
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div
              id={panelId}
              role="region"
              className={`${styles.details} ${open ? styles.detailsOpen : ''}`}
            >
              <div className={styles.detailsInner}>
                <div className={styles.detailsContent}>
                  {details.map((section, i) => {
                    const label = lang === 'es' && section.label_es ? section.label_es : section.label;
                    const text  = lang === 'es' && section.text_es  ? section.text_es  : section.text;
                    return (
                      <div key={i} className={styles.detailSection}>
                        <span className={styles.detailLabel}>{label}</span>
                        {text && <p className={styles.detailText}>{text}</p>}
                        {section.stack?.length > 0 && (
                          <div className={styles.detailPills}>
                            {section.stack.map((item, j) => (
                              <span key={j} className={styles.detailPill}>{item}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
