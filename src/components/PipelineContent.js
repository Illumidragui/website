import React from 'react';
import { useLang } from '@site/src/context/LangContext';
import PipelineEn from '@site/src/content/en/pipeline.mdx';
import PipelineEs from '@site/src/content/es/pipeline.mdx';

export default function PipelineContent() {
  const { lang } = useLang();
  return lang === 'es' ? <PipelineEs /> : <PipelineEn />;
}
