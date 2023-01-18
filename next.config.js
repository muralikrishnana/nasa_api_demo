/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  async headers() {
    return [
      {
        source: '/apod',
        headers: [
          {
            key: 'Set-Cookie',
            value: 'cross-site-cookie=whatever; SameSite=None; Secure',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
