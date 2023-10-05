/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["pbs.twimg.com", "raw.githubusercontent.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },

  async redirects() {
    return [
      {
        source: '/apps/aggre',
        destination: 'https://aggre.io',
        permanent: true,
      },
      {
        source: '/apps/tracker',
        destination: 'https://tracker.dappgate.io',
        permanent: true,
      },
      {
        source: '/apps/dappad',
        destination: 'https://app.dappad.app',
        permanent: true,
      }
    ]
  },
};

module.exports = nextConfig;
