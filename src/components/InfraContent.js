import React from 'react';
import { useLang } from '@site/src/context/LangContext';
import InfraEn from '@site/src/content/en/infra.mdx';
import InfraEs from '@site/src/content/es/infra.mdx';

export default function InfraContent() {
  const { lang } = useLang();
  return lang === 'es' ? <InfraEs /> : <InfraEn />;
}
