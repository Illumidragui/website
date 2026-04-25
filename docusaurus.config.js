// @ts-check

const dockerImageTag = process.env.DOCKER_IMAGE_TAG || 'latest';
const urlvar = process.env.DOCUSAURUS_CONF_URL || 'http://localhost:3000';

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
          customCss: require.resolve('./src/styles/custom.css'),
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
        title: '~/whoami',
        logo: {
          alt: 'Shield Logo',
          src: 'img/shield.svg',
        },
        items: [
          {
            to: '/infrastructure',
            label: 'How this site is built',
            position: 'left',
          },
          {
            to: '/portfolio',
            label: 'Portfolio',
            position: 'left',
          },
          { to: '/blog', label: 'Security Blog', position: 'left' },
          {
            type: 'custom-langToggle',
            position: 'right',
          },
          {
            href: 'https://github.com/Illumidragui ',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `© ${new Date().getFullYear()} ShengSite | Built with Docusaurus`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
