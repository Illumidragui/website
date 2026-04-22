// @ts-check

const dockerImageTag = process.env.DOCKER_IMAGE_TAG || 'latest';
const urlvar = process.env.DOCUSAURUS_CONF_URL || 'http://localhost:80';

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sheng Jun Ye',
  tagline: 'DevSecOps Engineer · Security-first desde el código',
  favicon: 'img/favicon.ico',

  url: urlvar,
  baseUrl: '/',
  organizationName: 'Illumidragui',
  projectName: 'devsecops-pipeline',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/shield.svg',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: '~/Illumidragui',
        logo: {
          alt: 'Shield Logo',
          src: 'img/shield.svg',
        },
        items: [
          {
            to: '/portfolio',
            label: 'Portfolio',
            position: 'left',
          },
          {
            to: '/infrastructure',
            label: 'Infrastructure',
            position: 'left',
          },
          { to: '/blog', label: 'Security Blog', position: 'left' },
          {
            type: 'custom-langToggle',
            position: 'right',
          },
          {
            href: 'https://github.com/Illumidragui/devsecops-pipeline',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Navegación',
            items: [
              { label: 'Experiencia', href: '/#experience' },
              { label: 'Security Blog', to: '/blog' },
            ],
          },
          {
            title: 'Security Tools',
            items: [
              { label: 'Gitleaks', href: 'https://github.com/gitleaks/gitleaks' },
              { label: 'OWASP ZAP', href: 'https://www.zaproxy.org' },
              { label: 'Trivy', href: 'https://aquasecurity.github.io/trivy' },
              { label: 'SonarCloud', href: 'https://sonarcloud.io' },
              { label: 'Snyk', href: 'https://snyk.io' },
            ],
          },
          {
            title: 'Contacto',
            items: [
              { label: 'GitHub', href: 'https://github.com/Illumidragui' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/shjye' },
            ],
          },
        ],
        copyright: `Docker Image Tag: ${dockerImageTag} — © ${new Date().getFullYear()} Sheng Jun Ye. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
