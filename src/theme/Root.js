import React from 'react';
import { LangProvider } from '@site/src/context/LangContext';

export default function Root({ children }) {
  return <LangProvider>{children}</LangProvider>;
}
