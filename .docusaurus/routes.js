import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'db5'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '9c9'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '232'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '878'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', 'd07'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '9bd'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '5d1'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '1b8'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '023'),
    exact: true
  },
  {
    path: '/blog/devsecops-pipeline-overview',
    component: ComponentCreator('/blog/devsecops-pipeline-overview', 'bfe'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '6a9'),
    exact: true
  },
  {
    path: '/blog/tags/cicd',
    component: ComponentCreator('/blog/tags/cicd', '42b'),
    exact: true
  },
  {
    path: '/blog/tags/devsecops',
    component: ComponentCreator('/blog/tags/devsecops', '204'),
    exact: true
  },
  {
    path: '/blog/tags/gitleaks',
    component: ComponentCreator('/blog/tags/gitleaks', 'cbc'),
    exact: true
  },
  {
    path: '/blog/tags/owasp-zap',
    component: ComponentCreator('/blog/tags/owasp-zap', 'c37'),
    exact: true
  },
  {
    path: '/blog/tags/security',
    component: ComponentCreator('/blog/tags/security', '443'),
    exact: true
  },
  {
    path: '/blog/tags/snyk',
    component: ComponentCreator('/blog/tags/snyk', 'bd4'),
    exact: true
  },
  {
    path: '/blog/tags/sonarcloud',
    component: ComponentCreator('/blog/tags/sonarcloud', '601'),
    exact: true
  },
  {
    path: '/blog/tags/trivy',
    component: ComponentCreator('/blog/tags/trivy', 'd96'),
    exact: true
  },
  {
    path: '/infrastructure',
    component: ComponentCreator('/infrastructure', 'df6'),
    exact: true
  },
  {
    path: '/portfolio',
    component: ComponentCreator('/portfolio', '363'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '110'),
    routes: [
      {
        path: '/docs/pipeline',
        component: ComponentCreator('/docs/pipeline', '37d'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'a3d'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
