const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false
      };
    }
    return config;
  }
};