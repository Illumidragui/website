import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '26a'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '372'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'f23'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '3c6'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '6e4'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '572'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '20f'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '0a2'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '670'),
    exact: true
  },
  {
    path: '/blog/devsecops-pipeline-overview',
    component: ComponentCreator('/blog/devsecops-pipeline-overview', 'c80'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '131'),
    exact: true
  },
  {
    path: '/blog/tags/cicd',
    component: ComponentCreator('/blog/tags/cicd', '6f9'),
    exact: true
  },
  {
    path: '/blog/tags/devsecops',
    component: ComponentCreator('/blog/tags/devsecops', '7c6'),
    exact: true
  },
  {
    path: '/blog/tags/gitleaks',
    component: ComponentCreator('/blog/tags/gitleaks', 'f8f'),
    exact: true
  },
  {
    path: '/blog/tags/owasp-zap',
    component: ComponentCreator('/blog/tags/owasp-zap', '8c9'),
    exact: true
  },
  {
    path: '/blog/tags/security',
    component: ComponentCreator('/blog/tags/security', 'e0f'),
    exact: true
  },
  {
    path: '/blog/tags/snyk',
    component: ComponentCreator('/blog/tags/snyk', '65b'),
    exact: true
  },
  {
    path: '/blog/tags/sonarcloud',
    component: ComponentCreator('/blog/tags/sonarcloud', 'e7a'),
    exact: true
  },
  {
    path: '/blog/tags/trivy',
    component: ComponentCreator('/blog/tags/trivy', '378'),
    exact: true
  },
  {
    path: '/infrastructure',
    component: ComponentCreator('/infrastructure', 'f2a'),
    exact: true
  },
  {
    path: '/portfolio',
    component: ComponentCreator('/portfolio', '404'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '68d'),
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
    component: ComponentCreator('/', '162'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
