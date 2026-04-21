import React from 'react';
import { useLang } from '@site/src/context/LangContext';
import styles from './NavbarLangToggle.module.css';

export default function NavbarLangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className={styles.toggle}>
      <span
        className={lang === 'es' ? styles.active : styles.inactive}
        onClick={() => setLang('es')}
      >ES</span>
      <span className={styles.sep}>/</span>
      <span
        className={lang === 'en' ? styles.active : styles.inactive}
        onClick={() => setLang('en')}
      >EN</span>
    </div>
  );
}
