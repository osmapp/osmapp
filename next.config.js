/* eslint-disable */
const packageJson = require('./package.json');
const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  //TODO fails with current webpack config. Probably needs to get rid of sentry? (@sentry/nextjs was not cool)
  // future: {
  //   webpack5: true,
  // },
  publicRuntimeConfig: {
    osmappVersion: packageJson.version.replace(/\.0$/, ''),
    commitHash: (process.env.VERCEL_GIT_COMMIT_SHA || '').substr(0, 7),
    commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || 'dev',
    languages: {
      de: 'Deutsch',
      cs: 'Česky',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      it: 'Italiano',
      pl: 'Polski',
      am: 'አማርኛ',
    },
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.devtool = 'source-map';
      for (const plugin of config.optimization.minimizer) {
        if (plugin.constructor.name === 'TerserPlugin') {
          plugin.options.sourceMap = true;
          break;
        }
      }
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...(isServer ? {} : { '@sentry/node': '@sentry/browser' }),
    };

    return config;
  },
});
