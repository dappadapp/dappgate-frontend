/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['pbs.twimg.com'],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
        config.resolve.fallback.fs = false
        }
        return config
    },
}

module.exports = nextConfig
