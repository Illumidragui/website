import React from 'react';
import { useLang } from '@site/src/context/LangContext';
import { t } from '@site/src/data/translations';
import projectData from '@site/src/data/project.json';
import SectionHeader from '@site/src/components/SectionHeader';
import Timeline from '@site/src/components/Timeline';
import styles from './Experience.module.css';

export default function Experience() {
  const { lang } = useLang();
  const tr = t[lang];

  const entries = projectData.experiences.map(exp => ({
    title: exp.title,
    subtitle: exp.subtitle,
    date: exp.date,
    description: lang === 'es' && exp.description_es ? exp.description_es : exp.description,
  }));

  return (
    <div id="experience" className={styles.section}>
      <SectionHeader label={tr.sectionExpSub} title={tr.sectionExp} />
      <div className="container">
        <Timeline entries={entries} />
      </div>
    </div>
  );
}
