import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import projectData from '@site/src/data/project.json';
import { useLang } from '@site/src/context/LangContext';
import { t } from '@site/src/data/translations';

/* ── Hero tags ─────────────────────────────────────────────── */

const HERO_TAGS = [
  { label: 'Shift Left',  accent: true },
  { label: 'DevSecOps',   accent: true },
  { label: 'CI/CD',       accent: false },
  { label: 'Cloud',       accent: false },
  { label: 'Kubernetes',  accent: false },
  { label: 'Terraform',   accent: false },
];

/* ── Hero ──────────────────────────────────────────────────── */

function HomepageHeader() {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={clsx('row', styles.heroRow)}>

          {/* ── Left column ── */}
          <div className={clsx('col', styles.heroContent)}>

            {/* Monospace label with decorative line */}
            <div className={styles.heroLabel}>
              <span className={styles.heroLabelLine} aria-hidden="true" />
              {tr.heroLabel}
            </div>

            {/* Serif headline */}
            <h1 className={styles.heroHeadline}>
              {tr.heroH1Line1}{' '}
              <span className={styles.heroAccentWord}>{tr.heroAccent}</span>
              {tr.heroH1Line2}
            </h1>

            {/* Descriptive paragraph */}
            <p className={styles.heroParagraph}>{tr.heroParagraph}</p>

            {/* Tag pills */}
            <div className={styles.heroTags}>
              {HERO_TAGS.map(tag => (
                <span
                  key={tag.label}
                  className={clsx(styles.heroTag, tag.accent && styles.heroTagAccent)}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Tool badges */}
            <div className={styles.badgesSection}>
              {projectData.badges.map((badge, i) => (
                <a key={i} href={badge.url} target="_blank" rel="noopener noreferrer">
                  <img src={badge.image} alt={badge.alt} className="badgeimage" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right column ── */}
          <div className={clsx('col', 'profileimg-container', styles.heroImageCol)}>
            <div className={styles.profileImgWrapper}>
              <img
                src={projectData.projectImage.src}
                alt={projectData.projectImage.alt}
                className="profileimg"
              />
            </div>
            <a
              href={projectData.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeButton}
            >
              <svg viewBox="0 0 24 24" className={styles.resumeIcon} aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              {tr.githubBtn}
            </a>
            <div>
              <a href={projectData.learnMoreLink.url} className={styles.terminalLink}>
                <div className={styles.terminalArrowHint} aria-hidden="true">
                  <span className={styles.terminalHintLabel}>EXPLORE</span>
                  <span className={styles.cmdArrow}>▶</span>
                </div>
                <div className={styles.terminalCard}>
                  <div className={styles.terminalBar}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.terminalTitle}>devsecops.pipeline</span>
                    <span className={styles.liveTag}>
                      <span className={styles.livePulse} />
                      LIVE
                    </span>
                  </div>
                  <div className={styles.terminalBody}>
                    <div className={styles.cmdLine}>
                      <span className={styles.cmdPrompt}>$</span>
                      <span className={styles.cmd}>
                        {lang === 'es'
                          ? 'Click para explorar el pipeline de seguridad'
                          : 'Click to explore the security pipeline'}
                      </span>
                    </div>
                    <div className={styles.pipeline}>
                      <span className={styles.stage}>SCAN ✓</span>
                      <span className={styles.pipeArrow}>──▶</span>
                      <span className={styles.stage}>SAST ✓</span>
                      <span className={styles.pipeArrow}>──▶</span>
                      <span className={styles.stage}>BUILD ✓</span>
                      <span className={styles.pipeArrow}>──▶</span>
                      <span className={styles.stage}>DAST ✓</span>
                    </div>
                    <div className={styles.techRow}>
                      {['Gitleaks', 'SonarCloud', 'Snyk', 'Trivy', 'ZAP', 'Docker', 'GHA'].map(tech => (
                        <span key={tech} className={styles.techPill}>{tech}</span>
                      ))}
                    </div>
                    <div className={styles.cta}>
                      {tr.exploreBtn}
                      <span className={styles.ctaArrow}>→</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

/* ── Trayectoria ───────────────────────────────────────────── */

function Trayectoria() {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <section className={styles.trayectoriaSection}>
      <div className="container">
        <div className={styles.trayectoriaHeader}>
          <h3 className={styles.trayectoriaTitle}>{tr.arcTitle}</h3>
          <p className={styles.trayectoriaIntro}>{tr.arcIntro}</p>
        </div>
        <div className={styles.trayectoriaGrid}>
          {tr.arc.map(item => (
            <div
              key={item.num}
              className={clsx(styles.trayectoriaCell, item.active && styles.trayectoriaCellActive)}
            >
              <span className={clsx(styles.trayectoriaNum, item.active && styles.trayectoriaNumActive)}>
                {item.num}
              </span>
              <div className={styles.trayectoriaPeriod}>{item.dates}</div>
              <div className={styles.trayectoriaRole}>{item.title}</div>
              <div className={styles.trayectoriaDesc}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Description blocks ────────────────────────────────────── */

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

function renderDescBlock(line, i) {
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

/* ── Timeline components ───────────────────────────────────── */

function ExperienceTimeline({ experiences, lang }) {
  return (
    <div className={styles.tlWrapper}>
      {experiences.map((exp, index) => {
        const desc = lang === 'es' && exp.description_es ? exp.description_es : exp.description;
        return (
          <div key={index} className={styles.tlEntry}>
            <div className={styles.tlDot} />
            <div className={styles.tlCard}>
              <div className={styles.tlHead}>
                <div>
                  <div className={styles.tlRole}>{exp.title}</div>
                  <div className={styles.tlCompany}>{exp.subtitle}</div>
                </div>
                <div className={styles.tlDate}>{exp.date}</div>
              </div>
              <div className={styles.tlBody}>
                {desc && desc.map((line, i) => renderDescBlock(line, i))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EducationTimeline({ education, lang }) {
  return (
    <div className={styles.tlWrapper}>
      {education.map((edu, index) => {
        const title = lang === 'es' && edu.title_es ? edu.title_es : edu.title;
        const subtitle = lang === 'es' && edu.subtitle_es ? edu.subtitle_es : edu.subtitle;
        return (
          <div key={index} className={styles.tlEntry}>
            <div className={styles.tlDot} />
            <div className={styles.tlCard}>
              <div className={styles.tlHead}>
                <div>
                  <div className={styles.tlRole}>{title}</div>
                  <div className={styles.tlCompany}>{subtitle}</div>
                </div>
                <div className={styles.tlDate}>{edu.date}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Experience ────────────────────────────────────────────── */

function Experience() {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <div id="experience" className={styles.experienceSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>
          <span className={styles.sectionLabelLine} aria-hidden="true" />
          {tr.sectionExpSub}
        </span>
        <h2>{tr.sectionExp}</h2>
      </div>
      <div className="container">
        <ExperienceTimeline experiences={projectData.experiences} lang={lang} />
      </div>
    </div>
  );
}

/* ── Education ─────────────────────────────────────────────── */

function Education() {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <div id="education" className={styles.experienceSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>
          <span className={styles.sectionLabelLine} aria-hidden="true" />
          {lang === 'es' ? 'FORMACIÓN ACADÉMICA' : 'ACADEMIC BACKGROUND'}
        </span>
        <h2>{tr.sectionEdu}</h2>
      </div>
      <div className="container">
        <EducationTimeline education={projectData.education} lang={lang} />
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="DevSecOps Engineer — Sheng Jun Ye · Security-first CI/CD">
      <HomepageHeader />
      <div className={styles.sectionDivider} />
      <main>
        <Trayectoria />
        <div className={styles.sectionDivider} />
        <Experience />
        <div className={styles.sectionDivider} />
        <Education />
      </main>
    </Layout>
  );
}
