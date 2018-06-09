const siteConfig = {
  title: 'Saasless',
  tagline: 'scalable JavaScript solutions for Node.js, React, Angular and Vue',
  disableHeaderTitle: true,
  url: 'https://saasless.io',
  baseUrl: '/',

  projectName: 'saasless',
  organizationName: 'saasless',

  headerLinks: [
    { doc: 'doc1', label: 'Docs' },
    { page: 'help', label: 'Demos' },
    { blog: true, label: 'Blog' },
  ],

  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/favicon.png',

  colors: {
    primaryColor: '#1c384e',
    secondaryColor: '#002028',
  },

  stylesheets: [ 'https://fonts.googleapis.com/css?family=Sunflower:300,500,700' ],

  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Saasless',

  highlight: {
    theme: 'default',
  },

  scripts: ['https://buttons.github.io/buttons.js'],

  onPageNav: 'separate',

  ogImage: 'img/logo.png',
  twitterImage: 'img/logo.png',
};

module.exports = siteConfig;
