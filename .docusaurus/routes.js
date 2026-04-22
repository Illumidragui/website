import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '1da'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '138'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'f35'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '754'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', 'fc4'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', 'dd6'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '9a9'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '411'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '421'),
    exact: true
  },
  {
    path: '/blog/devsecops-pipeline-overview',
    component: ComponentCreator('/blog/devsecops-pipeline-overview', 'e8e'),
    exact: true
  },
  {
    path: '/blog/kuberlab-personal-devops-lab',
    component: ComponentCreator('/blog/kuberlab-personal-devops-lab', '383'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '844'),
    exact: true
  },
  {
    path: '/blog/tags/argocd',
    component: ComponentCreator('/blog/tags/argocd', 'eae'),
    exact: true
  },
  {
    path: '/blog/tags/aws',
    component: ComponentCreator('/blog/tags/aws', '4bb'),
    exact: true
  },
  {
    path: '/blog/tags/cicd',
    component: ComponentCreator('/blog/tags/cicd', '830'),
    exact: true
  },
  {
    path: '/blog/tags/devops',
    component: ComponentCreator('/blog/tags/devops', '437'),
    exact: true
  },
  {
    path: '/blog/tags/devsecops',
    component: ComponentCreator('/blog/tags/devsecops', 'b00'),
    exact: true
  },
  {
    path: '/blog/tags/gitleaks',
    component: ComponentCreator('/blog/tags/gitleaks', '3b7'),
    exact: true
  },
  {
    path: '/blog/tags/gitops',
    component: ComponentCreator('/blog/tags/gitops', '1b9'),
    exact: true
  },
  {
    path: '/blog/tags/helm',
    component: ComponentCreator('/blog/tags/helm', 'c39'),
    exact: true
  },
  {
    path: '/blog/tags/k-3-s',
    component: ComponentCreator('/blog/tags/k-3-s', 'c77'),
    exact: true
  },
  {
    path: '/blog/tags/kubernetes',
    component: ComponentCreator('/blog/tags/kubernetes', 'b03'),
    exact: true
  },
  {
    path: '/blog/tags/owasp-zap',
    component: ComponentCreator('/blog/tags/owasp-zap', 'c54'),
    exact: true
  },
  {
    path: '/blog/tags/security',
    component: ComponentCreator('/blog/tags/security', '689'),
    exact: true
  },
  {
    path: '/blog/tags/snyk',
    component: ComponentCreator('/blog/tags/snyk', '748'),
    exact: true
  },
  {
    path: '/blog/tags/sonarcloud',
    component: ComponentCreator('/blog/tags/sonarcloud', '426'),
    exact: true
  },
  {
    path: '/blog/tags/tailscale',
    component: ComponentCreator('/blog/tags/tailscale', 'b8c'),
    exact: true
  },
  {
    path: '/blog/tags/terraform',
    component: ComponentCreator('/blog/tags/terraform', '678'),
    exact: true
  },
  {
    path: '/blog/tags/trivy',
    component: ComponentCreator('/blog/tags/trivy', '599'),
    exact: true
  },
  {
    path: '/infrastructure',
    component: ComponentCreator('/infrastructure', 'd18'),
    exact: true
  },
  {
    path: '/portfolio',
    component: ComponentCreator('/portfolio', '6df'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '81b'),
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
    component: ComponentCreator('/', 'c88'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
