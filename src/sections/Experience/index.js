import React from 'react';
import { useLang } from '@site/src/context/LangContext';
import { t } from '@site/src/data/translations';
import projectData from '@site/src/data/project.json';
import SectionHeader from '@site/src/components/SectionHeader';
import ExperienceCard from '@site/src/components/ExperienceCard';
import styles from './Experience.module.css';

export default function Experience() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <div id="experience" className={styles.section}>
      <SectionHeader label={tr.sectionExpSub} title={tr.sectionExp} />
      <div className="container">
        <div className={styles.list}>
          {projectData.experiences.map((exp, i) => (
            <ExperienceCard
              key={i}
              index={i}
              title={exp.title}
              subtitle={exp.subtitle}
              date={exp.date}
              summary={lang === 'es' && exp.summary_es ? exp.summary_es : exp.summary}
              highlights={lang === 'es' && exp.highlights_es ? exp.highlights_es : exp.highlights}
              details={exp.details}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
