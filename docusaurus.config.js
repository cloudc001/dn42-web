const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'CLOUDC-DN42',
  tagline: 'ASN4242423777',
  url: 'https://dn42.cloudc.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'cloudc001', // Usually your GitHub org/user name.
  projectName: 'dn42-web', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          //editUrl: 'https://github.com/facebook/docusaurus/edit/main/website/',  //编辑此页按钮
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
      },
      navbar: {
        title: 'CloudC DN42',
        logo: {
          alt: 'CloudC EdLab Network',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'peer',
            position: 'left',
            label: 'Peer',
          },
          {to: '/#nodes', label: 'Nodes', position: 'left'},
          {to: '/#peering', label: 'Peering', position: 'left'},
          {href: 'https://lg.dn42.cloudc.dev', label: 'Looking glass', position: 'left'},
          {href: 'https://grafana.dn42.cloudc.dev', label: 'Grafana', position: 'left'},
          //{
          //  href: 'https://github.com/facebook/docusaurus',
          //  label: 'GitHub',
          //  position: 'right',
          //},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'NETWORK',
            items: [
              {
                label: 'Peering details',
                to: '/docs/peer',
              },
            ],
          },
          {
            title: 'Contact',
            items: [
              {
                label: 'Telegram',
                href: 'https://cloudc001.t.me',
              },
              {
                label: 'Email',
                href: 'mailto:cloud001@outlook.com',
              },
              //{
              //  label: 'Twitter',
              //  href: 'https://twitter.com/docusaurus',
              //},
            ],
          },
          {
            title: 'TOOLS',
            items: [
              {
                label: 'Looking glass',
                href: 'https://lg.dn42.cloudc.dev',
              },
              {
                label: 'Service status',
                href: 'https://status.cloudc.dev',
              },
              //{
              //  label: 'GitHub',
              //  href: 'https://github.com/facebook/docusaurus',
              //},
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
