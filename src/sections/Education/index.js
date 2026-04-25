import React from 'react';
import { useLang } from '@site/src/context/LangContext';
import { t } from '@site/src/data/translations';
import projectData from '@site/src/data/project.json';
import SectionHeader from '@site/src/components/SectionHeader';
import Timeline from '@site/src/components/Timeline';
import styles from './Education.module.css';

export default function Education() {
  const { lang } = useLang();
  const tr = t[lang];

  const entries = projectData.education.map(edu => ({
    title: lang === 'es' && edu.title_es ? edu.title_es : edu.title,
    subtitle: lang === 'es' && edu.subtitle_es ? edu.subtitle_es : edu.subtitle,
    date: edu.date,
  }));

  return (
    <div id="education" className={styles.section}>
      <SectionHeader label={tr.sectionEduSub} title={tr.sectionEdu} />
      <div className="container">
        <Timeline entries={entries} />
      </div>
    </div>
  );
}
